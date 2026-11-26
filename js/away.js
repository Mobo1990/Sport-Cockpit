/* Duo – Unterwegs: wer wann nicht zu Hause ist (Dienstreisen, Übernachtungen).
   Gespeichert im lokalen HA-Kalender calendar.unterwegs: Titel „Name: Was“, Ort, Beschreibung „Übernachtung“.
   Neue Einträge melden sich per Push beim Partner (script.sport_cockpit_meldung); die HA-Automation
   „Duo – Unterwegs: Erinnerung an den Partner“ erinnert am Vorabend um 19 Uhr und gibt sonntags einen Wochenüberblick. */
'use strict';
const AWAY_E='calendar.unterwegs';
let AWAY=[],awayForm=null,awayDel='',awayUndoT=null,awayKind='unterwegs';
/* Arten mit Symbol (SVG, Farbe = Person). Zählt fürs Wochenziel: ganze Tage, Übernachtung, Urlaub, krank – nicht ein Abend weg. */
const AWAY_KINDS=[['unterwegs','Unterwegs'],['treffen','Treffen'],['reise','Reise'],['urlaub','Urlaub'],['krank','Krank']];
const AWAY_SUM={unterwegs:'unterwegs',treffen:'verabredet',reise:'auf Reise',urlaub:'im Urlaub',krank:'krank'};
const AWAY_ICO={unterwegs:'<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>',
 treffen:'<path d="M6 8h9v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/><path d="M15 11h2.5a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5H15"/><path d="M6 8a2.5 2.5 0 0 1 3-3 3 3 0 0 1 5 .5A2 2 0 0 1 15 8"/>',
 reise:'<path d="M3 19V6M3 15h18v4"/><path d="M21 15v-2.5A2.5 2.5 0 0 0 18.5 10H11v5"/><circle cx="7" cy="11.5" r="1.8"/>',
 urlaub:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
 krank:'<path d="M14 14.5V5a2 2 0 0 0-4 0v9.5a4 4 0 1 0 4 0z"/><path d="M12 9v7"/>'};
const awayIco=(art,cls)=>`<svg class="aic ${cls||''}" viewBox="0 0 24 24" aria-hidden="true">${AWAY_ICO[art]||AWAY_ICO.unterwegs}</svg>`;
/* Zählt der Eintrag fürs Wochenziel? Nicht bei einem Abend/Treffen; ja bei ganzen Tagen, Übernachtung, Urlaub, krank */
const awayCounts=a=>a.art!=='treffen'&&(a.allDay||a.nacht||a.stop-a.start>=8*36e5);
/* Gehört der Eintrag (auch) zu mir – selbst eingetragen oder vom Partner mit „du bist dabei“? */
const awayHas=(a,me=true)=>{const n=slugN(S.prof.name||''),w=slugN(a.wer),m=slugN(a.mit||'');return me?(w===n||m===n):(w!==n||(!!m&&m!==n))};
try{AWAY=JSON.parse(localStorage.getItem('sc.away'))||[]}catch(e){}
const AWT=['So','Mo','Di','Mi','Do','Fr','Sa'];
/* Kalender-Eintrag von HA in unsere Form bringen */
function awayParse(e){const sm=String(e.summary||''),i=sm.indexOf(':'),allDay=!/T/.test(e.start||'');
 let end=new Date(allDay?e.end+'T12:00':e.end);if(allDay)end=new Date(end.getTime()-864e5);
 const ds=String(e.description||''),was=(i>0?sm.slice(i+1):sm).trim(),nacht=/bernacht/i.test(ds),am=ds.match(/Art:\s*(\w+)/i),mm=ds.match(/Mit:\s*([^\n]+)/i);
 const art=am&&AWAY_ICO[am[1].toLowerCase()]?am[1].toLowerCase():/urlaub/i.test(was)?'urlaub':/krank/i.test(was)?'krank':nacht?'reise':'unterwegs';
 return{uid:e.uid||'',wer:i>0?sm.slice(0,i).trim():'',was,ort:e.location||'',nacht,art,mit:mm?mm[1].trim():'',allDay,
  s:allDay?e.start:e.start,e:allDay?iso(end):e.end,start:new Date(allDay?e.start+'T00:00':e.start).getTime(),stop:allDay?new Date(iso(end)+'T23:59').getTime():new Date(e.end).getTime()}}
