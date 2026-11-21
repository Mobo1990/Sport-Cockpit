/* Sport Cockpit – Wochen-/Monatsrückblick mit teilbarem Bild */
'use strict';
let rvMode='week',rvOff=0;
function rvRange(){const n=new Date();let a,b;
 if(rvMode==='week'){a=new Date(wk(n));a.setDate(a.getDate()-7*rvOff);b=new Date(a);b.setDate(b.getDate()+7)}
 else{a=new Date(n.getFullYear(),n.getMonth()-rvOff,1);b=new Date(a.getFullYear(),a.getMonth()+1,1)}
 return{a:a.getTime(),b:b.getTime(),label:rvMode==='week'?`Woche ${a.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'})}–${new Date(b-864e5).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'})}`:a.toLocaleDateString('de-DE',{month:'long',year:'numeric'})}}
function rvData(){const {a,b,label}=rvRange(),ss=S.sessions.filter(s=>s.date>=a&&s.date<b),st=ss.filter(s=>s.ex.length);
 const sets=st.reduce((x,s)=>x+s.ex.reduce((y,e)=>y+e.sets.length,0),0),vol_=st.reduce((x,s)=>x+vol(s),0),cmin=ss.reduce((x,s)=>x+(s.cardio||[]).reduce((y,c)=>y+c.min,0),0);
 const days=[];for(let t=a;t<Math.min(b,Date.now()+1);t+=864e5)days.push(iso(t));
 let pts=0,logged=0,pOk=0,kOk=0;for(const d of days){pts+=dayScore(d).pt;const t=totals(d),g=goals(d);if(t.kcal>500){logged++;if(t.p>=g.p*.9)pOk++;if(Math.abs(t.kcal-g.kcal)<=g.kcal*.1)kOk++}}
 const ws=days.map(d=>(S.nut.days[d]||{}).w).filter(Boolean),dw=ws.length>=2?ws[ws.length-1]-ws[0]:null;
 const gains=[];const keys=new Set(st.flatMap(s=>s.ex.map(e=>e.id)));
 for(const k of keys){if(isA(k))continue;let before=0,now=0,name='';for(const s of S.sessions){const x=s.ex.find(e=>e.id===k);if(!x)continue;const m=Math.max(...x.sets.map(t=>e1(t.kg,t.reps)));if(s.date<a)before=Math.max(before,m);else if(s.date<b){now=Math.max(now,m);name=x.name}}
  if(before>0&&now>before)gains.push({name,pct:(now/before-1)*100,now})}
 gains.sort((x,y)=>y.pct-x.pct);
 return{label,n:st.length,sets,vol:vol_,cmin,pts,logged,pOk,kOk,dw,gains:gains.slice(0,5),days:days.length}}
function renderReview(){const r=rvData();
 return `<div class="ndate"><button data-rv="prev" aria-label="Zurück">‹</button><b>${esc(r.label)}</b><button data-rv="next"${rvOff===0?' disabled':''} aria-label="Vor">›</button></div>
 <div class="vars" style="margin-bottom:12px">${[['week','Woche'],['month','Monat']].map(([k,l])=>`<button data-rv="mode" data-v="${k}" aria-pressed="${rvMode===k}">${l}</button>`).join('')}</div>
 <section class="rvgrid">${[[r.n,'Krafteinheiten'],[r.sets,'Sätze'],[fmt(Math.round(r.vol/100)/10)+' t','bewegt'],[r.cmin+' min','Cardio'],[r.pts,'Punkte'],[r.dw==null?'–':(r.dw>0?'+':'')+fmt(r1(r.dw))+' kg','Gewicht']].map(([v,l])=>`<div><b class="cond">${v}</b><span>${l}</span></div>`).join('')}</section>
 <h3 class="sh">Stärker geworden</h3>${r.gains.length?r.gains.map(g=>`<div class="it"><div><b>${esc(g.name)}</b><small>Kraftwert ${fmt(Math.round(g.now))} kg</small></div><span class="hot">+${fmt(r1(g.pct))} %</span><span></span></div>`).join(''):'<p class="tip" style="padding:0">Noch keine Steigerung gegenüber vorher in diesem Zeitraum.</p>'}
 <h3 class="sh">Ernährung</h3><p class="tip" style="padding:0">${r.logged?`An ${r.logged} von ${r.days} Tagen eingetragen · Protein geschafft: ${r.pOk}× · Kalorien im Ziel: ${r.kOk}×`:'Keine Ernährungsdaten in diesem Zeitraum.'}</p>
 <div class="actions"><button class="primary" data-rv="share">Als Bild teilen</button></div><p class="tip" id="rvmsg" style="padding:0"></p>`}
async function rvImage(){const r=rvData(),c=document.createElement('canvas');c.width=1080;c.height=1350;const x=c.getContext('2d');
 x.fillStyle='#0b0c0e';x.fillRect(0,0,1080,1350);x.fillStyle='#ff5a36';x.fillRect(0,0,1080,14);
 const F=(w,s)=>`${w} ${s}px "Barlow Condensed", Barlow, sans-serif`;x.fillStyle='#8f949d';x.font=F(600,40);x.fillText('DUO'+(S.prof.name?' · '+S.prof.name.toUpperCase():''),70,110);
 x.fillStyle='#eeece8';x.font=F(800,96);x.fillText(r.label.toUpperCase(),70,220);
 const cells=[[r.n,'Krafteinheiten'],[r.sets,'Sätze'],[fmt(Math.round(r.vol/100)/10)+' t','bewegt'],[r.cmin+' min','Cardio'],[r.pts,'Punkte'],[r.dw==null?'–':(r.dw>0?'+':'')+fmt(r1(r.dw))+' kg','Gewicht']];
 cells.forEach(([v,l],i)=>{const cx=70+(i%2)*480,cy=300+Math.floor(i/2)*230;x.fillStyle='#141619';x.fillRect(cx,cy,450,200);x.fillStyle=i===4?'#ff5a36':'#eeece8';x.font=F(800,104);x.fillText(String(v),cx+30,cy+120);x.fillStyle='#8f949d';x.font=F(600,38);x.fillText(l,cx+30,cy+170)});
 x.fillStyle='#eeece8';x.font=F(700,52);x.fillText('Stärker geworden',70,1060);x.font=F(600,40);
 (r.gains.length?r.gains.slice(0,3):[{name:'Nächstes Mal!',pct:0}]).forEach((g,i)=>{x.fillStyle='#eeece8';x.fillText(g.name.slice(0,34),70,1130+i*60);if(g.pct){x.fillStyle='#ff5a36';x.textAlign='right';x.fillText('+'+fmt(r1(g.pct))+' %',1010,1130+i*60);x.textAlign='left'}});
 return new Promise(res=>c.toBlob(res,'image/png'))}
document.addEventListener('click',async ev=>{const b=ev.target.closest('[data-rv]');if(!b)return;const a=b.dataset.rv;
 if(a==='prev')rvOff++;else if(a==='next')rvOff=Math.max(0,rvOff-1);else if(a==='mode'){rvMode=b.dataset.v;rvOff=0}
 else if(a==='share'){try{const blob=await rvImage(),file=new File([blob],'sport-cockpit-rueckblick.png',{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'Mein Sport-Rückblick'})}else{const u=URL.createObjectURL(blob),l=document.createElement('a');l.href=u;l.download=file.name;l.click();setTimeout(()=>URL.revokeObjectURL(u),5000)}}catch(e){if(e&&e.name!=='AbortError')$('rvmsg').textContent='Teilen nicht möglich: '+e.message}return}
 render()});
