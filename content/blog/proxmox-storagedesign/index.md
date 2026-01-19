

# 📘 Proxmox Netzwerk- & Storage-Design
*Dokumentation für Infrastruktur- und Cluster-Vorbereitung*

---

## 1. Überblick

Diese Dokumentation beschreibt die empfohlene Architektur für eine Proxmox-Umgebung mit:

- 2× NVMe 512 GB (interner Storage)
- externem Storage (NFS, iSCSI oder Ceph)
- Bonding + Bridges + VLAN-Design
- Cluster-Vorbereitung

---

## 2. Interner Storage (2× NVMe 512 GB)

### Installation (Proxmox-Installer)

Die beiden NVMe-Disks werden als:

- ZFS RAID1 konfiguriert
- Pool-Name: `rpool`

### Ergebnis der Installation

| Dataset | Zweck |
|--------|--------|
| `rpool/ROOT/pve-1` | Proxmox Betriebssystem |
| `rpool/data` | lokaler VM-Storage (optional) |
| `/var/lib/vz` | ISOs, Templates, Backups |

**Hinweis:**  
Das OS-RAID wird nur im Installer erstellt, nicht in der GUI.

---

## 3. Externes Storage

### Häufig genutzte Varianten

#### A) NFS (TrueNAS, Synology, QNAP)

- am weitesten verbreitet
- einfach einzubinden
- ideal für VM-Disks
- ideal für Cluster-Shared-Storage
- benötigt 10Gbit für gute Performance

#### B) iSCSI (SAN-ähnlich)

- blockbasiert
- sehr schnell
- ideal für LVM-Thin-Storage
- häufig in professionellen Umgebungen

#### C) Ceph (für echte Cluster)

- verteilt
- hochverfügbar
- selbstheilend
- benötigt mindestens 3 Nodes
- Enterprise-Standard für HA-Cluster

---

## 4. Netzwerkdesign

### Bonding (2× 10Gbit)

Beide 10Gbit-Ports werden zu einem Bond (LACP) zusammengefasst.

Vorteile:

- Redundanz
- 20Gbit Aggregation
- saubere Layer-2-Topologie
- ideal für Storage-Traffic

---

## 5. Bridges & VLAN-Design

Auf dem Bond werden mehrere Bridges erstellt.  
Jede Bridge kann ein eigenes Netz/VLAN tragen und optional eine eigene IP erhalten.

### Empfohlene Struktur

| Bridge | Zweck | IP | VLAN |
|--------|--------|------|------|
| vmbr0 | Management | 192.168.x.x | mgmt-vlan |
| vmbr1 | Storage | 10.10.x.x | storage-vlan |
| vmbr2 | VM-Netz | keine IP | vm-vlan |
| vmbr3 | Backup | 10.20.x.x | backup-vlan |

### Wichtig

- vmbr0 ist nicht automatisch das Storage-Netz
- Storage-Traffic sollte immer getrennt vom Management-Netz laufen
- Proxmox nutzt die IP der Bridge, nicht die physische NIC

---

## 6. Externes Storage anbinden (GUI)

### Pfad:

```
Datacenter → Storage → Add
```

### Beispiele

#### NFS

- Server: `10.10.20.20`
- Export: `/mnt/vmstore`
- Content: Disk image, Container, ISO, Backup
- Nodes: alle Nodes

#### iSCSI

- Target: `iqn.2024-01.truenas:target1`
- Content: Disk image
- LUNs: automatisch

---

## 7. Zusätzliche Disks (z. B. 6 weitere NVMe)

Proxmox erkennt alle Disks automatisch.

### RAID-Konfiguration in der GUI

```
Node → Disks → ZFS → Create: ZFS
```

Mögliche RAID-Level:

- RAID10
- RAIDZ1
- RAIDZ2
- RAIDZ3

**Best Practice:**  
OS-Disks getrennt lassen → zusätzliche Disks für VM-Storage nutzen.

---

## 8. Best-Practice Architektur

### Interne NVMe (2× 512 GB)

- ZFS RAID1 für OS
- lokaler Storage für ISOs, Templates, Backups

### Externes Storage (NFS/iSCSI)

- VM-Disks
- Shared Storage für Cluster
- HA-fähig
- Live-Migration möglich

### Netzwerk

- Bond0 (2× 10Gbit)
- mehrere Bridges für Management, Storage, VM-Netz, Backup

---

## 9. Fazit

Diese Architektur ist:

- realistisch
- skalierbar
- clusterfähig
- dokumentierbar
- ideal für Proxmox-Labs und produktive KMU-Umgebungen

Sie bildet die Grundlage für:

- HA-Cluster
- Ceph-Storage
- PBS-Backups
- Multi-Node-Infrastrukturen
