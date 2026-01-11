---
title: "Proxmox Cluster: Architektur, Netzwerk & Best Practices"
date: "2026-01-11"
description: "Ein vollständiger Leitfaden für den Aufbau eines stabilen, skalierbaren Proxmox-Clusters – inklusive Netzwerkdesign, Storage-Strategie und Cluster-Konfiguration."
tags: ["Proxmox", "Virtualisierung", "Cluster", "HomeLab"] 
---

## Einleitung

Ein Proxmox-Cluster ist schnell erstellt – aber ein **stabiler**, **skalierbarer** und **sauber strukturierter** Cluster erfordert Planung.  
In diesem Beitrag zeige ich dir eine Architektur, die sowohl im Homelab als auch in Enterprise-Umgebungen funktioniert.

---

## 1. Architekturüberblick

Ein Proxmox-Cluster benötigt mindestens **drei Nodes**, um ein Quorum sicherzustellen.

**Empfohlene Struktur:**

- `pve01` – Compute + lokaler Storage  
- `pve02` – Compute + lokaler Storage  
- `pve03` – Compute (kann ohne lokalen Storage laufen)  
- Optional: `ceph01–03` für dediziertes Ceph  
- Management-Netz  
- Storage-Netz  
- VM-Netz  

**Warum drei Nodes?**

- Verhindert Split-Brain  
- Stabiles Quorum  
- HA wird erst ab drei Nodes sinnvoll  

---

## 2. Netzwerkdesign

Proxmox reagiert empfindlich auf Latenz und Paketverlust.  
Ein sauberes Netzwerkdesign ist daher entscheidend.

**Empfohlenes Setup:**

```text
Management: 10.10.10.0/24 (1 Gbit ausreichend)
Storage:    10.20.20.0/24 (10 Gbit empfohlen)
VM-Netz:    10.30.30.0/24 (je nach Workload)