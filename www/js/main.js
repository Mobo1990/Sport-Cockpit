/* Sport Cockpit – Start der App */
'use strict';
/* ===================== START ===================== */
lsLoad();{const ld=lastDay();if(ld)day=DAYS[ld].nx}
if(location.hash==='#nut')view='nut';
render();note(HA.token?'Lokal · verbinde …':'Nur auf diesem Gerät');
syncNow();
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).catch(()=>{});
/* iOS: Fenster an die sichtbare Fläche (ohne Tastatur) anpassen */
if(window.visualViewport){const vv=window.visualViewport;let raf=0;const fit=()=>{raf=0;const r=document.documentElement.style;r.setProperty('--vvh',Math.round(vv.height)+'px');r.setProperty('--vvt',Math.round(vv.offsetTop)+'px')},q=()=>{if(!raf)raf=requestAnimationFrame(fit)};vv.addEventListener('resize',q);vv.addEventListener('scroll',q);fit()}
