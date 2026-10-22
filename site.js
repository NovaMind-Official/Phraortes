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
 prob:"type: dice\ndice: 2\nlang: en",
 optics:"type: lens\nf: 10\nd: 25\nlang: en",
 logic:"expr: (A AND B) OR NOT C\nout: Q\nlang: en",
 cards:"title: Core formulas\ncard: Ohm's law | $V = IR$\ncard: Avogadro's number | $6.022\\times10^{23}\\ \\text{mol}^{-1}$\ncard: Kinetic energy | $E_k=\\tfrac12 mv^2$\nlang: en"
};
var KIND={prob:"probability",optics:"optics",logic:"logic",playground:"playground",stats:"stats",hero:"circuit",solution:"solution",graph:"graph",molecule:"molecule",periodic:"periodic",rc:"sim",rc2:"sim",proj:"sim",balance:"balance",quiz:"quiz",cards:"flash"};
function mountInto(box){
  var key=box.getAttribute("data-w"); if(!window.PHRW||!CFG[key]||box.getAttribute("data-m")) return;
  box.setAttribute("data-m","1");
  box.innerHTML=PHRW.html(KIND[key],CFG[key],false);
  var el=box.firstElementChild; if(el) PHRW.mount(el);
  if(key==="prob") setTimeout(function(){var b=box.querySelector('[data-a="n1000"]'); if(b){b.click();b.click()}},350);
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

/* ───────── Support panel ───────── */
(function(){
"use strict";
var MAIL="Phraortes.app@gmail.com";
var IC={
 start:'<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 16l.7 1.8L21.5 18.5l-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z"/>',
 pay:'<rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M3 10.5h18M7 15h3"/>',
 tools:'<rect x="4" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.8"/>',
 lock:'<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 018 0v3"/>',
 fix:'<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.4v.4"/>',
 idea:'<path d="M9.5 18h5M10.5 21h3M12 3a6 6 0 00-3.6 10.8c.7.5 1.1 1.2 1.1 2.2h5c0-1 .4-1.7 1.1-2.2A6 6 0 0012 3z"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/>',
 srch:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
 chev:'<path d="M9 5l7 7-7 7"/>',
 back:'<path d="M15 5l-7 7 7 7"/>',
 x:'<path d="M6 6l12 12M18 6L6 18"/>',
 copy:'<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6.5A2.5 2.5 0 0013.5 4h-7A2.5 2.5 0 004 6.5v7A2.5 2.5 0 006.5 16H8"/>'
};
function svg(n,sw){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+(sw||1.7)+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IC[n]+'</svg>'}
var CATS=[
 {id:"start",t:"Getting started",ic:"start",c:"var(--sand)",topic:"Question",qs:[
  {q:"What is Phraortes?",a:"Phraortes is an AI study assistant for maths, physics and chemistry. It explains a problem step by step, then builds the graph, molecule, circuit or simulation <b>inside the answer</b>, so you can change it and see what happens.",pop:1},
  {q:"Is it really free?",a:"Yes. The free plan gives you every study tool with a limited number of messages per period. The app shows when your messages reset. Paid plans remove the limit and unlock stronger AI cores.",pop:1},
  {q:"Do I need to install anything?",a:"No. It runs in your browser. To open it like an app on iPhone or iPad: tap <b>Share</b>, then <b>Add to Home Screen</b>."},
  {q:"Which languages does it understand?",a:"English and Persian. Ask in either one and the solutions, formulas and tools follow your language."},
  {q:"Which subjects does it cover?",a:"Maths, physics and chemistry are the focus: step-by-step solutions, graphs, simulations, molecules, the periodic table and circuits. You can ask about other topics too."}
 ]},
 {id:"plans",t:"Plans & payment",ic:"pay",c:"var(--sky)",topic:"Billing",qs:[
  {q:"How do I pay?",a:"Payment is in <b>USDT on the BEP-20 network</b>. Pick a plan in the app, send the payment to the address shown there, and paste the transaction hash. It confirms automatically. There is no card option yet.",pop:1},
  {q:"I paid, but my plan did not activate",k:"payment confirm confirmed pending verify stuck transaction hash usdt crypto not working activated",a:"First, check these:<ol><li>The payment was sent on <b>BEP-20</b> (BNB Smart Chain), not another network.</li><li>The amount is at least the plan price, and it went to the address shown in the app.</li><li>Wait a few minutes for the network to confirm, then press verify again.</li></ol>Still stuck? Email us the <b>transaction hash</b> and the plan you chose, and we will look into it.",pop:1,need:"Billing"},
  {q:"Which plan should I choose?",a:"Start free. Move up when you need more depth: <b>Satrap</b> removes the message cap, <b>Immortal</b> adds deeper reasoning, code and larger uploads, and <b>Shahanshah</b> adds the most powerful core and voice chat. See <a href=\"pricing.html\">Pricing</a> for the full table."},
  {q:"Are prices monthly? Can they change?",a:"Prices on this site are per month. Plans and limits may change over time, so the app always shows the current details."},
  {q:"Can I get my payment back?",a:"Payments on the blockchain cannot be reversed automatically. If something went wrong, such as a wrong plan or a double payment, email us with the transaction hash and we will look at it.",need:"Billing"}
 ]},
 {id:"tools",t:"Tools & features",ic:"tools",c:"var(--lilac)",topic:"Question",qs:[
  {q:"How do I open the tools?",a:"Tap the <b>grid icon with the golden sparkle</b> next to the message box. A panel opens with Canvas, Templates, Workspace, Focus Timer, Memory and My Assistants.",pop:1},
  {q:"How do I get a graph, molecule or circuit?",a:"Just ask for it: “Plot y = x²”, “Show me caffeine in 3D”, “Build an RC circuit”. The tool appears inside the answer. You can drag, pinch and edit it. See <a href=\"tools.html\">all tools</a>."},
  {q:"Can I send a photo of a problem?",a:"Yes. Tap the <b>+</b> next to the message box and add a photo. Phraortes reads it and works through the problem."},
  {q:"Where does the code I run go?",a:"Code runs in a sandbox inside the answer, with no network access. Nothing you run can reach your files."},
  {q:"Can I swipe to open my chats?",a:"Yes. Swipe from the left edge to the right, or tap the menu button at the top left."}
 ]},
 {id:"privacy",t:"Privacy & accuracy",ic:"lock",c:"var(--mint)",topic:"Question",qs:[
  {q:"Where are my chats stored?",a:"Your conversations are stored in <b>your own browser</b> on your device. To remove them, delete them from the chat list in the app, or clear this site’s data in your browser settings.",pop:1},
  {q:"Who sees what I type?",a:"To write an answer, your message is sent to the AI service that powers Phraortes. Do not type passwords, card numbers or other secrets into any AI chat."},
  {q:"Can I trust the answers?",a:"Phraortes can make mistakes. Check important results, especially numbers, against a textbook or your teacher. If you find a wrong answer, tell us."},
  {q:"I found a mistake in an answer",a:"Thank you. Email us the question you asked and what was wrong, and we will improve it.",need:"Report a mistake"}
 ]},
 {id:"fix",t:"Something is wrong",ic:"fix",c:"var(--cream2)",topic:"Problem",qs:[
  {q:"The answer is slow or stops halfway",k:"loading stuck hang freeze error timeout cut off",a:"Free models can get busy. Tap to try again, or switch to another AI core from the model menu. If it keeps happening, email us what you asked and which core you used.",pop:1,need:"Problem"},
  {q:"It says “Free plan limit reached”",k:"quota messages left blocked cannot send reset",a:"The free plan has a limited number of messages per period. The app shows when it resets. To remove the limit, choose a paid plan in the app."},
  {q:"A menu or button does not open",k:"tools broken click tap bug sidebar not working",a:"Close the app completely, then open it again so it can load the latest version. On iPhone or iPad: swipe the app away from the app switcher and reopen it. Still the same? Email us your device and what you tapped.",need:"Problem"},
  {q:"The app looks old after an update",a:"Close it fully and reopen it. If it still looks old, clear this site’s data in Safari settings and open it again. Your plan stays, but chats stored in this browser are removed."},
  {q:"The microphone or voice does not work",a:"Allow microphone access for this site in your browser settings, then reload the app. Voice chat with Aura is part of the Shahanshah plan."}
 ]},
 {id:"ideas",t:"Ideas & teams",ic:"idea",c:"var(--sand)",topic:"Idea",qs:[
  {q:"I have an idea for a feature",a:"We would love to hear it. Tell us what you wish Phraortes did, and what you were trying to learn when you wished for it.",need:"Idea"},
  {q:"Phraortes for schools and teams",a:"Want Phraortes under your own brand or inside your course platform? Email us a few lines about your school or team and what you need.",need:"Schools & teams"},
  {q:"Press, partnerships and everything else",a:"Write to <b>"+MAIL+"</b>. We read every message.",need:"Other"}
 ]}
];
var ALL=[];CATS.forEach(function(c){c.qs.forEach(function(q,i){q.cat=c;q.id=c.id+i;ALL.push(q)})});

function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
var root=document.documentElement,body=document.body;
var fab=el("button","sp-fab",svg("start",1.8)+"<span>Help</span>");fab.type="button";fab.setAttribute("aria-label","Open help and support");fab.setAttribute("aria-haspopup","dialog");
var back=el("div","sp-back");
var sp=el("div","sp-panel");sp.setAttribute("role","dialog");sp.setAttribute("aria-modal","true");sp.setAttribute("aria-labelledby","sp-title");
sp.innerHTML=
 '<div class="sp-grip" id="sp-grip"><i></i></div>'+
 '<div class="sp-top" id="sp-hd"><button class="sp-x" type="button" aria-label="Close">'+svg("x",2)+'</button>'+
 '<button class="sp-bk" type="button">'+svg("back",2)+'<span>Help</span></button>'+
 '<h2 id="sp-title">How can we help?</h2><p>Find a quick answer, or write to us.</p></div>'+
 '<div class="sp-srch">'+svg("srch",1.8)+'<input type="search" id="sp-q" placeholder="Search for an answer" aria-label="Search help" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"></div>'+
 '<div class="sp-body" id="sp-body"><div class="sp-view" id="v-home"></div><div class="sp-view" id="v-cat" hidden></div><div class="sp-view" id="v-find" hidden></div><div class="sp-view" id="v-mail" hidden></div></div>';
body.appendChild(back);body.appendChild(sp);body.appendChild(fab);

var $=function(s){return sp.querySelector(s)};
var vHome=$("#v-home"),vCat=$("#v-cat"),vFind=$("#v-find"),vMail=$("#v-mail"),title=$("#sp-title"),sub=$(".sp-top p"),bk=$(".sp-bk"),bkT=$(".sp-bk span"),inp=$("#sp-q"),bodyEl=$("#sp-body");
var view="home",lastView="home",lastCat=null,topic="Question",prefill="";

function show(v){view=v;[["home",vHome],["cat",vCat],["find",vFind],["mail",vMail]].forEach(function(p){p[1].hidden=p[0]!==v});sp.classList.toggle("sp-sub",v!=="home");bodyEl.scrollTop=0}
function qHTML(q,withTag){
 return '<li data-id="'+q.id+'"><button type="button" aria-expanded="false"><span>'+(withTag?'<em class="sp-tag" style="font-style:normal;display:block">'+q.cat.t+'</em>':'')+q.q+'</span>'+svg("chev",2)+'</button>'+
 '<div class="sp-a"><div><div class="sp-t">'+q.a+'</div><div class="sp-fb"><span>Did this help?</span><button type="button" data-fb="y">Yes</button><button type="button" data-fb="n">No</button></div></div></div></li>';
}
function home(){
 var pops=ALL.filter(function(q){return q.pop});
 vHome.innerHTML='<p class="sp-h">Browse by topic</p><div class="sp-cats">'+CATS.map(function(c){return '<button type="button" class="sp-cat" style="--c:'+c.c+'" data-cat="'+c.id+'">'+svg(c.ic,1.6)+'<span><b>'+c.t+'</b><small>'+c.qs.length+' answers</small></span></button>'}).join("")+'</div>'+
 '<p class="sp-h">Most asked</p><ul class="sp-pop">'+pops.map(function(q){return '<li><button type="button" data-q="'+q.id+'"><span>'+q.q+'</span>'+svg("chev",2)+'</button></li>'}).join("")+'</ul>'+
 '<div class="sp-mail"><b>Can’t find your answer?</b><p>Write to us. A real person reads every message.</p><button type="button" class="sp-btn" data-mail="Question">'+svg("mail",1.8)+'Email us</button></div>';
}
function openCat(id,openQ){
 var c=CATS.filter(function(x){return x.id===id})[0];if(!c)return;lastCat=c;
 title.textContent=c.t;bkT.textContent="Help";
 vCat.innerHTML='<ul class="sp-qs">'+c.qs.map(function(q){return qHTML(q)}).join("")+'</ul>';
 show("cat");
 if(openQ){var li=vCat.querySelector('[data-id="'+openQ+'"]');if(li)toggle(li,true)}
}
function toggle(li,force){
 var on=force!=null?force:!li.classList.contains("on");
 var list=li.parentNode;[].forEach.call(list.children,function(o){if(o!==li){o.classList.remove("on");o.firstChild.setAttribute("aria-expanded","false")}});
 li.classList.toggle("on",on);li.firstChild.setAttribute("aria-expanded",on?"true":"false");
 if(on)setTimeout(function(){var r=li.getBoundingClientRect(),b=bodyEl.getBoundingClientRect();if(r.top<b.top+4)bodyEl.scrollTop+=r.top-b.top-8},60);
}
function find(term){
 var STOP=" the and not for how can did does you are what why with this that its has have was but from too get use i my me it is to of in on a an do ";
 var t=term.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(function(w){return w.length>1&&STOP.indexOf(" "+w+" ")<0});
 if(!t.length){show("home");title.textContent="How can we help?";return}
 var res=ALL.map(function(q){var h=(q.q+" "+(q.k||"")+" "+q.a.replace(/<[^>]+>/g," ")+" "+q.cat.t).toLowerCase(),s=0;t.forEach(function(w){if(q.q.toLowerCase().indexOf(w)>-1)s+=3;else if(h.indexOf(w)>-1)s+=1});return {q:q,s:s}}).filter(function(r){return r.s>0}).sort(function(a,b){return b.s-a.s});
 if(res.length&&res[0].s>=3)res=res.filter(function(r){return r.s>=2});
 res=res.slice(0,6);
 title.textContent="Results";bkT.textContent="Help";
 if(!res.length)vFind.innerHTML='<div class="sp-none">No answer found for “'+term.replace(/</g,"&lt;")+'”.<br>Write to us and we will help.<div style="margin-top:16px"><button type="button" class="sp-btn dk" data-mail="Question">'+svg("mail",1.8)+'Email us</button></div></div>';
 else vFind.innerHTML='<p class="sp-res">'+res.length+' result'+(res.length>1?"s":"")+'</p><ul class="sp-qs">'+res.map(function(r){return qHTML(r.q,true)}).join("")+'</ul>';
 show("find");
}
function mail(tp,about){
 topic=tp||"Question";prefill=about?("About: “"+about+"”\n\n"):"";
 title.textContent="Email us";bkT.textContent="Back";
 var topics=["Question","Billing","Problem","Idea","Schools & teams","Report a mistake","Other"];
 if(topics.indexOf(topic)<0)topics.push(topic);
 vMail.innerHTML='<p class="sp-h" style="margin-top:4px">What is it about?</p><div class="sp-chips" role="radiogroup">'+topics.map(function(t){return '<button type="button" role="radio" aria-checked="'+(t===topic)+'" class="sp-chip'+(t===topic?" on":"")+'" data-topic="'+t+'">'+t+'</button>'}).join("")+'</div>'+
 '<p class="sp-h">Your message</p><textarea class="sp-ta" id="sp-msg" placeholder="Tell us what happened, or what you need. The more detail, the faster we can help." aria-label="Your message"></textarea>'+
 '<div class="sp-row"><button type="button" class="sp-btn dk" id="sp-send">'+svg("mail",1.8)+'Open email app</button><button type="button" class="sp-btn ghost" id="sp-copy">'+svg("copy",1.8)+'Copy address</button></div>'+
 '<p class="sp-note">This opens your email app with the message ready. Press <b>send</b> there. No email app? Copy the address and write to <b>'+MAIL+'</b>.</p>';
 show("mail");
 var ta=$("#sp-msg");ta.value=prefill;
}
function mailto(){
 var m=$("#sp-msg").value.trim();
 var info="\n\n— — —\nPage: "+location.href.split("#")[0]+"\nDevice: "+(navigator.userAgent||"").replace(/\s+/g," ").slice(0,140)+"\nScreen: "+screen.width+"×"+screen.height;
 var u="mailto:"+MAIL+"?subject="+encodeURIComponent("Phraortes · "+topic)+"&body="+encodeURIComponent((m||"")+info);
 location.href=u;
}
function copyAddr(btn){
 var done=function(){var o=btn.innerHTML;btn.innerHTML=svg("copy",1.8)+"Copied ✓";setTimeout(function(){btn.innerHTML=o},1800)};
 if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(MAIL).then(done,fb)}else fb();
 function fb(){var t=document.createElement("textarea");t.value=MAIL;t.style.cssText="position:fixed;opacity:0";body.appendChild(t);t.select();try{document.execCommand("copy");done()}catch(e){}t.remove()}
}
var prevFocus=null;
function openP(v){
 prevFocus=document.activeElement;
 if(!vHome.innerHTML)home();
 root.classList.add("sp-open","sp-lock");
 if(v==="mail"){mail("Question")}
 else if(v&&v.indexOf("cat:")===0)openCat(v.slice(4));
 else{show("home");title.textContent="How can we help?"}
 setTimeout(function(){var x=$(".sp-x");if(x)x.focus({preventScroll:true})},80);
}
function closeP(){root.classList.remove("sp-open","sp-lock");inp.blur();setTimeout(function(){if(prevFocus&&prevFocus.focus)try{prevFocus.focus({preventScroll:true})}catch(e){}},50)}
function goBack(){
 if(view==="cat"||view==="find"){inp.value="";show("home");title.textContent="How can we help?"}
 else if(view==="mail"){if(lastCat&&lastView==="cat"){openCat(lastCat.id)}else{show("home");title.textContent="How can we help?"}}
}
fab.addEventListener("click",function(){openP()});
back.addEventListener("click",closeP);
$(".sp-x").addEventListener("click",closeP);
bk.addEventListener("click",goBack);
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&root.classList.contains("sp-open"))closeP()});
inp.addEventListener("input",function(){var v=inp.value.trim();if(!v){if(view==="find"){show("home");title.textContent="How can we help?"}}else find(v)});
sp.addEventListener("click",function(e){
 var t=e.target.closest("button,a");if(!t)return;
 if(t.dataset.cat){lastView="cat";openCat(t.dataset.cat);return}
 if(t.dataset.q){var q=ALL.filter(function(x){return x.id===t.dataset.q})[0];lastView="cat";openCat(q.cat.id,q.id);return}
 if(t.dataset.mail){lastView=view;var li=t.closest("li");mail(t.dataset.mail);return}
 if(t.dataset.topic){topic=t.dataset.topic;[].forEach.call(vMail.querySelectorAll(".sp-chip"),function(c){var on=c===t;c.classList.toggle("on",on);c.setAttribute("aria-checked",on)});return}
 if(t.id==="sp-send"){mailto();return}
 if(t.id==="sp-copy"){copyAddr(t);return}
 if(t.dataset.fb){
  var li2=t.closest("li"),qq=ALL.filter(function(x){return x.id===li2.dataset.id})[0],row=t.parentNode;
  if(t.dataset.fb==="y"){row.innerHTML='<span>Glad it helped ✓</span>';}
  else{row.innerHTML='<span>Sorry about that.</span><div class="sp-still">Tell us what is still unclear and we will help you directly.<button type="button" data-ask="'+qq.id+'">Write to us</button></div>'}
  return}
 if(t.dataset.ask){var q3=ALL.filter(function(x){return x.id===t.dataset.ask})[0];lastView=view==="find"?"home":"cat";lastCat=q3.cat;mail(q3.need||q3.cat.topic,q3.q);return}
 var b=t.closest(".sp-qs>li>button");if(b){toggle(b.parentNode);return}
 if(t.tagName==="A"&&t.getAttribute("href")&&t.getAttribute("href").charAt(0)!=="#"){closeP()}
});
/* drag the sheet down to close (phones) */
(function(){
 var sy=0,dy=0,on=false;
 function st(e){if(window.innerWidth>=820)return;if(!e.target.closest("#sp-grip,#sp-hd"))return;if(e.target.closest("button"))return;sy=e.touches[0].clientY;dy=0;on=true;sp.classList.add("drag")}
 function mv(e){if(!on)return;dy=Math.max(0,e.touches[0].clientY-sy);sp.style.transform="translateY("+dy+"px)"}
 function en(){if(!on)return;on=false;sp.classList.remove("drag");sp.style.transform="";if(dy>110)closeP()}
 sp.addEventListener("touchstart",st,{passive:true});sp.addEventListener("touchmove",mv,{passive:true});sp.addEventListener("touchend",en,{passive:true});sp.addEventListener("touchcancel",en,{passive:true});
})();
/* entry points: footer, menu, "Get in touch", #support */
function hook(){
 var f=document.querySelector("footer .wrap");
 if(f&&!f.querySelector("[data-support]")){var a=el("a",null,"Support");a.href="#support";a.setAttribute("data-support","");var as=f.querySelectorAll("a"),la=as[as.length-1];if(la&&la.nextSibling)f.insertBefore(a,la.nextSibling);else f.appendChild(a)}
 var m=document.getElementById("menu");
 if(m&&!m.querySelector("[data-support]")){var l=el("a",null,"<small>→</small>Support");l.href="#support";l.setAttribute("data-support","");var gs=m.querySelectorAll(".grp");if(gs[1])m.insertBefore(l,gs[1]);else m.appendChild(l)}
 var c=document.getElementById("contact");
 if(c){c.href="#support-mail";c.removeAttribute("target");c.setAttribute("data-support","mail");if(c.parentNode&&c.parentNode.parentNode)c.parentNode.parentNode.classList.add("has")}
}
document.addEventListener("click",function(e){
 var a=e.target.closest("[data-support],a[href='#support'],a[href='#support-mail']");if(!a||sp.contains(a))return;
 e.preventDefault();var mm=document.getElementById("menu"),bg=document.getElementById("burger");
 if(mm&&mm.classList.contains("open")&&bg)bg.click();
 var k=a.getAttribute("data-support");if(k==="mail"||a.getAttribute("href")==="#support-mail")openP("mail");else openP();
});
function hash(){if(location.hash==="#support")openP();else if(location.hash==="#support-mail")openP("mail")}
hook();hash();window.addEventListener("hashchange",hash);
})();

