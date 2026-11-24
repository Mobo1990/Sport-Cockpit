/* Sport Cockpit – Ernährung: Tagebuch, Ziele, Suche, Open Food Facts, Scanner */
'use strict';
/* ===================== ERNÄHRUNG ===================== */
const MEALS=[['f','Frühstück'],['m','Mittag'],['a','Abend'],['s','Snacks']];
let nDate=null,sheet=null; // sheet: {meal, step:'search'|'amount'|'custom'|'scan', q, food, g, results, busy, msg}
const iso=d=>{const x=new Date(d);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')};
const today=()=>iso(Date.now());
const ND=d=>{const N=S.nut;if(!N.days[d])N.days[d]={items:[],t:0};return N.days[d]};
const r1=x=>Math.round(x*10)/10;
function lastWeight(before){const ks=Object.keys(S.nut.days).filter(k=>S.nut.days[k].w&&(!before||k<=before)).sort();return ks.length?S.nut.days[ks[ks.length-1]].w:null}
function bmr(w){const P=S.prof,a=P.year?new Date().getFullYear()-P.year:null;if(!P.height||!a)return null;return 10*w+6.25*P.height-5*a+(P.sex==='w'?-161:5)}
/* Ziele: Kalorien-Zuschlag zum Erhaltungsbedarf. „Fitter werden“ = leichtes Defizit.
   Das Ziel gilt ab dem Tag, an dem es gewählt wurde (S.nut.gh) – frühere Tage behalten ihr altes Ziel und ihre Punkte. */
const GOAL_ADD={aufbau:300,halten:0,fit:-250,defi:-450},GOAL_N={aufbau:'Aufbau',halten:'Halten',fit:'Fitter werden',defi:'Definieren'};
function goalAt(d){let g=null;for(const x of S.nut.gh||[])if(x.d<=d)g=x.g;return g||S.nut.goal}
function setGoal(v){const N=S.nut,t=today();if(N.goal===v)return;N.gh=(N.gh||[]).filter(x=>x.d!==t);if(!N.gh.length)N.gh.push({d:'0000-00-00',g:N.goal});N.gh.push({d:t,g:v});N.goal=v;S.metaT=Date.now();persist()}
/* Bereich für volle Kalorien-Punkte als Hinweis im Essen-Tab */
function kbandHtml(d,g){if(typeof KCAL_BANDS==='undefined'||d<KCAL_NEW_AB)return '';const b=(KCAL_BANDS[goalAt(d)]||KCAL_BANDS.halten)[0],m=g.kcal-(GOAL_ADD[goalAt(d)]||0);
 return `<p class="kband">Volle Punkte (+${b[2]}): ${fmt(Math.round((m+b[0])/10)*10)}–${fmt(Math.round((m+b[1])/10)*10)} kcal · ab 2 Mahlzeiten</p>`}
function goals(d){const N=S.nut,w=lastWeight(d)||S.prof.weight||80,b=bmr(w),maint=N.maint||(b?Math.round(b*S.prof.act/50)*50:Math.round(w*32/50)*50),G=goalAt(d),add=GOAL_ADD[G]||0;
 const trained=S.sessions.some(s=>iso(s.date)===d&&s.ex.length)||(d===today()&&Object.values(drafts).some(dr=>dr&&dr.ex&&Object.values(dr.ex).some(r=>r.some(x=>x.done))));
 const hh=(S.nut.days[d]||{}).h||{},bonus=(!N.maint&&b&&hh.ak)?Math.max(0,Math.round(((b+hh.ak)*1.1-b*S.prof.act)/10)*10):0,cx=S.sessions.filter(s=>iso(s.date)===d).reduce((a,s)=>a+(s.cardio||[]).reduce((b,c)=>b+(c.eat||0),0),0),kcal=maint+add+bonus+cx,p=Math.round(w*N.gkg*(trained?1.05:1)),f=Math.round(kcal*0.27/9),c=Math.max(0,Math.round((kcal-p*4-f*9)/4));const z=Math.min(50,Math.round(kcal*0.1/4));return{kcal,p,c,f,z,w,trained,maint,bmr:b,bonus,cx,h:hh}}
function totals(d){const t={kcal:0,p:0,c:0,f:0,z:0};for(const it of (S.nut.days[d]||{items:[]}).items){t.kcal+=it.kcal;t.p+=it.p;t.c+=it.c;t.f+=it.f;t.z+=it.z||0}return t}
function itemFrom(food,g,meal){const k=g/100;return{id:'i'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),name:food.name,g,meal,kcal:Math.round(food.kcal*k),p:r1(food.p*k),c:r1(food.c*k),f:r1(food.f*k),z:r1((food.z||0)*k),fid:food.id}}
function touch(d){ND(d).t=Date.now();persist()}
/* Lebensmittel-Index: einmal aufbauen, bei Datenänderung (persist/render) verwerfen */
let _fm=null;
const memoReset=()=>{_fm=null};
const normQ=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ß/g,'ss').replace(/ae/g,'a').replace(/oe/g,'o').replace(/ue/g,'u');
function fm(){if(!_fm){const all=[...S.nut.foods,...FOODS],byId=new Map(),byName=new Map();for(const f of all){if(!byId.has(f.id))byId.set(f.id,f);if(!byName.has(f.name))byName.set(f.name,f)}
 _fm={all,byId,byName,norm:all.map(f=>normQ(f.name+' '+(f.brand||''))),log:null,usual:new Map()}}return _fm}
function allFoods(){return fm().all}
const foodById=id=>fm().byId.get(id),foodByName=n=>fm().byName.get(n);
/* Suche: alle Wörter müssen vorkommen; Treffer am Namensanfang zuerst, dann Wortanfang, dann irgendwo */
function findFoods(q,max=25){const t=normQ(q).split(/\s+/).filter(Boolean);if(!t.length)return[];const m=fm(),out=[];
 for(let i=0;i<m.all.length;i++){const h=m.norm[i];if(!t.every(w=>h.includes(w)))continue;const sc=h.startsWith(t[0])?0:(' '+h).includes(' '+t[0])?1:2;out.push([sc,i])}
 if(!out.length){const q=t.join('');for(let i=0;i<m.all.length;i++){const ws=m.norm[i].split(/[^a-z0-9]+/).filter(w=>w.length>=4);if(ws.some(w=>q.includes(w)))out.push([3,i])}}
 return out.sort((a,b)=>a[0]-b[0]||a[1]-b[1]).slice(0,max).map(x=>m.all[x[1]])}
