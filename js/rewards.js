/* Sport Cockpit – Belohnungen: gemeinsames Paar-Konto, Belohnungen vorschlagen/zustimmen, gemeinsam einlösen.
   Kontostand = Punkte beider (gesamt) – eingelöste Belohnungen. Liste liegt in der HA-Liste todo.sport_cockpit_geteiltes_essen
   als {kind:'reward', id, name, cost, by, ok:[…], st:'proposed'|'active'|'redeem'|'done', rq, at}. */
'use strict';
let REW=[];try{REW=JSON.parse(localStorage.getItem('sc.rew'))||[]}catch(e){}
const RW_IDEAS=[['Burger-Abend',1700],['Kino mit Popcorn',2400],['Essen gehen',3200],['Beauty-Tag zu Hause',4500]];
let rwForm=null;
/* Symbole je Belohnung (Linien-SVG, nach Stichwort im Namen) */
const RW_IC={
 ice:'<path d="M8 11l4 10 4-10"/><path d="M7 11a5 5 0 0 1 10 0z"/><path d="M10 6.5a2 2 0 0 1 4 0"/>',
 burger:'<path d="M4 10a8 5 0 0 1 16 0z"/><path d="M3 13.5h18"/><path d="M5 16.5h14v.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/>',
 moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/><path d="M15 4h3l-3 3h3"/>',
 cup:'<path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8 3.5v2.5M12 3.5v2.5"/>',
 nophone:'<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/><path d="M4 4l16 16"/>',
 waffle:'<rect x="4.5" y="4.5" width="15" height="15" rx="4"/><path d="M9.5 4.5v15M14.5 4.5v15M4.5 9.5h15M4.5 14.5h15"/>',
 pad:'<path d="M7 8h10a4 4 0 0 1 4 4v1.5a2.8 2.8 0 0 1-5 1.7L14.5 13h-5L8 15.2a2.8 2.8 0 0 1-5-1.7V12a4 4 0 0 1 4-4z"/><path d="M7.5 10.2v3.6M5.7 12h3.6"/><path d="M15.5 11h.01M17.5 13h.01"/>',
 heart:'<path d="M12 20s-7.5-4.5-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.5 12 20 12 20z"/>',
 pizza:'<path d="M3 6c6-3 12-3 18 0L12 21z"/><path d="M5 9.5c4.7-2 9.3-2 14 0"/><path d="M10 12h.01M14 13.5h.01M12 16.5h.01"/>',
 popcorn:'<path d="M5.5 10h13l-2 11h-9z"/><path d="M10 10l.4 11M14 10l-.4 11"/><path d="M5.5 10a2.2 2.2 0 0 1 3-3 3 3 0 0 1 7 0 2.2 2.2 0 0 1 3 3"/>',
 brunch:'<path d="M3 18h18"/><path d="M5 18a7 7 0 0 1 14 0"/><path d="M12 9V7.5M10.5 7.5h3"/>',
 sushi:'<ellipse cx="12" cy="9" rx="7" ry="3"/><path d="M5 9v6c0 1.7 3.1 3 7 3s7-1.3 7-3V9"/><ellipse cx="12" cy="9" rx="2.5" ry="1"/>',
 sparkle:'<path d="M11 4l1.8 5.2L18 11l-5.2 1.8L11 18l-1.8-5.2L4 11l5.2-1.8z"/><path d="M19 3v4M17 5h4"/>',
 glass:'<path d="M8 3h8l-.6 5.5a3.4 3.4 0 0 1-6.8 0z"/><path d="M12 12v8M8.5 20h7"/>',
 gift:'<path d="M4 11h16v9H4z"/><path d="M3 7h18v4H3zM12 7v13"/><path d="M12 7c-2-3-6-3-6 0M12 7c2-3 6-3 6 0"/>'};
