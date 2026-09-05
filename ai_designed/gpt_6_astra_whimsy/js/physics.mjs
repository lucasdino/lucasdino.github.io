// Pure, fixed-step physics. Canvas coordinates stay 500 × 650 at every screen size.
export const walls = [
 [25,515,25,170],[25,170,42,100],[42,100,87,48],[87,48,157,22],
 [157,22,343,22],[343,22,413,48],[413,48,458,100],[458,100,475,170],[475,170,475,515],
 [25,515,94,578],[475,515,406,578],
 [67,473,92,520],[92,520,153,550],[153,550,67,473],
 [433,473,408,520],[408,520,347,550],[347,550,433,473]
];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export class Pinball {
 constructor(bumpers,onHit=()=>{},onDrain=()=>{}){this.bumpers=bumpers;this.onHit=onHit;this.onDrain=onDrain;this.ball={x:450,y:566,vx:0,vy:0,r:9};this.running=false;this.time=0;this.launchTime=0;this.left=false;this.right=false;this.angles=[.38,Math.PI-.38];this.cooldowns=new Map();this.flips=0;this.hits=0;}
 launch(){Object.assign(this.ball,{x:450,y:546,vx:-145-Math.random()*130,vy:-1020});this.running=true;this.launchTime=this.time;}
 nudge(){if(this.running){this.ball.vx+=(Math.random()>.5?1:-1)*160;this.ball.vy=Math.min(this.ball.vy,-400);}}
 flippers(){return this.angles.map((angle,i)=>({x:i?340:160,y:574,ex:(i?340:160)+Math.cos(angle)*79,ey:574+Math.sin(angle)*79,angle,active:i?this.right:this.left}));}
 collideSegment(x1,y1,x2,y2,radius=5,flipper=null,angularVelocity=0){
  const b=this.ball,dx=x2-x1,dy=y2-y1;
  const t=clamp(((b.x-x1)*dx+(b.y-y1)*dy)/(dx*dx+dy*dy),0,1);
  const px=x1+t*dx,py=y1+t*dy,nx0=b.x-px,ny0=b.y-py,d=Math.hypot(nx0,ny0),limit=b.r+radius;
  if(d>=limit)return;
  const nx=d>1e-5?nx0/d:0,ny=d>1e-5?ny0/d:-1;
  b.x=px+nx*(limit+.1);b.y=py+ny*(limit+.1);
  const surfaceVx=flipper?-angularVelocity*(py-y1):0,surfaceVy=flipper?angularVelocity*(px-x1):0;
  const dot=(b.vx-surfaceVx)*nx+(b.vy-surfaceVy)*ny;
  if(dot<0){b.vx-=1.78*dot*nx;b.vy-=1.78*dot*ny;
   if(flipper?.active && ny<.25){b.vy=Math.min(b.vy,-630-190*t);b.vx+=(x1<250?1:-1)*100;this.flips++;}
  }
 }
 step(dt){
  this.time+=dt;
  const velocities=this.angles.map((angle,i)=>{const target=i?(this.right?Math.PI+.48:Math.PI-.38):(this.left?-.48:.38);const next=angle+clamp(target-angle,-dt*15,dt*15);this.angles[i]=next;return(next-angle)/dt;});
  if(!this.running)return;
  const b=this.ball;b.vy+=620*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;
  for(const w of walls)this.collideSegment(...w,4);
  this.flippers().forEach((f,i)=>this.collideSegment(f.x,f.y,f.ex,f.ey,10,f,velocities[i]));
  for(const p of this.bumpers){const dx=b.x-p.x,dy=b.y-p.y,d=Math.hypot(dx,dy),radius=p.r+b.r;
   if(d<radius){const nx=d?dx/d:1,ny=d?dy/d:0;b.x=p.x+nx*(radius+.2);b.y=p.y+ny*(radius+.2);const dot=b.vx*nx+b.vy*ny;if(dot<0){b.vx-=2*dot*nx;b.vy-=2*dot*ny;}b.vx+=nx*120;b.vy+=ny*120;
    if(this.time-(this.cooldowns.get(p.id)??-100)>.23){this.cooldowns.set(p.id,this.time);this.hits++;this.onHit(p);}
   }
  }
  const speed=Math.hypot(b.vx,b.vy);if(speed>1250){b.vx*=1250/speed;b.vy*=1250/speed;}
  // A generous early ball save keeps a unlucky first bounce from ending a round.
  if(b.y>674){if(this.time-this.launchTime<4){const original=this.launchTime;this.launch();this.launchTime=original;}else{this.running=false;Object.assign(b,{x:450,y:566,vx:0,vy:0});this.onDrain();}}
  if(b.x<-30||b.x>530||b.y<-40){Object.assign(b,{x:250,y:175,vx:100,vy:80});}
 }
}
