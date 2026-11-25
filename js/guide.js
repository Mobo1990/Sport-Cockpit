/* Duo – Anleitungen für die Gym-Übungen: Muskeln, Einstellung, Ausführung, animierte Strichmännchen
   und die optionalen Dehn-Programme nach Push/Pull/Legs (zählen nicht für die Wochen-Challenge). */
'use strict';
/* m = Muskeln, s = Schritte (Einstellung → Ausführung), v = Hinweis je Variante (steht vor den Schritten) */
const GUIDE={
 bank:{m:'Brust, vordere Schulter, Trizeps',s:['Auf die Bank legen, Augen unter der Stange, Füße fest am Boden.','Schulterblätter zusammen und nach unten ziehen, Po bleibt auf der Bank.','Griff etwas breiter als schulterbreit, Handgelenke gerade.','Kontrolliert zur unteren Brust senken, Ellbogen etwa 45° vom Körper, dann kräftig hochdrücken.'],
  v:{Kurzhantel:'Hanteln seitlich der Brust starten, oben leicht zueinander führen.',Multipresse:'Bank so stellen, dass die Stange auf die untere Brust trifft. Sicherungshaken einhängen.',Maschine:'Sitz so einstellen, dass die Griffe auf Brusthöhe sind.'}},
 schraeg:{m:'Obere Brust, vordere Schulter, Trizeps',s:['Bank auf 30° stellen – steiler trainiert mehr die Schulter.','Schulterblätter zusammen, Füße fest am Boden.','Gewicht zur oberen Brust senken, Ellbogen leicht unter Schulterhöhe.','Hochdrücken, oben nicht ganz durchstrecken.'],
  v:{Multipresse:'Bank so stellen, dass die Stange auf die obere Brust trifft.',Maschine:'Sitz so einstellen, dass die Griffe auf Höhe der oberen Brust sind.'}},
 fly:{m:'Brust, vordere Schulter',s:['Arme leicht gebeugt – der Winkel bleibt die ganze Zeit gleich.','Hände in einem Bogen vor der Brust zusammenführen, 1 Sek. drücken.','Langsam zurück, bis du eine Dehnung in der Brust spürst.'],
  v:{Kabelzug:'Beide Rollen auf Schulterhöhe oder etwas höher, Aufsatz: Einzelgriffe. Ein Schritt nach vorn in Schrittstellung, Oberkörper leicht vor.','Butterfly-Maschine':'Sitz so einstellen, dass die Griffe auf Brusthöhe sind, Rücken an der Lehne.',Kurzhantel:'Auf der Flachbank, Hanteln seitlich nur bis Schulterhöhe senken.'}},
 schulter:{m:'Schultern (vorne und seitlich), Trizeps',s:['Bauch fest anspannen, kein Hohlkreuz.','Gewicht auf Schulterhöhe, Ellbogen leicht vor dem Körper.','Über den Kopf drücken, oben nicht zusammenschlagen.','Langsam zurück bis etwa Ohrhöhe.'],
  v:{Kurzhantel:'Am besten im Sitzen, Rückenlehne fast senkrecht.',Langhantel:'Im Stehen, Stange liegt auf der vorderen Schulter, Kopf beim Drücken kurz nach hinten nehmen.',Maschine:'Sitz so, dass die Griffe auf Schulterhöhe starten.'}},
 seit:{m:'Seitliche Schulter',s:['Aufrecht stehen, Knie locker, lieber leichtes Gewicht.','Arme leicht gebeugt seitlich bis Schulterhöhe heben – nicht höher.','Die Ellbogen führen, kleiner Finger minimal oben.','Ohne Schwung, 2 Sek. absenken.'],
  v:{Kabelzug:'Rolle ganz unten, Aufsatz: Einzelgriff. Kabel läuft vor dem Körper zur anderen Hand, eine Seite nach der anderen.',Maschine:'Polster am Oberarm kurz über dem Ellbogen.'}},
 dips:{m:'Trizeps, untere Brust, vordere Schulter',s:['Arme gestreckt, Schultern weg von den Ohren.','Knie leicht gebeugt, Füße überkreuzt.','Oberkörper leicht vor = mehr Brust, aufrecht = mehr Trizeps.','Absenken, bis die Oberarme etwa parallel zum Boden sind, dann hochdrücken.'],
  v:{Assistiert:'Knie auf das Polster. kg = Hilfe: je weniger, desto schwerer.',Maschine:'Griffe auf Höhe der unteren Brust, Ellbogen zeigen nach hinten.'}},
 trizeps:{m:'Trizeps (Rückseite Oberarm)',s:['Nah am Kabel stehen, leicht vorgebeugt, Füße hüftbreit.','Ellbogen fest an der Seite – nur die Unterarme bewegen sich.','Nach unten strecken, 1 Sek. halten.','Langsam hoch, bis die Unterarme etwa waagerecht sind.'],
  v:{'Kabelzug Seil':'Rolle ganz oben, Aufsatz: Seil. Unten das Seil auseinanderziehen.','Kabelzug Stange':'Rolle ganz oben, Aufsatz: gerade Stange oder V-Griff.','Kurzhantel über Kopf':'Sitzend, eine Hantel mit beiden Händen hinter dem Kopf, Ellbogen zeigen nach oben.'}},
 klimm:{m:'Breiter Rückenmuskel (Latissimus), Bizeps, hintere Schulter',s:['Griff etwas breiter als schulterbreit, Handflächen nach vorn.','Aus dem gestreckten Hang starten, zuerst die Schultern nach unten ziehen.','Brust zur Stange, Ellbogen ziehen Richtung Hüfte.','Langsam ganz ablassen, ohne Schwung.'],
  v:{Assistiert:'Knie auf das Polster. kg = Hilfe: je weniger, desto schwerer.','Körpergewicht + Zusatz':'Zusatzgewicht am Dip-Gürtel erst, wenn 10 saubere Wiederholungen klappen.'}},
 rudern:{m:'Mittlerer Rücken, Latissimus, hintere Schulter, Bizeps',s:['Bauch fest anspannen – das schützt den unteren Rücken.','Rücken gerade, Blick schräg nach unten.','Zum Bauchnabel ziehen, Ellbogen nah am Körper, Schulterblätter zusammen.','Langsam ablassen, Arme fast strecken.'],
  v:{Langhantel:'Hüftbreit stehen, Knie leicht gebeugt, Hüfte nach hinten, bis der Oberkörper etwa 45° vorgeneigt ist.','Kurzhantel einarmig':'Knie und Hand derselben Seite auf die Bank, Hantel zur Hüfte ziehen.','Kabelzug sitzend':'Füße an die Platte, Aufsatz: enger V-Griff. Aufrecht sitzen, nicht nach hinten schaukeln.',Maschine:'Brust ans Polster, Sitz so, dass die Griffe auf Brusthöhe sind.'}},
 latzug:{m:'Latissimus, Bizeps, hintere Schulter',s:['Knie unter die Polster klemmen, Oberschenkel sitzen fest.','Brust raus, leicht zurücklehnen (10–15°).','Erst die Schultern nach unten ziehen, dann die Stange zur oberen Brust.','Ellbogen zielen nach unten Richtung Hüfte. Langsam hoch, oben Arme fast strecken.'],
  v:{'Breiter Griff':'Lange gerade Stange, Hände deutlich breiter als die Schultern. Betont den äußeren, oberen Latissimus – die Rückenbreite.','Enger Griff':'Aufsatz: enger V-Griff, Handflächen zueinander. Längerer Weg, betont den unteren Latissimus und den Bizeps stärker.'}},
 face:{m:'Hintere Schulter, oberer Rücken, Rotatorenmanschette',s:['Schrittstellung oder hüftbreit, 1–2 Schritte zurück, Oberkörper aufrecht, Bauch fest.','Zur Stirn ziehen, Ellbogen bleiben hoch – auf Schulterhöhe oder darüber.','Am Ende sind die Hände außen neben dem Kopf, wie beim Doppelbizeps. 1 Sek. halten.','Langsam zurück, Arme fast gestreckt.'],
  v:{'Kabelzug Seil':'Rolle auf Kopf- bis Stirnhöhe, Aufsatz: Seil. Von oben greifen, Daumen zeigen zu dir.',Band:'Band auf Kopfhöhe befestigen, gleiche Bewegung.'}},
 revfly:{m:'Hintere Schulter, oberer Rücken',s:['Leichtes Gewicht – der Muskel ist klein.','Arme fast gestreckt, die Bewegung kommt aus der Schulter.','Arme seitlich nach hinten bis Schulterhöhe, Schultern nicht hochziehen.','Kurz halten, langsam zurück.'],
  v:{Maschine:'Butterfly-Maschine andersherum: Brust ans Polster, Griffe auf Schulterhöhe.',Kabelzug:'Beide Rollen auf Schulterhöhe, Kabel überkreuz greifen, ohne Aufsatz.',Kurzhantel:'Oberkörper weit vorgebeugt, Rücken gerade.'}},
 curl:{m:'Bizeps, Unterarm',s:['Aufrecht, hüftbreit, Bauch fest.','Ellbogen bleiben seitlich am Körper.','Hochbeugen, oben 1 Sek. anspannen, in 2–3 Sek. ablassen.','Kein Schwung aus dem Rücken.'],
  v:{Kabelzug:'Rolle ganz unten, Aufsatz: gerade Stange oder SZ-Griff.','SZ-Stange':'Die gewellte Stange schont die Handgelenke.',Kurzhantel:'Beim Hochbeugen die Handfläche nach oben drehen.'}},
 hammer:{m:'Bizeps, Oberarmmuskel (Brachialis), Unterarm',s:['Handflächen zeigen zueinander, Daumen nach oben.','Ellbogen bleiben am Körper.','Hochbeugen, langsam ablassen.'],
  v:{'Kabelzug Seil':'Rolle ganz unten, Aufsatz: Seil.'}},
 squat:{m:'Oberschenkel vorne, Po, Beinbeuger, Rumpf',k:'Box-Kniebeuge: nur bis zur Bank oder einem Kasten absetzen, Knie bleiben hinter den Zehen. Oder Beinpresse mit den Füßen weit oben.',s:['Füße schulterbreit, Zehen leicht nach außen.','Tief einatmen, Bauch fest anspannen.','Hüfte nach hinten und unten, Knie zeigen in Richtung Zehen.','Mindestens bis Oberschenkel parallel, Fersen bleiben am Boden, kräftig hochdrücken.'],
  v:{Langhantel:'Ablage auf Brusthöhe, Stange auf den oberen Rücken – nicht auf den Nacken.',Multipresse:'Füße etwas vor die Stange stellen, Sicherungen einhängen.','Goblet Kurzhantel':'Hantel senkrecht vor der Brust, Ellbogen zwischen den Knien.'}},
 rdl:{m:'Beinbeuger (hinten), Po, unterer Rücken',s:['Hüftbreit stehen, Knie leicht gebeugt – sie bleiben so.','Hüfte nach hinten schieben, das Gewicht gleitet an den Beinen entlang.','Rücken gerade, Bauch fest, Schultern zurück.','Runter bis zur Dehnung hinten im Oberschenkel (etwa Kniehöhe), dann Hüfte nach vorn.']},
 kreuz:{m:'Po, Beinbeuger, Rückenstrecker, Oberschenkel',k:'Trap Bar nehmen, sie entlastet Knie und Rücken.',s:['Füße hüftbreit, Stange über der Fußmitte.','Hände direkt neben den Beinen, Schienbeine an die Stange.','Brust raus, Rücken gerade, Bauch fest.','Aus den Beinen drücken, Stange nah am Körper, oben aufrichten ohne Hohlkreuz.'],
  v:{'Trap Bar':'In die Mitte stellen, Griffe seitlich – schont den Rücken.'}},
 presse:{m:'Oberschenkel vorne, Po',k:'Füße höher auf die Platte stellen und nur bis etwa 90° beugen, langsam ablassen.',s:['Rücken ganz an die Lehne, Po bleibt unten.','Füße schulterbreit mittig – höher = mehr Po, tiefer = mehr Oberschenkel.','Sicherung lösen, ablassen bis die Knie etwa 90° gebeugt sind.','Wegdrücken, Knie nicht ganz durchstrecken.']},
 beuger:{m:'Beinbeuger (Rückseite Oberschenkel)',s:['Drehpunkt der Maschine auf Höhe des Kniegelenks.','Polster knapp über der Ferse.','Fersen Richtung Po, kurz halten, in 2–3 Sek. zurück.'],
  v:{Liegend:'Hüfte bleibt am Polster.',Sitzend:'Oberschenkelpolster fest über den Knien.'}},
 strecker:{m:'Oberschenkel vorne (Quadrizeps)',k:'Leichtes Gewicht und nur die obere Hälfte der Bewegung – oder stattdessen Beinpresse mit Füßen oben.',s:['Rückenlehne so, dass die Knie am Drehpunkt sind.','Polster vorn am Schienbein, knapp über dem Fuß.','Hochstrecken, oben 1 Sek. halten, langsam ablassen.']},
 ausfall:{m:'Oberschenkel vorne, Po, Beinbeuger',k:'Rückwärts-Ausfallschritte mit kurzem Schritt – oder stattdessen Hip Thrusts bzw. Glute Bridges.',s:['Aufrecht, großer Schritt nach vorn.','Hinteres Knie bis knapp über den Boden, vorderes Knie über dem Fuß.','Über die vordere Ferse zurückdrücken, Seiten wechseln.'],
  v:{Kurzhantel:'Hanteln seitlich halten.',Langhantel:'Stange auf dem oberen Rücken wie bei Kniebeugen.',Multipresse:'Schrittstellung unter der Stange, die Füße bleiben stehen.'}},
 waden:{m:'Waden',k:'Sitzend an der Maschine statt stehend, wenn die Knie zwicken.',s:['Fußballen auf die Kante, Fersen frei.','Ganz runter in die Dehnung.','Auf die Zehenspitzen hoch, oben 1–2 Sek. halten.','Knie bleiben fast gestreckt.'],
  v:{Sitzend:'Polster auf die Oberschenkel – trifft mehr die tiefe Wadenmuskulatur.','An der Beinpresse':'Nur die Fußballen an die untere Kante der Platte.'}}
};
const guideOf=e=>{const g=GUIDE[e.id];if(!g)return null;return{m:g.m,k:g.k,s:[...(g.v&&g.v[e.v]?[g.v[e.v]]:[]),...g.s]}};

