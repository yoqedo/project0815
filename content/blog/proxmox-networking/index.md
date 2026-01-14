---
title: "Proxmox Networking verstehen - Bonds, Bridges, VLANs, Routing"
date: "2026-01-13"
description: "Eine klare und verständliche Einführung in das Proxmox‑Netzwerkmodell.
Dieser Artikel erklärt Bonds, Bridges, VLANs und Routing so, dass sie sofort logisch werden."
tags: ["Proxmox", "Virtualisierung", "Netzwerk", "Linux", "HomeLab"] 
---
## Einleitung
Proxmox ist ein unglaublich mächtiger Hypervisor – aber viele stolpern schon beim ersten großen Thema: dem Netzwerk. Begriffe wie Bridges, Bonds, VLANs oder Routing wirken auf den ersten Blick komplex, dabei folgt Proxmox einem klaren, logischen Modell, das sich perfekt für moderne Virtualisierungs‑Umgebungen eignet.

In diesem Artikel zeige ich, wie Proxmox Netzwerke wirklich funktionieren, warum das Konzept so viel übersichtlicher ist als bei anderen Hypervisoren und wie man Bonds, Bridges und VLANs sauber kombiniert.
Ein Grundlagenartikel, der dir hilft, Proxmox‑Setups professionell zu planen – egal ob im Homelab, im KMU oder im Rechenzentrum.

## 🧩 1. Hypervisor‑Grundlagen
- Proxmox nutzt KVM für VMs und LXC für Container.
- Ein Node ist ein physischer Server.
- Mehrere Nodes bilden einen Cluster.
- Storage kann lokal oder remote sein (LVM‑thin, ZFS, NFS, iSCSI, Ceph).

## 🧩 2. Netzwerk‑Grundlagen
- Proxmox erkennt NICs als **enoX** und PCI NIC's als **enpXsY**, **ensXfY**.
```
eno1      → RJ45 Port 1 (Onboard)
eno2      → RJ45 Port 2 (Onboard)
enp3s0f0  → SFP+ Port 1 (PCIe NIC)
enp3s0f1  → SFP+ Port 2 (PCIe NIC)
```
## 🧩 3. Bonding (Teaming)
- Bündelt mehrere Ports zu einer logischen NIC.

Hier in dem Beispiel wurden die 2 RJ45 Ports zu einem Bond **bond0** zusammen genommen.

Ebenfalls wurden die SFP+ Ports in ein Bond **bond1** genommen. So sind nun beide Datenübertragungen sauber getrennt.
```
bond0 = eno1 + eno2 (active-backup) - Redundanz ohne Switch‑Konfiguration
bond1 = enp3s0f0 + enp3s0f1 (LACP) - Speed + Redundanz (ideal für 10G/25G)
```
👉 Das Pendant zu Windows Hyper-V wäre (NIC Teaming) 

## 🧩 4. Bridges (vmbrX)
- Eine Bridge ist ein virtueller Switch.
- Die IP liegt immer auf der Bridge, nie auf dem Bond.
- Der Host hängt selbst an der Bridge.
- VMs hängen ebenfalls an der Bridge.

👉 Das Pendant zu Hyper-V wäre das ein vSwitch.

**Hinweis: Jedes Netz bekommt seinen eigenen **Bridge** (vmbr0 - Management Netz, vmbr1 - Cluster Netz usw.)**

## 🧩 5. VLAN‑Design
- Proxmox kann VLAN‑aware Bridges nutzen.
- VMs können VLAN‑Tags bekommen.
- Ideal für Multi‑Network‑Designs.

## 🧩 6. Multi‑Network‑Design (Enterprise‑Style)
Jedes Netz bekommt seinen eigenes Subnetz:
- Management
- Cluster
- Live‑Migration
- Storage
- DMZ / Server‑Netz
```
Beispiel:
bond0 → vmbr0 (Management)
bond1 → vmbr1 (Cluster)
bond1 → vmbr2 (Migration, VLAN 20)
bond1 → vmbr3 (Storage, VLAN 30)
```
Für jedes Netz wird nun ein **Bridge - vmbrX** erstellt und auf den bond (bond1) gelegt.

**Sehr wichtig: In Proxmox bekommt immer die **Bridge** die IP Adresse des zugehörigen Netzes!**

## 🧩 7. Finale Netzwerkübersicht
So sieht ein typisches Proxmox‑Netzwerkdesign aus:
```
eno1 ─┐
      ├─ bond0 ── vmbr0 (Management)
eno2 ─┘

enp3s0f0 ─┐
          ├─ bond1 ── vmbr1 (Cluster)
enp3s0f1 ─┘           vmbr2 (Migration)
                      vmbr3 (Storage)
```

## 🧩 8. GUI‑Struktur
- Datacenter → Clusterweite Einstellungen
- Node → Netzwerk, Disks, System
- Storage → Backends
- VM → Hardware, Options, Console, Snapshots

⭐ Was du jetzt erklären kannst:
- Proxmox sauber installieren
- was der Grund eines Clusters ist
- was eno0 und enp3s0f0 sind
- zwischen Bonds und Bridges unterscheiden
- wo Bridges und IP Adressen definiert werden
- VLAN‑Trunking verstehen
- Multi‑Network‑Designs planen

**Proxmox** wirkt im ersten Moment komplex, doch sobald man das Netzwerkmodell wirklich versteht, fügt sich alles logisch zusammen. Bonds, Bridges, VLANs und Routing sind keine isolierten Funktionen, sondern Bausteine eines klaren, modernen Architekturkonzepts. Wer diese Grundlagen beherrscht, kann Proxmox stabil, sicher und skalierbar betreiben – egal ob im Homelab, im KMU oder in einer produktiven Umgebung.

In den nächsten Artikeln dieser Serie gehe ich darauf ein, wie sich dieses Wissen konkret anwenden lässt: von der Architektur auf Hetzner über Routing‑Setups bis hin zu VPN‑Zugriff und Storage‑Design. Schritt für Schritt entsteht so ein vollständiges, professionelles Proxmox‑Lab, das nicht nur funktioniert, sondern auch verstanden wird.
