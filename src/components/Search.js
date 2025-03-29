import React, { useState } from 'react'
import { Link } from 'gatsby'
import '../styles/global.css'

const Search = ({ posts }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTags, setSelectedTags] = useState([])

  // 获取所有分类和标签
  const categories = ['all', ...new Set(posts.map(post => post.frontmatter?.category))]
  const allTags = [...new Set(posts.flatMap(post => post.frontmatter?.tags || []))]

  // 过滤文章
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.frontmatter?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.frontmatter?.description || post.excerpt)?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.frontmatter?.category === selectedCategory
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => post.frontmatter?.tags?.includes(tag))
    
    return matchesSearch && matchesCategory && matchesTags
  })

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <div className="search-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="搜索文章..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-container">
        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? '所有分类' : category}
              </option>
            ))}
          </select>
        </div>

        <div className="tags-filter">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`tag-button ${selectedTags.includes(tag) ? 'active' : ''}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="search-results">
        {filteredPosts.map(post => (
          <div key={post.id} className="search-result-item">
            <div className="result-content">
              <div className="result-text">
                <Link to={post.fields.slug}>
                  <h3>{post.frontmatter?.title}</h3>
                </Link>
                <p>{post.frontmatter?.description || post.excerpt}</p>
                <div className="post-meta">
                  <span className="category">{post.frontmatter?.category}</span>
                  <div className="tags">
                    {post.frontmatter?.tags?.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              {post.frontmatter?.thumbnail?.publicURL && (
                <div className="result-image">
                  <img
                    src={post.frontmatter?.thumbnail?.publicURL}
                    alt={post.frontmatter?.title}
                    className="thumbnail"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Search 