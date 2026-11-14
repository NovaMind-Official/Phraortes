(function(){
 var rv=[].slice.call(document.querySelectorAll('.rv'));
 if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.05});rv.forEach(function(n){io.observe(n)})}else rv.forEach(function(n){n.classList.add('in')});
 /* filter tabs */
 var tabs=document.querySelector('.pg-tabs');
 if(tabs){var cards=[].slice.call(document.querySelectorAll('.pg-card[data-c]'));
  tabs.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;[].forEach.call(tabs.children,function(x){x.setAttribute('aria-pressed',x===b)});var c=b.dataset.f;cards.forEach(function(k){k.hidden=!(c==='all'||k.dataset.c.split(' ').indexOf(c)>=0)})});
  if(location.hash){var t=document.querySelector(location.hash);if(t&&t.dataset&&t.dataset.c){/* make sure target visible */}}}
})();