/* „Meintest du …?“ – Tippfehler-tolerant (Levenshtein): bis 1 Fehler bei kurzen, 2 bei langen Wörtern */
function lev(a,b,max){if(Math.abs(a.length-b.length)>max)return max+1;let p=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){const c=[i];let lo=i;for(let j=1;j<=b.length;j++){c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));if(c[j]<lo)lo=c[j]}if(lo>max)return max+1;p=c}return p[b.length]}
const fzTol=w=>w.length>=7?2:w.length>=4?1:0;
function fuzzyFoods(q,max=6){const t=normQ(q).split(/\s+/).filter(w=>w.length>=3);if(!t.length)return[];const m=fm(),out=[];
 for(let i=0;i<m.all.length;i++){const ws=m.norm[i].split(/[^a-z0-9]+/).filter(Boolean);let d=0,ok=true;for(const w of t){const tol=fzTol(w);let best=99;for(const x of ws){const v=x.startsWith(w)?0:lev(w,x.length>w.length+2?x.slice(0,w.length+1):x,tol);if(v<best)best=v;if(!best)break}if(best>tol){ok=false;break}d+=best}if(ok)out.push([d,i])}
 return out.sort((a,b)=>a[0]-b[0]||a[1]-b[1]).slice(0,max).map(x=>m.all[x[1]])}
function remember(food){const N=S.nut;if(food.src==='off'||food.src==='own'){if(!N.foods.some(x=>x.id===food.id))N.foods.unshift(food)}N.recent=[food.id,...N.recent.filter(x=>x!==food.id)].slice(0,30)}
function nutLine(){const d=today(),g=goals(d),t=totals(d);if(!t.kcal&&!lastWeight())return '';return `<p class="nline" data-a="view" data-v="nut">Ernährung heute: <b>${fmt(t.kcal)}</b> / ${fmt(g.kcal)} kcal · <b>${fmt(Math.round(t.p))}</b> / ${g.p} g Protein${g.trained?' · Trainingstag':''}</p>`}
/* Farbverlaufs-Balken: kind 'eat' = Grün→Rot (Kalorien, Limit), 'goal' = Rot→Grün (Protein, Ziel erreichen) */
function rbar(v,goal,kind,big){const r=goal?v/goal:0,pc=Math.min(r,1)*100,over=kind==='eat'&&r>1.05;
 return `<div class="rb ${kind}${big?' big':''}${over?' over':''}" role="meter" aria-label="${Math.round(v)} von ${goal}" aria-valuemin="0" aria-valuemax="${goal}" aria-valuenow="${Math.round(v)}"><i style="--p:${pc.toFixed(1)}%"></i><b style="left:${pc.toFixed(1)}%"></b></div>`}
const bar=(l,v,goal,u)=>{const kind=l==='Protein'?'up':'eat',left=goal-v;return `<div class="nb"><div class="nbh"><span>${l}</span><span><b>${fmt(Math.round(v))}</b> / ${fmt(goal)} ${u}</span></div>${rbar(v,goal,kind)}<div class="nbf">${kind==='goal'?(left>0?`noch ${fmt(Math.round(left))} ${u}`:'Ziel erreicht'):(left>=0?`noch ${fmt(Math.round(left))} ${u} frei`:`${fmt(Math.round(-left))} ${u} drüber`)}</div></div>`};
function renderNut(){if(!nDate)nDate=today();const d=nDate,g=goals(d),t=totals(d),day=S.nut.days[d]||{items:[]},isT=d===today();
 const left=g.kcal-t.kcal,dl=new Date(d+'T12:00').toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'long'});
 let h=healthLink()+`<button class="primary eatnow" data-eatnow="1">+ Essen eintragen <small>· ${mealName(mealNow())}</small></button><div class="ndate"><button data-n="prev" aria-label="Vortag">‹</button><b>${isT?'Heute':dl}</b><button data-n="next" aria-label="Nächster Tag"${isT?' disabled':''}>›</button></div>${shareInboxHtml()}${sayInboxHtml()}
 <section class="nsum"><div class="nbig"><b class="cond">${fmt(Math.abs(left))}</b><span>${left>=0?'kcal übrig':'kcal drüber'}</span><small>${GOAL_N[goalAt(today())]||''}${g.trained?' · Trainingstag, Protein +5 %':''}${g.cx?` · Walking Pad +${fmt(g.cx)} kcal`:''}</small>${kbandHtml(nDate||today(),g)}${g.h&&(g.h.st||g.h.ak)?`<p class="hl">Apple Health: ${g.h.st?fmt(g.h.st)+' Schritte':''}${g.h.ak?' · '+fmt(g.h.ak)+' aktive kcal':''}${g.h.tm?' · '+fmt(g.h.tm)+' min Training':''}${g.bonus?` · <b>+${fmt(g.bonus)} kcal</b> extra (mehr bewegt als dein Alltag-Faktor annimmt)`:''}</p>`:''}</div>
 <div class="nbars">${bar('Kalorien',t.kcal,g.kcal,'kcal')}${bar('Protein',t.p,g.p,'g')}${bar('Kohlenhydrate',t.c,g.c,'g')}${bar('Zucker',t.z,g.z,'g')}${bar('Fett',t.f,g.f,'g')}</div></section>`;
 h+=MEALS.map(([m,l])=>{const its=day.items.filter(i=>i.meal===m),mk=its.reduce((a,i)=>a+i.kcal,0);
  return `<section class="meal"><header><h3>${l}</h3><span>${mk?fmt(mk)+' kcal':''}</span></header>${its.map(i=>`<div class="it"><div><b>${esc(i.name)}</b><small>${fmt(i.g)} g · ${fmt(i.p)} g Protein</small></div><span>${fmt(i.kcal)}</span><button data-n="rm" data-id="${i.id}" aria-label="Entfernen">✕</button></div>`).join('')}
  <div class="mfoot"><button data-n="add" data-m="${m}">+ Hinzufügen</button>${its.length?`<button class="ghost" data-n="tpl" data-m="${m}">Als Vorlage speichern</button>`:''}${shareMealBtn(m,its)}</div></section>`}).join('');
 const ws=Object.keys(S.nut.days).filter(k=>S.nut.days[k].w).sort();
 h+=`<section class="meal"><header><h3>Körpergewicht & Wasser</h3><span>${day.w?fmt(day.w)+' kg':''}</span></header>
 <div class="wrow"><input id="wIn" inputmode="decimal" placeholder="${lastWeight(d)?fmt(lastWeight(d)):'kg'}" value="${day.w?fmt(day.w):''}" aria-label="Gewicht in kg"><button data-n="w">Gewicht speichern</button></div>
 <div class="wrow"><span class="water">${fmt((day.water||0)/1000)} l Wasser</span><button data-n="water" data-v="250">+ 250 ml</button><button data-n="water" data-v="750">+ 0,75 l</button><button class="ghost" data-n="water" data-v="-250">−</button></div>
 ${ws.length>1?`<div class="fig" style="min-height:200px"><svg id="wchart" role="img" aria-label="Gewichtsverlauf"></svg></div>`:''}</section>
 <details class="meal nset"><summary><h3>Ziele einstellen</h3><span>${fmt(g.kcal)} kcal · ${g.p} g Protein</span></summary>
 <div class="vars" style="margin:8px 0">${[['aufbau','Aufbau (+300)'],['halten','Halten'],['fit','Fitter werden (−250)'],['defi','Definieren (−450)']].map(([k,l])=>`<button data-n="goal" data-v="${k}" aria-pressed="${S.nut.goal===k}">${l}</button>`).join('')}</div>
 <div class="settings" style="margin:8px 0"><div><label for="maint">Erhaltungsbedarf (kcal)</label><input id="maint" inputmode="numeric" data-n="maint" placeholder="${g.maint} (geschätzt)" value="${S.nut.maint||''}"></div><div><label for="gkg">Protein pro kg Körpergewicht</label><input id="gkg" inputmode="decimal" data-n="gkg" value="${fmt(S.nut.gkg)}"></div></div>
 <p class="tip" style="padding:0">${g.bmr?`Aus deinem Profil berechnet (Grundumsatz ${fmt(Math.round(g.bmr))} kcal × Aktivität ${fmt(S.prof.act)}). Eigene Angabe überschreibt das.`:'Profil unter „Mehr“ ausfüllen für eine genaue Berechnung – sonst grob 32 kcal pro kg.'} Fett 27 % der Kalorien, Rest Kohlenhydrate.</p></details>`;
 if(sheet)h+=renderSheet();
 return h}
