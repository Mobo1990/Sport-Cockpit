# Nachgebauter Home Assistant (WebSocket) für Tests. Speichert in /tmp/store.json, protokolliert Dienstaufrufe in /tmp/calls.log
import asyncio, json, websockets
store={}
stores={}
todo=[]
cal=[]
async def h(ws):
    await ws.send(json.dumps({"type":"auth_required"}))
    m=json.loads(await ws.recv())
    tok=m.get("access_token")
    if tok not in ("tok","tok2"):
        await ws.send(json.dumps({"type":"auth_invalid"})); return
    st_=store if tok=="tok" else stores.setdefault(tok,{})
    await ws.send(json.dumps({"type":"auth_ok"}))
    async for raw in ws:
        m=json.loads(raw)
        if m["type"]=="frontend/get_user_data":
            await ws.send(json.dumps({"id":m["id"],"type":"result","success":True,"result":{"value":st_.get(m["key"])}}))
        elif m["type"]=="get_states":
            import datetime
            now=datetime.datetime.now().isoformat()
            st=[{"entity_id":"input_number.sport_cockpit_michell_schritte","state":"11234","last_updated":now},{"entity_id":"input_number.sport_cockpit_michell_aktiv_kcal","state":"650","last_updated":now},{"entity_id":"input_number.sport_cockpit_michell_gewicht","state":"84.2","last_updated":now},{"entity_id":"input_number.sport_cockpit_michell_trainingsminuten","state":"42","last_updated":now},{"entity_id":"input_text.sport_cockpit_michell","state":json.dumps({"d":datetime.date.today().isoformat(),"pt":41,"tr":"Push","wp":46}),"attributes":{"friendly_name":"Sport Cockpit Michell"},"last_updated":now},{"entity_id":"input_text.sport_cockpit_pauline","state":json.dumps({"d":datetime.date.today().isoformat(),"pt":70,"tr":"Legs","wp":180}),"attributes":{"friendly_name":"Sport Cockpit Pauline"},"last_updated":now}]
            await ws.send(json.dumps({"id":m["id"],"type":"result","success":True,"result":st}))
        elif m["type"]=="call_service" and m.get("domain")=="rest_command":
            open("/tmp/calls.log","a").write(json.dumps(m)+"\n")
            q=(m.get("service_data") or {}).get("q","")
            if q.lower() == "kinderriegel":
                await ws.send(json.dumps({"id":m["id"],"type":"result","success":True,"result":{"context":{},"response":{"status":200,"content":{"hits":[]}}}}))
                continue
            if "(kinder AND riegel)" in q:
                n={"energy-kcal_100g":560,"proteins_100g":9,"carbohydrates_100g":53,"fat_100g":35}
                hs=[{"code":"4101","product_name":"Fruchtriegel Apfel","brands":["xx:dmbio"],"nutriments":n},{"code":"4102","product_name":"Kinder Riegel","brands":["xx:kinder"],"nutriments":n}]
                await ws.send(json.dumps({"id":m["id"],"type":"result","success":True,"result":{"context":{},"response":{"status":200,"content":{"hits":hs}}}}))
                continue
            if q.lower().startswith("proxy"):
                hit={"code":"4003","product_name":"Proxyriegel Erdnuss","brands":["Marke"],"nutriments":{"energy-kcal_100g":390,"proteins_100g":31,"carbohydrates_100g":30,"sugars_100g":2,"fat_100g":14}}
                bare={"code":"4004","product_name":"Proxysnack Gurke","brands":["Aldi"]}
                fill={"code":"4005","product_name":"Proxyhafer","brands":["xx:Mühle"]}
                await ws.send(json.dumps({"id":m["id"],"type":"result","success":True,"result":{"context":{},"response":{"status":200,"content":{"hits":[hit,bare,fill]}}}}))
            elif q.startswith("("):
                await ws.send(json.dumps({"id":m["id"],"type":"result","success":True,"result":{"context":{},"response":{"status":200,"content":{"hits":[]}}}}))
            else:
                await ws.send(json.dumps({"id":m["id"],"type":"result","success":False,"error":{"code":"not_found","message":"Service not found."}}))
        elif m["type"]=="call_service" and m.get("domain")=="todo":
            open("/tmp/calls.log","a").write(json.dumps(m)+"\n")
            sv=m["service"]; sd=m.get("service_data") or {}
            if sv=="add_item":
                todo.append({"uid":"u%d"%len(todo)+str(len(json.dumps(todo))),"summary":sd.get("item",""),"status":"needs_action","description":sd.get("description","")})
                await ws.send(json.dumps({"id":m["id"],"type":"result","success":True,"result":{"context":{}}}))
            elif sv=="get_items":
                await ws.send(json.dumps({"id":m["id"],"type":"result","success":True,"result":{"context":{},"response":{"todo.sport_cockpit_geteiltes_essen":{"items":[t for t in todo if t["status"]=="needs_action"]}}}}))
            elif sv=="remove_item":
                todo[:]=[t for t in todo if t["uid"]!=sd.get("item")]
                await ws.send(json.dumps({"id":m["id"],"type":"result","success":True,"result":{"context":{}}}))
            open("/tmp/todo.json","w").write(json.dumps(todo))
        elif m["type"]=="call_service" and m.get("domain")=="calendar":
            open("/tmp/calls.log","a").write(json.dumps(m)+"\n")
            sd=m.get("service_data") or {}
            if m["service"]=="create_event":
                ev={"uid":"c%d"%len(cal),"summary":sd["summary"],"location":sd.get("location",""),"description":sd.get("description","")}
                if "start_date" in sd: ev.update(start=sd["start_date"],end=sd["end_date"])
                else: ev.update(start=sd["start_date_time"].replace(" ","T"),end=sd["end_date_time"].replace(" ","T"))
                cal.append(ev)
                await ws.send(json.dumps({"id":m["id"],"type":"result","success":True,"result":{"context":{}}}))
            else:
                await ws.send(json.dumps({"id":m["id"],"type":"result","success":True,"result":{"context":{},"response":{"calendar.unterwegs":{"events":cal}}}}))
        elif m["type"]=="calendar/event/delete":
            open("/tmp/calls.log","a").write(json.dumps(m)+"\n")
            cal[:]=[e for e in cal if e["uid"]!=m.get("uid")]
            await ws.send(json.dumps({"id":m["id"],"type":"result","success":True,"result":None}))
        elif m["type"]=="call_service":
            open("/tmp/calls.log","a").write(json.dumps(m)+"\n")
            await ws.send(json.dumps({"id":m["id"],"type":"result","success":True,"result":{}}))
        elif m["type"]=="frontend/set_user_data":
            st_[m["key"]]=m["value"]; open('/tmp/store.json','w').write(json.dumps(store))
            await ws.send(json.dumps({"id":m["id"],"type":"result","success":True,"result":None}))
async def main():
    async with websockets.serve(h,"localhost",8123): await asyncio.Future()
asyncio.run(main())
