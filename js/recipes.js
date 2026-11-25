/* Duo – Rezept-Empfehlung nach dem Training (Rezepte von Chefkoch, live über Home Assistant).
   HA: rest_command.sport_cockpit_rezepte (Suche, {q,limit}) und rest_command.sport_cockpit_rezept (Einzelrezept, {id}).
   Ablauf: wer heute trainiert hat, sieht statt „Als Nächstes: Push“ eine Karte „Training erledigt – jetzt zählt das Essen“
   mit einem gut bewerteten, eiweißreichen Rezept, das zu den eigenen Lebensmitteln und dem Rest-Budget passt.
   Zubereitung in der App (mit Quelle) + Link zum Original mit Fotos. Ergebnis pro Tag zwischengespeichert. */
'use strict';
const REC_WORDS=['Hähnchen','Pute','Lachs','Thunfisch','Rind','Hack','Garnelen','Quark','Skyr','Hüttenkäse','Ei','Linsen','Kichererbsen','Tofu','Feta','Bohnen'];
const REC_DEF={f:['Skyr','Quark','Ei'],m:['Hähnchen','Linsen','Thunfisch'],a:['Hähnchen','Lachs','Hack'],s:['Quark','Skyr','Hüttenkäse']};
let REC=null,recBusy=false,recOpen=null,recIdx=0;
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
 try{const fav=recFav(),qs=[...new Set([...fav.slice(0,2),...REC_DEF[meal]])].slice(0,3),seen=new Set(),cand=[];
  for(const q of qs){let res;try{res=await recCall('sport_cockpit_rezepte',{q,limit:12})}catch(e){continue}
   for(const x of (res.results||[])){const r=x.recipe||x;if(!r||!r.id||seen.has(r.id))continue;seen.add(r.id);cand.push({id:r.id,q,score:recNum((r.rating||{}).rating)*Math.log10(10+recNum((r.rating||{}).numVotes))})}}
  cand.sort((a,b)=>b.score-a.score);
  const sc=dayScore(d),left=Math.max(0,sc.g.kcal-sc.t.kcal),list=[];
  for(const c of cand.slice(0,8)){let r;try{r=recCompact(await recCall('sport_cockpit_rezept',{id:c.id}))}catch(e){continue}
   if(!r.p||!r.kcal)continue;if(r.p<18)continue;if(left>300&&r.kcal>left+150)continue;r.q=c.q;r.fav=fav.includes(c.q);list.push(r)}
  list.sort((a,b)=>(b.p/b.kcal*1000+b.r*3+(b.fav?8:0))-(a.p/a.kcal*1000+a.r*3+(a.fav?8:0)));
  REC={d,meal,list:list.slice(0,5),err:list.length?'':'nichts'};recIdx=0}
 catch(e){REC={d,meal,list:[],err:String(e.message||e)}}
 recBusy=false;try{localStorage.setItem('sc.rec',JSON.stringify(REC))}catch(e){}if(view==='home'&&!sheet)render()}
function recWhy(r){const sc=dayScore(today()),need=Math.max(0,Math.round(sc.g.p-sc.t.p)),left=Math.max(0,Math.round(sc.g.kcal-sc.t.kcal)),b=[];
 if(r.fav)b.push(`du isst gern ${r.q}`);b.push(`${r.p} g Eiweiß${need?` – dir fehlen noch ${need} g`:''}`);if(left)b.push(`passt in deine ${fmt(left)} kcal`);return 'Passt: '+b.join(' · ')+'.'}