/* Gym-Strichmännchen (Seitenansicht nach rechts, außer Front-Übungen mit L/R) */
const GSTAND={head:[100,20],neck:[100,34],hip:[98,72],knee:[100,97],foot:[100,MV_FLOOR]};
const GFRONT={head:[100,20],neck:[100,34],hip:[100,72],kneeL:[96,97],footL:[94,MV_FLOOR],kneeR:[104,97],footR:[106,MV_FLOOR]};
const FLY_OPEN={...GFRONT,elbowL:[76,40],handL:[56,42],elbowR:[124,40],handR:[144,42]},FLY_SHUT={...GFRONT,elbowL:[86,50],handL:[98,56],elbowR:[114,50],handR:[102,56]};
const BENCH_LIE={head:[150,88],neck:[136,92],hip:[84,94],knee:[60,92],foot:[54,MV_FLOOR]};
Object.assign(MOVES,{
 'gym:bank':{dur:2.6,load:['hand'],props:['40,101 160,101','56,101 56,121','146,101 146,121'],poses:[{...BENCH_LIE,elbow:[136,74],hand:[136,56]},{...BENCH_LIE,elbow:[118,100],hand:[128,84]}]},
 'gym:schraeg':{dur:2.6,load:['hand'],props:['60,106 92,106 128,72','76,106 76,121'],poses:[
  {head:[134,56],neck:[124,66],hip:[90,98],knee:[64,98],foot:[58,MV_FLOOR],elbow:[132,46],hand:[138,28]},
  {head:[134,56],neck:[124,66],hip:[90,98],knee:[64,98],foot:[58,MV_FLOOR],elbow:[110,76],hand:[124,58]}]},
 'gym:fly':{dur:2.6,cable:[[16,10,'handL'],[184,10,'handR']],poses:[FLY_OPEN,FLY_SHUT]},
 'gym:schulter':{dur:2.4,load:['handL','handR'],lr:5,poses:[
  {...GFRONT,elbowL:[80,50],handL:[78,32],elbowR:[120,50],handR:[122,32]},{...GFRONT,elbowL:[84,16],handL:[90,0],elbowR:[116,16],handR:[110,0]}]},
 'gym:seit':{dur:2.4,load:['handL','handR'],lr:5,poses:[
  {...GFRONT,elbowL:[90,54],handL:[87,72],elbowR:[110,54],handR:[113,72]},{...GFRONT,elbowL:[78,38],handL:[60,38],elbowR:[122,38],handR:[140,38]}]},
 'gym:dips':{dur:2.4,props:['86,68 134,68','128,68 128,121'],poses:[
  {head:[104,22],neck:[102,36],hip:[98,74],knee:[92,96],foot:[78,96],elbow:[103,51],hand:[106,66]},
  {head:[112,48],neck:[106,60],hip:[94,94],knee:[90,112],foot:[74,110],elbow:[86,54],hand:[106,66]}]},
 'gym:trizeps':{dur:2,cable:[[134,-8,'hand']],poses:[{...GSTAND,elbow:[104,58],hand:[120,46]},{...GSTAND,elbow:[104,58],hand:[110,80]}]},
 'gym:klimm':{dur:2.6,props:['64,-4 136,-4'],poses:[
  {head:[100,28],neck:[98,42],hip:[96,80],knee:[94,102],foot:[86,112],elbow:[102,22],hand:[104,-4]},
  {head:[100,4],neck:[98,16],hip:[96,54],knee:[94,76],foot:[86,86],elbow:[112,18],hand:[104,-4]}]},
 'gym:rudern':{dur:2.2,load:['hand'],poses:[
  {head:[132,40],neck:[120,46],hip:[82,70],knee:[88,96],foot:[86,MV_FLOOR],elbow:[120,64],hand:[120,86]},
  {head:[132,40],neck:[120,46],hip:[82,70],knee:[88,96],foot:[86,MV_FLOOR],elbow:[100,40],hand:[110,64]}]},
 'gym:latzug':{dur:2.4,cable:[[106,-10,'hand']],props:['80,92 114,92','96,92 96,121','118,74 130,74'],poses:[
  {head:[100,32],neck:[100,46],hip:[96,84],knee:[124,82],foot:[126,108],elbow:[106,24],hand:[110,4]},
  {head:[98,32],neck:[100,46],hip:[96,84],knee:[124,82],foot:[126,108],elbow:[96,64],hand:[112,46]}]},
 'gym:face':{dur:2.4,cable:[[184,24,'hand']],poses:[
  {...GSTAND,elbow:[122,38],hand:[144,36]},{...GSTAND,elbow:[84,30],hand:[102,14]}]},
 'gym:revfly':{dur:2.4,load:['handL','handR'],lr:5,poses:[FLY_SHUT,FLY_OPEN]},
 'gym:curl':{dur:2.4,load:['hand'],poses:[{...GSTAND,elbow:[102,56],hand:[106,78]},{...GSTAND,elbow:[102,56],hand:[118,40]}]},
 'gym:squat':{dur:2.6,load:['hand'],poses:[
  {...GSTAND,elbow:[88,46],hand:[96,32]},{head:[110,46],neck:[104,58],hip:[76,92],knee:[110,94],foot:[100,MV_FLOOR],elbow:[92,70],hand:[100,56]}]},
 'gym:rdl':{dur:2.8,load:['hand'],poses:[{...GSTAND,elbow:[102,54],hand:[102,74]},{head:[125,54],neck:[113,62],hip:[82,84],knee:[104,98],foot:[100,MV_FLOOR],elbow:[112,82],hand:[110,101]}]},
 'gym:kreuz':{dur:2.8,load:['hand'],lr:9,poses:[
  {head:[132,54],neck:[120,60],hip:[82,88],knee:[112,96],foot:[100,MV_FLOOR],elbow:[116,84],hand:[112,104]},{...GSTAND,elbow:[102,54],hand:[102,74]}]},
 'gym:presse':{dur:2.6,props:['36,112 74,112 46,62','100,98 120,62'],poses:[
  {head:[42,58],neck:[48,70],hip:[72,104],knee:[90,88],foot:[110,72],elbow:[60,92],hand:[72,104]},
  {head:[42,58],neck:[48,70],hip:[72,104],knee:[78,78],foot:[96,84],elbow:[60,92],hand:[72,104]}]},
 'gym:beuger':{dur:2.4,props:['46,104 160,104','60,104 60,121','150,104 150,121'],poses:[
  {head:[152,92],neck:[140,96],hip:[98,98],knee:[74,98],foot:[50,98],elbow:[146,108],hand:[136,104]},
  {head:[152,92],neck:[140,96],hip:[98,98],knee:[74,98],foot:[74,74],elbow:[146,108],hand:[136,104]}]},
 'gym:strecker':{dur:2.4,props:['80,96 112,96','82,96 76,54','96,96 96,121'],poses:[
  {head:[88,40],neck:[90,54],hip:[96,92],knee:[120,92],foot:[122,118],elbow:[92,74],hand:[104,94]},
  {head:[88,40],neck:[90,54],hip:[96,92],knee:[120,92],foot:[144,90],elbow:[92,74],hand:[104,94]}]},
 'gym:ausfall':{dur:2.4,load:['hand'],lr:5,poses:MOVES['Ausfallschritte'].poses},
 'gym:waden':{dur:1.8,load:['hand'],lr:5,props:['84,121 118,121'],poses:[
  {...GSTAND,elbow:[100,54],hand:[100,74]},{head:[100,12],neck:[100,26],hip:[98,64],knee:[100,89],foot:[104,MV_FLOOR-2],elbow:[100,46],hand:[100,66]}]},
 /* Dehnungen für die Dehn-Programme */
 'Kindhaltung':{dur:4,poses:[
  {head:[122,110],neck:[110,108],hip:[72,102],knee:[98,120],foot:[64,120],elbow:[134,114],hand:[158,120]},
  {head:[124,108],neck:[112,104],hip:[74,96],knee:[98,120],foot:[64,120],elbow:[136,112],hand:[158,120]}]},
 'Trizepsdehnung':{dur:3.6,poses:[
  {...GFRONT,elbowL:[92,8],handL:[104,32],elbowR:[118,28],handR:[96,10]},{...GFRONT,elbowL:[90,6],handL:[104,30],elbowR:[118,26],handR:[94,8]}]},
 'Quadrizepsdehnung':{dur:3.6,poses:[
  {head:[100,20],neck:[100,34],hip:[100,72],kneeL:[100,97],footL:[100,MV_FLOOR],kneeR:[102,98],footR:[86,80],elbowL:[114,48],handL:[128,50],elbowR:[94,58],handR:[86,80]},
  {head:[100,20],neck:[100,34],hip:[100,72],kneeL:[100,97],footL:[100,MV_FLOOR],kneeR:[104,98],footR:[86,76],elbowL:[114,48],handL:[128,50],elbowR:[94,56],handR:[86,76]}]},
 'Wadendehnung':{dur:3.6,wall:160,poses:[
  {head:[138,36],neck:[128,46],hip:[104,74],kneeL:[128,100],footL:[134,MV_FLOOR],kneeR:[88,98],footR:[72,MV_FLOOR],elbow:[144,46],hand:[159,40]},
  {head:[141,38],neck:[131,48],hip:[108,76],kneeL:[132,100],footL:[134,MV_FLOOR],kneeR:[90,99],footR:[72,MV_FLOOR],elbow:[146,48],hand:[159,42]}]}
});
MOVES['gym:hammer']=MOVES['gym:curl'];
const gymMove=e=>MOVES['gym:'+e.id+'|'+e.v]?'gym:'+e.id+'|'+e.v:MOVES['gym:'+e.id]?'gym:'+e.id:null;

