(function(root){
 'use strict';
 const categories={strategy:'Strategy',design:'Design',performance:'Performance',analytics:'Analytics',automation:'Automation',leadership:'Leadership'};
 const initial=[["Digital strategy", "strategy", "Connecting business goals, acquisition and the customer journey."], ["Figma", "design", "I prototype the visitor journey and test the layout before development."], ["Google Search", "performance", "Search advertising with Google Ads."], ["GA4", "analytics", "I track the steps that show where visitors engage or drop off."], ["Bitrix24", "automation", "CRM, enquiries and continuity throughout the customer journey."], ["Tilda", "design", "Building and improving landing pages."], ["Yandex Direct", "performance", "Advertising campaigns and enquiry generation."], ["GTM", "analytics", "Tag management and event tracking."], ["Unisender", "automation", "Email campaigns connected to CRM."], ["UX", "design", "Page structure and the visitor’s next step."], ["Lead generation", "performance", "Connecting the first ad impression with an enquiry."], ["Yandex Metrica", "analytics", "Traffic quality and visitor behaviour."], ["UI", "design", "Visual hierarchy, typography and interface elements."], ["Calltouch", "analytics", "Call tracking and acquisition attribution."], ["Yandex Ad Network", "performance", "Display campaigns across the Yandex network."], ["Zero Block", "design", "Responsive layouts and interfaces in Tilda."], ["UTM", "analytics", "Source tagging and attribution."], ["CRM", "automation", "Passing enquiries and their context into the sales process."], ["Google Display", "performance", "Display campaigns with Google Ads."], ["Landing pages", "design", "I turn an offer into a clear page with proof and a next step."], ["SEO", "performance", "Structure and content for organic search."], ["GitHub", "automation", "Source control and change history."], ["YouTube Ads", "performance", "Video campaigns with Google Ads."], ["T123", "design", "Custom HTML, CSS and JavaScript in Tilda."], ["Codex", "automation", "Developing code and prototypes with AI."], ["UX audits", "design", "Reviewing structure, navigation, mobile layouts and conversion points."], ["Automation", "automation", "Connecting tools and reducing manual work."], ["Leadership", "leadership", "Coordinating people and delivery across digital projects."], ["Ad creative", "design", "Visuals tailored to the campaign and its format."], ["Email marketing", "automation", "Audience communications, templates and campaigns."]].map(([name,category,description])=>({name,category,description}));
 function parseCatalogue(text){
  const rows=text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  if(!rows.length)throw Error('Список пуст. Добавьте хотя бы один навык.');
  if(rows.length>100)throw Error('В пласт помещается до 100 навыков.');
  const seen=new Set();return rows.map((line,i)=>{
   const [raw='',cat='design',...rest]=line.split('|');const name=raw.trim(),category=cat.trim().toLowerCase(),description=rest.join('|').trim();
   if(!name||name.length>60)throw Error('Строка '+(i+1)+': название от 1 до 60 символов.');
   if(!Object.hasOwn(categories,category))throw Error('Строка '+(i+1)+': неизвестная категория.');
   const key=name.toLocaleLowerCase();if(seen.has(key))throw Error('Повтор названия: '+name);seen.add(key);
   if(description.length>400)throw Error('Строка '+(i+1)+': описание до 400 символов.');
   return {name,category,description};
  });
 }
 const serialize=items=>items.map(x=>[x.name,x.category,x.description].join(' | ')).join('\n');
 const slotFor=i=>(i*37+44)%100;
 function createState(items=initial){return {items:items.map(x=>({...x})),selected:items.length?0:-1,hover:-1,category:'all',query:'',variant:5,task:'launch',overview:false};}
 function matches(s){return s.items.flatMap((x,i)=>(s.category==='all'||x.category===s.category)&&[x.name,x.description,categories[x.category]].join(' ').toLocaleLowerCase().includes(s.query.toLocaleLowerCase().trim())?[i]:[]);}
 function reduce(s,a){
  const n={...s};
  if(a.type==='category')n.category=a.value;
  if(a.type==='query')n.query=a.value;
  if(a.type==='variant'){n.variant=Math.max(0,Math.min(9,Number(a.value)||0));n.hover=-1;n.overview=false;}
  if(a.type==='hover')n.hover=a.value;
  if(a.type==='task')n.task=a.value;
  if(a.type==='overview')n.overview=!s.overview;
  if(a.type==='replace'){n.items=a.value.map(x=>({...x}));n.category='all';n.query='';n.selected=0;n.hover=-1;}
  const visible=matches(n);
  if(a.type==='select'&&visible.includes(a.value)){n.selected=a.value;n.overview=false;}
  if(a.type==='step'&&visible.length){const at=visible.indexOf(n.selected),step=a.value%visible.length||Math.sign(a.value);n.selected=visible[((at<0?0:at)+step+visible.length)%visible.length];n.overview=false;}
  if(!visible.includes(n.selected))n.selected=visible.length?visible[0]:-1;
  return n;
 }
 function inTask(s,i){const x=s.items[i];if(!x)return false;const sets={launch:['strategy','design','performance'],measure:['analytics'],connect:['automation','leadership']};return (sets[s.task]||sets.launch).includes(x.category);}
 function related(s){
  if(s.selected<0)return [];
  const groups={strategy:['UX','GA4','Leadership'],design:['Figma','UX','UI','Tilda'],performance:['Ad creative','Landing pages','GA4','CRM'],analytics:['GTM','GA4','UTM','Calltouch'],automation:['CRM','Bitrix24','Unisender','Email marketing'],leadership:['Digital strategy','GitHub','Automation']};
  const names=groups[s.items[s.selected].category]||[];
  const candidates=matches(s).filter(i=>s.variant===6?inTask(s,i):names.includes(s.items[i].name));
  return s.variant===6?candidates.slice(0,5):[s.selected,...candidates.filter(i=>i!==s.selected)].slice(0,5);
 }
 function layout(s,slot){
  let x=slot%10,y=Math.floor(slot/10),z=0;
  const selectedSlot=s.selected<0?44:slotFor(s.selected),hover=s.hover<0?selectedSlot:slotFor(s.hover),hx=hover%10,hy=Math.floor(hover/10),d=Math.hypot(x-hx,y-hy);
  const active=s.selected>=0&&slot===selectedSlot;
  switch(s.variant){
   case 0:z=Math.max(0,2.1-d)*.48;break;
   case 1:z=active?2.5:0;break;
   case 2:z=Math.max(0,Math.cos(d*.85))*.68;break;
   case 3:x+=(x>=5?.72:-.72);z=active?.7:0;break;
   case 4:if(active){y+=2.2;z=.15;}break;
   case 5:z=active?1.35:related(s).some(i=>slotFor(i)===slot)?.65:0;break;
   case 6:{const ids=related(s),at=ids.findIndex(i=>slotFor(i)===slot);if(at>=0){x=3+(at%3)*1.35;y=3+Math.floor(at/3)*1.35;z=2.5+(at%2)*.25;}break;}
   case 7:if(related(s).some(i=>slotFor(i)===slot))z=1.7;break;
   case 8:if(active)z=1.15;else if(Math.abs(x-selectedSlot%10)+Math.abs(y-Math.floor(selectedSlot/10))===1){x+=(x-selectedSlot%10)*.4;y+=(y-Math.floor(selectedSlot/10))*.4;}break;
   case 9:z=active?.6:0;break;
  }
  return {x,y,z};
 }
 const solutions={"Digital strategy":["Digital activity has no clear priorities.","Connect business goals, audiences and channels.","A prioritised digital roadmap."],"Figma":["Visitors do not understand the website offer.","Structure the page and prototype the journey.","A website prototype ready for development."],"Google Search":["The offer misses people actively searching.","Connect search intent, keywords and landing pages.","A structured Google Search campaign."],"GA4":["Traffic grows, but useful actions are unclear.","Map the journey and define meaningful events.","A GA4 measurement plan and event setup."],"Bitrix24":["Enquiries lose their context in the handover.","Map the pipeline, fields and responsibilities.","A configured Bitrix24 enquiry pipeline."],"Tilda":["A campaign needs a clear place to send visitors.","Build the offer into a responsive page.","A published Tilda landing page."],"Yandex Direct":["Advertising needs a more relevant structure.","Group intent, offers and campaign settings.","A structured Yandex Direct account."],"GTM":["Tracking changes require repeated code edits.","Organise tags, triggers and validation.","A tested tag configuration in GTM."],"Unisender":["Email communication is fragmented.","Plan segments, templates and campaign logic.","A prepared Unisender email campaign."],"UX":["The visitor cannot find a clear next step.","Map the journey and remove friction.","A clear user flow and page structure."],"Lead generation":["Ads, pages and sales work in isolation.","Connect the offer, acquisition and enquiry flow.","A connected lead-generation funnel."],"Yandex Metrica":["Visitor behaviour is difficult to interpret.","Configure goals and review traffic behaviour.","A Metrica setup with actionable findings."],"UI":["The interface lacks a clear visual hierarchy.","Align typography, spacing and components.","A consistent interface design system."],"Calltouch":["Calls are disconnected from acquisition sources.","Map call tracking and source attribution.","A Calltouch attribution configuration."],"Yandex Ad Network":["Display ads reach an unfocused audience.","Align targeting, creative and placement reviews.","A segmented Yandex network campaign."],"Zero Block":["A standard template does not fit the idea.","Build custom layouts and responsive states.","A responsive Zero Block composition."],"UTM":["Campaign names make source reports unreliable.","Define shared naming and link rules.","A consistent UTM naming convention."],"CRM":["An enquiry arrives without a clear owner.","Define stages, routing and handover context.","A documented CRM workflow."],"Google Display":["The campaign needs coherent visual reach.","Connect audiences, placements and ad formats.","A structured Google Display campaign."],"Landing pages":["The offer is lost among competing messages.","Clarify the promise, proof and call to action.","A focused landing page and enquiry path."],"SEO":["Search engines and visitors miss key content.","Review structure, page intent and content gaps.","A prioritised SEO improvement brief."],"GitHub":["Source files and changes are scattered.","Organise the repository and version history.","A structured repository for handover."],"YouTube Ads":["The video message lacks a campaign context.","Align audience, opening message and destination.","A YouTube campaign structure and creative brief."],"T123":["A page needs behaviour beyond standard blocks.","Integrate focused HTML, CSS and JavaScript.","A tested custom T123 page component."],"Codex":["An idea needs to become a working prototype.","Develop, review and test code with AI assistance.","A working prototype with editable source."],"UX audits":["The website has friction but no clear priorities.","Review journeys, mobile layouts and conversion points.","A prioritised UX audit with concrete fixes."],"Automation":["Manual handovers slow down routine work.","Map triggers, data and exception handling.","A documented automation workflow."],"Leadership":["Specialists work without a shared direction.","Align priorities, ownership and review points.","A delivery plan with clear responsibilities."],"Ad creative":["The ad does not communicate the offer clearly.","Match message, visual hierarchy and ad format.","A coordinated set of campaign creatives."],"Email marketing":["Messages have no consistent customer journey.","Plan segments, sequence and useful next steps.","An email communication plan and templates."]};
 function solutionFor(item){const row=solutions[item.name]||["A project needs a clearer next step.",item.description,"A practical brief for "+item.name+"."];return {challenge:row[0],approach:row[1],deliverable:row[2]};}
 function connectionFaces(s){if(s.selected<0)return [];const origin=slotFor(s.selected);return [...new Set(related(s).filter(i=>i!==s.selected).map(i=>{const slot=slotFor(i),dx=slot%10-origin%10,dy=Math.floor(slot/10)-Math.floor(origin/10);return dx<0?'left':dx>0?'right':dy<0?'back':'front';}))];}
 const api={connectionFaces,solutionFor,categories,initial,parseCatalogue,serialize,slotFor,createState,matches,reduce,inTask,related,layout};
 if(typeof module==='object'&&module.exports)module.exports=api;
 root.DTSkillsModel=api;
})(typeof globalThis==='object'?globalThis:this);

