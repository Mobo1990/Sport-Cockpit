/* Duo – Unterwegs: wer wann nicht zu Hause ist (Dienstreisen, Übernachtungen).
   Gespeichert im lokalen HA-Kalender calendar.unterwegs: Titel „Name: Was“, Ort, Beschreibung „Übernachtung“.
   Neue Einträge melden sich per Push beim Partner (script.sport_cockpit_meldung); die HA-Automation
   „Duo – Unterwegs: Erinnerung an den Partner“ erinnert am Vorabend um 19 Uhr und gibt sonntags einen Wochenüberblick. */
'use strict';
const AWAY_E='calendar.unterwegs';
let AWAY=[],awayForm=null,awayDel='',awayUndoT=null,awayKind='unterwegs';
/* Arten mit Symbol (SVG, Farbe = Person). Zählt fürs Wochenziel: ganze Tage, Übernachtung, Urlaub, krank – nicht ein Abend weg. */
/* Gemeinsamer Paar-Kalender: Termine und Wegsein, jede Art mit eigenem Symbol */
const AWAY_KINDS=[['termin','Termin'],['arzt','Arzt'],['geburtstag','Geburtstag'],['treffen','Ausgehen'],['unterwegs','Unterwegs'],['reise','Reise'],
 ['essen','Essen gehen'],['feier','Feier'],['kultur','Kino/Konzert'],['sport','Sport'],['familie','Familie'],['kind','Kind'],['zuhause','Zuhause'],['urlaub','Urlaub'],['krank','Krank']];
const AWAY_MAIN=6;/* die ersten 6 sind sofort sichtbar, der Rest unter „Mehr Arten“ */
const AWAY_GONE=['unterwegs','treffen','reise','urlaub','krank'];/* Schnellwahl „Ich bin weg“ */
const AWAY_SUM={kind:'Kind-Termin',termin:'hat einen Termin',arzt:'beim Arzt',geburtstag:'Geburtstag',essen:'essen gehen',treffen:'unterwegs am Abend',feier:'auf einer Feier',kultur:'Kino/Konzert',sport:'Sport',familie:'bei der Familie',zuhause:'Termin zu Hause',unterwegs:'unterwegs',reise:'auf Reise',urlaub:'im Urlaub',krank:'krank'};
const AWAY_PH={kind:'z. B. Kita-Fest, Kinderarzt',termin:'z. B. Steuerberater',arzt:'z. B. Frauenarzt',geburtstag:'z. B. Geburtstag Oma',essen:'z. B. Italiener mit Kim',treffen:'z. B. Bier mit Stefan, Firmen-Event',feier:'z. B. Weihnachtsfeier',kultur:'z. B. Konzert',sport:'z. B. Fußball',familie:'z. B. Eltern besuchen',zuhause:'z. B. Handwerker kommt, Paket',unterwegs:'z. B. Dienstreise',reise:'z. B. Wuppertal',urlaub:'z. B. Mallorca',krank:''};
const AWAY_ICO={termin:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 arzt:'<path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z"/>',
 geburtstag:'<path d="M4 21h16v-8H4z"/><path d="M4 16.5c2 1.5 4 1.5 6 0s4-1.5 6 0 3 1.5 4 0"/><path d="M12 13V9"/><path d="M12 6.5c-1.2-1 0-3 0-3s1.2 2 0 3z"/>',
 essen:'<path d="M7 3v8a3 3 0 0 0 3 3v7M10 3v6M13 3v8"/><path d="M17 21V3c2 1 3 4 3 7h-3"/>',
 feier:'<path d="M12 3l2.2 5.3L20 9l-4.4 3.8L17 19l-5-3-5 3 1.4-6.2L4 9l5.8-.7z"/>',
 kind:'<circle cx="12" cy="5.5" r="2.5"/><path d="M12 8v7M8 11l4-2 4 2M9.5 21l2.5-6 2.5 6"/>',
 kultur:'<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
 sport:'<path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12"/>',
 familie:'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M14 20c0-2.5 1.5-4.5 3.5-4.5S21 17.5 21 20"/>',
 zuhause:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
 unterwegs:'<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>',
 treffen:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
 reise:'<path d="M3 19V6M3 15h18v4"/><path d="M21 15v-2.5A2.5 2.5 0 0 0 18.5 10H11v5"/><circle cx="7" cy="11.5" r="1.8"/>',
 urlaub:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
 krank:'<path d="M14 14.5V5a2 2 0 0 0-4 0v9.5a4 4 0 1 0 4 0z"/><path d="M12 9v7"/>'};
