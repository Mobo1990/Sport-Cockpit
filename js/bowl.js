/* Duo – Koch-Modus „Für mehrere gemacht“ (Wunsch: Pauline macht Joghurt für beide in eine Schale).
   Ablauf: Gesamtmengen in Schale/Topf (normale Suche/Scan/eigene Produkte) → „Ich esse ½“ (oder Teller wiegen)
   → eine Zeile im eigenen Tagebuch (mein Anteil je Zutat), auf Wunsch geht ein Anteil als Vorschlag an den Partner
   (todo-Liste, er bestätigt selbst). Kinder/Gäste: Rest wird nicht eingetragen.
   Nach Tester-Runde 1: Einstieg direkt an jeder Mahlzeit, nichts vorausgewählt, Partner nur auf Haken,
   Brüche statt 10-%-Schritte + Teller wiegen, KH/Fett sichtbar, Zutaten im Tagebuch zeilenweise mit meinem Anteil,
   Schalen werden automatisch gemerkt (S.nut.bowls, mit Sync) und stehen als „↻ Name“ an der Mahlzeit. */
'use strict';
const BOWL_FR=[[100/3,'⅓'],[50,'½'],[200/3,'⅔'],[100,'alles']];
const bowlSum=b=>b.items.reduce((a,x)=>{const k=x.g/100;a.g+=x.g;a.kcal+=x.f.kcal*k;a.p+=x.f.p*k;a.c+=x.f.c*k;a.f+=x.f.f*k;a.z+=(x.f.z||0)*k;return a},{g:0,kcal:0,p:0,c:0,f:0,z:0});
const bowlFood=f=>({id:f.id,name:f.name,kcal:f.kcal,p:f.p,c:f.c,f:f.f,z:f.z||0});
const bowlPn=()=>typeof sharePartner==='function'?sharePartner():null;
function bowlStart(meal,id){const x=id&&(S.nut.bowls||[]).find(y=>y.id===id);
 sheet={meal,step:'bowl',bowl:x?{n:x.n,items:x.items.map(i=>({f:{...i.f},g:i.g})),pct:x.pct||null,pa:false,pp:'r'}:{n:'',items:[],pct:null,pa:false,pp:'r'}}}
/* Anteil des Partners in % (Rest oder fester Bruch, nie mehr als übrig) */
const bowlPaPct=b=>!b.pa||b.pct==null||b.pct>=100?0:b.pp==='r'?100-b.pct:Math.min(+b.pp,100-b.pct);
const bowlPart=(t,k)=>({g:Math.round(t.g*k),kcal:Math.round(t.kcal*k),p:Math.round(t.p*k),c:Math.round(t.c*k),f:Math.round(t.f*k)});
const bowlTile=(cls,lab,v,sub)=>`<div class="${cls}"><small>${lab}</small><b>${fmt(v.kcal)} kcal</b><span class="bwp">${fmt(v.p)} g Eiweiß · ${fmt(v.g)} g</span><span>${fmt(v.c)} g Kohlenhydrate · ${fmt(v.f)} g Fett${sub?'<br>'+sub:''}</span></div>`;
function bowlHtml(sh){const b=sh.bowl,pn=bowlPn(),t=bowlSum(b),ml=MEALS.find(m=>m[0]===sh.meal)[1],last=(S.nut.bowls||[]).slice(0,4),me=b.pct,pa=bowlPaPct(b),rest=me==null?0:Math.max(0,100-me-pa);
 const fr=BOWL_FR.some(([v])=>me!=null&&Math.abs(v-me)<0.01),wg=me!=null&&!fr?Math.round(t.g*me/100):'';
 return `<div class="shtop"><h2>Für mehrere gemacht</h2><button class="ghost" data-bw="close">Schließen</button></div>${mealChips(sh.meal)}
 <p class="tip bwtip">Schale, Topf oder Auflauf: Trag ein, was <b>insgesamt</b> drin ist. Danach wählst du, wie viel davon du isst.</p>
 ${!b.items.length&&last.length?`<div class="bwlast"><span>Wie letztes Mal:</span>${last.map(x=>`<button data-bw="again" data-id="${esc(x.id)}">↻ ${esc(x.n)}</button>`).join('')}</div>`:''}
 <label class="bwname"><span>Name</span><input id="bwN" data-bw-in="n" placeholder="z. B. Joghurt-Schale" value="${esc(b.n)}"></label>
 <ul class="bwlist">${b.items.map((x,i)=>`<li><span>${esc(x.f.name)}<small>${fmt(Math.round(x.f.kcal*x.g/100))} kcal · ${fmt(Math.round(x.f.p*x.g/100))} g Eiweiß</small></span><input inputmode="decimal" data-bw-in="g" data-i="${i}" value="${fmt(x.g)}" aria-label="Menge ${esc(x.f.name)} in Gramm"><em>g</em><button data-bw="rm" data-i="${i}" aria-label="${esc(x.f.name)} entfernen">✕</button></li>`).join('')}</ul>
 <button class="bwadd" data-bw="add">+ Zutat hinzufügen</button>
 ${b.items.length?`<p class="bwtot">Insgesamt: <b>${fmt(Math.round(t.g))} g · ${fmt(Math.round(t.kcal))} kcal · ${fmt(Math.round(t.p))} g Eiweiß</b></p>
 <h3 class="bwh">Wie viel isst du?</h3>
 <div class="bwpct">${BOWL_FR.map(([v,l])=>`<button data-bw="pct" data-v="${v}" aria-pressed="${me!=null&&Math.abs(me-v)<0.01}">${l}</button>`).join('')}</div>
 <label class="bwweigh"><span>oder Teller gewogen:</span><input id="bwW" inputmode="decimal" data-bw-in="w" value="${wg}" placeholder="z. B. 320" aria-label="Mein Teller in Gramm"><em>g</em></label>
 ${pn&&me!=null&&me<100?`<label class="rshare"><input type="checkbox" id="bwPa"${b.pa?' checked':''}> Auch für ${esc(pn)} eintragen <span>(bestätigt selbst)</span></label>
 ${b.pa?`<p class="bwlab">${esc(pn)} isst:</p><div class="bwpct bwpp"><button data-bw="pp" data-v="r" aria-pressed="${b.pp==='r'}">Rest</button>${BOWL_FR.slice(0,3).filter(([v])=>v<=100-me+0.01).map(([v,l])=>`<button data-bw="pp" data-v="${v}" aria-pressed="${b.pp!=='r'&&Math.abs(+b.pp-v)<0.01}">${l}</button>`).join('')}</div>`:''}`:''}
 ${me!=null?(()=>{const A=bowlPart(t,me/100),P=bowlPart(t,pa/100),T=bowlPart(t,1),R={};for(const k in T)R[k]=Math.max(0,T[k]-A[k]-(pa?P[k]:0));
  return `<div class="bwme">${bowlTile('','Du',A)}${pa?bowlTile('bwpa',esc(pn),P,'als Vorschlag'):''}${rest>0.5?bowlTile('bwrest','Rest',R,'Kind/Gäste – wird nicht eingetragen'):''}</div>`})():''}
 <div class="bwsave"><button class="primary" data-bw="save"${me==null?' disabled':''}>${me==null?'Erst wählen, wie viel du isst':`Zu ${ml} eintragen`}</button></div>`:''}`}
