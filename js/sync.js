/* Sport Cockpit – Home-Assistant-Sync, Apple-Health-Werte, Einstellungen */
'use strict';
/* ===================== HOME-ASSISTANT-SYNC ===================== */
let HA={url:'',token:''},haConfirm=false,syncT=null,syncing=false,syncAgain=false;
try{HA=Object.assign(HA,JSON.parse(localStorage.getItem('sc.ha'))||{})}catch(e){}
function haCall(cmds){return new Promise((res,rej)=>{let ws;try{ws=new WebSocket(HA.url.replace(/\/+$/,'').replace(/^http/,'ws')+'/api/websocket')}catch(e){rej(new Error('Adresse ungültig'));return}
 const out={};let id=0;const to=setTimeout(()=>{try{ws.close()}catch(e){}rej(new Error('Keine Antwort von Home Assistant'))},20000);
 ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.type==='auth_required')ws.send(JSON.stringify({type:'auth',access_token:HA.token}));
  else if(m.type==='auth_invalid'){clearTimeout(to);ws.close();rej(new Error('Token ungültig'))}
  else if(m.type==='auth_ok'){if(!cmds.length){clearTimeout(to);ws.close();res([]);return}cmds.forEach(c=>ws.send(JSON.stringify({id:++id,...c})))}
  else if(m.type==='result'){out[m.id]=m;if(Object.keys(out).length===cmds.length){clearTimeout(to);ws.close();res(cmds.map((_,i)=>out[i+1]))}}};
 ws.onerror=()=>{clearTimeout(to);rej(new Error('Home Assistant nicht erreichbar'))}})}
let partners=[];
function health(m){if(!m||!m.success||!S.prof.name)return;const me='input_text.sport_cockpit_'+slugN(S.prof.name);partners=(m.result||[]).filter(e=>/^input_text\.sport_cockpit_[a-z0-9]+$/.test(e.entity_id)&&e.entity_id!==me).map(e=>{let j={};try{j=JSON.parse(e.state)}catch(x){}return{name:(e.attributes&&e.attributes.friendly_name||'').replace(/^Sport Cockpit /,''),...j}});const pre='input_number.sport_cockpit_'+slugN(S.prof.name)+'_',d=today(),h={};
 for(const e of m.result||[]){if(!e.entity_id.startsWith(pre)||iso(e.last_updated||e.last_changed)!==d)continue;const v=parseFloat(e.state);if(!isFinite(v))continue;h[e.entity_id.slice(pre.length)]=v}
 if(!Object.keys(h).length)return;const day=ND(d),old=JSON.stringify(day.h||{});day.h={st:h.schritte,ak:h.aktiv_kcal,tm:h.trainingsminuten};
 if(h.gewicht>30&&(!day.w||day.wsrc==='health')){day.w=h.gewicht;day.wsrc='health'}if(JSON.stringify(day.h)!==old)day.t=Date.now();S.hT=Math.max(...(m.result||[]).filter(e=>e.entity_id.startsWith(pre)).map(e=>Date.parse(e.last_updated)||0),0)}
function syncLater(){clearTimeout(syncT);if(HA.url&&HA.token)syncT=setTimeout(syncNow,1500)}
function metaOf(){return{t:S.metaT,prof:S.prof,plan:S.plan,goal:S.goal,rest:S.rest,cgoal:S.cgoal,nut:{goal:S.nut.goal,maint:S.nut.maint,gkg:S.nut.gkg,foods:S.nut.foods,meals:S.nut.meals,recent:S.nut.recent},drafts,draftT}}
function merge(R){let changed=false;const m=R.sc_meta;
 if(m&&(m.t||0)>(S.metaT||0)){if(m.prof)S.prof=m.prof;Object.assign(S,{plan:m.plan||S.plan,goal:m.goal||S.goal,rest:m.rest||S.rest,cgoal:m.cgoal||S.cgoal,metaT:m.t});if(m.nut)Object.assign(S.nut,m.nut);changed=true}
 if(m&&(m.draftT||0)>draftT){drafts=m.drafts||{};draftT=m.draftT;changed=true}
 const rs=R.sc_sessions;if(rs){const del=new Set([...(S.del||[]),...(rs.del||[])]),map=new Map();for(const s of [...(rs.list||[]),...S.sessions]){const o=map.get(s.id);if(!o||(s.t||0)>(o.t||0))map.set(s.id,s)}
  const list=[...map.values()].filter(s=>!del.has(s.id));if(list.length!==S.sessions.length||del.size!==(S.del||[]).length)changed=true;S.sessions=list;S.del=[...del]}
 const rn=R.sc_nut;if(rn&&rn.days){for(const k in rn.days){const o=S.nut.days[k];if(!o||(rn.days[k].t||0)>(o.t||0)){S.nut.days[k]=rn.days[k];changed=true}}}
 if(changed)migrate();return changed}
