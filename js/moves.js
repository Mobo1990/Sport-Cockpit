/* Duo – animierte Strichmännchen für die Kurz-Workouts (SVG mit SMIL, kein Video, offline).
   Jede Übung: Posen (Gelenkpunkte im Feld 200×140, Boden bei y=122), die in einer Schleife ineinander übergehen.
   Gelenke: head, neck, hip, elbow/hand/knee/foot (beide Seiten gleich) oder elbowL/handL/… und elbowR/handR/… einzeln.
   spine: optionaler Kontrollpunkt für einen gebogenen Rücken (Katze-Kuh). */
'use strict';
const MV_FLOOR=122;
/* Grundposen */
const P_STAND={head:[100,22],neck:[100,36],hip:[100,74],elbowL:[92,54],handL:[89,72],elbowR:[108,54],handR:[111,72],kneeL:[97,98],footL:[96,MV_FLOOR],kneeR:[103,98],footR:[104,MV_FLOOR]};
const P_PLANK_UP={head:[151,62],neck:[140,70],hip:[92,94],knee:[66,107],foot:[40,MV_FLOOR],elbow:[140,95],hand:[140,MV_FLOOR]};
const P_PLANK_FORE={head:[151,90],neck:[140,97],hip:[92,106],knee:[66,113],foot:[40,MV_FLOOR],elbow:[140,MV_FLOOR],hand:[160,MV_FLOOR]};
const P_SQUAT_HANDS={head:[118,70],neck:[112,80],hip:[90,100],knee:[110,100],foot:[100,MV_FLOOR],elbow:[120,100],hand:[124,MV_FLOOR]};
const MOVES={
 'Hampelmänner':{dur:1.1,poses:[
  {head:[100,22],neck:[100,36],hip:[100,74],elbowL:[92,54],handL:[89,72],elbowR:[108,54],handR:[111,72],kneeL:[97,98],footL:[96,MV_FLOOR],kneeR:[103,98],footR:[104,MV_FLOOR]},
  {head:[100,20],neck:[100,34],hip:[100,72],elbowL:[84,24],handL:[78,8],elbowR:[116,24],handR:[122,8],kneeL:[89,97],footL:[78,MV_FLOOR],kneeR:[111,97],footR:[122,MV_FLOOR]}]},
 'Kniebeugen':{dur:2.2,poses:[
  {head:[100,20],neck:[100,34],hip:[98,72],knee:[102,97],foot:[100,MV_FLOOR],elbow:[114,40],hand:[128,42]},
  {head:[100,46],neck:[96,58],hip:[78,92],knee:[110,94],foot:[100,MV_FLOOR],elbow:[112,62],hand:[128,62]}]},
 'Liegestütze':{dur:2,poses:[P_PLANK_UP,
  {head:[152,98],neck:[140,104],hip:[92,112],knee:[66,116],foot:[40,MV_FLOOR],elbow:[124,104],hand:[140,MV_FLOOR]}]},
 'Unterarmstütz':{dur:3,poses:[P_PLANK_FORE,{...P_PLANK_FORE,hip:[92,104],head:[151,89]}]},
 'Seitstütz':{dur:3,poses:[
  {head:[150,66],neck:[140,74],hip:[95,97],knee:[70,108],foot:[45,MV_FLOOR],elbowL:[140,MV_FLOOR],handL:[158,MV_FLOOR],elbowR:[130,54],handR:[124,34]},
  {head:[150,68],neck:[140,76],hip:[95,101],knee:[70,110],foot:[45,MV_FLOOR],elbowL:[140,MV_FLOOR],handL:[158,MV_FLOOR],elbowR:[130,56],handR:[124,36]}]},
 'Crunches':{dur:2,poses:[
  {head:[50,111],neck:[62,114],hip:[100,117],knee:[120,96],foot:[140,MV_FLOOR],elbow:[56,100],hand:[50,106]},
  {head:[66,90],neck:[74,100],hip:[100,117],knee:[120,96],foot:[140,MV_FLOOR],elbow:[70,84],hand:[62,92]}]},
 'Beinheben':{dur:2.6,poses:[
  {head:[46,113],neck:[58,115],hip:[100,117],knee:[102,90],foot:[104,63],elbow:[78,119],hand:[96,MV_FLOOR]},
  {head:[46,113],neck:[58,115],hip:[100,117],knee:[126,113],foot:[152,109],elbow:[78,119],hand:[96,MV_FLOOR]}]},
 'Mountain Climbers':{dur:0.9,poses:[
  {...P_PLANK_UP,kneeL:[112,102],footL:[98,114],kneeR:[66,107],footR:[40,MV_FLOOR]},
  {...P_PLANK_UP,kneeL:[66,107],footL:[40,MV_FLOOR],kneeR:[112,102],footR:[98,114]}]},
 'Ausfallschritte':{dur:2.4,poses:[
  {head:[100,20],neck:[100,34],hip:[100,72],elbow:[90,54],hand:[98,70],kneeL:[98,97],footL:[98,MV_FLOOR],kneeR:[102,97],footR:[102,MV_FLOOR]},
  {head:[98,40],neck:[98,54],hip:[96,90],elbow:[88,72],hand:[96,88],kneeL:[80,116],footL:[64,MV_FLOOR],kneeR:[120,98],footR:[122,MV_FLOOR]}]},
 'Glute Bridges':{dur:2.2,poses:[
  {head:[46,113],neck:[58,115],hip:[96,117],knee:[116,94],foot:[132,MV_FLOOR],elbow:[76,119],hand:[94,MV_FLOOR]},
  {head:[46,113],neck:[58,115],hip:[96,94],knee:[118,90],foot:[132,MV_FLOOR],elbow:[76,119],hand:[94,MV_FLOOR]}]},
 'Burpees':{dur:3.2,poses:[
  {head:[100,14],neck:[100,28],hip:[100,66],elbowL:[92,12],handL:[90,-4],elbowR:[108,12],handR:[110,-4],kneeL:[98,90],footL:[98,112],kneeR:[102,90],footR:[102,112]},
  P_SQUAT_HANDS,P_PLANK_UP,P_SQUAT_HANDS]},
 'Schulterkreisen':{dur:2.4,poses:[
  {head:[100,20],neck:[100,34],hip:[100,74],elbow:[100,18],hand:[100,4],knee:[100,98],foot:[100,MV_FLOOR]},
  {head:[100,20],neck:[100,34],hip:[100,74],elbow:[116,34],hand:[132,36],knee:[100,98],foot:[100,MV_FLOOR]},
  {head:[100,20],neck:[100,34],hip:[100,74],elbow:[100,52],hand:[100,68],knee:[100,98],foot:[100,MV_FLOOR]},
  {head:[100,20],neck:[100,34],hip:[100,74],elbow:[84,34],hand:[68,36],knee:[100,98],foot:[100,MV_FLOOR]}]},
 'Katze-Kuh':{dur:3.2,poses:[
  {head:[144,100],neck:[134,86],hip:[86,86],spine:[110,62],elbow:[136,104],hand:[138,MV_FLOOR],knee:[84,MV_FLOOR],foot:[58,MV_FLOOR]},
  {head:[148,76],neck:[136,88],hip:[86,88],spine:[110,104],elbow:[136,104],hand:[138,MV_FLOOR],knee:[84,MV_FLOOR],foot:[58,MV_FLOOR]}]},
 'Hüftbeuger':{dur:3,poses:[
  {head:[96,38],neck:[96,52],hip:[96,90],elbow:[88,70],hand:[96,86],kneeL:[80,MV_FLOOR],footL:[56,MV_FLOOR],kneeR:[120,96],footR:[124,MV_FLOOR]},
  {head:[102,40],neck:[102,54],hip:[104,94],elbow:[94,72],hand:[102,88],kneeL:[80,MV_FLOOR],footL:[56,MV_FLOOR],kneeR:[124,96],footR:[126,MV_FLOOR]}]},
 'Weltbeste Dehnung':{dur:3.2,poses:[
  {head:[136,76],neck:[126,82],hip:[96,104],elbowL:[124,102],handL:[120,MV_FLOOR],elbowR:[122,100],handR:[118,116],kneeL:[80,112],footL:[50,MV_FLOOR],kneeR:[122,100],footR:[126,MV_FLOOR]},
  {head:[136,72],neck:[126,80],hip:[96,104],elbowL:[124,102],handL:[120,MV_FLOOR],elbowR:[128,58],handR:[132,36],kneeL:[80,112],footL:[50,MV_FLOOR],kneeR:[122,100],footR:[126,MV_FLOOR]}]},
 'Brustdehnung':{dur:3.4,wall:150,poses:[
  {head:[106,20],neck:[106,34],hip:[104,74],elbowL:[96,54],handL:[94,72],elbowR:[148,36],handR:[148,14],knee:[104,98],foot:[104,MV_FLOOR]},
  {head:[102,21],neck:[102,35],hip:[102,74],elbowL:[92,54],handL:[90,72],elbowR:[148,36],handR:[148,14],knee:[102,98],foot:[102,MV_FLOOR]}]},
 'Vorbeuge':{dur:3.4,poses:[
  {head:[100,20],neck:[100,34],hip:[98,72],elbow:[100,54],hand:[100,72],knee:[100,97],foot:[100,MV_FLOOR]},
  {head:[130,98],neck:[122,86],hip:[94,70],elbow:[120,104],hand:[114,120],knee:[100,97],foot:[100,MV_FLOOR]}]}};
