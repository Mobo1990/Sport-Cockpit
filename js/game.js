/* Sport Cockpit – Punkte, Partner-Meldungen, Tageswerte für HA */
'use strict';
/* ===================== PUNKTE & PARTNER ===================== */
const slugN=n=>String(n||'').toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
/* Coach-Challenges: 3 kleine Aufgaben pro Tag (für alle gleich, aus dem Datum gewählt) */
const CH=[
 {id:'push10',k:'k',t:'10 Liegestütze',s:'Sauber, Brust bis knapp über den Boden. Knie am Boden ist okay.',pt:5},
 {id:'squat20',k:'k',t:'20 Kniebeugen',s:'Ohne Gewicht, Fersen bleiben am Boden.',pt:5},
 {id:'plank30',k:'k',t:'30 s Unterarmstütz',s:'Bauch und Po fest, Körper eine Linie.',pt:5},
 {id:'plank60',k:'k',t:'60 s Unterarmstütz',s:'Am Stück. Pausen zählen nicht.',pt:10},
 {id:'lunge15',k:'k',t:'15 Ausfallschritte je Bein',s:'Hinteres Knie kurz über den Boden.',pt:5},
 {id:'jack30',k:'k',t:'30 Hampelmänner',s:'Zügig am Stück.',pt:5},
 {id:'burpee10',k:'k',t:'10 Burpees',s:'Runter, Liegestütz-Position, hoch, Sprung.',pt:10},
 {id:'wall45',k:'k',t:'45 s Wandsitzen',s:'Oberschenkel waagerecht, Rücken an der Wand.',pt:5},
 {id:'bridge15',k:'k',t:'15 Glute Bridges',s:'Oben 1 Sekunde halten, Po fest.',pt:5},
 {id:'dips10',k:'k',t:'10 Dips am Stuhl',s:'Hände an der Kante, Ellbogen nach hinten.',pt:5},
 {id:'calf25',k:'k',t:'25 Wadenheben',s:'Auf einer Stufe, ganz hoch und tief.',pt:5},
 {id:'wo_core',k:'k',t:'Core-Workout · 6 min',s:'Geführt mit Timer: Stütz, Crunches, Beinheben.',pt:15,w:'core'},
 {id:'wo_zirkel',k:'k',t:'Kurz-Zirkel · 7 min',s:'Geführt mit Timer: Ganzkörper ohne Geräte.',pt:15,w:'zirkel'},
 {id:'push3x',k:'k',t:'3 × 10 Liegestütze über den Tag',s:'Morgens, mittags, abends je 10.',pt:10},
 {id:'walk10',k:'a',t:'10 Minuten spazieren',s:'Am besten nach dem Essen.',pt:5},
 {id:'stretch5',k:'a',t:'5 Minuten dehnen',s:'Brust, Hüfte, Beinrückseite.',pt:5},
 {id:'water0',k:'a',t:'Glas Wasser nach dem Aufstehen',s:'Noch vor dem Kaffee.',pt:5},
 {id:'nosoda',k:'a',t:'Heute kein Süßgetränk',s:'Wasser, Tee oder Kaffee ohne Zucker.',pt:5},
 {id:'veg',k:'a',t:'Eine Portion Gemüse extra',s:'Zu einer Mahlzeit dazu.',pt:5},
 {id:'wo_mobil',k:'a',t:'Mobility · 5 min',s:'Geführt mit Timer: Schultern, Rücken, Hüfte.',pt:10,w:'mobil'},
 {id:'mob10',k:'a',t:'10 Minuten Mobility',s:'Hüfte und Schultern locker machen.',pt:5}];
const CH_BONUS=10;
function dayCh(d){let h=2166136261;for(const c of 'ch'+d)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;
 const pick=(arr,n)=>{const a=[...arr],o=[];while(o.length<n&&a.length){h=Math.imul(h^(h>>>15),2246822507)>>>0;o.push(a.splice(h%a.length,1)[0])}return o};
 return [...pick(CH.filter(c=>c.k==='k'),2),...pick(CH.filter(c=>c.k==='a'),1)]}
function chDone(d){const list=dayCh(d),done=(S.nut.days[d]||{}).ch||[];return list.filter(c=>done.includes(c.id))}
function chPoints(d){const dn=chDone(d);return dn.reduce((a,c)=>a+c.pt,0)+(dn.length===3?CH_BONUS:0)}
function chHtml(){const d=today(),list=dayCh(d),done=chDone(d).map(c=>c.id),n=done.length;
 return `<h3 class="sh">Challenges heute <small class="chn">${n} / 3${n===3?' · Bonus +'+CH_BONUS+' geholt':' · alle 3 = +'+CH_BONUS+' Bonus'}</small></h3><div class="chl">${list.map(c=>{const ok=done.includes(c.id);return `<div class="chi${ok?' ok':''}" data-ch="${c.id}" role="button" tabindex="0" aria-pressed="${ok}"><i aria-hidden="true"></i><div><b>${esc(c.t)}</b><span>${esc(c.s)}</span>${c.w&&!ok?`<button class="wogo" data-wo="${c.w}" data-woc="${c.id}">Jetzt starten ›</button>`:''}</div><em>+${c.pt}</em></div>`}).join('')}</div>`}
