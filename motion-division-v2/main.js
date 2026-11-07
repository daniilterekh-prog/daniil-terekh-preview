(function(){
"use strict";
const chapterEls=Array.from(document.querySelectorAll("[data-chapter]"));
const navTargets=["reveal","seam","atrium","automotive","engine","yachting","course"].map(id=>document.getElementById(id));
const rails=Array.from(document.querySelectorAll(".index-link"));
const journey=document.getElementById("journey");
const films=Array.from(document.querySelectorAll("[data-film]"));
const videos=films.map(layer=>layer.querySelector("video"));
const progress=document.getElementById("progress-line");
const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
let raf=0,activeFilm=-1,activeNav=-1,primed=false;
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
function navigateState(){
 const focus=window.innerHeight*.48;
 let index=0;
 for(let i=0;i<navTargets.length;i++){
   if(navTargets[i]&&navTargets[i].getBoundingClientRect().top<=focus)index=i;
 }
 return index;
}
function seek(index,portion){
 if(reduceMotion.matches)return;
 const v=videos[index];
 if(!v||!Number.isFinite(v.duration)||v.duration<=0||v.readyState<1)return;
 const target=clamp(portion,0,.995)*(v.duration-.02);
 if(!v.seeking&&Math.abs(v.currentTime-target)>.03){
   try{v.currentTime=target;}catch(_e){}
 }
}
function update(){
 raf=0;
 const index=navigateState();
 if(index!==activeNav){
  activeNav=index;
  document.body.dataset.active=String(index);
  const light=index===2||index===6;
  document.body.dataset.theme=light?"light":"dark";
  rails.forEach((a,i)=>{
   a.classList.toggle("is-current",i===index);
   if(i===index)a.setAttribute("aria-current","location");
   else a.removeAttribute("aria-current");
  });
 }
 const chapterIndex=Math.min(index,2);
 if(chapterIndex!==activeFilm){
  activeFilm=chapterIndex;
  journey.dataset.current=String(chapterIndex);
  films.forEach((f,i)=>f.classList.toggle("is-active",i===chapterIndex));
 }
 if(index<3){
  const bounds=chapterEls[index].getBoundingClientRect();
  const denom=Math.max(1,bounds.height-window.innerHeight*.2);
  const p=clamp((window.innerHeight*.58-bounds.top)/denom);
  seek(index,p);
 }
 const doc=document.documentElement,full=Math.max(1,doc.scrollHeight-window.innerHeight);
 progress.style.transform="scaleX("+clamp(window.scrollY/full)+")";
}
const schedule=()=>{if(!raf)raf=requestAnimationFrame(update)};
videos.forEach((v,i)=>{
 v.addEventListener("seeked",()=>films[i].classList.add("has-frame"));
 v.addEventListener("loadeddata",schedule);
 v.addEventListener("loadedmetadata",schedule);
 v.addEventListener("error",()=>films[i].classList.remove("has-frame"));
});
function primeVideos(){
 if(primed||reduceMotion.matches)return;
 primed=true;
 videos.forEach(v=>{
  if(!v||!v.paused)return;
  const result=v.play();
  if(result&&typeof result.then==="function"){
   result.then(()=>{v.pause();schedule()}).catch(()=>{});
  }else{v.pause()}
 });
}
document.addEventListener("pointerdown",primeVideos,{once:true,passive:true});
document.addEventListener("touchstart",primeVideos,{once:true,passive:true});
window.addEventListener("scroll",schedule,{passive:true});
window.addEventListener("resize",schedule,{passive:true});
window.addEventListener("pageshow",schedule);
reduceMotion.addEventListener?.("change",schedule);
update();

const roomSections=Array.from(document.querySelectorAll(".world"));
if("IntersectionObserver" in window){
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>entry.target.classList.toggle("is-visible",entry.isIntersecting));
 },{threshold:.15});
 roomSections.forEach(el=>observer.observe(el));
}else{roomSections.forEach(el=>el.classList.add("is-visible"))}

