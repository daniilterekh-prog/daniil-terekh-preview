(function(){
 'use strict';
 const section=document.getElementById('thinking'),visual=document.getElementById('signal-visual');
 if(!section||!visual)return;
 const main=document.getElementById('mainPage');
 const media=window.matchMedia('(prefers-reduced-motion: reduce)');
 visual.dataset.renderer='canvas';
 const sticky=section.querySelector('.thinking-sticky'),noise=section.querySelector('.signal-noise'),clarity=section.querySelector('.signal-clarity');
 const model=window.DTLensOrbit,phrases=Array.from(noise.children),original=phrases.map(el=>el.textContent);
 const phraseGlyphs=new WeakMap();
 const morph=document.createElement('canvas');morph.className='signal-morph';morph.setAttribute('aria-hidden','true');visual.append(morph);
 const context=morph.getContext('2d');
 const sources=[original[3],original[1],original[18]],goals=['ATTRACT QUALIFIED CLIENTS.','FIX THE JOURNEY FIRST.','TEST. MEASURE. SCALE.'];
 let visible=false,scrollDirty=true,sceneFrame=0,lastTime=0,clock=0,progress=0,state=model.flightState(0),width=0,height=0,targets=[],fragments=[],sourceRows=[];
 function resizeMorph(){glyphMetrics.clear();const r=visual.getBoundingClientRect();width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio||1,2,Math.max(1,Math.sqrt(8000000/(width*height))));morph.width=Math.round(width*dpr);morph.height=Math.round(height*dpr);if(context){context.setTransform(dpr,0,0,dpr,0,0);layoutClarity();}paint();}
 const glyphMetrics=new Map();
 function textMetrics(text,font){
  const key=font+"\n"+text;
  if(!glyphMetrics.has(key)){
   context.font=font;
   glyphMetrics.set(key,{width:context.measureText(text).width,offsets:Array.from(text,(_,i)=>context.measureText(text.slice(0,i)).width),advances:Array.from(text,char=>context.measureText(char).width)});
  }
  return glyphMetrics.get(key);
 }
 function textPositions(text,font,y,center=width*.5,spacing=0){
  const metrics=textMetrics(text,font),start=center-(metrics.width+text.length*spacing)/2;
  return Array.from(text).map((char,i)=>({char,x:start+metrics.offsets[i]+i*spacing+metrics.advances[i]/2,y,half:metrics.advances[i]/2}));
 }
 function layoutClarity(){
  if(!width||!height)return;
  const lens=model.glassGeometry(width,height,1),cap=Math.min(width<=600?32:68,width*.085);
  const rows=goals.map((text,index)=>{
   const size=cap*(index===0?1:.72);context.font='700 '+size+'px ThinkingNarrow';const m=context.measureText(text);
   return {size,y:height*(.4+index*.17),width:m.width,ascent:m.fontBoundingBoxAscent||size*1.18,descent:m.fontBoundingBoxDescent||size*.32};
  });
  // Fit the complete font box to the final glass, leaving a small optical margin.
  const fits=scale=>rows.every(r=>{
   const top=r.y-(r.size+r.ascent+r.descent)*scale/2,bottom=top+(r.ascent+r.descent)*scale;
   const vertical=Math.max(Math.abs(top-lens.cy),Math.abs(bottom-lens.cy));
   return r.width*scale<=width*.88&&(r.width*scale/(2*lens.rx))**2+(vertical/lens.ry)**2<=.9;
  });
  let scale=1;
  if(!fits(1)){let low=0,high=1;for(let i=0;i<12;i++){const mid=(low+high)/2;if(fits(mid))low=mid;else high=mid;}scale=low;}
  targets=rows.map(r=>({size:r.size*scale,baseline:r.y+(r.ascent-r.descent-r.size)*scale/2,center:lens.cx}));
  clarity.style.setProperty('--clarity-main-size',targets[0].size+'px');
  clarity.style.setProperty('--clarity-small-size',targets[1].size+'px');
  layoutFragments();
 }
 function layoutFragments(){
  const sourceSize=Math.min(width<600?23:36,width*.06);
  fragments=[];sourceRows=[];
  for(let group=0;group<3;group++){
   const fitted=sourceSize*Math.min(1,width*.88/textMetrics(sources[group],sourceSize+'px Georgia').width);
   const font=fitted+'px Georgia',targetFont='700 '+targets[group].size+'px ThinkingNarrow';
   const y=height*(.34+group*.17);
   // Match the final DOM text's -.01em tracking before handing it back to HTML.
   const src=textPositions(sources[group],font,y),dst=textPositions(goals[group],targetFont,targets[group].baseline,targets[group].center,-targets[group].size*.01);
   const count=Math.max(src.length,dst.length);
   sourceRows.push({font,y});
   for(let index=0;index<count;index++){
    const empty={char:'',x:width*.5,y:height*.53,half:0};
    fragments.push({a:src[index]||empty,b:dst[index]||empty,font,targetFont,path:model.fragmentPath(index,count,group)});
   }
  }
  // Far letters paint first. No sorting, font fitting or text measurement per frame.
  fragments.sort((a,b)=>a.path.depth-b.path.depth);
 }
 function ellipse(ctx,x,y,rx,ry){ctx.beginPath();ctx.ellipse(x,y,Math.max(1,rx),Math.max(1,ry),0,0,Math.PI*2);}
 function drawGlass(){
  const ctx=context,{cx,cy,rx,ry,depth,zoom,retreat}=model.glassGeometry(width,height,progress);
  const passage=model.smooth(.4,.58,progress)*(1-model.smooth(.8,.95,progress));
  // Once the camera is inside the glass, its rim and bevels are offscreen.
  // Avoid rasterizing an enormous clipped ellipse and shadow outside the canvas.
  const margin=depth+24;
  const fillsView=[-margin,width+margin].every(x=>[-margin,height+margin].every(y=>((x-cx)/rx)**2+((y-cy)/ry)**2<1));
  ctx.save();ctx.globalAlpha=(1-retreat*.87)*(1-passage*.62);ctx.lineJoin='round';ctx.lineCap='round';
  // A broad caustic and a cut glass edge retain volume at every camera angle.
  const aura=ctx.createRadialGradient(cx,cy,0,cx,cy,ry*1.3);
  aura.addColorStop(0,'#c8d0ce10');aura.addColorStop(.6,'#c8d0ce05');aura.addColorStop(1,'#c8d0ce00');
  ctx.fillStyle=aura;ctx.fillRect(0,0,width,height);
  const edge=ctx.createLinearGradient(cx-rx-depth,cy-ry,cx+rx+depth,cy+ry);
  [[0,'#e8eeed'],[.12,'#525c5c'],[.33,'#151d1e'],[.5,'#9da8a8'],[.67,'#202728'],[.9,'#dae0df'],[1,'#4b5655']].forEach(([n,c])=>edge.addColorStop(n,c));
  if(!fillsView){ellipse(ctx,cx+depth,cy,rx,ry);ctx.strokeStyle=edge;ctx.lineWidth=Math.max(2,depth*.38);ctx.stroke();}
  const glass=ctx.createLinearGradient(cx-rx,cy,cx+rx,cy);
  [[0,'#dce7e23d'],[.08,'#a8b9b126'],[.28,'#151d1b75'],[.64,'#dce6e60c'],[.88,'#dce6e630'],[1,'#f3f7f45c']].forEach(([n,c])=>glass.addColorStop(n,c));
  ctx.fillStyle=glass;
  if(fillsView)ctx.fillRect(0,0,width,height);
  else{
   ellipse(ctx,cx,cy,rx,ry);ctx.fill();ctx.strokeStyle=edge;ctx.lineWidth=1.7;ctx.stroke();
   // Two soft bevels keep the edge clean when the camera approaches the glass.
   for(let i=1;i<=2;i++){const inset=i*1.4*Math.sqrt(zoom);ellipse(ctx,cx+depth*.12,cy,rx-inset,ry-inset);ctx.strokeStyle='rgba(219,231,226,'+(.12-i*.035)+')';ctx.lineWidth=.8;ctx.stroke();}
  }
  ctx.save();if(!fillsView){ellipse(ctx,cx,cy,rx-2,ry-2);ctx.clip();}
  const reflection=ctx.createLinearGradient(cx-rx,cy-ry,cx+rx,cy+ry);
  reflection.addColorStop(0,'#ffffff00');reflection.addColorStop(.18,'#ffffff03');reflection.addColorStop(.42,'#edf6f32b');reflection.addColorStop(.7,'#ffffff03');reflection.addColorStop(1,'#ffffff00');
  ctx.fillStyle=reflection;ctx.fillRect(Math.max(0,cx-rx),Math.max(0,cy-ry),Math.min(width,rx*2),Math.min(height,ry*2));
  ctx.restore();
  if(!fillsView){ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,Math.PI*.96,Math.PI*1.53);ctx.strokeStyle='#eef5f0bd';ctx.lineWidth=1.6;ctx.shadowColor='#e4efe8';ctx.shadowBlur=9;ctx.stroke();}
  ctx.restore();
 }
 function drawOverview(){
  if(state.noise<.001)return;
  const ctx=context,alpha=state.noise,small=width<600;
  ctx.save();
  // Requests fracture on the entrance face; only three coherent streams emerge.
  for(let i=0;i<85;i++){
   const t=((clock*.095+i*.618)%1),lane=i%3;
   const x=width*(.39+t*.26),base=height*(.40+lane*.15);
   const spread=Math.sin(t*Math.PI)*(small?29:55);
   const y=base+Math.sin(i*7.3+t*5)*spread;
   ctx.globalAlpha=alpha*Math.sin(t*Math.PI)*(.25+(i%4)*.12);
   ctx.fillStyle='#e1e8e5';ctx.fillRect(x,y,i%5===0?2:1.1,i%5===0?2:1.1);
  }
  const labels=small?[['QUALIFIED','CLIENTS.'],['A CLEAR','PRIORITY.'],['A PLAN','THAT WORKS.']]:[['ATTRACT QUALIFIED','CLIENTS.'],['FIX THE','JOURNEY FIRST.'],['TEST. MEASURE.','SCALE.']];
  const size=small?15:Math.min(30,width*.025);
  labels.forEach((lines,g)=>{
   const y=height*(.4+g*.15),x=width*.69;
   const arrival=media.matches?1:model.smooth(0,.24,(clock/14+g/3+.25)%1);
   ctx.font='700 '+size+'px ThinkingNarrow';ctx.fillStyle='#f0f1ed';
   lines.forEach((line,j)=>{Array.from(line).forEach((char,k)=>{
    ctx.globalAlpha=alpha*model.smooth(k/line.length*.7,k/line.length*.7+.3,arrival);
    ctx.fillText(char,x+textMetrics(line,ctx.font).offsets[k],y+(j-.3)*size*1.12);
   });});
   ctx.globalAlpha=alpha*.65;
   // Light travels out of the glass, decelerating before the new words.
   ctx.beginPath();ctx.moveTo(width*.57,y);ctx.lineTo(width*.66,y);
   const ray=ctx.createLinearGradient(width*.57,y,width*.67,y);ray.addColorStop(0,'#cbd7d200');ray.addColorStop(.5,'#dce8e58c');ray.addColorStop(1,'#cbd7d200');ctx.strokeStyle=ray;ctx.lineWidth=.7;ctx.stroke();
  });
  ctx.restore();
 }
 function drawMorph(){
  if(!context)return;
  const ctx=context;ctx.clearRect(0,0,width,height);drawGlass();drawOverview();
  ctx.globalAlpha=1;
  const presence=model.smooth(.18,.3,progress)*(1-state.result);
  if(presence<.001)return;
  if(media.matches){
   // A readable cut between complete phrases replaces the burst in reduced motion.
   ctx.save();ctx.globalAlpha=presence;ctx.textAlign='center';ctx.fillStyle='#edf0eb';
   for(let group=0;group<3;group++){
    const goal=progress>=.5;
    ctx.font=goal?'700 '+targets[group].size+'px ThinkingNarrow':sourceRows[group].font;
    ctx.fillText(goal?goals[group]:sources[group],goal?targets[group].center:width*.5,goal?targets[group].baseline:sourceRows[group].y);
   }
   ctx.restore();return;
  }
  for(const fragment of fragments){
   const {a,b,font,targetFont,path}=fragment,motion=model.fragmentState(progress,path);
   const point=fragmentPoint(fragment,motion),ink=presence*motion.opacity;
   const sourceInk=1-model.smooth(0,.48,motion.change),targetInk=model.smooth(.52,1,motion.change);
   // A single faint shutter echo on the closest letters, only during the impulse.
   // It is progress-based (not frame history), so reverse scroll stays identical.
   if(motion.trail>.08&&sourceInk>.01&&a.char.trim()){
    const previous=model.fragmentState(progress-.006,path),echo=fragmentPoint(fragment,previous);
    drawFragment(a,font,echo,previous,ink*sourceInk*motion.trail*.2);
   }
   if(sourceInk>.001&&a.char.trim())drawFragment(a,font,point,motion,ink*sourceInk);
   if(targetInk>.001&&b.char.trim())drawFragment(b,targetFont,point,motion,ink*targetInk);
  }
 }
 function fragmentPoint({a,b},motion){
  const originX=a.x+(width*.5-a.x)*motion.compression;
  const originY=a.y+(height*.53-a.y)*motion.compression;
  let x=originX+(width*(.5+motion.x*.4)-originX)*motion.release;
  let y=originY+(height*(.53+motion.y*.27)-originY)*motion.release;
  x+=(b.x-x)*motion.gather;y+=(b.y-y)*motion.gather;
  return {x,y};
 }
 function drawFragment(glyph,font,point,motion,alpha){
  context.save();context.translate(point.x,point.y);context.rotate(motion.rotation);context.scale(motion.scale,motion.scale);
  context.globalAlpha=alpha;context.fillStyle='#edf0eb';context.font=font;
  context.fillText(glyph.char,-glyph.half,0);context.restore();
 }
 function setPhrase(phrase,copy){
  const fragment=document.createDocumentFragment(),glyphs=[];
  const length=Array.from(copy).length;let index=0;
  for(const token of copy.split(/(\s+)/)){
   if(!token)continue;
   if(/^\s+$/.test(token)){fragment.append(document.createTextNode(token));index+=Array.from(token).length;continue;}
   const word=document.createElement('span');word.className='signal-word';
   for(const char of Array.from(token)){
    const letter=document.createElement('span');letter.className='signal-glyph';letter.textContent=char;
    word.append(letter);glyphs.push({element:letter,position:index/Math.max(1,length-1)});index++;
   }
   fragment.append(word);
  }
  phrase.replaceChildren(fragment);phraseGlyphs.set(phrase,glyphs);
 }
 function paint(){
  section.dataset.orbit=state.phase;section.dataset.stage=progress<.3?'0':progress<.8?'1':'2';
  visual.style.setProperty('--flight-zoom',state.zoom);
  visual.style.setProperty('--flight-pan',(-12+progress*24)+'%');
  visual.style.setProperty('--flight-angle',(-28+progress*56)+'deg');
  visual.style.setProperty('--thread-strength',String(state.scatter*.25));
  visual.style.setProperty('--orbit-y',(140-progress*100)+'deg');
  visual.style.setProperty('--orbit-zoom',state.zoom);
  noise.style.opacity=state.noise;noise.style.transform='perspective(1100px)';
  if(state.noise>.001)phrases.forEach((phrase,i)=>{
   const flow=model.flowState(media.matches?2:clock,i),lane=i%10;
   const travel=media.matches?.2:flow.travel;
   const entrance=flow.t<.5?model.smooth(0,.07,flow.t):0;
   const opacity=(media.matches?(i<10?.8:0):entrance)*(.65+(i%3)*.16);
   phrase.style.opacity=String(opacity);
   if(opacity<.001)return;
   // Fixed layout coordinates; animate translation without reflowing each phrase.
   phrase.style.left='5%';phrase.style.top=(25+lane*5.8)+'%';
   phrase.style.filter='none';
   phrase.style.transform='translate3d('+(travel*width*.3)+'px,'+(Math.sin(i*2.4+clock*.16)*height*.005)+'px,0) translateX(-'+(travel*40)+'%) scale('+(1-travel*.18)+')';
   const copy=original[(i+flow.cycle+original.length*10)%original.length];
   if(phrase.textContent!==copy||!phraseGlyphs.has(phrase))setPhrase(phrase,copy);
   const glyphs=phraseGlyphs.get(phrase);
   // Only the short dissolution interval needs per-letter updates.
   if(!media.matches&&flow.t>=.34&&flow.t<.5){
    for(const glyph of glyphs){
     const ink=model.phraseGlyphState(flow.t,glyph.position);
     glyph.element.style.opacity=String(ink.opacity);
     glyph.element.style.filter=ink.dust>.01?'blur('+(ink.dust*1.8)+'px)':'none';
     glyph.element.style.transform=ink.dust>.01?'translateX('+(ink.dust*3)+'px)':'none';
    }
   }else if(media.matches||flow.t<.34){
    for(const glyph of glyphs){
     if(glyph.element.style.opacity){glyph.element.style.opacity='';glyph.element.style.filter='';glyph.element.style.transform='';}
    }
   }
  });
  clarity.style.opacity=state.result;
  drawMorph();
 }
 function animate(now){
  sceneFrame=0;
  if(!visible||document.hidden||main.hidden)return;
  if(scrollDirty){scrollDirty=false;scrollState();}
  if(!media.matches){clock+=Math.min(.05,(now-(lastTime||now))/1000);lastTime=now;}
  paint();
  // Only the entrance has live motion; the later frames update on actual scroll.
  if(!media.matches&&state.noise>.001)sceneFrame=requestAnimationFrame(animate);
 }
 function syncMotion(){
  if(sceneFrame)cancelAnimationFrame(sceneFrame);sceneFrame=0;lastTime=0;
  requestScrollState();
 }
 function scrollState(){
  const travel=Math.max(1,section.offsetHeight-sticky.offsetHeight);
  progress=Math.max(0,Math.min(1,-section.getBoundingClientRect().top/travel));
  if(media.matches)progress=[0,.3,.6,1][Math.min(3,Math.floor(progress*4))];
  state=model.flightState(progress);
 }
 function requestScrollState(){
  scrollDirty=true;
  if(visible&&!document.hidden&&!main.hidden&&!sceneFrame)sceneFrame=requestAnimationFrame(animate);
 }
 function measureThinking(){
  if(main.hidden)return;
  section.style.minHeight=(sticky.offsetHeight+Math.round(window.DTViewport.height()*2.2))+'px';sticky.style.top='0px';resizeMorph();requestScrollState();
 }
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;syncMotion();}).observe(section);
 new ResizeObserver(measureThinking).observe(sticky);
 window.addEventListener('scroll',requestScrollState,{passive:true});window.addEventListener('resize',measureThinking,{passive:true});
 window.addEventListener('hashchange',requestScrollState);document.addEventListener('visibilitychange',syncMotion);media.addEventListener('change',syncMotion);
 new MutationObserver(()=>{measureThinking();syncMotion();}).observe(main,{attributes:true,attributeFilter:['hidden']});
 if(document.fonts)document.fonts.ready.then(()=>{glyphMetrics.clear();resizeMorph();});measureThinking();
 const edit=document.getElementById('the-edit');
 const edits=[
  {copy:'Remove the distraction. Keep the purpose.\nEvery element should earn its place.',title:['Less noise.','More meaning.']},
  {copy:'One purpose. A clear next step.\nGive the essential room to matter.',title:['Ideas for','what matters.']},
  {copy:'Refine what remains.\nMake every detail support the direction.',title:['Clarity,','with intent.']}
 ];
 const editControls=Array.from(edit.querySelectorAll('[data-edit-stage]'));
 const editSticky=edit.querySelector('.edit-sticky');
 let editSelected=-1,editQueued=0,pendingEdit=null;
 function setEdit(index){
  if(index===editSelected)return;
  editSelected=index;edit.dataset.edit=String(index);
  const copy=document.getElementById('edit-explanation');
  const lines=edits[index].copy.split('\n');copy.replaceChildren(document.createTextNode(lines[0]),document.createElement('br'),document.createTextNode(lines[1]));
  const title=document.getElementById('edit-resolution');title.replaceChildren(document.createTextNode(edits[index].title[0]),document.createElement('br'),document.createTextNode(edits[index].title[1]));
  editControls.forEach((button,i)=>{button.classList.toggle('is-selected',i===index);button.setAttribute('aria-pressed',String(i===index));});
 }
 editControls.forEach((button,index)=>{
  button.addEventListener('click',()=>goEditStage(index));
  button.addEventListener('keydown',e=>{
   if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;
   e.preventDefault();const next=(index+(e.key==='ArrowRight'?1:2))%3;editControls[next].focus({preventScroll:true});goEditStage(next);
  });
 });
 function editProgress(){
  const top=parseFloat(getComputedStyle(editSticky).top)||0;
  const travel=Math.max(1,edit.offsetHeight-editSticky.offsetHeight);
  return {top,travel,progress:Math.max(0,Math.min(1,(top-edit.getBoundingClientRect().top)/travel))};
 }
 function paintEditScroll(){
  editQueued=0;if(main.hidden)return;
  if(pendingEdit){
   if(Math.abs(scrollY-pendingEdit.target)>2)return;
   pendingEdit=null;
  }
  const {progress}=editProgress();
  setEdit(Math.min(2,Math.floor(progress*3)));
 }
 function queueEditScroll(){if(!editQueued)editQueued=requestAnimationFrame(paintEditScroll);}
 function measureEditScroll(){
  if(main.hidden)return;
  const height=editSticky.offsetHeight;
  edit.style.minHeight=(height+Math.max(420,Math.round(window.DTViewport.height()*.85)))+'px';
  editSticky.style.top=Math.min(0,window.DTViewport.height()-height)+'px';
  if(pendingEdit){
   const {top,travel}=editProgress();
   const target=scrollY+edit.getBoundingClientRect().top-top+travel*pendingEdit.index/2;
   if(Math.abs(target-pendingEdit.target)>2){pendingEdit.target=target;if(window.DTScenes)window.DTScenes.goTo(target);}
  }
  queueEditScroll();
 }
 function goEditStage(index){
  setEdit(index);
  const {top,travel}=editProgress();
  const target=window.scrollY+edit.getBoundingClientRect().top-top+travel*index/2;
  pendingEdit={index,target};
  if(window.DTScenes)window.DTScenes.goTo(target);else window.scrollTo({top:target,behavior:'instant'});
 }
 function resumeEditScroll(){pendingEdit=null;queueEditScroll();}
 window.addEventListener('wheel',event=>{if(!event.ctrlKey&&!event.metaKey)resumeEditScroll();},{passive:true});
 window.addEventListener('touchstart',resumeEditScroll,{passive:true});
 window.addEventListener('keydown',event=>{if(!event.defaultPrevented&&['ArrowDown','ArrowUp','PageDown','PageUp',' ','Home','End'].includes(event.key))resumeEditScroll();});
 window.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse'&&event.clientX>=document.documentElement.clientWidth)resumeEditScroll();},{passive:true});
 window.addEventListener('scroll',queueEditScroll,{passive:true});
 window.addEventListener('resize',measureEditScroll,{passive:true});
 window.addEventListener('hashchange',()=>{pendingEdit=null;measureEditScroll();});
 new ResizeObserver(measureEditScroll).observe(editSticky);
 new MutationObserver(()=>{pendingEdit=null;measureEditScroll();}).observe(main,{attributes:true,attributeFilter:['hidden']});
 setEdit(0);measureEditScroll();
 if(document.fonts)document.fonts.ready.then(measureEditScroll);
 document.getElementById('thinking-jump')?.addEventListener('click',()=>{
  const rootHidden=main.hidden;if(rootHidden)window.location.hash='#home';
  requestAnimationFrame(()=>window.DTScenes.goTo(scrollY+section.getBoundingClientRect().top));
 });
 syncMotion();requestScrollState();
})();

