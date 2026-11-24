/* Sport Cockpit – Gym Mode: eine Übung im Vollbild, große Knöpfe, wischen */
'use strict';
let gym={open:false,i:0,last:null};
const gymEl=(()=>{const d=document.createElement('div');d.id='gym';d.className='gym';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');document.body.appendChild(d);return d})();
function gymRow(e,dr){const rows=dr.ex[e.id];let k=rows.findIndex(r=>!r.done);return{rows,k}}
function gymDefaults(e,rows,k){const sg=sugg(e),r=rows[k]||{},prev=rows.slice(0,k).filter(x=>x.done).pop();
 const kg=r.kg!==''&&r.kg!=null?num(r.kg):(prev?num(prev.kg):(sg?sg.kg:startKg(e))),reps=r.reps!==''&&r.reps!=null?num(r.reps):(sg?(sg.reps[k]??sg.reps[sg.reps.length-1]):e.max);return{kg,reps,sg}}
function renderGym(){const gb0=$('gbody'),keep=gb0&&gym.shown===gym.i?gb0.scrollTop:0,ae=document.activeElement,fid=ae&&gymEl.contains(ae)&&ae.id?ae.id:null;
 renderGym0();document.documentElement.classList.toggle('gym-open',gym.open);const gb=$('gbody');if(gb&&keep)gb.scrollTop=keep;gym.shown=gym.open?gym.i:null;
 if(fid){const f=$(fid);if(f)try{f.focus({preventScroll:true})}catch(e){}}}
/* Nächste offene Übung nach i (ringsum), sonst null */
function gymNextOpen(list,dr,i){for(let s=1;s<list.length;s++){const j=(i+s)%list.length;if(dr.ex[list[j].id].some(r=>!r.done))return j}return null}
const isBar=e=>/^Langhantel/.test(e.v||'');
function plateTxt(e,kg){if(!isBar(e)||!(kg>20))return '';const p=plates(kg);return p?`Stange 20 kg + pro Seite ${p} kg`:''}
function gymFinHtml(f){const up=f.ups||[];return `<header class="gh"><button class="gx" data-g="close" aria-label="Schließen">✕</button><div><b>${DAYS[f.day].n}</b><span>Geschafft</span></div></header>
 <section class="gbody gfin" id="gbody"><p class="gfbig cond">Sauber!</p><p class="gfsub">${DAYS[f.day].n}-Training geschafft – Glückwunsch.</p>
 <div class="gfstats">${f.dur?`<div><b class="cond">${f.dur}</b><span>Minuten</span></div>`:''}<div><b class="cond">${f.sets}</b><span>Sätze</span></div><div><b class="cond">${fmt(Math.round(f.vol))}</b><span>kg bewegt</span></div></div>
 ${f.prevVol?`<p class="gfline">${f.vol>=f.prevVol?`<b class="hot">+${fmt(Math.round((f.vol/f.prevVol-1)*100))} %</b> mehr bewegt als beim letzten ${DAYS[f.day].n}-Tag`:`${fmt(Math.round((1-f.vol/f.prevVol)*100))} % weniger als beim letzten ${DAYS[f.day].n}-Tag – passiert, nächstes Mal wieder mehr.`}</p>`:''}
 ${up.length?`<p class="gfh">Gesteigert</p><ul class="gful">${up.map(u=>`<li><span>${esc(u.n)}</span><b>+${fmt(u.d)} kg</b></li>`).join('')}</ul>`:''}
 ${f.prs.length?`<p class="gfh">Neue Bestwerte</p><ul class="gful">${f.prs.map(p=>`<li><span>${esc(p)}</span></li>`).join('')}</ul>`:''}
 <div class="gflex"><b>Noch 5 Minuten dehnen?</b><span>Optional – macht beweglicher und hilft der Erholung. Zählt nicht für die Wochen-Challenge.</span><button class="primary" data-g="flex">Dehnen starten (5 min)</button></div></section>
 <footer class="gf"><button data-g="close">Fertig</button></footer>`}
function renderGym0(){if(!gym.open){gymEl.innerHTML='';gymEl.classList.remove('on');return}
 if(gym.fin){gymEl.classList.add('on');gymEl.innerHTML=gymFinHtml(gym.fin);return}
 const dr=draftFor(day),list=dayEx(day);if(!list.length){gym.open=false;return renderGym0()}
 gym.i=Math.max(0,Math.min(gym.i,list.length-1));const e=list[gym.i],{rows,k}=gymRow(e,dr),done=k===-1,{kg,reps,sg}=gymDefaults(e,rows,done?rows.length-1:k);
 const A=isA(e.v),allDone=list.every(x=>dr.ex[x.id].every(r=>r.done)),nx=gymNextOpen(list,dr,gym.i),g=guideOf(e),mv=gymMove(e);
 const left=Math.max(0,Math.round((tEnd-Date.now())/1000)),resting=$('timer').classList.contains('on')&&left>0;
 const first=!rows.some(x=>x.done),warm=!done&&k===0&&first&&BIG.has(e.id)&&!A&&kg>0;
 const ed=gym.edit!=null&&rows[gym.edit]?gym.edit:null;
 gymEl.classList.add('on');
 gymEl.innerHTML=`<header class="gh"><button class="gx" data-g="close" aria-label="Gym Mode schließen">✕</button><div><b>${DAYS[day].n}</b><span>Übung ${gym.i+1} von ${list.length}</span></div>
 ${S.prof.gnx!==false&&!allDone?`<div class="gnx"><small>Als Nächstes</small><b>${nx!=null?esc(list[nx].n):'Letzte Übung'}</b></div>`:''}
 <div class="gdots">${list.map((x,j)=>`<i class="${j===gym.i?'cur':''}${dr.ex[x.id].every(r=>r.done)?' ok':''}"></i>`).join('')}</div></header>
 <section class="gbody" id="gbody">${gym.anim&&mv?moveSvg(mv,'wofig gymfig',e.n):`<div class="gpic">${svg(picOf(e))}</div>`}
 <div class="gtools">${mv?`<button data-g="anim" aria-pressed="${!!gym.anim}">${gym.anim?'Bild zeigen':'▶ Bewegungsablauf'}</button>`:''}${!done&&nx!=null?`<button data-g="busy">Gerät besetzt</button>`:''}</div>
 <h2>${esc(e.n)}</h2>
 ${e.vars.length>1?`<div class="vars gv">${e.vars.map(v=>`<button data-a="var" data-e="${e.id}" data-v="${esc(v)}" aria-pressed="${v===e.v}">${esc(v)}</button>`).join('')}</div>`:''}
 <div class="ghow">${g?`<p class="gmu"><b>Trainiert:</b> ${esc(g.m)}</p>`:''}${e.t?`<p class="gtip">${esc(e.t)}</p>`:''}
 ${g?`<button class="glink" data-g="how" aria-expanded="${!!gym.how}">${gym.how?'Anleitung ausblenden':'Einstellung und Ausführung'} ›</button>${gym.how?`<ol class="gsteps">${g.s.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`:''}`:''}</div>
 <p class="gsg">${sg?esc(sg.txt):`Ziel: ${e.sets} × ${e.min}–${e.max} Wdh.`}</p>${!sg&&first&&startKg(e)?`<p class="gstart">Erstes Mal: Startvorschlag ${fmt(startKg(e))} kg${/Kurzhantel/.test(e.v)?' pro Hand':''}${isA(e.v)?' Hilfe':''} – lieber leicht anfangen und steigern.</p>`:''}
 ${warm?`<p class="gwarm"><b>Erst aufwärmen:</b> 1 Satz mit 10–12 Wdh. ${isBar(e)?'nur mit der leeren Stange (20 kg)':`mit etwa ${fmt(r25(kg/2))} kg`}. Zählt nicht mit.</p>`:''}
 ${resting?`<div class="grest"><span>Pause</span><b id="grest">${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}</b><button data-g="skip">Weiter</button></div>`:''}
 ${done?`<div class="gdone"><b>Alle ${rows.length} Sätze geschafft</b><div class="gnav">${nx!=null?`<button class="primary" data-g="go" data-i="${nx}">Nächste Übung ›</button>`:''}<button data-g="more">+ Noch ein Satz</button></div></div>`
 :`<p class="gset">Satz <b>${k+1}</b> von ${rows.length}</p>
 <div class="gstep"><label>${A?'kg Hilfe':'Gewicht'}</label><div><button data-g="kg" data-d="-1" aria-label="weniger">−</button><input id="gkg" inputmode="decimal" value="${kg!=null?fmt(kg):''}" placeholder="kg"><button data-g="kg" data-d="1" aria-label="mehr">+</button></div></div>
 <p class="gplate" id="gplate">${plateTxt(e,kg)}</p>
 <div class="gstep"><label>Wiederholungen</label><div><button data-g="rp" data-d="-1" aria-label="weniger">−</button><input id="grp" inputmode="numeric" value="${reps!=null?reps:''}"><button data-g="rp" data-d="1" aria-label="mehr">+</button></div></div>
 <div class="glast"><span>Wie war der Satz?</span>${rpeBtns(e,k,rows[k])}</div>
 ${k===rows.length-1?`<p class="gch"><b>Letzter Satz – Challenge:</b> Halte die letzte Wiederholung 3 Sekunden in der angespannten Position.</p>`:''}
 <button class="primary gok" data-g="set">Satz ${k+1} fertig ✓</button>`}
 <div class="gsets">${rows.map((r,j)=>`<span data-g="edit" data-i="${j}" role="button" tabindex="0" class="${r.done?'ok':''}${j===k?' cur':''}${j===ed?' ed':''}">${j+1}: ${r.done?fmt(num(r.kg)||0)+'×'+r.reps:'–'}</span>`).join('')}</div>
 ${ed!=null?(rows[ed].done?`<div class="gedit"><b>Satz ${ed+1} ändern</b><div class="gerow"><label>${A?'kg Hilfe':'kg'}<input id="gekg" inputmode="decimal" value="${fmt(num(rows[ed].kg)||0)}"></label><label>Wdh.<input id="gerp" inputmode="numeric" value="${esc(rows[ed].reps)}"></label></div>
  <div class="gnav"><button class="primary" data-g="esave">Speichern</button><button data-g="edel">Satz löschen</button><button data-g="ecancel">Abbrechen</button></div></div>`
  :`<div class="gedit"><b>Satz ${ed+1} ist noch offen</b><div class="gnav"><button data-g="edel">Satz entfernen</button><button data-g="ecancel">Abbrechen</button></div></div>`):`<p class="gtap">Tipp: Auf einen Satz tippen, um ihn zu ändern oder zu löschen.</p>`}</section>
 <footer class="gf"><button data-g="prev"${gym.i===0?' disabled':''}>‹ Zurück</button>${allDone?`<button class="primary" data-g="finish">Training abschließen</button>`:`<button data-g="next"${gym.i>=list.length-1?' disabled':''}>Weiter ›</button>`}</footer>`}
const rpeBtns=(e,i,r)=>`<div class="vars grpe">${[['l','leicht'],['m','passt'],['h','hart']].map(([k,l])=>`<button data-g="rpe" data-e="${e.id}" data-i="${i}" data-r="${k}" aria-pressed="${!!r&&r.rpe===k}">${l}</button>`).join('')}</div>`;
function openGym(){gym.open=true;gym.last=null;gym.edit=null;gym.fin=null;const dr=draftFor(day),list=dayEx(day);const j=list.findIndex(x=>dr.ex[x.id].some(r=>!r.done));gym.i=j<0?0:j;renderGym()}
/* Eingaben sofort in den Entwurf schreiben – sonst setzt ein Neuaufbau (Pausenende, „hart“, Sync) sie zurück */
function gymStore(){if(!gym.open||gym.fin)return;const dr=draftFor(day),e=dayEx(day)[gym.i];if(!e)return;const {rows,k}=gymRow(e,dr);if(k<0)return;
 const a=$('gkg'),b=$('grp');if(a){const v=num(a.value);rows[k].kg=v!=null?String(v).replace('.',','):'';const pl=$('gplate');if(pl)pl.textContent=plateTxt(e,v)}if(b){const v=num(b.value);rows[k].reps=v!=null?String(Math.round(v)):''}saveDrafts()}
gymEl.addEventListener('input',ev=>{if(ev.target.id==='gkg'||ev.target.id==='grp')gymStore()});
/* Tastatur: Eingabefeld sichtbar halten */
gymEl.addEventListener('focusin',ev=>{const t=ev.target;if(t.tagName!=='INPUT')return;gymEl.classList.add('kb');setTimeout(()=>{const gb=$('gbody'),el=document.activeElement;if(!gb||!el||!gb.contains(el))return;
 const top=el.getBoundingClientRect().top-gb.getBoundingClientRect().top;gb.scrollTo({top:gb.scrollTop+top-90,behavior:'smooth'})},320)});
gymEl.addEventListener('focusout',()=>setTimeout(()=>{const el=document.activeElement;if(!el||!gymEl.contains(el)||el.tagName!=='INPUT')gymEl.classList.remove('kb')},200));
gymEl.addEventListener('click',ev=>{const b=ev.target.closest('[data-g]');if(!b)return;const a=b.dataset.g;
 if(a==='close'){gym.open=false;gym.fin=null;gymEl.classList.remove('kb');render();return}
 if(a==='flex'){const d=gym.fin?gym.fin.day:day;gym.open=false;gym.fin=null;render();woStart('flex_'+d);return}
 const dr=draftFor(day),list=dayEx(day),e=list[gym.i];
 if(a==='next'){gym.i++;gym.last=null;gym.edit=null}else if(a==='prev'){gym.i--;gym.last=null;gym.edit=null}
 else if(a==='go'){gym.i=+b.dataset.i;gym.last=null;gym.edit=null}
 else if(a==='busy'){const j=gymNextOpen(list,dr,gym.i);if(j==null)return;note(`${e.n} machst du später – jetzt erst ${list[j].n}`);gym.i=j;gym.edit=null}
 else if(a==='anim'){gym.anim=!gym.anim}else if(a==='how'){gym.how=!gym.how}
 else if(a==='skip'){stopT()}
 else if(a==='kg'||a==='rp'){const inp=$(a==='kg'?'gkg':'grp'),st=a==='kg'?(e.step||2.5):1;inp.value=fmt(Math.max(0,(num(inp.value)||0)+(+b.dataset.d)*st));gymStore();return}
 else if(a==='set'){const {rows,k}=gymRow(e,dr);if(k<0)return;const kg=num($('gkg').value),rp=Math.round(num($('grp').value)||0);if(!rp){note('Wiederholungen eintragen');return}
  if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();const r=rows[k];r.kg=kg!=null?String(kg).replace('.',','):'0';r.reps=String(rp);r.done=true;r.at=Date.now();gym.last=k;gym.edit=null;startT(S.rest);
  const key=vkey(e),b0=best(key),m=e1(kg||0,rp);if(!isA(e.v)&&b0>0&&m>b0+0.01&&m>Math.max(0,...rows.filter((x,j)=>j!==k&&x.done).map(x=>e1(num(x.kg)||0,num(x.reps)||0))))toast('Neuer Bestwert!',`${vname(e)}: ${fmt(kg)} kg × ${rp}`);saveDrafts()}
 else if(a==='rpe'){gymStore();const r=dr.ex[b.dataset.e][+b.dataset.i];r.rpe=r.rpe===b.dataset.r?'':b.dataset.r;saveDrafts()}
 else if(a==='edit'){gymStore();const j=+b.dataset.i;gym.edit=gym.edit===j?null:j}
 else if(a==='ecancel'){gym.edit=null}
 else if(a==='esave'){const r=dr.ex[e.id][gym.edit];if(!r)return;const kg=num($('gekg').value),rp=Math.round(num($('gerp').value)||0);if(!rp){note('Wiederholungen eintragen');return}
  r.kg=kg!=null?String(kg).replace('.',','):'0';r.reps=String(rp);gym.edit=null;saveDrafts()}
 else if(a==='edel'){const rows=dr.ex[e.id];rows.splice(gym.edit,1);if(!rows.length)rows.push({kg:'',reps:'',done:false});gym.edit=null;gym.last=null;saveDrafts()}
 else if(a==='more'){gymStore();const rows=dr.ex[e.id],l=rows[rows.length-1];rows.push({kg:l?l.kg:'',reps:'',done:false});gym.last=null;saveDrafts()}
 else if(a==="finish"){gymStore();const n0=S.sessions.length;finish();if(S.sessions.length>n0&&summary){gym.fin={...summary};gym.open=true}}
 renderGym()});
document.addEventListener('change',ev=>{const t=ev.target;if(t.dataset.a!=='gnx')return;S.prof.gnx=t.checked;S.metaT=Date.now();persist()});
gymEl.addEventListener('click',ev=>{if(ev.target.closest('[data-a="var"]'))setTimeout(renderGym,0)});
let gx0=null,gy0=0;gymEl.addEventListener('touchstart',ev=>{if(ev.target.closest('input,button'))return;gx0=ev.touches[0].clientX;gy0=ev.touches[0].clientY},{passive:true});
gymEl.addEventListener('touchend',ev=>{if(gx0==null)return;const dx=ev.changedTouches[0].clientX-gx0,dy=ev.changedTouches[0].clientY-gy0;gx0=null;const n=dayEx(day).length;if(Math.abs(dx)<80||Math.abs(dx)<2*Math.abs(dy))return;gym.i=Math.max(0,Math.min(n-1,gym.i+(dx<0?1:-1)));gym.last=null;renderGym()},{passive:true});
setInterval(()=>{if(!gym.open)return;const el=$('grest'),l=Math.max(0,Math.round((tEnd-Date.now())/1000));if(el){el.textContent=`${Math.floor(l/60)}:${String(l%60).padStart(2,'0')}`;if(l<=0)renderGym()}},500);
/* Einstieg: Knopf im Training-Tab und auf der Startseite */
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-gym]');if(!b)return;if(b.dataset.d)day=b.dataset.d;view='train';render();openGym()});
/* Kurz-Workouts (Core, Zirkel, Mobility) immer im Training-Tab erreichbar – nicht nur, wenn sie gerade Challenge sind */
const woQuickHtml=()=>`<section class="woq"><h3 class="sh">Kurz-Workouts <small class="chn">ohne Geräte, mit Timer</small></h3>${woPickHtml()}</section>`;
const _renderBase=render;render=function(){_renderBase();if(view==='train'){const v=$('view');if(v){if(day!=='cardio'&&!v.querySelector('.gymgo'))v.insertAdjacentHTML('afterbegin',`<button class="primary gymgo" data-gym="1">▶ Gym Mode starten</button>`);
 if(!v.querySelector('.woq')){const g=v.querySelector('.gymgo');if(g)g.insertAdjacentHTML('afterend',woQuickHtml());else v.insertAdjacentHTML('afterbegin',woQuickHtml())}}}renderGym()};