const awayIcoW=(art,who)=>who==='both'?`<span class="aicb">${awayIco(art,'ink')}<i class="me"></i><i class="pa"></i></span>`:awayIco(art,who);
const awayIco=(art,cls)=>`<svg class="aic ${cls||''}" viewBox="0 0 24 24" aria-hidden="true">${AWAY_ICO[art]||AWAY_ICO.unterwegs}</svg>`;
/* Zählt der Eintrag fürs Wochenziel? Nicht bei einem Abend/Treffen; ja bei ganzen Tagen, Übernachtung, Urlaub, krank */
const awayCounts=a=>['unterwegs','reise','urlaub','krank'].includes(a.art||'unterwegs')&&(a.allDay||a.nacht||a.stop-a.start>=8*36e5);
/* Gehört der Eintrag (auch) zu mir – selbst eingetragen oder vom Partner mit „du bist dabei“? */
const awayHas=(a,me=true)=>{const n=slugN(S.prof.name||''),w=slugN(a.wer),m=slugN(a.mit||'');return me?(w===n||m===n):(w!==n||(!!m&&m!==n))};
try{AWAY=JSON.parse(localStorage.getItem('sc.away'))||[]}catch(e){}
const AWT=['So','Mo','Di','Mi','Do','Fr','Sa'];
/* Kalender-Eintrag von HA in unsere Form bringen */
function awayParse(e){const sm=String(e.summary||''),i=sm.indexOf(':'),allDay=!/T/.test(e.start||'');
 let end=new Date(allDay?e.end+'T12:00':e.end);if(allDay)end=new Date(end.getTime()-864e5);
 const ds=String(e.description||''),was=(i>0?sm.slice(i+1):sm).trim(),nacht=/bernacht/i.test(ds),am=ds.match(/Art:\s*(\w+)/i),mm=ds.match(/Mit:\s*([^\n]+)/i);
 const art=am&&AWAY_ICO[am[1].toLowerCase()]?am[1].toLowerCase():/urlaub/i.test(was)?'urlaub':/krank/i.test(was)?'krank':nacht?'reise':'unterwegs';
 const nm=ds.match(/Notiz:\s*([^\n]+)/i),wd=ds.match(/Wdh:\s*(\w+)/i);
 return{uid:e.uid||'',rid:e.recurrence_id||'',rep:e.rrule?(/YEARLY/.test(e.rrule)?'y':/WEEKLY/.test(e.rrule)?'w':''):wd?(/j/i.test(wd[1])?'y':'w'):'',notiz:nm?nm[1].trim():'',priv:/Privat:\s*1/i.test(ds),rem:!/Erinnerung:\s*aus/i.test(ds),wer:i>0?sm.slice(0,i).trim():'',was,ort:e.location||'',nacht,art,mit:mm?mm[1].trim():'',allDay,
  s:allDay?e.start:e.start,e:allDay?iso(end):e.end,start:new Date(allDay?e.start+'T00:00':e.start).getTime(),stop:allDay?new Date(iso(end)+'T23:59').getTime():new Date(e.end).getTime()}}
/* HA-Zeitangaben: Text oder {dateTime|date} */
const awayT=x=>typeof x==='string'?x:x&&(x.dateTime||x.date)||'';
async function awayFetch(){if(!HA.url||!HA.token)return;const from=new Date();from.setHours(0,0,0,0);from.setDate(from.getDate()-62);const to=new Date(from.getTime()+400*864e5);
 try{let raw=null;
  /* Abo liefert uid/recurrence_id (nötig für Bearbeiten/Löschen); get_events nur als Rückfall */
  try{const ev=await haSub({type:'calendar/event/subscribe',entity_id:AWAY_E,start:from.toISOString(),end:to.toISOString()});raw=(ev&&(ev.events||ev))||[]}catch(e){}
  if(!Array.isArray(raw)){const r=await haCall([{type:'call_service',domain:'calendar',service:'get_events',target:{entity_id:AWAY_E},service_data:{start_date_time:from.toISOString(),end_date_time:to.toISOString()},return_response:true}]);
   const m=r[0];if(!m||!m.success)return;raw=(((m.result||{}).response||{})[AWAY_E]||{}).events||[]}
  const ev=raw.map(e=>awayParse({...e,start:awayT(e.start),end:awayT(e.end)})).sort((a,b)=>a.start-b.start);
  if(JSON.stringify(ev)!==JSON.stringify(AWAY)){AWAY=ev;try{localStorage.setItem('sc.away',JSON.stringify(ev))}catch(e){}if((view==='home'||view==='cal')&&!sheet&&!awayForm)render()}}catch(e){}}
/* Zeitraum lesbar: „Do 26.11. 08:00 – Fr 27.11. 18:00“ */
function awayWhen(a){const s=new Date(a.start),e=new Date(a.allDay?a.e+'T12:00':a.e),d=x=>`${AWT[x.getDay()]} ${x.getDate()}.${x.getMonth()+1}.`,t=x=>a.allDay?'':' '+x.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});
 const late=!a.allDay&&iso(e)===iso(s.getTime()+864e5)&&e.getHours()<6&&!a.nacht;/* „bis 0:30“ nach Mitternacht */
 return iso(s)===iso(e)||late?`${d(s)}${a.allDay?' ganztags':`${t(s)}–${late&&e.getHours()===0&&e.getMinutes()===0?'24:00':t(e).trim()} Uhr`}`:`${d(s)}${t(s)} – ${d(e)}${t(e)}`}
function awayTag(a){const now=Date.now(),td=today(),tm=iso(Date.now()+864e5);if(a.start<=now&&a.stop>=now)return['jetzt','Gerade unterwegs'];
 const sd=iso(a.start);return sd===td?['heute','Heute']:sd===tm?['morgen','Morgen']:['',''];}
const awayKey=a=>String(a.start)+'|'+slugN(a.wer);
const awayPriv=a=>a.priv&&calMe(a)?((S.calPriv||{})[awayKey(a)]||null):null;
const awayTitle=a=>{const p=awayPriv(a);if(p&&p.was)return p.was;return awayStd(a.was)?(AWAY_KINDS.find(k=>k[0]===a.art)||['','Termin'])[1]:a.was};
const awayArt=a=>{const p=awayPriv(a);return p&&p.art||a.art};
const awayStd=w=>!w||Object.values(AWAY_SUM).some(x=>x.toLowerCase()===String(w).toLowerCase());
function awayRow(a,del,notag){const me=calMe(a),[tc,tl0]=awayTag(a),tl=notag&&tc!=='jetzt'?'':tl0,p=awayPriv(a),ort=p?p.ort:a.ort,nz=p?p.notiz:a.notiz,ed=me&&HA.url&&a.uid;
 const av=a.mit?`<span class="awav2">${avaHtml(a.wer||'?',me,'sm')}${avaHtml(a.mit,!me,'sm')}</span>`:avaHtml(a.wer||'?',me,'sm');
 return `<li class="awr${tc?' '+tc:''}${ed?' awed':''}"${ed?` data-aw="edit" data-uid="${esc(a.uid)}" role="button" tabindex="0" aria-label="${esc(awayTitle(a))} bearbeiten"`:''}>${av}<div><b>${awayIcoW(awayArt(a),a.mit?'both':me?'me':'pa')}${esc(awayTitle(a))}</b><span>${esc(a.wer||'?')}${a.mit?' & '+esc(a.mit):''}${ort?` · ${esc(ort)}`:''}</span><small>${esc(awayWhen(a))}${a.rep?` · ${a.rep==='y'?'jährlich':'wöchentlich'}`:''}</small>${nz?`<span class="awnz">Notiz: ${esc(nz)}</span>`:''}${a.priv&&me?`<span class="awnz">Nur für dich – ${esc(sharePartner()||'Partner')} sieht „Termin“</span>`:''}</div>
 <div class="awm">${tl?`<em>${tl}</em>`:''}${a.nacht?'<i>Über Nacht</i>':''}${ed?'<span class="awgo" aria-hidden="true">›</span>':''}</div></li>`}
