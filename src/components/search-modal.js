import React, { useState, useMemo, useEffect } from "react"
import { Link } from "gatsby"
import { useStaticQuery, graphql } from "gatsby"

const SearchModal = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const inputRef = React.useRef(null)

  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              description
              date(formatString: "MMMM DD, YYYY")
              tags
            }
            excerpt
          }
        }
      }
    }
  `)

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  // Client-seitige Suche
  const results = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return []

    const searchLower = searchTerm.toLowerCase()
    const allPosts = data.allMarkdownRemark.edges

    return allPosts
      .filter(({ node }) => {
        const title = node.frontmatter.title.toLowerCase()
        const description = (node.frontmatter.description || "").toLowerCase()
        const excerpt = node.excerpt.toLowerCase()
        const tags = (node.frontmatter.tags || [])
          .map(t => t.toLowerCase())
          .join(" ")

        return (
          title.includes(searchLower) ||
          description.includes(searchLower) ||
          excerpt.includes(searchLower) ||
          tags.includes(searchLower)
        )
      })
      .map(({ node }) => node)
  }, [searchTerm, data])

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal-content" onClick={e => e.stopPropagation()}>
        <div className="search-modal-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Posts durchsuchen..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-modal-input"
            aria-label="Suchen"
          />
          <button className="search-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {searchTerm.length >= 2 && (
          <div className="search-modal-results">
            {results.length > 0 ? (
              results.slice(0, 10).map(post => (
                <Link
                  key={post.fields.slug}
                  to={post.fields.slug}
                  className="search-modal-result-item"
                  onClick={onClose}
                >
                  <div className="search-modal-result-title">
                    {post.frontmatter.title}
                  </div>
                  <div className="search-modal-result-meta">
                    {post.frontmatter.date}
                  </div>
                  {post.frontmatter.description && (
                    <div className="search-modal-result-description">
                      {post.frontmatter.description.substring(0, 120)}...
                    </div>
                  )}
                </Link>
              ))
            ) : (
              <div className="search-modal-no-results">
                Keine Posts gefunden für "{searchTerm}"
              </div>
            )}
          </div>
        )}

        {searchTerm.length < 2 && (
          <div className="search-modal-help">
            <p>Mindestens 2 Zeichen eingeben zum Suchen</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchModal
