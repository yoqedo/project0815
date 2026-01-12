---
title: "Storage verstehen: Wie Daten in der physischen Realität wirklich gespeichert werden"
date: "2025-11-08"
description: "Warum Storage das Fundament jeder Infrastruktur ist – und warum Cluster ohne korrektes Storage‑Design scheitern."
tags: ["Storage", "Proxmox", "Cluster", "Infrastructure"] 
---

## Einleitung

Storage ist das Fundament jeder Infrastruktur. Er bestimmt, wie schnell Systeme reagieren, wie stabil Cluster laufen und ob Daten im Fehlerfall überleben. Trotzdem wird Storage oft als Nebensache behandelt – als etwas, das „einfach funktioniert“, solange genug Kapazität vorhanden ist.

In der Realität ist Storage ein physisches System mit klaren Grenzen: Latenz, IOPS, Durchsatz, Rebuild‑Zeiten, Fehlerwahrscheinlichkeiten und Abhängigkeiten. Jede Entscheidung im Storage‑Design wirkt sich direkt auf die gesamte Infrastruktur aus. Ein Cluster kann perfekt konfiguriert sein – wenn das Storage schwach ist, wird das System trotzdem instabil.

Dieser Artikel erklärt die physische Realität hinter Storage: wie Daten wirklich gespeichert werden, warum RAID nicht gleich Sicherheit bedeutet, warum ZFS so robust ist und warum verteilte Systeme wie Ceph eigene Anforderungen haben. Ziel ist nicht, Produkte zu vergleichen, sondern die Architektur zu verstehen, die hinter stabilen Systemen steht.

---

## 1. Was Storage wirklich ist (physisch + logisch)

Storage besteht aus zwei Ebenen:

Physische Ebene
- SSDs, HDDs, NVMe
- Controller, Backplanes, HBA
- Netzwerke (bei SAN/NAS/Ceph)
- Stromversorgung, Kühlung
Diese Ebene bestimmt:
- Latenz (wie schnell ein einzelner I/O beantwortet wird)
- IOPS (wie viele Operationen pro Sekunde möglich sind)
- Durchsatz (wie viel Datenvolumen pro Sekunde übertragen wird)
  
Logische Ebene
- Dateisysteme (ZFS, ext4, XFS)
- Block‑Layer (LVM, iSCSI, NVMe‑oF)
- Caches (ARC, L2ARC, Controller‑Cache)
- Replikation / Parität
Wichtige Erkenntnis
Storage ist immer der langsamste Teil eines Systems.
CPU, RAM und Netzwerk sind schnell – Storage ist die Bremse.
Wer Storage falsch dimensioniert, erzeugt:
- I/O‑Wait
- VM‑Freeze
- Cluster‑Instabilität
- Datenverlust bei Ausfällen
---

## 2. Block, File, Object – die drei fundamentalen Modelle
Block Storage
Beispiele: LUNs, iSCSI, Fibre Channel, NVMe
- Wird wie eine „Rohplatte“ präsentiert
- Ideal für Hypervisor, Datenbanken
- Sehr performant, aber abhängig von Netzwerkqualität
Typische Fehler:
- iSCSI ohne Multipathing
- Jumbo Frames falsch konfiguriert
- Storage‑Netzwerk nicht getrennt

File Storage
Beispiele: SMB, NFS
- Präsentiert Ordner/Dateien
- Einfach, flexibel
- Gut für Backups, Medien, Home‑Verzeichnisse
Risiko:
NFS als Storage für VMs → Latenzprobleme, Locks, Freeze.

Object Storage
Beispiele: S3, MinIO, Ceph RGW
- Skalierbar, verteilt
- Kein POSIX
- Ideal für Backups, Archive, große Datenmengen
Wichtig:
Object Storage ist kein Ersatz für Block/File im Cluster.
---

