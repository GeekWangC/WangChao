import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout'
import '../styles/global.css'

const BlogPage = ({ data }) => {
  const posts = data.allMarkdownRemark.edges

  return (
    <Layout>
      <div className="container">
        <section className="blog-list">
          <h1>Blog Posts</h1>
          <div className="posts-grid">
            {posts.map(({ node }) => (
              <article key={node.id} className="post-card">
                <h2>
                  <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
                </h2>
                <p className="post-date">{node.frontmatter.date}</p>
                <p className="post-excerpt">{node.excerpt}</p>
                <Link to={node.fields.slug} className="read-more">
                  Read more →
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
  }
`

export default BlogPage 