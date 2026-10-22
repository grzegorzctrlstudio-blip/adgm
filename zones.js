/* CTRLstudio ADGM — four reference zones, 22 October 2026 */
(function(){
  'use strict';
  var toolbar=document.querySelector('.toolbar');
  if(!toolbar||document.getElementById('zoneoverview'))return;
  var ZONES=[
    {id:'M',num:'01',name:'Al Maryah Island',desc:'ADGM Square, The Galleria, Cleveland Clinic',css:'maryah'},
    {id:'T',num:'02',name:'Marina Square',desc:'Marina Square i powiązane obiekty Al Reem',css:'marina'},
    {id:'S',num:'03',name:'Shams Abu Dhabi',desc:'Gate Towers, Sky Tower, Pixel i okolice',css:'shams'},
    {id:'N',num:'04',name:'Najmat Abu Dhabi',desc:'Reem Mall, waterfront, The Wave',css:'najmat'}
  ];
  var style=document.createElement('style');
  style.textContent=[
    '#zoneoverview{margin:18px 22px 10px;padding:23px 24px 24px;border-radius:15px;background:linear-gradient(140deg,#061a3b 0%,#0a2857 55%,#061633 100%);color:#f2f7ff;box-shadow:0 10px 32px rgba(5,26,60,.14);border:1px solid #244f84}',
    '.zoneheading{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:17px}',
    '.zoneheading .zoneeyebrow{font-size:11px;letter-spacing:.16em;font-weight:800;color:#80b5f4;margin-bottom:7px}',
    '.zoneheading h2{margin:0;color:#fff;font-size:23px;font-weight:800;line-height:1.18}',
    '.zoneheading p{margin:7px 0 0;color:#b5c9e4;font-size:12px;line-height:1.6}',
    '.zone-all{flex:none;border:1px solid #5b87bb;color:#e5f1ff;background:#173a67;border-radius:8px;padding:10px 14px;cursor:pointer;font-weight:700;font-size:12px}',
    '.zone-all:hover{background:#245184}',
    '.zonegrid{display:grid;grid-template-columns:1.12fr 1fr 1.58fr;grid-template-rows:140px 140px;grid-template-areas:"maryah shams shams" "maryah marina najmat";gap:10px}',
    '.zone-tile{position:relative;isolation:isolate;overflow:hidden;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;text-align:left;padding:19px 22px;border:1px solid rgba(90,159,244,.55);border-radius:11px;color:#eaf5ff;cursor:pointer;background:radial-gradient(circle at 75% 15%,rgba(48,129,241,.22),transparent 50%),linear-gradient(145deg,rgba(9,50,112,.9),rgba(5,22,55,.9));box-shadow:inset 0 0 0 1px rgba(13,55,118,.4);transition:background .18s,border-color .18s,transform .18s}',
    '.zone-tile:before{content:"";position:absolute;inset:0;z-index:-1;opacity:.3;background-image:linear-gradient(rgba(80,154,246,.25) 1px,transparent 1px),linear-gradient(90deg,rgba(80,154,246,.25) 1px,transparent 1px);background-size:26px 26px;transform:rotate(-12deg) scale(1.35)}',
    '.zone-tile:after{content:"";position:absolute;inset:8px;border:1px solid rgba(89,165,255,.16);border-radius:8px;pointer-events:none}',
    '.zone-tile:hover,.zone-tile:focus-visible{background:linear-gradient(145deg,#14509a,#0b2b5e);border-color:#a5d5ff;transform:translateY(-1px);outline:none}',
    '.zone-tile.active{border:2px solid #a8d9ff;background:linear-gradient(145deg,#1956a2,#0c316c);box-shadow:0 0 0 2px rgba(59,160,255,.22),inset 0 0 28px rgba(74,163,255,.18)}',
    '.zone-tile[data-zone="M"]{grid-area:maryah}.zone-tile[data-zone="T"]{grid-area:marina}.zone-tile[data-zone="S"]{grid-area:shams}.zone-tile[data-zone="N"]{grid-area:najmat}',
    '.zone-index{display:inline-flex;align-items:center;justify-content:center;min-width:38px;height:38px;border:2px solid #8cc7ff;border-radius:50%;color:#f7fbff;font-size:13px;font-weight:800;margin-bottom:10px;background:#092d61}',
    '.zone-name{display:block;font-size:18px;font-weight:800;line-height:1.25;letter-spacing:.005em}',
    '.zone-desc{display:block;color:#bad2ec;font-size:11px;line-height:1.45;margin-top:6px;max-width:260px}',
    '.zone-count{display:block;color:#9bc6f5;font-size:10px;margin-top:9px;font-weight:700}',
    '.zonefoot{font-size:11px;color:#a9c2e0;line-height:1.6;margin:13px 0 0}',
    '.zonefoot strong{color:#e4f2ff}',
    '#audit .najmat-plain{font-size:14px;color:#344a60;line-height:1.65}',
    '#audit .najmat-action{border:0;border-radius:7px;padding:11px 15px;background:#174f8e;color:white;cursor:pointer;font-weight:700;font-size:12px;margin:7px 0 14px}',
    '#audit .najmat-action:hover{background:#0b3666}',
    '@media(max-width:900px){#zoneoverview{margin:10px;padding:17px}.zonegrid{grid-template-columns:1fr 1fr;grid-template-rows:auto auto;grid-template-areas:"maryah shams" "marina najmat"}.zone-tile{min-height:164px}.zoneheading h2{font-size:20px}}',
    '@media(max-width:580px){.zoneheading{flex-direction:column;gap:10px}.zone-all{align-self:flex-start}.zonegrid{grid-template-columns:1fr 1fr;gap:7px}.zone-tile{min-height:150px;padding:13px}.zone-index{width:30px;height:30px;min-width:30px;font-size:11px;margin-bottom:9px}.zone-name{font-size:14px}.zone-desc{font-size:10px}.zone-count{font-size:9px}}'
  ].join('\n');
  document.head.appendChild(style);
  var html=[
    '<section id="zoneoverview" aria-label="Cztery strefy ADGM">',
      '<div class="zoneheading"><div><div class="zoneeyebrow">EXPLORE ADGM · 4 STREFY</div>',
      '<h2>Wybierz strefę projektu</h2>',
      '<p>Podział 01–04 zgodny z przesłaną mapą. Wybór filtruje obiekty i przybliża rzeczywistą mapę satelitarną.</p></div>',
      '<button type="button" class="zone-all" id="zoneall">Wszystkie strefy ↗</button></div>',
      '<div class="zonegrid">'
  ];
  ZONES.forEach(function(z){
    var count=DATA.objects.filter(function(d){return d.group===z.id}).length;
    html.push('<button type="button" class="zone-tile" data-zone="'+z.id+'" aria-pressed="false"><span class="zone-index">'+z.num+'</span><span class="zone-name">'+z.name+'</span><span class="zone-desc">'+z.desc+'</span><span class="zone-count">'+count+' pozycji w atlasie →</span></button>');
  });
  html.push('</div><p class="zonefoot"><strong>Uwaga:</strong> układ kafelków jest schematem nawigacji, nie granicami geodezyjnymi. Część obiektów z briefu znajduje się poza ścisłymi granicami wskazanej strefy; znaczniki pozostają na swoich rzeczywistych pozycjach.</p></section>');
  toolbar.insertAdjacentHTML('afterend',html.join(''));
  function sync(id){
    document.querySelectorAll('#zoneoverview [data-zone]').forEach(function(el){
      var on=el.dataset.zone===id;
      el.classList.toggle('active',on);
      el.setAttribute('aria-pressed',String(on));
    });
  }
  function changeZone(id,scroll){
    var button=document.querySelector('.toolbar [data-group="'+id+'"]');
    if(!button)return;
    button.click();
    if(id!=='all'){
      var first=DATA.objects.find(function(d){return d.group===id});
      if(first&&typeof select==='function')select(first.code);
    }
    sync(id);
    if(scroll){
      var target=document.querySelector('.workspace');
      if(target)target.scrollIntoView({behavior:'smooth',block:'start'});
    }
  }
  document.querySelectorAll('#zoneoverview [data-zone]').forEach(function(el){
    el.addEventListener('click',function(){changeZone(el.dataset.zone,true)});
  });
  document.getElementById('zoneall').addEventListener('click',function(){changeZone('all',true)});
  document.querySelectorAll('.toolbar [data-group]').forEach(function(el){
    el.addEventListener('click',function(){sync(el.dataset.group)});
  });
  var jump=document.createElement('button');
  jump.type='button';jump.className='najmat-action';jump.textContent='Pokaż strefę 04 na mapie →';
  jump.addEventListener('click',function(){changeZone('N',true)});
  var audit=document.getElementById('audit');
  if(audit){
    var notes=audit.querySelector('#auditnotes');
    if(notes)notes.before(jump);
  }
  sync('all');
})();