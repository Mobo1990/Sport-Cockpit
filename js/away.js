/* Duo – Unterwegs: wer wann nicht zu Hause ist (Dienstreisen, Übernachtungen).
   Gespeichert im lokalen HA-Kalender calendar.unterwegs: Titel „Name: Was“, Ort, Beschreibung „Übernachtung“.
   Neue Einträge melden sich per Push beim Partner (script.sport_cockpit_meldung); die HA-Automation
   „Duo – Unterwegs: Erinnerung an den Partner“ erinnert am Vorabend um 19 Uhr und gibt sonntags einen Wochenüberblick. */
'use strict';
const AWAY_E='calendar.unterwegs';
let AWAY=[],awayForm=null,awayDel='',awayUndoT=null;
try{AWAY=JSON.parse(localStorage.getItem('sc.away'))||[]}catch(e){}
const AWT=['So','Mo','Di','Mi','Do','Fr','Sa'];
/* Kalender-Eintrag von HA in unsere Form bringen */
function awayParse(e){const sm=String(e.summary||''),i=sm.indexOf(':'),allDay=!/T/.test(e.start||'');
 let end=new Date(allDay?e.end+'T12:00':e.end);if(allDay)end=new Date(end.getTime()-864e5);
 return{uid:e.uid||'',wer:i>0?sm.slice(0,i).trim():'',was:(i>0?sm.slice(i+1):sm).trim(),ort:e.location||'',nacht:/bernacht/i.test(e.description||''),allDay,
  s:allDay?e.start:e.start,e:allDay?iso(end):e.end,start:new Date(allDay?e.start+'T00:00':e.start).getTime(),stop:allDay?new Date(iso(end)+'T23:59').getTime():new Date(e.end).getTime()}}
async function awayFetch(){if(!HA.url||!HA.token)return;const from=new Date();from.setHours(0,0,0,0);from.setDate(from.getDate()-62);const to=new Date(from.getTime()+190*864e5);
 try{const r=await haCall([{type:'call_service',domain:'calendar',service:'get_events',target:{entity_id:AWAY_E},service_data:{start_date_time:from.toISOString(),end_date_time:to.toISOString()},return_response:true}]);
  const m=r[0];if(!m||!m.success)return;const ev=((((m.result||{}).response||{})[AWAY_E]||{}).events||[]).map(awayParse).sort((a,b)=>a.start-b.start);
  if(JSON.stringify(ev)!==JSON.stringify(AWAY)){AWAY=ev;try{localStorage.setItem('sc.away',JSON.stringify(ev))}catch(e){}if((view==='home'||view==='cal')&&!sheet&&!awayForm)render()}}catch(e){}}
/* Zeitraum lesbar: „Do 26.11. 08:00 – Fr 27.11. 18:00“ */
function awayWhen(a){const s=new Date(a.start),e=new Date(a.allDay?a.e+'T12:00':a.e),d=x=>`${AWT[x.getDay()]} ${x.getDate()}.${x.getMonth()+1}.`,t=x=>a.allDay?'':' '+x.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});
 return iso(s)===iso(e)?`${d(s)}${a.allDay?'':`${t(s)}–${t(e).trim()}`}`:`${d(s)}${t(s)} – ${d(e)}${t(e)}`}
function awayTag(a){const now=Date.now(),td=today(),tm=iso(Date.now()+864e5);if(a.start<=now&&a.stop>=now)return['jetzt','Gerade unterwegs'];
 const sd=iso(a.start);return sd===td?['heute','Heute']:sd===tm?['morgen','Morgen']:['',''];}