function afterNut(){const s=$('wchart');if(s){if(ro)ro.disconnect();ro=new ResizeObserver(drawW);ro.observe(s)}const q=$('fq');if(q&&sheet&&sheet.focus){q.focus({preventScroll:true});q.setSelectionRange(q.value.length,q.value.length);sheet.focus=false}}
function drawW(){const s=$('wchart');if(!s)return;const W=s.clientWidth,Hh=s.clientHeight;if(!W)return;
 const ks=Object.keys(S.nut.days).filter(k=>S.nut.days[k].w).sort().slice(-60),pts=ks.map(k=>({k,v:S.nut.days[k].w})),avg=pts.map((q,i)=>{const a=pts.slice(Math.max(0,i-6),i+1);return a.reduce((x,y)=>x+y.v,0)/a.length});
 const p={l:40,r:14,t:16,b:26},lo=Math.min(...pts.map(q=>q.v))-0.5,hi=Math.max(...pts.map(q=>q.v))+0.5,x=i=>p.l+(pts.length<2?0:i*(W-p.l-p.r)/(pts.length-1)),y=v=>p.t+(hi-v)/(hi-lo)*(Hh-p.t-p.b);
 s.innerHTML=[lo+0.5,hi-0.5].map(v=>`<line x1="${p.l}" x2="${W-p.r}" y1="${y(v)}" y2="${y(v)}" stroke="#e4e2dc"/><text x="${p.l-6}" y="${y(v)+4}" text-anchor="end" font-size="11" fill="#6b6e75">${fmt(r1(v))}</text>`).join('')
 +pts.map((q,i)=>`<circle cx="${x(i)}" cy="${y(q.v)}" r="2.5" fill="#6b6e75"/>`).join('')+`<path d="${avg.map((v,i)=>`${i?'L':'M'}${x(i)},${y(v)}`).join('')}" fill="none" stroke="#ff4b26" stroke-width="3"/>`
 +`<text x="${W-p.r}" y="${Hh-6}" text-anchor="end" font-size="12" fill="#111214">Ø 7 Tage: ${fmt(r1(avg[avg.length-1]))} kg</text>`}
/* --- Hinzufügen-Sheet --- */
function foodRow(f){return `<button class="frow" data-n="pick" data-id="${esc(f.id)}"><div><b>${esc(f.name)}</b><small>${f.brand?esc(f.brand)+' · ':''}${fmt(f.kcal)} kcal · ${f.np?'Eiweiß beim Antippen':fmt(f.p)+' g P'} / 100 g</small></div><span>›</span></button>`}
function bareHtml(res){const b=res.bare||[];return b.length?`<h4>Gefunden, aber ohne Nährwerte</h4>${b.map(n=>`<button class="frow" data-n="custom" data-name="${esc(n)}"><div><b>${esc(n)}</b><small>Werte von der Packung eintragen</small></div><span>+</span></button>`).join('')}`:''}
function sheetList(sh){const q=(sh.q||'').trim(),N=S.nut;
 if(!q){const tpls=N.meals.length?`<h4>Vorlagen</h4>${N.meals.map(t=>`<button class="frow" data-n="usetpl" data-id="${t.id}"><div><b>${esc(t.name)}</b><small>${t.items.length} Lebensmittel · ${fmt(t.items.reduce((a,i)=>a+i.kcal,0))} kcal</small></div><span>+</span></button>`).join('')}`:'';return tpls+smartLists(sh.meal)}
 const hits=findFoods(q),fz=hits.length?[]:fuzzyFoods(q),sug=sh.results&&sh.results.sug;
 return `${hits.length?`<h4>Gefunden</h4>${hits.map(f=>foodRow2(f)).join('')}`:''}${fz.length?`<h4>Meintest du …?</h4>${fz.map(f=>foodRow2(f)).join('')}`:''}<h4>Open Food Facts</h4>${sug&&!sh.busy?`<button class="sugg" data-n="sug" data-q="${esc(sug)}">Meintest du: <b>${esc(sug)}</b>?</button>`:''}${sh.busy?'<p class="tip" style="padding:0">Suche …</p>':sh.results?(sh.results.length?sh.results.map(f=>foodRow2(f)).join('')+bareHtml(sh.results):(sh.results.bare||[]).length?bareHtml(sh.results):`<p class="tip" style="padding:0">${esc(sh.offErr||'Nichts gefunden.')}${sh.offErr?' Packungen findest du per <b>Barcode-Scan</b>, sonst leg das Produkt selbst an.':''}</p>${sh.offErr?`<div class="offerr"><button data-n="scan">▦ Barcode scannen</button><button class="ghost" data-n="off">Nochmal</button></div>`:''}`):`<button data-n="off" style="width:100%">„${esc(q)}“ in Open Food Facts suchen</button>`}`}
