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
function goals(d){const N=S.nut,w=lastWeight(d)||S.prof.weight||80,b=bmr(w),maint=N.maint||(b?Math.round(b*S.prof.act/50)*50:Math.round(w*32/50)*50),add={aufbau:300,halten:0,defi:-450}[N.goal]||0;
 const trained=S.sessions.some(s=>iso(s.date)===d&&s.ex.length)||(d===today()&&Object.values(drafts).some(dr=>dr&&dr.ex&&Object.values(dr.ex).some(r=>r.some(x=>x.done))));
 const hh=(S.nut.days[d]||{}).h||{},bonus=(!N.maint&&b&&hh.ak)?Math.max(0,Math.round(((b+hh.ak)*1.1-b*S.prof.act)/10)*10):0,kcal=maint+add+bonus,p=Math.round(w*N.gkg*(trained?1.05:1)),f=Math.round(kcal*0.27/9),c=Math.max(0,Math.round((kcal-p*4-f*9)/4));return{kcal,p,c,f,w,trained,maint,bmr:b,bonus,h:hh}}
function totals(d){const t={kcal:0,p:0,c:0,f:0};for(const it of (S.nut.days[d]||{items:[]}).items){t.kcal+=it.kcal;t.p+=it.p;t.c+=it.c;t.f+=it.f}return t}
function itemFrom(food,g,meal){const k=g/100;return{id:'i'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),name:food.name,g,meal,kcal:Math.round(food.kcal*k),p:r1(food.p*k),c:r1(food.c*k),f:r1(food.f*k),fid:food.id}}
function touch(d){ND(d).t=Date.now();persist()}
function allFoods(){return [...S.nut.foods,...FOODS]}
function remember(food){const N=S.nut;if(food.src==='off'||food.src==='own'){if(!N.foods.some(x=>x.id===food.id))N.foods.unshift(food)}N.recent=[food.id,...N.recent.filter(x=>x!==food.id)].slice(0,30)}
function nutLine(){const d=today(),g=goals(d),t=totals(d);if(!t.kcal&&!lastWeight())return '';return `<p class="nline" data-a="view" data-v="nut">Ernährung heute: <b>${fmt(t.kcal)}</b> / ${fmt(g.kcal)} kcal · <b>${fmt(Math.round(t.p))}</b> / ${g.p} g Protein${g.trained?' · Trainingstag':''}</p>`}
const bar=(l,v,goal,u)=>{const pc=goal?Math.min(v/goal,1.25)*100:0;return `<div class="nb"><div class="nbh"><span>${l}</span><span><b>${fmt(Math.round(v))}</b> / ${fmt(goal)} ${u}</span></div><i><s style="width:${Math.min(pc,100)}%"${v>goal*1.08?' class="over"':''}></s></i></div>`};
function renderNut(){if(!nDate)nDate=today();const d=nDate,g=goals(d),t=totals(d),day=S.nut.days[d]||{items:[]},isT=d===today();
 const left=g.kcal-t.kcal,dl=new Date(d+'T12:00').toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'long'});
 let h=healthLink()+`<div class="ndate"><button data-n="prev" aria-label="Vortag">‹</button><b>${isT?'Heute':dl}</b><button data-n="next" aria-label="Nächster Tag"${isT?' disabled':''}>›</button></div>
 <section class="nsum"><div class="nbig"><b class="cond">${fmt(Math.abs(left))}</b><span>${left>=0?'kcal übrig':'kcal drüber'}</span><small>${{aufbau:'Aufbau',halten:'Halten',defi:'Definieren'}[S.nut.goal]}${g.trained?' · Trainingstag, Protein +5 %':''}</small>${g.h&&(g.h.st||g.h.ak)?`<p class="hl">Apple Health: ${g.h.st?fmt(g.h.st)+' Schritte':''}${g.h.ak?' · '+fmt(g.h.ak)+' aktive kcal':''}${g.h.tm?' · '+fmt(g.h.tm)+' min Training':''}${g.bonus?` · <b>+${fmt(g.bonus)} kcal</b> extra (mehr bewegt als dein Alltag-Faktor annimmt)`:''}</p>`:''}</div>
 <div class="nbars">${bar('Kalorien',t.kcal,g.kcal,'kcal')}${bar('Protein',t.p,g.p,'g')}${bar('Kohlenhydrate',t.c,g.c,'g')}${bar('Fett',t.f,g.f,'g')}</div></section>`;
 h+=MEALS.map(([m,l])=>{const its=day.items.filter(i=>i.meal===m),mk=its.reduce((a,i)=>a+i.kcal,0);
  return `<section class="meal"><header><h3>${l}</h3><span>${mk?fmt(mk)+' kcal':''}</span></header>${its.map(i=>`<div class="it"><div><b>${esc(i.name)}</b><small>${fmt(i.g)} g · ${fmt(i.p)} g Protein</small></div><span>${fmt(i.kcal)}</span><button data-n="rm" data-id="${i.id}" aria-label="Entfernen">✕</button></div>`).join('')}
  <div class="mfoot"><button data-n="add" data-m="${m}">+ Hinzufügen</button>${its.length?`<button class="ghost" data-n="tpl" data-m="${m}">Als Vorlage speichern</button>`:''}</div></section>`}).join('');
 const ws=Object.keys(S.nut.days).filter(k=>S.nut.days[k].w).sort();
 h+=`<section class="meal"><header><h3>Körpergewicht & Wasser</h3><span>${day.w?fmt(day.w)+' kg':''}</span></header>
 <div class="wrow"><input id="wIn" inputmode="decimal" placeholder="${lastWeight(d)?fmt(lastWeight(d)):'kg'}" value="${day.w?fmt(day.w):''}" aria-label="Gewicht in kg"><button data-n="w">Gewicht speichern</button></div>
 <div class="wrow"><span class="water">${fmt((day.water||0)/1000)} l Wasser</span><button data-n="water" data-v="250">+ 250 ml</button><button data-n="water" data-v="500">+ 500 ml</button><button class="ghost" data-n="water" data-v="-250">−</button></div>
 ${ws.length>1?`<div class="fig" style="min-height:200px"><svg id="wchart" role="img" aria-label="Gewichtsverlauf"></svg></div>`:''}</section>
 <details class="meal nset"><summary><h3>Ziele einstellen</h3><span>${fmt(g.kcal)} kcal · ${g.p} g Protein</span></summary>
 <div class="vars" style="margin:8px 0">${[['aufbau','Aufbau (+300)'],['halten','Halten'],['defi','Definieren (−450)']].map(([k,l])=>`<button data-n="goal" data-v="${k}" aria-pressed="${S.nut.goal===k}">${l}</button>`).join('')}</div>
 <div class="settings" style="margin:8px 0"><div><label for="maint">Erhaltungsbedarf (kcal)</label><input id="maint" inputmode="numeric" data-n="maint" placeholder="${g.maint} (geschätzt)" value="${S.nut.maint||''}"></div><div><label for="gkg">Protein pro kg Körpergewicht</label><input id="gkg" inputmode="decimal" data-n="gkg" value="${fmt(S.nut.gkg)}"></div></div>
 <p class="tip" style="padding:0">${g.bmr?`Aus deinem Profil berechnet (Grundumsatz ${fmt(Math.round(g.bmr))} kcal × Aktivität ${fmt(S.prof.act)}). Eigene Angabe überschreibt das.`:'Profil unter „Mehr“ ausfüllen für eine genaue Berechnung – sonst grob 32 kcal pro kg.'} Fett 27 % der Kalorien, Rest Kohlenhydrate.</p></details>`;
 if(sheet)h+=renderSheet();
 return h}