function awayRow(a,del){const me=slugN(a.wer)===slugN(S.prof.name||''),[tc,tl]=awayTag(a);
 return `<li class="awr${tc?' '+tc:''}">${avaHtml(a.wer||'?',me,'sm')}<div><b>${esc(a.wer||'?')}${a.ort?` · ${esc(a.ort)}`:''}</b><span>${esc(a.was)}</span><small>${esc(awayWhen(a))}</small>${del&&calMe(a)?`<em class="awsee">${esc(sharePartner()||'Partner')} sieht: ${a.was&&a.was!=='unterwegs'||a.ort?'Zeitraum'+(a.was&&a.was!=='unterwegs'?', Anlass':'')+(a.ort?', Ort':''):'nur den Zeitraum'}</em>`:''}</div>
 <div class="awm">${tl?`<em>${tl}</em>`:''}${a.nacht?'<i>Über Nacht</i>':''}${del?`<button class="awx${awayDel===a.uid?' danger':''}" data-aw="del" data-uid="${esc(a.uid)}" aria-label="Löschen">${awayDel===a.uid?'Wirklich löschen?':'Löschen'}</button>`:''}</div></li>`}
const awayNext=days=>AWAY.filter(a=>a.stop>=Date.now()&&a.start<=Date.now()+days*864e5);
/* Karte auf der Startseite – nur sichtbar, wenn in den nächsten 14 Tagen jemand weg ist */
function awayHomeHtml(){if(!HA.url||!HA.token)return '';const l=awayNext(14);if(!l.length)return '';
 return `<section class="away"><div class="awh"><b>Unterwegs</b><button data-a="view" data-v="cal">Kalender ›</button></div><ul>${l.slice(0,3).map(a=>awayRow(a,false)).join('')}</ul>${l.length>3?`<p class="awmore">+ ${l.length-3} weitere</p>`:''}</section>`}
/* Eigene Seite: Liste + Eintragen */
function renderAway(){const l=AWAY.filter(a=>a.stop>=Date.now()),f=awayForm,td=today();
 if(!HA.url||!HA.token)return `<section class="meal"><header><h3>Unterwegs</h3></header><p class="tip" style="padding:0">Dafür muss die App mit Home Assistant verbunden sein (Mehr → Home Assistant).</p></section>`;
 return `<h3 class="calh">Demnächst unterwegs</h3>
 ${f?`<section class="away form"><div class="awh"><b>Unterwegs eintragen</b><button data-aw="cancel">Abbrechen</button></div>
  <div class="cform"><div><label for="awVon">Von</label><input id="awVon" type="date" value="${esc(f.von)}"></div><div><label for="awBis">Bis</label><input id="awBis" type="date" value="${esc(f.bis)}"></div>
  ${f.more?`<div><label for="awVt">ab Uhrzeit</label><input id="awVt" type="time" value="${esc(f.vt)}"></div><div><label for="awBt">bis Uhrzeit</label><input id="awBt" type="time" value="${esc(f.bt)}"></div>
  <div class="full"><label for="awWas">Anlass (freiwillig)</label><input id="awWas" placeholder="z. B. Dienstreise" value="${esc(f.was)}"></div><div class="full"><label for="awOrt">Ort (freiwillig)</label><input id="awOrt" placeholder="z. B. Köln" value="${esc(f.ort)}"></div>`:''}</div>
  <label class="awnight"><input type="checkbox" id="awN" ${f.nacht?'checked':''}> Mit Übernachtung</label>
  ${f.more?'':'<button class="glink" data-aw="more">+ Uhrzeit, Anlass oder Ort (freiwillig)</button>'}
  <div class="actions"><button class="primary" data-aw="save">Eintragen</button></div></section>`
 :''}
 <section class="away list">${l.length?`<ul>${l.map(a=>awayRow(a,true)).join('')}</ul>`:'<p class="tip" style="padding:0">Gerade ist nichts eingetragen.</p>'}</section>
 `}