async function awayFetch(){if(!HA.url||!HA.token)return;const from=new Date();from.setHours(0,0,0,0);from.setDate(from.getDate()-62);const to=new Date(from.getTime()+190*864e5);
 try{const r=await haCall([{type:'call_service',domain:'calendar',service:'get_events',target:{entity_id:AWAY_E},service_data:{start_date_time:from.toISOString(),end_date_time:to.toISOString()},return_response:true}]);
  const m=r[0];if(!m||!m.success)return;const ev=((((m.result||{}).response||{})[AWAY_E]||{}).events||[]).map(awayParse).sort((a,b)=>a.start-b.start);
  if(JSON.stringify(ev)!==JSON.stringify(AWAY)){AWAY=ev;try{localStorage.setItem('sc.away',JSON.stringify(ev))}catch(e){}if((view==='home'||view==='cal')&&!sheet&&!awayForm)render()}}catch(e){}}
/* Zeitraum lesbar: „Do 26.11. 08:00 – Fr 27.11. 18:00“ */
function awayWhen(a){const s=new Date(a.start),e=new Date(a.allDay?a.e+'T12:00':a.e),d=x=>`${AWT[x.getDay()]} ${x.getDate()}.${x.getMonth()+1}.`,t=x=>a.allDay?'':' '+x.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});
 const late=!a.allDay&&iso(e)===iso(s.getTime()+864e5)&&e.getHours()<6&&!a.nacht;/* „bis 0:30“ nach Mitternacht */
 return iso(s)===iso(e)||late?`${d(s)}${a.allDay?' ganztags':`${t(s)}–${t(e).trim()} Uhr`}`:`${d(s)}${t(s)} – ${d(e)}${t(e)}`}
function awayTag(a){const now=Date.now(),td=today(),tm=iso(Date.now()+864e5);if(a.start<=now&&a.stop>=now)return['jetzt','Gerade unterwegs'];
 const sd=iso(a.start);return sd===td?['heute','Heute']:sd===tm?['morgen','Morgen']:['',''];}
const awayStd=w=>!w||/^(unterwegs|verabredet|auf Reise|im Urlaub|krank)$/i.test(w);
function awayRow(a,del){const me=calMe(a),[tc,tl]=awayTag(a),who=esc(a.wer||'?')+(a.mit?' & '+esc(a.mit):'');
 return `<li class="awr${tc?' '+tc:''}">${avaHtml(a.wer||'?',me,'sm')}<div><b>${awayIco(a.art,me?'me':'pa')}${who}</b><span>${esc(awayStd(a.was)?(AWAY_KINDS.find(k=>k[0]===a.art)||['',''])[1]:a.was)}${a.ort?` · ${esc(a.ort)}`:''}</span><small>${esc(awayWhen(a))}</small>${del&&me?`<span class="awsee">${esc(sharePartner()||'Partner')} sieht: ${['Zeitraum',awayStd(a.was)?'':'Anlass',a.ort?'Ort':''].filter(Boolean).join(', ')}</span>`:''}</div>
 <div class="awm">${tl?`<em>${tl}</em>`:''}${a.nacht?'<i>Über Nacht</i>':''}${me&&HA.url?`<button class="awe" data-aw="edit" data-uid="${esc(a.uid)}">Bearbeiten</button>`:''}${del&&me?`<button class="awx${awayDel===a.uid?' danger':''}" data-aw="del" data-uid="${esc(a.uid)}" aria-label="Löschen">${awayDel===a.uid?'Wirklich löschen?':'Löschen'}</button>`:''}</div></li>`}
const awayNext=days=>AWAY.filter(a=>a.stop>=Date.now()&&a.start<=Date.now()+days*864e5);
/* Karte auf der Startseite – nur sichtbar, wenn in den nächsten 14 Tagen jemand weg ist */
function awayHomeHtml(){if(!HA.url||!HA.token)return '';const l=awayNext(14);if(!l.length)return '';
 return `<section class="away"><div class="awh"><b>Unterwegs</b><button data-a="view" data-v="cal">Kalender ›</button></div><ul>${l.slice(0,3).map(a=>awayRow(a,false)).join('')}</ul>${l.length>3?`<p class="awmore">+ ${l.length-3} weitere</p>`:''}</section>`}
