---
title: "Proxmox‑Lab auf Hetzner – Architektur, Aufbau und Best Practices"
date: "2026-01-14"
description: "Technische Übersicht eines Proxmox‑Labs auf Hetzner mit Fokus auf Architektur, Virtualisierung, Migrationstests und erweiterbaren Infrastruktur‑Designs. Ideal für produktionsnahe Evaluierungen und zukünftige Cluster‑Erweiterungen."
tags: ["Proxmox", "Virtualisierung", "Infrastruktur", "Hetzner", "Migration"] 
---

## Einleitung
Dieser Artikel beschreibt den Aufbau eines Proxmox‑Labs auf Hetzner als Grundlage für Virtualisierung, Migrationstests und Infrastruktur‑Evaluierungen.
Die Umgebung ist modular konzipiert und ermöglicht spätere Erweiterungen wie HA‑Cluster, Ceph‑Storage und Proxmox Backup Server.
Der Fokus liegt auf einer klaren, reproduzierbaren Architektur, die sich sowohl für Tests als auch für produktionsnahe Szenarien eignet.

## 1. Zielsetzung des Labs
Das Lab verfolgt mehrere technische Ziele:
- Evaluierung von Proxmox VE in realitätsnahen Umgebungen
- Durchführung von Migrationstests (VMware/Hyper‑V → Proxmox)
- Aufbau einer strukturierten, erweiterbaren Architektur
- Dokumentation von Best Practices für Virtualisierung
- Vorbereitung auf Cluster‑ und Storage‑Erweiterungen
Die Umgebung dient als Basis für spätere Artikel, technische Analysen und Migrationsszenarien.

## 2. Architekturübersicht (Version 1 – Single Node Setup)

Für den initialen Aufbau wird ein einzelner Hetzner‑Server verwendet.
Dieses Setup ermöglicht bereits:
- Virtualisierung
- Netzwerk‑Segmentierung
- Migrationstests
- Basis‑Automatisierung
- Dokumentation der Grundarchitektur
Geplante Komponenten
- 1× Hetzner AX‑Server (NVMe‑Storage, ausreichend RAM)
- Proxmox VE 8.x
- Lokaler NVMe‑Storage für VMs
- VLAN‑Trennung für Management und VM‑Netz
- Basis‑VMs:
- Windows Server (AD/DNS)
- Linux‑Server (Ubuntu/Debian)
- Firewall (OPNsense/pfSense)
Dieses Setup bildet die Grundlage für spätere Erweiterungen.

## 3. Gründe für den Start mit einem Single‑Node‑Setup
Ein Single‑Node‑Design bietet mehrere Vorteile:
- Kostenoptimierung bei laufenden Hetzner‑Instanzen
- Fokus auf Grundarchitektur, bevor HA‑Mechanismen hinzukommen
- Migrationstests sind auch ohne Cluster möglich
- Einfache Reproduzierbarkeit
- Flexible Erweiterbarkeit auf Multi‑Node‑Cluster
Der zweite Node wird erst hinzugefügt, sobald die Basis stabil dokumentiert ist.

## 4. Geplante Erweiterungen
Das Lab ist bewusst modular aufgebaut und wird später erweitert:
- Node 2 für HA‑Funktionen
- Ceph‑Storage für verteilte Datenhaltung
- Proxmox Backup Server (PBS)
- Optimiertes Netzwerk‑Design (Storage‑Netz, Bonding, VLAN‑Optimierung)
- Cluster‑Failover‑Tests
- Migrationsszenarien für VMware und Hyper‑V
Diese Erweiterungen folgen in separaten Artikeln.

## 5. Weiteres Vorgehen
Die nächsten Schritte umfassen:
- Auswahl des passenden Hetzner‑Servers
- Installation von Proxmox VE
- Dokumentation der Grundkonfiguration
- Aufbau der ersten VMs
- Vorbereitung der Cluster‑Erweiterung
Weitere Artikel werden die technische Umsetzung im Detail beschreiben.