/* Dehn-Programme nach dem Training: optional, ohne Punkte und ohne Wochen-Challenge */
Object.assign(WO,{
 flex_push:{n:'Dehnen nach Push',min:5,steps:[['Schulterkreisen',30,'Locker, große Kreise vor und zurück.'],['Brustdehnung links',40,'Unterarm an Wand oder Türrahmen, Oberkörper wegdrehen.'],['Brustdehnung rechts',40,'Unterarm an Wand oder Türrahmen, Oberkörper wegdrehen.'],['Trizepsdehnung links',30,'Ellbogen sanft mit der anderen Hand nach hinten ziehen.'],['Trizepsdehnung rechts',30,'Ellbogen sanft mit der anderen Hand nach hinten ziehen.'],['Katze-Kuh',40,'Im Vierfüßler, Rücken rund und hohl.'],['Kindhaltung',50,'Arme weit nach vorn, ruhig in den Bauch atmen.'],['Vorbeuge',40,'Knie leicht gebeugt, locker hängen lassen.']]},
 flex_pull:{n:'Dehnen nach Pull',min:5,steps:[['Schulterkreisen',30,'Locker, große Kreise vor und zurück.'],['Kindhaltung',50,'Hände weit nach vorn schieben – dehnt den Latissimus.'],['Katze-Kuh',40,'Im Vierfüßler, Rücken rund und hohl.'],['Brustdehnung links',35,'Gegenspieler zum Rücken: Brust öffnen.'],['Brustdehnung rechts',35,'Gegenspieler zum Rücken: Brust öffnen.'],['Weltbeste Dehnung',50,'Ausfallschritt, Arm zur Decke drehen, Seiten wechseln.'],['Vorbeuge',40,'Knie leicht gebeugt, locker hängen lassen.']]},
 flex_legs:{n:'Dehnen nach Legs',min:5,steps:[['Quadrizepsdehnung links',35,'Ferse zum Po, Knie zeigen nach unten, Bauch fest.'],['Quadrizepsdehnung rechts',35,'Ferse zum Po, Knie zeigen nach unten, Bauch fest.'],['Hüftbeuger links',40,'Ausfallschritt, Hüfte nach vorn schieben.'],['Hüftbeuger rechts',40,'Ausfallschritt, Hüfte nach vorn schieben.'],['Wadendehnung links',30,'Hinteres Bein gestreckt, Ferse am Boden.'],['Wadendehnung rechts',30,'Hinteres Bein gestreckt, Ferse am Boden.'],['Vorbeuge',45,'Dehnt die Beinbeuger. Knie leicht gebeugt.'],['Weltbeste Dehnung',45,'Ausfallschritt, Arm zur Decke drehen, Seiten wechseln.']]}
});

