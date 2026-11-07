(function(){
var an=document.getElementById('an'),dim=document.getElementById('an-dim'),bg=document.getElementById('abg'),mn=document.getElementById('amenu');if(!an)return;
var bs=[].slice.call(an.querySelectorAll('.anb')),mg={},cur=null,t=0;
bs.forEach(function(b){mg[b.dataset.mega]=document.getElementById('mega-'+b.dataset.mega)});
function shut(){clearTimeout(t);bs.forEach(function(b){b.setAttribute('aria-expanded','false');mg[b.dataset.mega].classList.remove('on')});if(dim)dim.classList.remove('on');cur=null}
function open(b){clearTimeout(t);if(cur===b)return;bs.forEach(function(x){var o=x===b;x.setAttribute('aria-expanded',o);mg[x.dataset.mega].classList.toggle('on',o)});dim&&dim.classList.add('on');cur=b}
bs.forEach(function(b){
 b.addEventListener('click',function(e){e.stopPropagation();cur===b?shut():open(b)});
 b.addEventListener('mouseenter',function(){if(matchMedia('(hover:hover)').matches)open(b)});
});
an.addEventListener('mouseleave',function(){if(matchMedia('(hover:hover)').matches)t=setTimeout(shut,160)});
an.addEventListener('mouseenter',function(){clearTimeout(t)});
document.addEventListener('click',function(e){if(cur&&!an.contains(e.target))shut()});
if(dim)dim.addEventListener('click',shut);
document.addEventListener('keydown',function(e){if(e.key==='Escape'){shut();closeMenu()}});
function closeMenu(){if(!bg)return;bg.setAttribute('aria-expanded','false');mn.classList.remove('on');an.classList.remove('mo');document.documentElement.style.overflow=''}
if(bg)bg.addEventListener('click',function(){var o=bg.getAttribute('aria-expanded')!=='true';bg.setAttribute('aria-expanded',o);mn.classList.toggle('on',o);an.classList.toggle('mo',o);document.documentElement.style.overflow=o?'hidden':''});
if(mn)mn.addEventListener('click',function(e){if(e.target.tagName==='A')closeMenu()});
addEventListener('resize',function(){if(innerWidth>860)closeMenu()});
var f=location.pathname.split('/').pop()||'index.html';[].forEach.call(an.querySelectorAll('.anl a'),function(a){if(a.getAttribute('href')===f)a.classList.add('cur')});
var tk=0;function sc(){tk=0;an.classList.toggle('sc',scrollY>8)}addEventListener('scroll',function(){tk||(tk=requestAnimationFrame(sc))},{passive:true});sc();
})();
