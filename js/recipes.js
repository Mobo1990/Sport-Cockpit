/* Duo – Rezept-Empfehlung nach dem Training (Rezepte von Chefkoch, live über Home Assistant).
   HA: rest_command.sport_cockpit_rezepte (Suche, {q,limit}) und rest_command.sport_cockpit_rezept (Einzelrezept, {id}).
   Ablauf: wer heute trainiert hat, sieht statt „Als Nächstes: Push“ eine Karte „Training erledigt – jetzt zählt das Essen“
   mit einem gut bewerteten, eiweißreichen Rezept, das zu den eigenen Lebensmitteln und dem Rest-Budget passt.
   Zubereitung in der App (mit Quelle) + Link zum Original mit Fotos. Ergebnis pro Tag zwischengespeichert. */
'use strict';
const REC_WORDS=['Hähnchen','Pute','Lachs','Thunfisch','Rind','Hack','Garnelen','Quark','Skyr','Hüttenkäse','Ei','Linsen','Kichererbsen','Tofu','Feta','Bohnen'];
const REC_DEF={f:['Skyr','Quark','Ei'],m:['Hähnchen','Linsen','Thunfisch'],a:['Hähnchen','Lachs','Hack'],s:['Quark','Skyr','Hüttenkäse']},REC_VEG={f:['Skyr','Quark','Ei'],m:['Linsen','Kichererbsen','Feta'],a:['Linsen','Tofu','Ei'],s:['Quark','Skyr','Hüttenkäse']};
let REC=null,recBusy=false,recOpen=null,recIdx=0,recPor=1,recServ=0,recHide='',recLock=null;
const recPref=()=>{try{return JSON.parse(localStorage.getItem('sc.recpref'))||{}}catch(e){return{}}};/* {veg:1, no:[ids], seen:{id:datum}} */
const recSavePref=p=>{try{localStorage.setItem('sc.recpref',JSON.stringify(p))}catch(e){}};
const REC_MEAT=/hähnchen|huhn|pute|rind|schwein|hack|speck|schinken|wurst|lachs|thunfisch|fisch|garnelen|lamm|salami|kassler|bacon/i;
try{REC=JSON.parse(localStorage.getItem('sc.rec'))||null}catch(e){}
const recMeal=()=>{const h=new Date().getHours();return h<11?'f':h<15?'m':h<21?'a':'s'};
const recMealN={f:'Frühstück',m:'Mittagessen',a:'Abendessen',s:'Snack'};
function trainedToday(){return S.sessions.some(s=>iso(s.date)===today()&&s.ex&&s.ex.length)}
/* Was isst die Person gern? Eiweißreiche Begriffe aus den letzten 30 Tagen zählen */
function recFav(){const c={},t0=Date.now();for(let i=0;i<30;i++){const d=iso(t0-i*864e5);for(const it of ((S.nut.days[d]||{}).items||[]))for(const w of REC_WORDS)if(new RegExp('(^|[^a-zäöü])'+w.toLowerCase(),'i').test(' '+it.name.toLowerCase()))c[w]=(c[w]||0)+1}
 return Object.entries(c).sort((a,b)=>b[1]-a[1]).map(x=>x[0])}
async function recCall(service,data){const r=await haCall([{type:'call_service',domain:'rest_command',service,service_data:data,return_response:true}]);const m=r[0]||{};
 if(!m.success)throw new Error((m.error&&m.error.message)||'HA');const res=(m.result||{}).response||{};if(res.status&&res.status>=400)throw new Error('Chefkoch '+res.status);
 let c=res.content;if(typeof c==='string'){try{c=JSON.parse(c)}catch(e){}}return c||{}}