const RW_KEYS=[[/mcflurry|eis\b|eisbecher/,'ice'],[/mc ?donald|burger|pommes|menü/,'burger'],[/schlaf/,'moon'],[/frühstück|kaffee/,'cup'],[/handy/,'nophone'],[/waffel|pancake|crêpe/,'waffle'],[/playstation|zock|konsole|spieleabend/,'pad'],[/massage|kuschel/,'heart'],[/pizza/,'pizza'],[/kino|film|popcorn|serie/,'popcorn'],[/brunch/,'brunch'],[/sushi/,'sushi'],[/beauty|wellness|spa\b|nägel/,'sparkle'],[/essen gehen|restaurant|dinner|wein/,'glass']];
const RW_TONES=['latte','rose','sage'];
/* Kategorien nach Punkten */
const RW_TIERS=[{max:300,t:'Kleine Freuden',r:'bis 300 Punkte'},{max:600,t:'Gönn-Abende',r:'301 – 600 Punkte'},{max:Infinity,t:'Große Wünsche',r:'ab 601 Punkte'}];
function rwIcon(name){const n=String(name||'').toLowerCase(),k=(RW_KEYS.find(([re])=>re.test(n))||[0,'gift'])[1];return `<svg viewBox="0 0 24 24" aria-hidden="true">${RW_IC[k]}</svg>`}

/* Gesamtpunkte (alle Tage mit Einträgen) */
function myTotal(){const ds=new Set([...Object.keys(S.nut.days),...S.sessions.map(s=>iso(s.date))]),t=today();let sum=0;for(const d of ds)if(d<=t)sum+=dayScore(d).pt;return sum}
function rwPartner(){const p=(typeof partners!=='undefined'?partners:[]).find(x=>x.name);return p?{name:p.name,tp:+p.tp||0}:null}
/* Belohnungen sind mehrfach einlösbar: n = Anzahl Einlösungen (alte 'done'-Einträge zählen als 1) */
const rwN=r=>+r.n||(r.st==='done'?1:0);
function rwBalance(){const p=rwPartner(),spent=REW.filter(r=>r.st!=='gone').reduce((a,r)=>a+(+r.cost||0)*rwN(r),0);return{me:myTotal(),pa:p?p.tp:0,spent,bal:myTotal()+(p?p.tp:0)-spent}}
const meSlug=()=>slugN(S.prof.name||'');
/* aus der HA-Liste lesen (von shareFetch aufgerufen) */
function rewardsFrom(items){const l=[];for(const it of items){let j;try{j=JSON.parse(it.description||'')}catch(e){continue}if(j.kind==='reward'&&j.id)l.push({...j,uid:it.uid})}
 const ch=JSON.stringify(l)!==JSON.stringify(REW);if(ch){REW=l;try{localStorage.setItem('sc.rew',JSON.stringify(REW))}catch(e){}}return ch}
async function rwSave(r){const {uid,...data}=r;const cmds=[];if(uid)cmds.push({type:'call_service',domain:'todo',service:'remove_item',target:{entity_id:SHARE_E},service_data:{item:uid}});
 if(data.st!=='gone')cmds.push({type:'call_service',domain:'todo',service:'add_item',target:{entity_id:SHARE_E},service_data:{item:`Belohnung: ${data.name}`,description:JSON.stringify({v:1,kind:'reward',...data})}});
 try{await haCall(cmds)}catch(e){note('Home Assistant nicht erreichbar');return}await shareFetch();render()}
const rwName=s=>{const p=rwPartner();return s===meSlug()?(S.prof.name||'Ich'):(p&&slugN(p.name)===s?p.name:s)};
/* Anzahl offener Antworten (Punkt am Shop-Tab) */
function rwOpen(){const me=meSlug();return REW.filter(r=>(r.st==='proposed'&&!(r.ok||[]).includes(me))||(r.st==='redeem'&&r.rq!==me)).length}
/* Karten, die eine Antwort brauchen (Startseite oben) */
function rwInboxHtml(){const me=meSlug();return REW.filter(r=>(r.st==='proposed'&&!(r.ok||[]).includes(me))||(r.st==='redeem'&&r.rq!==me)).map(r=>{const red=r.st==='redeem';
 return `<section class="shin rwin"><span class="rwic sm">${rwIcon(r.name)}</span><b>${esc(rwName(red?r.rq:r.by))} ${red?'möchte einlösen':'schlägt eine Belohnung vor'}: ${esc(r.name)}</b><p>${fmt(r.cost)} Punkte aus dem Paar-Konto${red?' – sobald du zustimmst, wird abgebucht.':'.'}</p>
 <div class="shbtn"><button class="primary" data-rw="${red?'confirm':'approve'}" data-id="${r.id}">${red?'Einlösen zustimmen':'Zustimmen'}</button><button class="ghost" data-rw="${red?'later':'reject'}" data-id="${r.id}">${red?'Später':'Ablehnen'}</button></div></section>`}).join('')}
