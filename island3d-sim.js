/* CTRLstudio ADGM | ONE interactive simulator.
 * 2.5D camera movement on approved aerial reference. Not GIS/photogrammetry.
 * No external WebGL libraries: the reference is always displayed.
 */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const data=window.ADGM_RESEARCH;
if(!data?.buildings?.length){document.body.classList.add('data-error');$('scene-subtitle').textContent='Nie udało się załadować inwentaryzacji budynków';return;}
const stage=$('scene'),viewport=$('viewport'),canvas=$('aerial-canvas'),photo=$('aerial-photo');
const zoneList=$('zone-list'),buildingList=$('building-list'),search=$('building-search-3d');
const path=$('flight-path'),dot=$('route-marker'),halo=$('route-marker-halo');
const status=$('flight-status'),stepLabel=$('flight-step'),progress=$('flight-progress');
const Z={
 all:{name:'Cały obszar',x:.50,y:.50,z:1},
 M:{name:'Al Maryah Island',x:.241,y:.39,z:1.63,number:'01',color:'#80c2ff'},
 T:{name:'Marina Square',x:.507,y:.525,z:1.72,number:'02',color:'#68d0cd'},
 S:{name:'Shams Abu Dhabi',x:.578,y:.330,z:1.68,number:'03',color:'#a5bfff'},
 N:{name:'Najmat Abu Dhabi',x:.664,y:.662,z:1.67,number:'04',color:'#ffb992'}
};
const IDS=['M','T','S','N'];
const TOUR=[Z.all,Z.M,Z.T,Z.S,Z.N,Z.all];
const SEG_MS=[4200,4600,4600,4600,5200],TOTAL=SEG_MS.reduce((a,b)=>a+b,0);
const map=new Map(data.buildings.map(b=>[b.code,b]));
const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const cam={x:.5,y:.5,z:1,panX:0,panY:0};
let zone='all',selected=null,flight=null,playing=false,tourStart=0,tourStep=-1,drag=null,dim={w:1,h:1,iw:1,ih:1};
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function bounds(n,lo,hi){return Math.min(hi,Math.max(lo,n));}
function ease(f){f=bounds(f,0,1);return f*f*(3-2*f);}
function resize(){
 const w=stage.clientWidth||1,h=stage.clientHeight||1,ar=1672/941;
 const iw=Math.min(w,h*ar),ih=iw/ar;
 dim={w,h,iw,ih};
 canvas.style.width=iw+'px';canvas.style.height=ih+'px';
 canvas.style.left=((w-iw)/2)+'px';canvas.style.top=((h-ih)/2)+'px';
 draw();
}
function draw(){
 const {w,h,iw,ih}=dim;
 const x0=(.5-cam.x)*iw*cam.z+cam.panX;
 const y0=(.5-cam.y)*ih*cam.z+cam.panY;
 const rangeX=Math.max(0,(iw*cam.z-w)/2),rangeY=Math.max(0,(ih*cam.z-h)/2);
 const px=bounds(x0,-rangeX,rangeX),py=bounds(y0,-rangeY,rangeY);
 canvas.style.transform='translate3d('+px+'px,'+py+'px,0) scale('+cam.z+')';
}
function go(target,ms=1350){
 flight={start:performance.now(),duration:reduced?1:ms,from:{...cam},to:{x:target.x,y:target.y,z:target.z,panX:0,panY:0}};
}
function buttonState(){
 const btn=$('demo-btn');
 btn.classList.toggle('active',playing);
 btn.setAttribute('aria-pressed',String(playing));
 btn.innerHTML=playing?'Ⅱ <span>Zatrzymaj przelot</span>':'▶ <span>Uruchom przelot</span>';
}
function stopTour(){
 playing=false;tourStep=-1;buttonState();dot.style.opacity='.5';
}
function renderZoneList(){
 zoneList.innerHTML=IDS.map(id=>{
  const x=Z[id],count=data.buildings.filter(b=>b.zone===id).length;
  return '<button type="button" class="zone-item'+(zone===id?' active':'')+'" data-zone="'+id+'" aria-pressed="'+(zone===id)+'" style="--zone-color:'+x.color+'">'+
   '<span class="zone-num">'+x.number+'</span><span><span class="zone-name">'+x.name+'</span>'+
   '<span class="zone-desc">'+count+' pozycji · wybierz strefę</span></span><span class="zone-arrow">›</span></button>';
 }).join('')+'<button class="all-zones'+(zone==='all'?' active':'')+'" data-zone="all" type="button" aria-pressed="'+(zone==='all')+'">◈ Cały obszar</button>';
 document.querySelectorAll('[data-map-zone]').forEach(el=>el.classList.toggle('is-active',el.dataset.mapZone===zone));
}
function showBuildings(){
 const q=search.value.trim().toLocaleLowerCase('pl').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const activeSearch=q.length>0;
 const items=data.buildings.filter(b=>(activeSearch?(zone==='all'||b.zone===zone):zone!=='all'&&b.zone===zone)&&(!activeSearch||[b.name,b.code,b.developer,b.shape].join(' ').toLocaleLowerCase('pl').normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q)));
 $('building-counter').textContent=zone==='all'&&!activeSearch?'—':String(items.length);
 $('building-list-title').textContent=zone==='all'&&!activeSearch?'Najpierw wybierz strefę':zone==='all'?'Wyniki wyszukiwania':Z[zone].name;
 buildingList.innerHTML=items.map(b=>'<button class="building-item'+(selected===b.code?' active':'')+'" data-code="'+esc(b.code)+'" type="button" aria-pressed="'+(selected===b.code)+'"><span class="building-symbol">▥</span><span><span class="building-title">'+esc(b.name)+'</span><span class="building-sub">'+esc(b.code)+' · '+esc(b.height||'wymiar do sprawdzenia')+'</span></span><span class="building-chevron">›</span></button>').join('')||(zone==='all'&&!activeSearch?'<div class="no-results">Wybierz jedną z czterech stref, aby zobaczyć jej budynki.</div>':'<div class="no-results">Brak obiektów spełniających kryteria.</div>');
}
function renderHeading(){
 const b=selected?map.get(selected):null;
 $('scene-heading').textContent=b?b.name:zone==='all'?'ADGM · Al Maryah + Al Reem':Z[zone].name;
 $('scene-subtitle').textContent=b?b.code+' · zbliżenie poglądowe · nie dokładna pozycja GIS':zone==='all'?'4 strefy · zatwierdzona wizualizacja · trasa kamery':(Z[zone].number+' / 04 · obiekty referencyjne');
 $('flight-step').textContent=zone==='all'?'CAŁY OBSZAR':Z[zone].number+' / 04';
 $('flight-status').textContent=playing?'PRZELOT KAMERY / '+Z[zone].name.toUpperCase():selected?'WYBRANO BUDYNEK / KADR POGLĄDOWY':zone==='all'?'TRASA 01 → 02 → 03 → 04':'STREFA / '+Z[zone].name.toUpperCase();
 document.querySelectorAll('[data-route-step]').forEach(el=>el.classList.toggle('current',el.dataset.routeStep===zone));
 const current=$('detail-route-current');if(current)current.textContent=zone==='all'?'Wybierz strefę lub uruchom przelot':(Z[zone].number+' · '+Z[zone].name);
}
function showEmpty(){
 $('detail-content').hidden=true;
 $('detail-empty').hidden=false;
 $('detail-panel').classList.remove('show');
}
function setZone(id,{demo=false,camera=true}={}){
 if(!Z[id])return;
 if(!demo)stopTour();
 zone=id;selected=null;search.value='';
 renderZoneList();showBuildings();renderHeading();showEmpty();
 if(camera)go(Z[id],1300);
 if(innerWidth<721)$('sidebar').classList.remove('open');
}
function valid(url){try{let u=new URL(url);return u.protocol==='https:'?u.href:null;}catch{return null;}}
function renderDetail(b){
 $('detail-empty').hidden=true;$('detail-content').hidden=false;
 $('detail-panel').classList.add('show');
 const values={
  'detail-zone':Z[b.zone].number+' / '+Z[b.zone].name,
  'detail-code':b.code,'detail-name':b.name,'detail-location':Z[b.zone].name,
  'detail-height':b.height||'—','detail-floors':b.floors||'—',
  'detail-year':b.year||'—','detail-status':b.status||'do sprawdzenia',
  'detail-shape':b.shape||'—','detail-where':b.where||'—','detail-notes':[b.notes,b.keep].filter(Boolean).join(' ')||'—',
  'detail-developer':b.developer||'—','detail-architect':b.architect||'—',
  'detail-coords':Array.isArray(b.position)?b.position.map(x=>Number(x).toFixed(5)).join(', ')+' (punkt orientacyjny)':'Lokalizacja niezweryfikowana'
 };
 for(const [id,value] of Object.entries(values))$(id).textContent=value;
 $('detail-warning').textContent='Wybrany budynek ma dane referencyjne. Przelot koncentruje się na strefie, a nie na zweryfikowanym obrysie tego konkretnego obiektu. Model i kadry pozostają poglądowe.';
 const links=(b.links||[]).filter(l=>valid(l.url)).slice(0,3);
 $('detail-links').innerHTML=links.map(l=>'<a href="'+esc(valid(l.url))+'" target="_blank" rel="noopener noreferrer">↗ '+esc(l.title)+'</a>').join('')+'<a href="./atlas.html">◫ Zobacz atlas budynków</a>';
}
function selectBuilding(code){
 const b=map.get(code);if(!b)return;stopTour();
 zone=b.zone;selected=code;search.value='';
 renderZoneList();showBuildings();renderHeading();renderDetail(b);
 go({...Z[zone],z:Math.min(2.02,Z[zone].z+.25)},1150);
 if(innerWidth<721)$('sidebar').classList.remove('open');
}
function startTour(){
 if(playing){stopTour();return;}
 selected=null;search.value='';playing=true;tourStep=-1;flight=null;tourStart=performance.now();
 buttonState();dot.style.opacity='1';showEmpty();
}
$('demo-btn').addEventListener('click',startTour);
$('overview-btn').addEventListener('click',()=>setZone('all'));
zoneList.addEventListener('click',e=>{const b=e.target.closest('[data-zone]');if(b)setZone(b.dataset.zone);});
buildingList.addEventListener('click',e=>{const b=e.target.closest('[data-code]');if(b)selectBuilding(b.dataset.code);});
stage.addEventListener('click',e=>{const b=e.target.closest('[data-map-zone]');if(b)setZone(b.dataset.mapZone);});
search.addEventListener('input',showBuildings);
$('detail-focus').addEventListener('click',()=>{if(selected)go({...Z[zone],z:2.05},850);});
$('detail-close').addEventListener('click',()=>{selected=null;showBuildings();renderHeading();showEmpty();});
$('mobile-menu').addEventListener('click',()=>{$('sidebar').classList.toggle('open');});
$('fullscreen-btn').addEventListener('click',()=>{if(document.fullscreenElement)document.exitFullscreen?.();else viewport.requestFullscreen?.();});
stage.addEventListener('pointerdown',e=>{
 if(e.target.closest('button,a'))return;
 stopTour();flight=null;drag={id:e.pointerId,x:e.clientX,y:e.clientY,cx:cam.panX,cy:cam.panY};
 stage.setPointerCapture?.(e.pointerId);stage.classList.add('dragging');
});
stage.addEventListener('pointermove',e=>{
 if(!drag||e.pointerId!==drag.id)return;
 cam.panX=drag.cx+e.clientX-drag.x;cam.panY=drag.cy+e.clientY-drag.y;draw();
});
function endDrag(){drag=null;stage.classList.remove('dragging');}
stage.addEventListener('pointerup',endDrag);stage.addEventListener('pointercancel',endDrag);
stage.addEventListener('wheel',e=>{
 if(e.target.closest('button,a'))return;
 e.preventDefault();stopTour();flight=null;
 cam.z=bounds(cam.z*Math.exp(-e.deltaY*.0012),1,3);
 draw();
},{passive:false});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopTour();});
window.addEventListener('message',e=>{if(e.origin===location.origin&&e.data?.type==='ctrl-adgm-pause')stopTour();});
if(window.ResizeObserver)new ResizeObserver(resize).observe(stage);
window.addEventListener('resize',resize);
photo.addEventListener('error',()=>{
 $('scene-heading').textContent='Nie można wczytać obrazu ADGM';
 $('scene-subtitle').textContent='Sprawdź plik assets/adgm-master-hq.avif';
 stage.classList.add('image-error');
 const m=document.createElement('div');m.className='image-error-overlay';
 m.textContent='Nie udało się wczytać grafiki. Dostępny jest atlas budynków i dokumentacja projektu.';stage.appendChild(m);
});
const offset=[0];for(let i=0;i<SEG_MS.length;i++)offset.push(offset[i]+SEG_MS[i]);
function animate(t){
 requestAnimationFrame(animate);
 if(playing){
  const ms=(t-tourStart)%TOTAL;
  let k=0;while(k<SEG_MS.length-1&&ms>=offset[k+1])k++;
  const f=(ms-offset[k])/SEG_MS[k],smooth=ease(bounds((f-.1)/.8,0,1));
  const a=TOUR[k],b=TOUR[k+1];
  cam.x=a.x+(b.x-a.x)*smooth;
  cam.y=a.y+(b.y-a.y)*smooth;
  cam.z=a.z+(b.z-a.z)*smooth;
  cam.panX=0;cam.panY=0;
  if(tourStep!==k){
   tourStep=k;
   const active=k===4?'all':IDS[k];
   setZone(active,{demo:true,camera:false});
  }
  progress.style.width=(ms/TOTAL*100)+'%';
  if(path&&dot){
   const len=path.getTotalLength(),ratio=k===0?0:k===4?1:(k-1+smooth)/3;
   const p=path.getPointAtLength(len*bounds(ratio,0,1));
   dot.setAttribute('cx',p.x.toFixed(1));dot.setAttribute('cy',p.y.toFixed(1));
   halo?.setAttribute('cx',p.x.toFixed(1));halo?.setAttribute('cy',p.y.toFixed(1));
  }
 }else if(flight){
  let k=ease((t-flight.start)/flight.duration);
  for(const a of ['x','y','z','panX','panY'])cam[a]=flight.from[a]+(flight.to[a]-flight.from[a])*k;
  if(k>=1)flight=null;
 }
 draw();
}
setZone('all',{demo:true,camera:false});
resize();buttonState();
if(new URLSearchParams(location.search).get('embed')==='1')document.body.classList.add('embed');
requestAnimationFrame(animate);
})();
