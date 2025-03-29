import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout'
import '../styles/global.css'

// 添加 Netlify Identity 脚本，使 CMS 可以在 Vercel 上工作
const IndexPage = ({ data }) => {
  React.useEffect(() => {
    // 检查是否为浏览器环境
    if (typeof window !== "undefined") {
      // 检查是否存在 netlifyIdentity 对象，如果不存在则加载
      if (!window.netlifyIdentity) {
        const script = document.createElement("script");
        script.src = "https://identity.netlify.com/v1/netlify-identity-widget.js";
        script.async = true;
        document.head.appendChild(script);
      }
      
      // 处理重定向
      if (window.netlifyIdentity) {
        window.netlifyIdentity.on("init", user => {
          if (!user) {
            window.netlifyIdentity.on("login", () => {
              document.location.href = "/admin/";
            });
          }
        });
      }
    }
  }, []);

  const posts = data.allMarkdownRemark.nodes

  return (
    <Layout>
      <div className="container">
        <section className="hero">
          <h1>欢迎来到我的个人网站</h1>
          <p>这是一个简约风格的个人博客，专注于内容创作与分享。</p>
        </section>

        <section className="posts">
          <h2>最新文章</h2>
          <div className="post-grid">
            {posts && posts.map((post) => {
              if (!post || !post.frontmatter) return null;
              
              const { id, frontmatter, fields, excerpt } = post;
              return (
                <article key={id} className="post-card">
                  <h3>
                    <Link to={fields.slug}>{frontmatter.title}</Link>
                  </h3>
                  <p>{frontmatter.date}</p>
                  <p>{excerpt}</p>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
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
        excerpt
      }
    }
  }
`

export default IndexPage