document.addEventListener('keydown',ev=>{if((ev.key==='Enter'||ev.key===' ')&&ev.target.matches&&ev.target.matches('.chi[data-ch]')){ev.preventDefault();ev.target.click()}});
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-ch]');if(!b)return;const d=today(),dd=ND(d),id=b.dataset.ch;
 const before=chDone(d).length;dd.ch=(dd.ch||[]).includes(id)?dd.ch.filter(x=>x!==id):[...(dd.ch||[]),id];touch(d);
 const after=chDone(d).length;if(after===3&&before<3)tell(`${S.prof.name||'Jemand'} hat alle Challenges geschafft`,`Heute alle 3 Coach-Challenges erledigt (+${chPoints(d)} Punkte). Und du?`);
 render()});
/* Persönliche Tagesziele (im Profil einstellbar) */
let wml=false;
const waterGoal=()=>Math.round((num(S.prof.wgoal)||2)*1000),stepGoal=()=>Math.round(num(S.prof.sgoal)||10000);
const daySteps=d=>{const x=S.nut.days[d]||{};return Math.max((x.h||{}).st||0,x.stm||0)};
function goalsHtml(){const d=today(),w=(S.nut.days[d]||{}).water||0,wg=waterGoal(),st=daySteps(d),sg=stepGoal(),hs=((S.nut.days[d]||{}).h||{}).st;
 return `<section class="dgoals"><div class="dg"><div class="tl"><span>Wasser</span><span><b>${fmt(w/1000)}</b> / ${fmt(wg/1000)} l</span></div>${rbar(w,wg,'up')}
  <div class="dgb${wml?'':' wbtn'}">${wml?`<input id="wMl" inputmode="numeric" placeholder="ml" aria-label="Menge in ml"><button class="primary" data-h="wmlok">+ ml</button><button class="ghost" data-h="wml" aria-label="Abbrechen">✕</button>`:`<button data-h="water" data-v="300">+ Glas</button><button data-h="water" data-v="750">+ Flasche</button><button class="ghost wmlb" data-h="wml">+ eigene Menge (ml)</button>`}</div><div class="dgf">${w>=wg?'<small class="ok">Ziel geschafft · +10</small>':`<small>noch ${fmt((wg-w)/1000)} l · +10</small>`}${w&&(S.nut.days[d]||{}).wlast?`<button class="undo" data-h="wundo" aria-label="Letzte Menge zurücknehmen">−${fmt((S.nut.days[d]||{}).wlast)} ml zurück</button>`:''}</div></div>
 <div class="dg"><div class="tl"><span>Schritte</span><span><b>${fmt(st)}</b> / ${fmt(sg)}</span></div>${rbar(st,sg,'up')}
  <div class="dgb">${hs?`<span class="src">aus Apple Health</span>`:`<input id="hSt" inputmode="numeric" placeholder="Schritte" aria-label="Schritte heute" value="${(S.nut.days[d]||{}).stm||''}"><button data-h="steps">OK</button>`}</div>${st>=sg?'<small class="ok">Ziel geschafft · +10</small>':`<small>noch ${fmt(sg-st)} · +10</small>`}</div></section>`}
