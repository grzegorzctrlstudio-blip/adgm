/* CTRLstudio ADGM - cinematic visual upgrade, schematic geometry only */
window.CTRLRealism=function(o){
'use strict';
const {THREE,scene,renderer,sun,earth,sea}=o;
const mobile=window.innerWidth<740;
const uniforms={time:{value:0}};
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.22;
sun.intensity=3.35;
sun.color.set('#ffe4bd');
sun.position.set(-95,155,-82);
sun.castShadow=true;
sun.shadow.mapSize.set(mobile?512:1024,mobile?512:1024);
sun.shadow.camera.left=-135;sun.shadow.camera.right=135;
sun.shadow.camera.top=100;sun.shadow.camera.bottom=-100;
sun.shadow.camera.near=1;sun.shadow.camera.far=400;
sun.shadow.normalBias=.045;sun.shadow.bias=-.00025;sun.shadow.radius=3;
const hemi=new THREE.HemisphereLight('#c7e8ff','#b0a18e',.8);scene.add(hemi);
scene.fog=new THREE.FogExp2('#98b6bf',.0011);
const sky=new THREE.Mesh(new THREE.SphereGeometry(780,32,16),new THREE.ShaderMaterial({
side:THREE.BackSide,depthWrite:false,fog:false,
uniforms:{top:{value:new THREE.Color('#417b9d')},horizon:{value:new THREE.Color('#e5c6a0')}},
vertexShader:'varying vec3 vDir; void main(){vDir=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
fragmentShader:'uniform vec3 top;uniform vec3 horizon;varying vec3 vDir;void main(){float h=clamp(normalize(vDir).y,0.,1.);vec3 col=mix(horizon,top,pow(h,.53));gl_FragColor=vec4(col,1.);}'
}));sky.frustumCulled=false;scene.add(sky);
const water=new THREE.ShaderMaterial({toneMapped:false,
uniforms:{time:uniforms.time,day:{value:1},deep:{value:new THREE.Color('#174d67')},shallow:{value:new THREE.Color('#388999')}},
vertexShader:'varying vec3 wPos; void main(){vec4 w=modelMatrix*vec4(position,1.0);wPos=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
fragmentShader:[
'uniform float time;uniform float day;uniform vec3 deep;uniform vec3 shallow;',
'varying vec3 wPos;',
'void main(){vec2 p=wPos.xz;',
'float wave=sin(p.x*.46+p.y*.26+time*.72)*.5+sin(p.y*.74-p.x*.31+time*.91)*.25;',
'float fine=sin(p.x*2.4+p.y*1.7+time*1.25)*sin(p.y*2.8-time*1.8);',
'float glint=pow(max(0.,wave*.65+fine*.35),11.)*.22;',
'vec3 color=mix(deep,shallow,.27+wave*.06)+vec3(.9,.75,.51)*glint*day;',
'gl_FragColor=vec4(color,1.);',
'}'].join('\n')
});
sea.material=water;sea.geometry.dispose();sea.geometry=new THREE.PlaneGeometry(2400,2400);sea.position.y=-.24;
earth.material.roughness=.91;earth.material.metalness=.01;
earth.material.onBeforeCompile=function(shader){
shader.uniforms.uADGMTime=uniforms.time;
shader.fragmentShader='uniform float uADGMTime;\n'+shader.fragmentShader;
shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',[
'#ifdef USE_MAP',
'vec4 originalColor=texture2D(map,vMapUv);',
'float blueWater=smoothstep(.10,.28,originalColor.b-originalColor.r)*smoothstep(.025,.10,originalColor.b-originalColor.g);',
'vec2 uvWave=vMapUv+blueWater*.0007*vec2(sin(vMapUv.y*210.+uADGMTime*.4),cos(vMapUv.x*180.-uADGMTime*.5));',
'vec4 sampledDiffuseColor=texture2D(map,uvWave);',
'float ripples=blueWater*.028*sin(vMapUv.x*580.+vMapUv.y*490.+uADGMTime*1.4);',
'sampledDiffuseColor.rgb+=ripples;',
'diffuseColor*=sampledDiffuseColor;',
'#endif'].join('\n'));
};
earth.material.needsUpdate=true;
const styles=['glass','white','bronze','stone'],facadeTextures={};
function seeded(seed){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}
function facadeTexture(style){
 const can=document.createElement('canvas');can.width=256;can.height=512;
 const ctx=can.getContext('2d'),r=seeded(style.length*929+47);
 const base={glass:'#33526a',white:'#b9c3c4',bronze:'#756a61',stone:'#a5a29a'}[style];
 ctx.fillStyle=base;ctx.fillRect(0,0,256,512);
 const cols=style==='white'?6:8,rows=25,cw=256/cols,ch=512/rows;
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
  const v=r(),glow=v>.84;let fill;
  if(style==='glass')fill=glow?'#d9bb83':v>.48?'#7695a6':'#203c52';
  else if(style==='bronze')fill=glow?'#d9bd8a':v>.52?'#918e84':'#454d52';
  else if(style==='white')fill=glow?'#ded2b0':v>.53?'#83959c':'#657680';
  else fill=glow?'#d2c4a5':v>.56?'#b1b6b0':'#6f8082';
  ctx.fillStyle=fill;const inset=style==='white'?4:2.4;
  ctx.fillRect(x*cw+inset,y*ch+2,cw-inset*2,ch-4);
  ctx.fillStyle='rgba(240,248,255,.08)';
  ctx.fillRect(x*cw+inset+1,y*ch+3,Math.max(1,cw*.16),ch-6);
  ctx.fillStyle='rgba(5,20,35,.27)';ctx.fillRect(x*cw,y*ch+ch-2,cw,2);
 }
 for(let x=0;x<=cols;x++){ctx.fillStyle=style==='white'?'rgba(255,255,255,.45)':'rgba(175,204,220,.24)';ctx.fillRect(x*cw-1,0,2,512);}
 const grad=ctx.createLinearGradient(0,0,256,0);
 grad.addColorStop(0,'rgba(255,255,255,0)');grad.addColorStop(.32,'rgba(255,255,255,.13)');grad.addColorStop(.53,'rgba(255,255,255,.01)');grad.addColorStop(1,'rgba(255,255,255,0)');
 ctx.fillStyle=grad;ctx.fillRect(0,0,256,512);
 const tex=new THREE.CanvasTexture(can);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
 return tex;
}
styles.forEach(s=>facadeTextures[s]=facadeTexture(s));
const facadeMaterials=[];let buildingIndex=0;
function facade(zone,height){
 buildingIndex++;
 const h=height>11?'glass':height>7?(buildingIndex%4===0?'white':'glass'):(buildingIndex%5===0?'bronze':'stone');
 const material=new THREE.MeshPhysicalMaterial({
 map:facadeTextures[h],color:zone==='S'?'#e7f2ff':zone==='N'?'#fff0dd':'#ffffff',
 roughness:h==='glass'?.21:.52,metalness:h==='glass'?.53:.13,
 clearcoat:h==='glass'?.62:.12,clearcoatRoughness:.17,
 transparent:true,opacity:.98,
 emissive:new THREE.Color('#d9a75d'),emissiveIntensity:0
 });
 facadeMaterials.push(material);return material;
}
const roofMaterial=new THREE.MeshStandardMaterial({color:'#c3c6bf',roughness:.79,metalness:.09});
const hvac=new THREE.BoxGeometry(1,1,1);
const hvacMat=new THREE.MeshStandardMaterial({color:'#c6c9c5',metalness:.36,roughness:.58});
function decorate(mesh,roof,width,depth,height){
 mesh.castShadow=true;mesh.receiveShadow=true;
 roof.castShadow=true;roof.receiveShadow=true;roof.material=roofMaterial;
 if(height<4.7)return;
 const r=seeded(Math.floor(mesh.position.x*283+mesh.position.z*983+112233));
 const n=height>9?3:2;
 for(let j=0;j<n;j++){
   const w=.28+r()*.55,d=.35+r()*.56,h=.2+r()*.34;
   const unit=new THREE.Mesh(hvac,hvacMat);unit.scale.set(w,h,d);
   unit.position.set(mesh.position.x+(r()-.5)*width*.53,height+.45+h*.5,mesh.position.z+(r()-.5)*depth*.53);
   unit.rotation.y=mesh.rotation.y;unit.castShadow=true;scene.add(unit);
   if(!mesh.userData.details)mesh.userData.details=[];
   mesh.userData.details.push(unit);
 }
 if(height>12&&buildingIndex%3===0){
   const mast=new THREE.Mesh(new THREE.CylinderGeometry(.035,.045,1.8,6),hvacMat);
   mast.position.set(mesh.position.x,height+1.25,mesh.position.z);scene.add(mast);
   mesh.userData.details.push(mast);
 }
}
const pmrem=new THREE.PMREMGenerator(renderer);
try{
 const envScene=new THREE.Scene();envScene.background=new THREE.Color('#a5c4d1');
 const ambient=new THREE.Mesh(new THREE.SphereGeometry(10,16,8),new THREE.MeshBasicMaterial({color:'#d2e6ee',side:THREE.BackSide}));
 envScene.add(ambient);const target=pmrem.fromScene(envScene,.04);
 scene.environment=target.texture;scene.environmentIntensity=.35;
 ambient.geometry.dispose();ambient.material.dispose();
}catch(e){console.warn('Environment approximation unavailable',e);}
pmrem.dispose();
const sunDisk=new THREE.Sprite(new THREE.SpriteMaterial({color:'#fff4c9',transparent:true,opacity:.6,depthWrite:false,blending:THREE.AdditiveBlending}));
sunDisk.position.set(-240,270,-310);sunDisk.scale.set(75,75,1);scene.add(sunDisk);
let evening=false;
function toggleLight(){
 evening=!evening;
 if(evening){
  sun.color.set('#ffae75');sun.intensity=1.85;sun.position.set(-140,60,-80);
  hemi.intensity=.65;renderer.toneMappingExposure=1.02;
  sky.material.uniforms.top.value.set('#274f72');sky.material.uniforms.horizon.value.set('#d68e69');
  water.uniforms.day.value=.65;facadeMaterials.forEach(m=>m.emissiveIntensity=.17);
  sunDisk.material.color.set('#ffb989');
 }else{
  sun.color.set('#ffe4bd');sun.intensity=3.35;sun.position.set(-95,155,-82);
  hemi.intensity=.8;renderer.toneMappingExposure=1.22;
  sky.material.uniforms.top.value.set('#417b9d');sky.material.uniforms.horizon.value.set('#e5c6a0');
  water.uniforms.day.value=1;facadeMaterials.forEach(m=>m.emissiveIntensity=0);
  sunDisk.material.color.set('#fff4c9');
 }
 return evening;
}
function update(t){uniforms.time.value=t*.001;}
return{facade,decorate,update,toggleLight,facadeMaterials,evening:()=>evening};
};