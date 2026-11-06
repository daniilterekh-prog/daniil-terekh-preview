(function(){
 'use strict';
 const dialog=document.getElementById('connect');
 if(!dialog)return;
 const closeButton=document.getElementById('connect-close');
 const email=document.getElementById('connect-email');
 const context=document.getElementById('connect-context');
 const status=document.getElementById('copy-status');
 const address='daniilterekh@gmail.com';
 let opener=null,backdropDown=false;
 function open(trigger){
  if(dialog.open)return;
  opener=trigger||document.activeElement;
  let topic=trigger?.dataset.contactTopic||'';
  if(trigger?.closest('#detailPage'))topic='About '+document.getElementById('detailName').textContent;
  context.textContent=topic;context.hidden=!topic;
  email.href='mailto:'+address+'?subject='+encodeURIComponent(topic||'Let’s connect');
  status.textContent='';
  window.DTScenes?.goTo(scrollY);
  document.documentElement.classList.add('connect-open');
  dialog.showModal();
  closeButton.focus({preventScroll:true});
 }
 function outside(event){
  const r=dialog.getBoundingClientRect();
  return event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom;
 }
 document.addEventListener('click',event=>{
  const trigger=event.target instanceof Element?event.target.closest('[data-contact-open]'):null;
  if(!trigger||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  event.preventDefault();open(trigger);
 });
 closeButton.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('pointerdown',event=>{backdropDown=event.target===dialog&&outside(event);});
 dialog.addEventListener('click',event=>{if(backdropDown&&event.target===dialog&&outside(event))dialog.close();backdropDown=false;});
 dialog.addEventListener('close',()=>{
  document.documentElement.classList.remove('connect-open');
  if(location.hash==='#connect'){
   history.replaceState(history.state,'',location.pathname+location.search+'#contact');
   document.getElementById('contact').scrollIntoView({behavior:'instant',block:'start'});
   opener=document.getElementById('contact-cta');
  }
  if(opener?.isConnected&&!opener.closest('[hidden],[inert]'))opener.focus({preventScroll:true});
  opener=null;
 });
 document.getElementById('copy-email').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(address);status.textContent='Email copied.';}
  catch{status.textContent='Select the email address above to copy it.';}
 });
 function route(){
  if(location.hash==='#connect')open();
  else if(dialog.open)dialog.close();
 }
 window.addEventListener('hashchange',route);
 requestAnimationFrame(route);
})();
