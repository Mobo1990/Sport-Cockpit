/* Sport Cockpit – Anzeigetafel oben auf der Startseite (beide mit Profilbild, Punkte heute und diese Woche)
   und Profilbilder. Das eigene Bild steht in S.prof.pic (synchronisiert); geteilt wird es über die HA-Liste
   todo.sport_cockpit_geteiltes_essen als Eintrag {kind:'avatar', from, pic}. */
'use strict';
let PICS={};try{PICS=JSON.parse(localStorage.getItem('sc.pics'))||{}}catch(e){}
const initials=n=>String(n||'?').trim().split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase()||'?';
function picFor(name,me){return me?S.prof.pic||'':PICS[slugN(name)]||''}
function avaHtml(name,me,cls=''){const p=picFor(name,me);return `<span class="ava${me?' me':' pa'}${cls?' '+cls:''}">${p?`<img src="${p}" alt="${esc(name)}">`:`<i>${esc(initials(name))}</i>`}</span>`}
const CROWN='<svg class="crown" viewBox="0 0 24 16" aria-hidden="true"><path d="M2 14 L4 4 L9 9 L12 2 L15 9 L20 4 L22 14 Z"/></svg>';
function boardPartner(){const p=(typeof partners!=='undefined'?partners:[]).find(x=>x.name);if(!p)return null;
 const inWeek=p.d&&wk(new Date(p.d+'T12:00:00'))===wk(Date.now());return{name:p.name,today:p.d===today()?(+p.pt||0):0,week:inWeek?(+p.wp||0):0,tr:p.d===today()?p.tr:''}}
/* Duell antippen: Punkte pro Tag dieser Woche, Abstand, schnellste Punkte, Hinweis für Neueinsteiger */
let boardOpen=false;
function boardDetail(a,p,lead,d){const days=weekDaysIso(),wd=['Mo','Di','Mi','Do','Fr','Sa','So'],per=days.map((x,i)=>[wd[i],dayScore(x).pt]),hasOld=Object.keys(S.nut.days).some(x=>x<days[0]&&(S.nut.days[x].items||[]).length)||S.sessions.some(s=>iso(s.date)<days[0]);
 const first=days.findIndex(x=>(S.nut.days[x]&&((S.nut.days[x].items||[]).length||S.nut.days[x].water||S.nut.days[x].af))||S.sessions.some(s=>iso(s.date)===x));
 return `<section class="bdet"><div class="bdrow">${per.map(([n,v])=>`<div><small>${n}</small><b>${v}</b></div>`).join('')}</div>
 <p>${lead<0?`<b>Dir fehlen ${fmt(d+1)} Punkte</b> bis zur Führung.`:lead>0?`<b>Du führst mit ${fmt(d)}.</b> ${esc(p.name)} hat heute ${fmt(p.today)} Punkte.`:'<b>Gleichstand.</b>'} Am schnellsten gibt's Punkte für Training (+30), Protein (+20), Challenges und Wasser (+10).</p>
 ${!hasOld&&first>0?`<p class="bfair">Du bist erst seit ${wd[first]} dabei – ab Montag startet ihr beide wieder bei 0.</p>`:''}<p class="bfair">Wochenpunkte zählen von Montag bis Sonntag, danach geht's von vorne los.</p></section>`}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-bd]');if(!b||ev.target.closest('.avawrap,input,label'))return;boardOpen=!boardOpen;render()});
