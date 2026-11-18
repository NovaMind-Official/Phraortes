/* Phraortes site shell: header, menus, mobile menu, footer, language button. One source for every page. */
(function(){
var APP='https://novamind-official.github.io/';
var GL='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg>';
var MEGA={
 agent:{t:'Agent',hot:1,cols:[
  ['Talk to it',[['agent.html#wake','Hey Phraortes','Hands-free, by voice'],['agent.html#console','Agent console','A cockpit that opens when you call'],['agent.html#board','Voice whiteboard','Say it, watch it drawn']]],
  ['Make it yours',[['agent.html#keys','Keys','One word runs any task'],['agent.html#shadow','Shadow','Quiet suggestions from your habits'],['agent.html#habits','Habit Radar','Finds routines you repeat']]],
  ['Get more done',[['agent.html#premortem','Pre-Mortem','Find how a plan fails, first'],['agent.html#capture','Capture to action','Turn anything into events and tasks'],['agent.html#imagine','Image studio','3D and photo-grade images']]]],
  card:['agent.html','m-agent.webp','New · Keys, Shadow, Pre-Mortem','Say a word. It does the rest.']},
 features:{t:'Features',cols:[
  ['Think and build',[['features.html#research','Deep research','Sourced, with an evidence board'],['features.html#studio','Studio','Describe an app, run it'],['features.html#photo','Files and photos','PDFs, images, scans']]],
  ['Make it yours',[['features.html#themes','Themes and ranks','12 looks, 7 ranks, your colour'],['features.html#account','Account','Clear, fast, private'],['features.html#memory','Memory','It remembers what matters']]],
  ['Trust',[['features.html#privacy','Privacy','Chats stay on your device'],['features.html#cores','Four cores','All open on every plan'],['features.html#sources','Sources','See where answers come from']]]],
  card:['features.html','m-agent.webp','Made to look like yours','Twelve themes. One account.']},
 tools:{t:'Tools',cols:[
  ['Math',[['tools.html#solve','Solver','Step by step, typeset'],['tools.html#graphs','Graphs','Plot, trace, intersect'],['tools.html#stats','Statistics','Histograms and regression']]],
  ['Science',[['tools.html#molecules','Molecules','Real 3D structures'],['tools.html#elements','Periodic table','Every element'],['tools.html#optics','Optics','Lenses and rays']]],
  ['Build',[['tools.html#breadboard','Circuits','Change a value, watch it respond'],['tools.html#code','Code','Run it right in the chat'],['tools.html#simulate','Simulations','Physics you can poke']]]],
  card:['tools.html#graphs','m-graph.webp','Graphs, alive','Drag a curve, read the roots.']}
};
var PLAIN=[['how-it-works.html','How it works'],['pricing.html','Pricing'],['learn.html','Learn']];
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')}
function megaHTML(k){var m=MEGA[k];return '<div class="mega" id="mega-'+k+'" role="region" aria-label="'+m.t+'"><div class="mg">'+m.cols.map(function(c){return '<div class="mc"><b>'+c[0]+'</b>'+c[1].map(function(a){return '<a href="'+a[0]+'">'+a[1]+'<small>'+a[2]+'</small></a>'}).join('')+'</div>'}).join('')+'<a class="mp" href="'+m.card[0]+'"><img src="'+m.card[1]+'" alt="" width="560" height="420" loading="lazy" decoding="async"><b>'+m.card[2]+'</b><span>'+m.card[3]+'</span></a></div></div>'}
function langBtn(cls){return '<button class="lgb '+(cls||'')+'" type="button" aria-haspopup="true" aria-expanded="false" aria-label="Language">'+GL+'<span data-lang-now>EN</span></button>'}
function headerHTML(){
 return '<header class="an" id="an"><div class="an-in"><a class="ab" href="index.html"><img src="https://novamind-official.github.io/icon-192.png" alt="" width="22" height="22">Phraortes</a>'+
 '<nav class="anl" aria-label="Main"><button class="anb hot" type="button" data-mega="agent" aria-expanded="false" aria-controls="mega-agent"><i class="hd"></i>Agent</button><a href="how-it-works.html">How it works</a><button class="anb" type="button" data-mega="features" aria-expanded="false" aria-controls="mega-features">Features</button><button class="anb" type="button" data-mega="tools" aria-expanded="false" aria-controls="mega-tools">Tools</button><a href="pricing.html">Pricing</a><a href="learn.html">Learn</a></nav>'+
 '<span class="lgw">'+langBtn('')+'</span><a class="ag" href="'+APP+'">Try free</a><button class="abg" id="abg" type="button" aria-label="Menu" aria-expanded="false"><i></i></button></div>'+
 megaHTML('agent')+megaHTML('features')+megaHTML('tools')+'</header>';
}
function menuHTML(){
 function grp(k){var m=MEGA[k];return '<div class="am-g"><button class="am-h'+(m.hot?' hot':'')+'" type="button" aria-expanded="false">'+(m.hot?'<i class="hd"></i>':'')+m.t+'<s></s></button><div class="am-s"><div>'+m.cols.map(function(c){return c[1].map(function(a){return '<a href="'+a[0]+'">'+a[1]+'<small>'+a[2]+'</small></a>'}).join('')}).join('')+'</div></div></div>'}
 return '<div class="amenu" id="amenu">'+grp('agent')+'<a class="am-l" href="how-it-works.html">How it works</a>'+grp('features')+grp('tools')+'<a class="am-l" href="pricing.html">Pricing</a><a class="am-l" href="learn.html">Learn</a><a class="am-l" href="compare.html">Compare</a><a class="am-l" href="changelog.html">Changelog</a>'+
 '<div class="am-b"><span class="lgw">'+langBtn('big')+'</span><a class="am-cta" href="'+APP+'">Try Phraortes free</a></div></div>';
}
function footHTML(){
 function col(t,l){return '<div><b>'+t+'</b>'+l.map(function(a){return '<a href="'+a[0]+'">'+a[1]+'</a>'}).join('')+'</div>'}
 return '<footer class="af"><div class="af-w"><div class="af-br"><a class="ab" href="index.html"><img src="https://novamind-official.github.io/icon-192.png" alt="" width="22" height="22">Phraortes</a><p>An AI that gets things done. Say it, and it happens.</p><a class="ag" href="'+APP+'">Open the app</a></div><div class="afg">'+
 col('Agent',[['agent.html#wake','Hey Phraortes'],['agent.html#console','Agent console'],['agent.html#keys','Keys'],['agent.html#shadow','Shadow'],['agent.html#premortem','Pre-Mortem'],['agent.html#imagine','Image studio']])+
 col('Product',[['features.html','Features'],['tools.html','Tools'],['how-it-works.html','How it works'],['compare.html','Compare'],['pricing.html','Pricing'],['changelog.html','Changelog']])+
 col('Learn',[['learn.html','Learn'],['learn-balance-chemical-equations.html','Balance equations'],['learn-electron-configuration.html','Electron configuration'],['learn-projectile-launch-angle.html','Projectile angle'],['learn-rc-time-constant.html','RC time constant']])+
 col('Get started',[[APP,'Open the app'],['pricing.html','Plans'],['features.html#privacy','Privacy']])+
 '</div></div><div class="af-b"><span>© Phraortes. Built entirely from a phone.</span><div class="af-r"><span class="lgw">'+langBtn('')+'</span><a href="#" id="af-top">Back to top</a></div></div></footer>';
}
/* ---- build ---- */
(function(){
 var o=document.getElementById('an');if(o)o.outerHTML=headerHTML();
 var m=document.getElementById('amenu');if(m)m.outerHTML=menuHTML();
 var f=document.querySelector('footer.af');if(f)f.outerHTML=footHTML();
 var hh=document.querySelector('body > div[hidden]');
})();
/* ---- language popover ---- */
(function(){
 var pop=document.createElement('div');pop.className='lgp';pop.setAttribute('role','menu');pop.hidden=true;document.body.appendChild(pop);
 var open=null;
 function fill(){var L=(window.PHR_I18N&&PHR_I18N.langs)||{en:{n:'English'}};pop.innerHTML=Object.keys(L).map(function(k){return '<button type="button" role="menuitemradio" data-lang-opt="'+k+'" aria-checked="'+(k===(PHR_I18N&&PHR_I18N.get?PHR_I18N.get():'en'))+'">'+L[k].n+'<i></i></button>'}).join('')}
 function close(){pop.hidden=true;if(open)open.setAttribute('aria-expanded','false');open=null}
 document.addEventListener('click',function(e){
  var b=e.target.closest&&e.target.closest('.lgb');
  if(b){e.stopPropagation();if(open===b){close();return}close();open=b;b.setAttribute('aria-expanded','true');fill();pop.hidden=false;
   var r=b.getBoundingClientRect(),w=170,left=Math.min(Math.max(8,r.right-w),innerWidth-w-8);pop.style.left=left+'px';
   var below=r.bottom+6;pop.style.top='auto';pop.style.bottom='auto';
   if(r.top>innerHeight/2){pop.style.bottom=(innerHeight-r.top+6)+'px'}else{pop.style.top=below+'px'}
   return}
  var o=e.target.closest&&e.target.closest('[data-lang-opt]');
  if(o){if(window.PHR_I18N)PHR_I18N.set(o.dataset.langOpt);close();return}
  if(open&&!pop.contains(e.target))close();
 });
 document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
 addEventListener('scroll',function(){if(open)close()},{passive:true});
})();
/* ---- header behaviour ---- */
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
function closeMenu(){if(!bg)return;bg.setAttribute('aria-expanded','false');mn.classList.remove('on');an.classList.remove('mo');document.documentElement.style.overflow=''}
document.addEventListener('keydown',function(e){if(e.key==='Escape'){shut();closeMenu()}});
if(bg)bg.addEventListener('click',function(){var o=bg.getAttribute('aria-expanded')!=='true';bg.setAttribute('aria-expanded',o);mn.classList.toggle('on',o);an.classList.toggle('mo',o);document.documentElement.style.overflow=o?'hidden':''});
if(mn){
 mn.addEventListener('click',function(e){
  var h=e.target.closest('.am-h');if(h){var g=h.parentNode,o=!g.classList.contains('open');[].forEach.call(mn.querySelectorAll('.am-g.open'),function(x){x.classList.remove('open');x.firstChild.setAttribute('aria-expanded','false')});if(o){g.classList.add('open');h.setAttribute('aria-expanded','true')}return}
  var a=e.target.closest('a');if(a&&a.getAttribute('href')&&!a.classList.contains('lgb'))closeMenu();
 });
}
addEventListener('resize',function(){if(innerWidth>860)closeMenu()});
var f=location.pathname.split('/').pop()||'index.html';[].forEach.call(an.querySelectorAll('.anl a'),function(a){if(a.getAttribute('href')===f)a.classList.add('cur')});
if(/^agent\.html$/.test(f)){var ab=an.querySelector('.anb.hot');if(ab)ab.classList.add('cur')}
var top=document.getElementById('af-top');if(top)top.addEventListener('click',function(e){e.preventDefault();scrollTo({top:0,behavior:'smooth'})});
var tk=0;function sc(){tk=0;an.classList.toggle('sc',scrollY>8)}addEventListener('scroll',function(){tk||(tk=requestAnimationFrame(sc))},{passive:true});sc();
/* ---- language system ---- */
var s=document.createElement('script');s.src='i18n.js?v=1';s.defer=true;s.onload=function(){PHR_I18N.init()};document.head.appendChild(s);
})();
