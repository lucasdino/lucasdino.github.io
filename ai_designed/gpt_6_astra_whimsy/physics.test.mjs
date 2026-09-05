import assert from 'node:assert/strict';
import { Pinball } from './js/physics.mjs';
import { stories } from './js/content.js';
// Verify an approaching ball reflects off a bumper and scores exactly once.
let hits=0;const p=stories[0];const g=new Pinball(stories,()=>hits++);g.running=true;Object.assign(g.ball,{x:p.x-p.r-8,y:p.y,vx:300,vy:0});g.step(1/240);assert.equal(hits,1);assert.ok(g.ball.vx<0);
// A held flipper must transfer energy upward, including when held rather than tapped.
const f=new Pinball([]);f.left=true;for(let i=0;i<60;i++)f.step(1/240);f.running=true;const flip=f.flippers()[0];Object.assign(f.ball,{x:(flip.x+flip.ex)/2,y:(flip.y+flip.ey)/2-15,vx:0,vy:120});for(let i=0;i<4;i++)f.step(1/240);assert.ok(f.ball.vy< -500,'Flipper should launch the ball upward');
// An early drain saves the ball; a later drain returns it to the launcher.
let drained=0;const d=new Pinball([],()=>{},()=>drained++);d.launch();d.ball.y=680;d.step(1/240);assert.equal(drained,0);assert.ok(d.running);d.time=10;d.ball.y=680;d.step(1/240);assert.equal(drained,1);assert.equal(d.running,false);
// Simulate 100 seeded rounds to catch non-finite state, unreachable scoring, and stuck balls.
const oldRandom=Math.random;let seed=123456;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};let totalHits=0,scoringRounds=0,drains=0;const hitIds=new Set();
for(let round=0;round<100;round++){let roundHits=0;const test=new Pinball(stories,s=>{totalHits++;roundHits++;hitIds.add(s.id);},()=>drains++);test.launch();for(let i=0;i<14400&&test.running;i++){test.left=Math.sin(i*.045)>0;test.right=Math.cos(i*.037)>0;test.step(1/240);assert.ok([test.ball.x,test.ball.y,test.ball.vx,test.ball.vy].every(Number.isFinite));}if(roundHits)scoringRounds++;}
Math.random=oldRandom;assert.ok(scoringRounds>=90,`${scoringRounds}/100 rounds score`);assert.equal(hitIds.size,6,'Every bumper is reachable');
console.log(JSON.stringify({passed:true,rounds:100,scoringRounds,totalHits,drains,reachableBumpers:hitIds.size}));
