(function(){var st=[].slice.call(document.querySelectorAll('.stage')),rm=matchMedia('(prefers-reduced-motion:reduce)').matches,tk=0;
function u(){tk=0;var h=innerHeight;st.forEach(function(e){var r=e.getBoundingClientRect();if(r.bottom<-50||r.top>h+50)return;var p=1-Math.max(0,(r.top-h*.35))/(h*.65);e.style.setProperty('--p',Math.max(0,Math.min(1,p)).toFixed(3))})}
if(!rm){addEventListener('scroll',function(){tk||(tk=requestAnimationFrame(u))},{passive:true});addEventListener('resize',u);u()}
var io=new IntersectionObserver(function(a){a.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.15});
document.querySelectorAll('.rv').forEach(function(e){io.observe(e)});
})();
