/* Sport Cockpit – Startseite */
'use strict';
/* ===================== STARTSEITE ===================== */
function renderHome(){weeklyCheck();const d=today(),sc=dayScore(d),g=sc.g,t=sc.t,hr=new Date().getHours(),gr=hr<11?'Guten Morgen':hr<17?'Hallo':'Guten Abend';
 const ld=lastDay(),nx=ld?DAYS[ld].nx:'push',run=Object.entries(drafts).find(([k,dr])=>dr&&dr.ex&&Object.values(dr.ex).some(r=>r.some(x=>x.done)));
 const runSets=run?Object.values(run[1].ex).reduce((a,r)=>a+r.filter(x=>x.done).length,0):0;
 const dayW=(S.nut.days[d]||{}).w,water=(S.nut.days[d]||{}).water||0;
 const mon=wk(Date.now()),cnt=S.sessions.filter(s=>wk(s.date)===mon&&s.ex.length).length;
 const last=[...S.sessions].sort((a,b)=>b.date-a.date).slice(0,3);
 const pt=partners.filter(p=>p.name);
 return `${healthLink()}<section class="hero2"><div><p class="hk">${new Date().toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'long'})}</p><h2>${gr}, ${esc(S.prof.name)}</h2></div></section>
 ${boardHtml(sc)}
 ${sc.why.length?`<div class="chips">${sc.why.map(w=>`<span>${esc(w)}</span>`).join('')}</div>`:'<p class="tip" style="padding:0 0 12px">Noch keine Punkte heute: Trainieren, im Kalorienziel bleiben und Protein schaffen bringt am meisten.</p>'}
 ${shareInboxHtml()}${sayInboxHtml()}
 <section class="tiles">
  <button class="tile big" data-gym="1" data-d="${run?run[0]:nx}"><small>${run?'Training läuft':'Als Nächstes'}</small><b>${DAYS[run?run[0]:nx].n}</b><span>${run?runSets+' Sätze erledigt – weiter':DAYS[nx].sub}</span><em>${run?'Fortsetzen':'Training starten'} ›</em></button>
  </section>
 ${advHtml()}
 <section class="todaybox"><div class="tbh"><b>Heute</b><span>${sc.pt} Punkte</span></div>
 <button class="eatday" data-a="view" data-v="nut" aria-label="Essen heute, zum Essen-Tab"><div class="trow">
  <div><div class="tl"><span>Kalorien</span><span><b>${fmt(Math.round(t.kcal))}</b> / ${fmt(g.kcal)}</span></div>${rbar(t.kcal,g.kcal,'eat')}</div>
  <div><div class="tl"><span>Protein</span><span><b>${fmt(Math.round(t.p))}</b> / ${g.p} g</span></div>${rbar(t.p,g.p,'up')}</div></div>
  <div class="tf"><span>${g.kcal-t.kcal>=0?fmt(Math.round(g.kcal-t.kcal))+' kcal frei':fmt(Math.round(t.kcal-g.kcal))+' kcal drüber'}</span><em>Details ›</em></div></button>
 <div class="tmeals">${MEALS.map(([m,l])=>{const k=(S.nut.days[d]||{items:[]}).items.filter(i=>i.meal===m).reduce((a,i)=>a+i.kcal,0);return `<button data-h="meal" data-m="${m}"${m===mealNow()?' class="now"':''}><b>+ ${l}</b>${k?`<span>${fmt(k)} kcal</span>`:''}</button>`}).join('')}</div>
 ${goalsHtml()}
 ${afHtml()}
 ${chHtml()}
 </section>
 <section class="weekbox">${weeklyHtml()}</section>`}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-h]');if(!b)return;const a=b.dataset.h,d=today();
 if(a==='train'){day=b.dataset.d;view='train'}
 else if(a==='meal'){view='nut';nDate=d;sheet={meal:b.dataset.m,step:'search',q:'',focus:true}}
 else if(a==='w'){const w=num($('hW').value);if(w&&w>30&&w<300){ND(d).w=w;ND(d).wsrc='';touch(d)}else{note('Gewicht in kg eingeben');return}}
 else if(a==='water'){const dd=ND(d);dd.water=Math.max(0,(dd.water||0)+(+b.dataset.v));touch(d)}
 else if(a==='steps'){const v=num($('hSt').value);if(v==null||v<0||v>100000){note('Schritte als Zahl eingeben');return}ND(d).stm=Math.round(v);touch(d)}
 else if(a==='cardio'){day='cardio';view='train'}
 else if(a==='rec'){view='rec'}
 else return;render();if(a!=='w'&&a!=='water'&&a!=='steps')scrollTo({top:0})});

