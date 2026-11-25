/* Duo – Koch-Modus „Schale für mehrere“ (Wunsch: Pauline macht Joghurt für beide in eine Schale).
   Ablauf: Gesamtmengen in die Schale (normale Suche/Scan/eigene Produkte) → „Ich esse 50 %“ → eine Zeile im Tagebuch
   (Name + Zutaten), der Rest geht als Vorschlag an den Partner (todo-Liste, er bestätigt selbst).
   Schalen werden gemerkt (S.nut.bowls, mit Sync) und lassen sich mit einem Tipp wieder füllen. */
'use strict';
const BOWL_PCT=[30,40,50,60,70];
const bowlSum=b=>b.items.reduce((a,x)=>{const k=x.g/100;a.g+=x.g;a.kcal+=x.f.kcal*k;a.p+=x.f.p*k;a.c+=x.f.c*k;a.f+=x.f.f*k;a.z+=(x.f.z||0)*k;return a},{g:0,kcal:0,p:0,c:0,f:0,z:0});
const bowlFood=f=>({id:f.id,name:f.name,kcal:f.kcal,p:f.p,c:f.c,f:f.f,z:f.z||0});
function bowlStart(meal){const pn=typeof sharePartner==='function'?sharePartner():null;sheet={meal,step:'bowl',bowl:{n:'',items:[],pct:pn?50:100,pa:!!pn,keep:true}}}
/* Übersicht der Schale */
function bowlHtml(sh){const b=sh.bowl,pn=typeof sharePartner==='function'?sharePartner():null,t=bowlSum(b),k=b.pct/100,ml=MEALS.find(m=>m[0]===sh.meal)[1],last=(S.nut.bowls||[]).slice(0,4);
 return `<div class="shtop"><h2>Schale für mehrere</h2><button class="ghost" data-bw="close">Schließen</button></div>${mealChips(sh.meal)}
 <p class="tip bwtip">Trag ein, was <b>insgesamt</b> in die Schale kommt. Danach wählst du, wie viel davon du isst${pn?` – der Rest geht als Vorschlag an ${esc(pn)}`:''}.</p>
 ${!b.items.length&&last.length?`<div class="bwlast"><span>Wieder machen:</span>${last.map(x=>`<button data-bw="again" data-id="${esc(x.id)}">${esc(x.n)}</button>`).join('')}</div>`:''}
 <label class="bwname"><span>Name</span><input id="bwN" data-bw-in="n" placeholder="z. B. Joghurt-Schale" value="${esc(b.n)}"></label>
 <ul class="bwlist">${b.items.map((x,i)=>`<li><span>${esc(x.f.name)}</span><input inputmode="decimal" data-bw-in="g" data-i="${i}" value="${fmt(x.g)}" aria-label="Menge ${esc(x.f.name)} in Gramm"><em>g</em><button data-bw="rm" data-i="${i}" aria-label="${esc(x.f.name)} entfernen">✕</button></li>`).join('')}</ul>
 <button class="bwadd" data-bw="add">+ Zutat in die Schale</button>
 ${b.items.length?`<p class="bwtot">Ganze Schale: <b>${fmt(Math.round(t.g))} g · ${fmt(Math.round(t.kcal))} kcal · ${fmt(Math.round(t.p))} g Eiweiß</b></p>
 ${pn?`<div class="bwpct"><span>Ich esse</span>${BOWL_PCT.map(v=>`<button data-bw="pct" data-v="${v}" aria-pressed="${b.pct===v}">${v} %</button>`).join('')}<button data-bw="pct" data-v="100" aria-pressed="${b.pct===100}">alles</button></div>`:''}
 <div class="bwme"><div><small>Du</small><b>${fmt(Math.round(t.kcal*k))} kcal</b><span>${fmt(Math.round(t.p*k))} g Eiweiß · ${fmt(Math.round(t.g*k))} g</span></div>
 ${pn&&b.pct<100?`<div class="bwpa"><small>${esc(pn)}</small><b>${fmt(Math.round(t.kcal*(1-k)))} kcal</b><span>${fmt(Math.round(t.p*(1-k)))} g Eiweiß · ${fmt(Math.round(t.g*(1-k)))} g</span></div>`:''}</div>
 ${pn&&b.pct<100?`<label class="rshare"><input type="checkbox" id="bwPa"${b.pa?' checked':''}> Rest an ${esc(pn)} schicken <span>(bestätigt selbst)</span></label>`:''}
 <label class="rshare"><input type="checkbox" id="bwKeep"${b.keep?' checked':''}> Schale merken für nächstes Mal</label>
 <button class="primary" data-bw="save" style="width:100%">Zu ${ml} eintragen</button>`:''}`}
