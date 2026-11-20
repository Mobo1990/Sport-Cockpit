/* Sport Cockpit – Start der App */
'use strict';
/* ===================== START ===================== */
lsLoad();{const ld=lastDay();if(ld)day=DAYS[ld].nx}
if(location.hash==='#nut')view='nut';
render();note(HA.token?'Lokal · verbinde …':'Nur auf diesem Gerät – Home Assistant unter „Mehr“ einrichten');
syncNow();
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
/* iOS: Fenster an die sichtbare Fläche (ohne Tastatur) anpassen */
if(window.visualViewport){const vv=window.visualViewport,fit=()=>{const r=document.documentElement.style;r.setProperty('--vvh',vv.height+'px');r.setProperty('--vvt',vv.offsetTop+'px')};vv.addEventListener('resize',fit);vv.addEventListener('scroll',fit);fit()}
document.addEventListener('focusin',ev=>{if(ev.target.closest&&ev.target.closest('.sheet:not(.ob)'))setTimeout(()=>{const s=document.querySelector('.sheet:not(.ob) .sheetin');if(s&&ev.target.id==='fq')s.scrollTop=0},300)});
/* iPhone-Tastatur: sichtbare Höhe für das Hinzufügen-Fenster bereitstellen */
if(window.visualViewport){const vv=visualViewport,upd=()=>{document.documentElement.style.setProperty('--vvh',vv.height+'px');document.documentElement.style.setProperty('--vvt',vv.offsetTop+'px')};vv.addEventListener('resize',upd);vv.addEventListener('scroll',upd);upd()}
