(function(){
 'use strict';
 const section=document.getElementById('thinking'),visual=document.getElementById('signal-visual');
 if(!section||!visual)return;
 const viewport=document.getElementById('site'),main=document.getElementById('mainPage');
 const media=window.matchMedia('(prefers-reduced-motion: reduce)');
 visual.dataset.renderer='canvas';
 const sticky=section.querySelector('.thinking-sticky'),noise=section.querySelector('.signal-noise'),clarity=section.querySelector('.signal-clarity');
 const model=window.DTLensOrbit,phrases=Array.from(noise.children),original=phrases.map(el=>el.textContent);
 const phraseGlyphs=new WeakMap();
 const morph=document.createElement('canvas');morph.className='signal-morph';morph.setAttribute('aria-hidden','true');visual.append(morph);
 const context=morph.getContext('2d');
 const sources=[original[3],original[1],original[18]],goals=['ATTRACT QUALIFIED CLIENTS.','FIX THE JOURNEY FIRST.','TEST. MEASURE. SCALE.'];
 let visible=false,scrollDirty=true,sceneFrame=0,lastTime=0,clock=0,progress=0,state=model.flightState(0),width=0,height=0;
 function motionReduced(){return media.matches;}
 function resizeMorph(){glyphMetrics.clear();const r=visual.getBoundingClientRect();width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio||1,1.5);morph.width=Math.round(width*dpr);morph.height=Math.round(height*dpr);if(context)context.setTransform(dpr,0,0,dpr,0,0);paint();}
 const glyphMetrics=new Map();
 function textMetrics(text,font){
  const key=font+"\n"+text;
  if(!glyphMetrics.has(key)){
   context.font=font;
   glyphMetrics.set(key,{width:context.measureText(text).width,offsets:Array.from(text,(_,i)=>context.measureText(text.slice(0,i)).width)});
  }
  return glyphMetrics.get(key);
 }
 function textPositions(text,font,y){
  const metrics=textMetrics(text,font),start=(width-metrics.width)/2;
  return Array.from(text).map((char,i)=>({char,x:start+metrics.offsets[i],y}));
 }
 function ellipse(ctx,x,y,rx,ry){ctx.beginPath();ctx.ellipse(x,y,Math.max(1,rx),Math.max(1,ry),0,0,Math.PI*2);}
 function drawGlass(){
  const ctx=context,p=progress,turn=model.smooth(.08,.42,p),cross=model.smooth(.38,.7,p),retreat=model.smooth(.73,1,p);
  const zoom=1+cross*5.5-retreat*5.35;
  const cx=width*(.51+Math.sin(p*Math.PI)*.04),cy=height*.55;
  const ry=Math.min(height*.31,width<600?height*.27:width*.3)*zoom;
  const rx=ry*(.24+turn*.69),depth=Math.min(width*.025,27)*(1-turn*.7)*zoom;
  ctx.save();ctx.globalAlpha=1-retreat*.87;
  // A broad caustic and a cut glass edge retain volume at every camera angle.
  const aura=ctx.createRadialGradient(cx,cy,0,cx,cy,ry*1.3);
  aura.addColorStop(0,'#c8d0ce10');aura.addColorStop(.6,'#c8d0ce05');aura.addColorStop(1,'#c8d0ce00');
  ctx.fillStyle=aura;ctx.fillRect(0,0,width,height);
  const edge=ctx.createLinearGradient(cx-rx-depth,cy-ry,cx+rx+depth,cy+ry);
  [[0,'#e8eeed'],[.12,'#525c5c'],[.33,'#151d1e'],[.5,'#9da8a8'],[.67,'#202728'],[.9,'#dae0df'],[1,'#4b5655']].forEach(([n,c])=>edge.addColorStop(n,c));
  ellipse(ctx,cx+depth,cy,rx,ry);ctx.strokeStyle=edge;ctx.lineWidth=Math.max(2,depth*.38);ctx.stroke();
  const glass=ctx.createLinearGradient(cx-rx,cy,cx+rx,cy);
  [[0,'#dce7e23d'],[.08,'#a8b9b126'],[.28,'#151d1b75'],[.64,'#dce6e60c'],[.88,'#dce6e630'],[1,'#f3f7f45c']].forEach(([n,c])=>glass.addColorStop(n,c));
  ellipse(ctx,cx,cy,rx,ry);ctx.fillStyle=glass;ctx.fill();ctx.strokeStyle=edge;ctx.lineWidth=1.7;ctx.stroke();
  // Fine concentric bevels are lit unevenly, like polished optical glass.
  for(let i=1;i<7;i++){ellipse(ctx,cx+depth*.12,cy,rx-i*1.1,ry-i*1.25);ctx.strokeStyle='rgba(219,231,226,'+(.12-i*.014)+')';ctx.lineWidth=.65;ctx.stroke();}
  ctx.save();ellipse(ctx,cx,cy,rx-2,ry-2);ctx.clip();
  const reflection=ctx.createLinearGradient(cx-rx,cy-ry,cx+rx,cy+ry);
  reflection.addColorStop(0,'#ffffff00');reflection.addColorStop(.25,'#ffffff05');reflection.addColorStop(.32,'#edf6f345');reflection.addColorStop(.38,'#ffffff02');reflection.addColorStop(1,'#ffffff00');
  ctx.fillStyle=reflection;ctx.fillRect(cx-rx,cy-ry,rx*2,ry*2);
  for(let i=0;i<9;i++){ctx.beginPath();ctx.moveTo(cx-rx,cy+(i-4)*ry*.16);ctx.bezierCurveTo(cx-rx*.2,cy+(i-4)*ry*.06,cx+rx*.35,cy+(i-4)*ry*.27,cx+rx,cy+(i-4)*ry*.11);ctx.strokeStyle='#dce5e516';ctx.lineWidth=.7;ctx.stroke();}
  ctx.restore();
  ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,Math.PI*.96,Math.PI*1.53);ctx.strokeStyle='#eef5f0bd';ctx.lineWidth=1.6;ctx.shadowColor='#e4efe8';ctx.shadowBlur=9;ctx.stroke();
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
  if(state.focus<.001)return;
  const sourceSize=Math.min(width<600?23:36,width*.06);
  const targetSize=Math.min(width<600?32:68,width*.085);
  const split=model.smooth(.38,.58,progress),assemble=model.smooth(.65,.92,progress);
  for(let g=0;g<3;g++){
   context.font=sourceSize+'px Georgia';const fitted=sourceSize*Math.min(1,width*.88/textMetrics(sources[g],sourceSize+'px Georgia').width);
   const sourceFont=fitted+'px Georgia',targetFont='700 '+(g===0?targetSize:targetSize*.72)+'px ThinkingNarrow';
   const src=textPositions(sources[g],sourceFont,height*(.34+g*.17));
   const dst=textPositions(goals[g],targetFont,height*(.36+g*.17));
   const n=Math.max(src.length,dst.length);
   for(let i=0;i<n;i++){
    const a=src[i]||{char:'',x:width*.5,y:height*.51},b=dst[i]||{char:'',x:width*.5,y:height*.51};
    // Interleave the three phrases across one airy ellipse, avoiding clumps.
    const particle=i*3+g,angle=particle*2.399963,r=Math.sqrt((particle+.5)/(n*3));
    const cloudX=width*.5+Math.cos(angle)*r*width*.38,cloudY=height*.51+Math.sin(angle)*r*height*.27;
    let x=a.x+(cloudX-a.x)*split,y=a.y+(cloudY-a.y)*split;
    x+=(b.x-x)*assemble;y+=(b.y-y)*assemble;
    ctx.save();ctx.translate(x,y);
    const rotation=state.scatter*Math.sin(i*2.1)*.38*(1-assemble);ctx.rotate(rotation);
    const dissolve=(i%4===0?state.scatter*.85:state.scatter*.3);
    ctx.globalAlpha=state.focus*(1-dissolve);
    ctx.fillStyle='#e2e5e0';ctx.shadowBlur=0;
    const ink=ctx.globalAlpha,change=model.smooth(.12+(i%7)*.035,.53+(i%7)*.035,assemble);
    // Exchange alphabets through a short dissolve, never two superimposed glyphs.
    ctx.font=(fitted*(1-state.scatter*.18))+'px Georgia';
    ctx.globalAlpha=ink*(1-model.smooth(0,.48,change));ctx.fillText(a.char,0,0);
    ctx.font='700 '+((g===0?targetSize:targetSize*.72)*(1-state.scatter*.42))+'px ThinkingNarrow';
    ctx.globalAlpha=ink*model.smooth(.52,1,change);ctx.fillText(b.char,0,0);ctx.restore();
   }
  }
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
  phrases.forEach((phrase,i)=>{
   const flow=model.flowState(media.matches?2:clock,i),lane=i%10;
   const travel=media.matches?.2:flow.travel;
   phrase.style.left=(5+travel*30)+'%';phrase.style.top=(25+lane*5.8+(Math.sin(i*2.4+clock*.16)*.5))+'%';
   const entrance=flow.t<.5?model.smooth(0,.07,flow.t):0;
   phrase.style.opacity=String((media.matches?(i<10?.8:0):entrance)*(.65+(i%3)*.16));
   phrase.style.filter='none';
   phrase.style.transform='translateX(-'+(travel*40)+'%) scale('+(1-travel*.18)+')';
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
  if(!media.matches)sceneFrame=requestAnimationFrame(animate);
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
 let editSelected=-1,editQueued=0;
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
  const {progress}=editProgress();
  setEdit(Math.min(2,Math.floor(progress*3)));
 }
 function queueEditScroll(){if(!editQueued)editQueued=requestAnimationFrame(paintEditScroll);}
 function measureEditScroll(){
  if(main.hidden)return;
  const height=editSticky.offsetHeight;
  edit.style.minHeight=(height+Math.max(420,Math.round(window.DTViewport.height()*.85)))+'px';
  editSticky.style.top=Math.min(0,window.DTViewport.height()-height)+'px';
  queueEditScroll();
 }
 function goEditStage(index){
  const {top,travel}=editProgress();
  const target=window.scrollY+edit.getBoundingClientRect().top-top+travel*index/2;
  if(window.DTScenes)window.DTScenes.goTo(target);else window.scrollTo({top:target,behavior:'instant'});
 }
 window.addEventListener('scroll',queueEditScroll,{passive:true});
 window.addEventListener('resize',measureEditScroll,{passive:true});
 window.addEventListener('hashchange',measureEditScroll);
 new ResizeObserver(measureEditScroll).observe(editSticky);
 new MutationObserver(measureEditScroll).observe(main,{attributes:true,attributeFilter:['hidden']});
 setEdit(0);measureEditScroll();
 if(document.fonts)document.fonts.ready.then(measureEditScroll);
 document.getElementById('thinking-jump')?.addEventListener('click',()=>{
  const rootHidden=main.hidden;if(rootHidden)window.location.hash='#home';
  requestAnimationFrame(()=>window.DTScenes.goTo(scrollY+section.getBoundingClientRect().top));
 });
 syncMotion();requestScrollState();
})();

