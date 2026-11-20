'use strict';
{
/* Richtwerte pro 100 g: Name, kcal, Protein, Kohlenhydrate, Fett, [Portion-Label, Gramm] */
const FOODS=[
['Haferflocken',370,13.5,59,7,['Portion 60 g',60]],['Skyr natur',63,11,4,0.2,['Becher 450 g',450]],['Magerquark',67,12,4,0.3,['Becher 500 g',500]],['Speisequark 20 %',109,12,3.5,5],['Griechischer Joghurt 10 %',133,6,4,10],['Naturjoghurt 1,5 %',47,3.5,4.5,1.5],['Hüttenkäse',98,12.5,2.6,4.3,['Becher 200 g',200]],['Milch 1,5 %',47,3.4,4.9,1.5,['Glas 250 ml',250]],['Milch 3,5 %',64,3.3,4.8,3.5,['Glas 250 ml',250]],['Hafermilch',46,0.5,6.7,1.5,['Glas 250 ml',250]],
['Whey Protein Pulver',380,78,6,5,['Scoop 30 g',30]],['Casein Pulver',360,80,4,2,['Scoop 30 g',30]],['Proteinriegel',350,33,30,10,['Riegel 55 g',55]],['Ei (M)',143,12.6,0.7,9.9,['1 Ei 58 g',58]],['Eiklar',48,11,0.7,0.2],
['Hähnchenbrust roh',110,23.5,0,1.5,['Filet 180 g',180]],['Hähnchenbrust gebraten',165,31,0,3.6,['Portion 150 g',150]],['Putenbrust roh',107,24,0,1],['Rinderhack 5 %',122,21,0,4.5],['Rinderhack 20 %',250,17,0,20],['Rindersteak Hüfte roh',125,22,0,4,['Steak 200 g',200]],['Schweinefilet roh',105,21,0,2],['Kochschinken',110,19,1,3.5,['Scheibe 25 g',25]],['Putenaufschnitt',100,20,1.5,1.5,['Scheibe 20 g',20]],['Salami',380,22,1,32,['Scheibe 10 g',10]],
['Lachs roh',200,20,0,13,['Filet 125 g',125]],['Thunfisch im eigenen Saft',105,24,0,1,['Dose 130 g',130]],['Garnelen',85,19,0,1],['Seelachs',80,18,0,1],['Tofu natur',125,14,1.5,7],
['Reis gekocht',130,2.7,28,0.3,['Portion 200 g',200]],['Reis roh',350,7,77,0.6,['Portion 80 g',80]],['Basmatireis roh',355,8,78,0.6,['Portion 80 g',80]],['Nudeln roh',355,12.5,71,1.5,['Portion 100 g',100]],['Nudeln gekocht',150,5.5,30,0.8],['Vollkornnudeln roh',345,14,63,2.5,['Portion 100 g',100]],['Kartoffeln',72,2,15,0.1,['Portion 250 g',250]],['Süßkartoffel',86,1.6,20,0.1],['Couscous roh',355,12,72,2],['Quinoa roh',365,14,64,6],['Gnocchi',150,3.5,32,0.5],
['Vollkornbrot',220,8,38,2,['Scheibe 50 g',50]],['Toastbrot',260,8,48,3.5,['Scheibe 28 g',28]],['Brötchen',255,9,50,1.5,['Brötchen 55 g',55]],['Laugenbrezel',260,8,52,2,['Brezel 80 g',80]],['Reiswaffeln',385,8,80,3,['Waffel 8 g',8]],['Wrap Tortilla',300,8,50,7,['Wrap 60 g',60]],['Knäckebrot',350,10,65,2,['Scheibe 10 g',10]],
['Banane',95,1.1,21,0.3,['1 Banane 120 g',120]],['Apfel',54,0.3,12,0.2,['1 Apfel 170 g',170]],['Beeren gemischt TK',45,1,8,0.4],['Heidelbeeren',57,0.7,12,0.3],['Orange',47,1,9,0.2,['1 Orange 180 g',180]],['Weintrauben',70,0.7,16,0.2],['Mango',62,0.6,13,0.4],['Ananas',55,0.5,12,0.1],['Datteln',282,2,64,0.4,['3 Stück 25 g',25]],
['Brokkoli',35,3,4,0.4],['Spinat',23,2.9,1.4,0.4],['Paprika',30,1,5,0.3,['1 Paprika 160 g',160]],['Tomate',18,0.9,3,0.2],['Gurke',12,0.6,1.8,0.1],['Möhren',36,0.9,7,0.2],['Zucchini',20,1.5,2.5,0.4],['Champignons',22,3,0.6,0.3],['Salat gemischt',15,1.2,2,0.2],['Erbsen TK',75,5.5,10,0.5],['Mais Dose',85,3,15,1.2],['Kidneybohnen Dose',95,7,13,0.5],['Kichererbsen Dose',120,7,16,2.5],['Linsen rot roh',340,24,50,1.5],['Avocado',160,2,4,15,['halbe Avocado 70 g',70]],
['Olivenöl',884,0,0,100,['1 EL 10 g',10]],['Butter',741,0.7,0.6,82,['Portion 10 g',10]],['Erdnussbutter',600,25,13,49,['1 EL 15 g',15]],['Mandeln',600,21,7,52,['Handvoll 25 g',25]],['Walnüsse',680,15,11,65,['Handvoll 25 g',25]],['Cashews',580,18,26,44,['Handvoll 25 g',25]],['Chiasamen',490,17,8,31,['1 EL 12 g',12]],
['Gouda',365,25,0,29,['Scheibe 25 g',25]],['Mozzarella light',165,19,1,9,['Kugel 125 g',125]],['Feta',260,17,0.5,21],['Parmesan',390,33,0,29,['Portion 10 g',10]],['Frischkäse light',140,10,4,9,['Portion 30 g',30]],
['Honig',320,0.4,80,0,['1 TL 10 g',10]],['Marmelade',250,0.3,60,0.1,['Portion 20 g',20]],['Zucker',400,0,100,0],['Dunkle Schokolade 70 %',570,8,33,43,['Riegel 20 g',20]],['Vollmilchschokolade',540,7,57,31,['Riegel 20 g',20]],['Gummibärchen',345,7,77,0.1,['Handvoll 25 g',25]],['Chips',540,6,50,35,['Portion 50 g',50]],['Eis Vanille',200,3.5,24,10,['Kugel 60 g',60]],
['Pizza Margherita',250,10,30,9,['ganze Pizza 330 g',330]],['Döner',215,11,20,10,['1 Döner 400 g',400]],['Burger',250,13,24,11,['1 Burger 220 g',220]],['Pommes',290,3.5,36,15,['Portion 150 g',150]],['Sushi',150,5,30,1.2,['8 Stück 200 g',200]],['Lasagne',150,8,12,8,['Portion 350 g',350]],['Currywurst',260,10,10,20,['Portion 200 g',200]],
['Cola',42,0,10.6,0,['Flasche 500 ml',500]],['Cola Zero',0.3,0,0,0,['Flasche 500 ml',500]],['Orangensaft',45,0.7,10,0.2,['Glas 250 ml',250]],['Bier',43,0.5,3,0,['Flasche 500 ml',500]],['Alkoholfreies Bier',25,0.4,5,0,['Flasche 500 ml',500]],['Wein rot',85,0.1,2.6,0,['Glas 200 ml',200]],['Cappuccino',40,2.2,3.3,2,['Tasse 200 ml',200]],['Latte Macchiato',50,3,4.5,2.3,['Glas 300 ml',300]],['Proteinshake fertig',62,10,3,1,['Flasche 330 ml',330]]
].map(([n,k,p,c,f,por],i)=>({id:'b'+i,name:n,kcal:k,p,c,f,por:por?{l:por[0],g:por[1]}:null,src:'base'}));


const DAYS={push:{n:'Push',sub:'Brust · Schultern · Trizeps',nx:'pull'},pull:{n:'Pull',sub:'Rücken · Bizeps · hintere Schulter',nx:'legs'},legs:{n:'Legs',sub:'Beine · Po · Waden',nx:'push'},cardio:{n:'Cardio',sub:'Ausdauer · Herz · Fettstoffwechsel',nx:null}};
const CT=['Laufband','Laufen draußen','Fahrrad / Ergometer','Crosstrainer','Rudergerät','Stepper / Treppe','Schwimmen','Seilspringen'];
/* Piktogramme: Seitenansicht, 100×80 */
const H=(x,y)=>`<circle class="hd" cx="${x}" cy="${y}" r="6"/>`,F=p=>`<polyline class="f" points="${p}"/>`,E=p=>`<polyline class="e" points="${p}"/>`,W=(x,y,r=7)=>`<circle class="w" cx="${x}" cy="${y}" r="${r}"/>`,R=(x,y,w,h,c='w')=>`<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}" rx="1"/>`,C=p=>`<polyline class="c" points="${p}"/>`,DB=(x,y)=>R(x-6,y-3,12,6);
const PIC={
 bench:R(16,50,50,5,'eqf')+E('22,55 22,72')+E('60,55 60,72')+H(20,42)+F('27,46 56,46 68,36 72,72')+F('31,46 31,33 32,22')+W(32,19,8),
 incline:E('28,38 52,60 70,60')+E('58,60 58,72')+H(29,31)+F('34,37 55,54 70,48 72,72')+F('37,39 40,26 43,14')+DB(43,12),
 ohp:R(38,50,22,4,'eqf')+E('49,54 49,72')+H(44,14)+F('46,21 47,50 64,50 64,72')+F('47,24 56,15 52,5')+DB(52,4),
 lateral:H(50,12)+F('50,19 50,46')+F('44,72 47,46 53,46 56,72')+F('26,27 38,24 50,22 62,24 74,27')+DB(24,27)+DB(76,27),
 dip:E('26,40 74,40')+E('32,40 32,72')+E('68,40 68,72')+H(46,16)+F('47,23 50,50')+F('47,26 38,36 50,40')+F('50,50 60,58 54,68'),
 pushdown:R(74,6,10,66,'eqf')+R(75,50,8,20)+C('79,10 62,10 60,46')+H(42,14)+F('43,21 45,48')+F('45,48 41,72')+F('45,48 51,72')+F('44,24 45,38 58,46')+R(56,44,6,6),
 fly:R(4,6,8,66,'eqf')+R(88,6,8,66,'eqf')+R(5,50,6,20)+R(89,50,6,20)+C('12,12 46,42')+C('88,12 54,42')+H(50,12)+F('50,19 50,46')+F('44,72 47,46 53,46 56,72')+F('46,42 38,30 50,22 62,30 54,42'),
 pullup:E('18,6 82,6')+H(50,20)+F('36,6 37,18 44,27')+F('64,6 63,18 56,27')+F('42,27 58,27')+F('50,27 50,52')+F('46,72 47,52 53,52 54,72'),
 row:H(28,26)+F('33,31 58,41')+F('58,41 54,57 60,72')+F('37,33 39,46 42,56')+R(26,56,32,3,'eqf')+W(28,57,8)+W(56,57,8),
 pulldown:E('50,0 50,14')+R(32,13,36,4,'eqf')+R(38,52,22,4,'eqf')+E('49,56 49,72')+H(48,28)+F('48,35 48,52 64,52 64,72')+F('48,37 40,27 42,16'),
 facepull:R(84,6,10,66,'eqf')+R(85,50,8,20)+C('89,22 56,20')+H(38,16)+F('40,23 42,50')+F('42,50 37,72')+F('42,50 48,72')+F('41,27 49,22 56,20'),
 curl:H(46,14)+F('46,21 47,48')+F('47,48 44,72')+F('47,48 51,72')+F('46,24 46,40 57,30')+DB(58,29),
 squat:H(44,20)+R(36,26,34,3,'eqf')+W(60,27,8)+F('46,27 40,48')+F('40,48 58,52 54,72')+F('47,30 56,34 56,28'),
 hinge:H(28,28)+F('33,32 58,41')+F('58,41 56,57 58,72')+F('37,34 40,48 42,60')+R(28,60,30,3,'eqf')+W(30,61,8)+W(56,61,8),
 legpress:E('40,72 92,20')+E('18,38 38,64 52,64')+H(20,32)+F('25,38 42,60')+F('42,60 52,40 70,32')+F('29,42 38,54')+`<rect class="w" x="68" y="15" width="8" height="28" transform="rotate(45 72 29)"/>`,
 legcurl:R(18,48,58,5,'eqf')+E('24,53 24,72')+E('70,53 70,72')+H(20,40)+F('26,44 58,44 74,44 68,28')+F('29,46 34,56')+R(64,22,10,6),
 legext:E('32,26 38,58 62,58')+E('48,58 48,72')+H(38,18)+F('39,25 41,54 60,54 78,46')+F('41,30 48,48')+R(76,42,6,10),
 lunge:H(50,12)+F('50,19 50,44')+F('50,44 64,56 66,72')+F('50,44 40,64 26,62')+F('51,22 54,34 55,46')+DB(55,48),
 calf:R(38,64,24,8,'eqf')+R(38,18,24,5)+H(50,10)+F('50,23 50,44')+F('50,44 50,60 55,64')+F('44,22 44,30')+F('56,22 56,30'),
 run:E('8,74 92,74')+H(56,12)+F('54,19 48,42')+F('48,42 62,54 58,72')+F('48,42 38,56 26,58')+F('53,24 64,32 72,26')+F('53,24 42,30 36,40'),
 bench_db:R(16,50,50,5,'eqf')+E('22,55 22,72')+E('60,55 60,72')+H(20,42)+F('27,46 56,46 68,36 72,72')+F('31,46 31,33 32,22')+DB(32,19),
 press_m:R(80,6,8,66,'eqf')+R(81,50,6,20)+E('82,16 66,26')+E('32,18 36,54 56,54')+E('46,54 46,72')+H(38,14)+F('39,21 41,50 58,50 60,72')+F('41,26 52,32 64,28')+R(63,22,5,12),
 rails:E('6,2 6,76')+E('94,2 94,76'),
 ohp_bb:R(38,50,22,4,'eqf')+E('49,54 49,72')+H(44,14)+F('46,21 47,50 64,50 64,72')+F('47,24 56,15 52,6')+R(30,3,44,3,'eqf')+W(52,4,6),
 ohp_m:R(80,6,8,66,'eqf')+R(81,50,6,20)+E('84,10 62,6')+E('34,16 38,52 58,52')+E('48,52 48,72')+H(40,12)+F('41,19 43,48 60,48 62,72')+F('43,22 52,16 56,6')+R(53,2,8,6),
 lat_cable:R(4,6,8,66,'eqf')+R(5,50,6,20)+C('12,68 26,27')+H(50,12)+F('50,19 50,46')+F('44,72 47,46 53,46 56,72')+F('26,27 38,24 50,22 56,30 56,44')+R(23,24,6,6),
 lat_m:R(40,22,20,30,'eqf')+E('50,52 50,72')+H(50,12)+F('50,19 50,46')+F('42,72 46,46 54,46 58,72')+F('26,26 38,24 50,22 62,24 74,26')+R(32,18,8,10)+R(60,18,8,10),
 dip_a:E('26,36 74,36')+E('32,36 32,72')+E('68,36 68,72')+H(46,12)+F('47,19 49,44')+F('47,22 38,32 50,36')+F('49,44 60,50 52,56')+R(42,56,24,4)+E('54,60 54,72'),
 push_bar:R(74,6,10,66,'eqf')+R(75,50,8,20)+C('79,10 62,10 60,46')+H(42,14)+F('43,21 45,48')+F('45,48 41,72')+F('45,48 51,72')+F('44,24 45,38 58,46')+R(52,44,14,3),
 tri_oh:H(46,18)+F('46,25 47,50')+F('47,50 44,72')+F('47,50 51,72')+F('47,28 52,10 42,14')+R(36,12,6,12),
 pull_a:E('18,6 82,6')+H(50,20)+F('36,6 37,18 44,27')+F('64,6 63,18 56,27')+F('42,27 58,27')+F('50,27 50,50')+F('46,50 46,62 52,66')+F('54,50 54,62 60,66')+R(36,66,30,4)+E('51,70 51,76'),
 row_c:R(88,6,8,66,'eqf')+R(89,50,6,20)+C('40,41 92,41')+R(16,58,40,4,'eqf')+E('68,46 68,64')+H(30,22)+F('30,29 32,56')+F('32,56 54,48 66,56')+F('32,32 24,40 38,41')+R(37,38,5,6),
 row_m:R(80,6,8,66,'eqf')+R(81,50,6,20)+E('82,30 52,36')+R(48,20,5,24,'eqf')+E('32,52 52,52')+E('42,52 42,72')+H(40,14)+F('40,21 40,50 58,50 60,72')+F('41,26 30,32 48,36')+R(48,32,6,8),
 row_db:R(18,44,44,5,'eqf')+E('24,49 24,72')+E('56,49 56,72')+H(24,24)+F('29,28 56,32')+F('32,30 30,44')+F('56,32 52,44 60,44')+F('56,32 66,52 70,72')+F('42,30 48,22 46,36')+DB(46,38),
 curl_bb:H(46,14)+F('46,21 47,48')+F('47,48 44,72')+F('47,48 51,72')+F('46,24 46,40 57,30')+W(58,29,6),
 curl_c:R(84,6,8,66,'eqf')+R(85,50,6,20)+C('86,68 58,32')+H(46,14)+F('46,21 47,48')+F('47,48 44,72')+F('47,48 51,72')+F('46,24 46,40 57,30')+R(55,26,6,6),
 squat_m:E('6,2 6,76')+E('94,2 94,76')+H(44,20)+R(28,26,48,3,'eqf')+F('46,27 40,48')+F('40,48 58,52 54,72')+F('47,30 56,34 56,28'),
 goblet:H(44,18)+F('46,25 40,48')+F('40,48 58,52 54,72')+F('46,28 54,34 52,26')+R(49,22,7,12),
 rdl_db:H(28,28)+F('33,32 58,41')+F('58,41 56,57 58,72')+F('37,34 40,48 42,60')+DB(42,62),
 trapbar:H(28,28)+F('33,32 58,41')+F('58,41 56,57 58,72')+F('37,34 40,48 42,60')+E('26,56 58,56 58,66 26,66 26,56')+W(22,61,8)+W(62,61,8),
 lp_h:E('64,62 96,62')+E('20,26 24,58 40,58')+E('32,58 32,72')+H(22,20)+F('24,27 28,54')+F('28,54 48,40 62,46')+F('26,32 34,50')+R(62,26,6,36),
 lc_sit:E('32,20 36,52 58,52')+E('46,52 46,72')+R(46,42,16,4,'eqf')+H(36,12)+F('37,19 39,48 58,48 54,66')+F('39,24 46,40')+R(48,64,12,6),
 lunge_bb:H(50,12)+R(36,18,28,3,'eqf')+W(62,19,6)+F('50,19 50,44')+F('50,44 64,56 66,72')+F('50,44 40,64 26,62')+F('51,24 58,24 60,18'),
 calf_sit:R(56,64,18,8,'eqf')+E('30,46 50,46')+E('40,46 40,72')+R(48,38,20,5)+H(38,14)+F('39,21 41,44 60,44 62,60 66,64'),
 calf_lp:E('40,72 92,20')+E('18,38 38,64 52,64')+H(20,32)+F('25,38 42,60')+F('42,60 56,46 72,30')+`<rect class="w" x="70" y="15" width="8" height="28" transform="rotate(45 74 29)"/>`,
 fly_m:R(40,16,20,36,'eqf')+E('50,52 50,72')+H(50,12)+F('50,19 50,46')+F('42,72 46,46 54,46 58,72')+F('46,40 34,28 50,22 66,28 54,40')+R(42,34,6,10)+R(52,34,6,10),
 fly_db:R(16,50,50,5,'eqf')+E('22,55 22,72')+E('60,55 60,72')+H(20,42)+F('27,46 56,46 68,36 72,72')+F('31,46 24,38 30,26')+DB(30,23),
 pd_wide:E('50,0 50,14')+R(20,13,60,4,'eqf')+R(38,52,22,4,'eqf')+E('49,56 49,72')+H(48,28)+F('48,35 48,52 64,52 64,72')+F('48,37 34,28 28,16'),
 face_band:E('92,4 92,74')+C('92,22 56,20')+H(38,16)+F('40,23 42,50')+F('42,50 37,72')+F('42,50 48,72')+F('41,27 49,22 56,20'),
 revfly_db:H(28,26)+F('33,31 58,41')+F('58,41 56,57 60,72')+F('38,33 30,38 20,36')+DB(18,36),
 gen:R(22,34,56,6,'eqf')+R(18,26,8,22)+R(74,26,8,22)+R(12,30,6,14)+R(82,30,6,14)
};
const VP={'bank|Kurzhantel':'bench_db','bank|Multipresse':'bench+rails','bank|Maschine':'press_m','schraeg|Langhantel':'incline_bb','schraeg|Multipresse':'incline_bb+rails','schraeg|Maschine':'press_m','fly|Butterfly-Maschine':'fly_m','fly|Kurzhantel':'fly_db','schulter|Langhantel':'ohp_bb','schulter|Maschine':'ohp_m','seit|Kabelzug':'lat_cable','seit|Maschine':'lat_m','dips|Assistiert':'dip_a','dips|Maschine':'press_m','trizeps|Kabelzug Stange':'push_bar','trizeps|Kurzhantel über Kopf':'tri_oh','klimm|Assistiert':'pull_a','rudern|Kurzhantel einarmig':'row_db','rudern|Kabelzug sitzend':'row_c','rudern|Maschine':'row_m','latzug|Breiter Griff':'pd_wide','face|Band':'face_band','revfly|Maschine':'lat_m','revfly|Kabelzug':'lat_cable','revfly|Kurzhantel':'revfly_db','curl|Langhantel':'curl_bb','curl|SZ-Stange':'curl_bb','curl|Kabelzug':'curl_c','hammer|Kabelzug Seil':'curl_c','squat|Multipresse':'squat_m','squat|Goblet Kurzhantel':'goblet','rdl|Kurzhantel':'rdl_db','kreuz|Trap Bar':'trapbar','presse|Horizontal':'lp_h','beuger|Sitzend':'lc_sit','ausfall|Langhantel':'lunge_bb','ausfall|Multipresse':'lunge_bb+rails','waden|Sitzend':'calf_sit','waden|An der Beinpresse':'calf_lp'};
PIC.incline_bb=PIC.incline.replace(/<rect class="w"[^>]*\/>$/,'')+R(34,10,18,3,'eqf')+W(43,11,6);
const picOf=e=>VP[e.id+'|'+e.v]||e.p;
const svg=k=>`<svg viewBox="0 0 100 80" aria-hidden="true">${String(k).split('+').map(x=>PIC[x]||'').join('')||PIC.gen}</svg>`;
const CAT={
 bank:{n:'Bankdrücken',d:'push',p:'bench',v:['Langhantel','Kurzhantel','Multipresse','Maschine'],t:'Schulterblätter zusammen, Füße fest, Stange kontrolliert zur unteren Brust.'},
 schraeg:{n:'Schrägbankdrücken',d:'push',p:'incline',v:['Kurzhantel','Langhantel','Multipresse','Maschine'],t:'Bank auf 30°, Ellbogen leicht unter Schulterhöhe.'},
 fly:{n:'Brust zusammenführen',d:'push',p:'fly',v:['Kabelzug','Butterfly-Maschine','Kurzhantel'],t:'Leicht gebeugte Arme, Hände vor dem Körper zusammenführen, kurz halten.'},
 schulter:{n:'Schulterdrücken',d:'push',p:'ohp',v:['Kurzhantel','Langhantel','Maschine'],t:'Bauch fest, nicht ins Hohlkreuz, Gewicht über dem Kopf ausdrücken.'},
 seit:{n:'Seitheben',d:'push',p:'lateral',v:['Kurzhantel','Kabelzug','Maschine'],t:'Bis Schulterhöhe, kleiner Finger leicht oben, ohne Schwung.'},
 dips:{n:'Dips',d:'push',p:'dip',v:['Barren','Assistiert','Maschine'],t:'Oberkörper leicht vor, bis Oberarm parallel zum Boden.'},
 trizeps:{n:'Trizepsdrücken',d:'push',p:'pushdown',v:['Kabelzug Seil','Kabelzug Stange','Kurzhantel über Kopf'],t:'Ellbogen am Körper, unten Seil auseinanderziehen.'},
 klimm:{n:'Klimmzüge',d:'pull',p:'pullup',v:['Körpergewicht + Zusatz','Assistiert'],t:'Brust zur Stange, unten ganz strecken.'},
 rudern:{n:'Rudern',d:'pull',p:'row',v:['Langhantel','Kurzhantel einarmig','Kabelzug sitzend','Maschine'],t:'Rücken gerade, Ellbogen nah am Körper nach hinten ziehen.'},
 latzug:{n:'Latzug',d:'pull',p:'pulldown',v:['Enger Griff','Breiter Griff'],t:'Brust raus, Stange zur oberen Brust, Schultern unten lassen.'},
 face:{n:'Face Pulls',d:'pull',p:'facepull',v:['Kabelzug Seil','Band'],t:'Seil Richtung Stirn, Hände außen neben dem Kopf.'},
 revfly:{n:'Reverse Flys',d:'pull',p:'lateral',v:['Maschine','Kabelzug','Kurzhantel'],t:'Hintere Schulter: Arme seitlich nach hinten, ohne Schwung.'},
 curl:{n:'Bizeps-Curls',d:'pull',p:'curl',v:['Langhantel','SZ-Stange','Kurzhantel','Kabelzug'],t:'Ellbogen fixiert, oben kurz anspannen, langsam ablassen.'},
 hammer:{n:'Hammer Curls',d:'pull',p:'curl',v:['Kurzhantel','Kabelzug Seil'],t:'Neutraler Griff, Daumen zeigen nach oben.'},
 squat:{n:'Kniebeugen',d:'legs',p:'squat',v:['Langhantel','Multipresse','Goblet Kurzhantel'],t:'Knie über die Zehen, mindestens bis Oberschenkel parallel.'},
 rdl:{n:'Rumänisches Kreuzheben',d:'legs',p:'hinge',v:['Langhantel','Kurzhantel'],t:'Hüfte nach hinten, Stange am Bein entlang, Rücken gerade.'},
 kreuz:{n:'Kreuzheben',d:'legs',p:'hinge',v:['Langhantel','Trap Bar'],t:'Stange über Mittelfuß, aus den Beinen drücken.'},
 presse:{n:'Beinpresse',d:'legs',p:'legpress',v:['45° Maschine','Horizontal'],t:'Füße schulterbreit, Knie nicht ganz durchstrecken.'},
 beuger:{n:'Beinbeuger',d:'legs',p:'legcurl',v:['Liegend','Sitzend'],t:'Hüfte am Polster, kontrolliert zurück.'},
 strecker:{n:'Beinstrecker',d:'legs',p:'legext',v:['Maschine'],t:'Oben eine Sekunde halten, langsam ablassen.'},
 ausfall:{n:'Ausfallschritte',d:'legs',p:'lunge',v:['Kurzhantel','Langhantel','Multipresse'],t:'Großer Schritt, hinteres Knie knapp über dem Boden.'},
 waden:{n:'Wadenheben',d:'legs',p:'calf',v:['Stehend Maschine','Sitzend','An der Beinpresse'],t:'Ganz runter dehnen, oben kurz halten.'}
};
const MU={chest:'Brust',shoulders:'Schultern',reardelt:'Hintere Schulter',triceps:'Trizeps',biceps:'Bizeps',back:'Rücken',quads:'Beinstrecker (vorne)',ham:'Beinbeuger (hinten)',glutes:'Po',calves:'Waden'};
const MAP={bank:{chest:1,triceps:.5,shoulders:.5},schraeg:{chest:1,shoulders:.5,triceps:.5},fly:{chest:1},schulter:{shoulders:1,triceps:.5},seit:{shoulders:1},dips:{triceps:1,chest:.5},trizeps:{triceps:1},klimm:{back:1,biceps:.5},rudern:{back:1,biceps:.5,reardelt:.5},latzug:{back:1,biceps:.5},face:{reardelt:1},revfly:{reardelt:1},curl:{biceps:1},hammer:{biceps:1},squat:{quads:1,glutes:.5},rdl:{ham:1,glutes:.5},kreuz:{glutes:1,ham:.5,back:.5},presse:{quads:1,glutes:.5},beuger:{ham:1},strecker:{quads:1},ausfall:{quads:1,glutes:.5},waden:{calves:1}};
const BIG=new Set(['bank','schraeg','schulter','rudern','squat','rdl','kreuz','presse','klimm']);
const isA=k=>/assist/i.test(String(k));
const r25=x=>Math.max(0,Math.round(x/2.5)*2.5);
function plates(kg){let side=(kg-20)/2;if(side<=0)return null;const out=[];for(const p of [25,20,15,10,5,2.5,1.25]){while(side>=p-1e-9){out.push(p);side-=p}}return side>0.01?null:out.map(fmt).join(' + ')}
const mk=(id,sets,min,max,step)=>({id,sets,min,max,step,v:CAT[id].v[0]});
const DEF={push:[mk('bank',4,6,10,2.5),mk('schraeg',3,8,12,2),mk('schulter',3,8,12,2),mk('seit',3,12,15,1),mk('dips',3,8,12,2.5),mk('trizeps',3,10,15,2.5)],
 pull:[mk('klimm',4,6,10,2.5),mk('rudern',3,8,12,2.5),mk('latzug',3,10,12,2.5),mk('face',3,12,15,2.5),mk('curl',3,8,12,2.5),mk('hammer',3,10,12,1)],
 legs:[mk('squat',4,6,10,2.5),mk('rdl',3,8,10,2.5),mk('presse',3,10,12,5),mk('beuger',3,10,15,2.5),mk('ausfall',3,10,12,2),mk('waden',4,12,15,5)]};
const clone=o=>JSON.parse(JSON.stringify(o));
const LS='sportcockpit.v1';
let S={plan:clone(DEF),goal:4,rest:90,cgoal:150,sessions:[],del:[],metaT:0,prof:{name:'',sex:'m',year:'',height:'',weight:'',act:1.55},nut:{goal:'aufbau',maint:0,gkg:2,days:{},foods:[],meals:[],recent:[]}},drafts={},draftT=0,summary=null,view='train',day='push',recEx=null,confirmKey=null,picker=false;
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>(+n||0).toLocaleString('de-DE',{maximumFractionDigits:1});
const num=v=>{const n=parseFloat(String(v).replace(',','.'));return isFinite(n)?n:null};
const e1=(kg,r)=>kg*(1+r/30);
const dstr=t=>new Date(t).toLocaleDateString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit'});
const info=e=>{const c=CAT[e.id];return c?{...e,n:c.n,p:c.p,vars:c.v,t:c.t}:{...e,n:e.name||'Übung',p:'gen',vars:[],t:''}};
const vkey=e=>(!e.vars.length||!e.v||e.v===e.vars[0])?e.id:e.id+'@'+e.v.toLowerCase().replace(/[^a-z0-9]+/g,'');
const vname=e=>e.vars.length>1?`${e.n} · ${e.v}`:e.n;
function migrate(){S.cgoal=S.cgoal||150;for(const d in DAYS){S.plan[d]=(S.plan[d]||DEF[d]||[]).map(e=>{const c=CAT[e.id];if(c&&!c.v.includes(e.v))e.v=c.v[0];return e})}
 for(const d in drafts){const dr=drafts[d];if(!dr)continue;dr.extra=(dr.extra||[]).map(e=>{if(e.id==='t-kabelzug-brust'){if(dr.ex&&dr.ex[e.id]){dr.ex.fly=dr.ex[e.id];delete dr.ex[e.id]}return mk('fly',3,12,15,2.5)}return e})}}
function lsLoad(){try{const j=JSON.parse(localStorage.getItem(LS));if(j){S=Object.assign(S,j);S.prof=Object.assign({name:'',sex:'m',year:'',height:'',weight:'',act:1.55},j.prof||{});S.nut=Object.assign({goal:'aufbau',maint:0,gkg:2,days:{},foods:[],meals:[],recent:[]},j.nut||{});S.del=S.del||[]}const dj=JSON.parse(localStorage.getItem(LS+'.d'));if(dj&&dj.d){drafts=dj.d;draftT=dj.t||0}}catch(e){}migrate()}
function lsSave(){try{localStorage.setItem(LS,JSON.stringify(S));localStorage.setItem(LS+'.d',JSON.stringify({d:drafts,t:draftT}))}catch(e){note('Speicher voll!')}}
function persist(){lsSave();syncLater()}
function saveDrafts(){draftT=Date.now();persist()}
function savePlan(){S.metaT=Date.now();persist()}
function putSession(s){s.t=Date.now();persist()}
function dropSession(id){S.sessions=S.sessions.filter(s=>s.id!==id);if(!S.del.includes(id))S.del.push(id);persist()}
function note(t){$('sync').textContent=t}
const dayEx=d=>[...S.plan[d],...((drafts[d]&&drafts[d].extra)||[])].map(info);
function hist(k){return S.sessions.filter(s=>s.ex.some(x=>x.id===k)).sort((a,b)=>a.date-b.date).map(s=>({date:s.date,sets:s.ex.find(x=>x.id===k).sets}))}
function sugg(e){const h=hist(vkey(e));if(!h.length)return null;const L=h[h.length-1].sets.filter(s=>s.reps>0);if(!L.length)return null;
 if(isA(e.v)){const lo=Math.min(...L.map(s=>s.kg)),ws=L.filter(s=>s.kg===lo);
  if(ws.length>=e.sets&&ws.every(s=>s.reps>=e.max)){const n=Math.max(0,lo-e.step);return{up:true,kg:n,reps:Array(e.sets).fill(e.min),txt:n?`Weniger Hilfe: ${fmt(n)} kg × ${e.min}`:`Ohne Hilfe × ${e.min}`,why:`Letztes Mal alle Sätze mit ${e.max} Wdh. geschafft`}}
  const reps=Array.from({length:e.sets},(_,i)=>{const r=(ws[i]||ws[ws.length-1]);return Math.min(e.max,r.reps+(r.rpe==='h'?0:1))});
  return{up:false,kg:lo,reps,txt:`${fmt(lo)} kg Hilfe × ${reps.join(' / ')}`,why:'Gleiche Hilfe, je Satz eine Wiederholung mehr'}}
 const top=Math.max(...L.map(s=>s.kg)),ws=L.filter(s=>s.kg===top);
const hard=ws.some(s=>s.rpe==='h'),easy=ws.length>=e.sets&&ws.every(s=>s.rpe==='l'&&s.reps>=e.min);
 if(easy&&!ws.every(s=>s.reps>=e.max))return{up:true,kg:top+e.step,reps:ws.map(s=>s.reps).slice(0,e.sets),txt:`Mehr Gewicht: ${fmt(top+e.step)} kg × ${ws[0].reps}`,why:'Letztes Mal fühlten sich alle Sätze leicht an'};
 if(ws.length>=e.sets&&ws.every(s=>s.reps>=e.max))return{up:true,kg:top+e.step,reps:Array(e.sets).fill(e.min),txt:`Mehr Gewicht: ${fmt(top+e.step)} kg × ${e.min}`,why:`Letztes Mal alle Sätze mit ${e.max} Wdh. geschafft`};
 const reps=Array.from({length:e.sets},(_,i)=>{const r=(ws[i]||ws[ws.length-1]);return Math.min(e.max,r.reps+(r.rpe==='h'?0:1))});
 return{up:false,kg:top,reps,txt:`${fmt(top)} kg × ${reps.join(' / ')}`,why:hard?'Letztes Mal war es hart – schwere Sätze halten, den Rest steigern':'Je Satz eine Wiederholung mehr als letztes Mal'}}
function best(k){let b=0;for(const s of S.sessions){const x=s.ex.find(x=>x.id===k);if(x)for(const t of x.sets)b=Math.max(b,e1(t.kg,t.reps))}return b}
const vol=s=>s.ex.reduce((a,x)=>isA(x.id)?a:a+x.sets.reduce((b,t)=>b+t.kg*t.reps,0),0);
function wk(t){const x=new Date(t);x.setHours(0,0,0,0);x.setDate(x.getDate()-(x.getDay()+6)%7);return x.getTime()}
function prevWk(k){const d=new Date(k);d.setDate(d.getDate()-7);return wk(d)}
function draftFor(d){if(!drafts[d])drafts[d]={start:Date.now(),ex:{},extra:[]};const dr=drafts[d];dr.extra=dr.extra||[];dr.ex=dr.ex||{};dr.cardio=dr.cardio||(d==='cardio'?[{type:CT[0],min:'',km:'',lvl:'m'}]:[]);for(const e of dayEx(d)){if(!dr.ex[e.id])dr.ex[e.id]=Array.from({length:e.sets},()=>({kg:'',reps:'',done:false}))}return dr}
function lastDay(){const s=[...S.sessions].filter(s=>s.day!=='cardio'&&DAYS[s.day]).sort((a,b)=>b.date-a.date)[0];return s?s.day:null}

function renderHead(){document.body.className='v-'+view;const br=document.querySelector('.brand');if(br)br.textContent='SPORT COCKPIT'+(S.prof&&S.prof.name?' · '+S.prof.name.toUpperCase():' · 3ER-SPLIT');
 $('dayName').textContent=DAYS[day].n;$('daySub').textContent=DAYS[day].sub;
 const ld=lastDay();$('nextDay').textContent=ld?`Als Nächstes dran: ${DAYS[DAYS[ld].nx].n}`:'Los geht’s mit Push';
 document.querySelectorAll('[data-a=day]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.d===day));
 const mon=wk(Date.now()),todayK=new Date().toDateString();let w='';
 for(let i=0;i<7;i++){const d=new Date(mon);d.setDate(d.getDate()+i);const ss=S.sessions.filter(s=>new Date(s.date).toDateString()===d.toDateString());
  w+=`<div class="wd${ss.length?' on':''}${d.toDateString()===todayK?' today':''}"><b>${ss.length?[...new Set(ss.flatMap(s=>[({push:'PU',pull:'PL',legs:'LE'})[s.day],(s.cardio&&s.cardio.length)?'C':''].filter(Boolean)))].join(''):'·'}</b><small>${['Mo','Di','Mi','Do','Fr','Sa','So'][i]}</small></div>`}
 $('week').innerHTML=w;
 const cnt={};S.sessions.forEach(s=>{if(!s.ex.length)return;const k=wk(s.date);cnt[k]=(cnt[k]||0)+1});
 let k=mon,st=0;if((cnt[k]||0)<S.goal)k=prevWk(k);while((cnt[k]||0)>=S.goal){st++;k=prevWk(k)}
 const wv=S.sessions.filter(s=>wk(s.date)===mon).reduce((a,s)=>a+vol(s),0),cmin=Math.round(S.sessions.filter(s=>wk(s.date)===mon).reduce((a,s)=>a+(s.cardio||[]).reduce((b,c)=>b+(+c.min||0),0),0));
 $('stats').innerHTML=`<div><b>${cnt[mon]||0} / ${S.goal}</b><small>Krafteinheiten diese Woche</small></div><div><b>${st}</b><small>Wochen in Folge im Ziel</small></div><div><b>${fmt(wv/1000)} t</b><small>bewegt diese Woche</small></div><div><b>${cmin} / ${S.cgoal} min</b><small>Cardio diese Woche</small></div>`;
 document.querySelectorAll('[data-a=view]').forEach(b=>b.setAttribute('aria-selected',b.dataset.v===view));
}
function card(e,dr){const sg=sugg(e),h0=hist(vkey(e)),rows=dr.ex[e.id],tmp=!S.plan[day].some(x=>x.id===e.id);
 const last=h0.length?h0[h0.length-1].sets.map(t=>`${fmt(t.kg)}×${t.reps}`).join('  '):null;
 return `<article class="ex"><div class="exhead"><div class="pic">${svg(picOf(e))}</div><div><h3>${esc(e.n)}</h3><p class="tgt">${tmp?'<span class="tagtmp">Nur heute · </span>':''}${e.sets} Sätze · ${e.min}–${e.max} Wdh.</p>
 ${e.vars.length>1?`<div class="vars">${e.vars.map(v=>`<button data-a="var" data-e="${e.id}" data-v="${esc(v)}" aria-pressed="${v===e.v}">${esc(v)}</button>`).join('')}</div>`:''}</div></div>
 ${e.t?`<p class="tip">${esc(e.t)}</p>`:''}
 <div class="goal${sg&&sg.up?' up':''}">${sg?`<b>Heute: ${sg.txt}</b><span>${sg.why}${last?' · zuletzt '+last:''}</span>`:`<b>Erstes Mal${e.vars.length>1?' mit '+esc(e.v):''}</b><span>${isA(e.v)?`Trag die Unterstützung in kg ein (Gegengewicht an der Maschine). Ziel: ${e.max} saubere Wdh., dann Hilfe reduzieren.`:`Wähle ein Gewicht, mit dem du ${e.max} saubere Wdh. schaffst.`}</span>`}</div>
 ${(()=>{if(isA(e.v))return '';const w=num(rows[0]&&rows[0].kg)??(sg?sg.kg:null);if(!w)return '';const bb=/Langhantel/.test(e.v||'')||(['squat','bank','rdl','kreuz'].includes(e.id)&&(e.v||'').startsWith('Lang'));let o='';
  if(BIG.has(e.id)&&w>=30){const base=bb?20:0,ws=[[.4,10],[.6,5],[.8,3]].map(([f,r])=>[Math.max(base,r25(w*f)),r]).filter((x,i,a)=>x[0]<w&&(!i||x[0]>a[i-1][0]));if(ws.length)o+=`<span><b>Aufwärmen:</b> ${ws.map(([k,r])=>`${fmt(k)}×${r}`).join(' · ')}</span>`}
  if(bb){const pl=plates(w);if(pl)o+=`<span><b>Scheiben pro Seite (${fmt(w)} kg):</b> ${pl}</span>`}return o?`<div class="help">${o}</div>`:''})()}
 <div class="sets"><div class="shead"><span>Satz</span><span>${isA(e.v)?'kg Hilfe':'kg'}</span><span>Wdh.</span><span></span></div>
 ${rows.map((r,i)=>`<div class="row${r.done?' done':''}"><span class="no">${i+1}</span><input inputmode="decimal" aria-label="Gewicht Satz ${i+1}" data-a="in" data-e="${e.id}" data-i="${i}" data-f="kg" value="${esc(r.kg)}" placeholder="${sg?fmt(sg.kg):'–'}"><input inputmode="numeric" aria-label="Wiederholungen Satz ${i+1}" data-a="in" data-e="${e.id}" data-i="${i}" data-f="reps" value="${esc(r.reps)}" placeholder="${sg?(sg.reps[i]??sg.reps[sg.reps.length-1]):'–'}"><button class="chk" aria-label="Satz ${i+1} erledigt" aria-pressed="${r.done}" data-a="done" data-e="${e.id}" data-i="${i}">✓</button></div>${r.done?`<div class="row"><span></span><div class="rpe">${[['l','leicht'],['m','passt'],['h','hart']].map(([k,l])=>`<button data-a="rpe" data-e="${e.id}" data-i="${i}" data-r="${k}" aria-pressed="${r.rpe===k}">${l}</button>`).join('')}</div></div>`:''}`).join('')}</div>
 <div class="exfoot"><button data-a="addset" data-e="${e.id}">+ Satz</button><button data-a="rmset" data-e="${e.id}">− Satz</button>${tmp?`<button data-a="keep" data-e="${e.id}">Fest in den Plan</button><button data-a="rmtmp" data-e="${e.id}">Entfernen</button>`:''}</div></article>`}
function cardioBlock(dr){const last=[...S.sessions].filter(s=>s.cardio&&s.cardio.length).sort((a,b)=>b.date-a.date)[0];
 return `<article class="ex"><div class="exhead"><div class="pic">${svg('run')}</div><div><h3>Cardio</h3><p class="tgt">${day==='cardio'?'Ausdauer-Einheit':'Optional nach dem Krafttraining'}${last?` · zuletzt ${esc(last.cardio[0].type)} ${fmt(last.cardio[0].min)} min`:''}</p></div></div>
 ${dr.cardio.map((c,i)=>`<div class="sets" style="margin-bottom:10px"><select data-a="cin" data-i="${i}" data-f="type" aria-label="Cardio-Art">${CT.map(t=>`<option${t===c.type?' selected':''}>${t}</option>`).join('')}</select>
 <div class="row" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,1fr);margin-top:6px"><input inputmode="numeric" placeholder="Minuten" aria-label="Minuten" data-a="cin" data-i="${i}" data-f="min" value="${esc(c.min)}"><input inputmode="decimal" placeholder="km (optional)" aria-label="Kilometer" data-a="cin" data-i="${i}" data-f="km" value="${esc(c.km)}"><input inputmode="numeric" placeholder="Puls Ø (opt.)" aria-label="Durchschnittspuls" data-a="cin" data-i="${i}" data-f="hr" value="${esc(c.hr)}"></div>
 <div class="vars" style="margin-top:6px">${[['l','Locker'],['m','Mittel'],['h','Intervalle / hart']].map(([k,l])=>`<button data-a="clvl" data-i="${i}" data-r="${k}" aria-pressed="${c.lvl===k}">${l}</button>`).join('')}<button class="ghost" data-a="crm" data-i="${i}">Entfernen</button></div></div>`).join('')}
 <div class="exfoot"><button data-a="cadd">+ Cardio ${dr.cardio.length?'hinzufügen':'eintragen'}</button></div></article>`}
function renderPicker(){const have=new Set(dayEx(day).map(e=>e.id)),ids=Object.keys(CAT).filter(id=>!have.has(id)).sort((a,b)=>(CAT[a].d===day?0:1)-(CAT[b].d===day?0:1));
 return `<section class="picker"><h2>Übung für heute hinzufügen</h2><div class="plist">${ids.map(id=>`<button class="pitem" data-a="pick" data-id="${id}"><div class="pic">${svg(CAT[id].p)}</div><span>${esc(CAT[id].n)}</span></button>`).join('')}</div>
 <div class="custom"><input id="tmpName" placeholder="Eigene Übung, z. B. Hip Thrust" aria-label="Eigene Übung"><button data-a="addtmp">Hinzufügen</button></div><div class="actions"><button class="ghost" data-a="picker">Schließen</button></div></section>`}
function renderTrain(){const dr=draftFor(day);let h='';
 if(summary&&summary.day===day)h+=`<section class="sum"><h2>${DAYS[day].n} erledigt</h2><p>${summary.sets?`${summary.sets} Sätze · ${fmt(summary.vol)} kg bewegt`:''}${summary.cmin?`${summary.sets?' · ':''}${fmt(summary.cmin)} min Cardio`:''}${summary.prevVol?` · <span class="hot">${summary.vol>=summary.prevVol?'+':''}${fmt((summary.vol/summary.prevVol-1)*100)} %</span> zum letzten ${DAYS[day].n}-Tag`:''}</p>${!summary.sets?'':summary.prs.length?`<p class="hot">Neue Bestwerte</p><ul>${summary.prs.map(p=>`<li>${esc(p)}</li>`).join('')}</ul>`:'<p>Keine neuen Bestwerte – nächstes Mal.</p>'}<div class="actions"><button data-a="closesum">Schließen</button></div></section>`;
 h+=dayEx(day).map(e=>card(e,dr)).join('');
 if(day!=='cardio')h+=picker?renderPicker():`<div class="actions"><button data-a="picker">+ Übung hinzufügen</button></div>`;
 h+=cardioBlock(dr);
 h+=`<div class="actions"><button class="primary" data-a="finish">Training abschließen</button><button class="ghost" data-a="discard">${confirmKey==='discard'?'Wirklich verwerfen?':'Verwerfen'}</button></div>`;
 return h}
function renderHist(){const ss=[...S.sessions].sort((a,b)=>b.date-a.date);
 if(!ss.length)return '<p class="empty">Noch keine Einheiten. Dein erstes Training erscheint hier.</p>';
 return `<div class="list">`+ss.map(s=>`<details><summary><span class="pill">${DAYS[s.day].n}</span><b>${dstr(s.date)}</b><span class="meta">${[s.ex.length?`${s.ex.reduce((a,x)=>a+x.sets.length,0)} Sätze · ${fmt(vol(s))} kg`:'',(s.cardio||[]).length?`${fmt(s.cardio.reduce((a,c)=>a+c.min,0))} min Cardio`:''].filter(Boolean).join(' · ')}</span></summary><div class="body">${s.ex.map(x=>`<p><b>${esc(x.name)}</b>: ${x.sets.map(t=>`${fmt(t.kg)}×${t.reps}`).join('  ')}</p>`).join('')}${(s.cardio||[]).map(c=>`<p><b>${esc(c.type)}</b>: ${fmt(c.min)} min${c.km?' · '+fmt(c.km)+' km':''}${c.hr?' · Ø '+c.hr+' bpm':''} · ${({l:'locker',m:'mittel',h:'hart'})[c.lvl]||''}</p>`).join('')}<div class="actions"><button class="ghost" data-a="del" data-id="${s.id}">${confirmKey===s.id?'Wirklich löschen?':'Einheit löschen'}</button></div></div></details>`).join('')+`</div><div class="actions"><button class="ghost" data-a="copy">Alle Daten kopieren</button></div>`}
function trained(){const m=new Map();for(const s of [...S.sessions].sort((a,b)=>a.date-b.date))for(const x of s.ex)m.set(x.id,{id:x.id,name:x.name,d:s.day});return [...m.values()]}
function weekSets(){const mon=wk(Date.now()),c={};const add=(id,n)=>{const m=MAP[id];if(m)for(const k in m)c[k]=(c[k]||0)+m[k]*n};
 for(const s of S.sessions)if(wk(s.date)===mon)for(const x of s.ex)add(x.base||String(x.id).split('@')[0],x.sets.length);
 for(const d in drafts){const dr=drafts[d];if(dr&&dr.ex)for(const id in dr.ex)add(id,dr.ex[id].filter(r=>r.done).length)}return c}
function muscleMap(){const c=weekSets(),f=k=>{const n=c[k]||0;return n?`fill="#ff5a36" fill-opacity="${(0.25+Math.min(n/12,1)*0.75).toFixed(2)}"`:'fill="#2a2e35"'},N='fill="#1c1f24"',r=(x,y,w,h,a)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" ${a}/>`;
 const base=`<circle cx="60" cy="16" r="12" ${N}/>`+r(53,27,14,8,N)+r(19,90,10,30,N)+r(91,90,10,30,N);
 const front=base+`<ellipse cx="34" cy="48" rx="12" ry="10" ${f('shoulders')}/><ellipse cx="86" cy="48" rx="12" ry="10" ${f('shoulders')}/>`+r(41,40,18,24,f('chest'))+r(61,40,18,24,f('chest'))+r(21,60,11,28,f('biceps'))+r(88,60,11,28,f('biceps'))+r(44,67,32,40,N)+r(39,110,19,54,f('quads'))+r(62,110,19,54,f('quads'))+r(41,168,15,40,N)+r(64,168,15,40,N);
 const back=base+`<ellipse cx="34" cy="48" rx="12" ry="10" ${f('reardelt')}/><ellipse cx="86" cy="48" rx="12" ry="10" ${f('reardelt')}/>`+r(41,38,38,52,f('back'))+r(21,60,11,28,f('triceps'))+r(88,60,11,28,f('triceps'))+r(44,92,32,16,N)+r(40,108,40,24,f('glutes'))+r(40,134,18,32,f('ham'))+r(62,134,18,32,f('ham'))+r(41,168,15,40,f('calves'))+r(64,168,15,40,f('calves'));
 const list=Object.keys(MU).map(k=>[k,c[k]||0]).sort((a,b)=>b[1]-a[1]).map(([k,n])=>`<div><span>${MU[k]}</span><span style="text-align:right">${fmt(n)}</span><i><s style="width:${Math.min(n/12,1)*100}%"></s></i></div>`).join('');
 return `<section class="mm"><h2>Sätze pro Muskel – diese Woche</h2><div><svg viewBox="0 0 120 212" role="img" aria-label="Vorderseite">${front}</svg><div class="cap">Vorne</div></div><div><svg viewBox="0 0 120 212" role="img" aria-label="Rückseite">${back}</svg><div class="cap">Hinten</div></div><div class="mlist">${list}<span class="cap" style="text-align:left">Ziel: 10–20 Sätze pro Muskel und Woche. Nebenmuskeln zählen halb.</span></div></section>`}
function renderRec(){const ex=trained();
 if(!ex.length)return muscleMap()+'<p class="empty">Deine Kraftkurven erscheinen nach dem ersten Training.</p>';
 if(!recEx||!ex.some(e=>e.id===recEx))recEx=ex[0].id;
 const rows=ex.map(e=>{if(isA(e.id)){let lo=Infinity,lr=0;for(const h of hist(e.id))for(const t of h.sets){if(t.kg<lo||(t.kg===lo&&t.reps>lr)){lo=t.kg;lr=t.reps}}return `<span>${esc(e.name)}</span><span class="r">${fmt(lo)} kg Hilfe × ${lr}</span><span class="r">–</span>`}let bk=0,br=0,be=0;for(const h of hist(e.id))for(const t of h.sets){if(t.kg>bk||(t.kg===bk&&t.reps>br)){bk=t.kg;br=t.reps}be=Math.max(be,e1(t.kg,t.reps))}return `<span>${esc(e.name)}</span><span class="r">${fmt(bk)} kg × ${br}</span><span class="r">${fmt(be)} kg</span>`}).join('');
 return muscleMap()+`<label for="recSel">Kraftverlauf einer Übung</label><select id="recSel" data-a="rec">${ex.map(e=>`<option value="${esc(e.id)}"${e.id===recEx?' selected':''}>${esc(e.name)}</option>`).join('')}</select><div class="fig"><svg id="chart" role="img" aria-label="Kraftverlauf"></svg></div>
 <div class="rec"><span class="h">Übung</span><span class="h r">Schwerster Satz</span><span class="h r">Kraftwert*</span>${rows}</div><p class="tip" style="padding:8px 0">* Geschätztes Maximalgewicht für eine Wiederholung – macht Sätze mit unterschiedlichen Wdh. vergleichbar.</p>`}
function drawChart(){const s=$('chart');if(!s)return;const W=s.clientWidth,Hh=s.clientHeight;if(!W)return;
 const A=isA(recEx),pts=hist(recEx).map(h=>({t:h.date,v:A?Math.min(...h.sets.map(t=>t.kg)):Math.max(...h.sets.map(t=>e1(t.kg,t.reps)))})),p={l:44,r:16,t:22,b:30};
 if(pts.length<2){s.innerHTML=`<text x="${W/2}" y="${Hh/2}" text-anchor="middle" fill="#8f949d" font-size="14">Ab zwei Einheiten siehst du hier deine Kurve</text>`;return}
 const lo=Math.min(...pts.map(q=>q.v))*0.95,hi=Math.max(...pts.map(q=>q.v))*1.04,x=i=>p.l+i*(W-p.l-p.r)/(pts.length-1),y=v=>p.t+(hi-v)/(hi-lo||1)*(Hh-p.t-p.b),L=pts.length-1;
 const grid=[lo,(lo+hi)/2,hi].map(v=>`<line x1="${p.l}" x2="${W-p.r}" y1="${y(v)}" y2="${y(v)}" stroke="#2a2e35"/><text x="${p.l-8}" y="${y(v)+4}" text-anchor="end" font-size="12" fill="#8f949d">${Math.round(v)}</text>`).join('');
 const line=pts.map((q,i)=>`${i?'L':'M'}${x(i)},${y(q.v)}`).join('');
 s.innerHTML=`${grid}<path d="${line} L${x(L)},${Hh-p.b} L${x(0)},${Hh-p.b}Z" fill="#ff5a36" opacity=".12"/><path d="${line}" fill="none" stroke="#ff5a36" stroke-width="3" stroke-linejoin="round"/>${pts.map((q,i)=>`<circle cx="${x(i)}" cy="${y(q.v)}" r="${i===L?6:3}" fill="${i===L?'#ff5a36':'#eeece8'}"/>`).join('')}<text x="${p.l}" y="${Hh-8}" font-size="12" fill="#8f949d">${dstr(pts[0].t)}</text><text x="${W-p.r}" y="${Hh-8}" text-anchor="end" font-size="12" fill="#eeece8">${W>420?dstr(pts[L].t)+' · ':''}${fmt(pts[L].v)} kg${A?' Hilfe (weniger = besser)':''}</text>`}
function renderPlan(){
 if(day==='cardio')return `<p class="tip" style="padding:0 0 12px">Cardio hat keinen festen Plan – trag einfach ein, was du machst.</p><div class="settings"><div><label for="cgoal">Cardio-Ziel pro Woche (Minuten)</label><input id="cgoal" inputmode="numeric" data-a="set" data-f="cgoal" value="${S.cgoal}"></div></div>`;
 return `<p class="tip" style="padding:0 0 12px">Dein fester Plan für <b>${DAYS[day].n}</b>. Tag oben wechseln. Tippe eine Übung an, um sie anzupassen.</p>
 ${S.plan[day].map(info).map((e,i)=>`<details class="pl"><summary><div class="pic">${svg(picOf(e))}</div><div><b>${esc(e.n)}</b><small>${e.sets} Sätze · ${e.min}–${e.max} Wdh. · +${fmt(e.step)} kg${e.vars.length>1?' · '+esc(e.v):''}</small></div><span>›</span></summary>
 <div class="pledit">${CAT[e.id]?'':`<div class="full"><label>Name</label><input data-a="pl" data-i="${i}" data-f="name" value="${esc(e.n)}"></div>`}
 ${[['sets','Sätze'],['min','Wdh. von'],['max','Wdh. bis'],['step','+kg Sprung']].map(([f,l])=>`<div><label>${l}</label><input inputmode="decimal" data-a="pl" data-i="${i}" data-f="${f}" value="${fmt(e[f])}"></div>`).join('')}
 <div class="plbtn"><button data-a="mv" data-i="${i}" data-s="-1">Nach oben</button><button data-a="mv" data-i="${i}" data-s="1">Nach unten</button><button class="ghost" data-a="rmex" data-i="${i}">${confirmKey==='ex'+i?'Wirklich entfernen?':'Entfernen'}</button></div></div></details>`).join('')}
 <div class="actions"><button data-a="view" data-v="train" data-pick="1">+ Übung hinzufügen</button><button class="ghost" data-a="reset">${confirmKey==='reset'?'Wirklich zurücksetzen?':'Standardplan'}</button></div>
 <div class="settings"><div><label for="goal">Wochenziel (Einheiten)</label><input id="goal" inputmode="numeric" data-a="set" data-f="goal" value="${S.goal}"></div><div><label for="cgoal">Cardio-Ziel (Min./Woche)</label><input id="cgoal" inputmode="numeric" data-a="set" data-f="cgoal" value="${S.cgoal}"></div><div><label for="rest">Satzpause (Sekunden)</label><input id="rest" inputmode="numeric" data-a="set" data-f="rest" value="${S.rest}"></div></div>`}
let ro=null;
function render(){renderHead();const v=$('view');if(!profOK()){v.innerHTML=renderOnboarding();return}v.innerHTML=view==='train'?scoreLine()+nutLine()+renderTrain():view==='hist'?renderHist():view==='rec'?renderRec():view==='nut'?renderNut():renderPlan()+renderSettings();if(view==='nut')afterNut();
 if(view==='rec'){const s=$('chart');if(s){if(ro)ro.disconnect();ro=new ResizeObserver(drawChart);ro.observe(s)}}}

function finish(){const dr=draftFor(day),ex=[];
 for(const e of dayEx(day)){const sets=dr.ex[e.id].map(r=>({kg:num(r.kg)??0,reps:Math.round(num(r.reps)??0),...(r.rpe?{rpe:r.rpe}:{})})).filter(t=>t.reps>0);if(sets.length)ex.push({id:vkey(e),base:e.id,v:e.v||'',name:vname(e)+(isA(e.v)?' (kg = Hilfe)':''),...(isA(e.v)?{assist:true}:{}),sets})}
 const cardio=(dr.cardio||[]).filter(c=>num(c.min)>0).map(c=>({type:c.type,min:num(c.min),...(num(c.km)?{km:num(c.km)}:{}),...(num(c.hr)?{hr:Math.round(num(c.hr))}:{}),lvl:c.lvl||'m'}));
 if(!ex.length&&!cardio.length){note('Trag mindestens einen Satz oder Cardio ein');return}
 const date=Date.now(),s={id:'s_'+date,date,day,start:dr.start,ex,...(cardio.length?{cardio}:{})},prs=[];
 for(const x of ex){if(isA(x.id))continue;const b=best(x.id),m=Math.max(...x.sets.map(t=>e1(t.kg,t.reps)));if(b>0&&m>b+0.01)prs.push(`${x.name}: Kraftwert ${fmt(m)} kg (vorher ${fmt(b)})`)}
 const prev=[...S.sessions].filter(q=>q.day===day).sort((a,b)=>b.date-a.date)[0];
 s.prn=prs.length;S.sessions.push(s);delete drafts[day];saveDrafts();announce(s,prs);
 summary={day,vol:vol(s),prevVol:prev?vol(prev):0,sets:ex.reduce((a,x)=>a+x.sets.length,0),prs,cmin:cardio.reduce((a,c)=>a+c.min,0)};
 putSession(s);stopT();render();scrollTo({top:0,behavior:'smooth'})}

let tEnd=0,tTot=0,tInt=null;
function startT(sec){tTot=sec;tEnd=Date.now()+sec*1000;$('timer').classList.add('on');clearInterval(tInt);tInt=setInterval(tick,250);tick()}
function tick(){const l=Math.max(0,Math.round((tEnd-Date.now())/1000));$('tLeft').textContent=`${Math.floor(l/60)}:${String(l%60).padStart(2,'0')}`;$('tBar').style.width=(tTot?l/tTot*100:0)+'%';if(l<=0){$('tLeft').textContent='Los!';clearInterval(tInt);setTimeout(()=>{if(Date.now()>=tEnd)stopT()},4000)}}
let toT=null;function toast(t,sub){$('toastT').textContent=t;$('toastS').textContent=sub;const el=$('toast');el.classList.add('on');try{navigator.vibrate&&navigator.vibrate([60,40,120])}catch(e){}clearTimeout(toT);toT=setTimeout(()=>el.classList.remove('on'),3800)}
function stopT(){clearInterval(tInt);$('timer').classList.remove('on')}

document.addEventListener('click',ev=>{const b=ev.target.closest('[data-a]');if(!b||b.tagName==='INPUT'||b.tagName==='SELECT')return;const a=b.dataset.a,eid=b.dataset.e,i=+b.dataset.i;
 const keep=confirmKey;confirmKey=null;
 if(a==='day'){day=b.dataset.d;picker=false}
 else if(a==='view'){view=b.dataset.v;sheet=null;stopScan();if(b.dataset.pick)picker=true;scrollTo({top:0})}
 else if(a==='var'){const pe=S.plan[day].find(x=>x.id===eid)||(drafts[day]&&drafts[day].extra.find(x=>x.id===eid));if(pe){pe.v=b.dataset.v;if(S.plan[day].includes(pe))savePlan();else saveDrafts()}}
 else if(a==='done'){const dr=draftFor(day),r=dr.ex[eid][i],ins=b.closest('.row').querySelectorAll('input');
  if(!r.done){if(r.kg==='')r.kg=ins[0].placeholder==='–'?'':ins[0].placeholder;if(r.reps==='')r.reps=ins[1].placeholder==='–'?'':ins[1].placeholder;if(r.reps===''){note('Erst Wiederholungen eintragen');return}r.done=true;startT(S.rest);const e=dayEx(day).find(x=>x.id===eid),k=vkey(e),b0=best(k),m=e1(num(r.kg)??0,num(r.reps)??0),prevSets=dr.ex[eid].filter((x,j)=>j!==i&&x.done).map(x=>e1(num(x.kg)??0,num(x.reps)??0));if(!isA(e.v)&&b0>0&&m>b0+0.01&&m>Math.max(0,...prevSets))toast('Neuer Bestwert!',`${vname(e)}: ${fmt(num(r.kg))} kg × ${r.reps} · Kraftwert ${fmt(m)} kg`)}else r.done=false;saveDrafts()}
 else if(a==='rpe'){const r=draftFor(day).ex[eid][i];r.rpe=r.rpe===b.dataset.r?'':b.dataset.r;saveDrafts()}
 else if(a==='cadd'){draftFor(day).cardio.push({type:CT[0],min:'',km:'',lvl:'m'});saveDrafts()}
 else if(a==='crm'){draftFor(day).cardio.splice(i,1);saveDrafts()}
 else if(a==='clvl'){draftFor(day).cardio[i].lvl=b.dataset.r;saveDrafts()}
 else if(a==='addset'){const rows=draftFor(day).ex[eid],l=rows[rows.length-1]||{kg:''};rows.push({kg:l.kg,reps:'',done:false});saveDrafts()}
 else if(a==='rmset'){const rows=draftFor(day).ex[eid];if(rows.length>1)rows.pop();saveDrafts()}
 else if(a==='picker')picker=!picker;
 else if(a==='pick'){const dr=draftFor(day),id=b.dataset.id,c=CAT[id];const rng=c.p==='calf'||c.p==='lateral'||c.p==='fly'||c.p==='facepull'?[12,15]:[8,12];dr.extra.push({id,sets:3,min:rng[0],max:rng[1],step:2.5,v:c.v[0]});draftFor(day);picker=false;saveDrafts()}
 else if(a==='addtmp'){const n=$('tmpName').value.trim();if(!n)return;const dr=draftFor(day),id='t-'+n.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40);if(!dayEx(day).some(e=>e.id===id))dr.extra.push({id,name:n,sets:3,min:10,max:15,step:2.5});draftFor(day);picker=false;saveDrafts()}
 else if(a==='rmtmp'){const dr=draftFor(day);dr.extra=dr.extra.filter(e=>e.id!==eid);delete dr.ex[eid];saveDrafts()}
 else if(a==='keep'){const dr=draftFor(day),e=dr.extra.find(e=>e.id===eid);if(e){S.plan[day].push(e);dr.extra=dr.extra.filter(x=>x!==e);savePlan();saveDrafts()}}
 else if(a==='finish')finish();
 else if(a==='discard'){if(keep==='discard'){delete drafts[day];saveDrafts();note('Training verworfen')}else confirmKey='discard'}
 else if(a==='closesum')summary=null;
 else if(a==='del'){if(keep===b.dataset.id)dropSession(b.dataset.id);else confirmKey=b.dataset.id}
 else if(a==='copy'){navigator.clipboard.writeText(JSON.stringify(S,null,1)).then(()=>note('Daten kopiert'),()=>note('Kopieren nicht erlaubt'));return}
 else if(a==='mv'){const p=S.plan[day],j=i+(+b.dataset.s);if(j>=0&&j<p.length){[p[i],p[j]]=[p[j],p[i]];savePlan()}}
 else if(a==='rmex'){if(keep==='ex'+i){S.plan[day].splice(i,1);savePlan()}else confirmKey='ex'+i}
 else if(a==='reset'){if(keep==='reset'){S.plan[day]=clone(DEF[day]||[]);savePlan()}else confirmKey='reset'}
 else if(a==='t'){tEnd+=(+b.dataset.s)*1000;tTot=Math.max(tTot,Math.round((tEnd-Date.now())/1000));if(tEnd>Date.now()){clearInterval(tInt);tInt=setInterval(tick,250)}tick();return}
 else if(a==='tstop'){stopT();return}
 else return;
 const open=view==='more'?[...document.querySelectorAll('details.pl')].map(d=>d.open):null;
 render();
 if(open)document.querySelectorAll('details.pl').forEach((d,k)=>{if(open[k])d.open=true})});
