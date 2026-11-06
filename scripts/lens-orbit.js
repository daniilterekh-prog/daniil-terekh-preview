(function(root){
 const clamp=n=>Math.max(0,Math.min(1,n));
 const smooth=(a,b,p)=>{const t=clamp((p-a)/(b-a));return t*t*(3-2*t);};
 function flightState(value){
  const p=clamp(value);
  return {progress:p,phase:p<.14?'inputs':p<.42?'focus':p<.84?'passage':'clarity',focus:smooth(.18,.3,p)*(1-smooth(.86,.98,p)),pass:smooth(.34,.76,p),scatter:p>=.88?0:Math.sin(smooth(.4,.88,p)*Math.PI),result:smooth(.88,1,p),noise:1-smooth(.1,.22,p),zoom:1+smooth(.2,.6,p)*4.5-smooth(.72,1,p)*4.5};
 }
 function flowState(time,index){
  const raw=time/18+(index%10)*.067+Math.floor(index/10)*.5,cycle=Math.floor(raw),t=raw-cycle;
  return {cycle,t,opacity:smooth(0,.07,t)*(1-smooth(.34,.5,t)),dust:smooth(.32,.41,t)*(1-smooth(.46,.55,t)),travel:smooth(0,.5,t)};
 }
 function phraseGlyphState(phase,position){
  const start=.34+(1-clamp(position))*.1;
  const dissolved=smooth(start,start+.06,phase);
  return {opacity:1-dissolved,dust:Math.sin(dissolved*Math.PI)};
 }
 function glassGeometry(width,height,value){
  const p=clamp(value),turn=smooth(.08,.42,p),cross=smooth(.38,.7,p),retreat=smooth(.73,1,p);
  const zoom=1+cross*5.5-retreat*5.35,ry=Math.min(height*.31,width<600?height*.27:width*.3)*zoom;
  return {cx:width*(.51+Math.sin(p*Math.PI)*.04),cy:height*.55,ry,rx:ry*(.24+turn*.69),depth:Math.min(width*.025,27)*(1-turn*.7)*zoom,zoom,retreat};
 }
 const api={flightState,flowState,phraseGlyphState,glassGeometry,smooth};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.DTLensOrbit=api;
})(globalThis);
