# Duo als iOS-App (Capacitor)

Die iOS-App ist dieselbe Web-App wie auf GitHub Pages, verpackt in eine native Hülle. Dazu kommen drei iPhone-Funktionen:

| Funktion | Plugin | Was es ersetzt |
| --- | --- | --- |
| Apple Health (Schritte, aktive kcal) | `@capgo/capacitor-health` | Kurzbefehl „Cockpit Health“ + Webhook |
| Spracherkennung | `@capgo/capacitor-speech-recognition` | Browser-Spracherkennung (stürzt in der Homescreen-App ab) |
| Barcode-Scanner | `@capacitor/barcode-scanner` | Scanner im Browser (html5-qrcode) |

Die Brücke steht in `js/native.js`. Im Browser und in der Homescreen-App macht sie nichts.
Home Assistant bleibt vorerst das Backend (Phase 1 der Roadmap).

## Einmalig am Mac

1. **Xcode** aus dem App Store installieren und einmal öffnen (Zusatzkomponenten installieren lassen).
2. **Node.js** installieren: <https://nodejs.org> → LTS-Version.
3. Terminal öffnen und das Projekt holen:
   ```bash
   git clone https://github.com/Mobo1990/Sport-Cockpit.git
   cd Sport-Cockpit
   git checkout ios-app
   npm install
   ```

## App bauen und aufs iPhone bringen

```bash
npm run ios
```

Das kopiert die Web-Dateien nach `www/`, aktualisiert das Xcode-Projekt und öffnet Xcode.

In Xcode:

1. Links oben auf **App** (blaues Symbol) → Reiter **Signing & Capabilities**.
2. **Team**: deine Apple-ID wählen (ohne Developer-Konto: „Personal Team“).
3. **Bundle Identifier** ggf. ändern, falls `app.duo.fit` vergeben ist, z. B. `de.<deinname>.duo`.
4. Prüfen, dass unter den Capabilities **HealthKit** steht. Fehlt es: **+ Capability** → **HealthKit**.
5. iPhone per Kabel anschließen, oben als Ziel auswählen, **▶︎** drücken.
6. Beim ersten Mal auf dem iPhone: **Einstellungen → Allgemein → VPN und Geräteverwaltung** → deiner Apple-ID vertrauen.
   Außerdem muss auf dem iPhone der **Entwicklermodus** an sein (Einstellungen → Datenschutz & Sicherheit).

Beim ersten Start fragt die App nach Apple Health. Danach: Duo verbinden wie gewohnt (Mehr → Home Assistant, oder Verbindungscode einfügen).

## Gut zu wissen

- **Ohne Developer-Konto** läuft die App 7 Tage, danach einfach wieder per Kabel mit ▶︎ aufspielen.
  Ob HealthKit mit einem kostenlosen „Personal Team“ freigeschaltet wird, zeigt sich in Schritt 4. Falls nicht: HealthKit braucht dann das Developer-Konto.
- **Nach Änderungen an der Web-App**: `npm run sync`, dann in Xcode ▶︎.
- **Push-Nachrichten** der App selbst kommen erst mit dem Developer-Konto (Apple verlangt dafür ein bezahltes Konto).
- Die Web-App auf GitHub Pages ist davon nicht betroffen.
