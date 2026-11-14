(function(){
 var $=function(s,r){return(r||document).querySelector(s)},sleep=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
 var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
 /* ── hero voice ticker ── */
 var said=$('#vt-said'),res=$('#vt-res'),st=$('#vt-state'),bars=[].slice.call(document.querySelectorAll('.vt-wave i'));
 var SCRIPT=[
  {t:'Hey Phraortes, remind me at 5 pm to call Sara',r:['⏰ 17:00 · Call Sara','＋ Add to Calendar']},
  {t:'هی فراورتس، تایمر ۱۰ دقیقه',r:['⏱ 10:00','Ring + vibration']},
  {t:'Hey Phraortes, open the whiteboard and draw a cube',r:['▢ Whiteboard open','Drawing…']},
  {t:'هی فراورتس، حالت تاریک رو روشن کن',r:['◐ Dark mode','Done']},
  {t:'Hey Phraortes, switch to Apex and quiz me on molar mass',r:['Core → Apex','Quiz ready']}
 ];
 var wv=0;function wave(on){clearInterval(wv);if(!on){bars.forEach(function(b){b.style.height='6px'});return}wv=setInterval(function(){bars.forEach(function(b){b.style.height=(5+Math.random()*22)+'px'})},110)}
 async function ticker(){
  if(!said)return;var i=0;
  while(true){
   var s=SCRIPT[i%SCRIPT.length];i++;
   said.textContent='';res.innerHTML='';said.classList.toggle('fa',/[؀-ۿ]/.test(s.t));
   st.textContent='Waiting for “Hey Phraortes”';st.classList.remove('on');wave(false);await sleep(reduce?200:900);
   st.textContent='Listening';st.classList.add('on');wave(true);
   for(var k=1;k<=s.t.length;k++){said.textContent=s.t.slice(0,k);await sleep(reduce?0:38)}
   wave(false);st.textContent='Doing it';await sleep(450);
   for(var j=0;j<s.r.length;j++){var sp=document.createElement('span');sp.textContent=s.r[j];res.appendChild(sp);await sleep(380)}
   await sleep(reduce?1500:2600);
  }
 }
 ticker();
 /* ── whiteboard ── */
 var svg=$('#wb-svg');
 if(svg){
  var NS='http://www.w3.org/2000/svg',cy=18,W=300,H=380,cx=150,col=0;
  function arc(x,y,rx,ry,a0,a1,n){var p=[],i,t;for(i=0;i<=n;i++){t=a0+(a1-a0)*i/n;p.push([x+rx*Math.cos(t),y+ry*Math.sin(t)])}return p}
  function d(p,close){return 'M'+p.map(function(q){return q[0].toFixed(1)+','+q[1].toFixed(1)}).join('L')+(close?'Z':'')}
  var SH={
   line:{h:2,paths:function(x,y){return[{d:'M'+(x-80)+','+y+'L'+(x+80)+','+y}]}},
   circle:{h:70,paths:function(x,y){return[{d:d(arc(x,y+35,35,35,0,6.2832,48))}]}},
   cube:{h:76,paths:function(x,y){var a=56,o=26,X=x-(a+o)/2,Y=y+o;return[{d:'M'+X+','+Y+'h'+a+'v'+a+'h-'+a+'z'},{d:'M'+X+','+Y+'l'+o+',-'+o+'h'+a+'l-'+o+','+o},{d:'M'+(X+a)+','+Y+'l'+o+',-'+o+'v'+a+'l-'+o+','+o},{d:'M'+(X+o)+','+(Y-o)+'v'+a+'h'+a+'M'+X+','+(Y+a)+'l'+o+',-'+a+'',cls:'hid'}]}},
   star:{h:72,paths:function(x,y){var p=[],i,a,r;for(i=0;i<10;i++){a=-Math.PI/2+i*Math.PI/5;r=i%2?15:37;p.push([x+r*Math.cos(a),y+37+r*Math.sin(a)])}return[{d:d(p,1)}]}},
   heart:{h:64,paths:function(x,y){var p=[],i,t;for(i=0;i<=60;i++){t=i*6.2832/60;p.push([x+16*Math.pow(Math.sin(t),3)*2.1,y+32-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))*2.1])}return[{d:d(p)}]}},
   triangle:{h:62,paths:function(x,y){return[{d:'M'+x+','+y+'L'+(x+36)+','+(y+62)+'L'+(x-36)+','+(y+62)+'Z'}]}},
   house:{h:78,paths:function(x,y){return[{d:'M'+(x-34)+','+(y+30)+'h68v46h-68z'},{d:'M'+(x-42)+','+(y+30)+'L'+x+','+y+'L'+(x+42)+','+(y+30)},{d:'M'+(x-8)+','+(y+76)+'v-22h16v22'}]}}
  };
  var cap=$('#wb-cap');
  function say(t){if(cap)cap.textContent=t}
  function clear(){while(svg.firstChild)svg.removeChild(svg.firstChild);cy=18;col=0}
  var busy=Promise.resolve();
  function draw(name,fa){
   busy=busy.then(async function(){
    var s=SH[name];if(!s)return;
    if(cy+s.h>H-14){clear()}
    var g=document.createElementNS(NS,'g');svg.appendChild(g);
    s.paths(cx,cy).forEach(function(pp){var p=document.createElementNS(NS,'path');p.setAttribute('d',pp.d);if(pp.cls)p.setAttribute('class',pp.cls);g.appendChild(p);var L=p.getTotalLength();p.style.strokeDasharray=pp.cls?'5 5':L;p.style.strokeDashoffset=pp.cls?0:L;if(pp.cls)p.style.opacity=0;
     p.getBoundingClientRect();p.style.transition=reduce?'none':'stroke-dashoffset '+(.6+L/220)+'s cubic-bezier(.5,0,.3,1),opacity .6s .5s';p.style.strokeDashoffset=0;if(pp.cls)p.style.opacity=.5});
    cy+=s.h+17;await sleep(reduce?100:1050);
   });
  }
  var NAMES={line:['a straight line','خط صاف'],circle:['a circle','دایره'],cube:['a cube','مکعب'],star:['a star','ستاره'],heart:['a heart','قلب'],triangle:['a triangle','مثلث'],house:['a house','خونه']};
  document.querySelectorAll('[data-sh]').forEach(function(b){b.addEventListener('click',function(){var n=b.dataset.sh;say('“Draw '+NAMES[n][0]+'.”  ·  «'+NAMES[n][1]+' بکش»');draw(n)})});
  var go=$('#wb-go');
  if(go)go.addEventListener('click',function(){
   clear();say('“Hey Phraortes, open the board. Draw a straight line, then a circle under it, then a cube.”');
   ['line','circle','cube'].forEach(function(n){draw(n)});
  });
  var cl=$('#wb-clear');if(cl)cl.addEventListener('click',function(){busy=busy.then(function(){clear();say('Board cleared.')})});
  /* autoplay when visible */
  if('IntersectionObserver' in window){var seen=false,io=new IntersectionObserver(function(es){if(es[0].isIntersecting&&!seen){seen=true;go&&go.click()}},{threshold:.45});io.observe(svg)}
 }
 /* ── timer ── */
 var tm=$('#tm');
 if(tm){
  var fg=$('.fg',tm),lab=$('#tm-n'),sub=$('#tm-l'),run=0,tt=0;
  function fmt(s){return Math.floor(s/60)+':'+('0'+(s%60)).slice(-2)}
  function start(sec,txt){clearInterval(run);tm.classList.remove('ring');var t0=Date.now(),tot=sec*1000;sub.textContent=txt;lab.textContent=fmt(sec);fg.style.strokeDashoffset=0;
   run=setInterval(function(){var el=Date.now()-t0,left=Math.max(0,tot-el);lab.textContent=fmt(Math.ceil(left/1000));fg.style.strokeDashoffset=326.7*(el/tot);if(left<=0){clearInterval(run);lab.textContent='🔔';fg.style.strokeDashoffset=0;tm.classList.add('ring');sub.textContent='Rings with sound and an on-screen alert.'}},100)}
  $('#tm-a').addEventListener('click',function(){start(8,'“Timer, 10 minutes” — sped up so you can watch it ring.')});
  $('#tm-b').addEventListener('click',function(){clearInterval(run);tm.classList.remove('ring');fg.style.strokeDashoffset=0;lab.textContent='17:00';sub.textContent='“Remind me at 5 pm to call Sara” → alarm set. One tap adds it to Calendar so it also rings when the app is closed.'});
 }
})();