const awayNext=days=>AWAY.filter(a=>a.stop>=Date.now()&&a.start<=Date.now()+days*864e5);
/* Karte auf der Startseite – nur sichtbar, wenn in den nächsten 14 Tagen jemand weg ist */
function awayHomeHtml(){if(!HA.url||!HA.token)return '';const l=awayNext(14);if(!l.length)return '';
 return `<section class="away"><div class="awh"><b>Unterwegs</b><button data-a="view" data-v="cal">Kalender ›</button></div><ul>${l.slice(0,3).map(a=>awayRow(a,false)).join('')}</ul>${l.length>3?`<p class="awmore">+ ${l.length-3} weitere</p>`:''}</section>`}
/* Startseite oben: jeden Morgen sehen, ob heute/morgen etwas ansteht (beide Personen) */
function awayTodayHtml(){if(!HA.url||!HA.token)return '';const td=today(),tm=iso(Date.now()+864e5),pick=d=>calAway(d).sort((a,b)=>a.start-b.start);const T=pick(td),M=pick(tm).filter(a=>iso(a.start)===tm||a.allDay);if(!T.length&&!M.length)return '';
 const hm=t=>new Date(t).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'}),ini=n=>esc(String(n||'?').slice(0,1).toUpperCase()),line=a=>{const both=!!a.mit,me=calMe(a);
  return `<li>${awayIcoW(awayArt(a),both?'both':me?'me':'pa')}<span class="awtt"><b>${a.allDay?'':hm(a.start)+' '}${esc(awayTitle(a))}</b></span><span class="awwho">${both?`<i class="me">${ini(S.prof.name)}</i><i class="pa">${ini(sharePartner())}</i>`:`<i class="${me?'me':'pa'}">${ini(a.wer)}</i>`}</span></li>`};
 return `<button class="awtoday" data-a="view" data-v="cal">${T.length?`<small>Heute</small><ul>${T.slice(0,3).map(line).join('')}</ul>`:''}${M.length?`<small>Morgen</small><ul>${M.slice(0,2).map(line).join('')}</ul>`:''}<em class="awtgo">Kalender ›</em></button>`}
/* Eigene Seite: Liste + Eintragen */
/* Formular „Genauer eintragen“: alles auf einen Blick – was, wo, wann, wie lange */
function awayKindsHtml(k,only,more){const L=AWAY_KINDS.filter(([x])=>!only||only.includes(x)),main=only?L:L.slice(0,AWAY_MAIN),rest=only?[]:L.slice(AWAY_MAIN),open=more||rest.some(([x])=>x===k);
 const b=([x,l])=>`<button data-aw="kind" data-v="${x}" aria-pressed="${k===x}">${awayIco(x)}<span>${l}</span></button>`;
 return `<div class="awkind${only?'':' awall'}" role="group" aria-label="Art">${main.map(b).join('')}${open?rest.map(b).join(''):''}</div>${rest.length&&!open?'<button class="glink awmorek" data-aw="morek">Mehr Arten ▾</button>':''}`}
function awayFormHtml(){const f=awayForm,pn0=sharePartner(),pn=esc(pn0||'Dein Partner'),k=f.kind||awayKind,gone=['unterwegs','reise','urlaub'].includes(k),ganz=f.ganz!=null?f.ganz:!(f.vt||f.bt);
 return `<section class="away form" id="awForm"><div class="awh"><b>${f.repl&&f.edit?'Eintrag bearbeiten':'Neuer Eintrag'}</b><button data-aw="cancel">Abbrechen</button></div>
  <div class="cform"><div class="full"><label for="awWas">Was?</label><input id="awWas" placeholder="${esc(AWAY_PH[k]||'z. B. Frauenarzt')}" value="${esc(f.was)}"></div></div>
  <p class="awlab">Art</p>${awayKindsHtml(k,null,f.more)}
  <div class="cform">
  <div><label for="awVon">Tag</label><input id="awVon" type="date" value="${esc(f.von)}"></div><div><label for="awBis">bis Tag</label><input id="awBis" type="date" value="${esc(f.bis)}"></div>
  <label class="awnight full"><input type="checkbox" id="awGanz" ${ganz?'checked':''}> Ganztägig</label>
  ${ganz?'':`<div><label for="awVt">von</label><input id="awVt" type="time" value="${esc(f.vt)}"></div><div><label for="awBt">bis</label><input id="awBt" type="time" value="${esc(f.bt)}"></div>`}</div>
  ${pn0?`<label class="awnight awmit"><input type="checkbox" id="awMit" ${f.mit?'checked':''}> Zusammen mit ${pn} <span>(steht bei euch beiden)</span></label>`:''}
  <div class="cform"><div class="full"><label for="awOrt">Wo? <i>freiwillig</i></label><input id="awOrt" placeholder="z. B. Köln" value="${esc(f.ort)}"></div>
  <div class="full"><label for="awNz">Notiz <i>freiwillig</i></label><input id="awNz" placeholder="z. B. Geschenk besorgen" value="${esc(f.notiz||'')}"></div></div>
  <p class="awlab">Wiederholen</p><div class="awkind awrep">${[['','Nein'],['w','Jede Woche'],['y','Jedes Jahr']].map(([v,l])=>`<button data-aw="rep" data-v="${v}" aria-pressed="${(f.rep||'')===v}">${l}</button>`).join('')}</div>
  ${gone?`<label class="awnight"><input type="checkbox" id="awN" ${f.nacht?'checked':''}> Mit Übernachtung <span>(dann schlägt Duo ein Hotel-Training vor)</span></label>`:''}
  <label class="awnight"><input type="checkbox" id="awRem" ${f.rem===false?'':'checked'}> Erinnerung am Vorabend an euch beide</label>
  ${pn0?`<label class="awnight"><input type="checkbox" id="awPriv" ${f.priv?'checked':''}> Privat: ${pn} sieht nur „Termin“ <span>(Details bleiben bei dir)</span></label>`:''}
  ${f.err?`<p class="awerr" role="alert">${esc(f.err)}</p>`:''}<div class="actions"><button class="primary" data-aw="save">${f.repl&&f.edit?'Speichern':'Eintragen'}</button>${f.repl&&f.edit?`<button class="awx${awayDel===f.repl?' danger':''}" data-aw="del" data-uid="${esc(f.repl)}">${awayDel===f.repl?(f.rep?'Ganze Serie löschen?':'Wirklich löschen?'):'Löschen'}</button>`:''}</div></section>`}
