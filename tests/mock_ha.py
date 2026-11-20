# Nachgebauter Home Assistant (WebSocket) für Tests. Speichert in /tmp/store.json, protokolliert Dienstaufrufe in /tmp/calls.log
import asyncio, json, websockets
store={}
async def h(ws):
    await ws.send(json.dumps({"type":"auth_required"}))
    m=json.loads(await ws.recv())
    if m.get("access_token")!="tok":
        await ws.send(json.dumps({"type":"auth_invalid"})); return
    await ws.send(json.dumps({"type":"auth_ok"}))
    async for raw in ws:
        m=json.loads(raw)
        if m["type"]=="frontend/get_user_data":
            await ws.send(json.dumps({"id":m["id"],"type":"result","success":True,"result":{"value":store.get(m["key"])}}))
        elif m["type"]=="get_states":
            import datetime
            now=datetime.datetime.now().isoformat()
            st=[{"entity_id":"input_number.sport_cockpit_michell_schritte","state":"11234","last_updated":now},{"entity_id":"input_number.sport_cockpit_michell_aktiv_kcal","state":"650","last_updated":now},{"entity_id":"input_number.sport_cockpit_michell_gewicht","state":"84.2","last_updated":now},{"entity_id":"input_number.sport_cockpit_michell_trainingsminuten","state":"42","last_updated":now},{"entity_id":"input_text.sport_cockpit_pauline","state":json.dumps({"d":datetime.date.today().isoformat(),"pt":70,"tr":"Legs","wp":180}),"attributes":{"friendly_name":"Sport Cockpit Pauline"},"last_updated":now}]
            await ws.send(json.dumps({"id":m["id"],"type":"result","success":True,"result":st}))
        elif m["type"]=="call_service":
            open("/tmp/calls.log","a").write(json.dumps(m)+"\n")
            await ws.send(json.dumps({"id":m["id"],"type":"result","success":True,"result":{}}))
        elif m["type"]=="frontend/set_user_data":
            store[m["key"]]=m["value"]; open('/tmp/store.json','w').write(json.dumps(store))
            await ws.send(json.dumps({"id":m["id"],"type":"result","success":True,"result":None}))
async def main():
    async with websockets.serve(h,"localhost",8123): await asyncio.Future()
asyncio.run(main())
