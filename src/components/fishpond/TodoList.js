import React, { useState, useEffect } from 'react';
import '../../styles/fishpond.css';
import { motion, AnimatePresence } from 'framer-motion';

const PRIORITIES = {
  low: { label: '低', color: '#4caf50' },
  medium: { label: '中', color: '#ff9800' },
  high: { label: '高', color: '#f44336' }
};

const TodoList = ({ viewMode, onViewModeChange }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    priority: 'medium'
  });
  const [editingTodo, setEditingTodo] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('month');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos]);

  const handleInputChange = (e, todo = null) => {
    const { name, value } = e.target;
    if (todo) {
      setEditingTodo({ ...todo, [name]: value });
    } else {
      setNewTodo({ ...newTodo, [name]: value });
    }
  };

  const addTodo = () => {
    if (!newTodo.title.trim()) return;
    
    const todo = {
      id: Date.now(),
      ...newTodo,
      completed: false,
      createdAt: new Date()
    };
    
    setTodos([...todos, todo]);
    setNewTodo({
      title: '',
      description: '',
      startDate: '',
      priority: 'medium'
    });
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (todo) => {
    setEditingTodo(todo);
  };

  const saveEdit = () => {
    if (!editingTodo.title.trim()) return;
    
    setTodos(todos.map(todo =>
      todo.id === editingTodo.id ? editingTodo : todo
    ));
    setEditingTodo(null);
  };

  const cancelEdit = () => {
    setEditingTodo(null);
  };

  const renderTodoForm = () => (
    <AnimatePresence>
      {showAddForm && (
        <motion.div
          className="todo-form-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target.className === 'todo-form-overlay') {
              setShowAddForm(false);
            }
          }}
        >
          <motion.div
            className="todo-form modal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="form-header">
              <h2>添加待办</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddForm(false)}
              >
                ×
              </button>
            </div>
            <div className="form-group">
              <input
                type="text"
                className="todo-input"
                placeholder="标题"
                name="title"
                value={newTodo.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <textarea
                className="todo-textarea"
                placeholder="描述"
                name="description"
                value={newTodo.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <input
                type="date"
                className="todo-date"
                name="startDate"
                value={newTodo.startDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <select
                className="todo-priority"
                name="priority"
                value={newTodo.priority}
                onChange={handleInputChange}
              >
                {Object.entries(PRIORITIES).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}优先级
                  </option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button 
                className="todo-cancel-btn" 
                onClick={() => setShowAddForm(false)}
              >
                取消
              </button>
              <button 
                className="todo-add-btn" 
                onClick={() => {
                  addTodo();
                  setShowAddForm(false);
                }}
              >
                添加待办
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderListView = () => (
    <motion.div
      className="todo-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {todos.map(todo => (
        <motion.div
          key={todo.id}
          className="todo-item"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          {editingTodo?.id === todo.id ? (
            <div className="todo-edit">
              <input
                type="text"
                className="todo-edit-input"
                name="title"
                value={editingTodo.title}
                onChange={(e) => handleInputChange(e, editingTodo)}
              />
              <textarea
                className="todo-edit-input"
                name="description"
                value={editingTodo.description}
                onChange={(e) => handleInputChange(e, editingTodo)}
              />
              <input
                type="date"
                className="todo-edit-input"
                name="startDate"
                value={editingTodo.startDate}
                onChange={(e) => handleInputChange(e, editingTodo)}
              />
              <select
                className="todo-edit-input"
                name="priority"
                value={editingTodo.priority}
                onChange={(e) => handleInputChange(e, editingTodo)}
              >
                {Object.entries(PRIORITIES).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}优先级
                  </option>
                ))}
              </select>
              <div className="todo-actions">
                <button className="todo-save-btn" onClick={saveEdit}>
                  保存
                </button>
                <button className="todo-cancel-btn" onClick={cancelEdit}>
                  取消
                </button>
              </div>
            </div>
          ) : (
            <>
              <input
                type="checkbox"
                className="todo-checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <div className="todo-content">
                <h3 className={`todo-title ${todo.completed ? 'completed' : ''}`}>
                  {todo.title}
                </h3>
                <p className="todo-description">{todo.description}</p>
                <div className="todo-meta">
                  <span className="todo-date">{todo.startDate}</span>
                  <span
                    className="todo-priority-tag"
                    style={{ backgroundColor: PRIORITIES[todo.priority].color }}
                  >
                    {PRIORITIES[todo.priority].label}优先级
                  </span>
                </div>
              </div>
              <div className="todo-actions">
                <button
                  className="todo-edit-btn"
                  onClick={() => startEditing(todo)}
                >
                  编辑
                </button>
                <button
                  className="todo-delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                >
                  删除
                </button>
              </div>
            </>
          )}
        </motion.div>
      ))}
    </motion.div>
  );

  const renderMonthView = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const today = new Date();

    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const days = [];

    // Get last month's days that show in current month's view
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    const prevMonthStart = prevMonthDays - startingDay + 1;

    // Calculate total cells needed (previous month + current month + next month)
    const totalDays = Math.ceil((startingDay + daysInMonth) / 7) * 7;

    let dayCount = 1;
    let nextMonthDay = 1;

    for (let i = 0; i < totalDays; i++) {
      if (i < startingDay) {
        // Previous month days
        const prevDay = prevMonthStart + i;
        days.push(
          <div key={`prev-${prevDay}`} className="calendar-day">
            <span className="day-number different-month">{prevDay}</span>
          </div>
        );
      } else if (dayCount <= daysInMonth) {
        // Current month days
        const currentDate = new Date(year, month, dayCount);
        const isToday = 
          currentDate.getDate() === today.getDate() &&
          currentDate.getMonth() === today.getMonth() &&
          currentDate.getFullYear() === today.getFullYear();

        const dayTodos = todos.filter(todo => {
          const todoDate = new Date(todo.startDate);
          return (
            todoDate.getFullYear() === currentDate.getFullYear() &&
            todoDate.getMonth() === currentDate.getMonth() &&
            todoDate.getDate() === currentDate.getDate()
          );
        });

        days.push(
          <div key={dayCount} className="calendar-day">
            <span className={`day-number ${isToday ? 'today' : ''}`}>
              {dayCount}
            </span>
            <div className="day-todos">
              {dayTodos.map(todo => (
                <div
                  key={todo.id}
                  className="calendar-todo-item"
                  style={{ borderLeftColor: PRIORITIES[todo.priority].color }}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span style={{ 
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#999' : '#666'
                  }}>
                    {todo.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
        dayCount++;
      } else {
        // Next month days
        days.push(
          <div key={`next-${nextMonthDay}`} className="calendar-day">
            <span className="day-number different-month">{nextMonthDay}</span>
          </div>
        );
        nextMonthDay++;
      }
    }

    return (
      <div className="calendar-month">
        <div className="calendar-header">
          <button onClick={() => setCalendarDate(new Date(year, month - 1))}>
            上个月
          </button>
          <h2>{`${year}年${month + 1}月`}</h2>
          <button onClick={() => setCalendarDate(new Date(year, month + 1))}>
            下个月
          </button>
        </div>
        <div className="calendar-grid">
          {weekdays.map(day => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  const renderYearView = () => {
    const year = calendarDate.getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => i);

    return (
      <div className="calendar-year">
        <div className="calendar-header">
          <button onClick={() => setCalendarDate(new Date(calendarDate.setFullYear(calendarDate.getFullYear() - 1)))}>
            上一年
          </button>
          <h2>{`${year}年`}</h2>
          <button onClick={() => setCalendarDate(new Date(calendarDate.setFullYear(calendarDate.getFullYear() + 1)))}>
            下一年
          </button>
        </div>
        <div className="year-grid">
          {months.map(month => {
            const monthTodos = todos.filter(todo => {
              const todoDate = new Date(todo.startDate);
              return (
                todoDate.getFullYear() === year &&
                todoDate.getMonth() === month
              );
            });

            return (
              <div key={month} className="year-month">
                <h3>{`${month + 1}月`}</h3>
                <div className="month-todos">
                  {monthTodos.map(todo => (
                    <div
                      key={todo.id}
                      className="year-todo-item"
                      style={{ borderLeftColor: PRIORITIES[todo.priority].color }}
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                      />
                      <span>{todo.title}</span>
                      <span className="todo-date">{todo.startDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h1>每日待办</h1>
        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewModeChange('list')}
          >
            列表视图
          </button>
          <button
            className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => onViewModeChange('calendar')}
          >
            日历视图
          </button>
        </div>
      </div>
      {viewMode === 'list' ? (
        renderListView()
      ) : (
        <div className="calendar-container">
          <div className="calendar-view-toggle">
            <button
              className={calendarView === 'month' ? 'active' : ''}
              onClick={() => setCalendarView('month')}
            >
              月视图
            </button>
            <button
              className={calendarView === 'year' ? 'active' : ''}
              onClick={() => setCalendarView('year')}
            >
              年视图
            </button>
          </div>
          {calendarView === 'month' ? renderMonthView() : renderYearView()}
        </div>
      )}
      <button
        className="floating-add-btn"
        onClick={() => setShowAddForm(true)}
      >
        +
      </button>
      {renderTodoForm()}
    </div>
  );
};

export default TodoList; 