/* Normale Such-/Mengen-Schritte im Koch-Modus: Leiste oben + „Hinzufügen“ landet in der Schale */
const _bwRenderSheet=renderSheet;
renderSheet=function(){const sh=sheet;
 if(sh&&sh.step==='bowl')return `<div class="sheet" role="dialog" aria-modal="true" aria-label="Für mehrere gemacht"><div class="sheetin" data-step="bowl">${bowlHtml(sh)}</div></div>`;
 let h=_bwRenderSheet();if(!sh||!sh.bowl)return h;const n=sh.bowl.items.length;
 const bar=`<div class="bwbar"><span>${esc(sh.bowl.n||'Schale')}: ${n} ${n===1?'Zutat':'Zutaten'}</span><button class="primary" data-bw="view">Zurück zur Schale ›</button></div>`;
 h=h.replace('<div class="sheetin" data-step="'+(sh.step||'search')+'">','$&'+bar).replace(/<button class="primary" data-n="addit"([^>]*)>[^<]*<\/button>/,'<button class="primary" data-n="addit"$1>Hinzufügen</button>').replace('<h2>Essen eintragen</h2>','<h2>Zutat hinzufügen</h2>');
 /* Löffel/Hand statt Gramm (Richtwerte) */
 if(sh.step!=='amount'||!sh.food)return h;const pl=(sh.food.por&&sh.food.por.l||'').toLowerCase(),hand=/flocken|nüss|nuss|mandel|beere|müsli|granola|kerne|samen|rosine|cranberr|obst|frücht/i.test(sh.food.name);
 const sp=[...(/tl|teelöffel/.test(pl)?[]:[['1 TL ≈ 5 g',5]]),...(/el|esslöffel/.test(pl)?[]:[['1 EL ≈ 15 g',15]]),...(hand?[['1 Handvoll ≈ 30 g',30]]:[])];
 return h.replace('<div class="vars">','<div class="vars">'+sp.map(([l,v])=>`<button data-n="gq" data-v="${v}">${l}</button>`).join(''))};
const _bwShareAmt=shareAmtHtml;
shareAmtHtml=function(sh){return sh&&sh.bowl?'':_bwShareAmt(sh)};
/* Einstieg an jeder Mahlzeit + gemerkte Schalen als „↻ Name“ */
function bowlMealBtns(m){const l=(S.nut.bowls||[]).filter(x=>x.meal===m).slice(0,2);
 return `<div class="bwrow">${l.map(x=>`<button class="ghost bwagain" data-bw="start" data-m="${m}" data-id="${esc(x.id)}">↻ ${esc(x.n)}</button>`).join('')}<button class="glink bwgo" data-bw="start" data-m="${m}">Für mehrere gemacht ›</button></div>`}
