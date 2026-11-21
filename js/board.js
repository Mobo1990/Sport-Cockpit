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
function boardHtml(sc){const me=S.prof.name||'Ich',p=boardPartner(),a=weekScore(),ta=sc.pt;
 const meCol=lead=>`<div class="bp"><label class="avawrap" title="Profilbild ändern">${lead?CROWN:''}${avaHtml(me,true)}<input type="file" accept="image/*" data-pic="file" hidden></label><span class="bn">${esc(me)}</span><span class="pts"><b class="cond">${fmt(ta)}</b></span><small>heute</small></div>`;
 if(!p)return `<section class="board solo">${meCol(false)}<div class="bmid"><span class="bk">Woche</span><b class="cond">${fmt(a)}</b><em>Punkte</em></div><p class="bhint">Sobald Pauline mit Home Assistant verbunden ist, steht hier euer Vergleich.</p></section>`;
 const b=p.week,d=Math.abs(a-b),lead=a===b?0:a>b?1:-1,share=a+b?a/(a+b)*100:50;
 const txt=lead===0?'Gleichstand':lead>0?`Du führst mit ${fmt(d)}`:`${esc(p.name)} führt mit ${fmt(d)}`;
 const split=Math.max(12,Math.min(88,share));
 return `<section class="board split" style="--split:${split.toFixed(1)}%">${meCol(lead>0)}
 <div class="bmid"><span class="bk">Woche</span><b class="cond">${fmt(a)}<i>:</i>${fmt(b)}</b><em class="${lead>0?'me':lead<0?'pa':''}">${txt}</em></div>
 <div class="bp pa">${lead<0?CROWN:''}${avaHtml(p.name,false)}<span class="bn">${esc(p.name)}</span><b class="cond bpt">${fmt(p.today)}</b><small>heute${p.tr?' · '+esc(p.tr):''}</small></div>
 <div class="bbar" aria-label="Anteil an den Wochenpunkten"><i style="width:${share.toFixed(1)}%"></i><s></s></div></section>`}
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
 try{S.prof.pic=await picShrink(t.files[0]);S.metaT=Date.now();persist();note('Profilbild gespeichert');render();picPublish()}catch(e){note(e.message)}});
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-pic="rm"]');if(!b)return;delete S.prof.pic;S.metaT=Date.now();persist();render();picPublish()});