document.addEventListener('input',ev=>{const t=ev.target,a=t.dataset.a;
 if(a==='cin'){draftFor(day).cardio[+t.dataset.i][t.dataset.f]=t.value;saveDrafts()}
 else if(a==='in'){draftFor(day).ex[t.dataset.e][+t.dataset.i][t.dataset.f]=t.value.trim();saveDrafts()}
 else if(a==='pl'){const e=S.plan[day][+t.dataset.i],f=t.dataset.f;if(f==='name')e.name=t.value;else{const n=num(t.value);if(n!==null&&n>=0)e[f]=f==='step'?n:Math.max(1,Math.round(n))}savePlan()}
 else if(a==='set'){const n=num(t.value);if(n!==null&&n>0){S[t.dataset.f]=Math.round(n);savePlan();renderHead()}}});
document.addEventListener('change',ev=>{const t=ev.target;if(t.dataset.a==='rec'){recEx=t.value;drawChart()}
 if(t.dataset.a==='pl'&&t.dataset.f!=='name'){const e=S.plan[day][+t.dataset.i];if(e.max<e.min)e.max=e.min;const d=t.closest('details');const sm=d&&d.querySelector('small');if(sm){const x=info(e);sm.textContent=`${x.sets} Sätze · ${x.min}–${x.max} Wdh. · +${fmt(x.step)} kg${x.vars.length>1?' · '+x.v:''}`}}});

