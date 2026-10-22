/* CTRLstudio ADGM — Canvas 2D fallback. Orbitable projected 3D blockout, no WebGL or CDN required. */
(function(){
'use strict';
const D=()=>window.ADGM_RESEARCH;
const $=id=>document.getElementById(id);
const zones={
 M:{n:'01',name:'Al Maryah Island',color:'#d7b36e',center:[24.5003,54.3889],r:22},
 T:{n:'02',name:'Marina Square',color:'#5bbfb2',center:[24.495,54.396],r:24},
 S:{n:'03',name:'Shams Abu Dhabi',color:'#6f9ff2',center:[24.501,54.408],r:36},
 N:{n:'04',name:'Najmat Abu Dhabi',color:'#d98677',center:[24.488,54.402],r:25}
};
const fallback={M07:[24.5000,54.3906],T01:[24.4953,54.3956],T03:[24.4942,54.3946],N01:[24.4894,54.3985],N02:[24.4867,54.4011],S02:[24.4937,54.4081],S04:[24.4963,54.4095],S06:[24.4961,54.4091],S09:[24.4947,54.4076]};
const landM=[[-84,-18],[-79,-31],[-67,-37],[-51,-30],[-44,-19],[-42,-1],[-45,20],[-54,38],[-67,44],[-79,34],[-86,15],[-86,-5]];
const landR=[[-47,15],[-44,-8],[-35,-29],[-11,-48],[18,-61],[42,-60],[72,-49],[94,-35],[106,-14],[110,11],[103,35],[89,56],[64,75],[37,91],[12,94],[-13,79],[-34,57],[-45,36]];
const world=ll=>({x:(ll[1]-54.401)*5062,z:-(ll[0]-24.498)*5560});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const htmlEscape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function parts(b){
 const hMatch=String(b.height||'').match(/(\d+(?:[.,]\d+)?)\s*m/);
 let h=hMatch?clamp(parseFloat(hMatch[1].replace(',','.'))/20,.8,19):({M05:1.1,M07:1.1,M08:4.8,T01:8,T03:1.1,T04:1.4,T05:1.5,T06:1.2,N01:1.5,N02:.1,S02:4.1,S05:3.2,S06:1,S07:.08,S08:1.2,S09:.25}[b.code]||5);
 const block=(x,z,w,d,hh=h)=>({x,z,w,d,h:hh});
 switch(b.code){
  case 'S01':return [-5.2,0,5.2].map(x=>block(x,0,3.3,3.3,11.9)).concat([block(0,0,14.1,3.2,1.3)]);
  case 'S02':return Array.from({length:12},(_,i)=>{let a=.3+i*.19;return block(Math.cos(a)*4.4,Math.sin(a)*4.4,1.7,1.8,3.7)});
  case 'S03':case 'S04':return [block(0,0,3.7,3.4,h),block(0,0,5.3,5.3,.7)];
  case 'S05':return [[-5,-2],[-2,-5],[2,-5],[5,-1],[4,4],[0,5],[-4,4]].map((p,i)=>block(p[0],p[1],2.8,2.8,2.7+(i%3)*.55));
  case 'T01':return [[-8,-4],[-4,-6],[.5,-6],[5,-4],[8,0],[7,5],[3,7],[-2,7],[-6,5],[-8,1],[-1,1],[3,1]].map((p,i)=>block(p[0],p[1],2.1,2.1,4.5+(i%5)*.9));
  case 'N04':return [block(-2,0,2.8,3.1,8.1),block(2.1,0,2.8,3,6.6)];
  case 'M06':return [block(-.9,0,2.8,3.1,h*.88),block(1.1,0,2.8,3.1,h)];
  case 'M07':return [block(-3,0,6,6,1),block(3,0,6,5,1.1),block(0,3.5,7,2,.8)];
  case 'M08':return [block(-1,0,5.4,4.6,h*.55),block(2,0,3.5,3.3,h)];
  case 'T05':return [block(-3,0,4.3,3.3,1.3),block(3,0,4.3,3.3,1.3),block(0,3,9,2,1.1)];
  case 'T06':case 'S08':return [block(-2,0,3.5,5,1.2),block(2,0,3.5,5,1.2),block(0,-3.2,8,1.8,1.1)];
  case 'N01':return [block(0,0,13,8.7,1.5)];
  case 'S07':return [block(0,0,17,12,.07)];
  case 'N02':return [block(0,0,13,10,.07)];
  case 'S06':return [block(0,0,7,4.6,1)];
  case 'T03':return [block(0,0,6.5,4,1.1)];
  default:return [block(0,0,2.7,3.1,h)];
 }
}
function start(reason){
 if(window.__ADGM_FALLBACK_RUNNING)return;
 const data=D(),stage=$('scene'),loading=$('loading');
 if(!data?.buildings||!stage)return;
 window.__ADGM_FALLBACK_RUNNING=true;
 stage.querySelectorAll('canvas').forEach(c=>c.remove());
 const canvas=document.createElement('canvas');canvas.style.cssText='width:100%;height:100%;display:block;touch-action:none;cursor:grab';
 stage.appendChild(canvas);
 const ctx=canvas.getContext('2d',{alpha:false});
 if(!ctx){if(loading)loading.innerHTML='<div class="loading-title">Podgląd 3D niedostępny</div><div class="loading-sub">Nie można uruchomić nawet trybu Canvas 2D.</div>';return;}
 if(loading){loading.classList.add('ready');setTimeout(()=>loading.remove(),650);}
 const models=data.buildings.map(b=>({b,p:world(b.position||fallback[b.code]||zones[b.zone].center),parts:parts(b)}));
 const modelByCode=new Map(models.map(m=>[m.b.code,m]));
 const state={zone:'all',code:null,yaw:-.35,pitch:.68,zoom:1,targetX:0,targetZ:12,search:'',demo:false,active:'overview'};
 const view={overview:{yaw:-.35,pitch:.68,zoom:1,x:0,z:12},top:{yaw:0,pitch:1.54,zoom:1.15,x:0,z:12},shams:{yaw:-.65,pitch:.45,zoom:1.9,x:35,z:5},waterfront:{yaw:.3,pitch:.53,zoom:1.55,x:5,z:28}};
 let width=0,height=0,scale=1,hotspots=[],drag=null,dirty=true,demoTimers=[],frame=0;
 const pickables=[];
 const toScreen=(x,y,z)=>{
  const dx=x-state.targetX,dz=z-state.targetZ,ca=Math.cos(state.yaw),sa=Math.sin(state.yaw);
  const sx=dx*ca-dz*sa,depth=dx*sa+dz*ca;
  return {x:width*.5+sx*scale,y:height*.54+(depth*Math.sin(state.pitch)-y*Math.cos(state.pitch))*scale,depth};
 };
 const path=points=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();};
 function fill(points,color,stroke){
  path(points);ctx.fillStyle=color;ctx.fill();
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.8;ctx.stroke();}
 }
 function renderLand(poly,color){
  fill(poly.map(p=>toScreen(p[0],0,p[1])),color,'rgba(217,229,209,.55)');
 }
 function drawBlock(model,part,highlight){
  const x=model.p.x+part.x,z=model.p.z+part.z,w=part.w/2,d=part.d/2,h=part.h;
  const corners=[[-w,-d],[w,-d],[w,d],[-w,d]];
  const base=corners.map(([dx,dz])=>toScreen(x+dx,.5,z+dz));
  const top=corners.map(([dx,dz])=>toScreen(x+dx,h+.5,z+dz));
  const palette=highlight?['#e5c98d','#b69c68','#f7dfa4']:model.b.zone==='M'?['#5586a2','#284f6b','#86b4ca']:model.b.zone==='T'?['#458b90','#205963','#8cbcb5']:model.b.zone==='S'?['#4c789c','#284a71','#89aec7']:['#9b796d','#654c53','#d1a89a'];
  const light=palette[0],dark=palette[1],roof=palette[2];
  // Back-to-front face ordering based on camera azimuth.
  const faces=[{ids:[0,1],depth:(base[0].depth+base[1].depth)/2},{ids:[1,2],depth:(base[1].depth+base[2].depth)/2},{ids:[2,3],depth:(base[2].depth+base[3].depth)/2},{ids:[3,0],depth:(base[3].depth+base[0].depth)/2}].sort((a,b)=>a.depth-b.depth);
  for(const face of faces){
   const [i,j]=face.ids;
   fill([base[i],base[j],top[j],top[i]],(i%2===0?light:dark),'rgba(195,229,239,.18)');
   if(h>2){
    ctx.strokeStyle='rgba(190,228,245,.24)';ctx.lineWidth=.65;
    for(let k=1;k<Math.min(18,Math.floor(h*2.4));k++){
     const t=k/Math.min(18,Math.floor(h*2.4));
     const a={x:base[i].x+(top[i].x-base[i].x)*t,y:base[i].y+(top[i].y-base[i].y)*t};
     const b={x:base[j].x+(top[j].x-base[j].x)*t,y:base[j].y+(top[j].y-base[j].y)*t};
     ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
    }
   }
  }
  fill(top,roof,highlight?'#ffebbd':'rgba(231,248,255,.4)');
  if(highlight){ctx.strokeStyle='#f7cf86';ctx.lineWidth=2;path(top);ctx.stroke();}
  hotspots.push({code:model.b.code,polys:[top,...faces.map(f=>[base[f.ids[0]],base[f.ids[1]],top[f.ids[1]],top[f.ids[0]]])],center:toScreen(x,h+.6,z)});
 }
 function drawZone(zid){
  const z=zones[zid],p=world(z.center);
  const points=Array.from({length:65},(_,i)=>{const a=i*Math.PI*2/64;return toScreen(p.x+Math.cos(a)*z.r,.65,p.z+Math.sin(a)*z.r)});
  ctx.save();path(points);ctx.fillStyle=zid===state.zone?'rgba(131,197,239,.13)':'rgba(110,183,217,.035)';ctx.fill();
  ctx.strokeStyle=z.color;ctx.lineWidth=zid===state.zone?2.8:1.1;ctx.setLineDash([7,5]);ctx.stroke();ctx.setLineDash([]);ctx.restore();
 }
 function drawLabel(x,y,text,color,code){
  ctx.font='bold 11px -apple-system,BlinkMacSystemFont,Arial';
  const w=ctx.measureText(text).width+19;
  x=clamp(x,8,width-w-8);y=clamp(y,38,height-130);
  ctx.fillStyle='rgba(6,25,43,.91)';ctx.strokeStyle=color;ctx.lineWidth=1;
  ctx.beginPath();ctx.roundRect(x,y,w,25,5);ctx.fill();ctx.stroke();
  ctx.fillStyle='#f0f7ff';ctx.fillText(text,x+9,y+16);
  pickables.push({code,x,y,w,h:25});
 }
 function paint(){
  if(!width||!height)return;
  hotspots=[];pickables=[];
  const bg=ctx.createLinearGradient(0,0,width,height);
  bg.addColorStop(0,'#071c2d');bg.addColorStop(.55,'#123b51');bg.addColorStop(1,'#082638');
  ctx.fillStyle=bg;ctx.fillRect(0,0,width,height);
  ctx.strokeStyle='rgba(113,180,208,.07)';ctx.lineWidth=1;
  for(let i=-240;i<=240;i+=20){
   let a=toScreen(i,-.15,-180),b=toScreen(i,-.15,190);
   ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
   a=toScreen(-210,-.15,i);b=toScreen(210,-.15,i);
   ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
  }
  renderLand(landM,'#627b77');renderLand(landR,'#6b837b');
  for(const zid of Object.keys(zones))drawZone(zid);
  const ordered=[];
  for(const m of models){
   if(state.zone!=='all'&&m.b.zone!==state.zone)continue;
   const center=toScreen(m.p.x,0,m.p.z);
   for(const p of m.parts)ordered.push({m,p,depth:center.depth+p.x*Math.sin(state.yaw)+p.z*Math.cos(state.yaw)});
  }
  ordered.sort((a,b)=>a.depth-b.depth);
  for(const {m,p} of ordered)drawBlock(m,p,state.code===m.b.code);
  if(state.zone==='all'){
   for(const [id,z] of Object.entries(zones)){
    const p=world(z.center),v=toScreen(p.x,2,p.z);
    drawLabel(v.x-40,v.y-38,z.n+' '+z.name,z.color,'zone:'+id);
   }
  }else{
   const labelSet=new Set();
   for(const {m} of ordered){
    if(labelSet.has(m.b.code))continue;
    labelSet.add(m.b.code);
    if(state.code&&m.b.code!==state.code)continue;
    const v=toScreen(m.p.x,Math.max(...m.parts.map(p=>p.h))+1,m.p.z);
    if(v.x>0&&v.x<width&&v.y>45&&v.y<height-130)drawLabel(v.x-36,v.y-27,m.b.name,zones[m.b.zone].color,m.b.code);
   }
  }
  ctx.fillStyle='rgba(3,19,33,.65)';ctx.fillRect(12,height-112,170,25);
  ctx.font='bold 10px Arial';ctx.fillStyle='#c6deee';ctx.fillText('CANVAS 3D · TRYB KOMPATYBILNY',20,height-96);
 }
 function invalidate(){dirty=true;}
 function resize(){
  const rect=stage.getBoundingClientRect();
  width=Math.round(rect.width);height=Math.round(rect.height);
  if(!width||!height)return;
  const dpr=Math.min(devicePixelRatio||1,2);
  canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
  scale=Math.min(width/235,height/165)*.82*state.zoom;
  invalidate();
 }
 function animate(){if(dirty){paint();dirty=false;}frame=requestAnimationFrame(animate);}
 function setCamera({yaw,pitch,zoom,x,z}){
  if(yaw!==undefined)state.yaw=yaw;
  if(pitch!==undefined)state.pitch=clamp(pitch,.18,1.55);
  if(zoom!==undefined)state.zoom=clamp(zoom,.55,7);
  if(x!==undefined)state.targetX=x;
  if(z!==undefined)state.targetZ=z;
  scale=Math.min(width/235,height/165)*.82*state.zoom;invalidate();
 }
 function heading(){
  if(state.code){const m=modelByCode.get(state.code);$('scene-heading').textContent=m.b.name;$('scene-subtitle').textContent=zones[m.b.zone].name+' · '+m.b.code+' · bryła robocza';}
  else if(state.zone==='all'){$('scene-heading').textContent='Al Maryah + Al Reem';$('scene-subtitle').textContent='4 strefy · 27 pozycji · model koncepcyjny';}
  else{$('scene-heading').textContent=zones[state.zone].name;$('scene-subtitle').textContent='Wybierz budynek na modelu lub liście';}
 }
 function renderZones(){
  $('zone-list').innerHTML=Object.entries(zones).map(([id,z])=>{
   const n=models.filter(m=>m.b.zone===id).length;
   return '<button class="zone-item '+(state.zone===id?'active':'')+'" type="button" data-zone="'+id+'" style="--zone-color:'+z.color+'"><span class="zone-num">'+z.n+'</span><span><span class="zone-name">'+z.name+'</span><span class="zone-desc">'+n+' pozycji · wybierz strefę</span></span><span class="zone-arrow">›</span></button>';
  }).join('')+'<button class="all-zones '+(state.zone==='all'?'active':'')+'" data-zone="all" type="button">◈ &nbsp; Pokaż wszystkie cztery strefy</button>';
 }
 function renderBuildings(){
  const q=state.search.toLocaleLowerCase('pl');
  const list=models.filter(m=>(state.zone==='all'||m.b.zone===state.zone)&&(!q||(m.b.name+' '+m.b.code).toLocaleLowerCase('pl').includes(q)));
  $('building-counter').textContent=list.length;
  $('building-list-title').textContent=state.zone==='all'?'Wszystkie obiekty':zones[state.zone].name;
  $('building-list').innerHTML=list.map(m=>'<button class="building-item '+(state.code===m.b.code?'active':'')+'" type="button" data-code="'+m.b.code+'"><span class="building-symbol">▥</span><span><span class="building-title">'+htmlEscape(m.b.name)+'</span><span class="building-sub">'+m.b.code+' · '+htmlEscape(m.b.height||'gabaryt roboczy')+'</span></span><span class="building-chevron">›</span></button>').join('')||'<div class="no-results">Brak wyników.</div>';
 }
 function closeDetails(){
  $('detail-panel').classList.remove('show');$('detail-empty').hidden=false;$('detail-content').hidden=true;
 }
 function showDetails(b){
  $('detail-panel').classList.add('show');$('detail-empty').hidden=true;$('detail-content').hidden=false;
  const vals={'detail-zone':zones[b.zone].name,'detail-code':b.code,'detail-name':b.name,'detail-location':zones[b.zone].name,'detail-height':b.height||'—','detail-floors':b.floors||'—','detail-year':b.year||'—','detail-status':b.status||'—','detail-shape':b.shape||'—','detail-where':b.where||'—','detail-notes':b.notes||'—','detail-developer':b.developer||'—','detail-architect':b.architect||'—'};
  for(const [id,val] of Object.entries(vals))$(id).textContent=val;
  const ll=b.position||fallback[b.code];
  $('detail-coords').textContent=ll?ll.map(n=>n.toFixed(5)).join(', ')+(b.position?' (orientacyjne)':' (robocze)'):'Do sprawdzenia';
  $('detail-warning').textContent='Roboczy model 3D w trybie Canvas: bryły i linia brzegowa są schematyczne. Nie jest to dokładna geometria GIS ani zweryfikowana architektura.';
  $('detail-links').innerHTML='<a href="./index.html">◫ &nbsp; Atlas zdjęć i lokalizacji</a>';
 }
 function stopDemo(){state.demo=false;demoTimers.forEach(clearTimeout);demoTimers=[];$('demo-btn').classList.remove('active');}
 function selectZone(id,keepDemo=false){
  if(!keepDemo)stopDemo();
  if(id!=='all'&&!zones[id])return;
  state.zone=id;state.code=null;state.search='';$('building-search-3d').value='';
  closeDetails();heading();renderZones();renderBuildings();
  if(id==='all')setCamera(view.overview);
  else{const p=world(zones[id].center);setCamera({yaw:-.4,pitch:.65,zoom:id==='S'?2.2:2.65,x:p.x,z:p.z});}
  $('sidebar').classList.remove('open');invalidate();
 }
 function selectBuilding(code,keepDemo=false){
  const m=modelByCode.get(code);if(!m)return;
  if(!keepDemo)stopDemo();
  state.zone=m.b.zone;state.code=code;
  heading();renderZones();renderBuildings();showDetails(m.b);
  const hh=Math.max(...m.parts.map(p=>p.h));
  setCamera({yaw:-.4,pitch:.54,zoom:hh>8?3.7:4.8,x:m.p.x,z:m.p.z});
  $('sidebar').classList.remove('open');
 }
 function preset(name){
  stopDemo();state.active=name;
  document.querySelectorAll('[data-view]').forEach(el=>el.classList.toggle('active',el.dataset.view===name));
  if(name==='selected'){if(state.code)selectBuilding(state.code);else selectZone(state.zone);}
  else if(view[name])setCamera(view[name]);
 }
 $('zone-list').addEventListener('click',e=>{const el=e.target.closest('[data-zone]');if(el)selectZone(el.dataset.zone);});
 $('building-list').addEventListener('click',e=>{const el=e.target.closest('[data-code]');if(el)selectBuilding(el.dataset.code);});
 $('building-search-3d').addEventListener('input',e=>{state.search=e.target.value;renderBuildings();});
 $('detail-close').addEventListener('click',()=>{state.code=null;closeDetails();renderBuildings();heading();invalidate();});
 $('detail-focus').addEventListener('click',()=>{if(state.code)selectBuilding(state.code);});
 $('overview-btn').addEventListener('click',()=>selectZone('all'));
 $('mobile-menu').addEventListener('click',()=>{$('sidebar').classList.toggle('open');$('detail-panel').classList.remove('show');});
 document.querySelectorAll('[data-view]').forEach(el=>el.addEventListener('click',()=>preset(el.dataset.view)));
 $('fullscreen-btn').addEventListener('click',()=>{if(document.fullscreenElement)document.exitFullscreen?.();else $('viewport').requestFullscreen?.();});
 $('capture-btn')?.addEventListener('click',()=>{paint();const a=document.createElement('a');a.download='CTRLstudio_ADGM_3D_'+(state.code||state.zone)+'.png';a.href=canvas.toDataURL('image/png');a.click();});
 $('demo-btn').addEventListener('click',()=>{
  if(state.demo){stopDemo();return;}
  state.demo=true;$('demo-btn').classList.add('active');
  const steps=[['M','M02'],['T','T01'],['S','S01'],['N','N01']];
  let i=0;
  const next=()=>{
   if(!state.demo)return;
   const [z,c]=steps[i++%steps.length];selectZone(z,true);
   demoTimers.push(setTimeout(()=>{if(state.demo)selectBuilding(c,true);},1600));
   demoTimers.push(setTimeout(next,5400));
  };next();
 });
 const pointers=new Map();let pinchDist=0;
 canvas.addEventListener('pointerdown',e=>{
  canvas.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pointers.size===1)drag={x:e.clientX,y:e.clientY,moved:false};
  if(pointers.size===2){const a=[...pointers.values()];pinchDist=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);drag=null;}
  stopDemo();
 });
 canvas.addEventListener('pointermove',e=>{
  if(!pointers.has(e.pointerId))return;
  const prev=pointers.get(e.pointerId);
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pointers.size===2){
   const a=[...pointers.values()],dist=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);
   if(pinchDist>0)setCamera({zoom:state.zoom*dist/pinchDist});
   pinchDist=dist;return;
  }
  const dx=e.clientX-prev.x,dy=e.clientY-prev.y;
  if(drag&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>6)drag.moved=true;
  if(e.buttons===2||e.shiftKey){setCamera({x:state.targetX-dx/scale,z:state.targetZ-dy/scale});}
  else setCamera({yaw:state.yaw+dx*.009,pitch:state.pitch-dy*.006});
 });
 canvas.addEventListener('pointerup',e=>{
  const click=drag&&!drag.moved&&pointers.size===1;
  pointers.delete(e.pointerId);
  if(click){
   const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
   const label=pickables.slice().reverse().find(p=>x>=p.x&&x<=p.x+p.w&&y>=p.y&&y<=p.y+p.h);
   if(label){if(label.code.startsWith('zone:'))selectZone(label.code.slice(5));else selectBuilding(label.code);}
   else{
    const hit=hotspots.slice().reverse().find(h=>h.polys.some(poly=>inside(x,y,poly)));
    if(hit)selectBuilding(hit.code);
   }
  }
  drag=null;pinchDist=0;
 });
 canvas.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);drag=null;});
 canvas.addEventListener('wheel',e=>{e.preventDefault();setCamera({zoom:state.zoom*(e.deltaY>0?.88:1.13)});},{passive:false});
 canvas.addEventListener('contextmenu',e=>e.preventDefault());
 window.addEventListener('keydown',e=>{if(e.key==='Escape'){$('sidebar').classList.remove('open');closeDetails();}});
 function inside(x,y,poly){let flag=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a.y>y)!==(b.y>y)&&x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x)flag=!flag;}return flag;}
 if(window.ResizeObserver)new ResizeObserver(resize).observe(stage);
 window.addEventListener('resize',resize);
 renderZones();renderBuildings();heading();closeDetails();resize();animate();
 console.info('ADGM 3D Canvas compatibility mode active',reason||'WebGL unavailable');
}
window.ADGMFallback={start};
})();