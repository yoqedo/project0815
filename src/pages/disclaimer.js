import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const DisclaimerPage = ({ location }) => {
  return (
    <Layout location={location} title="Project0815">
      <article className="disclaimer-page">
        <h1>Disclaimer & Haftungsausschluss</h1>

        <section>
          <h2>Allgemeiner Hinweis</h2>
          <p>
            Diese Website basiert auf persönlichen Erfahrungen und Experimenten im Bereich
            Systemadministration, Virtualisierung und IT-Infrastruktur. Die veröffentlichten
            Inhalte sind Erfahrungsberichte und keine professionelle Beratung.
          </p>
        </section>

        <section>
          <h2>Keine Gewährleistung</h2>
          <p>
            Alle Informationen auf dieser Website werden ohne Gewährleistung bereitgestellt.
            Der Autor übernimmt keine Haftung für:
          </p>
          <ul>
            <li>Fehler, Ungenauigkeiten oder Unvollständigkeiten der Inhalte</li>
            <li>Schäden, die durch die Anwendung der Informationen entstehen</li>
            <li>Ausfallzeiten oder Datenverluste</li>
            <li>Sicherheitsprobleme oder Sicherheitslücken in beschriebenen Konfigurationen</li>
          </ul>
        </section>

        <section>
          <h2>Fachgebiete</h2>
          <p>
            Diese Website behandelt hauptsächlich die folgenden Themen:
          </p>
          <ul>
            <li>Hyper-V Virtualisierung und Konfiguration</li>
            <li>Netzwerkarchitektur und -konfiguration</li>
            <li>Storage-Systeme</li>
            <li>Enterprise-IT-Design</li>
            <li>Proxmox und andere Virtualisierungstechnologien</li>
          </ul>
          <p>
            Implementierungen basierend auf den hier beschriebenen Konfigurationen sollten immer
            von erfahrenem Fachpersonal überprüft und an die spezifischen Anforderungen angepasst werden.
          </p>
        </section>

        <section>
          <h2>Testumgebungen</h2>
          <p>
            Viele der beschriebenen Konfigurationen wurden in Testumgebungen durchgeführt.
            Diese können sich von Produktionsumgebungen unterscheiden. Vor der Implementierung
            in einer Produktionsumgebung sollten Sie Ihre eigenen Tests durchführen.
          </p>
        </section>

        <section>
          <h2>Externe Links</h2>
          <p>
            Diese Website kann Links zu externen Webseiten enthalten. Der Autor ist nicht
            verantwortlich für den Inhalt dieser Websites. Die Nutzung erfolgt auf eigenes Risiko.
          </p>
        </section>

        <section>
          <h2>Kontakt & Feedback</h2>
          <p>
            Wenn Sie einen Fehler entdecken oder Feedback haben, können Sie sich gerne melden.
            Der Autor wird versuchen, Fehler zu korrigieren, übernimmt aber keine Verpflichtung dazu.
          </p>
        </section>

        <div className="disclaimer-footer">
          <p>
            <strong>Stand:</strong> {new Date().toLocaleDateString("de-DE")}
          </p>
          <Link to="/">← Zurück zur Startseite</Link>
        </div>
      </article>
    </Layout>
  )
}

/**
 * Head export to define metadata for the page
 */
export const Head = () => <Seo title="Disclaimer" />

export default DisclaimerPage
