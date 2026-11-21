/* Sport Cockpit – Belohnungen: gemeinsames Paar-Konto, Belohnungen vorschlagen/zustimmen, gemeinsam einlösen.
   Kontostand = Punkte beider (gesamt) – eingelöste Belohnungen. Liste liegt in der HA-Liste todo.sport_cockpit_geteiltes_essen
   als {kind:'reward', id, name, cost, by, ok:[…], st:'proposed'|'active'|'redeem'|'done', rq, at}. */
'use strict';
let REW=[];try{REW=JSON.parse(localStorage.getItem('sc.rew'))||[]}catch(e){}
const RW_IDEAS=[['Burger-Abend',1700],['Kino mit Popcorn',2400],['Essen gehen',3200],['Beauty-Tag zu Hause',4500],['Neue Sport-Klamotten',6000]];
let rwForm=null;
/* Gesamtpunkte (alle Tage mit Einträgen) */
function myTotal(){const ds=new Set([...Object.keys(S.nut.days),...S.sessions.map(s=>iso(s.date))]),t=today();let sum=0;for(const d of ds)if(d<=t)sum+=dayScore(d).pt;return sum}
function rwPartner(){const p=(typeof partners!=='undefined'?partners:[]).find(x=>x.name);return p?{name:p.name,tp:+p.tp||0}:null}
function rwBalance(){const p=rwPartner(),spent=REW.filter(r=>r.st==='done').reduce((a,r)=>a+(+r.cost||0),0);return{me:myTotal(),pa:p?p.tp:0,spent,bal:myTotal()+(p?p.tp:0)-spent}}
const meSlug=()=>slugN(S.prof.name||'');
/* aus der HA-Liste lesen (von shareFetch aufgerufen) */
function rewardsFrom(items){const l=[];for(const it of items){let j;try{j=JSON.parse(it.description||'')}catch(e){continue}if(j.kind==='reward'&&j.id)l.push({...j,uid:it.uid})}
 const ch=JSON.stringify(l)!==JSON.stringify(REW);if(ch){REW=l;try{localStorage.setItem('sc.rew',JSON.stringify(REW))}catch(e){}}return ch}
async function rwSave(r){const {uid,...data}=r;const cmds=[];if(uid)cmds.push({type:'call_service',domain:'todo',service:'remove_item',target:{entity_id:SHARE_E},service_data:{item:uid}});
 if(data.st!=='gone')cmds.push({type:'call_service',domain:'todo',service:'add_item',target:{entity_id:SHARE_E},service_data:{item:`Belohnung: ${data.name}`,description:JSON.stringify({v:1,kind:'reward',...data})}});
 try{await haCall(cmds)}catch(e){note('Home Assistant nicht erreichbar');return}await shareFetch();render()}
const rwName=s=>{const p=rwPartner();return s===meSlug()?(S.prof.name||'Ich'):(p&&slugN(p.name)===s?p.name:s)};
/* Karten, die eine Antwort brauchen (Startseite oben) */
function rwInboxHtml(){const me=meSlug();return REW.filter(r=>(r.st==='proposed'&&!(r.ok||[]).includes(me))||(r.st==='redeem'&&r.rq!==me)).map(r=>{const red=r.st==='redeem';
 return `<section class="shin rwin"><b>${esc(rwName(red?r.rq:r.by))} ${red?'möchte einlösen':'schlägt eine Belohnung vor'}: ${esc(r.name)}</b><p>${fmt(r.cost)} Punkte aus dem Paar-Konto${red?' – sobald du zustimmst, wird abgebucht.':'.'}</p>
 <div class="shbtn"><button class="primary" data-rw="${red?'confirm':'approve'}" data-id="${r.id}">${red?'Einlösen zustimmen':'Zustimmen'}</button><button class="ghost" data-rw="${red?'later':'reject'}" data-id="${r.id}">${red?'Später':'Ablehnen'}</button></div></section>`}).join('')}
/* Zeile in der Woche-Karte */
function rwLineHtml(){if(!HA.token)return '';const b=rwBalance(),next=REW.filter(r=>r.st==='active').sort((a,c)=>a.cost-c.cost)[0];
 return `<button class="rwline" data-a="view" data-v="rew"><div><span>Paar-Konto</span><b class="cond">${fmt(b.bal)}</b>${next?`<small>→ ${esc(next.name)} · ${fmt(next.cost)}</small>`:'<small>Belohnungen festlegen ›</small>'}</div>${next?`<i><s style="width:${Math.min(b.bal/next.cost,1)*100}%"></s></i>`:''}</button>`}