/* Zeile in der Woche-Karte */
function rwLineHtml(){if(!HA.token)return '';const b=rwBalance(),next=REW.filter(r=>r.st==='active').sort((a,c)=>a.cost-c.cost)[0];
 return `<button class="rwline" data-a="view" data-v="rew"><div><span>Paar-Konto</span><b class="cond">${fmt(b.bal)}</b>${next?`<small>→ ${esc(next.name)} · ${fmt(next.cost)}</small>`:'<small>Belohnungen festlegen ›</small>'}</div>${next?`<i><s style="width:${Math.min(b.bal/next.cost,1)*100}%"></s></i>`:''}</button>`}
/* Gemeinsames Konto: beide Profilbilder, Summe, Anteile */
function rwAccHtml(b,p){const me=S.prof.name||'Ich',tot=Math.max(1,b.me+b.pa),sm=b.me/tot*100;
 return `<section class="rwacc"><div class="rwduo">${avaHtml(me,true)}${p?avaHtml(p.name,false):''}</div><span>Unser Punktekonto · alle Punkte seit Start</span><b class="cond">${fmt(b.bal)}</b>
 ${p?`<div class="rwsplit"><i style="width:${sm.toFixed(1)}%"></i><s></s></div><div class="rwwho"><span><i class="dot me"></i>${esc(me)} ${fmt(b.me)}</span><span><i class="dot pa"></i>${esc(p.name)} ${fmt(b.pa)}</span></div>`:'<small>Partner noch nicht verbunden</small>'}
 ${b.spent?`<small>Schon eingelöst: ${fmt(b.spent)} Punkte</small>`:''}</section>`}