/* „Hinzufügen“ im Mengen-Schritt fängt den normalen Knopf ab (Capture, bevor nutrition.js einträgt) */
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-n="addit"]');if(!b||!sheet||!sheet.bowl)return;ev.stopPropagation();ev.preventDefault();
 const g=num(sheet.g);if(!g||g<=0){note('Menge eingeben');return}remember(sheet.food);sheet.bowl.items.push({f:bowlFood(sheet.food),g});sheet.step='bowl';sheet.food=null;render()},true);
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-n="back"],[data-n="close"]');if(!b||!sheet||!sheet.bowl)return;if(sheet.step==='search'||b.dataset.n==='close'){ev.stopPropagation();sheet.step='bowl';render()}},true);
function bowlSave(){const b=sheet.bowl,d=nDate||today(),t=bowlSum(b),pn=bowlPn();if(!b.items.length||b.pct==null)return;
 const k=b.pct/100,pk=bowlPaPct(b)/100,name=(b.n||'').trim()||'Schale',meal=sheet.meal,fr=(BOWL_FR.find(([v])=>Math.abs(v-b.pct)<0.01)||[0,fmt(Math.round(b.pct))+' %'])[1];
 const bw=`Dein Anteil (${fr==='alles'?'alles':fr+' von '+fmt(Math.round(t.g))+' g'}):\n`+b.items.map(x=>`${x.f.name} ${fmt(Math.round(x.g*k))} g`).join('\n');
 const it={id:'i'+Date.now().toString(36),name:name+' (selbst gemacht)',g:Math.round(t.g*k),meal,kcal:Math.round(t.kcal*k),p:Math.round(t.p*k),c:Math.round(t.c*k),f:Math.round(t.f*k),z:Math.round(t.z*k),bw},wb=d===today()?cheerFrom(d):null;
 const send=pn&&pk>0?[{...it,pg:Math.round(t.g*pk)}]:null;if(send)it.bws=1;
 ND(d).items.push(it);
 const id='b'+name.toLowerCase().replace(/[^a-zäöüß0-9]+/g,'-');S.nut.bowls=[{id,n:name,meal,items:b.items,pct:b.pct},...(S.nut.bowls||[]).filter(x=>x.id!==id)].slice(0,8);S.metaT=Date.now();
 sheet=null;touch(d);setTimeout(()=>cheerDiff(d,wb),0);if(send)shareSend(send,meal,d);
 note(`Eingetragen: ${name} · ${fmt(it.kcal)} kcal${send?' – Vorschlag an '+pn+' geschickt':''}`)}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-bw]');if(!b)return;const a=b.dataset.bw;
 if(a==='start'){bowlStart(b.dataset.m||(sheet&&sheet.meal)||mealNow(),b.dataset.id);render();return}
 if(!sheet||!sheet.bowl)return;const w=sheet.bowl;bowlRead();
 if(a==='close'){sheet=null}
 else if(a==='add'){sheet.step='search';sheet.q='';sheet.results=null;sheet.focus=true}
 else if(a==='view'){sheet.step='bowl'}
 else if(a==='rm'){w.items.splice(+b.dataset.i,1)}
 else if(a==='pct'){w.pct=+b.dataset.v}
 else if(a==='pp'){w.pp=b.dataset.v}
 else if(a==='again'){const x=(S.nut.bowls||[]).find(y=>y.id===b.dataset.id);if(x){w.n=x.n;w.items=x.items.map(i=>({f:{...i.f},g:i.g}));w.pct=x.pct||null}}
 else if(a==='save'){bowlSave()}
 render()});
/* Eingaben übernehmen, ohne bei jedem Tastendruck neu zu zeichnen */
function bowlRead(){if(!sheet||!sheet.bowl||sheet.step!=='bowl')return;const w=sheet.bowl,n=$('bwN');if(n)w.n=n.value;
 document.querySelectorAll('[data-bw-in="g"]').forEach(e=>{const g=num(e.value),x=w.items[+e.dataset.i];if(x&&g>0)x.g=g});
 const p=$('bwPa');if(p)w.pa=p.checked}
document.addEventListener('change',ev=>{const t=ev.target;if(!(t.closest&&t.closest('.sheetin[data-step="bowl"]')))return;bowlRead();
 if(t.dataset.bwIn==='w'){const g=num(t.value),tot=bowlSum(sheet.bowl).g;if(g>0&&tot>0)sheet.bowl.pct=Math.min(100,Math.round(g/tot*1000)/10)}
 if(t.dataset.bwIn==='g'||t.dataset.bwIn==='w'||t.id==='bwPa')render()});
