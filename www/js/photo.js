/* Sport Cockpit – Foto-Erkennung für Essen (Teller oder Nährwert-Etikett) per Claude-API */
'use strict';
let AI={key:'',model:'claude-sonnet-5-5'};try{AI=Object.assign(AI,JSON.parse(localStorage.getItem('sc.ai'))||{})}catch(e){}
const AI_PROMPT=`Du hilfst bei einem Ernährungstagebuch. Analysiere das Foto.
- Ist es ein Teller/Gericht: erkenne die einzelnen Lebensmittel und schätze die Menge in Gramm.
- Ist es ein Nährwert-Etikett oder eine Verpackung: lies die Werte pro 100 g ab (ein Eintrag; g = angegebene Portion oder 100).
Antworte NUR mit JSON, ohne Text davor oder danach:
{"art":"teller"|"etikett","items":[{"name":"deutscher Name","g":Zahl,"kcal100":Zahl,"p100":Zahl,"c100":Zahl,"z100":Zahl,"f100":Zahl}]}
Werte pro 100 g (z100 = davon Zucker). Wenn du unsicher bist, schätze realistisch. Keine Erklärungen.`;
function shrink(file){return new Promise((res,rej)=>{const img=new Image(),u=URL.createObjectURL(file);img.onload=()=>{const m=1280,s=Math.min(1,m/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);res(c.toDataURL('image/jpeg',.82).split(',')[1])};img.onerror=()=>rej(new Error('Bild nicht lesbar'));img.src=u})}
async function aiAnalyze(file){if(!AI.key){sheet.step='photo';sheet.msg='Erst unter „Mehr → Foto-Erkennung“ einen API-Schlüssel eintragen.';render();return}
 sheet.step='photo';sheet.src='';sheet.busy=true;sheet.msg='Foto wird analysiert …';sheet.ai=null;render();
 try{const data=await shrink(file);
  const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'content-type':'application/json','x-api-key':AI.key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
   body:JSON.stringify({model:AI.model,max_tokens:1024,messages:[{role:'user',content:[{type:'image',source:{type:'base64',media_type:'image/jpeg',data}},{type:'text',text:AI_PROMPT}]}]})});
  const j=await r.json();if(!r.ok)throw new Error((j.error&&j.error.message)||('Fehler '+r.status));
  const txt=(j.content||[]).map(c=>c.text||'').join(''),m=txt.match(/\{[\s\S]*\}/);if(!m)throw new Error('Keine Antwort erkannt');
  const o=JSON.parse(m[0]);sheet.ai=(o.items||[]).filter(x=>x&&x.name).map((x,i)=>({on:true,g:String(Math.round(+x.g||100)),f:{id:'ai'+Date.now().toString(36)+i,name:String(x.name).slice(0,60),kcal:Math.round(+x.kcal100||0),p:r1(+x.p100||0),c:r1(+x.c100||0),z:r1(+x.z100||0),f:r1(+x.f100||0),src:o.art==='etikett'?'own':'ai'}}));
  sheet.art=o.art;sheet.msg=sheet.ai.length?(o.art==='etikett'?'Etikett gelesen – prüfe die Werte.':'Geschätzt – Mengen bitte prüfen und anpassen.'):'Nichts erkannt. Versuch ein schärferes Foto von oben.'}
 catch(e){sheet.msg='Erkennung fehlgeschlagen: '+e.message}
 sheet.busy=false;render()}
function renderPhotoStep(){const sh=sheet,ml=MEALS.find(m=>m[0]===sh.meal)[1];
 return `<button class="back" data-n="back">‹ Zurück</button><h2>${sh.src==='say'?'Per Sprache eingetragen':'Foto-Erkennung'}</h2><p class="tip" style="padding:0 0 10px">${esc(sh.msg||'')}</p>
 ${sh.busy?'<div class="aispin"></div>':''}
 ${(sh.ai||[]).map((x,i)=>{const it=itemFrom(x.f,num(x.g)||0,sh.meal);return `<div class="airow"><label class="aichk"><input type="checkbox" data-ai="on" data-i="${i}"${x.on?' checked':''}><span><b>${esc(x.f.name)}</b><small>${fmt(x.f.kcal)} kcal · ${fmt(x.f.p)} g P / 100 g</small></span></label><div class="aig"><input inputmode="decimal" data-ai="g" data-i="${i}" value="${esc(x.g)}" aria-label="Gramm"><span>g</span></div><em>${fmt(it.kcal)} kcal</em></div>`}).join('')}
 ${(sh.ai||[]).length?`<button class="primary" data-ai="add" style="width:100%;margin-top:10px">Zu ${ml} hinzufügen</button>`:''}
 ${sh.src==='say'?`<div class="actions"><button class="ghost" data-say="open">Nochmal sprechen</button></div>`:'<div class="actions"><label class="filebtn">Neues Foto<input type="file" accept="image/*" capture="environment" data-ai="file" hidden></label></div>'}`}
document.addEventListener('change',ev=>{const t=ev.target;if(t.dataset.ai==='file'&&t.files&&t.files[0])aiAnalyze(t.files[0]);if(t.dataset.ai==='on'){sheet.ai[+t.dataset.i].on=t.checked}});
document.addEventListener('input',ev=>{const t=ev.target;if(t.dataset.ai==='g'){const x=sheet.ai[+t.dataset.i];x.g=t.value;const em=t.closest('.airow').querySelector('em');em.textContent=fmt(itemFrom(x.f,num(x.g)||0,sheet.meal).kcal)+' kcal'}});
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-ai="add"]');if(!b)return;const d=nDate||today();let n=0;
 for(const x of sheet.ai||[]){if(!x.on)continue;const g=num(x.g);if(!g)continue;ND(d).items.push(itemFrom(x.f,g,sheet.meal));if(sheet.art==='etikett'){S.nut.foods.unshift(x.f);S.metaT=Date.now()}n++}
 if(n){touch(d);sheet=null;note(n+' Lebensmittel eingetragen');render()}});
/* Einstellungen */
function renderAISettings(){return `<section class="meal"><header><h3>Foto-Erkennung</h3><span>${AI.key?'eingerichtet':'aus'}</span></header>
 <p class="tip" style="padding:0 0 8px">Fotografiere Teller oder Nährwert-Etiketten – Claude erkennt Lebensmittel und Mengen. Braucht einen eigenen API-Schlüssel von console.anthropic.com (ca. 1 Cent pro Foto). Der Schlüssel bleibt nur auf diesem Gerät.</p>
 <div class="cform"><div class="full"><label for="aiKey">API-Schlüssel</label><input id="aiKey" type="password" placeholder="${AI.key?'gespeichert – zum Ändern neu einfügen':'sk-ant-…'}" autocapitalize="off" autocorrect="off"></div></div>
 <div class="actions"><button data-ais="save">Speichern</button>${AI.key?'<button class="ghost" data-ais="off">Entfernen</button>':''}</div></section>`}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-ais]');if(!b)return;if(b.dataset.ais==='save'){const k=$('aiKey').value.trim();if(!/^sk-ant-/.test(k)){note('Schlüssel beginnt mit sk-ant-');return}AI.key=k}else AI.key='';
 try{localStorage.setItem('sc.ai',JSON.stringify(AI))}catch(e){}note(AI.key?'Foto-Erkennung aktiv':'Foto-Erkennung aus');render()});