function awayRead(){const g=(id,k)=>{const e=$(id);return e?e.value:(awayForm[k]||'')};if(awayForm){Object.assign(awayForm,{was:g('awWas','was'),ort:g('awOrt','ort'),von:g('awVon','von'),vt:g('awVt','vt'),bis:g('awBis','bis'),bt:g('awBt','bt')});const n=$('awN');if(n)awayForm.nacht=n.checked}}
async function awaySave(){if(!awayForm.quick)awayRead();const f=awayForm,was=f.was.trim(),ort=f.ort.trim();
 if(!f.von){note('Startdatum angeben');return}const bis=f.bis||f.von;if(bis<f.von){note('Ende liegt vor dem Start');return}
 const timed=!!(f.vt||f.bt),sd={summary:`${S.prof.name}: ${was||'unterwegs'}`};if(ort)sd.location=ort;if(f.nacht)sd.description='Übernachtung';
 if(timed){const st=new Date(f.von+'T'+(f.vt||'00:00')),en=new Date(bis+'T'+(f.bt||'23:59'));if(en<=st){note('Ende liegt vor dem Start');return}sd.start_date_time=f.von+' '+(f.vt||'00:00')+':00';sd.end_date_time=bis+' '+(f.bt||'23:59')+':00'}
 else{sd.start_date=f.von;sd.end_date=iso(new Date(bis+'T12:00').getTime()+864e5)}
 note('Trage ein …');
 try{const r=await haCall([{type:'call_service',domain:'calendar',service:'create_event',target:{entity_id:AWAY_E},service_data:sd}]);if(!r[0]||!r[0].success)throw new Error((r[0]&&r[0].error&&r[0].error.message)||'Kalender fehlt');
  const a=awayParse({summary:sd.summary,location:ort,description:sd.description,start:timed?f.von+'T'+(f.vt||'00:00'):f.von,end:timed?bis+'T'+(f.bt||'23:59'):sd.end_date});
  tell(`${S.prof.name} ist unterwegs`,`${was?was+(ort?' in '+ort:'')+'\n':ort?'in '+ort+'\n':''}${awayWhen(a)}${f.nacht?' · über Nacht weg':''}`);
  awayForm=null;await awayFetch();const nu=AWAY.filter(x=>x.s===a.s&&calMe(x)).pop();awayUndo=nu?{uid:nu.uid,msg:`${S.prof.name} ist unterwegs: ${was?was+(ort?' in '+ort:'')+', ':ort?'in '+ort+', ':''}${awayWhen(a)}${f.nacht?', über Nacht weg':''}`}:null;clearTimeout(awayUndoT);awayUndoT=setTimeout(()=>{awayUndo=null;if(view==='cal')render()},15000);note('Eingetragen');render()}catch(e){note('Nicht eingetragen: '+e.message)}}
async function awayRemove(uid,quiet){const a=AWAY.find(x=>x.uid===uid);if(!a)return;note('Lösche …');
 try{const r=await haCall([{type:'calendar/event/delete',entity_id:AWAY_E,uid}]);if(!r[0]||!r[0].success)throw new Error('nicht gefunden');
  if(!quiet&&a.stop>=Date.now())tell(`${a.wer}: Termin fällt weg`,`${a.was}${a.ort?' in '+a.ort:''} · ${awayWhen(a)} ist gestrichen.`);
  AWAY=AWAY.filter(x=>x.uid!==uid);try{localStorage.setItem('sc.away',JSON.stringify(AWAY))}catch(e){}awayDel='';note('Gelöscht');render()}catch(e){note('Löschen nicht möglich: '+e.message)}}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-aw]');if(!b)return;const a=b.dataset.aw;
 if(a==='new'){const t=today();awayForm={was:'',ort:'',von:t,vt:'',bis:t,bt:'',nacht:false};awayDel='';render()}
 else if(a==='cancel'){awayForm=null;render()}
 else if(a==='more'){awayRead();awayForm.more=true;render()}
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
function calAway(d){const a=new Date(d+'T00:00').getTime(),b=a+864e5-1;return AWAY.filter(x=>x.start<=b&&x.stop>=a)}
const calMe=a=>slugN(a.wer)===slugN(S.prof.name||'');
/* Trainingstage teilen: 42 Tage als Bitmaske (Kraft / nur Cardio), eigener HA-Helfer input_text.sport_cockpit_<name>_tage */
const TD_N=42;
function tdMine(){let k=0,c=0;const t0=new Date(today()+'T12:00');for(let i=0;i<TD_N;i++){const d=iso(t0.getTime()-i*864e5),ss=calSess(d);if(ss.some(s=>s.ex.length))k+=2**i;else if(ss.length)c+=2**i}
 return{d:today(),k:k.toString(36),c:c.toString(36)}}