/* Nur die Ergebnisliste neu zeichnen – das Suchfeld (und die iPhone-Tastatur) bleibt unberührt */
function updRes(){const box=$('fres');if(box&&sheet&&sheet.step==='search')box.innerHTML=sheetList(sheet);else render()}
function renderSheet(){const sh=sheet,ml=MEALS.find(m=>m[0]===sh.meal)[1];let b='';
 if(sh.step==='photo'){b=renderPhotoStep()}
 else if(sh.step==='amount'){const f=sh.food,g=num(sh.g)||0,it=itemFrom(f,g,sh.meal);
  b=`<button class="back" data-n="back">‹ Zurück</button><h2>${esc(f.name)}</h2><p class="tip" style="padding:0">${f.brand?esc(f.brand)+' · ':''}pro 100 g: ${fmt(f.kcal)} kcal · ${fmt(f.p)} P · ${fmt(f.c)} KH · ${fmt(f.f)} F</p>
  <div class="amt"><input id="gIn" inputmode="decimal" value="${esc(sh.g)}" data-n="g" aria-label="Menge in Gramm"><span>g</span></div>
  <div class="vars">${[...(f.por?[[f.por.l,f.por.g]]:[]),['50 g',50],['100 g',100],['150 g',150],['200 g',200]].map(([l,v])=>`<button data-n="gq" data-v="${v}">${esc(l)}</button>`).join('')}</div>
  <div class="calc"><div><b>${fmt(it.kcal)}</b><small>kcal</small></div><div><b>${fmt(it.p)}</b><small>Protein</small></div><div><b>${fmt(it.c)}</b><small>KH</small></div><div><b>${fmt(it.f)}</b><small>Fett</small></div></div>
  ${shareAmtHtml(sh)}<button class="primary" data-n="addit" style="width:100%">Zu ${ml} hinzufügen</button>`}
 else if(sh.step==='share'){b=shareSheetHtml(sh)}
 else if(sh.step==='say'){b=renderSayStep()}
 else if(sh.step==='custom'){b=`<button class="back" data-n="back">‹ Zurück</button><h2>Eigenes Produkt</h2><p class="tip" style="padding:0">Werte von der Packung, pro 100 g.</p>
  <div class="cform"><div class="full"><label>Name</label><input id="cN" value="${esc(sh.cname||sh.q||'')}"></div>${[['cK','kcal'],['cP','Protein g'],['cC','Kohlenhydrate g'],['cZ','davon Zucker g'],['cF','Fett g'],['cG','Portion g (optional)']].map(([i,l])=>`<div><label>${l}</label><input id="${i}" inputmode="decimal"></div>`).join('')}</div>
  <button class="primary" data-n="savecustom" style="width:100%">Speichern & weiter</button>`}
 else if(sh.step==='scan'){b=`<button class="back" data-n="back">‹ Zurück</button><h2>Barcode scannen</h2><div id="scanbox"></div><p class="tip" id="scanmsg" style="padding:8px 0">${esc(sh.msg||'Barcode waagerecht in den Rahmen halten, etwa 20–30 cm Abstand, bis er scharf ist.')}</p><label class="scanpic"><input type="file" id="scanPic" accept="image/*" capture="environment" hidden>Klappt nicht? Barcode fotografieren</label><div class="wrow"><input id="codeIn" inputmode="numeric" placeholder="oder Nummer eintippen"><button data-n="code">Suchen</button></div>`}
 else{b=`<div class="shtop"><h2>Essen eintragen</h2><button class="ghost" data-n="close">Schließen</button></div>${mealChips(sh.meal)}
  <div class="srch"><input id="fq" data-n="q" placeholder="Lebensmittel suchen …" value="${esc(sh.q||'')}" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="search"><button data-n="scan" aria-label="Barcode scannen">▦ Scan</button><button data-say="open" aria-label="Per Sprache eintragen" class="saybtn"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg></button><label class="filebtn">Foto<input type="file" accept="image/*" capture="environment" data-ai="file" hidden></label></div>
  <div id="fres">${sheetList(sh)}</div>
  <div class="actions"><button class="ghost" data-n="custom">+ Eigenes Produkt anlegen</button></div>`}
 return `<div class="sheet" role="dialog" aria-modal="true" aria-label="Essen eintragen"><div class="sheetin" data-step="${sh.step||'search'}">${b}</div></div>`}
/* Der Suchindex hat seit Ende Nov. 2026 keine „nutriments“ mehr, aber im Nutri-Score Energie (kJ), Eiweiß, Zucker:
   daraus ein Teil-Eintrag (part), Kohlenhydrate/Fett lädt die App beim Antippen nach. */
function offNs(p){const ns=p.nutriscore_data&&p.nutriscore_data.components;if(!ns)return null;const all=[...(ns.positive||[]),...(ns.negative||[])],v=id=>{const x=all.find(c=>c.id===id);return x&&x.value!=null?+x.value:null};
 const kj=v('energy');if(kj==null)return null;const pr=v('proteins');return{'energy-kcal_100g':kj/4.184,proteins_100g:pr||0,sugars_100g:v('sugars')||0,part:1,...(pr==null?{np:1}:{})}}
function mapOFF(p){let n=p.nutriments||{};let kcal=n['energy-kcal_100g']??(n['energy_100g']?n['energy_100g']/4.184:null);if(kcal==null){const x=offNs(p);if(!x)return null;n=x;kcal=x['energy-kcal_100g']}
 const sq=parseFloat(p.serving_quantity);return{id:'off'+(p.code||p._id),name:String(p.product_name_de||(typeof p.product_name==='object'&&p.product_name?(p.product_name.de||Object.values(p.product_name)[0]):p.product_name)||'Unbekannt').trim(),brand:(Array.isArray(p.brands)?p.brands.join(','):String(p.brands||'')).split(',')[0].trim().replace(/^[a-z]{2}:/,''),kcal:Math.round(kcal),p:r1(+n.proteins_100g||0),c:r1(+n.carbohydrates_100g||0),z:r1(+n.sugars_100g||0),f:r1(+n.fat_100g||0),por:sq>0?{l:'Portion '+fmt(sq)+' g',g:sq}:null,src:'off',code:p.code,...(n.part?{part:1}:{}),...(n.np?{np:1}:{})}}
