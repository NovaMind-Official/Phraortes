(function(){
var d=document,W=window,rm=W.matchMedia('(prefers-reduced-motion:reduce)').matches;
var $=function(s,r){return(r||d).querySelector(s)},$$=function(s,r){return[].slice.call((r||d).querySelectorAll(s))};
var mq=W.matchMedia('(max-width:900px)');
/* word reveal */
var rev=$('#rev');if(rev){var t=rev.textContent.trim().split(/\s+/);rev.innerHTML=t.map(function(w){return'<span>'+w+'</span>'}).join(' ')}
var words=rev?$$('span',rev):[];
/* reveals */
var io='IntersectionObserver' in W?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.08}):null;
$$('.rv').forEach(function(e){io?io.observe(e):e.classList.add('in')});
/* count up */
function count(el){var to=+el.dataset.to,s=null;if(rm){el.textContent=to;return}function f(ts){s=s||ts;var p=Math.min(1,(ts-s)/1400),v=1-Math.pow(1-p,4);el.textContent=Math.round(to*v);if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
var cio='IntersectionObserver' in W?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){count(e.target);cio.unobserve(e.target)}})},{threshold:.6}):null;
$$('[data-to]').forEach(function(e){cio?cio.observe(e):e.textContent=e.dataset.to});
/* scroll engine */
var hero=$('#overview'),stages=$$('.feat .stage'),chaps=$$('.chap'),sub=$('#sub'),secs=['story','agent','tools','plans'].map(function(i){return d.getElementById(i)}),links=$$('.sl a'),ticking=false;
function clamp(v){return Math.max(0,Math.min(1,v))}
function frame(){
 ticking=false;var vh=W.innerHeight,y=W.scrollY,desk=!mq.matches&&!rm;
 if(hero&&desk){var r=hero.getBoundingClientRect();hero.style.setProperty('--hp',clamp(-r.top/(r.height-vh)).toFixed(4))}
 if(desk)stages.forEach(function(s){var r=s.getBoundingClientRect();s.style.setProperty('--p',clamp((vh-r.top)/(vh*.7)).toFixed(3))});
 else stages.forEach(function(s){s.style.setProperty('--p',1)});
 if(desk)chaps.forEach(function(c){var r=c.getBoundingClientRect(),n=+c.style.getPropertyValue('--n')||c.querySelectorAll('.cs').length,p=clamp(-r.top/(r.height-vh)),i=Math.min(n-1,Math.floor(p*n*.999));
  if(c._i!==i){c._i=i;$$('.cs',c).forEach(function(e,k){e.classList.toggle('on',k===i)});$$('.ci',c).forEach(function(e,k){e.classList.toggle('on',k===i)});$$('.cdots i',c).forEach(function(e,k){e.classList.toggle('on',k===i)})}});
 if(words.length&&rev){var r=rev.getBoundingClientRect(),p=clamp((vh*.85-r.top)/(vh*.6+r.height)),k=Math.round(p*words.length);if(rm)k=words.length;words.forEach(function(w,j){w.classList.toggle('on',j<k)})}
 if(sub&&hero){var hb=hero.getBoundingClientRect().bottom;sub.classList.toggle('on',hb<vh*.6);var cur=null;secs.forEach(function(s,k){if(s&&s.getBoundingClientRect().top<vh*.5)cur=k});links.forEach(function(a,k){a.classList.toggle('on',k===cur)})}
}
function req(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
W.addEventListener('scroll',req,{passive:true});W.addEventListener('resize',function(){$$('.chap').forEach(function(c){c._i=null});req()});
mq.addEventListener&&mq.addEventListener('change',function(){$$('.chap').forEach(function(c){c._i=null;if(mq.matches){$$('.cs',c).forEach(function(e){e.classList.remove('on')})}});req()});
frame();
/* carousel */
var row=$('#hrow'),pv=$('#hl-p'),nx=$('#hl-n'),dots=$$('#hdots i');
if(row){var cards=$$('.hc',row);function step(){return cards[0]?cards[0].getBoundingClientRect().width+20:400}
 function upd(){var m=row.scrollWidth-row.clientWidth,i=Math.round(row.scrollLeft/step());i=Math.max(0,Math.min(cards.length-1,i));if(m-row.scrollLeft<6)i=cards.length-1;dots.forEach(function(e,k){e.classList.toggle('on',k===i)});if(pv)pv.disabled=row.scrollLeft<4;if(nx)nx.disabled=m-row.scrollLeft<6}
 pv&&pv.addEventListener('click',function(){row.scrollBy({left:-step(),behavior:rm?'auto':'smooth'})});
 nx&&nx.addEventListener('click',function(){row.scrollBy({left:step(),behavior:rm?'auto':'smooth'})});
 row.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});upd();
 /* tap a card: jump to its section smoothly */
}
/* smooth anchor offset handled by scroll-margin */
$$('.feat,#tools,#plans,#agent,#story').forEach(function(s){s.style.scrollMarginTop='92px'});
/* faq: one open at a time */
$$('.fl details').forEach(function(x){x.addEventListener('toggle',function(){if(x.open)$$('.fl details').forEach(function(o){if(o!==x)o.open=false})})});
})();
