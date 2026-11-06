(function(){
 'use strict';
 const dialog=document.getElementById('connect');
 if(!dialog)return;
 const closeButton=document.getElementById('connect-close');
 const email=document.getElementById('connect-email');
 const telegram=document.getElementById('connect-telegram');
 const whatsapp=document.getElementById('connect-whatsapp');
 const context=document.getElementById('connect-context');
 const status=document.getElementById('copy-status');
 const callback=document.getElementById('callback-form');
 const phone=document.getElementById('callback-phone');
 const phoneError=document.getElementById('callback-error');
 const callbackText=document.getElementById('callback-text');
 const wechatNumber=document.getElementById('wechat-number');
 const wechatStatus=document.getElementById('wechat-status');
 const panelButtons=[...dialog.querySelectorAll('[data-connect-panel]')];
 const address='daniilterekh@gmail.com';
 let opener=null,backdropDown=false,topic='';
 function resetCallback(){
  callback.reset();
  callbackText.value='';
  phone.removeAttribute('aria-invalid');
  phoneError.textContent='';
 }
 function resetPanels(){
  for(const button of panelButtons){
   button.setAttribute('aria-expanded','false');
   document.getElementById(button.getAttribute('aria-controls')).hidden=true;
  }
  resetCallback();wechatStatus.textContent='';
 }
 function open(trigger){
  if(dialog.open)return;
  opener=trigger||document.activeElement;
  topic=trigger?.dataset.contactTopic||'';
  if(trigger?.closest('#detailPage'))topic='About '+document.getElementById('detailName').textContent;
  context.textContent=topic;context.hidden=!topic;
  email.href='mailto:'+address+'?subject='+encodeURIComponent(topic||'Let’s connect');
  const draft=topic?'Hi Daniil! I’d like to connect.\n\n'+topic+'\n\n':'Hi Daniil! I’d like to discuss a project or a role with you.';
  for(const link of [telegram,whatsapp]){
   const chat=new URL(link.href);chat.searchParams.set('text',draft);link.href=chat.href;
  }
  resetPanels();
  status.textContent='';
  window.DTScenes?.goTo(scrollY);
  document.documentElement.classList.add('connect-open');
  dialog.showModal();
  dialog.scrollTop=0;
  closeButton.focus({preventScroll:true});
 }
 for(const button of panelButtons)button.addEventListener('click',()=>{
  const show=button.getAttribute('aria-expanded')!=='true';
  for(const item of panelButtons){
   const active=item===button&&show;
   item.setAttribute('aria-expanded',String(active));
   document.getElementById(item.getAttribute('aria-controls')).hidden=!active;
  }
  if(show){
   const panel=document.getElementById(button.getAttribute('aria-controls'));
   panel.querySelector('input:not([type="hidden"]),button').focus({preventScroll:true});
   panel.scrollIntoView({block:'nearest',behavior:'instant'});
  }
 });
 phone.addEventListener('input',()=>{
  phone.removeAttribute('aria-invalid');phoneError.textContent='';callbackText.value='';
 });
 callback.addEventListener('submit',event=>{
  const number=phone.value.trim().replace(/[\s().-]/g,'').replace(/^00/,'+');
  if(!/^\+[1-9]\d{6,14}$/.test(number)){
   event.preventDefault();
   callbackText.value='';
   phone.setAttribute('aria-invalid','true');
   phoneError.textContent='Enter your number with a country code, e.g. +44 7700 900123.';
   phone.focus();return;
  }
  phone.removeAttribute('aria-invalid');phoneError.textContent='';
  callbackText.value='Hi Daniil! I’d like to request a call.\n\nMy phone number: '+number+(topic?'\n\n'+topic:'');
  // Native GET submission opens the draft; the visitor sends it in Telegram.
 });
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
  resetPanels();topic='';
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
 document.getElementById('copy-wechat').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(wechatNumber.textContent.replace(/\s/g,''));wechatStatus.textContent='Number copied. Add me by phone in WeChat.';}
  catch{wechatStatus.textContent='Select the number above to copy it, then add me in WeChat.';}
 });
 function route(){
  if(location.hash==='#connect')open();
  else if(dialog.open)dialog.close();
 }
 window.addEventListener('hashchange',route);
 requestAnimationFrame(route);
})();