/* Eigene Animation je Ausführung, wo sie sich sichtbar unterscheidet (Schlüssel gym:<id>|<Variante>) */
{const M=MOVES,B=k=>M['gym:'+k],X=(k,o)=>({...B(k),...o}),RAIL='97,-8 97,121',
 SEAT_F={hip:[100,74],kneeL:[92,92],footL:[92,MV_FLOOR],kneeR:[108,92],footR:[108,MV_FLOOR]},
 SEAT_S={head:[78,32],neck:[76,46],hip:[80,88],knee:[108,88],foot:[112,MV_FLOOR]},SEAT_P=['70,92 104,92','72,92 66,40','86,92 86,121'];
 const alt=(o1,o2)=>[{...GSTAND,elbowL:[102,56],handL:o1,elbowR:[102,56],handR:o2},{...GSTAND,elbowL:[102,56],handL:o2,elbowR:[102,56],handR:o1}];
 Object.assign(M,{
 'gym:bank|Kurzhantel':X('bank',{lr:5,load:['hand']}),
 'gym:bank|Multipresse':X('bank',{props:[...B('bank').props,'136,-8 136,121']}),
 'gym:bank|Maschine':{dur:2.4,load:['hand'],lr:4,props:SEAT_P,poses:[{...SEAT_S,elbow:[66,62],hand:[90,52]},{...SEAT_S,elbow:[98,50],hand:[122,48]}]},
 'gym:schraeg|Kurzhantel':X('schraeg',{lr:5}),
 'gym:schraeg|Multipresse':X('schraeg',{props:[...B('schraeg').props,'138,-8 138,121']}),
 'gym:schraeg|Maschine':{dur:2.4,load:['hand'],lr:4,props:SEAT_P,poses:[{...SEAT_S,elbow:[66,60],hand:[88,46]},{...SEAT_S,elbow:[96,38],hand:[116,26]}]},
 'gym:fly|Butterfly-Maschine':{dur:2.6,props:['78,76 122,76'],poses:[{...GFRONT,...SEAT_F,elbowL:[72,38],handL:[70,16],elbowR:[128,38],handR:[130,16]},{...GFRONT,...SEAT_F,elbowL:[92,42],handL:[96,18],elbowR:[108,42],handR:[104,18]}]},
 'gym:fly|Kurzhantel':X('bank',{lr:5,poses:[{...BENCH_LIE,elbow:[134,74],hand:[136,56]},{...BENCH_LIE,elbow:[130,98],hand:[148,104]}]}),
 'gym:schulter|Langhantel':{dur:2.4,load:['hand'],poses:[{...GSTAND,elbow:[112,50],hand:[108,32]},{...GSTAND,elbow:[104,12],hand:[102,-6]}]},
 'gym:schulter|Maschine':X('schulter',{props:['78,76 122,76'],lr:4,poses:B('schulter').poses.map(p=>({...p,...SEAT_F}))}),
 'gym:seit|Kabelzug':{dur:2.4,cable:[[78,121,'handR']],poses:[{...GFRONT,elbowL:[86,54],handL:[94,72],elbowR:[110,56],handR:[96,76]},{...GFRONT,elbowL:[86,54],handL:[94,72],elbowR:[124,40],handR:[142,40]}]},
 'gym:seit|Maschine':{dur:2.4,props:['78,76 122,76'],poses:[{...GFRONT,...SEAT_F,elbowL:[86,56],handL:[86,74],elbowR:[114,56],handR:[114,74]},{...GFRONT,...SEAT_F,elbowL:[72,38],handL:[72,56],elbowR:[128,38],handR:[128,56]}]},
 'gym:dips|Assistiert':X('dips',{load:['knee'],lr:6,poses:B('dips').poses.map(p=>({...p,knee:[p.hip[0]-2,p.hip[1]+24],foot:[p.hip[0]-24,p.hip[1]+26]}))}),
 'gym:dips|Maschine':{dur:2.4,load:['hand'],lr:4,props:['80,92 112,92','82,92 76,48','96,92 96,121'],poses:[
  {head:[99,38],neck:[98,52],hip:[96,90],knee:[124,90],foot:[126,MV_FLOOR],elbow:[86,60],hand:[102,66]},{head:[99,38],neck:[98,52],hip:[96,90],knee:[124,90],foot:[126,MV_FLOOR],elbow:[94,72],hand:[100,94]}]},
 'gym:trizeps|Kurzhantel über Kopf':{dur:2.6,load:['hand'],lr:6,props:['80,92 112,92','96,92 96,121'],poses:[
  {head:[100,38],neck:[98,52],hip:[96,90],knee:[124,90],foot:[126,MV_FLOOR],elbow:[104,30],hand:[106,8]},{head:[100,38],neck:[98,52],hip:[96,90],knee:[124,90],foot:[126,MV_FLOOR],elbow:[104,30],hand:[86,46]}]},
 'gym:klimm|Assistiert':X('klimm',{load:['knee'],lr:6,poses:B('klimm').poses.map(p=>({...p,knee:[p.hip[0]+2,p.hip[1]+24],foot:[p.hip[0]-20,p.hip[1]+28]}))}),
 'gym:rudern|Kurzhantel einarmig':{dur:2.2,load:['handR'],lr:5,props:['60,96 132,96','70,96 70,121','122,96 122,121'],poses:[
  {head:[130,70],neck:[118,72],hip:[80,74],kneeL:[90,96],footL:[66,96],kneeR:[78,98],footR:[76,MV_FLOOR],elbowL:[118,84],handL:[118,96],elbowR:[120,90],handR:[120,110]},
  {head:[130,70],neck:[118,72],hip:[80,74],kneeL:[90,96],footL:[66,96],kneeR:[78,98],footR:[76,MV_FLOOR],elbowL:[118,84],handL:[118,96],elbowR:[100,62],handR:[108,86]}]},
 'gym:rudern|Kabelzug sitzend':{dur:2.4,cable:[[184,92,'hand']],props:['70,104 100,104','142,88 142,114'],poses:[
  {head:[92,48],neck:[90,62],hip:[84,100],knee:[116,88],foot:[140,102],elbow:[112,74],hand:[132,80]},{head:[88,48],neck:[88,62],hip:[84,100],knee:[116,88],foot:[140,102],elbow:[72,74],hand:[96,84]}]},
 'gym:rudern|Maschine':{dur:2.4,load:['hand'],lr:4,props:['70,96 100,96','86,96 86,121','126,46 126,82'],poses:[
  {head:[120,44],neck:[112,54],hip:[84,92],knee:[114,92],foot:[118,MV_FLOOR],elbow:[132,62],hand:[150,64]},{head:[120,44],neck:[112,54],hip:[84,92],knee:[114,92],foot:[118,MV_FLOOR],elbow:[94,60],hand:[112,66]}]},
 'gym:latzug|Breiter Griff':{dur:2.4,cable:[[100,-10,'handL'],[100,-10,'handR']],props:['76,84 124,84'],poses:[
  {head:[100,32],neck:[100,46],hip:[100,82],kneeL:[90,98],footL:[88,MV_FLOOR],kneeR:[110,98],footR:[112,MV_FLOOR],elbowL:[74,22],handL:[62,0],elbowR:[126,22],handR:[138,0]},
  {head:[100,32],neck:[100,46],hip:[100,82],kneeL:[90,98],footL:[88,MV_FLOOR],kneeR:[110,98],footR:[112,MV_FLOOR],elbowL:[68,58],handL:[66,36],elbowR:[132,58],handR:[134,36]}]},
 'gym:latzug|Enger Griff':{dur:2.6,cable:[[100,-10,'handL'],[100,-10,'handR']],props:['76,84 124,84'],poses:[
  {head:[100,32],neck:[100,46],hip:[100,82],kneeL:[90,98],footL:[88,MV_FLOOR],kneeR:[110,98],footR:[112,MV_FLOOR],elbowL:[94,22],handL:[97,0],elbowR:[106,22],handR:[103,0]},
  {head:[100,32],neck:[100,46],hip:[100,82],kneeL:[90,98],footL:[88,MV_FLOOR],kneeR:[110,98],footR:[112,MV_FLOOR],elbowL:[84,66],handL:[96,46],elbowR:[116,66],handR:[104,46]}]},
 'gym:revfly|Kabelzug':X('revfly',{load:[],cable:[[16,30,'handR'],[184,30,'handL']]}),
 'gym:revfly|Kurzhantel':{dur:2.4,load:['hand'],lr:5,poses:[
  {head:[132,40],neck:[120,46],hip:[82,70],knee:[88,96],foot:[86,MV_FLOOR],elbow:[124,66],hand:[126,86]},{head:[132,40],neck:[120,46],hip:[82,70],knee:[88,96],foot:[86,MV_FLOOR],elbow:[118,34],hand:[116,16]}]},
 'gym:curl|Kurzhantel':{dur:3,load:['handL','handR'],lr:5,poses:alt([106,78],[118,40])},
 'gym:curl|Kabelzug':X('curl',{lr:4,cable:[[132,121,'hand']]}),
 'gym:hammer':{dur:3,load:['handL','handR'],lr:5,poses:alt([106,78],[118,40])},
 'gym:hammer|Kabelzug Seil':X('curl',{lr:4,cable:[[132,121,'hand']]}),
 'gym:squat|Multipresse':X('squat',{props:[RAIL]}),
 'gym:squat|Goblet Kurzhantel':X('squat',{lr:6,poses:[{...GSTAND,elbow:[108,52],hand:[112,38]},{head:[110,46],neck:[104,58],hip:[76,92],knee:[110,94],foot:[100,MV_FLOOR],elbow:[112,78],hand:[120,64]}]}),
 'gym:rdl|Kurzhantel':X('rdl',{lr:5}),
 'gym:presse|Horizontal':{dur:2.6,props:['50,100 90,100','52,100 44,56','136,80 136,108'],poses:[
  {head:[50,44],neck:[54,58],hip:[70,96],knee:[92,72],foot:[110,92],elbow:[62,80],hand:[74,98]},{head:[50,44],neck:[54,58],hip:[70,96],knee:[102,90],foot:[132,94],elbow:[62,80],hand:[74,98]}]},
 'gym:beuger|Sitzend':{dur:2.4,props:SEAT_P,poses:[{...SEAT_S,foot:[136,88],elbow:[84,70],hand:[98,84]},{...SEAT_S,foot:[104,116],elbow:[84,70],hand:[98,84]}]},
 'gym:ausfall|Langhantel':X('ausfall',{lr:7,poses:B('ausfall').poses.map((p,i)=>({...p,elbow:[p.neck[0]-12,p.neck[1]+12],hand:[p.neck[0]-4,p.neck[1]-2]}))}),
 'gym:waden|Sitzend':{dur:1.8,load:['knee'],lr:5,props:['60,80 100,80','80,80 80,121'],poses:[
  {head:[70,22],neck:[70,36],hip:[74,76],knee:[104,76],foot:[106,MV_FLOOR],elbow:[86,60],hand:[100,72]},{head:[70,18],neck:[70,32],hip:[74,72],knee:[104,70],foot:[108,MV_FLOOR-4],elbow:[86,56],hand:[100,68]}]},
 'gym:waden|An der Beinpresse':X('presse',{dur:1.8,poses:[
  {head:[42,58],neck:[48,70],hip:[72,104],knee:[90,88],foot:[108,70],elbow:[60,92],hand:[72,104]},{head:[42,58],neck:[48,70],hip:[72,104],knee:[91,87],foot:[114,64],elbow:[60,92],hand:[72,104]}]})
 });
 M['gym:ausfall|Multipresse']={...M['gym:ausfall|Langhantel'],props:[RAIL]};
}

