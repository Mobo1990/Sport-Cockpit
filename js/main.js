/* Sport Cockpit – Start der App */
'use strict';
/* ===================== START ===================== */
lsLoad();{const ld=lastDay();if(ld)day=DAYS[ld].nx}
if(location.hash==='#nut')view='nut';
render();note(HA.token?'Lokal · verbinde …':'Nur auf diesem Gerät – Home Assistant unter „Mehr“ einrichten');
syncNow();
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
