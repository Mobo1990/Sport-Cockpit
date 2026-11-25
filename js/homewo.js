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
const RUCK='Rucksack mit ca. 5 kg (z. B. 5 volle 1-l-Flaschen)';
/* Übung: [Name, So geht's, Leichter] */
const HOME={
 push:{n:'Ganzkörper A',k:'A',sub:'Beine · Rücken · Brust · Po · Bauch',warm:[['Step-Jacks',40,'Leise warm werden: abwechselnd zur Seite tippen, Arme mit.'],['Katze-Kuh',40,'Im Vierfüßler, Rücken rund und hohl.']],
  circ:[['Rucksack-Kniebeugen',`${RUCK} vor die Brust, Po nach hinten, Fersen am Boden.`,'Ohne Rucksack und nur bis zum Stuhl runter.'],
   ['Stangen-Rudern','Stange greifen, Körper gerade nach hinten lehnen, Brust zur Stange ziehen. Je flacher, desto schwerer.','Aufrechter stehen.'],
   ['Liegestütze','Körper eine Linie, Brust Richtung Boden.','Hände aufs Sofa oder Knie ab.'],
   ['Hip Thrust am Sofa',`Schultern an die Sofakante, ${RUCK} auf die Hüfte, Hüfte hoch, oben Po fest.`,'Ohne Rucksack oder flach auf dem Boden.'],
   ['Band-Face-Pull','Band auf Kopfhöhe an der Stange, zum Gesicht ziehen, Ellbogen hoch und weit.','Einen Schritt näher zur Stange, Band lockerer.'],
   ['Unterarmstütz','Körper eine Linie, Bauch und Po fest.','Knie auf den Boden.']],
  cool:[['Brustdehnung links',30,'Unterarm an Wand oder Stange, Oberkörper wegdrehen.'],['Brustdehnung rechts',30,'Unterarm an Wand oder Stange, Oberkörper wegdrehen.'],['Kindhaltung',40,'Arme weit nach vorn, ruhig atmen.']]},
 pull:{n:'Ganzkörper B',k:'B',sub:'Beine · Rücken · Schultern · Po · Bauch',warm:[['Step-Jacks',40,'Leise warm werden: abwechselnd zur Seite tippen, Arme mit.'],['Weltbeste Dehnung',40,'Ausfallschritt, Arm zur Decke drehen, Seiten wechseln.']],
  circ:[['Bulgarische Split-Squats','Hinterer Fuß aufs Sofa, eine Hand an Wand oder Stange. Halbe Zeit links, halbe rechts.','Beide Füße am Boden (normaler Ausfallschritt im Stand).'],
   ['Band-Latzug','Band oben an der Stange, auf einen stabilen Stuhl ohne Rollen setzen, Ellbogen nach unten zu den Hüften ziehen.','Band lockerer greifen.'],
   ['Band-Schulterdrücken','Auf das Band stellen, Griffe auf Schulterhöhe, gerade nach oben drücken.','Nur mit einem Fuß aufs Band.'],
   ['Handtuch-Beinbeuger','Rückenlage, Fersen auf ein Handtuch (glatter Boden), Hüfte hoch, Fersen heranziehen.','Nur die Hüfte hochhalten.'],
   ['Band-Bizepscurl','Auf das Band stellen, Ellbogen am Körper, Hände zu den Schultern.','Band lockerer oder 0,5-l-Flaschen.'],
   ['Seitstütz','Hüfte hoch, nicht durchhängen. Halbe Zeit links, halbe rechts.','Unteres Knie auf den Boden.']],
  cool:[['Quadrizepsdehnung links',30,'Ferse zum Po, an Wand oder Stange festhalten.'],['Quadrizepsdehnung rechts',30,'Ferse zum Po, an Wand oder Stange festhalten.'],['Trizepsdehnung links',25,'Ellbogen sanft nach hinten ziehen.'],['Trizepsdehnung rechts',25,'Ellbogen sanft nach hinten ziehen.']]},
 legs:{n:'Ganzkörper C',k:'C',sub:'Beine · Rücken · Arme · Po · Bauch',warm:[['Step-Jacks',40,'Leise warm werden: abwechselnd zur Seite tippen, Arme mit.'],['Schulterkreisen',40,'Große Kreise vor und zurück.']],
  circ:[['Step-ups','Auf die unterste Treppenstufe oder eine stabile Stufe steigen, ganz aufrichten. Seiten abwechseln.','Am Geländer festhalten, langsamer.'],
   ['Band-Rudern','Sitzen, Band um die Stange, Ellbogen nah am Körper nach hinten ziehen.','Band lockerer.'],
   ['Trizeps-Dips am Stuhl','Hände an die Kante eines stabilen Stuhls ohne Rollen, Po nah am Stuhl, Ellbogen nach hinten beugen.','Füße näher ran, Knie gebeugt.'],
   ['Glute Bridges','Rückenlage, Füße nah am Po, Hüfte hoch, oben Po fest.','Kleinere Bewegung.'],
   ['Band-Seitschritte','Band über den Knien, leicht in die Hocke, seitlich gehen.','Ohne Band.'],
   ['Superman','Bauchlage, Arme und Beine leicht anheben, kurz halten, ablegen.','Nur Arme oder nur Beine heben.']],
  cool:[['Vorbeuge',40,'Knie leicht gebeugt, locker hängen lassen.'],['Hüftbeuger links',30,'Ausfallschritt, Hüfte nach vorn schieben.'],['Hüftbeuger rechts',30,'Ausfallschritt, Hüfte nach vorn schieben.']]}};