const recNum=v=>{const n=parseFloat(String(v==null?'':v).replace(',','.'));return isFinite(n)?n:0};
/* Chefkoch-Einzelrezept in unsere kompakte Form bringen */
function recCompact(r){const n=r.nutrition||{},serv=recNum(r.servings)||1,ing=[];let gsum=0;
 for(const g of r.ingredientGroups||[])for(const i of g.ingredients||[]){const a=recNum(i.amount),u=String(i.unit||'');ing.push({n:String(i.name||'')+(i.usageInfo?' '+i.usageInfo:''),a,u});if(/^(g|ml)$/i.test(u))gsum+=a;else if(/^kg|^l$/i.test(u))gsum+=a*1000}
 const steps=String(r.instructions||'').split(/\n\s*\n|\r\n\r\n/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean);
 const img=r.previewImageUrlTemplate?String(r.previewImageUrlTemplate).replace('<format>','crop-480x320'):'';
 return{id:String(r.id),t:String(r.title||'Rezept'),url:r.siteUrl||('https://www.chefkoch.de/rezepte/'+r.id),img,r:recNum((r.rating||{}).rating),v:recNum((r.rating||{}).numVotes),
  min:recNum(r.totalTime||r.preparationTime)||0,serv,kcal:Math.round(recNum(n.kCalories||r.kCalories)),p:Math.round(recNum(n.proteinContent)),c:Math.round(recNum(n.carbohydrateContent)),f:Math.round(recNum(n.fatContent)),
  g:gsum?Math.round(gsum/serv):0,ing,steps}}
/* Suchen, Details holen, passend filtern und sortieren */
async function recLoad(force){if(recBusy||!HA.url||!HA.token)return;const d=today(),meal=recMeal();if(!force&&REC&&REC.d===d&&REC.meal===meal&&(REC.list||[]).length)return;
 recBusy=true;if(view==='home')render();
 try{const pf=recPref(),veg=!!pf.veg,fav=recFav().filter(w=>!veg||!REC_MEAT.test(w)),qs=[...new Set([...fav.slice(0,2),...(veg?REC_VEG:REC_DEF)[meal]])].slice(0,3),seen=new Set(),cand=[],no=new Set(pf.no||[]),recent=pf.seen||{},wkAgo=iso(Date.now()-7*864e5);
  for(const q of qs){let res;try{res=await recCall('sport_cockpit_rezepte',{q,limit:12})}catch(e){continue}
   for(const x of (res.results||[])){const r=x.recipe||x;if(!r||!r.id||seen.has(r.id)||no.has(String(r.id))||(recent[r.id]&&recent[r.id]>wkAgo&&recent[r.id]<today()))continue;seen.add(r.id);cand.push({id:r.id,q,score:recNum((r.rating||{}).rating)*Math.log10(10+recNum((r.rating||{}).numVotes))})}}
  cand.sort((a,b)=>b.score-a.score);
  const sc=dayScore(d),left=Math.max(0,sc.g.kcal-sc.t.kcal),list=[];
  for(const c of cand.slice(0,8)){let r;try{r=recCompact(await recCall('sport_cockpit_rezept',{id:c.id}))}catch(e){continue}
   if(!r.p||!r.kcal)continue;if(r.p<18)continue;if(r.min>30||r.ing.length>12)continue;/* schnell und einfach */if(veg&&r.ing.some(i=>REC_MEAT.test(i.n))||veg&&REC_MEAT.test(r.t))continue;if(left>300&&r.kcal>left+150)continue;r.q=c.q;r.fav=fav.includes(c.q);list.push(r)}
  list.sort((a,b)=>(b.p/b.kcal*1000+b.r*3+(b.fav?8:0))-(a.p/a.kcal*1000+a.r*3+(a.fav?8:0)));
  REC={d,meal,list:list.slice(0,5),err:list.length?'':'nichts'};recIdx=0}
 catch(e){REC={d,meal,list:[],err:String(e.message||e)}}
 recBusy=false;try{localStorage.setItem('sc.rec',JSON.stringify(REC))}catch(e){}if(view==='home'&&!sheet)render()}
function recWhy(r){const sc=dayScore(today()),need=Math.max(0,Math.round(sc.g.p-sc.t.p)),left=Math.max(0,Math.round(sc.g.kcal-sc.t.kcal)),b=[];
 if(r.fav)b.push(`du isst gern ${r.q}`);b.push(`${r.p} g Eiweiß${need?` – dir fehlen noch ${need} g`:''}`);if(left)b.push(`passt in deine ${fmt(left)} kcal`);return 'Passt: '+b.join(' · ')+'.'}
