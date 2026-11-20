/* Sport Cockpit – Duell: Wochenpunkte als kleine, täglich wechselnde Szene (Tauziehen, Rennen, Wippe …) */
'use strict';
const DUEL_ME='#111214',DUEL_PA='#ff4b26',DUEL_GR='#d8d5ce';
let duelOff=0;
/* Strichfigur, Füße bei (0,0), schaut nach rechts. p: hip, sh, head, legs[2], arms[2] */
const POSE={
 stand:{hip:[0,-28],sh:[0,-52],head:[0,-63],legs:[[-8,0],[8,0]],arms:[[-12,-34],[12,-34]]},
 pull:{hip:[-6,-28],sh:[-18,-50],head:[-23,-61],legs:[[-22,0],[6,0]],arms:[[12,-40],[16,-38]]},
 run:{hip:[0,-28],sh:[6,-52],head:[9,-63],legs:[[16,-3],[-14,-7]],arms:[[18,-44],[-12,-36]]},
 cheer:{hip:[0,-28],sh:[0,-52],head:[0,-63],legs:[[-9,0],[9,0]],arms:[[-16,-74],[16,-74]]},
 sit:{hip:[0,-12],sh:[0,-36],head:[0,-47],legs:[[16,-8],[20,2]],arms:[[12,-22],[-8,-20]]},
 climb:{hip:[0,-28],sh:[7,-50],head:[11,-60],legs:[[-8,0],[10,-12]],arms:[[18,-64],[22,-56]]},
 lift:{hip:[0,-28],sh:[0,-52],head:[0,-63],legs:[[-13,0],[13,0]],arms:[[-16,-80],[16,-80]]},
 sag:{hip:[0,-26],sh:[3,-48],head:[5,-58],legs:[[-11,0],[11,0]],arms:[[-14,-62],[14,-62]]},
 wrestle:{hip:[0,-22],sh:[10,-44],head:[12,-55],legs:[[14,-20],[16,0]],arms:[[26,-30],[30,-42]]}};