## 3. RAID verstehen – und warum es nicht reicht
RAID schützt vor Disk‑Ausfall, aber nicht vor:
- Bitrot
- Controller‑Fehler
- Silent Data Corruption
- Menschlichen Fehlern
- Stromausfällen
- Malware
- Logischen Fehlern
RAID‑Level kurz erklärt
- RAID 0 → schnell, aber kein Schutz
- RAID 1 → Spiegelung
- RAID 5 → Parität, aber gefährlich bei großen HDDs
- RAID 6 → doppelte Parität
- RAID 10 → schnell + sicher (meist beste Wahl)
URE‑Risiko
Bei großen HDDs ist die Wahrscheinlichkeit hoch, dass beim Rebuild ein Lesefehler auftritt → RAID bricht.
Fazit
RAID ist Verfügbarkeit, kein Backup und kein Integritätsschutz.
---

## 4. ZFS – das Dateisystem, das physische Realität ernst nimmt
ZFS ist ein Dateisystem, das entwickelt wurde, um reale Fehler zu verhindern.
Wichtige Eigenschaften
- Copy‑on‑Write → keine inkonsistenten Writes
- Checksums → jede Datenblock wird verifiziert
- Scrubbing → Fehler werden aktiv gesucht
- Snapshots → effizient, sicher
- ARC/L2ARC → intelligenter Cache
Warum ZFS so robust ist
ZFS erkennt Fehler, bevor sie Schaden anrichten.
Hardware‑RAID erkennt Fehler oft erst, wenn es zu spät ist.
Typische Fehlkonfigurationen
- RAIDZ1 für große HDDs → gefährlich
- L2ARC ohne genug RAM
- ZFS über Hardware‑RAID → Katastrophe
- Zu wenig RAM („ZFS frisst RAM“ ist kein Mythos)
---

## 5. Ceph – verteiltes Storage für echte Cluster
Ceph ist ein verteiltes Storage‑System, das für Hochverfügbarkeit gebaut wurde.
Komponenten
- OSD → Speicherknoten
- MON → Cluster‑Koordination
- MDS → für CephFS
Replikation vs. Erasure Coding
- Replikation → einfach, schnell, aber viel Platzverbrauch
- Erasure Coding → effizienter, aber höhere Latenz
Netzwerk‑Anforderungen
- Mindestens 10G
- Besser 25G+
- Dediziertes Storage‑Netzwerk
- Latenz < 1 ms
Warum Ceph in kleinen Clustern schwierig ist
- Hoher Overhead
- Hohe Komplexität
- Netzwerk muss perfekt sein
- Rebalancing kann Systeme überlasten
---

## 6. SAN & NAS – klassische Enterprise‑Storage‑Modelle
SAN (Storage Area Network)
- Fibre Channel oder iSCSI
- Sehr stabil, sehr performant
- Teuer, aber zuverlässig
- Ideal für große Virtualisierungsumgebungen
NAS (Network Attached Storage)
- SMB/NFS
- Einfach, günstig
- Gut für Backups, Fileshares
- Nicht ideal für VM‑Storage
Typische Fehler
- NAS als Haupt‑VM‑Storage
- Kein dediziertes Storage‑Netzwerk
- Billige Consumer‑NAS im Cluster
---

## 7. Storage‑Fehler, die Cluster zerstören
- I/O‑Wait → VMs frieren ein
- Split‑Brain durch Storage‑Latenz
- Ceph‑Rebalancing‑Stürme
- ZFS‑Pool‑Degradation
- SSD‑Write‑Amplification
- Billige SSDs ohne Power‑Loss‑Protection
- Storage‑Netzwerk überlastet
- RAID‑Rebuild dauert Tage → Risiko steigt
Storage ist der häufigste Grund für Cluster‑Instabilität.
---

## 8. Physische Realität Checkliste
- Was passiert bei Stromausfall
- Was passiert bei Netzwerkfehler
- Was passiert bei Disk‑Ausfall
- Wie lange dauert ein Rebuild
- Wie verhält sich das System unter Last
- Welche Abhängigkeiten existieren wirklich
- Gibt es Single Points of Failure
- Wie wird Integrität geprüft
- Wie wird Replikation gehandhabt
