/* Sport Cockpit – Start der App */
'use strict';
/* ===================== START ===================== */
lsLoad();if(planMigrate())savePlan();{const ld=lastDay();if(ld)day=DAYS[ld].nx}
if(location.hash==='#nut')view='nut';
render();note(HA.token?'Lokal · verbinde …':'Nur auf diesem Gerät');
syncNow();
/* Updates: Handy-Apps laufen oft tagelang im Hintergrund weiter. Beim Zurückkehren nach neuer Version fragen;
   übernimmt eine neue Version, lädt die App neu – aber nie mitten im Workout, im Rezept oder bei offenem Eingabefenster. */
let swHad=false,swPend=false,swHid=0;
const swBusy=()=>!!(document.querySelector('.wo.on,.recv.on,#crop.on')||(typeof sheet!=='undefined'&&sheet)||document.activeElement&&/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName));
function swAutoReload(){if(swBusy()){swPend=true;return false}location.reload();return true}
if('serviceWorker' in navigator){swHad=!!navigator.serviceWorker.controller;
 navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).catch(()=>{});
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(swHad)swAutoReload();swHad=true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){swHid=Date.now();return}
  if(swPend&&!swBusy()){location.reload();return}
  if(swHid&&Date.now()-swHid>5*60000)navigator.serviceWorker.getRegistration().then(r=>r&&r.update()).catch(()=>{})})}
/* iOS: Fenster an die sichtbare Fläche (ohne Tastatur) anpassen */
if(window.visualViewport){const vv=window.visualViewport;let raf=0;let kbWas=false;const fit=()=>{raf=0;const de=document.documentElement,r=de.style;r.setProperty('--vvh',Math.round(vv.height)+'px');r.setProperty('--vvt',Math.round(vv.offsetTop)+'px');
  /* Tastatur offen: Leiste unten ausblenden. Danach Leiste neu setzen – iOS lässt fest positionierte Elemente sonst manchmal mitten im Bild hängen */
  const kb=innerHeight-vv.height>120;de.classList.toggle('kbopen',kb);if(kbWas&&!kb)navFix();kbWas=kb},q=()=>{if(!raf)raf=requestAnimationFrame(fit)};vv.addEventListener('resize',q);vv.addEventListener('scroll',q);fit()}

function navFix(){setTimeout(()=>{const n=document.querySelector('.nav');window.scrollTo(window.scrollX,window.scrollY);if(!n)return;n.style.display='none';void n.offsetHeight;n.style.display=''},60)}
document.addEventListener('focusout',ev=>{if(/^(INPUT|TEXTAREA|SELECT)$/.test(ev.target.tagName))setTimeout(()=>{const a=document.activeElement;if(!a||!/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))navFix()},250)});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)navFix()});