function renderAway(){const td=today(),end=Date.now()+14*864e5;
 if(!HA.url||!HA.token)return `<section class="meal"><header><h3>Unser Kalender</h3></header><p class="tip" style="padding:0">Dafür muss die App mit Home Assistant verbunden sein (Mehr → Home Assistant).</p></section>`;
 const days=[];for(let i=0;i<14;i++){const d=iso(Date.now()+i*864e5);if(d===calSel)continue;const l=calAway(d).filter(a=>iso(a.start)===d||(d===td&&a.start<Date.now())).sort((a,b)=>a.start-b.start);if(l.length)days.push([d,i,l])}
 let free='';for(let i=0;i<14;i++){const d=iso(Date.now()+i*864e5);if(!calAway(d).length&&(i>0||new Date().getHours()<17)){free=d;break}}
 const lab=(d,i)=>i===0?'Heute':i===1?'Morgen':`${AWT[new Date(d+'T12:00').getDay()]} ${+d.slice(8)}.${+d.slice(5,7)}. · in ${i} Tagen`;
 return `<h3 class="calh">Nächste 14 Tage</h3>${free?`<p class="calfree">Nächster Abend, an dem ihr beide nichts habt: <b>${lab(free,Math.round((new Date(free+'T12:00')-new Date(td+'T12:00'))/864e5))}</b></p>`:''}
 <section class="away list">${days.length?days.map(([d,i,l])=>`<p class="awday">${lab(d,i)}</p><ul>${l.map(a=>awayRow(a,true,true)).join('')}</ul>`).join(''):'<p class="tip" style="padding:0">Sonst ist nichts eingetragen.</p>'}</section>`}
function awayFocus(id){setTimeout(()=>{const e=$('awForm');if(e)e.scrollIntoView({block:'start',behavior:'smooth'});const i=id&&$(id);if(i)try{i.focus({preventScroll:true})}catch(x){}},60)}
function awayRead(){const g=(id,k)=>{const e=$(id);return e?e.value:(awayForm[k]||'')};if(awayForm){Object.assign(awayForm,{was:g('awWas','was'),ort:g('awOrt','ort'),von:g('awVon','von'),vt:g('awVt','vt'),bis:g('awBis','bis'),bt:g('awBt','bt')});const n=$('awN');if(n)awayForm.nacht=n.checked;const mt=$('awMit');if(mt)awayForm.mit=mt.checked?sharePartner():'';const nz=$('awNz');if(nz)awayForm.notiz=nz.value;
 const gz=$('awGanz');if(gz){awayForm.ganz=gz.checked;if(gz.checked){awayForm.vt='';awayForm.bt=''}}const rm=$('awRem');if(rm)awayForm.rem=rm.checked;const pv=$('awPriv');if(pv)awayForm.priv=pv.checked}}
