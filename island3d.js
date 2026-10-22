/* CTRLstudio ADGM — interactive 3D island PREVIS and zone/building navigation. */
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createCity,ZONES,FALLBACK,CONTEXT_CODES,locationFor,toWorld} from './island3d-geometry.js';

const data=window.ADGM_RESEARCH;
if(!data||!Array.isArray(data.buildings)||data.buildings.length!==27)throw new Error('Missing ADGM inventory (27 records)');
const $=id=>document.getElementById(id);
const stage=$('scene'),viewport=$('viewport'),labels=$('labels-layer');
const zoneList=$('zone-list'),buildingList=$('building-list'),search=$('building-search-3d');
const buildingByCode=new Map(data.buildings.map(b=>[b.code,b]));
const city=createCity(data.buildings);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.14;
renderer.shadowMap.enabled=window.innerWidth>850;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
stage.appendChild(renderer.domElement);
const camera=new THREE.PerspectiveCamera(45,1,.15,1500);
camera.position.set(108,99,157);
const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=.07;
controls.minDistance=5;controls.maxDistance=290;
controls.minPolarAngle=.12;controls.maxPolarAngle=Math.PI*.48;
controls.enablePan=true;controls.screenSpacePanning=false;
controls.target.set(0,1,11);controls.update();
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
const zoneKeys=['M','T','S','N'];
let selectedZone='all',selectedCode=null,activePreset='overview';
let flight=null,down=null,hoveredCode=null,hoverStamp=0;
let demoActive=false,demoIndex=0,demoTimers=[];
const zonePins=new Map(),buildingPins=new Map();
const viewPresets={
  overview:{pos:[113,96,156],target:[0,1,14]},
  top:{pos:[.01,178,13],target:[0,0,12]},
  shams:{pos:[91,38,48],target:[37,6,4]},
  waterfront:{pos:[65,30,111],target:[9,3,47]}
};
function escapeHTML(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function stopDemo(){
  if(!demoActive)return;
  demoActive=false;
  for(const id of demoTimers)clearTimeout(id);
  demoTimers=[];
  $('demo-btn').classList.remove('active');
  $('demo-btn').setAttribute('aria-pressed','false');
}
function fly(position,target,duration=1100){
  flight={
    start:performance.now(),duration,
    fromPos:camera.position.clone(),toPos:new THREE.Vector3(...position),
    fromTarget:controls.target.clone(),toTarget:new THREE.Vector3(...target)
  };
}
function flyZone(zone){
  if(zone==='all'){const p=viewPresets.overview;fly(p.pos,p.target,1300);return;}
  const info=ZONES[zone],center=city.zoneOverlays[zone].center;
  const distance=zone==='S'?1.38:zone==='T'?1.07:1;
  const target=[center.x,2.2,center.z];
  fly([center.x+info.rx*.91*distance,27+info.rz*.47*distance,center.z+info.rz*1.53*distance],target,1300);
}
function flyBuilding(code){
  const group=city.groups.get(code);
  if(!group)return;
  const box=new THREE.Box3().setFromObject(group);
  const center=new THREE.Vector3();box.getCenter(center);
  const size=new THREE.Vector3();box.getSize(size);
  const distance=Math.max(15,Math.max(size.x,size.z)*2.2,size.y*2.4);
  const target=[center.x,Math.max(1,Math.min(8,center.y*.65)),center.z];
  const p=[center.x+distance*.73,Math.max(10,center.y+distance*.49),center.z+distance*.84];
  fly(p,target,1250);
}
function setActivePreset(name){
  activePreset=name;
  document.querySelectorAll('[data-view]').forEach(el=>el.classList.toggle('active',el.dataset.view===name));
}
function updateHeading(){
  if(selectedCode){
    const b=buildingByCode.get(selectedCode);
    $('scene-heading').textContent=b.name;
    $('scene-subtitle').textContent=ZONES[b.zone].name+' · '+b.code+' · bryła robocza';
  }else if(selectedZone==='all'){
    $('scene-heading').textContent='Al Maryah + Al Reem';
    $('scene-subtitle').textContent='4 strefy · 27 pozycji · model koncepcyjny';
  }else{
    const z=ZONES[selectedZone],count=data.buildings.filter(b=>b.zone===selectedZone).length;
    $('scene-heading').textContent=z.name;
    $('scene-subtitle').textContent=count+' pozycji · kliknij budynek na modelu lub liście';
  }
}
function renderZones(){
  zoneList.innerHTML=zoneKeys.map(id=>{
    const z=ZONES[id],n=data.buildings.filter(b=>b.zone===id).length;
    return '<button class="zone-item '+(selectedZone===id?'active':'')+'" type="button" data-zone="'+id+'" style="--zone-color:'+z.color+'" aria-pressed="'+(selectedZone===id)+'">'+
      '<span class="zone-num">'+z.number+'</span><span><span class="zone-name">'+escapeHTML(z.name)+'</span><span class="zone-desc">'+escapeHTML(z.desc)+'</span><span class="zone-count">'+n+' pozycji</span></span><span class="zone-arrow">›</span></button>';
  }).join('')+'<button class="all-zones '+(selectedZone==='all'?'active':'')+'" data-zone="all" type="button" aria-pressed="'+(selectedZone==='all')+'">◈ &nbsp; Pokaż wszystkie cztery strefy</button>';
}
function listMatches(){
  const q=search.value.trim().toLocaleLowerCase('pl').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  return data.buildings.filter(b=>{
    if(selectedZone!=='all'&&b.zone!==selectedZone)return false;
    if(!q)return true;
    return [b.name,b.code,b.shape,b.developer,b.where].join(' ').toLocaleLowerCase('pl').normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q);
  });
}
function iconFor(b){
  if(b.code==='S07')return '♣';
  if(b.code==='N02')return '≋';
  if(['M07','N01','T03','S06'].includes(b.code))return '▤';
  if(['T05','T06','S08'].includes(b.code))return '⌂';
  if(b.code==='S09')return '✚';
  return '▥';
}
function renderBuildings(){
  const items=listMatches();
  $('building-counter').textContent=items.length;
  $('building-list-title').textContent=selectedZone==='all'?'Wszystkie obiekty':ZONES[selectedZone].short;
  buildingList.innerHTML=items.length?items.map(b=>{
    const extra=CONTEXT_CODES.has(b.code)?' · kontekst':(!b.position?' · pozycja robocza':'');
    const h=b.height&&b.height!=='—'&&b.height!=='Nie dotyczy'?b.height:'gabaryt roboczy';
    return '<button class="building-item '+(selectedCode===b.code?'active':'')+'" type="button" data-code="'+b.code+'" aria-pressed="'+(selectedCode===b.code)+'">'+
      '<span class="building-symbol">'+iconFor(b)+'</span><span><span class="building-title">'+escapeHTML(b.name)+'</span><span class="building-sub">'+escapeHTML(b.code)+' · '+escapeHTML(h)+'<span class="context-flag">'+escapeHTML(extra)+'</span></span></span><span class="building-chevron">›</span></button>';
  }).join(''):'<div class="no-results">Brak budynków pasujących do wyszukiwania.</div>';
}
function setZone(id,{demo=false}={}){
  if(!demo)stopDemo();
  if(id!=='all'&&!ZONES[id])return;
  selectedZone=id;selectedCode=null;
  city.select(null);city.setZone(id);
  renderZones();renderBuildings();updateHeading();showEmptyDetails();updatePins();
  setActivePreset('overview');
  flyZone(id);
  if(window.innerWidth<=720)$('sidebar').classList.remove('open');
}
function showEmptyDetails(){
  $('detail-content').hidden=true;$('detail-empty').hidden=false;
  $('detail-panel').classList.remove('show');
}
function safeURL(url){try{const u=new URL(url);return u.protocol==='https:'?u.href:null;}catch{return null;}}
function showDetails(b){
  $('detail-empty').hidden=true;$('detail-content').hidden=false;
  $('detail-panel').classList.add('show');
  $('detail-zone').textContent=ZONES[b.zone].number+' / '+ZONES[b.zone].name.toUpperCase();
  $('detail-code').textContent=b.code;
  $('detail-name').textContent=b.name;
  $('detail-location').textContent=ZONES[b.zone].name+(CONTEXT_CODES.has(b.code)?' · obiekt kontekstowy':'');
  $('detail-height').textContent=b.height||'—';
  $('detail-floors').textContent=b.floors||'—';
  $('detail-year').textContent=b.year||'—';
  $('detail-status').textContent=b.status||'Do sprawdzenia';
  $('detail-shape').textContent=b.shape||'Brak opisu.';
  $('detail-where').textContent=b.where||'Do weryfikacji.';
  $('detail-notes').textContent=[b.notes,b.keep].filter(Boolean).join(' ');
  $('detail-developer').textContent=b.developer||'—';
  $('detail-architect').textContent=b.architect||'—';
  const ll=locationFor(b);
  $('detail-coords').textContent=ll?ll.map(n=>Number(n).toFixed(5)).join(', ')+(b.position?' (punkt orientacyjny)':' (robocze)'):'Do weryfikacji';
  let warning='Model roboczy: kształt, gabaryty i granice wyspy są symulacją, nie zweryfikowaną geometrią.';
  if(!b.position)warning+=' Lokalizacja tej pozycji jest oszacowana do celów prezentacji.';
  if(CONTEXT_CODES.has(b.code))warning+=' Obiekt zachowuje realne położenie poza ścisłym obszarem przypisanej strefy.';
  if(b.code==='S09')warning+=' To lokal w istniejącym budynku, nie osobny wieżowiec.';
  $('detail-warning').textContent=warning;
  const sourceLinks=(b.links||[]).filter(l=>safeURL(l.url)).slice(0,3);
  $('detail-links').innerHTML=sourceLinks.map(l=>'<a target="_blank" rel="noopener noreferrer" href="'+escapeHTML(safeURL(l.url))+'">↗ &nbsp; '+escapeHTML(l.title)+'</a>').join('')+
    '<a href="./index.html">◫ &nbsp; Atlas zdjęć i lokalizacji</a>';
}
function selectBuilding(code,{demo=false}={}){
  const b=buildingByCode.get(code);
  if(!b)return;
  if(!demo)stopDemo();
  selectedZone=b.zone;selectedCode=code;
  city.setZone(selectedZone);city.select(code);
  renderZones();renderBuildings();updateHeading();showDetails(b);updatePins();
  setActivePreset('selected');
  flyBuilding(code);
  if(window.innerWidth<=720)$('sidebar').classList.remove('open');
}
function clearBuilding(){
  selectedCode=null;city.select(null);renderBuildings();updateHeading();showEmptyDetails();updatePins();
}
zoneList.addEventListener('click',e=>{
  const b=e.target.closest('[data-zone]');if(b)setZone(b.dataset.zone);
});
buildingList.addEventListener('click',e=>{
  const b=e.target.closest('[data-code]');if(b)selectBuilding(b.dataset.code);
});
search.addEventListener('input',renderBuildings);
$('detail-close').addEventListener('click',clearBuilding);
$('detail-focus').addEventListener('click',()=>{if(selectedCode){stopDemo();setActivePreset('selected');flyBuilding(selectedCode);}});
$('overview-btn').addEventListener('click',()=>setZone('all'));
$('mobile-menu').addEventListener('click',()=>{$('sidebar').classList.toggle('open');$('detail-panel').classList.remove('show');});
function setView(name){
  stopDemo();
  if(name==='selected'){
    if(selectedCode){flyBuilding(selectedCode);setActivePreset(name);}
    else if(selectedZone!=='all'){flyZone(selectedZone);setActivePreset('overview');}
    return;
  }
  const p=viewPresets[name];
  if(!p)return;
  fly(p.pos,p.target,1250);setActivePreset(name);
}
document.querySelectorAll('[data-view]').forEach(el=>el.addEventListener('click',()=>setView(el.dataset.view)));
$('fullscreen-btn').addEventListener('click',async()=>{
  try{
    if(document.fullscreenElement)await document.exitFullscreen();
    else if(viewport.requestFullscreen)await viewport.requestFullscreen();
  }catch(e){console.warn('Fullscreen unavailable',e);}
});
function startDemo(){
  stopDemo();demoActive=true;demoIndex=0;
  $('demo-btn').classList.add('active');$('demo-btn').setAttribute('aria-pressed','true');
  const steps=[['M','M02'],['T','T01'],['S','S01'],['N','N02']];
  function next(){
    if(!demoActive)return;
    const [zone,code]=steps[demoIndex++%steps.length];
    setZone(zone,{demo:true});
    demoTimers.push(setTimeout(()=>{if(demoActive)selectBuilding(code,{demo:true});},1700));
    demoTimers.push(setTimeout(next,5600));
  }
  next();
}
$('demo-btn').setAttribute('aria-pressed','false');
$('demo-btn').addEventListener('click',()=>demoActive?stopDemo():startDemo());
controls.addEventListener('start',()=>{flight=null;stopDemo();});
const labelObjects=[];
function makePins(){
  labels.innerHTML='';
  for(const [id,z] of Object.entries(ZONES)){
    const el=document.createElement('button');
    el.type='button';el.className='pin zone-pin';el.style.setProperty('--pin-color',z.color);
    el.innerHTML='<strong>'+z.number+'</strong><span>'+escapeHTML(z.name)+'</span>';
    el.setAttribute('aria-label','Przejdź do strefy '+z.name);
    el.addEventListener('click',()=>setZone(id));
    labels.appendChild(el);zonePins.set(id,el);
    const center=city.zoneOverlays[id].center.clone();center.y=5;
    labelObjects.push({el,kind:'zone',id,position:center});
  }
  for(const b of data.buildings){
    const anchor=city.anchors.get(b.code);
    if(!anchor)continue;
    const el=document.createElement('button');
    el.type='button';el.className='pin building-pin';
    el.style.setProperty('--pin-color',ZONES[b.zone].color);
    el.innerHTML='<span class="pin-dot"></span><span>'+escapeHTML(b.name)+'</span>';
    el.setAttribute('aria-label','Pokaż '+b.name);
    el.addEventListener('click',()=>selectBuilding(b.code));
    labels.appendChild(el);buildingPins.set(b.code,el);
    labelObjects.push({el,kind:'building',id:b.code,zone:b.zone,position:anchor});
  }
}
function updatePins(){
  for(const item of labelObjects){
    item.enabled=item.kind==='zone'?selectedZone==='all':selectedZone!=='all'&&item.zone===selectedZone;
    if(item.kind==='building'){
      item.el.classList.toggle('active',item.id===selectedCode);
      if(selectedCode)item.enabled=item.id===selectedCode||item.zone===selectedZone;
    }
    item.el.style.display=item.enabled?'':'none';
  }
}
const projected=new THREE.Vector3();
function positionPins(){
  const rect=stage.getBoundingClientRect(),w=rect.width,h=rect.height;
  if(!w||!h)return;
  for(const item of labelObjects){
    if(!item.enabled)continue;
    projected.copy(item.position).project(camera);
    const inFront=projected.z>-1&&projected.z<1;
    const x=(projected.x*.5+.5)*w,y=(-projected.y*.5+.5)*h;
    const visible=inFront&&x>-65&&x<w+65&&y>25&&y<h-80;
    item.el.style.display=visible?'':'none';
    if(visible){item.el.style.left=x+'px';item.el.style.top=y+'px';}
  }
}
function getIntersections(e){
  const rect=renderer.domElement.getBoundingClientRect();
  if(rect.width<=0||rect.height<=0)return [];
  pointer.x=((e.clientX-rect.left)/rect.width)*2-1;
  pointer.y=-((e.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  return raycaster.intersectObjects(city.picking,false);
}
function hitCode(e){const hits=getIntersections(e);return hits.length?hits[0].object.userData.code:null;}
renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,t:performance.now()};});
renderer.domElement.addEventListener('pointerup',e=>{
  if(!down)return;
  const moved=Math.hypot(e.clientX-down.x,e.clientY-down.y);down=null;
  if(moved>7)return;
  const code=hitCode(e);
  if(code)selectBuilding(code);
  if(window.innerWidth<=720)$('sidebar').classList.remove('open');
});
renderer.domElement.addEventListener('pointermove',e=>{
  if(e.pointerType==='touch')return;
  const now=performance.now();if(now-hoverStamp<45)return;hoverStamp=now;
  const code=hitCode(e);
  hoveredCode=code;
  renderer.domElement.style.cursor=code?'pointer':'grab';
  const tooltip=$('scene-tooltip');
  if(code){
    const b=buildingByCode.get(code);
    tooltip.textContent=b.name+' · '+code;
    tooltip.hidden=false;
    const rect=stage.getBoundingClientRect();
    tooltip.style.left=Math.min(rect.width-185,Math.max(8,e.clientX-rect.left+14))+'px';
    tooltip.style.top=Math.min(rect.height-55,Math.max(8,e.clientY-rect.top-35))+'px';
  }else tooltip.hidden=true;
});
renderer.domElement.addEventListener('pointerleave',()=>{$('scene-tooltip').hidden=true;});
window.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    stopDemo();
    if($('sidebar').classList.contains('open'))$('sidebar').classList.remove('open');
    else if(selectedCode)clearBuilding();
  }
});
function resize(){
  const rect=stage.getBoundingClientRect();
  if(rect.width<1||rect.height<1)return;
  camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();
  renderer.setSize(rect.width,rect.height,false);
}
if(window.ResizeObserver)new ResizeObserver(resize).observe(stage);
window.addEventListener('resize',resize);
resize();
renderZones();renderBuildings();updateHeading();showEmptyDetails();makePins();updatePins();city.setZone('all');
let firstFrame=true;
function animate(time){
  requestAnimationFrame(animate);
  if(flight){
    const k=Math.min(1,(time-flight.start)/flight.duration);
    const eased=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
    camera.position.lerpVectors(flight.fromPos,flight.toPos,eased);
    controls.target.lerpVectors(flight.fromTarget,flight.toTarget,eased);
    if(k>=1)flight=null;
  }
  controls.update();
  city.update(time*.001);
  renderer.render(city.scene,camera);
  positionPins();
  const angle=controls.getAzimuthalAngle();
  const arrow=document.querySelector('.compass-arrow');
  if(arrow)arrow.style.transform='rotate('+(-angle*180/Math.PI)+'deg)';
  if(firstFrame){
    firstFrame=false;
    $('loading').classList.add('ready');
    setTimeout(()=>$('loading')?.remove(),850);
  }
}
requestAnimationFrame(animate);
