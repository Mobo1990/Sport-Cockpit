/* Sport Cockpit – Start der App */
'use strict';
/* ===================== START ===================== */
lsLoad();if(planMigrate())savePlan();{const ld=lastDay();if(ld)day=DAYS[ld].nx}
if(location.hash==='#nut')view='nut';
render();note(HA.token?'Lokal · verbinde …':'Nur auf diesem Gerät');
syncNow();
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).catch(()=>{});
/* iOS: Fenster an die sichtbare Fläche (ohne Tastatur) anpassen */
if(window.visualViewport){const vv=window.visualViewport;let raf=0;let kbWas=false;const fit=()=>{raf=0;const de=document.documentElement,r=de.style;r.setProperty('--vvh',Math.round(vv.height)+'px');r.setProperty('--vvt',Math.round(vv.offsetTop)+'px');
  /* Tastatur offen: Leiste unten ausblenden. Danach Leiste neu setzen – iOS lässt fest positionierte Elemente sonst manchmal mitten im Bild hängen */
  const kb=innerHeight-vv.height>120;de.classList.toggle('kbopen',kb);if(kbWas&&!kb)navFix();kbWas=kb},q=()=>{if(!raf)raf=requestAnimationFrame(fit)};vv.addEventListener('resize',q);vv.addEventListener('scroll',q);fit()}

function navFix(){setTimeout(()=>{const n=document.querySelector('.nav');window.scrollTo(window.scrollX,window.scrollY);if(!n)return;n.style.display='none';void n.offsetHeight;n.style.display=''},60)}
document.addEventListener('focusout',ev=>{if(/^(INPUT|TEXTAREA|SELECT)$/.test(ev.target.tagName))setTimeout(()=>{const a=document.activeElement;if(!a||!/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))navFix()},250)});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)navFix()});
/* Tastatur: Elemente mit role=button per Enter/Leertaste bedienbar */
document.addEventListener('keydown',ev=>{const t=ev.target;if((ev.key==='Enter'||ev.key===' ')&&t&&t.getAttribute&&t.getAttribute('role')==='button'&&t.tagName!=='BUTTON'){ev.preventDefault();t.click()}});