async function awaySave(){if(!awayForm.quick)awayRead();const f=awayForm,was=f.was.trim(),ort=f.ort.trim();
 const fail=m=>{f.err=m;note(m);render();setTimeout(()=>{const e=document.querySelector('.awerr');if(e)e.scrollIntoView({block:'center'})},60)};f.err='';if(!f.von){fail('Bitte einen Tag wählen');return}let bis=f.bis||f.von;if(bis<f.von){fail('Der Bis-Tag liegt vor dem Start-Tag');return}
 const kind=f.kind||awayKind,art=kind==='unterwegs'&&f.nacht?'reise':kind,word=AWAY_SUM[art]||'unterwegs',timed=!f.ganz&&!!(f.vt||f.bt),priv=!!f.priv,nz=(f.notiz||'').trim();
 const sd={summary:`${S.prof.name}: ${priv?'Termin':was||word}`};if(ort&&!priv)sd.location=ort;
 sd.description=[f.nacht?'Übernachtung':'','Art: '+(priv?'termin':art),f.mit?'Mit: '+f.mit:'',nz&&!priv?'Notiz: '+nz:'',f.rep?'Wdh: '+(f.rep==='y'?'jährlich':'wöchentlich'):'',f.rem===false?'Erinnerung: aus':'',priv?'Privat: 1':''].filter(Boolean).join('\n');
 if(timed){const st=new Date(f.von+'T'+(f.vt||'00:00'));let en=new Date(bis+'T'+(f.bt||'23:59'));/* 17:00–01:00 am selben Tag = bis nach Mitternacht */if(en<=st&&bis===f.von&&f.bt){bis=iso(new Date(f.von+'T12:00').getTime()+864e5);en=new Date(bis+'T'+f.bt)}if(en<=st){fail('Die Endzeit liegt vor der Startzeit');return}sd.start_date_time=f.von+' '+(f.vt||'00:00')+':00';sd.end_date_time=bis+' '+(f.bt||'23:59')+':00'}
 else{sd.start_date=f.von;sd.end_date=iso(new Date(bis+'T12:00').getTime()+864e5)}
 note('Trage ein …');const repl=f.repl;
 /* Wiederholung nur über den Kalender-Befehl (der Dienst kennt keine RRULE) */
 const cmd=f.rep?{type:'calendar/event/create',entity_id:AWAY_E,event:{summary:sd.summary,description:sd.description,...(sd.location?{location:sd.location}:{}),dtstart:timed?sd.start_date_time.replace(' ','T'):sd.start_date,dtend:timed?sd.end_date_time.replace(' ','T'):sd.end_date,rrule:f.rep==='y'?'FREQ=YEARLY':'FREQ=WEEKLY'}}
  :{type:'call_service',domain:'calendar',service:'create_event',target:{entity_id:AWAY_E},service_data:sd};
 try{const r=await haCall([cmd]);if(!r[0]||!r[0].success)throw new Error((r[0]&&r[0].error&&r[0].error.message)||'Kalender fehlt');
  if(priv){S.calPriv=S.calPriv||{};const st=new Date(timed?f.von+'T'+(f.vt||'00:00'):f.von+'T00:00').getTime();S.calPriv[st+'|'+slugN(S.prof.name)]={was:was||word,ort,art,notiz:nz};S.metaT=Date.now();persist()}
  const a=awayParse({summary:sd.summary,location:ort,description:sd.description,start:timed?f.von+'T'+(f.vt||'00:00'):f.von,end:timed?bis+'T'+(f.bt||'23:59'):sd.end_date});
  tell(`${S.prof.name}${f.edit?' hat geändert':''}: ${priv?'Termin':word}${f.mit?' – du bist dabei':''}`,`${!priv&&was?was+(ort?' in '+ort:'')+'\n':!priv&&ort?'in '+ort+'\n':''}${awayWhen(a)}${f.nacht?' · über Nacht weg':''}`);
  if(repl&&AWAY.some(x=>x.uid===repl)){try{await haCall([{type:'calendar/event/delete',entity_id:AWAY_E,uid:repl}])}catch(e){}}
  /* Überschneidung mit dem Partner am selben Tag zeigen */
  const clash=calAway(f.von).filter(x=>!calMe(x)&&!x.mit&&(!timed||x.allDay||(x.start<new Date(bis+'T'+(f.bt||'23:59')).getTime()&&x.stop>new Date(f.von+'T'+(f.vt||'00:00')).getTime())));
  awayForm=null;await awayFetch();const nu=AWAY.filter(x=>Math.abs(x.start-a.start)<6e4&&calMe(x)).pop();awayUndo=nu?{uid:nu.uid,goal:weekGoal(wk(Date.now())),f:{von:f.von,bis,nacht:!!f.nacht,kind,vt:f.vt,bt:f.bt,mit:f.mit||'',notiz:nz,rep:f.rep||'',priv},was,ort,clash:clash.map(x=>`${x.wer}: ${awayTitle(x)} (${awayWhen(x)})`),msg:`${S.prof.name}${f.mit?' & '+f.mit:''} ${f.mit?'sind':'ist'} ${word}: ${was?was+(ort?' in '+ort:'')+', ':ort?'in '+ort+', ':''}${awayWhen(a)}${f.nacht?', über Nacht weg':''}`}:null;clearTimeout(awayUndoT);awayUndoT=setTimeout(()=>{awayUndo=null;if(view==='cal')render()},30000);note('Eingetragen');render()}catch(e){note('Nicht eingetragen: '+e.message)}}