/* Karte auf der Startseite (ersetzt „Als Nächstes“, wenn heute trainiert wurde) */
function recSeen(r){const p=recPref();p.seen=p.seen||{};if(!p.seen[r.id]){p.seen[r.id]=today();recSavePref(p)}}
const REC_HOT=/chili|cayenne|scharf|sambal|harissa|wasabi|jalape|tabasco|wein|rum\b|likör/i;
const recMild=r=>!r.ing.some(i=>REC_HOT.test(i.n))&&!REC_HOT.test(r.t);
let recJust=null;/* gerade über die Karte eingetragen: {id,t,d} für „Rückgängig“ */
function recLeft(){const sc=dayScore(today());return{need:Math.max(0,Math.round(sc.g.p-sc.t.p)),left:sc.g.kcal?Math.max(0,Math.round(sc.g.kcal-sc.t.kcal)):null}}
function recHomeHtml(){const last=S.sessions.filter(s=>iso(s.date)===today()&&s.ex.length).pop(),meal=recMeal(),{need,left}=recLeft();
 const done=`<div class="rdone"><i aria-hidden="true">✓</i><div><b>${esc(last&&last.ex[0]&&last.ex[0].home?last.ex[0].name:DAYS[last.day]?DAYS[last.day].n:'Training')} erledigt</b><span>Jetzt zählt das Essen.${need?` Noch ${need} g Eiweiß.`:''}</span></div></div>`;
 if(recJust&&recJust.d===today()&&ND(today()).items.some(i=>i.id===recJust.id))return `<section class="rcard rok"><div class="rbd"><small>Eingetragen · ${recMealN[meal]}</small><h3>${esc(recJust.t)}</h3>
  <p>${recJust.txt}</p><p class="rfit ok">${left==null?'':left?`Jetzt noch frei: ${fmt(left)} kcal · `:'Kalorien für heute erreicht · '}${need?`es fehlen noch ${need} g Eiweiß`:'Eiweiß-Ziel erreicht'}</p>
  <div class="rbtn"><button data-rec="undo">Rückgängig</button><button class="ghost" data-rec="view">Rezept ansehen</button></div></div></section>`;
 if(!HA.url||!HA.token||recHide===today())return done;
 if(!REC||REC.d!==today()||REC.meal!==meal){setTimeout(()=>recLoad(),0);return done+`<section class="rcard rload"><p>Duo sucht ein passendes Rezept bei Chefkoch …</p></section>`}
 if(recBusy)return done+`<section class="rcard rload"><p>Duo sucht ein passendes Rezept bei Chefkoch …</p></section>`;
 const L=REC.list||[],r=L[recIdx%Math.max(1,L.length)];
 if(!r)return done+`<section class="rcard rload"><p>${REC.err&&REC.err!=='nichts'?'Rezepte gerade nicht erreichbar.':'Gerade kein passendes schnelles Rezept gefunden.'}</p><button data-rec="reload">Nochmal suchen</button></section>`;
 recSeen(r);const ok=!left||r.kcal<=left,np=Math.max(0,need-r.p);
 return done+`<section class="rcard">${r.img?`<img src="${esc(r.img)}" alt="" loading="lazy" referrerpolicy="no-referrer">`:''}<div class="rbd"><small>Dein ${recMealN[meal]} · Chefkoch</small><h3>${esc(r.t)}</h3>
  <div class="rkpi"><span><b>${r.p} g</b>Eiweiß</span><span><b>${fmt(r.kcal)}</b>kcal</span><span><b>${r.min||'–'}</b>Minuten</span></div>
  <p class="rfit${ok?' ok':''}">${ok?'Passt zu deinem Ziel':`Etwas über deinem Rest (${fmt(left)} kcal) – ein halber Teller passt`}${need?` · danach fehlen noch ${np?np+' g Eiweiß':'0 g – Eiweiß-Ziel erreicht'}`:''}</p>
  <p class="rmeta">pro Teller · ${r.ing.length} Zutaten${recMild(r)?' · mild, auch für Kinder':''}${r.r?` · ★ ${fmt(Math.round(r.r*10)/10)} (${fmt(r.v)})`:''}</p>
  <div class="rbtn"><button class="primary" data-rec="open">So geht's</button><button data-rec="quick">1 Teller eintragen</button></div>
  <div class="rlinks">${L.length>1?'<button class="glink" data-rec="next">Anderes Rezept</button>':''}<button class="glink" data-rec="no">Nicht mein Fall</button><button class="glink" data-rec="hide">Heute nicht</button></div></div></section>`}
