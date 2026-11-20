/* Sport Cockpit – Gym Mode: eine Übung im Vollbild, große Knöpfe, wischen */
'use strict';
let gym={open:false,i:0,last:null};
const gymEl=(()=>{const d=document.createElement('div');d.id='gym';d.className='gym';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');document.body.appendChild(d);return d})();
function gymRow(e,dr){const rows=dr.ex[e.id];let k=rows.findIndex(r=>!r.done);return{rows,k}}
function gymDefaults(e,rows,k){const sg=sugg(e),r=rows[k]||{},prev=rows.slice(0,k).filter(x=>x.done).pop();
 const kg=r.kg!==''&&r.kg!=null?num(r.kg):(prev?num(prev.kg):(sg?sg.kg:null)),reps=r.reps!==''&&r.reps!=null?num(r.reps):(sg?(sg.reps[k]??sg.reps[sg.reps.length-1]):e.max);return{kg,reps,sg}}
function renderGym(){if(!gym.open){gymEl.innerHTML='';gymEl.classList.remove('on');return}
 const dr=draftFor(day),list=dayEx(day);if(!list.length){gym.open=false;return renderGym()}
 gym.i=Math.max(0,Math.min(gym.i,list.length-1));const e=list[gym.i],{rows,k}=gymRow(e,dr),done=k===-1,{kg,reps,sg}=gymDefaults(e,rows,done?rows.length-1:k);
 const A=isA(e.v),allDone=list.every(x=>dr.ex[x.id].every(r=>r.done)),lastI=gym.last;
 const left=Math.max(0,Math.round((tEnd-Date.now())/1000)),resting=$('timer').classList.contains('on')&&left>0;
 gymEl.classList.add('on');
 gymEl.innerHTML=`<header class="gh"><button class="gx" data-g="close" aria-label="Gym Mode schließen">✕</button><div><b>${DAYS[day].n}</b><span>Übung ${gym.i+1} von ${list.length}</span></div><div class="gdots">${list.map((x,j)=>`<i class="${j===gym.i?'cur':''}${dr.ex[x.id].every(r=>r.done)?' ok':''}"></i>`).join('')}</div></header>
 <section class="gbody" id="gbody"><div class="gpic">${svg(picOf(e))}</div><h2>${esc(e.n)}</h2>
 ${e.vars.length>1?`<div class="vars gv">${e.vars.map(v=>`<button data-a="var" data-e="${e.id}" data-v="${esc(v)}" aria-pressed="${v===e.v}">${esc(v)}</button>`).join('')}</div>`:''}
 <p class="gsg">${sg?esc(sg.txt):`Ziel: ${e.sets} × ${e.min}–${e.max} Wdh.`}</p>
 ${resting?`<div class="grest"><span>Pause</span><b id="grest">${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}</b><button data-g="skip">Weiter</button></div>`:''}
 ${done?`<div class="gdone"><b>Alle ${rows.length} Sätze geschafft</b>${lastI!=null?rpeBtns(e,lastI,rows[lastI]):''}<div class="gnav">${gym.i<list.length-1?`<button class="primary" data-g="next">Nächste Übung ›</button>`:''}<button data-g="more">+ Noch ein Satz</button></div></div>`
 :`<p class="gset">Satz <b>${k+1}</b> von ${rows.length}</p>
 <div class="gstep"><label>${A?'kg Hilfe':'Gewicht'}</label><div><button data-g="kg" data-d="-1" aria-label="weniger">−</button><input id="gkg" inputmode="decimal" value="${kg!=null?fmt(kg):''}" placeholder="kg"><button data-g="kg" data-d="1" aria-label="mehr">+</button></div></div>
 <div class="gstep"><label>Wiederholungen</label><div><button data-g="rp" data-d="-1" aria-label="weniger">−</button><input id="grp" inputmode="numeric" value="${reps!=null?reps:''}"><button data-g="rp" data-d="1" aria-label="mehr">+</button></div></div>
 <button class="primary gok" data-g="set">Satz ${k+1} fertig ✓</button>
 ${lastI!=null&&rows[lastI]&&rows[lastI].done?`<div class="glast"><span>Satz ${lastI+1}: ${fmt(num(rows[lastI].kg)||0)} × ${rows[lastI].reps} – wie war’s?</span>${rpeBtns(e,lastI,rows[lastI])}</div>`:''}`}
 <div class="gsets">${rows.map((r,j)=>`<span class="${r.done?'ok':''}${j===k?' cur':''}">${j+1}: ${r.done?fmt(num(r.kg)||0)+'×'+r.reps:'–'}</span>`).join('')}</div>
 ${e.t?`<p class="tip" style="padding:10px 0 0">${esc(e.t)}</p>`:''}</section>
 <footer class="gf"><button data-g="prev"${gym.i===0?' disabled':''}>‹ Zurück</button>${allDone?`<button class="primary" data-g="finish">Training abschließen</button>`:`<button data-g="next"${gym.i>=list.length-1?' disabled':''}>Weiter ›</button>`}</footer>`}
const rpeBtns=(e,i,r)=>`<div class="vars grpe">${[['l','leicht'],['m','passt'],['h','hart']].map(([k,l])=>`<button data-g="rpe" data-e="${e.id}" data-i="${i}" data-r="${k}" aria-pressed="${r&&r.rpe===k}">${l}</button>`).join('')}</div>`;
function openGym(){gym.open=true;gym.last=null;const dr=draftFor(day),list=dayEx(day);const j=list.findIndex(x=>dr.ex[x.id].some(r=>!r.done));gym.i=j<0?0:j;renderGym()}
gymEl.addEventListener('click',ev=>{const b=ev.target.closest('[data-g]');if(!b)return;const a=b.dataset.g,dr=draftFor(day),list=dayEx(day),e=list[gym.i];
 if(a==='close'){gym.open=false;render();return}
 if(a==='next'){gym.i++;gym.last=null}else if(a==='prev'){gym.i--;gym.last=null}
 else if(a==='skip'){stopT()}
 else if(a==='kg'||a==='rp'){const inp=$(a==='kg'?'gkg':'grp'),st=a==='kg'?(e.step||2.5):1;inp.value=fmt(Math.max(0,(num(inp.value)||0)+(+b.dataset.d)*st));return}
 else if(a==='set'){const {rows,k}=gymRow(e,dr);if(k<0)return;const kg=num($('gkg').value),rp=Math.round(num($('grp').value)||0);if(!rp){note('Wiederholungen eintragen');return}
  const r=rows[k];r.kg=kg!=null?String(kg).replace('.',','):'0';r.reps=String(rp);r.done=true;gym.last=k;startT(S.rest);
  const key=vkey(e),b0=best(key),m=e1(kg||0,rp);if(!isA(e.v)&&b0>0&&m>b0+0.01&&m>Math.max(0,...rows.filter((x,j)=>j!==k&&x.done).map(x=>e1(num(x.kg)||0,num(x.reps)||0))))toast('Neuer Bestwert!',`${vname(e)}: ${fmt(kg)} kg × ${rp}`);saveDrafts()}
 else if(a==='rpe'){const r=dr.ex[b.dataset.e][+b.dataset.i];r.rpe=r.rpe===b.dataset.r?'':b.dataset.r;saveDrafts()}
 else if(a==='more'){const rows=dr.ex[e.id],l=rows[rows.length-1];rows.push({kg:l?l.kg:'',reps:'',done:false});gym.last=null;saveDrafts()}
 else if(a==='finish'){gym.open=false;finish();return}
 renderGym()});
gymEl.addEventListener('click',ev=>{if(ev.target.closest('[data-a="var"]'))setTimeout(renderGym,0)});
let gx0=null;gymEl.addEventListener('touchstart',ev=>{if(ev.target.closest('input,button'))return;gx0=ev.touches[0].clientX},{passive:true});
gymEl.addEventListener('touchend',ev=>{if(gx0==null)return;const dx=ev.changedTouches[0].clientX-gx0;gx0=null;const n=dayEx(day).length;if(Math.abs(dx)<70)return;gym.i=Math.max(0,Math.min(n-1,gym.i+(dx<0?1:-1)));gym.last=null;renderGym()},{passive:true});
setInterval(()=>{if(!gym.open)return;const el=$('grest'),l=Math.max(0,Math.round((tEnd-Date.now())/1000));if(el){el.textContent=`${Math.floor(l/60)}:${String(l%60).padStart(2,'0')}`;if(l<=0)renderGym()}},500);
/* Einstieg: Knopf im Training-Tab und auf der Startseite */
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-gym]');if(!b)return;if(b.dataset.d)day=b.dataset.d;view='train';render();openGym()});
const _renderBase=render;render=function(){_renderBase();if(view==='train'&&day!=='cardio'){const v=$('view');if(v&&!v.querySelector('.gymgo'))v.insertAdjacentHTML('afterbegin',`<button class="primary gymgo" data-gym="1">▶ Gym Mode starten</button>`)}renderGym()};
