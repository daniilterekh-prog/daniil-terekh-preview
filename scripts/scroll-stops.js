(function(){
 'use strict';
 const QUIET=180,TOLERANCE=8;
 function nextTarget(points,y,direction){
  const point=direction>0?points.find(p=>p.y>y+TOLERANCE):[...points].reverse().find(p=>p.y<y-TOLERANCE);
  return point?point.y:null;
 }
 if(typeof module==='object'&&module.exports){module.exports={nextTarget};return;}
 const main=document.getElementById('mainPage');if(!main)return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let points=[],animation=0,animationDirection=0,animationTarget=null,wheelGesture=null,touch=null;
 let measuredWidth=0,measuredHeight=0;
 const absolute=e=>e.getBoundingClientRect().top+scrollY;
 function measure(){
  if(main.hidden)return;
  const all=[{id:"hero",y:0,semantic:true}];
  for(const section of main.children){
   if(!section.matches('section,footer'))continue;
   const add=point=>all.push({id:section.id,...point});
   if(section.id==='hero'){
    add({y:0,semantic:true});
    const copy=section.querySelector('.hero-introduction');
    if(copy){const end=absolute(copy)+copy.offsetHeight+24-window.DTViewport.height();if(end>TOLERANCE)add({y:end,semantic:true});}
    continue;
   }
   if(section.id==='work'){
    JSON.parse(section.dataset.scrollStops||'[]').forEach(y=>add({y,semantic:true}));continue;
   }
   // The compact footer settles at the document end without adding empty space.
   if(section.id==='site-footer'){add({y:absolute(section),semantic:true});continue;}
   const sticky=section.querySelector('.thinking-sticky,.edit-sticky,.evidence-shell');
   const start=absolute(section);
   add({y:start,semantic:true});
   if(sticky){
    const travel=Math.max(0,section.offsetHeight-sticky.offsetHeight);
    const stickyTop=parseFloat(getComputedStyle(sticky).top)||0;
    // If a short landscape screen cannot contain the content, read its top first.
    if(stickyTop<0)add({y:start});
    for(const fraction of (section.id==='thinking'?[0,.3,.6,1]:[0,.5,1]))add({y:start-stickyTop+travel*fraction,semantic:true});
   }else{
    const end=section.id==='contact'?document.documentElement.scrollHeight:start+section.offsetHeight;
    // Share overflow evenly: no almost-identical extra landing at the bottom.
    const distance=Math.max(0,end-start-window.DTViewport.height());
    if(distance>TOLERANCE){
     const steps=Math.ceil(distance/(window.DTViewport.height()*.85));
     for(let i=1;i<=steps;i++)add({y:start+distance*i/steps});
    }
   }
  }
  const max=Math.max(0,document.documentElement.scrollHeight-window.DTViewport.height());
  points=all.map(p=>({y:Math.round(Math.max(0,Math.min(max,p.y))),id:p.id,ids:[p.id],semantic:p.semantic})).sort((a,b)=>a.y-b.y)
   .reduce((list,p)=>{const last=list[list.length-1];if(!last||p.y-last.y>8)list.push(p);else {last.ids=[...new Set([...last.ids,...p.ids])];if(p.semantic&&!last.semantic)last.id=p.id;last.semantic=last.semantic||p.semantic;}return list;},[]);
 }
 function cancel(){
  if(animation)cancelAnimationFrame(animation);
  animation=0;animationDirection=0;animationTarget=null;main.removeAttribute('aria-busy');
 }
 function releaseGesture(){wheelGesture=null;touch=null;cancel();}
 function moveTo(target){
  if(target===null)return;
  cancel();
  target=Math.max(0,Math.min(document.documentElement.scrollHeight-window.DTViewport.height(),target));
  const from=scrollY,start=performance.now(),duration=Math.min(520,260+Math.abs(target-from)*.18);
  if(Math.abs(target-from)<1)return;
  animationDirection=Math.sign(target-from);
  if(reduced.matches){scrollTo({top:target,behavior:'instant'});animationDirection=0;return;}
  animationTarget=target;
  main.setAttribute('aria-busy','true');
  function frame(now){
   const t=Math.min(1,(now-start)/duration),ease=t*t*t*(t*(t*6-15)+10);
   scrollTo({top:from+(target-from)*ease,behavior:'instant'});
   if(t<1)animation=requestAnimationFrame(frame);
   else {animation=0;animationDirection=0;animationTarget=null;main.removeAttribute('aria-busy');}
  }
  animation=requestAnimationFrame(frame);
 }
 function advance(direction){
  measure();
  // A separate input continues from the requested scene, even during landing.
  const from=animation&&animationDirection===direction?animationTarget:scrollY;
  const target=nextTarget(points,from,direction);
  if(target!==null)moveTo(target);
  else if(animationDirection!==direction)cancel();
 }
 window.DTScenes={getStops:()=>{measure();return points.map(p=>({...p}));},goTo:target=>{releaseGesture();moveTo(target);}};
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
 window.addEventListener('wheel',event=>{
  const delta=event.deltaY;
  if(reduced.matches||event.ctrlKey||event.metaKey||Math.abs(delta)<=Math.abs(event.deltaX||0)||exempt(event.target,delta)||event.cancelable===false){releaseGesture();return;}
  event.preventDefault();
  const direction=Math.sign(delta),now=performance.now();
  const fresh=!wheelGesture||wheelGesture.direction!==direction||now-wheelGesture.at>QUIET;
  if(fresh)wheelGesture={direction,at:now,total:0,used:false};
  wheelGesture.at=now;
  if(wheelGesture.used)return;
  wheelGesture.total+=Math.abs(delta)*(event.deltaMode===1?16:event.deltaMode===2?window.DTViewport.height():1);
  if(wheelGesture.total<12)return;
  wheelGesture.used=true;touch=null;advance(direction);
 },{passive:false});
 window.addEventListener('touchstart',event=>{
  const resume=animationTarget,resumeDirection=animationDirection;
  releaseGesture();
  if(reduced.matches||event.touches.length!==1||main.hidden||document.querySelector('dialog[open]'))return;
  const finger=event.touches[0];
  touch={x:finger.clientX,y:finger.clientY,origin:scrollY,resume,resumeDirection,target:event.target,direction:0,anchor:null,captured:false};
 },{passive:true});
 window.addEventListener('touchmove',event=>{
  if(!touch)return;
  if(event.touches.length!==1){releaseGesture();return;}
  const finger=event.touches[0],dx=touch.x-finger.clientX,dy=touch.y-finger.clientY;
  if(!touch.captured&&Math.max(Math.abs(dx),Math.abs(dy))<12)return;
  if((!touch.captured&&Math.abs(dx)>=Math.abs(dy))||exempt(touch.target,dy)||event.cancelable===false){releaseGesture();return;}
  event.preventDefault();const direction=Math.sign(dy);
  if(!touch.captured||direction!==touch.direction){
   measure();const from=touch.resume!==null&&touch.resumeDirection===direction?touch.resume:touch.origin;
   touch.anchor=nextTarget(points,from,direction);
   if(touch.anchor===null&&touch.resumeDirection===direction)touch.anchor=touch.resume;
  }
  touch.captured=true;touch.direction=direction;
  const end=touch.anchor===null?touch.origin:touch.anchor;
  scrollTo({top:Math.max(Math.min(touch.origin,end),Math.min(Math.max(touch.origin,end),touch.origin+dy)),behavior:'instant'});
 },{passive:false});
 window.addEventListener('touchend',()=>{
  const gesture=touch;touch=null;
  if(gesture)moveTo(gesture.captured?gesture.anchor:gesture.resume);
 },{passive:true});
 window.addEventListener('touchcancel',()=>{const gesture=touch;releaseGesture();if(gesture&&gesture.captured)moveTo(gesture.origin);},{passive:true});
 window.addEventListener('keydown',event=>{
  const keys=['ArrowDown','ArrowUp','PageDown','PageUp',' ','Home','End'];
  if(reduced.matches||event.defaultPrevented||!keys.includes(event.key)||event.ctrlKey||event.metaKey||event.altKey||exempt(event.target,event.key==='ArrowUp'||event.key==='PageUp'?-1:1))return;
  if(event.key===' '&&event.target instanceof Element&&event.target.closest('button,a,[role="tab"]'))return;
  event.preventDefault();if(event.repeat&&animation)return;
  wheelGesture=null;touch=null;
  const direction=['ArrowUp','PageUp'].includes(event.key)||event.key===' '&&event.shiftKey?-1:1;
  if(event.key==='Home'||event.key==='End')moveTo(event.key==='Home'?0:document.documentElement.scrollHeight-window.DTViewport.height());
  else advance(direction);
 });
 // Direct links, scrollbar dragging and nested controls keep their own navigation.
 window.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse')releaseGesture();},{passive:true});
 window.addEventListener('hashchange',()=>{releaseGesture();measure();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseGesture();});
 reduced.addEventListener('change',releaseGesture);
 new MutationObserver(()=>{if(main.hidden)releaseGesture();}).observe(main,{attributes:true,attributeFilter:['hidden']});
 function resize(){
  const height=window.DTViewport.height();
  if(measuredWidth===innerWidth&&measuredHeight===height)return;
  measuredWidth=innerWidth;measuredHeight=height;
  releaseGesture();document.documentElement.style.setProperty('--scene-height',height+'px');
  document.documentElement.style.setProperty('--footer-height',document.getElementById('site-footer').offsetHeight+'px');measure();
 }
 window.addEventListener('resize',resize,{passive:true});
 window.addEventListener('load',resize,{once:true});
 new ResizeObserver(()=>{document.documentElement.style.setProperty('--footer-height',document.getElementById('site-footer').offsetHeight+'px');measure();}).observe(main);
 if(document.fonts)document.fonts.ready.then(()=>{measure();});
 resize();
})();