const OFF_FIELDS='code,product_name,product_name_de,brands,nutriments,serving_quantity,nutriscore_data';
const offCache=new Map();let offAbort=null;
/* Online-Suche (Open Food Facts), drei Wege nacheinander:
   1. direkt die schnelle Suche search.openfoodfacts.org (erlaubt seit Nov. 2026 Browser-Anfragen, liefert den Nutri-Score mit),
   2. über Home Assistant (rest_command.sport_cockpit_food_search),
   3. zuletzt die alte, stark begrenzte Suche. Ergebnisse 7 Tage auf dem Gerät gemerkt (nur nicht-leere), automatische Suchen höchstens alle 4 s.
   Danach: zusammengesetzte Wörter trennen (der Index findet „kinderriegel“ nicht, „kinder riegel“ schon) und fehlende Nährwerte nachladen. */
const OFF_OLD=q=>`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=20&lc=de&cc=de&fields=${OFF_FIELDS}`;
const OFF_NEW=q=>`https://search.openfoodfacts.org/search?q=${encodeURIComponent(q)}&langs=de&page_size=20&fields=${OFF_FIELDS}`;
const OFF_LS='sc.offcache2',OFF_TTL=7*864e5;let offLast=0,offDown=0;
(()=>{try{const j=JSON.parse(localStorage.getItem(OFF_LS)||'{}');for(const k in j)if(Date.now()-j[k].t<OFF_TTL&&(j[k].r||[]).length)offCache.set(k,j[k].r)}catch(e){}try{localStorage.removeItem('sc.offcache')}catch(e){}})();
function offStore(){try{const o={},ks=[...offCache.keys()].slice(-40),now=Date.now();for(const k of ks)o[k]={t:now,r:offCache.get(k)};localStorage.setItem(OFF_LS,JSON.stringify(o))}catch(e){}}
async function offGet(url,signal,ms){const ac=new AbortController(),to=setTimeout(()=>ac.abort(),ms),stop=()=>ac.abort();signal.addEventListener('abort',stop);
 try{const r=await fetch(url,{signal:ac.signal});if(!r.ok)throw new Error('HTTP '+r.status);const t=await r.text();try{return JSON.parse(t)}catch(e){throw new Error('busy')}}finally{clearTimeout(to);signal.removeEventListener('abort',stop)}}
let haFoodOff=0;
const offBare=hits=>[...new Set(hits.filter(p=>!mapOFF(p)).map(p=>String(p.product_name_de||p.product_name||'').trim()+((Array.isArray(p.brands)?p.brands[0]:String(p.brands||'').split(',')[0])?' ('+String(Array.isArray(p.brands)?p.brands[0]:String(p.brands||'').split(',')[0]).trim().replace(/^[a-z]{2}:/,'')+')':'')).filter(Boolean))].slice(0,5);
const offSplitQ=q=>{const w=q.trim().toLowerCase();if(!/^[a-zäöüß]{7,}$/.test(w))return null;const o=[];for(let i=3;i<=w.length-3;i++)o.push(`(${w.slice(0,i)} AND ${w.slice(i)})`);return o.join(' OR ')};
const offFlat=t=>String(t||'').toLowerCase().replace(/[^a-z0-9äöüß]/g,'');
async function haFoodQuery(q){if(!HA.url||!HA.token||Date.now()-haFoodOff<600000)return null;
 try{const r=await haCall([{type:'call_service',domain:'rest_command',service:'sport_cockpit_food_search',service_data:{q},return_response:true}]);const m=r[0]||{};
  if(!m.success){haFoodOff=Date.now();return null}const resp=(m.result||{}).response||{};if(resp.status!==200||!resp.content)return null;
  const c=typeof resp.content==='string'?JSON.parse(resp.content):resp.content;return Array.isArray(c.hits)?c.hits:null}catch(e){return null}}
/* Eine Abfrage: erst über HA, dann direkt, zuletzt die alte Suche. Liefert die rohen Treffer oder wirft, wenn alles scheitert. */
async function offQuery(q,signal){try{const j=await offGet(OFF_NEW(q),signal,10000);if(Array.isArray(j.hits))return j.hits}catch(e){if(signal.aborted)throw e}
 const h=await haFoodQuery(q);if(h)return h;
 const j=await offGet(OFF_OLD(q),signal,12000);return j.products||[]}
/* Fehlende Nährwerte (der Index liefert sie seit Ende Nov. 2026 oft nicht mit) für die ersten Treffer einzeln nachladen, parallel, je max. 6 s. */
async function offFill(hits){const miss=hits.filter(h=>!mapOFF(h)&&h.code).slice(0,5);if(!miss.length)return hits;
 const got=await Promise.all(miss.map(h=>Promise.race([offFetch(h.code).then(j=>j&&j.product?{...h,...j.product,code:h.code}:null).catch(()=>null),new Promise(r=>setTimeout(()=>r(null),6000))])));
 const m=new Map();miss.forEach((h,i)=>{if(got[i])m.set(h.code,got[i])});return hits.map(h=>m.get(h.code)||h)}
const offRank=(q,hits)=>{const w=offFlat(q),ws=q.toLowerCase().split(/\s+/).map(offFlat).filter(Boolean),sc=h=>{const n=offFlat(h.product_name_de||h.product_name);return(n.includes(w)?2:0)+(ws.every(x=>n.includes(x))?1:0)+(h.product_name_de?0.5:0)};return hits.map((h,i)=>[sc(h),i,h]).sort((a,b)=>b[0]-a[0]||a[1]-b[1]).map(x=>x[2])};
/* Unscharfe Abfrage (Lucene „~“): jedes Wort mit Tippfehler-Toleranz, ein langes Einzelwort zusätzlich getrennt */
function offFuzzyQ(q){const ws=q.trim().toLowerCase().split(/\s+/).filter(Boolean);if(!ws.length||ws.every(w=>w.length<4))return null;const f=w=>w.length>=4?w+'~':w;
 const base=ws.map(f).join(' AND ');if(ws.length>1||ws[0].length<7)return base;const w=ws[0],o=[`(${base})`];for(let i=3;i<=w.length-3;i++)o.push(`(${f(w.slice(0,i))} AND ${f(w.slice(i))})`);return o.join(' OR ')}