/* Knieschonende Varianten für Challenges und Kurz-Workouts */
Object.assign(MOVES,{
 'Stuhl-Kniebeugen':{dur:2.4,props:['62,92 88,92','64,92 64,121','86,92 86,121','62,92 60,58'],poses:[
  {head:[100,20],neck:[100,34],hip:[96,72],knee:[102,97],foot:[102,MV_FLOOR],elbow:[112,42],hand:[126,44]},
  {head:[108,40],neck:[102,52],hip:[84,88],knee:[108,94],foot:[102,MV_FLOOR],elbow:[114,58],hand:[128,58]}]},
 'Step-Jacks':{dur:1.6,poses:[
  {head:[100,22],neck:[100,36],hip:[100,74],elbowL:[92,54],handL:[89,72],elbowR:[108,54],handR:[111,72],kneeL:[97,98],footL:[96,MV_FLOOR],kneeR:[103,98],footR:[104,MV_FLOOR]},
  {head:[100,22],neck:[100,36],hip:[100,74],elbowL:[84,24],handL:[78,8],elbowR:[116,24],handR:[122,8],kneeL:[97,98],footL:[96,MV_FLOOR],kneeR:[112,98],footR:[124,MV_FLOOR]},
  {head:[100,22],neck:[100,36],hip:[100,74],elbowL:[92,54],handL:[89,72],elbowR:[108,54],handR:[111,72],kneeL:[97,98],footL:[96,MV_FLOOR],kneeR:[103,98],footR:[104,MV_FLOOR]},
  {head:[100,22],neck:[100,36],hip:[100,74],elbowL:[84,24],handL:[78,8],elbowR:[116,24],handR:[122,8],kneeL:[88,98],footL:[76,MV_FLOOR],kneeR:[103,98],footR:[104,MV_FLOOR]}]}
});
MOVES['Burpees ohne Sprung']={dur:3.6,poses:[{...MOVES['Burpees'].poses[0],handL:[89,72],elbowL:[92,54],handR:[111,72],elbowR:[108,54],footL:[98,MV_FLOOR],footR:[102,MV_FLOOR],kneeL:[98,98],kneeR:[102,98],head:[100,22],neck:[100,36],hip:[100,74]},...MOVES['Burpees'].poses.slice(1)]};