/* ===================== ERNÄHRUNG ===================== */
const MEALS=[['f','Frühstück'],['m','Mittag'],['a','Abend'],['s','Snacks']];
let nDate=null,sheet=null; // sheet: {meal, step:'search'|'amount'|'custom'|'scan', q, food, g, results, busy, msg}
const iso=d=>{const x=new Date(d);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')};
const today=()=>iso(Date.now());
const ND=d=>{const N=S.nut;if(!N.days[d])N.days[d]={items:[],t:0};return N.days[d]};
const r1=x=>Math.round(x*10)/10;
function lastWeight(before){const ks=Object.keys(S.nut.days).filter(k=>S.nut.days[k].w&&(!before||k<=before)).sort();return ks.length?S.nut.days[ks[ks.length-1]].w:null}
function bmr(w){const P=S.prof,a=P.year?new Date().getFullYear()-P.year:null;if(!P.height||!a)return null;return 10*w+6.25*P.height-5*a+(P.sex==='w'?-161:5)}
function goals(d){const N=S.nut,w=lastWeight(d)||S.prof.weight||80,b=bmr(w),maint=N.maint||(b?Math.round(b*S.prof.act/50)*50:Math.round(w*32/50)*50),add={aufbau:300,halten:0,defi:-450}[N.goal]||0;
 const trained=S.sessions.some(s=>iso(s.date)===d&&s.ex.length)||(d===today()&&Object.values(drafts).some(dr=>dr&&dr.ex&&Object.values(dr.ex).some(r=>r.some(x=>x.done))));
 const kcal=maint+add,p=Math.round(w*N.gkg*(trained?1.05:1)),f=Math.round(kcal*0.27/9),c=Math.max(0,Math.round((kcal-p*4-f*9)/4));return{kcal,p,c,f,w,trained,maint,bmr:b}}
function totals(d){const t={kcal:0,p:0,c:0,f:0};for(const it of (S.nut.days[d]||{items:[]}).items){t.kcal+=it.kcal;t.p+=it.p;t.c+=it.c;t.f+=it.f}return t}
function itemFrom(food,g,meal){const k=g/100;return{id:'i'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),name:food.name,g,meal,kcal:Math.round(food.kcal*k),p:r1(food.p*k),c:r1(food.c*k),f:r1(food.f*k),fid:food.id}}
function touch(d){ND(d).t=Date.now();persist()}
function allFoods(){return [...S.nut.foods,...FOODS]}
function remember(food){const N=S.nut;if(food.src==='off'||food.src==='own'){if(!N.foods.some(x=>x.id===food.id))N.foods.unshift(food)}N.recent=[food.id,...N.recent.filter(x=>x!==food.id)].slice(0,30)}
function nutLine(){const d=today(),g=goals(d),t=totals(d);if(!t.kcal&&!lastWeight())return '';return `<p class="nline" data-a="view" data-v="nut">Ernährung heute: <b>${fmt(t.kcal)}</b> / ${fmt(g.kcal)} kcal · <b>${fmt(Math.round(t.p))}</b> / ${g.p} g Protein${g.trained?' · Trainingstag':''}</p>`}
const bar=(l,v,goal,u)=>{const pc=goal?Math.min(v/goal,1.25)*100:0;return `<div class="nb"><div class="nbh"><span>${l}</span><span><b>${fmt(Math.round(v))}</b> / ${fmt(goal)} ${u}</span></div><i><s style="width:${Math.min(pc,100)}%"${v>goal*1.08?' class="over"':''}></s></i></div>`};
function renderNut(){if(!nDate)nDate=today();const d=nDate,g=goals(d),t=totals(d),day=S.nut.days[d]||{items:[]},isT=d===today();
 const left=g.kcal-t.kcal,dl=new Date(d+'T12:00').toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'long'});
 let h=`<div class="ndate"><button data-n="prev" aria-label="Vortag">‹</button><b>${isT?'Heute':dl}</b><button data-n="next" aria-label="Nächster Tag"${isT?' disabled':''}>›</button></div>
 <section class="nsum"><div class="nbig"><b class="cond">${fmt(Math.abs(left))}</b><span>${left>=0?'kcal übrig':'kcal drüber'}</span><small>${{aufbau:'Aufbau',halten:'Halten',defi:'Definieren'}[S.nut.goal]}${g.trained?' · Trainingstag, Protein +5 %':''}</small></div>
 <div class="nbars">${bar('Kalorien',t.kcal,g.kcal,'kcal')}${bar('Protein',t.p,g.p,'g')}${bar('Kohlenhydrate',t.c,g.c,'g')}${bar('Fett',t.f,g.f,'g')}</div></section>`;
 h+=MEALS.map(([m,l])=>{const its=day.items.filter(i=>i.meal===m),mk=its.reduce((a,i)=>a+i.kcal,0);
  return `<section class="meal"><header><h3>${l}</h3><span>${mk?fmt(mk)+' kcal':''}</span></header>${its.map(i=>`<div class="it"><div><b>${esc(i.name)}</b><small>${fmt(i.g)} g · ${fmt(i.p)} g Protein</small></div><span>${fmt(i.kcal)}</span><button data-n="rm" data-id="${i.id}" aria-label="Entfernen">✕</button></div>`).join('')}
  <div class="mfoot"><button data-n="add" data-m="${m}">+ Hinzufügen</button>${its.length?`<button class="ghost" data-n="tpl" data-m="${m}">Als Vorlage speichern</button>`:''}</div></section>`}).join('');
 const ws=Object.keys(S.nut.days).filter(k=>S.nut.days[k].w).sort();
 h+=`<section class="meal"><header><h3>Körpergewicht & Wasser</h3><span>${day.w?fmt(day.w)+' kg':''}</span></header>
 <div class="wrow"><input id="wIn" inputmode="decimal" placeholder="${lastWeight(d)?fmt(lastWeight(d)):'kg'}" value="${day.w?fmt(day.w):''}" aria-label="Gewicht in kg"><button data-n="w">Gewicht speichern</button></div>
 <div class="wrow"><span class="water">${fmt((day.water||0)/1000)} l Wasser</span><button data-n="water" data-v="250">+ 250 ml</button><button data-n="water" data-v="500">+ 500 ml</button><button class="ghost" data-n="water" data-v="-250">−</button></div>
 ${ws.length>1?`<div class="fig" style="min-height:200px"><svg id="wchart" role="img" aria-label="Gewichtsverlauf"></svg></div>`:''}</section>
 <details class="meal nset"><summary><h3>Ziele einstellen</h3><span>${fmt(g.kcal)} kcal · ${g.p} g Protein</span></summary>
 <div class="vars" style="margin:8px 0">${[['aufbau','Aufbau (+300)'],['halten','Halten'],['defi','Definieren (−450)']].map(([k,l])=>`<button data-n="goal" data-v="${k}" aria-pressed="${S.nut.goal===k}">${l}</button>`).join('')}</div>
 <div class="settings" style="margin:8px 0"><div><label for="maint">Erhaltungsbedarf (kcal)</label><input id="maint" inputmode="numeric" data-n="maint" placeholder="${g.maint} (geschätzt)" value="${S.nut.maint||''}"></div><div><label for="gkg">Protein pro kg Körpergewicht</label><input id="gkg" inputmode="decimal" data-n="gkg" value="${fmt(S.nut.gkg)}"></div></div>
 <p class="tip" style="padding:0">${g.bmr?`Aus deinem Profil berechnet (Grundumsatz ${fmt(Math.round(g.bmr))} kcal × Aktivität ${fmt(S.prof.act)}). Eigene Angabe überschreibt das.`:'Profil unter „Mehr“ ausfüllen für eine genaue Berechnung – sonst grob 32 kcal pro kg.'} Fett 27 % der Kalorien, Rest Kohlenhydrate.</p></details>`;
 if(sheet)h+=renderSheet();
 return h}
