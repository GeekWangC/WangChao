import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Search from '../components/Search'
import '../styles/global.css'

const BlogPage = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes

  return (
    <Layout>
      <div className="container">
        <section className="blog-list">
          <h1>博客文章</h1>
          <Search posts={posts} />
        </section>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        id
        frontmatter {
          title
          date(formatString: "YYYY-MM-DD")
          category
          tags
          description
          thumbnail {
            publicURL
            childImageSharp {
              gatsbyImageData(
                width: 800
                placeholder: BLURRED
                formats: [AUTO, WEBP]
              )
            }
          }
        }
        fields {
          slug
        }
        excerpt(pruneLength: 200)
      }
    }
  }
`

export default BlogPage 