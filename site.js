(function(){
"use strict";
document.documentElement.classList.add("js");
var CONTACT = ""; // e.g. "https://t.me/yourname" — the "Get in touch" button stays hidden until this is set
var MAN="Phraortes is not a chatbot that talks about science. It shows it. Ask a question and the answer arrives with the graph, the molecule or the circuit, something you can drag, rotate and break. Learn it by touching it.";
var CFG={
 hero:"title: Live circuit\nsource: 12\ncircuit: R1=100, (R2=220 | R3=330), L1=47\nlang: en",
 solution:"title: Acceleration on a ramp\ngiven: $m=2\\,\\text{kg},\\ \\theta=30^\\circ$\nfind: $a$\nstep: Force along the slope | $ma = mg\\sin\\theta$\nstep: Cancel the mass | $a = g\\sin\\theta$\nstep: Substitute | $a = 9.8\\times\\sin 30^\\circ$\nanswer: $a = 4.9\\ \\text{m/s}^2$\nlang: en",
 graph:"title: sin(x)  &  x²/4\nf1: sin(x)\nf2: x^2/4\nx: -6..6\ny: -3..5\nlang: en",
 molecule:"molecule: water, methane, benzene\nlang: en",
 periodic:"select: Au\nlang: en",
 rc:"type: rc\nV: 9\nR: 5\nC: 200\nlang: en",
 rc2:"type: rc\nV: 5\nR: 2\nC: 470\nlang: en",
 proj:"type: projectile\nv0: 18\nangle: 55\nlang: en",
 balance:"equation: Al + O2 -> Al2O3\nlang: en",
 quiz:"title: Molar mass\nq: Which has the largest molar mass?\na: H2O\na*: CO2\na: CH4\nexplain: CO2 is 44 g/mol, H2O is 18 and CH4 is 16.\nlang: en",
 playground:"title: Bouncing ball\nlang: en\n--- html\n<canvas id=c width=320 height=200></canvas>\n--- js\nvar c=document.getElementById(\"c\"),x=c.getContext(\"2d\"),px=60,py=40,vx=2.4,vy=0;\nfunction f(){x.clearRect(0,0,320,200);vy+=0.35;px+=vx;py+=vy;if(py>180){py=180;vy*=-0.88}if(px>300||px<20)vx*=-1;x.fillStyle=\"#e2552b\";x.beginPath();x.arc(px,py,16,0,7);x.fill();requestAnimationFrame(f)}f();",
 stats:"title: Study hours vs score\nx: 1, 2, 3, 4, 5, 6, 7\ny: 52, 58, 61, 70, 74, 79, 88\nlang: en",
 cards:"title: Core formulas\ncard: Ohm's law | $V = IR$\ncard: Avogadro's number | $6.022\\times10^{23}\\ \\text{mol}^{-1}$\ncard: Kinetic energy | $E_k=\\tfrac12 mv^2$\nlang: en"
};
var KIND={playground:"playground",stats:"stats",hero:"circuit",solution:"solution",graph:"graph",molecule:"molecule",periodic:"periodic",rc:"sim",rc2:"sim",proj:"sim",balance:"balance",quiz:"quiz",cards:"flash"};
function mountInto(box){
  var key=box.getAttribute("data-w"); if(!window.PHRW||!CFG[key]||box.getAttribute("data-m")) return;
  box.setAttribute("data-m","1");
  box.innerHTML=PHRW.html(KIND[key],CFG[key],false);
  var el=box.firstElementChild; if(el) PHRW.mount(el);
}
var all=[].slice.call(document.querySelectorAll("[data-w]"));
var io="IntersectionObserver" in window?new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);mountInto(e.target)}})},{rootMargin:"500px 1400px"}):null;
function mountAll(){ all.forEach(function(b){ if(io) io.observe(b); else mountInto(b) }) }

/* reveal on scroll */
var rv=[].slice.call(document.querySelectorAll(".rv"));
if("IntersectionObserver" in window){
  var ro=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");ro.unobserve(e.target)}})},{rootMargin:"0px 0px -8% 0px",threshold:.05});
  rv.forEach(function(n){ro.observe(n)});
}else rv.forEach(function(n){n.classList.add("in")});