function afterNut(){const s=$('wchart');if(s){if(ro)ro.disconnect();ro=new ResizeObserver(drawW);ro.observe(s)}const q=$('fq');if(q&&sheet&&sheet.focus){q.focus();q.setSelectionRange(q.value.length,q.value.length);sheet.focus=false}}
function drawW(){const s=$('wchart');if(!s)return;const W=s.clientWidth,Hh=s.clientHeight;if(!W)return;
 const ks=Object.keys(S.nut.days).filter(k=>S.nut.days[k].w).sort().slice(-60),pts=ks.map(k=>({k,v:S.nut.days[k].w})),avg=pts.map((q,i)=>{const a=pts.slice(Math.max(0,i-6),i+1);return a.reduce((x,y)=>x+y.v,0)/a.length});
 const p={l:40,r:14,t:16,b:26},lo=Math.min(...pts.map(q=>q.v))-0.5,hi=Math.max(...pts.map(q=>q.v))+0.5,x=i=>p.l+(pts.length<2?0:i*(W-p.l-p.r)/(pts.length-1)),y=v=>p.t+(hi-v)/(hi-lo)*(Hh-p.t-p.b);
 s.innerHTML=[lo+0.5,hi-0.5].map(v=>`<line x1="${p.l}" x2="${W-p.r}" y1="${y(v)}" y2="${y(v)}" stroke="#e4e2dc"/><text x="${p.l-6}" y="${y(v)+4}" text-anchor="end" font-size="11" fill="#6b6e75">${fmt(r1(v))}</text>`).join('')
 +pts.map((q,i)=>`<circle cx="${x(i)}" cy="${y(q.v)}" r="2.5" fill="#6b6e75"/>`).join('')+`<path d="${avg.map((v,i)=>`${i?'L':'M'}${x(i)},${y(v)}`).join('')}" fill="none" stroke="#ff4b26" stroke-width="3"/>`
 +`<text x="${W-p.r}" y="${Hh-6}" text-anchor="end" font-size="12" fill="#111214">Ø 7 Tage: ${fmt(r1(avg[avg.length-1]))} kg</text>`}
