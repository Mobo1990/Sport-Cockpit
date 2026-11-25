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
/* Haushalt statt Hanteln: Rucksack (Bücher / Wasserflaschen), Sofa, Stuhl, Handtuch, Treppe */
{const M=MOVES,POLE=x=>`${x},-10 ${x},122`,CHAIR=x=>[`${x},92 ${x+30},92`,`${x+4},92 ${x+4},121`,`${x+26},92 ${x+26},121`];
 Object.assign(M,{
 'Rucksack-Kniebeugen':{...M['Kniebeugen'],load:['hand'],lr:8},
 'Hip Thrust am Sofa':{dur:2.4,load:['hip'],lr:8,props:['30,94 70,94 70,121'],poses:[
  {head:[50,86],neck:[64,92],hip:[96,112],knee:[122,96],foot:[128,MV_FLOOR],elbow:[82,104],hand:[96,108]},
  {head:[52,84],neck:[66,92],hip:[100,90],knee:[126,92],foot:[128,MV_FLOOR],elbow:[84,92],hand:[100,86]}]},
 'Bulgarische Split-Squats':{dur:2.6,props:CHAIR(48),poses:[
  {head:[104,18],neck:[104,32],hip:[102,70],elbow:[98,50],hand:[104,64],kneeL:[110,96],footL:[112,MV_FLOOR],kneeR:[86,94],footR:[70,90]},
  {head:[102,38],neck:[102,52],hip:[98,88],elbow:[96,70],hand:[102,84],kneeL:[120,100],footL:[114,MV_FLOOR],kneeR:[84,112],footR:[70,90]}]},
 'Handtuch-Beinbeuger':{dur:2.6,props:['132,121 162,121'],poses:[
  {head:[46,113],neck:[58,115],hip:[96,104],knee:[124,110],foot:[150,MV_FLOOR-2],elbow:[76,119],hand:[94,MV_FLOOR]},
  {head:[46,113],neck:[58,115],hip:[96,94],knee:[118,88],foot:[134,MV_FLOOR-2],elbow:[76,119],hand:[94,MV_FLOOR]}]},
 'Step-ups':{dur:2.6,props:['110,98 150,98','114,98 114,121','146,98 146,121'],poses:[
  {head:[98,20],neck:[98,34],hip:[98,72],elbow:[96,54],hand:[100,70],kneeL:[98,97],footL:[98,MV_FLOOR],kneeR:[116,78],footR:[124,96]},
  {head:[120,0],neck:[120,14],hip:[120,52],elbow:[118,34],hand:[122,50],kneeL:[112,76],footL:[104,92],kneeR:[124,76],footR:[126,96]}]},
 'Band-Rudern':{dur:2.4,props:[POLE(172)],cable:[[172,90,'hand']],poses:[
  {head:[86,66],neck:[84,80],hip:[80,118],knee:[110,MV_FLOOR-2],foot:[140,MV_FLOOR-2],elbow:[110,88],hand:[136,90]},
  {head:[82,66],neck:[82,80],hip:[80,118],knee:[110,MV_FLOOR-2],foot:[140,MV_FLOOR-2],elbow:[64,90],hand:[94,92]}]}});}
/* Programme nach Recherche (ACSM 2026: jeder Muskel ≥ 2×/Woche, 2–3 Sätze; Bänder wirken ähnlich wie Hanteln;
   leichte Last wirkt, wenn die letzten Wiederholungen schwer werden): drei Ganzkörper-Einheiten A/B/C,
   jede mit Beinen/Po, Drücken, Ziehen und Rumpf. Schlüssel push/pull/legs bleiben für Wochenstreifen und Punkte. */
