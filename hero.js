/* HERO v5 — knowledge-field background + live AI demo */
(function(){
"use strict";
var root=document.getElementById("c0");if(!root)return;
var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
function $(s,r){return (r||root).querySelector(s)}
var phone=$(".cn-p0"),chat=$("#hxChat"),inp=$("#hxIn"),chips=[].slice.call(root.querySelectorAll(".hx-chips button")),form=$("#hxAsk");
var visible=true;
if("IntersectionObserver" in window)new IntersectionObserver(function(e){visible=e[0].isIntersecting},{threshold:0}).observe(root);
function sleep(ms){return new Promise(function(r){setTimeout(r,ms)})}
/* ───────── background: drifting glyph constellation ───────── */
(function(){
  var cv=$(".hx-cv");if(!cv||reduce)return;var cx=cv.getContext("2d"),W=0,H=0,dpr=Math.min(2,window.devicePixelRatio||1);
  var G=["∫","π","Σ","√","Δ","∞","∂","λ","θ","ħ","∇","μ","e","H₂O","E=mc²","sin x","ΔG","F=ma","pV=nRT","C₆H₆","a²+b²","lim","dx","x²","log","NaCl","Ω","β"];
  var N=window.innerWidth<700?22:42,P=[],mx=-999,my=-999;
  function rs(){var r=cv.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0)}
  function mk(i,init){return{g:G[(Math.random()*G.length)|0],x:Math.random()*W,y:init?Math.random()*H:H+30,z:.35+Math.random()*.9,s:13+Math.random()*22,v:.12+Math.random()*.28,a:.07+Math.random()*.16,r:(Math.random()-.5)*.5,c:Math.random()<.28?"127,215,255":"232,184,74"}}
  rs();for(var i=0;i<N;i++)P.push(mk(i,true));
  window.addEventListener("resize",rs);
  root.addEventListener("pointermove",function(e){var r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top},{passive:true});
  root.addEventListener("pointerleave",function(){mx=my=-999});
  var last=0;
  function tick(t){
    requestAnimationFrame(tick);if(!visible||document.hidden||t-last<30)return;last=t;
    cx.clearRect(0,0,W,H);
    for(var i=0;i<N;i++){var p=P[i];p.y-=p.v*p.z;p.x+=Math.sin((t/4000)+i)*.08;if(p.y<-40){P[i]=p=mk(i,false)}
      var dx=p.x-mx,dy=p.y-my,d=Math.sqrt(dx*dx+dy*dy),near=d<170?1-d/170:0;
      p.px=p.x+(dx/(d||1))*near*14;p.py=p.y+(dy/(d||1))*near*14;p.al=Math.min(.7,p.a+near*.5)}
    cx.lineWidth=.6;
    for(var i=0;i<N;i++){var a=P[i];for(var j=i+1;j<N;j++){var b=P[j],dx=a.px-b.px,dy=a.py-b.py,dd=dx*dx+dy*dy;if(dd<14400){var al=(1-dd/14400)*.16*Math.min(a.z,b.z)+((a.al+b.al)>.5?.05:0);cx.strokeStyle="rgba("+a.c+","+al.toFixed(3)+")";cx.beginPath();cx.moveTo(a.px,a.py);cx.lineTo(b.px,b.py);cx.stroke()}}}
    for(var i=0;i<N;i++){var p=P[i];cx.save();cx.translate(p.px,p.py);cx.rotate(p.r);cx.font=(p.s*p.z).toFixed(1)+"px 'Instrument Serif',Georgia,serif";cx.fillStyle="rgba("+p.c+","+p.al.toFixed(3)+")";cx.fillText(p.g,0,0);cx.restore()}
  }
  requestAnimationFrame(tick);
})();
/* sheen follows the pointer */
if(phone&&!reduce)root.addEventListener("pointermove",function(e){var r=phone.getBoundingClientRect();phone.style.setProperty("--sh",Math.max(0,Math.min(100,(e.clientX-r.left)/Math.max(1,r.width)*100)).toFixed(0)+"%")},{passive:true});
if(!chat||!inp)return;
/* ───────── demo player ───────── */
var token=0,touched=false;
var SC={
 btc:{q:"What’s the price of Bitcoin right now?",st:["Searching the web","Reading coingecko.com"],say:"Bitcoin is near $67,412, down 1.2% over the last 24 hours.",w:"price"},
 graph:{q:"Plot y = sin(x) · e^(−x/4)",st:["Parsing the function","Building the plot"],say:"A decaying wave: it crosses zero at every multiple of π and fades as x grows.",w:"graph"},
 mol:{q:"Show me caffeine in 3D",st:["Looking up the structure","Building the model"],say:"Caffeine, C₈H₁₀N₄O₂. Drag it to rotate.",w:"mol"},
 solve:{q:"Solve x² − 5x + 6 = 0",st:["Factoring the quadratic"],say:"",w:"solve"}
};
var ORDER=["btc","graph","mol","solve"];
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function add(html,cls){var d=document.createElement("div");if(cls)d.className=cls;d.innerHTML=html;chat.appendChild(d);return d}
async function wait(ms,my){var t=0;while(t<ms){if(my!==token)return false;if(!visible||document.hidden){await sleep(250);continue}await sleep(50);t+=50}return my===token}
async function typeIn(text,my){inp.className="cur";inp.textContent="";for(var i=0;i<text.length;i++){if(my!==token)return false;inp.textContent=text.slice(0,i+1);if(!await wait(reduce?0:26+Math.random()*30,my))return false}return true}
function resetIn(){inp.className="hxph";inp.textContent="Ask anything…"}
async function say(el,text,my){var w=text.split(" ");el.textContent="";for(var i=0;i<w.length;i++){if(my!==token)return false;el.textContent+=(i?" ":"")+w[i];if(!await wait(reduce?0:34,my))return false}return true}
async function play(key,custom){
  var my=++token,sc=custom||SC[key];chips.forEach(function(c){c.classList.toggle("on",c.dataset.s===key)});
  chat.innerHTML="";phone.classList.remove("hx-think");
  if(reduce){add(esc(sc.q),"hx-u");if(sc.w)widget(sc.w,my,true);resetIn();return}
  if(!await typeIn(sc.q,my))return;await wait(380,my);if(my!==token)return;
  add(esc(sc.q),"hx-u");resetIn();phone.classList.add("hx-think");
  var st=add("","hx-st");
  for(var i=0;i<sc.st.length;i++){var r=document.createElement("div");r.innerHTML="<i></i><span>"+esc(sc.st[i])+"</span>";st.appendChild(r);if(!await wait(750,my))return;r.className="ok"}
  phone.classList.remove("hx-think");
  if(sc.say){var t=add("","hx-a-t");if(!await say(t,sc.say,my))return}
  if(sc.w)await widget(sc.w,my,false);
  if(sc.cta){var a=add('<a class="hx-go" href="https://novamind-official.github.io/">Open Phraortes →</a>')}
}
function ex(w,tpl){return add('<div class="hx-w '+w+'">'+tpl+"</div>")}
async function widget(w,my,instant){
  if(w==="price"){
    var pts=[],v=50,seed=7;for(var i=0;i<40;i++){seed=(seed*9301+49297)%233280;v+=(seed/233280-.52)*9;pts.push(v)}
    var mn=Math.min.apply(0,pts),mxv=Math.max.apply(0,pts),d=pts.map(function(y,i){return (i?"L":"M")+(i/39*260).toFixed(1)+" "+(46-(y-mn)/(mxv-mn)*38).toFixed(1)}).join(" ");
    var el=ex("hx-px-w",'<div class="hx-px"><i>₿</i><b>Bitcoin</b><em>▼ 1.20%</em></div><div class="hx-big"><span>$</span><b id="hxN">0</b></div><svg viewBox="0 0 260 50" preserveAspectRatio="none"><path class="dr" pathLength="1" d="'+d+'" fill="none" stroke="#ff7b7b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><small>Sample data for this demo · 24h</small>');
    var n=$("#hxN"),to=67412.8,t0=performance.now();(function f(t){if(my!==token||!n)return;var p=instant?1:Math.min(1,(t-t0)/1200),e=1-Math.pow(1-p,4);n.textContent=(to*e).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});if(p<1)requestAnimationFrame(f)})(t0);
  }
  if(w==="graph"){
    var X0=10,XW=240,pts=[];for(var i=0;i<=120;i++){var x=i/120*12,y=Math.sin(x)*Math.exp(-x/4);pts.push([X0+x/12*XW,62-y*52,x,y])}
    var d=pts.map(function(p,i){return (i?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1)}).join(" ");
    var grid="";for(var g=0;g<=6;g++)grid+='<line x1="'+(X0+g*40)+'" y1="4" x2="'+(X0+g*40)+'" y2="120" stroke="rgba(255,255,255,.07)"/>';for(var g=0;g<=4;g++)grid+='<line x1="'+X0+'" y1="'+(10+g*26)+'" x2="'+(X0+XW)+'" y2="'+(10+g*26)+'" stroke="rgba(255,255,255,.07)"/>';
    var el=ex("",'<svg viewBox="0 0 260 124">'+grid+'<line x1="'+X0+'" y1="62" x2="250" y2="62" stroke="rgba(255,255,255,.3)"/><path id="hxP" class="dr" pathLength="1" d="'+d+'" fill="none" stroke="#7fd7ff" stroke-width="2.2" stroke-linecap="round"/><circle id="hxDot" r="4.5" fill="#E8B84A" cx="'+X0+'" cy="62" opacity="0"/></svg><div class="hx-rd"><span id="hxRX">x = 0.00</span><span id="hxRY">y = 0.00</span></div>');
    if(!instant){await wait(1500,my);var dot=$("#hxDot"),a=$("#hxRX"),b=$("#hxRY"),t0=performance.now();if(dot){dot.setAttribute("opacity","1");(function f(t){if(my!==token)return;var k=Math.max(0,((t-t0)/5200)%1),i=Math.max(0,Math.min(120,Math.floor(k*120))),p=pts[i];dot.setAttribute("cx",p[0]);dot.setAttribute("cy",p[1]);a.textContent="x = "+p[2].toFixed(2);b.textContent="y = "+p[3].toFixed(2);requestAnimationFrame(f)})(t0)}}
  }
  if(w==="mol"){
    var el=ex("hx-mol",'<canvas id="hxM" width="520" height="240"></canvas><small>Caffeine · C₈H₁₀N₄O₂ · drag to rotate</small>');mol($("#hxM"),my,instant)
  }
  if(w==="solve"){
    var L=["x² − 5x + 6 = 0","(x − 2)(x − 3) = 0","x = 2  or  x = 3"],el=ex("hx-sv","");
    for(var i=0;i<L.length;i++){if(my!==token)return;var r=document.createElement("div");r.textContent=L[i];el.firstChild.appendChild(r);if(!await wait(instant?0:900,my))return}
  }
}
/* tiny 3D ball-and-stick molecule */
function mol(cv,my,instant){
  if(!cv)return;var c=cv.getContext("2d"),w=cv.width,h=cv.height;
  var A=[["C",0,1,0],["N",-.87,.5,0],["C",-.87,-.5,0],["N",0,-1,0],["C",.87,-.5,0],["C",.87,.5,0],["N",1.7,-.8,0],["C",2.2,0,0],["N",1.7,.8,0],["O",0,2,.2],["O",-1.75,-1,-.2],["C",-1.75,1,.5],["C",0,-2,-.5],["C",1.95,1.75,.4]];
  var B=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[4,6],[6,7],[7,8],[8,5],[0,9],[2,10],[1,11],[3,12],[8,13]];
  var col={C:["#cfd5df","#7c8697"],N:["#9cc4ff","#3f6fd1"],O:["#ff9a9a","#d13f3f"]},rad={C:.2,N:.22,O:.22};
  var ry=0,rx=.5,drag=false,lx=0;
  cv.onpointerdown=function(e){drag=true;lx=e.clientX;try{cv.setPointerCapture(e.pointerId)}catch(_){}};cv.onpointerup=cv.onpointercancel=function(){drag=false};
  cv.onpointermove=function(e){if(drag){ry+=(e.clientX-lx)*.012;lx=e.clientX}};
  function frame(){
    if(my!==token||!cv.isConnected)return;if(!drag&&!reduce)ry+=.011;c.clearRect(0,0,w,h);
    var cs=Math.cos(ry),sn=Math.sin(ry),cxx=Math.cos(rx),sx=Math.sin(rx),S=h*.2,P=A.map(function(a){var x=(a[1]-.6),y=a[2],z=a[3],x2=x*cs+z*sn,z2=-x*sn+z*cs,y2=y*cxx-z2*sx,z3=y*sx+z2*cxx,f=1/(1-z3*.12);return{t:a[0],x:w/2+x2*S*f,y:h/2-y2*S*f,z:z3,f:f}});
    B.forEach(function(b){var p=P[b[0]],q=P[b[1]];c.strokeStyle="rgba(243,238,228,.45)";c.lineWidth=3*Math.min(p.f,q.f);c.lineCap="round";c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.stroke()});
    P.slice().sort(function(a,b){return a.z-b.z}).forEach(function(p){var r=rad[p.t]*S*p.f,g=c.createRadialGradient(p.x-r*.35,p.y-r*.4,r*.1,p.x,p.y,r);g.addColorStop(0,col[p.t][0]);g.addColorStop(1,col[p.t][1]);c.fillStyle=g;c.beginPath();c.arc(p.x,p.y,r,0,7);c.fill()});
    if(!reduce)requestAnimationFrame(frame)
  }
  frame();
}
/* controls */
chips.forEach(function(b){b.addEventListener("click",function(){touched=true;play(b.dataset.s)})});
function route(q){q=q.toLowerCase();return /bitcoin|btc|price|crypto|ether|gold|قیمت/.test(q)?"btc":/plot|graph|sin|cos|curve|function|y\s*=/.test(q)?"graph":/molecul|caffeine|water|h2o|atom|3d|chem/.test(q)?"mol":/solve|equation|quadratic|x\s*[²^2]|=/.test(q)?"solve":null}
if(form)form.addEventListener("submit",function(e){e.preventDefault();var v=form.querySelector("input"),q=v.value.trim();if(!q)return;touched=true;var k=route(q);v.value="";v.blur();
  if(k)play(k);else play("",{q:q,st:["Understanding your question"],say:"Good one. This live demo only knows four tricks, so open Phraortes to ask it anything.",w:"",cta:true})});
/* autoplay loop until the visitor takes over */
(async function loop(){var i=0;if(reduce){play("btc");return}await sleep(900);while(true){if(touched){await sleep(1200);continue}var my=token+1;await play(ORDER[i%4]);if(touched)continue;await wait(5200,token);i++}})();
})();
