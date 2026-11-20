/* Sport Cockpit – Startseite */
'use strict';
/* ===================== STARTSEITE ===================== */
function renderHome(){const d=today(),sc=dayScore(d),g=sc.g,t=sc.t,hr=new Date().getHours(),gr=hr<11?'Guten Morgen':hr<17?'Hallo':'Guten Abend';
 const ld=lastDay(),nx=ld?DAYS[ld].nx:'push',run=Object.entries(drafts).find(([k,dr])=>dr&&dr.ex&&Object.values(dr.ex).some(r=>r.some(x=>x.done)));
 const runSets=run?Object.values(run[1].ex).reduce((a,r)=>a+r.filter(x=>x.done).length,0):0;
 const dayW=(S.nut.days[d]||{}).w,water=(S.nut.days[d]||{}).water||0;
 const mon=wk(Date.now()),cnt=S.sessions.filter(s=>wk(s.date)===mon&&s.ex.length).length;
 const last=[...S.sessions].sort((a,b)=>b.date-a.date).slice(0,3);
 const pt=partners.filter(p=>p.name);
 return `${healthLink()}<section class="hero2"><div><p class="hk">${new Date().toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'long'})}</p><h2>${gr}, ${esc(S.prof.name)}</h2></div>
 <div class="pts"><b class="cond">${sc.pt}</b><span>Punkte heute</span><small>Woche ${weekScore()}</small></div></section>
 ${sc.why.length?`<div class="chips">${sc.why.map(w=>`<span>${esc(w)}</span>`).join('')}</div>`:'<p class="tip" style="padding:0 0 12px">Noch keine Punkte heute: Trainieren, im Kalorienziel bleiben und Protein schaffen bringt am meisten.</p>'}
 <section class="tiles">
  <button class="tile big" data-gym="1" data-d="${run?run[0]:nx}"><small>${run?'Training läuft':'Als Nächstes'}</small><b>${DAYS[run?run[0]:nx].n}</b><span>${run?runSets+' Sätze erledigt – weiter':DAYS[nx].sub}</span><em>${run?'Fortsetzen':'Training starten'} ›</em></button>
  <div class="tile"><small>Kalorien</small><b>${fmt(Math.round(t.kcal))}</b><span>von ${fmt(g.kcal)} kcal</span><i><s style="width:${Math.min(t.kcal/g.kcal,1)*100}%"></s></i></div>
  <div class="tile"><small>Protein</small><b>${fmt(Math.round(t.p))} g</b><span>von ${g.p} g</span><i><s style="width:${Math.min(t.p/g.p,1)*100}%"></s></i></div>
 </section>
 ${coachHtml(3)}
 <h3 class="sh">Essen eintragen</h3><div class="quick">${MEALS.map(([m,l])=>{const k=(S.nut.days[d]||{items:[]}).items.filter(i=>i.meal===m).reduce((a,i)=>a+i.kcal,0);return `<button data-h="meal" data-m="${m}"><b>${l}</b><span>${k?fmt(k)+' kcal':'+ eintragen'}</span></button>`}).join('')}</div>
 <h3 class="sh">Schnell erledigt</h3><div class="quick q2">
  <div class="qw"><b>Gewicht</b><div class="wrow" style="margin:6px 0 0"><input id="hW" inputmode="decimal" placeholder="${lastWeight()?fmt(lastWeight()):'kg'}" value="${dayW?fmt(dayW):''}" aria-label="Gewicht"><button data-h="w">${dayW?'✓':'Speichern'}</button></div></div>
  <div class="qw"><b>Wasser ${fmt(water/1000)} l</b><div class="wrow" style="margin:6px 0 0"><button data-h="water" data-v="250">+ Glas</button><button data-h="water" data-v="500">+ Flasche</button></div></div>
  <button data-h="cardio"><b>Cardio</b><span>${sc.c?sc.c+' min heute':'+ eintragen'}</span></button>
  <button data-h="rec"><b>Kraft & Muskeln</b><span>Kurven, Muskel-Karte</span></button><button data-a="view" data-v="review"><b>Rückblick</b><span>Woche & Monat teilen</span></button><button data-gym="1" data-d="${nx}"><b>Gym Mode</b><span>Übung für Übung, Vollbild</span></button></div>
 <h3 class="sh">Diese Woche · ${cnt} / ${S.goal} Krafteinheiten</h3><div class="week hw">${$('week')?$('week').innerHTML:''}</div>
 ${pt.length?`<h3 class="sh">Challenge</h3>${pt.map(p=>`<div class="pcard"><b>${esc(p.name)}</b><span>${p.d===d?`${p.pt||0} Punkte heute${p.tr?' · '+esc(p.tr)+' trainiert':''} · Woche ${p.wp||0}`:'heute noch nichts eingetragen'}</span><em>${p.d===d?(sc.pt>=(p.pt||0)?'Du führst':'Du liegst hinten'):''}</em></div>`).join('')}`:''}
 ${last.length?`<h3 class="sh">Zuletzt</h3>${last.map(s=>`<button class="frow" data-a="view" data-v="hist"><div><b>${s.ex.length?DAYS[s.day].n:'Cardio'} · ${dstr(s.date)}</b><small>${s.ex.length?s.ex.reduce((a,x)=>a+x.sets.length,0)+' Sätze · '+fmt(Math.round(vol(s)))+' kg':''}${(s.cardio||[]).length?' '+s.cardio.reduce((a,c)=>a+c.min,0)+' min Cardio':''}</small></div><span>›</span></button>`).join('')}<div class="actions"><button class="ghost" data-a="view" data-v="hist">Ganzer Verlauf</button></div>`:''}`}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-h]');if(!b)return;const a=b.dataset.h,d=today();
 if(a==='train'){day=b.dataset.d;view='train'}
 else if(a==='meal'){view='nut';nDate=d;sheet={meal:b.dataset.m,step:'search',q:'',focus:true}}
 else if(a==='w'){const w=num($('hW').value);if(w&&w>30&&w<300){ND(d).w=w;ND(d).wsrc='';touch(d)}else{note('Gewicht in kg eingeben');return}}
 else if(a==='water'){const dd=ND(d);dd.water=(dd.water||0)+(+b.dataset.v);touch(d)}
 else if(a==='cardio'){day='cardio';view='train'}
 else if(a==='rec'){view='rec'}
 else return;render();if(a!=='w'&&a!=='water')scrollTo({top:0})});

