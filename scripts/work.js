

(function(){'use strict';
const demoImages={barnes:'assets/f8a3fa344815.webp',cycle:'assets/500a25b3d15f.webp',other:'assets/c02578d0335e.webp'};
let companies=[
 {id:'barnes',name:'BARNES',role:'HEAD OF DIGITAL',tags:'STRATEGY / PERFORMANCE / TECHNOLOGY',url:'https://barn-estate.ru/',image:demoImages.barnes,concept:true},
 {id:'cycle',name:'CYCLE',role:'AGENCY DIRECTOR',tags:'STRATEGY / CREATIVE / EXECUTION',url:'',image:demoImages.cycle,concept:true},
];
const caseContent={
 barnes:{summary:'Landing pages, acquisition and the customer journey.',intro:'Digital direction for BARNES Estate in Moscow, connecting property marketing with the journey from first visit to enquiry.',facts:[['Focus','Make the property offer clear across campaigns and landing pages.'],['My responsibility','Landing pages and UI kits, paid acquisition, analytics and CRM connections.'],['In practice','Interface reviews, conversion tracking, traffic quality and launch checks.']]},
 cycle:{summary:'Strategy, creative direction and digital delivery.',intro:'CYCLE is my agency: a place to connect strategy, creative work and technology around a business task.',facts:[['Focus','Connect strategy, creative work and execution.'],['My responsibility','Agency direction, priorities and coordination of digital work.'],['Practice','Digital strategy, performance, UX/UI, analytics and automation.']]}
};
const byId=id=>document.getElementById(id);
const site=byId('site'), section=byId('work'), sticky=byId('storySticky'), frame=byId('storyFrame'), track=byId('storyScreens'), phoneTrack=byId('storyPhoneScreens');
let active=0, metrics=null, lastRouteScroll=0, animRaf=0, changingMeta=false;
let reduced=Boolean(window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches);
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const smooth=t=>t*t*(3-2*t);
const lerp=(a,b,t)=>a+(b-a)*t;
function renderScreens(){
 track.replaceChildren();phoneTrack.replaceChildren();
 companies.forEach((c,i)=>{
  const layer=document.createElement('div');layer.className='story-layer';layer.dataset.index=String(i);layer.style.zIndex=i+1;
  const img=document.createElement('img');img.src=c.image;img.alt=c.name+(c.concept?' — visual concept':' — website screenshot');img.loading=i<2?'eager':'lazy';img.decoding='async';
  layer.append(img);track.append(layer);
  const phoneLayer=layer.cloneNode(true);phoneLayer.querySelector('img').alt='';phoneTrack.append(phoneLayer);
 });
 requestAnimationFrame(()=>{measureStory();paintStory()});
}
function setHero(id){byId('hero').className='hero hero--v'+id;site.classList.toggle('ref-mode',String(id)==='0');byId('heroName').innerHTML=id==='6'?'<span>Daniil</span><span>Terekh</span>':'<span>DANIIL</span><span>TEREKH</span>';requestAnimationFrame(()=>{measureStory();paintStory()});}
function measureStory(){
 if(byId('mainPage').hidden)return;
 const labH=0;
 document.documentElement.style.setProperty('--lab-h',labH+'px');
 const realMobile=window.innerWidth<=720, simulated=false, mobile=realMobile||simulated;
 document.documentElement.classList.toggle('mobile-actual',realMobile);
 const stageH=window.DTViewport.height();
 document.documentElement.style.setProperty('--stage-h',stageH+'px');
 const introDist=Math.round(stageH*(mobile?.35:.50)); const slideDist=Math.round(stageH*.65); const outroDist=Math.round(stageH*(mobile?.12:.20));
 section.style.height=(stageH+introDist+Math.max(0,companies.length-1)*slideDist+outroDist)+'px';
 const top=section.getBoundingClientRect().top+window.scrollY;
 const stageTop=parseFloat(getComputedStyle(sticky).top)||0;
 const start=top-stageTop;
 const stageW=sticky.clientWidth;
 // One persistent device group spans Hero and Work. Reserve room for its phone.
 const targetW=Math.min(stageW*(mobile?.90:.65),Math.max(200,stageH-(mobile?265:300))*1.6);
 const initialW=mobile?Math.min(stageW*.81,targetW*.91):Math.min(stageW*.68,targetW*1.08);
 const startLeft=mobile?(stageW-initialW)/2:stageW*.14;
 const endLeft=(stageW-targetW*(mobile?1:1.15))/2;
 const startTop=mobile?stageH*.235:stageH*.06;
 const endTop=mobile?stageH*.145:stageH*.12;
 metrics={mobile,start,stageH,stageW,labH,introDist,slideDist,outroDist,targetW,initialW,startLeft,endLeft,startTop,endTop};
 section.dataset.scrollStops=JSON.stringify(companies.map((_,i)=>Math.round(start+(i===0?introDist*.94:introDist+((i-1)+.92)*slideDist))));
}
function paintStory(){
 if(!metrics||byId('mainPage').hidden)return;
 const m=metrics,local=Math.max(0,window.scrollY-m.start),enter=smooth(clamp(local/m.introDist));
 const screenW=lerp(m.initialW,m.targetW,enter);
 const left=lerp(m.startLeft,m.endLeft,enter),top=lerp(m.startTop,m.endTop,enter);
 const rotateY=lerp(m.mobile?-9:-14,m.mobile?0:-1,enter),rotateZ=lerp(m.mobile?-4:6,m.mobile?0:3,enter);
 frame.style.width=screenW+'px';frame.style.left=left+'px';frame.style.top=top+'px';
 frame.style.transform='perspective(1300px) rotateY('+rotateY+'deg) rotateZ('+rotateZ+'deg)';
 // The screen and phone never crossfade or swap during the Hero entrance.
 const metaOpacity=clamp((enter-.47)/.42);
 byId('storyCaption').style.opacity=metaOpacity;
 byId('storyCaption').style.transform='translateY('+lerp(14,0,metaOpacity)+'px)';
 byId('storyCaption').style.pointerEvents=metaOpacity>.85?'auto':'none';
 byId('storyControls').style.opacity=metaOpacity;
 byId('storyControls').style.pointerEvents=metaOpacity>.85?'auto':'none';
 byId('storyAmbient').style.opacity=clamp((enter-.15)/.65)*.93;
 // All images enter from the BOTTOM, one after another. Scrolling up reverses the motion.
 const layers=track.children;let activeIndex=0,slideFraction=0;
 for(let i=0;i<layers.length;i++){
  let reveal=i===0?1:smooth(clamp((local-m.introDist-(i-1)*m.slideDist)/m.slideDist));
  let next=i<layers.length-1?smooth(clamp((local-m.introDist-i*m.slideDist)/m.slideDist)):0;
  const y=(i===0?0:(1-reveal)*110)-next*11;
  layers[i].style.transform='translate3d(0,'+y+'%,0)';
  layers[i].style.visibility=(i===0||reveal>.0001)?'visible':'hidden';
  phoneTrack.children[i].style.transform=layers[i].style.transform;
  phoneTrack.children[i].style.visibility=layers[i].style.visibility;
  if(i>0&&reveal>=.5)activeIndex=i;
  if(i>0&&reveal>0&&reveal<1)slideFraction=reveal;
 }
 if(activeIndex!==active)setActive(activeIndex);
 const approx=clamp((local-m.introDist)/Math.max(1,(companies.length-1)*m.slideDist));
 byId('storyTrackProgress').style.width=Math.max(2,100*(activeIndex+1)/companies.length)+'%';
 byId('storyPrev').disabled=activeIndex===0;
 byId('storyNext').disabled=activeIndex>=companies.length-1;
 frame.style.pointerEvents=metaOpacity>.75?'auto':'none';
}
function setActive(i){
 active=i;const c=companies[i];
 byId('storyName').textContent=c.name;byId('storyRole').textContent=c.role;byId('heroRefCompany').textContent=c.name;byId('heroRefCount').textContent=String(i+1).padStart(2,'0');
 byId('storyTags').textContent=c.tags;byId('storySummary').textContent=caseContent[c.id].summary;
 byId('storyIndex').textContent=String(i+1).padStart(2,'0');
 frame.setAttribute('aria-label','Read about '+c.name);
 byId('storyCase').setAttribute('aria-label','Read about '+c.name);
}
function schedulePaint(){if(animRaf)return;animRaf=requestAnimationFrame(()=>{animRaf=0;paintStory()});}
function goToProject(index){
 if(!metrics)return;index=clamp(index,0,companies.length-1);
 const m=metrics;
 const offset=index===0?m.introDist*.94:m.introDist+((index-1)+.92)*m.slideDist;
 const y=m.start+offset;
 if(window.DTScenes)window.DTScenes.goTo(y);else window.scrollTo({top:Math.max(0,y),behavior:'instant'});
}
function goDetail(id){lastRouteScroll=window.scrollY;window.location.hash='#experience/'+encodeURIComponent(id)}
function applyRoute(){
 const hash=decodeURIComponent(window.location.hash||'');
 const main=byId('mainPage'),detail=byId('detailPage'),all=byId('allPage');
 const prevMainHidden=main.hidden;
 main.hidden=false;detail.classList.remove('is-open');all.classList.remove('is-open');
 if(hash==='#experience/all'){
  main.hidden=true;all.classList.add('is-open');renderAll();window.scrollTo(0,0);
 }else if(hash.startsWith('#experience/')){
  const id=hash.slice('#experience/'.length),c=companies.find(x=>x.id===id);
  if(!c){history.replaceState(null,'',window.location.pathname+window.location.search);return applyRoute()}
  main.hidden=true;detail.classList.add('is-open');byId('detailName').textContent=c.name;byId('detailRole').textContent=c.role;
  byId('detailImage').src=c.image;byId('detailImage').alt=c.name+' — visual concept';
  byId('detailDesc').textContent=caseContent[c.id].intro;
  byId('case-facts').replaceChildren(...caseContent[c.id].facts.map(([label,copy])=>{const item=document.createElement('section'),h=document.createElement('h2'),p=document.createElement('p');h.textContent=label;p.textContent=copy;item.append(h,p);return item;}));
  byId('detailExternal').hidden=!c.url;if(c.url)byId('detailExternal').href=c.url;
  window.scrollTo(0,0);
 }else if(prevMainHidden){
  requestAnimationFrame(()=>{measureStory();const target=hash.startsWith('#')?document.getElementById(hash.slice(1)):null;if(target)target.scrollIntoView({behavior:'instant',block:'start'});else window.scrollTo({top:lastRouteScroll,behavior:'instant'});paintStory()});
 }
}
function renderAll(){
 const list=byId('allList');list.replaceChildren();companies.forEach(c=>{
  const button=document.createElement('button');button.type='button';button.className='all-item';
  const a=document.createElement('span');a.textContent=c.name;
  const b=document.createElement('span');b.textContent=c.role+'  ↗︎';button.append(a,b);button.addEventListener('click',()=>goDetail(c.id));list.append(button);
 });
}
function updateMobileClass(){document.documentElement.classList.toggle('mobile-actual',window.innerWidth<=720)}

byId('storyPrev').addEventListener('click',()=>goToProject(active-1));
byId('storyNext').addEventListener('click',()=>goToProject(active+1));
byId('storyCase').addEventListener('click',()=>goDetail(companies[active].id));
frame.addEventListener('click',()=>{if(metrics&&window.scrollY>=metrics.start+metrics.introDist*.72)goDetail(companies[active].id)});
frame.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(metrics&&window.scrollY>=metrics.start+metrics.introDist*.72)goDetail(companies[active].id)}});
byId('allBtn')?.addEventListener('click',()=>goDetail('all'));byId('heroRefCase').addEventListener('click',()=>goDetail(companies[active].id));
byId('backBtn').addEventListener('click',()=>{window.location.hash='#home'});
byId('backAllBtn').addEventListener('click',()=>{window.location.hash='#home'});
byId('siteWorkLink').addEventListener('click',e=>{e.preventDefault();if(byId('mainPage').hidden){location.hash='#home';requestAnimationFrame(()=>requestAnimationFrame(()=>goToProject(0)));}else goToProject(0)});
window.addEventListener('hashchange',applyRoute);
window.addEventListener('scroll',schedulePaint,{passive:true});
window.addEventListener('resize',()=>{measureStory();schedulePaint()},{passive:true});
const ros=new ResizeObserver(()=>{measureStory();schedulePaint()});ros.observe(site);
setActive(0);renderScreens();setHero('0');updateMobileClass();applyRoute();requestAnimationFrame(()=>{measureStory();paintStory()});
})();

