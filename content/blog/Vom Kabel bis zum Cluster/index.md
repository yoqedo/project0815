---
title: "Proxmox VE 8 Installation – Schritt für Schritt"
description: "Installation von Proxmox VE 8 auf einem Bare-Metal Server inklusive Grundkonfiguration."
date: 2026-01-05
tags: ["Proxmox", "Virtualisierung", "Homelab", "Linux"]
---

# 🧩 Übersicht
In diesem Artikel installiere ich **Proxmox VE 8** auf einem Bare-Metal Server und führe die grundlegende Konfiguration durch.  
Der Fokus liegt auf einer **klaren, reproduzierbaren Installation**, wie sie in Homelabs oder Testumgebungen üblich ist.

---

# 🔧 Voraussetzungen

- Bare-Metal Server (z. B. Hetzner AX-Serie oder eigener PC)
- Proxmox VE 8 ISO
- Zugriff auf das Server-Management (IPMI, iKVM, Hetzner Rescue)
- Internetverbindung
- Grundkenntnisse in Linux

---

# 🛠️ Schritt 1 – Proxmox ISO herunterladen

Die aktuelle ISO findest du auf der offiziellen Seite:


Wähle **Proxmox VE 8 ISO Installer**.
https://www.proxmox.com/en/downloads

---

# 🛠️ Schritt 2 – Server in Rescue / iKVM starten

Je nach Anbieter:

- **Hetzner** → Rescue Mode aktivieren  
- **Eigenes Gerät** → iKVM / USB-Stick  
- **Dell/HP/Lenovo** → Remote Console öffnen  

Danach:

- ISO mounten  
- Server neu starten  
- Installer bootet automatisch

---

# 🛠️ Schritt 3 – Proxmox Installation starten

Im Installer:

1. „Install Proxmox VE“ auswählen  
2. Lizenzbedingungen akzeptieren  
3. Ziel-Festplatte auswählen  
4. Dateisystem: **ext4** oder **ZFS (RAID)**  
5. Region & Tastatur wählen  
6. Root-Passwort setzen  
7. Management-IP konfigurieren

**Hinweis:**  
Die Management-IP ist später die Adresse der Weboberfläche.

---

# 🛠️ Schritt 4 – Netzwerk konfigurieren

Proxmox erstellt automatisch:

- `vmbr0` → Bridge für Management  
- `eno1` → physische NIC

Beispielkonfiguration:
IP: 192.168.10.10 Netmask: 255.255.255.0 Gateway: 192.168.10.1 DNS: 192.168.10.1


---

# 🧪 Tests & Validierung

Nach dem ersten Boot:

1. Webinterface öffnen 
https://192.168.10.10:8006 (192.168.10.10 in Bing)

2. Login mit:
User: root Realm: PAM

3. Prüfen:
- Node sichtbar
- Storage korrekt eingebunden
- Netzwerk korrekt konfiguriert
- Updates verfügbar

---

# 🩺 Troubleshooting

## Problem 1: Webinterface nicht erreichbar
**Lösung:**
- Prüfen, ob Port 8006 offen ist  
- Prüfen, ob die IP korrekt gesetzt wurde  
- `systemctl restart pveproxy` ausführen  

## Problem 2: Kein Netzwerk nach Installation
**Lösung:**
- `/etc/network/interfaces` prüfen  
- Bridge korrekt konfiguriert?  
- Falsche NIC? (z. B. `eno1` vs. `ens18`)  

## Problem 3: ISO wird nicht erkannt
**Lösung:**
- iKVM neu starten  
- ISO erneut mounten  
- Bootreihenfolge prüfen  

---

# 📦 Zusammenfassung

In diesem Artikel habe ich:

- Proxmox VE 8 heruntergeladen  
- Das ISO über Rescue/iKVM gebootet  
- Proxmox installiert  
- Netzwerk & Management-IP konfiguriert  
- Die Weboberfläche getestet  
- Typische Fehler behoben  

Damit ist der Server bereit für:

- VLAN-Konfiguration  
- Firewall (pfSense/OPNsense)  
- Windows Server VMs  
- Storage & Backup  
- Cluster (optional)

---

# 📚 Weiterführende Artikel

- [Proxmox VLAN-Konfiguration](#)
- [pfSense als Firewall in Proxmox](#)
- [Windows Server 2022 auf Proxmox installieren](#)