/* Eigene Seite: Liste + Eintragen */
/* Formular „Genauer eintragen“: alles auf einen Blick – was, wo, wann, wie lange */
function awayKindsHtml(k){return `<div class="awkind" role="group" aria-label="Was ist los?">${AWAY_KINDS.map(([x,l])=>`<button data-aw="kind" data-v="${x}" aria-pressed="${k===x}">${awayIco(x)}<span>${l}</span></button>`).join('')}</div>`}
function awayFormHtml(){const f=awayForm,pn0=sharePartner(),pn=esc(pn0||'Dein Partner'),k=f.kind||awayKind;
 return `<section class="away form" id="awForm"><div class="awh"><b>${f.repl&&f.edit?'Eintrag bearbeiten':'Ich bin weg – genauer'}</b><button data-aw="cancel">Abbrechen</button></div>
  <p class="awlab">Was ist los?</p>${awayKindsHtml(k)}
  <div class="cform">
  <div class="full"><label for="awWas">Was machst du? <i>freiwillig</i></label><input id="awWas" placeholder="z. B. Dienstreise, Messe, Familie" value="${esc(f.was)}"></div>
  <div class="full"><label for="awOrt">Wo? <i>freiwillig</i></label><input id="awOrt" placeholder="z. B. Köln" value="${esc(f.ort)}"></div>
  <div><label for="awVon">Von (Tag)</label><input id="awVon" type="date" value="${esc(f.von)}"></div><div><label for="awVt">ab Uhrzeit <i>freiwillig</i></label><input id="awVt" type="time" value="${esc(f.vt)}"></div>
  <div><label for="awBis">Bis (Tag)</label><input id="awBis" type="date" value="${esc(f.bis)}"></div><div><label for="awBt">bis Uhrzeit <i>freiwillig</i></label><input id="awBt" type="time" value="${esc(f.bt)}"></div></div>
  <label class="awnight"><input type="checkbox" id="awN" ${f.nacht?'checked':''}> Mit Übernachtung <span>(dann schlägt Duo ein Hotel-Training vor)</span></label>
  ${pn0?`<label class="awnight"><input type="checkbox" id="awMit" ${f.mit?'checked':''}> ${pn} ist auch dabei <span>(steht dann bei euch beiden)</span></label>`:''}
  <p class="awsee">${pn} sieht den Zeitraum und das, was du bei „Was“ und „Wo“ einträgst.</p>
  <div class="actions"><button class="primary" data-aw="save">${f.repl&&f.edit?'Speichern':'Eintragen'}</button></div></section>`}
function renderAway(){const l=AWAY.filter(a=>a.stop>=Date.now()),f=awayForm,td=today();
 if(!HA.url||!HA.token)return `<section class="meal"><header><h3>Unterwegs</h3></header><p class="tip" style="padding:0">Dafür muss die App mit Home Assistant verbunden sein (Mehr → Home Assistant).</p></section>`;
 return `<h3 class="calh">Demnächst unterwegs</h3>
 <section class="away list">${l.length?`<ul>${l.map(a=>awayRow(a,true)).join('')}</ul>`:'<p class="tip" style="padding:0">Gerade ist nichts eingetragen.</p>'}</section>
 `}