/* Wörterbuch für „Meintest du“: Wörter der eingebauten und eigenen Lebensmittel plus gängige Produkte und Marken.
   Die Namen in Open Food Facts sind oft unsauber oder fremdsprachig – sie dienen nur als Rückfall. */
const SUG_EXTRA=['Kinderriegel','Kinder Bueno','Kinder Schokolade','Snickers','Twix','Mars','Bounty','Milka','Ritter Sport','Duplo','Hanuta','Nutella','Haribo','Pringles','Oreo','Leibniz','Milchschnitte',
 'Milchreis','Skyr','Alpro','Coca-Cola','Cola Zero','Fanta','Red Bull','Monster','Haferdrink','Pizza','Döner','Lasagne','Spaghetti','Bolognese','Brötchen','Croissant','Brezel','Toast','Müsli','Cornflakes',
 'Joghurt','Quark','Magerquark','Hüttenkäse','Frischkäse','Mozzarella','Gouda','Leberwurst','Salami','Schinken','Thunfisch','Lachs','Avocado','Erdnussbutter','Proteinpulver','Proteinriegel','Proteinshake',
 'Haferflocken','Hähnchenbrust','Putenbrust','Rinderhack','Vollkornbrot','Eiweißbrot','Müsliriegel','Reiswaffeln','Banane','Apfel','Kartoffeln','Nudeln','Reis','Eier','Butter','Milch','Käse','Wurst'];
const sfl=t=>offFlat(t).replace(/ä/g,'a').replace(/ö/g,'o').replace(/ü/g,'u').replace(/ß/g,'ss');
let sugVoc=null;function sugVocab(){if(sugVoc)return sugVoc;const m=new Map(),add=w=>{w=String(w).trim();const k=sfl(w);if(k.length>=4&&!/\d/.test(k)&&!m.has(k))m.set(k,w)};
 SUG_EXTRA.forEach(add);for(const f of [...FOODS,...S.nut.foods])for(const w of String(f.name).split(/[\s,()\/-]+/))if(/^[A-Za-zÄÖÜäöüß]{4,}$/.test(w))add(w.charAt(0).toUpperCase()+w.slice(1));return sugVoc=m}
function sugFix(q){const V=sugVocab(),near=w=>{const k=sfl(w);if(V.has(k))return null;const tol=k.length>=7?2:k.length>=4?1:0;if(!tol)return null;let best=null,bd=tol+1;for(const [vk,vw] of V){if(Math.abs(vk.length-k.length)>tol)continue;const d=lev(k,vk,tol);if(d<bd){bd=d;best=vw}}return best};
 const whole=near(q);if(whole)return whole;const ws=q.trim().split(/\s+/);if(ws.length<2)return null;let ch=false;const out=ws.map(w=>{const n=near(w);if(n){ch=true;return n}return w});return ch?out.join(' '):null}
/* Rückfall-Vorschlag aus den Online-Treffern: der ähnlichste Produktname (ganz oder sein Anfang) */
function offSug(q,hits){const qf=sfl(q),tol=fzTol(qf)+1,cnt=new Map();
 for(const h of hits){const n=String(h.product_name_de||h.product_name||'').trim();if(!n||n.length>40)continue;const k=sfl(n);if(!k||k===qf)continue;
  const d=Math.min(lev(qf,k,tol),lev(qf,k.slice(0,qf.length),tol),lev(qf,k.slice(0,qf.length+1),tol));if(d>tol)continue;const c=cnt.get(k)||{n,c:0,d};c.c++;cnt.set(k,c)}
 const top=[...cnt.values()].sort((a,b)=>a.d-b.d||b.c-a.c)[0];return top?top.n.replace(/^./,c=>c.toUpperCase()):null}
async function offHits(q,signal){let raw=await offQuery(q,signal);
 const sq=!raw.length&&offSplitQ(q);if(sq){const w=offFlat(q),h2=await offQuery(sq,signal).catch(()=>[]);const has=h=>offFlat(h.product_name_de||h.product_name).includes(w);raw=[...h2.filter(has),...h2.filter(h=>!has(h))]}
 /* Tippfehler laut Wörterbuch und kein Treffer enthält das Eingegebene: mit dem korrigierten Begriff suchen, diese Treffer zuerst */
 const qf=sfl(q),hasQ=raw.some(h=>sfl(h.product_name_de||h.product_name).includes(qf));let sug=hasQ?null:sugFix(q);
 if(sug){const sub=await offHits0(sug,signal).catch(()=>[]),seen=new Set(sub.map(h=>h.code));raw=[...sub,...raw.filter(h=>!seen.has(h.code))]}
 else if(raw.filter(h=>mapOFF(h)).length<3){const fq=offFuzzyQ(q);if(fq){const h3=await offQuery(fq,signal).catch(()=>[]),seen=new Set(raw.map(h=>h.code));sug=sugFix(q)||offSug(q,h3);raw=[...raw,...h3.filter(h=>!seen.has(h.code))]}}
 const res=await offFill(offRank(sug||q,raw));res.sug=sug;return res}
/* Treffer für den korrigierten Begriff (mit Wort-Trennung, ohne erneute Korrektur) */
async function offHits0(q,signal){let raw=await offQuery(q,signal);const sq=!raw.length&&offSplitQ(q);if(sq){const w=offFlat(q),h2=await offQuery(sq,signal).catch(()=>[]);const has=h=>offFlat(h.product_name_de||h.product_name).includes(w);raw=[...h2.filter(has),...h2.filter(h=>!has(h))]}return raw}
const offDone=new WeakMap();function offComplete(f){if(!offDone.has(f))offDone.set(f,offComplete0(f));return offDone.get(f)}
async function offComplete0(f){try{const j=await offFetch(f.code),x=j&&j.product&&mapOFF({...j.product,code:f.code});if(!x||x.part)return;delete f.part;delete f.np;Object.assign(f,{kcal:x.kcal,p:x.p,c:x.c,z:x.z,f:x.f,por:f.por||x.por});offStore();if(sheet&&sheet.food===f&&sheet.step==='amount')render()}catch(e){}finally{f.tried=1}}
async function offSearch(q){const key=normQ(q);if(offCache.has(key)){sheet.results=offCache.get(key);sheet.busy=false;updRes();return}
 if(offAbort)offAbort.abort();const ac=new AbortController();offAbort=ac;sheet.busy=true;updRes();offLast=Date.now();
 try{const hits=await offHits(q,ac.signal);if(offAbort!==ac)return;const res=hits.map(mapOFF).filter(Boolean);res.bare=offBare(hits);res.sug=hits.sug;
  offCache.delete(key);if(res.length){offCache.set(key,res);offStore()}if(sheet&&normQ(sheet.q.trim())===key)sheet.results=res}
 catch(e){if(offAbort!==ac)return;if(sheet){sheet.results=[];sheet.offErr=!navigator.onLine?'Kein Internet – Online-Suche nicht möglich.':ac.signal.aborted?'Open Food Facts antwortet gerade nicht.':'Die Online-Suche von Open Food Facts ist gerade gestört.';offDown=Date.now()}}
 offAbort=null;if(sheet){sheet.busy=false;updRes()}}
