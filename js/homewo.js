/* Duo – Heim-Training: Push / Pull / Beine zu Hause, geführt mit Timer (20–30 min).
   Ausstattung: Matte, Widerstandsbänder, Pole-Stange (Halt, Rudern im Schräghang, Band-Befestigung).
   Profil S.prof.loc==='home' → Training-Tab und „Als Nächstes“ starten das Heim-Training statt des Gym Mode.
   Ein geschafftes Heim-Training zählt wie eine Krafteinheit (Training +30, Wochenziel, Serie).
   Steigerung: alle 3 geschafften Einheiten eines Tages länger arbeiten / kürzer pausieren. */
'use strict';
const isHome=()=>!!S.prof&&S.prof.loc==='home';
/* Neue Strichmännchen (Gelenke wie in moves.js; Boden y=122) */
{const M=MOVES,POLE=x=>`${x},-10 ${x},122`,FEET_BAND=[[96,MV_FLOOR,'handL'],[104,MV_FLOOR,'handR']];
 const strip=(k,o)=>{const b={...M[k]};delete b.load;return{...b,...o}};
 Object.assign(M,{
 'Band-Schulterdrücken':strip('gym:schulter',{cable:FEET_BAND}),
 'Band-Seitheben':strip('gym:seit',{cable:FEET_BAND}),
 'Band-Bizepscurl':strip('gym:curl',{cable:[[100,MV_FLOOR,'hand']]}),
 'Band-Face-Pull':strip('gym:face',{props:[POLE(184)]}),
 'Band-Latzug':strip('gym:latzug',{props:[...(M['gym:latzug'].props||[]),POLE(106)]}),
 'Trizeps-Dips am Stuhl':strip('gym:dips',{}),
 'Wadenheben an der Stange':strip('gym:waden',{props:[...(M['gym:waden'].props||[]),POLE(126)]}),
 'Pike-Liegestütze':{dur:2.4,poses:[
  {head:[128,92],neck:[120,84],hip:[96,62],knee:[78,92],foot:[62,MV_FLOOR],elbow:[128,104],hand:[132,MV_FLOOR]},
  {head:[132,110],neck:[124,100],hip:[98,66],knee:[79,94],foot:[62,MV_FLOOR],elbow:[114,108],hand:[132,MV_FLOOR]}]},
 'Stangen-Rudern':{dur:2.4,props:[POLE(150)],poses:[
  {head:[86,50],neck:[96,60],hip:[116,92],knee:[128,106],foot:[138,MV_FLOOR],elbow:[122,62],hand:[148,64]},
  {head:[112,40],neck:[120,52],hip:[128,88],knee:[134,105],foot:[138,MV_FLOOR],elbow:[112,62],hand:[148,56]}]},
 'Superman':{dur:2.8,poses:[
  {head:[150,108],neck:[138,113],hip:[96,117],knee:[70,119],foot:[44,120],elbow:[158,114],hand:[176,116]},
  {head:[152,100],neck:[140,108],hip:[96,116],knee:[70,114],foot:[44,106],elbow:[160,104],hand:[178,98]}]},
 'Band-Seitschritte':{dur:1.8,poses:[
  {head:[100,32],neck:[100,46],hip:[100,80],elbowL:[90,62],handL:[96,76],elbowR:[110,62],handR:[104,76],kneeL:[90,100],footL:[92,MV_FLOOR],kneeR:[110,100],footR:[108,MV_FLOOR]},
  {head:[100,32],neck:[100,46],hip:[100,80],elbowL:[90,62],handL:[96,76],elbowR:[110,62],handR:[104,76],kneeL:[84,100],footL:[78,MV_FLOOR],kneeR:[116,100],footR:[122,MV_FLOOR]}]}});}