const content={
 automotive:{
  kicker:"01 / THE ROAD",
  title:"AUTOMOTIVE",
  description:"For manufacturers, premium retailers and exceptional automotive experiences. A connected approach to positioning, storytelling and commercial performance.",
  image:"https://d2ol7oe51mr4n9.cloudfront.net/user_3LYfsncNUNmrQZphq638E2FB1PG/dc750968-e991-4359-9e97-c3db23db990a.webp",
  services:["Brand & market positioning","Creative campaigns and launches","Digital experiences and web","Paid media and measurement"],
  switchLabel:"EXPLORE YACHTING",
  next:"yachting"
 },
 yachting:{
  kicker:"02 / THE SEA",
  title:"YACHTING",
  description:"For shipyards, brokers, charters and luxury marinas. A more considered digital presence built for international and high-intent audiences.",
  image:"https://d2ol7oe51mr4n9.cloudfront.net/user_3LYfsncNUNmrQZphq638E2FB1PG/09e85d2e-6237-4aa5-97be-4ca2cd1f13bf.webp",
  services:["International audience strategy","Editorial creative direction","Premium websites and content","Qualified demand and analytics"],
  switchLabel:"EXPLORE AUTOMOTIVE",
  next:"automotive"
 }
};
const dialog=document.getElementById("world-dialog");
const dialogTitle=document.getElementById("dialog-title");
const dialogDescription=document.getElementById("dialog-description");
const dialogKicker=document.getElementById("dialog-kicker");
const dialogImage=document.getElementById("dialog-image");
const dialogServices=document.getElementById("dialog-services");
const dialogSwitch=document.getElementById("dialog-switch");
let openWorld=null;
function setRoom(key){
 const d=content[key];if(!d)return;
 openWorld=key;
 dialogTitle.textContent=d.title;
 dialogDescription.textContent=d.description;
 dialogKicker.textContent=d.kicker;
 dialogImage.src=d.image;
 dialogImage.alt=key==="automotive"?"Silver hypercar in a monumental automotive gallery.":"White luxury yacht in a minimalist waterside pavilion.";
 dialogServices.replaceChildren();
 d.services.forEach((service,i)=>{
  const row=document.createElement("div");row.className="service";
  const n=document.createElement("span");n.className="service-index";n.textContent="0"+(i+1);
  const label=document.createElement("span");label.textContent=service;
  const arrow=document.createElement("span");arrow.className="service-arrow";arrow.setAttribute("aria-hidden","true");arrow.textContent="↗";
  row.append(n,label,arrow);dialogServices.append(row);
 });
 dialogSwitch.firstChild.textContent=d.switchLabel+" ";
}
document.querySelectorAll("[data-open-world]").forEach(button=>button.addEventListener("click",()=>{
 setRoom(button.dataset.openWorld);
 if(!dialog.open){dialog.showModal();document.body.classList.add("dialog-open")}
 document.getElementById("dialog-close").focus();
}));
dialogSwitch.addEventListener("click",()=>setRoom(content[openWorld]?.next||"automotive"));
document.getElementById("dialog-close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
dialog.addEventListener("close",()=>document.body.classList.remove("dialog-open"));
const engineRoot=document.getElementById("engine");
const engineTabs=Array.from(document.querySelectorAll("[data-engine-step]"));
const engineText=document.getElementById("engine-desc");
const engineLabel=document.getElementById("engine-label");
const engineCount=document.getElementById("engine-count");
const engineTopics=[
 ["POSITIONING","Understand the enthusiast, collector and next generation of premium automotive buyers."],
 ["CREATIVE","Turn engineering, craftsmanship and motion into a compelling visual narrative."],
 ["PERFORMANCE","Connect considered creative with qualified demand, media channels and measurable outcomes."],
 ["DIGITAL EXPERIENCE","Create a digital world as deliberate and refined as the physical object."]
];
function selectEngine(i){
 let n=(i+engineTopics.length)%engineTopics.length;
 engineRoot.dataset.step=String(n);
 engineTabs.forEach((tab,j)=>{let on=n===j;tab.classList.toggle("active",on);tab.setAttribute("aria-pressed",String(on))});
 engineLabel.textContent="0"+(n+1)+" / "+engineTopics[n][0];
 engineCount.textContent="0"+(n+1)+" / 04";
 engineText.textContent=engineTopics[n][1];
}
engineTabs.forEach((tab,i)=>{tab.addEventListener("click",()=>selectEngine(i));tab.addEventListener("keydown",e=>{if(!["ArrowDown","ArrowUp","ArrowRight","ArrowLeft","Home","End"].includes(e.key))return;e.preventDefault();const n=e.key==="Home"?0:e.key==="End"?3:(i+(e.key==="ArrowDown"||e.key==="ArrowRight"?1:-1)+4)%4;selectEngine(n);engineTabs[n].focus()})});
const course=document.getElementById("course");
const courseTabs=Array.from(document.querySelectorAll("[data-course-stop]"));
const courseName=document.getElementById("course-name");
const courseDesc=document.getElementById("course-desc");
const courseCount=document.getElementById("course-count");
const courseTags=document.getElementById("course-tags");
const courses=[
 ["SHIPYARDS","Communicate craftsmanship, provenance and engineering to an international clientele.",["Brand story","Launch strategy"]],
 ["BROKERAGE","Connect exceptional yachts with high-intent buyers through considered content and targeted demand.",["Buyer intent","Performance"]],
 ["CHARTER","Turn the promise of a remarkable journey into a memorable digital experience.",["Experience design","Campaigns"]],
 ["MARINAS","Present a destination as a cultural landmark, not just a place to dock.",["Destination identity","Market entry"]]
];
function selectCourse(i){
 let n=(i+courses.length)%courses.length;
 course.dataset.stop=String(n);
 courseTabs.forEach((tab,j)=>{let on=n===j;tab.classList.toggle("active",on);tab.setAttribute("aria-pressed",String(on))});
 courseCount.textContent="0"+(n+1)+" / 04";
 courseName.textContent=courses[n][0];courseDesc.textContent=courses[n][1];
 courseTags.replaceChildren();courses[n][2].forEach(s=>{const span=document.createElement("span");span.textContent=s;courseTags.append(span)});
}
courseTabs.forEach((tab,i)=>{tab.addEventListener("click",()=>selectCourse(i));tab.addEventListener("keydown",e=>{if(!["ArrowDown","ArrowUp","ArrowRight","ArrowLeft","Home","End"].includes(e.key))return;e.preventDefault();const n=e.key==="Home"?0:e.key==="End"?3:(i+(e.key==="ArrowDown"||e.key==="ArrowRight"?1:-1)+4)%4;selectCourse(n);courseTabs[n].focus()})});
const manifesto=document.getElementById("manifesto");
const footer=document.querySelector(".footer");
const originalUpdate=update;
update=function(){
 originalUpdate();
 const focus=window.innerHeight*.48;
 const boxCourse=course.getBoundingClientRect();
 const boxManifesto=manifesto.getBoundingClientRect();
 const boxFooter=footer.getBoundingClientRect();
 const bright=(activeNav===2)||(boxCourse.top<=focus&&boxCourse.bottom>focus)||(boxManifesto.top<=focus&&boxManifesto.bottom>focus);
 document.body.dataset.theme=boxFooter.top<=focus?"dark":bright?"light":"dark";
};

})();
