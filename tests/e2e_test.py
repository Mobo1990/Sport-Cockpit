"""End-to-End-Test für das Sport Cockpit.
Startet einen lokalen Webserver und einen nachgebauten Home Assistant, spielt die
wichtigsten Abläufe im Browser durch und bricht bei Fehlern ab.
Aufruf:  python3 tests/e2e_test.py"""
import json, os, subprocess, sys, time, pathlib
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
procs = [subprocess.Popen([sys.executable, "-m", "http.server", "8765"], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL),
         subprocess.Popen([sys.executable, str(ROOT / "tests" / "mock_ha.py")], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)]
for f in ("/tmp/calls.log", "/tmp/store.json"):
    if os.path.exists(f): os.remove(f)
time.sleep(1.5)
ok = 0
def check(cond, msg):
    global ok
    if not cond: raise AssertionError(msg)
    ok += 1; print("  ✓", msg)

AI_REPLY = {"content": [{"type": "text", "text": json.dumps({"art": "teller", "items": [
    {"name": "Hähnchenbrust", "g": 180, "kcal100": 165, "p100": 31, "c100": 0, "f100": 3.6},
    {"name": "Reis gekocht", "g": 200, "kcal100": 130, "p100": 2.7, "c100": 28, "f100": 0.3}]})}]}

try:
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": 400, "height": 860})
        errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.route("https://api.anthropic.com/**", lambda r: r.fulfill(status=200, content_type="application/json", body=json.dumps(AI_REPLY)))
        pg.goto("http://localhost:8765/"); pg.evaluate("localStorage.clear()"); pg.reload(); pg.wait_for_timeout(500)

        print("Onboarding")
        check(pg.is_visible(".ob"), "Profil-Pflicht beim ersten Start")
        pg.click("[data-ob=go]"); check("ausfüllen" in pg.text_content("#obmsg"), "Ohne Angaben geht es nicht weiter")
        for k, v in [("name", "Michell"), ("year", "1990"), ("height", "182"), ("weight", "85")]: pg.fill("#p_" + k, v)
        pg.click("[data-ob=go]"); pg.wait_for_timeout(300)
        check(pg.is_visible(".hero2"), "Startseite erscheint")
        check(pg.is_visible(".eatday") and "Kalorien" in pg.text_content(".eatday"), "Startseite: kompakte Essen-Zeile")
        check(pg.get_attribute("#sync", "data-st") == "", "Status-Punkt grau ohne Home Assistant")
        print("Challenges")
        check(pg.locator(".chi").count() == 3, "3 Coach-Challenges auf der Startseite")
        pt0 = int(pg.text_content(".pts b")); pg.click(".chi >> nth=0"); pg.wait_for_timeout(200)
        check(pg.locator(".chi.ok").count() == 1 and int(pg.text_content(".pts b")) > pt0, "Challenge abgehakt, Punkte steigen")
        pg.click(".chi >> nth=1"); pg.click(".chi >> nth=2"); pg.wait_for_timeout(200)
        check("Bonus" in pg.text_content(".chn") and "Alle Challenges" in pg.text_content(".chips"), "Alle 3 geschafft: Bonus")
        pg.click(".chi >> nth=2"); pg.wait_for_timeout(200)
        check(pg.locator(".chi.ok").count() == 2, "Haken lässt sich wieder entfernen")

        print("Home Assistant")
        pg.click(".nav >> text=Mehr"); pg.fill("#haUrl", "http://localhost:8123"); pg.fill("#haTok", "tok"); pg.click("[data-s=ha]"); pg.wait_for_timeout(2500)
        check("Synchronisiert" in pg.text_content("#sync"), "Sync mit HA")
        check(pg.get_attribute("#sync", "data-st") == "ok", "Status-Punkt grün nach Sync")

        print("Gym Mode")
        pg.click(".nav >> text=Start"); pg.click(".tile.big"); pg.wait_for_timeout(300)
        check(pg.is_visible("#gym.on"), "Gym Mode öffnet")
        pg.fill("#gkg", "80"); pg.fill("#grp", "8"); pg.click("[data-g=set]"); pg.wait_for_timeout(200)
        check("Satz 2" in pg.text_content(".gset"), "Satz 1 gespeichert, Satz 2 als Nächstes")
        pg.click("[data-g=rpe][data-r=m]")
        pg.click("[data-g=next]"); pg.wait_for_timeout(200)
        check("Übung 2" in pg.text_content(".gh"), "Wechsel zur nächsten Übung")
        pg.click("[data-g=close]"); pg.wait_for_timeout(200)
        check(not pg.is_visible("#gym.on"), "Gym Mode schließt")
        pg.click("text=Training abschließen"); pg.wait_for_timeout(2500)
        check("erledigt" in pg.text_content("#view").lower(), "Training abgeschlossen")
        calls = open("/tmp/calls.log").read()
        check("sport_cockpit_meldung" in calls, "Partner-Meldung an HA gesendet")
        check("input_text.sport_cockpit_michell" in calls, "Tageswerte an HA gesendet")

        print("Essen")
        pg.click(".nav >> text=Start"); pg.click("[data-h=meal][data-m=f]"); pg.fill("#fq", "skyr"); pg.wait_for_timeout(200)
        pg.click(".frow >> nth=0"); pg.click("[data-n=addit]"); pg.wait_for_timeout(200)
        check("Skyr" in pg.text_content("#view"), "Lebensmittel eingetragen")

        print("Foto-Erkennung")
        pg.click(".nav >> text=Mehr"); pg.fill("#aiKey", "sk-ant-test"); pg.click("[data-ais=save]")
        pg.click(".nav >> text=Essen"); pg.click("[data-n=add][data-m=m]")
        img = ROOT / "icons" / "icon-192.png"
        pg.set_input_files(".srch input[type=file]", str(img)); pg.wait_for_timeout(1500)
        check(pg.locator(".airow").count() == 2, "Foto erkannt: 2 Lebensmittel")
        pg.click("[data-ai=add]"); pg.wait_for_timeout(300)
        check("Hähnchenbrust" in pg.text_content("#view"), "Foto-Ergebnis eingetragen")

        print("Rückblick & Coach")
        pg.click(".nav >> text=Mehr"); pg.click("text=Rückblick"); pg.wait_for_timeout(200)
        check(pg.is_visible(".rvgrid"), "Rückblick zeigt Kennzahlen")
        pg.click(".nav >> text=Kraft"); pg.wait_for_timeout(200)
        check(pg.is_visible(".mm"), "Kraft-Tab mit Muskel-Karte")
        check(pg.is_visible(".mm .mleg") and not pg.is_visible(".dayrow"), "Muskel-Karte mit Legende, ohne Trainingstag-Kopf")

        print("Zweites Gerät")
        c2 = b.new_page(viewport={"width": 400, "height": 860}); c2.on("pageerror", lambda e: errs.append(str(e)))
        c2.goto("http://localhost:8765/"); c2.wait_for_timeout(300)
        c2.evaluate("localStorage.setItem('sc.ha',JSON.stringify({url:'http://localhost:8123',token:'tok'}))"); c2.reload(); c2.wait_for_timeout(3000)
        check(c2.is_visible(".hero2"), "Profil kommt per Sync mit (kein Onboarding)")
        check(c2.text_content(".tile.big").count("Pull") or "PULL" in c2.text_content(".tile.big").upper(), "Nächster Tag ist Pull")

        check(not errs, "Keine JavaScript-Fehler" + ("" if not errs else ": " + "; ".join(errs)))
        b.close()
finally:
    for pr in procs: pr.terminate()
print(f"\n{ok} Prüfungen bestanden")
