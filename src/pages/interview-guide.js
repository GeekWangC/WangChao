import React, { useState, useEffect } from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import '../styles/interview-guide.css'

const InterviewGuide = ({ data }) => {
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedSubtopic, setSelectedSubtopic] = useState(null)
  const [expandedTopics, setExpandedTopics] = useState(new Set())
  const [showScrollButton, setShowScrollButton] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setShowScrollButton(scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // 将 markdown 文件按主题分类
  const allContent = data.allMarkdownRemark.nodes
  const topics = [
    {
      id: 1,
      title: 'JavaScript基础',
      path: 'javascript',
      subtopics: [
        {
          title: '变量和数据类型',
          content: allContent.find(node => node.frontmatter.title === "变量和数据类型")
        },
        {
          title: '作用域和闭包',
          content: allContent.find(node => node.frontmatter.title === "作用域和闭包")
        },
        {
          title: '原型和继承',
          content: null
        },
        {
          title: '异步编程',
          content: null
        }
      ]
    },
    {
      id: 2,
      title: 'React核心',
      path: 'react',
      subtopics: [
        {
          title: '组件和Props',
          content: null
        },
        {
          title: 'Hooks使用',
          content: null
        },
        {
          title: '状态管理',
          content: null
        },
        {
          title: '性能优化',
          content: null
        }
      ]
    },
    {
      id: 3,
      title: '计算机网络',
      path: 'network',
      subtopics: [
        {
          title: 'HTTP协议',
          content: null
        },
        {
          title: 'TCP/IP',
          content: null
        },
        {
          title: 'WebSocket',
          content: null
        },
        {
          title: '网络安全',
          content: null
        }
      ]
    }
  ]

  const handleTopicClick = (topic) => {
    setExpandedTopics(prev => {
      const newSet = new Set(prev)
      if (newSet.has(topic.id)) {
        newSet.delete(topic.id)
      } else {
        newSet.add(topic.id)
      }
      return newSet
    })
  }

  const handleSubtopicClick = (topic, subtopic) => {
    setSelectedTopic(topic)
    setSelectedSubtopic(subtopic)
  }

  // 获取上一篇和下一篇文章
  const getNavigation = () => {
    if (!selectedSubtopic || !selectedTopic) return {}

    let allSubtopics = []
    topics.forEach(topic => {
      topic.subtopics.forEach(subtopic => {
        if (subtopic.content) {
          allSubtopics.push({ topic, subtopic })
        }
      })
    })

    const currentIndex = allSubtopics.findIndex(
      item => 
        item.subtopic.title === selectedSubtopic.title &&
        item.topic.id === selectedTopic.id
    )

    return {
      prev: currentIndex > 0 ? allSubtopics[currentIndex - 1] : null,
      next: currentIndex < allSubtopics.length - 1 ? allSubtopics[currentIndex + 1] : null
    }
  }

  const navigation = getNavigation()

  return (
    <Layout>
      <div className="interview-guide-container">
        {/* 左侧目录 */}
        <div className="sidebar">
          <h2>学习目录</h2>
          <nav className="topic-list">
            {topics.map(topic => (
              <div key={topic.id} className="topic-item">
                <h3 
                  onClick={() => handleTopicClick(topic)}
                  className={expandedTopics.has(topic.id) ? 'expanded' : ''}
                >
                  {topic.title}
                </h3>
                {expandedTopics.has(topic.id) && (
                  <ul className="subtopic-list">
                    {topic.subtopics.map((subtopic, index) => (
                      <li 
                        key={index}
                        onClick={() => handleSubtopicClick(topic, subtopic)}
                        className={selectedSubtopic?.title === subtopic.title ? 'active' : ''}
                      >
                        {subtopic.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* 右侧内容区 */}
        <div className="content-area">
          {selectedSubtopic ? (
            <div className="markdown-content">
              <h1>{selectedSubtopic.title}</h1>
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: selectedSubtopic.content ? 
                    selectedSubtopic.content.html : 
                    '<p>内容正在编写中...</p>' 
                }}
                className="content"
              />
              
              {/* 上一篇/下一篇导航 */}
              <div className="section-navigation">
                {navigation.prev && (
                  <button 
                    className="nav-button prev"
                    onClick={() => handleSubtopicClick(
                      navigation.prev.topic,
                      navigation.prev.subtopic
                    )}
                  >
                    ← {navigation.prev.topic.title} - {navigation.prev.subtopic.title}
                  </button>
                )}
                {navigation.next && (
                  <button 
                    className="nav-button next"
                    onClick={() => handleSubtopicClick(
                      navigation.next.topic,
                      navigation.next.subtopic
                    )}
                  >
                    {navigation.next.topic.title} - {navigation.next.subtopic.title} →
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="welcome-message">
              <h1>欢迎使用面试宝典</h1>
              <p>请从左侧选择一个主题开始学习</p>
            </div>
          )}
        </div>
      </div>
      <button 
        className={`scroll-to-top ${showScrollButton ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="回到顶部"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>
    </Layout>
  )
}

// GraphQL 查询
export const query = graphql`
  query {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/interview/" } }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        id
        html
        frontmatter {
          title
          date(formatString: "YYYY-MM-DD")
          tags
          description
        }
        parent {
          ... on File {
            relativeDirectory
          }
        }
      }
    }
  }
`

export default InterviewGuide 