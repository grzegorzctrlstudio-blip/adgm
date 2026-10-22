/* CTRLstudio ADGM 3D — procedural PREVIS geometry. NOT survey-grade GIS. */
import * as THREE from 'three';

const LAT0=24.498, LON0=54.401, METERS_PER_UNIT=20;
export const ZONES={
  M:{number:'01',name:'Al Maryah Island',short:'Al Maryah',color:'#d7b36e',desc:'ADGM Square · The Galleria · Cleveland Clinic',center:[24.5003,54.3889],rx:23,rz:28},
  T:{number:'02',name:'Marina Square',short:'Marina Square',color:'#5bbfb2',desc:'Marina Square · obiekty kontekstowe Al Reem',center:[24.495,54.396],rx:24,rz:25},
  S:{number:'03',name:'Shams Abu Dhabi',short:'Shams',color:'#6f9ff2',desc:'Gate Towers · Sky/Sun · Pixel · park',center:[24.501,54.408],rx:43,rz:38},
  N:{number:'04',name:'Najmat Abu Dhabi',short:'Najmat',color:'#d98677',desc:'Reem Mall · waterfront · The Wave',center:[24.488,54.402],rx:26,rz:27}
};
export const FALLBACK={
  M07:[24.5000,54.3906],
  T01:[24.4953,54.3956],
  T03:[24.4942,54.3946],
  N01:[24.4894,54.3985],
  N02:[24.4867,54.4011],
  S02:[24.4937,54.4081],
  S04:[24.4963,54.4095],
  S06:[24.4961,54.4091],
  S09:[24.4947,54.4076]
};
export const CONTEXT_CODES=new Set(['T02','T04','T05','T06','N04','S05']);
export function toWorld(lat,lon){
  return new THREE.Vector3((lon-LON0)*101240/METERS_PER_UNIT,0,-(lat-LAT0)*111200/METERS_PER_UNIT);
}
export function locationFor(b){return b.position||FALLBACK[b.code]||null;}
const CLAMP=(n,a,b)=>Math.max(a,Math.min(b,n));
function seeded(seed){let n=seed>>>0;return ()=>{n=(1664525*n+1013904223)>>>0;return n/4294967296;};}
function polyShape(coords){
  const shape=new THREE.Shape();
  coords.forEach(([x,z],i)=>i?shape.lineTo(x,-z):shape.moveTo(x,-z));
  shape.closePath();
  return shape;
}
function polygonLand(scene,coords,shade){
  const shape=polyShape(coords);
  const geo=new THREE.ExtrudeGeometry(shape,{depth:.51,bevelEnabled:true,bevelThickness:.07,bevelSize:.09,bevelSegments:1});
  const mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:shade,roughness:.98,metalness:0}));
  mesh.rotation.x=-Math.PI/2;mesh.position.y=-.07;mesh.receiveShadow=true;scene.add(mesh);
  const pts=coords.map(([x,z])=>new THREE.Vector3(x,.55,z));
  const outline=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0xabc6b8,transparent:true,opacity:.53}));
  scene.add(outline);
}
function ellipseMesh(group,cx,cz,rx,rz,y,color,opacity,segments=72){
  const geo=new THREE.CircleGeometry(1,segments);
  const mat=new THREE.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false,side:THREE.DoubleSide});
  const m=new THREE.Mesh(geo,mat);
  m.rotation.x=-Math.PI/2;m.scale.set(rx,rz,1);m.position.set(cx,y,cz);group.add(m);return m;
}
function ellipseOutline(group,cx,cz,rx,rz,y,color,opacity){
  const pts=[];
  for(let i=0;i<97;i++){const a=i/96*Math.PI*2;pts.push(new THREE.Vector3(cx+Math.cos(a)*rx,y,cz+Math.sin(a)*rz));}
  const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color,transparent:true,opacity,depthWrite:false}));
  group.add(line);return line;
}
function ribbon(scene,points,width,y,color,opacity=1){
  const verts=[],uv=[],indices=[];
  for(let i=0;i<points.length;i++){
    const p=points[i],prev=points[Math.max(0,i-1)],next=points[Math.min(points.length-1,i+1)];
    const dx=next[0]-prev[0],dz=next[1]-prev[1],len=Math.hypot(dx,dz)||1;
    const nx=-dz/len*width/2,nz=dx/len*width/2;
    verts.push(p[0]+nx,y,p[1]+nz,p[0]-nx,y,p[1]-nz);
    uv.push(0,i,1,i);
    if(i>0){const k=i*2;indices.push(k-2,k-1,k,k-1,k+1,k);}
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
  geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();
  const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color,transparent:opacity<1,opacity,roughness:1,side:THREE.DoubleSide,depthWrite:opacity===1}));
  m.receiveShadow=true;scene.add(m);return m;
}
function buildRoads(scene){
  const c=0x3b5260,secondary=0x526874;
  // These lines are graphic massing aids, not extracted road centerlines.
  ribbon(scene,[[-71,-25],[-68,-10],[-63,4],[-58,18],[-60,30]],2.6,.52,c);
  ribbon(scene,[[-82,3],[-69,0],[-57,0],[-46,5]],2.0,.53,secondary);
  ribbon(scene,[[-42,27],[-24,28],[-7,15],[12,-4],[30,-18],[56,-20],[77,-7],[81,14],[69,33],[45,52],[18,65],[-5,58],[-25,44]],2.7,.53,c);
  ribbon(scene,[[-30,9],[-12,2],[12,7],[32,20],[55,22],[74,8]],2.0,.54,secondary);
  ribbon(scene,[[16,-40],[30,-26],[37,-7],[37,15],[29,39],[12,57]],2.0,.54,secondary);
  ribbon(scene,[[53,-43],[65,-32],[81,-20],[89,-3],[85,16]],2.0,.54,secondary);
  ribbon(scene,[[-25,30],[-32,23],[-42,17],[-53,12]],2.8,.75,0x657d85);
  ribbon(scene,[[-30,42],[-42,38],[-55,32],[-63,29]],2.2,.74,0x647a81);
  // Bridge parapets: enough to read as connections at overview distance.
  ribbon(scene,[[-25,31],[-34,24],[-44,17],[-53,12]],.18,.82,0xc7c6b7);
}
function makeTexture(base,accent,lit,seed){
  const canvas=document.createElement('canvas');canvas.width=128;canvas.height=256;
  const ctx=canvas.getContext('2d');
  const g=ctx.createLinearGradient(0,0,128,0);g.addColorStop(0,base);g.addColorStop(.5,accent);g.addColorStop(1,base);
  ctx.fillStyle=g;ctx.fillRect(0,0,128,256);
  const rnd=seeded(seed);
  for(let y=0;y<256;y+=12){
    ctx.fillStyle='rgba(1,19,33,.34)';ctx.fillRect(0,y,128,2);
    for(let x=6;x<128;x+=14){
      ctx.fillStyle=rnd()>.89?lit:'rgba(135,206,237,.22)';
      ctx.fillRect(x,y+3,9,6);
      ctx.fillStyle='rgba(6,25,39,.22)';ctx.fillRect(x+9,y+2,2,9);
    }
  }
  for(let x=0;x<128;x+=28){ctx.fillStyle='rgba(215,233,245,.28)';ctx.fillRect(x,0,2,256);}
  const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=THREE.RepeatWrapping;t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return t;
}
function buildMaterials(){
  const glassTex=makeTexture('#173c55','#457d9e','#f4d6a5',102);
  const blueTex=makeTexture('#18364b','#315d7e','#bcd8ef',103);
  const tealTex=makeTexture('#174851','#3b888c','#ffe4aa',104);
  const warmTex=makeTexture('#5b625e','#a9b3a7','#f2d7a5',105);
  const whiteTex=makeTexture('#8eaaa9','#d6dbd1','#f2ddc4',106);
  const standard=(color,map,metal=.25)=>new THREE.MeshStandardMaterial({color,map,metalness:metal,roughness:.44,side:THREE.FrontSide});
  return {
    glass:standard(0xc0e4f6,glassTex,.47),
    blue:standard(0xc0dcf4,blueTex,.43),
    teal:standard(0xb2dfda,tealTex,.35),
    warm:standard(0xe1d7c4,warmTex,.18),
    white:standard(0xf2f1e8,whiteTex,.14),
    dark:new THREE.MeshStandardMaterial({color:0x3e5768,metalness:.4,roughness:.55}),
    roof:new THREE.MeshStandardMaterial({color:0x9eb0ad,metalness:.2,roughness:.76}),
    concrete:new THREE.MeshStandardMaterial({color:0xb7b4a6,metalness:0,roughness:.92}),
    light:new THREE.MeshStandardMaterial({color:0xc3e2e8,metalness:.3,roughness:.32}),
    sand:new THREE.MeshStandardMaterial({color:0xc7b99d,roughness:.95}),
    green:new THREE.MeshStandardMaterial({color:0x64836b,roughness:1}),
    basin:new THREE.MeshStandardMaterial({color:0x124d68,metalness:.35,roughness:.35}),
    orange:new THREE.MeshStandardMaterial({color:0xc69064,metalness:.1,roughness:.55})
  };
}
function parseHeight(b){
  const m=String(b.height||'').match(/(\d+(?:[.,]\d+)?)/);
  if(m && /m\b/.test(b.height))return CLAMP(Number(m[1].replace(',','.'))/METERS_PER_UNIT,1,18);
  return null;
}
const DEFAULT_HEIGHT={M05:1.2,M07:1.1,M08:5.1,T01:8,T03:1.1,T04:1.5,T05:1.8,T06:1.5,N01:1.6,N02:.12,N03:7,N04:8,S02:4.25,S05:3.3,S06:1.1,S07:.12,S08:1.2,S09:.25};
function makeGeometryBuilder(scene,materials){
  const picking=[];
  function attach(group,geo,mat,px,y,pz,{pick=true,shadow=true}={}){
    const mesh=new THREE.Mesh(geo,mat.clone());
    mesh.position.set(px,y,pz);mesh.castShadow=shadow;mesh.receiveShadow=true;
    mesh.userData.baseColor=mesh.material.color.clone();
    if(group.userData.code){mesh.userData.code=group.userData.code;if(pick)picking.push(mesh);}
    group.add(mesh);return mesh;
  }
  function box(group,x,z,w,d,h,mat='glass',y=.5,opt={}){
    const mesh=attach(group,new THREE.BoxGeometry(w,h,d),materials[mat],x,y+h/2,z,opt);
    return mesh;
  }
  function roof(group,x,z,w,d,y,mat='roof'){
    return box(group,x,z,w,d,.14,mat,y,{pick:true,shadow:false});
  }
  function tower(group,x,z,w,d,h,mat='glass',opts={}){
    box(group,x,z,w,d,h,mat,.5);
    if(opts.cap!==false)roof(group,x,z,w+.14,d+.14,.5+h,'roof');
    if(opts.podium){
      const p=opts.podium;
      box(group,x,z,w+p,d+p,Math.min(1.2,h*.18),'concrete',.5);
    }
  }
  function rounded(group,x,z,rx,rz,h,mat='blue'){
    const mesh=attach(group,new THREE.CylinderGeometry(1,1,h,28),materials[mat],x,.5+h/2,z);
    mesh.scale.set(rx,1,rz);
    const cap=attach(group,new THREE.CylinderGeometry(1,1,.15,28),materials.roof,x,.5+h+.07,z,{pick:false});
    cap.scale.set(rx*1.06,1,rz*1.06);
  }
  function dome(group,x,z,r,h){
    const mesh=attach(group,new THREE.SphereGeometry(r,20,12,0,Math.PI*2,0,Math.PI/2),materials.light,x,.5+h,z,{pick:false});
    mesh.scale.y=.75;
  }
  function flatArea(group,x,z,rx,rz,color,opacity=.9){
    const mesh=attach(group,new THREE.CircleGeometry(1,50),new THREE.MeshBasicMaterial({color,transparent:true,opacity,side:THREE.DoubleSide}),x,.59,z,{pick:true,shadow:false});
    mesh.rotation.x=-Math.PI/2;mesh.scale.set(rx,rz,1);
  }
  return {picking,attach,box,roof,tower,rounded,dome,flatArea};
}
function makeBuilding(scene,b,m,groups,anchors){
  const loc=locationFor(b);
  if(!loc)return;
  const pos=toWorld(loc[0],loc[1]);
  const group=new THREE.Group();group.position.copy(pos);
  group.userData={code:b.code,zone:b.zone,approximate:!b.position};
  scene.add(group);groups.set(b.code,group);
  const {box,roof,tower,rounded,dome,flatArea,attach}=m;
  const h=parseHeight(b)||DEFAULT_HEIGHT[b.code]||4.6;
  const rnd=seeded(730+b.code.charCodeAt(0)*99+Number(b.code.slice(1)));
  switch(b.code){
    // Al Maryah Square: four distinct glass towers and separate central HQ.
    case 'M01':case 'M02':case 'M03':case 'M04':
      tower(group,0,0,2.7,3.1,h,'glass',{podium:.5});
      box(group,0,0,2.0,2.4,.22,'dark',.5+h+.12,{pick:false});
      break;
    case 'M05':
      for(const x of [-2.1,2.1])for(const z of [-1.3,1.3])box(group,x,z,.38,.38,1.0,'concrete',.45,{pick:false});
      box(group,0,0,5.7,3.6,1.1,'glass',1.5);
      roof(group,0,0,6.1,4.0,2.6);
      break;
    case 'M06':
      tower(group,-.65,0,2.6,3.3,h*.88,'glass',{cap:false});
      tower(group,1.05,.25,2.4,3.1,h,'glass',{cap:false});
      box(group,.2,-1.6,3.2,.35,h*.5,'orange',.5,{pick:false});
      roof(group,1.05,.25,2.7,3.4,.5+h);
      break;
    case 'M07':
      box(group,-3.2,0,6.1,6.0,1.05,'white');
      box(group,3.2,.2,6.0,5.0,1.15,'glass');
      box(group,0,3.5,7.3,2.4,.75,'warm');
      roof(group,-3.2,0,6.4,6.3,1.55);roof(group,3.2,.2,6.3,5.2,1.65);
      break;
    case 'M08':
      box(group,-1.2,.5,5.4,4.6,h*.53,'white');
      tower(group,2.0,0,3.6,3.3,h,'glass');
      box(group,-3.6,-1.3,3.2,3.1,h*.31,'white');
      break;
    // Marina Square is a compound, not one tower.
    case 'T01':{
      const pts=[[-8,-4],[-4,-6],[.5,-6],[5,-4],[8,0],[7,5],[3,7],[-2,7],[-6,5],[-8,1],[-1,1],[3,1]];
      const heights=[5.4,7.5,6.1,9.0,5.6,7.8,6.4,8.5,6.7,5.2,4.9,7.1];
      box(group,0,0,19,15,.65,'concrete');
      pts.forEach((p,i)=>tower(group,p[0],p[1],2.1+(i%3)*.2,2.1+(i%2)*.25,heights[i],i%4===0?'teal':'blue',{cap:true}));
      break;
    }
    case 'T02':rounded(group,0,0,1.55,1.6,h,'blue');box(group,0,0,4.0,3.7,.7,'concrete');break;
    case 'T03':box(group,0,0,6.5,3.9,1.05,'white');roof(group,0,0,6.8,4.1,1.55);break;
    case 'T04':
      box(group,-1.8,0,4.2,2.2,1.25,'white');box(group,2.1,0,3.8,3.2,1.45,'glass');box(group,0,-2.2,4.4,1.7,.75,'white');break;
    case 'T05':
      box(group,-3,0,4.3,3.3,1.3,'warm');box(group,3,0,4.3,3.3,1.3,'white');
      box(group,0,3,9,2.0,1.1,'warm');box(group,0,-3,9,1.8,1.1,'white');dome(group,0,0,1.55,1.4);break;
    case 'T06':
      box(group,-1.8,0,3.5,5.8,1.3,'white');box(group,1.9,0,3.4,5.7,1.2,'white');
      box(group,0,-3.3,7.6,1.4,1.15,'glass');break;
    // Najmat: waterfront remains open, no invented skyscraper forest.
    case 'N01':
      box(group,0,0,13.0,8.7,1.45,'white');
      box(group,0,-1.7,9.8,4.0,.22,'glass',1.95,{pick:false});
      roof(group,0,0,13.2,9.0,1.95);break;
    case 'N02':{
      // circular marina and a small schematic pier; NOT an invented second marina.
      flatArea(group,0,0,8.1,8.1,0x14546a,.98);
      const ring=attach(group,new THREE.RingGeometry(8.2,9.15,72),new THREE.MeshStandardMaterial({color:0xb0ac96,roughness:.95}),0,.64,0,{pick:true,shadow:false});
      ring.rotation.x=-Math.PI/2;
      box(group,0,-4.5,.65,6.0,.12,'concrete',.61);
      box(group,1.8,-2.6,3.3,.55,.12,'concrete',.61);
      break;
    }
    case 'N03':
      tower(group,0,0,3.1,2.9,h,'blue',{podium:1.4});
      break;
    case 'N04':
      box(group,0,0,7.4,4.8,.75,'concrete');
      tower(group,-2.0,0,2.8,3.0,8.1,'blue');
      tower(group,2.1,.2,2.7,2.9,6.6,'glass');
      break;
    // Shams skyline: three Gate Towers joined by the high skybridge.
    case 'S01':{
      for(const x of [-5.1,0,5.1])tower(group,x,0,3.4,3.2,11.9,'blue',{cap:false});
      const shape=new THREE.Shape();
      shape.moveTo(-7.1,0);shape.lineTo(7.1,0);shape.lineTo(7.1,1.85);shape.lineTo(-7.1,1.85);shape.closePath();
      for(const x of [-2.55,2.55]){const hole=new THREE.Path();hole.absellipse(x,.91,1.13,.63,0,Math.PI*2,false);shape.holes.push(hole);}
      const bridge=attach(group,new THREE.ExtrudeGeometry(shape,{depth:3.1,bevelEnabled:false}),materials.blue,0,10.68,-1.55);
      bridge.castShadow=true;
      box(group,0,0,14.6,3.8,.68,'concrete');
      break;
    }
    case 'S02':{
      const radius=4.6;
      for(let i=0;i<13;i++){
        const a=Math.PI*.15+i/12*Math.PI*.9;
        const x=Math.cos(a)*radius,z=Math.sin(a)*radius;
        const seg=box(group,x,z,1.6,1.9,3.6,'white');
        seg.rotation.y=-a;
      }
      break;
    }
    case 'S03':rounded(group,0,0,1.9,2.65,h,'blue');box(group,0,0,4.4,4.8,.9,'concrete');break;
    case 'S04':rounded(group,0,0,2.05,2.1,h,'glass');box(group,0,0,4.6,4.5,.9,'concrete');break;
    case 'S05':{
      const pts=[[-5,-2],[-2,-5],[2,-5],[5,-1],[4,4],[0,5],[-4,4]];
      const heights=[2.9,3.3,2.6,3.9,3.1,2.5,3.5];
      pts.forEach((p,i)=>{
        const hh=heights[i];
        tower(group,p[0],p[1],3.0,3.0,hh,'white',{cap:false});
        box(group,p[0]+.5,p[1]-.5,2.2,2.3,.55,'concrete',.5+hh,{pick:false});
        box(group,p[0]-.5,p[1]+.45,1.7,2.1,.48,'white',.5+hh+.4,{pick:false});
      });
      break;
    }
    case 'S06':
      box(group,0,0,7.1,4.6,1.0,'white');
      box(group,0,-2.2,6.2,.45,.5,'glass',.5);
      roof(group,0,0,7.3,4.8,1.5);break;
    case 'S07':{
      flatArea(group,0,0,9.0,6.0,0x527e64,.97);
      for(let i=0;i<3;i++)box(group,-6+i*6,0,.3,8,.06,'sand',.6,{pick:false,shadow:false});
      break;
    }
    case 'S08':
      box(group,-2,0,4.2,4.8,1.2,'warm');box(group,2.1,0,4.0,4.7,1.15,'white');
      box(group,0,-3.2,8.3,1.8,1.2,'warm');break;
    case 'S09':
      // An address inside Gate/Arc, not a newly invented independent tower.
      box(group,0,0,1.1,.8,.25,'light',.5,{pick:true});
      break;
    default:tower(group,0,0,2.5,2.5,h,'blue');
  }
  const bounds=new THREE.Box3().setFromObject(group);
  anchors.set(b.code,new THREE.Vector3(pos.x,Math.max(.95,bounds.max.y+1.2),pos.z));
}
function makeContext(scene,materials,anchors){
  const rnd=seeded(147825);
  const points=[];
  const specs=[
    {x0:-76,x1:-50,z0:-17,z1:24,count:14,max:4.0},
    {x0:-37,x1:-3,z0:0,z1:40,count:29,max:6.7},
    {x0:8,x1:82,z0:-43,z1:17,count:47,max:6.1}
  ];
  for(const spec of specs){
    let placed=0,attempt=0;
    while(placed<spec.count&&attempt++<spec.count*35){
      const x=spec.x0+rnd()*(spec.x1-spec.x0),z=spec.z0+rnd()*(spec.z1-spec.z0);
      const tooClose=[...anchors.values()].some(p=>Math.hypot(p.x-x,p.z-z)<(p.y>6?5.3:4.0));
      if(tooClose||Math.hypot(x-31,z+37)<12||Math.hypot(x-70,z+36)<12||Math.hypot(x-33,z-21)<11||Math.hypot(x+28,z-16)<13)continue;
      points.push([x,z,1.2+rnd()*spec.max,1.2+rnd()*1.2,1.3+rnd()*1.2]);
      placed++;
    }
  }
  const geo=new THREE.BoxGeometry(1,1,1);
  const mesh=new THREE.InstancedMesh(geo,materials.dark,points.length);
  mesh.castShadow=true;mesh.receiveShadow=true;
  const obj=new THREE.Object3D();
  const color=new THREE.Color();
  points.forEach(([x,z,h,w,d],i)=>{
    obj.position.set(x,.5+h/2,z);obj.scale.set(w,h,d);obj.updateMatrix();mesh.setMatrixAt(i,obj.matrix);
    color.setHSL(.55,.13,.32+rnd()*.13);mesh.setColorAt(i,color);
  });
  mesh.instanceMatrix.needsUpdate=true;scene.add(mesh);
  return mesh;
}
function makeTrees(scene){
  const rnd=seeded(488);
  const positions=[];
  const patches=[{cx:31,cz:-37,rx:8.2,rz:5.2,count:50},{cx:-67,cz:24,rx:6,rz:3.5,count:17},{cx:-56,cz:-20,rx:5,rz:3,count:15},{cx:-13,cz:46,rx:8,rz:3,count:16},{cx:60,cz:-38,rx:5,rz:3,count:16}];
  patches.forEach(p=>{
    for(let i=0;i<p.count;i++){
      const a=rnd()*Math.PI*2,r=Math.sqrt(rnd());
      positions.push([p.cx+Math.cos(a)*r*p.rx,p.cz+Math.sin(a)*r*p.rz,.7+rnd()*.6]);
    }
  });
  const crown=new THREE.InstancedMesh(new THREE.ConeGeometry(.28,.9,5),new THREE.MeshStandardMaterial({color:0x426f54,roughness:1}),positions.length);
  const trunk=new THREE.InstancedMesh(new THREE.CylinderGeometry(.05,.08,.6,5),new THREE.MeshStandardMaterial({color:0x665947,roughness:1}),positions.length);
  const obj=new THREE.Object3D();
  positions.forEach(([x,z,scale],i)=>{
    obj.position.set(x,.55+.42*scale,z);obj.scale.set(scale,scale,scale);obj.updateMatrix();crown.setMatrixAt(i,obj.matrix);
    obj.position.set(x,.55+.15*scale,z);obj.scale.set(scale,scale,scale);obj.updateMatrix();trunk.setMatrixAt(i,obj.matrix);
  });
  crown.instanceMatrix.needsUpdate=true;trunk.instanceMatrix.needsUpdate=true;
  scene.add(crown,trunk);
}
export function createCity(buildings){
  const scene=new THREE.Scene();
  scene.background=new THREE.Color('#0b263a');
  scene.fog=new THREE.FogExp2(0x0b263a,.0020);
  scene.add(new THREE.HemisphereLight(0xc5e4ff,0x4b625a,2.45));
  const sun=new THREE.DirectionalLight(0xffd2a2,3.25);
  sun.position.set(-80,115,-95);sun.castShadow=true;
  sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-135;sun.shadow.camera.right=135;sun.shadow.camera.top=135;sun.shadow.camera.bottom=-135;sun.shadow.camera.near=1;sun.shadow.camera.far=350;sun.shadow.bias=-.0005;
  scene.add(sun,sun.target);
  const fill=new THREE.DirectionalLight(0x80c8ff,.65);fill.position.set(80,30,110);scene.add(fill);
  const waterMat=new THREE.ShaderMaterial({
    uniforms:{uTime:{value:0},uA:{value:new THREE.Color('#0a3047')},uB:{value:new THREE.Color('#1b5466')}},
    vertexShader:'varying vec3 vPos;void main(){vec4 p=modelMatrix*vec4(position,1.0);vPos=p.xyz;gl_Position=projectionMatrix*viewMatrix*p;}',
    fragmentShader:'uniform float uTime;uniform vec3 uA;uniform vec3 uB;varying vec3 vPos;void main(){float a=sin(vPos.x*.20+uTime*.15)*sin(vPos.z*.18-uTime*.12);float b=sin(vPos.x*.86+vPos.z*.46+uTime*.45)*sin(vPos.z*.55-uTime*.27);float c=pow(max(0.,sin(vPos.x*1.25-vPos.z*.7+uTime*.25)),25.)*.06;vec3 col=mix(uA,uB,clamp(.38+a*.22+b*.075,0.,1.));col+=vec3(c);gl_FragColor=vec4(col,1.);}',
    side:THREE.DoubleSide
  });
  const water=new THREE.Mesh(new THREE.PlaneGeometry(800,800),waterMat);
  water.rotation.x=-Math.PI/2;water.position.y=-.22;scene.add(water);
  // Simplified coastline massing — schematic, deliberately not presented as cadastral geometry.
  polygonLand(scene,[[-84,-18],[-79,-31],[-67,-37],[-51,-30],[-44,-19],[-42,-1],[-45,20],[-54,38],[-67,44],[-79,34],[-86,15],[-86,-5]],0x7d9188);
  polygonLand(scene,[[-47,15],[-44,-8],[-35,-29],[-11,-48],[18,-61],[42,-60],[72,-49],[94,-35],[106,-14],[110,11],[103,35],[89,56],[64,75],[37,91],[12,94],[-13,79],[-34,57],[-45,36]],0x84978b);
  buildRoads(scene);
  const materials=buildMaterials();
  const builder=makeGeometryBuilder(scene,materials);
  const groups=new Map(),anchors=new Map();
  for(const b of buildings)makeBuilding(scene,b,builder,groups,anchors);
  makeContext(scene,materials,anchors);
  makeTrees(scene);
  const zoneOverlays={};
  for(const [id,info] of Object.entries(ZONES)){
    const pos=toWorld(...info.center);
    const g=new THREE.Group();scene.add(g);
    const color=new THREE.Color(info.color);
    const fill=ellipseMesh(g,pos.x,pos.z,info.rx,info.rz,.565,color,.018);
    const edge=ellipseOutline(g,pos.x,pos.z,info.rx,info.rz,.575,color,.26);
    zoneOverlays[id]={group:g,fill,edge,center:pos};
  }
  const selectionRing=new THREE.Mesh(new THREE.RingGeometry(2.5,2.82,56),new THREE.MeshBasicMaterial({color:0xffd59b,transparent:true,opacity:.9,depthWrite:false,side:THREE.DoubleSide}));
  selectionRing.rotation.x=-Math.PI/2;selectionRing.position.y=.69;selectionRing.visible=false;scene.add(selectionRing);
  let selectionBox=null;
  function setZone(active){
    for(const [id,ov] of Object.entries(zoneOverlays)){
      ov.fill.material.opacity=(!active||active==='all')?.018:(id===active?.115:.009);
      ov.edge.material.opacity=(!active||active==='all')?.26:(id===active?.92:.12);
    }
    for(const [code,g] of groups){
      const dim=active&&active!=='all'&&g.userData.zone!==active;
      g.traverse(o=>{
        if(o.isMesh&&o.userData.baseColor&&o.material.color){
          o.material.color.copy(o.userData.baseColor);
          if(dim)o.material.color.multiplyScalar(.43);
        }
      });
    }
  }
  function select(code){
    if(selectionBox){scene.remove(selectionBox);selectionBox.geometry.dispose();selectionBox.material.dispose();selectionBox=null;}
    const g=groups.get(code);
    if(!g){selectionRing.visible=false;return;}
    const bounds=new THREE.Box3().setFromObject(g);
    selectionBox=new THREE.Box3Helper(bounds,0xffd5a0);selectionBox.material.transparent=true;selectionBox.material.opacity=.82;selectionBox.material.depthTest=false;scene.add(selectionBox);
    selectionRing.position.set(g.position.x,.70,g.position.z);
    const size=new THREE.Vector3();bounds.getSize(size);
    const rad=CLAMP(Math.max(size.x,size.z)*.65,2.7,13);
    selectionRing.geometry.dispose();selectionRing.geometry=new THREE.RingGeometry(rad,rad+.27,64);
    selectionRing.visible=true;
  }
  function update(t){
    waterMat.uniforms.uTime.value=t;
    if(selectionRing.visible)selectionRing.material.opacity=.56+.33*Math.sin(t*2.1);
  }
  return {scene,groups,anchors,picking:builder.picking,zoneOverlays,setZone,select,update};
}