function tdPartner(){const p=(typeof partners!=='undefined'?partners:[]).find(x=>x.name&&x.td);if(!p)return null;const t=p.td,k=parseInt(t.k||'0',36),c=parseInt(t.c||'0',36),t0=new Date(t.d+'T12:00').getTime();
 return d=>{const i=Math.round((t0-new Date(d+'T12:00').getTime())/864e5);if(i<0||i>=TD_N)return '';return Math.floor(k/2**i)%2?'k':Math.floor(c/2**i)%2?'c':''}}
/* Fair bleiben: ganze Tage unterwegs in einer Woche; ab 2 Tagen sinkt das Wochenziel um 1 */
function awayDaysWeek(mon,me=true){let n=0;for(let i=0;i<7;i++){const d=iso(mon+i*864e5+12*36e5);if(calAway(d).some(a=>calMe(a)===me))n++}return n}
function weekGoal(mon){return Math.max(1,S.goal-(awayDaysWeek(mon)>=2?1:0))}
function calHead(){const mon=wk(Date.now()),mine=S.sessions.filter(s=>wk(s.date)===mon&&s.ex.length).length,g=weekGoal(mon),pf=tdPartner(),pn=sharePartner();
 let pk=0,mk=0;for(let i=0;i<7;i++){const d=iso(mon+i*864e5+12*36e5);if(d>today())break;if(pf&&pf(d))pk++;if(calSess(d).length)mk++}
 /* gemeinsam: Tage im laufenden Monat, an denen beide trainiert haben */
 let both=0;if(pf){const t=new Date();for(let k=1;k<=t.getDate();k++){const d=iso(new Date(t.getFullYear(),t.getMonth(),k,12));if(pf(d)&&calSess(d).length)both++}}
 const ok=mine>=g,ad=awayDaysWeek(mon),pw=(typeof partners!=='undefined'?partners:[]).find(x=>x.name),wp=typeof weekScore==='function'?weekScore():0;
 const aw=AWAY.filter(a=>calMe(a)&&a.stop>=mon&&a.start<mon+7*864e5).map(awayWhen).join(', ');
 return `<section class="calsum"><div class="cs1"><span class="cst${ok?' ok':''}">${ok?'Wochenziel geschafft':'Noch '+(g-mine)+' Training bis zum Wochenziel'}</span><b class="cond">${mine} von ${g}</b><span>Krafteinheiten diese Woche</span></div>
 ${pn?`<div class="cs2"><p><i class="cd me"></i>Du: <b>${mk}×</b> trainiert${wp?` · ${fmt(wp)} Punkte`:''}</p><p><i class="cd pa"></i>${esc(pn)}: <b>${pk}×</b> trainiert${pw&&pw.wp!=null?` · ${fmt(pw.wp)} Punkte`:''}</p>${both?`<p class="csw">Diesen Monat ${both}× am selben Tag trainiert</p>`:''}</div>`:''}</section>
 ${g<S.goal?`<p class="calfair"><b>Diese Woche reichen ${g} statt ${S.goal}</b> – du bist ${ad} Tage unterwegs (${esc(aw)}).<br>Gilt für euch beide gleich. Trainierst du trotzdem mehr, zählt alles ganz normal.</p>`:''}`}
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
  const awMe=aw.some(calMe),awPa=aw.some(a=>!calMe(a)),nacht=aw.some(a=>a.nacht&&iso(a.start)!==iso(a.stop)&&d<iso(a.stop));
  cells+=`<button class="cc${d===td?' tdy':''}${d===calSel?' sel':''}${mk&&pt?' both':''}${d>td?' fut':''}" data-cal="${d}" aria-label="${k}.${m+1}.${mk?', du trainiert':''}${pt?', '+esc(pn)+' trainiert':''}${awMe?', du unterwegs':''}${awPa?', '+esc(pn||'Partner')+' unterwegs':''}"><b>${k}</b><span class="cdots">${mk?'<i class="cd me"></i>':''}${pt?'<i class="cd pa"></i>':''}</span>${awMe||awPa?`<span class="cbar">${awMe?'<s class="me"></s>':''}${awPa?'<s class="pa"></s>':''}</span>`:''}</button>`}
 return `<section class="hero2"><div><p class="hk">Training und Unterwegs</p><h2>Kalender</h2></div></section>
 ${calHead()}${awayQuickHtml()}
 <section class="away cal"><div class="calnav"><button data-calm="-1" aria-label="Vormonat">‹</button><b>${CALMON[m]} ${y}</b><button data-calm="1" aria-label="Nächster Monat">›</button></div>
 <div class="cgrid">${['Mo','Di','Mi','Do','Fr','Sa','So'].map(x=>`<span class="cwd">${x}</span>`).join('')}${cells}</div>
 <div class="clegend"><span><i class="cd me"></i>Du hast trainiert</span>${pn?`<span><i class="cd pa"></i>${esc(pn)} hat trainiert</span><span><b class="cboth"></b>Rahmen = beide trainiert</span>`:''}<span><s class="me"></s><s class="pa"></s>Strich = unterwegs</span></div><p class="cltap">Tipp: Auf einen Tag tippen, dann siehst du die Einzelheiten.</p></section>
 ${calDayHtml(calSel)}
 ${renderAway()}`}
