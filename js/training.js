/* Sport Cockpit – Zustand, Speicher, Training-Ansichten (Plan, Verlauf, Kraft) */
'use strict';
const LS='sportcockpit.v1';
let S={plan:clone(DEF),goal:4,rest:90,cgoal:150,sessions:[],del:[],metaT:0,prof:{name:'',sex:'m',year:'',height:'',weight:'',act:1.55},nut:{goal:'aufbau',maint:0,gkg:2,days:{},foods:[],meals:[],recent:[]}},drafts={},draftT=0,summary=null,view='home',day='push',recEx=null,confirmKey=null,picker=false;
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>(+n||0).toLocaleString('de-DE',{maximumFractionDigits:1});
const num=v=>{const n=parseFloat(String(v).replace(',','.'));return isFinite(n)?n:null};
const e1=(kg,r)=>kg*(1+r/30);
const dstr=t=>new Date(t).toLocaleDateString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit'});
const info=e=>{const c=CAT[e.id];return c?{...e,n:c.n,p:c.p,vars:c.v,t:c.t}:{...e,n:e.name||'Übung',p:'gen',vars:[],t:''}};
const vkey=e=>(!e.vars.length||!e.v||e.v===e.vars[0])?e.id:e.id+'@'+e.v.toLowerCase().replace(/[^a-z0-9]+/g,'');
const vname=e=>e.vars.length>1?`${e.n} · ${e.v}`:e.n;
function migrate(){S.cgoal=S.cgoal||150;for(const d in DAYS){S.plan[d]=(S.plan[d]||DEF[d]||[]).map(e=>{const c=CAT[e.id];if(c&&!c.v.includes(e.v))e.v=c.v[0];return e})}
 for(const d in drafts){const dr=drafts[d];if(!dr)continue;dr.extra=(dr.extra||[]).map(e=>{if(e.id==='t-kabelzug-brust'){if(dr.ex&&dr.ex[e.id]){dr.ex.fly=dr.ex[e.id];delete dr.ex[e.id]}return mk('fly',3,12,15,2.5)}return e})}}
function lsLoad(){try{const j=JSON.parse(localStorage.getItem(LS));if(j){S=Object.assign(S,j);S.prof=Object.assign({name:'',sex:'m',year:'',height:'',weight:'',act:1.55},j.prof||{});S.nut=Object.assign({goal:'aufbau',maint:0,gkg:2,days:{},foods:[],meals:[],recent:[]},j.nut||{});S.del=S.del||[]}const dj=JSON.parse(localStorage.getItem(LS+'.d'));if(dj&&dj.d){drafts=dj.d;draftT=dj.t||0}}catch(e){}migrate()}
function lsSave(){try{localStorage.setItem(LS,JSON.stringify(S));localStorage.setItem(LS+'.d',JSON.stringify({d:drafts,t:draftT}))}catch(e){note('Speicher voll!')}}
function persist(){memoReset();lsSave();syncLater()}
function saveDrafts(){draftT=Date.now();persist()}
function savePlan(){S.metaT=Date.now();persist()}
function putSession(s){s.t=Date.now();persist()}
function dropSession(id){S.sessions=S.sessions.filter(s=>s.id!==id);if(!S.del.includes(id))S.del.push(id);persist()}
function note(t){const e=$('sync');e.title=t;e.innerHTML='<span>'+esc(t)+'</span>';e.dataset.st=/Synchronisiert|Verbunden|kopiert|eingetragen|gespeichert|übernommen|aktiv\b/.test(t)?'ok':/…|Synchronisiere/.test(t)?'busy':/Offline|Getrennt|nicht|voll|eingeben|angeben|Erst |Trag |verworfen|beginnt/.test(t)?'err':''}
const dayEx=d=>[...S.plan[d],...((drafts[d]&&drafts[d].extra)||[])].map(info);
function hist(k){return S.sessions.filter(s=>s.ex.some(x=>x.id===k)).sort((a,b)=>a.date-b.date).map(s=>({date:s.date,sets:s.ex.find(x=>x.id===k).sets}))}
function sugg(e){const h=hist(vkey(e));if(!h.length)return null;const L=h[h.length-1].sets.filter(s=>s.reps>0);if(!L.length)return null;
 if(isA(e.v)){const lo=Math.min(...L.map(s=>s.kg)),ws=L.filter(s=>s.kg===lo);
  if(ws.length>=e.sets&&ws.every(s=>s.reps>=e.max)){const n=Math.max(0,lo-e.step);return{up:true,kg:n,reps:Array(e.sets).fill(e.min),txt:n?`Weniger Hilfe: ${fmt(n)} kg × ${e.min}`:`Ohne Hilfe × ${e.min}`,why:`Letztes Mal alle Sätze mit ${e.max} Wdh. geschafft`}}
  const reps=Array.from({length:e.sets},(_,i)=>{const r=(ws[i]||ws[ws.length-1]);return Math.min(e.max,r.reps+(r.rpe==='h'?0:1))});
  return{up:false,kg:lo,reps,txt:`${fmt(lo)} kg Hilfe × ${reps.join(' / ')}`,why:'Gleiche Hilfe, je Satz eine Wiederholung mehr'}}
 const top=Math.max(...L.map(s=>s.kg)),ws=L.filter(s=>s.kg===top);
const hard=ws.some(s=>s.rpe==='h'),easy=ws.length>=e.sets&&ws.every(s=>s.rpe==='l'&&s.reps>=e.min);
 if(easy&&!ws.every(s=>s.reps>=e.max))return{up:true,kg:top+e.step,reps:ws.map(s=>s.reps).slice(0,e.sets),txt:`Mehr Gewicht: ${fmt(top+e.step)} kg × ${ws[0].reps}`,why:'Letztes Mal fühlten sich alle Sätze leicht an'};
 if(ws.length>=e.sets&&ws.every(s=>s.reps>=e.max))return{up:true,kg:top+e.step,reps:Array(e.sets).fill(e.min),txt:`Mehr Gewicht: ${fmt(top+e.step)} kg × ${e.min}`,why:`Letztes Mal alle Sätze mit ${e.max} Wdh. geschafft`};
 const reps=Array.from({length:e.sets},(_,i)=>{const r=(ws[i]||ws[ws.length-1]);return Math.min(e.max,r.reps+(r.rpe==='h'?0:1))});
 return{up:false,kg:top,reps,txt:`${fmt(top)} kg × ${reps.join(' / ')}`,why:hard?'Letztes Mal war es hart – schwere Sätze halten, den Rest steigern':'Je Satz eine Wiederholung mehr als letztes Mal'}}