function renderRewards(){const b=rwBalance(),p=rwPartner(),me=meSlug(),act=REW.filter(r=>r.st==='active'||r.st==='redeem').sort((a,c)=>a.cost-c.cost),prop=REW.filter(r=>r.st==='proposed'),done=REW.filter(r=>r.st==='done').sort((a,c)=>(c.at||'').localeCompare(a.at||''));
 if(!HA.token)return `<section class="meal"><header><h3>Belohnungen</h3></header><p class="tip" style="padding:0">Belohnungen funktionieren zu zweit über Home Assistant. Verbinde die App unter „Mehr → Home Assistant“.</p></section>`;
 return `<button class="back" data-a="view" data-v="home">‹ Start</button><h2 class="rwh">Belohnungen</h2>
 <section class="rwacc"><span>Paar-Konto</span><b class="cond">${fmt(b.bal)}</b><small>${esc(S.prof.name||'Ich')} ${fmt(b.me)} · ${p?esc(p.name)+' '+fmt(b.pa):'Partner noch nicht verbunden'} · eingelöst ${fmt(b.spent)}</small></section>
 ${rwInboxHtml()}
 <section class="meal"><header><h3>Gemeinsame Belohnungen</h3></header>
 ${act.length?act.map(r=>{const can=b.bal>=r.cost,waiting=r.st==='redeem';return `<div class="rwrow"><div><b>${esc(r.name)}</b><small>${waiting?(r.rq===me?`Wartet auf ${esc(p?p.name:'Partner')}`:'Wartet auf dich'):can?'Bereit zum Einlösen':`Noch ${fmt(r.cost-b.bal)} Punkte`}</small><i><s style="width:${Math.min(b.bal/r.cost,1)*100}%"></s></i></div><em>${fmt(r.cost)}</em>${!waiting&&can?`<button class="primary" data-rw="redeem" data-id="${r.id}">Einlösen</button>`:''}</div>`}).join(''):'<p class="tip" style="padding:0">Noch keine Belohnungen. Schlagt welche vor – sie gelten, sobald der andere zustimmt.</p>'}
 ${prop.length?`<h4>Vorgeschlagen</h4>${prop.map(r=>`<div class="rwrow muted"><div><b>${esc(r.name)}</b><small>von ${esc(rwName(r.by))} · ${(r.ok||[]).includes(me)?`wartet auf ${esc(p?p.name:'Partner')}`:'wartet auf dich'}</small></div><em>${fmt(r.cost)}</em>${r.by===me?`<button class="ghost" data-rw="reject" data-id="${r.id}">Zurückziehen</button>`:''}</div>`).join('')}`:''}
 ${rwForm?`<div class="rwform"><input id="rwN" placeholder="z. B. Kino mit Popcorn" value="${esc(rwForm.n||'')}" aria-label="Belohnung"><input id="rwC" inputmode="numeric" placeholder="Punkte" value="${esc(rwForm.c||'')}" aria-label="Punkte"><button class="primary" data-rw="send">Vorschlagen</button></div>
   <div class="vars rwideas">${RW_IDEAS.map(([n,c])=>`<button data-rw="idea" data-n="${esc(n)}" data-c="${c}">${esc(n)} · ${fmt(c)}</button>`).join('')}</div><p class="tip" style="padding:4px 0 0">Keine Reisen. Grob: ${fmt(Math.max(1000,Math.round((b.me+b.pa)/Math.max(1,(Date.now()-Math.min(...Object.keys(S.nut.days).map(k=>Date.parse(k)),Date.now()))/864e5+1)*14/100)*100))} Punkte ≈ 2 Wochen für euch beide.</p>`
   :`<button class="ghost" data-rw="new" style="width:100%;margin-top:8px">+ Belohnung vorschlagen</button>`}</section>
 ${done.length?`<section class="meal"><header><h3>Eingelöst</h3></header>${done.map(r=>`<div class="rwrow muted"><div><b>${esc(r.name)}</b><small>${r.at?new Date(r.at+'T12:00').toLocaleDateString('de-DE',{day:'numeric',month:'long'}):''}</small></div><em>−${fmt(r.cost)}</em></div>`).join('')}</section>`:''}`}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-rw]');if(!b)return;const a=b.dataset.rw,r=REW.find(x=>x.id===b.dataset.id),me=meSlug(),p=rwPartner();
 if(a==='new'){rwForm={};render();return}
 if(a==='idea'){rwForm={n:b.dataset.n,c:b.dataset.c};render();return}
 if(a==='send'){const n=($('rwN').value||'').trim(),c=Math.round(num($('rwC').value)||0);if(!n||c<100){note('Name und mindestens 100 Punkte angeben');return}
  rwForm=null;rwSave({id:'r'+Date.now().toString(36),name:n.slice(0,60),cost:c,by:me,ok:[me],st:'proposed'});tell(`${S.prof.name} schlägt eine Belohnung vor`,`„${n}“ für ${fmt(c)} Punkte – in der App zustimmen.`);return}
 if(!r)return;
 if(a==='approve'){rwSave({...r,ok:[...new Set([...(r.ok||[]),me])],st:'active'});tell(`${S.prof.name} hat zugestimmt`,`„${r.name}“ steht jetzt in eurer Belohnungsliste.`)}
 else if(a==='reject'){rwSave({...r,st:'gone'})}
 else if(a==='redeem'){if(rwBalance().bal<r.cost){note('Noch nicht genug Punkte');return}rwSave({...r,st:'redeem',rq:me});tell(`${S.prof.name} möchte einlösen`,`„${r.name}“ (${fmt(r.cost)} Punkte) – bitte in der App zustimmen.`)}
 else if(a==='confirm'){rwSave({...r,st:'done',at:today()});toast('Eingelöst!',`${r.name} – viel Spaß euch beiden`);tell(`${S.prof.name} hat zugestimmt: ${r.name}`,`Eingelöst – viel Spaß euch beiden!`)}
 else if(a==='later'){rwSave({...r,st:'active',rq:''})}});
document.addEventListener('input',ev=>{if(!rwForm)return;if(ev.target.id==='rwN')rwForm.n=ev.target.value;if(ev.target.id==='rwC')rwForm.c=ev.target.value});