/* --- Hinzufügen-Sheet --- */
function foodRow(f){return `<button class="frow" data-n="pick" data-id="${esc(f.id)}"><div><b>${esc(f.name)}</b><small>${f.brand?esc(f.brand)+' · ':''}${fmt(f.kcal)} kcal · ${fmt(f.p)} g P / 100 g</small></div><span>›</span></button>`}
function renderSheet(){const sh=sheet,ml=MEALS.find(m=>m[0]===sh.meal)[1];let b='';
 if(sh.step==='photo'){b=renderPhotoStep()}
 else if(sh.step==='amount'){const f=sh.food,g=num(sh.g)||0,it=itemFrom(f,g,sh.meal);
  b=`<button class="back" data-n="back">‹ Zurück</button><h2>${esc(f.name)}</h2><p class="tip" style="padding:0">${f.brand?esc(f.brand)+' · ':''}pro 100 g: ${fmt(f.kcal)} kcal · ${fmt(f.p)} P · ${fmt(f.c)} KH · ${fmt(f.f)} F</p>
  <div class="amt"><input id="gIn" inputmode="decimal" value="${esc(sh.g)}" data-n="g" aria-label="Menge in Gramm"><span>g</span></div>
  <div class="vars">${[...(f.por?[[f.por.l,f.por.g]]:[]),['50 g',50],['100 g',100],['150 g',150],['200 g',200]].map(([l,v])=>`<button data-n="gq" data-v="${v}">${esc(l)}</button>`).join('')}</div>
  <div class="calc"><div><b>${fmt(it.kcal)}</b><small>kcal</small></div><div><b>${fmt(it.p)}</b><small>Protein</small></div><div><b>${fmt(it.c)}</b><small>KH</small></div><div><b>${fmt(it.f)}</b><small>Fett</small></div></div>
  <button class="primary" data-n="addit" style="width:100%">Zu ${ml} hinzufügen</button>`}
 else if(sh.step==='custom'){b=`<button class="back" data-n="back">‹ Zurück</button><h2>Eigenes Produkt</h2><p class="tip" style="padding:0">Werte von der Packung, pro 100 g.</p>
  <div class="cform"><div class="full"><label>Name</label><input id="cN" value="${esc(sh.q||'')}"></div>${[['cK','kcal'],['cP','Protein g'],['cC','Kohlenhydrate g'],['cF','Fett g'],['cG','Portion g (optional)']].map(([i,l])=>`<div><label>${l}</label><input id="${i}" inputmode="decimal"></div>`).join('')}</div>
  <button class="primary" data-n="savecustom" style="width:100%">Speichern & weiter</button>`}
 else if(sh.step==='scan'){b=`<button class="back" data-n="back">‹ Zurück</button><h2>Barcode scannen</h2><div id="scanbox"></div><p class="tip" style="padding:8px 0">${esc(sh.msg||'Barcode in den Rahmen halten.')}</p><div class="wrow"><input id="codeIn" inputmode="numeric" placeholder="oder Nummer eintippen"><button data-n="code">Suchen</button></div>`}
 else{const q=(sh.q||'').trim().toLowerCase(),N=S.nut;
  const tpls=N.meals.length&&!q?`<h4>Vorlagen</h4>${N.meals.map(t=>`<button class="frow" data-n="usetpl" data-id="${t.id}"><div><b>${esc(t.name)}</b><small>${t.items.length} Lebensmittel · ${fmt(t.items.reduce((a,i)=>a+i.kcal,0))} kcal</small></div><span>+</span></button>`).join('')}`:'';
  const rec=!q?N.recent.map(id=>allFoods().find(f=>f.id===id)).filter(Boolean):[];
  const hits=q?allFoods().filter(f=>(f.name+' '+(f.brand||'')).toLowerCase().includes(q)).slice(0,25):[];
  b=`<div class="shtop"><h2>${ml}</h2><button class="ghost" data-n="close">Schließen</button></div>
  <div class="srch"><input id="fq" data-n="q" placeholder="Lebensmittel suchen …" value="${esc(sh.q||'')}" autocomplete="off"><button data-n="scan" aria-label="Barcode scannen">▦ Scan</button><label class="filebtn">Foto<input type="file" accept="image/*" capture="environment" data-ai="file" hidden></label></div>
  ${tpls}${rec.length?`<h4>Zuletzt</h4>${rec.slice(0,10).map(foodRow).join('')}`:''}
  ${q?`${hits.length?`<h4>Gefunden</h4>${hits.map(foodRow).join('')}`:''}<h4>Open Food Facts</h4>${sh.busy?'<p class="tip" style="padding:0">Suche …</p>':sh.results?(sh.results.length?sh.results.map(foodRow).join(''):'<p class="tip" style="padding:0">Nichts gefunden.</p>'):`<button data-n="off" style="width:100%">„${esc(sh.q)}“ in Open Food Facts suchen</button>`}`:''}
  <div class="actions"><button class="ghost" data-n="custom">+ Eigenes Produkt anlegen</button></div>`}
 return `<div class="sheet" role="dialog" aria-modal="true"><div class="sheetin">${b}</div></div>`}