/* Zubereitung in der App: Portionen umrechnen, Zutaten abhaken, große Schritte, Bildschirm bleibt an. Eintragen mit Menge + Vorschau. */
const recEl=(()=>{const d=document.createElement('div');d.id='recv';d.className='recv';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-label','Rezept');document.body.appendChild(d);return d})();
const recAmt=(a,f)=>{const v=a*f;return v>=10?Math.round(v):Math.round(v*4)/4};
function recRender(){const r=recOpen;if(!r){recEl.classList.remove('on');recEl.innerHTML='';try{recLock&&recLock.release()}catch(e){}recLock=null;return}recEl.classList.add('on');
 if(!recLock){try{navigator.wakeLock&&navigator.wakeLock.request('screen').then(l=>recLock=l).catch(()=>{})}catch(e){}}
 const sv=recServ||1,f=sv/r.serv,pn=typeof sharePartner==='function'?sharePartner():null,P=recPor,veg=!!recPref().veg;
 recEl.innerHTML=`<header class="gh"><button class="gx" data-rec="close" aria-label="Schließen">✕</button><div><b>${esc(r.t)}</b><span>Chefkoch · ${r.min?'ca. '+r.min+' min · ':''}Bildschirm bleibt an</span></div></header>
 <section class="recb">${r.img?`<img src="${esc(r.img)}" alt="" referrerpolicy="no-referrer">`:''}
 <div class="rkpi r4"><span><b>${r.p} g</b>Eiweiß</span><span><b>${fmt(r.kcal)}</b>kcal</span><span><b>${r.c} g</b>Kohlenh.</span><span><b>${r.f} g</b>Fett</span></div>
 <p class="rnote">pro Teller, Nährwerte laut Chefkoch${recMild(r)?' · mild, auch für Kinder':''}</p>
 <h3>Ich koche für</h3><div class="rserv rpor">${[1,2,3,4].map(n=>`<button data-rec="serv" data-v="${n}" aria-pressed="${sv===n}">${n}</button>`).join('')}<em>${sv===1?'Person':'Personen'}</em></div>
 ${sv>1&&pn?`<p class="rnote">Isst ${esc(pn)} mit? Unten „Auch bei ${esc(pn)} eintragen“ ist schon angehakt.</p>`:''}
 <h3>Zutaten <span>für ${sv} ${sv===1?'Person':'Personen'}</span></h3>
 <ul class="ring">${r.ing.map((i,k)=>`<li><label><input type="checkbox" data-rec="tick" data-i="${k}"><span><b>${i.a?fmt(recAmt(i.a,f))+' ':''}${esc(i.u)}</b> ${esc(i.n)}</span></label></li>`).join('')}</ul>
 <h3>So geht's</h3><ol class="rsteps">${r.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>
 <p class="rnote">Chefkoch nennt keine Zeiten pro Schritt – insgesamt ${r.min?'ca. '+r.min+' Minuten':'schnell gemacht'}.</p>
 <p class="rsrc">Rezept von Chefkoch.de · <a href="${esc(r.url)}" target="_blank" rel="noopener">Original mit Fotos ansehen&nbsp;↗</a><br><span>öffnet Chefkoch im Browser</span></p>
 <button class="glink rveg" data-rec="veg" aria-pressed="${veg}">${veg?'Vegetarische Vorschläge: an ✓':'Lieber vegetarische Vorschläge'}</button></section>
 <footer class="gf rfoot"><div class="rpor"><em>Du isst</em>${[[.5,'½'],[1,'1'],[1.5,'1½'],[2,'2']].map(([v,l])=>`<button data-rec="por" data-v="${v}" aria-pressed="${P===v}">${l}</button>`).join('')}<em>${P===1?'Teller':'Teller'}</em></div>
 <p class="rprev">= <b>${fmt(Math.round(r.kcal*P))} kcal · ${Math.round(r.p*P)} g Eiweiß</b> <span>(1 Teller = 1 Person)</span></p>
 ${pn?`<label class="rshare"><input type="checkbox" id="recPa"${recPa?' checked':''}> Auch bei ${esc(pn)} eintragen – ${esc(pn)} bestätigt es bei sich</label>`:''}
 <button class="primary" data-rec="add">Eintragen</button></footer>`}
let recPa=false;
function recAdd(r,P,pa){const d=today(),meal=recMeal(),g=Math.round((r.g||400)*P),it={id:'i'+Date.now().toString(36),name:r.t+' (Chefkoch)',g,meal,kcal:Math.round(r.kcal*P),p:Math.round(r.p*P),c:Math.round(r.c*P),f:Math.round(r.f*P),z:0,rid:r.id},wb=cheerFrom(d);
 ND(d).items.push(it);touch(d);recOpen=null;recPor=1;recServ=0;recPa=false;
 recJust={id:it.id,t:r.t,d,txt:`${P===1?'1 Teller':fmt(P)+' Teller'} · ${fmt(it.kcal)} kcal · ${it.p} g Eiweiß${pa?' – auch an '+esc(sharePartner())+' geschickt':''}`};
 recRender();render();if(pa&&typeof shareSend==='function')shareSend([{...it,pg:g}],meal,d);
 note(`Eingetragen: ${P===1?'1 Teller':fmt(P)+' Teller'} · ${fmt(it.kcal)} kcal · ${it.p} g Eiweiß`);cheerDiff(d,wb)}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-rec]');if(!b)return;const a=b.dataset.rec,L=(REC&&REC.list)||[],r=L[recIdx%Math.max(1,L.length)];
 if(a==='tick')return;
 if(a==='open'&&r){recOpen=r;recPor=1;recServ=0;recPa=false;recRender()}
 else if(a==='view'){const x=recJust&&((REC&&REC.list)||[]).find(y=>String(y.id)===String((ND(today()).items.find(i=>i.id===recJust.id)||{}).rid));recJust=null;if(x){recOpen=x;recPor=1;recServ=0;recRender()}render()}
 else if(a==='quick'&&r){recAdd(r,1,false)}
 else if(a==='undo'&&recJust){const d=recJust.d;ND(d).items=ND(d).items.filter(i=>i.id!==recJust.id);touch(d);recJust=null;render();note('Wieder entfernt')}
 else if(a==='close'){recOpen=null;recRender()}
 else if(a==='serv'){recServ=+b.dataset.v;if(recServ>1)recPa=true;else recPa=false;recRender()}else if(a==='por'){recPa=!!($('recPa')&&$('recPa').checked);recPor=+b.dataset.v;recRender()}
 else if(a==='add'){if(recOpen)recAdd(recOpen,recPor,!!($('recPa')&&$('recPa').checked))}
 else if(a==='next'){recIdx++;render()}else if(a==='reload'){recLoad(true)}
 else if(a==='hide'){recHide=today();render()}
 else if(a==='no'&&r){const p=recPref();p.no=[...(p.no||[]),r.id];recSavePref(p);REC.list=L.filter(x=>x.id!==r.id);recIdx=0;if(!REC.list.length)recLoad(true);else render();note('Kommt nicht wieder')}
 else if(a==='veg'){const p=recPref();p.veg=p.veg?0:1;recSavePref(p);recOpen=null;recRender();recLoad(true);note(p.veg?'Ab jetzt vegetarische Vorschläge':'Wieder alle Vorschläge')}});
