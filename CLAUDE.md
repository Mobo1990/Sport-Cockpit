# Sport Cockpit – Projektwissen für Claude Code

Persönliche PWA „Duo“ (früher „Sport Cockpit“): Push/Pull/Legs-Training, Cardio, Ernährung, Gamification für Michell und Pauline. Icon: Schriftzug „duo“ (Fraunces 900, o mit Herz-Loch) auf Creme.
Live: https://mobo1990.github.io/Sport-Cockpit/ (GitHub Pages, Branch `main`, Ordner `/`; Groß-/Kleinschreibung zählt, `/sport-cockpit/` ergibt 404).

## Sprache & Stil
- UI-Texte und Kommunikation auf **Deutsch**, kurz und direkt.
- Design: hell (warmes Weiß `#f3f2ee`), weiße Karten mit weichem Schatten, Tinte `#111214`, ein Akzent Zinnober `#ff4b26`. Schrift Barlow Condensed (Zahlen/Überschriften) + Barlow. Keine Emoji-Icons in der UI.

## Aufbau
- Kein Build-Schritt: reines HTML/CSS/JS. `index.html` lädt klassische Skripte aus `js/` in fester Reihenfolge
  (data → training → cheer → nutrition → smart → sync → game → workout → moves → guide → share → weekly → board → rewards → home → onboarding → gym → coach → review → photo → voice → advent → main).
  Sie teilen sich den globalen Gültigkeitsbereich (top-level `const`/`let`/`function`).
- `js/training.js` enthält Zustand `S`, Speicher (`persist`, `lsSave`) und `render()`; `js/gym.js` überschreibt `render` als Wrapper.
- Daten: zuerst `localStorage`, dann Sync mit **Home Assistant** per WebSocket (`frontend/get_user_data` / `set_user_data`,
  Schlüssel `sc_meta`, `sc_sessions`, `sc_nut`). Zusammenführen in `merge()` (`js/sync.js`).
- HA-Seite (nicht im Repo, in Michells HA angelegt): `input_text.sport_cockpit_<name>` (Tageswerte-JSON),
  `input_number.sport_cockpit_<name>_{schritte,aktiv_kcal,gewicht,trainingsminuten}` (Apple Health per Kurzbefehl),
  Skript `script.sport_cockpit_meldung` (Push an Partner), Liste `todo.sport_cockpit_geteiltes_essen` (geteiltes Essen, Beschreibung = JSON),
  `rest_command.sport_cockpit_food_search` (Lebensmittelsuche), `script.sport_cockpit_health` (Apple-Health-Werte),
  `script.sport_cockpit_sprache` (Siri-Diktat -> To-do-Liste, {kind:"say"}), Automation „Sport Cockpit – Tagesauswertung 22 Uhr“.
- Service Worker `sw.js`: bei jeder Änderung an ausgelieferten Dateien `VERSION` hochzählen und neue Dateien in `SHELL` eintragen.

## Arbeitsweise
- Nach Änderungen immer testen: `python3 tests/e2e_test.py` (braucht `pip install playwright websockets` + `python -m playwright install chromium`).
  Startet Webserver + nachgebauten HA (`tests/mock_ha.py`) und prüft die Hauptabläufe. Läuft auch als GitHub Action.
- Neue Features bekommen eine Prüfung im E2E-Test.
- Keine Zugangsdaten ins Repo: HA-Token und Anthropic-API-Schlüssel liegen nur im `localStorage` des Geräts.
- Kleine, beschriebene Commits auf `main` (Pages veröffentlicht automatisch).