function afterNut(){const s=$('wchart');if(s){if(ro)ro.disconnect();ro=new ResizeObserver(drawW);ro.observe(s)}const q=$('fq');if(q&&sheet&&sheet.focus){q.focus();q.setSelectionRange(q.value.length,q.value.length);sheet.focus=false}}
function drawW(){const s=$('wchart');if(!s)return;const W=s.clientWidth,Hh=s.clientHeight;if(!W)return;
 const ks=Object.keys(S.nut.days).filter(k=>S.nut.days[k].w).sort().slice(-60),pts=ks.map(k=>({k,v:S.nut.days[k].w})),avg=pts.map((q,i)=>{const a=pts.slice(Math.max(0,i-6),i+1);return a.reduce((x,y)=>x+y.v,0)/a.length});
 const p={l:40,r:14,t:16,b:26},lo=Math.min(...pts.map(q=>q.v))-0.5,hi=Math.max(...pts.map(q=>q.v))+0.5,x=i=>p.l+(pts.length<2?0:i*(W-p.l-p.r)/(pts.length-1)),y=v=>p.t+(hi-v)/(hi-lo)*(Hh-p.t-p.b);
 s.innerHTML=[lo+0.5,hi-0.5].map(v=>`<line x1="${p.l}" x2="${W-p.r}" y1="${y(v)}" y2="${y(v)}" stroke="#2a2e35"/><text x="${p.l-6}" y="${y(v)+4}" text-anchor="end" font-size="11" fill="#8f949d">${fmt(r1(v))}</text>`).join('')
 +pts.map((q,i)=>`<circle cx="${x(i)}" cy="${y(q.v)}" r="2.5" fill="#8f949d"/>`).join('')+`<path d="${avg.map((v,i)=>`${i?'L':'M'}${x(i)},${y(v)}`).join('')}" fill="none" stroke="#ff5a36" stroke-width="3"/>`
 +`<text x="${W-p.r}" y="${Hh-6}" text-anchor="end" font-size="12" fill="#eeece8">Ø 7 Tage: ${fmt(r1(avg[avg.length-1]))} kg</text>`}