async function awayRemove(uid,quiet){const a=AWAY.find(x=>x.uid===uid);if(!a)return;note('Lösche …');/* bei Wiederholung: ganze Serie (nur uid) */
 try{const r=await haCall([{type:'calendar/event/delete',entity_id:AWAY_E,uid}]);if(!r[0]||!r[0].success)throw new Error('nicht gefunden');
  if(!quiet&&a.stop>=Date.now())tell(`${a.wer}: Termin fällt weg`,`${a.was}${a.ort?' in '+a.ort:''} · ${awayWhen(a)} ist gestrichen.`);
  AWAY=AWAY.filter(x=>x.uid!==uid);if(a.priv&&S.calPriv){delete S.calPriv[awayKey(a)];S.metaT=Date.now();persist()}try{localStorage.setItem('sc.away',JSON.stringify(AWAY))}catch(e){}awayDel='';note('Gelöscht');render()}catch(e){note('Löschen nicht möglich: '+e.message)}}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-aw]');if(!b)return;const a=b.dataset.aw;
 if(a==='new'){const t=calSel&&calSel>=today()?calSel:today();awayForm={was:'',ort:'',von:t,vt:'',bis:t,bt:'',nacht:false,kind:b.dataset.k||awayKind};awayDel='';awayUndo=null;render();awayFocus()}
 else if(a==='detail'){const u=awayUndo;if(!u)return;awayUndo=null;clearTimeout(awayUndoT);awayForm={was:'',ort:'',vt:'',bt:'',...u.f,repl:u.uid};render();awayFocus('awWas')}
 else if(a==='cancel'){awayForm=null;render()}
 else if(a==='edit'){const x=AWAY.find(y=>y.uid===b.dataset.uid);if(!x)return;const hm=t=>{const d=new Date(t);return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
  const pv=awayPriv(x);awayForm={was:pv?pv.was:awayStd(x.was)?'':x.was,ort:pv?pv.ort:x.ort,notiz:pv?pv.notiz:x.notiz,von:iso(x.start),bis:x.allDay?x.e:iso(awayEnd(x)),vt:x.allDay?'':hm(x.start),bt:x.allDay?'':hm(x.stop),ganz:x.allDay,nacht:x.nacht,kind:pv?pv.art:x.art,mit:x.mit,rep:x.rep,rem:x.rem,priv:x.priv,repl:x.uid,edit:true};
  awayUndo=null;awayDel='';if(view!=='cal'){view='cal'}render();awayFocus('awWas')}
 else if(a==='more'){}
 else if(a==='hoteloff'){awayHotelOff=today();render()}
 else if(a==='kind'){awayKind=b.dataset.v;if(awayForm){awayRead();awayForm.kind=awayKind;if(awayKind==='reise'){awayForm.nacht=true;if(awayForm.bis<=awayForm.von)awayForm.bis=iso(new Date(awayForm.von+'T12:00').getTime()+864e5)}}render()}
 else if(a==='night'){awayRead();awayForm.nacht=!!b.dataset.v;if(awayForm.nacht&&awayForm.bis===awayForm.von)awayForm.bis=iso(new Date(awayForm.von+'T12:00').getTime()+864e5);render()}
 else if(a==='save')awaySave();
 else if(a==='quick')awayQuick(b.dataset.d||iso(Date.now()+(+b.dataset.n)*864e5),!!b.dataset.night);
 else if(a==='undo'){const u=awayUndo;awayUndo=null;if(u)awayRemove(u.uid,true).then(()=>tell(`${S.prof.name}: doch nicht unterwegs`,'Der eben gemeldete Eintrag ist zurückgenommen.'))}
 else if(a==='del'){const k=b.dataset.uid;if(awayDel===k){awayForm=null;awayRemove(k)}else{if(awayForm)awayRead();awayDel=k;render()}}
 else if(a==='morek'){if(awayForm){awayRead();awayForm.more=true}render()}
 else if(a==='rep'){if(awayForm){awayRead();awayForm.rep=b.dataset.v}render()}
 else if(a==='leg'){calLeg=!calLeg;render()}});
/* Von-Datum geändert: Bis mitziehen, wenn es davor läge */
document.addEventListener('change',ev=>{if(ev.target.id==='awGanz'&&awayForm){awayRead();render();return}if(ev.target.id==='awN'&&awayForm){awayRead();if(awayForm.nacht&&awayForm.bis<=awayForm.von){awayForm.bis=iso(new Date(awayForm.von+'T12:00').getTime()+864e5);const b=$('awBis');if(b)b.value=awayForm.bis}return}
 if(ev.target.id==='awBis'&&awayForm){awayRead();if(awayForm.bis>awayForm.von&&['unterwegs','reise','urlaub'].includes(awayForm.kind)){awayForm.nacht=true;const n=$('awN');if(n)n.checked=true}return}if(ev.target.id!=='awVon'||!awayForm)return;awayRead();if(!awayForm.bis||awayForm.bis<awayForm.von){awayForm.bis=awayForm.von;const b=$('awBis');if(b)b.value=awayForm.von}});

/* ===================== KALENDER: Trainingstage beider + Unterwegs in einem Monat =====================
   Wünsche aus der Tester-Befragung: beide auf einen Blick, Wochenstand in Klartext, Unterwegs mit einem Tipp,
   klarer Satz zur Privatsphäre, keine Strafe fürs Wegsein (Wochenziel −1 ab 2 Tagen unterwegs). */