/* Namen mit Seite → Grundübung, gespiegelt bei „rechts“ */
function moveFor(name){const n=String(name||'').replace(/\s+(links|rechts)$/,'');const m=MOVES[n];if(!m)return null;return{m,mirror:/rechts$/.test(name||'')}}
const MV_SEG=[['neck','elbowL'],['elbowL','handL'],['hip','kneeL'],['kneeL','footL'],['hip','kneeR'],['kneeR','footR'],['neck','elbowR'],['elbowR','handR']];
const mvJ=(p,j)=>p[j]||p[j.replace(/[LR]$/,'')];
function moveSvg(name,cls='wofig'){const f=moveFor(name);if(!f)return '';const {m,mirror}=f,ps=[...m.poses,m.poses[0]],n=ps.length,
 kt=ps.map((_,i)=>(i/(n-1)).toFixed(3)).join(';'),ks=Array(n-1).fill('0.45 0 0.55 1').join(';'),
 an=(attr,vals)=>`<animate attributeName="${attr}" values="${vals.join(';')}" keyTimes="${kt}" keySplines="${ks}" calcMode="spline" dur="${m.dur}s" repeatCount="indefinite"/>`,
 v=(j,k)=>ps.map(p=>mvJ(p,j)[k]),p0=m.poses[0];
 const lines=MV_SEG.map(([a,b],i)=>{const back=i<4;return `<line x1="${mvJ(p0,a)[0]}" y1="${mvJ(p0,a)[1]}" x2="${mvJ(p0,b)[0]}" y2="${mvJ(p0,b)[1]}" class="${back?'mvb':'mvf'}">${an('x1',v(a,0))}${an('y1',v(a,1))}${an('x2',v(b,0))}${an('y2',v(b,1))}</line>`}),
  sp=ps.map(p=>p.spine||[(p.neck[0]+p.hip[0])/2,(p.neck[1]+p.hip[1])/2]),
  torso=`<path d="M${p0.neck[0]} ${p0.neck[1]} Q${sp[0][0]} ${sp[0][1]} ${p0.hip[0]} ${p0.hip[1]}" class="mvf">${an('d',ps.map((p,i)=>`M${p.neck[0]} ${p.neck[1]} Q${sp[i][0]} ${sp[i][1]} ${p.hip[0]} ${p.hip[1]}`))}</path>`,
  head=`<circle cx="${p0.head[0]}" cy="${p0.head[1]}" r="10" class="mvh">${an('cx',v('head',0))}${an('cy',v('head',1))}</circle>`,
  wall=m.wall?`<line x1="${m.wall}" y1="0" x2="${m.wall}" y2="${MV_FLOOR}" class="mvw"/>`:'';
 return `<svg class="${cls}" viewBox="0 -10 200 140" role="img" aria-label="Strichmännchen zeigt: ${esc(name)}"><line x1="10" y1="${MV_FLOOR+1}" x2="190" y2="${MV_FLOOR+1}" class="mvw"/>${wall}<g${mirror?' transform="translate(200 0) scale(-1 1)"':''}>${lines.slice(0,4).join('')}${torso}${head}${lines.slice(4).join('')}</g></svg>`}