/* --- Hinzufügen-Sheet --- */
function foodRow(f){return `<button class="frow" data-n="pick" data-id="${esc(f.id)}"><div><b>${esc(f.name)}</b><small>${f.brand?esc(f.brand)+' · ':''}${fmt(f.kcal)} kcal · ${fmt(f.p)} g P / 100 g</small></div><span>›</span></button>`}
function renderSheet(){const sh=sheet,ml=MEALS.find(m=>m[0]===sh.meal)[1];let b='';
 if(sh.step==='amount'){const f=sh.food,g=num(sh.g)||0,it=itemFrom(f,g,sh.meal);
  b=`<button class="back" data-n="back">‹ Zurück</button><h2>${esc(f.name)}</h2><p class="tip" style="padding:0">${f.brand?esc(f.brand)+' · ':''}pro 100 g: ${fmt(f.kcal)} kcal · ${fmt(f.p)} P · ${fmt(f.c)} KH · ${fmt(f.f)} F</p>
  <div class="amt"><input id="gIn" inputmode="decimal" value="${esc(sh.g)}" data-n="g" aria-label="Menge in Gramm"><span>g</span></div>
  <div class="vars">${[...(f.por?[[f.por.l,f.por.g]]:[]),['50 g',50],['100 g',100],['150 g',150],['200 g',200]].map(([l,v])=>`<button data-n="gq" data-v="${v}">${esc(l)}</button>`).join('')}</div>
  <div class="calc"><div><b>${fmt(it.kcal)}</b><small>kcal</small></div><div><b>${fmt(it.p)}</b><small>Protein</small></div><div><b>${fmt(it.c)}</b><small>KH</small></div><div><b>${fmt(it.f)}</b><small>Fett</small></div></div>
  <button class="primary" data-n="addit" style="width:100%">Zu ${ml} hinzufügen</button>`}
 else if(sh.step==='custom'){b=`<button class="back" data-n="back">‹ Zurück</button><h2>Eigenes Produkt</h2><p class="tip" style="padding:0">Werte von der Packung, pro 100 g.</p>
  <div class="cform"><div class="full"><label>Name</label><input id="cN" value="${esc(sh.q||'')}"></div>${[['cK','kcal'],['cP','Protein g'],['cC','Kohlenhydrate g'],['cF','Fett g'],['cG','Portion g (optional)']].map(([i,l])=>`<div><label>${l}</label><input id="${i}" inputmode="decimal"></div>`).join('')}</div>
  <button class="primary" data-n="savecustom" style="width:100%">Speichern & weiter</button>`}
 else if(sh.step==='scan'){b=`<button class="back" data-n="back">‹ Zurück</button><h2>Barcode scannen</h2><div id="scanbox"></div><p class="tip" style="padding:8px 0">${esc(sh.msg||'Barcode in den Rahmen halten.')}</p><div class="wrow"><input id="codeIn" inputmode="numeric" placeholder="oder Nummer eintippen"><button data-n="code">Suchen</button></div>`}
 else{const q=(sh.q||'').trim().toLowerCase(),N=S.nut;
  const tpls=N.meals.length&&!q?`<h4>Vorlagen</h4>${N.meals.map(t=>`<button class="frow" data-n="usetpl" data-id="${t.id}"><div><b>${esc(t.name)}</b><small>${t.items.length} Lebensmittel · ${fmt(t.items.reduce((a,i)=>a+i.kcal,0))} kcal</small></div><span>+</span></button>`).join('')}`:'';
  const rec=!q?N.recent.map(id=>allFoods().find(f=>f.id===id)).filter(Boolean):[];
  const hits=q?allFoods().filter(f=>(f.name+' '+(f.brand||'')).toLowerCase().includes(q)).slice(0,25):[];
  b=`<div class="shtop"><h2>${ml}</h2><button class="ghost" data-n="close">Schließen</button></div>
  <div class="srch"><input id="fq" data-n="q" placeholder="Lebensmittel suchen …" value="${esc(sh.q||'')}" autocomplete="off"><button data-n="scan" aria-label="Barcode scannen">▦ Scan</button></div>
  ${tpls}${rec.length?`<h4>Zuletzt</h4>${rec.slice(0,10).map(foodRow).join('')}`:''}
  ${q?`${hits.length?`<h4>Gefunden</h4>${hits.map(foodRow).join('')}`:''}<h4>Open Food Facts</h4>${sh.busy?'<p class="tip" style="padding:0">Suche …</p>':sh.results?(sh.results.length?sh.results.map(foodRow).join(''):'<p class="tip" style="padding:0">Nichts gefunden.</p>'):`<button data-n="off" style="width:100%">„${esc(sh.q)}“ in Open Food Facts suchen</button>`}`:''}
  <div class="actions"><button class="ghost" data-n="custom">+ Eigenes Produkt anlegen</button></div>`}
 return `<div class="sheet" role="dialog" aria-modal="true"><div class="sheetin">${b}</div></div>`}