function fig(x,y,c,pose,o={}){const p=POSE[pose],k=o.k||1,fl=o.flip?-1:1,L=(a,b)=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`;
 return `<g class="dfig${o.cls?' '+o.cls:''}" transform="translate(${x.toFixed(1)},${y}) scale(${fl*k},${k})" stroke="${c}" stroke-width="5" stroke-linecap="round" fill="none">${L(p.hip,p.legs[0])+L(p.hip,p.legs[1])+L(p.hip,p.sh)+L(p.sh,p.arms[0])+L(p.sh,p.arms[1])}<circle cx="${p.head[0]}" cy="${p.head[1]}" r="9" fill="${c}" stroke="none"/></g>`}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
/* t: -1 … 1 (positiv = ich vorne), a/b: Wochenpunkte */
const SCENES=[
 {n:'Tauziehen',draw:(t,a,b)=>{const s=-t*55,k=160+s;return `<line x1="160" y1="132" x2="160" y2="104" stroke="${DUEL_GR}" stroke-width="3" stroke-dasharray="5 5"/><line x1="14" y1="132" x2="306" y2="132" stroke="${DUEL_GR}" stroke-width="3"/>
  <line x1="${48+s}" y1="92" x2="${272+s}" y2="92" stroke="#8a7a5e" stroke-width="4"/><path d="M${k} 92 l-7 16 h14z" fill="${t>=0?DUEL_ME:DUEL_PA}"/>
  ${fig(70+s,132,DUEL_ME,'pull',{cls:t>0.15?'dlead':''})}${fig(250+s,132,DUEL_PA,'pull',{flip:1,cls:t<-0.15?'dlead':''})}
  ${Math.abs(t)>0.3?`<g stroke="${DUEL_GR}" stroke-width="3" stroke-linecap="round">${t>0?`<line x1="${262+s}" y1="128" x2="${276+s}" y2="128"/><line x1="${266+s}" y1="122" x2="${280+s}" y2="122"/>`:`<line x1="${44+s}" y1="128" x2="${58+s}" y2="128"/><line x1="${40+s}" y1="122" x2="${54+s}" y2="122"/>`}</g>`:''}`}},
 {n:'Wettrennen',draw:(t,a,b)=>{const m=Math.max(a,b,40)*1.15,px=v=>34+clamp(v/m,0,1)*236,xa=px(a),xb=px(b);
  const chk=[...Array(6)].map((_,i)=>`<rect x="${i%2?296:302}" y="${16+i*20}" width="6" height="20" fill="${DUEL_ME}"/>`).join('');
  const dust=x=>`<g stroke="${DUEL_GR}" stroke-width="3" stroke-linecap="round"><line x1="${x-26}" y1="-22" x2="${x-40}" y2="-22"/><line x1="${x-24}" y1="-12" x2="${x-34}" y2="-12"/></g>`;
  return `<line x1="10" y1="72" x2="310" y2="72" stroke="${DUEL_GR}" stroke-width="3"/><line x1="10" y1="136" x2="310" y2="136" stroke="${DUEL_GR}" stroke-width="3"/>${chk}
  <g transform="translate(0,72)">${xa>=xb?dust(xa):''}</g>${fig(xa,72,DUEL_ME,'run',{k:0.8,cls:xa>xb?'dlead':''})}
  <g transform="translate(0,136)">${xb>xa?dust(xb):''}</g>${fig(xb,136,DUEL_PA,'run',{k:0.8,cls:xb>xa?'dlead':''})}`}},
 {n:'Wippe',draw:(t)=>{const ang=-clamp(t,-1,1)*13;return `<path d="M160 104 l-16 30 h32z" fill="${DUEL_GR}"/><line x1="14" y1="134" x2="306" y2="134" stroke="${DUEL_GR}" stroke-width="3"/>
  <g transform="rotate(${ang.toFixed(1)} 160 104)"><line x1="40" y1="104" x2="280" y2="104" stroke="#8a7a5e" stroke-width="7" stroke-linecap="round"/>${fig(62,100,DUEL_ME,'sit',{cls:t>0.15?'dlead':''})}${fig(258,100,DUEL_PA,'sit',{flip:1,cls:t<-0.15?'dlead':''})}</g>`}},
 {n:'Gipfelsturm',draw:(t,a,b)=>{const g=Math.max(a,b,50)*1.25,pa=clamp(a/g,0,1),pb=clamp(b/g,0,1);
  return `<path d="M10 140 L160 18 L310 140 Z" fill="#ece9e2"/><path d="M160 18 L138 36 L150 33 L160 42 L170 33 L182 36 Z" fill="#fff"/><line x1="160" y1="18" x2="160" y2="-4" stroke="${DUEL_ME}" stroke-width="3"/><path d="M160 -4 l18 6 l-18 6z" fill="${DUEL_PA}"/>
  ${fig(18+142*pa,140-122*pa,DUEL_ME,'climb',{k:0.62,cls:a>b?'dlead':''})}${fig(302-142*pb,140-122*pb,DUEL_PA,'climb',{k:0.62,flip:1,cls:b>a?'dlead':''})}`}},
 {n:'Gewichtheben',draw:(t,a,b)=>{const m=Math.max(a,b,1),na=1+Math.round(clamp(a/m,0,1)*4),nb=1+Math.round(clamp(b/m,0,1)*4);
  const bar=(x,n,c)=>{const pl=[...Array(n)].map((_,i)=>`<rect x="${x-36-i*7}" y="${-88-n*1.5}" width="6" height="${16+n*3}" rx="2" fill="${c}"/><rect x="${x+30+i*7}" y="${-88-n*1.5}" width="6" height="${16+n*3}" rx="2" fill="${c}"/>`).join('');return `<line x1="${x-40-n*7}" y1="-80" x2="${x+40+n*7}" y2="-80" stroke="#8a7a5e" stroke-width="4" stroke-linecap="round"/>${pl}`};
  return `<line x1="14" y1="136" x2="306" y2="136" stroke="${DUEL_GR}" stroke-width="3"/><g transform="translate(0,136)">${bar(85,na,DUEL_ME)}${bar(235,nb,DUEL_PA)}</g>
  ${fig(85,136,DUEL_ME,na>=nb?'lift':'sag',{cls:a>b?'dlead':''})}${fig(235,136,DUEL_PA,nb>=na?'lift':'sag',{flip:1,cls:b>a?'dlead':''})}`}},
 {n:'Armdrücken',draw:(t)=>{const hx=160+clamp(t,-1,1)*26,hy=74+Math.abs(clamp(t,-1,1))*22;
  return `<rect x="96" y="100" width="128" height="10" rx="3" fill="#8a7a5e"/><line x1="112" y1="110" x2="112" y2="138" stroke="#8a7a5e" stroke-width="5"/><line x1="208" y1="110" x2="208" y2="138" stroke="#8a7a5e" stroke-width="5"/>
  ${fig(82,128,DUEL_ME,'stand',{k:0.95,cls:t>0.15?'dlead':''})}${fig(238,128,DUEL_PA,'stand',{k:0.95,flip:1,cls:t<-0.15?'dlead':''})}
  <g stroke-linecap="round" stroke-width="6"><line x1="138" y1="98" x2="${hx-3}" y2="${hy}" stroke="${DUEL_ME}"/><line x1="182" y1="98" x2="${hx+3}" y2="${hy}" stroke="${DUEL_PA}"/><line x1="94" y1="80" x2="138" y2="98" stroke="${DUEL_ME}"/><line x1="226" y1="80" x2="182" y2="98" stroke="${DUEL_PA}"/></g><circle cx="${hx}" cy="${hy}" r="7" fill="#c9b79a"/>`}}];
/* Sprüche: {L} vorne, {F} hinten, {D} Abstand */
const DUEL_TXT={
 big:['{L} zieht davon – {F}, das Sofa ist heute kein Trainingsgerät.','{F} sucht noch den Turbo. {L} hat ihn schon gefunden.','{D} Punkte Vorsprung. {L} wird langsam übermütig.','{F}, keine Panik: Ein Proteinshake ist auch ein Anfang.','{L} macht ernst. {F} macht … hoffentlich gleich ernst.'],
 small:['Knapp! {L} liegt nur {D} Punkte vorne.','Kopf an Kopf – ein Glas Wasser kann hier alles entscheiden.','{F} ist dicht dran. {L} sollte nicht zu früh feiern.','Noch ist nichts entschieden: {D} Punkte sind eine Challenge.','{L} vorne – aber {F} hört man schon schnaufen.'],
 tie:['Gleichstand! Wer heute mehr Wasser trinkt, gewinnt die Ehre.','Unentschieden. Das schreit nach einem Rückspiel.','Perfekte Balance – fast schon kitschig.','Gleich auf. Jetzt zählt jeder Liegestütz.']};
function duelPartner(){const p=(typeof partners!=='undefined'?partners:[]).find(x=>x.name);if(!p)return null;const inWeek=p.d&&wk(new Date(p.d+'T12:00:00'))===wk(Date.now());
 return{name:p.name,week:inWeek?(+p.wp||0):0,today:p.d===today()?(+p.pt||0):0}}
function duelHtml(){const p=duelPartner();if(!p)return '';setTimeout(duelPaint,0);const me=S.prof.name||'Ich',a=weekScore(),b=p.week,d=Math.abs(a-b),m=Math.max(a,b,20),t=clamp((a-b)/m,-1,1);
 const dn=Math.floor(Date.now()/864e5),si=((dn+duelOff)%SCENES.length+SCENES.length)%SCENES.length,sc=SCENES[si];
 const st=d<3?'tie':d/m>0.25||d>=40?'big':'small',L=a>=b?me:p.name,F=a>=b?p.name:me,pool=DUEL_TXT[st],cap=pool[(dn*7+si)%pool.length].replace(/\{L\}/g,esc(L)).replace(/\{F\}/g,esc(F)).replace(/\{D\}/g,fmt(d));
 const hint=st==='tie'?'Jeder Punkt zählt – alle 3 Challenges bringen bis zu +25.':a<b?`Dir fehlen ${fmt(d)} Punkte – z. B. alle 3 Challenges (bis +25) oder das Wasserziel (+10).`:`${esc(p.name)} braucht ${fmt(d)} Punkte zum Gleichstand.`;
 return `<section class="duel" aria-label="Duell diese Woche"><div class="dh"><span>Duell · diese Woche</span><button class="dnext" data-duel-next aria-label="Andere Szene">${esc(sc.n)} ›</button></div>
 <div class="dscore"><div class="${a>b?'win':''}"><b class="cond">${fmt(a)}</b><span>${esc(me)}</span></div><i>:</i><div class="pa${b>a?' win':''}"><b class="cond">${fmt(b)}</b><span>${esc(p.name)}</span></div></div>
 <div class="dpanel" role="img" aria-label="${esc(sc.n)}: ${esc(L)} ${st==='tie'?'gleichauf':'vorne'}"><canvas class="dpix" width="${PIX_W}" height="${PIX_H}" data-svg="${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 -8 320 150' width='320' height='150'>${sc.draw(t,a,b).replace(/"/g,"'")}</svg>`)}"></canvas>${duelBubbles(st,a>=b,dn+si)}</div>
 <p class="dcap">${cap}</p><p class="dsub">Heute ${fmt(dayScore(today()).pt)} : ${fmt(p.today)} · Zusammen diese Woche ${fmt(a+b)} Punkte<br>${hint}</p></section>`}