function best(k){let b=0;for(const s of S.sessions){const x=s.ex.find(x=>x.id===k);if(x)for(const t of x.sets)b=Math.max(b,e1(t.kg,t.reps))}return b}
const vol=s=>s.ex.reduce((a,x)=>isA(x.id)?a:a+x.sets.reduce((b,t)=>b+t.kg*t.reps,0),0);
function wk(t){const x=new Date(t);x.setHours(0,0,0,0);x.setDate(x.getDate()-(x.getDay()+6)%7);return x.getTime()}
function prevWk(k){const d=new Date(k);d.setDate(d.getDate()-7);return wk(d)}
function draftFor(d){if(!drafts[d])drafts[d]={start:Date.now(),ex:{},extra:[]};const dr=drafts[d];dr.extra=dr.extra||[];dr.ex=dr.ex||{};dr.cardio=dr.cardio||(d==='cardio'?[{type:lastCT(),min:'',km:'',lvl:'m'}]:[]);for(const e of dayEx(d)){if(!dr.ex[e.id])dr.ex[e.id]=Array.from({length:e.sets},()=>({kg:'',reps:'',done:false}))}return dr}
function lastDay(){const s=[...S.sessions].filter(s=>s.day!=='cardio'&&DAYS[s.day]&&s.ex&&s.ex.length).sort((a,b)=>b.date-a.date)[0];return s?s.day:null}