/* Programme: [Name, Hinweis]. Pro Runde jede Übung einmal, 3 Runden. */
const HOME={
 push:{n:'Push zu Hause',sub:'Brust · Schultern · Trizeps',warm:[['Hampelmänner',40,'Locker warm werden.'],['Schulterkreisen',40,'Große Kreise vor und zurück.']],
  circ:[['Liegestütze','Knie am Boden ist völlig okay – Körper bleibt eine Linie.'],['Band-Schulterdrücken','Auf das Band stellen, Griffe auf Schulterhöhe, gerade nach oben drücken.'],['Pike-Liegestütze','Po hoch wie ein umgedrehtes V, Kopf langsam Richtung Boden senken.'],['Band-Seitheben','Auf das Band stellen, Arme seitlich bis Schulterhöhe heben, langsam ablassen.'],['Trizeps-Dips am Stuhl','Hände an die Stuhlkante, Po nah am Stuhl, Ellbogen nach hinten beugen.']],
  cool:[['Brustdehnung links',30,'Unterarm an die Stange, Oberkörper wegdrehen.'],['Brustdehnung rechts',30,'Unterarm an die Stange, Oberkörper wegdrehen.'],['Trizepsdehnung links',25,'Ellbogen sanft nach hinten ziehen.'],['Trizepsdehnung rechts',25,'Ellbogen sanft nach hinten ziehen.']]},
 pull:{n:'Pull zu Hause',sub:'Rücken · Bizeps · hintere Schulter',warm:[['Hampelmänner',40,'Locker warm werden.'],['Katze-Kuh',40,'Im Vierfüßler, Rücken rund und hohl.']],
  circ:[['Stangen-Rudern','Stange greifen, Körper gerade nach hinten lehnen, Brust zur Stange ziehen. Je flacher, desto schwerer.'],['Band-Latzug','Band oben an der Stange, auf den Stuhl setzen, Ellbogen nach unten zu den Hüften ziehen.'],['Superman','Bauchlage, Arme und Beine leicht anheben, kurz halten, ablegen.'],['Band-Face-Pull','Band auf Kopfhöhe an der Stange, zum Gesicht ziehen, Ellbogen hoch und weit.'],['Band-Bizepscurl','Auf das Band stellen, Ellbogen am Körper, Hände zu den Schultern.']],
  cool:[['Kindhaltung',45,'Arme weit nach vorn, ruhig atmen.'],['Brustdehnung links',30,'Brust öffnen.'],['Brustdehnung rechts',30,'Brust öffnen.']]},
 legs:{n:'Beine zu Hause',sub:'Beine · Po · Bauch',warm:[['Hampelmänner',40,'Locker warm werden.'],['Weltbeste Dehnung',40,'Ausfallschritt, Arm zur Decke drehen, Seiten wechseln.']],
  circ:[['Kniebeugen','Füße schulterbreit, Po nach hinten, Fersen am Boden.'],['Ausfallschritte','Abwechselnd nach vorn, eine Hand an der Stange für Halt.'],['Glute Bridges','Rückenlage, Füße nah am Po, Hüfte hoch, Po fest.'],['Band-Seitschritte','Band über den Knien, leicht in die Hocke, seitlich gehen.'],['Wadenheben an der Stange','An der Stange festhalten, langsam auf die Zehen und wieder runter.'],['Unterarmstütz','Körper eine Linie, Bauch und Po fest.']],
  cool:[['Quadrizepsdehnung links',30,'Ferse zum Po, an der Stange festhalten.'],['Quadrizepsdehnung rechts',30,'Ferse zum Po, an der Stange festhalten.'],['Vorbeuge',40,'Knie leicht gebeugt, locker hängen lassen.']]}};
const HOME_LV=[[45,20,3],[50,20,3],[50,15,4]];/* Übung s, Pause s, Runden */
const homeDone=d=>S.sessions.filter(s=>s.ex.some(x=>x.home&&x.id==='home_'+d)).length;
const homeLv=d=>Math.min(HOME_LV.length-1,Math.floor(homeDone(d)/3));
function homeSteps(d){const P=HOME[d],[w,r,R]=HOME_LV[homeLv(d)],st=[...P.warm];
 for(let k=1;k<=R;k++){P.circ.forEach(([n,h],i)=>{st.push([n,w,h,{rd:k,rn:R,ex:i+1,en:P.circ.length}]);if(i<P.circ.length-1)st.push(['Pause',r,'Kurz durchatmen'])});
  if(k<R)st.push(['Pause',45,`Runde ${k} geschafft – kurz trinken`])}
 return [...st,...P.cool]}
function homeBuild(d){const st=homeSteps(d);WO['home_'+d]={n:HOME[d].n,min:Math.round(st.reduce((a,x)=>a+x[1],0)/60),steps:st};return WO['home_'+d]}
function homeStart(d){if(!HOME[d])d='push';homeBuild(d);woStart('home_'+d)}
/* Geschafft → als Krafteinheit speichern (Training +30, Wochenziel, Serie) */
function homeFinish(k){const d=k.slice(5);if(!HOME[d])return;const date=Date.now(),s={id:'s_'+date,date,day:d,start:date-WO[k].min*60000,ex:[{id:'home_'+d,name:HOME[d].n,home:true,sets:[{kg:0,reps:HOME_LV[homeLv(d)][2]}]}]};
 S.sessions.push(s);putSession(s);try{announce(s,[])}catch(e){}}
/* Training-Tab für Heim-Training */
function homeTrainHtml(){const d=HOME[day]?day:'push',P=HOME[d],w=homeBuild(d),lv=homeLv(d),[ws,rs,R]=HOME_LV[lv],n=homeDone(d),next=lv<HOME_LV.length-1?3-(n%3):0;
 return `<section class="hwo"><div class="hwh"><div><small>Zu Hause · mit Timer</small><h2>${esc(P.n)}</h2><p>${esc(P.sub)} · ca. ${w.min} min</p></div></div>
 <p class="hwlv">Stufe ${lv+1} von ${HOME_LV.length}: ${R} Runden, ${ws} s Übung, ${rs} s Pause${next?` · noch ${next}× bis Stufe ${lv+2}`:' · höchste Stufe'}</p>
 <ol class="hwl">${P.circ.map(([x,h])=>`<li>${moveSvg(x,'hwfig',x)}<div><b>${esc(x)}</b><span>${esc(h)}</span></div></li>`).join('')}</ol>
 <p class="hwnote">Dazu 2 Übungen zum Aufwärmen und Dehnen am Ende. Du brauchst: Matte${/Band/.test(P.circ.map(x=>x[0]).join())?', Band':''}${/Stange|Stuhl/.test(P.circ.map(x=>x[0]+x[1]).join())?', Stange bzw. Stuhl':''}.</p>
 <button class="primary hwgo" data-home="${d}">Training starten</button></section>`}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-home]');if(!b)return;ev.stopPropagation();homeStart(b.dataset.home)},true);
/* Anzeige im Timer: „Runde 2 von 3 · Übung 4 von 5“ statt durchgezählt */
function homeLabel(k,st){const m=st&&st[3];return /^home_/.test(k)&&m&&m.rd?`Runde ${m.rd} von ${m.rn} · Übung ${m.ex} von ${m.en}`:''}
