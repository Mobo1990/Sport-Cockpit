/* Sport Cockpit – Smarte Ernährung: Mahlzeit nach Uhrzeit, Favoriten, „Für dich jetzt“, Snack-Ideen */
'use strict';
/* Mahlzeit nach Uhrzeit */
function mealAt(h){return h<10.5?'f':h<14.5?'m':h<17.5?'s':h<21.5?'a':'s'}
function mealNow(){const n=new Date();return mealAt(n.getHours()+n.getMinutes()/60)}
const mealName=m=>MEALS.find(x=>x[0]===m)[1];
/* Verlauf aller Einträge mit Uhrzeit-Slot */
function eatLog(){const m=fm();if(!m.log){const out=[];for(const d in S.nut.days)for(const it of S.nut.days[d].items||[])out.push({d,...it});m.log=out}return m.log}
const favs=()=>S.nut.fav||(S.nut.fav=[]);
const isFav=id=>favs().includes(id);
function foodOf(it){return foodById(it.fid)||foodByName(it.name)||null}
/* übliche Menge eines Lebensmittels (häufigste Grammzahl) */
function usual(f){const m=fm();if(m.usual.has(f.id))return m.usual.get(f.id);const r=usual0(f);m.usual.set(f.id,r);return r}
function usual0(f){const c={};for(const it of eatLog())if(it.fid===f.id||it.name===f.name)c[it.g]=(c[it.g]||0)+1;let best=null,n=0;for(const g in c)if(c[g]>n){n=c[g];best=+g}return best}
/* „Für dich jetzt“: was du in dieser Mahlzeit am häufigsten isst (letzte 60 Tage, neuere zählen mehr) */
function forYou(meal){const now=Date.now(),sc={};for(const it of eatLog()){const age=(now-Date.parse(it.d))/864e5;if(age>60)continue;const k=it.fid||it.name;sc[k]=(sc[k]||0)+(it.meal===meal?3:0.5)*(1-age/90)}
 return Object.entries(sc).sort((a,b)=>b[1]-a[1]).map(([k])=>foodById(k)||foodByName(k)).filter(Boolean).slice(0,6)}
function foodRow2(f,hint){const u=usual(f);return `<div class="frow2"><button class="frow" data-n="pick" data-id="${esc(f.id)}"><div><b>${esc(f.name)}</b><small>${hint?esc(hint)+' · ':''}${u?'meist '+fmt(u)+' g · ':''}${fmt(f.kcal)} kcal · ${f.np?'Eiweiß beim Antippen':fmt(f.p)+' g P'} / 100 g</small></div><span>›</span></button><button class="star" data-fav="${esc(f.id)}" aria-pressed="${isFav(f.id)}" aria-label="Favorit">★</button></div>`}
function smartLists(meal){const N=S.nut,fy=forYou(meal),fv=favs().map(id=>foodById(id)).filter(Boolean),seen=new Set([...fy,...fv].map(f=>f.id));
 const rec=N.recent.map(id=>foodById(id)).filter(f=>f&&!seen.has(f.id)).slice(0,6);
 return `${fy.length?`<h4>Für dich zum ${mealName(meal)}</h4>${fy.map(f=>foodRow2(f)).join('')}`:''}${fv.length?`<h4>★ Favoriten</h4>${fv.map(f=>foodRow2(f)).join('')}`:''}${rec.length?`<h4>Zuletzt</h4>${rec.map(f=>foodRow2(f)).join('')}`:''}
 ${!fy.length&&!fv.length&&!rec.length?'<p class="tip" style="padding:6px 0 0">Tipp: Markiere Lieblingsprodukte mit ★ – und die App lernt, was du wann isst.</p>':''}`}
