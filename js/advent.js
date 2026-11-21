/* Sport Cockpit – Adventskalender: 24 Türchen vom 1. bis 24. Dezember, für beide gleich.
   Türchen n lässt sich ab dem n. Dezember öffnen. Aufgabe am Tag selbst = volle Punkte, nachgeholt = halbe Punkte.
   Gespeichert: geöffnet in S.nut.days['JJJJ-12-NN'].ao, erledigt in S.nut.days[heute].adv = [n, …] (synchronisiert). */
'use strict';
const ADV=[
 {t:'Lichterkettenrunde',s:'20 Minuten draußen gehen und die Deko bestaunen.',pt:15},
 {t:'Plätzchen-Ausgleich',s:'30 Kniebeugen – gern verteilt über den Tag.',pt:15},
 {t:'Punsch-Pause',s:'Heute komplett alkoholfrei.',pt:15},
 {t:'Zu zweit dehnen',s:'10 Minuten zusammen dehnen. Wer zuerst die Zehen erreicht, wählt die Musik.',pt:20,c:1},
 {t:'Stiefel putzen',s:'8.000 Schritte, damit der Nikolaus was zum Füllen hat.',pt:15},
 {t:'Nikolaus-Liegestütze',s:'6 × 10 Liegestütze über den Tag verteilt.',pt:20},
 {t:'Wasser statt Glühwein',s:'Heute das Wasserziel schaffen.',pt:15},
 {t:'Paar-Plank',s:'Zusammen 2 × 45 Sekunden Unterarmstütz – nebeneinander, kein Schummeln.',pt:20,c:1},
 {t:'Bunter Teller',s:'Zu jeder Hauptmahlzeit eine Portion Gemüse.',pt:15},
 {t:'Core-Kick',s:'Das 6-Minuten-Core-Workout.',pt:20,w:'core'},
 {t:'Protein-Weihnachtsmann',s:'Heute das Proteinziel schaffen.',pt:15},
 {t:'Bergfest-Massage',s:'10 Minuten gegenseitig Nacken und Schultern massieren.',pt:20,c:1},
 {t:'Lucia-Lauf',s:'30 Minuten Cardio – Walking Pad zählt.',pt:20},
 {t:'Mobility-Sonntag',s:'Das 5-Minuten-Mobility-Workout.',pt:15,w:'mobil'},
 {t:'Schneeballschlacht',s:'Zusammen 50 Hampelmänner – im Takt.',pt:20,c:1},
 {t:'Früh ins Bett',s:'Vor 23 Uhr schlafen. Morgen dankt es dir.',pt:15},
 {t:'Wichteln in der Küche',s:'Kocht euch gegenseitig eine gesunde Mahlzeit.',pt:25,c:1},
 {t:'Zirkel-Training',s:'Der 7-Minuten-Kurz-Zirkel.',pt:20,w:'zirkel'},
 {t:'Zuckerfreier Tag',s:'Heute keine Süßigkeiten – auch keine Plätzchen.',pt:20},
 {t:'Rücken an Rücken',s:'Zusammen 3 × 10 Kniebeugen, Rücken an Rücken gelehnt.',pt:20,c:1},
 {t:'Wintersonnenwende',s:'Der längste Spaziergang der Woche: 45 Minuten.',pt:20},
 {t:'Bestwert-Jagd',s:'Im Training einen neuen Bestwert holen.',pt:25},
 {t:'Gemeinsam trainieren',s:'Heute zusammen ins Training – egal ob Gym oder Wohnzimmer.',pt:25,c:1},
 {t:'Heiligabend-Runde',s:'Vor dem Festessen 30 Minuten zu zweit spazieren gehen.',pt:50,c:1}];