function boardHtml(sc){const me=S.prof.name||'Ich',p=boardPartner(),a=weekScore(),ta=sc.pt;
 const meCol=lead=>`<div class="bp"><label class="avawrap" title="Profilbild ändern">${lead?CROWN:''}${avaHtml(me,true)}<input type="file" accept="image/*" data-pic="file" hidden></label><span class="bn">${esc(me)}</span><span class="pts"><b class="cond">${fmt(ta)}</b></span><small>heute</small></div>`;
 if(!p)return `<section class="board solo">${meCol(false)}<div class="bmid"><span class="bk">Woche</span><b class="cond">${fmt(a)}</b><em>Punkte</em></div><p class="bhint">Sobald dein Partner mit Home Assistant verbunden ist, steht hier euer Vergleich.</p></section>`;
 const b=p.week,d=Math.abs(a-b),lead=a===b?0:a>b?1:-1,share=a+b?a/(a+b)*100:50;
 const txt=(lead===0?'Gleichstand':lead>0?`Du führst mit ${fmt(d)}`:`${esc(p.name)} führt · dir fehlen ${fmt(d+1)}`)+(typeof weekGoal==='function'&&weekGoal(wk(Date.now()))<S.goal?` · Reise-Woche: Ziel ${weekGoal(wk(Date.now()))} statt ${S.goal}`:'');
 const split=Math.max(12,Math.min(88,share));
 return `<section class="board split" data-bd="1" role="button" aria-expanded="${boardOpen}" style="--split:${split.toFixed(1)}%">${meCol(lead>0)}
 <div class="bmid"><span class="bk">Woche</span><b class="cond">${fmt(a)}<i>:</i>${fmt(b)}</b><em class="${lead>0?'me':lead<0?'pa':''}">${txt}</em></div>
 <div class="bp pa">${lead<0?CROWN:''}${avaHtml(p.name,false)}<span class="bn">${esc(p.name)}</span><b class="cond bpt">${fmt(p.today)}</b><small>heute${p.tr?' · '+esc(p.tr):''}</small></div>
 <div class="bbar" aria-label="Anteil an den Wochenpunkten"><i style="width:${share.toFixed(1)}%"></i><s></s></div><small class="bmore">${boardOpen?'weniger ▴':'Details ▾'}</small></section>${boardOpen?boardDetail(a,p,lead,d):''}`}
/* Bild klein und quadratisch rechnen (Mitte), JPEG */
function picShrink(file,size=160){return new Promise((res,rej)=>{const img=new Image(),u=URL.createObjectURL(file);img.onload=()=>{const c=document.createElement('canvas');c.width=c.height=size;const s=Math.min(img.width,img.height);
 c.getContext('2d').drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,size,size);URL.revokeObjectURL(u);res(c.toDataURL('image/jpeg',.8))};img.onerror=()=>rej(new Error('Bild nicht lesbar'));img.src=u})}
async function picPublish(){if(!HA.url||!HA.token||!S.prof.name)return;const me=slugN(S.prof.name);
 try{const r=await haCall([{type:'call_service',domain:'todo',service:'get_items',target:{entity_id:SHARE_E},return_response:true}]);
  const its=((((r[0]||{}).result||{}).response||{})[SHARE_E]||{}).items||[],old=its.filter(it=>{try{const j=JSON.parse(it.description||'');return j.kind==='avatar'&&j.from===me}catch(e){return false}});
  const cmds=old.map(it=>({type:'call_service',domain:'todo',service:'remove_item',target:{entity_id:SHARE_E},service_data:{item:it.uid}}));
  if(S.prof.pic)cmds.push({type:'call_service',domain:'todo',service:'add_item',target:{entity_id:SHARE_E},service_data:{item:`Profilbild: ${S.prof.name}`,description:JSON.stringify({v:1,kind:'avatar',to:'*',from:me,pic:S.prof.pic})}});
  if(cmds.length)await haCall(cmds)}catch(e){}}