/* Pixel-Art: Szene klein rastern, auf feste Palette bringen, groß und kantig anzeigen */
const PIX_W=128,PIX_H=60,PIX_PAL=[[17,18,20],[255,75,38],[216,213,206],[138,122,94],[236,233,226],[255,255,255],[201,183,154]];
function duelPaint(){document.querySelectorAll('canvas.dpix:not([data-done])').forEach(cv=>{cv.dataset.done=1;const img=new Image();img.onload=()=>{const c=cv.getContext('2d');c.imageSmoothingEnabled=true;c.clearRect(0,0,PIX_W,PIX_H);c.drawImage(img,0,0,PIX_W,PIX_H);
 const d=c.getImageData(0,0,PIX_W,PIX_H),px=d.data;for(let i=0;i<px.length;i+=4){if(px[i+3]<100){px[i+3]=0;continue}let best=0,bd=1e9;for(let j=0;j<PIX_PAL.length;j++){const q=PIX_PAL[j],e=(px[i]-q[0])**2+(px[i+1]-q[1])**2+(px[i+2]-q[2])**2;if(e<bd){bd=e;best=j}}const q=PIX_PAL[best];px[i]=q[0];px[i+1]=q[1];px[i+2]=q[2];px[i+3]=255}
 c.putImageData(d,0,0)};img.src='data:image/svg+xml;charset=utf-8,'+cv.dataset.svg})}
/* Comic-Ebene: Sprechblasen und Effektwort */
const BUB={lead:['EASY!','ZACK!','LÄUFT!','HAHA!','TSCHÜSS!','KOMM SCHON!'],trail:['HILFE!','PUH...','WARTE!','MORGEN!','NOCH NICHT!','UFF!'],tie:['DU?!','ICH!','NIE!','LOS!'],fx:['POW!','WUSCH!','KRACH!','ZONK!','BÄM!']};
function duelBubbles(st,meLead,seed){const pick=(a,k)=>a[(seed*3+k)%a.length];
 if(st==='tie')return `<span class="dbub l">${pick(BUB.tie,0)}</span><span class="dbub r">${pick(BUB.tie,1)}</span>`;
 return `<span class="dbub ${meLead?'l':'r'}">${pick(BUB.lead,0)}</span><span class="dbub ${meLead?'r':'l'} small">${pick(BUB.trail,1)}</span>${st==='big'?`<span class="dfx">${pick(BUB.fx,2)}</span>`:''}`}
document.addEventListener('click',ev=>{if(!ev.target.closest('[data-duel-next]'))return;duelOff++;const el=document.querySelector('.duel');if(el){el.outerHTML=duelHtml();duelPaint()}});
