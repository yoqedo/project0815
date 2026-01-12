---
title: "Cluster verstehen: Wie zwei Hosts wirklich zusammenarbeiten"
date: "2025-12-5"
description: "Bevor zwei Hyper‑V‑Hosts als Cluster zusammenarbeiten können, müssen sie sich zuverlässig austauschen können – über mehrere getrennte Netzwerkpfade, die jeweils eine ganz bestimmte Aufgabe erfüllen."
tags: ["Cluster", "Hyper-V", "Infrastruktur", "VLAN", "Grundlagen"] 
---

## 🔍 Einleitung
Bevor zwei Hyper‑V‑Hosts als Cluster zusammenarbeiten können, müssen sie sich zuverlässig austauschen können – über mehrere getrennte Netzwerkpfade, die jeweils eine ganz bestimmte Aufgabe erfüllen. Ein Cluster funktioniert nur dann stabil, wenn diese Kommunikationswege sauber getrennt, klar definiert und physisch wie logisch korrekt aufgebaut sind.
In diesem Beitrag schauen wir uns an, wie zwei Hyper‑V‑Hosts miteinander sprechen, welche VLANs dafür notwendig sind und welche Rolle Heartbeat, Live Migration, Storage‑Traffic und Quorum im täglichen Betrieb spielen. Wenn du diese Grundlagen verstehst, verstehst du auch, warum ein Cluster stabil läuft – oder warum er im Fehlerfall richtig reagiert.

## 🧱 1. Was ist ein Cluster?

Ein Cluster ist eine Gruppe von Servern, die sich wie **ein einziger großer Server** verhalten.

- Wenn ein Host ausfällt → übernimmt der andere
- Wenn du eine VM verschiebst → läuft sie weiter
- Wenn du Updates machst → kein Ausfall

Ein Cluster ist wie ein **Team aus Gehirnen**, das sich gegenseitig absichert.

---

## 🔗 2. Was brauchen zwei Hosts, um ein Cluster zu bilden?

Sie brauchen:

| Funktion | VLAN | Zweck |
| --- | --- | --- |
| Cluster Heartbeat | VLAN 40 | Prüft, ob der andere Host lebt |
| Live Migration | VLAN 50 | Verschiebt VMs ohne Unterbruch |
| Storage | VLAN 30 | Gemeinsamer Speicher (SMB3, iSCSI) |
| Management | VLAN 10 | Zugriff auf die Host |
| Quorum | VLAN 60 | Cluster-Entscheidungen bei Ausfall |

Diese VLANs müssen **auf dem Switch existieren**, und die Hosts müssen **vNICs** dafür haben.

---

## 🧠 3. Wie funktioniert Live Migration?

Live Migration bedeutet:

- Eine VM läuft auf Host A
- Du verschiebst sie auf Host B
- Die VM läuft **weiter**, ohne Unterbruch

Dafür braucht es:

- VLAN 50
- vNIC‑LiveMigration auf beiden Hosts
- Genug Bandbreite (25G empfohlen)
- Gemeinsamen Speicher oder Shared‑Nothing

---

## 💓 4. Was ist Cluster Heartbeat?

Die Hosts senden sich regelmäßig kleine Pakete:

„Bist du noch da?“

„Ja, ich bin da.“

„Okay, alles gut.“

Wenn ein Host **nicht mehr antwortet**, übernimmt der andere.

Das läuft über VLAN 40 → vNIC‑Cluster

---

## 📦 5. Was ist Storage‑Traffic?

Die VMs liegen auf einem gemeinsamen Speicher:

- SMB3 (File‑Share)
- iSCSI (Block‑Storage)
- CSV (Cluster Shared Volume)

Der Storage‑Traffic läuft über VLAN 30 → vNIC‑Storage

Er braucht **sehr viel Bandbreite** → 25G oder mehr

---

## ⚖️ 6. Was ist Quorum?

Quorum entscheidet:

- „Darf der Cluster noch laufen?“
- „Wer hat das letzte Wort?“
- „Was passiert bei Ausfall?“

Du brauchst:

- Witness (z. B. File‑Share oder Cloud)
- VLAN 60 → vNIC‑Quorum

---
