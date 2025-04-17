import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import '../../styles/diary.css';

const MOODS = [
  { id: 'happy', emoji: '😊', label: '开心' },
  { id: 'sad', emoji: '😢', label: '难过' },
  { id: 'angry', emoji: '😠', label: '生气' },
  { id: 'excited', emoji: '🤩', label: '兴奋' },
  { id: 'tired', emoji: '😪', label: '疲惫' },
  { id: 'normal', emoji: '😐', label: '一般' }
];

const WEATHER = [
  { id: 'sunny', emoji: '☀️', label: '晴天' },
  { id: 'cloudy', emoji: '☁️', label: '多云' },
  { id: 'rainy', emoji: '🌧️', label: '下雨' },
  { id: 'snowy', emoji: '🌨️', label: '下雪' },
  { id: 'windy', emoji: '🌪️', label: '大风' },
  { id: 'foggy', emoji: '🌫️', label: '雾天' }
];

const DiaryEditor = ({ diary, onSave, onCancel }) => {
  const [title, setTitle] = useState(diary?.title || '');
  const [content, setContent] = useState(diary?.content || '');
  const [mood, setMood] = useState(diary?.mood || 'normal');
  const [weather, setWeather] = useState(diary?.weather || 'sunny');
  const [tags, setTags] = useState(diary?.tags || []);
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const date = diary?.date || new Date().toISOString();
    onSave({
      id: diary?.id || Date.now(),
      title,
      content,
      mood,
      weather,
      tags,
      date,
      lastModified: new Date().toISOString()
    });
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <motion.form
      className="diary-editor"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="diary-title"
        placeholder="日记标题..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <div className="diary-metadata">
        <div className="mood-selector">
          <span className="selector-label">心情：</span>
          {MOODS.map(({ id, emoji, label }) => (
            <button
              key={id}
              type="button"
              className={`mood-button ${mood === id ? 'active' : ''}`}
              onClick={() => setMood(id)}
              title={label}
            >
              {emoji}
            </button>
          ))}
        </div>

        <div className="weather-selector">
          <span className="selector-label">天气：</span>
          {WEATHER.map(({ id, emoji, label }) => (
            <button
              key={id}
              type="button"
              className={`weather-button ${weather === id ? 'active' : ''}`}
              onClick={() => setWeather(id)}
              title={label}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="tags-input">
        <div className="tags-container">
          {tags.map(tag => (
            <span key={tag} className="tag">
              #{tag}
              <button type="button" onClick={() => removeTag(tag)}>×</button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="输入标签后按回车添加..."
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
        />
      </div>

      <textarea
        className="diary-content"
        placeholder="写下今天的故事..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      <div className="markdown-preview">
        <h3>预览</h3>
        <div className="preview-content">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>

      <div className="editor-actions">
        <button type="button" className="cancel-button" onClick={onCancel}>
          取消
        </button>
        <button type="submit" className="save-button">
          保存
        </button>
      </div>
    </motion.form>
  );
};

const DiaryList = ({ diaries, onEdit, onDelete, searchQuery }) => {
  const filteredDiaries = diaries.filter(diary => 
    diary.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    diary.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    diary.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="diary-list">
      {filteredDiaries.map(diary => (
        <motion.div
          key={diary.id}
          className="diary-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          layout
        >
          <div className="diary-card-header">
            <h3>{diary.title}</h3>
            <div className="diary-indicators">
              {MOODS.find(m => m.id === diary.mood)?.emoji}
              {WEATHER.find(w => w.id === diary.weather)?.emoji}
            </div>
          </div>

          <div className="diary-date">
            {new Date(diary.date).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>

          <div className="diary-tags">
            {diary.tags.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>

          <div className="diary-preview">
            <ReactMarkdown>{diary.content.slice(0, 200)}...</ReactMarkdown>
          </div>

          <div className="diary-actions">
            <button onClick={() => onEdit(diary)}>编辑</button>
            <button onClick={() => onDelete(diary.id)}>删除</button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const Diary = () => {
  const [diaries, setDiaries] = useState([]);
  const [editingDiary, setEditingDiary] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 从localStorage加载日记
  useEffect(() => {
    const savedDiaries = localStorage.getItem('diaries');
    if (savedDiaries) {
      setDiaries(JSON.parse(savedDiaries));
    }
  }, []);

  // 保存日记到localStorage
  useEffect(() => {
    localStorage.setItem('diaries', JSON.stringify(diaries));
  }, [diaries]);

  const handleSave = (diary) => {
    if (editingDiary) {
      setDiaries(diaries.map(d => d.id === diary.id ? diary : d));
    } else {
      setDiaries([diary, ...diaries]);
    }
    setEditingDiary(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('确定要删除这篇日记吗？')) {
      setDiaries(diaries.filter(d => d.id !== id));
    }
  };

  return (
    <div className="diary-container">
      <div className="diary-header">
        <h2>我的日记本</h2>
        <div className="diary-controls">
          <input
            type="text"
            className="search-input"
            placeholder="搜索日记..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="new-diary-button"
            onClick={() => setEditingDiary({})}
          >
            写新日记
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {editingDiary ? (
          <DiaryEditor
            key="editor"
            diary={editingDiary}
            onSave={handleSave}
            onCancel={() => setEditingDiary(null)}
          />
        ) : (
          <DiaryList
            key="list"
            diaries={diaries}
            onEdit={setEditingDiary}
            onDelete={handleDelete}
            searchQuery={searchQuery}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Diary; 