import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            role
            bio
          }
        }
      }
    }
  `)

  const { author } = data.site.siteMetadata

 return (
  <div className="bio">
    <div className="bio-text">
      <p><strong>{author.name}</strong></p>
      <p>{author.role}</p>
      <p>{author.bio}</p>
    </div>
  </div>
)


}

export default Bio