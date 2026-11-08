(function(){
var d=document,W=window,rm=W.matchMedia('(prefers-reduced-motion:reduce)').matches,mq=W.matchMedia('(max-width:900px)');
var $=function(s,r){return(r||d).querySelector(s)},$$=function(s,r){return[].slice.call((r||d).querySelectorAll(s))};
function clamp(v){return Math.max(0,Math.min(1,v))}
/* reveal paragraph */
var rev=$('#rev');if(rev){rev.innerHTML=rev.textContent.trim().split(/\s+/).map(function(w){return'<span>'+w+'</span>'}).join(' ')}
var words=rev?$$('span',rev):[];
var io='IntersectionObserver' in W?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.06}):null;
$$('.rv').forEach(function(e){io?io.observe(e):e.classList.add('in')});
/* scroll engine: hero progress, word reveal, subnav */
var hero=$('#overview'),sub=$('#sub'),secs=['everything','voice','agent','more','privacy','plans'].map(function(i){return d.getElementById(i)}),links=$$('.sl a'),tick=false;
function frame(){tick=false;var vh=W.innerHeight;
 if(hero&&!mq.matches&&!rm){var r=hero.getBoundingClientRect();hero.style.setProperty('--hp',clamp(-r.top/(r.height-vh)).toFixed(4))}
 if(rev&&words.length){var r2=rev.getBoundingClientRect(),p=clamp((vh*.85-r2.top)/(vh*.6+r2.height)),k=rm?words.length:Math.round(p*words.length);words.forEach(function(w,j){w.classList.toggle('on',j<k)})}
 if(sub&&hero){sub.classList.toggle('on',hero.getBoundingClientRect().bottom<vh*.6);var cur=-1;secs.forEach(function(s,k){if(s&&s.getBoundingClientRect().top<vh*.5)cur=k});links.forEach(function(a,k){a.classList.toggle('on',k===cur)})}}
function req(){if(!tick){tick=true;requestAnimationFrame(frame)}}
W.addEventListener('scroll',req,{passive:true});W.addEventListener('resize',req);frame();
$$('section[id]').forEach(function(s){s.style.scrollMarginTop='60px'});
/* modal */
var md=$('#md'),last=null;
function openM(k){var m=W.PHR_M[k];if(!m)return;last=d.activeElement;$('#md-img').src=m.img;$('#md-img').alt=m.k;$('#md-k').textContent=m.k;$('#md-t').innerHTML=m.t;$('#md-p').textContent=m.p;$('#md-l').innerHTML=m.b.map(function(x){return'<li>'+x+'</li>'}).join('');$('#md-a').href=m.l;md.hidden=false;d.body.classList.add('mo-open');$('.md-x',md).focus()}
function closeM(){md.hidden=true;d.body.classList.remove('mo-open');if(last&&last.focus)last.focus()}
d.addEventListener('click',function(e){var t=e.target.closest('[data-m]');if(t&&!md.contains(t)){openM(t.dataset.m);return}if(e.target.closest('[data-x]'))closeM()});
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&!md.hidden)closeM();if((e.key==='Enter'||e.key===' ')&&e.target.dataset&&e.target.dataset.m){e.preventDefault();openM(e.target.dataset.m)}});
/* carousel */
var row=$('#hrow'),pv=$('#hl-p'),nx=$('#hl-n'),dots=$$('#hdots i');
if(row){var cards=$$('.hc',row);var step=function(){return cards[0]?cards[0].getBoundingClientRect().width+18:400};
 var upd=function(){var m=row.scrollWidth-row.clientWidth,i=Math.max(0,Math.min(cards.length-1,Math.round(row.scrollLeft/step())));if(m-row.scrollLeft<6)i=cards.length-1;dots.forEach(function(e,k){e.classList.toggle('on',k===i)});if(pv)pv.disabled=row.scrollLeft<4;if(nx)nx.disabled=m-row.scrollLeft<6};
 pv&&pv.addEventListener('click',function(){row.scrollBy({left:-step(),behavior:rm?'auto':'smooth'})});nx&&nx.addEventListener('click',function(){row.scrollBy({left:step(),behavior:rm?'auto':'smooth'})});
 row.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});upd()}