function renderHead(){document.body.className='v-'+view;document.documentElement.classList.toggle('me-w',!!S.prof&&S.prof.sex==='w');const br=document.querySelector('.brand');if(br)br.textContent='DUO'+(S.prof&&S.prof.name?' · '+S.prof.name.toUpperCase():'');
 $('dayName').textContent=DAYS[day].n;$('daySub').textContent=DAYS[day].sub;
 const ld=lastDay();$('nextDay').textContent=ld?`Als Nächstes dran: ${DAYS[DAYS[ld].nx].n}`:'Tipp: Starte mit Push';
 document.querySelectorAll('[data-a=day]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.d===day));
 const mon=wk(Date.now()),todayK=new Date().toDateString();let w='';
 for(let i=0;i<7;i++){const d=new Date(mon);d.setDate(d.getDate()+i);const ss=S.sessions.filter(s=>new Date(s.date).toDateString()===d.toDateString());
  w+=`<div class="wd${ss.length?' on':''}${d.toDateString()===todayK?' today':''}"><b>${(()=>{if(!ss.length)return '·';const st=[...new Set(ss.filter(s=>s.ex&&s.ex.length).map(s=>({push:'Push',pull:'Pull',legs:'Legs'})[s.day]).filter(Boolean))],ca=ss.some(s=>s.cardio&&s.cardio.length);return (st.length>1?st.length+'×':st[0]||'Cardio')+(ca&&st.length?'<i class="wdc" aria-label="und Cardio"></i>':'')})()}</b><small>${['Mo','Di','Mi','Do','Fr','Sa','So'][i]}</small></div>`}
 $('week').innerHTML=w;
 const cnt={};S.sessions.forEach(s=>{if(!s.ex.length)return;const k=wk(s.date);cnt[k]=(cnt[k]||0)+1});
 let k=mon,st=0;if((cnt[k]||0)<S.goal)k=prevWk(k);while((cnt[k]||0)>=S.goal){st++;k=prevWk(k)}
 const wv=S.sessions.filter(s=>wk(s.date)===mon).reduce((a,s)=>a+vol(s),0),cmin=Math.round(S.sessions.filter(s=>wk(s.date)===mon).reduce((a,s)=>a+(s.cardio||[]).reduce((b,c)=>b+(+c.min||0),0),0));
 $('stats').innerHTML=`<div><b>${cnt[mon]||0} / ${S.goal}</b><small>Krafteinheiten diese Woche</small></div><div><b>${st}</b><small>Wochen in Folge im Ziel</small></div><div><b>${fmt(wv/1000)}<small class="unit"> t</small></b><small>bewegt diese Woche</small></div><div><b>${cmin} / ${S.cgoal}<small class="unit"> min</small></b><small>Cardio diese Woche</small></div>`;
 document.querySelectorAll('[data-a=view]').forEach(b=>b.setAttribute('aria-selected',b.dataset.v===view));{const nb=$('rwBadge');if(nb&&typeof rwOpen==='function')nb.hidden=!rwOpen()}
}
let exOpen=new Set(),exShut=new Set();/* exShut: laufende Übung bewusst zugeklappt */
const exIsOpen=(id,rows)=>{const n=rows.filter(r=>r.done).length;return exOpen.has(id)||(n&&n<rows.length&&!exShut.has(id))};
function card(e,dr){const sg=sugg(e),h0=hist(vkey(e)),rows=dr.ex[e.id],tmp=!S.plan[day].some(x=>x.id===e.id);
 /* Duo-Design: Übungen eingeklappt, bis man sie antippt – laufende Übung bleibt offen */
 const nDone=rows.filter(r=>r.done).length;if(isDuo()&&!exIsOpen(e.id,rows))return `<article class="ex exc"><button class="exhead exbtn" data-a="exopen" data-e="${e.id}" aria-expanded="false"><div class="pic">${svg(picOf(e))}</div><div><h3>${esc(e.n)}</h3><p class="tgt">${tmp?'<span class="tagtmp">Nur heute · </span>':''}${e.sets} Sätze · ${e.min}–${e.max} Wdh.${e.vars.length>1?' · '+esc(e.v):''}</p></div><span class="exst${nDone===rows.length?' ok':''}">${nDone===rows.length?'✓':nDone?nDone+'/'+rows.length:'›'}</span></button></article>`;
 const last=h0.length?h0[h0.length-1].sets.map(t=>`${fmt(t.kg)}×${t.reps}`).join('  '):null;
 return `<article class="ex">${isDuo()?`<button class="excl" data-a="exopen" data-e="${e.id}" aria-label="Einklappen">⌃</button>`:''}<div class="exhead"><div class="pic">${svg(picOf(e))}</div><div><h3>${esc(e.n)}</h3><p class="tgt">${tmp?'<span class="tagtmp">Nur heute · </span>':''}${e.sets} Sätze · ${e.min}–${e.max} Wdh.</p>
 ${e.vars.length>1?`<div class="vars">${e.vars.map(v=>`<button data-a="var" data-e="${e.id}" data-v="${esc(v)}" aria-pressed="${v===e.v}">${esc(v)}</button>`).join('')}</div>`:''}</div></div>
 ${e.t?`<p class="tip">${esc(e.t)}</p>`:''}
 <div class="goal${sg&&sg.up?' up':''}">${sg?`<b>Heute: ${sg.txt}</b><span>${sg.why}${last?' · zuletzt '+last:''}</span>`:`<b>Erstes Mal${e.vars.length>1?' mit '+esc(e.v):''}</b><span>${isA(e.v)?`Trag die Unterstützung in kg ein (Gegengewicht an der Maschine). Ziel: ${e.max} saubere Wdh., dann Hilfe reduzieren.${startKg(e)?` Startvorschlag: ${fmt(startKg(e))} kg Hilfe.`:''}`:`Wähle ein Gewicht, mit dem du ${e.max} saubere Wdh. schaffst.${startKg(e)?` Startvorschlag: ${fmt(startKg(e))} kg${/Kurzhantel/.test(e.v)?' pro Hand':''}.`:''}`}</span>`}</div>
 ${(()=>{if(isA(e.v))return '';const w=num(rows[0]&&rows[0].kg)??(sg?sg.kg:null);if(!w)return '';const bb=/Langhantel/.test(e.v||'')||(['squat','bank','rdl','kreuz'].includes(e.id)&&(e.v||'').startsWith('Lang'));let o='';
  if(BIG.has(e.id)&&w>=30){const base=bb?20:0,ws=[[.4,10],[.6,5],[.8,3]].map(([f,r])=>[Math.max(base,r25(w*f)),r]).filter((x,i,a)=>x[0]<w&&(!i||x[0]>a[i-1][0]));if(ws.length)o+=`<span><b>Aufwärmen:</b> ${ws.map(([k,r])=>`${fmt(k)}×${r}`).join(' · ')}</span>`}
  if(bb){const pl=plates(w);if(pl)o+=`<span><b>Scheiben pro Seite (${fmt(w)} kg):</b> ${pl}</span>`}return o?`<div class="help">${o}</div>`:''})()}
 <div class="sets"><div class="shead"><span>Satz</span><span>${isA(e.v)?'kg Hilfe':'kg'}</span><span>Wdh.</span><span></span></div>
 ${rows.map((r,i)=>`<div class="row${r.done?' done':''}"><span class="no">${i+1}</span><input inputmode="decimal" aria-label="Gewicht Satz ${i+1}" data-a="in" data-e="${e.id}" data-i="${i}" data-f="kg" value="${esc(r.kg)}" placeholder="${sg?fmt(sg.kg):'–'}"><input inputmode="numeric" aria-label="Wiederholungen Satz ${i+1}" data-a="in" data-e="${e.id}" data-i="${i}" data-f="reps" value="${esc(r.reps)}" placeholder="${sg?(sg.reps[i]??sg.reps[sg.reps.length-1]):'–'}"><button class="chk" aria-label="Satz ${i+1} erledigt" aria-pressed="${r.done}" data-a="done" data-e="${e.id}" data-i="${i}">✓</button></div>${r.done?`<div class="row"><span></span><div class="rpe">${[['l','leicht'],['m','passt'],['h','hart']].map(([k,l])=>`<button data-a="rpe" data-e="${e.id}" data-i="${i}" data-r="${k}" aria-pressed="${r.rpe===k}">${l}</button>`).join('')}</div></div>`:''}`).join('')}</div>
 <div class="exfoot"><button data-a="addset" data-e="${e.id}">+ Satz</button><button data-a="rmset" data-e="${e.id}">− Satz</button>${tmp?`<button data-a="keep" data-e="${e.id}">Fest in den Plan</button><button data-a="rmtmp" data-e="${e.id}">Entfernen</button>`:''}</div></article>`}
/* Walking Pad: Kalorien nach ACSM-Gehformel. VO2 = 0,1·v + 1,8·v·Steigung + 3,5 (ml/kg/min, v in m/min),
   1 l O2 ≈ 5 kcal. Brutto inkl. Grundumsatz während der Zeit. */
const WP='Walking Pad · 7 % Steigung',WP_GRADE=0.07;
const isWP=c=>c&&c.type===WP;
function wpNet(min,kmh,kg){const v=(+kmh||0)*1000/60;return Math.round((0.1*v+1.8*v*WP_GRADE)*(+kg||0)/1000*5*(+min||0))}
function wpKcal(min,kmh,kg){const v=(+kmh||0)*1000/60,vo2=0.1*v+1.8*v*WP_GRADE+3.5;return Math.round(vo2*(+kg||0)/1000*5*(+min||0))}
const wpKg=()=>lastWeight(today())||num(S.prof.weight)||80;
function wpLastKmh(){const s=[...S.sessions].filter(x=>(x.cardio||[]).some(isWP)).sort((a,b)=>b.date-a.date)[0];const c=s&&s.cardio.find(isWP);return c&&c.kmh||4}
/* Cardio: zuletzt genutzte Art vorauswählen; Kalorien für alle Arten schätzen (MET × kg × Stunden, nach Kompendium) */
function lastCT(){const s=[...S.sessions].filter(x=>(x.cardio||[]).length).sort((a,b)=>b.date-a.date)[0];return s&&CT.includes(s.cardio[0].type)?s.cardio[0].type:CT[0]}
const CMET={'Laufband':[7,9,11],'Laufen draußen':[7,9.8,11.5],'Fahrrad / Ergometer':[5,7,10],'Crosstrainer':[4.5,5.5,7.5],'Rudergerät':[4.8,7,8.5],'Stepper / Treppe':[5,8,9],'Schwimmen':[5.8,8,9.8],'Seilspringen':[8.8,11,12.3]};
function metKcal(c){const m=num(c.min);if(!(m>0))return 0;const t=CMET[c.type];if(!t)return 0;return Math.round(t[{l:0,m:1,h:2}[c.lvl]??1]*wpKg()*m/60)}
function cHint(c){if(isWP(c))return wpHint(c);const k=metKcal(c);return k?`≈ <b>${fmt(k)} kcal</b> in ${fmt(num(c.min))} min (${{l:'locker',m:'mittel',h:'hart'}[c.lvl]||'mittel'}, ${fmt(wpKg())} kg)`:'Minuten eintragen – dann siehst du die geschätzten Kalorien.'}
function wpHint(c){const m=num(c.min),k=num(c.kmh)||wpLastKmh(),kg=wpKg();
 return m>0?`≈ <b>${fmt(wpKcal(m,k,kg))} kcal</b> in ${fmt(m)} min bei ${fmt(k)} km/h, 7 % Steigung, ${fmt(kg)} kg`:`Bei ${fmt(k)} km/h und 7 % Steigung: ≈ <b>${fmt(wpKcal(60,k,kg))} kcal pro Stunde</b>`}
function cardioBlock(dr){const last=[...S.sessions].filter(s=>s.cardio&&s.cardio.length).sort((a,b)=>b.date-a.date)[0];
 return `<article class="ex"><div class="exhead"><div class="pic">${svg('run')}</div><div><h3>Cardio</h3><p class="tgt">${day==='cardio'?'Ausdauer-Einheit':'Optional nach dem Krafttraining'}${last?` · zuletzt ${esc(last.cardio[0].type)} ${fmt(last.cardio[0].min)} min`:''}</p></div></div>
 ${dr.cardio.map((c,i)=>`<div class="sets" style="margin-bottom:10px"><select data-a="cin" data-i="${i}" data-f="type" aria-label="Cardio-Art">${CT.map(t=>`<option${t===c.type?' selected':''}>${t}</option>`).join('')}</select>
 <div class="clab"><span>Minuten</span><span>${isWP(c)?'Tempo km/h':'km'}</span><span>Puls Ø</span></div><div class="row" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,1fr);margin-top:2px"><input inputmode="numeric" placeholder="Minuten" aria-label="Minuten" data-a="cin" data-i="${i}" data-f="min" value="${esc(c.min)}">${isWP(c)?`<input inputmode="decimal" placeholder="${fmt(wpLastKmh())} km/h" aria-label="Tempo in km/h" data-a="cin" data-i="${i}" data-f="kmh" value="${esc(c.kmh||'')}">`:`<input inputmode="decimal" placeholder="km (optional)" aria-label="Kilometer" data-a="cin" data-i="${i}" data-f="km" value="${esc(c.km)}">`}<input inputmode="numeric" placeholder="Puls Ø (opt.)" aria-label="Durchschnittspuls" data-a="cin" data-i="${i}" data-f="hr" value="${esc(c.hr)}"></div>
 ${!isWP(c)?`<p class="wpk" id="wpk${i}">${cHint(c)}</p>`:''}${isWP(c)?`<p class="wpk" id="wpk${i}">${wpHint(c)}</p><label class="wpeat"><input type="checkbox" data-a="ceat" data-i="${i}"${c.eat?' checked':''}> Im Essensziel einrechnen <small>(nur der Mehrverbrauch, ohne Grundumsatz)</small></label>`:''}<div class="vars" style="margin-top:6px">${[['l','Locker'],['m','Mittel'],['h','Intervalle / hart']].map(([k,l])=>`<button data-a="clvl" data-i="${i}" data-r="${k}" aria-pressed="${c.lvl===k}">${l}</button>`).join('')}<button class="ghost" data-a="crm" data-i="${i}">Entfernen</button></div></div>`).join('')}
 <div class="exfoot"><button data-a="cadd">+ Cardio ${dr.cardio.length?'hinzufügen':'eintragen'}</button></div></article>`}
