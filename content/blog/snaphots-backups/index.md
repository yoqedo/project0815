# Snapshots & Backups – der unterschätzte Unterschied  
## Warum viele Labs scheitern, bevor sie überhaupt anfangen

In modernen Homelabs und kleinen IT‑Umgebungen taucht immer wieder dieselbe Frage auf:  
**„Reichen Snapshots nicht als Backup?“**

Die ehrliche Antwort lautet: *Nein – und zwar aus mehreren Gründen.*

Snapshots und Backups werden oft verwechselt, weil beide „irgendwie“ den Zustand eines Systems sichern.  
Aber technisch, konzeptionell und strategisch sind sie grundverschieden.  
Wer das nicht versteht, baut sich eine Infrastruktur, die stabil wirkt – bis sie es plötzlich nicht mehr ist.

Dieser Beitrag erklärt die Unterschiede, zeigt typische Missverständnisse und beschreibt, wie ich das Thema im Rahmen von **Project0815** umsetze.

---

## 1. Was ein Snapshot wirklich ist  
### Copy‑on‑Write, Metadaten und Illusionen von Sicherheit

Ein Snapshot ist **kein vollständiger Klon** deiner Daten.  
Er ist eine Art „Zeitmarke“, die festhält, wie das Dateisystem zu einem bestimmten Zeitpunkt aussah.

Technisch passiert Folgendes:

- Das Dateisystem (z. B. ZFS oder Btrfs) friert den aktuellen Zustand ein  
- Neue Änderungen werden **woanders** geschrieben  
- Der Snapshot zeigt weiterhin auf die alten Blöcke  
- Dadurch entsteht ein „virtueller“ Zustand der Vergangenheit

**Snapshots sind ideal für:**

- Updates testen  
- Konfigurationsfehler rückgängig machen  
- Rollbacks in Sekunden  
- Versionierung von Daten

Aber sie haben klare Grenzen.

---

## 2. Warum Snapshots keine Backups sind  
### Die drei großen Missverständnisse

#### ❌ Missverständnis 1: „Ein Snapshot schützt mich vor Datenverlust“
Nein.  
Wenn das zugrunde liegende Storage stirbt, sterben alle Snapshots mit.

#### ❌ Missverständnis 2: „Snapshots sind wie Backups, nur schneller“
Sie sind schneller – aber nur, weil sie **keine echten Kopien** sind.

#### ❌ Missverständnis 3: „Snapshots schützen vor Ransomware“
Wenn Ransomware das Dateisystem erreicht, erreicht sie auch die Snapshots.  
Viele Angriffe löschen Snapshots sogar gezielt.

---

## 3. Was ein Backup wirklich ist  
### Eine unabhängige, vollständige Kopie – und das ist entscheidend

Ein Backup ist:

- **physisch oder logisch getrennt**  
- **vollständig kopiert**  
- **unabhängig vom Originalsystem**  
- **wiederherstellbar, selbst wenn alles andere kaputt ist**

Backups können sein:

- Offsite (Cloud, externes Storage)  
- Offline (USB, Tape, Cold Storage)  
- Immutable (Write‑Once‑Read‑Many)  
- Versioniert (mehrere Generationen)

Backups sind manchmal langsam und unbequem –  
aber sie sind das Einzige, was dich rettet, wenn wirklich alles schiefgeht.

---

## 4. Snapshots + Backups: Das perfekte Duo  
### Warum du beides brauchst

Snapshots sind für **Schnelligkeit**.  
Backups sind für **Überleben**.

| Aufgabe | Snapshot | Backup |
|--------|----------|--------|
| Schnell zurückrollen | ✔ | ✖ |
| Schutz vor Storage‑Ausfall | ✖ | ✔ |
| Schutz vor versehentlichem Löschen | ✔ | ✔ |
| Schutz vor Ransomware | ✖ | ✔ |
| Versionierung | ✔ | ✔ |
| Offsite‑Kopie | ✖ | ✔ |

Die Kombination ist unschlagbar:

- Snapshots für tägliche Arbeit  
- Backups für Katastrophen  

---

## 5. Wie ich das in Project0815 umsetze  
### Meine persönliche Strategie für ein realistisches Homelab

Da Project0815 eine **professionelle, audit‑fähige Lernumgebung** ist, setze ich auf ein zweistufiges Modell:

---

### **Stufe 1: Snapshots (lokal, schnell, automatisiert)**

- ZFS Snapshots alle 6 Stunden  
- Retention: 7 Tage  
- Automatisches Pruning  
- Wöchentliche Rollback‑Tests  

**Zweck:**  
Fehler, Updates, Konfigurationsänderungen sofort rückgängig machen.

---

### **Stufe 2: Backups (extern, getrennt, sicher)**

- Tägliche Backups auf getrenntes Storage  
- Wöchentliche Offsite‑Backups  
- Monatliche „Cold Storage“-Backups  
- Regelmäßige Restore‑Tests  

**Zweck:**  
Katastrophenschutz, Ransomware‑Resilienz, langfristige Datenintegrität.

---

## 6. Die wichtigste Erkenntnis  
### Snapshots sind Komfort – Backups sind Pflicht

Snapshots geben dir Geschwindigkeit.  
Backups geben dir Sicherheit.

Wer nur Snapshots nutzt, baut eine Infrastruktur, die stabil wirkt, aber bei einem echten Ausfall komplett kollabiert.  
Wer nur Backups nutzt, arbeitet unnötig langsam und unflexibel.

Die Kombination ist der Sweet Spot – und genau das ist der Ansatz, den ich in Project0815 verfolge:  
**realistisch, professionell, und für Anfänger verständlich.**

---

## 7. Fazit

Snapshots sind ein mächtiges Werkzeug – aber sie sind kein Backup.  
Sie sind ein Teil einer guten Strategie, nicht die Strategie selbst.

Wenn du dein Homelab oder deine kleine IT‑Umgebung wirklich robust machen willst, brauchst du:

- schnelle Snapshots  
- echte Backups  
- klare Retention‑Policies  
- regelmäßige Restore‑Tests  

Nur dann ist deine Umgebung nicht nur modern, sondern auch widerstandsfähig.

---