(function(){
 'use strict';
 const root=document.getElementById('skills');if(!root)return;
 const M=globalThis.DTSkillsModel,$=id=>document.getElementById('skills-'+id);
 const variants=[
  ['Живой рельеф','DEPTH BEHIND\nTHE WORK.','Explore the depth behind every decision.','Кубики поднимаются вокруг курсора, образуя локальный рельеф. Выберите один, чтобы открыть навык.','MOVE ACROSS THE SURFACE · SELECT TO OPEN'],
  ['Развёртка','OPEN UP THE\nPOSSIBILITIES.','Open a skill. Discover what it makes possible.','Выбранный кубик поднимается и раскрывается на грани. Навык получает собственное пространство над пластом.','SELECT A CUBE · UNFOLD THE DETAILS'],
  ['Волна','ONE MOVE.\nMANY POSSIBILITIES.','A surface that responds to curiosity.','Проведите по поверхности: волна меняет высоту жёстких кубиков. Нажатие фиксирует выбранный навык.','MOVE TO MAKE A WAVE · SELECT TO EXPLORE'],
  ['Точный разрез','LOOK A LITTLE\nDEEPER.','Explore the structure beneath the surface.','Пласт раздвигается по центральному шву. Фильтр выделяет нужное направление, выбор поднимает конкретный кубик.','CHOOSE A CATEGORY · LOOK INSIDE'],
  ['Картотека','THE RIGHT TOOL,\nWITHIN REACH.','A working collection, ready to use.','Кубик выдвигается из пласта к посетителю, как модуль физической картотеки. Следующий выбор возвращает предыдущий на место.','SELECT A MODULE · PULL IT CLOSER'],
  ['Связи внутри монолита','OPEN A SKILL.\nSEE WHAT IT SOLVES.','Open a cube. Explore the task, my approach and what you get.','Открытый навык соединяется с другими навыками своего направления. Тонкие линии позволяют проследить связи.','SELECT A SKILL · FOLLOW ITS CONNECTIONS'],
  ['Сборка под задачу','BUILT FOR\nTHE CHALLENGE.','Choose a challenge. Explore the tools behind it.','Выберите задачу над пластом. До пяти подходящих навыков собираются в отдельный набор, сохраняя свои места в основании.','CHOOSE A CHALLENGE · EXPLORE THE KIT'],
  ['Два слоя','TOOLS ABOVE.\nTHINKING BENEATH.','The software is only the surface.','Под программами раскрывается направление работы: дизайн, аналитика, автоматизация. Выберите другой навык, чтобы сменить группу.','SELECT A TOOL · REVEAL THE CAPABILITY'],
  ['Типографический пласт','EVERY PIECE\nHAS A PURPOSE.','A collection of capabilities, open to explore.','Крупные названия образуют поверхность пласта. При выборе одного кубика соседние модули расходятся и освобождают место.','READ THE SURFACE · OPEN A CAPABILITY'],
  ['Объект под увеличением','EXPLORE\nTHE DETAILS.','From the whole picture to the smallest part.','Камера приближается к выбранному участку. Мини-карта и список позволяют переместиться к другому навыку; кнопка возвращает общий вид.','SELECT ON THE MAP · EXPLORE UP CLOSE']
 ];
 const capability={strategy:'Direction & priorities',design:'Structure & experience',performance:'Acquisition & relevance',analytics:'Measurement & insight',automation:'Context & continuity',leadership:'People & delivery'};
 const items=M.initial;
 let state=M.createState(items);const figma=items.findIndex(x=>x.name.toLowerCase()==='figma');if(figma>=0)state=M.reduce(state,{type:'select',value:figma});
 let unit=45,manualReduced=false;const media=window.matchMedia('(prefers-reduced-motion: reduce)');
 const field=$('field'),stage=$('stage'),cubeNodes=[],slotItems=new Map(),miniNodes=[],listNodes=[];
 function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
 function button(text,fn){const b=el('button','',text);b.type='button';b.addEventListener('click',fn);return b;}
 function dispatch(action,focus=false){state=M.reduce(state,action);render(action.type==='hover');if(focus&&state.selected>=0){const cube=cubeNodes[M.slotFor(state.selected)];if(cube)cube.focus({preventScroll:true});}}
 function build(){
  cubeNodes.forEach(n=>n.remove());cubeNodes.length=0;slotItems.clear();$('sockets').replaceChildren();$('minimap').replaceChildren();$('list').replaceChildren();miniNodes.length=0;listNodes.length=0;
  state.items.forEach((_,i)=>slotItems.set(M.slotFor(i),i));
  for(let slot=0;slot<100;slot++){
   const i=slotItems.has(slot)?slotItems.get(slot):-1,item=state.items[i];
   const socket=el('div','skills-socket');socket.style.transform='translate('+(slot%10*100)+'%,'+(Math.floor(slot/10)*100)+'%)';// Exact positions are set on resize below.
   socket.dataset.slot=String(slot);if(item)socket.append(el('span','',capability[item.category]));$('sockets').append(socket);
   const cube=button('',()=>{if(i>=0)dispatch({type:'select',value:i});});cube.className='skills-cube'+(i<0?' is-empty':'');cube.dataset.slot=String(slot);cube.dataset.index=String(i);
   if(!item)cube.setAttribute('aria-hidden','true');cube.setAttribute('aria-label',item?item.name+' — '+M.categories[item.category]:'Surface module');cube.setAttribute('aria-controls','skills-detail-name');
   if(item){const inside=el('span','sk-inner',item.name);inside.setAttribute('aria-hidden','true');cube.append(inside);}
   ['front','back','left','right'].forEach((side,j)=>{const face=el('span','sk-side sk-'+side);face.setAttribute('aria-hidden','true');if(item)face.append(el('span','skills-flap-label',[M.categories[item.category],'EXPLORE','TOOL','CAPABILITY'][j]));cube.append(face);});
   const cap=el('span','sk-cap');cap.setAttribute('aria-hidden','true');cap.append(el('span','sk-label',item?item.name:'+'));cube.append(cap);
   cube.addEventListener('pointerenter',()=>{if(i>=0&&!manualReduced&&!media.matches&&(state.variant===0||state.variant===2))dispatch({type:'hover',value:i});});
   cube.addEventListener('keydown',e=>{
    const keys={ArrowRight:1,ArrowLeft:-1,ArrowDown:10,ArrowUp:-10};if(Object.hasOwn(keys,e.key)){e.preventDefault();dispatch({type:'step',value:keys[e.key]},true);}
    if(e.key==='Home'||e.key==='End'){e.preventDefault();const ids=M.matches(state);dispatch({type:'select',value:e.key==='Home'?ids[0]:ids[ids.length-1]},true);}
   });field.append(cube);cubeNodes.push(cube);
   if(state.variant===9){const mini=button('',()=>dispatch({type:'select',value:i}));mini.setAttribute('aria-label',item?item.name:'Surface module');mini.disabled=i<0;$('minimap').append(mini);miniNodes.push(mini);}
  }
  state.items.forEach((item,i)=>{const b=button(item.name,()=>dispatch({type:'select',value:i}));$('list').append(b);listNodes.push(b);});
  resize();
 }
 Object.entries({all:'All',...M.categories}).forEach(([key,name])=>{const b=button(name,()=>dispatch({type:'category',value:key}));b.dataset.category=key;$('filters').append(b);});
 function fitHeading(){const h=$('heading');h.style.fontSize='';if(h.clientWidth&&h.scrollWidth>h.clientWidth)h.style.fontSize=(parseFloat(getComputedStyle(h).fontSize)*h.clientWidth/h.scrollWidth)+'px';}
 function resize(){unit=Math.max(19,Math.min(53,stage.clientWidth/13.6));field.style.setProperty('--unit',unit+'px');field.style.setProperty('--depth',Math.max(12,unit*.52)+'px');$('sockets').querySelectorAll('.skills-socket').forEach(n=>{const slot=Number(n.dataset.slot);n.style.transform='translate('+(slot%10*unit)+'px,'+(Math.floor(slot/10)*unit)+'px)';});render(true);fitHeading();}
 function render(geometryOnly=false){
  const openFaces=M.connectionFaces(state);
  const visible=M.matches(state),visibleSet=new Set(visible),related=M.related(state),relatedSet=new Set(related),activeSlot=state.selected<0?44:M.slotFor(state.selected);
  root.dataset.variant=String(state.variant);
  cubeNodes.forEach((cube,slot)=>{
   const i=slotItems.has(slot)?slotItems.get(slot):-1,shown=i<0?state.category==='all'&&!state.query:visibleSet.has(i),selected=i>=0&&i===state.selected;
   cube.classList.toggle('is-selected',selected);cube.classList.toggle('is-dim',!shown);cube.classList.toggle('is-related',i>=0&&relatedSet.has(i));
   for(const side of ['left','right','front','back'])cube.classList.toggle('opens-'+side,selected&&openFaces.includes(side));
   cube.tabIndex=selected?0:-1;cube.disabled=!shown||i<0;cube.setAttribute('aria-pressed',String(selected));
   const p=M.layout(state,slot);cube.style.transform='translate3d('+(p.x*unit)+'px,'+(p.y*unit)+'px,'+(p.z*unit)+'px)';
  });
  const zoomed=state.variant===9&&!state.overview&&state.selected>=0;
  field.style.setProperty('--zoom',zoomed?'1.85':'1');field.style.setProperty('--panx',zoomed?((4.5-activeSlot%10)*unit)+'px':'0px');field.style.setProperty('--pany',zoomed?((4.5-Math.floor(activeSlot/10))*unit)+'px':'0px');
  $('connections').replaceChildren();if(state.variant===5&&state.selected>=0){const x=(activeSlot%10+.5)*100,y=(Math.floor(activeSlot/10)+.5)*100;related.filter(i=>i!==state.selected).forEach(i=>{const slot=M.slotFor(i),tx=(slot%10+.5)*100,ty=(Math.floor(slot/10)+.5)*100,p=document.createElementNS('http://www.w3.org/2000/svg','path');const dx=tx-x,dy=ty-y,sx=x+(dx?Math.sign(dx)*80:0),sy=y+(!dx?Math.sign(dy)*80:0);p.setAttribute('d','M'+sx+' '+sy+' H'+tx+' V'+ty);$('connections').append(p);});}
  if(geometryOnly)return;
  const v=variants[state.variant],item=state.items[state.selected];$('heading').textContent=v[1];$('heading').style.whiteSpace='pre-line';fitHeading();$('subtitle').textContent=v[2];$('variant-description').textContent=v[3];$('hint').textContent=v[4];
  $('filters').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===state.category)));
  $('detail-category').textContent=item?M.categories[item.category]+' / '+String(M.slotFor(state.selected)+1).padStart(3,'0'):'NO RESULTS';$('detail-name').textContent=item?item.name:'Nothing here yet.';$('detail-text').textContent=item?'Behind the tool: a practical solution.':'Choose another category.';
  const solution=item?M.solutionFor(item):null;
  for(const key of ['challenge','approach','deliverable'])$('solution-'+key).textContent=solution?solution[key]:'';
  const story=$('solution');if(story.dataset.skill!==(item?.name||'')){story.dataset.skill=item?.name||'';story.getAnimations().forEach(a=>a.cancel());if(!media.matches&&!manualReduced)story.animate([{opacity:0,transform:'perspective(900px) rotateY(-12deg) translateX(12px)'},{opacity:1,transform:'none'}],{duration:480,easing:'cubic-bezier(.2,.7,.2,1)'});}
  $('underlying').textContent=item&&related.length>1?'Works with '+related.filter(i=>i!==state.selected).slice(0,3).map(i=>state.items[i].name).join(' · '):'';$('detail-index').textContent=item?(visible.indexOf(state.selected)+1)+' / '+visible.length:'0 / 0';$('tool-prev').disabled=!visible.length;$('tool-next').disabled=!visible.length;
  $('count').textContent=state.items.length+' CAPABILITIES';
  $('empty').hidden=!!visible.length;$('task-controls').hidden=state.variant!==6;$('task-controls').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.task===state.task)));
  $('zoom-controls').hidden=state.variant!==9;$('breadcrumb').textContent='ALL SKILLS / '+(item?M.categories[item.category].toUpperCase()+' / '+item.name.toUpperCase():'NO RESULTS');$('overview').textContent=state.overview?'Приблизить выбранный ↙':'Весь пласт ↗︎';
  miniNodes.forEach((b,slot)=>{const i=slotItems.has(slot)?slotItems.get(slot):-1;b.disabled=i<0||!visibleSet.has(i);b.setAttribute('aria-pressed',String(i>=0&&i===state.selected));});listNodes.forEach((b,i)=>{b.hidden=!visibleSet.has(i);b.setAttribute('aria-pressed',String(i===state.selected));});
 }
 function motion(){const reduced=manualReduced||media.matches;root.classList.toggle('no-motion',reduced);$('motion').setAttribute('aria-pressed',String(reduced));$('motion').textContent=media.matches?'System motion preference':manualReduced?'Enable motion':'Reduce motion';$('motion').disabled=media.matches;}
 $('tool-prev').addEventListener('click',()=>dispatch({type:'step',value:-1}));$('tool-next').addEventListener('click',()=>dispatch({type:'step',value:1}));$('search').addEventListener('input',e=>dispatch({type:'query',value:e.target.value}));$('task-controls').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>dispatch({type:'task',value:b.dataset.task})));
 $('overview').addEventListener('click',()=>dispatch({type:'overview'}));$('motion').addEventListener('click',()=>{manualReduced=!manualReduced;motion();dispatch({type:'hover',value:-1});});media.addEventListener('change',motion);stage.addEventListener('pointerleave',()=>{if(state.hover>=0)dispatch({type:'hover',value:-1});});
 $('list-toggle').addEventListener('click',()=>{const open=$('list').hidden;$('list').hidden=!open;$('list-toggle').setAttribute('aria-expanded',String(open));$('list-toggle').textContent=open?'Close skill list ↑︎':'Browse all skills ↓︎';});
 stage.addEventListener('pointerdown',()=>root.classList.add('skills-interacted'),{once:true,passive:true});
 stage.addEventListener('keydown',()=>root.classList.add('skills-interacted'),{once:true});
 function measureHold(){
  if(document.getElementById('mainPage').hidden)return;
  const panel=root.querySelector('.skills-showcase'),expanded=!$('list').hidden;
  root.style.minHeight=expanded?'':(panel.offsetHeight+Math.round(window.DTViewport.height()*.45))+'px';
  panel.style.top=expanded?'':Math.min(0,window.DTViewport.height()-panel.offsetHeight)+'px';
 }
 let initialized=false;
 function initialize(){
  if(initialized)return;initialized=true;
  build();render();motion();new ResizeObserver(resize).observe(stage);if(document.fonts)document.fonts.ready.then(fitHeading);
  measureHold();root.dataset.ready='true';
 }
 // Reserve its scroll travel immediately so lazy construction cannot move later anchors.
 new ResizeObserver(measureHold).observe(root.querySelector('.skills-showcase'));
 new MutationObserver(measureHold).observe($('list'),{attributes:true,attributeFilter:['hidden']});
 new MutationObserver(measureHold).observe(document.getElementById('mainPage'),{attributes:true,attributeFilter:['hidden']});
 window.addEventListener('resize',measureHold,{passive:true});measureHold();
 // Build the spatial collection before it enters view, without blocking the Hero.
 if(location.hash==='#skills'||!('IntersectionObserver' in window))initialize();
 else {const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){initialize();observer.disconnect();}},{rootMargin:'150% 0px'});observer.observe(root);}

})();