let calM=null,calSel='',awayUndo=null,calLeg=false;
const CALMON=['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
function calSess(d){return S.sessions.filter(s=>iso(s.date)===d)}
/* Abend bis nach Mitternacht (ohne Übernachtung) zählt nur für den Starttag */
const awayEnd=x=>!x.allDay&&!x.nacht&&iso(x.stop)!==iso(x.start)&&new Date(x.stop).getHours()<6?new Date(iso(x.start)+'T23:59').getTime():x.stop;
function calAway(d){const a=new Date(d+'T00:00').getTime(),b=a+864e5-1;return AWAY.filter(x=>x.start<=b&&awayEnd(x)>=a)}
const calMe=a=>slugN(a.wer)===slugN(S.prof.name||'');
/* Trainingstage teilen: 42 Tage als Bitmaske (Kraft / nur Cardio), eigener HA-Helfer input_text.sport_cockpit_<name>_tage */
const TD_N=42;
function tdMine(){let k=0,c=0;const t0=new Date(today()+'T12:00');for(let i=0;i<TD_N;i++){const d=iso(t0.getTime()-i*864e5),ss=calSess(d);if(ss.some(s=>s.ex.length))k+=2**i;else if(ss.length)c+=2**i}
 return{d:today(),k:k.toString(36),c:c.toString(36)}}
function tdPartner(){const p=(typeof partners!=='undefined'?partners:[]).find(x=>x.name&&x.td);if(!p)return null;const t=p.td,k=parseInt(t.k||'0',36),c=parseInt(t.c||'0',36),t0=new Date(t.d+'T12:00').getTime();
 return d=>{const i=Math.round((t0-new Date(d+'T12:00').getTime())/864e5);if(i<0||i>=TD_N)return '';return Math.floor(k/2**i)%2?'k':Math.floor(c/2**i)%2?'c':''}}
/* Fair bleiben: ganze Tage unterwegs in einer Woche; ab 2 Tagen sinkt das Wochenziel um 1 */
function awayDaysWeek(mon,me=true){let n=0;for(let i=0;i<7;i++){const d=iso(mon+i*864e5+12*36e5);if(calAway(d).some(a=>awayHas(a,me)&&awayCounts(a)))n++}return n}
function weekGoal(mon){return Math.max(1,S.goal-(awayDaysWeek(mon)>=2?1:0))}
function calHead(){const mon=wk(Date.now()),mine=S.sessions.filter(s=>wk(s.date)===mon&&s.ex.length).length,g=weekGoal(mon),pf=tdPartner(),pn=sharePartner();
 let pk=0,mk=0;for(let i=0;i<7;i++){const d=iso(mon+i*864e5+12*36e5);if(d>today())break;if(pf&&pf(d))pk++;if(calSess(d).length)mk++}
 /* gemeinsam: Tage im laufenden Monat, an denen beide trainiert haben */
 let both=0;if(pf){const t=new Date();for(let k=1;k<=t.getDate();k++){const d=iso(new Date(t.getFullYear(),t.getMonth(),k,12));if(pf(d)&&calSess(d).length)both++}}
 const ok=mine>=g,ad=awayDaysWeek(mon),pw=(typeof partners!=='undefined'?partners:[]).find(x=>x.name),wp=typeof weekScore==='function'?weekScore():0;
 const aw=AWAY.filter(a=>awayHas(a)&&awayCounts(a)&&a.stop>=mon&&a.start<mon+7*864e5).map(awayWhen).join(', ');
 return `<section class="calsum"><div class="cs1"><span class="cst${ok?' ok':''}">${ok?'Wochenziel geschafft':'Noch '+(g-mine)+(g-mine===1?' Training':' Trainings')+' bis zum Wochenziel'}</span><b class="cond">${mine} von ${g}</b><span>Krafteinheiten diese Woche${g<S.goal?` · Ziel diesmal ${g} statt ${S.goal}`:''}</span></div>
 ${pn?`<div class="cs2"><p><i class="cd me"></i>Du: <b>${mk}×</b> trainiert${wp?` · ${fmt(wp)} Punkte`:''}</p><p><i class="cd pa"></i>${esc(pn)}: <b>${pk}×</b> trainiert${pw&&pw.wp!=null?` · ${fmt(pw.wp)} Punkte`:''}</p>${both?`<p class="csw">Diesen Monat ${both}× am selben Tag trainiert</p>`:''}</div>`:''}</section>
 ${g<S.goal?`<p class="calfair"><b>${ad} Tage weg (${esc(aw)}) → diese Woche reichen ${g}.</b> Gilt für euch beide gleich.</p>`:''}`}
function calDayHtml(d){const ss=calSess(d),aw=calAway(d),dt=new Date(d+'T12:00'),pf=tdPartner(),pt=pf?pf(d):'',pn=sharePartner()||'Partner';
 const head=dt.toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'long'});
 const tr=ss.map(s=>{const sets=s.ex.reduce((a,x)=>a+x.sets.length,0),cm=(s.cardio||[]).reduce((a,c)=>a+(+c.min||0),0);
  return `<li><i class="cd me${s.ex.length?'':' ring'}"></i><div><b>Du: ${s.ex.length&&DAYS[s.day]?DAYS[s.day].n:'Cardio'}</b><span>${[sets?sets+' Sätze':'',cm?Math.round(cm)+' min Cardio':''].filter(Boolean).join(' · ')}</span></div></li>`}).join('')
  +(pt?`<li><i class="cd pa${pt==='k'?'':' ring'}"></i><div><b>${esc(pn)}: ${pt==='k'?'Krafttraining':'Cardio'}</b></div></li>`:'');
 const fut=d>=today(),meAway=aw.some(calMe);
 return `<section class="away calday"><div class="awh"><b>${esc(head)}</b>${d===today()?'<em class="calnow">Heute</em>':''}</div>
 ${tr||aw.length?`${tr?`<ul class="calls">${tr}</ul>`:''}${aw.length?`<ul>${aw.map(a=>awayRow(a,true)).join('')}</ul>`:''}`:`<p class="calnone">${d>today()?'Noch nichts geplant.':'Kein Training, niemand unterwegs.'}</p>`}
 ${fut&&HA.url&&HA.token?`<div class="calgob"><button class="calgo" data-aw="new" data-k="termin">+ Termin an diesem Tag</button>${meAway?'':`<button class="calgo" data-aw="quick" data-d="${d}" data-n="0">Ich bin weg</button>`}</div>`:''}</section>`}