function renderPicker(){const have=new Set(dayEx(day).map(e=>e.id)),ids=Object.keys(CAT).filter(id=>!have.has(id)).sort((a,b)=>(CAT[a].d===day?0:1)-(CAT[b].d===day?0:1));
 return `<section class="picker"><h2>Übung für heute hinzufügen</h2><div class="plist">${ids.map(id=>`<button class="pitem" data-a="pick" data-id="${id}"><div class="pic">${svg(CAT[id].p)}</div><span>${esc(CAT[id].n)}</span></button>`).join('')}</div>
 <div class="custom"><input id="tmpName" placeholder="Eigene Übung, z. B. Hip Thrust" aria-label="Eigene Übung"><button data-a="addtmp">Hinzufügen</button></div><div class="actions"><button class="ghost" data-a="picker">Schließen</button></div></section>`}
function renderTrain(){const dr=draftFor(day);let h='';
 if(summary&&summary.day===day)h+=`<section class="sum"><h2>${summary.co?'Cardio':DAYS[day].n} erledigt</h2><p>${summary.dur?`${summary.dur} min · `:''}${summary.sets?`${summary.sets} Sätze · ${fmt(summary.vol)} kg bewegt`:''}${summary.cmin?`${summary.sets?' · ':''}${fmt(summary.cmin)} min Cardio`:''}${summary.co?` · ${DAYS[day].n}-Training ist weiter offen`:''}${summary.prevVol?` · <span class="hot">${summary.vol>=summary.prevVol?'+':''}${fmt((summary.vol/summary.prevVol-1)*100)} %</span> zum letzten ${DAYS[day].n}-Tag`:''}</p>${!summary.sets?'':summary.prs.length?`<p class="hot">Neue Bestwerte</p><ul>${summary.prs.map(p=>`<li>${esc(p)}</li>`).join('')}</ul>`:'<p>Keine neuen Bestwerte – nächstes Mal.</p>'}<div class="actions">${summary.sets&&WO['flex_'+day]?`<button class="primary" data-wo="flex_${day}">5 min dehnen (optional)</button>`:''}<button data-a="closesum">Schließen</button></div></section>`;
 h+=dayEx(day).map(e=>card(e,dr)).join('');
 if(day!=='cardio')h+=picker?renderPicker():`<div class="actions"><button data-a="picker">+ Übung hinzufügen</button></div>`;
 h+=cardioBlock(dr);
 h+=`<div class="actions"><button class="primary" data-a="finish">Training abschließen</button><button class="ghost" data-a="discard">${confirmKey==='discard'?'Wirklich verwerfen?':'Verwerfen'}</button></div>`;
 return h}
function renderHist(){const ss=[...S.sessions].sort((a,b)=>b.date-a.date);
 if(!ss.length)return '<p class="empty">Noch keine Einheiten. Dein erstes Training erscheint hier.</p>';
 return `<div class="list">`+ss.map(s=>`<details><summary><span class="pill">${s.ex.length?DAYS[s.day].n:'Cardio'}</span><b>${dstr(s.date)}</b><span class="meta">${[s.ex.length?`${s.ex.reduce((a,x)=>a+x.sets.length,0)} Sätze · ${fmt(vol(s))} kg`:'',(s.cardio||[]).length?`${fmt(s.cardio.reduce((a,c)=>a+c.min,0))} min Cardio`:''].filter(Boolean).join(' · ')}</span></summary><div class="body">${s.ex.map(x=>`<p><b>${esc(x.name)}</b>: ${x.sets.map(t=>`${fmt(t.kg)}×${t.reps}`).join('  ')}</p>`).join('')}${(s.cardio||[]).map(c=>`<p><b>${esc(c.type)}</b>: ${fmt(c.min)} min${c.km?' · '+fmt(c.km)+' km':''}${c.kmh?' · '+fmt(c.kmh)+' km/h':''}${c.hr?' · Ø '+c.hr+' bpm':''}${c.kcal?' · ≈ '+fmt(c.kcal)+' kcal':''}${c.eat?' · +'+fmt(c.eat)+' kcal im Essensziel':''} · ${({l:'locker',m:'mittel',h:'hart'})[c.lvl]||''}</p>`).join('')}<div class="actions"><button class="ghost" data-a="del" data-id="${s.id}">${confirmKey===s.id?'Wirklich löschen?':'Einheit löschen'}</button></div></div></details>`).join('')+`</div><div class="actions"><button class="ghost" data-a="copy">Alle Daten kopieren</button></div>`}
