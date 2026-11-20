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
        off_calls = []
        OFF_REPLY = {"products": [{"code": "4001", "product_name": "Testriegel Kakao", "brands": "Marke", "nutriments": {"energy-kcal_100g": 380, "proteins_100g": 30, "carbohydrates_100g": 40, "sugars_100g": 5, "fat_100g": 9}}]}
        def off_route(r):
            off_calls.append(r.request.url); r.fulfill(status=200, content_type="application/json", body=json.dumps(OFF_REPLY))
        pg.route("https://world.openfoodfacts.org/**", off_route)
        OFF = {"busy": False}
        def off_route2(r):
            off_calls.append(r.request.url)
            if OFF["busy"]: r.fulfill(status=200, content_type="text/html", body="<!DOCTYPE html><title>Page temporarily unavailable</title>")
            else: r.fulfill(status=200, content_type="application/json", body=json.dumps(OFF_REPLY))
        pg.unroute("https://world.openfoodfacts.org/**"); pg.route("https://world.openfoodfacts.org/**", off_route2)
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
        print("Tagesziele")
        check(pg.is_visible(".dgoals") and "2 l" in pg.text_content(".dgoals"), "Tagesziele Wasser/Schritte auf der Startseite (Standard 2 l)")
        pg.click(".nav >> text=Mehr"); pg.fill("#p_wgoal", "1"); pg.fill("#p_sgoal", "8000"); pg.click(".nav >> text=Start"); pg.wait_for_timeout(200)
        check("/ 1 l" in pg.text_content(".dgoals") and "8.000" in pg.text_content(".dgoals"), "Eigene Ziele aus dem Profil")
        pt0 = int(pg.text_content(".pts b")); pg.click(".dg [data-h=water][data-v='500']"); pg.click(".dg [data-h=water][data-v='500']"); pg.wait_for_timeout(200)
        check("Wasserziel +10" in pg.text_content(".chips") and int(pg.text_content(".pts b")) == pt0 + 10, "Wasserziel erreicht: +10")
        pg.fill("#hSt", "8500"); pg.click("[data-h=steps]"); pg.wait_for_timeout(200)
        check("Schrittziel +10" in pg.text_content(".chips"), "Schritte eingetragen, Schrittziel +10")
        print("Alkoholfrei")
        check(pg.is_visible(".afc") and "0" == pg.text_content(".afn b"), "Alkoholfrei-Karte, Serie 0")
        pg.click(".afb [data-af] >> nth=1"); pg.wait_for_timeout(150); pg.click(".afbtn"); pg.wait_for_timeout(200)
        check(pg.text_content(".afn b") == "2" and "Alkoholfrei Tag 2 +6" in pg.text_content(".chips"), "Gestern + heute: Serie 2, heute +6")
        check(pg.locator(".afb [data-af]").count() == 1, "Gestern-Knopf verschwindet nach Eintrag")
        pg.evaluate("for(let i=2;i<7;i++){ND(dayShift(today(),-i)).af=1};render()")
        check(pg.text_content(".afn b") == "7" and "+31" in pg.text_content(".chips"), "7 Tage: +11 und Meilenstein +20")
        pg.click(".afbtn"); pg.wait_for_timeout(150)
        check(pg.text_content(".afn b") == "6" and "Alkoholfrei" not in pg.text_content(".chips"), "Heute wieder austragen")
        print("Kurz-Workout")
        pg.evaluate("woStart('core','wo_core')"); pg.wait_for_timeout(200)
        check(pg.is_visible("#wo.on") and "Gleich" in pg.text_content(".won"), "Workout-Timer startet mit Vorbereitung")
        pg.click("[data-wo-a=skip]"); check("Unterarmstütz" in pg.text_content(".won"), "Erste Übung: Unterarmstütz")
        pg.click("[data-wo-a=pause]"); t1 = pg.text_content("#woT"); pg.wait_for_timeout(1300)
        check(pg.text_content("#woT") == t1, "Pause hält den Timer an")
        while pg.is_visible("[data-wo-a=skip]"): pg.click("[data-wo-a=skip]")
        check("Geschafft" in pg.text_content("#wo"), "Workout beendet")
        check("wo_core" in pg.evaluate("JSON.stringify(S.nut.days[today()].ch)"), "Workout-Challenge automatisch abgehakt")
        pg.click("#wo [data-wo-a=close]"); check(not pg.is_visible("#wo.on"), "Workout-Ansicht schließt")

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

        print("Walking Pad")
        pg.click(".nav >> text=Training"); pg.click("[data-a=day][data-d=cardio]"); pg.wait_for_timeout(200)
        if not pg.is_visible("select[data-f=type]"): pg.click("[data-a=cadd]"); pg.wait_for_timeout(150)
        pg.select_option("select[data-f=type] >> nth=0", label="Walking Pad · 7 % Steigung"); pg.wait_for_timeout(200)
        check(pg.is_visible("[data-f=kmh]") and "pro Stunde" in pg.text_content(".wpk"), "Walking Pad: Tempo-Feld und kcal pro Stunde")
        pg.fill("[data-f=min] >> nth=0", "30"); pg.fill("[data-f=kmh]", "4"); pg.wait_for_timeout(150)
        check("≈ 237 kcal" in pg.text_content(".wpk"), "30 min, 4 km/h, 85 kg: ≈ 237 kcal (ACSM)")
        pg.click("text=Training abschließen"); pg.wait_for_timeout(1500)
        check(pg.evaluate("S.sessions.some(s=>(s.cardio||[]).some(c=>c.kcal===237&&c.kmh===4&&c.km===2))"), "Einheit mit kcal, Tempo und Strecke gespeichert")
        print("Essen")
        pg.click(".nav >> text=Start"); pg.click("[data-h=meal][data-m=f]"); pg.fill("#fq", "skyr"); pg.wait_for_timeout(200)
        pg.click(".frow >> nth=0"); pg.click("[data-n=addit]"); pg.wait_for_timeout(200)
        check("Skyr" in pg.text_content("#view"), "Lebensmittel eingetragen")
        print("Suche")
        pg.click(".nav >> text=Start"); pg.click("[data-h=meal][data-m=f]"); pg.wait_for_timeout(150)
        pg.evaluate("window.__fq = document.getElementById('fq')")
        pg.type("#fq", "hahnchen", delay=20); pg.wait_for_timeout(100)
        check(pg.evaluate("window.__fq === document.getElementById('fq')"), "Suchfeld bleibt beim Tippen bestehen (Tastatur springt nicht)")
        check("Hähnchen" in pg.text_content("#fres"), "Suche ohne Umlaut findet Hähnchen")
        pg.fill("#fq", "brust hahn"); pg.wait_for_timeout(100)
        check("Hähnchen" in pg.text_content("#fres"), "Mehrere Wörter in beliebiger Reihenfolge")
        pg.fill("#fq", "testriegel"); pg.wait_for_timeout(1500)
        check("Testriegel Kakao" in pg.text_content("#fres") and len(off_calls) == 1, "Online-Suche startet automatisch, wenn lokal nichts passt")
        pg.fill("#fq", "testriege"); pg.fill("#fq", "testriegel"); pg.wait_for_timeout(1000)
        check("Testriegel Kakao" in pg.text_content("#fres") and len(off_calls) == 1, "Gleiche Online-Suche kommt aus dem Zwischenspeicher")
        check(pg.evaluate("'testriegel' in JSON.parse(localStorage.getItem('sc.offcache')||'{}')"), "Online-Treffer werden auf dem Gerät gemerkt")
        OFF["busy"] = True; pg.fill("#fq", "kakaoriegel"); pg.wait_for_timeout(4500)
        check("gestört" in pg.text_content("#fres") and pg.is_visible("#fres [data-n=off]") and pg.is_visible("#fres [data-n=scan]"), "Störung von Open Food Facts wird erkannt, mit Scan- und Nochmal-Knopf")
        OFF["busy"] = False; pg.click("#fres [data-n=off]"); pg.wait_for_timeout(500)
        check("Testriegel Kakao" in pg.text_content("#fres"), "Nochmal versuchen klappt")
        print("Kein Springen")
        pg.fill("#fq", ""); pg.wait_for_timeout(100)
        box = lambda: pg.evaluate("(()=>{const r=document.querySelector('.sheetin').getBoundingClientRect(),f=document.getElementById('fq').getBoundingClientRect();return [Math.round(r.top),Math.round(r.height),Math.round(f.top)]})()")
        b0 = box(); pg.type("#fq", "quark", delay=20); pg.wait_for_timeout(150)
        check(box() == b0, "Fenster und Suchfeld bleiben beim Tippen an derselben Stelle")
        pg.click("[data-n=setmeal][data-m=a]"); pg.wait_for_timeout(150)
        check(box() == b0 and "noanim" in pg.get_attribute(".sheet", "class"), "Neu zeichnen ohne Einblend-Animation und ohne Verschieben")
        check(pg.evaluate("document.documentElement.classList.contains('sheet-open')"), "Hintergrund gesperrt, solange das Fenster offen ist")
        pg.click("[data-n=close]"); pg.wait_for_timeout(100)

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
