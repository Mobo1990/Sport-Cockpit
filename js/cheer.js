/* Duo – Erfolgs-Momente: Konfetti und ein großes Lob, wenn etwas geschafft ist.
   cheer({big,title,sub,pts}) – big = Vollbild (Training, Workout, alle Challenges, Wochen-Challenge),
   sonst eine kleine Einblendung oben (Wasserziel, Proteinziel, eine Challenge, Bestwert). Antippen schließt. */
'use strict';
const CHEER_WORDS=['Stark!','Sauber!','Läuft bei dir!','Richtig gut!','Weiter so!','Geschafft!'];
const CHEER_COLORS=['#ff4b26','#ffb020','#6f8f7e','#c4917f','#111214','#ffd166'];
const cheerWord=()=>CHEER_WORDS[Math.floor(Math.random()*CHEER_WORDS.length)];
const cheerEl=(()=>{const d=document.createElement('div');d.id='cheer';d.className='cheer';d.setAttribute('role','status');d.setAttribute('aria-live','polite');
 d.innerHTML='<canvas aria-hidden="true"></canvas><div class="chc"><b class="cond"></b><span></span><em class="cond"></em></div>';document.body.appendChild(d);return d})();
let cheerT=null,cheerRaf=0,cheerBig=false;
function cheer(o){o=o||{};if(cheerEl.classList.contains('on')&&cheerBig&&!o.big)return;/* ein großer Moment wird nicht von einem kleinen überdeckt */
 clearTimeout(cheerT);cancelAnimationFrame(cheerRaf);cheerBig=!!o.big;
 cheerEl.className='cheer on '+(o.big?'big':'small');cheerEl.querySelector('b').textContent=o.title||cheerWord();cheerEl.querySelector('span').textContent=o.sub||'';
 const em=cheerEl.querySelector('em'),pts=Math.round(o.pts||0);em.textContent=pts?'+0':'';
 if(pts){const t0=performance.now(),run=t=>{const k=Math.min(1,(t-t0)/350);em.textContent='+'+Math.round(pts*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(run)};requestAnimationFrame(run)}
 try{navigator.vibrate&&navigator.vibrate(o.big?[40,60,40,60,120]:[30,40,60])}catch(e){}
 if(!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches))confetti(o.big?150:45,!o.big);
 cheerT=setTimeout(cheerHide,o.big?2600:1700)}
function cheerHide(){clearTimeout(cheerT);cancelAnimationFrame(cheerRaf);cheerEl.classList.remove('on');cheerBig=false}
cheerEl.addEventListener('click',cheerHide);
/* Konfetti auf einer Leinwand: Teilchen fliegen von unten bzw. oben auf, fallen mit Schwerkraft, drehen sich */
function confetti(n,top){const cv=cheerEl.querySelector('canvas'),dpr=Math.min(2,window.devicePixelRatio||1),W=innerWidth,H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;
 const x=cv.getContext('2d');if(!x)return;x.scale(dpr,dpr);const P=Array.from({length:n},()=>{const a=top?Math.PI/2+(Math.random()-.5)*1.6:-Math.PI/2+(Math.random()-.5)*1.1,v=top?3+Math.random()*5:9+Math.random()*9;
  return{x:top?W/2+(Math.random()-.5)*120:W*(.2+Math.random()*.6),y:top?70:H+10,vx:Math.cos(a)*v,vy:Math.sin(a)*v,r:Math.random()*6,s:5+Math.random()*6,w:Math.random()*.3+.1,c:CHEER_COLORS[Math.floor(Math.random()*CHEER_COLORS.length)]}});
 const t0=performance.now(),dur=top?1500:2300;
 const step=t=>{const k=(t-t0)/dur;x.clearRect(0,0,W,H);for(const p of P){p.vy+=.28;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.w;x.save();x.globalAlpha=Math.max(0,1-Math.max(0,k-.6)/.4);x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);x.restore()}
  if(k<1)cheerRaf=requestAnimationFrame(step);else x.clearRect(0,0,W,H)};cheerRaf=requestAnimationFrame(step)}
/* Neu erreichte Tagesziele (Wasser, Protein, Schritte, Alkoholfrei …) nach einer Eingabe feiern.
   Kalorien zählen erst am Tagesende – dafür gibt es unterwegs keinen Jubel. */
const CHEER_SKIP=/Kalorien|Defizit|Überschuss|gehalten|nah dran|Gewogen|Challenges|Training|Cardio|Kurz-Workout/;
function cheerFrom(d){try{return dayScore(d).why.slice()}catch(e){return[]}}
function cheerDiff(d,before){if(!before)return;const now=cheerFrom(d),neu=now.filter(x=>!before.includes(x)&&!CHEER_SKIP.test(x));if(!neu.length)return;
 const pts=neu.reduce((a,x)=>a+(+((x.match(/\+(\d+)$/)||[])[1]||0)),0);cheer({title:cheerWord(),sub:neu.map(x=>x.replace(/\s*\+\d+$/,'')).join(' · '),pts})}