const ADV_ORDER=[17,4,22,9,1,13,20,6,11,24,3,15,8,19,2,23,10,5,14,21,7,12,18,16];
let advOpen=null;
const advNow=()=>window.__advNow?new Date(window.__advNow):new Date();
function advYear(){const n=advNow();return n.getMonth()===11?n.getFullYear():n.getFullYear()}
const advDay=n=>`${advYear()}-12-${String(n).padStart(2,'0')}`;
function advToday(){const n=advNow();return n.getMonth()===11?n.getDate():0}
const advOpened=n=>!!(S.nut.days[advDay(n)]||{}).ao;
function advDoneOn(n){for(const k in S.nut.days){if(k.slice(0,7)!==`${advYear()}-12`)continue;if(((S.nut.days[k]||{}).adv||[]).includes(n))return k}return null}
/* Punkte des Tages d (für dayScore) */
function advPoints(d){const l=(S.nut.days[d]||{}).adv||[];let p=0;for(const n of l){const x=ADV[n-1];if(!x)continue;p+=d===advDay(n)?x.pt:Math.round(x.pt/2)}return p}
function advHtml(){const n=advNow(),m=n.getMonth(),dd=n.getDate();
 if(m===10){const left=Math.ceil((new Date(n.getFullYear(),11,1)-n)/864e5);return `<section class="adv tease"><div class="advh"><b>Adventskalender</b><span>ab 1. Dezember</span></div><p>Noch <b>${left} ${left===1?'Tag':'Tage'}</b> – dann wartet jeden Tag ein Türchen mit einer kleinen Aufgabe auf euch. Manche nur zu zweit.</p><div class="advg mini">${ADV_ORDER.map(k=>`<i>${k}</i>`).join('')}</div></section>`}
 if(m!==11||dd>26)return '';const td=advToday();
 return `<section class="adv"><div class="advh"><b>Adventskalender</b><span>${td<=24?`Heute: Türchen ${td}`:'Frohe Weihnachten!'}</span></div>
 <div class="advg">${ADV_ORDER.map(k=>{const o=advOpened(k),dn=advDoneOn(k),can=k<=td;return `<button class="advd${o?' open':''}${dn?' done':''}${k===td?' today':''}${can?'':' locked'}" data-adv="${k}" aria-label="Türchen ${k}${dn?' erledigt':o?' offen':can?'':' noch zu'}"><span class="leaf">${k}</span><span class="in">${dn?'✓':`${k}${ADV[k-1].c?'<small>zu 2</small>':''}`}</span></button>`}).join('')}</div></section>`}
function advSheet(){if(!advOpen)return '';const k=advOpen,x=ADV[k-1],dn=advDoneOn(k),late=today()!==advDay(k),p=late?Math.round(x.pt/2):x.pt;
 return `<div class="advm" role="dialog" aria-modal="true"><div class="advc"><span class="advn">${k}</span><small>${x.c?'Zu zweit':'Für dich'}</small><h2>${esc(x.t)}</h2><p>${esc(x.s)}</p>
 ${dn?`<p class="advok">Erledigt – ${dn===advDay(k)?'+'+x.pt:'+'+Math.round(x.pt/2)} Punkte</p>`:`<div class="advb">${x.w?`<button data-adv-wo="${x.w}">Jetzt starten ›</button>`:''}<button class="primary" data-adv-ok="${k}">Erledigt · +${p}${late?' (nachgeholt)':''}</button></div>`}
 <button class="ghost advx" data-adv-x>Schließen</button></div></div>`}
let advEl=null;function advRender(){if(!advEl){advEl=document.createElement('div');document.body.appendChild(advEl)}advEl.innerHTML=advSheet()}
function advDone(k){const d=today(),dd=ND(d);if(advDoneOn(k))return;dd.adv=[...(dd.adv||[]),k];touch(d);const x=ADV[k-1];
 if(x.c)tell(`${S.prof.name} hat Türchen ${k} erledigt`,`„${x.t}“ – das geht nur zu zweit. Du bist dran!`);advOpen=null;advRender();render()}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-adv]');
 if(b){const k=+b.dataset.adv;if(k>advToday()){note(`Türchen ${k} geht erst am ${k}. Dezember auf`);b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');return}
  if(!advOpened(k)){ND(advDay(k)).ao=1;touch(advDay(k));b.classList.add('open','opening');setTimeout(()=>{advOpen=k;advRender();render()},650);return}
  advOpen=k;advRender();return}
 if(ev.target.closest('[data-adv-x]')||ev.target.classList.contains('advm')){advOpen=null;advRender();return}
 const ok=ev.target.closest('[data-adv-ok]');if(ok){advDone(+ok.dataset.advOk);return}
 const w=ev.target.closest('[data-adv-wo]');if(w){const k=advOpen;advOpen=null;advRender();advWo=k;woStart(w.dataset.advWo,null)}});
/* Workout aus dem Türchen: nach 'Geschafft!' das Türchen abhaken */
let advWo=null;const _woFinish=woFinish;woFinish=function(){_woFinish();if(advWo){const k=advWo;advWo=null;advDone(k)}};