/* Ohne Band oder ohne Stange: gleichwertiger Ersatz mit Haushaltsdingen */
const HOME_ALT={
 'Stangen-Rudern':{need:'pole',x:['Wasserflaschen-Rudern','Vorgebeugt, Rücken gerade, zwei volle 1,5-l-Flaschen zum Bauch ziehen.','Kleinere Flaschen.']},
 'Band-Face-Pull':{need:'band',x:['Y-Heben in Bauchlage','Bauchlage, Arme als Y schräg nach vorn heben, Daumen zur Decke, kurz halten.','Nur einen Arm.']},
 'Band-Latzug':{need:'band',x:['Wasserflaschen-Rudern','Vorgebeugt, Rücken gerade, zwei volle 1,5-l-Flaschen zum Bauch ziehen.','Kleinere Flaschen.']},
 'Band-Schulterdrücken':{need:'band',x:['Pike-Liegestütze','Po hoch wie ein umgedrehtes V, Kopf langsam Richtung Boden senken.','Hände aufs Sofa.']},
 'Band-Bizepscurl':{need:'band',x:['Wasserflaschen-Curl','Zwei volle Flaschen, Ellbogen am Körper, Hände zu den Schultern.','Kleinere Flaschen.']},
 'Band-Rudern':{need:'band',x:['Wasserflaschen-Rudern','Vorgebeugt, Rücken gerade, zwei volle 1,5-l-Flaschen zum Bauch ziehen.','Kleinere Flaschen.']},
 'Band-Seitschritte':{need:'band',x:['Seitliches Beinheben','Seitlich liegen, oberes Bein gestreckt langsam heben und senken. Halbe Zeit je Seite.','Kleinere Bewegung.']}};
{const M=MOVES;Object.assign(M,{'Y-Heben in Bauchlage':M['Superman'],'Wasserflaschen-Rudern':M['gym:rudern'],'Wasserflaschen-Curl':M['gym:curl'],
 'Seitliches Beinheben':{dur:2.2,poses:[
  {head:[46,108],neck:[58,112],hip:[100,116],elbowL:[60,120],handL:[50,121],elbowR:[80,112],handR:[96,114],kneeL:[126,118],footL:[152,119],kneeR:[126,116],footR:[152,116]},
  {head:[46,108],neck:[58,112],hip:[100,116],elbowL:[60,120],handL:[50,121],elbowR:[80,112],handR:[96,114],kneeL:[126,118],footL:[152,119],kneeR:[124,104],footR:[148,92]}]}})}
const homeEq=()=>{const e=(S.prof&&S.prof.heq)||{};return{band:e.band!==0,pole:e.pole!==0}};
const homeCirc=d=>{const eq=homeEq();return HOME[d].circ.map(c=>{const a=HOME_ALT[c[0]];return a&&!eq[a.need]?a.x:c})};
/* Länge: kurz / normal / lang (Runden), Stufe: alle 3 Einheiten etwas länger arbeiten, kürzer pausieren */
const HOME_LEN={k:{n:'Kurz',r:2},n:{n:'Normal',r:3},l:{n:'Lang',r:4}};
const HOME_LV=[[40,20],[45,20],[50,15]];/* Übung s, Pause s */
const homeLen=()=>HOME_LEN[(S.prof&&S.prof.hlen)||'n']||HOME_LEN.n;
const homeDone=d=>S.sessions.filter(s=>s.ex.some(x=>x.home&&x.id==='home_'+d)).length;
const homeLv=d=>Math.min(HOME_LV.length-1,Math.floor(homeDone(d)/3));
/* Wiederholungen der letzten Runde (freiwillig eingetragen) → „Letztes Mal 8 · Rekord 10“ */
function homeReps(name){let last=null,best=0;for(const s of [...S.sessions].sort((a,b)=>a.date-b.date)){const v=s.hr&&s.hr[name];if(v){last=v;best=Math.max(best,v)}}return{last,best}}
function homeSteps(d){const P=HOME[d],[w,r]=HOME_LV[homeLv(d)],R=homeLen().r,C=homeCirc(d),st=[...P.warm];
 for(let k=1;k<=R;k++){C.forEach(([n,h,e],i)=>{st.push([n,w,h,{rd:k,rn:R,ex:i+1,en:C.length,easy:e}]);if(i<C.length-1)st.push(['Pause',r,'Kurz durchatmen'])});
  if(k<R)st.push(['Pause',45,`Runde ${k} geschafft – kurz trinken`])}
 return [...st,...P.cool]}
