/* CTRLstudio ADGM — 2.5D camera tour on the approved master reference image.
 * All interactive regions are visual presentation coordinates, NOT geospatial polygons.
 */
(function(){
  'use strict';
  const root=document.querySelector('#master-visual');
  const stage=document.querySelector('#master-transform');
  const image=document.querySelector('#master-image');
  const tour=document.querySelector('#tour-toggle');
  const reset=document.querySelector('#master-reset');
  const label=document.querySelector('#master-status');
  if(!root||!stage||!image||!tour||!reset)return;
  const src=window.CTRL_ADGM_MASTER;
  if(!src){root.classList.add('media-error');label.textContent='Błąd podkładu: grafika niedostępna';return;}
  image.onload=()=>{root.classList.add('loaded');label.textContent='MASTERPLAN / 4 DISTRICTS / 2026';};
  image.onerror=()=>{root.classList.add('media-error');label.textContent='Grafika niedostępna. Wczytaj stronę ponownie.';};
  image.src=src;
  const zones={
    all:{name:'Cały masterplan',x:.5,y:.5,zoom:1},
    M:{name:'01 · Al Maryah Island',x:.239,y:.375,zoom:1.68},
    T:{name:'02 · Marina Square',x:.505,y:.516,zoom:1.75},
    S:{name:'03 · Shams Abu Dhabi',x:.585,y:.311,zoom:1.78},
    N:{name:'04 · Najmat Abu Dhabi',x:.675,y:.652,zoom:1.68}
  };
  let active='all',playing=false,seq=0,timer=null,panX=0,panY=0,drag=null;
  const order=['all','M','S','T','N','all'];
  const buttons=[...document.querySelectorAll('[data-master-zone]')];
  function fit(dx,dy,scale){
    const bound=(scale-1)*50;
    panX=Math.max(-bound,Math.min(bound,dx));
    panY=Math.max(-bound,Math.min(bound,dy));
    stage.style.transform='translate('+panX+'%,'+panY+'%) scale('+scale+')';
  }
  function select(id,manual=true){
    const zone=zones[id];if(!zone)return;
    if(manual)stop();
    active=id;
    fit((.5-zone.zoom*zone.x)*100,(.5-zone.zoom*zone.y)*100,zone.zoom);
    buttons.forEach(b=>{const on=b.dataset.masterZone===id;b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on));});
    label.textContent=zone.name.toUpperCase()+' / REFERENCJA CGI';
    root.dataset.active=id;
  }
  function stop(){
    playing=false;
    if(timer!==null){clearInterval(timer);timer=null;}
    tour.textContent='▶ Animuj przelot';
    tour.classList.remove('running');
    tour.setAttribute('aria-pressed','false');
  }
  function start(){
    if(playing){stop();return;}
    playing=true;seq=0;
    tour.textContent='Ⅱ Zatrzymaj przelot';
    tour.classList.add('running');
    tour.setAttribute('aria-pressed','true');
    select(order[seq],false);
    timer=setInterval(()=>{
      if(!playing||document.hidden){stop();return;}
      seq=(seq+1)%order.length;
      select(order[seq],false);
    },4600);
  }
  buttons.forEach(button=>button.addEventListener('click',()=>select(button.dataset.masterZone)));
  tour.addEventListener('click',start);
  reset.addEventListener('click',()=>select('all'));
  image.draggable=false;
  root.addEventListener('pointerdown',event=>{
    if(event.target.closest('button,a'))return;
    if(zones[active].zoom<=1)return;
    stop();
    const rect=root.getBoundingClientRect();
    drag={id:event.pointerId,x:event.clientX,y:event.clientY,baseX:panX,baseY:panY,w:rect.width,h:rect.height};
    root.setPointerCapture?.(event.pointerId);
    root.classList.add('dragging');
  });
  root.addEventListener('pointermove',event=>{
    if(!drag||event.pointerId!==drag.id)return;
    const z=zones[active].zoom;
    fit(drag.baseX+(event.clientX-drag.x)/drag.w*100,drag.baseY+(event.clientY-drag.y)/drag.h*100,z);
  });
  const end=()=>{drag=null;root.classList.remove('dragging');};
  root.addEventListener('pointerup',end);
  root.addEventListener('pointercancel',end);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  select('all');
})();
