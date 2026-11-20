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
function dayScore(d){const g=goals(d),t=totals(d),day=S.nut.days[d]||{},ss=S.sessions.filter(s=>iso(s.date)===d);let pt=0;const why=[];
 const tr=ss.find(s=>s.ex.length);if(tr){pt+=30;why.push('Training +30')}
 const c=ss.reduce((a,s)=>a+(s.cardio||[]).reduce((b,x)=>b+x.min,0),0),hh=day.h||{};if(c>=20){pt+=15;why.push('Cardio +15')}else if((hh.tm||0)>=30){pt+=15;why.push('Bewegung (Watch) +15')}
 if((hh.st||0)>=10000){pt+=10;why.push('10.000 Schritte +10')}
 if(t.kcal>0){if(t.p>=g.p){pt+=20;why.push('Protein +20')}else if(t.p>=g.p*.9){pt+=10;why.push('Protein fast +10')}
  const dev=Math.abs(t.kcal-g.kcal)/g.kcal;if(dev<=.1){pt+=20;why.push('Kalorien im Ziel +20')}else if(dev<=.2){pt+=10;why.push('Kalorien nah dran +10')}}
 const chp=chPoints(d);if(chp){pt+=chp;why.push((chDone(d).length===3?'Alle Challenges +':'Challenges +')+chp)}
 if(day.w){pt+=5;why.push('Gewogen +5')}if((day.water||0)>=2000){pt+=5;why.push('2 l Wasser +5')}
 const prn=ss.reduce((a,s)=>a+(s.prn||0),0);if(prn){pt+=10*prn;why.push(prn+'× Bestwert +'+10*prn)}
 return{pt,why,g,t,c,tr:tr?DAYS[tr.day].n:''}}
function weekScore(){const m=new Date(wk(Date.now()));let sum=0;for(let i=0;i<7;i++){const d=new Date(m);d.setDate(d.getDate()+i);if(d>new Date())break;sum+=dayScore(iso(d)).pt}return sum}
const SC_URL='shortcuts://run-shortcut?name='+encodeURIComponent('Cockpit Health');
function healthLink(){if(!HA.token)return '';const age=S.hT?Date.now()-S.hT:Infinity;const stale=age>3600e3;
 return `<a class="hlink${stale?' stale':''}" href="${SC_URL}" data-hl="1">↻ Apple Health ${stale?'aktualisieren':'· vor '+Math.max(1,Math.round(age/60000))+' min geholt'}</a>`}
function scoreLine(){const s=dayScore(today());return healthLink()+`<p class="nline" data-a="view" data-v="nut">Heute <b>${s.pt} Punkte</b> · Woche <b>${weekScore()}</b>${s.why.length?' · '+s.why.join(', '):' · Trainiere, iss im Ziel und trink genug, um Punkte zu sammeln'}</p>`}
let lastPub='';
async function publish(){if(!HA.token||!S.prof.name)return;const d=today(),s=dayScore(d);
 const v=JSON.stringify({d,k:Math.round(s.t.kcal),kz:s.g.kcal,p:Math.round(s.t.p),pz:s.g.p,tr:s.tr,c:Math.round(s.c),pt:s.pt,wp:weekScore()});if(v===lastPub)return;
 try{const r=await haCall([{type:'call_service',domain:'input_text',service:'set_value',service_data:{entity_id:'input_text.sport_cockpit_'+slugN(S.prof.name),value:v.slice(0,255)}}]);if(r[0]&&r[0].success)lastPub=v}catch(e){}
 const dd=S.nut.days[d];if(dd&&s.t.p>=s.g.p&&!dd.pg){dd.pg=1;touch(d);tell('Proteinziel geschafft','💪 '+S.prof.name+' hat heute '+Math.round(s.t.p)+' g Protein gegessen.')}}
async function tell(titel,nachricht){if(!HA.token||!S.prof.name)return;try{await haCall([{type:'call_service',domain:'script',service:'sport_cockpit_meldung',service_data:{von:S.prof.name,titel,nachricht}}])}catch(e){}}
function announce(s,prs){const n=S.prof.name||'Jemand',sets=s.ex.reduce((a,x)=>a+x.sets.length,0),cm=(s.cardio||[]).reduce((a,c)=>a+c.min,0);
 if(s.ex.length)tell(`${n} hat ${DAYS[s.day].n} trainiert`,`🏋️ ${sets} Sätze · ${fmt(Math.round(vol(s)))} kg bewegt${cm?` · ${cm} min Cardio`:''}${prs.length?` · ${prs.length} neue${prs.length>1?'':'r'} Bestwert${prs.length>1?'e':''}!`:''}\nDu bist dran 😉`);
 else if(cm)tell(`${n} war beim Cardio`,`🏃 ${cm} min ${(s.cardio[0]||{}).type||''}\nUnd du?`)}