/* Alkoholfreie Tage: Punkte steigen mit der Serie, Bonus an Meilensteinen */
const WO_FREE=10,WO_FREE_AB='2026-11-24';/* gilt ab diesem Tag – frühere Tage behalten ihre Punkte */
const AF_MS={7:20,14:30,30:50,60:75,100:100};
const afPts=n=>Math.min(4+n,15);
const dayShift=(d,k)=>{const x=new Date(d+'T12:00:00');x.setDate(x.getDate()+k);return iso(x)};
/* Alkoholfrei: af 1 = alkoholfrei, -1 = Alkohol getrunken, fehlt = noch nicht beantwortet. Nur 1 zählt für die Serie. */
const afOk=d=>(S.nut.days[d]||{}).af===1;
function afStreak(d){let n=0;while(afOk(d)){n++;d=dayShift(d,-1)}return n}
const AF_WD=['So','Mo','Di','Mi','Do','Fr','Sa'];
function afHtml(){const d=today(),yd=dayShift(d,-1),v=(S.nut.days[d]||{}).af,on=v===1,no=v===-1,yv=(S.nut.days[yd]||{}).af,
 cur=on?afStreak(d):no?0:afStreak(yd),nT=on?cur:cur+1,pT=afPts(nT)+(AF_MS[nT]||0),ms=Object.keys(AF_MS).map(Number).find(m=>m>cur),late=new Date().getHours()>=18;
 const week=Array.from({length:7},(_,i)=>dayShift(d,i-6));
 return `<section class="afc${!v&&late?' ask':''}"><div class="afh"><div class="afn"><b class="cond">${cur}</b><span>${cur===1?'Tag':'Tage'} alkoholfrei<br>am Stück</span></div>
 <small>${no?'Serie startet<br>morgen neu':`<b>+${pT}</b> heute${on?'':' möglich'}<br>${ms?`+${AF_MS[ms]} Bonus in ${ms-cur} ${ms-cur===1?'Tag':'Tagen'}`:'Alle Meilensteine geschafft'}`}</small></div>
 ${!v&&late?`<p class="afq">Heute noch nicht eingetragen – warst du alkoholfrei?</p>`:''}
 <div class="afb"><button class="afbtn${on?' ok':''}" data-af="${d}" data-v="1" aria-pressed="${on}">${on?'Heute alkoholfrei ✓':'Heute alkoholfrei'}</button><button class="afno${no?' on':''}" data-af="${d}" data-v="-1" aria-pressed="${no}">${no?'Alkohol getrunken ✓':'Hatte Alkohol'}</button></div>
 <div class="afwk" aria-label="Letzte 7 Tage – antippen zum Ändern">${week.map(k=>{const x=(S.nut.days[k]||{}).af;return `<button class="afd${x===1?' y':x===-1?' n':''}" data-afc="${k}" aria-label="${AF_WD[new Date(k+'T12:00').getDay()]}: ${x===1?'alkoholfrei':x===-1?'Alkohol':'offen'}"><small>${k===d?'Heute':AF_WD[new Date(k+'T12:00').getDay()]}</small><b>${x===1?'✓':x===-1?'✗':'–'}</b></button>`}).join('')}</div>
 ${!yv?`<p class="afhint">Gestern ist noch offen – tippe oben auf den Tag (✓ alkoholfrei, ✗ Alkohol).</p>`:''}</section>`}
function afSet(d,val){const dd=ND(d);if(val)dd.af=val;else delete dd.af;touch(d);const n=afStreak(today())||afStreak(dayShift(today(),-1));
 if(val===1&&AF_MS[n])tell(`${S.prof.name||'Jemand'}: ${n} Tage alkoholfrei`,`${n} Tage am Stück ohne Alkohol – Bonus +${AF_MS[n]}. Hältst du mit?`);render()}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-af],[data-afc]');if(!b)return;
 if(b.dataset.afc){const d=b.dataset.afc,x=(S.nut.days[d]||{}).af;afSet(d,!x?1:x===1?-1:0);return}
 const d=b.dataset.af,val=+b.dataset.v||1;afSet(d,(S.nut.days[d]||{}).af===val?0:val)});
function dayScore(d){const g=goals(d),t=totals(d),day=S.nut.days[d]||{},ss=S.sessions.filter(s=>iso(s.date)===d);let pt=0;const why=[];
 const tr=ss.find(s=>s.ex.length);if(tr){pt+=30;why.push('Training +30')}
 const c=ss.reduce((a,s)=>a+(s.cardio||[]).reduce((b,x)=>b+x.min,0),0),hh=day.h||{};if(c>=20){pt+=15;why.push('Cardio +15')}else if((hh.tm||0)>=30){pt+=15;why.push('Bewegung (Watch) +15')}
 if(daySteps(d)>=stepGoal()){pt+=10;why.push('Schrittziel +10')}
 if(t.kcal>0){if(t.p>=g.p){pt+=20;why.push('Protein +20')}else if(t.p>=g.p*.9){pt+=10;why.push('Protein fast +10')}
  const dev=Math.abs(t.kcal-g.kcal)/g.kcal;if(dev<=.1){pt+=20;why.push('Kalorien im Ziel +20')}else if(dev<=.2){pt+=10;why.push('Kalorien nah dran +10')}}
 if(day.af===1){const n=afStreak(d),p=afPts(n)+(AF_MS[n]||0);pt+=p;why.push(`Alkoholfrei Tag ${n} +${p}`)}
 const chp=chPoints(d);if(chp){pt+=chp;why.push((chDone(d).length===3?'Alle Challenges +':'Challenges +')+chp)}
 /* Kurz-Workout ohne Challenge: das erste am Tag gibt +10, weitere nichts (Gym-Training bleibt mit +30 klar vorn) */
 {const ids=dayCh(d).map(c=>c.id);if(d>=WO_FREE_AB&&(day.ch||[]).some(id=>/^wo_/.test(id)&&!ids.includes(id))){pt+=WO_FREE;why.push('Kurz-Workout +'+WO_FREE)}}
 if(day.w){pt+=5;why.push('Gewogen +5')}if((day.water||0)>=waterGoal()){pt+=10;why.push('Wasserziel +10')}
 if(day.wkc){pt+=WK_PTS;why.push('Wochen-Challenge +'+WK_PTS)}if(day.cpc){pt+=CP_PTS;why.push('Paar-Challenge +'+CP_PTS)}
 {const ap=advPoints(d);if(ap){pt+=ap;why.push('Adventstürchen +'+ap)}}
 const prn=ss.reduce((a,s)=>a+(s.prn||0),0);if(prn){pt+=10*prn;why.push(prn+'× Bestwert +'+10*prn)}
 return{pt,why,g,t,c,tr:tr?DAYS[tr.day].n:''}}
