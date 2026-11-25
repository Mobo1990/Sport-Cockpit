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
const HOME_HOLD=/stütz$/;/* Halteübungen: keine Wiederholungen */
const RUCK='Rucksack mit ca. 5 kg (5 volle 1-l-Flaschen)';
/* Deutsche Namen (Tester-Wunsch) → Strichmännchen aus der Bibliothek */
{const M=MOVES,A={'Kniebeugen mit Rucksack':'Rucksack-Kniebeugen','Rudern an der Stange':'Stangen-Rudern','Po-Heben am Sofa':'Hip Thrust am Sofa','Band zum Gesicht ziehen':'Band-Face-Pull',
 'Ausfallschritt, Fuß auf dem Sofa':'Bulgarische Split-Squats','Band nach unten ziehen':'Band-Latzug','Band über Kopf drücken':'Band-Schulterdrücken','Fersen ranziehen (Handtuch)':'Handtuch-Beinbeuger',
 'Arme beugen mit Band':'Band-Bizepscurl','Auf die Stufe steigen':'Step-ups','Rudern mit Band':'Band-Rudern','Stuhl-Stütz':'Trizeps-Dips am Stuhl','Po-Heben am Boden':'Glute Bridges',
 'Seitschritte mit Band':'Band-Seitschritte','Rücken heben in Bauchlage':'Superman','Seitschritte im Stand':'Step-Jacks','Arme heben in Bauchlage':'Superman','Rudern mit Wasserflaschen':'gym:rudern',
 'Arme beugen mit Flaschen':'gym:curl','Liegestütze mit Po hoch':'Pike-Liegestütze','Kniebeugen bis zum Stuhl':'Stuhl-Kniebeugen'};for(const [n,k] of Object.entries(A))if(M[k])M[n]=M[k]}
/* Übung: [Name, Kurz-Anleitung (1 Satz), Leichter]. Standard: ohne Geräte – Band und Stange nur, wenn vorhanden. */
const WARM_Q=['Seitschritte im Stand',40,'Leise warm werden, Arme mit.'];
const HOME={
 push:{n:'Ganzkörper A',k:'A',sub:'Beine · Rücken · Brust · Po · Bauch',warm:[WARM_Q,['Katze-Kuh',40,'Rücken rund und hohl.']],
  circ:[['Kniebeugen mit Rucksack',`${RUCK} vor die Brust, Po nach hinten.`,'Ohne Rucksack, nur bis zum Stuhl.'],
   ['Rudern mit Wasserflaschen','Vorgebeugt, Rücken gerade, volle Flaschen zum Bauch ziehen.','Kleinere Flaschen.'],
   ['Liegestütze','Körper eine Linie, Brust Richtung Boden.','Hände aufs Sofa oder Knie ab.'],
   ['Po-Heben am Sofa','Schultern ans Sofa, Rucksack auf die Hüfte, Hüfte hoch.','Ohne Rucksack.'],
   ['Arme heben in Bauchlage','Bauchlage, Arme als Y anheben, kurz halten.','Nur ein Arm.'],
   ['Unterarmstütz','Körper eine Linie, Bauch fest.','Knie auf den Boden.']],
  cool:[['Brustdehnung links',30,'Unterarm an die Wand, Oberkörper wegdrehen.'],['Brustdehnung rechts',30,'Unterarm an die Wand, Oberkörper wegdrehen.'],['Kindhaltung',40,'Arme weit nach vorn, ruhig atmen.']]},
 pull:{n:'Ganzkörper B',k:'B',sub:'Beine · Rücken · Schultern · Po · Bauch',warm:[WARM_Q,['Weltbeste Dehnung',40,'Ausfallschritt, Arm zur Decke drehen.']],
  circ:[['Ausfallschritt, Fuß auf dem Sofa','Hinterer Fuß aufs Sofa, Hand an der Wand. Halbe Zeit je Bein.','Beide Füße am Boden.'],
   ['Rudern mit Wasserflaschen','Vorgebeugt, Rücken gerade, volle Flaschen zum Bauch ziehen.','Kleinere Flaschen.'],
   ['Liegestütze mit Po hoch','Po hoch wie ein umgedrehtes V, Kopf Richtung Boden.','Hände aufs Sofa.'],
   ['Fersen ranziehen (Handtuch)','Rückenlage, Fersen auf dem Handtuch, Hüfte hoch, Fersen ranziehen.','Nur die Hüfte hochhalten.'],
   ['Arme beugen mit Flaschen','Ellbogen am Körper, Flaschen zu den Schultern.','Kleinere Flaschen.'],
   ['Seitstütz','Hüfte hoch. Halbe Zeit je Seite.','Unteres Knie auf den Boden.']],
  cool:[['Quadrizepsdehnung links',30,'Ferse zum Po, an der Wand festhalten.'],['Quadrizepsdehnung rechts',30,'Ferse zum Po, an der Wand festhalten.'],['Trizepsdehnung links',25,'Ellbogen sanft nach hinten ziehen.'],['Trizepsdehnung rechts',25,'Ellbogen sanft nach hinten ziehen.']]},
 legs:{n:'Ganzkörper C',k:'C',sub:'Beine · Rücken · Arme · Po · Bauch',warm:[WARM_Q,['Schulterkreisen',40,'Große Kreise vor und zurück.']],
  circ:[['Auf die Stufe steigen','Unterste Treppenstufe, ganz aufrichten, Seiten wechseln.','Am Geländer festhalten.'],
   ['Rudern mit Wasserflaschen','Vorgebeugt, Rücken gerade, volle Flaschen zum Bauch ziehen.','Kleinere Flaschen.'],
   ['Stuhl-Stütz','Hände an die Kante eines festen Stuhls, Ellbogen nach hinten beugen.','Knie gebeugt, Füße näher.'],
   ['Po-Heben am Boden','Rückenlage, Füße nah am Po, Hüfte hoch.','Kleinere Bewegung.'],
   ['Seitliches Beinheben','Seitlich liegen, oberes Bein heben. Halbe Zeit je Seite.','Kleinere Bewegung.'],
   ['Rücken heben in Bauchlage','Arme und Beine leicht anheben, kurz halten.','Nur Arme oder nur Beine.']],
  cool:[['Vorbeuge',40,'Knie leicht gebeugt, locker hängen lassen.'],['Hüftbeuger links',30,'Ausfallschritt, Hüfte nach vorn.'],['Hüftbeuger rechts',30,'Ausfallschritt, Hüfte nach vorn.']]}};