async function syncNow(){if(!HA.url||!HA.token)return;if(syncing){syncAgain=true;return}syncing=true;note('Synchronisiere …');
 try{const keys=['sc_meta','sc_sessions','sc_nut'],r=await haCall([...keys.map(k=>({type:'frontend/get_user_data',key:k})),{type:'get_states'}]),R={};health(r[keys.length]);
  r.forEach((m,i)=>{if(m&&m.success&&m.result)R[keys[i]]=m.result.value});
  /* Schutz: Konto gehört erkennbar einer anderen Person -> nicht mischen, nichts hochladen */
  const rn=R.sc_meta&&R.sc_meta.prof&&R.sc_meta.prof.name;
  if(!HA.force&&rn&&S.prof.name&&slugN(rn)!==slugN(S.prof.name)){HA.conflict=rn;syncing=false;note(`Konto gehört zu „${rn}“ – nicht synchronisiert`);if(view==='more')render();return}
  HA.conflict='';const hadName=!!S.prof.name,changed=HA.force?false:merge(R);HA.force=false;if(!hadName&&S.prof.name)health(r[keys.length]);lsSave();
  await haCall([{type:'frontend/set_user_data',key:'sc_meta',value:metaOf()},{type:'frontend/set_user_data',key:'sc_sessions',value:{list:S.sessions,del:S.del}},{type:'frontend/set_user_data',key:'sc_nut',value:{days:S.nut.days}}]);
  note('Synchronisiert · '+new Date().toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'}));publish();shareFetch();
  const busy=document.activeElement&&document.activeElement.tagName==='INPUT';if(changed&&!busy&&!sheet)render()}
 catch(e){note((navigator.onLine?e.message:'Offline')+' – lokal gespeichert')}
 syncing=false;if(syncAgain){syncAgain=false;syncNow()}}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){clearTimeout(syncT);syncNow()}else syncNow()});
addEventListener('online',()=>syncNow());

/* ===================== EINSTELLUNGEN ===================== */
function pcalc(){const g=goals(today());return `<div><b>${g.bmr?fmt(Math.round(g.bmr)):'–'}</b><small>Grundumsatz</small></div><div><b>${fmt(g.maint)}</b><small>Erhalt kcal</small></div><div><b>${fmt(g.kcal)}</b><small>Ziel kcal</small></div><div><b>${g.p}</b><small>Protein g</small></div>`}
function renderProfile(){const P=S.prof,g=goals(today());const f=(k,l,ph,mode='decimal')=>`<div><label for="p_${k}">${l}</label><input id="p_${k}" inputmode="${mode}" data-p="${k}" placeholder="${ph}" value="${esc(P[k]??'')}"></div>`;
 return `<section class="meal"><header><h3>Mein Profil</h3><span>${P.name?esc(P.name):''}</span></header>
 ${picProfileHtml()}
 <div class="cform">${f('name','Name','z. B. Michell','text')}<div><label>Geschlecht</label><div class="vars">${[['m','Mann'],['w','Frau']].map(([k,l])=>`<button data-ps="sex" data-v="${k}" aria-pressed="${P.sex===k}">${l}</button>`).join('')}</div></div>
 ${f('year','Geburtsjahr','z. B. 1990','numeric')}${f('height','Größe (cm)','z. B. 182','numeric')}${f('weight','Startgewicht (kg)','z. B. 85')}${f('wgoal','Wasser-Ziel (l/Tag)','2')}${f('sgoal','Schritt-Ziel pro Tag','10000','numeric')}
 <div class="full"><label>Alltag (ohne Training eingerechnet)</label><div class="vars">${[[1.4,'Büro, wenig Bewegung'],[1.55,'Büro + Training 3–4×'],[1.7,'Aktiv / Training 5–6×'],[1.85,'Körperlich harte Arbeit']].map(([v,l])=>`<button data-ps="act" data-v="${v}" aria-pressed="${S.prof.act==v}">${l}</button>`).join('')}</div></div></div>
 <div class="calc" id="pcalc">${pcalc()}</div>
 <p class="tip" style="padding:0">Gewicht: wird automatisch durch dein zuletzt eingetragenes Gewicht (Essen-Tab) ersetzt. Ziel (Aufbau/Halten/Definieren) stellst du im Essen-Tab ein.</p></section>`}