function awayFocus(id){setTimeout(()=>{const e=$('awForm');if(e)e.scrollIntoView({block:'start',behavior:'smooth'});const i=id&&$(id);if(i)try{i.focus({preventScroll:true})}catch(x){}},60)}
function awayRead(){const g=(id,k)=>{const e=$(id);return e?e.value:(awayForm[k]||'')};if(awayForm){Object.assign(awayForm,{was:g('awWas','was'),ort:g('awOrt','ort'),von:g('awVon','von'),vt:g('awVt','vt'),bis:g('awBis','bis'),bt:g('awBt','bt')});const n=$('awN');if(n)awayForm.nacht=n.checked;const mt=$('awMit');if(mt)awayForm.mit=mt.checked?sharePartner():''}}
async function awaySave(){if(!awayForm.quick)awayRead();const f=awayForm,was=f.was.trim(),ort=f.ort.trim();
 if(!f.von){note('Startdatum angeben');return}const bis=f.bis||f.von;if(bis<f.von){note('Ende liegt vor dem Start');return}
 const kind=f.kind||awayKind,art=kind==='unterwegs'&&f.nacht?'reise':kind,word=AWAY_SUM[art]||'unterwegs',timed=!!(f.vt||f.bt),sd={summary:`${S.prof.name}: ${was||word}`};if(ort)sd.location=ort;
 sd.description=[f.nacht?'Übernachtung':'','Art: '+art,f.mit?'Mit: '+f.mit:''].filter(Boolean).join('\n');
 if(timed){const st=new Date(f.von+'T'+(f.vt||'00:00')),en=new Date(bis+'T'+(f.bt||'23:59'));if(en<=st){note('Ende liegt vor dem Start');return}sd.start_date_time=f.von+' '+(f.vt||'00:00')+':00';sd.end_date_time=bis+' '+(f.bt||'23:59')+':00'}
 else{sd.start_date=f.von;sd.end_date=iso(new Date(bis+'T12:00').getTime()+864e5)}
 note('Trage ein …');const repl=f.repl;
 try{const r=await haCall([{type:'call_service',domain:'calendar',service:'create_event',target:{entity_id:AWAY_E},service_data:sd}]);if(!r[0]||!r[0].success)throw new Error((r[0]&&r[0].error&&r[0].error.message)||'Kalender fehlt');
  const a=awayParse({summary:sd.summary,location:ort,description:sd.description,start:timed?f.von+'T'+(f.vt||'00:00'):f.von,end:timed?bis+'T'+(f.bt||'23:59'):sd.end_date});
  tell(`${S.prof.name}${f.edit?' hat geändert':''}: ${word}${f.mit?' – du bist dabei':''}`,`${was?was+(ort?' in '+ort:'')+'\n':ort?'in '+ort+'\n':''}${awayWhen(a)}${f.nacht?' · über Nacht weg':''}`);
  if(repl&&AWAY.some(x=>x.uid===repl)){try{await haCall([{type:'calendar/event/delete',entity_id:AWAY_E,uid:repl}])}catch(e){}}
  awayForm=null;await awayFetch();const nu=AWAY.filter(x=>Math.abs(x.start-a.start)<6e4&&calMe(x)).pop();awayUndo=nu?{uid:nu.uid,goal:weekGoal(wk(Date.now())),f:{von:f.von,bis,nacht:!!f.nacht,kind,vt:f.vt,bt:f.bt,mit:f.mit||''},was,ort,msg:`${S.prof.name}${f.mit?' & '+f.mit:''} ${f.mit?'sind':'ist'} ${word}: ${was?was+(ort?' in '+ort:'')+', ':ort?'in '+ort+', ':''}${awayWhen(a)}${f.nacht?', über Nacht weg':''}`}:null;clearTimeout(awayUndoT);awayUndoT=setTimeout(()=>{awayUndo=null;if(view==='cal')render()},30000);note('Eingetragen');render()}catch(e){note('Nicht eingetragen: '+e.message)}}
async function awayRemove(uid,quiet){const a=AWAY.find(x=>x.uid===uid);if(!a)return;note('Lösche …');
 try{const r=await haCall([{type:'calendar/event/delete',entity_id:AWAY_E,uid}]);if(!r[0]||!r[0].success)throw new Error('nicht gefunden');
  if(!quiet&&a.stop>=Date.now())tell(`${a.wer}: Termin fällt weg`,`${a.was}${a.ort?' in '+a.ort:''} · ${awayWhen(a)} ist gestrichen.`);
  AWAY=AWAY.filter(x=>x.uid!==uid);try{localStorage.setItem('sc.away',JSON.stringify(AWAY))}catch(e){}awayDel='';note('Gelöscht');render()}catch(e){note('Löschen nicht möglich: '+e.message)}}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-aw]');if(!b)return;const a=b.dataset.aw;
 if(a==='new'){const t=today();awayForm={was:'',ort:'',von:t,vt:'',bis:t,bt:'',nacht:false,kind:awayKind};awayDel='';awayUndo=null;render();awayFocus()}
 else if(a==='detail'){const u=awayUndo;if(!u)return;awayUndo=null;clearTimeout(awayUndoT);awayForm={was:'',ort:'',vt:'',bt:'',...u.f,repl:u.uid};render();awayFocus('awWas')}
 else if(a==='cancel'){awayForm=null;render()}
 else if(a==='edit'){const x=AWAY.find(y=>y.uid===b.dataset.uid);if(!x)return;const hm=t=>{const d=new Date(t);return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
  awayForm={was:awayStd(x.was)?'':x.was,ort:x.ort,von:iso(x.start),bis:x.allDay?x.e:iso(x.stop),vt:x.allDay?'':hm(x.start),bt:x.allDay?'':hm(x.stop),nacht:x.nacht,kind:x.art,mit:x.mit,repl:x.uid,edit:true};
  awayUndo=null;awayDel='';if(view!=='cal'){view='cal'}render();awayFocus('awWas')}
 else if(a==='more'){}
 else if(a==='hoteloff'){awayHotelOff=today();render()}
 else if(a==='kind'){awayKind=b.dataset.v;if(awayForm){awayRead();awayForm.kind=awayKind;if(awayKind==='reise'){awayForm.nacht=true;if(awayForm.bis<=awayForm.von)awayForm.bis=iso(new Date(awayForm.von+'T12:00').getTime()+864e5)}}render()}
 else if(a==='night'){awayRead();awayForm.nacht=!!b.dataset.v;if(awayForm.nacht&&awayForm.bis===awayForm.von)awayForm.bis=iso(new Date(awayForm.von+'T12:00').getTime()+864e5);render()}
 else if(a==='save')awaySave();
 else if(a==='quick')awayQuick(b.dataset.d||iso(Date.now()+(+b.dataset.n)*864e5),!!b.dataset.night);
 else if(a==='undo'){const u=awayUndo;awayUndo=null;if(u)awayRemove(u.uid,true).then(()=>tell(`${S.prof.name}: doch nicht unterwegs`,'Der eben gemeldete Eintrag ist zurückgenommen.'))}
 else if(a==='del'){if(awayDel===b.dataset.uid)awayRemove(b.dataset.uid);else{awayDel=b.dataset.uid;render()}}});
