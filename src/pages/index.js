import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes
  const [selectedTag, setSelectedTag] = React.useState(null)

  // Tag aus URL-Parameter lesen
  React.useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tagFromUrl = params.get('tag')
    if (tagFromUrl) {
      setSelectedTag(decodeURIComponent(tagFromUrl))
    }
  }, [location.search])

  // Alle einzigartigen Tags sammeln
  const allTags = React.useMemo(() => {
    const tags = new Set()
    posts.forEach(post => {
      if (post.frontmatter.tags) {
        post.frontmatter.tags.forEach(tag => tags.add(tag))
      }
    })
    return Array.from(tags).sort()
  }, [posts])

  // Posts nach ausgewähltem Tag filtern
  const filteredPosts = React.useMemo(() => {
    if (!selectedTag) return posts
    return posts.filter(post =>
      post.frontmatter.tags && post.frontmatter.tags.includes(selectedTag)
    )
  }, [posts, selectedTag])

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Bio />
      
      <div className="posts-count">
        {filteredPosts.length > 0 && (
          <p>{filteredPosts.length} Post{filteredPosts.length !== 1 ? "s" : ""} gefunden</p>
        )}
      </div>

      {filteredPosts.length > 0 ? (
        <ol style={{ listStyle: `none` }}>
          {filteredPosts.map(post => {
            const title = post.frontmatter.title || post.fields.slug

            return (
              <li key={post.fields.slug}>
                <article
                  className="post-list-item"
                  itemScope
                  itemType="http://schema.org/Article"
                >
                  <header>
                    <h2>
                      <Link to={post.fields.slug} itemProp="url">
                        <span itemProp="headline">{title}</span>
                      </Link>
                    </h2>
                    <small>{post.frontmatter.date}</small>
                    {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                      <div className="post-tags">
                        {post.frontmatter.tags.map(tag => (
                          <span
                            key={tag}
                            className="post-tag"
                            onClick={() => setSelectedTag(tag)}
                            role="button"
                            tabIndex={0}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </header>
                  <section>
                    <div
                      className="post-description"
                      dangerouslySetInnerHTML={{
                        __html: post.frontmatter.description || post.excerpt,
                      }}
                      itemProp="description"
                    />
                    <Link to={post.fields.slug} className="read-more-link">
                      Mehr lesen →
                    </Link>
                  </section>
                </article>
              </li>
            )
          })}
        </ol>
      ) : (
        <p className="no-results">Keine Posts mit diesem Tag gefunden.</p>
      )}
    </Layout>
  )
}

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => (
  <>
    <Seo
      title="Project0815 | Physische Realität verstehen"
      description="Technische Infrastruktur verstehen - von physischen Systemen über Cluster bis zu realen IT-Architekturen"
    />
    <meta name="google-site-verification" content="uhuvV3N8N6GCbRo5cpuhscTDFhYoaJ_6D8h2P2hP8xI" />
  </>
)

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          tags
        }
      }
    }
  }
`