/* Verbindung übertragen (z. B. nach Neuinstallation): Adresse + Token als Code in die Zwischenablage */
let hxState='';
function haCode(){return 'duo-ha:'+btoa(unescape(encodeURIComponent(JSON.stringify({u:HA.url,t:HA.token}))))}
function haFromCode(s){const m=String(s||'').match(/duo-ha:([A-Za-z0-9+/=]+)/);if(!m)return null;try{const j=JSON.parse(decodeURIComponent(escape(atob(m[1]))));return j.u&&j.t?j:null}catch(e){return null}}
async function haConnect(u,t){const old={...HA};HA.url=u;if(t)HA.token=t;note('Verbinde …');try{await haCall([]);localStorage.setItem('sc.ha',JSON.stringify(HA));note('Verbunden');render();syncNow();return true}catch(e){HA=old;note(e.message);return false}}
function renderSettings(){return renderProfile()+`<section class="meal" style="margin-top:24px"><header><h3>Home Assistant</h3><span>${HA.url&&HA.token?'verbunden':'nicht eingerichtet'}</span></header>
 <p class="tip" style="padding:0 0 8px">Deine Daten werden in deinem Home Assistant gespeichert (pro HA-Benutzer). Adresse: deine Nabu-Casa-URL. Token: HA → Profil → Sicherheit → „Langlebiges Zugriffstoken erstellen“.</p>
 <div class="cform"><div class="full"><label for="haUrl">Adresse</label><input id="haUrl" placeholder="https://xxxxxxxx.ui.nabu.casa" value="${esc(HA.url)}" autocapitalize="off" autocorrect="off"></div>
 <div class="full"><label for="haTok">Token</label><input id="haTok" type="password" placeholder="${HA.token?'gespeichert – zum Ändern neu einfügen':'Token einfügen'}" autocapitalize="off" autocorrect="off"></div></div>
 ${HA.conflict?`<div class="haconf"><b>Dieses Home-Assistant-Konto gehört zu „${esc(HA.conflict)}“</b><p>Es wurde nichts übertragen. Jede Person braucht einen eigenen Home-Assistant-Benutzer mit eigenem Token – sonst vermischen sich Profil, Training und Essen.</p><p>Ist es wirklich dein Konto (z. B. weil „${esc(HA.conflict)}“ es vorher mitbenutzt hat)? Dann überschreibe es mit den Daten dieses Geräts:</p><button data-s="haforce" class="${haConfirm?'danger':''}">${haConfirm?'Wirklich überschreiben? Nochmal tippen':'Konto mit diesem Gerät überschreiben'}</button></div>`:''}
 <div class="actions"><button class="primary" data-s="ha">Verbinden & synchronisieren</button>${HA.token?'<button class="ghost" data-s="haoff">Trennen</button>':''}</div>
 ${HA.url&&HA.token?`<div class="hxfer">${hxState?`<b>${hxState==='ok'?'Kopiert – jetzt in der neuen App einfügen':'Code markieren und kopieren:'}</b><textarea id="hxCode" readonly rows="3">${esc(haCode())}</textarea><div class="obrow"><button class="primary" data-s="hacopy">Nochmal kopieren</button>${navigator.share?'<button class="ghost" data-s="hashare">Teilen …</button>':''}</div>`:'<button class="hxbtn" data-s="hacopy">Verbindung für neues Gerät kopieren</button>'}<small>Den Code in der neu installierten App beim Start einfügen. Nicht weitergeben – er ist dein Zugang.</small></div>`:''}</section>
 <section class="meal"><header><h3>Daten übernehmen & sichern</h3></header>
 <p class="tip" style="padding:0 0 8px">Aus dem alten Cockpit in Claude: dort Verlauf → „Alle Daten kopieren“, hier einfügen.</p>
 <textarea id="imp" rows="4" placeholder="Kopierte Daten hier einfügen"></textarea>
 <div class="actions"><button data-s="imp">Importieren</button><button class="ghost" data-s="exp">Backup kopieren</button></div></section>
 <p class="tip" style="padding:0 0 20px">Duo · Lebensmittel-Daten: Open Food Facts (ODbL) und eingebaute Richtwerte.</p>`}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-ps]');if(!b)return;const k=b.dataset.ps;S.prof[k]=k==='act'?+b.dataset.v:b.dataset.v;S.metaT=Date.now();persist();render()});
