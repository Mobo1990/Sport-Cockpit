/* Duo – Profil-Pflicht beim ersten Start */
'use strict';
/* ===================== ONBOARDING ===================== */
const profOK=()=>{const P=S.prof;return P.name&&P.year&&P.height&&(P.weight||lastWeight())};
let ob={step:0};
/* Einrichtung bleibt offen, bis „Los geht’s“ getippt ist – nicht schon, sobald die Pflichtfelder ausgefüllt sind (sonst schließt sie beim Tipp aufs Ziel) */
let obOpen=false;
function renderOnboarding(){const P=S.prof,f=(k,l,ph,mode='decimal')=>`<div><label for="p_${k}">${l}</label><input id="p_${k}" inputmode="${mode}" data-p="${k}" placeholder="${ph}" value="${esc(P[k]??'')}"></div>`;
 return `<div class="sheet ob"><div class="sheetin"><h2>Willkommen bei Duo</h2>
 <div class="obxfer"><b>Du hattest Duo schon?</b><p>Füge deinen Verbindungscode ein – Profil, Training und Essen kommen dann aus Home Assistant zurück.</p><div class="obrow"><input id="obCode" placeholder="duo-ha:…" autocapitalize="off" autocorrect="off" aria-label="Verbindungscode"><button class="primary" data-s="hapaste">Einfügen</button></div></div>
 <p class="tip" style="padding:0 0 12px">Bevor es losgeht, brauchen wir ein paar Angaben. Daraus berechnet die App deinen Kalorienbedarf und dein Proteinziel. Alles kannst du später unter „Mehr“ ändern.</p>
 <div class="cform">${f('name','Dein Name','z. B. Michell','text')}<div><label>Geschlecht</label><div class="vars">${[['m','Mann'],['w','Frau']].map(([k,l])=>`<button data-ps="sex" data-v="${k}" aria-pressed="${P.sex===k}">${l}</button>`).join('')}</div></div>
 ${f('year','Geburtsjahr','z. B. 1990','numeric')}${f('height','Größe (cm)','z. B. 182','numeric')}${f('weight','Gewicht (kg)','z. B. 85')}
 <div class="full"><label>Dein Alltag</label><div class="vars">${[[1.4,'Büro, wenig Bewegung'],[1.55,'Büro + Training 3–4×'],[1.7,'Aktiv / Training 5–6×'],[1.85,'Körperlich harte Arbeit']].map(([v,l])=>`<button data-ps="act" data-v="${v}" aria-pressed="${P.act==v}">${l}</button>`).join('')}</div></div>
 <div class="full"><label>Dein Ziel</label><div class="vars">${[['aufbau','Muskeln aufbauen'],['fit','Fitter werden'],['halten','Gewicht halten'],['defi','Abnehmen']].map(([k,l])=>`<button data-n="goal" data-v="${k}" aria-pressed="${S.nut.goal===k}">${l}</button>`).join('')}</div></div></div>
 <div class="calc" id="pcalc">${pcalc()}</div>
 <button class="primary" data-ob="go" style="width:100%">Los geht’s</button><p class="tip" id="obmsg" style="padding:8px 0 0"></p></div></div>`}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-ob]');if(!b)return;if(!profOK()){$('obmsg').textContent='Bitte Name, Geburtsjahr, Größe und Gewicht ausfüllen.';return}
 if(S.prof.weight&&!lastWeight()){ND(today()).w=S.prof.weight;ND(today()).wsrc='prof';ND(today()).t=Date.now()}obOpen=false;S.metaT=Date.now();persist();render()});

