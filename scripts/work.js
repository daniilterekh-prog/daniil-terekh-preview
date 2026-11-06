

(function(){'use strict';
const allProjects=window.DTExperience.projects;
const companies=window.DTExperience.featured;
const originalTitle=document.title;
let detailReturn='work',archiveScroll=0,archiveFilter='all';
const arrow='<svg class="ui-arrow" aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function element(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text)el.textContent=text;return el;}
const byId=id=>document.getElementById(id);
const site=byId('site'), section=byId('work'), sticky=byId('storySticky'), frame=byId('storyFrame'), track=byId('storyScreens');
let lastPaintLocal=null;
let active=0, metrics=null, lastRouteScroll=0, lastRouteFocus=null, animRaf=0;
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const smooth=t=>t*t*(3-2*t);
const lerp=(a,b,t)=>a+(b-a)*t;
function renderScreens(){
 track.replaceChildren();
 companies.forEach((c,i)=>{
  const layer=document.createElement('div');layer.className='story-layer';layer.dataset.index=String(i);layer.style.zIndex=i+1;
  const info=element('div','story-company-info');
  const logo=element('img','story-company-logo');logo.src=c.logo;logo.alt=c.name;logo.decoding='async';
  const brief=element('p','story-company-brief',c.companyBrief);
  const role=element('h3','story-company-role',c.role);
  const link=element('a','story-company-case');link.href='#experience/'+c.id;link.innerHTML='<span>EXPLORE THE CASE</span>'+arrow;link.setAttribute('aria-label','View '+c.name+' case study');
  link.addEventListener('click',()=>{lastRouteScroll=window.scrollY;lastRouteFocus=document.activeElement;detailReturn='work';});
  info.append(logo,brief,role,link);
  const website=element('div','story-company-website'),img=element('img');img.src=c.homepageScreen;img.alt=c.homepageAlt||c.name+' — company homepage';img.loading=i<2?'eager':'lazy';img.decoding='async';website.append(img);
  layer.append(info,website);layer.inert=i!==active;layer.setAttribute('aria-hidden',String(i!==active));track.append(layer);
 });
 requestAnimationFrame(()=>{measureStory();paintStory()});
}
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
 // The persistent tablet leaves room for a navigation rail on the left.
 const targetW=mobile?Math.min(stageW*.78,(stageH-205)*.64):Math.min(stageW*.80,Math.max(300,stageH-250)*1.7);
 const initialW=mobile?Math.min(stageW*.81,targetW*.91):Math.min(stageW*.68,targetW*1.08);
 const startLeft=mobile?(stageW-initialW)/2:stageW*.14;
 const endLeft=mobile?stageW-targetW-stageW*.055:(stageW-targetW)/2+28;
 const startTop=mobile?stageH*.235:stageH*.06;
 const endTop=mobile?stageH*.09:stageH*.095;
 lastPaintLocal=null;
 metrics={mobile,start,stageH,stageW,labH,introDist,slideDist,outroDist,targetW,initialW,startLeft,endLeft,startTop,endTop};
 section.dataset.scrollStops=JSON.stringify(companies.map((_,i)=>Math.round(start+(i===0?introDist*.94:introDist+((i-1)+.92)*slideDist))));
}
function paintStory(){
 if(!metrics||byId('mainPage').hidden)return;
 const m=metrics,local=clamp(window.scrollY-m.start,0,m.introDist+Math.max(0,companies.length-1)*m.slideDist);
 if(local===lastPaintLocal)return;lastPaintLocal=local;
 const enter=smooth(clamp(local/(m.introDist*.9)));
 const screenW=lerp(m.initialW,m.targetW,enter);
 const left=lerp(m.startLeft,m.endLeft,enter),top=lerp(m.startTop,m.endTop,enter);
 const rotateY=lerp(m.mobile?-9:-14,0,enter),rotateZ=lerp(m.mobile?-4:6,0,enter);
 frame.style.width=screenW+'px';frame.style.left=left+'px';frame.style.top=top+'px';
 frame.style.transform=enter>=1?'none':'perspective(1300px) rotateY('+rotateY+'deg) rotateZ('+rotateZ+'deg)';
 // Keep the same live tablet throughout the Hero entrance.
 const metaOpacity=clamp((enter-.47)/.42);
 byId('storyCaption').style.opacity=metaOpacity;
 byId('storyCaption').style.transform='translateY('+lerp(14,0,metaOpacity)+'px)';
 byId('storyCaption').style.pointerEvents=metaOpacity>.85?'auto':'none';
 byId('storyControls').style.opacity=metaOpacity;
 byId('storyControls').style.pointerEvents=metaOpacity>.85?'auto':'none';
 byId('storyCaption').inert=metaOpacity<=.85;byId('storyControls').inert=metaOpacity<=.85;
 frame.inert=metaOpacity<=.75;
 byId('storyAmbient').style.opacity=clamp((enter-.15)/.65)*.93;
 // All images enter from the BOTTOM, one after another. Scrolling up reverses the motion.
 const layers=track.children;let activeIndex=0;
 for(let i=0;i<layers.length;i++){
  let reveal=i===0?1:smooth(clamp((local-m.introDist-(i-1)*m.slideDist)/(m.slideDist*.9)));
  let next=i<layers.length-1?smooth(clamp((local-m.introDist-i*m.slideDist)/m.slideDist)):0;
  const y=(i===0?0:(1-reveal)*110)-next*11;
  layers[i].style.transform='translateY('+y+'%)';
  layers[i].style.visibility=(i===0||reveal>.0001)?'visible':'hidden';
  if(i>0&&reveal>=.5)activeIndex=i;
 }
 if(activeIndex!==active)setActive(activeIndex);
 byId('storyPrev').disabled=activeIndex===0;
 byId('storyNext').disabled=activeIndex>=companies.length-1;
 frame.style.pointerEvents=metaOpacity>.75?'auto':'none';
}
function setActive(i){
 active=i;const c=companies[i];
 byId('storyName').textContent=c.name;byId('heroRefCompany').textContent=c.name;byId('heroRefCount').textContent=String(i+1).padStart(2,'0');
 frame.setAttribute('aria-label','Selected company: '+c.name);
 [...track.children].forEach((layer,index)=>{layer.inert=index!==i;layer.setAttribute('aria-hidden',String(index!==i));});
}
function schedulePaint(){if(animRaf)return;animRaf=requestAnimationFrame(()=>{animRaf=0;paintStory()});}
function goToProject(index){
 if(!metrics)return;index=clamp(index,0,companies.length-1);
 const m=metrics;
 const offset=index===0?m.introDist*.94:m.introDist+((index-1)+.92)*m.slideDist;
 const y=m.start+offset;
 if(window.DTScenes)window.DTScenes.goTo(y);else window.scrollTo({top:Math.max(0,y),behavior:'instant'});
}
function goDetail(id){
 if(!byId('mainPage').hidden){lastRouteScroll=window.scrollY;lastRouteFocus=document.activeElement;detailReturn='work';}
 else if(byId('allPage').classList.contains('is-open')){archiveScroll=window.scrollY;lastRouteFocus=document.activeElement;detailReturn='all';}
 window.location.hash='#experience/'+encodeURIComponent(id);
}
function scrollInstant(top){window.scrollTo({top:Math.max(0,top),behavior:'instant'});}
function focusTitle(page){const heading=page.querySelector('h1');heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
function renderDetail(c){
 byId('detailName').textContent=c.name;byId('detailHeadline').textContent=c.headline;
 byId('detailRole').replaceChildren(...[c.role,c.location,c.sector].map(t=>element('span','',t)));
 byId('detailImage').parentElement.hidden=!c.image;
 if(c.image){byId('detailImage').src=c.image;byId('detailImage').alt=c.imageAlt||c.name+' — company homepage';}
 byId('detailDesc').textContent=c.intro;
 const facts=byId('case-facts');facts.replaceChildren();
 for(const [heading,value] of [['The task.',c.challenge],['The approach.',c.approach],['My contribution.',c.contribution],['What took shape.',c.delivered]]){
  const section=element('section');section.append(element('h2','',heading));
  if(Array.isArray(value)){const list=element('ul');value.forEach(v=>list.append(element('li','',v)));section.append(list);}else section.append(element('p','',value));
  facts.append(section);
 }
 if(c.awards?.length){
  const recognition=element('section','case-recognition');recognition.append(element('h2','','Awards & recognition.'));
  recognition.append(element('p','case-recognition-intro',c.awardsIntro||'Recognition of the company and its people. Recipients are listed alongside each award.'));
  const list=element('div','case-awards');
  for(const award of c.awards){
   const card=element('article','case-award');
   card.append(element('span','case-award-meta',[award.year,award.status].filter(Boolean).join(' · ')),element('h3','',award.title),element('p','case-award-recipient',award.recipient||c.name),element('p','',award.detail));
   const source=element('a','case-award-source',award.basis||'Original source');source.href=award.source;source.target='_blank';source.rel='noopener noreferrer';source.setAttribute('aria-label',award.title+' — '+(award.basis||'Original source'));card.append(source);list.append(card);
  }
  recognition.append(list);facts.append(recognition);
 }
 byId('caseCollaboration').textContent=c.collaboration;
 byId('detailExternal').hidden=!c.url;if(c.url)byId('detailExternal').href=c.url;
 const next=allProjects[(allProjects.indexOf(c)+1)%allProjects.length];
 byId('caseNext').href='#experience/'+next.id;byId('caseNextName').textContent=next.name;
 byId('backBtn').lastElementChild.textContent=detailReturn==='all'?'BACK TO ALL WORK':'BACK TO SELECTED WORK';
 document.title=c.name+' — Daniil Terekh';
}
function applyRoute(){
 let hash;try{hash=decodeURIComponent(window.location.hash||'');}catch{history.replaceState(null,'',window.location.pathname+window.location.search);hash='';}
 const main=byId('mainPage'),detail=byId('detailPage'),all=byId('allPage');
 const prevMainHidden=main.hidden;
 window.DTCaseFilm?.show(hash==='#experience/barnes'?'barnes':null);
 main.hidden=false;detail.hidden=true;all.hidden=true;detail.classList.remove('is-open');all.classList.remove('is-open');
 if(hash==='#experience/all'){
  main.hidden=true;all.hidden=false;all.classList.add('is-open');renderAll();document.title='Work & Experience — Daniil Terekh';scrollInstant(archiveScroll);focusTitle(all);
 }else if(hash.startsWith('#experience/')){
  const id=hash.slice('#experience/'.length),c=allProjects.find(x=>x.id===id);
  if(!c){history.replaceState(null,'',window.location.pathname+window.location.search+'#experience/all');return applyRoute();}
  main.hidden=true;detail.hidden=false;detail.dataset.case=c.id;detail.classList.add('is-open');renderDetail(c);byId('detailVisual').hidden=c.id==='barnes';scrollInstant(0);focusTitle(detail);
 }else{
  document.title=originalTitle;
  if(prevMainHidden)requestAnimationFrame(()=>{measureStory();if(hash==='#work'){scrollInstant(lastRouteScroll||metrics?.start+metrics?.introDist||0);}else{const target=hash.startsWith('#')?document.getElementById(hash.slice(1)):null;if(target)target.scrollIntoView({behavior:'instant',block:'start'});else scrollInstant(lastRouteScroll);}paintStory();if(lastRouteFocus?.isConnected&&!lastRouteFocus.closest('[inert]'))lastRouteFocus.focus({preventScroll:true});});
 }
}
function renderAll(){
 const featured=byId('allList'),more=byId('moreList');featured.replaceChildren();more.replaceChildren();
 for(const c of allProjects){
  const link=element('a',c.featured?'archive-card':'experience-row');link.href='#experience/'+c.id;link.setAttribute('aria-label','View '+c.name+' — '+c.role);
  link.addEventListener('click',()=>{archiveScroll=window.scrollY;lastRouteFocus=document.activeElement;detailReturn='all';});
  if(c.featured){
   const visual=element('div','archive-card-visual'),img=element('img');img.src=c.image;img.alt=c.imageAlt||c.name+' — company homepage';img.loading='lazy';img.decoding='async';
   const icon=element('span','case-arrow');icon.innerHTML=arrow;visual.append(img,icon);
   const copy=element('div','archive-card-copy');copy.append(element('h3','',c.name),element('span','archive-card-sector',c.sector),element('p','',c.summary),element('span','archive-card-role',c.role+' · '+c.location));link.append(visual,copy);featured.append(link);
  }else{
   const title=element('div');title.append(element('h3','',c.name),element('span','experience-row-role',c.role+' · '+c.location));link.append(title,element('p','',c.summary));link.insertAdjacentHTML('beforeend',arrow);more.append(link);
  }
 }
 applyArchiveFilter();
}
function applyArchiveFilter(){
 byId('featuredGroup').hidden=archiveFilter==='experience';byId('moreGroup').hidden=archiveFilter==='cases';
 document.querySelectorAll('[data-archive-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.archiveFilter===archiveFilter)));
}
document.querySelectorAll('[data-archive-filter]').forEach(button=>button.addEventListener('click',()=>{archiveFilter=button.dataset.archiveFilter;applyArchiveFilter();}));
function updateMobileClass(){document.documentElement.classList.toggle('mobile-actual',window.innerWidth<=720)}

byId('storyPrev').addEventListener('click',()=>goToProject(active-1));
byId('storyNext').addEventListener('click',()=>goToProject(active+1));
byId('allBtn')?.addEventListener('click',()=>goDetail('all'));byId('heroRefCase').addEventListener('click',()=>goDetail(companies[active].id));
byId('backBtn').addEventListener('click',()=>{window.location.hash=detailReturn==='all'?'#experience/all':'#work'});
byId('backAllBtn').addEventListener('click',()=>{window.location.hash='#work'});
byId('siteWorkLink').addEventListener('click',e=>{e.preventDefault();if(byId('mainPage').hidden){location.hash='#work';}else goToProject(0)});
window.addEventListener('hashchange',applyRoute);
window.addEventListener('scroll',schedulePaint,{passive:true});
window.addEventListener('resize',()=>{measureStory();schedulePaint()},{passive:true});
const ros=new ResizeObserver(()=>{measureStory();schedulePaint()});ros.observe(site);
setActive(0);renderScreens();updateMobileClass();applyRoute();requestAnimationFrame(()=>{measureStory();paintStory()});
})();