/* count-up */
var nums=[].slice.call(document.querySelectorAll("[data-n]"));
function count(n){
  var to=+n.getAttribute("data-n"),pre=n.getAttribute("data-pre")||"";
  if(!to){n.textContent=pre+"0";return}
  var t0=performance.now(),d=1400;
  (function step(t){var p=Math.min(1,(t-t0)/d),e=1-Math.pow(1-p,3);n.textContent=pre+Math.round(to*e);if(p<1)requestAnimationFrame(step)})(t0);
}
if("IntersectionObserver" in window){
  var no=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){no.unobserve(e.target);count(e.target)}})},{threshold:.6});
  nums.forEach(function(n){no.observe(n)});
}else nums.forEach(function(n){n.textContent=(n.getAttribute("data-pre")||"")+n.getAttribute("data-n")});

/* manifesto: words light up as you scroll */
var man0=document.getElementById("manifesto"),words=[],lit=-1;
if(man0) MAN.split(" ").forEach(function(w,i,a){var s=document.createElement("span");s.className="w";s.textContent=w;man0.appendChild(s);if(i<a.length-1)man0.appendChild(document.createTextNode(" "));words.push(s)});
var still=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function paintMan(){
  var r=man0.getBoundingClientRect(),vh=window.innerHeight||800;
  var p=still?1:Math.min(1,Math.max(0,(vh*0.85-r.top)/(r.height+vh*0.3)));
  var n=Math.round(p*words.length*1.05); if(n===lit) return; lit=n;
  words.forEach(function(w,i){w.classList.toggle("on",i<n)});
}

/* nav: tone follows the section behind it, menus */
var nav=document.getElementById("nav"),secs=[].slice.call(document.querySelectorAll("[data-theme]"));
function navState(){
  var y=40,th="light";
  for(var i=0;i<secs.length;i++){var r=secs[i].getBoundingClientRect(); if(r.top<=y&&r.bottom>y){th=secs[i].getAttribute("data-theme")}}
  nav.classList.toggle("dk",th==="dark"&&!menu.classList.contains("open"));
}
var burger=document.getElementById("burger"),menu=document.getElementById("menu");
function setMenu(o){menu.classList.toggle("open",o);burger.setAttribute("aria-expanded",o);document.body.style.overflow=o?"hidden":"";setMega(false);navState()}
burger.addEventListener("click",function(){setMenu(!menu.classList.contains("open"))});
[].forEach.call(menu.querySelectorAll("a"),function(a){a.addEventListener("click",function(){setMenu(false)})});
var mega=document.getElementById("mega"),mb=document.getElementById("megabtn"),mt=null;
function setMega(o){ if(!mega) return; mega.classList.toggle("open",o); mb.setAttribute("aria-expanded",o) }
if(mega){
  mb.addEventListener("click",function(e){e.stopPropagation();setMega(window.matchMedia("(hover:hover)").matches?true:!mega.classList.contains("open"))});
  mb.parentElement.addEventListener("mouseenter",function(){ if(window.matchMedia("(hover:hover)").matches){clearTimeout(mt);setMega(true)} });
  [mb.parentElement,mega].forEach(function(n){n.addEventListener("mouseleave",function(){ if(window.matchMedia("(hover:hover)").matches){mt=setTimeout(function(){setMega(false)},180)} })});
  mega.addEventListener("mouseenter",function(){clearTimeout(mt)});
  document.addEventListener("click",function(e){ if(!mega.contains(e.target)) setMega(false) });
  document.addEventListener("keydown",function(e){ if(e.key==="Escape"){setMega(false);setMenu(false)} });
  [].forEach.call(mega.querySelectorAll("a"),function(a){a.addEventListener("click",function(){setMega(false)})});
}


