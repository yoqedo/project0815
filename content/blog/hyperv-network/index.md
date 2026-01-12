---
title: Hyper V Netzwerk einfach erklärt
date: "2025-10-15"
description: "Viele IT‑Labs scheitern nicht an Hyper‑V selbst, sondern am Netzwerk dahinter. Begriffe wie vSwitch, NIC Teaming, vNICs, Management Adapter oder Trunking wirken schnell kompliziert – dabei ist das Hyper‑V Netzwerkmodell eigentlich sehr logisch aufgebaut."
tags: ["Hyper-V", "Compute", "Network"]
---
Viele IT‑Labs scheitern nicht an Hyper‑V selbst, sondern am Netzwerk dahinter.  
Begriffe wie **vSwitch**, **NIC Teaming**, **vNICs**, **Management Adapter** oder **Trunking** wirken schnell kompliziert – dabei ist das Hyper‑V Netzwerkmodell eigentlich sehr logisch aufgebaut.

In diesem Artikel erkläre ich das Hyper‑V Netzwerk so, dass es jeder versteht:  
klar, praxisorientiert und ohne unnötige Theorie.  
Du lernst, wie du ein stabiles, reproduzierbares Netzwerk für dein Homelab oder deine Testumgebung aufbaust – inklusive Best Practices, typischen Fehlern und einer Struktur, die auch in Enterprise‑Umgebungen funktioniert.

Wenn du Hyper‑V bisher als „kompliziert“ empfunden hast, wird sich das nach diesem Artikel ändern.

## 🧱 1. Physische Netzwerkkarten (NICs)

Ein Server hat mehrere Netzwerkkarten.
Bei Hyper‑V nutzt man:

- **NIC1 (1Gbit)** → nur für Management
- **NIC2 + NIC3 (25Gbit)** → für alles, was schnell sein muss (VMs, Cluster, Storage)

NIC2 und NIC3 werden später **zusammengebündelt**, damit sie wie **eine große Leitung** funktionieren.

**Hyper‑V‑Host 1G‑Ports**

Ein Hyper‑V‑Server hat zwei Arten von Management:

**1. Out‑of‑Band‑Management (1G‑Port)**

- eigener kleiner Computer im Server (iLO / iDRAC)
- funktioniert auch wenn Windows kaputt ist
- für BIOS, Remote‑Konsole, Einschalten, Updates
- NICHT für Hyper‑V oder Windows‑Traffic
- NICHT VLAN‑fähig
- NICHT redundant

**2. In‑Band‑Management (vNIC im vSwitch)**

- läuft über die schnellen 25G‑Ports
- Teil des SET‑Teams → redundant
- VLAN‑fähig
- kann mit Cluster, Storage, Firewall interagieren
- ist das „echte“ Windows‑Management

Darum braucht man **beides**:

- 1G → Notfall & Hardware‑Management
- vNIC → normales Windows‑/Hyper‑V‑Management

## Grafik
![Local image](/einfache_erklärung_server_nic.png)
---

## 🔗 2. SET‑Team (NIC‑Bündelung)

NIC2 und NIC3 werden zu einem **SET‑Team** zusammengefasst.

Das bedeutet:

- Mehr Geschwindigkeit (25G + 25G = 50G)
- Redundanz (wenn eine NIC ausfällt, läuft alles weiter)
- Hyper‑V sieht nur **eine große NIC**

---

## 🌐 3. vSwitch (virtueller Switch)

Auf dem SET‑Team wird ein **vSwitch** erstellt.

Der vSwitch ist wie ein **virtueller Netzwerk‑Verteiler** im Server.

Er verteilt den gesamten Traffic:

- zu den VMs
- zu den virtuellen NICs des Hosts
- zu den VLANs
- zum Core‑Switch

---

## 🏷️ 4. VLANs auf dem Switch

**Wichtig:**

VLANs werden **immer auf dem physischen Switch** erstellt, nicht im Server.

Beispiel:

- VLAN 10 → Management
- VLAN 20 → Server‑VMs
- VLAN 30 → Storage
- VLAN 40 → Cluster
- VLAN 50 → Live Migration

Die Ports, an denen NIC2 und NIC3 hängen, werden als **Trunk‑Ports** konfiguriert.

Ein Trunk‑Port lässt **alle VLANs gleichzeitig** durch.

---

## 🧠 5. vNICs für den Host

Der Hyper‑V Host braucht eigene virtuelle Netzwerkkarten (vNICs), z. B.:

- vNIC‑Management → VLAN 10
- vNIC‑Cluster → VLAN 40
- vNIC‑LiveMigration → VLAN 50
- vNIC‑Storage → VLAN 30

Diese vNICs hängen am vSwitch und bekommen **eigene IP‑Adressen**.

---

## 🖥️ 6. VLANs für die VMs

Die VMs bekommen **keine vNICs**, sondern **VM‑Adapter**.

Jede VM bekommt ihr eigenes VLAN:

- VM1 → VLAN 20
- VM2 → VLAN 20
- VM3 → VLAN 30

Der Host selbst bekommt **keine IP in VLAN 20**, weil VLAN 20 nur für die VMs ist.

---

## 🎯 Kurz zusammengefasst

- VLANs entstehen **auf dem Switch**
    - NIC2 + NIC3 werden zu einem **SET‑Team**
    - Der **vSwitch** sitzt auf dem SET‑Team
    - Der Switch‑Port ist ein **Trunk** (alle VLANs erlaubt)
    - Der Host bekommt **vNICs** für Management, Cluster, Storage, Live Migration
    - Die VMs bekommen **VLAN‑Tags**, aber der Host nicht
    - VLAN 20 ist **nur für die VMs**, nicht für den Host
