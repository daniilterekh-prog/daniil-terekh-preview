document.getElementById('footer-top').addEventListener('click',()=>window.DTScenes.goTo(0));
document.getElementById('copy-email').addEventListener('click',async()=>{
 const status=document.getElementById('copy-status');
 try { await navigator.clipboard.writeText('daniilterekh@gmail.com');status.textContent='Email copied.'; }
 catch { status.textContent='Select the email address above to copy it.'; }
});