/* Profilbilder der anderen aus der Liste übernehmen (wird von shareFetch aufgerufen) */
function picsFrom(items){const me=slugN(S.prof.name||'');let ch=false;
 for(const it of items){let j;try{j=JSON.parse(it.description||'')}catch(e){continue}if(j.kind!=='avatar'||!j.from||j.from===me||!/^data:image\//.test(j.pic||''))continue;if(PICS[j.from]!==j.pic){PICS[j.from]=j.pic;ch=true}}
 if(ch){try{localStorage.setItem('sc.pics',JSON.stringify(PICS))}catch(e){}}return ch}
function picProfileHtml(){return `<div class="picrow">${avaHtml(S.prof.name||'Ich',true,'big')}<div><b>Profilbild</b><small>Sieht auch ${esc((boardPartner()||{}).name||'dein Partner')} auf der Startseite.</small><div class="picb"><label class="filebtn">Foto wählen<input type="file" accept="image/*" data-pic="file" hidden></label>${S.prof.pic?'<button class="ghost" data-pic="rm">Entfernen</button>':''}</div></div></div>`}
document.addEventListener('change',async ev=>{const t=ev.target;if(t.dataset.pic!=='file'||!t.files||!t.files[0])return;
 const f=t.files[0];t.value='';cropOpen(f)});
/* Bildausschnitt wählen: Foto verschieben (ziehen) und zoomen (Regler oder zwei Finger), Kreis zeigt das spätere Profilbild */
const CROP=280;let crop=null;
const cropEl=(()=>{const d=document.createElement('div');d.id='crop';d.className='crop';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-label','Bildausschnitt wählen');
 d.innerHTML=`<div class="cbox"><b>Ausschnitt wählen</b><small>Foto verschieben und zoomen – der Kreis wird dein Profilbild.</small><div class="cstage" id="cstage"><img id="cimg" alt="" draggable="false"><i class="cmask"></i></div>
 <input type="range" id="czoom" min="1" max="4" step="0.01" value="1" aria-label="Zoom"><div class="cbtn"><button data-crop="no">Abbrechen</button><button class="primary" data-crop="ok">Übernehmen</button></div></div>`;document.body.appendChild(d);return d})();
function cropOpen(file){const u=URL.createObjectURL(file),img=new Image();img.onload=()=>{const s0=CROP/Math.min(img.width,img.height);crop={img,u,s0,k:1,x:(CROP-img.width*s0)/2,y:(CROP-img.height*s0)/2};
 $('cimg').src=u;$('czoom').value=1;cropDraw();cropEl.classList.add('on');document.documentElement.classList.add('sheet-open')};img.onerror=()=>{URL.revokeObjectURL(u);note('Bild nicht lesbar')};img.src=u}
function cropClamp(){const c=crop,w=c.img.width*c.s0*c.k,h=c.img.height*c.s0*c.k;c.x=Math.min(0,Math.max(CROP-w,c.x));c.y=Math.min(0,Math.max(CROP-h,c.y))}
function cropDraw(){if(!crop)return;cropClamp();const c=crop,im=$('cimg');im.style.width=(c.img.width*c.s0*c.k)+'px';im.style.height=(c.img.height*c.s0*c.k)+'px';im.style.transform=`translate(${c.x}px,${c.y}px)`}
function cropZoom(k,cx=CROP/2,cy=CROP/2){const c=crop;if(!c)return;k=Math.min(4,Math.max(1,k));const r=k/c.k;c.x=cx-(cx-c.x)*r;c.y=cy-(cy-c.y)*r;c.k=k;$('czoom').value=k;cropDraw()}
function cropClose(){if(crop)URL.revokeObjectURL(crop.u);crop=null;cropEl.classList.remove('on');document.documentElement.classList.remove('sheet-open')}
function cropResult(size=160){const c=crop,sc=c.s0*c.k,cv=document.createElement('canvas');cv.width=cv.height=size;cv.getContext('2d').drawImage(c.img,-c.x/sc,-c.y/sc,CROP/sc,CROP/sc,0,0,size,size);return cv.toDataURL('image/jpeg',.8)}
cropEl.addEventListener('input',ev=>{if(ev.target.id==='czoom')cropZoom(+ev.target.value)});
cropEl.addEventListener('click',ev=>{const b=ev.target.closest('[data-crop]');if(!b||!crop)return;if(b.dataset.crop==='ok'){S.prof.pic=cropResult();S.metaT=Date.now();persist();note('Profilbild gespeichert');cropClose();render();picPublish()}else cropClose()});
{const pts=new Map();let last=null,dist=0;const st=()=>$('cstage');
 cropEl.addEventListener('pointerdown',ev=>{if(!ev.target.closest('#cstage')||!crop)return;ev.preventDefault();pts.set(ev.pointerId,[ev.clientX,ev.clientY]);try{st().setPointerCapture(ev.pointerId)}catch(e){}
  if(pts.size===2){const [a,b]=[...pts.values()];dist=Math.hypot(a[0]-b[0],a[1]-b[1])}last=[ev.clientX,ev.clientY]});
 cropEl.addEventListener('pointermove',ev=>{if(!pts.has(ev.pointerId)||!crop)return;pts.set(ev.pointerId,[ev.clientX,ev.clientY]);
  if(pts.size===2){const [a,b]=[...pts.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]),r=st().getBoundingClientRect();if(dist)cropZoom(crop.k*d/dist,(a[0]+b[0])/2-r.left,(a[1]+b[1])/2-r.top);dist=d;return}
  crop.x+=ev.clientX-last[0];crop.y+=ev.clientY-last[1];last=[ev.clientX,ev.clientY];cropDraw()});
 const up=ev=>{pts.delete(ev.pointerId);dist=0;const v=[...pts.values()][0];if(v)last=v};cropEl.addEventListener('pointerup',up);cropEl.addEventListener('pointercancel',up)}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-pic="rm"]');if(!b)return;delete S.prof.pic;S.metaT=Date.now();persist();render();picPublish()});
