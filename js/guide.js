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
 squat:{m:'Oberschenkel vorne, Po, Beinbeuger, Rumpf',s:['Füße schulterbreit, Zehen leicht nach außen.','Tief einatmen, Bauch fest anspannen.','Hüfte nach hinten und unten, Knie zeigen in Richtung Zehen.','Mindestens bis Oberschenkel parallel, Fersen bleiben am Boden, kräftig hochdrücken.'],
  v:{Langhantel:'Ablage auf Brusthöhe, Stange auf den oberen Rücken – nicht auf den Nacken.',Multipresse:'Füße etwas vor die Stange stellen, Sicherungen einhängen.','Goblet Kurzhantel':'Hantel senkrecht vor der Brust, Ellbogen zwischen den Knien.'}},
 rdl:{m:'Beinbeuger (hinten), Po, unterer Rücken',s:['Hüftbreit stehen, Knie leicht gebeugt – sie bleiben so.','Hüfte nach hinten schieben, das Gewicht gleitet an den Beinen entlang.','Rücken gerade, Bauch fest, Schultern zurück.','Runter bis zur Dehnung hinten im Oberschenkel (etwa Kniehöhe), dann Hüfte nach vorn.']},
 kreuz:{m:'Po, Beinbeuger, Rückenstrecker, Oberschenkel',s:['Füße hüftbreit, Stange über der Fußmitte.','Hände direkt neben den Beinen, Schienbeine an die Stange.','Brust raus, Rücken gerade, Bauch fest.','Aus den Beinen drücken, Stange nah am Körper, oben aufrichten ohne Hohlkreuz.'],
  v:{'Trap Bar':'In die Mitte stellen, Griffe seitlich – schont den Rücken.'}},
 presse:{m:'Oberschenkel vorne, Po',s:['Rücken ganz an die Lehne, Po bleibt unten.','Füße schulterbreit mittig – höher = mehr Po, tiefer = mehr Oberschenkel.','Sicherung lösen, ablassen bis die Knie etwa 90° gebeugt sind.','Wegdrücken, Knie nicht ganz durchstrecken.']},
 beuger:{m:'Beinbeuger (Rückseite Oberschenkel)',s:['Drehpunkt der Maschine auf Höhe des Kniegelenks.','Polster knapp über der Ferse.','Fersen Richtung Po, kurz halten, in 2–3 Sek. zurück.'],
  v:{Liegend:'Hüfte bleibt am Polster.',Sitzend:'Oberschenkelpolster fest über den Knien.'}},
 strecker:{m:'Oberschenkel vorne (Quadrizeps)',s:['Rückenlehne so, dass die Knie am Drehpunkt sind.','Polster vorn am Schienbein, knapp über dem Fuß.','Hochstrecken, oben 1 Sek. halten, langsam ablassen.']},
 ausfall:{m:'Oberschenkel vorne, Po, Beinbeuger',s:['Aufrecht, großer Schritt nach vorn.','Hinteres Knie bis knapp über den Boden, vorderes Knie über dem Fuß.','Über die vordere Ferse zurückdrücken, Seiten wechseln.'],
  v:{Kurzhantel:'Hanteln seitlich halten.',Langhantel:'Stange auf dem oberen Rücken wie bei Kniebeugen.',Multipresse:'Schrittstellung unter der Stange, die Füße bleiben stehen.'}},
 waden:{m:'Waden',s:['Fußballen auf die Kante, Fersen frei.','Ganz runter in die Dehnung.','Auf die Zehenspitzen hoch, oben 1–2 Sek. halten.','Knie bleiben fast gestreckt.'],
  v:{Sitzend:'Polster auf die Oberschenkel – trifft mehr die tiefe Wadenmuskulatur.','An der Beinpresse':'Nur die Fußballen an die untere Kante der Platte.'}}
};
const guideOf=e=>{const g=GUIDE[e.id];if(!g)return null;return{m:g.m,s:[...(g.v&&g.v[e.v]?[g.v[e.v]]:[]),...g.s]}};

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
 'gym:rdl':{dur:2.8,load:['hand'],poses:[{...GSTAND,elbow:[102,54],hand:[102,74]},{head:[146,52],neck:[134,56],hip:[86,72],knee:[96,97],foot:[100,MV_FLOOR],elbow:[134,76],hand:[132,96]}]},
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
const gymMove=e=>MOVES['gym:'+e.id]?'gym:'+e.id:null;

/* Dehn-Programme nach dem Training: optional, ohne Punkte und ohne Wochen-Challenge */
Object.assign(WO,{
 flex_push:{n:'Dehnen nach Push',min:5,steps:[['Schulterkreisen',30,'Locker, große Kreise vor und zurück.'],['Brustdehnung links',40,'Unterarm an Wand oder Türrahmen, Oberkörper wegdrehen.'],['Brustdehnung rechts',40,'Unterarm an Wand oder Türrahmen, Oberkörper wegdrehen.'],['Trizepsdehnung links',30,'Ellbogen sanft mit der anderen Hand nach hinten ziehen.'],['Trizepsdehnung rechts',30,'Ellbogen sanft mit der anderen Hand nach hinten ziehen.'],['Katze-Kuh',40,'Im Vierfüßler, Rücken rund und hohl.'],['Kindhaltung',50,'Arme weit nach vorn, ruhig in den Bauch atmen.'],['Vorbeuge',40,'Knie leicht gebeugt, locker hängen lassen.']]},
 flex_pull:{n:'Dehnen nach Pull',min:5,steps:[['Schulterkreisen',30,'Locker, große Kreise vor und zurück.'],['Kindhaltung',50,'Hände weit nach vorn schieben – dehnt den Latissimus.'],['Katze-Kuh',40,'Im Vierfüßler, Rücken rund und hohl.'],['Brustdehnung links',35,'Gegenspieler zum Rücken: Brust öffnen.'],['Brustdehnung rechts',35,'Gegenspieler zum Rücken: Brust öffnen.'],['Weltbeste Dehnung',50,'Ausfallschritt, Arm zur Decke drehen, Seiten wechseln.'],['Vorbeuge',40,'Knie leicht gebeugt, locker hängen lassen.']]},
 flex_legs:{n:'Dehnen nach Legs',min:5,steps:[['Quadrizepsdehnung links',35,'Ferse zum Po, Knie zeigen nach unten, Bauch fest.'],['Quadrizepsdehnung rechts',35,'Ferse zum Po, Knie zeigen nach unten, Bauch fest.'],['Hüftbeuger links',40,'Ausfallschritt, Hüfte nach vorn schieben.'],['Hüftbeuger rechts',40,'Ausfallschritt, Hüfte nach vorn schieben.'],['Wadendehnung links',30,'Hinteres Bein gestreckt, Ferse am Boden.'],['Wadendehnung rechts',30,'Hinteres Bein gestreckt, Ferse am Boden.'],['Vorbeuge',45,'Dehnt die Beinbeuger. Knie leicht gebeugt.'],['Weltbeste Dehnung',45,'Ausfallschritt, Arm zur Decke drehen, Seiten wechseln.']]}
});
