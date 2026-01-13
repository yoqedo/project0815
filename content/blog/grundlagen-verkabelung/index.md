---
title: "SFP+, SFP28, DAC & AOC – Die Grundlagen vor jedem Storage‑Design"
date: "2025-11-10"
description: "Bevor zwei Hyper‑V‑Hosts als Cluster zusammenarbeiten können, müssen sie sich zuverlässig austauschen können – über mehrere getrennte Netzwerkpfade, die jeweils eine ganz bestimmte Aufgabe erfüllen."
tags: ["Netzwerk", "Storage", "Verkabelung", "Grundlagen"] 
---
## Einleitung

Bevor man Storage, Cluster oder Core‑Switching plant.
Wer moderne IT‑Infrastruktur baut – egal ob Hyper‑V, Proxmox, VMware oder Storage – begegnet sehr schnell Begriffen wie SFP+, SFP28, DAC, AOC oder Glasfaser‑Modulen.
Viele kennen die Wörter, aber kaum jemand versteht wirklich, was sie bedeuten und wann man was einsetzen sollte.
Dieser Artikel erklärt alles einfach, klar und schülergerecht, damit du später Storage‑Design, Cluster‑Netzwerke oder Switch‑Topologien sauber planen kannst.

## 1. Was sind SFP‑Ports?
SFP‑Ports sind kleine Steckplätze an Servern und Switches.
Sie ersetzen klassische RJ45‑Ports, wenn man höhere Geschwindigkeiten braucht.
Es gibt zwei wichtige Varianten:

Wichtig:
- SFP+ = 10G
- SFP28 = 25G
- Sie sehen gleich aus, sind aber nicht kompatibel.

---

## 2. Welche Kabeltypen gibt es?
Es gibt drei Arten, die man kennen muss:

**A) DAC – Direct Attach Copper**

Kurz, günstig, extrem schnell
- Kupferkabel
- feste SFP+ oder SFP28‑Stecker
- 1–5 m
- sehr niedrige Latenz
- sehr günstig
- perfekt im gleichen Rack

Typische Nutzung:
- Server ↔ Core‑Switch
- Storage ↔ Core‑Switch (wenn nah)

**B) AOC – Active Optical Cable**

Glasfaser mit festen Steckern
- innen echte Glasfaser
- 5–30 m
- sehr leicht und flexibel
- keine Module nötig
- ideal zwischen Racks

Typische Nutzung:
- Rack ↔ Rack
- längere Server‑ oder Storage‑Verbindungen

**C) Glasfaser + Module**
Flexibel, professionell, große Reichweite
- SFP‑Modul in den Port
- LC‑LC Glasfaserkabel dazwischen
- Reichweite: 1 m bis mehrere Kilometer
- teurer, aber sehr flexibel

Typische Nutzung:
- Etagen ↔ Core
- Gebäude ↔ Gebäude
- Storage ↔ Core (wenn weiter weg)

---

## 3. Welche Geschwindigkeit liefern die Kabel?
Ganz einfach:

| Kabeltyp             | SFP+            | SFP28         |
|:---------------------|:----------------|:--------------|
| **DAC**              | 10G             | 25G           |  
| **AOC**              | 10G             | 25G           |
| **Glasfaser + Modul**| 10G             | 25G           |

**👉 Die Geschwindigkeit kommt vom Port, nicht vom Kabel.**

---

## 4. Wann nimmt man welchen Kabeltyp?

| Situation                                 | Empfehlung            |
|:------------------------------------------|:----------------------|
| **Server ↔ Switch im gleichen Rack**      | **DAC**               |   
| **Storage ↔ Switch im gleichen Rack**     | **DAC**               | 
| **Rack ↔ Rack (5–30 m)**                  | **AOC**               |
| **Etage ↔ Core**                          | **Glasfaser + Modul** |   
| **Gebäude ↔ Gebäude**                     | **Glasfaser + Modul** | 
| **Management / Clients**                  | **RJ45**              |

---

## 5. Warum ist das wichtig für Storage?

Storage reagiert empfindlich auf:
- Latenz
- Bandbreite
- Paketverlust
- Stabilität

Deshalb gilt:
- **RJ45‑Kupfer ist ungeeignet für Storage**
- **DAC, AOC und Glasfaser sind perfekt**
- **10G reicht für viele KMU**
- **25G ist moderner und gibt mehr Reserve**

Bevor man Storage‑Design plant, muss man verstehen:
- welche Ports man hat
- welche Kabel funktionieren
- welche Geschwindigkeiten möglich sind
- welche Kombinationen kompatibel sind
 
Erst dann kann man:
- iSCSI‑VLANs
- MPIO‑Pfad‑Design
- Cluster‑Netzwerke
- Core‑Switch‑Topologien
 
sauber planen.

---

## 6. Die wichtigste Erkenntnis
- SFP+ = 10G
- SFP28 = 25G
- DAC = kurz & günstig
- AOC = mittel & flexibel
- Glasfaser + Modul = weit & professionell
- RJ45 = NICHT für Storage

---

## 7. Fazit
Wer moderne Infrastruktur baut, muss zuerst die Grundlagen der SFP‑Technik verstehen.
Erst danach macht es Sinn, über Storage‑Design, Cluster‑Netzwerke oder Switch‑Architekturen zu sprechen.
Mit diesem Wissen kannst du:
- Storage‑Systeme korrekt anbinden
- Hyper‑V/Proxmox‑Cluster sauber planen
- Switch‑Ports richtig dimensionieren
- teure Fehlkäufe vermeiden
- und deine Infrastruktur zukunftssicher aufbauen
