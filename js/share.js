/* Sport Cockpit – Gemeinsam gegessen: Essen für den Partner miteintragen.
   Übergabe über die HA-Liste todo.sport_cockpit_geteiltes_essen (Beschreibung = JSON). Der Empfänger übernimmt per Tipp. */
'use strict';
const SHARE_E='todo.sport_cockpit_geteiltes_essen';
let shareInbox=[],shareRefresh=0;const sharePct={};
const sharePartner=()=>{if(!HA.url||!HA.token)return null;const p=(typeof partners!=='undefined'?partners:[]).find(x=>x.name);return p?p.name:null};
const shareRatio=()=>S.nut.shr||1;
const per100=(it,k)=>it.g>0?Math.round((it[k]||0)/it.g*1000)/10:0;
function sharePayload(items,meal,d,to){return{v:1,to:slugN(to),from:S.prof.name,d,meal,items:items.map(x=>({n:x.name,fid:x.fid||'',g:Math.round(x.pg),k:per100(x,'kcal'),p:per100(x,'p'),c:per100(x,'c'),f:per100(x,'f'),z:per100(x,'z')}))}}
async function shareSend(items,meal,d){const to=sharePartner();if(!to||!items.length)return false;const pl=sharePayload(items,meal,d,to);
 try{const r=await haCall([{type:'call_service',domain:'todo',service:'add_item',target:{entity_id:SHARE_E},service_data:{item:`${S.prof.name} → ${to}: ${mealName(meal)}`,description:JSON.stringify(pl)}}]);
  if(!r[0]||!r[0].success)throw new Error('Liste fehlt');note(`An ${to} geschickt`);
  tell(`${S.prof.name} hat Essen für dich eingetragen`,`${mealName(meal)}: ${pl.items.map(x=>`${x.n} ${fmt(x.g)} g`).join(', ')}\nIn der App übernehmen.`);return true}
 catch(e){note('Teilen nicht möglich: '+e.message);return false}}
async function shareFetch(){if(!HA.url||!HA.token||!S.prof.name)return;
 try{const r=await haCall([{type:'call_service',domain:'todo',service:'get_items',target:{entity_id:SHARE_E},service_data:{status:'needs_action'},return_response:true}]);const m=r[0];if(!m||!m.success)return;
  const its=(((m.result||{}).response||{})[SHARE_E]||{}).items||[],me=slugN(S.prof.name),old=JSON.stringify(shareInbox.map(x=>x.uid));const pch=picsFrom(its)|rewardsFrom(its);
  shareInbox=its.map(it=>{try{return{uid:it.uid,...JSON.parse(it.description||'')}}catch(e){return null}}).filter(x=>x&&x.to===me&&(Array.isArray(x.items)||(x.kind==='say'&&x.text)));
  if((pch||JSON.stringify(shareInbox.map(x=>x.uid))!==old)&&(view==='nut'||view==='home'||view==='more'||view==='rew')&&!sheet)render()}catch(e){}}
async function shareDone(uid){try{await haCall([{type:'call_service',domain:'todo',service:'remove_item',target:{entity_id:SHARE_E},service_data:{item:uid}}])}catch(e){}
 shareInbox=shareInbox.filter(x=>x.uid!==uid);render()}
function shareAccept(uid){const s=shareInbox.find(x=>x.uid===uid);if(!s)return;const f=(sharePct[uid]||100)/100,d=s.d&&s.d<=today()?s.d:today(),dd=ND(d);
 for(const x of s.items){const g=Math.round(x.g*f);dd.items.push(itemFrom({name:x.n,id:x.fid||('sh_'+slugN(x.n)),kcal:x.k,p:x.p,c:x.c,f:x.f,z:x.z},g,s.meal))}
 touch(d);note(`${s.items.length} Lebensmittel von ${s.from} übernommen`);shareDone(uid)}
/* Ansichten */
function shareInboxHtml(){const l=shareInbox.filter(x=>x.kind!=='say');if(!l.length)return '';return l.map(s=>{const p=sharePct[s.uid]||100,kc=s.items.reduce((a,x)=>a+x.k*x.g/100,0)*p/100,day=s.d===today()?'heute':new Date(s.d+'T12:00').toLocaleDateString('de-DE',{weekday:'short',day:'numeric',month:'numeric'});
 return `<section class="shin"><b>${esc(s.from)} hat ${esc(mealName(s.meal))} (${day}) für dich eingetragen</b>
 <ul>${s.items.map(x=>`<li><span>${esc(x.n)}</span><span>${fmt(Math.round(x.g*p/100))} g</span></li>`).join('')}<li class="sum"><span>Zusammen</span><span>${fmt(Math.round(kc))} kcal</span></li></ul>
 <div class="shpct"><span>Deine Portion</span>${[75,100,125].map(v=>`<button data-sh="pct" data-uid="${s.uid}" data-v="${v}" aria-pressed="${p===v}">${v} %</button>`).join('')}</div>
 <div class="shbtn"><button class="primary" data-sh="ok" data-uid="${s.uid}">Übernehmen</button><button class="ghost" data-sh="no" data-uid="${s.uid}">Ablehnen</button></div></section>`}).join('')}