/* ═════ cinematic story: scroll drives the phone, the glow and the copy ═════ */
var story=document.getElementById("story");
var SK=null;
(function(){
  if(!story||still) return;
  var phone=document.getElementById("stPhone"),orb=story.querySelector(".orb"),rings=story.querySelector(".rings"),chips=document.getElementById("stChips"),cue=document.getElementById("stCue");
  var beats=[].slice.call(story.querySelectorAll(".beat")),dots=[].slice.call(document.querySelectorAll("#stDots i")),s2=story.querySelector(".s2"),N=beats.length;
  story.classList.add("on");
  // phone key-frames per beat: x (vw), y (vh), scale, rotate (deg), opacity
  var D=[[0,56,.82,0,1],[24,0,1,0,1],[-24,0,1,-4,1],[24,2,.92,3,1],[0,2,1.18,0,.2]];
  var M=[[0,52,.74,0,1],[0,26,.82,0,1],[0,26,.82,0,1],[0,26,.78,0,1],[0,20,.95,0,.3]];
  function sm(t){return t*t*(3-2*t)}
  function clamp(v,a,b){return Math.min(b,Math.max(a,v))}
  function paint(){
    var r=story.getBoundingClientRect(),vh=window.innerHeight||800,vw=window.innerWidth||1200;
    var span=r.height-vh,p=clamp(-r.top/Math.max(1,span),0,1),q=p*(N-1);
    var i=Math.min(N-2,Math.floor(q)),f=sm(q-i),K=vw>=900?D:M;
    var a=K[i],b=K[i+1];
    function L(k){return a[k]+(b[k]-a[k])*f}
    phone.style.transform="translate3d("+(L(0)*vw/100).toFixed(1)+"px,"+(L(1)*vh/100).toFixed(1)+"px,0) scale("+L(2).toFixed(3)+") rotate("+L(3).toFixed(2)+"deg)";
    phone.style.opacity=L(4).toFixed(3);
    // screenshot swap: welcome -> answer between beat 1 and 2
    s2.style.opacity=clamp((q-1.15)/0.7,0,1).toFixed(3);
    // glow + rings
    orb.style.transform="translate3d("+(L(0)*vw/200).toFixed(1)+"px,"+(L(1)*vh/300).toFixed(1)+"px,0) scale("+(0.8+p*1.1).toFixed(3)+")";
    rings.style.transform="rotate("+(p*140).toFixed(1)+"deg) scale("+(0.9+p*.4).toFixed(3)+")";
    chips.style.opacity=clamp(1-Math.abs(q-3)*2.2,0,1).toFixed(3);
    cue.style.opacity=clamp(1-q*4,0,1).toFixed(2);
    document.body.classList.toggle("instory",r.top<=0&&r.bottom>vh*0.6);
    var act=Math.round(q);
    beats.forEach(function(el,k){
      var d=q-k,ad=Math.abs(d),o=clamp((0.5-ad)/0.15,0,1);
      if(k===0&&q<0) o=1; if(k===N-1&&q>k) o=1;
      el.style.opacity=o.toFixed(3);
      el.style.transform="translateY(calc("+(vw>=900?"-50%":"0px")+" + "+(-d*46).toFixed(1)+"px))";
      el.classList.toggle("on",o>.5);
    });
    dots.forEach(function(el,k){el.classList.toggle("on",k===act)});
  }
  SK=paint; paint();
})();

/* hero device grows into place */
var stage=document.getElementById("stage"); var man=document.getElementById("manifesto");
function frame(){
  tick=false; if(man) paintMan(); if(SK) SK(); navState(); if(still||!stage) return;
  var r=stage.parentElement.getBoundingClientRect(),vh=window.innerHeight||800;
  var p=Math.min(1,Math.max(0,(vh-r.top)/(vh*0.95)));
  stage.style.transform="scale("+(0.86+0.14*p).toFixed(4)+")"; stage.style.borderRadius=(46-10*p).toFixed(1)+"px";
}
var tick=false;
window.addEventListener("scroll",function(){ if(!tick){tick=true;requestAnimationFrame(frame)} },{passive:true});
window.addEventListener("resize",frame);


/* back-to-top button with scroll-progress ring */
var up=document.getElementById("up"),upg=document.getElementById("upg");
function upState(){
  var y=window.pageYOffset,H=document.documentElement.scrollHeight-window.innerHeight;
  up.classList.toggle("show",y>700);
  upg.style.strokeDashoffset=(157.08*(1-Math.min(1,H>0?y/H:0))).toFixed(1);
  var th="light",py=window.innerHeight-48;
  for(var i=0;i<secs.length;i++){var r=secs[i].getBoundingClientRect(); if(r.top<=py&&r.bottom>py) th=secs[i].getAttribute("data-theme")}
  up.classList.toggle("dk",th==="dark");
}
up.addEventListener("click",function(){window.scrollTo({top:0,behavior:still?"auto":"smooth"})});
window.addEventListener("scroll",upState,{passive:true});
/* rail */
var rail=document.getElementById("rail");
if(rail){
function slide(d){ rail.scrollBy({left:d*Math.min(440,rail.clientWidth*0.8),behavior:"smooth"}) }
document.getElementById("prev").addEventListener("click",function(){slide(-1)});
document.getElementById("next").addEventListener("click",function(){slide(1)});
}
var cEl=document.getElementById("contact");if(CONTACT&&cEl){cEl.href=CONTACT;cEl.target="_blank";cEl.rel="noopener";cEl.parentNode.parentNode.classList.add("has")}

function boot(){ upState(); mountAll(); frame(); }
if(window.PHRW) boot(); else window.addEventListener("load",boot);
})();
