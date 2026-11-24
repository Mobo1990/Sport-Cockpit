/* Sport Cockpit – Kurz-Workouts mit Timer (aus den Coach-Challenges startbar) */
'use strict';
/* Schritte: [Name, Sekunden, Hinweis]. Name 'Pause' = Erholung. */
const WO={
 core:{n:'Core-Workout',min:6,steps:[['Unterarmstütz',40,'Bauch und Po fest, Körper eine Linie.'],['Pause',20],['Crunches',40,'Langsam hoch, Blick zur Decke.'],['Pause',20],['Seitstütz links',30,'Hüfte hoch, nicht durchhängen.'],['Seitstütz rechts',30,'Hüfte hoch, nicht durchhängen.'],['Pause',20],['Beinheben',40,'Rücken bleibt am Boden, Beine langsam ab.'],['Pause',20],['Mountain Climbers',40,'Knie zügig zur Brust, Hüfte tief.'],['Pause',20],['Unterarmstütz',40,'Letzte Runde – durchhalten!']]},
 zirkel:{n:'Kurz-Zirkel',min:7,steps:[['Hampelmänner',30,'Zum Warmwerden, locker.'],['Kniebeugen',40,'Fersen am Boden, tief runter.'],['Pause',15],['Liegestütze',40,'Knie am Boden ist okay.'],['Pause',15],['Ausfallschritte',40,'Abwechselnd links und rechts.'],['Pause',15],['Glute Bridges',40,'Oben kurz halten.'],['Pause',15],['Burpees',30,'Eigenes Tempo.'],['Pause',15],['Unterarmstütz',40,'Zum Schluss alles geben.']]},
 mobil:{n:'Mobility',min:5,steps:[['Schulterkreisen',40,'Große Kreise, vor und zurück.'],['Katze-Kuh',40,'Im Vierfüßler, Rücken rund und hohl.'],['Hüftbeuger links',40,'Ausfallschritt, Hüfte nach vorn schieben.'],['Hüftbeuger rechts',40,'Ausfallschritt, Hüfte nach vorn schieben.'],['Weltbeste Dehnung',40,'Ausfallschritt, Arm zur Decke drehen, Seiten wechseln.'],['Brustdehnung',40,'Unterarm an Wand oder Türrahmen.'],['Vorbeuge',40,'Knie leicht gebeugt, locker hängen lassen.']]}};