/* Meldung im Scanner setzen, ohne die Seite neu aufzubauen (sonst verschwindet das Kamerabild) */
function scanMsg(t){if(!sheet)return;sheet.msg=t;const e=$('scanmsg');if(e&&sheet.step==='scan')e.textContent=t;else render()}
async function offFetch(code){const u=`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json?fields=${OFF_FIELDS}`;
 for(let i=0;i<2;i++){try{const r=await fetch(u);if(r.status===404)return{status:0};return await r.json()}catch(e){if(i)throw e;await new Promise(r=>setTimeout(r,800))}}}
let scanBusy=false;
async function offCode(code){if(!sheet)return;scanBusy=true;scanMsg('Suche '+code+' …');
 try{const j=await offFetch(code);const f=j&&j.status===1&&mapOFF({...j.product,code});
  if(f){stopScan();sheet.food=f;sheet.g=f.por?String(f.por.g):'100';sheet.step='amount';sheet.msg='';render()}
  else scanMsg(`Produkt ${code} nicht gefunden oder ohne Nährwerte – nochmal scannen oder als eigenes Produkt anlegen.`)}
 catch(e){scanMsg('Open Food Facts nicht erreichbar – gleich nochmal versuchen.')}
 setTimeout(()=>{scanBusy=false},1500)}