/* Mit Band oder Stange: stärkerer Zug fürs Rücken- und Schultertraining (statt der Flaschen-Übungen) */
const HOME_PLUS={push:{1:{need:'pole',x:['Rudern an der Stange','Stange greifen, schräg nach hinten lehnen, Brust zur Stange.','Aufrechter stehen.']},4:{need:'band',x:['Band zum Gesicht ziehen','Band auf Kopfhöhe an der Stange, Ellbogen hoch und weit.','Band lockerer.']}},
 pull:{1:{need:'band',x:['Band nach unten ziehen','Band oben befestigt, auf einen festen Stuhl setzen, Ellbogen zu den Hüften.','Band lockerer.']},4:{need:'band',x:['Arme beugen mit Band','Auf das Band stellen, Hände zu den Schultern.','Band lockerer.']}},
 legs:{1:{need:'band',x:['Rudern mit Band','Sitzen, Band um Stange oder Tür, Ellbogen nach hinten.','Band lockerer.']},4:{need:'band',x:['Seitschritte mit Band','Band über den Knien, leicht in die Hocke, seitlich gehen.','Ohne Band.']}}};
/* Knieschonend: keine tiefe Kniebeuge, kein Ausfallschritt, keine Stufe */
const HOME_KNEE={'Kniebeugen mit Rucksack':['Kniebeugen bis zum Stuhl','Nur bis zum Stuhl absetzen, Knie hinter den Zehen.','Höherer Stuhl oder Kissen.'],
 'Ausfallschritt, Fuß auf dem Sofa':['Po-Heben am Sofa','Schultern ans Sofa, Hüfte hoch, oben Po fest.','Flach auf dem Boden.'],
 'Auf die Stufe steigen':['Po-Heben am Boden','Rückenlage, Füße nah am Po, Hüfte hoch.','Kleinere Bewegung.']};