function homeBuild(d){const st=homeSteps(d);WO['home_'+d]={n:HOME[d].n,min:Math.round(st.reduce((a,x)=>a+x[1],0)/60),steps:st,home:d};return WO['home_'+d]}
function homeStart(d){if(!HOME[d])d='push';homeBuild(d);woStart('home_'+d)}
/* Geschafft → als Krafteinheit speichern (Training +30 wie im Studio, Wochenziel, Serie) */
let homeLast=null;
function homeFinish(k){const d=k.slice(5);if(!HOME[d])return;const date=Date.now(),s={id:'s_'+date,date,day:d,start:date-WO[k].min*60000,ex:[{id:'home_'+d,name:HOME[d].n,home:true,sets:[{kg:0,reps:homeLen().r}]}]};
 S.sessions.push(s);putSession(s);homeLast={id:s.id,d};try{announce(s,[])}catch(e){}}
/* Abschluss: Wiederholungen der letzten Runde eintragen (freiwillig) */
function homeDoneHtml(){if(!homeLast)return '';const C=homeCirc(homeLast.d);
 return `<div class="hwrep"><b>Wie viele saubere Wiederholungen in der letzten Runde?</b><small>Freiwillig – dann siehst du beim nächsten Mal dein Ziel und deine Rekorde.</small>
 ${C.filter(([n])=>!HOME_HOLD.test(n)).map(([n])=>{const r=homeReps(n);return `<label><span>${esc(n)}${r.last?` <i>letztes Mal ${r.last}</i>`:''}</span><input inputmode="numeric" data-hrep="${esc(n)}" placeholder="${r.last||'–'}"></label>`}).join('')}
 <button class="primary" data-hw="saverep">Speichern</button></div>`}
function homeSaveReps(){const s=S.sessions.find(x=>homeLast&&x.id===homeLast.id);if(!s)return;const hr={},rec=[];
 document.querySelectorAll('[data-hrep]').forEach(i=>{const v=Math.round(num(i.value)||0);if(v>0&&v<500){const n=i.dataset.hrep,b=homeReps(n).best;hr[n]=v;if(b&&v>b)rec.push(n)}});
 if(!Object.keys(hr).length){note('Nichts eingetragen');return}s.hr=hr;putSession(s);persist();homeLast=null;woClose();render();
 cheer({title:rec.length?'Neuer Rekord!':'Gespeichert',sub:rec.length?rec.join(' · '):'Beim nächsten Mal siehst du dein Ziel.'})}
