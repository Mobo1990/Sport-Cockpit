/* Duo – Brücke zu den iPhone-Funktionen, wenn die App als echte iOS-App (Capacitor) läuft.
   Im Browser und als Homescreen-App macht diese Datei nichts. Plugins (über window.Capacitor.Plugins, ohne Build-Schritt):
   Health (@capgo/capacitor-health), SpeechRecognition (@capgo/capacitor-speech-recognition),
   CapacitorBarcodeScanner (@capacitor/barcode-scanner). */
'use strict';
const CAP=window.Capacitor,NATIVE=!!(CAP&&CAP.isNativePlatform&&CAP.isNativePlatform());
const NP=n=>NATIVE&&CAP.Plugins?CAP.Plugins[n]:null;
let nhBusy=false,nhAsked=false;
/* Apple Health direkt: Schritte und aktive kcal von heute (Summe aus iPhone, Watch, Mi-Band …) */
async function nativeHealth(manual){const H=NP('Health');if(!H||nhBusy)return false;nhBusy=true;
 try{const av=await H.isAvailable();if(!av||!av.available){if(manual)note('Apple Health ist auf diesem Gerät nicht verfügbar');return false}
  if(!nhAsked){await H.requestAuthorization({read:['steps','calories']});nhAsked=true}
  const d=today(),start=new Date(d+'T00:00:00').toISOString(),end=new Date().toISOString();
  const sum=async t=>{const r=await H.queryAggregated({dataType:t,startDate:start,endDate:end,bucket:'day',aggregation:'sum'});return Math.round(((r&&r.samples)||[]).reduce((a,s)=>a+(+s.value||0),0))};
  const st=await sum('steps'),ak=await sum('calories');
  const day=ND(d),old=JSON.stringify(day.h||{});day.h={...(day.h||{}),st,ak};S.hT=Date.now();window.DUO_NATIVE_HEALTH=true;
  if(JSON.stringify(day.h)!==old){day.t=Date.now();touch(d)}else{persist();render()}
  if(manual)note('Apple Health aktualisiert');return true}
 catch(e){if(manual)note('Apple Health: '+(e&&e.message||'kein Zugriff'));return false}
 finally{nhBusy=false}}
/* Spracherkennung des iPhones statt der Browser-Variante (die in der Homescreen-App abstürzen kann) */
class NativeSR{constructor(){this.lang='de-DE';this.onresult=null;this.onend=null;this.onerror=null}
 async start(){const P=NP('SpeechRecognition');try{const a=await P.available();if(!a||!a.available)throw{error:'service-not-allowed'};
  const perm=await P.requestPermissions();if(perm&&perm.speechRecognition&&perm.speechRecognition!=='granted')throw{error:'not-allowed'};
  const r=await P.start({language:this.lang,maxResults:1,partialResults:false,popup:false});const t=((r&&r.matches)||[])[0]||'';
  if(t&&this.onresult)this.onresult({results:[[{transcript:t}]]});if(this.onend)this.onend()}
  catch(e){if(this.onerror)this.onerror({error:(e&&e.error)||'service-not-allowed'})}}
 stop(){const P=NP('SpeechRecognition');try{P&&P.stop()}catch(e){}}}
/* Barcode mit der nativen Kamera (Vollbild-Scanner des iPhones) */
async function nativeScan(){const B=NP('CapacitorBarcodeScanner');if(!B)return false;
 try{const r=await B.scanBarcode({hint:17,scanInstructions:'Barcode in den Rahmen halten',scanButton:false});const code=String((r&&r.ScanResult)||'').trim();
  if(code&&eanOk(code))offCode(code);else if(code)scanMsg('Code nicht lesbar – bitte nochmal scannen.');return true}
 catch(e){scanMsg('Scannen abgebrochen – nochmal versuchen oder Nummer eintippen.');return true}}
if(NATIVE){
 document.documentElement.classList.add('native');
 if(NP('SpeechRecognition'))SR=NativeSR;
 const webStart=startScan;startScan=async function(){if(NP('CapacitorBarcodeScanner')){await nativeScan();return}return webStart()};
 /* Knopf „Apple Health aktualisieren“: in der App direkt lesen statt Kurzbefehl starten */
 healthLink=function(){const age=S.hT?Date.now()-S.hT:Infinity,stale=age>3600e3;return `<a class="hlink${stale?' stale':''}" href="#" data-hl="native">↻ Apple Health ${stale?'aktualisieren':'· vor '+Math.max(1,Math.round(age/60000))+' min geholt'}</a>`};
 document.addEventListener('click',ev=>{const a=ev.target.closest('[data-hl="native"]');if(!a)return;ev.preventDefault();nativeHealth(true)});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')nativeHealth(false)});
 setTimeout(()=>nativeHealth(false),800)}
