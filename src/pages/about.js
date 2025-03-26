import React from 'react'
import Layout from '../components/Layout'
import '../styles/global.css'

const AboutPage = () => {
  return (
    <Layout>
      <div className="container">
        <section className="about-section">
          <h1>About Me</h1>
          <div className="about-content">
            <div className="profile">
              <img
                src="https://via.placeholder.com/200"
                alt="Profile"
                className="profile-image"
              />
            </div>
            <div className="bio">
              <h2>王超</h2>
              <p>
                一个热爱技术、热爱生活的程序员。
              </p>
              <div className="skills">
                <h3>Skills</h3>
                <ul>
                  <li>Web Development (React, Gatsby, Node.js)</li>
                  <li>UI/UX Design</li>
                  <li>Content Management Systems</li>
                  <li>Technical Writing</li>
                </ul>
              </div>
              <div className="contact">
                <h3>Get in Touch</h3>
                <p>
                  Feel free to reach out to me at{' '}
                  <a href="mailto:your.email@example.com">your.email@example.com</a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default AboutPage 