/* Ansage (freiwillig, Ton): Übung vorlesen */
const homeSayOn=()=>{try{return localStorage.getItem('sc.wosay')==='1'}catch(e){return false}};
function homeSay(t){if(!homeSayOn()||!window.speechSynthesis)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='de-DE';u.rate=1;speechSynthesis.speak(u)}catch(e){}}
/* Training-Tab für Heim-Training */
function homeTrainHtml(){const d=HOME[day]?day:'push',P=HOME[d],w=homeBuild(d),lv=homeLv(d),[ws,rs]=HOME_LV[lv],n=homeDone(d),next=lv<HOME_LV.length-1?3-(n%3):0,C=homeCirc(d),L=(S.prof.hlen)||'n',eq=homeEq();
 const need=['Matte'];if(eq.band&&C.some(c=>/Band/.test(c[0])))need.push('Band');if(eq.pole&&C.some(c=>/Stange/.test(c[0]+c[1])))need.push('Stange');
 const all=C.map(c=>c[0]+c[1]).join();if(/Rucksack/.test(all))need.push('Rucksack (ca. 5 kg)');if(/Flasche/.test(all))need.push('Wasserflaschen');if(/Sofa/.test(all))need.push('Sofa');if(/Stuhl/.test(all))need.push('stabiler Stuhl');if(/Handtuch/.test(all))need.push('Handtuch');if(/Treppe|Stufe/.test(all))need.push('Treppe oder Stufe');
 return `<section class="hwo"><div class="hwh"><div><small>Zu Hause · Ganzkörper · leise</small><h2>${esc(P.n)}</h2><p>${esc(P.sub)}</p></div></div>
 <div class="hwlen" role="group" aria-label="Länge">${Object.entries(HOME_LEN).map(([k,v])=>{const m=Math.round((()=>{const o=S.prof.hlen;S.prof.hlen=k;const x=homeSteps(d).reduce((a,y)=>a+y[1],0);S.prof.hlen=o;return x})()/60);return `<button data-hw="len" data-v="${k}" aria-pressed="${L===k}"><b>${v.n}</b><span>${m} min</span></button>`}).join('')}</div>
 <p class="hwlv">Stufe ${lv+1} von ${HOME_LV.length}: ${ws} s Übung, ${rs} s Pause${next?` · noch ${next}× bis Stufe ${lv+2}`:' · höchste Stufe'}</p>
 <ol class="hwl">${C.map(([x,h,e])=>{const r=homeReps(x);return `<li>${moveSvg(x,'hwfig',x)}<div><b>${esc(x)}</b><span>${esc(h)}</span><em>Leichter: ${esc(e)}</em>${r.best?`<i class="hwrec">Rekord ${r.best} Wdh.${r.last&&r.last!==r.best?` · zuletzt ${r.last}`:''}</i>`:''}</div></li>`}).join('')}</ol>
 <p class="hwnote"><b>So wirkt es:</b> In jeder Übung so viele saubere Wiederholungen wie möglich – die letzten 2–3 sollen schwer sein. Zu leicht? Rucksack voller packen, Band kürzer greifen. <b>Schmerz?</b> Sofort aufhören und die leichtere Variante nehmen.</p>
 <p class="hwnote">Du brauchst: ${need.join(', ')}. Am besten 3× pro Woche: A, B, C. Zählt genau wie Training im Studio.</p>
 <div class="hweq"><span>Zu Hause habe ich:</span><button data-hw="eq" data-v="band" aria-pressed="${eq.band}">Band</button><button data-hw="eq" data-v="pole" aria-pressed="${eq.pole}">Stange</button><button data-hw="say" aria-pressed="${homeSayOn()}">Übungen ansagen</button></div>
 <button class="primary hwgo" data-home="${d}">Training starten · ${w.min} min</button></section>`}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-hw]');if(!b)return;const a=b.dataset.hw;
 if(a==='len'){S.prof.hlen=b.dataset.v;S.metaT=Date.now();persist();render()}
 else if(a==='eq'){const e={...((S.prof.heq)||{})},k=b.dataset.v;e[k]=homeEq()[k]?0:1;S.prof.heq=e;S.metaT=Date.now();persist();render()}
 else if(a==='say'){try{localStorage.setItem('sc.wosay',homeSayOn()?'0':'1')}catch(e){}render();if(homeSayOn())homeSay('Ansage an')}
 else if(a==='saverep')homeSaveReps();else if(a==='skiprep'){homeLast=null;woClose()}});
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-home]');if(!b)return;ev.stopPropagation();homeStart(b.dataset.home)},true);
/* Anzeige im Timer: „Runde 2 von 3 · Übung 4 von 5“ statt durchgezählt */
function homeLabel(k,st){const m=st&&st[3];return /^home_/.test(k)&&m&&m.rd?`Runde ${m.rd} von ${m.rn} · Übung ${m.ex} von ${m.en}`:''}
/* Für Heim-Training: Tagesknöpfe und Überschrift zeigen A/B/C statt Push/Pull/Legs */
const homeDayName=d=>isHome()&&HOME[d]?HOME[d].n:DAYS[d].n;
const _renderHeadHome=renderHead;renderHead=function(){_renderHeadHome();if(!isHome())return;
 document.querySelectorAll('[data-a=day]').forEach(b=>{const d=b.dataset.d;if(HOME[d])b.textContent=HOME[d].n.replace('Ganzkörper ','Tag ')});
 if(HOME[day]){$('dayName').textContent=HOME[day].n;$('daySub').textContent=HOME[day].sub}
 const nx=document.getElementById('nextDay');if(nx){const ld=lastDay();nx.textContent=ld?`Als Nächstes dran: ${HOME[DAYS[ld].nx]?HOME[DAYS[ld].nx].n:DAYS[DAYS[ld].nx].n}`:'Tipp: Starte mit Ganzkörper A'}};
