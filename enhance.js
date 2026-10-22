/* CTRLstudio ADGM media and satellite reference layer — 2026-10-22 */
(function () {
  'use strict';
  const U = (url, credit, label, source, type='foto') => ({url,credit,label,source,type});
  const NEW = {
    M01: [U('https://storage2.emirates.estate/static/p/ubtwy8o5zn/5h11kfe8nr404y/alsilatower01.jpg','Emirates.Estate','Al Sila Tower — elewacja od strony wody','https://emirates.estate/property/al-sila-tower-220744/')],
    M02: [U('https://www.mediaoffice.abudhabi/assets/resized/sm/upload/kv/gm/p6/hc/Web-0-1380-0-0.png?k=c8d3857b43','Abu Dhabi Media Office','Zespół ADGM Square — fotografia kontekstowa; rozpoznanie pojedynczej wieży wymaga potwierdzenia','https://www.mediaoffice.abudhabi/en/economy/abu-dhabi-global-market-records-215-percent-increase-in-assets-under-management-in-q3-2024/','kontekst')],
    M03: [U('https://gop-prod.s3.amazonaws.com/media/images/SSQ_005_260412_GP_ADJUST.max-1600x1200.jpg','Goettsch Partners','Zespół czterech wież ADGM — widok od strony wody','https://www.gpchicago.com/architecture/abu-dhabi-global-market-square/','kontekst')],
    M04: [U('https://s3.amazonaws.com/images.skyscrapercenter.com/thumbs/30749_500x650.jpg','Skyscraper Center','Al Maqam Tower — osobna elewacja','https://www.skyscrapercenter.com/building/al-maqam-tower/8731')],
    M05: [U('https://www.constructionweekonline.com/cloud/2021/07/07/adnoc-trading-new-office-wam.jpg','Construction Week / WAM','Niski budynek siedziby ADGM — zewnętrzny widok bryły','https://www.constructionweekonline.com/business/261861-mubadala-adnoc-ink-lease-deal-for-8194m2-space-in-adgm-square')],
    M06: [U('https://s3.amazonaws.com/images.skyscrapercenter.com/thumbs/8883_500x650.jpg','Skyscraper Center','Al Maryah Tower — przesunięte segmenty','https://www.skyscrapercenter.com/building/al-maryah-tower/15269')],
    M07: [U('https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2022/11/23/The-Galleria-Mall.jpg','Time Out Abu Dhabi','The Galleria — rzeczywiste wejście i fasada','https://www.timeoutabudhabi.com/news/yoga-class-world-mindfulness-day')],
    M08: [U('https://www.clevelandclinicabudhabi.ae/-/media/ccad/Images/institute-and-speciality/sliders/contextual_2_2x.jpg','Cleveland Clinic Abu Dhabi','Faktyczna bryła szpitala i szklana fasada','https://www.clevelandclinicabudhabi.ae/en/about-us/who-we-are')],
    T01: [U('https://www.gisco.ae/application/files/cache/244e4796ce733bbaed4105fc66ff829c.jpg','GISCO','Marina Square Zone C — wieże i podium','https://www.gisco.ae/projects/marina-square-al-reem-island-zone-c/')],
    T02: [U('https://www.multiplex.global/media/ubyhj0ui/adaxtowers.jpg?height=630&v=1dad1e8f55e5970&width=1200','Multiplex','Addax Tower — zaokrąglona szklana bryła','https://www.multiplex.global/projects/addax-tower-city-of-lights/')],
    T03: [U('https://www.msquared.ae/img/projects/paragon/paragon-3.jpg','mSquared','Paragon Bay Mall — NIEPOTWIERDZONY kandydat dla „Tamouh retail”; to wizualizacja, nie aktualne zdjęcie obiektu','https://www.msquared.ae/project-paragon-bay-mall.php','kandydat / wizualizacja')],
    T04: [U('https://www.reemhospital.com/wp-content/uploads/2021/12/Rectangle-222%402x.png','Reem Hospital','Reem Hospital — widok architektoniczny kompleksu','https://www.reemhospital.com/','wizualizacja')],
    T05: [U('https://www.sorbonne.ae/uploaded/2025/Jul/JYcaOHFlmxVC4pDwuZfb0vIFZZXWIPSEHjswnJ5N.jpg','Sorbonne University Abu Dhabi','Kampus i charakterystyczna kopuła — widok od dziedzińca','https://www.sorbonne.ae/about-us/'),U('https://www.sorbonne.ae/uploaded/2025/Aug/ri7ES3oWLNeZZxwlnIAA2NzM9aB16Z2FhkxNQuJh.jpg','Sorbonne University Abu Dhabi','Kampus — oś dojazdu i bryła od strony drogi','https://www.sorbonne.ae/faqs')],
    T06: [U('https://bsbgroup.com/application/files/2415/7613/4841/Repton-Senior-School-13-2000x1335.jpg','BSBG','Repton Fry Campus — fasada szkoły w kontekście wież','https://bsbgroup.com/portfolio/repton-senior-school-abu-dhabi')],
    N01: [U('https://visitabudhabi.ae/-/media/project/vad/things-to-do/shopping-and-lifestyle/reem-mall/header/reem-mall.jpeg?rev=32c58a1e77a44f42908bae1df8953452','Experience Abu Dhabi','Reem Mall — aktualna rzeczywista fasada od strony drogi','https://visitabudhabi.ae/en/things-to-do/shopping/reem-mall'),U('https://dewan-architects.com/work/images/work-slider/retail/reemmall/1.jpg','Dewan Architects','Reem Mall — wizualizacja projektowa; nie traktować jako bieżącej zabudowy','https://dewan-architects.com/work/reem-mall','wizualizacja')],
    N02: [U('https://static.shared.propertyfinder.ae/media/images/listing/VHF8F31QR760EH5C9MHZB667Z4/058c7dfa-f741-4535-a320-2a9790f00fc2/668x452.webp','Property Finder','Najmat — widok rzeczywistego nabrzeża przy The Wave; NIE jest to panorama całej zatoki','https://www.propertyfinder.ae/en/plp/rent/apartment-for-rent-abu-dhabi-al-reem-island-najmat-abu-dhabi-the-wave-2PecyxKe0ci.html','otoczenie')],
    N03: [U('https://a2zsolutions.ae/wp-content/uploads/2023/02/brochure_7-1024x781.jpg','A2Z Solutions','The Wave (po lewej) i osobny DAMAC Marina Bay (po prawej)','https://a2zsolutions.ae/the-wave-aabar/'),U('https://static.shared.propertyfinder.ae/media/images/listing/VHF8F31QR760EH5C9MHZB667Z4/058c7dfa-f741-4535-a320-2a9790f00fc2/668x452.webp','Property Finder','The Wave — promenada od strony wody','https://www.propertyfinder.ae/en/plp/rent/apartment-for-rent-abu-dhabi-al-reem-island-najmat-abu-dhabi-the-wave-2PecyxKe0ci.html')],
    N04: [U('https://storage2.emirates.estate/static/p/amnmwj1kuvfeaarwg/2qw1ssf2og9dy24/horizontower00.jpg','Emirates.Estate','Horizon Towers — dwie osobne wieże; faktycznie City of Lights','https://emirates.estate/property/horizon-towers-126664/')],
    S01: [U('https://megaconstrucciones.net/images/rascacielos/foto2/gate-towers.jpg','Megaconstrucciones','Gate Towers — trzy wieże połączone górnym mostem','https://megaconstrucciones.net/?construccion=the-gate-towers')],
    S02: [U('https://arquitectonica.com/architecture/wp-content/uploads/sites/2/2016/10/Sky_Tower_Sun_Tower_Gate_and_Arc_Towers_3-1920x1080.jpg','Arquitectonica','The Arc — część zespołu Gate / Arc; widok zespołowy','https://arquitectonica.com/architecture/project/the-gate-sky-sun-arc-towers-boutik-mall/','kontekst')],
    S03: [U('https://graph-images.propertyfinder.ae/ae/building/5578/6b3401cfa24c7fd5d2514225bbba2fc7/watermark.jpeg','Property Finder','Sky Tower — osobny widok elewacji od ulicy','https://www.propertyfinder.ae/en/area-insights/abu-dhabi/compounds-and-towers/al-reem-island-shams-abu-dhabi-sky-tower'),U('https://arquitectonica.com/architecture/wp-content/uploads/sites/2/2018/07/Sky_Tower_Sun_Tower_Gate_and_Arc_Towers_1-1920x1080.jpg','Arquitectonica','Sky i Sun Tower — ujęcie dwóch różnych brył','https://arquitectonica.com/architecture/project/the-gate-sky-sun-arc-towers-boutik-mall/','kontekst')],
    S04: [U('https://shamsabudhabi.com/storage/gallaries/0NRXd4khuaJEHgCQm0lU86Zu6nqo4XfvyAnxJAhA.jpg','Shams Abu Dhabi','Sun Tower i Sky Tower — fotografia pokazująca różne bryły','https://shamsabudhabi.com/sun-tower','kontekst'),U('https://arquitectonica.com/architecture/wp-content/uploads/sites/2/2018/07/Sky_Tower_Sun_Tower_Gate_and_Arc_Towers_5-1920x1080.jpg','Arquitectonica','Sun Tower — widok w kontekście zespołu','https://arquitectonica.com/architecture/project/the-gate-sky-sun-arc-towers-boutik-mall/','kontekst')],
    S05: [U('https://scenenow.com/Content/editor_api/images/Artboard%209-870a7def-dc9a-4778-9844-8d2fbac13114.jpg','SceneNow','Pixel — fotografia kompleksu; siedem budynków','https://scenenow.com/Home/Abu-Dhabi-s-Latest-Socially-Driven-Housing-is-Made-of-Concrete-Pixels')],
    S06: [U('https://d3ob0s3rxbjyep.cloudfront.net/content/Shams_Boutik_Mall_Kite_Residences_01cbd0b294_0c93deb7af.jpg','Bayut','Shams Boutik — rzeczywista niska fasada handlowa','https://www.bayut.com/buildings/kite-residences/')],
    S07: [U('https://www.timeoutabudhabi.com/cloud/timeoutabudhabi/2021/09/11/vbzhZDZA-ReemSkatePark_8.2-1-1200x800.jpg','Time Out Abu Dhabi','Reem Central Park — park, boisko i istniejące wieże w tle','https://www.timeoutabudhabi.com/culture/art/404447-why-reem-central-park-is-on-of-the-coolest-places-in-the-city')],
    S08: [U('https://www.alreemislandprojects.ae/front/assets/images/Repton-school.webp','Al Reem Island Projects','Repton School — elewacja kampusu (identyfikacja Rose wymaga potwierdzenia)','https://www.alreemislandprojects.ae/ar','kontekst'),U('https://framerusercontent.com/images/I0PJQRTtjmuKtp6VgFf1kbHTYk.webp?height=618&width=1140','Harper Wellington','Repton Abu Dhabi — wejście szkolne; dokładny kampus wymaga porównania z lokalizacją','https://harperwellington.com/communities/al-reem-island','kontekst')],
    S09: [U('https://www.alreemislandprojects.ae/front/assets/images/Burjeel-Hospital.jpg','Al Reem Island Projects','Burjeel Day Surgery Center — rzeczywista elewacja wejściowa','https://www.alreemislandprojects.ae/ar')]
  };
  const INFERRED = {M07:[24.501003,54.391157],T01:[24.492494,54.393992],N01:[24.488708,54.400043],N02:[24.484453,54.402116],S02:[24.494992,54.408843],S04:[24.496202,54.407743],S06:[24.495734,54.408716],S09:[24.494719,54.409224]};
  const all = DATA.objects, zones = DATA.meta.groups;
  for (const d of all) {
    const extra = NEW[d.code] || [];
    const original = (d.photos||[]).map(p=>U(p.url,p.credit,p.kind,DATA.sources[p.source]?.url || p.url,p.kind.toLowerCase().includes('render')?'wizualizacja':'źródło'));
    const found = new Set();
    d.media = [...extra,...original].filter(p=>p.url && !found.has(p.url) && found.add(p.url));
    d.point = d.ll || INFERRED[d.code] || null;
    d.pointEstimated = !d.ll && !!d.point;
  }
  const h = document.createElement('style');h.textContent = `
  .map{height:min(74vh,820px);min-height:520px}
  #liveMap{position:relative;width:100%;height:min(74vh,820px);min-height:520px;background:#12283a}
  .leaflet-container{font:inherit!important}
  .leaflet-control-layers{font-size:12px}
  .live-pin{background:transparent;border:0}
  .pin-bubble{height:27px;min-width:39px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:800;box-shadow:0 3px 12px #001a2b80;border:1.5px solid #fff;border-radius:18px}
  .pin-bubble.chosen{outline:3px solid #f3d78b;transform:scale(1.14)}
  .photo-gallery{display:grid;gap:13px}
  .photo-frame{margin:0!important;overflow:hidden;background:#f1f4f7}
  .photo-frame img{display:block;width:100%;height:235px;max-height:none;object-fit:cover;object-position:center}
  .photo-frame.primary img{height:310px}
  .photo-frame figcaption{line-height:1.5;overflow-wrap:anywhere}
  .photo-frame figcaption strong{display:block;color:#1b2c40;font-size:12px}
  .photo-frame .source-link{font-size:11px;text-decoration:none;color:#1e648b}
  .photo-frame .source-link:hover{text-decoration:underline}
  .kindmark{display:inline-block;background:#e4edf2;color:#344d63;padding:3px 7px;border-radius:4px;font-weight:700;font-size:10px;margin-bottom:6px}
  .kindmark.unverified{background:#ffe8d9;color:#8a481f}
  .no-photo{padding:22px;border:1px solid #dce2e9;border-radius:8px;background:#f6f8fb;font-size:12px}
  .no-photo strong{display:block;margin-bottom:7px}
  .viewlinks{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:16px}
  .viewlinks a{padding:10px 9px;border-radius:6px;font-size:11px;border:1px solid #d2dce6;text-align:center;color:#193f5c;background:#f6f9fb;text-decoration:none}
  .viewlinks a:hover{background:#e6f0f6}
  .picnotice{padding:10px;background:#f6f8fb;border-left:3px solid #849eb1;margin:8px 0 16px;font-size:11px;color:#526579}
  .picnotice.warn{background:#fff6ee;border-color:#c58a48}
  .refstat{display:inline-flex;align-items:center;margin-left:7px;font-size:10px;color:#62788c}
  .gallery-lead{font-size:11px;color:#526579;margin-bottom:11px}
  .failed-photo{min-height:150px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:9px;padding:16px;background:#f1f4f7;color:#526579}
  .failed-photo a{font-size:11px}
  .auditMap{width:100%;height:400px;border:1px solid #dae3ea;border-radius:8px}
  @media(min-width:1251px){.workspace{grid-template-columns:240px minmax(400px,1fr) minmax(360px,450px)}}
  @media(max-width:1250px){.photo-frame.primary img{height:300px}}
  @media(max-width:720px){#liveMap{height:490px;min-height:470px}.viewlinks{grid-template-columns:1fr 1fr}}
  `;document.head.append(h);
  const oldSelect = select;
  let leafletMap, pinsLayer, markers={};
  let labelsActive = true;
  function mapLink(d){return d.point?'https://www.google.com/maps/search/?api=1&query='+d.point.map(x=>x.toFixed(6)).join('%2C'):'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(d.name+' Abu Dhabi');}
  function streetLink(d){return d.point?'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint='+d.point.join('%2C'):mapLink(d);}
  function buildGallery(d) {
    const gallery = document.querySelector('#card .cardbody > div:last-child');
    if (!gallery) return;
    const loc = d.pointEstimated ? 'Punkt wyliczony z podkładu; orientacyjny, nie pomiar geodezyjny.' : d.point ? 'Punkt referencyjny obiektu; nie jest obrysem budynku.' : 'Brak potwierdzonego punktu tego obiektu.';
    const warning = d.code==='T03'?'<div class="picnotice warn"><strong>Uwaga:</strong> nazwa „Tamouh retail” nie została zidentyfikowana. Paragon Bay Mall to tylko kandydat — wizualizacja nie potwierdza istniejącego budynku.</div>':d.code==='N02'?'<div class="picnotice warn">Zdjęcie przedstawia tylko fragment nabrzeża przy The Wave. Dla geometrii całego basenu używaj mapy satelitarnej, nie renderów przyszłej zabudowy.</div>':d.code==='M02'||d.code==='M03'?'<div class="picnotice">Zdjęcia całego ADGM Square nie są jednoznaczną identyfikacją jednej wieży. Konkretne elewacje porównuj z planem i widokiem na mapie.</div>':'';
    const buttons = '<div class="viewlinks"><a href="'+mapLink(d)+'" target="_blank" rel="noopener noreferrer">↗ Google Maps / 3D</a><a href="'+streetLink(d)+'" target="_blank" rel="noopener noreferrer">↗ Street View (jeżeli jest)</a></div>';
    const n = d.media.length;
    let content = '';
    if (!n) content='<div class="no-photo"><strong>Brak potwierdzonej fotografii</strong>Otwórz mapę i materiały źródłowe; nie podmieniamy tego na losowy obiekt.</div>';
    else content = '<div class="photo-gallery">'+d.media.slice(0,4).map((p,i) => {
      const warningKind = /kandydat|wizualizac|kontekst|otoczenie/i.test(p.type);
      const type = escapeText(p.type);
      return '<figure class="photo-frame '+(i===0?'primary':'')+'"><a class="photo-view" href="'+escapeAttr(p.source)+'" target="_blank" rel="noopener noreferrer"><img loading="lazy" decoding="async" referrerpolicy="no-referrer" src="'+escapeAttr(p.url)+'" alt="'+escapeAttr(d.name+' — '+p.label)+'"></a><figcaption><span class="kindmark '+(warningKind?'unverified':'')+'">'+type+'</span><strong>'+escapeText(p.label)+'</strong><span>'+escapeText(p.credit)+'</span><br><a class="source-link" href="'+escapeAttr(p.source)+'" target="_blank" rel="noopener noreferrer">Otwórz zdjęcie / galerię w źródle ↗</a></figcaption></figure>';
    }).join('')+'</div>';
    gallery.innerHTML = '<h3>WIDOKI I ZDJĘCIA / '+n+' '+(n===1?'REFERENCJA':'REFERENCJE')+'</h3><div class="gallery-lead">Oryginalne ujęcia z podanych źródeł; część fotografii to widoki zespołów, część wizualizacje projektowe.</div>'+buttons+warning+content+'<p class="picnotice">'+escapeText(loc)+' Zdjęcia należą do ich autorów; korzystaj ze źródła przed publikacją w ofercie.</p>';
    gallery.querySelectorAll('img').forEach(img=>{
      img.onerror=function(){
        const a=img.closest('a'), fig=img.closest('.photo-frame');
        if (!fig) return;
        a.outerHTML='<div class="failed-photo">Podgląd zewnętrzny został zablokowany lub zdjęcie usunięto.<a href="'+escapeAttr(a.href)+'" target="_blank" rel="noopener noreferrer">Otwórz galerię autora ↗</a></div>';
      };
    });
  }
  function escapeText(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function escapeAttr(value){return escapeText(value);}
  function updateMarkerSelection(){
    if (!leafletMap) return;
    for (const [id,m] of Object.entries(markers)){
      const d=all.find(x=>x.code===id), on=selected===id;
      m.setIcon(markerIcon(d,on));
    }
  }
  function markerIcon(d,on){
    const c=zones[d.group].color;
    return L.divIcon({className:'live-pin',html:'<span class="pin-bubble '+(on?'chosen':'')+'" style="background:'+c+'">'+d.code+'</span>',iconSize:[42,28],iconAnchor:[21,14]});
  }
  function syncPins(){
    if (!leafletMap) return;
    pinsLayer.clearLayers();markers={};
    for (const d of all){
      if (!d.point || (group!=='all' && group!==d.group) || (query && !(d.code+' '+d.name+' '+d.where).toLowerCase().includes(query))) continue;
      const pin=L.marker(d.point,{icon:markerIcon(d,selected===d.code),title:d.name});
      pin.bindTooltip(d.code+' · '+d.name+(d.pointEstimated?' (orientacyjnie)':''),{direction:'top'});
      pin.on('click',()=>select(d.code));pin.addTo(pinsLayer);markers[d.code]=pin;
    }
  }
  function fitPins(){
    if (!leafletMap) return;
    const pts=all.filter(d=>d.point && (group==='all'||d.group===group)).map(d=>d.point);
    if (pts.length)leafletMap.fitBounds(L.latLngBounds(pts).pad(.19),{maxZoom:16,animate:true});
  }
  select = function(id) {
    oldSelect(id);
    const d=all.find(x=>x.code===id);
    if (!d)return;
    buildGallery(d);
    if (leafletMap && d.point && markers[id])leafletMap.flyTo(d.point,Math.max(leafletMap.getZoom(),16),{duration:.55});
    if(leafletMap)updateMarkerSelection();
    if(window.history && history.replaceState)history.replaceState(null,'','#'+encodeURIComponent(id));
  };
  const photoCounts=all.filter(d=>d.media.length).length;
  const title=document.querySelector('header .meta');
  if(title)title.innerHTML='22.10.2026 &nbsp; | &nbsp; v02<br>'+all.length+' obiektów · '+photoCounts+' karty z ujęciami';
  const note=document.querySelector('#medianote');
  if(note)note.textContent='Fotografie i wizualizacje są podlinkowane bezpośrednio do ich autorów (nie są częścią licencjonowanego pakietu CTRLstudio). Niedostępne podglądy pokazują czytelny link do galerii źródłowej.';
  const firstIntro=document.querySelector('.intro');
  if(firstIntro)firstIntro.innerHTML='<strong>Atlas referencyjny, nie model AI.</strong> Wybierz budynek, aby sprawdzić zdjęcia, status identyfikacji, źródła i rzeczywistą lokalizację. Warstwa satelitarna ma własną datę zobrazowania; znaczniki są orientacyjne, nie potwierdzają obrysów.';
  const staticSvg=document.querySelector('#map');
  function setupLiveMap(){
    if(typeof L==='undefined'){console.warn('Leaflet unavailable; using static map fallback');return;}
    const el=document.createElement('div');el.id='liveMap';el.setAttribute('aria-label','Mapa satelitarna Al Reem i Al Maryah z obiektami ADGM');
    staticSvg.before(el);staticSvg.style.display='none';
    const satellite=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:19,attribution:'Imagery © Esri, Maxar, Earthstar Geographics, GIS User Community'});
    const streets=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'});
    leafletMap=L.map(el,{layers:[satellite],zoomControl:false,scrollWheelZoom:true,worldCopyJump:false,maxZoom:19});
    L.control.zoom({position:'bottomleft'}).addTo(leafletMap);
    L.control.layers({'Satelita':satellite,'Ulice / OSM':streets},null,{position:'topright'}).addTo(leafletMap);
    pinsLayer=L.layerGroup().addTo(leafletMap);
    leafletMap.setView([24.495,54.402],14);
    syncPins();fitPins();
    document.querySelector('#plus').onclick=()=>leafletMap.zoomIn();
    document.querySelector('#minus').onclick=()=>leafletMap.zoomOut();
    document.querySelector('#reset').onclick=()=>{group='all';document.querySelectorAll('[data-group]').forEach(b=>b.classList.toggle('active',b.dataset.group==='all'));render();syncPins();fitPins();};
    document.querySelector('#labels').onclick=e=>{labelsActive=!labelsActive;e.currentTarget.textContent=labelsActive?'Ukryj oznaczenia':'Pokaż oznaczenia';document.querySelector('#liveMap').classList.toggle('hide-pins',!labelsActive);if(labelsActive)syncPins();else pinsLayer.clearLayers();};
    for(const b of document.querySelectorAll('[data-group]'))b.addEventListener('click',()=>{if(!labelsActive){labelsActive=true;document.querySelector('#labels').textContent='Ukryj oznaczenia';}syncPins();fitPins();});
    document.querySelector('#search').addEventListener('input',syncPins);
    leafletMap.on('tileerror',()=>{const n=document.querySelector('.mapnote');if(n && !n.dataset.warned){n.dataset.warned='1';n.textContent+=' Uwaga: jeśli obrazy satelitarne nie wczytują się, przełącz warstwę na Ulice / OSM.';}});
    const mapnote=document.querySelector('.mapnote');
    if(mapnote)mapnote.textContent='Prawdziwa mapa satelitarna (Esri) / OpenStreetMap. Przełącz warstwę w prawym górnym rogu. Znaczniki bez zweryfikowanych współrzędnych wyliczono z dawnego podkładu i oznaczono jako orientacyjne. Horizon Towers pozostaje w City of Lights; nie przesuwamy rzeczywistych budynków.';
  }
  try{setupLiveMap();}catch(err){console.warn('Satellite map initialization failed',err);}
  const auditImg=document.querySelector('.auditgrid img');
  if(auditImg){
    const iframe=document.createElement('iframe');
    iframe.className='auditMap';
    iframe.loading='lazy';
    iframe.title='Najmat Abu Dhabi — mapa kontrolna rzeczywistego nabrzeża';
    iframe.src='https://www.openstreetmap.org/export/embed.html?bbox=54.395%2C24.481%2C54.407%2C24.491&layer=mapnik';
    auditImg.replaceWith(iframe);
    const p=document.querySelector('#audit p');
    if(p)p.textContent='Mapa kontrolna Najmat (aktualny podkład OpenStreetMap) i sześć warunków geometrii. Nie przedstawia planowanych marin i wież jako istniejącej zabudowy.';
  }
  const hash=decodeURIComponent(location.hash.slice(1));
  const initial=all.some(x=>x.code===hash)?hash:'M01';
  select(initial);
})();