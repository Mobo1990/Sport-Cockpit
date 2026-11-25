/* Duo – Unterwegs: wer wann nicht zu Hause ist (Dienstreisen, Übernachtungen).
   Gespeichert im lokalen HA-Kalender calendar.unterwegs: Titel „Name: Was“, Ort, Beschreibung „Übernachtung“.
   Neue Einträge melden sich per Push beim Partner (script.sport_cockpit_meldung); die HA-Automation
   „Duo – Unterwegs: Erinnerung an den Partner“ erinnert am Vorabend um 19 Uhr und gibt sonntags einen Wochenüberblick. */
'use strict';
const AWAY_E='calendar.unterwegs';
let AWAY=[],awayForm=null,awayDel='';
try{AWAY=JSON.parse(localStorage.getItem('sc.away'))||[]}catch(e){}
const AWT=['So','Mo','Di','Mi','Do','Fr','Sa'];
/* Kalender-Eintrag von HA in unsere Form bringen */
function awayParse(e){const sm=String(e.summary||''),i=sm.indexOf(':'),allDay=!/T/.test(e.start||'');
 let end=new Date(allDay?e.end+'T12:00':e.end);if(allDay)end=new Date(end.getTime()-864e5);
 return{uid:e.uid||'',wer:i>0?sm.slice(0,i).trim():'',was:(i>0?sm.slice(i+1):sm).trim(),ort:e.location||'',nacht:/bernacht/i.test(e.description||''),allDay,
  s:allDay?e.start:e.start,e:allDay?iso(end):e.end,start:new Date(allDay?e.start+'T00:00':e.start).getTime(),stop:allDay?new Date(iso(end)+'T23:59').getTime():new Date(e.end).getTime()}}
async function awayFetch(){if(!HA.url||!HA.token)return;const from=new Date();from.setHours(0,0,0,0);const to=new Date(from.getTime()+120*864e5);
 try{const r=await haCall([{type:'call_service',domain:'calendar',service:'get_events',target:{entity_id:AWAY_E},service_data:{start_date_time:from.toISOString(),end_date_time:to.toISOString()},return_response:true}]);
  const m=r[0];if(!m||!m.success)return;const ev=((((m.result||{}).response||{})[AWAY_E]||{}).events||[]).map(awayParse).sort((a,b)=>a.start-b.start);
  if(JSON.stringify(ev)!==JSON.stringify(AWAY)){AWAY=ev;try{localStorage.setItem('sc.away',JSON.stringify(ev))}catch(e){}if((view==='home'||view==='away')&&!sheet&&!awayForm)render()}}catch(e){}}
/* Zeitraum lesbar: „Do 26.11. 08:00 – Fr 27.11. 18:00“ */
function awayWhen(a){const s=new Date(a.start),e=new Date(a.allDay?a.e+'T12:00':a.e),d=x=>`${AWT[x.getDay()]} ${x.getDate()}.${x.getMonth()+1}.`,t=x=>a.allDay?'':' '+x.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});
 return iso(s)===iso(e)?`${d(s)}${a.allDay?'':`${t(s)}–${t(e).trim()}`}`:`${d(s)}${t(s)} – ${d(e)}${t(e)}`}
function awayTag(a){const now=Date.now(),td=today(),tm=iso(Date.now()+864e5);if(a.start<=now&&a.stop>=now)return['jetzt','Gerade unterwegs'];
 const sd=iso(a.start);return sd===td?['heute','Heute']:sd===tm?['morgen','Morgen']:['',''];}