function mapOFF(p){const n=p.nutriments||{};const kcal=n['energy-kcal_100g']??(n['energy_100g']?n['energy_100g']/4.184:null);if(kcal==null)return null;
 const sq=parseFloat(p.serving_quantity);return{id:'off'+(p.code||p._id),name:(p.product_name_de||p.product_name||'Unbekannt').trim(),brand:(p.brands||'').split(',')[0].trim(),kcal:Math.round(kcal),p:r1(+n.proteins_100g||0),c:r1(+n.carbohydrates_100g||0),f:r1(+n.fat_100g||0),por:sq>0?{l:'Portion '+fmt(sq)+' g',g:sq}:null,src:'off',code:p.code}}
const OFF_FIELDS='code,product_name,product_name_de,brands,nutriments,serving_quantity';
async function offSearch(q){sheet.busy=true;render();try{const r=await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=25&lc=de&cc=de&fields=${OFF_FIELDS}`);const j=await r.json();sheet.results=(j.products||[]).map(mapOFF).filter(Boolean)}catch(e){sheet.results=[];note('Open Food Facts nicht erreichbar')}if(sheet){sheet.busy=false;render()}}
async function offCode(code){if(!sheet)return;sheet.msg='Suche '+code+' …';render();try{const r=await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json?fields=${OFF_FIELDS}`);const j=await r.json();const f=j.status===1&&mapOFF({...j.product,code});
 if(f){stopScan();sheet.food=f;sheet.g=f.por?String(f.por.g):'100';sheet.step='amount'}else{sheet.msg=`Produkt ${code} nicht gefunden oder ohne Nährwerte – leg es als eigenes Produkt an.`}}catch(e){sheet.msg='Open Food Facts nicht erreichbar.'}render()}
