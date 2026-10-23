/* CTRLstudio ADGM: camera motion directly on the approved HIGH-RES CGI map.
 * Runs without Three.js: the reference image remains usable if WebGL is unavailable.
 * Distances and zones are graphical waypoints, not mapped GIS coordinates.
 */
(function(){
  'use strict';
  const app=document.getElementById('app');
  const photo=document.getElementById('still');
  const play=document.getElementById('play');
  const hud=document.getElementById('refHud');
  if(!app||!photo||!play)return;
  const stops=[
    {label:'CAŁY OBSZAR',x:.5,y:.5,z:1},
    {label:'01 · AL MARYAH ISLAND',x:.245,y:.39,z:1.78},
    {label:'03 · SHAMS ABU DHABI',x:.59,y:.335,z:1.75},
    {label:'02 · MARINA SQUARE',x:.505,y:.53,z:1.76},
    {label:'04 · NAJMAT ABU DHABI',x:.67,y:.675,z:1.74},
    {label:'CAŁY OBSZAR',x:.5,y:.5,z:1}
  ];
  let timer=null,active=false,index=0,zoom=1,offX=0,offY=0,drag=null;
  function move(x,y,z,label){
    const tx=(.5-z*x)*100,ty=(.5-z*y)*100;
    zoom=z;
    offX=Math.max((1-z)*100,Math.min(0,tx));
    offY=Math.max((1-z)*100,Math.min(0,ty));
    photo.style.transform='translate('+offX+'%,'+offY+'%) scale('+z+')';
    if(hud)hud.textContent=(label||'MASTERPLAN CGI')+' · 1672 × 941';
  }
  function stop(resetText=true){
    if(timer!==null){clearInterval(timer);timer=null;}
    active=false;
    play.classList.remove('on');
    play.setAttribute('aria-pressed','false');
    if(resetText&&app.classList.contains('reference-mode'))play.textContent='▶ Animuj przelot';
  }
  function toggle(){
    if(active){stop();return;}
    active=true;index=0;move(...[stops[0].x,stops[0].y,stops[0].z,stops[0].label]);
    play.textContent='Ⅱ Zatrzymaj przelot';
    play.classList.add('on');
    play.setAttribute('aria-pressed','true');
    timer=setInterval(function(){
      if(document.hidden||!app.classList.contains('reference-mode')){stop();return;}
      index=(index+1)%stops.length;
      const k=stops[index];move(k.x,k.y,k.z,k.label);
    },4600);
  }
  // Capture phase ensures the 2D tour does not accidentally launch the old 3D camera.
  play.addEventListener('click',function(e){
    if(!app.classList.contains('reference-mode'))return;
    e.preventDefault();e.stopImmediatePropagation();toggle();
  },true);
  // Interactive scroll zoom, in addition to film-like guided tour.
  app.addEventListener('wheel',function(e){
    if(!app.classList.contains('reference-mode'))return;
    if(e.target.closest('button,a'))return;
    e.preventDefault();stop();
    const rect=app.getBoundingClientRect(),x=Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width)),y=Math.max(0,Math.min(1,(e.clientY-rect.top)/rect.height));
    const next=Math.max(1,Math.min(3.3,zoom*Math.exp(-e.deltaY*.0012)));
    move(x,y,next,'PRZYBLIŻENIE / PODGLĄD');
  },{passive:false});
  app.addEventListener('pointerdown',function(e){
    if(!app.classList.contains('reference-mode')||zoom<=1||e.target.closest('button,a'))return;
    stop();
    const box=app.getBoundingClientRect();
    drag={id:e.pointerId,x:e.clientX,y:e.clientY,bx:offX,by:offY,w:box.width,h:box.height};
    app.setPointerCapture?.(e.pointerId);
    photo.style.transition='none';
  });
  app.addEventListener('pointermove',function(e){
    if(!drag||e.pointerId!==drag.id)return;
    offX=Math.max((1-zoom)*100,Math.min(0,drag.bx+(e.clientX-drag.x)/drag.w*100));
    offY=Math.max((1-zoom)*100,Math.min(0,drag.by+(e.clientY-drag.y)/drag.h*100));
    photo.style.transform='translate('+offX+'%,'+offY+'%) scale('+zoom+')';
  });
  function endDrag(){drag=null;photo.style.transition='';}
  app.addEventListener('pointerup',endDrag);app.addEventListener('pointercancel',endDrag);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  window.addEventListener('message',e=>{if(e.origin===location.origin&&e.data?.type==='ctrl-adgm-pause')stop();});
  window.CTRL_ADGM_REF_TOUR={stop,reset:()=>{stop();move(.5,.5,1,'CAŁY OBSZAR');}};
  move(.5,.5,1,'CAŁY OBSZAR');
})();