(function(root){
 'use strict';
 function resolveHeight(smallViewport,fallback){
  return Math.round(Number.isFinite(smallViewport)&&smallViewport>0?smallViewport:fallback);
 }
 if(typeof module==='object'&&module.exports){module.exports={resolveHeight};return;}
 // 100svh does not grow when Safari retracts its browser controls mid-gesture.
 const probe=document.createElement('div');probe.setAttribute('aria-hidden','true');
 probe.style.cssText='position:fixed;left:0;top:0;width:0;height:100svh;visibility:hidden;pointer-events:none;contain:strict;';
 document.body.append(probe);
 const height=()=>resolveHeight(probe.getBoundingClientRect().height,root.innerHeight);
 // The header's base row stays the same height when the mobile links expand.
 const header=document.getElementById('siteHeader');let headerInset=0;
 function measureHeader(){
  if(header)headerInset=Math.round(header.querySelector('.header-name').getBoundingClientRect().height+(parseFloat(getComputedStyle(header).paddingTop)||0)+1);
 }
 measureHeader();root.addEventListener('resize',measureHeader,{passive:true});
 if(header)new ResizeObserver(measureHeader).observe(header);
 root.DTViewport={height,top:()=>headerInset,contentHeight:()=>Math.max(1,height()-headerInset)};
})(globalThis);