function trained(){const m=new Map();for(const s of [...S.sessions].sort((a,b)=>a.date-b.date))for(const x of s.ex)m.set(x.id,{id:x.id,name:x.name,d:s.day});return [...m.values()]}
function weekSets(){const mon=wk(Date.now()),c={};const add=(id,n)=>{const m=MAP[id];if(m)for(const k in m)c[k]=(c[k]||0)+m[k]*n};
 for(const s of S.sessions)if(wk(s.date)===mon)for(const x of s.ex)add(x.base||String(x.id).split('@')[0],x.sets.length);
 for(const d in drafts){const dr=drafts[d];if(dr&&dr.ex)for(const id in dr.ex)add(id,dr.ex[id].filter(r=>r.done).length)}return c}
function muscleMap(){const c=weekSets(),
 lvl=n=>n<=0?0:n<6?1:n<10?2:n<=20?3:4,COL=isDuo()?['#E9E2D8','#CFE0D5','#9DBBA8','#6F8F7E','#3E5A4C']:['#e2dfd8','#ffc9b8','#ff8f6b','#ff4b26','#b9301a'],
 f=k=>`fill="${COL[lvl(c[k]||0)]}"`,B='fill="#efede8"',N2='fill="#e7e4dd"',
 r=(x,y,w,h,a,rx)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx||Math.min(w,h)/2}" ${a}/>`,
 el=(x,y,rx,ry,a)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" ${a}/>`,
 pa=(d,a)=>`<path d="${d}" ${a}/>`;
 const base=`<circle cx="60" cy="15" r="11" ${B}/>`+r(54,24,12,10,B,4)+pa('M38 38Q60 30 82 38L83 70Q80 92 79 108L41 108Q40 92 37 70Z',B)
  +r(20,54,13,36,B)+r(87,54,13,36,B)+r(17,90,11,34,B)+r(92,90,11,34,B)+el(22,128,5,5,B)+el(98,128,5,5,B)
  +r(41,108,18,58,B,8)+r(61,108,18,58,B,8)+r(43,168,14,38,B,6)+r(63,168,14,38,B,6)+el(50,208,8,3.5,B)+el(70,208,8,3.5,B);
 const front=base+el(31,45,10,9,f('shoulders'))+el(89,45,10,9,f('shoulders'))
  +pa('M42 42Q51 37 59 40L59 60Q50 65 41 58Z',f('chest'))+pa('M78 42Q69 37 61 40L61 60Q70 65 79 58Z',f('chest'))
  +r(21,56,11,30,f('biceps'))+r(88,56,11,30,f('biceps'))+r(48,64,24,40,N2,6)
  +r(42,110,16,52,f('quads'),8)+r(62,110,16,52,f('quads'),8);
 const back=base+el(31,45,10,9,f('reardelt'))+el(89,45,10,9,f('reardelt'))
  +pa('M42 40Q60 33 78 40L77 72Q60 90 43 72Z',f('back'))+r(21,56,11,30,f('triceps'))+r(88,56,11,30,f('triceps'))+r(47,84,26,20,N2,6)
  +el(50,118,10,11,f('glutes'))+el(70,118,10,11,f('glutes'))+r(42,132,16,32,f('ham'),8)+r(62,132,16,32,f('ham'),8)
  +el(50,184,7,16,f('calves'))+el(70,184,7,16,f('calves'));
 const list=Object.keys(MU).map(k=>[k,c[k]||0]).sort((a,b)=>b[1]-a[1]).map(([k,n])=>`<div><span>${MU[k]}</span><span class="mn">${fmt(n)}</span><i><s style="width:${Math.min(n/20,1)*100}%;background:${COL[Math.max(lvl(n),1)]}"></s></i></div>`).join('');
 const leg=[['0',0],['1–5',1],['6–9',2],['10–20',3],['20+',4]].map(([l,i])=>`<span><i style="background:${COL[i]}"></i>${l}</span>`).join('');
 return `<section class="mm"><h2>Sätze pro Muskel – diese Woche</h2><div><svg viewBox="0 0 120 214" role="img" aria-label="Vorderseite">${front}</svg><div class="cap">Vorne</div></div><div><svg viewBox="0 0 120 214" role="img" aria-label="Rückseite">${back}</svg><div class="cap">Hinten</div></div><div class="mleg">${leg}</div><div class="mlist">${list}<span class="cap" style="text-align:left">Ziel: 10–20 Sätze pro Muskel und Woche (Strich = 10). Nebenmuskeln zählen halb.</span></div></section>`}
function renderRec(){const ex=trained();
 if(!ex.length)return coachHtml()+muscleMap()+'<p class="empty">Deine Kraftkurven erscheinen nach dem ersten Training.</p>';
 if(!recEx||!ex.some(e=>e.id===recEx))recEx=ex[0].id;
 const rows=ex.map(e=>{if(isA(e.id)){let lo=Infinity,lr=0;for(const h of hist(e.id))for(const t of h.sets){if(t.kg<lo||(t.kg===lo&&t.reps>lr)){lo=t.kg;lr=t.reps}}return `<span>${esc(e.name)}</span><span class="r">${fmt(lo)} kg Hilfe × ${lr}</span><span class="r">–</span>`}let bk=0,br=0,be=0;for(const h of hist(e.id))for(const t of h.sets){if(t.kg>bk||(t.kg===bk&&t.reps>br)){bk=t.kg;br=t.reps}be=Math.max(be,e1(t.kg,t.reps))}return `<span>${esc(e.name)}</span><span class="r">${fmt(bk)} kg × ${br}</span><span class="r">${fmt(be)} kg</span>`}).join('');
 return coachHtml()+muscleMap()+`<label for="recSel">Kraftverlauf einer Übung</label><select id="recSel" data-a="rec">${ex.map(e=>`<option value="${esc(e.id)}"${e.id===recEx?' selected':''}>${esc(e.name)}</option>`).join('')}</select><div class="fig"><svg id="chart" role="img" aria-label="Kraftverlauf"></svg></div>
 <div class="rec"><span class="h">Übung</span><span class="h r">Schwerster Satz</span><span class="h r">Kraftwert*</span>${rows}</div><p class="tip" style="padding:8px 0">* Geschätztes Maximalgewicht für eine Wiederholung – macht Sätze mit unterschiedlichen Wdh. vergleichbar.</p>`}
