/* Phraortes Learn — a knowledge map that fills in as you scroll */
(function(){
'use strict';
var NS='http://www.w3.org/2000/svg',svg=document.getElementById('lm-svg');if(!svg)return;
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
var steps=[].slice.call(document.querySelectorAll('.lm-step'));
/* nodes: x,y in a 400x600 box; label side */
var N=[{x:200,y:48,l:'Start',s:'You are here',a:'m'},{x:104,y:158,l:'Atoms',s:'Chemistry',a:'r'},{x:296,y:268,l:'Reactions',s:'Chemistry',a:'l'},
 {x:104,y:378,l:'Motion',s:'Physics',a:'r'},{x:296,y:488,l:'Circuits',s:'Physics',a:'l'},{x:200,y:572,l:'Your question',s:'Ask anything',a:'m'}];
var GH=[{from:2,x:366,y:196,l:'Moles'},{from:3,x:36,y:300,l:'Energy'},{from:4,x:368,y:560,l:'AC'}];
function el(n,a,p){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);p&&p.appendChild(e);return e}
function seg(a,b){var m=(a.y+b.y)/2;return 'M'+a.x+' '+a.y+' C'+a.x+' '+m+' '+b.x+' '+m+' '+b.x+' '+b.y}
var gE=el('g',{},svg),gG=el('g',{},svg),gN=el('g',{},svg),E0=[],E1=[],L=[],nodes=[];
GH.forEach(function(g){var a=N[g.from];el('path',{d:'M'+a.x+' '+a.y+' L'+g.x+' '+g.y,class:'m-gh'},gG);var o=el('g',{class:'m-g'},gG);el('circle',{cx:g.x,cy:g.y,r:9},o);var t=el('text',{x:g.x,y:g.y+26,'text-anchor':'middle'},o);t.textContent=g.l});
for(var i=0;i<N.length-1;i++){var d=seg(N[i],N[i+1]);E0.push(el('path',{d:d,class:'m-e0'},gE));var p=el('path',{d:d,class:'m-e1'},gE);var len=p.getTotalLength();p.style.strokeDasharray=len;p.style.strokeDashoffset=len;E1.push(p);L.push(len)}
N.forEach(function(n,k){var g=el('g',{class:'m-n',tabindex:0,role:'link','aria-label':n.l},gN);el('circle',{class:'pu',cx:n.x,cy:n.y,r:k===5?18:13},g);el('circle',{class:'d',cx:n.x,cy:n.y,r:k===5?18:13},g);
 var dx=n.a==='r'?28:n.a==='l'?-28:0,anc=n.a==='r'?'start':n.a==='l'?'end':'middle',ty=n.a==='m'?(k===0?-26:38):5;
 var t=el('text',{x:n.x+dx,y:n.y+ty-(n.a==='m'?0:6),'text-anchor':anc},g);t.textContent=n.l;
 var s=el('text',{x:n.x+dx,y:n.y+ty+(n.a==='m'?15:10),'text-anchor':anc,class:'s'},g);s.textContent=n.s;
 g.addEventListener('click',function(){go(k)});g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go(k)}});nodes.push(g)});
var tr=el('circle',{r:6,class:'m-t',cx:N[0].x,cy:N[0].y},svg);
function go(k){var s=steps[k];if(s)s.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'})}
document.documentElement.classList.add('lm-js');
function vb(y){if(innerWidth<=860){var h=250,t=Math.max(-10,Math.min(610-h,y-h*.48));svg.setAttribute('viewBox','0 '+t.toFixed(1)+' 400 '+h)}else svg.setAttribute('viewBox','0 0 400 600')}
function draw(t){ /* t in [0,5] */
 t=Math.max(0,Math.min(N.length-1,t));var si=Math.min(N.length-2,Math.floor(t)),f=t-si;
 E1.forEach(function(p,k){var q=k<si?1:k===si?f:0;p.style.strokeDashoffset=L[k]*(1-q)});
 var pt=E1[si].getPointAtLength(L[si]*f);tr.setAttribute('cx',pt.x);tr.setAttribute('cy',pt.y);vb(pt.y);
 var cur=Math.round(t);nodes.forEach(function(n,k){n.classList.toggle('done',k<=t+.02);n.classList.toggle('cur',k===cur)});
 steps.forEach(function(s,k){s.classList.toggle('on',k===cur)})}
addEventListener('resize',function(){vb(+tr.getAttribute('cy'))});
if(reduce){nodes.forEach(function(n){n.classList.add('done')});E1.forEach(function(p){p.style.strokeDashoffset=0});tr.style.display='none';steps.forEach(function(s){s.classList.add('on')});return}
var tk=false,cur=0;
function calc(){tk=false;var vh=innerHeight,mp=document.querySelector('.lm-map').getBoundingClientRect(),mob=innerWidth<=860;
 var line=mob?Math.max(mp.bottom+vh*.12,vh*.5):vh*.5;
 var c=steps.map(function(s){var r=s.getBoundingClientRect();return r.top+r.height/2});
 var t;if(line<=c[0])t=0;else if(line>=c[c.length-1])t=c.length-1;else{for(var i=0;i<c.length-1;i++)if(line<c[i+1]){t=i+(line-c[i])/(c[i+1]-c[i]);break}}
 cur+=(t-cur)*.6;if(Math.abs(t-cur)<.003)cur=t;draw(cur);if(cur!==t)req()}
function req(){if(!tk){tk=true;requestAnimationFrame(calc)}}
addEventListener('scroll',req,{passive:true});addEventListener('resize',req);calc();
/* reveal */
var rv=[].slice.call(document.querySelectorAll('.rv'));
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -6% 0px',threshold:.05});rv.forEach(function(e){io.observe(e)})}else rv.forEach(function(e){e.classList.add('in')});
})();
