/*
 * CYCLE Motion Division V3
 * An authored CSS 3D architectural camera driven by scroll position.
 * No dependencies, WebGL libraries or fake 3D product models.
 * Pointer events always pass through the cinematic geometry.
 */
(() => {
  "use strict";
  const root=document.querySelector(".journey-stage");
  const chapters=[...document.querySelectorAll("[data-chapter]")];
  const worldSections=[...document.querySelectorAll(".world")];
  const engine=document.getElementById("engine");
  const course=document.getElementById("course");
  const videoLayers=[...document.querySelectorAll(".film-layer")];
  if(!root || chapters.length!==3 || worldSections.length!==2 || !engine || !course)return;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const smooth=(a,b,v)=>{const x=clamp((v-a)/(b-a));return x*x*(3-2*x)};
  const frame=(node,vh)=>{
    const r=node.getBoundingClientRect();
    return clamp((vh*.57-r.top)/Math.max(1,r.height-vh*.36));
  };
  const enter=(node,vh)=>{
    const r=node.getBoundingClientRect();
    return clamp((vh-r.top)/Math.max(vh,r.height));
  };
  const put=(el,key,val)=>el.style.setProperty(key,val);
  let pending=0;
  function paint(){
    pending=0;
    if(reduced.matches){
      root.style.removeProperty("--md-corridor-opacity");
      root.style.removeProperty("--md-platform-opacity");
      root.style.setProperty("--md-corridor-opacity","0");
      root.style.setProperty("--md-platform-opacity","0");
      return;
    }
    const vh=window.innerHeight;
    const hero=frame(chapters[0],vh), seam=frame(chapters[1],vh), platform=frame(chapters[2],vh);
    const corridor=clamp(smooth(.66,.97,hero)*(1-smooth(.73,.99,seam)));
    const gallery=smooth(.60,.98,seam);
    const open=smooth(.12,.79,seam);
    put(root,"--md-door-open",open.toFixed(4));
    put(root,"--md-door-push",(open*Math.min(window.innerWidth*.29,420)).toFixed(1)+"px");
    put(root,"--md-aperture-scale",(1+open*.65).toFixed(3));
    put(root,"--md-corridor-opacity",corridor.toFixed(4));
    put(root,"--md-platform-opacity",gallery.toFixed(4));
    // Perspective camera travels forward through six nested metallic frames.
    put(root,"--md-cam-z",(-70+seam*960).toFixed(1)+"px");
    put(root,"--md-cam-x",((seam-.5)*8*gallery).toFixed(1)+"px");
    put(root,"--md-cam-y",(-15*seam).toFixed(1)+"px");
    put(root,"--md-cam-roll",((seam-.5)*-0.7).toFixed(2)+"deg");
    put(root,"--md-platform-z",(-1080+platform*320).toFixed(1)+"px");
    put(root,"--md-hero-scale",(1+hero*.22).toFixed(4));
    put(root,"--md-seam-scale",(1+seam*.16).toFixed(4));
    put(root,"--md-platform-scale",(1.04+platform*.075).toFixed(4));
    for(const el of worldSections){
      const p=enter(el,vh);
      const yacht=el.dataset.world==="yachting";
      put(el,"--md-room-scale",(1.17-p*(yacht?.12:.14)).toFixed(4));
      put(el,"--md-room-x",((p-.5)*(yacht?-25:30)).toFixed(1)+"px");
      put(el,"--md-room-y",((p-.5)*(yacht?22:-28)).toFixed(1)+"px");
      put(el,"--md-room-z",(-250+p*350).toFixed(1)+"px");
      put(el,"--md-room-turn",((p-.5)*(yacht?-3.4:4.2)).toFixed(2)+"deg");
    }
    const ep=enter(engine,vh);
    put(engine,"--md-engine-z",(-90+ep*178).toFixed(1)+"px");
    put(engine,"--md-engine-turn",(-6+ep*11).toFixed(2)+"deg");
    put(engine,"--md-engine-pitch",((ep-.5)*-2).toFixed(2)+"deg");
    const cp=enter(course,vh);
    put(course,"--md-route-x",((cp-.5)*-19).toFixed(1)+"px");
    put(course,"--md-route-y",((cp-.5)*11).toFixed(1)+"px");
    put(course,"--md-route-z",(-34+cp*55).toFixed(1)+"px");
    put(course,"--md-route-turn",((cp-.5)*1.7).toFixed(2)+"deg");
    put(course,"--md-water-z",(-90+cp*130).toFixed(1)+"px");
  }
  function schedule(){if(!pending)pending=requestAnimationFrame(paint)}
  window.addEventListener("scroll",schedule,{passive:true});
  window.addEventListener("resize",schedule,{passive:true});
  window.addEventListener("pageshow",schedule);
  reduced.addEventListener?.("change",schedule);
  paint();
})();