/* faq */
$$('.fl details').forEach(function(x){x.addEventListener('toggle',function(){if(x.open)$$('.fl details').forEach(function(o){if(o!==x)o.open=false})})});
/* live Aura orb */
var cv=$('#orb');
if(cv){var cx=cv.getContext('2d'),hue=42,tgt=42,vis=false,t0=0,mx=0,my=0,sec=$('#voice');
 var size=function(){var r=cv.getBoundingClientRect(),dp=Math.min(2,W.devicePixelRatio||1);cv.width=r.width*dp;cv.height=r.height*dp;cx.setTransform(dp,0,0,dp,0,0)};size();W.addEventListener('resize',size);
 sec.addEventListener('pointermove',function(e){var r=sec.getBoundingClientRect();mx=(e.clientX-r.left)/r.width-.5;my=(e.clientY-r.top)/r.height-.5});
 var draw=function(ts){if(!vis)return;requestAnimationFrame(draw);t0=ts/1000;hue+=(tgt-hue)*.06;var w=cv.clientWidth,h=cv.clientHeight,x=w/2+mx*30,y=h*.27+my*16,R=Math.min(w,h)*(w<700?.4:.17);if(w<700)R=Math.min(R,w*.26);cx.clearRect(0,0,w,h);
  var g=cx.createRadialGradient(x,y,R*.2,x,y,R*3);g.addColorStop(0,'hsla('+hue+',90%,60%,.28)');g.addColorStop(1,'hsla('+hue+',90%,60%,0)');cx.fillStyle=g;cx.fillRect(0,0,w,h);
  var n=120;for(var i=0;i<n;i++){var a=i/n*6.2832,amp=rm?.4:.5+.5*Math.sin(t0*2.2+i*.37)*Math.sin(t0*1.3+i*.11)+.35*Math.sin(t0*3.1+i*.91),l=R*(.08+.2*Math.abs(amp));cx.strokeStyle='hsla('+hue+',90%,'+(58+amp*14)+'%,'+(.35+Math.abs(amp)*.55)+')';cx.lineWidth=Math.max(2,R*.016);cx.lineCap='round';cx.beginPath();cx.moveTo(x+Math.cos(a)*R*1.12,y+Math.sin(a)*R*1.12);cx.lineTo(x+Math.cos(a)*(R*1.12+l),y+Math.sin(a)*(R*1.12+l));cx.stroke()}
  var o=cx.createRadialGradient(x-R*.3,y-R*.36,R*.05,x,y,R);o.addColorStop(0,'hsl('+hue+',100%,92%)');o.addColorStop(.28,'hsl('+hue+',88%,70%)');o.addColorStop(.62,'hsl('+hue+',78%,38%)');o.addColorStop(1,'hsl('+hue+',70%,8%)');cx.fillStyle=o;cx.beginPath();cx.arc(x,y,R,0,6.2832);cx.fill();
  cx.strokeStyle='hsla('+hue+',90%,70%,.22)';cx.lineWidth=2;cx.beginPath();cx.arc(x,y,R*1.75+Math.sin(t0)*6,0,6.2832);cx.stroke()};
 var vio=new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis)requestAnimationFrame(draw)},{threshold:0});vio.observe(sec);
 $$('#pers button').forEach(function(b){b.addEventListener('click',function(){$$('#pers button').forEach(function(o){o.classList.remove('on')});b.classList.add('on');tgt=+b.dataset.h;$('#pers').style.setProperty('--pc','hsl('+tgt+',90%,62%)');var s=$('#vsub');s.style.opacity=0;setTimeout(function(){s.textContent=b.dataset.s;s.style.opacity=1},180)})});
 $('#vsub').style.transition='opacity .3s'}
/* interactive Agent demo */
var msgs=$('#msgs'),scr=$('#scr'),typed=$('#typed'),busy=false,ft=null;
if(msgs){
 var add=function(c,t){var m=d.createElement('div');m.className='m '+c;m.textContent=t;msgs.appendChild(m);while(msgs.children.length>5)msgs.removeChild(msgs.firstChild)};
 var closeAll=function(){$$('.sh').forEach(function(s){s.classList.remove('on')});clearInterval(ft)};
 var type=function(txt,cb){if(rm){typed.textContent=txt;typed.classList.add('on');setTimeout(cb,200);return}typed.classList.add('on');var i=0;(function n(){typed.textContent=txt.slice(0,++i);if(i<txt.length)setTimeout(n,34);else setTimeout(cb,260)})()};
 var run=function(c){if(busy)return;busy=true;$$('#cmds button').forEach(function(b){b.disabled=true});
  var map={tasks:['Open tasks','✓ Opening Tasks'],light:['Switch theme','✓ '+(scr.classList.contains('lt')?'Dark mode':'Light mode')],chat:['New chat','✓ New chat started'],focus:['Start a 25-minute focus','✓ Focus started · 25:00'],close:['Close everything','✓ Closed everything']}[c];
  type(map[0],function(){typed.textContent='Message Phraortes';typed.classList.remove('on');add('u',map[0]);setTimeout(function(){add('a',map[1]);
   if(c==='tasks'){closeAll();$('#sh-tasks').classList.add('on')}
   if(c==='light')scr.classList.toggle('lt');
   if(c==='chat'){closeAll();msgs.innerHTML='';add('a','New chat. What shall we learn?')}
   if(c==='close')closeAll();
   if(c==='focus'){closeAll();var s=1500,p=$('#rgp'),t=$('#rgt');p.style.transition='none';p.style.strokeDashoffset=0;t.textContent='25:00';$('#sh-focus').classList.add('on');setTimeout(function(){p.style.transition='stroke-dashoffset 1s linear';ft=setInterval(function(){s-=60;if(s<0)s=1500;t.textContent=Math.floor(s/60)+':'+('0'+s%60).slice(-2);p.style.strokeDashoffset=314*(1-s/1500)},1000)},60)}
   busy=false;$$('#cmds button').forEach(function(b){b.disabled=false})},420)})};
 $$('#cmds button').forEach(function(b){b.addEventListener('click',function(){run(b.dataset.c)})});
 add('a','Hi! Tell me what to do.');
 var auto=new IntersectionObserver(function(es){if(es[0].isIntersecting){auto.disconnect();setTimeout(function(){run('tasks')},900)}},{threshold:.55});auto.observe($('.ph'))}
})();