function drawChart(){const s=$('chart');if(!s)return;const W=s.clientWidth,Hh=s.clientHeight;if(!W)return;
 const A=isA(recEx),pts=hist(recEx).map(h=>({t:h.date,v:A?Math.min(...h.sets.map(t=>t.kg)):Math.max(...h.sets.map(t=>e1(t.kg,t.reps)))})),p={l:44,r:16,t:22,b:30};
 if(pts.length<2){s.innerHTML=`<text x="${W/2}" y="${Hh/2}" text-anchor="middle" fill="#6b6e75" font-size="14">Ab zwei Einheiten siehst du hier deine Kurve</text>`;return}
 const lo=Math.min(...pts.map(q=>q.v))*0.95,hi=Math.max(...pts.map(q=>q.v))*1.04,x=i=>p.l+i*(W-p.l-p.r)/(pts.length-1),y=v=>p.t+(hi-v)/(hi-lo||1)*(Hh-p.t-p.b),L=pts.length-1;
 const grid=[lo,(lo+hi)/2,hi].map(v=>`<line x1="${p.l}" x2="${W-p.r}" y1="${y(v)}" y2="${y(v)}" stroke="#e4e2dc"/><text x="${p.l-8}" y="${y(v)+4}" text-anchor="end" font-size="12" fill="#6b6e75">${Math.round(v)}</text>`).join('');
 const line=pts.map((q,i)=>`${i?'L':'M'}${x(i)},${y(q.v)}`).join('');
 s.innerHTML=`${grid}<path d="${line} L${x(L)},${Hh-p.b} L${x(0)},${Hh-p.b}Z" fill="#ff4b26" opacity=".12"/><path d="${line}" fill="none" stroke="#ff4b26" stroke-width="3" stroke-linejoin="round"/>${pts.map((q,i)=>`<circle cx="${x(i)}" cy="${y(q.v)}" r="${i===L?6:3}" fill="${i===L?'#ff4b26':'#111214'}"/>`).join('')}<text x="${p.l}" y="${Hh-8}" font-size="12" fill="#6b6e75">${dstr(pts[0].t)}</text><text x="${W-p.r}" y="${Hh-8}" text-anchor="end" font-size="12" fill="#111214">${W>420?dstr(pts[L].t)+' · ':''}${fmt(pts[L].v)} kg${A?' Hilfe (weniger = besser)':''}</text>`}
function renderPlan(){
 if(day==='cardio')return `<p class="tip" style="padding:0 0 12px">Cardio hat keinen festen Plan – trag einfach ein, was du machst.</p><div class="settings"><div><label for="cgoal">Cardio-Ziel pro Woche (Minuten)</label><input id="cgoal" inputmode="numeric" data-a="set" data-f="cgoal" value="${S.cgoal}"></div></div>`;
 return `<p class="tip" style="padding:0 0 12px">Dein fester Plan für <b>${DAYS[day].n}</b>. Tag oben wechseln. Tippe eine Übung an, um sie anzupassen.</p>
 ${S.plan[day].map(info).map((e,i)=>`<details class="pl"><summary><div class="pic">${svg(picOf(e))}</div><div><b>${esc(e.n)}</b><small>${e.sets} Sätze · ${e.min}–${e.max} Wdh. · +${fmt(e.step)} kg${e.vars.length>1?' · '+esc(e.v):''}</small></div><span>›</span></summary>
 <div class="pledit">${CAT[e.id]?'':`<div class="full"><label>Name</label><input data-a="pl" data-i="${i}" data-f="name" value="${esc(e.n)}"></div>`}
 ${[['sets','Sätze'],['min','Wdh. von'],['max','Wdh. bis'],['step','+kg Sprung']].map(([f,l])=>`<div><label>${l}</label><input inputmode="decimal" data-a="pl" data-i="${i}" data-f="${f}" value="${fmt(e[f])}"></div>`).join('')}
 <div class="plbtn"><button data-a="mv" data-i="${i}" data-s="-1">Nach oben</button><button data-a="mv" data-i="${i}" data-s="1">Nach unten</button><button class="ghost" data-a="rmex" data-i="${i}">${confirmKey==='ex'+i?'Wirklich entfernen?':'Entfernen'}</button></div></div></details>`).join('')}
 <div class="actions"><button data-a="view" data-v="train" data-pick="1">+ Übung hinzufügen</button><button class="ghost" data-a="reset">${confirmKey==='reset'?'Wirklich zurücksetzen?':'Standardplan'}</button></div>
 <div class="settings"><div><label for="goal">Wochenziel (Einheiten)</label><input id="goal" inputmode="numeric" data-a="set" data-f="goal" value="${S.goal}"></div><div><label for="cgoal">Cardio-Ziel (Min./Woche)</label><input id="cgoal" inputmode="numeric" data-a="set" data-f="cgoal" value="${S.cgoal}"></div><div><label for="rest">Satzpause (Sekunden)</label><input id="rest" inputmode="numeric" data-a="set" data-f="rest" value="${S.rest}"></div></div>
 <label class="gnxset"><input type="checkbox" class="sw" data-a="gnx"${S.prof.gnx===false?'':' checked'}> Gym Mode: „Als Nächstes“ oben rechts anzeigen</label>`}
let ro=null;
/* Neu zeichnen ohne Springen: offenes Eingabefenster behält Scrollposition und Fokus, keine Einblend-Animation */
function sheetSnap(){const el=document.querySelector('.sheet:not(.ob) .sheetin');if(!el)return null;const a=document.activeElement,mine=a&&el.contains(a)&&a.id;
 return{step:el.dataset.step,top:el.scrollTop,id:mine?a.id:null,s:mine?a.selectionStart:null,e:mine?a.selectionEnd:null}}
function sheetRestore(p){const el=document.querySelector('.sheet:not(.ob) .sheetin');document.documentElement.classList.toggle('sheet-open',!!el);if(!el||!p)return;
 el.parentNode.classList.add('noanim');if(p.step===el.dataset.step)el.scrollTop=p.top;
 if(p.id){const i=document.getElementById(p.id);if(i&&document.activeElement!==i){i.focus({preventScroll:true});try{if(p.s!=null)i.setSelectionRange(p.s,p.e)}catch(x){}}}}