const homeEq=()=>{const e=(S.prof&&S.prof.heq)||{};return{band:e.band===1,pole:e.pole===1}};
const homeCirc=d=>{const eq=homeEq(),P=HOME_PLUS[d]||{},kn=typeof kneeOn==='function'&&kneeOn();return HOME[d].circ.map((c,i)=>{const p=P[i];let x=p&&eq[p.need]?p.x:c;if(kn&&HOME_KNEE[x[0]])x=HOME_KNEE[x[0]];return x})};
/* Länge: kurz (≈10 min) / normal / lang. Stufe: nach 3 Einheiten länger arbeiten, kürzer pausieren – „zu leicht“ beschleunigt, „zu schwer“ bremst */
const HOME_LEN={k:{n:'Kurz',r:2,e:4},n:{n:'Normal',r:3,e:6},l:{n:'Lang',r:4,e:6}};/* Runden, Übungen pro Runde */
const HOME_LV=[[40,20],[45,20],[50,15]];/* Übung s, Pause s */
const homeLen=()=>HOME_LEN[(S.prof&&S.prof.hlen)||'n']||HOME_LEN.n;
const homeSess=d=>S.sessions.filter(s=>s.ex.some(x=>x.home&&x.id==='home_'+d));
const homeDone=d=>homeSess(d).length;
const homeScore=d=>Math.max(0,homeSess(d).reduce((a,s)=>a+(s.feel==='l'?3:s.feel==='h'?-1:1),0));
const homeLv=d=>Math.min(HOME_LV.length-1,Math.floor(homeScore(d)/3));
function homeReps(name){let last=null,best=0;for(const s of [...S.sessions].sort((a,b)=>a.date-b.date)){const v=s.hr&&s.hr[name];if(v){last=v;best=Math.max(best,v)}}return{last,best}}
function homeSteps(d){const P=HOME[d],[w,r]=HOME_LV[homeLv(d)],L=homeLen(),C=homeCirc(d).slice(0,L.e),st=L.e<6?[P.warm[0]]:[...P.warm];
 for(let k=1;k<=L.r;k++){C.forEach(([n,h,e],i)=>{st.push([n,w,h,{rd:k,rn:L.r,ex:i+1,en:C.length,easy:e}]);if(i<C.length-1)st.push(['Pause',r,'Kurz durchatmen'])});
  if(k<L.r)st.push(['Pause',45,`Runde ${k} geschafft – kurz trinken`])}
 return [...st,...(L.e<6?P.cool.slice(0,2):P.cool)]}
const homeMin=d=>Math.round(homeSteps(d).reduce((a,x)=>a+x[1],0)/60);
function homeBuild(d){const st=homeSteps(d);WO['home_'+d]={n:HOME[d].n,min:Math.round(st.reduce((a,x)=>a+x[1],0)/60),steps:st,home:d};return WO['home_'+d]}
function homeStart(d){if(!HOME[d])d='push';homeBuild(d);woStart('home_'+d)}
/* Nächster Tag laut Plan (A → B → C) */
function homeNext(){const s=[...S.sessions].filter(x=>x.ex.some(e=>e.home)).sort((a,b)=>b.date-a.date)[0];return s?DAYS[s.day].nx:'push'}
const homeWeek=()=>{const mon=wk(Date.now()),n=S.sessions.filter(s=>wk(s.date)===mon&&s.ex.length).length,g=typeof weekGoal==='function'?weekGoal(mon):S.goal;
 const dow=(new Date().getDay()+6)%7,need=g-n,left=7-dow;return{n,g,txt:n>=g?'Wochenziel geschafft':need<=Math.ceil(left/2)?'auf Kurs':'heute wäre gut'}};
/* Geschafft → als Krafteinheit speichern (Training +30 wie im Studio, Wochenziel, Serie) */
let homeLast=null;
function homeFinish(k){const d=k.slice(5);if(!HOME[d])return;const date=Date.now(),p0=dayScore(today()).pt,s={id:'s_'+date,date,day:d,start:date-WO[k].min*60000,ex:[{id:'home_'+d,name:HOME[d].n,home:true,sets:[{kg:0,reps:homeLen().r}]}]};
 S.sessions.push(s);putSession(s);homeLast={id:s.id,d,p0};try{announce(s,[])}catch(e){}}
