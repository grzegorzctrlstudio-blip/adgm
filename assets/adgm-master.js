/* CTRLstudio ADGM visual master — image copied from the user's final approved concept.
 * 1024x576 AVIF web preview; original 1672x941 remains in project input artifacts.
 * The four segments are stored separately to avoid repository binary upload constraints.
 */
(function(){
  'use strict';
  const p=window.__ADGM_IMAGE_PARTS;
  if(!Array.isArray(p)||p.length!==4||p.some(x=>typeof x!=='string')||p.join('').length!==36992){
    console.error('ADGM master reference image missing or incomplete');return;
  }
  window.CTRL_ADGM_MASTER='data:image/avif;base64,'+p.join('');
  window.CTRL_ADGM_PLAN=window.CTRL_ADGM_MASTER;
  p.length=0;
})();