let scanner=null,scanLib=null,scanLast='';
function loadScanLib(){if(scanLib)return scanLib;scanLib=new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';s.onload=()=>res();s.onerror=()=>{scanLib=null;rej()};document.head.appendChild(s)});return scanLib}
/* EAN-Prüfziffer: Fehllesungen gar nicht erst nachschlagen */
function eanOk(c){if(!/^\d{8}$|^\d{12,13}$/.test(c))return false;const d=c.padStart(13,'0').split('').map(Number);const s=d.slice(0,12).reduce((a,x,i)=>a+x*(i%2?3:1),0);return (10-s%10)%10===d[12]}
async function startScan(){try{await loadScanLib();await new Promise(r=>setTimeout(r,50));if(!$('scanbox'))return;stopScan();scanBusy=false;scanLast='';
 const F=Html5QrcodeSupportedFormats;scanner=new Html5Qrcode('scanbox',{formatsToSupport:[F.EAN_13,F.EAN_8,F.UPC_A,F.UPC_E],verbose:false,experimentalFeatures:{useBarCodeDetectorIfSupported:true}});
 const w=Math.min(320,($('scanbox').clientWidth||320)-20);
 await scanner.start({facingMode:'environment'},{fps:15,qrbox:{width:w,height:Math.round(w*.5)},disableFlip:true,videoConstraints:{facingMode:'environment',width:{ideal:1280},height:{ideal:720},advanced:[{focusMode:'continuous'}]}},
  code=>{if(scanBusy||!eanOk(code)||code===scanLast&&sheet&&/nicht gefunden/.test(sheet.msg||''))return;scanLast=code;try{navigator.vibrate&&navigator.vibrate(60)}catch(e){}offCode(code)},()=>{});
 /* Neuere iPhones fokussieren unter ~20 cm nicht: 2× Zoom, damit man weiter weg halten kann und das Bild scharf ist */
 try{const c=scanner.getRunningTrackCapabilities&&scanner.getRunningTrackCapabilities();if(c&&c.zoom&&c.zoom.max>=1.5)await scanner.applyVideoConstraints({advanced:[{zoom:Math.min(2,c.zoom.max)}]})}catch(e){}}
 catch(e){scanMsg('Kamera nicht verfügbar – in den iPhone-Einstellungen Kamera-Zugriff erlauben oder Nummer eintippen.')}}
/* Zuverlässige Alternative: Foto mit der normalen Kamera (Autofokus, Makro) und das Standbild auswerten */
/* Foto gedreht neu auswerten (Barcode hochkant fotografiert); große Fotos dabei auf max. 2000 px verkleinern */
function rotImg(file,deg){return new Promise((res,rej)=>{const u=URL.createObjectURL(file),im=new Image();im.onload=()=>{const k=Math.min(1,2000/Math.max(im.width,im.height)),w=im.width*k,h=im.height*k,c=document.createElement('canvas');
 c.width=h;c.height=w;const x=c.getContext('2d');x.translate(h/2,w/2);x.rotate(deg*Math.PI/180);x.drawImage(im,-w/2,-h/2,w,h);URL.revokeObjectURL(u);c.toBlob(b=>b?res(new File([b],'r.jpg',{type:'image/jpeg'})):rej(),'image/jpeg',.92)};im.onerror=rej;im.src=u})}
async function scanPhoto(file){if(!file)return;scanMsg('Foto wird ausgewertet …');try{await loadScanLib();stopScan();const F=Html5QrcodeSupportedFormats;
 let box=document.getElementById('scanfile');if(!box){box=document.createElement('div');box.id='scanfile';box.style.display='none';document.body.appendChild(box)}
 const h=new Html5Qrcode('scanfile',{formatsToSupport:[F.EAN_13,F.EAN_8,F.UPC_A,F.UPC_E],verbose:false,experimentalFeatures:{useBarCodeDetectorIfSupported:true}});
 let code='';for(const deg of [0,90,270]){try{code=await h.scanFile(deg?await rotImg(file,deg):file,false)}catch(e){}if(code)break}try{h.clear()}catch(e){}
 code=String(code||'').replace(/\D/g,'');if(code&&eanOk(code)){offCode(code);return}
 scanMsg('Auf dem Foto war kein Barcode zu erkennen. Barcode groß und scharf fotografieren, ohne Spiegelung – oder Nummer eintippen.')}catch(e){scanMsg('Foto konnte nicht ausgewertet werden – Nummer eintippen.')}}
document.addEventListener('change',ev=>{const t=ev.target;if(t.id==='scanPic'&&t.files&&t.files[0]){scanPhoto(t.files[0]);t.value=''}});
function stopScan(){if(scanner){const s=scanner;scanner=null;let p;try{p=s.stop()}catch(e){p=Promise.resolve()}Promise.resolve(p).catch(()=>{}).finally(()=>{try{s.clear()}catch(e){}})}}
let offT=null;
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-n]');if(!b||b.tagName==='INPUT')return;const a=b.dataset.n,d=nDate||today();
 if(a==='prev'||a==='next'){const x=new Date(d+'T12:00');x.setDate(x.getDate()+(a==='prev'?-1:1));nDate=iso(x)}
 else if(a==='add'){sheet={meal:b.dataset.m,step:'search',q:'',focus:true}}
 else if(a==='close'){stopScan();sheet=null}
 else if(a==='back'){stopScan();sheet.step='search';sheet.msg=''}
 else if(a==='rm'){const dd=ND(d);dd.items=dd.items.filter(i=>i.id!==b.dataset.id);touch(d)}
 else if(a==='pick'){const f=foodById(b.dataset.id)||(sheet.results||[]).find(x=>x.id===b.dataset.id);if(!f)return;sheet.food=f;if(f.part&&f.code)offComplete(f);const u=usual(f);sheet.g=u?String(u):f.por?String(f.por.g):'100';sheet.step='amount'}
 else if(a==='setmeal'){sheet.meal=b.dataset.m}
 else if(a==='gq'){sheet.g=b.dataset.v}
 else if(a==='addit'){if(sheet.food.part&&sheet.food.code&&!sheet.food.tried){offComplete(sheet.food).then(()=>b.click());return}const g=num(sheet.g);if(!g||g<=0){note('Menge eingeben');return}const it=itemFrom(sheet.food,g,sheet.meal),wb=d===today()?cheerFrom(d):null;ND(d).items.push(it);setTimeout(()=>cheerDiff(d,wb),0);remember(sheet.food);touch(d);shareOnAdd(sheet,it,d);sheet=null}
 else if(a==='sug'){const q=b.dataset.q;sheet.q=q;const i=$('fq');if(i)i.value=q;clearTimeout(offT);sheet.results=offCache.get(normQ(q))||null;sheet.offErr='';if(!sheet.results)offSearch(q);else updRes();return}
 else if(a==='off'){clearTimeout(offT);offCache.delete(normQ(sheet.q.trim()));sheet.offErr='';offSearch(sheet.q.trim());return}
 else if(a==='scan'){sheet.step='scan';sheet.msg='';render();startScan();return}
 else if(a==='code'){const c=($('codeIn').value||'').replace(/\D/g,'');if(c)offCode(c);return}
 else if(a==='custom'){sheet.cname=b.dataset.name||'';sheet.step='custom'}
 else if(a==='savecustom'){const v=i=>num($(i).value),n=$('cN').value.trim();if(!n||v('cK')==null){note('Name und kcal angeben');return}
  const f={id:'own'+Date.now().toString(36),name:n,kcal:v('cK'),p:v('cP')||0,c:v('cC')||0,z:v('cZ')||0,f:v('cF')||0,por:v('cG')?{l:'Portion '+fmt(v('cG'))+' g',g:v('cG')}:null,src:'own'};S.nut.foods.unshift(f);S.metaT=Date.now();sheet.food=f;sheet.g=f.por?String(f.por.g):'100';sheet.step='amount';persist()}
 else if(a==='tpl'){const its=ND(d).items.filter(i=>i.meal===b.dataset.m);const name=(MEALS.find(m=>m[0]===b.dataset.m)[1])+' '+new Date().toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'});S.nut.meals.unshift({id:'m'+Date.now().toString(36),name,items:its.map(({id,meal,...r})=>r)});S.metaT=Date.now();persist();note('Vorlage gespeichert')}
 else if(a==='usetpl'){const t=S.nut.meals.find(x=>x.id===b.dataset.id);if(t){for(const r of t.items)ND(d).items.push({...r,id:'i'+Math.random().toString(36).slice(2,9),meal:sheet.meal});touch(d);sheet=null}}
 else if(a==='w'){const w=num($('wIn').value);if(w&&w>30&&w<300){ND(d).w=w;touch(d)}else{note('Gewicht in kg eingeben');return}}
 else if(a==='water'){const dd=ND(d);dd.water=Math.max(0,(dd.water||0)+(+b.dataset.v));touch(d)}
 else if(a==='goal'){setGoal(b.dataset.v)}
 else return;
 const op=document.querySelector('details.nset');const wasOpen=op&&op.open;render();if(wasOpen){const n=document.querySelector('details.nset');if(n)n.open=true}});
document.addEventListener('input',ev=>{const t=ev.target,a=t.dataset.n;if(!a)return;
 if(a==='q'){sheet.q=t.value;const q=t.value.trim(),key=normQ(q);clearTimeout(offT);if(offAbort){offAbort.abort();offAbort=null}sheet.busy=false;sheet.results=offCache.get(key)||null;sheet.offErr='';updRes();
  if(q.length>2&&!sheet.results&&!findFoods(q,1).length&&Date.now()-offDown>60000){offT=setTimeout(()=>{if(sheet&&sheet.step==='search'&&sheet.q.trim()===q)offSearch(q)},Math.max(800,offLast+4000-Date.now()))}}
 else if(a==='g'){sheet.g=t.value;{const sg=$('shG');if(sg&&!sheet.sgEd)sg.value=String(Math.round((num(t.value)||0)*shareRatio()))}const it=itemFrom(sheet.food,num(t.value)||0,sheet.meal),c=document.querySelectorAll('.calc b');if(c.length===4){c[0].textContent=fmt(it.kcal);c[1].textContent=fmt(it.p);c[2].textContent=fmt(it.c);c[3].textContent=fmt(it.f)}}
 else if(a==='maint'){S.nut.maint=Math.round(num(t.value)||0);S.metaT=Date.now();persist()}
 else if(a==='gkg'){const v=num(t.value);if(v&&v>0.5&&v<4){S.nut.gkg=v;S.metaT=Date.now();persist()}}});

