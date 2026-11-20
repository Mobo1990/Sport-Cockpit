# Sport Cockpit

Persönliche Web-App (PWA) für Push/Pull/Legs-Training, Cardio und Ernährung.

- **Training:** Plan je Tag, Varianten mit Piktogrammen, automatische Steigerung (Doppelte Progression, leicht/passt/hart), Aufwärmsätze, Scheibenrechner, Satzpausen-Timer, Bestwerte, assistierte Übungen (kg = Hilfe)
- **Cardio:** eigener Tag oder nach dem Krafttraining, Wochenziel in Minuten
- **Ernährung:** Tagebuch nach Mahlzeiten, Suche in eingebauten Richtwerten + [Open Food Facts](https://world.openfoodfacts.org), Barcode-Scanner, eigene Produkte, Vorlagen, Ziele (Aufbau/Halten/Definieren), Gewichtskurve mit 7-Tage-Schnitt
- **Kraft:** Muskel-Karte (Sätze pro Muskel und Woche), Kraftverlauf je Übung

## Daten

Alles wird zuerst lokal auf dem Gerät gespeichert und – wenn eingerichtet – mit **Home Assistant** synchronisiert
(WebSocket, `frontend/set_user_data`, Schlüssel `sc_meta`, `sc_sessions`, `sc_nut`, pro HA-Benutzer).
Im Code stehen keine Zugangsdaten; Adresse und Token werden nur auf dem Gerät gespeichert.

## Einrichten

1. Öffnen: `https://mobo1990.github.io/sport-cockpit/`
2. iPhone: Safari → Teilen → **Zum Home-Bildschirm**
3. In der App: **Mehr → Home Assistant** – Nabu-Casa-Adresse und ein langlebiges Zugriffstoken eintragen

## Entwicklung

Reines HTML/CSS/JS ohne Build. Lokal: `python3 -m http.server` im Ordner.
Nach Änderungen in `sw.js` die `VERSION` erhöhen, damit installierte Apps aktualisieren.