/* ───────── story2 · cinematic chapters ───────── */
(function(){
"use strict";
var cin=document.getElementById("cin");if(!cin)return;
if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return;
cin.classList.add("on");
function $(s){return cin.querySelector(s)}
function $$(s,r){return [].slice.call((r||cin).querySelectorAll(s))}
function clamp(v,a,b){return v<a?a:v>b?b:v}
function sm(t){t=clamp(t,0,1);return t*t*(3-2*t)}
var secs=["c0","c1","c2","c3","c4"].map(function(i){return document.getElementById(i)});
function prog(s){var r=s.getBoundingClientRect(),vh=window.innerHeight;return clamp(-r.top/Math.max(1,r.height-vh),0,1)}
/* c0 */
var c0copy=$(".cn-c0 .cn-copy"),p0=$(".cn-p0"),g0=$(".cn-c0 .cn-glow"),r0=$(".cn-c0 .cn-rings"),cue=$(".cn-cue");
function paint0(){
 var p=prog(secs[0]),vh=window.innerHeight,e=sm(p/0.8);
 var ny=(1-e)*vh*0.5,s=.6+.4*e;
 p0.style.transform="translate3d(0,"+ny.toFixed(1)+"px,0) scale("+s.toFixed(3)+")";
 p0.style.opacity=(1-sm((p-0.9)/0.1)).toFixed(3);
 var co=1-sm(p/0.42);
 c0copy.style.opacity=co.toFixed(3);c0copy.style.transform="translate3d(0,"+(-p*9*vh/100).toFixed(1)+"px,0) scale("+(1-p*.06).toFixed(3)+")";
 c0copy.style.pointerEvents=co<.3?"none":"";
 g0.style.transform="scale("+(.78+p*.9).toFixed(3)+")";g0.style.opacity=(.85-sm((p-.75)/.25)*.6).toFixed(3);
 r0.style.transform="rotate("+(p*120).toFixed(1)+"deg) scale("+(.9+p*.35).toFixed(3)+")";
 cue.style.opacity=clamp(1-p*8,0,1).toFixed(2);
}
/* c1 */
var words=$$(".cn-stm span"),WN=words.length;
function paint1(){
 var p=prog(secs[1]),t=clamp((p-.06)/.78,0,1)*(WN+6);
 for(var i=0;i<WN;i++){words[i].style.opacity=(.2+.8*clamp((t-i)/6,0,1)).toFixed(3)}
}
/* c2 */
var wul=$("#cnWords ul"),wli=$$("#cnWords li"),caps=$$("#cnCaps .cn-cap"),imgs=$$(".cn-p2 .cn-scr img"),dts=$$("#cnDots i"),p2=$(".cn-p2"),n2=wli.length,cache={lh:0};
function paint2(){
 var p=prog(secs[2]),q=clamp((p-.03)/.94,0,1)*(n2-1),lh=wli[0].offsetHeight;
 wul.style.transform="translate3d(0,"+((1-q)*lh).toFixed(1)+"px,0)";
 for(var i=0;i<n2;i++){
  var d=Math.abs(i-q);
  wli[i].style.opacity=(1-clamp(d*.62,0,.84)).toFixed(3);
  wli[i].style.transform="scale("+(1-.14*clamp(d,0,2)).toFixed(3)+")";
  var ci=clamp(1.15-d*1.9,0,1);
  imgs[i].style.opacity=ci.toFixed(3);
  caps[i].style.opacity=clamp(1.2-d*2.2,0,1).toFixed(3);
  caps[i].style.transform="translate3d(0,"+((i-q)*22).toFixed(1)+"px,0)";
  caps[i].style.pointerEvents=d<.4?"auto":"none";
 }
 var act=Math.round(q);dts.forEach(function(el,k){el.classList.toggle("on",k===act)});
 var fr=q-act,ang=fr*-26;
 p2.style.transform="perspective(1400px) rotateY("+ang.toFixed(2)+"deg) translate3d(0,"+(Math.abs(fr)*-8).toFixed(1)+"px,0) scale("+(1-Math.abs(fr)*.04).toFixed(3)+")";
}
/* c3 */
var pl=$(".cn-pl"),pr=$(".cn-pr"),pc=$(".cn-pc"),cp3=$(".cn-copy3"),g3=$(".cn-c3 .cn-glow");
function paint3(){
 var p=prog(secs[3]),vw=window.innerWidth,vh=window.innerHeight,wide=vw>=900,e=sm((p-.08)/.55);
 var dx=(wide?vw*.27:vw*.36)*e,rot=(wide?9:7)*e,sc=.86+.0*e;
 pl.style.transform="translate3d("+(-dx).toFixed(1)+"px,"+((1-e)*20+e*(wide?10:14)).toFixed(1)+"px,0) rotate("+(-rot).toFixed(2)+"deg) scale("+(.9+.04*e).toFixed(3)+")";
 pr.style.transform="translate3d("+dx.toFixed(1)+"px,"+((1-e)*20+e*(wide?10:14)).toFixed(1)+"px,0) rotate("+rot.toFixed(2)+"deg) scale("+(.9+.04*e).toFixed(3)+")";
 var rise=sm(p/.3),exit=sm((p-.82)/.18);
 pc.style.transform="translate3d(0,"+((1-rise)*vh*.5 - exit*vh*.2).toFixed(1)+"px,0) scale("+(1.02+.1*e).toFixed(3)+")";
 pl.style.opacity=pr.style.opacity=(clamp(e*2,0,1)*(1-exit)).toFixed(3);
 pc.style.opacity=(1-exit*.9).toFixed(3);
 cp3.style.opacity=(clamp(1-sm((p-.7)/.2),0,1)*clamp(p*8,0,1)).toFixed(3);
 cp3.style.transform="translate3d(0,"+(-p*6*vh/100).toFixed(1)+"px,0)";
 g3.style.transform="scale("+(.8+p*.6).toFixed(3)+")";
}
/* c4 */
var cores=$$(".cn-core"),orbs=$$(".cn-orb"),cp4=$(".cn-copy4"),end=$(".cn-end"),g4=$(".cn-c4 .cn-glow");
function paint4(){
 var p=prog(secs[4]),vh=window.innerHeight;
 cp4.style.opacity=clamp(p*10,0,1).toFixed(3);
 cp4.style.transform="translate3d(0,"+((1-sm(p*6))*30).toFixed(1)+"px,0)";
 cores.forEach(function(el,i){
  var t=sm((p-.1-i*.12)/.28);
  el.style.opacity=t.toFixed(3);
  el.style.transform="translate3d(0,"+((1-t)*70).toFixed(1)+"px,0)";
  orbs[i].style.transform="scale("+(.35+.65*t+(.25*i/3)*sm((p-.5)/.3)).toFixed(3)+")";
 });
 var ee=sm((p-.72)/.2);end.style.opacity=ee.toFixed(3);end.style.transform="translate3d(0,"+((1-ee)*30).toFixed(1)+"px,0)";end.style.pointerEvents=ee<.4?"none":"auto";
 g4.style.transform="translate3d(0,"+(-p*18).toFixed(1)+"vh,0)";
}
function frame(){
 paint0();paint1();paint2();paint3();paint4();
 var vh=window.innerHeight,inside=false;
 secs.forEach(function(s){var r=s.getBoundingClientRect();if(r.top<=0&&r.bottom>vh*0.55)inside=true});
 document.body.classList.toggle("instory",inside);
}
var tk=false;
function req(){if(!tk){tk=true;requestAnimationFrame(function(){tk=false;frame()})}}
window.addEventListener("scroll",req,{passive:true});window.addEventListener("resize",req);
frame();
/* "See how it works" smooth to the statement chapter */
})();