/* Von-Datum geändert: Bis mitziehen, wenn es davor läge */
document.addEventListener('change',ev=>{if(ev.target.id==='awN'&&awayForm){awayRead();if(awayForm.nacht&&awayForm.bis<=awayForm.von){awayForm.bis=iso(new Date(awayForm.von+'T12:00').getTime()+864e5);const b=$('awBis');if(b)b.value=awayForm.bis}return}
 if(ev.target.id==='awBis'&&awayForm){awayRead();if(awayForm.bis>awayForm.von){awayForm.nacht=true;const n=$('awN');if(n)n.checked=true}return}if(ev.target.id!=='awVon'||!awayForm)return;awayRead();if(!awayForm.bis||awayForm.bis<awayForm.von){awayForm.bis=awayForm.von;const b=$('awBis');if(b)b.value=awayForm.von}});

/* ===================== KALENDER: Trainingstage beider + Unterwegs in einem Monat =====================
   Wünsche aus der Tester-Befragung: beide auf einen Blick, Wochenstand in Klartext, Unterwegs mit einem Tipp,
   klarer Satz zur Privatsphäre, keine Strafe fürs Wegsein (Wochenziel −1 ab 2 Tagen unterwegs). */
let calM=null,calSel='',awayUndo=null;
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
 ${tr||aw.length?`${tr?`<ul class="calls">${tr}</ul>`:''}${aw.length?`<ul>${aw.map(a=>awayRow(a,false)).join('')}</ul>`:''}`:`<p class="calnone">${d>today()?'Noch nichts geplant.':'Kein Training, niemand unterwegs.'}</p>`}
 ${fut&&!meAway&&HA.url&&HA.token?`<button class="calgo" data-aw="quick" data-d="${d}" data-n="0">An diesem Tag bin ich unterwegs</button>`:''}</section>`}
function renderCal(){const now=new Date();if(!calM)calM={y:now.getFullYear(),m:now.getMonth()};if(!calSel)calSel=today();
 const {y,m}=calM,first=new Date(y,m,1),off=(first.getDay()+6)%7,n=new Date(y,m+1,0).getDate(),td=today(),pf=tdPartner(),pn=sharePartner();
 let cells='';for(let i=0;i<off;i++)cells+='<span class="cc pad"></span>';
 for(let k=1;k<=n;k++){const d=iso(new Date(y,m,k,12)),ss=calSess(d),aw=calAway(d),mk=ss.length?'k':'',pt=pf?pf(d):'';
  const awMe=aw.some(a=>awayHas(a)),awPa=aw.some(a=>awayHas(a,false));
  const ic=[];for(const a of aw){if(awayHas(a)&&!ic.some(x=>x[1]==='me'&&x[0]===a.art))ic.push([a.art,'me']);if(awayHas(a,false)&&!ic.some(x=>x[1]==='pa'&&x[0]===a.art))ic.push([a.art,'pa'])}
  cells+=`<button class="cc${d===td?' tdy':''}${d===calSel?' sel':''}${mk&&pt?' both':''}${d>td?' fut':''}" data-cal="${d}" aria-label="${k}.${m+1}.${mk?', du trainiert':''}${pt?', '+esc(pn)+' trainiert':''}${awMe?', du unterwegs':''}${awPa?', '+esc(pn||'Partner')+' unterwegs':''}"><b>${k}</b><span class="cdots">${mk?'<i class="cd me"></i>':''}${pt?'<i class="cd pa"></i>':''}</span>${ic.length?`<span class="cic">${ic.slice(0,2).map(([x,c])=>awayIco(x,c)).join('')}</span>`:''}</button>`}
 return `<section class="hero2"><div><p class="hk">Training und Unterwegs</p><h2>Kalender</h2></div></section>
 ${calHead()}${awayQuickHtml()}
 <section class="away cal"><div class="calnav"><button data-calm="-1" aria-label="Vormonat">‹</button><b>${CALMON[m]} ${y}</b><button data-calm="1" aria-label="Nächster Monat">›</button></div>
 <div class="cgrid">${['Mo','Di','Mi','Do','Fr','Sa','So'].map(x=>`<span class="cwd">${x}</span>`).join('')}${cells}</div>
 <div class="clegend"><span><i class="cd me"></i>Du hast trainiert</span>${pn?`<span><i class="cd pa"></i>${esc(pn)} hat trainiert</span><span><b class="cboth"></b>Rahmen = beide trainiert</span>`:''}</div><div class="clegend clic">${AWAY_KINDS.map(([x,l])=>`<span>${awayIco(x)}${l==='Reise'?'Übernachtung':l}</span>`).join('')}<span class="clhint">Farbe = wer</span></div><p class="cltap">Tipp: Auf einen Tag tippen, dann siehst du die Einzelheiten.</p></section>
 ${calDayHtml(calSel)}
 ${renderAway()}`}
/* Unterwegs mit einem Tipp */
function awayQuickHtml(){if(!HA.url||!HA.token)return '';const pn=sharePartner()||'Dein Partner';
 if(awayForm&&!awayForm.quick)return awayFormHtml();
 if(awayUndo)return `<section class="awok"><b>Eingetragen ✓</b><p>${esc(pn)} bekommt jetzt diese Nachricht:</p><q>${esc(awayUndo.msg)}</q>${awayUndo.goal<S.goal?`<p>Damit reichen diese Woche ${awayUndo.goal} statt ${S.goal} Trainings.</p>`:''}<div class="awokb">${awayUndo.was||awayUndo.ort?'':'<button class="primary" data-aw="detail">Wo, was, Uhrzeit ergänzen</button>'}<button data-aw="undo">Rückgängig machen</button></div></section>`;
 return `<section class="awq"><b>Ich bin weg</b><div class="awqb"><button class="primary" data-aw="quick" data-n="0">Heute</button><button class="primary" data-aw="quick" data-n="1">Morgen</button><button data-aw="quick" data-n="1" data-night="1">Morgen + Übernachtung</button><button data-aw="new">Genauer: wo, was, wie lange</button></div>
 <div class="awkrow"><span>Was ist los?</span>${awayKindsHtml(awayKind)}</div>
 <p class="awpriv">Ein Tipp genügt – Uhrzeit, Ort und Anlass kannst du jederzeit über „Bearbeiten“ ergänzen. ${esc(pn)} sieht nur, was du einträgst. Duo liest keinen Kalender von deinem Handy.</p></section>`}
async function awayQuick(von,night){const bis=night?iso(new Date(von+'T12:00').getTime()+864e5):von;awayForm={was:'',ort:'',von,vt:'',bis,bt:'',nacht:!!night,quick:true,kind:awayKind};await awaySave()}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-cal],[data-calm]');if(!b)return;
 if(b.dataset.cal){calSel=b.dataset.cal}else{let mm=calM.m+(+b.dataset.calm),yy=calM.y;if(mm<0){mm=11;yy--}if(mm>11){mm=0;yy++}calM={y:yy,m:mm}}render()});
/* Startseite an eigenen Unterwegs-Tagen: Hotel-Workout als Angebot (gleiche Punkte wie jedes erste Kurz-Workout) */
let awayHotelOff='';
function awayHotelHtml(){const td=today(),mine=calAway(td).filter(a=>awayHas(a)&&a.art!=='krank'&&(a.nacht||a.art==='reise')&&(iso(a.start)<td||a.nacht));if(!mine.length||awayHotelOff===td)return '';const done=((S.nut.days[today()]||{}).ch||[]).some(x=>/^wo_/.test(x));if(done)return '';
 return `<section class="awhotel"><div><small>Du bist heute unterwegs</small><b>6 Minuten Training im Hotelzimmer</b><span>Ohne Geräte, ohne Sprünge · +${WO_FREE} Punkte</span></div><div class="awhb"><button class="primary" data-wo="core">Starten</button><button class="ghost" data-aw="hoteloff">Heute nicht</button></div></section>`}
