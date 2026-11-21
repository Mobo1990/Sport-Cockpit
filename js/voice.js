/* Sport Cockpit – Essen per Sprache eintragen.
   In der App: diktieren (Tastatur-Mikrofon oder Spracherkennung des Browsers) -> erkennen -> bestätigen (wie Foto-Erkennung).
   Per Siri: Kurzbefehl legt den Text über Home Assistant in todo.sport_cockpit_geteiltes_essen ab ({kind:'say'}), die App holt ihn ab. */
'use strict';
let SR=window.SpeechRecognition||window.webkitSpeechRecognition;let srec=null;
/* In der Homescreen-App auf dem iPhone ist die Browser-Spracherkennung oft gesperrt – dann merken und Tastatur-Diktat anbieten */
try{if(localStorage.getItem('sc.srOff'))SR=null}catch(e){}
/* iPhone/iPad als Homescreen-App: Browser-Spracherkennung kann dort die App abstürzen lassen – nur Tastatur-Diktat anbieten */
const IOS_APP=(/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1))&&(navigator.standalone===true||matchMedia('(display-mode: standalone)').matches);
if(IOS_APP)SR=null;
const NUMW={ein:1,eine:1,einen:1,einem:1,einer:1,zwei:2,drei:3,vier:4,'fünf':5,fuenf:5,sechs:6,sieben:7,acht:8,neun:9,zehn:10,halbe:0.5,halben:0.5,halb:0.5};
const MEALW=[['f',/frühstück|fruehstueck|morgens/],['m',/mittag/],['a',/abend|abends/],['s',/snack|zwischendurch/]];
function sayMeal(t){const s=t.toLowerCase();for(const [m,r] of MEALW)if(r.test(s))return m;return null}
/* Ohne Claude: einfache Angaben aus der eingebauten Liste ("200 g Reis, 2 Eier und eine Banane") */
function sayLocal(text){const out=[],miss=[];
 const parts=text.toLowerCase().replace(/zum (frühstück|mittag(essen)?|abend(essen|brot)?|snack)|(heute )?(morgens|mittags|abends)|ich (hatte|habe|hab)|gegessen|getrunken/g,' ')
  .split(/,|;|\bund\b|\bmit\b|\bdazu\b|\n/).map(x=>x.trim()).filter(x=>x.length>1);
 for(const p of parts){let q=null,unit='',rest=p;
  const m=rest.match(/^(\d+(?:[.,]\d+)?)\s*(kg|g|gramm|ml|l|liter|stück|stk|scheiben?|portionen?|becher|esslöffel|el|teelöffel|tl)?\b\s*(.*)$/);
  if(m){q=num(m[1]);unit=m[2]||'';rest=m[3]}else{const w=rest.split(/\s+/);if(NUMW[w[0]]!=null){q=NUMW[w[0]];rest=w.slice(1).join(' ')}
   const u=rest.match(/^(scheiben?|portionen?|becher|stück|esslöffel|el|teelöffel|tl)\s+(.*)$/);if(u){unit=u[1];rest=u[2]}}
  rest=rest.replace(/^(g|gramm)\s+/,'').trim();let f=findFoods(rest,1)[0];for(const suf of ['er','en','n','e','s']){if(f||!rest.endsWith(suf)||rest.length<4)continue;f=findFoods(rest.slice(0,-suf.length),1)[0]}if(!f){miss.push(p);continue}
  const por=f.por&&f.por.g;let g;
  if(/^(g|gramm|ml)$/.test(unit))g=q;else if(/^(kg|l|liter)$/.test(unit))g=q*1000;else if(/^(el|esslöffel)$/.test(unit))g=q*15;else if(/^(tl|teelöffel)$/.test(unit))g=q*5;
  else if(q!=null)g=q*(por||100);else g=por||usual(f)||100;
  out.push({on:true,g:String(Math.round(g)),f})}
 return{items:out,miss}}
/* Mit Claude: freie Sätze verstehen, gleiche Ausgabe wie die Foto-Erkennung */
const SAY_PROMPT=`Du hilfst bei einem Ernährungstagebuch. Der Nutzer sagt, was er gegessen hat (deutsch, gesprochen, evtl. ungenau).
Zerlege es in einzelne Lebensmittel, schätze realistische Mengen in Gramm (bei Stück/Scheibe/Portion übliche Größen) und Nährwerte pro 100 g.
Gib nur die Lebensmittel zurück, keine Erklärungen.`;
const SAY_SCHEMA={type:'object',additionalProperties:false,required:['items'],properties:{items:{type:'array',items:{type:'object',additionalProperties:false,required:['name','g','kcal100','p100','c100','z100','f100'],
 properties:{name:{type:'string'},g:{type:'number'},kcal100:{type:'number'},p100:{type:'number'},c100:{type:'number'},z100:{type:'number'},f100:{type:'number'}}}}}};
async function sayAI(text){const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'content-type':'application/json','x-api-key':AI.key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
  body:JSON.stringify({model:AI.model,max_tokens:2048,output_config:{effort:'low',format:{type:'json_schema',schema:SAY_SCHEMA}},messages:[{role:'user',content:`${SAY_PROMPT}\n\nGesagt: „${text}“`}]})});
 const j=await r.json();if(!r.ok)throw new Error((j.error&&j.error.message)||('Fehler '+r.status));if(j.stop_reason==='refusal')throw new Error('Anfrage abgelehnt');
 const txt=(j.content||[]).filter(c=>c.type==='text').map(c=>c.text).join(''),m=txt.match(/\{[\s\S]*\}/);if(!m)throw new Error('Keine Antwort erkannt');
 const o=JSON.parse(m[0]);return(o.items||[]).filter(x=>x&&x.name).map((x,i)=>{const own=findFoods(x.name,1)[0];
  return{on:true,g:String(Math.round(+x.g||100)),f:own&&normQ(own.name)===normQ(x.name)?own:{id:'ai'+Date.now().toString(36)+i,name:String(x.name).slice(0,60),kcal:Math.round(+x.kcal100||0),p:r1(+x.p100||0),c:r1(+x.c100||0),z:r1(+x.z100||0),f:r1(+x.f100||0),src:'ai'}}})}