function renderRewards(){const b=rwBalance(),p=rwPartner(),me=meSlug(),act=REW.filter(r=>r.st==='active'||r.st==='redeem'||r.st==='done').sort((a,c)=>a.cost-c.cost),prop=REW.filter(r=>r.st==='proposed'),done=REW.flatMap(r=>(r.hist&&r.hist.length?r.hist:rwN(r)&&r.at?[r.at]:[]).map(d=>({...r,at:d}))).sort((a,c)=>(c.at||'').localeCompare(a.at||'')).slice(0,12);
 if(!HA.token)return `<section class="meal"><header><h3>Belohnungen</h3></header><p class="tip" style="padding:0">Belohnungen funktionieren zu zweit über Home Assistant. Verbinde die App unter „Mehr → Home Assistant“.</p></section>`;
 return `<h2 class="rwh">Belohnungen</h2>
 ${rwAccHtml(b,p)}
 ${rwInboxHtml()}
 <section class="meal rwlist"><header><h3>Gemeinsame Belohnungen</h3></header>
 ${act.length?RW_TIERS.map((T,ti)=>{const lo=ti?RW_TIERS[ti-1].max:0,list=act.filter(r=>r.cost>lo&&r.cost<=T.max);if(!list.length)return '';return `<div class="rwtier"><h4>${T.t}</h4><span>${T.r}</span></div><div class="rwgrid">${list.map((r,i)=>{const can=b.bal>=r.cost,waiting=r.st==='redeem';return `<div class="rwtile t-${RW_TONES[i%3]}${can&&!waiting?' ready':''}"><span class="rwic">${rwIcon(r.name)}</span><b>${esc(r.name)}</b><em class="cond">${fmt(r.cost)}<small> Punkte</small></em>
  <i><s style="width:${Math.min(b.bal/r.cost,1)*100}%"></s></i><small>${waiting?(r.rq===me?`Wartet auf ${esc(p?p.name:'Partner')}`:'Wartet auf dich'):can?(rwN(r)?'Wieder bereit!':'Bereit!'):`Noch ${fmt(r.cost-b.bal)}`}${rwN(r)?`<span class="rwcnt">schon ${rwN(r)}× eingelöst</span>`:''}</small>${!waiting&&can?`<button class="primary" data-rw="redeem" data-id="${r.id}">Einlösen</button>`:''}</div>`}).join('')}</div>`}).join(''):'<p class="tip" style="padding:0">Noch keine Belohnungen. Schlagt welche vor – sie gelten, sobald der andere zustimmt.</p>'}
 ${prop.length?`<h4>Vorgeschlagen</h4>${prop.map(r=>`<div class="rwrow muted"><span class="rwic sm">${rwIcon(r.name)}</span><div><b>${esc(r.name)}</b><small>von ${esc(rwName(r.by))} · ${(r.ok||[]).includes(me)?`wartet auf ${esc(p?p.name:'Partner')}`:'wartet auf dich'}</small></div><em>${fmt(r.cost)}</em>${r.by===me?`<button class="ghost" data-rw="reject" data-id="${r.id}">Zurückziehen</button>`:''}</div>`).join('')}`:''}
 ${rwForm?`<div class="rwform"><input id="rwN" placeholder="z. B. Kino mit Popcorn" value="${esc(rwForm.n||'')}" aria-label="Belohnung"><input id="rwC" inputmode="numeric" placeholder="Punkte" value="${esc(rwForm.c||'')}" aria-label="Punkte"><button class="primary" data-rw="send">Vorschlagen</button></div>
   <div class="vars rwideas">${RW_IDEAS.map(([n,c])=>`<button data-rw="idea" data-n="${esc(n)}" data-c="${c}">${esc(n)} · ${fmt(c)}</button>`).join('')}</div><p class="tip" style="padding:4px 0 0">Keine Reisen. Grob: ${fmt(Math.max(1000,Math.round((b.me+b.pa)/Math.max(1,(Date.now()-Math.min(...Object.keys(S.nut.days).map(k=>Date.parse(k)),Date.now()))/864e5+1)*14/100)*100))} Punkte ≈ 2 Wochen für euch beide.</p>`
   :`<button class="ghost" data-rw="new" style="width:100%;margin-top:8px">+ Belohnung vorschlagen</button>`}</section>
 ${done.length?`<section class="meal"><header><h3>Eingelöst</h3></header>${done.map(r=>`<div class="rwrow muted"><span class="rwic sm">${rwIcon(r.name)}</span><div><b>${esc(r.name)}</b><small>${r.at?new Date(r.at+'T12:00').toLocaleDateString('de-DE',{day:'numeric',month:'long'}):''}</small></div><em>−${fmt(r.cost)}</em></div>`).join('')}</section>`:''}`}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-rw]');if(!b)return;const a=b.dataset.rw,r=REW.find(x=>x.id===b.dataset.id),me=meSlug(),p=rwPartner();
 if(a==='new'){rwForm={};render();return}
 if(a==='idea'){rwForm={n:b.dataset.n,c:b.dataset.c};render();return}
 if(a==='send'){const n=($('rwN').value||'').trim(),c=Math.round(num($('rwC').value)||0);if(!n||c<100){note('Name und mindestens 100 Punkte angeben');return}
  rwForm=null;rwSave({id:'r'+Date.now().toString(36),name:n.slice(0,60),cost:c,by:me,ok:[me],st:'proposed'});tell(`${S.prof.name} schlägt eine Belohnung vor`,`„${n}“ für ${fmt(c)} Punkte – in der App zustimmen.`);return}
 if(!r)return;
 if(a==='approve'){rwSave({...r,ok:[...new Set([...(r.ok||[]),me])],st:'active'});tell(`${S.prof.name} hat zugestimmt`,`„${r.name}“ steht jetzt in eurer Belohnungsliste.`)}
 else if(a==='reject'){rwSave({...r,st:'gone'})}
 else if(a==='redeem'){if(rwBalance().bal<r.cost){note('Noch nicht genug Punkte');return}rwSave({...r,st:'redeem',rq:me});tell(`${S.prof.name} möchte einlösen`,`„${r.name}“ (${fmt(r.cost)} Punkte) – bitte in der App zustimmen.`)}
 else if(a==='confirm'){const n=rwN(r)+1,h=r.hist&&r.hist.length?r.hist:(rwN(r)&&r.at?[r.at]:[]);rwSave({...r,st:'active',rq:'',n,hist:[...h,today()].slice(-30),at:today()});toast('Eingelöst!',`${r.name} – viel Spaß euch beiden. Bleibt in der Liste für das nächste Mal.`);tell(`${S.prof.name} hat zugestimmt: ${r.name}`,`Eingelöst – viel Spaß euch beiden!`)}
 else if(a==='later'){rwSave({...r,st:'active',rq:''})}});
document.addEventListener('input',ev=>{if(!rwForm)return;if(ev.target.id==='rwN')rwForm.n=ev.target.value;if(ev.target.id==='rwC')rwForm.c=ev.target.value});