/* Karte auf der Startseite (ersetzt „Als Nächstes“, wenn heute trainiert wurde) */
function recHomeHtml(){const last=S.sessions.filter(s=>iso(s.date)===today()&&s.ex.length).pop(),meal=recMeal(),sc=dayScore(today()),need=Math.max(0,Math.round(sc.g.p-sc.t.p));
 const done=`<div class="rdone"><i aria-hidden="true">✓</i><div><b>${esc(DAYS[last.day]?DAYS[last.day].n:'Training')} erledigt</b><span>Heute kein Training mehr – jetzt zählt das Essen.${need?` Noch ${need} g Eiweiß.`:''}</span></div></div>`;
 if(!HA.url||!HA.token)return done;
 if(!REC||REC.d!==today()||REC.meal!==meal){setTimeout(()=>recLoad(),0);return done+`<section class="rcard rload"><p>Duo sucht ein passendes Rezept bei Chefkoch …</p></section>`}
 if(recBusy)return done+`<section class="rcard rload"><p>Duo sucht ein passendes Rezept bei Chefkoch …</p></section>`;
 const r=(REC.list||[])[recIdx%Math.max(1,(REC.list||[]).length)];
 if(!r)return done+`<section class="rcard rload"><p>${REC.err&&REC.err!=='nichts'?'Rezepte gerade nicht erreichbar.':'Kein passendes Rezept gefunden.'}</p><button data-rec="reload">Nochmal suchen</button></section>`;
 return done+`<section class="rcard">${r.img?`<img src="${esc(r.img)}" alt="" loading="lazy" referrerpolicy="no-referrer">`:''}<div class="rbd"><small>Dein ${recMealN[meal]} · Rezept von Chefkoch</small><h3>${esc(r.t)}</h3>
  <p class="rmac"><b>${r.p} g</b> Eiweiß · <b>${fmt(r.kcal)}</b> kcal${r.min?` · <b>${r.min}</b> min`:''} <span>pro Portion</span></p>
  ${r.r?`<p class="rrat">★ ${fmt(Math.round(r.r*10)/10)} · ${fmt(r.v)} Bewertungen</p>`:''}<p class="rwhy">${esc(recWhy(r))}</p>
  <div class="rbtn"><button class="primary" data-rec="open">So geht's</button><button data-rec="add">Eintragen</button>${(REC.list||[]).length>1?'<button class="ghost" data-rec="next">Anderes ›</button>':''}</div></div></section>`}
/* Zubereitung: Zutaten + Schritte, Quelle und Link zum Original */
const recEl=(()=>{const d=document.createElement('div');d.id='recv';d.className='recv';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-label','Rezept');document.body.appendChild(d);return d})();
function recRender(){const r=recOpen;if(!r){recEl.classList.remove('on');recEl.innerHTML='';return}recEl.classList.add('on');
 recEl.innerHTML=`<header class="gh"><button class="gx" data-rec="close" aria-label="Schließen">✕</button><div><b>Rezept</b><span>von Chefkoch</span></div></header>
 <section class="recb">${r.img?`<img src="${esc(r.img)}" alt="" referrerpolicy="no-referrer">`:''}<h2>${esc(r.t)}</h2>
 <p class="rmac"><b>${r.p} g</b> Eiweiß · <b>${fmt(r.kcal)}</b> kcal · ${r.c} g KH · ${r.f} g Fett <span>pro Portion</span></p>
 <h3>Zutaten <small>für ${fmt(r.serv)} Portion${r.serv===1?'':'en'}</small></h3><ul class="ring">${r.ing.map(i=>`<li><b>${i.a?fmt(i.a)+' ':''}${esc(i.u)}</b> ${esc(i.n)}</li>`).join('')}</ul>
 <h3>Zubereitung${r.min?` <small>ca. ${r.min} min</small>`:''}</h3><ol class="rsteps">${r.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>
 <p class="rsrc">Rezept und Fotos: <a href="${esc(r.url)}" target="_blank" rel="noopener">Chefkoch.de – Original öffnen ›</a></p></section>
 <footer class="gf"><button class="primary" data-rec="add">1 Portion eintragen</button></footer>`}
function recAdd(r){const d=today(),meal=recMeal(),it={id:'i'+Date.now().toString(36),name:r.t+' (Chefkoch)',g:r.g||0,meal,kcal:r.kcal,p:r.p,c:r.c,f:r.f,z:0,rid:r.id},wb=cheerFrom(d);
 ND(d).items.push(it);touch(d);recOpen=null;recRender();render();note(`Eingetragen: 1 Portion zum ${recMealN[meal]}`);cheerDiff(d,wb)}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-rec]');if(!b)return;const a=b.dataset.rec,r=REC&&(REC.list||[])[recIdx%Math.max(1,(REC.list||[]).length)];
 if(a==='open'&&r){recOpen=r;recRender()}else if(a==='close'){recOpen=null;recRender()}
 else if(a==='add'){const x=recOpen||r;if(x)recAdd(x)}else if(a==='next'){recIdx++;render()}else if(a==='reload'){recLoad(true)}});
