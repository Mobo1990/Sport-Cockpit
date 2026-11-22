/* Sport Cockpit – Stammdaten: Übungen, Piktogramme, Lebensmittel, Standardplan */
'use strict';
/* Richtwerte pro 100 g: Name, kcal, Protein, Kohlenhydrate, Fett, [Portion-Label, Gramm] */
/* Zucker g pro 100 g (Richtwerte) */
const SUGAR={"Haferflocken": 1, "Skyr natur": 4, "Magerquark": 4, "Speisequark 20 %": 3.5, "Griechischer Joghurt 10 %": 4, "Naturjoghurt 1,5 %": 4.5, "Hüttenkäse": 2.6, "Milch 1,5 %": 4.9, "Milch 3,5 %": 4.8, "Hafermilch": 4, "Whey Protein Pulver": 5, "Casein Pulver": 3, "Proteinriegel": 4, "Ei (M)": 0.7, "Eiklar": 0.7, "Kochschinken": 1, "Putenaufschnitt": 1, "Salami": 1, "Tofu natur": 0.5, "Reis gekocht": 0.1, "Reis roh": 0.3, "Basmatireis roh": 0.3, "Nudeln roh": 3, "Nudeln gekocht": 0.6, "Vollkornnudeln roh": 3, "Kartoffeln": 0.8, "Süßkartoffel": 4.2, "Couscous roh": 0.5, "Quinoa roh": 1, "Gnocchi": 1, "Vollkornbrot": 3, "Toastbrot": 5, "Brötchen": 3, "Laugenbrezel": 2, "Reiswaffeln": 0.5, "Wrap Tortilla": 3, "Knäckebrot": 2, "Banane": 17, "Apfel": 10, "Beeren gemischt TK": 6, "Heidelbeeren": 10, "Orange": 9, "Weintrauben": 16, "Mango": 14, "Ananas": 10, "Datteln": 63, "Brokkoli": 1.7, "Spinat": 0.4, "Paprika": 4, "Tomate": 2.6, "Gurke": 1.7, "Möhren": 4.7, "Zucchini": 2.5, "Champignons": 0.6, "Salat gemischt": 1.5, "Erbsen TK": 4, "Mais Dose": 5, "Kidneybohnen Dose": 1, "Kichererbsen Dose": 0.5, "Linsen rot roh": 2, "Avocado": 0.7, "Butter": 0.6, "Erdnussbutter": 6, "Mandeln": 4.4, "Walnüsse": 2.6, "Cashews": 6, "Mozzarella light": 1, "Feta": 0.5, "Frischkäse light": 4, "Honig": 80, "Marmelade": 58, "Zucker": 100, "Dunkle Schokolade 70 %": 24, "Vollmilchschokolade": 55, "Gummibärchen": 46, "Chips": 0.5, "Eis Vanille": 22, "Pizza Margherita": 3, "Döner": 3, "Burger": 5, "Pommes": 0.5, "Sushi": 6, "Lasagne": 3, "Currywurst": 7, "Cola": 10.6, "Orangensaft": 9, "Bier": 0.3, "Alkoholfreies Bier": 4, "Wein rot": 0.6, "Cappuccino": 3.3, "Latte Macchiato": 4.5, "Proteinshake fertig": 2};
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
].map(([n,k,p,c,f,por],i)=>({id:'b'+i,name:n,kcal:k,p,c,f,z:(SUGAR[n]||0),por:por?{l:por[0],g:por[1]}:null,src:'base'}));


const DAYS={push:{n:'Push',sub:'Brust · Schultern · Trizeps',nx:'pull'},pull:{n:'Pull',sub:'Rücken · Bizeps · hintere Schulter',nx:'legs'},legs:{n:'Legs',sub:'Beine · Po · Waden',nx:'push'},cardio:{n:'Cardio',sub:'Ausdauer · Herz · Fettstoffwechsel',nx:null}};
const CT=['Walking Pad · 7 % Steigung','Laufband','Laufen draußen','Fahrrad / Ergometer','Crosstrainer','Rudergerät','Stepper / Treppe','Schwimmen','Seilspringen'];
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

/* Startgewichte fürs erste Mal (Männer, leichter Einstieg). Frauen: 60 %, Hilfe bei assistierten Übungen höher.
   Kurzhantel = pro Hand. Danach übernimmt die doppelte Progression aus dem eigenen Verlauf. */
const START_KG={bank:{'Langhantel':40,'Kurzhantel':16,'Multipresse':30,'Maschine':30},schraeg:{'Kurzhantel':14,'Langhantel':30,'Multipresse':25,'Maschine':25},
 fly:{'Kabelzug':10,'Butterfly-Maschine':30,'Kurzhantel':8},schulter:{'Kurzhantel':12,'Langhantel':25,'Maschine':20},seit:{'Kurzhantel':6,'Kabelzug':5,'Maschine':15},
 dips:{'Barren':0,'Assistiert':30,'Maschine':40},trizeps:{'Kabelzug Seil':15,'Kabelzug Stange':20,'Kurzhantel über Kopf':12},klimm:{'Körpergewicht + Zusatz':0,'Assistiert':30},
 rudern:{'Langhantel':40,'Kurzhantel einarmig':18,'Kabelzug sitzend':40,'Maschine':40},latzug:{'Enger Griff':40,'Breiter Griff':40},face:{'Kabelzug Seil':12,'Band':0},
 revfly:{'Maschine':20,'Kabelzug':5,'Kurzhantel':5},curl:{'Langhantel':20,'SZ-Stange':20,'Kurzhantel':10,'Kabelzug':15},hammer:{'Kurzhantel':10,'Kabelzug Seil':15},
 squat:{'Langhantel':40,'Multipresse':40,'Goblet Kurzhantel':16},rdl:{'Langhantel':40,'Kurzhantel':16},kreuz:{'Langhantel':60,'Trap Bar':60},
 presse:{'45° Maschine':80,'Horizontal':60},beuger:{'Liegend':25,'Sitzend':25},strecker:{'Maschine':30},ausfall:{'Kurzhantel':10,'Langhantel':30,'Multipresse':30},
 waden:{'Stehend Maschine':40,'Sitzend':30,'An der Beinpresse':80}};
function startKg(e){const t=START_KG[e.id];if(!t)return null;const v=t[e.v]??Object.values(t)[0];if(!v)return v===0?0:null;
 const w=(typeof S!=='undefined'&&S.prof&&S.prof.sex==='w'),st=e.step||2.5;let kg=isA(e.v)?(w?v*1.5:v):(w?v*0.6:v);
 kg=Math.round(kg/st)*st;if(!isA(e.v)){if(/^Langhantel|SZ-Stange/.test(e.v))kg=Math.max(kg,/SZ/.test(e.v)?10:20);if(/Kurzhantel/.test(e.v))kg=Math.max(kg,2)}return kg}
