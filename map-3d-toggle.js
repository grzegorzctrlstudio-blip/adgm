/* CTRLstudio ADGM – switch main atlas map between geographic reference and image-based 3D schematic. */
(function(){
  'use strict';
  const box=document.querySelector('.mapbox');
  const btn=document.getElementById('toggleModel');
  const frame=document.getElementById('schematFrame');
  if(!box||!btn||!frame)return;
  let opened=false;
  function setMode(show3d){
    box.classList.toggle('modelmode',show3d);
    btn.textContent=show3d?'← Mapa referencyjna':'▶ Symulacja 3D';
    btn.setAttribute('aria-pressed',String(show3d));
    if(show3d&&!opened){
      opened=true;
      frame.src='./schemat3d.html?embed=1';
    }
    if(!show3d&&opened){
      // Pauses the 3D animation with a message rather than destroying its state.
      try{frame.contentWindow.postMessage({type:'ctrl-adgm-pause'},location.origin);}catch(_){}
    }
  }
  btn.addEventListener('click',()=>setMode(!box.classList.contains('modelmode')));
  // A shareable direct link into the main atlas' 3D view.
  if(location.hash==='#model3d')setMode(true);
})();