function render(){const p=sheetSnap();renderCore();sheetRestore(p)}
function renderCore(){memoReset();renderHead();const v=$('view');if(!profOK()||obOpen){if(!profOK())obOpen=true;v.innerHTML=renderOnboarding();return}v.innerHTML=view==='home'?renderHome():view==='train'?renderTrain():view==='hist'?renderHist():view==='rec'?renderRec():view==='nut'?renderNut():view==='review'?renderReview():view==='rew'?renderRewards():renderSettings()+renderPlan()+`<div class="actions"><button data-a="view" data-v="hist">Verlauf aller Einheiten</button><button data-a="view" data-v="review">Rückblick</button><button data-a="view" data-v="rew">Belohnungen</button></div>`+renderAISettings();if(view==='nut')afterNut();
 if(view==='rec'){const s=$('chart');if(s){if(ro)ro.disconnect();ro=new ResizeObserver(drawChart);ro.observe(s)}}}

function finish(){const dr=draftFor(day),ex=[],p0=dayScore(today()).pt;
 for(const e of dayEx(day)){const sets=dr.ex[e.id].map(r=>({kg:num(r.kg)??0,reps:Math.round(num(r.reps)??0),...(r.rpe?{rpe:r.rpe}:{})})).filter(t=>t.reps>0);if(sets.length)ex.push({id:vkey(e),base:e.id,v:e.v||'',name:vname(e)+(isA(e.v)?' (kg = Hilfe)':''),...(isA(e.v)?{assist:true}:{}),sets})}
 const cardio=(dr.cardio||[]).filter(c=>num(c.min)>0).map(c=>({type:c.type,min:num(c.min),...(isWP(c)?(()=>{const k=num(c.kmh)||wpLastKmh(),m=num(c.min);return{kmh:k,km:Math.round(k*m/6)/10,kcal:wpKcal(m,k,wpKg()),...(c.eat?{eat:wpNet(m,k,wpKg())}:{})}})():{}),...(num(c.km)?{km:num(c.km)}:{}),...(!isWP(c)&&metKcal(c)?{kcal:metKcal(c)}:{}),...(num(c.hr)?{hr:Math.round(num(c.hr))}:{}),lvl:c.lvl||'m'}));
 if(!ex.length&&!cardio.length){note('Trag mindestens einen Satz oder Cardio ein');return}
 const co=!ex.length&&day!=='cardio',date=Date.now(),s={id:'s_'+date,date,day:ex.length?day:'cardio',start:dr.start,ex,...(cardio.length?{cardio}:{})},prs=[];
 for(const x of ex){if(isA(x.id))continue;const b=best(x.id),m=Math.max(...x.sets.map(t=>e1(t.kg,t.reps)));if(b>0&&m>b+0.01)prs.push(`${x.name}: Kraftwert ${fmt(m)} kg (vorher ${fmt(b)})`)}
 const prev=[...S.sessions].filter(q=>q.day===day).sort((a,b)=>b.date-a.date)[0];
 const ats=Object.values(dr.ex).flat().map(r=>r.at).filter(Boolean),dur=ats.length?Math.round((date-Math.min(...ats))/60000)+2:0,ups=[];
 for(const x of ex){if(x.assist)continue;const ps=[...S.sessions].filter(q=>q.ex.some(y=>y.id===x.id)).sort((a,b)=>b.date-a.date)[0];if(!ps)continue;
  const top=Math.max(...x.sets.map(t=>t.kg)),pt=Math.max(...ps.ex.find(y=>y.id===x.id).sets.map(t=>t.kg));if(top>pt+0.01)ups.push({n:x.name,d:top-pt})}
 s.prn=prs.length;S.sessions.push(s);if(co)dr.cardio=[];else delete drafts[day];saveDrafts();/* nur Cardio vor dem Krafttraining: zählt als Cardio, das Training bleibt offen */announce(s,prs);
 summary={day,co,pts:Math.max(0,dayScore(iso(date)).pt-p0),vol:vol(s),prevVol:prev?vol(prev):0,sets:ex.reduce((a,x)=>a+x.sets.length,0),prs,ups,dur:dur>0&&dur<240?dur:0,cmin:cardio.reduce((a,c)=>a+c.min,0)};
 putSession(s);stopT();render();scrollTo({top:0,behavior:'smooth'});if(!ex.length&&cardio.length){const cm=cardio.reduce((a,c)=>a+c.min,0),ck=cardio.reduce((a,c)=>a+(c.kcal||0),0);cheer({title:'Cardio gespeichert',sub:`${fmt(cm)} min${ck?' · ca. '+fmt(ck)+' kcal':''}`,pts:dayScore(iso(date)).pt-p0})}
 if(ex.length)cheer({big:true,title:cheerWord(),sub:DAYS[day].n+'-Training geschafft'+(prs.length?' · neuer Bestwert':''),pts:dayScore(iso(date)).pt-p0})}

let tEnd=0,tTot=0,tInt=null;
function startT(sec){tTot=sec;tEnd=Date.now()+sec*1000;$('timer').classList.add('on');clearInterval(tInt);tInt=setInterval(tick,250);tick()}
function tick(){const l=Math.max(0,Math.round((tEnd-Date.now())/1000));$('tLeft').textContent=`${Math.floor(l/60)}:${String(l%60).padStart(2,'0')}`;$('tBar').style.width=(tTot?l/tTot*100:0)+'%';if(l<=0){$('tLeft').textContent='Los!';clearInterval(tInt);setTimeout(()=>{if(Date.now()>=tEnd)stopT()},4000)}}
let toT=null;function toast(t,sub){$('toastT').textContent=t;$('toastS').textContent=sub;const el=$('toast');el.classList.add('on');try{navigator.vibrate&&navigator.vibrate([60,40,120])}catch(e){}clearTimeout(toT);toT=setTimeout(()=>el.classList.remove('on'),3800)}
function stopT(){clearInterval(tInt);$('timer').classList.remove('on')}