function mealChips(cur){return `<div class="vars mchips">${MEALS.map(([m,l])=>`<button data-n="setmeal" data-m="${m}" aria-pressed="${m===cur}">${l}</button>`).join('')}</div>`}
/* Snack-Ideen passend zu dem, was heute noch fehlt / frei ist */
const SNACKS=[['Skyr natur',250],['Magerquark',250],['Hüttenkäse',200],['Griechischer Joghurt 10 %',150],['Proteinriegel',55],['Proteinshake fertig',330],['Whey Protein Pulver',30],['Putenaufschnitt',60],['Ei (M)',116],['Banane',120],['Apfel',170],['Heidelbeeren',125],['Mandeln',25],['Reiswaffeln',24],['Erdnussbutter',15],['Dunkle Schokolade 70 %',20]];
function snackIdeas(n=3){const d=today(),g=goals(d),t=totals(d),kL=g.kcal-t.kcal,pL=g.p-t.p,zL=g.z-t.z;if(kL<80)return{list:[],why:'Dein Kalorienbudget für heute ist ausgeschöpft.'};
 const cands=new Map();for(const [name,gr] of SNACKS){const f=FOODS.find(x=>x.name===name);if(f)cands.set(f.id,{f,g:usual(f)||gr})}
 for(const id of favs()){const f=foodById(id);if(f&&!cands.has(id))cands.set(id,{f,g:usual(f)||(f.por&&f.por.g)||100})}
 const eatenToday=new Set(((S.nut.days[d]||{}).items||[]).map(i=>i.fid));
 const sc=[...cands.values()].map(c=>{const it=itemFrom(c.f,c.g,'s');let s=0;if(it.kcal>Math.max(150,kL*0.6))return null;
  s+=pL>20?(it.p/Math.max(it.kcal,1))*100:2;if(zL<10)s-=it.z*0.5;if(isFav(c.f.id))s+=3;if(eatenToday.has(c.f.id))s-=4;if(usual(c.f))s+=1.5;return{...c,it,s}}).filter(Boolean).sort((a,b)=>b.s-a.s).slice(0,n);
 const why=pL>20?`Dir fehlen noch ${fmt(Math.round(pL))} g Protein – bei ${fmt(Math.round(kL))} kcal frei.`:`Noch ${fmt(Math.round(kL))} kcal frei.`;return{list:sc,why}}
function snackHtml(){const s=snackIdeas();if(!s.list.length)return '';
 return `<h3 class="sh">Snack-Ideen</h3><p class="tip" style="padding:0 0 8px">${esc(s.why)}</p><div class="snacks">${s.list.map(x=>`<button class="snk" data-snk="${esc(x.f.id)}" data-g="${x.g}"><b>${esc(x.f.name)}</b><span>${fmt(x.g)} g · ${fmt(x.it.kcal)} kcal · ${fmt(x.it.p)} g Protein</span><em>+ eintragen</em></button>`).join('')}</div>`}
/* Klicks */
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-fav],[data-snk],[data-eatnow]');if(!b)return;
 if(b.dataset.fav){const id=b.dataset.fav,F=favs(),i=F.indexOf(id);if(i<0)F.unshift(id);else F.splice(i,1);
  const f=foodById(id)||(sheet&&sheet.results||[]).find(x=>x.id===id);if(f&&(f.src==='off'||f.src==='ai')&&!S.nut.foods.some(x=>x.id===id))S.nut.foods.unshift(f);S.metaT=Date.now();persist();
  b.setAttribute('aria-pressed',String(i<0));document.querySelectorAll(`[data-fav="${CSS.escape(id)}"]`).forEach(x=>x.setAttribute('aria-pressed',String(i<0)));return}
 if(b.dataset.snk){const f=foodById(b.dataset.snk);if(!f)return;const d=today();ND(d).items.push(itemFrom(f,+b.dataset.g,mealNow()));remember(f);touch(d);toast(`${f.name} eingetragen`,`${fmt(+b.dataset.g)} g als ${mealName(mealNow())}`);render();return}
 if(b.dataset.eatnow){view='nut';nDate=today();sheet={meal:mealNow(),step:'search',q:'',focus:true};render()}});
