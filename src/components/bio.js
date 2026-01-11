import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

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
    <StaticImage
      className="bio-avatar"
      layout="fixed"
      formats={["auto", "webp", "avif"]}
      src="../images/p0815logo.png"
      width={90}
      height={90}
      quality={95}
      alt="Profile picture"
    />

    <div className="bio-text">
      <p><strong>{author.name}</strong></p>
      <p>{author.role}</p>
      <p>{author.bio}</p>
    </div>
  </div>
)


}

export default Bio