/* Sport Cockpit – Coach: konkrete Hinweise aus den eigenen Daten */
'use strict';
function daysAgo(n){const d=new Date();d.setDate(d.getDate()-n);return iso(d)}
function avgWeight(endOffset,len=7){const v=[];for(let i=endOffset;i<endOffset+len;i++){const w=(S.nut.days[daysAgo(i)]||{}).w;if(w)v.push(w)}return v.length>=3?v.reduce((a,b)=>a+b,0)/v.length:null}
function coachTips(){const T=[],now=Date.now(),strength=S.sessions.filter(s=>s.ex.length).sort((a,b)=>a.date-b.date);
 /* 1. Pause zu lang */
 const lastS=strength[strength.length-1];if(lastS){const d=Math.floor((now-lastS.date)/864e5);if(d>=4)T.push({w:9,t:`${d} Tage ohne Krafttraining`,s:`Heute ist ${DAYS[DAYS[lastS.day].nx].n} dran – schon 30 Minuten halten den Fortschritt.`,a:{gym:DAYS[lastS.day].nx}})}
 /* 2. Stillstand je Übung (aktuelle Variante) */
 for(const d of ['push','pull','legs'])for(const e0 of S.plan[d]){const e=info(e0);if(isA(e.v))continue;const h=hist(vkey(e));if(h.length<4)continue;
  const v=h.map(x=>Math.max(...x.sets.map(t=>e1(t.kg,t.reps)))),ref=v[v.length-4],recent=Math.max(...v.slice(-3));
  if(recent<=ref+0.01){const alt=e.vars.find(x=>x!==e.v);T.push({w:7,t:`${vname(e)} stagniert`,s:`Seit 3 Einheiten kein Fortschritt. ${alt?`Wechsle für 3–4 Wochen auf „${alt}“ oder `:''}senke das Gewicht um 10 % und steigere dich neu.`,a:{view:'rec'}})}}
 /* 3. Protein & Kalorien der letzten 7 Tage */
 const logged=[];for(let i=1;i<=7;i++){const d=daysAgo(i),t=totals(d);if(t.kcal>500)logged.push({d,t,g:goals(d)})}
 if(logged.length>=3){const low=logged.filter(x=>x.t.p<x.g.p*.9).length;if(low>=3)T.push({w:8,t:`Protein an ${low} von ${logged.length} Tagen zu niedrig`,s:`Im Schnitt ${Math.round(logged.reduce((a,x)=>a+x.t.p,0)/logged.length)} g statt ${logged[0].g.p} g. Einfach: Skyr, Magerquark oder ein Shake extra.`,a:{view:'nut'}});
  const diff=Math.round(logged.reduce((a,x)=>a+x.t.kcal-x.g.kcal,0)/logged.length);
  if(S.nut.goal==='aufbau'&&diff<-300)T.push({w:8,t:`Zu wenig gegessen für Muskelaufbau`,s:`Im Schnitt ${fmt(-diff)} kcal unter Ziel. Ohne Überschuss wächst kaum Muskel – eine Mahlzeit mehr am Trainingstag.`,a:{view:'nut'}});
  if(S.nut.goal==='defi'&&diff>200)T.push({w:8,t:`Über dem Defizit-Ziel`,s:`Im Schnitt ${fmt(diff)} kcal zu viel. Snacks und Getränke prüfen.`,a:{view:'nut'}})}
 /* 4. Gewichtstrend (3 Wochen) */
 const w0=avgWeight(0),w3=avgWeight(21);if(w0&&w3){const perWk=(w0-w3)/3,g=S.nut.goal;
  if(g==='aufbau'&&perWk<0.1)T.push({w:6,t:'Gewicht steht beim Aufbau',s:`${perWk>=0?'+':''}${fmt(r1(perWk))} kg/Woche. Erhöhe dein Ziel um ca. 150 kcal (Essen → Ziele einstellen).`,a:{view:'nut'}});
  if(g==='aufbau'&&perWk>0.5)T.push({w:6,t:'Du nimmst schnell zu',s:`+${fmt(r1(perWk))} kg/Woche – viel davon ist Fett. Ziel um ca. 150 kcal senken.`,a:{view:'nut'}});
  if(g==='defi'&&perWk>-0.2)T.push({w:6,t:'Defizit greift nicht',s:`${fmt(r1(perWk))} kg/Woche. Ziel um ca. 150 kcal senken oder mehr Schritte.`,a:{view:'nut'}});
  if(g==='defi'&&perWk<-1)T.push({w:6,t:'Du verlierst sehr schnell',s:`${fmt(r1(perWk))} kg/Woche – Muskelverlust droht. Ziel um ca. 200 kcal erhöhen.`,a:{view:'nut'}})}
 /* 5. Muskelbalance ab Donnerstag */
 const wd=(new Date().getDay()+6)%7;if(wd>=3){const c=weekSets(),miss=['chest','back','quads','ham','shoulders'].filter(k=>!(c[k]>0));if(miss.length&&miss.length<5)T.push({w:5,t:`Diese Woche noch nicht trainiert: ${miss.map(k=>MU[k]).join(', ')}`,s:'Für Wachstum sollte jeder große Muskel mindestens 2× pro Woche dran sein.',a:{view:'rec'}})}
 /* 6. Entlastungswoche */
 let k=wk(now),streak=0;const cnt={};strength.forEach(s=>{const x=wk(s.date);cnt[x]=(cnt[x]||0)+1});k=prevWk(k);while((cnt[k]||0)>=Math.min(S.goal,3)){streak++;k=prevWk(k)}
 if(streak>=6)T.push({w:4,t:`${streak} harte Wochen am Stück`,s:'Zeit für eine leichtere Woche: gleiche Übungen, ca. 60 % der Sätze und Gewichte. Danach geht es stärker weiter.'});
 return T.sort((a,b)=>b.w-a.w)}
function coachHtml(max){const T=coachTips().slice(0,max||99);if(!T.length)return '';
 return `<h3 class="sh">Coach</h3>${T.map(x=>`<button class="coach" ${x.a&&x.a.gym?`data-gym="1" data-d="${x.a.gym}"`:x.a&&x.a.view?`data-a="view" data-v="${x.a.view}"`:''}><b>${esc(x.t)}</b><span>${esc(x.s)}</span></button>`).join('')}`}