/* Abschluss: Punkte + Wochenstand zuerst, dann eine Frage „Wie war's?“, Wiederholungen nur auf Wunsch */
let homeRepOpen=false;
function homeDoneHtml(){if(!homeLast)return '';const s=S.sessions.find(x=>x.id===homeLast.id),pts=dayScore(today()).pt-homeLast.p0,w=homeWeek(),C=homeCirc(homeLast.d).slice(0,homeLen().e).filter(([n])=>!HOME_HOLD.test(n));
 return `<div class="hwsum"><b class="cond">+${Math.max(30,pts)}</b><span>Punkte · zählt wie Studio-Training</span><span>Diese Woche ${w.n} von ${w.g} – ${w.txt}</span></div>
 <div class="hwfeel"><b>Wie war's?</b><div>${[['l','Zu leicht'],['m','Passt'],['h','Zu schwer']].map(([k,l])=>`<button data-hw="feel" data-v="${k}" aria-pressed="${s&&s.feel===k}">${l}</button>`).join('')}</div>
 ${s&&s.feel?`<small>${s.feel==='l'?'Gut – beim nächsten Mal wird es schneller etwas länger.':s.feel==='h'?'Okay – wir steigern langsamer. Nimm ruhig die leichtere Variante.':'Prima, genau richtig.'}</small>`:''}</div>
 ${homeRepOpen?`<div class="hwrep"><b>Wiederholungen der letzten Runde</b><small>Freiwillig. Leer lassen, was du nicht weißt.</small>
 ${C.map(([n])=>{const r=homeReps(n);return `<label><span>${esc(n)}${r.last?`<i>letztes Mal: ${r.last}</i>`:''}</span><input inputmode="numeric" data-hrep="${esc(n)}" placeholder="" aria-label="Wiederholungen ${esc(n)}"></label>`}).join('')}</div>`
 :`<button class="glink" data-hw="repopen">+ Wiederholungen eintragen (freiwillig)</button>`}
 <button class="primary hwok" data-hw="saverep">Fertig</button>`}
function homeSaveReps(){const s=S.sessions.find(x=>homeLast&&x.id===homeLast.id);const hr={},rec=[];
 document.querySelectorAll('[data-hrep]').forEach(i=>{const v=Math.round(num(i.value)||0);if(v>0&&v<500){const n=i.dataset.hrep,b=homeReps(n).best;hr[n]=v;if(b&&v>b)rec.push(n)}});
 if(s&&Object.keys(hr).length){s.hr=hr;putSession(s);persist()}homeLast=null;homeRepOpen=false;woClose();render();
 if(rec.length)cheer({title:'Neuer Rekord!',sub:rec.join(' · ')})}
