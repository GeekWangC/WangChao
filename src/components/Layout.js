import React from 'react'
import { Link } from 'gatsby'
import WorkCountdown from './WorkCountdown'
import '../styles/global.css'

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        <nav className="nav">
          <Link to="/" className="nav-link">首页</Link>
          <Link to="/blog" className="nav-link">博客</Link>
          <Link to="/fishpond" className="nav-link">鱼塘</Link>
          <Link to="/interview-guide" className="nav-link">面试宝典</Link>
          <Link to="/write" className="nav-link">写文章</Link>
          <Link to="/profile" className="nav-link">关于</Link>
        </nav>
      </header>

      <main className="main">
        {children}
      </main>

      <WorkCountdown />

      <footer className="footer">
        <p>© {new Date().getFullYear()} My Personal Site. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Layout 