/* Sport Cockpit – Punkte, Partner-Meldungen, Tageswerte für HA */
'use strict';
/* ===================== PUNKTE & PARTNER ===================== */
const slugN=n=>String(n||'').toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
/* Coach-Challenges: 3 kleine Aufgaben pro Tag (für alle gleich, aus dem Datum gewählt) */
const CH=[
 {id:'push10',k:'k',t:'10 Liegestütze',s:'Sauber, Brust bis knapp über den Boden. Knie am Boden ist okay.',pt:5},
 {id:'squat20',k:'k',t:'20 Kniebeugen',s:'Ohne Gewicht, Fersen bleiben am Boden.',pt:5,kn:{t:'20 Stuhl-Kniebeugen',s:'Nur bis zum Stuhl absetzen, Knie hinter den Zehen, langsam hoch.'}},
 {id:'plank30',k:'k',t:'30 s Unterarmstütz',s:'Bauch und Po fest, Körper eine Linie.',pt:5},
 {id:'plank60',k:'k',t:'60 s Unterarmstütz',s:'Am Stück. Pausen zählen nicht.',pt:10},
 {id:'lunge15',k:'k',t:'15 Ausfallschritte je Bein',s:'Hinteres Knie kurz über den Boden.',pt:5,kn:{t:'15 Glute Bridges je Bein',s:'Einbeinig in Rückenlage, Hüfte oben 1 Sekunde halten.'}},
 {id:'jack30',k:'k',t:'30 Hampelmänner',s:'Zügig am Stück.',pt:5,kn:{t:'30 Step-Jacks',s:'Ohne Sprung: abwechselnd seitlich raustippen, Arme hoch.'}},
 {id:'burpee10',k:'k',t:'10 Burpees',s:'Runter, Liegestütz-Position, hoch, Sprung.',pt:10,kn:{t:'10 Burpees ohne Sprung',s:'Beine nacheinander nach hinten setzen und zurück, aufrichten ohne Sprung.'}},
 {id:'wall45',k:'k',t:'45 s Wandsitzen',s:'Oberschenkel waagerecht, Rücken an der Wand.',pt:5,kn:{t:'45 s Wandsitzen hoch',s:'Nur leicht in die Knie (etwa 45°), Rücken an der Wand.'}},
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
 {id:'mob10',k:'a',t:'10 Minuten Mobility',s:'Hüfte und Schultern locker machen.',pt:5},
 /* Kopf-Aufgaben (ab 25.11.2026 im Topf – ältere Tage behalten ihre Challenges) */
 {id:'read30',k:'a',t:'30 Minuten lesen',s:'Ein Buch, kein Bildschirm.',pt:5,ab:'2026-11-25'},
 {id:'breathe5',k:'a',t:'5 Minuten bewusst atmen',s:'4 Sekunden ein, 4 halten, 6 aus – im Sitzen, Augen zu.',pt:5,ab:'2026-11-25'},
 {id:'phone2230',k:'a',t:'Handy ab 22:30 weg',s:'Ab ins andere Zimmer oder in die Schublade.',pt:5,ab:'2026-11-25'},
 {id:'thanks3',k:'a',t:'3 Dinge aufschreiben, für die du dankbar bist',s:'Kurz, auf Papier oder im Handy – Hauptsache ehrlich.',pt:5,ab:'2026-11-25'},
 {id:'talk20',k:'a',t:'20 Minuten reden – Handys weg',s:'Mit deinem Partner oder einem Freund: Wie war der Tag wirklich?',pt:5,ab:'2026-11-25'}];
const CH_BONUS=10;
/* Knieschonend (Profil): Challenges/Workouts mit Knie-Belastung zeigen ihre schonende Variante, gleiche Punkte */
const kneeOn=()=>S.prof.knee==='1';
function dayCh(d){let h=2166136261;for(const c of 'ch'+d)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;
 const pick=(arr,n)=>{const a=[...arr],o=[];while(o.length<n&&a.length){h=Math.imul(h^(h>>>15),2246822507)>>>0;o.push(a.splice(h%a.length,1)[0])}return o};
 const ok=c=>!c.ab||d>=c.ab;return [...pick(CH.filter(c=>c.k==='k'&&ok(c)),2),...pick(CH.filter(c=>c.k==='a'&&ok(c)),1)]}