function awayRow(a,del){const me=slugN(a.wer)===slugN(S.prof.name||''),[tc,tl]=awayTag(a);
 return `<li class="awr${tc?' '+tc:''}">${avaHtml(a.wer||'?',me,'sm')}<div><b>${esc(a.wer||'?')}${a.ort?` · ${esc(a.ort)}`:''}</b><span>${esc(a.was)}</span><small>${esc(awayWhen(a))}</small></div>
 <div class="awm">${tl?`<em>${tl}</em>`:''}${a.nacht?'<i>Über Nacht</i>':''}${del?`<button class="awx${awayDel===a.uid?' danger':''}" data-aw="del" data-uid="${esc(a.uid)}" aria-label="Löschen">${awayDel===a.uid?'Löschen?':'×'}</button>`:''}</div></li>`}
const awayNext=days=>AWAY.filter(a=>a.stop>=Date.now()&&a.start<=Date.now()+days*864e5);
/* Karte auf der Startseite – nur sichtbar, wenn in den nächsten 14 Tagen jemand weg ist */
function awayHomeHtml(){if(!HA.url||!HA.token)return '';const l=awayNext(14);if(!l.length)return '';
 return `<section class="away"><div class="awh"><b>Unterwegs</b><button data-a="view" data-v="away">Alle ›</button></div><ul>${l.slice(0,3).map(a=>awayRow(a,false)).join('')}</ul>${l.length>3?`<p class="awmore">+ ${l.length-3} weitere</p>`:''}</section>`}
/* Eigene Seite: Liste + Eintragen */
function renderAway(){const l=AWAY.filter(a=>a.stop>=Date.now()),f=awayForm,td=today();
 if(!HA.url||!HA.token)return `<section class="meal"><header><h3>Unterwegs</h3></header><p class="tip" style="padding:0">Dafür muss die App mit Home Assistant verbunden sein (Mehr → Home Assistant).</p></section>`;
 return `<section class="hero2"><div><p class="hk">Wer ist wann weg</p><h2>Unterwegs</h2></div></section>
 ${f?`<section class="away form"><div class="awh"><b>Neuer Eintrag</b><button data-aw="cancel">Abbrechen</button></div>
  <div class="cform"><div class="full"><label for="awWas">Was</label><input id="awWas" placeholder="z. B. tecis Workshop" value="${esc(f.was)}"></div>
  <div class="full"><label for="awOrt">Wo</label><input id="awOrt" placeholder="z. B. Köln" value="${esc(f.ort)}"></div>
  <div><label for="awVon">Von</label><input id="awVon" type="date" value="${esc(f.von)}"></div><div><label for="awVt">Uhrzeit</label><input id="awVt" type="time" value="${esc(f.vt)}"></div>
  <div><label for="awBis">Bis</label><input id="awBis" type="date" value="${esc(f.bis)}"></div><div><label for="awBt">Uhrzeit</label><input id="awBt" type="time" value="${esc(f.bt)}"></div>
  <div class="full"><label>Über Nacht weg?</label><div class="vars"><button data-aw="night" data-v="1" aria-pressed="${!!f.nacht}">Ja, Übernachtung</button><button data-aw="night" data-v="" aria-pressed="${!f.nacht}">Nein</button></div></div></div>
  <small class="pknee">Ohne Uhrzeit gilt der ganze Tag. ${esc(sharePartner()||'Dein Partner')} bekommt sofort eine Nachricht und am Vorabend eine Erinnerung.</small>
  <div class="actions"><button class="primary" data-aw="save">Eintragen</button></div></section>`
 :`<button class="awadd" data-aw="new">+ Ich bin unterwegs</button>`}
 <section class="away list">${l.length?`<ul>${l.map(a=>awayRow(a,true)).join('')}</ul>`:'<p class="tip" style="padding:0">Gerade ist nichts eingetragen.</p>'}</section>
 <p class="tip" style="padding:0 0 20px">Steht in Home Assistant im Kalender „Unterwegs“ – nicht in euren eigenen Kalendern. Erinnerung an den anderen: am Vorabend um 19 Uhr, sonntags der Wochenüberblick.</p>`}