/* Ansage (freiwillig, Ton): Übung vorlesen */
const homeSayOn=()=>{try{return localStorage.getItem('sc.wosay')==='1'}catch(e){return false}};
function homeSay(t){if(!homeSayOn()||!window.speechSynthesis)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='de-DE';u.rate=1;speechSynthesis.speak(u)}catch(e){}}
/* Längen-Knöpfe (Training-Tab und Startseite) */
const homeLenHtml=d=>`<div class="hwlen" role="group" aria-label="Länge">${Object.entries(HOME_LEN).map(([k,v])=>{const o=S.prof.hlen;S.prof.hlen=k;const m=homeMin(d);S.prof.hlen=o;return `<button data-hw="len" data-v="${k}" aria-pressed="${((S.prof.hlen)||'n')===k}"><b>${v.n}</b><span>${m} min</span></button>`}).join('')}</div>`;
/* Training-Tab für Heim-Training: kurz und übersichtlich */
function homeTrainHtml(){const d=HOME[day]?day:'push',P=HOME[d],w=homeBuild(d),lv=homeLv(d),[ws,rs]=HOME_LV[lv],C=homeCirc(d).slice(0,homeLen().e),eq=homeEq(),wk_=homeWeek(),nx=homeNext();
 const all=C.map(c=>c[0]+c[1]).join(),need=[];if(/Rucksack/.test(all))need.push('Rucksack (ca. 5 kg)');if(/Flasche/.test(all))need.push('2 volle Wasserflaschen');if(/Sofa/.test(all))need.push('Sofa');if(/Stuhl/.test(all))need.push('fester Stuhl');if(/Handtuch/.test(all))need.push('Handtuch');if(/Stufe/.test(all))need.push('Treppenstufe');if(/Band/.test(all))need.push('Band');if(/Stange/.test(all))need.push('Stange');
 return `<section class="hwo"><p class="hwwk"><b>Diese Woche ${wk_.n} von ${wk_.g}</b> – ${wk_.txt}${nx!==d?` · laut Plan als Nächstes: <button class="glink" data-a="day" data-d="${nx}">${esc(HOME[nx].n)}</button>`:' · heute dran'}</p>
 <small>Zu Hause · ohne Studio · leise</small><h2>${esc(P.n)}</h2><p>${esc(P.sub)}</p>
 ${homeLenHtml(d)}
 <ol class="hwl">${C.map(([x,h])=>{const r=homeReps(x);return `<li>${moveSvg(x,'hwfig',x)}<div><b>${esc(x)}</b><span>${esc(h)}</span>${r.best?`<i class="hwrec">Rekord: ${r.best} Wiederholungen</i>`:''}</div></li>`}).join('')}</ol>
 <p class="hwnote"><b>Heute brauchst du:</b> Matte${need.length?', '+need.join(', '):''}.</p>
 <p class="hwnote">Die letzten 2–3 Wiederholungen jeder Übung sollen schwer sein. Bei Schmerz: aufhören. Jetzt ${ws} s pro Übung, ${rs} s Pause – nach 3 Trainings wird's etwas länger.</p>
 <div class="hweq"><span>Hast du auch:</span><button data-hw="eq" data-v="band" aria-pressed="${eq.band}">Fitnessband</button><button data-hw="eq" data-v="pole" aria-pressed="${eq.pole}">feste Stange</button><button data-hw="say" aria-pressed="${homeSayOn()}">Übungen ansagen</button></div>
 <button class="primary hwgo" data-home="${d}">Training starten · ${w.min} min</button></section>`}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-hw]');if(!b)return;const a=b.dataset.hw;
 if(a==='len'){S.prof.hlen=b.dataset.v;S.metaT=Date.now();persist();render()}
 else if(a==='eq'){const e={...((S.prof.heq)||{})},k=b.dataset.v;e[k]=homeEq()[k]?0:1;S.prof.heq=e;S.metaT=Date.now();persist();render()}
 else if(a==='say'){try{localStorage.setItem('sc.wosay',homeSayOn()?'0':'1')}catch(e){}render();if(homeSayOn())homeSay('Ansage an')}
 else if(a==='feel'){const s=S.sessions.find(x=>homeLast&&x.id===homeLast.id);if(s){s.feel=b.dataset.v;putSession(s);persist()}woRender()}
 else if(a==='repopen'){homeRepOpen=true;woRender()}
 else if(a==='saverep')homeSaveReps()});
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-home]');if(!b)return;ev.stopPropagation();homeStart(b.dataset.home)},true);
/* Anzeige im Timer: „Runde 2 von 3 · Übung 4 von 5“ statt durchgezählt */
function homeLabel(k,st){const m=st&&st[3];return /^home_/.test(k)&&m&&m.rd?`Runde ${m.rd} von ${m.rn} · Übung ${m.ex} von ${m.en}`:''}
/* Für Heim-Training: Tagesknöpfe und Überschrift zeigen A/B/C statt Push/Pull/Legs */
const homeDayName=d=>isHome()&&HOME[d]?HOME[d].n:DAYS[d].n;
const _renderHeadHome=renderHead;renderHead=function(){_renderHeadHome();if(!isHome())return;
 document.querySelectorAll('[data-a=day]').forEach(b=>{const d=b.dataset.d;if(HOME[d])b.textContent=HOME[d].n.replace('Ganzkörper ','Tag ')});
 if(HOME[day]){$('dayName').textContent=HOME[day].n;$('daySub').textContent=HOME[day].sub}
 const nx=document.getElementById('nextDay');if(nx){const n=homeNext();nx.textContent=n===day?'Heute dran laut Plan':`Laut Plan als Nächstes: ${HOME[n].n}`}};