function chDone(d){const list=dayCh(d),done=(S.nut.days[d]||{}).ch||[];return list.filter(c=>done.includes(c.id))}
function chPoints(d){const dn=chDone(d);return dn.reduce((a,c)=>a+c.pt,0)+(dn.length===3?CH_BONUS:0)}
function chHtml(){const d=today(),list=dayCh(d),done=chDone(d).map(c=>c.id),n=done.length;
 return `<h3 class="sh">Challenges heute <small class="chn">${n} / 3${n===3?' · Bonus +'+CH_BONUS+' geholt':' · alle 3 = +'+CH_BONUS+' Bonus'}</small></h3><div class="chl">${list.map(c=>{const ok=done.includes(c.id);return `<div class="chi${ok?' ok':''}" data-ch="${c.id}" role="button" tabindex="0" aria-pressed="${ok}"><i aria-hidden="true"></i><div>${c.kn&&kneeOn()?`<b>${esc(c.kn.t)}</b><span>${esc(c.kn.s)}</span><small class="chkn">knieschonende Variante</small>`:`<b>${esc(c.t)}</b><span>${esc(c.s)}</span>${c.kn?`<small class="chkn">Knie schonen: ${esc(c.kn.t)}</small>`:''}`}${c.w&&!ok?`<button class="wogo" data-wo="${c.w}" data-woc="${c.id}">Jetzt starten ›</button>`:''}</div><em>+${c.pt}</em></div>`}).join('')}</div>`}
document.addEventListener('keydown',ev=>{if((ev.key==='Enter'||ev.key===' ')&&ev.target.matches&&ev.target.matches('.chi[data-ch]')){ev.preventDefault();ev.target.click()}});
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-ch]');if(!b)return;const d=today(),dd=ND(d),id=b.dataset.ch;
 const before=chDone(d).length;dd.ch=(dd.ch||[]).includes(id)?dd.ch.filter(x=>x!==id):[...(dd.ch||[]),id];touch(d);
 const after=chDone(d).length;if(after===3&&before<3)tell(`${S.prof.name||'Jemand'} hat alle Challenges geschafft`,`Heute alle 3 Coach-Challenges erledigt (+${chPoints(d)} Punkte). Und du?`);
 if(after>before){const c=CH.find(x=>x.id===id);if(after===3)cheer({big:true,title:'Alle 3 geschafft!',sub:'Challenges heute erledigt',pts:(c?c.pt:0)+CH_BONUS});else if(c)cheer({title:cheerWord(),sub:(c.kn&&kneeOn()?c.kn.t:c.t),pts:c.pt})}
 render()});
