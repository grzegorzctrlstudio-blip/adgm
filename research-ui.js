/* CTRLstudio ADGM production research — navigation and inventory */
(function(){
  'use strict';
  const state=window.ADGM_RESEARCH;
  const tabs=[...document.querySelectorAll('[data-tab][role="tab"]')];
  const panes=[...document.querySelectorAll('[data-pane][role="tabpanel"]')];
  const known=new Set(tabs.map(t=>t.dataset.tab));
  const escapeHTML=(s)=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeLink=(s)=>/^https:\/\/[a-z0-9.-]+(?:\/|$)/i.test(String(s||''))?s:null;
  let current='overview';
  function show(tab,updateHash=true,scroll=true){
    if(!known.has(tab))tab='overview';
    current=tab;
    tabs.forEach((b)=>{
      const on=b.dataset.tab===tab;
      b.setAttribute('aria-selected',String(on));
      b.tabIndex=on?0:-1;
    });
    panes.forEach(p=>p.hidden=p.dataset.pane!==tab);
    if(updateHash){
      const url=location.pathname+location.search+'#'+tab;
      if(location.hash!=='#'+tab)history.replaceState(null,'',url);
    }
    if(scroll){
      const nav=document.querySelector('.tabs-wrap');
      if(nav)nav.scrollIntoView({behavior:'smooth',block:'start'});
    }
  }
  tabs.forEach((t,i)=>{
    t.id='research-tab-'+t.dataset.tab;
    t.setAttribute('aria-controls','research-pane-'+t.dataset.tab);
    t.addEventListener('click',()=>show(t.dataset.tab,true,true));
    t.addEventListener('keydown',(e)=>{
      if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;
      e.preventDefault();
      const target=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
      tabs[target].focus();
      show(tabs[target].dataset.tab,true,false);
    });
  });
  panes.forEach(p=>{p.id='research-pane-'+p.dataset.pane;p.setAttribute('aria-labelledby','research-tab-'+p.dataset.pane)});
  document.querySelectorAll('[data-tab-link]').forEach(a=>a.addEventListener('click',e=>{
    e.preventDefault();show(a.dataset.tabLink,true,true);
  }));
  const zoneSelect=document.getElementById('building-zone');
  const search=document.getElementById('building-search');
  const tbody=document.getElementById('building-rows');
  const count=document.getElementById('building-count');
  function matched(){
    if(!state||!Array.isArray(state.buildings))return [];
    const zone=zoneSelect.value;
    const q=(search.value||'').trim().toLocaleLowerCase('pl').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    return state.buildings.filter(d=>{
      if(zone!=='all'&&d.zone!==zone)return false;
      if(!q)return true;
      return [d.code,d.name,d.developer,d.architect,d.where,d.status,d.priority,d.shape].join(' ').toLocaleLowerCase('pl').normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q);
    });
  }
  function buildRow(d){
    const loc=Array.isArray(d.position)&&d.position.length===2?d.position.map(x=>Number(x).toFixed(5)).join(', '):'Nieustalona';
    const statusWarning=d.referenceStatus!=='referenced'||/nieustal|do identyfikacji/i.test(d.status);
    const links=(d.links||[]).filter(x=>safeLink(x.url)).slice(0,3).map(x=>'<a target="_blank" rel="noopener noreferrer" href="'+escapeHTML(x.url)+'">'+escapeHTML(x.title)+' ↗</a>').join('');
    return '<tr data-zone="'+escapeHTML(d.zone)+'">'+
      '<td><span class="code">'+escapeHTML(d.code)+'</span><span class="name">'+escapeHTML(d.name)+'</span>'+
      '<span class="subtext">'+escapeHTML(state.zones[d.zone])+' · '+escapeHTML(d.priority)+'</span>'+
      '<details><summary>Bryła / zadania modelera</summary><p><strong>Forma:</strong> '+escapeHTML(d.shape)+'</p><p><strong>Pozycja:</strong> '+escapeHTML(d.where)+'</p><p><strong>Uwaga:</strong> '+escapeHTML(d.notes)+'</p><p><strong>Zachować:</strong> '+escapeHTML(d.keep)+'</p></details></td>'+
      '<td><strong>'+escapeHTML(d.developer)+'</strong><span class="subtext">'+escapeHTML(d.architect)+'</span></td>'+
      '<td><strong>'+escapeHTML(d.height)+'</strong><span class="subtext">'+escapeHTML(d.floors)+' kond.</span></td>'+
      '<td><strong>'+escapeHTML(d.year)+'</strong><span class="status '+(statusWarning?'warn':'')+'">'+escapeHTML(d.status)+'</span></td>'+
      '<td><span style="font-family:ui-monospace,Consolas,monospace;font-size:11px">'+escapeHTML(loc)+'</span><span class="subtext">Punkt orientacyjny, nie footprint</span></td>'+
      '<td><div class="source-links">'+(links||'<span class="subtext">Źródło do ustalenia</span>')+'</div></td></tr>';
  }
  function render(){
    const list=matched();
    tbody.innerHTML=list.length?list.map(buildRow).join(''):'<tr><td colspan="6">Brak wyników dla wybranego filtra.</td></tr>';
    count.textContent=list.length+' / '+(state?.buildings.length||27)+' pozycji';
  }
  if(!state){tbody.innerHTML='<tr><td colspan="6">Nie udało się załadować danych. Odśwież stronę.</td></tr>';}
  else {render();zoneSelect.addEventListener('change',render);search.addEventListener('input',render);}
  document.querySelectorAll('[data-zone-jump]').forEach(a=>a.addEventListener('click',e=>{
    e.preventDefault();
    if(zoneSelect){zoneSelect.value=a.dataset.zoneJump;search.value='';render();}
    show('buildings',true,true);
  }));
  document.getElementById('export-csv').addEventListener('click',()=>{
    const rows=matched();
    const headers=['Kod','Strefa','Obiekt','Developer','Architekt','Wysokosc','Kondygnacje','Rok','Status','Priorytet','Latitude','Longitude','Opis bryly','Uwagi','Zrodla'];
    const quote=(v)=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"';
    const content=[headers,...rows.map(d=>[d.code,state.zones[d.zone],d.name,d.developer,d.architect,d.height,d.floors,d.year,d.status,d.priority,d.position?.[0]??'',d.position?.[1]??'',d.shape,d.notes,(d.links||[]).map(l=>l.url).join(' | ')])].map(a=>a.map(quote).join(';')).join('\r\n');
    const blob=new Blob(['\ufeff',content],{type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download='CTRLstudio_ADGM_27_obiektow.csv';document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);
  });
  const rate=document.getElementById('hour-rate');
  const out=document.getElementById('hour-rate-value');
  const fmt=n=>Math.round(n).toLocaleString('pl-PL');
  function recalc(){
    const r=Number(rate.value);out.textContent=fmt(r)+' PLN/h';
    document.querySelectorAll('[data-cost]').forEach(el=>{
      const [lo,hi]=el.dataset.cost.split(',').map(Number);
      el.textContent=fmt(lo*r)+' – '+fmt(hi*r)+' PLN';
    });
  }
  rate.addEventListener('input',recalc);recalc();
  function fromHash(){const key=decodeURIComponent(location.hash.slice(1));show(known.has(key)?key:'overview',false,false);}
  window.addEventListener('hashchange',fromHash);
  fromHash();
})();