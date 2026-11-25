/* Sport Cockpit – Wochen-Challenge (jeder für sich) und Paar-Challenge (gemeinsames Ziel).
   Fortschritt kommt automatisch aus den eigenen Daten; die Werte des Partners kommen über HA (input_text, Feld w). */
'use strict';
const WK_PTS=50,CP_PTS=75;
function weekDaysIso(){const m=new Date(wk(Date.now())),t=today(),out=[];for(let i=0;i<7;i++){const d=new Date(m);d.setDate(d.getDate()+i);const s=iso(d);if(s>t)break;out.push(s)}return out}
/* Wochenwerte: s Krafteinheiten, c Cardio-Minuten, p Tage Proteinziel, h Tage Wasserziel, st Schritte, a alkoholfreie Tage, o Kurz-Workouts, ca Tage mit allen 3 Challenges */
function myWeekStats(){const r={s:0,c:0,p:0,h:0,st:0,a:0,o:0,ca:0};
 for(const d of weekDaysIso()){const day=S.nut.days[d]||{},ss=S.sessions.filter(s=>iso(s.date)===d);
  r.s+=ss.filter(s=>s.ex&&s.ex.length).length;r.c+=ss.reduce((a,s)=>a+(s.cardio||[]).reduce((b,x)=>b+(+x.min||0),0),0);
  const t=totals(d);if(t.kcal>0&&t.p>=goals(d).p)r.p++;if((day.water||0)>=waterGoal())r.h++;r.st+=daySteps(d);if(day.af===1)r.a++;
  r.o+=(day.ch||[]).filter(x=>/^wo_/.test(x)).length;if(chDone(d).length===3)r.ca++}
 r.c=Math.round(r.c);return r}
const WEEKLY=[
 {k:'s',g:4,t:'4 Krafteinheiten',u:'Einheiten',s:'Push, Pull, Legs – und noch eine obendrauf.'},
 {k:'c',g:150,t:'150 Minuten Cardio',u:'min',s:'Walking Pad, Laufband, draußen – alles zählt.'},
 {k:'p',g:5,t:'5 Tage Proteinziel',u:'Tage',s:'An fünf Tagen das Proteinziel schaffen.'},
 {k:'h',g:5,t:'5 Tage Wasserziel',u:'Tage',s:'An fünf Tagen genug trinken.'},
 {k:'st',g:60000,t:'60.000 Schritte',u:'Schritte',s:'Im Schnitt gut 8.500 am Tag.'},
 {k:'a',g:5,t:'5 alkoholfreie Tage',u:'Tage',s:'Fünf Tage ohne Alkohol eintragen.'},
 {k:'o',g:3,t:'3 Kurz-Workouts',u:'Workouts',s:'Core, Zirkel oder Mobility aus den Tages-Challenges.'},
 {k:'ca',g:4,t:'4 × alle Tages-Challenges',u:'Tage',s:'An vier Tagen alle drei Tages-Challenges abhaken.'}];
const COUPLE=[
 {k:'s',g:7,m:'sum',t:'Zusammen 7 Trainings',u:'Einheiten'},
 {k:'c',g:250,m:'sum',t:'Zusammen 250 Minuten Cardio',u:'min'},
 {k:'st',g:120000,m:'sum',t:'Zusammen 120.000 Schritte',u:'Schritte'},
 {k:'a',g:4,m:'both',t:'Beide mindestens 4 alkoholfreie Tage',u:'Tage'},
 {k:'p',g:5,m:'both',t:'Beide 5 × Proteinziel',u:'Tage'},
 {k:'h',g:10,m:'sum',t:'Zusammen 10 Tage Wasserziel',u:'Tage'},
 {k:'ca',g:6,m:'sum',t:'Zusammen 6 × alle Tages-Challenges',u:'Tage'}];
const wkNo=()=>Math.floor(wk(Date.now())/(7*864e5));
function weekly(){return WEEKLY[(wkNo()*5+3)%WEEKLY.length]}
function couple(){const w=weekly();let c=COUPLE[(wkNo()*3+1)%COUPLE.length];if(c.k===w.k)c=COUPLE[(wkNo()*3+2)%COUPLE.length];return c}
/* Partnerwerte dieser Woche (veraltete Wochen zählen 0) */
function partnerWeek(){const p=(typeof partners!=='undefined'?partners:[]).find(x=>x.name);if(!p)return null;const ok=p.d&&wk(new Date(p.d+'T12:00:00'))===wk(Date.now());return{name:p.name,w:ok&&p.w?p.w:{}}}
const weekFlag=k=>weekDaysIso().some(d=>(S.nut.days[d]||{})[k]);
/* Erreicht? Dann einmal pro Woche auf den heutigen Tag buchen */
function weeklyCheck(){const me=myWeekStats(),w=weekly(),c=couple(),pw=partnerWeek();
 if(me[w.k]>=w.g&&!weekFlag('wkc')){ND(today()).wkc=1;touch(today());cheer({big:true,title:'Wochen-Challenge!',sub:w.t+' geschafft',pts:WK_PTS});tell(`${S.prof.name} hat die Wochen-Challenge geschafft`,`${w.t} – erledigt. Und du?`)}
 if(pw){const v=+(pw.w[c.k]||0),done=c.m==='both'?Math.min(me[c.k],v)>=c.g:me[c.k]+v>=c.g;
  if(done&&!weekFlag('cpc')){ND(today()).cpc=1;touch(today());cheer({big:true,title:'Paar-Challenge!',sub:c.t+' – für euch beide',pts:CP_PTS})}}}
