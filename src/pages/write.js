import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/Layout'
import '../styles/global.css'

const WritePage = () => {
  return (
    <Layout>
      <div className="container">
        <section className="write-section">
          <h1>写文章</h1>
          <div className="cms-intro">
            <p>我们使用可视化编辑器来管理博客文章。点击下面的按钮进入管理界面：</p>
            <Link to="/admin" className="cms-button">
              进入内容管理系统
            </Link>
          </div>
          <div className="cms-features">
            <h2>功能特点</h2>
            <ul>
              <li>可视化的 Markdown 编辑器</li>
              <li>实时预览</li>
              <li>图片上传和管理</li>
              <li>版本管理</li>
              <li>草稿保存功能</li>
            </ul>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default WritePage 