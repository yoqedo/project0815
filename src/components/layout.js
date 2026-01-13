import * as React from "react"
import { Link, graphql, useStaticQuery, navigate } from "gatsby"
import SearchModal from "./search-modal"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  const [isDarkMode, setIsDarkMode] = React.useState(false)
  const [showSearch, setShowSearch] = React.useState(false)
  const [showMobileMenu, setShowMobileMenu] = React.useState(false)
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false)
  const [showDesktopFilterDropdown, setShowDesktopFilterDropdown] = React.useState(false)

  const data = useStaticQuery(graphql`
    query LayoutQuery {
      site {
        siteMetadata {
          social {
            github
          }
        }
      }
      allMarkdownRemark {
        nodes {
          frontmatter {
            tags
          }
        }
      }
    }
  `)

  const githubUrl = data.site.siteMetadata.social?.github

  // Alle einzigartigen Tags sammeln
  const allTags = React.useMemo(() => {
    const tags = new Set()
    data.allMarkdownRemark.nodes.forEach(node => {
      if (node.frontmatter.tags) {
        node.frontmatter.tags.forEach(tag => tags.add(tag))
      }
    })
    return Array.from(tags).sort()
  }, [data])

  // Dark mode toggle
  React.useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const savedMode = localStorage.getItem("darkMode")
    const isDark = savedMode !== null ? savedMode === "true" : prefersDark
    setIsDarkMode(isDark)
    updateDarkMode(isDark)
  }, [])

  const updateDarkMode = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add("dark-mode")
    } else {
      document.documentElement.classList.remove("dark-mode")
    }
  }

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem("darkMode", newMode)
    updateDarkMode(newMode)
  }

  const handleTagClick = (tag) => {
    setShowMobileMenu(false)
    setShowFilterDropdown(false)
    if (isRootPath) {
      // Wenn wir auf der Index-Seite sind, können wir den Tag-Filter setzen
      // Dies erfordert, dass die Index-Seite den Tag aus der URL liest
      navigate(`/?tag=${encodeURIComponent(tag)}`)
    } else {
      navigate(`/?tag=${encodeURIComponent(tag)}`)
    }
  }

  // Schließe Mobile-Menü und Filter-Dropdown wenn außerhalb geklickt wird
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMobileMenu && !event.target.closest('.mobile-menu-container')) {
        setShowMobileMenu(false)
      }
      if (showDesktopFilterDropdown && !event.target.closest('.filter-dropdown-container')) {
        setShowDesktopFilterDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMobileMenu, showDesktopFilterDropdown])

  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">
        <div className="header-content">
          {header}
          <div className="header-controls">
            {isRootPath && allTags.length > 0 && (
              <div className="filter-dropdown-container">
                <button
                  className="filter-icon-btn"
                  onClick={() => setShowDesktopFilterDropdown(!showDesktopFilterDropdown)}
                  aria-label="Filter categories"
                  title="Kategorien"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                  </svg>
                </button>
                {showDesktopFilterDropdown && (
                  <div className="desktop-filter-dropdown">
                    <div className="desktop-filter-buttons">
                      <button
                        className={`desktop-filter-btn ${location.search === '' || !location.search.includes('tag=') ? "active" : ""}`}
                        onClick={() => {
                          navigate('/')
                          setShowDesktopFilterDropdown(false)
                        }}
                      >
                        Alle
                      </button>
                      {allTags.map(tag => {
                        const params = new URLSearchParams(location.search)
                        const tagFromUrl = params.get('tag')
                        const isActive = tagFromUrl === tag
                        return (
                          <button
                            key={tag}
                            className={`desktop-filter-btn ${isActive ? "active" : ""}`}
                            onClick={() => {
                              navigate(`/?tag=${encodeURIComponent(tag)}`)
                              setShowDesktopFilterDropdown(false)
                            }}
                          >
                            {tag}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
            <button
              className="search-icon-btn"
              onClick={() => setShowSearch(true)}
              aria-label="Search posts"
              title="Search (Ctrl+K)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
            <button
              className="dark-mode-toggle"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              title={isDarkMode ? "Light mode" : "Dark mode"}
            >
              {isDarkMode ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
          </div>
          <div className="mobile-menu-container">
            <button
              className="mobile-menu-toggle"
              onClick={() => {
                const newState = !showMobileMenu
                setShowMobileMenu(newState)
                if (!newState) {
                  setShowFilterDropdown(false)
                }
              }}
              aria-label="Toggle menu"
              aria-expanded={showMobileMenu}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {showMobileMenu ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
            {showMobileMenu && (
              <div className="mobile-menu-dropdown">
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mobile-menu-item"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span>GitHub</span>
                  </a>
                )}
                <button
                  className="mobile-menu-item"
                  onClick={() => {
                    toggleDarkMode()
                  }}
                >
                  {isDarkMode ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                  )}
                  <span>{isDarkMode ? "Hell" : "Dunkel"}</span>
                </button>
                <button
                  className="mobile-menu-item"
                  onClick={() => {
                    setShowSearch(true)
                    setShowMobileMenu(false)
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <span>Suchen</span>
                </button>
                {allTags.length > 0 && (
                  <>
                    <div className="mobile-menu-divider"></div>
                    <button
                      className="mobile-menu-item mobile-menu-category-toggle"
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    >
                      <span>Kategorien</span>
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        style={{ 
                          transform: showFilterDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease'
                        }}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                    {showFilterDropdown && allTags.map(tag => (
                      <button
                        key={tag}
                        className="mobile-menu-item mobile-menu-tag"
                        onClick={() => handleTagClick(tag)}
                      >
                        <span>{tag}</span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
      <main>{children}</main>
      <footer>
        <div className="footer-content">
          <p>© {new Date().getFullYear()} Alle Rechte vorbehalten.</p>
          <div className="footer-links">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
                aria-label="GitHub"
              >
                GitHub
              </a>
            )}
            <a href="mailto:kontakt@project0815.de" className="footer-link">
              Kontakt
            </a>
            <Link to="/disclaimer" className="footer-link">
              Disclaimer & Haftungsausschluss
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