async function sayParse(){const text=(sheet.say||'').trim();if(!text){note('Erst sagen oder tippen, was du gegessen hast');return}
 const m=sayMeal(text);if(m)sheet.meal=m;sheet.step='photo';sheet.src='say';sheet.ai=null;sheet.art='say';
 if(!AI.key){const r=sayLocal(text);sheet.ai=r.items;sheet.msg=(r.items.length?'Erkannt – Mengen prüfen.':'Nichts erkannt.')+(r.miss.length?` Nicht gefunden: ${r.miss.join(', ')}. Mit Claude-Schlüssel (Mehr → Foto-Erkennung) versteht die App auch freie Sätze.`:'');render();sayDone();return}
 sheet.busy=true;sheet.msg='Wird verstanden …';render();
 try{sheet.ai=await sayAI(text);sheet.msg=sheet.ai.length?'Geschätzt – Mengen bitte prüfen.':'Nichts erkannt.'}
 catch(e){const r=sayLocal(text);sheet.ai=r.items;sheet.msg='Claude nicht erreichbar ('+e.message+') – einfache Erkennung verwendet.'}
 sheet.busy=false;render();sayDone()}
/* Sprachnotiz aus Siri (über HA) nach dem Erkennen aus der Liste löschen */
function sayDone(){if(sheet&&sheet.sayUid){const u=sheet.sayUid;sheet.sayUid=null;shareDone(u)}}
function renderSayStep(){const sh=sheet;
 return `<button class="back" data-n="back">‹ Zurück</button><h2>Per Sprache eintragen</h2>
 <p class="tip" style="padding:0 0 8px">Sag einfach, was du gegessen hast – z. B. „zwei Eier und eine Scheibe Vollkornbrot zum Frühstück“. ${SR?'':'Tipp: ins Feld tippen und unten auf der Tastatur das Mikrofon antippen.'}</p>${sh.sayErr?`<p class="sayerr">${esc(sh.sayErr)}</p>`:''}
 <textarea id="sayIn" data-say="in" rows="3" placeholder="Was hast du gegessen?">${esc(sh.say||'')}</textarea>
 <div class="sayb">${SR?`<button data-say="mic" class="${srec?'rec':''}"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>${srec?'Hört zu … tippen zum Stoppen':'Sprechen'}</button>`:''}<button class="primary" data-say="go">Erkennen</button></div>`}
function sayMic(){if(srec){srec.stop();return}const r=new SR();r.lang='de-DE';r.interimResults=true;r.continuous=false;const base=(sheet.say||'').trim();
 r.onresult=e=>{let t='';for(const x of e.results)t+=x[0].transcript;sheet.say=(base?base+' ':'')+t;const el=$('sayIn');if(el)el.value=sheet.say};
 r.onend=()=>{srec=null;render()};
 r.onerror=e=>{srec=null;const blocked=/not-allowed|service-not-allowed|audio-capture/.test(e.error);
  if(blocked&&e.error==='service-not-allowed'){SR=null;try{localStorage.setItem('sc.srOff','1')}catch(x){}}
  if(sheet)sheet.sayErr=e.error==='not-allowed'?'Mikrofon nicht erlaubt – in den iPhone-Einstellungen unter Safari bzw. Duo freigeben. Oder ins Feld tippen und das Mikrofon der Tastatur nutzen.'
   :e.error==='no-speech'?'Nichts gehört – nochmal versuchen.'
   :'Spracherkennung klappt hier nicht. Tipp ins Feld und nutze das Mikrofon unten auf der Tastatur.';
  render();if(!SR)setTimeout(()=>{const t=$('sayIn');if(t)t.focus()},50)};
 if(sheet)sheet.sayErr='';srec=r;try{r.start()}catch(x){srec=null;SR=null;if(sheet)sheet.sayErr='Spracherkennung klappt hier nicht. Tipp ins Feld und nutze das Mikrofon unten auf der Tastatur.'}render()}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-say]');if(!b||b.tagName==='TEXTAREA')return;const a=b.dataset.say;
 if(a==='open'){sheet.step='say';sheet.say=sheet.say||sheet.q||'';render();setTimeout(()=>{const t=$('sayIn');if(t&&!SR)t.focus()},50)}
 else if(a==='mic')sayMic();else if(a==='go'){if(srec)srec.stop();sayParse()}
 else if(a==='siri'){const s=shareInbox.find(x=>x.uid===b.dataset.uid);if(!s)return;view='nut';nDate=today();sheet={meal:s.meal||mealNow(),step:'say',say:s.text,sayUid:s.uid};render();sayParse()}});
document.addEventListener('input',ev=>{if(ev.target.dataset.say==='in'&&sheet)sheet.say=ev.target.value});
/* Karte für Sprachnotizen aus Siri */
function sayInboxHtml(){const l=shareInbox.filter(x=>x.kind==='say');return l.map(s=>`<section class="shin say"><b>Per Siri gesagt</b><p>„${esc(s.text)}“</p><div class="shbtn"><button class="primary" data-say="siri" data-uid="${s.uid}">Prüfen & eintragen</button><button class="ghost" data-sh="no" data-uid="${s.uid}">Verwerfen</button></div></section>`).join('')}
