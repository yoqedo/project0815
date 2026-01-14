---
title: "Proxmox Networking verstehen (Bonds, Bridges, VLANs, Routing)"
date: "2026-01-13"
description: "Eine klare und verständliche Einführung in das Proxmox‑Netzwerkmodell.
Dieser Artikel erklärt Bonds, Bridges, VLANs und Routing so, dass sie sofort logisch werden."
tags: ["Proxmox", "Virtualisierung", "Netzwerk", "Linux", "HomeLab"] 
---

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
- Proxmox erkennt NICs als enoX, enpXsY, ensXfY.
- PCIe‑Karten (SFP+, SFP28) erscheinen fast immer als enpXsY.
- Hardware bleibt Hardware — unabhängig vom Hypervisor.

## 🧩 4. Bonding (Teaming)
- Bündelt mehrere Ports zu einer logischen NIC.
- active‑backup → Redundanz ohne Switch‑Konfiguration
- LACP (802.3ad) → Speed + Redundanz (ideal für 10G/25G)

## 🧩 5. Bridges (vmbrX)
- Eine Bridge ist ein virtueller Switch.
- Die IP liegt immer auf der Bridge, nie auf dem Bond.
- Der Host hängt selbst an der Bridge.
- VMs hängen ebenfalls an der Bridge.
👉 Das ist logischer und übersichtlicher als Hyper‑V.

## 🧩 6. VLAN‑Design
- Proxmox kann VLAN‑aware Bridges nutzen.
- VMs können VLAN‑Tags bekommen.
- Ideal für Multi‑Network‑Designs.

## 🧩 7. Multi‑Network‑Design (Enterprise‑Style)
Trennung von:
- Management
- Cluster
- Live‑Migration
- Storage
- DMZ / Server‑Netz
Beispiel:
bond0 → vmbr0 (Management)
bond1 → vmbr1 (Cluster)
bond1 → vmbr2 (Migration, VLAN 20)
bond1 → vmbr3 (Storage, VLAN 30)

## 🧩 8. Hetzner‑Spezialfall
Hetzner erlaubt kein Layer‑2 Bridging.
Darum:
- vmbr0 = Public IP
- alle anderen vmbrX = Private Netze
- Proxmox = Router
- NAT + IP‑Forwarding nötig
- VMs bekommen private IPs

## 🧩 9. Zugriff auf VMs
Port‑Forwarding
- Möglich, aber unsicher
- Nur mit Firewall‑Regeln
⭐ VPN (beste Lösung)
- WireGuard / Tailscale / OpenVPN
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
