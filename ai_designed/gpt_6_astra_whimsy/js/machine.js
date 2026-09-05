import { stories, postcards } from './content.js';
import { Pinball, walls } from './physics.mjs';
const $ = id => document.getElementById(id);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const colors={ink:'#1b2a55',blue:'#233fc7',paper:'#f0eddf',orange:'#f46535',yellow:'#eada65'};
const canvas=$('pinball'), ctx=canvas.getContext('2d');
const dialog=$('story-dialog');
let score=0,seen=new Set(),particles=[],flash=new Map(),lastTicketTime=-10,selectedId='',postcardIndex=0;
let soundEnabled=false,audioContext=null,paused=false,inView=true,raf=0,lastTime=0,accumulator=0,nudgeAt=0;
let pointerLeft=new Set(),pointerRight=new Set(),keyLeft=false,keyRight=false;
const game=new Pinball(stories,hit,()=>{ $('launch-label').textContent='ANOTHER UNEXPECTED TURN?';$('table-launch').textContent='LAUNCH ↑';$('ball-message').textContent='NO WRONG TURNS. GO AGAIN.';announce('Ball returned. Launch again to keep exploring.');tone(160,.2); });

function announce(text){$('announcement').textContent=text;}
function tone(freq,duration=.08){
 if(!soundEnabled)return;
 try{audioContext??=new (window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});const oscillator=audioContext.createOscillator(),gain=audioContext.createGain();oscillator.type='sine';oscillator.frequency.setValueAtTime(freq,audioContext.currentTime);oscillator.frequency.exponentialRampToValueAtTime(freq*.65,audioContext.currentTime+duration);gain.gain.setValueAtTime(.07,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);oscillator.connect(gain);gain.connect(audioContext.destination);oscillator.start();oscillator.stop(audioContext.currentTime+duration);}catch{soundEnabled=false;updateSound();}
}
function updateSound(){ $('sound').textContent=soundEnabled?'SOUND ON':'SOUND OFF';$('sound').setAttribute('aria-pressed',String(soundEnabled));$('sound').setAttribute('aria-label',soundEnabled?'Disable arcade sounds':'Enable arcade sounds'); }
function hit(story){
 const first=!seen.has(story.id);seen.add(story.id);score+=first?250:50;
 if(first&&seen.size===6){score+=1000;announce('All six stories hit! One thousand bonus curiosity points.');$('ticket-foot').textContent='SIX CONNECTIONS. ONE VERY NONLINEAR LIFE.';}
 $('score').textContent=String(score).padStart(6,'0');$('collected').textContent=`${seen.size} / 6`;
 document.querySelector(`[data-id="${story.id}"]`).classList.add('is-hit');
 flash.set(story.id,game.time);tone(260+stories.indexOf(story)*100);
 if(!reducedMotion.matches)for(let i=0;i<10;i++){const a=i*Math.PI/5;particles.push({x:story.x+Math.cos(a)*story.r,y:story.y+Math.sin(a)*story.r,vx:Math.cos(a)*90,vy:Math.sin(a)*90,life:.55,color:story.color});}
 if(game.time-lastTicketTime>1.8){setTicket(story);lastTicketTime=game.time;}
 $('ball-message').textContent=seen.size===6?'ALL SIX. THE PLOT HAS OFFICIALLY THICKENED.':`${story.label.replace('<br>',' ')} · +${first?250:50} CURIOSITY`;
}
function setTicket(story){
 selectedId=story.id;$('ticket-label').textContent=story.tag;$('ticket-number').textContent=`№ ${story.n}`;$('ticket-title').textContent=story.title;$('ticket-copy').textContent=story.copy;
 const link=$('ticket-link');link.href=story.link;link.textContent=story.linkLabel+' ↗';link.target=story.link.startsWith('#')?'_self':'_blank';
 $('ticket-foot').textContent=seen.size===6?'SIX CONNECTIONS. ONE VERY NONLINEAR LIFE.':'A SMALL PIECE OF A WORK IN PROGRESS.';
 document.querySelectorAll('.bumper').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.id===story.id)));
 $('ticket').classList.remove('new-ticket');requestAnimationFrame(()=>$('ticket').classList.add('new-ticket'));
}
const externalAttrs=url=>url.startsWith('#')?'':' target="_blank" rel="noopener noreferrer"';
const linkList=links=>links.map(([label,url])=>`<a href="${url}"${externalAttrs(url)}>${label}<span aria-hidden="true">↗</span></a>`).join('');
for(const story of stories){
 const button=document.createElement('button');button.className='bumper';button.dataset.id=story.id;button.style.cssText=`left:${story.x/5}%;top:${story.y/6.5}%;width:${story.r*2/5}%;`;button.setAttribute('aria-label',`Read story ${story.n}: ${story.title}`);button.setAttribute('aria-pressed','false');button.innerHTML=`<span class="bumper-number">${story.n}</span><span>${story.label}</span>`;button.addEventListener('click',()=>{setTicket(story);openStory(story);});$('bumper-buttons').append(button);
 const details=document.createElement('details');details.className='chapter';details.id=`chapter-${story.id}`;
 details.innerHTML=`<summary><span class="chapter-number">${story.n} /</span><span class="chapter-title">${story.title}</span><span class="chapter-summary">${story.summary}</span><span class="chapter-plus" aria-hidden="true">+</span></summary><div class="chapter-body"><div><p>${story.body}</p>${story.note?`<p class="chapter-note">${story.note}</p>`:''}${story.image?`<img class="project-preview" src="${story.image}" alt="${story.alt}" loading="lazy">`:''}</div><div class="chapter-links">${linkList(story.links)}</div></div>`;
 $('chapter-list').append(details);
}
function showDialog(html){
 $('dialog-content').innerHTML=html;dialog.showModal();document.body.classList.add('modal-open');resetFlippers();syncLoop();
}
function openStory(story){showDialog(`<p class="eyebrow">DETOUR ${story.n} / ${story.tag}</p><h2 id="dialog-title">${story.title}</h2>${story.image?`<img src="${story.image}" alt="${story.alt}">`:''}<p>${story.body}</p>${story.note?`<p class="chapter-note">${story.note}</p>`:''}<div class="chapter-links">${linkList(story.links)}</div>`);}
function closeDialog(){dialog.close();}
const closeButton=document.querySelector('.dialog-close');closeButton.addEventListener('click',closeDialog);
let backdropStart=false;dialog.addEventListener('pointerdown',e=>{backdropStart=e.target===dialog;});dialog.addEventListener('click',e=>{if(e.target===dialog&&backdropStart){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
 dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');syncLoop();});
 dialog.addEventListener('click',e=>{const link=e.target.closest('a[href^="#"]');if(link){closeDialog();}});
$('surprise').addEventListener('click',()=>{const choices=stories.filter(s=>s.id!==selectedId);const story=choices[Math.floor(Math.random()*choices.length)];setTicket(story);tone(480);announce(`${story.title} ${story.copy}`);});
function updatePostcard(){const p=postcards[postcardIndex];$('postcard-image').src='/assets/pics/sabbatical/'+p.file;$('postcard-image').alt=p.alt;$('postcard-caption').textContent=p.title;$('postcard-preview').textContent=p.preview;$('postcard-count').textContent=`${String(postcardIndex+1).padStart(2,'0')} / 06`;$('postcard-open').setAttribute('aria-label',`Read travel story: ${p.title}`);}
$('postcard-prev').addEventListener('click',()=>{postcardIndex=(postcardIndex+5)%6;updatePostcard();});$('postcard-next').addEventListener('click',()=>{postcardIndex=(postcardIndex+1)%6;updatePostcard();});
$('postcard-open').addEventListener('click',()=>{const p=postcards[postcardIndex];showDialog(`<p class="eyebrow">POSTCARD ${String(postcardIndex+1).padStart(2,'0')} / 06</p><h2 id="dialog-title">${p.title}</h2><img src="/assets/pics/sabbatical/${p.file}" alt="${p.alt}"><p>${p.text}</p>`);});

function drawPath(points,color,width=1){ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(const p of points.slice(1))ctx.lineTo(...p);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
function circle(x,y,r,fill,stroke,width=1){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}
const bg=document.createElement('canvas');bg.width=1000;bg.height=1300;const bgctx=bg.getContext('2d');
function drawTable(){
 ctx.clearRect(0,0,500,650);ctx.fillStyle=colors.paper;ctx.fillRect(0,0,500,650);
 // Perforations, target rings and lanes are part of the pinball playfield.
 ctx.fillStyle='#1b2a551c';for(let x=17;x<500;x+=11)for(let y=17;y<650;y+=11){ctx.fillRect(x,y,1,1);}
 ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
 const rail=walls.slice(0,9);for(const w of rail){drawPath([[w[0],w[1]],[w[2],w[3]]],colors.blue,8);drawPath([[w[0],w[1]],[w[2],w[3]]],'#a1b1d8',1.5);}
 for(let k=0;k<3;k++){ctx.beginPath();ctx.ellipse(250,154,183-k*8,131-k*8,0,Math.PI*1.03,Math.PI*1.97);ctx.strokeStyle=k===1?colors.orange:colors.blue;ctx.lineWidth=2;ctx.stroke();}
 ctx.setLineDash([3,7]);drawPath([[126,231],[345,242],[238,332],[116,425],[367,411],[244,470]],'#233fc757',1.5);ctx.setLineDash([]);
 for(const s of stories){circle(s.x+2,s.y+5,s.r+7,'#1b2a5526');circle(s.x,s.y,s.r+8,colors.paper,colors.ink,1.5);circle(s.x,s.y,s.r+4,null,colors.ink,1);circle(s.x,s.y,s.r,s.color,colors.ink,2);circle(s.x,s.y,s.r-5,null,s.color===colors.blue?'#ffffff70':'#1b2a5538',1);}
 // Direction markings cue the playable route to the flippers.
 for(const [x,dir] of [[53,1],[447,-1]]){for(let y=330;y<450;y+=25)drawPath([[x-6*dir,y-5],[x,y],[x-6*dir,y+5]],colors.orange,2);}
 const slings=[[[67,473],[92,520],[153,550]],[[433,473],[408,520],[347,550]]];
 for(const p of slings){ctx.beginPath();ctx.moveTo(...p[0]);p.slice(1).forEach(q=>ctx.lineTo(...q));ctx.closePath();ctx.fillStyle=colors.orange;ctx.fill();ctx.strokeStyle=colors.ink;ctx.lineWidth=3;ctx.stroke();drawPath([[p[0][0],p[0][1]],[p[2][0],p[2][1]]],colors.paper,3);}
 for(const w of walls.slice(9,11))drawPath([[w[0],w[1]],[w[2],w[3]]],colors.blue,7);
 circle(250,197,5,colors.orange);circle(237,197,2,colors.blue);circle(263,197,2,colors.blue);
 ctx.font='10px "IBM Plex Mono", monospace';ctx.textAlign='center';ctx.fillStyle=colors.blue;ctx.save();ctx.translate(451,574);ctx.rotate(-Math.PI/2);ctx.fillText('↑ LAUNCH',0,0);ctx.restore();
 ctx.restore();
 bgctx.clearRect(0,0,1000,1300);bgctx.drawImage(canvas,0,0,1000,1300);
}
function render(){
 ctx.clearRect(0,0,500,650);ctx.drawImage(bg,0,0,500,650);
 for(const s of stories){const elapsed=game.time-(flash.get(s.id)??-10);if(elapsed<.4&&!reducedMotion.matches){circle(s.x,s.y,s.r+8+elapsed*45,null,`rgba(244,101,53,${1-elapsed/.4})`,3);}}
 for(const f of game.flippers()){drawPath([[f.x+1,f.y+4],[f.ex+1,f.ey+4]],colors.ink,24);drawPath([[f.x,f.y],[f.ex,f.ey]],colors.ink,23);drawPath([[f.x,f.y],[f.ex,f.ey]],f.active?colors.yellow:colors.paper,17);circle(f.x,f.y,5,colors.blue);}
 for(const p of particles){ctx.globalAlpha=Math.max(0,p.life/.55);circle(p.x,p.y,3,p.color,colors.ink,1);}ctx.globalAlpha=1;
 const b=game.ball;circle(b.x+3,b.y+5,b.r,'#1b2a553a');const shine=ctx.createRadialGradient(b.x-3,b.y-4,0,b.x,b.y,b.r);shine.addColorStop(0,'#fff');shine.addColorStop(.3,'#f1f6f9');shine.addColorStop(.65,'#9ba6b8');shine.addColorStop(1,'#344363');circle(b.x,b.y,b.r,shine,colors.ink,1.2);circle(b.x-3,b.y-3,2,'#fff');
}
function resize(){const dpr=Math.min(devicePixelRatio||1,2);canvas.width=500*dpr;canvas.height=650*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);drawTable();render();}
function canPlay(){return !paused&&!dialog.open&&inView&&!document.hidden;}
function needsFrame(){return game.running||game.left||game.right||particles.length||Math.abs(game.angles[0]-.38)>.001||Math.abs(game.angles[1]-(Math.PI-.38))>.001;}
function frame(now){raf=0;if(!canPlay())return;const dt=Math.min((now-lastTime)/1000,.035);lastTime=now;accumulator+=dt;while(accumulator>=1/240){game.step(1/240);accumulator-=1/240;}particles=particles.filter(p=>{p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;return p.life>0;});render();if(needsFrame())raf=requestAnimationFrame(frame);}
function syncLoop(){if(!canPlay()){if(raf)cancelAnimationFrame(raf);raf=0;lastTime=0;accumulator=0;return;}if(!raf&&needsFrame()){lastTime=performance.now();raf=requestAnimationFrame(frame);}else if(!raf)render();}
function updateFlippers(){game.left=keyLeft||pointerLeft.size>0;game.right=keyRight||pointerRight.size>0;$('left-flipper').classList.toggle('held',game.left);$('right-flipper').classList.toggle('held',game.right);syncLoop();}
function resetFlippers(){keyLeft=keyRight=false;pointerLeft.clear();pointerRight.clear();updateFlippers();}
function launch(){if(dialog.open)return;if(paused){paused=false;updatePause();}if(game.running){if(performance.now()-nudgeAt<700)return;nudgeAt=performance.now();game.nudge();tone(190);}else{game.launch();tone(400,.18);$('launch-label').textContent='GIVE IT A LITTLE NUDGE';$('table-launch').textContent='NUDGE ↑';$('ball-message').textContent='FOLLOW THE BOUNCE. HIT THE FLIPPERS.';announce('Ball launched. Use left and right arrows, or the flipper buttons.');}
 if(matchMedia('(max-width:760px)').matches&&($('machine').getBoundingClientRect().top>40||!inView))$('machine').scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'start'});syncLoop();}
$('launch').addEventListener('click',launch);$('table-launch').addEventListener('click',launch);
for(const [id,set] of [['left-flipper',pointerLeft],['right-flipper',pointerRight]]){const el=$(id);el.addEventListener('pointerdown',e=>{if(e.button!==0)return;el.setPointerCapture(e.pointerId);set.add(e.pointerId);updateFlippers();tone(110,.05);});const release=e=>{set.delete(e.pointerId);updateFlippers();};el.addEventListener('pointerup',release);el.addEventListener('pointercancel',release);el.addEventListener('lostpointercapture',release);}
const arrowKeys=['ArrowLeft','ArrowRight','KeyA','KeyD'];
function formFocused(target){return target?.matches('input,textarea,select,[contenteditable="true"]');}
window.addEventListener('keydown',e=>{if(dialog.open||formFocused(e.target)||!inView)return;if(arrowKeys.includes(e.code)){e.preventDefault();if(e.code==='ArrowLeft'||e.code==='KeyA')keyLeft=true;else keyRight=true;updateFlippers();}if(e.code==='Space'&&!e.repeat&&!e.target.closest('button,a,summary')){e.preventDefault();launch();}});
window.addEventListener('keyup',e=>{if(arrowKeys.includes(e.code)){if(e.code==='ArrowLeft'||e.code==='KeyA')keyLeft=false;else keyRight=false;updateFlippers();}});
// Native keyboard activation for focused flipper buttons.
for(const [id,side] of [['left-flipper','left'],['right-flipper','right']]){const b=$(id);b.addEventListener('keydown',e=>{if(e.code==='Space'||e.code==='Enter'){e.preventDefault();if(side==='left')keyLeft=true;else keyRight=true;updateFlippers();}});b.addEventListener('keyup',e=>{if(e.code==='Space'||e.code==='Enter'){e.preventDefault();if(side==='left')keyLeft=false;else keyRight=false;updateFlippers();}});b.addEventListener('blur',resetFlippers);}
window.addEventListener('blur',()=>{resetFlippers();if(game.running){paused=true;updatePause();}});
function updatePause(){$('pause').textContent=paused?'RESUME':'PAUSE';$('pause').setAttribute('aria-pressed',String(paused));if(paused)$('ball-message').textContent='PAUSED. THE DETOUR CAN WAIT.';else if(game.running)$('ball-message').textContent='FOLLOW THE BOUNCE. HIT THE FLIPPERS.';document.querySelector('.ticker>div').style.animationPlayState=paused?'paused':'running';syncLoop();}
$('pause').addEventListener('click',()=>{paused=!paused;resetFlippers();updatePause();});$('sound').addEventListener('click',()=>{soundEnabled=!soundEnabled;updateSound();tone(550,.13);});
document.addEventListener('visibilitychange',()=>{resetFlippers();syncLoop();});
new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(!inView)resetFlippers();syncLoop();},{threshold:.12}).observe($('machine'));
window.addEventListener('resize',resize);document.fonts.ready.then(resize);$('year').textContent=new Date().getFullYear();resize();
function openHash(){const el=document.getElementById(location.hash.slice(1));if(el?.matches('details')){el.open=true;requestAnimationFrame(()=>el.scrollIntoView({block:'start'}));}}window.addEventListener('hashchange',openHash);openHash();
// Upgrade the shared switcher locally, without changing the shared script.
function enhanceSwitcher(){const button=document.querySelector('.version-btn'),menu=document.querySelector('.version-dropdown');if(!button||!menu)return;menu.id='version-menu';button.setAttribute('aria-controls',menu.id);button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Choose website version');new MutationObserver(()=>button.setAttribute('aria-expanded',String(menu.classList.contains('open')))).observe(menu,{attributes:true,attributeFilter:['class']});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open')){menu.classList.remove('open');button.focus();}});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhanceSwitcher);else enhanceSwitcher();