function renderCal(){const now=new Date();if(!calM)calM={y:now.getFullYear(),m:now.getMonth()};if(!calSel)calSel=today();
 const {y,m}=calM,first=new Date(y,m,1),off=(first.getDay()+6)%7,n=new Date(y,m+1,0).getDate(),td=today(),pf=tdPartner(),pn=sharePartner();
 let cells='';for(let i=0;i<off;i++)cells+='<span class="cc pad"></span>';
 for(let k=1;k<=n;k++){const d=iso(new Date(y,m,k,12)),ss=calSess(d),aw=calAway(d),mk=ss.length?'k':'',pt=pf?pf(d):'';
  const awMe=aw.some(a=>awayHas(a)),awPa=aw.some(a=>awayHas(a,false));
  const ic=[];for(const a of aw){const w=a.mit?'both':calMe(a)?'me':'pa',t=awayArt(a);if(!ic.some(x=>x[0]===t&&x[1]===w))ic.push([t,w])}
  cells+=`<button class="cc${d===td?' tdy':''}${d===calSel?' sel':''}${mk&&pt?' both':''}${d>td?' fut':''}" data-cal="${d}" aria-label="${k}.${m+1}.${mk?', du trainiert':''}${pt?', '+esc(pn)+' trainiert':''}${awMe?', du unterwegs':''}${awPa?', '+esc(pn||'Partner')+' unterwegs':''}"><b>${k}</b><span class="cdots">${mk?'<i class="cd me"></i>':''}${pt?'<i class="cd pa"></i>':''}</span>${ic.length?`<span class="cic" data-n="${ic.length}">${ic.slice(0,2).map(([x,c])=>awayIcoW(x,c).replace('<svg ',`<svg data-art="${x}" `)).join('')}${ic.length>2?`<i class="cmore">+${ic.length-2}</i>`:''}</span>`:''}</button>`}
 return `<section class="hero2"><div><p class="hk">Training, Termine, Unterwegs</p><h2>Unser Kalender</h2></div></section>
 ${calHead()}${awayQuickHtml()}
 <section class="away cal"><div class="calnav"><button data-calm="-1" aria-label="Vormonat">‹</button><b>${CALMON[m]} ${y}</b><button data-calm="1" aria-label="Nächster Monat">›</button></div>
 <div class="cgrid">${['Mo','Di','Mi','Do','Fr','Sa','So'].map(x=>`<span class="cwd">${x}</span>`).join('')}${cells}</div>
 <div class="clegend"><span><i class="cd me"></i>Du hast trainiert</span>${pn?`<span><i class="cd pa"></i>${esc(pn)} hat trainiert</span><span><b class="cboth"></b>Rahmen = beide trainiert</span>`:''}</div>${(()=>{const used=[...new Set([...cells.matchAll(/data-art="(\w+)"/g)].map(m=>m[1]))],L=calLeg?AWAY_KINDS:AWAY_KINDS.filter(([x])=>used.includes(x));
  return `<div class="clegend clic">${L.map(([x,l])=>`<span>${awayIco(x)}${l}</span>`).join('')}<span><span class="aicb">${awayIco('termin','ink')}<i class="me"></i><i class="pa"></i></span>zusammen</span><button class="glink" data-aw="leg">${calLeg?'weniger':'Alle Symbole'}</button></div>`})()}<p class="cltap">Tipp: Auf einen Tag tippen, dann siehst du die Einzelheiten.</p></section>
 ${calDayHtml(calSel)}
 ${renderAway()}`}
/* Unterwegs mit einem Tipp */
function awayQuickHtml(){if(!HA.url||!HA.token)return '';const pn=sharePartner()||'Dein Partner';
 if(awayForm&&!awayForm.quick)return awayFormHtml();
 if(awayUndo)return `<section class="awok"><b>Eingetragen ✓</b><p>${esc(pn)} bekommt jetzt diese Nachricht:</p><q>${esc(awayUndo.msg)}</q>${awayUndo.goal<S.goal?`<p>Damit reichen diese Woche ${awayUndo.goal} statt ${S.goal} Trainings.</p>`:''}${(awayUndo.clash||[]).length?`<p class="awclash">Achtung, am selben Tag: ${esc(awayUndo.clash.join(' · '))}</p>`:''}<div class="awokb">${awayUndo.was||awayUndo.ort?'':'<button class="primary" data-aw="detail">Wo, was, Uhrzeit ergänzen</button>'}<button data-aw="undo">Rückgängig machen</button></div></section>`;
 return `<section class="awq"><div class="awqh"><b>Neuer Eintrag</b><button class="primary" data-aw="new" data-k="termin">${awayIco('termin')} Termin eintragen</button></div><p class="awlab">Ich bin weg:</p><div class="awqb"><button class="primary" data-aw="quick" data-n="0">Heute</button><button class="primary" data-aw="quick" data-n="1">Morgen</button><button data-aw="quick" data-n="1" data-night="1">Morgen + Übernachtung</button><button data-aw="new">Genauer: wo, was, wie lange</button></div>
 <div class="awkrow"><span>Was ist los?</span>${awayKindsHtml(AWAY_GONE.includes(awayKind)?awayKind:'unterwegs',AWAY_GONE)}</div>
 <p class="awpriv">Ein Tipp genügt – Uhrzeit, Ort und Anlass kannst du jederzeit über „Bearbeiten“ ergänzen. ${esc(pn)} sieht nur, was du einträgst. Duo liest keinen Kalender von deinem Handy.</p></section>`}
async function awayQuick(von,night){const bis=night?iso(new Date(von+'T12:00').getTime()+864e5):von;awayForm={was:'',ort:'',von,vt:'',bis,bt:'',nacht:!!night,quick:true,kind:AWAY_GONE.includes(awayKind)?awayKind:'unterwegs'};await awaySave()}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-cal],[data-calm]');if(!b)return;
 if(b.dataset.cal){calSel=b.dataset.cal}else{let mm=calM.m+(+b.dataset.calm),yy=calM.y;if(mm<0){mm=11;yy--}if(mm>11){mm=0;yy++}calM={y:yy,m:mm}}render()});
/* Startseite an eigenen Unterwegs-Tagen: Hotel-Workout als Angebot (gleiche Punkte wie jedes erste Kurz-Workout) */
let awayHotelOff='';
function awayHotelHtml(){const td=today(),mine=calAway(td).filter(a=>awayHas(a)&&a.art!=='krank'&&(a.nacht||a.art==='reise')&&(iso(a.start)<td||a.nacht));if(!mine.length||awayHotelOff===td)return '';const done=((S.nut.days[today()]||{}).ch||[]).some(x=>/^wo_/.test(x));if(done)return '';
 return `<section class="awhotel"><div><small>Du bist heute unterwegs</small><b>6 Minuten Training im Hotelzimmer</b><span>Ohne Geräte, ohne Sprünge · +${WO_FREE} Punkte</span></div><div class="awhb"><button class="primary" data-wo="core">Starten</button><button class="ghost" data-aw="hoteloff">Heute nicht</button></div></section>`}