function weekScore(){const m=new Date(wk(Date.now()));let sum=0;for(let i=0;i<7;i++){const d=new Date(m);d.setDate(d.getDate()+i);if(d>new Date())break;sum+=dayScore(iso(d)).pt}return sum}
const SC_URL='shortcuts://run-shortcut?name='+encodeURIComponent('Cockpit Health');
function healthLink(){if(!HA.token)return '';const age=S.hT?Date.now()-S.hT:Infinity;const stale=age>3600e3;
 return `<a class="hlink${stale?' stale':''}" href="${SC_URL}" data-hl="1">↻ Apple Health ${stale?'aktualisieren':'· vor '+Math.max(1,Math.round(age/60000))+' min geholt'}</a>`}
function scoreLine(){const s=dayScore(today());return healthLink()+`<p class="nline" data-a="view" data-v="nut">Heute <b>${s.pt} Punkte</b> · Woche <b>${weekScore()}</b>${s.why.length?' · '+s.why.join(', '):' · Trainiere, iss im Ziel und trink genug, um Punkte zu sammeln'}</p>`}
let lastPub='';
async function publish(){if(!HA.token||!S.prof.name)return;const d=today(),s=dayScore(d);
 const base={d,k:Math.round(s.t.kcal),kz:s.g.kcal,p:Math.round(s.t.p),pz:s.g.p,tr:s.tr,c:Math.round(s.c),pt:s.pt,wp:weekScore(),w:myWeekStats(),tp:myTotal(),af:(S.nut.days[d]||{}).af||0};
 /* Wasser und Schritte von heute (für den Zwischenstand um 22 Uhr) – nur wenn es in 255 Zeichen passt, nie abgeschnittenes JSON */
 const full={...base,wa:(S.nut.days[d]||{}).water||0,wz:waterGoal(),s:daySteps(d),sz:stepGoal()};let v=JSON.stringify(full);if(v.length>255)v=JSON.stringify(base);if(v===lastPub)return;
 try{const r=await haCall([{type:'call_service',domain:'input_text',service:'set_value',service_data:{entity_id:'input_text.sport_cockpit_'+slugN(S.prof.name),value:v.slice(0,255)}}]);if(r[0]&&r[0].success)lastPub=v}catch(e){}
 const dd=S.nut.days[d];if(dd&&s.t.p>=s.g.p&&!dd.pg){dd.pg=1;touch(d);tell('Proteinziel geschafft','💪 '+S.prof.name+' hat heute '+Math.round(s.t.p)+' g Protein gegessen.')}}
async function tell(titel,nachricht){if(!HA.token||!S.prof.name)return;try{await haCall([{type:'call_service',domain:'script',service:'sport_cockpit_meldung',service_data:{von:S.prof.name,titel,nachricht}}])}catch(e){}}
function announce(s,prs){const n=S.prof.name||'Jemand',sets=s.ex.reduce((a,x)=>a+x.sets.length,0),cm=(s.cardio||[]).reduce((a,c)=>a+c.min,0);
 if(s.ex.length)tell(`${n} hat ${DAYS[s.day].n} trainiert`,`🏋️ ${sets} Sätze · ${fmt(Math.round(vol(s)))} kg bewegt${cm?` · ${cm} min Cardio`:''}${prs.length?` · ${prs.length} neue${prs.length>1?'':'r'} Bestwert${prs.length>1?'e':''}!`:''}\nDu bist dran 😉`);
 else if(cm){const kc=s.cardio.reduce((a,c)=>a+(c.kcal||0),0);tell(`${n} war beim Cardio`,`🏃 ${cm} min ${(s.cardio[0]||{}).type||''}${kc?` · ≈ ${fmt(kc)} kcal`:''}\nUnd du?`)}}