/* Unterwegs mit einem Tipp */
function awayQuickHtml(){if(!HA.url||!HA.token)return '';const pn=sharePartner()||'Dein Partner';
 if(awayUndo)return `<section class="awok"><b>Eingetragen ✓</b><p>${esc(pn)} bekommt jetzt diese Nachricht:</p><q>${esc(awayUndo.msg)}</q><button data-aw="undo">Rückgängig machen</button></section>`;
 return `<section class="awq"><b>Ich bin unterwegs</b><div class="awqb"><button class="primary" data-aw="quick" data-n="0">Heute</button><button class="primary" data-aw="quick" data-n="1">Morgen</button><button data-aw="quick" data-n="1" data-night="1">Morgen + Übernachtung</button><button data-aw="new">Anderer Zeitraum</button></div>
 <p class="awpriv">Ein Tipp genügt. ${esc(pn)} sieht nur den Zeitraum – kein Anlass, kein Ort, außer du trägst ihn selbst ein. Duo liest keinen Kalender von deinem Handy.</p></section>`}
async function awayQuick(von,night){const bis=night?iso(new Date(von+'T12:00').getTime()+864e5):von;awayForm={was:'',ort:'',von,vt:'',bis,bt:'',nacht:!!night,quick:true};await awaySave()}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-cal],[data-calm]');if(!b)return;
 if(b.dataset.cal){calSel=b.dataset.cal}else{let mm=calM.m+(+b.dataset.calm),yy=calM.y;if(mm<0){mm=11;yy--}if(mm>11){mm=0;yy++}calM={y:yy,m:mm}}render()});
/* Startseite an eigenen Unterwegs-Tagen: Hotel-Workout als Angebot (gleiche Punkte wie jedes erste Kurz-Workout) */
function awayHotelHtml(){if(!calAway(today()).some(calMe))return '';const done=((S.nut.days[today()]||{}).ch||[]).some(x=>/^wo_/.test(x));if(done)return '';
 return `<section class="awhotel"><div><small>Du bist heute unterwegs</small><b>6 Minuten Training im Hotelzimmer</b><span>Ohne Geräte, ohne Sprünge · +${WO_FREE} Punkte${weekGoal(wk(Date.now()))<S.goal?` · dein Wochenziel ist diese Woche ${weekGoal(wk(Date.now()))} statt ${S.goal}`:''}</span></div><button class="primary" data-wo="core">Starten</button></section>`}
