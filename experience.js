/* CTRLstudio / ADGM — client-brief synchronized LED + iPad experience PREVIS.
 * Source: SBE Content Strategy / User Journey / Moods 01-09-2026, pp. 5, 6, 10, 11, 13, 14, 16.
 * Visual demonstration only. Both screens run in one browser; no production device protocol or approved CMS assets.
 */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const CFG=window.ADGM_EXPERIENCE;
const inventory=window.ADGM_RESEARCH?.buildings||[];
if(!CFG||!$('led-scene')||!$('tablet-choices')){
 console.error('ADGM simulator dependencies missing');return;
}
const Z=CFG.zones,ORDER=CFG.order;
const lookup=new Map(inventory.map(x=>[x.code,x]));
const assetRoot='./assets/';
const state={zone:null,category:null,building:null,phase:'discover',demo:false,first:true,autostep:0};
let phaseTimeout=null,autoTimer=null,inactiveTimer=null,motionTick=0,transitionVersion=0;
let lastUse=Date.now(),focusing=false;
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const titles={discover:'DISCOVER',navigate:'NAVIGATE',focus:'FOCUS',explore:'EXPLORE',continue:'CONTINUE'};
function setStep(step){
 state.phase=step;
 $('experience-stage').textContent='KROK '+(['discover','navigate','focus','explore','continue'].indexOf(step)+1)+' / 5 · '+titles[step];
 document.querySelectorAll('[data-step]').forEach(el=>el.classList.toggle('current',el.dataset.step===step));
}
function textZone(){return state.zone?Z[state.zone].num+' / '+Z[state.zone].name:'Cały obszar ADGM';}
function updateTopStatus(){
 $('led-status').textContent=state.zone
   ? ('LED ↔ IPAD · '+Z[state.zone].num+' / '+state.phase.toUpperCase())
   : ('LED ↔ IPAD · IDLE');
 $('ipad-sync-text').textContent=state.zone ? 'SYNCHRONIZED · '+Z[state.zone].num : 'LED CONNECTED · DEMO';
}
function noFakeGIS(){
 // Runtime outline interpretation is schematic; approved top view remains the authority.
 $('geo-honesty').textContent='Mapa stref wg referencji SBE · położenia punktów na CGI poglądowe';
}
function paintZonePaths(){
 const area=$('led-area-paths');
 area.innerHTML=ORDER.map(id=>'<path class="led-zpath" data-led-zone="'+id+'" d="'+esc(Z[id].ledPath)+'"></path>').join('');
 const map=$('tablet-area-paths');
 map.innerHTML=ORDER.map(id=>'<path class="area" data-tablet-zone="'+id+'" d="'+esc(Z[id].tabletPath)+'" role="button" tabindex="0" aria-label="Wybierz '+esc(Z[id].name)+'"></path>').join('');
 const centers={M:[163,162],T:[241,216],S:[317,148],N:[373,301]};
 $('tablet-marker-points').innerHTML=ORDER.map(id=>'<circle class="map-dot" data-dot-zone="'+id+'" cx="'+centers[id][0]+'" cy="'+centers[id][1]+'" r="7"/>').join('');
}
function updatePaths(){
 for(const el of document.querySelectorAll('[data-led-zone]')){
  el.classList.toggle('active',el.dataset.ledZone===state.zone);
  el.classList.toggle('faded',!!state.zone&&el.dataset.ledZone!==state.zone);
 }
 for(const el of document.querySelectorAll('[data-tablet-zone]')){
  el.classList.toggle('chosen',el.dataset.tabletZone===state.zone);
  el.setAttribute('aria-pressed',String(el.dataset.tabletZone===state.zone));
 }
 for(const el of document.querySelectorAll('[data-dot-zone]'))el.classList.toggle('chosen',el.dataset.dotZone===state.zone);
 $('led-scene').classList.toggle('is-focused',!!state.zone);
}
function renderOverview(){
 const controls=$('tablet-choices');
 controls.innerHTML=ORDER.map(id=>{
  const z=Z[id];
  return '<button class="ipad-choice" type="button" data-select-zone="'+id+'">'+
   '<span class="num">'+z.num+'</span><span style="flex:1">'+esc(z.name)+'<span class="subline">'+esc(z.tagline)+'</span></span><span class="arrow">›</span></button>';
 }).join('');
 $('tablet-headline').textContent='EXPLORE ADGM';
 $('tablet-description').textContent='Select one of four zones on the interactive top-view map.';
 $('tablet-context').hidden=true;
 $('ipad-view-wall').textContent='▶ Rozpocznij demo';
 $('ipad-back').textContent='↺ Cała mapa';
 $('led-zone-small').textContent='THE DISTRICT, MADE DISCOVERABLE';
 $('led-zone-title').textContent='Discover the ADGM district';
 $('led-zone-description').textContent='Select a zone on the iPad to explore landmarks, stories and services on the panoramic LED wall.';
 $('led-reveal').classList.remove('visible');
 $('led-marker-layer').replaceChildren();
 updateTopStatus();
}
function renderZoneControls(){
 const z=Z[state.zone];
 $('tablet-headline').textContent=z.num+' · '+z.name;
 $('tablet-description').textContent=z.tagline;
 const rows=CFG.categories;
 $('tablet-choices').innerHTML=rows.map(c=>
  '<button type="button" class="ipad-choice'+(state.category===c.id?' on':'')+'" data-category="'+c.id+'">'+
  '<span class="num">'+(c.id==='story'?'◈':c.id==='landmarks'?'▥':c.id==='clusters'?'▤':'⚙')+'</span><span style="flex:1">'+esc(c.title)+
  '<span class="subline">'+esc(c.hint)+'</span></span><span class="arrow">›</span></button>'
 ).join('');
 $('ipad-view-wall').textContent=state.building?'↗ Pokaż obiekt na LED':'◈ Pokaż na LED';
 $('ipad-back').textContent='← Pełna mapa';
 renderContext();
}
function renderContext(){
 const ctx=$('tablet-context');
 if(!state.zone){ctx.hidden=true;return;}
 const z=Z[state.zone],cat=state.category;
 if(!cat){ctx.hidden=true;return;}
 ctx.hidden=false;
 if(state.building){
  const b=lookup.get(state.building);
  if(b){
    ctx.innerHTML='<h4>'+esc(b.name)+'</h4><p>'+esc(b.shape||'Widok poglądowy budynku')+'</p><p><b>'+esc(b.code)+'</b> · '+esc(z.name)+' · dane z atlasu; marker na CGI wymaga akceptacji ADGM</p>'+
    '<button type="button" class="building-quick" data-open-atlas="'+esc(b.code)+'">↗ Otwórz atlas obiektów</button>';
    return;
  }
 }
 if(cat==='story'){
  ctx.innerHTML='<h4>Story — '+esc(z.name)+'</h4><p>Scenariusz strefy na LED. Wersja demo przedstawia przejazd i intro.</p><p>Materiał wideo i zatwierdzony tekst do dostarczenia przez ADGM (PDF SBE, s. 16).</p>';
 }else if(cat==='landmarks'){
  ctx.innerHTML='<h4>Landmarks · miejsca referencyjne</h4>'+z.markers.map(m=>
   '<button class="building-quick" type="button" data-building="'+esc(m.code)+'">⌖ '+esc(lookup.get(m.code)?.name||m.caption)+' →</button>').join('')+
   '<p>Punkty umowne na obrazie CGI; nie są zweryfikowanymi współrzędnymi GIS.</p>';
 }else if(cat==='clusters'){
  ctx.innerHTML='<h4>Business Clusters</h4><p>Przewidziany moduł sektorów i powiązań biznesowych dla '+esc(z.name)+'.</p><p><strong>ADGM ma przekazać:</strong> zatwierdzoną listę klastrów, fakty i opisy.</p>';
 }else if(cat==='services'){
  ctx.innerHTML='<h4>Services</h4><p>Menu usług i punktów orientacyjnych związanych ze strefą.</p><p><strong>ADGM ma przekazać:</strong> listę usług, lokalizacje, CTA i zatwierdzone teksty.</p>';
 }else if(cat==='continue'){
  ctx.innerHTML='<h4>Scan to continue</h4><p>Docelowy QR zostanie podpięty do zatwierdzonego URL od ADGM. Nie generujemy działającego kodu do fikcyjnej strony.</p>';
 }
}
function buildPins(){
 const area=$('led-marker-layer');
 area.replaceChildren();
 if(!state.zone)return;
 const z=Z[state.zone];
 for(let i=0;i<z.markers.length;i++){
  const m=z.markers[i];
  const record=lookup.get(m.code);
  const btn=document.createElement('button');
  btn.type='button';btn.className='landmark';btn.dataset.marker=m.code;
  btn.style.left=m.x+'%';btn.style.top=m.y+'%';btn.style.transitionDelay=(i*145)+'ms';
  btn.title=(record?.name||m.caption)+' — lokalizacja na CGI poglądowa';
  btn.setAttribute('aria-label','Pokaż hotspot '+(record?.name||m.caption));
  btn.innerHTML='<span class="landmark-pin">⌖</span><span class="landmark-name">'+esc(record?.name||m.caption)+'<small>Wybierz, aby zobaczyć szczegóły</small></span>';
  area.appendChild(btn);
 }
}
function showPins(){
 if(!state.zone)return;
 for(const el of $('led-marker-layer').querySelectorAll('.landmark'))el.classList.add('show');
}
function hidePins(){
 for(const el of $('led-marker-layer').querySelectorAll('.landmark'))el.classList.remove('show');
}
function showLedCallout(title,body,label){
 $('led-reveal').classList.add('visible');
 $('led-reveal-kicker').textContent=label||'LED / ZONE INTRO';
 $('led-reveal-title').textContent=title;
 $('led-reveal-body').textContent=body;
}
function updateLedIntro(){
 const z=Z[state.zone];
 $('led-zone-small').textContent='STREFA '+z.num+' / '+z.tagline.toUpperCase();
 $('led-zone-title').textContent=z.name;
 $('led-zone-description').textContent=z.subtitle+' · Interactive discovery through the iPad.';
}
function cameraTo(id){
 const scene=$('led-scene');
 if(!id){scene.style.transform='translate3d(0,0,0) scale(1)';return;}
 const z=Z[id],sc=z.zoom;
 const offX=(.5-z.x*sc)*100,offY=(.5-z.y*sc)*100;
 scene.style.transform='translate3d('+offX.toFixed(3)+'%,'+offY.toFixed(3)+'%,0) scale('+sc+')';
}
function clearTimers(){if(phaseTimeout){clearTimeout(phaseTimeout);phaseTimeout=null;}}
function selectZone(id,{automatic=false}={}){
 if(!Z[id])return;
 if(!automatic)stopDemo();
 clearTimers();transitionVersion++;
 const v=transitionVersion;
 state.zone=id;state.category=null;state.building=null;
 setStep('navigate');updateTopStatus();updatePaths();
 hidePins();$('led-reveal').classList.remove('visible');
 buildPins();cameraTo(id);renderZoneControls();updateLedIntro();
 $('led-status').textContent='LED CAMERA / TRAVEL TO '+Z[id].num;
 $('ipad-view-wall').textContent='PRZEJŚCIE KAMERY…';
 focusing=true;
 phaseTimeout=setTimeout(()=>{
  if(v!==transitionVersion)return;
  focusing=false;setStep('focus');updateTopStatus();
  $('ipad-view-wall').textContent='◈ Pokaż na LED';
  showLedCallout(Z[id].name,Z[id].tagline+' · Select a hotspot on the tablet to reveal details.','LED / AREA INTRO');
  showPins();
  // After camera move, reveal the category menu (client PDF: SELECT -> TRAVEL -> INTRODUCE -> REVEAL).
  phaseTimeout=setTimeout(()=>{
   if(v!==transitionVersion)return;
   setStep('explore');updateTopStatus();
  },850);
 },1900);
 markUserActivity();
}
function reset({stopDemoAlso=true}={}){
 if(stopDemoAlso)stopDemo();
 clearTimers();transitionVersion++;
 state.zone=null;state.category=null;state.building=null;
 focusing=false;cameraTo(null);setStep('discover');
 updatePaths();renderOverview();$('led-status').textContent='LED ↔ IPAD · IDLE';
 $('tour-beacon').style.opacity=0;
 $('led-demo-route').style.opacity=0;
 markUserActivity();
}
function selectCategory(cat){
 if(!state.zone)return;
 state.category=cat;
 state.building=null;
 setStep(cat==='continue'?'continue':'explore');
 if(cat==='landmarks'){showPins();showLedCallout('Landmarks · '+Z[state.zone].name,'Tap a building marker or choose a landmark from the iPad.','LED / LANDMARKS');}
 else if(cat==='story'){hidePins();showLedCallout('Story · '+Z[state.zone].name,'Approved video narrative to be supplied by ADGM. Camera move and area introduction are simulated.','LED / STORY');}
 else if(cat==='clusters'){hidePins();showLedCallout('Business Clusters · '+Z[state.zone].name,'Sector story and content await ADGM approval.','LED / CLUSTERS');}
 else if(cat==='services'){hidePins();showLedCallout('Services · '+Z[state.zone].name,'Approved service descriptions and callouts pending.','LED / SERVICES');}
 else if(cat==='continue'){hidePins();showLedCallout('Scan to continue','QR destination and take-away page to be provided by ADGM.','LED / CONTINUE');}
 renderZoneControls();updateTopStatus();markUserActivity();
}
function chooseBuilding(code){
 const b=lookup.get(code),z=state.zone?Z[state.zone]:null;
 if(!b||!z||b.zone!==state.zone)return;
 state.category='landmarks';state.building=code;
 setStep('explore');updateTopStatus();
 showPins();
 for(const el of $('led-marker-layer').querySelectorAll('.landmark')){
  el.classList.toggle('selected',el.dataset.marker===code);
 }
 showLedCallout(b.name,(b.shape||'Building landmark')+' · '+(b.height||'Height pending')+' · '+z.name,
  'LED / BUILDING '+b.code+' / DEMO PIN');
 renderZoneControls();markUserActivity();
}
function markUserActivity(){
 lastUse=Date.now();
 if(inactiveTimer)clearTimeout(inactiveTimer);
 if(!state.demo&&state.zone){
  inactiveTimer=setTimeout(()=>{if(!state.demo&&Date.now()-lastUse>=90000)reset();},90000);
 }
}
function stopDemo(){
 state.demo=false;if(autoTimer)clearInterval(autoTimer);autoTimer=null;
 $('tour-button').textContent='▶ Demo przelot';
 $('ipad-view-wall').disabled=false;
}
function startDemo(){
 if(state.demo){stopDemo();return;}
 stopDemo();
 state.demo=true;state.autostep=0;
 $('tour-button').textContent='Ⅱ Zatrzymaj demo';
 $('led-demo-route').style.opacity=.8;
 $('tour-beacon').style.opacity=1;
 const advance=()=>{
  if(!state.demo)return;
  const id=ORDER[state.autostep%ORDER.length];
  selectZone(id,{automatic:true});
  state.autostep++;
  if(state.autostep>=ORDER.length){
    // End with full-district view rather than restarting the first zone.
    if(autoTimer){clearInterval(autoTimer);autoTimer=null;}
    setTimeout(()=>{if(!state.demo)return;stopDemo();reset({stopDemoAlso:false});},5800);
  }
 };
 advance();autoTimer=setInterval(advance,6600);
}
function onAction(target){
 if(target.closest('[data-select-zone]')){
  selectZone(target.closest('[data-select-zone]').dataset.selectZone);return true;
 }
 if(target.closest('[data-category]')){
  selectCategory(target.closest('[data-category]').dataset.category);return true;
 }
 if(target.closest('[data-building]')){
  chooseBuilding(target.closest('[data-building]').dataset.building);return true;
 }
 if(target.closest('[data-marker]')){
  chooseBuilding(target.closest('[data-marker]').dataset.marker);return true;
 }
 if(target.closest('[data-open-atlas]')){
  const code=target.closest('[data-open-atlas]').dataset.openAtlas;
  window.location.href='./atlas.html#'+encodeURIComponent(code);return true;
 }
 if(target.closest('[data-tablet-zone]')){
  selectZone(target.closest('[data-tablet-zone]').dataset.tabletZone);return true;
 }
 return false;
}
$('tablet-choices').addEventListener('click',e=>onAction(e.target));
$('tablet-context').addEventListener('click',e=>onAction(e.target));
$('led-marker-layer').addEventListener('click',e=>onAction(e.target));
$('tablet-area-paths').addEventListener('click',e=>onAction(e.target));
$('tablet-area-paths').addEventListener('keydown',e=>{
 if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-tablet-zone]')){
  e.preventDefault();selectZone(e.target.dataset.tabletZone);
 }
});
$('tour-button').addEventListener('click',startDemo);
$('ipad-back').addEventListener('click',()=>reset());
$('map-reset').addEventListener('click',()=>reset());
$('ipad-view-wall').addEventListener('click',()=>{
 if(!state.zone){startDemo();return;}
 if(state.building){chooseBuilding(state.building);return;}
 if(state.category){selectCategory(state.category);return;}
 showLedCallout(Z[state.zone].name,'The selected area is displayed on the wall. Choose Story, Landmarks, Business Clusters or Services on the iPad.','LED / READY');
 markUserActivity();
});
$('led-reveal-next').addEventListener('click',()=>{
 if(!state.zone)return;
 selectCategory('continue');
});
$('fullscreen-led').addEventListener('click',()=>{
 const el=$('led-frame');if(document.fullscreenElement)document.exitFullscreen?.();
 else el.requestFullscreen?.().catch(()=>{});
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.fullscreenElement)reset();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.demo)stopDemo();});
for(const id of ['led-photo','tablet-map-image']){
 $(id).addEventListener('error',function(){
  this.classList.add('image-error');
  this.alt='Nie udało się wczytać grafiki. Dostępne są obrysy i sterowanie strefami.';
  if(id==='led-photo'&&this.dataset.fallback!=='used'){
   this.dataset.fallback='used';this.src='./assets/adgm-master-hq.avif';
  }
 });
}
function tourMotion(time){
 const beacon=$('tour-beacon'),line=$('led-flight-line');
 if(state.demo&&line&&beacon){
  const len=line.getTotalLength();
  const p=line.getPointAtLength(((time/26000)%1)*len);
  beacon.setAttribute('cx',p.x.toFixed(1));beacon.setAttribute('cy',p.y.toFixed(1));
 }
 requestAnimationFrame(tourMotion);
}
paintZonePaths();setStep('discover');reset();noFakeGIS();
requestAnimationFrame(tourMotion);
})();
