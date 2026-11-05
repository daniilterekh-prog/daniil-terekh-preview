(function(){
 'use strict';
 const DURATION=480;
 function settleTarget(points,y,height,origin=null){
  // A newly entered scene may settle after a small overshoot. A departure never snaps back.
  const direction=origin===null?0:Math.sign(y-origin);
  if(origin!==null){
   const crossed=points.filter(p=>p.entry&&(origin<p.y-8&&y>=p.y||origin>p.y+8&&y<=p.y));
   if(crossed.length)return (direction>0?crossed[0]:crossed[crossed.length-1]).y;
  }
  const radius=p=>p.radius||Math.min(180,height*.22);
  const eligible=origin===null?points:points.filter(p=>Math.abs(p.y-origin)>8&&(direction*(p.y-y)>=0||p.semantic&&Math.abs(p.y-origin)>radius(p)&&Math.abs(p.y-y)<=radius(p)));
  const nearest=eligible.reduce((best,p)=>!best||Math.abs(p.y-y)<Math.abs(best.y-y)?p:best,null);
  const distance=nearest?Math.abs(nearest.y-y):Infinity;
  return nearest&&distance>3&&distance<=(nearest.radius||Math.min(180,height*.22))?nearest.y:null;
 }
 if(typeof module==='object'&&module.exports){module.exports={settleTarget};return;}
 const main=document.getElementById('mainPage');if(!main)return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let points=[],animation=0,settleTimer=0,touching=false,gestureOrigin=null;
 let measuredWidth=0,measuredHeight=0;
 const absolute=e=>e.getBoundingClientRect().top+scrollY;
 function measure(){
  if(main.hidden)return;
  const all=[];
  for(const section of main.children){
   if(!section.matches('section,footer'))continue;
   const add=point=>all.push({id:section.id,...point});
   if(section.id==='hero'){add({y:0,semantic:true});continue;}
   if(section.id==='work'){
    JSON.parse(section.dataset.scrollStops||'[]').forEach(y=>add({y,semantic:true}));continue;
   }
   // The compact footer settles at the document end without adding empty space.
   if(section.id==='site-footer'){add({y:absolute(section),semantic:true});continue;}
   const sticky=section.querySelector('.thinking-sticky,.edit-sticky,.evidence-shell');
   const start=absolute(section);
   add({y:start,semantic:true,entry:['services','cycle','human'].includes(section.id),radius:Math.min(280,window.DTViewport.height()*.32)});
   if(section.id==='skills'&&!section.querySelector('.skills-list:not([hidden])')){
    const panel=section.querySelector('.skills-showcase');
    const travel=Math.max(0,section.offsetHeight-panel.offsetHeight);
    const top=parseFloat(getComputedStyle(panel).top)||0;
    if(top<0)add({y:start});
    add({y:start-top,semantic:true});add({y:start-top+travel,semantic:true});
   }else if(section.id==='services'){
    // A wider magnetic landing for the services scene; long lists retain native scroll.
    // The section entrance is already registered above.
    const end=start+section.offsetHeight;
    if(end-start>window.DTViewport.height()+8)add({y:end-window.DTViewport.height()});
   }else if(sticky){
    const travel=Math.max(0,section.offsetHeight-sticky.offsetHeight);
    const stickyTop=parseFloat(getComputedStyle(sticky).top)||0;
    // If a short landscape screen cannot contain the content, read its top first.
    if(stickyTop<0)add({y:start});
    for(const fraction of (section.id==='thinking'?[0,.3,.6,1]:[0,.5,1]))add({y:start-stickyTop+travel*fraction,semantic:true});
   }else{
    add({y:start});
    const end=section.id==='contact'?document.documentElement.scrollHeight:start+section.offsetHeight;
    // Expanded lists and small landscape screens remain fully reachable.
    for(let y=start+window.DTViewport.height()*.85;y<end-window.DTViewport.height()-8;y+=window.DTViewport.height()*.85)add({y});
    if(end-start>window.DTViewport.height()+8)add({y:end-window.DTViewport.height()});
   }
  }
  const max=Math.max(0,document.documentElement.scrollHeight-window.DTViewport.height());
  points=all.map(p=>({y:Math.round(Math.max(0,Math.min(max,p.y))),radius:p.radius,id:p.id,ids:[p.id],semantic:p.semantic,entry:p.entry})).sort((a,b)=>a.y-b.y)
   .reduce((list,p)=>{const last=list[list.length-1];if(!last||p.y-last.y>8)list.push(p);else {last.entry=last.entry||p.entry;last.ids=[...new Set([...last.ids,...p.ids])];if(p.semantic&&!last.semantic)last.id=p.id;last.semantic=last.semantic||p.semantic;last.radius=Math.max(last.radius||0,p.radius||0)||undefined;}return list;},[]);
 }
 function cancel(){clearTimeout(settleTimer);if(animation)cancelAnimationFrame(animation);animation=0;main.removeAttribute('aria-busy');}
 function moveTo(target){
  if(target===null)return;
  if(animation)cancelAnimationFrame(animation);
  const from=scrollY,start=performance.now();
  main.setAttribute('aria-busy','true');
  clearTimeout(settleTimer);
  if(reduced.matches){gestureOrigin=null;scrollTo({top:target,behavior:'instant'});animation=0;main.removeAttribute('aria-busy');return;}
  function frame(now){
   const t=Math.min(1,(now-start)/DURATION),ease=t*t*t*(t*(t*6-15)+10);
   scrollTo({top:from+(target-from)*ease,behavior:'instant'});
   animation=t<1?requestAnimationFrame(frame):0;
   if(t===1){gestureOrigin=null;main.removeAttribute('aria-busy');}
  }
  animation=requestAnimationFrame(frame);
 }
 window.DTScenes={getStops:()=>{measure();return points.map(p=>({...p}));},goTo:target=>{releaseGesture();moveTo(Math.max(0,Math.min(document.documentElement.scrollHeight-window.DTViewport.height(),target)));}};
 function nestedScroll(target,delta){
  for(let el=target instanceof Element?target:null;el&&el!==main&&el!==document.body;el=el.parentElement){
   const css=getComputedStyle(el);
   if(/auto|scroll/.test(css.overflowY)&&el.scrollHeight>el.clientHeight+2&&
    (delta>0?el.scrollTop+el.clientHeight<el.scrollHeight-1:el.scrollTop>0))return true;
  }
  return false;
 }
 function exempt(target,delta){return main.hidden||document.querySelector('dialog[open]')||
  target instanceof Element&&(target.closest('input,textarea,select,[contenteditable="true"]')||nestedScroll(target,delta));}
 function scheduleSettle(){
  clearTimeout(settleTimer);
  if(animation||touching||gestureOrigin===null||main.hidden||document.querySelector('dialog[open]'))return;
  settleTimer=setTimeout(()=>{
   if(touching||animation||gestureOrigin===null)return;
   if(main.hidden||document.querySelector('dialog[open]')){releaseGesture();return;}
   measure();const target=settleTarget(points,scrollY,window.DTViewport.height(),gestureOrigin);
   gestureOrigin=null;moveTo(target);
  },220);
 }
 function releaseGesture(){gestureOrigin=null;cancel();}
 // Native scrolling always owns the gesture and momentum. Only settle after idle.
 window.addEventListener('scroll',()=>{if(!animation)scheduleSettle();},{passive:true});
 window.addEventListener('wheel',event=>{
  if(event.ctrlKey||event.metaKey||exempt(event.target,event.deltaY)){releaseGesture();return;}
  cancel();if(gestureOrigin===null)gestureOrigin=scrollY;scheduleSettle();
 },{passive:true});
 window.addEventListener('touchstart',event=>{
  releaseGesture();touching=true;
  if(event.touches.length===1&&!exempt(event.target,0))gestureOrigin=scrollY;
 },{passive:true});
 window.addEventListener('touchend',()=>{touching=false;scheduleSettle();},{passive:true});
 window.addEventListener('touchcancel',()=>{touching=false;scheduleSettle();},{passive:true});
 window.addEventListener('keydown',event=>{
  if(!event.defaultPrevented&&['ArrowDown','ArrowUp','PageDown','PageUp',' ','Home','End'].includes(event.key)){releaseGesture();}
 });
 // Explicit navigation and scrollbar dragging remain available.
 window.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse')releaseGesture();},{passive:true});
 window.addEventListener('hashchange',()=>{releaseGesture();measure();});
 function resize(){
  const height=window.DTViewport.height();
  if(measuredWidth===innerWidth&&measuredHeight===height)return;
  measuredWidth=innerWidth;measuredHeight=height;
  releaseGesture();document.documentElement.style.setProperty('--scene-height',window.DTViewport.height()+'px');
  const footer=document.getElementById('site-footer');
  document.documentElement.style.setProperty('--footer-height',footer.offsetHeight+'px');measure();
 }
 window.addEventListener('resize',resize,{passive:true});
 window.addEventListener('load',resize,{once:true});
 new ResizeObserver(()=>{document.documentElement.style.setProperty('--footer-height',document.getElementById('site-footer').offsetHeight+'px');measure();}).observe(main);
 if(document.fonts)document.fonts.ready.then(resize);
 resize();
})();