document.addEventListener('input',ev=>{const t=ev.target,k=t.dataset.p;if(!k)return;S.prof[k]=k==='name'?t.value:(num(t.value)??'');S.metaT=Date.now();persist();renderHead();const c=$('pcalc');if(c)c.innerHTML=pcalc()});
document.addEventListener('click',async ev=>{const b=ev.target.closest('[data-s]');if(!b)return;const a=b.dataset.s;
 if(a==='ha'){const cj=haFromCode($('haUrl').value);if(cj){haConnect(cj.u,cj.t);return}
  let u=$('haUrl').value.trim().replace(/\/+$/,'');const t=$('haTok').value.trim();if(!/^https?:\/\//.test(u)){note('Adresse mit https:// angeben');return}haConnect(u,t)}
 else if(a==='hacopy'){let ok=false;try{await navigator.clipboard.writeText(haCode());ok=true}catch(e){}hxState=ok?'ok':'show';render();const t=$('hxCode');if(t&&!ok){t.focus();t.select()}}
 else if(a==='hashare'){try{await navigator.share({title:'Duo – Verbindungscode',text:haCode()})}catch(e){}}
 else if(a==='hapaste'){let v=($('obCode')||{}).value||'';if(!haFromCode(v)){try{v=await navigator.clipboard.readText()}catch(e){}}const j=haFromCode(v);
  if(!j){const m=$('obmsg');if(m)m.textContent='Kein Verbindungscode gefunden. Kopiere ihn in der alten App unter „Mehr → Home Assistant“ und füge ihn hier ins Feld ein.';return}
  if(!await haConnect(j.u,j.t)){const m=$('obmsg');if(m)m.textContent='Verbindung fehlgeschlagen – ist Home Assistant erreichbar?'}}
 else if(a==='haforce'){if(!haConfirm){haConfirm=true;render();return}haConfirm=false;HA.force=true;HA.conflict='';render();syncNow()}
 else if(a==='haoff'){HA={url:'',token:''};localStorage.removeItem('sc.ha');render();note('Getrennt – nur lokal')}
 else if(a==='exp'){navigator.clipboard.writeText(JSON.stringify({S,drafts})).then(()=>note('Backup kopiert'),()=>note('Kopieren nicht erlaubt'))}
 else if(a==='imp'){try{const j=JSON.parse($('imp').value);const src=j.S||j;let n=0;const ids=new Set(S.sessions.map(s=>s.id));for(const s of (src.sessions||[]))if(!ids.has(s.id)){s.t=s.t||Date.now();S.sessions.push(s);n++}
  if(src.plan&&!S.metaT){S.plan=src.plan;S.goal=src.goal||S.goal;S.rest=src.rest||S.rest;S.cgoal=src.cgoal||S.cgoal;S.metaT=Date.now()}
  if(src.nut&&src.nut.days)for(const k in src.nut.days)if(!S.nut.days[k])S.nut.days[k]=src.nut.days[k];migrate();persist();render();note(n+' Einheiten übernommen')}catch(e){note('Daten nicht lesbar')}}});