/* Normale Suche/Mengen-Schritte im Schalen-Modus: Kopfzeile + „In die Schale“ statt „Hinzufügen“ */
const _bwRenderSheet=renderSheet;
renderSheet=function(){const sh=sheet;
 if(sh&&sh.step==='bowl')return `<div class="sheet" role="dialog" aria-modal="true" aria-label="Schale für mehrere"><div class="sheetin" data-step="bowl">${bowlHtml(sh)}</div></div>`;
 let h=_bwRenderSheet();if(!sh)return h;
 if(!sh.bowl)return h.replace('<div class="actions"><button class="ghost" data-n="custom">','<div class="actions"><button class="ghost bwgo" data-bw="start">Schale für mehrere</button><button class="ghost" data-n="custom">');const n=sh.bowl.items.length;
 const bar=`<div class="bwbar"><span>Schale: ${n} ${n===1?'Zutat':'Zutaten'}</span><button class="primary" data-bw="view">Zur Schale ›</button></div>`;
 return h.replace('<div class="sheetin" data-step="'+(sh.step||'search')+'">','$&'+bar).replace(/<button class="primary" data-n="addit"([^>]*)>[^<]*<\/button>/,'<button class="primary" data-n="addit"$1>In die Schale</button>').replace('<h2>Essen eintragen</h2>','<h2>Zutat für die Schale</h2>')};
const _bwShareAmt=shareAmtHtml;
shareAmtHtml=function(sh){return sh&&sh.bowl?'':_bwShareAmt(sh)};
/* „In die Schale“ fängt den normalen Hinzufügen-Knopf ab (Capture, bevor nutrition.js einträgt) */
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-n="addit"]');if(!b||!sheet||!sheet.bowl)return;ev.stopPropagation();ev.preventDefault();
 const g=num(sheet.g);if(!g||g<=0){note('Menge eingeben');return}remember(sheet.food);sheet.bowl.items.push({f:bowlFood(sheet.food),g});sheet.step='bowl';sheet.food=null;render()},true);
/* Zurück aus der Suche landet in der Schale, nicht im normalen Eintragen */
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-n="back"],[data-n="close"]');if(!b||!sheet||!sheet.bowl)return;if(sheet.step==='search'||b.dataset.n==='close'){ev.stopPropagation();sheet.step='bowl';render()}},true);
function bowlSave(){const b=sheet.bowl,d=nDate||today(),t=bowlSum(b),k=b.pct/100,pn=typeof sharePartner==='function'?sharePartner():null;
 if(!b.items.length){note('Erst Zutaten in die Schale');return}const name=(b.n||'').trim()||'Schale',meal=sheet.meal,bw=b.items.map(x=>`${x.f.name} ${fmt(Math.round(x.g))} g`).join(' · ');
 const it={id:'i'+Date.now().toString(36),name:name+' (selbst gemacht)',g:Math.round(t.g*k),meal,kcal:Math.round(t.kcal*k),p:r1(t.p*k),c:r1(t.c*k),f:r1(t.f*k),z:r1(t.z*k),bw:`ganze Schale: ${bw} · du ${b.pct} %`},wb=d===today()?cheerFrom(d):null;
 ND(d).items.push(it);
 if(b.keep){const id='b'+name.toLowerCase().replace(/[^a-zäöüß0-9]+/g,'-');S.nut.bowls=[{id,n:name,items:b.items,pct:b.pct},...(S.nut.bowls||[]).filter(x=>x.id!==id)].slice(0,8);S.metaT=Date.now()}
 const send=pn&&b.pct<100&&b.pa?[{...it,pg:Math.round(t.g*(1-k))}]:null;
 sheet=null;touch(d);setTimeout(()=>cheerDiff(d,wb),0);if(send)shareSend(send,meal,d);
 note(`Eingetragen: ${name} · ${fmt(it.kcal)} kcal${send?' – Rest an '+pn+' geschickt':''}`)}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-bw]');if(!b)return;const a=b.dataset.bw;
 if(a==='start'){bowlStart(b.dataset.m||(sheet&&sheet.meal)||mealNow());render();return}
 if(!sheet||!sheet.bowl)return;const w=sheet.bowl;bowlRead();
 if(a==='close'){sheet=null}
 else if(a==='add'){sheet.step='search';sheet.q='';sheet.results=null;sheet.focus=true}
 else if(a==='view'){sheet.step='bowl'}
 else if(a==='rm'){w.items.splice(+b.dataset.i,1)}
 else if(a==='pct'){w.pct=+b.dataset.v}
 else if(a==='again'){const x=(S.nut.bowls||[]).find(y=>y.id===b.dataset.id);if(x){w.n=x.n;w.items=x.items.map(i=>({f:{...i.f},g:i.g}));w.pct=x.pct||w.pct}}
 else if(a==='save'){bowlSave()}
 render()});
/* Eingaben (Name, Mengen, Haken) in den Zustand übernehmen, ohne bei jedem Tastendruck neu zu zeichnen */
function bowlRead(){if(!sheet||!sheet.bowl||sheet.step!=='bowl')return;const w=sheet.bowl,n=$('bwN');if(n)w.n=n.value;
 document.querySelectorAll('[data-bw-in="g"]').forEach(e=>{const g=num(e.value),x=w.items[+e.dataset.i];if(x&&g>0)x.g=g});
 const p=$('bwPa');if(p)w.pa=p.checked;const k=$('bwKeep');if(k)w.keep=k.checked}
document.addEventListener('change',ev=>{if(ev.target.closest&&ev.target.closest('.sheetin[data-step="bowl"]')){bowlRead();if(ev.target.dataset.bwIn==='g')render()}});