const PREP=5;
let wo=null,woTick=null,woLock=null;
const woEl=(()=>{const d=document.createElement('div');d.id='wo';d.className='gym wo';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');document.body.appendChild(d);return d})();
/* Knieschonende Varianten für die Timer-Workouts (Profil „knieschonend“ oder Schalter vor dem Start) */
const KNEE_WO={'Kniebeugen':['Stuhl-Kniebeugen','Nur bis zum Stuhl absetzen, Knie hinter den Zehen.'],'Ausfallschritte':['Glute Bridges','Rückenlage, Hüfte hoch und kurz halten – ohne Druck aufs Knie.'],
 'Hampelmänner':['Step-Jacks','Ohne Sprung: abwechselnd seitlich raustippen, Arme hoch.'],'Burpees':['Burpees ohne Sprung','Beine nacheinander zurücksetzen, aufrichten ohne Sprung.']};
const KNEE_HINT={'Hüftbeuger links':'Kissen oder Handtuch unters hintere Knie.','Hüftbeuger rechts':'Kissen oder Handtuch unters hintere Knie.','Weltbeste Dehnung':'Kissen unters hintere Knie, Schritt etwas kürzer.',
 'Quadrizepsdehnung links':'Nur so weit ziehen, wie es angenehm ist – Handtuch um den Fuß hilft.','Quadrizepsdehnung rechts':'Nur so weit ziehen, wie es angenehm ist – Handtuch um den Fuß hilft.'};
const woKneeSteps=st=>st.map(x=>KNEE_WO[x[0]]?[KNEE_WO[x[0]][0],x[1],KNEE_WO[x[0]][1]]:KNEE_HINT[x[0]]?[x[0],x[1],KNEE_HINT[x[0]]]:x);
const woHasKnee=k=>WO[k].steps.some(x=>KNEE_WO[x[0]]||KNEE_HINT[x[0]]);
function woSteps(){const st=wo.knee?woKneeSteps(WO[wo.k].steps):WO[wo.k].steps;return [['Gleich geht’s los',PREP,st[0][0]],...st]}
function woStart(k,ch){wo={k,ch,i:0,left:PREP,paused:false,done:false,last:Date.now(),knee:kneeOn()};woRun();woRender();
 try{navigator.wakeLock&&navigator.wakeLock.request('screen').then(l=>woLock=l).catch(()=>{})}catch(e){}}
function woRun(){clearInterval(woTick);woTick=setInterval(()=>{if(!wo||wo.paused||wo.done)return;const now=Date.now();wo.left-=(now-wo.last)/1000;wo.last=now;
 if(wo.left<=0)woNext();else woUpd()},200)}
function woBuzz(){try{navigator.vibrate&&navigator.vibrate([120,60,120])}catch(e){}}
function woNext(){const st=woSteps();wo.i++;wo.last=Date.now();if(wo.i>=st.length){woFinish();return}wo.left=st[wo.i][1];woBuzz();woRender()}
function woFinish(){wo.done=true;clearInterval(woTick);woBuzz();try{woLock&&woLock.release()}catch(e){}woLock=null;
 const d=today(),dd=ND(d),p0=dayScore(d).pt;if(wo.ch&&!(dd.ch||[]).includes(wo.ch)){const before=chDone(d).length;dd.ch=[...(dd.ch||[]),wo.ch];touch(d);
  if(chDone(d).length===3&&before<3)tell(`${S.prof.name||'Jemand'} hat alle Challenges geschafft`,`Heute alle 3 Coach-Challenges erledigt (+${chPoints(d)} Punkte). Und du?`)}
 woRender();render();cheer({big:true,title:cheerWord(),sub:WO[wo.k].n+' geschafft',pts:dayScore(d).pt-p0})}
function woClose(){clearInterval(woTick);try{woLock&&woLock.release()}catch(e){}woLock=null;wo=null;woRender()}
const mmss=s=>{s=Math.max(0,Math.ceil(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
function woUpd(){const st=woSteps(),cur=st[wo.i],t=document.getElementById('woT'),r=document.getElementById('woR');if(!t)return;
 t.textContent=Math.max(0,Math.ceil(wo.left));if(r)r.style.strokeDashoffset=(301.6*(1-wo.left/cur[1])).toFixed(1);
 const rest=st.slice(wo.i+1).reduce((a,x)=>a+x[1],0)+wo.left,tl=document.getElementById('woTotal');if(tl)tl.textContent=mmss(rest)+' übrig'}
function woRender(){if(!wo){woEl.classList.remove('on');woEl.innerHTML='';return}woEl.classList.add('on');const W=WO[wo.k],st=woSteps();
 if(wo.done){const c=CH.find(x=>x.id===wo.ch);woEl.innerHTML=`<div class="gh"><button class="gx" data-wo-a="close" aria-label="Schließen">✕</button><div><b>${esc(W.n)}</b><small>Fertig</small></div></div>
  <div class="wobody"><p class="wodone cond">Geschafft!</p><p class="wosub">${W.min} Minuten ${esc(W.n)} erledigt${c?` · <b>+${c.pt} Punkte</b>`:''}</p><button class="primary" data-wo-a="close">Zurück zur Startseite</button></div>`;return}
 const cur=st[wo.i],nx=st[wo.i+1],isP=cur[0]==='Pause'||wo.i===0,work=st.slice(1).filter(x=>x[0]!=='Pause'),wi=wo.i===0?0:work.indexOf(cur)+1;
 woEl.innerHTML=`<div class="gh"><button class="gx" data-wo-a="close" aria-label="Abbrechen">✕</button><div><b>${esc(W.n)}</b><small id="woTotal"></small></div></div>
 <div class="gprog">${st.slice(1).map((x,i)=>`<i class="${i+1<wo.i?'d':i+1===wo.i?'c':''}${x[0]==='Pause'?' p':''}"></i>`).join('')}</div>
 <div class="wobody${isP?' rest':''}"><small class="wok">${wo.i===0?'Bereit machen':cur[0]==='Pause'?'Pause':'Übung '+(wi>0?wi:'')+' von '+work.length}</small>
  <h2 class="won">${esc(cur[0]==='Pause'?'Durchatmen':cur[0])}</h2>${cur[2]&&cur[0]!=='Pause'&&wo.i>0?`<p class="wosub">${esc(cur[2])}</p>`:''}
  ${(()=>{const fn=cur[0]==='Pause'?(nx?nx[0]:''):(wo.i===0?st[1][0]:cur[0]);return fn&&fn!=='Pause'?moveSvg(fn,'wofig'+(cur[0]==='Pause'||wo.i===0?' soon':'')):''})()}
  <div class="woring"><svg viewBox="0 0 110 110" aria-hidden="true"><circle cx="55" cy="55" r="48" class="bg"/><circle id="woR" cx="55" cy="55" r="48" class="fg" stroke-dasharray="301.6" stroke-dashoffset="0"/></svg><b id="woT" class="cond">${Math.ceil(wo.left)}</b></div>
  ${wo.i===0&&woHasKnee(wo.k)?`<button class="woknee" data-wo-a="knee" aria-pressed="${!!wo.knee}">${wo.knee?'Knieschonend an ✓':'Knieschonend'}</button>`:''}${nx?`<p class="wonx">Als Nächstes: <b>${esc(nx[0])}</b>${nx[0]==='Pause'?'':' · '+nx[1]+' s'}</p>`:'<p class="wonx">Letzte Runde!</p>'}</div>
 <div class="gfoot"><button data-wo-a="pause">${wo.paused?'Weiter':'Pause'}</button><button class="primary" data-wo-a="skip">Überspringen ›</button></div>`;woUpd()}
document.addEventListener('click',ev=>{const s=ev.target.closest('[data-wo]');if(s){ev.stopPropagation();woStart(s.dataset.wo,s.dataset.woc);return}
 const b=ev.target.closest('[data-wo-a]');if(!b||!wo)return;const a=b.dataset.woA;
 if(a==='close')woClose();else if(a==='pause'){wo.paused=!wo.paused;wo.last=Date.now();woRender()}else if(a==='skip')woNext();else if(a==='knee'){wo.knee=!wo.knee;woRender()}},true);
