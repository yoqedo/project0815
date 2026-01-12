---
title: "Vom Kabel bis zum Cluster - Physische Realität verstehen"
date: "2025-10-10"
description: "Technische Systeme beginnen nicht im Code, sondern in der physischen Welt: Strom, Hardware, Verkabelung, Rackdesign. Wer IT‑Infrastruktur wirklich verstehen will, muss die materielle Basis begreifen"
tags: ["Hardware", "HomeLab"] 
---

## Einleitung

Technische Systeme beginnen nicht im Code, sondern in der physischen Welt: Strom, Hardware, Verkabelung, Rackdesign. Wer IT‑Infrastruktur wirklich verstehen will, muss die materielle Basis begreifen — von der Netzwerkkarte bis zum Hypervisor, vom Patchpanel bis zur Stromverteilung. Dieser Blog dokumentiert den Aufbau reproduzierbarer Homelabs und professioneller Architekturen, in denen physische Realität nicht nur Voraussetzung, sondern gestaltbares Element ist. Ziel ist es, Klarheit zu schaffen: durch strukturierte Dokumentation, modulare Designs und ein tiefes Verständnis für das, was unter der Oberfläche wirkt

---

## 🧱 **1. Was ist ein Netzwerkport?**

Ein Port ist einfach ein Loch, in das du ein Kabel steckst.
Folgende Datenübertragung sind aktuell:

- RJ45 = Kupfer, 1Gbit oder 10Gbit
- SFP+ = Glasfaser, 10Gbit
- SFP28 = Glasfaser, 25Gbit
- QSFP+ = Glasfaser, 40Gbit
- QSFP28 = Glasfaser, 100Gbit

**Kupfer** überträgt elektrische Signale über Metall, ist billiger und einfacher bei der Installation.
Ist Störungsanfälliger und hat eine begrenzte Geschwindigkeit und Reichweite.**RJ45 ist langsam.**

**Glasfaser4** überträgt Daten mit Lichtgeschwindigkeit! Deutlich höhere Bandbreite und geht auch über
längere Distanzen.**SFP+ / SFP28 ist schnell.**

## 🔌 **2. Was ist ein Switch?**

Ein Switch ist wie ein Verteilerkasten.

- Er verbindet Geräte miteinander
- Er entscheidet, wohin Daten gehen
- Er kann VLANs trennen
- Er kann Ports als Access oder Trunk konfigurieren

## 🏷️ **3. Was ist ein VLAN?**

Ein VLAN ist ein **virtuelles Netzwerk** innerhalb eines Switches.

Beispiel:

- VLAN 10 = Management
- VLAN 20 = Server
- VLAN 30 = Clients
- VLAN 40 = Storage
- VLAN 50 = Cluster

Ein VLAN ist wie ein eigenes Zimmer im selben Haus.

## 🔀 **4. Was ist ein Access‑Port?**

Ein Access‑Port gehört **nur zu einem VLAN**.

Beispiel:

- Port 1 → VLAN 10
- Port 2 → VLAN 10
- Port 3 → VLAN 20

Clients, Drucker, Management‑Ports → Access.

---

## 🚚 **5. Was ist ein Trunk‑Port?**

Ein Trunk‑Port transportiert **viele VLANs gleichzeitig**.

Beispiel:

- Port 10 → VLAN 10,20,30,40,50

Hyper‑V braucht das, weil eine NIC viele VM‑Netze transportiert.

---

## 🔥 **6. Warum braucht man Glasfaser?**

Weil:

- 1Gbit zu langsam ist
- Live Migration viel Bandbreite braucht
- Storage (iSCSI/SMB3) extrem schnell sein muss
- VMs viel Traffic erzeugen

Darum baut man **25G NICs** ein.

---
