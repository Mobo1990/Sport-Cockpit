/* Sport Cockpit – Punkte, Partner-Meldungen, Tageswerte für HA */
'use strict';
/* ===================== PUNKTE & PARTNER ===================== */
const slugN=n=>String(n||'').toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
function dayScore(d){const g=goals(d),t=totals(d),day=S.nut.days[d]||{},ss=S.sessions.filter(s=>iso(s.date)===d);let pt=0;const why=[];
 const tr=ss.find(s=>s.ex.length);if(tr){pt+=30;why.push('Training +30')}
 const c=ss.reduce((a,s)=>a+(s.cardio||[]).reduce((b,x)=>b+x.min,0),0),hh=day.h||{};if(c>=20){pt+=15;why.push('Cardio +15')}else if((hh.tm||0)>=30){pt+=15;why.push('Bewegung (Watch) +15')}
 if((hh.st||0)>=10000){pt+=10;why.push('10.000 Schritte +10')}
 if(t.kcal>0){if(t.p>=g.p){pt+=20;why.push('Protein +20')}else if(t.p>=g.p*.9){pt+=10;why.push('Protein fast +10')}
  const dev=Math.abs(t.kcal-g.kcal)/g.kcal;if(dev<=.1){pt+=20;why.push('Kalorien im Ziel +20')}else if(dev<=.2){pt+=10;why.push('Kalorien nah dran +10')}}
 if(day.w){pt+=5;why.push('Gewogen +5')}if((day.water||0)>=2000){pt+=5;why.push('2 l Wasser +5')}
 const prn=ss.reduce((a,s)=>a+(s.prn||0),0);if(prn){pt+=10*prn;why.push(prn+'× Bestwert +'+10*prn)}
 return{pt,why,g,t,c,tr:tr?DAYS[tr.day].n:''}}
function weekScore(){const m=new Date(wk(Date.now()));let sum=0;for(let i=0;i<7;i++){const d=new Date(m);d.setDate(d.getDate()+i);if(d>new Date())break;sum+=dayScore(iso(d)).pt}return sum}
const SC_URL='shortcuts://run-shortcut?name='+encodeURIComponent('Cockpit Health');
function healthLink(){if(!HA.token)return '';const age=S.hT?Date.now()-S.hT:Infinity;const stale=age>3600e3;
 return `<a class="hlink${stale?' stale':''}" href="${SC_URL}" data-hl="1">↻ Apple Health ${stale?'aktualisieren':'· vor '+Math.max(1,Math.round(age/60000))+' min geholt'}</a>`}
function scoreLine(){const s=dayScore(today());return healthLink()+`<p class="nline" data-a="view" data-v="nut">Heute <b>${s.pt} Punkte</b> · Woche <b>${weekScore()}</b>${s.why.length?' · '+s.why.join(', '):' · Trainiere, iss im Ziel und trink genug, um Punkte zu sammeln'}</p>`}
let lastPub='';
async function publish(){if(!HA.token||!S.prof.name)return;const d=today(),s=dayScore(d);
 const v=JSON.stringify({d,k:Math.round(s.t.kcal),kz:s.g.kcal,p:Math.round(s.t.p),pz:s.g.p,tr:s.tr,c:Math.round(s.c),pt:s.pt,wp:weekScore()});if(v===lastPub)return;
 try{const r=await haCall([{type:'call_service',domain:'input_text',service:'set_value',service_data:{entity_id:'input_text.sport_cockpit_'+slugN(S.prof.name),value:v.slice(0,255)}}]);if(r[0]&&r[0].success)lastPub=v}catch(e){}
 const dd=S.nut.days[d];if(dd&&s.t.p>=s.g.p&&!dd.pg){dd.pg=1;touch(d);tell('Proteinziel geschafft','💪 '+S.prof.name+' hat heute '+Math.round(s.t.p)+' g Protein gegessen.')}}
async function tell(titel,nachricht){if(!HA.token||!S.prof.name)return;try{await haCall([{type:'call_service',domain:'script',service:'sport_cockpit_meldung',service_data:{von:S.prof.name,titel,nachricht}}])}catch(e){}}
function announce(s,prs){const n=S.prof.name||'Jemand',sets=s.ex.reduce((a,x)=>a+x.sets.length,0),cm=(s.cardio||[]).reduce((a,c)=>a+c.min,0);
 if(s.ex.length)tell(`${n} hat ${DAYS[s.day].n} trainiert`,`🏋️ ${sets} Sätze · ${fmt(Math.round(vol(s)))} kg bewegt${cm?` · ${cm} min Cardio`:''}${prs.length?` · ${prs.length} neue${prs.length>1?'':'r'} Bestwert${prs.length>1?'e':''}!`:''}\nDu bist dran 😉`);
 else if(cm)tell(`${n} war beim Cardio`,`🏃 ${cm} min ${(s.cardio[0]||{}).type||''}\nUnd du?`)}