const HOME={
 push:{n:'Ganzkörper A',k:'A',sub:'Beine · Rücken · Brust · Po · Bauch',warm:[['Hampelmänner',40,'Locker warm werden.'],['Katze-Kuh',40,'Im Vierfüßler, Rücken rund und hohl.']],
  circ:[['Rucksack-Kniebeugen','Rucksack mit Büchern oder Wasserflaschen vor die Brust, Po nach hinten, Fersen am Boden.'],['Stangen-Rudern','Stange greifen, Körper gerade nach hinten lehnen, Brust zur Stange ziehen. Je flacher, desto schwerer.'],['Liegestütze','Zu schwer? Hände aufs Sofa oder Knie ab. Zu leicht? Füße hoch.'],['Hip Thrust am Sofa','Schultern an die Sofakante, Rucksack auf die Hüfte, Hüfte hoch, oben Po fest.'],['Band-Face-Pull','Band auf Kopfhöhe an der Stange, zum Gesicht ziehen, Ellbogen hoch und weit.'],['Unterarmstütz','Körper eine Linie, Bauch und Po fest.']],
  cool:[['Brustdehnung links',30,'Unterarm an die Stange, Oberkörper wegdrehen.'],['Brustdehnung rechts',30,'Unterarm an die Stange, Oberkörper wegdrehen.'],['Kindhaltung',40,'Arme weit nach vorn, ruhig atmen.']]},
 pull:{n:'Ganzkörper B',k:'B',sub:'Beine · Rücken · Schultern · Po · Bauch',warm:[['Hampelmänner',40,'Locker warm werden.'],['Weltbeste Dehnung',40,'Ausfallschritt, Arm zur Decke drehen, Seiten wechseln.']],
  circ:[['Bulgarische Split-Squats','Hinterer Fuß auf dem Stuhl, eine Hand an der Stange. Halbe Zeit links, halbe rechts.'],['Band-Latzug','Band oben an der Stange, auf den Stuhl setzen, Ellbogen nach unten zu den Hüften ziehen.'],['Band-Schulterdrücken','Auf das Band stellen, Griffe auf Schulterhöhe, gerade nach oben drücken.'],['Handtuch-Beinbeuger','Rückenlage, Fersen auf ein Handtuch (glatter Boden), Hüfte hoch, Fersen heranziehen.'],['Band-Bizepscurl','Auf das Band stellen, Ellbogen am Körper. Ohne Band: zwei volle Wasserflaschen.'],['Seitstütz','Hüfte hoch, nicht durchhängen. Halbe Zeit links, halbe rechts.']],
  cool:[['Quadrizepsdehnung links',30,'Ferse zum Po, an der Stange festhalten.'],['Quadrizepsdehnung rechts',30,'Ferse zum Po, an der Stange festhalten.'],['Trizepsdehnung links',25,'Ellbogen sanft nach hinten ziehen.'],['Trizepsdehnung rechts',25,'Ellbogen sanft nach hinten ziehen.']]},
 legs:{n:'Ganzkörper C',k:'C',sub:'Beine · Rücken · Arme · Po · Bauch',warm:[['Hampelmänner',40,'Locker warm werden.'],['Schulterkreisen',40,'Große Kreise vor und zurück.']],
  circ:[['Step-ups','Auf einen stabilen Stuhl oder die Treppe steigen, ganz aufrichten. Seiten abwechseln.'],['Band-Rudern','Sitzen, Band um die Stange, Ellbogen nah am Körper nach hinten ziehen.'],['Trizeps-Dips am Stuhl','Hände an die Stuhlkante, Po nah am Stuhl, Ellbogen nach hinten beugen.'],['Glute Bridges','Rückenlage, Füße nah am Po, Hüfte hoch. Zu leicht? Ein Bein strecken.'],['Band-Seitschritte','Band über den Knien, leicht in die Hocke, seitlich gehen.'],['Superman','Bauchlage, Arme und Beine leicht anheben, kurz halten, ablegen.']],
  cool:[['Vorbeuge',40,'Knie leicht gebeugt, locker hängen lassen.'],['Hüftbeuger links',30,'Ausfallschritt, Hüfte nach vorn schieben.'],['Hüftbeuger rechts',30,'Ausfallschritt, Hüfte nach vorn schieben.']]}};
const HOME_LV=[[45,20,3],[50,20,3],[50,15,3]];/* Übung s, Pause s, Runden */
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
 return `<section class="hwo"><div class="hwh"><div><small>Zu Hause · Ganzkörper · mit Timer</small><h2>${esc(P.n)}</h2><p>${esc(P.sub)} · ca. ${w.min} min</p></div></div>
 <p class="hwlv">Stufe ${lv+1} von ${HOME_LV.length}: ${R} Runden, ${ws} s Übung, ${rs} s Pause${next?` · noch ${next}× bis Stufe ${lv+2}`:' · höchste Stufe'}</p>
 <ol class="hwl">${P.circ.map(([x,h])=>`<li>${moveSvg(x,'hwfig',x)}<div><b>${esc(x)}</b><span>${esc(h)}</span></div></li>`).join('')}</ol>
 <p class="hwnote"><b>So wirkt es:</b> In jeder Übung so viele saubere Wiederholungen wie möglich – die letzten 2–3 sollen richtig schwer sein. Zu leicht? Rucksack voller packen, Band kürzer greifen oder steiler stehen.</p>
 <p class="hwnote">Du brauchst: Matte, Band, Stange${/Rucksack/.test(P.circ.map(x=>x[0]+x[1]).join())?', Rucksack mit Büchern oder Wasserflaschen':''}${/Sofa/.test(P.circ.map(x=>x[0]+x[1]).join())?', Sofa':''}${/Stuhl/.test(P.circ.map(x=>x[0]+x[1]).join())?', stabilen Stuhl':''}${/Handtuch/.test(P.circ.map(x=>x[0]+x[1]).join())?', Handtuch':''}. Am besten 3× pro Woche: A, B, C.</p>
 <button class="primary hwgo" data-home="${d}">Training starten</button></section>`}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-home]');if(!b)return;ev.stopPropagation();homeStart(b.dataset.home)},true);
/* Anzeige im Timer: „Runde 2 von 3 · Übung 4 von 5“ statt durchgezählt */
function homeLabel(k,st){const m=st&&st[3];return /^home_/.test(k)&&m&&m.rd?`Runde ${m.rd} von ${m.rn} · Übung ${m.ex} von ${m.en}`:''}
/* Für Heim-Training: Tagesknöpfe und Überschrift zeigen A/B/C statt Push/Pull/Legs */
const homeDayName=d=>isHome()&&HOME[d]?HOME[d].n:DAYS[d].n;
const _renderHeadHome=renderHead;renderHead=function(){_renderHeadHome();if(!isHome())return;
 document.querySelectorAll('[data-a=day]').forEach(b=>{const d=b.dataset.d;if(HOME[d])b.textContent=HOME[d].n.replace('Ganzkörper ','Tag ')});
 if(HOME[day]){$('dayName').textContent=HOME[day].n;$('daySub').textContent=HOME[day].sub}
 const nx=document.getElementById('nextDay');if(nx){const ld=lastDay();nx.textContent=ld?`Als Nächstes dran: ${HOME[DAYS[ld].nx]?HOME[DAYS[ld].nx].n:DAYS[DAYS[ld].nx].n}`:'Tipp: Starte mit Ganzkörper A'}};