document.addEventListener('click',ev=>{const b=ev.target.closest('[data-a]');if(!b||b.tagName==='INPUT'||b.tagName==='SELECT')return;const a=b.dataset.a,eid=b.dataset.e,i=+b.dataset.i;
 const keep=confirmKey;confirmKey=null;
 if(a==='day'){day=b.dataset.d;picker=false}
 else if(a==='view'){view=b.dataset.v;sheet=null;stopScan();if(b.dataset.pick)picker=true;scrollTo({top:0})}
 else if(a==='var'){const pe=S.plan[day].find(x=>x.id===eid)||(drafts[day]&&drafts[day].extra.find(x=>x.id===eid));if(pe){pe.v=b.dataset.v;if(S.plan[day].includes(pe))savePlan();else saveDrafts()}}
 else if(a==='done'){const dr=draftFor(day),r=dr.ex[eid][i],ins=b.closest('.row').querySelectorAll('input');
  if(!r.done){if(r.kg==='')r.kg=ins[0].placeholder==='–'?'':ins[0].placeholder;if(r.reps==='')r.reps=ins[1].placeholder==='–'?'':ins[1].placeholder;if(r.reps===''){note('Erst Wiederholungen eintragen');return}r.done=true;r.at=Date.now();startT(S.rest);const e=dayEx(day).find(x=>x.id===eid),k=vkey(e),b0=best(k),m=e1(num(r.kg)??0,num(r.reps)??0),prevSets=dr.ex[eid].filter((x,j)=>j!==i&&x.done).map(x=>e1(num(x.kg)??0,num(x.reps)??0));if(!isA(e.v)&&b0>0&&m>b0+0.01&&m>Math.max(0,...prevSets))cheer({title:'Neuer Bestwert!',sub:`${vname(e)}: ${fmt(num(r.kg))} kg × ${r.reps} · Kraftwert ${fmt(m)} kg`})}else r.done=false;saveDrafts()}
 else if(a==='exopen'){const rows=draftFor(day).ex[eid]||[];if(exIsOpen(eid,rows)){exOpen.delete(eid);if(rows.some(r=>r.done))exShut.add(eid)}else{exOpen.add(eid);exShut.delete(eid)}}
 else if(a==='rpe'){const r=draftFor(day).ex[eid][i];r.rpe=r.rpe===b.dataset.r?'':b.dataset.r;saveDrafts()}
 else if(a==='cadd'){draftFor(day).cardio.push({type:lastCT(),min:'',km:'',lvl:'m'});saveDrafts()}
 else if(a==='crm'){draftFor(day).cardio.splice(i,1);saveDrafts()}
 else if(a==='clvl'){draftFor(day).cardio[i].lvl=b.dataset.r;saveDrafts()}
 else if(a==='addset'){const rows=draftFor(day).ex[eid],l=rows[rows.length-1]||{kg:''};rows.push({kg:l.kg,reps:'',done:false});saveDrafts()}
 else if(a==='rmset'){const rows=draftFor(day).ex[eid];if(rows.length>1)rows.pop();saveDrafts()}
 else if(a==='picker')picker=!picker;
 else if(a==='pick'){const dr=draftFor(day),id=b.dataset.id,c=CAT[id];const rng=c.p==='calf'||c.p==='lateral'||c.p==='fly'||c.p==='facepull'?[12,15]:[8,12];dr.extra.push({id,sets:3,min:rng[0],max:rng[1],step:2.5,v:c.v[0]});draftFor(day);picker=false;saveDrafts()}
 else if(a==='addtmp'){const n=$('tmpName').value.trim();if(!n)return;const dr=draftFor(day),id='t-'+n.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40);if(!dayEx(day).some(e=>e.id===id))dr.extra.push({id,name:n,sets:3,min:10,max:15,step:2.5});draftFor(day);picker=false;saveDrafts()}
 else if(a==='rmtmp'){const dr=draftFor(day);dr.extra=dr.extra.filter(e=>e.id!==eid);delete dr.ex[eid];saveDrafts()}
 else if(a==='keep'){const dr=draftFor(day),e=dr.extra.find(e=>e.id===eid);if(e){S.plan[day].push(e);dr.extra=dr.extra.filter(x=>x!==e);savePlan();saveDrafts()}}
 else if(a==='finish')finish();
 else if(a==='discard'){if(keep==='discard'){delete drafts[day];saveDrafts();note('Training verworfen')}else confirmKey='discard'}
 else if(a==='closesum')summary=null;
 else if(a==='del'){if(keep===b.dataset.id)dropSession(b.dataset.id);else confirmKey=b.dataset.id}
 else if(a==='copy'){navigator.clipboard.writeText(JSON.stringify(S,null,1)).then(()=>note('Daten kopiert'),()=>note('Kopieren nicht erlaubt'));return}
 else if(a==='mv'){const p=S.plan[day],j=i+(+b.dataset.s);if(j>=0&&j<p.length){[p[i],p[j]]=[p[j],p[i]];savePlan()}}
 else if(a==='rmex'){if(keep==='ex'+i){S.plan[day].splice(i,1);savePlan()}else confirmKey='ex'+i}
 else if(a==='reset'){if(keep==='reset'){S.plan[day]=clone(DEF[day]||[]);savePlan()}else confirmKey='reset'}
 else if(a==='t'){tEnd+=(+b.dataset.s)*1000;tTot=Math.max(tTot,Math.round((tEnd-Date.now())/1000));if(tEnd>Date.now()){clearInterval(tInt);tInt=setInterval(tick,250)}tick();return}
 else if(a==='tstop'){stopT();return}
 else return;
 const open=view==='more'?[...document.querySelectorAll('details.pl')].map(d=>d.open):null;
 render();
 if(open)document.querySelectorAll('details.pl').forEach((d,k)=>{if(open[k])d.open=true})});
document.addEventListener('input',ev=>{const t=ev.target,a=t.dataset.a;
 if(a==='ceat'){draftFor(day).cardio[+t.dataset.i].eat=t.checked;saveDrafts();return}
 if(a==='cin'){const c=draftFor(day).cardio[+t.dataset.i];c[t.dataset.f]=t.value;saveDrafts();if(t.dataset.f==='type')render();else{const h=$('wpk'+t.dataset.i);if(h)h.innerHTML=cHint(c)}}
 else if(a==='in'){draftFor(day).ex[t.dataset.e][+t.dataset.i][t.dataset.f]=t.value.trim();saveDrafts()}
 else if(a==='pl'){const e=S.plan[day][+t.dataset.i],f=t.dataset.f;if(f==='name')e.name=t.value;else{const n=num(t.value);if(n!==null&&n>=0)e[f]=f==='step'?n:Math.max(1,Math.round(n))}savePlan()}
 else if(a==='set'){const n=num(t.value);if(n!==null&&n>0){S[t.dataset.f]=Math.round(n);savePlan();renderHead()}}});
document.addEventListener('change',ev=>{const t=ev.target;if(t.dataset.a==='rec'){recEx=t.value;drawChart()}
 if(t.dataset.a==='pl'&&t.dataset.f!=='name'){const e=S.plan[day][+t.dataset.i];if(e.max<e.min)e.max=e.min;const d=t.closest('details');const sm=d&&d.querySelector('small');if(sm){const x=info(e);sm.textContent=`${x.sets} Sätze · ${x.min}–${x.max} Wdh. · +${fmt(x.step)} kg${x.vars.length>1?' · '+x.v:''}`}}});

/* Zahlenfelder: beim Antippen alles markieren, damit neue Eingabe die alte ersetzt (Nutzertest: „2155 kg“) */
document.addEventListener('focusin',ev=>{const t=ev.target;if(t.tagName==='INPUT'&&/^(decimal|numeric)$/.test(t.inputMode||t.getAttribute('inputmode')||''))setTimeout(()=>{try{t.select()}catch(e){}},0)});