/* Kurz-Workouts direkt starten (für die Wochen-Challenge „3 Kurz-Workouts“) */
/* Kurz-Workouts immer auf der Startseite – auch wenn sie gerade keine Challenge sind */
const woQuickHtml=()=>`<section class="woq"><h3 class="sh">Kurz-Workouts <small class="chn">ohne Geräte, mit Timer</small></h3>${woPickHtml()}</section>`;
/* Punkte je Knopf: als heutige Challenge deren Punkte, sonst +10 nur für das erste Kurz-Workout des Tages */
function woPt(id){const d=today(),ch=dayCh(d).find(c=>c.id===id);if(ch)return ch.pt;const ids=dayCh(d).map(c=>c.id),dn=(S.nut.days[d]||{}).ch||[],free=dn.filter(x=>/^wo_/.test(x)&&!ids.includes(x));return !free.length||free[0]===id?WO_FREE:0}
function woPickHtml(){const dn=(S.nut.days[today()]||{}).ch||[];
 return `<div class="wopick">${[['core','wo_core','Core','6 min'],['zirkel','wo_zirkel','Zirkel','7 min'],['mobil','wo_mobil','Mobility','5 min']].map(([k,id,n,m])=>{const ok=dn.includes(id);
  return `<button class="${ok?'ok':''}" data-wo="${k}" data-woc="${id}"${ok?' aria-pressed="true"':''}><b>${n}</b><small>${(p=>ok?'heute erledigt'+(p?' · +'+p:''):m+' · '+(p?'+'+p:'ohne Punkte'))(woPt(id))}</small></button>`}).join('')}</div><p class="wohint">Das erste Kurz-Workout am Tag gibt +${WO_FREE}, als Tages-Challenge zählen seine Challenge-Punkte.</p>`}
function daysLeft(){const n=7-weekDaysIso().length;return n===0?'letzter Tag':n===1?'noch 1 Tag':`noch ${n} Tage`}
const fmtV=(k,v)=>fmt(k==='st'?Math.round(v):v);
/* Tages-Ziele (max. 1 pro Tag): ist der Rest in den verbleibenden Tagen nicht mehr schaffbar, ehrlich sagen statt Prozent anzeigen */
const WK_DAYK=new Set(['p','h','a','ca','s']);
function weeklyHtml(){weeklyCheck();const me=myWeekStats(),w=weekly(),c=couple(),pw=partnerWeek(),wd=weekFlag('wkc'),cd=weekFlag('cpc'),pc=Math.min(me[w.k]/w.g,1)*100,lost=!wd&&WK_DAYK.has(w.k)&&(w.g-me[w.k])>(8-weekDaysIso().length);
 let h=`<h3 class="sh">Challenges der Woche <small class="chn">${daysLeft()}</small></h3><section class="wkc${wd?' done':''}${lost?' lost':''}"><div class="wkh"><span>Wochen-Challenge</span><em>+${WK_PTS}</em></div><b>${esc(w.t)}</b><small>${esc(w.s)}</small>
 <div class="wkbar"><i style="width:${pc.toFixed(1)}%"></i></div><div class="wkf"><span>${fmtV(w.k,Math.min(me[w.k],w.g))} / ${fmtV(w.k,w.g)} ${w.u}</span><span>${wd?'Geschafft':lost?'nicht mehr zu schaffen':Math.round(pc)+' %'}</span></div>${lost?'<small class="wklost">Diese Woche reicht die Zeit nicht mehr – am Montag startet eine neue Challenge.</small>':''}</section>`;
 if(pw){const v=+(pw.w[c.k]||0),both=c.m==='both',a=both?Math.min(me[c.k],c.g):Math.min(me[c.k],c.g),b=both?Math.min(v,c.g):Math.min(v,Math.max(0,c.g-a)),
  sum=me[c.k]+v,pa=both?a/c.g*50:a/c.g*100,pb=both?b/c.g*50:b/c.g*100;
  h+=`<section class="wkc cp${cd?' done':''}"><div class="wkh"><span>Paar-Challenge</span><em>+${CP_PTS} für beide</em></div><b>${esc(c.t)}</b>
  ${both?`<div class="cpb"><div><span>${esc(S.prof.name)}</span><div class="wkbar"><i style="width:${(a/c.g*100).toFixed(1)}%"></i></div><small>${fmtV(c.k,me[c.k])} / ${fmtV(c.k,c.g)}</small></div><div><span>${esc(pw.name)}</span><div class="wkbar pa"><i style="width:${(b/c.g*100).toFixed(1)}%"></i></div><small>${fmtV(c.k,v)} / ${fmtV(c.k,c.g)}</small></div></div>`
  :`<div class="wkbar two"><i style="width:${pa.toFixed(1)}%"></i><s style="width:${pb.toFixed(1)}%"></s></div><div class="wkf"><span><i class="dot me"></i>${esc(S.prof.name)} ${fmtV(c.k,me[c.k])} · <i class="dot pa"></i>${esc(pw.name)} ${fmtV(c.k,v)}</span><span>${cd?'Geschafft':fmtV(c.k,Math.min(sum,c.g))+' / '+fmtV(c.k,c.g)}</span></div>`}</section>`}
 return h}