let scanner=null,scanLib=null;
function loadScanLib(){if(scanLib)return scanLib;scanLib=new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';s.onload=()=>res();s.onerror=()=>{scanLib=null;rej()};document.head.appendChild(s)});return scanLib}
async function startScan(){try{await loadScanLib();await new Promise(r=>setTimeout(r,50));if(!$('scanbox'))return;
 scanner=new Html5Qrcode('scanbox',{formatsToSupport:[Html5QrcodeSupportedFormats.EAN_13,Html5QrcodeSupportedFormats.EAN_8,Html5QrcodeSupportedFormats.UPC_A,Html5QrcodeSupportedFormats.UPC_E],verbose:false});
 let done=false;await scanner.start({facingMode:'environment'},{fps:10,qrbox:{width:260,height:140}},code=>{if(done)return;done=true;try{navigator.vibrate&&navigator.vibrate(60)}catch(e){}offCode(code)},()=>{})}catch(e){if(sheet){sheet.msg='Kamera nicht verfügbar – Kamera-Zugriff erlauben oder Nummer eintippen.';render()}}}
function stopScan(){if(scanner){const s=scanner;scanner=null;s.stop().catch(()=>{}).finally(()=>{try{s.clear()}catch(e){}})}}
let offT=null;
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-n]');if(!b||b.tagName==='INPUT')return;const a=b.dataset.n,d=nDate||today();
 if(a==='prev'||a==='next'){const x=new Date(d+'T12:00');x.setDate(x.getDate()+(a==='prev'?-1:1));nDate=iso(x)}
 else if(a==='add'){sheet={meal:b.dataset.m,step:'search',q:'',focus:true}}
 else if(a==='close'){stopScan();sheet=null}
 else if(a==='back'){stopScan();sheet.step='search';sheet.msg=''}
 else if(a==='rm'){const dd=ND(d);dd.items=dd.items.filter(i=>i.id!==b.dataset.id);touch(d)}
 else if(a==='pick'){const f=allFoods().find(x=>x.id===b.dataset.id)||(sheet.results||[]).find(x=>x.id===b.dataset.id);if(!f)return;sheet.food=f;sheet.g=f.por?String(f.por.g):'100';sheet.step='amount'}
 else if(a==='gq'){sheet.g=b.dataset.v}
 else if(a==='addit'){const g=num(sheet.g);if(!g||g<=0){note('Menge eingeben');return}ND(d).items.push(itemFrom(sheet.food,g,sheet.meal));remember(sheet.food);touch(d);sheet=null}
 else if(a==='off'){offSearch(sheet.q.trim());return}
 else if(a==='scan'){sheet.step='scan';sheet.msg='';render();startScan();return}
 else if(a==='code'){const c=($('codeIn').value||'').replace(/\D/g,'');if(c)offCode(c);return}
 else if(a==='custom'){sheet.step='custom'}
 else if(a==='savecustom'){const v=i=>num($(i).value),n=$('cN').value.trim();if(!n||v('cK')==null){note('Name und kcal angeben');return}
  const f={id:'own'+Date.now().toString(36),name:n,kcal:v('cK'),p:v('cP')||0,c:v('cC')||0,f:v('cF')||0,por:v('cG')?{l:'Portion '+fmt(v('cG'))+' g',g:v('cG')}:null,src:'own'};S.nut.foods.unshift(f);S.metaT=Date.now();sheet.food=f;sheet.g=f.por?String(f.por.g):'100';sheet.step='amount';persist()}
 else if(a==='tpl'){const its=ND(d).items.filter(i=>i.meal===b.dataset.m);const name=(MEALS.find(m=>m[0]===b.dataset.m)[1])+' '+new Date().toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'});S.nut.meals.unshift({id:'m'+Date.now().toString(36),name,items:its.map(({id,meal,...r})=>r)});S.metaT=Date.now();persist();note('Vorlage gespeichert')}
 else if(a==='usetpl'){const t=S.nut.meals.find(x=>x.id===b.dataset.id);if(t){for(const r of t.items)ND(d).items.push({...r,id:'i'+Math.random().toString(36).slice(2,9),meal:sheet.meal});touch(d);sheet=null}}
 else if(a==='w'){const w=num($('wIn').value);if(w&&w>30&&w<300){ND(d).w=w;touch(d)}else{note('Gewicht in kg eingeben');return}}
 else if(a==='water'){const dd=ND(d);dd.water=Math.max(0,(dd.water||0)+(+b.dataset.v));touch(d)}
 else if(a==='goal'){S.nut.goal=b.dataset.v;S.metaT=Date.now();persist()}
 else return;
 const op=document.querySelector('details.nset');const wasOpen=op&&op.open;render();if(wasOpen){const n=document.querySelector('details.nset');if(n)n.open=true}});
document.addEventListener('input',ev=>{const t=ev.target,a=t.dataset.n;if(!a)return;
 if(a==='q'){sheet.q=t.value;sheet.results=null;sheet.focus=true;clearTimeout(offT);render();if(t.value.trim().length>2){offT=setTimeout(()=>{if(sheet&&sheet.step==='search'&&sheet.q.trim().length>2&&!allFoods().some(f=>f.name.toLowerCase().includes(sheet.q.trim().toLowerCase())))offSearch(sheet.q.trim())},900)}}
 else if(a==='g'){sheet.g=t.value;const it=itemFrom(sheet.food,num(t.value)||0,sheet.meal),c=document.querySelectorAll('.calc b');if(c.length===4){c[0].textContent=fmt(it.kcal);c[1].textContent=fmt(it.p);c[2].textContent=fmt(it.c);c[3].textContent=fmt(it.f)}}
 else if(a==='maint'){S.nut.maint=Math.round(num(t.value)||0);S.metaT=Date.now();persist()}
 else if(a==='gkg'){const v=num(t.value);if(v&&v>0.5&&v<4){S.nut.gkg=v;S.metaT=Date.now();persist()}}});

/* ===================== HOME-ASSISTANT-SYNC ===================== */
let HA={url:'',token:''},syncT=null,syncing=false,syncAgain=false;
try{HA=Object.assign(HA,JSON.parse(localStorage.getItem('sc.ha'))||{})}catch(e){}
function haCall(cmds){return new Promise((res,rej)=>{let ws;try{ws=new WebSocket(HA.url.replace(/\/+$/,'').replace(/^http/,'ws')+'/api/websocket')}catch(e){rej(new Error('Adresse ungültig'));return}
 const out={};let id=0;const to=setTimeout(()=>{try{ws.close()}catch(e){}rej(new Error('Keine Antwort von Home Assistant'))},20000);
 ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.type==='auth_required')ws.send(JSON.stringify({type:'auth',access_token:HA.token}));
  else if(m.type==='auth_invalid'){clearTimeout(to);ws.close();rej(new Error('Token ungültig'))}
  else if(m.type==='auth_ok'){if(!cmds.length){clearTimeout(to);ws.close();res([]);return}cmds.forEach(c=>ws.send(JSON.stringify({id:++id,...c})))}
  else if(m.type==='result'){out[m.id]=m;if(Object.keys(out).length===cmds.length){clearTimeout(to);ws.close();res(cmds.map((_,i)=>out[i+1]))}}};
 ws.onerror=()=>{clearTimeout(to);rej(new Error('Home Assistant nicht erreichbar'))}})}
function syncLater(){clearTimeout(syncT);if(HA.url&&HA.token)syncT=setTimeout(syncNow,1500)}
function metaOf(){return{t:S.metaT,prof:S.prof,plan:S.plan,goal:S.goal,rest:S.rest,cgoal:S.cgoal,nut:{goal:S.nut.goal,maint:S.nut.maint,gkg:S.nut.gkg,foods:S.nut.foods,meals:S.nut.meals,recent:S.nut.recent},drafts,draftT}}
function merge(R){let changed=false;const m=R.sc_meta;
 if(m&&(m.t||0)>(S.metaT||0)){if(m.prof)S.prof=m.prof;Object.assign(S,{plan:m.plan||S.plan,goal:m.goal||S.goal,rest:m.rest||S.rest,cgoal:m.cgoal||S.cgoal,metaT:m.t});if(m.nut)Object.assign(S.nut,m.nut);changed=true}
 if(m&&(m.draftT||0)>draftT){drafts=m.drafts||{};draftT=m.draftT;changed=true}
 const rs=R.sc_sessions;if(rs){const del=new Set([...(S.del||[]),...(rs.del||[])]),map=new Map();for(const s of [...(rs.list||[]),...S.sessions]){const o=map.get(s.id);if(!o||(s.t||0)>(o.t||0))map.set(s.id,s)}
  const list=[...map.values()].filter(s=>!del.has(s.id));if(list.length!==S.sessions.length||del.size!==(S.del||[]).length)changed=true;S.sessions=list;S.del=[...del]}
 const rn=R.sc_nut;if(rn&&rn.days){for(const k in rn.days){const o=S.nut.days[k];if(!o||(rn.days[k].t||0)>(o.t||0)){S.nut.days[k]=rn.days[k];changed=true}}}
 if(changed)migrate();return changed}