function shareAmtHtml(sh){const to=sharePartner();if(!to)return '';const g=num(sh.g)||0,pg=sh.sgEd?sh.sg:String(Math.round(g*shareRatio()));
 return `<label class="shchk"><input type="checkbox" data-sh-in="on"${sh.share?' checked':''}> Auch für ${esc(to)} eintragen</label>
 ${sh.share?`<div class="shg"><span>${esc(to)} isst</span><input id="shG" inputmode="decimal" data-sh-in="g" value="${esc(pg)}" aria-label="Menge für ${esc(to)} in Gramm"><span>g</span></div>`:''}`}
function shareMealBtn(m,its){const to=sharePartner();its=its.filter(i=>!i.bws);return to&&its.length?`<button class="ghost" data-sh="meal" data-m="${m}">Mit ${esc(to)} teilen</button>`:''}
function shareSheetHtml(sh){const to=sharePartner()||'Partner',d=nDate||today(),its=(S.nut.days[d]||{items:[]}).items.filter(i=>i.meal===sh.meal&&!i.bws),r=sh.ratio||shareRatio();
 return `<button class="back" data-n="close">‹ Zurück</button><h2>${esc(mealName(sh.meal))} mit ${esc(to)} teilen</h2><p class="tip" style="padding:0">${esc(to)} bekommt die Liste und übernimmt sie mit einem Tipp.</p>
 <div class="shpct"><span>${esc(to)} isst</span>${[50,75,100,125].map(v=>`<button data-sh="ratio" data-v="${v}" aria-pressed="${Math.round(r*100)===v}">${v} %</button>`).join('')}</div>
 <div class="shlist">${its.map(i=>`<div class="shrow"><span>${esc(i.name)}<small>du: ${fmt(i.g)} g</small></span><input inputmode="decimal" data-sh-in="mg" data-id="${i.id}" value="${fmt(Math.round(((sh.mg||{})[i.id]??i.g*r)))}" aria-label="Menge für ${esc(to)}"><span>g</span></div>`).join('')}</div>
 <button class="primary" data-sh="send" style="width:100%">An ${esc(to)} schicken</button>`}
/* Lernen: übliches Verhältnis Partner/ich */
function shareLearn(r){if(!(r>0.1&&r<3))return;S.nut.shr=Math.round(((S.nut.shr||1)*0.6+r*0.4)*100)/100;S.metaT=Date.now()}
/* Beim Hinzufügen eines Lebensmittels (Mengen-Schritt) */
function shareOnAdd(sh,item,d){if(!sh.share)return;const pg=num(sh.sgEd?sh.sg:String(Math.round(item.g*shareRatio())));if(!pg||pg<=0)return;shareLearn(pg/item.g);shareSend([{...item,pg}],sh.meal,d)}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-sh]');if(!b)return;const a=b.dataset.sh;
 if(a==='pct'){sharePct[b.dataset.uid]=+b.dataset.v;render()}
 else if(a==='ok')shareAccept(b.dataset.uid);
 else if(a==='no')shareDone(b.dataset.uid);
 else if(a==='meal'){sheet={meal:b.dataset.m,step:'share',ratio:shareRatio(),mg:{}};render()}
 else if(a==='ratio'){sheet.ratio=+b.dataset.v/100;sheet.mg={};render()}
 else if(a==='send'){const d=nDate||today(),its=(S.nut.days[d]||{items:[]}).items.filter(i=>i.meal===sheet.meal&&!i.bws).map(i=>({...i,pg:num(String((sheet.mg||{})[i.id]??Math.round(i.g*(sheet.ratio||shareRatio()))))||0})).filter(i=>i.pg>0);
  const mine=its.reduce((a,i)=>a+i.g,0),theirs=its.reduce((a,i)=>a+i.pg,0);if(mine)shareLearn(theirs/mine);const m=sheet.meal;sheet=null;persist();render();shareSend(its,m,d)}});
document.addEventListener('input',ev=>{const t=ev.target,k=t.dataset.shIn;if(!k||!sheet)return;
 if(k==='on'){sheet.share=t.checked;render()}else if(k==='g'){sheet.sg=t.value;sheet.sgEd=true}else if(k==='mg'){(sheet.mg=sheet.mg||{})[t.dataset.id]=t.value}});
