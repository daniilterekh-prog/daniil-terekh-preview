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
 root.DTViewport={height:()=>resolveHeight(probe.getBoundingClientRect().height,root.innerHeight)};
})(globalThis);