function mapOFF(p){const n=p.nutriments||{};const kcal=n['energy-kcal_100g']??(n['energy_100g']?n['energy_100g']/4.184:null);if(kcal==null)return null;
 const sq=parseFloat(p.serving_quantity);return{id:'off'+(p.code||p._id),name:(p.product_name_de||p.product_name||'Unbekannt').trim(),brand:(p.brands||'').split(',')[0].trim(),kcal:Math.round(kcal),p:r1(+n.proteins_100g||0),c:r1(+n.carbohydrates_100g||0),f:r1(+n.fat_100g||0),por:sq>0?{l:'Portion '+fmt(sq)+' g',g:sq}:null,src:'off',code:p.code}}
const OFF_FIELDS='code,product_name,product_name_de,brands,nutriments,serving_quantity';
async function offSearch(q){sheet.busy=true;render();try{const r=await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=25&lc=de&cc=de&fields=${OFF_FIELDS}`);const j=await r.json();sheet.results=(j.products||[]).map(mapOFF).filter(Boolean)}catch(e){sheet.results=[];note('Open Food Facts nicht erreichbar')}if(sheet){sheet.busy=false;render()}}
async function offCode(code){if(!sheet)return;sheet.msg='Suche '+code+' …';render();try{const r=await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json?fields=${OFF_FIELDS}`);const j=await r.json();const f=j.status===1&&mapOFF({...j.product,code});
 if(f){stopScan();sheet.food=f;sheet.g=f.por?String(f.por.g):'100';sheet.step='amount'}else{sheet.msg=`Produkt ${code} nicht gefunden oder ohne Nährwerte – leg es als eigenes Produkt an.`}}catch(e){sheet.msg='Open Food Facts nicht erreichbar.'}render()}