async function syncNow(){if(!HA.url||!HA.token)return;if(syncing){syncAgain=true;return}syncing=true;note('Synchronisiere …');
 try{const keys=['sc_meta','sc_sessions','sc_nut'],r=await haCall(keys.map(k=>({type:'frontend/get_user_data',key:k}))),R={};
  r.forEach((m,i)=>{if(m&&m.success&&m.result)R[keys[i]]=m.result.value});
  const changed=merge(R);lsSave();
  await haCall([{type:'frontend/set_user_data',key:'sc_meta',value:metaOf()},{type:'frontend/set_user_data',key:'sc_sessions',value:{list:S.sessions,del:S.del}},{type:'frontend/set_user_data',key:'sc_nut',value:{days:S.nut.days}}]);
  note('Synchronisiert · '+new Date().toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'}));publish();
  const busy=document.activeElement&&document.activeElement.tagName==='INPUT';if(changed&&!busy&&!sheet)render()}
 catch(e){note((navigator.onLine?e.message:'Offline')+' – lokal gespeichert')}
 syncing=false;if(syncAgain){syncAgain=false;syncNow()}}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){clearTimeout(syncT);syncNow()}else syncNow()});
addEventListener('online',()=>syncNow());

/* ===================== EINSTELLUNGEN ===================== */
function pcalc(){const g=goals(today());return `<div><b>${g.bmr?fmt(Math.round(g.bmr)):'–'}</b><small>Grundumsatz</small></div><div><b>${fmt(g.maint)}</b><small>Erhalt kcal</small></div><div><b>${fmt(g.kcal)}</b><small>Ziel kcal</small></div><div><b>${g.p}</b><small>Protein g</small></div>`}
function renderProfile(){const P=S.prof,g=goals(today());const f=(k,l,ph,mode='decimal')=>`<div><label for="p_${k}">${l}</label><input id="p_${k}" inputmode="${mode}" data-p="${k}" placeholder="${ph}" value="${esc(P[k]??'')}"></div>`;
 return `<section class="meal"><header><h3>Mein Profil</h3><span>${P.name?esc(P.name):''}</span></header>
 <div class="cform">${f('name','Name','z. B. Michell','text')}<div><label>Geschlecht</label><div class="vars">${[['m','Mann'],['w','Frau']].map(([k,l])=>`<button data-ps="sex" data-v="${k}" aria-pressed="${P.sex===k}">${l}</button>`).join('')}</div></div>
 ${f('year','Geburtsjahr','z. B. 1990','numeric')}${f('height','Größe (cm)','z. B. 182','numeric')}${f('weight','Startgewicht (kg)','z. B. 85')}
 <div class="full"><label>Alltag (ohne Training eingerechnet)</label><div class="vars">${[[1.4,'Büro, wenig Bewegung'],[1.55,'Büro + Training 3–4×'],[1.7,'Aktiv / Training 5–6×'],[1.85,'Körperlich harte Arbeit']].map(([v,l])=>`<button data-ps="act" data-v="${v}" aria-pressed="${S.prof.act==v}">${l}</button>`).join('')}</div></div></div>
 <div class="calc" id="pcalc">${pcalc()}</div>
 <p class="tip" style="padding:0">Gewicht: wird automatisch durch dein zuletzt eingetragenes Gewicht (Essen-Tab) ersetzt. Ziel (Aufbau/Halten/Definieren) stellst du im Essen-Tab ein.</p></section>`}
function renderSettings(){return renderProfile()+`<section class="meal" style="margin-top:24px"><header><h3>Home Assistant</h3><span>${HA.url&&HA.token?'verbunden':'nicht eingerichtet'}</span></header>
 <p class="tip" style="padding:0 0 8px">Deine Daten werden in deinem Home Assistant gespeichert (pro HA-Benutzer). Adresse: deine Nabu-Casa-URL. Token: HA → Profil → Sicherheit → „Langlebiges Zugriffstoken erstellen“.</p>
 <div class="cform"><div class="full"><label for="haUrl">Adresse</label><input id="haUrl" placeholder="https://xxxxxxxx.ui.nabu.casa" value="${esc(HA.url)}" autocapitalize="off" autocorrect="off"></div>
 <div class="full"><label for="haTok">Token</label><input id="haTok" type="password" placeholder="${HA.token?'gespeichert – zum Ändern neu einfügen':'Token einfügen'}" autocapitalize="off" autocorrect="off"></div></div>
 <div class="actions"><button class="primary" data-s="ha">Verbinden & synchronisieren</button>${HA.token?'<button class="ghost" data-s="haoff">Trennen</button>':''}</div></section>
 <section class="meal"><header><h3>Daten übernehmen & sichern</h3></header>
 <p class="tip" style="padding:0 0 8px">Aus dem alten Cockpit in Claude: dort Verlauf → „Alle Daten kopieren“, hier einfügen.</p>
 <textarea id="imp" rows="4" placeholder="Kopierte Daten hier einfügen"></textarea>
 <div class="actions"><button data-s="imp">Importieren</button><button class="ghost" data-s="exp">Backup kopieren</button></div></section>
 <p class="tip" style="padding:0 0 20px">Sport Cockpit · Lebensmittel-Daten: Open Food Facts (ODbL) und eingebaute Richtwerte.</p>`}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-ps]');if(!b)return;const k=b.dataset.ps;S.prof[k]=k==='act'?+b.dataset.v:b.dataset.v;S.metaT=Date.now();persist();render()});
document.addEventListener('input',ev=>{const t=ev.target,k=t.dataset.p;if(!k)return;S.prof[k]=k==='name'?t.value:(num(t.value)??'');S.metaT=Date.now();persist();renderHead();const c=$('pcalc');if(c)c.innerHTML=pcalc()});
document.addEventListener('click',async ev=>{const b=ev.target.closest('[data-s]');if(!b)return;const a=b.dataset.s;
 if(a==='ha'){let u=$('haUrl').value.trim().replace(/\/+$/,'');const t=$('haTok').value.trim();if(!/^https?:\/\//.test(u)){note('Adresse mit https:// angeben');return}
  const old={...HA};HA.url=u;if(t)HA.token=t;note('Verbinde …');try{await haCall([]);localStorage.setItem('sc.ha',JSON.stringify(HA));note('Verbunden');render();syncNow()}catch(e){HA=old;note(e.message)}}
 else if(a==='haoff'){HA={url:'',token:''};localStorage.removeItem('sc.ha');render();note('Getrennt – nur lokal')}
 else if(a==='exp'){navigator.clipboard.writeText(JSON.stringify({S,drafts})).then(()=>note('Backup kopiert'),()=>note('Kopieren nicht erlaubt'))}
 else if(a==='imp'){try{const j=JSON.parse($('imp').value);const src=j.S||j;let n=0;const ids=new Set(S.sessions.map(s=>s.id));for(const s of (src.sessions||[]))if(!ids.has(s.id)){s.t=s.t||Date.now();S.sessions.push(s);n++}
  if(src.plan&&!S.metaT){S.plan=src.plan;S.goal=src.goal||S.goal;S.rest=src.rest||S.rest;S.cgoal=src.cgoal||S.cgoal;S.metaT=Date.now()}
  if(src.nut&&src.nut.days)for(const k in src.nut.days)if(!S.nut.days[k])S.nut.days[k]=src.nut.days[k];migrate();persist();render();note(n+' Einheiten übernommen')}catch(e){note('Daten nicht lesbar')}}});

/* ===================== PUNKTE & PARTNER ===================== */
const slugN=n=>String(n||'').toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
function dayScore(d){const g=goals(d),t=totals(d),day=S.nut.days[d]||{},ss=S.sessions.filter(s=>iso(s.date)===d);let pt=0;const why=[];
 const tr=ss.find(s=>s.ex.length);if(tr){pt+=30;why.push('Training +30')}
 const c=ss.reduce((a,s)=>a+(s.cardio||[]).reduce((b,x)=>b+x.min,0),0);if(c>=20){pt+=15;why.push('Cardio +15')}
 if(t.kcal>0){if(t.p>=g.p){pt+=20;why.push('Protein +20')}else if(t.p>=g.p*.9){pt+=10;why.push('Protein fast +10')}
  const dev=Math.abs(t.kcal-g.kcal)/g.kcal;if(dev<=.1){pt+=20;why.push('Kalorien im Ziel +20')}else if(dev<=.2){pt+=10;why.push('Kalorien nah dran +10')}}
 if(day.w){pt+=5;why.push('Gewogen +5')}if((day.water||0)>=2000){pt+=5;why.push('2 l Wasser +5')}
 const prn=ss.reduce((a,s)=>a+(s.prn||0),0);if(prn){pt+=10*prn;why.push(prn+'× Bestwert +'+10*prn)}
 return{pt,why,g,t,c,tr:tr?DAYS[tr.day].n:''}}
function weekScore(){const m=new Date(wk(Date.now()));let sum=0;for(let i=0;i<7;i++){const d=new Date(m);d.setDate(d.getDate()+i);if(d>new Date())break;sum+=dayScore(iso(d)).pt}return sum}
function scoreLine(){const s=dayScore(today());return `<p class="nline" data-a="view" data-v="nut">Heute <b>${s.pt} Punkte</b> · Woche <b>${weekScore()}</b>${s.why.length?' · '+s.why.join(', '):' · Trainiere, iss im Ziel und trink genug, um Punkte zu sammeln'}</p>`}
let lastPub='';
async function publish(){if(!HA.token||!S.prof.name)return;const d=today(),s=dayScore(d);
 const v=JSON.stringify({d,k:Math.round(s.t.kcal),kz:s.g.kcal,p:Math.round(s.t.p),pz:s.g.p,tr:s.tr,c:Math.round(s.c),pt:s.pt,wp:weekScore()});if(v===lastPub)return;
 try{const r=await haCall([{type:'call_service',domain:'input_text',service:'set_value',service_data:{entity_id:'input_text.sport_cockpit_'+slugN(S.prof.name),value:v.slice(0,255)}}]);if(r[0]&&r[0].success)lastPub=v}catch(e){}
 const dd=S.nut.days[d];if(dd&&s.t.p>=s.g.p&&!dd.pg){dd.pg=1;touch(d);tell('Proteinziel geschafft','💪 '+S.prof.name+' hat heute '+Math.round(s.t.p)+' g Protein gegessen.')}}
async function tell(titel,nachricht){if(!HA.token||!S.prof.name)return;try{await haCall([{type:'call_service',domain:'script',service:'sport_cockpit_meldung',service_data:{von:S.prof.name,titel,nachricht}}])}catch(e){}}
function announce(s,prs){const n=S.prof.name||'Jemand',sets=s.ex.reduce((a,x)=>a+x.sets.length,0),cm=(s.cardio||[]).reduce((a,c)=>a+c.min,0);
 if(s.ex.length)tell(`${n} hat ${DAYS[s.day].n} trainiert`,`🏋️ ${sets} Sätze · ${fmt(Math.round(vol(s)))} kg bewegt${cm?` · ${cm} min Cardio`:''}${prs.length?` · ${prs.length} neue${prs.length>1?'':'r'} Bestwert${prs.length>1?'e':''}!`:''}\nDu bist dran 😉`);
 else if(cm)tell(`${n} war beim Cardio`,`🏃 ${cm} min ${(s.cardio[0]||{}).type||''}\nUnd du?`)}

/* ===================== ONBOARDING ===================== */
const profOK=()=>{const P=S.prof;return P.name&&P.year&&P.height&&(P.weight||lastWeight())};
let ob={step:0};
function renderOnboarding(){const P=S.prof,f=(k,l,ph,mode='decimal')=>`<div><label for="p_${k}">${l}</label><input id="p_${k}" inputmode="${mode}" data-p="${k}" placeholder="${ph}" value="${esc(P[k]??'')}"></div>`;
 return `<div class="sheet ob"><div class="sheetin"><h2>Willkommen im Sport Cockpit</h2>
 <p class="tip" style="padding:0 0 12px">Bevor es losgeht, brauchen wir ein paar Angaben. Daraus berechnet die App deinen Kalorienbedarf und dein Proteinziel. Alles kannst du später unter „Mehr“ ändern.</p>
 <div class="cform">${f('name','Dein Name','z. B. Michell','text')}<div><label>Geschlecht</label><div class="vars">${[['m','Mann'],['w','Frau']].map(([k,l])=>`<button data-ps="sex" data-v="${k}" aria-pressed="${P.sex===k}">${l}</button>`).join('')}</div></div>
 ${f('year','Geburtsjahr','z. B. 1990','numeric')}${f('height','Größe (cm)','z. B. 182','numeric')}${f('weight','Gewicht (kg)','z. B. 85')}
 <div class="full"><label>Dein Alltag</label><div class="vars">${[[1.4,'Büro, wenig Bewegung'],[1.55,'Büro + Training 3–4×'],[1.7,'Aktiv / Training 5–6×'],[1.85,'Körperlich harte Arbeit']].map(([v,l])=>`<button data-ps="act" data-v="${v}" aria-pressed="${P.act==v}">${l}</button>`).join('')}</div></div>
 <div class="full"><label>Dein Ziel</label><div class="vars">${[['aufbau','Muskeln aufbauen'],['halten','Gewicht halten'],['defi','Abnehmen / Definieren']].map(([k,l])=>`<button data-n="goal" data-v="${k}" aria-pressed="${S.nut.goal===k}">${l}</button>`).join('')}</div></div></div>
 <div class="calc" id="pcalc">${pcalc()}</div>
 <button class="primary" data-ob="go" style="width:100%">Los geht’s</button><p class="tip" id="obmsg" style="padding:8px 0 0"></p></div></div>`}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-ob]');if(!b)return;if(!profOK()){$('obmsg').textContent='Bitte Name, Geburtsjahr, Größe und Gewicht ausfüllen.';return}
 if(S.prof.weight&&!lastWeight()){ND(today()).w=S.prof.weight;ND(today()).t=Date.now()}S.metaT=Date.now();persist();render()});

/* ===================== START ===================== */
lsLoad();{const ld=lastDay();if(ld)day=DAYS[ld].nx}
if(location.hash==='#nut')view='nut';
render();note(HA.token?'Lokal · verbinde …':'Nur auf diesem Gerät – Home Assistant unter „Mehr“ einrichten');
syncNow();
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});

}