function awayRead(){const g=id=>($(id)||{}).value||'';if(awayForm)Object.assign(awayForm,{was:g('awWas'),ort:g('awOrt'),von:g('awVon'),vt:g('awVt'),bis:g('awBis'),bt:g('awBt')})}
async function awaySave(){awayRead();const f=awayForm,was=f.was.trim(),ort=f.ort.trim();
 if(!was){note('Trag ein, was ansteht');return}if(!f.von){note('Startdatum angeben');return}const bis=f.bis||f.von;if(bis<f.von){note('Ende liegt vor dem Start');return}
 const timed=!!(f.vt||f.bt),sd={summary:`${S.prof.name}: ${was}`};if(ort)sd.location=ort;if(f.nacht)sd.description='Übernachtung';
 if(timed){const st=new Date(f.von+'T'+(f.vt||'00:00')),en=new Date(bis+'T'+(f.bt||'23:59'));if(en<=st){note('Ende liegt vor dem Start');return}sd.start_date_time=f.von+' '+(f.vt||'00:00')+':00';sd.end_date_time=bis+' '+(f.bt||'23:59')+':00'}
 else{sd.start_date=f.von;sd.end_date=iso(new Date(bis+'T12:00').getTime()+864e5)}
 note('Trage ein …');
 try{const r=await haCall([{type:'call_service',domain:'calendar',service:'create_event',target:{entity_id:AWAY_E},service_data:sd}]);if(!r[0]||!r[0].success)throw new Error((r[0]&&r[0].error&&r[0].error.message)||'Kalender fehlt');
  const a=awayParse({summary:sd.summary,location:ort,description:sd.description,start:timed?f.von+'T'+(f.vt||'00:00'):f.von,end:timed?bis+'T'+(f.bt||'23:59'):sd.end_date});
  tell(`${S.prof.name} ist unterwegs`,`${was}${ort?' in '+ort:''}\n${awayWhen(a)}${f.nacht?' · über Nacht weg':''}`);
  awayForm=null;note('Eingetragen');await awayFetch();render()}catch(e){note('Nicht eingetragen: '+e.message)}}
async function awayRemove(uid){const a=AWAY.find(x=>x.uid===uid);if(!a)return;note('Lösche …');
 try{const r=await haCall([{type:'calendar/event/delete',entity_id:AWAY_E,uid}]);if(!r[0]||!r[0].success)throw new Error('nicht gefunden');
  if(a.stop>=Date.now())tell(`${a.wer}: Termin fällt weg`,`${a.was}${a.ort?' in '+a.ort:''} · ${awayWhen(a)} ist gestrichen.`);
  AWAY=AWAY.filter(x=>x.uid!==uid);try{localStorage.setItem('sc.away',JSON.stringify(AWAY))}catch(e){}awayDel='';note('Gelöscht');render()}catch(e){note('Löschen nicht möglich: '+e.message)}}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-aw]');if(!b)return;const a=b.dataset.aw;
 if(a==='new'){const t=today();awayForm={was:'',ort:'',von:t,vt:'',bis:t,bt:'',nacht:false};awayDel='';render();setTimeout(()=>{const i=$('awWas');if(i)i.focus()},30)}
 else if(a==='cancel'){awayForm=null;render()}
 else if(a==='night'){awayRead();awayForm.nacht=!!b.dataset.v;if(awayForm.nacht&&awayForm.bis===awayForm.von)awayForm.bis=iso(new Date(awayForm.von+'T12:00').getTime()+864e5);render()}
 else if(a==='save')awaySave();
 else if(a==='del'){if(awayDel===b.dataset.uid)awayRemove(b.dataset.uid);else{awayDel=b.dataset.uid;render()}}});
/* Von-Datum geändert: Bis mitziehen, wenn es davor läge */
document.addEventListener('change',ev=>{if(ev.target.id!=='awVon'||!awayForm)return;awayRead();if(!awayForm.bis||awayForm.bis<awayForm.von){awayForm.bis=awayForm.von;const b=$('awBis');if(b)b.value=awayForm.von}});
