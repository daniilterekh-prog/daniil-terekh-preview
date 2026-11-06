(function(root){
 'use strict';
 function sourceURL(value){const text=String(value||'').trim();if(!text)return '';let u;try{u=new URL(text);}catch(e){throw Error('Добавьте полный адрес источника, начиная с https://');}if(u.protocol!=='https:'||u.username||u.password)throw Error('Источник должен быть обычной HTTPS-ссылкой без логина и пароля.');return u.href;}
 function normalize(items){
  if(!Array.isArray(items)||items.length!==3)throw Error('Архив содержит ровно три материала.');
  return items.map(item=>{if(!item||typeof item!=='object'||typeof item.title!=='string'||!item.title.trim())throw Error('Добавьте название материала.');
   const title=item.title.trim(),summary=String(item.summary||'').trim(),body=String(item.body||'').trim(),image=String(item.image||'');
   if(title.length>80||summary.length>240||body.length>4000)throw Error('Название: до 80 символов; пояснение: до 240; материал: до 4000.');
   return {title,summary,body,image,source:sourceURL(item.source),demo:item.demo!==false};
  });
 }
 function update(items,index,patch){if(!Number.isInteger(index)||index<0||index>2)throw Error('Неизвестный материал.');return normalize(items.map((item,i)=>i===index?{...item,...patch}:item));}
 function selectionAtScroll(progress,position,pending){
  if(pending)return {index:pending.index,pending:Math.abs(position-pending.target)<=2?null:pending};
  return {index:Math.min(2,Math.floor(Math.max(0,Math.min(1,progress))*3)),pending:null};
 }
 const api={sourceURL,normalize,update,selectionAtScroll};root.DTEvidenceModel=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof globalThis==='object'?globalThis:this);

(function(){
 'use strict';
 const root=document.getElementById('evidence');if(!root)return;
 const $=id=>document.getElementById('proof-'+id),M=globalThis.DTEvidenceModel;
 const types=['JOURNEY','CAMPAIGN','TEAM'];
 const caseIds=['barn-estate','mk-elit','cycle'];
 const shell=document.getElementById('evidence-shell'),main=document.getElementById('mainPage');
 let queued=0,pendingSelection=null,measuredWidth=innerWidth,measuredHeight=window.DTViewport.height();
 function measure(){
  if(main.hidden)return;
  const height=shell.offsetHeight;
  root.style.minHeight=(height+Math.max(420,Math.round(window.DTViewport.height()*.85)))+'px';
  shell.style.top=((window.DTViewport.top?.()||0)+Math.min(0,(window.DTViewport.contentHeight?.()||window.DTViewport.height())-height))+'px';
  if(pendingSelection){
   const target=stageTarget(pendingSelection.index);
   if(Math.abs(target-pendingSelection.target)>2){pendingSelection.target=target;moveStage(target);}
  }
  queueScroll();
 }
 function scrollSelect(){
  queued=0;if(main.hidden)return;
  const top=parseFloat(getComputedStyle(shell).top)||0;
  const progress=Math.max(0,Math.min(1,(top-root.getBoundingClientRect().top)/Math.max(1,root.offsetHeight-shell.offsetHeight)));
  const selection=M.selectionAtScroll(progress,scrollY,pendingSelection);
  pendingSelection=selection.pending;if(selection.index!==active)select(selection.index);
 }
 function queueScroll(){if(!queued)queued=requestAnimationFrame(scrollSelect);}
 function stageTarget(index){
  const top=parseFloat(getComputedStyle(shell).top)||0;
  return scrollY+root.getBoundingClientRect().top-top+(root.offsetHeight-shell.offsetHeight)*index/2;
 }
 function moveStage(target){if(window.DTScenes)window.DTScenes.goTo(target);else scrollTo({top:target,behavior:'instant'});}
 function goStage(index,focus=false){
  index=(index+3)%3;
  // A click owns the selection until its scroll transition reaches the target.
  pendingSelection={index,target:stageTarget(index)};select(index,focus);moveStage(pendingSelection.target);
 }
 function resumeScroll(){pendingSelection=null;queueScroll();}


 // These are narrative notes from existing cases, not independent performance evidence.
 const initial=M.normalize(caseIds.map((id,index)=>{
  const c=window.DTExperience.projects.find(project=>project.id===id);
  return {title:c.name,summary:c.approach,body:'The task\n'+c.challenge+'\n\nMy contribution\n'+c.contribution.join(' · ')+'\n\nWorking together\n'+c.collaboration,image:index===0?c.image:'',source:'',demo:false};
 }));
 let items=initial,active=0,manualReduced=false;
 const tabs=Array.from(root.querySelectorAll('.proof-tabs button')),sheets=Array.from(root.querySelectorAll('.proof-sheet')),media=window.matchMedia('(prefers-reduced-motion: reduce)');
 function select(index,focus=false){active=(index+3)%3;root.dataset.active=String(active);tabs.forEach((b,i)=>{b.setAttribute('aria-selected',String(i===active));b.tabIndex=i===active?0:-1;});sheets.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===active)));$('panel').setAttribute('aria-labelledby','proof-tab-'+active);render();if(focus)tabs[active].focus({preventScroll:true});}
 function render(){const item=items[active];$('detail-kind').textContent=String(active+1).padStart(2,'0')+' / '+types[active]+(item.demo?' / PREVIEW':'');$('detail-title').textContent=item.title;$('detail-summary').textContent=item.summary;$('folder-number').textContent=String(active+1).padStart(2,'0');$('draft-label').textContent=items.some(x=>x.demo)?'CASE PREVIEW':'CASE NOTES';
  items.forEach((x,i)=>{$('sheet-title-'+i).textContent=x.title;$('sheet-status-'+i).textContent=types[i]+(x.demo?' / PREVIEW':' / CASE NOTE');});
  const img=$('screen-img');if(items[0].image){img.src=items[0].image;img.hidden=false;}else{img.removeAttribute('src');img.hidden=true;}
  $('note-preview').textContent='One brief. Clear ownership. A team built around the task.';
 }
 function openViewer(){const item=items[active];$('view-kind').textContent=types[active]+' / '+String(active+1).padStart(2,'0');$('view-title').textContent=item.title;$('view-summary').textContent=item.summary;$('view-body').textContent=item.body;$('view-badge').textContent=item.demo?'CASE PREVIEW':'CASE NOTE';const img=$('view-image');img.hidden=!item.image;if(item.image)img.src=item.image;else img.removeAttribute('src');const link=$('view-link');link.hidden=false;link.href='#experience/'+caseIds[active];link.removeAttribute('target');link.removeAttribute('rel');$('viewer').showModal();}
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>goStage(i));tab.addEventListener('keydown',e=>{if(['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();goStage(e.key==='Home'?0:e.key==='End'?2:active+(['ArrowDown','ArrowRight'].includes(e.key)?1:-1),true);}});});sheets.forEach((sheet,i)=>sheet.addEventListener('click',()=>goStage(i)));
 $('view-link').addEventListener('click',()=>$('viewer').close());
 $('open').addEventListener('click',openViewer);$('view-close').addEventListener('click',()=>$('viewer').close()); function motion(){const reduced=manualReduced||media.matches;root.classList.toggle('proof-no-motion',reduced);$('motion').setAttribute('aria-pressed',String(reduced));$('motion').textContent=media.matches?'System motion preference':manualReduced?'Enable motion':'Reduce motion';$('motion').disabled=media.matches;}
 $('motion').addEventListener('click',()=>{manualReduced=!manualReduced;motion();});media.addEventListener('change',motion);
 const jump=document.getElementById('evidence-jump');if(jump)jump.addEventListener('click',()=>{const main=document.getElementById('mainPage'),scroll=()=>moveStage(scrollY+root.getBoundingClientRect().top);if(main&&main.hidden){window.addEventListener('hashchange',()=>requestAnimationFrame(()=>requestAnimationFrame(scroll)),{once:true});location.hash='home';}else scroll();});
 select(0);motion();
 window.addEventListener('scroll',queueScroll,{passive:true});
 window.addEventListener('resize',()=>{const height=window.DTViewport.height();if(measuredWidth===innerWidth&&measuredHeight===height)return;measuredWidth=innerWidth;measuredHeight=height;pendingSelection=null;measure();},{passive:true});
 window.addEventListener('wheel',event=>{if(!event.ctrlKey&&!event.metaKey)resumeScroll();},{passive:true});
 window.addEventListener('touchstart',resumeScroll,{passive:true});
 window.addEventListener('keydown',event=>{if(!event.defaultPrevented&&['ArrowDown','ArrowUp','PageDown','PageUp',' ','Home','End'].includes(event.key))resumeScroll();});
 window.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse'&&event.clientX>=document.documentElement.clientWidth)resumeScroll();},{passive:true});
 new ResizeObserver(measure).observe(shell);
 new MutationObserver(()=>{pendingSelection=null;measure();}).observe(main,{attributes:true,attributeFilter:['hidden']});
 measure();
})();