/* Persönliche Tagesziele (im Profil einstellbar) */
let wml=false;
const waterGoal=()=>Math.round((num(S.prof.wgoal)||2)*1000),stepGoal=()=>Math.round(num(S.prof.sgoal)||10000);
const daySteps=d=>{const x=S.nut.days[d]||{};return Math.max((x.h||{}).st||0,x.stm||0)};
/* ===== Neue Karte „Heute“ im Duo-Design: Kalorien-Tacho mit Punkte-Zone, drei Ringe, Wasser als Gläser ===== */
const isDuo=()=>document.documentElement.classList.contains('th-duo');
let stepEd=false,ptsOpen=false;
function dArc(cx,cy,r,a0,a1){const p=a=>[cx+r*Math.cos(a*Math.PI/180),cy-r*Math.sin(a*Math.PI/180)],[x0,y0]=p(a0),[x1,y1]=p(a1);return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${Math.abs(a0-a1)>180?1:0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`}
function dGauge(eaten,goal,zone){const mx=Math.max(goal*1.25,eaten*1.05,1),ang=v=>180-180*Math.min(Math.max(v,0),mx)/mx,cx=150,cy=150,r=118,left=Math.round(goal-eaten);
 let s=`<svg viewBox="0 0 300 186" role="img" aria-label="${fmt(Math.round(eaten))} von ${fmt(goal)} kcal gegessen"><path d="${dArc(cx,cy,r,180,0)}" fill="none" stroke="#F1E4DC" stroke-width="22" stroke-linecap="round"/>`;
 if(zone){s+=`<path d="${dArc(cx,cy,r,ang(zone[0]),ang(zone[1]))}" fill="none" stroke="#E3ECE6" stroke-width="22"/><path d="${dArc(cx,cy,r+15,ang(zone[0]),ang(zone[1]))}" fill="none" stroke="#6F8F7E" stroke-width="3" stroke-linecap="round"/>`}
 if(eaten>0)s+=`<path d="${dArc(cx,cy,r,180,Math.min(179.4,ang(eaten)))}" fill="none" stroke="${eaten>(zone?zone[1]:goal*1.1)?'#9A5F4E':'#C4917F'}" stroke-width="22" stroke-linecap="round"/>`;
 const a=ang(goal)*Math.PI/180;s+=`<circle cx="${(cx+r*Math.cos(a)).toFixed(1)}" cy="${(cy-r*Math.sin(a)).toFixed(1)}" r="8" fill="#E2725B" stroke="#FFFCF8" stroke-width="3"><title>Ziel ${fmt(goal)} kcal</title></circle>`;
 s+=`<text x="150" y="118" text-anchor="middle" font-family="Outfit,DM Sans,sans-serif" font-weight="800" font-size="56" fill="#221C1A">${fmt(Math.abs(left))}</text><text x="150" y="142" text-anchor="middle" font-family="DM Sans,sans-serif" font-weight="600" font-size="15" fill="#4A4340">${left>=0?'kcal übrig':'kcal drüber'}</text>`;
 return s+`<text x="22" y="182" font-family="DM Sans,sans-serif" font-size="12" fill="#8C7F78">${fmt(Math.round(eaten))} gegessen</text><text x="278" y="182" text-anchor="end" font-family="DM Sans,sans-serif" font-size="12" fill="#8C7F78">Ziel ${fmt(goal)}</text></svg>`}
function dRing(frac,col,val,done){const r=30,c=2*Math.PI*r,f=Math.min(Math.max(frac,0),1);
 return `<svg viewBox="0 0 76 76" aria-hidden="true"><circle cx="38" cy="38" r="${r}" fill="none" stroke="${col}" stroke-opacity=".18" stroke-width="8"/>${f>0?`<circle cx="38" cy="38" r="${r}" fill="none" stroke="${col}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${(c*f).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 38 38)"/>`:''}${done?`<circle cx="38" cy="38" r="22" fill="${col}"/>`:''}<text x="38" y="44" text-anchor="middle" font-family="Outfit,DM Sans,sans-serif" font-weight="800" font-size="${String(val).length<4?20:String(val).length<5?17:String(val).length<6?14:12}" fill="${done?'#fff':'#221C1A'}">${val}</text></svg>`}
function dGlass(fill){const y=(6+34*(1-Math.min(Math.max(fill,0),1))).toFixed(1),id='wg'+Math.random().toString(36).slice(2,7);
 return `<svg viewBox="0 0 34 44" aria-hidden="true"><defs><clipPath id="${id}"><path d="M5 4 L29 4 L26 40 L8 40 Z"/></clipPath></defs>${fill>0?`<rect x="0" y="${y}" width="34" height="44" fill="#5FA3E0" clip-path="url(#${id})"/>`:''}<path d="M5 4 L29 4 L26 40 L8 40 Z" fill="none" stroke="${fill>0?'#3F86C9':'#C9C3BA'}" stroke-width="2.2" stroke-linejoin="round"/></svg>`}
let dRec={d:'',v:0};
function dRecord(d){if(dRec.d===d)return dRec.v;let v=0;for(let i=1;i<=60;i++){const x=dayShift(d,-i);if(S.nut.days[x]||S.sessions.some(s=>iso(s.date)===x))v=Math.max(v,dayScore(x).pt)}dRec={d,v};return v}
function duoTodayHtml(sc){const d=today(),g=sc.g,t=sc.t,day=S.nut.days[d]||{},G=goalAt(d),band=(typeof KCAL_BANDS!=='undefined'&&d>=KCAL_NEW_AB)?(KCAL_BANDS[G]||KCAL_BANDS.halten)[0]:null,m=g.kcal-(GOAL_ADD[G]||0);
 const zone=band?[m+band[0],m+band[1]]:null,meals=new Set((day.items||[]).map(i=>i.meal)).size;
 let zh='';if(zone){const zl=fmt(Math.round(zone[0]/10)*10),zu=fmt(Math.round(zone[1]/10)*10);zh=t.kcal<zone[0]?`Gut im Rahmen · Ziel bis heute Abend: ${zl}–${zu} kcal`:t.kcal<=zone[1]?(meals>=2?`Im Ziel · +${band[2]}`:`Im Ziel · +${band[2]} ab 2 Mahlzeiten`):`Über dem Ziel (${zu} kcal)`}
 const pDone=t.p>=g.p,st=daySteps(d),sg=stepGoal(),hs=(day.h||{}).st,rec=dRecord(d),w=day.water||0,wg=waterGoal(),n=Math.max(1,Math.ceil(wg/300)),wDone=w>=wg;
 const glasses=Array.from({length:n},(_,i)=>`<button class="wg" data-h="water" data-v="300" aria-label="Glas Wasser, 300 ml">${dGlass(w/300-i)}</button>`).join('');
 return `<div class="dh"><button class="gw" data-a="view" data-v="nut" aria-label="Essen heute, zum Essen-Tab" style="background:none;border:0;box-shadow:none;padding:0;min-height:0">${dGauge(t.kcal,g.kcal,zone)}</button>
 ${zh?`<p class="zh${zone&&t.kcal>=zone[0]&&t.kcal<=zone[1]&&meals>=2?' ok':''}"><i></i>${zh}</p>`:''}
 <div class="mr"><button class="mi" data-a="view" data-v="nut">${dRing(g.p?t.p/g.p:0,'#6F8F7E',fmt(Math.round(t.p)),pDone)}<b>Protein</b><small>${pDone?'geschafft · +20':`noch ${fmt(Math.round(g.p-t.p))} g`}</small></button>
 <button class="mi" data-h="stepin">${dRing(sg?st/sg:0,'#D29A4E',fmt(Math.round(st)),st>=sg)}<b>Schritte</b><small>${st>=sg?'geschafft · +10':`noch ${fmt(Math.round(sg-st))}`}</small></button>
 <button class="mi" data-h="ptsinfo" aria-expanded="${ptsOpen}">${dRing(rec?sc.pt/Math.max(rec,1):sc.pt?1:0,'#E2725B',sc.pt,false)}<b>Punkte</b><small>${ptsOpen?'ausblenden':'woher? ›'}</small></button></div>
 ${ptsOpen?`<div class="ptsl"><b>Heute ${sc.pt} Punkte${rec?` · Rekord ${rec}`:''}</b>${sc.why.length?`<ul>${sc.why.map(w=>`<li>${esc(w)}</li>`).join('')}</ul>`:'<p>Noch keine Punkte heute.</p>'}<p>Punkte gibt es für: Training +30 · Protein +20 · Wasser +10 · Schritte +10 · Kalorien in der Zone +10 · Challenges +5 bis +15 · alkoholfrei +5 · Wiegen +5 · Cardio +15.</p></div>`:''}
 ${stepEd?`<div class="stin"><input id="hSt" inputmode="numeric" placeholder="Schritte heute" value="${day.stm||''}" aria-label="Schritte heute">${hs!=null?'':''}<button class="primary" data-h="steps">OK</button></div><p class="zh">${hs!=null?'Kommt aus Apple Health – eigener Wert zählt, wenn er höher ist.':'Ohne Apple Health hier eintragen.'}</p>`:''}
 <div class="wa"><div class="wh"><b>Wasser</b><span class="${wDone?'ok':''}">${fmt(w/1000)} / ${fmt(wg/1000)} l${wDone?' · geschafft +10':` · noch ${fmt((wg-w)/1000)} l`}</span></div>
 <div class="gl">${glasses}</div>
 ${wml?`<div class="wml"><input id="wMl" inputmode="numeric" placeholder="ml" aria-label="Menge in ml"><button class="primary" data-h="wmlok">+ ml</button><button class="ghost" data-h="wml" aria-label="Abbrechen">✕</button></div>`:`<div class="wx"><button data-h="water" data-v="750">+ Flasche</button><button data-h="wml">+ ml</button>${w&&day.wlast?`<button data-h="wundo" aria-label="Letzte Menge zurücknehmen">${fmt(day.wlast)} ml zurück</button>`:''}</div>`}</div>
 <div class="wt"><label for="hW">Gewicht heute</label><input id="hW" inputmode="decimal" placeholder="${lastWeight(d)?fmt(lastWeight(d)):'kg'}" value="${day.w&&day.wsrc!=='prof'?fmt(day.w):''}" aria-label="Gewicht heute in kg"><span>kg</span><button data-h="w">${day.w&&day.wsrc!=='prof'?'✓':'OK'}</button></div></div>`}
function goalsHtml(){const d=today(),w=(S.nut.days[d]||{}).water||0,wg=waterGoal(),st=daySteps(d),sg=stepGoal(),hs=((S.nut.days[d]||{}).h||{}).st;
 return `<section class="dgoals"><div class="dg"><div class="tl"><span>Wasser</span><span><b>${fmt(w/1000)}</b> / ${fmt(wg/1000)} l</span></div>${rbar(w,wg,'up')}
  <div class="dgb${wml?'':' wbtn'}">${wml?`<input id="wMl" inputmode="numeric" placeholder="ml" aria-label="Menge in ml"><button class="primary" data-h="wmlok">+ ml</button><button class="ghost" data-h="wml" aria-label="Abbrechen">✕</button>`:`<button data-h="water" data-v="300">+ Glas</button><button data-h="water" data-v="750">+ Flasche</button><button class="ghost wmlb" data-h="wml">+ eigene Menge (ml)</button>`}</div><div class="dgf">${w>=wg?'<small class="ok">Ziel geschafft · +10</small>':`<small>noch ${fmt((wg-w)/1000)} l · +10</small>`}${w&&(S.nut.days[d]||{}).wlast?`<button class="undo" data-h="wundo" aria-label="Letzte Menge zurücknehmen">−${fmt((S.nut.days[d]||{}).wlast)} ml zurück</button>`:''}</div></div>
 <div class="dg"><div class="tl"><span>Schritte</span><span><b>${fmt(st)}</b> / ${fmt(sg)}</span></div>${rbar(st,sg,'up')}
  <div class="dgb">${hs?`<span class="src">aus Apple Health</span>`:`<input id="hSt" inputmode="numeric" placeholder="Schritte" aria-label="Schritte heute" value="${(S.nut.days[d]||{}).stm||''}"><button data-h="steps">OK</button>`}</div>${st>=sg?'<small class="ok">Ziel geschafft · +10</small>':`<small>noch ${fmt(sg-st)} · +10</small>`}</div></section>`}
/* Alkoholfreie Tage: Punkte steigen mit der Serie, Bonus an Meilensteinen */
const WO_FREE=10,WO_FREE_AB='2026-11-24';/* gilt ab diesem Tag – frühere Tage behalten ihre Punkte */
/* Alkoholfrei: ab 25.11.2026 +5 pro Tag und kleinere Meilensteine (vorher 4+n bis 15 – so viel wie Training).
   Ältere Tage behalten die alte Wertung, sonst sänken rückwirkend Punkte und Punktekonto. */
const AF_NEW_AB='2026-11-25',AF_MS_OLD={7:20,14:30,30:50,60:75,100:100},AF_MS_NEW={7:10,14:15,30:25,60:35,100:50};
const afMs=d=>d>=AF_NEW_AB?AF_MS_NEW:AF_MS_OLD;
const afDay=(d,n)=>(d>=AF_NEW_AB?5:Math.min(4+n,15))+(afMs(d)[n]||0);
const dayShift=(d,k)=>{const x=new Date(d+'T12:00:00');x.setDate(x.getDate()+k);return iso(x)};
/* Alkoholfrei: af 1 = alkoholfrei, -1 = Alkohol getrunken, fehlt = noch nicht beantwortet. Nur 1 zählt für die Serie. */
const afOk=d=>(S.nut.days[d]||{}).af===1;
function afStreak(d){let n=0;while(afOk(d)){n++;d=dayShift(d,-1)}return n}
const AF_WD=['So','Mo','Di','Mi','Do','Fr','Sa'];
function afHtml(){const d=today(),yd=dayShift(d,-1),v=(S.nut.days[d]||{}).af,on=v===1,no=v===-1,yv=(S.nut.days[yd]||{}).af,
 cur=on?afStreak(d):no?0:afStreak(yd),nT=on?cur:cur+1,pT=afDay(d,nT),AM=afMs(d),ms=Object.keys(AM).map(Number).find(m=>m>cur),late=new Date().getHours()>=18;
 const week=Array.from({length:7},(_,i)=>dayShift(d,i-6));
 return `<section class="afc${!v&&late?' ask':''}"><div class="afh"><div class="afn"><b class="cond">${cur}</b><span>${cur===1?'Tag':'Tage'} alkoholfrei<br>am Stück</span></div>
 <small>${no?'Serie startet<br>morgen neu':`<b>+${pT}</b> heute${on?'':' möglich'}<br>${ms?`+${AM[ms]} Bonus in ${ms-cur} ${ms-cur===1?'Tag':'Tagen'}`:'Alle Meilensteine geschafft'}`}</small></div>
 ${!v&&late?`<p class="afq">Heute noch nicht eingetragen – warst du alkoholfrei?</p>`:''}
 <div class="afb"><button class="afbtn${on?' ok':''}" data-af="${d}" data-v="1" aria-pressed="${on}">${on?'Heute alkoholfrei ✓':'Heute alkoholfrei'}</button><button class="afno${no?' on':''}" data-af="${d}" data-v="-1" aria-pressed="${no}">${no?'Alkohol getrunken ✓':'Hatte Alkohol'}</button></div>
 <div class="afwk" aria-label="Letzte 7 Tage – antippen zum Ändern">${week.map(k=>{const x=(S.nut.days[k]||{}).af;return `<button class="afd${x===1?' y':x===-1?' n':''}" data-afc="${k}" aria-label="${AF_WD[new Date(k+'T12:00').getDay()]}: ${x===1?'alkoholfrei':x===-1?'Alkohol':'offen'}"><small>${k===d?'Heute':AF_WD[new Date(k+'T12:00').getDay()]}</small><b>${x===1?'✓':x===-1?'✗':'–'}</b></button>`}).join('')}</div>
 ${!yv?`<p class="afhint">Gestern ist noch offen – tippe oben auf den Tag (✓ alkoholfrei, ✗ Alkohol).</p>`:''}</section>`}
function afSet(d,val){const dd=ND(d),wb=cheerFrom(today());if(val)dd.af=val;else delete dd.af;touch(d);if(val===1&&d===today())cheerDiff(d,wb);const n=afStreak(today())||afStreak(dayShift(today(),-1));
 if(val===1&&afMs(d)[n])tell(`${S.prof.name||'Jemand'}: ${n} Tage alkoholfrei`,`${n} Tage am Stück ohne Alkohol – Bonus +${afMs(d)[n]}. Hältst du mit?`);render()}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-af],[data-afc]');if(!b)return;
 if(b.dataset.afc){const d=b.dataset.afc,x=(S.nut.days[d]||{}).af;afSet(d,!x?1:x===1?-1:0);return}
 const d=b.dataset.af,val=+b.dataset.v||1;afSet(d,(S.nut.days[d]||{}).af===val?0:val)});
/* Kalorien-Punkte ab 25.11.2026: gemessen am Bedarf des Tages (Erhaltung + Aktivität), je Ziel ein bester Bereich.
   Kein Punkt für Hungern (unter Grundumsatz) und erst ab 2 eingetragenen Mahlzeiten (vergessen ≠ Defizit). Ältere Tage: alte Wertung. */
const KCAL_NEW_AB='2026-11-25',KCAL_BANDS={fit:[[-400,-100,10,'Leichtes Defizit'],[-600,-400,5,'Defizit etwas groß'],[-100,50,5,'Fast leichtes Defizit']],
 defi:[[-600,-300,10,'Defizit im Ziel'],[-300,-100,5,'Kleines Defizit'],[-800,-600,5,'Defizit etwas groß']],
 halten:[[-100,100,10,'Kalorien gehalten'],[-250,250,5,'Fast gehalten']],aufbau:[[150,450,10,'Überschuss im Ziel'],[0,150,5,'Kleiner Überschuss'],[450,600,5,'Überschuss etwas groß']]};
function kcalPts(d,g,t,day){const meals=new Set(((day||{}).items||[]).map(i=>i.meal)).size;if(meals<2)return{p:0};if(g.bmr&&t.kcal<g.bmr)return{p:0,t:'Zu wenig gegessen'};
 const diff=t.kcal-(g.kcal-(GOAL_ADD[goalAt(d)]||0));for(const [lo,hi,p,tx] of KCAL_BANDS[goalAt(d)]||KCAL_BANDS.halten)if(diff>=lo&&diff<=hi)return{p,t:tx};return{p:0}}
function dayScore(d){const g=goals(d),t=totals(d),day=S.nut.days[d]||{},ss=S.sessions.filter(s=>iso(s.date)===d);let pt=0;const why=[];
 const tr=ss.find(s=>s.ex.length);if(tr){pt+=30;why.push('Training +30')}
 const c=ss.reduce((a,s)=>a+(s.cardio||[]).reduce((b,x)=>b+x.min,0),0),hh=day.h||{};if(c>=20){pt+=15;why.push('Cardio +15')}else if((hh.tm||0)>=30){pt+=15;why.push('Bewegung (Watch) +15')}
 if(daySteps(d)>=stepGoal()){pt+=10;why.push('Schrittziel +10')}
 if(t.kcal>0){if(t.p>=g.p){pt+=20;why.push('Protein +20')}else if(t.p>=g.p*.9){pt+=10;why.push('Protein fast +10')}
  if(d>=KCAL_NEW_AB){const k=kcalPts(d,g,t,day);if(k.p){pt+=k.p;why.push(k.t+' +'+k.p)}}
  else{const dev=Math.abs(t.kcal-g.kcal)/g.kcal;if(dev<=.1){pt+=20;why.push('Kalorien im Ziel +20')}else if(dev<=.2){pt+=10;why.push('Kalorien nah dran +10')}}}
 if(day.af===1){const n=afStreak(d),p=afDay(d,n);pt+=p;why.push(`Alkoholfrei Tag ${n} +${p}`)}
 const chp=chPoints(d);if(chp){pt+=chp;why.push((chDone(d).length===3?'Alle Challenges +':'Challenges +')+chp)}
 /* Kurz-Workout ohne Challenge: das erste am Tag gibt +10, weitere nichts (Gym-Training bleibt mit +30 klar vorn) */
 {const ids=dayCh(d).map(c=>c.id);if(d>=WO_FREE_AB&&(day.ch||[]).some(id=>/^wo_/.test(id)&&!ids.includes(id))){pt+=WO_FREE;why.push('Kurz-Workout +'+WO_FREE)}}
 if(day.w&&day.wsrc!=='prof'){pt+=5;why.push('Gewogen +5')}if((day.water||0)>=waterGoal()){pt+=10;why.push('Wasserziel +10')}
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

