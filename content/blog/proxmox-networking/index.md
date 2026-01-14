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

## 🧩 2. Storage‑Design
ZFS
- Dateisystem + Volume Manager
- Prüfsummen, Snapshots, Selbstheilung
- RAM‑hungrig
- Ideal für Multi‑Disk‑Setups
LVM‑thin
- Schnell, leicht, flexibel
- Ideal für Hetzner, Single‑Disk, NVMe
- Perfekt für VMs
👉 Für dein Consulting‑Lab: LVM‑thin.

## 🧩 3. Netzwerk‑Grundlagen
- Proxmox erkennt NICs als **enoX** und PCI NIC's als **enpXsY**, **ensXfY**.
```
eno1 → (RJ45 Port 1
eno2 → (RJ45) Port 2
enp3s0f0 → (SFP+) Port 1 
enp3s0f1 → (SFP+) Port 2
```

## 🧩 4. Bonding (Teaming)
- Bündelt mehrere Ports zu einer logischen NIC.

Hier in dem Beispiel wurden die 2 RJ45 Ports zu einem Bond **bond0** zusammen genommen.

Ebenfalls wurden die SFP+ Ports in ein Bond **bond1** genommen. So sind nun beide Datenübertragungen sauber getrennt.
```
bond0 = eno1 + eno2 (active-backup) - Redundanz ohne Switch‑Konfiguration
bond1 = enp3s0f0 + enp3s0f1 (LACP) - Speed + Redundanz (ideal für 10G/25G)
```
👉 Das pendent zu Windows Hyper V wäre (NIC Teaming) 

## 🧩 5. Bridges (vmbrX)
- Eine Bridge ist ein virtueller Switch.
- Die IP liegt immer auf der Bridge, nie auf dem Bond.
- Der Host hängt selbst an der Bridge.
- VMs hängen ebenfalls an der Bridge.

👉 Das pendent zu Hyper v wäre das ein vSwitch.

**Hinweis: Jedes Netz bekommt seinen eigenen **Bridge** (vmbr0 - Management Netz, vmbr1 - Cluster Netz usw.)**

## 🧩 6. VLAN‑Design
- Proxmox kann VLAN‑aware Bridges nutzen.
- VMs können VLAN‑Tags bekommen.
- Ideal für Multi‑Network‑Designs.

## 🧩 7. Multi‑Network‑Design (Enterprise‑Style)
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

## 🧩 8. Hetzner‑Spezialfall
Hetzner erlaubt kein Layer‑2 Bridging.
Darum:
- vmbr0 = Public IP
- alle anderen vmbrX = Private Netze
- Proxmox über das Routing
- NAT + IP‑Forwarding nötig
- VMs bekommen private IPs

## 🧩 9. Zugriff auf VMs
Port‑Forwarding ist möglich aber nicht die beste Lösung.
- Möglich, aber unsicher
- Nur mit Firewall‑Regeln

⭐ VPN ist die beste Lösung
- WireGuard / Tailscale / OpenVPN als Client
- Du bekommst eine VPN‑IP
- Zugriff auf alle internen Netze
- Keine Ports offen
- Maximale Sicherheit

## 🧩 10. GUI‑Struktur
- Datacenter → Clusterweite Einstellungen
- Node → Netzwerk, Disks, System
- Storage → Backends
- VM → Hardware, Options, Console, Snapshots

⭐ Was du jetzt kannst
Du kannst jetzt:
- Proxmox sauber installieren
- Storage richtig auswählen
- Bonds und Bridges korrekt bauen
- VLAN‑Trunking verstehen
- Multi‑Network‑Designs planen
- Hetzner‑Routing verstehen
- VPN‑Zugriff einrichten
- VMs professionell anbinden

**Proxmox** wirkt im ersten Moment komplex, doch sobald man das Netzwerkmodell wirklich versteht, fügt sich alles logisch zusammen. Bonds, Bridges, VLANs und Routing sind keine isolierten Funktionen, sondern Bausteine eines klaren, modernen Architekturkonzepts. Wer diese Grundlagen beherrscht, kann Proxmox stabil, sicher und skalierbar betreiben – egal ob im Homelab, im KMU oder in einer produktiven Umgebung.

In den nächsten Artikeln dieser Serie gehe ich darauf ein, wie sich dieses Wissen konkret anwenden lässt: von der Architektur auf Hetzner über Routing‑Setups bis hin zu VPN‑Zugriff und Storage‑Design. Schritt für Schritt entsteht so ein vollständiges, professionelles Proxmox‑Lab, das nicht nur funktioniert, sondern auch verstanden wird.