let scanner=null,scanLib=null;
function loadScanLib(){if(scanLib)return scanLib;scanLib=new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';s.onload=()=>res();s.onerror=()=>{scanLib=null;rej()};document.head.appendChild(s)});return scanLib}
async function startScan(){try{await loadScanLib();await new Promise(r=>setTimeout(r,50));if(!$('scanbox'))return;
 scanner=new Html5Qrcode('scanbox',{formatsToSupport:[Html5QrcodeSupportedFormats.EAN_13,Html5QrcodeSupportedFormats.EAN_8,Html5QrcodeSupportedFormats.UPC_A,Html5QrcodeSupportedFormats.UPC_E],verbose:false});
 let done=false;await scanner.start({facingMode:'environment'},{fps:10,qrbox:{width:260,height:140}},code=>{if(done)return;done=true;try{navigator.vibrate&&navigator.vibrate(60)}catch(e){}offCode(code)},()=>{})}catch(e){if(sheet){sheet.msg='Kamera nicht verfügbar – Kamera-Zugriff erlauben oder Nummer eintippen.';render()}}}
function stopScan(){if(scanner){const s=scanner;scanner=null;s.stop().catch(()=>{}).finally(()=>{try{s.clear()}catch(e){}})}}
let offT=null;
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-n]');if(!b||b.tagName==='INPUT')return;const a=b.dataset.n,d=nDate||today();
 if(a==='prev'||a==='next'){const x=new Date(d+'T12:00');x.setDate(x.getDate()+(a==='prev'?-1:1));nDate=iso(x)}
 else if(a==='add'){sheet={meal:b.dataset.m,step:'search',q:'',focus:true}}
 else if(a==='close'){stopScan();sheet=null}
 else if(a==='back'){stopScan();sheet.step='search';sheet.msg=''}
 else if(a==='rm'){const dd=ND(d);dd.items=dd.items.filter(i=>i.id!==b.dataset.id);touch(d)}
 else if(a==='pick'){const f=allFoods().find(x=>x.id===b.dataset.id)||(sheet.results||[]).find(x=>x.id===b.dataset.id);if(!f)return;sheet.food=f;sheet.g=f.por?String(f.por.g):'100';sheet.step='amount'}
 else if(a==='gq'){sheet.g=b.dataset.v}
 else if(a==='addit'){const g=num(sheet.g);if(!g||g<=0){note('Menge eingeben');return}ND(d).items.push(itemFrom(sheet.food,g,sheet.meal));remember(sheet.food);touch(d);sheet=null}
 else if(a==='off'){offSearch(sheet.q.trim());return}
 else if(a==='scan'){sheet.step='scan';sheet.msg='';render();startScan();return}
 else if(a==='code'){const c=($('codeIn').value||'').replace(/\D/g,'');if(c)offCode(c);return}
 else if(a==='custom'){sheet.step='custom'}
 else if(a==='savecustom'){const v=i=>num($(i).value),n=$('cN').value.trim();if(!n||v('cK')==null){note('Name und kcal angeben');return}
  const f={id:'own'+Date.now().toString(36),name:n,kcal:v('cK'),p:v('cP')||0,c:v('cC')||0,f:v('cF')||0,por:v('cG')?{l:'Portion '+fmt(v('cG'))+' g',g:v('cG')}:null,src:'own'};S.nut.foods.unshift(f);S.metaT=Date.now();sheet.food=f;sheet.g=f.por?String(f.por.g):'100';sheet.step='amount';persist()}
 else if(a==='tpl'){const its=ND(d).items.filter(i=>i.meal===b.dataset.m);const name=(MEALS.find(m=>m[0]===b.dataset.m)[1])+' '+new Date().toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'});S.nut.meals.unshift({id:'m'+Date.now().toString(36),name,items:its.map(({id,meal,...r})=>r)});S.metaT=Date.now();persist();note('Vorlage gespeichert')}
 else if(a==='usetpl'){const t=S.nut.meals.find(x=>x.id===b.dataset.id);if(t){for(const r of t.items)ND(d).items.push({...r,id:'i'+Math.random().toString(36).slice(2,9),meal:sheet.meal});touch(d);sheet=null}}
 else if(a==='w'){const w=num($('wIn').value);if(w&&w>30&&w<300){ND(d).w=w;touch(d)}else{note('Gewicht in kg eingeben');return}}
 else if(a==='water'){const dd=ND(d);dd.water=Math.max(0,(dd.water||0)+(+b.dataset.v));touch(d)}
 else if(a==='goal'){S.nut.goal=b.dataset.v;S.metaT=Date.now();persist()}
 else return;
 const op=document.querySelector('details.nset');const wasOpen=op&&op.open;render();if(wasOpen){const n=document.querySelector('details.nset');if(n)n.open=true}});
document.addEventListener('input',ev=>{const t=ev.target,a=t.dataset.n;if(!a)return;
 if(a==='q'){sheet.q=t.value;sheet.results=null;sheet.focus=true;clearTimeout(offT);render();if(t.value.trim().length>2){offT=setTimeout(()=>{if(sheet&&sheet.step==='search'&&sheet.q.trim().length>2&&!allFoods().some(f=>f.name.toLowerCase().includes(sheet.q.trim().toLowerCase())))offSearch(sheet.q.trim())},900)}}
 else if(a==='g'){sheet.g=t.value;const it=itemFrom(sheet.food,num(t.value)||0,sheet.meal),c=document.querySelectorAll('.calc b');if(c.length===4){c[0].textContent=fmt(it.kcal);c[1].textContent=fmt(it.p);c[2].textContent=fmt(it.c);c[3].textContent=fmt(it.f)}}
 else if(a==='maint'){S.nut.maint=Math.round(num(t.value)||0);S.metaT=Date.now();persist()}
 else if(a==='gkg'){const v=num(t.value);if(v&&v>0.5&&v<4){S.nut.gkg=v;S.metaT=Date.now();persist()}}});

