import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import '../styles/global.css'

const BlogPost = ({ data }) => {
  const post = data.markdownRemark

  return (
    <Layout>
      <article className="blog-post">
        <div className="container">
          <header className="post-header">
            <h1>{post.frontmatter.title}</h1>
            <p className="post-date">{post.frontmatter.date}</p>
          </header>

          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
      </article>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`

export default BlogPost 