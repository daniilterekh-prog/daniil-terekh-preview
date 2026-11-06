(function(){
 'use strict';
 const section=document.getElementById('services');if(!section)return;
 const buttons=Array.from(section.querySelectorAll('[data-service]'));
 const panels=Array.from(section.querySelectorAll('.service-panel'));
 const directions=buttons.filter(button=>button.classList.contains('service-direction'));
 const close=section.querySelector('.services-close');let selected=null;
 function select(key,restoreFocus=false){
  selected=key;section.dataset.selection=key||'';section.classList.toggle('is-open',key!==null);
  buttons.forEach(button=>{const active=button.dataset.service===key;button.classList.toggle('is-active',active);button.setAttribute('aria-expanded',String(active));});
  panels.forEach(panel=>{panel.hidden=panel.id!=='service-panel-'+key;});
  close.hidden=key===null;
  if(window.DTScenes)window.DTScenes.goTo(section.getBoundingClientRect().top+scrollY);
  if(key==='team')close.focus({preventScroll:true});
  else if(restoreFocus)buttons.find(b=>b.dataset.service===key)?.focus({preventScroll:true});
 }
 buttons.forEach(button=>{
  button.addEventListener('click',()=>select(selected===button.dataset.service?null:button.dataset.service));
  button.addEventListener('keydown',event=>{
   const step=['ArrowDown','ArrowRight'].includes(event.key)?1:['ArrowUp','ArrowLeft'].includes(event.key)?-1:0;
   if(!step||!directions.includes(button))return;event.preventDefault();const next=directions[(directions.indexOf(button)+step+directions.length)%directions.length];next.focus({preventScroll:true});select(next.dataset.service);
  });
 });
 function dismiss(){const last=selected;select(null);buttons.find(b=>b.dataset.service===last)?.focus({preventScroll:true});}
 close.addEventListener('click',dismiss);
 section.addEventListener('keydown',event=>{if(event.key==='Escape'&&selected!==null){event.preventDefault();dismiss();}});
})();
