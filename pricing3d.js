/* Phraortes pricing — controller (works without WebGL) */
(function(){
'use strict';
var stage=document.getElementById('plans');if(!stage)return;
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
var tabs=[].slice.call(stage.querySelectorAll('.pr-tab')),panels=[].slice.call(stage.querySelectorAll('.pr-p')),coins=[].slice.call(stage.querySelectorAll('.pr-coin')),cols=[].slice.call(document.querySelectorAll('[data-c]'));
var PR=window.PR={sel:2,gl:false,setSel:function(i,user){
 PR.sel=i;document.documentElement.setAttribute('data-sel',i);
 tabs.forEach(function(t,k){t.setAttribute('aria-selected',k===i);t.tabIndex=k===i?0:-1});
 panels.forEach(function(p,k){p.classList.toggle('on',k===i)});
 coins.forEach(function(c,k){c.classList.toggle('on',k===i)});
 cols.forEach(function(c){c.classList.toggle('sel',+c.getAttribute('data-c')===i)})}};
stage.classList.add('pr-js');
tabs.forEach(function(t,k){t.addEventListener('click',function(){PR.setSel(k,true)});
 t.addEventListener('keydown',function(e){var d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(d){e.preventDefault();var n=(k+d+tabs.length)%tabs.length;PR.setSel(n,true);tabs[n].focus()}})});
coins.forEach(function(c,k){c.addEventListener('click',function(){PR.setSel(k,true)})});
PR.setSel(2);
/* reveal */
var rv=[].slice.call(document.querySelectorAll('.rv'));
if('IntersectionObserver' in window&&!reduce){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -6% 0px',threshold:.05});rv.forEach(function(e){io.observe(e)})}else rv.forEach(function(e){e.classList.add('in')});
/* WebGL medals */
var cv=stage.querySelector('.pr-cv'),gl=null;
function off(){stage.classList.add('pr-off')}
if(reduce){off();return}
try{gl=cv.getContext('webgl',{antialias:true,alpha:true,premultipliedAlpha:true})}catch(e){}
if(!gl){off();return}
try{(function(){
var PI=Math.PI;
function m4(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}
function mul(a,b){var o=new Float32Array(16),c,r,k,s;for(c=0;c<4;c++)for(r=0;r<4;r++){s=0;for(k=0;k<4;k++)s+=a[k*4+r]*b[c*4+k];o[c*4+r]=s}return o}
function tr(x,y,z){var o=m4();o[12]=x;o[13]=y;o[14]=z;return o}
function sc(s){var o=m4();o[0]=o[5]=o[10]=s;return o}
function rx(a){var o=m4(),c=Math.cos(a),s=Math.sin(a);o[5]=c;o[6]=s;o[9]=-s;o[10]=c;return o}
function ry(a){var o=m4(),c=Math.cos(a),s=Math.sin(a);o[0]=c;o[2]=-s;o[8]=s;o[10]=c;return o}
function rz(a){var o=m4(),c=Math.cos(a),s=Math.sin(a);o[0]=c;o[1]=s;o[4]=-s;o[5]=c;return o}
function persp(f,a,n,fa){var t=1/Math.tan(f/2),o=new Float32Array(16);o[0]=t/a;o[5]=t;o[10]=(fa+n)/(n-fa);o[11]=-1;o[14]=2*fa*n/(n-fa);return o}
function xf(m,x,y,z){return[m[0]*x+m[4]*y+m[8]*z+m[12],m[1]*x+m[5]*y+m[9]*z+m[13],m[2]*x+m[6]*y+m[10]*z+m[14]]}
function xn(m,x,y,z){var a=m[0]*x+m[4]*y+m[8]*z,b=m[1]*x+m[5]*y+m[9]*z,c=m[2]*x+m[6]*y+m[10]*z,l=Math.sqrt(a*a+b*b+c*c)||1;return[a/l,b/l,c/l]}
function clamp(x,a,b){return x<a?a:x>b?b:x}
function ss(a,b,x){x=clamp((x-a)/(b-a),0,1);return x*x*(3-2*x)}
function backOut(x){x=clamp(x,0,1);var c=1.7;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}
function fromY(d){ /* rotation taking +Y to unit vector d */
 var ux=d[2],uz=-d[0],l=Math.sqrt(ux*ux+uz*uz);if(l<1e-6)return d[1]>0?m4():rx(PI);
 ux/=l;uz/=l;var c=d[1],s=l,t=1-c,o=m4();
 o[0]=t*ux*ux+c;o[1]=s*uz;o[2]=t*ux*uz;o[4]=-s*uz;o[5]=c;o[6]=s*ux;o[8]=t*ux*uz;o[9]=-s*ux;o[10]=t*uz*uz+c;return o}

/* ---------- geometry ---------- */
function sphere(r,ws,hs){var p=[],n=[],i=[],a,b,x,y,z,k;for(a=0;a<=hs;a++){var v=a/hs*PI;for(b=0;b<=ws;b++){var u=b/ws*2*PI;x=Math.cos(u)*Math.sin(v);y=Math.cos(v);z=Math.sin(u)*Math.sin(v);p.push(x*r,y*r,z*r);n.push(x,y,z)}}
 for(a=0;a<hs;a++)for(b=0;b<ws;b++){k=a*(ws+1)+b;i.push(k,k+ws+1,k+1,k+1,k+ws+1,k+ws+2)}return{p:p,n:n,i:i}}
function cyl(r,h,seg){var p=[],n=[],i=[],b,u,c,s,k,hh=h/2;
 for(b=0;b<=seg;b++){u=b/seg*2*PI;c=Math.cos(u);s=Math.sin(u);p.push(c*r,-hh,s*r,c*r,hh,s*r);n.push(c,0,s,c,0,s)}
 for(b=0;b<seg;b++){k=b*2;i.push(k,k+1,k+2,k+1,k+3,k+2)}
 var o=p.length/3;p.push(0,hh,0);n.push(0,1,0);for(b=0;b<=seg;b++){u=b/seg*2*PI;p.push(Math.cos(u)*r,hh,Math.sin(u)*r);n.push(0,1,0)}
 for(b=0;b<seg;b++)i.push(o,o+1+b,o+2+b);
 o=p.length/3;p.push(0,-hh,0);n.push(0,-1,0);for(b=0;b<=seg;b++){u=b/seg*2*PI;p.push(Math.cos(u)*r,-hh,Math.sin(u)*r);n.push(0,-1,0)}
 for(b=0;b<seg;b++)i.push(o,o+2+b,o+1+b);return{p:p,n:n,i:i}}
function torus(R,r,ns,nt){var p=[],n=[],i=[],a,b,k;for(a=0;a<=ns;a++){var u=a/ns*2*PI;for(b=0;b<=nt;b++){var v=b/nt*2*PI,cx=Math.cos(u),sz=Math.sin(u),cv2=Math.cos(v),sv=Math.sin(v);
 p.push((R+r*cv2)*cx,r*sv,(R+r*cv2)*sz);n.push(cv2*cx,sv,cv2*sz)}}
 for(a=0;a<ns;a++)for(b=0;b<nt;b++){k=a*(nt+1)+b;i.push(k,k+nt+1,k+1,k+1,k+nt+1,k+nt+2)}return{p:p,n:n,i:i}}
function box(w,h,d){var p=[],n=[],i=[],f=[[0,0,1],[0,0,-1],[1,0,0],[-1,0,0],[0,1,0],[0,-1,0]],q,o,nn,a,b;
 for(q=0;q<6;q++){nn=f[q];a=nn[0]?[0,1,0]:[1,0,0];b=[nn[1]*a[2]-nn[2]*a[1],nn[2]*a[0]-nn[0]*a[2],nn[0]*a[1]-nn[1]*a[0]];o=p.length/3;
  [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(function(s){p.push((nn[0]+a[0]*s[0]+b[0]*s[1])*w/2,(nn[1]+a[1]*s[0]+b[1]*s[1])*h/2,(nn[2]+a[2]*s[0]+b[2]*s[1])*d/2);n.push(nn[0],nn[1],nn[2])});
  i.push(o,o+1,o+2,o,o+2,o+3)}return{p:p,n:n,i:i}}
function lathe(pr,seg){var p=[],n=[],i=[],j,b,k;for(j=0;j<pr.length;j++){var a=pr[Math.max(0,j-1)],c=pr[Math.min(pr.length-1,j+1)],dr=c[0]-a[0],dy=c[1]-a[1],l=Math.sqrt(dr*dr+dy*dy)||1,nr=dy/l,ny=-dr/l;
 for(b=0;b<=seg;b++){var u=b/seg*2*PI;p.push(Math.cos(u)*pr[j][0],pr[j][1],Math.sin(u)*pr[j][0]);n.push(Math.cos(u)*nr,ny,Math.sin(u)*nr)}}
 for(j=0;j<pr.length-1;j++)for(b=0;b<seg;b++){k=j*(seg+1)+b;i.push(k,k+seg+1,k+1,k+1,k+seg+1,k+seg+2)}return{p:p,n:n,i:i}}
function surf(nx,nz,size,fn){var p=[],n=[],i=[],a,b,e=.01;for(a=0;a<=nz;a++)for(b=0;b<=nx;b++){var x=(b/nx-.5)*size,z=(a/nz-.5)*size,y=fn(x,z),dx=fn(x+e,z)-fn(x-e,z),dz=fn(x,z+e)-fn(x,z-e),l=Math.sqrt(dx*dx+4*e*e+dz*dz);
 p.push(x,y,z);n.push(-dx/l,2*e/l,-dz/l)}
 for(a=0;a<nz;a++)for(b=0;b<nx;b++){var k=a*(nx+1)+b;i.push(k,k+nx+1,k+1,k+1,k+nx+1,k+nx+2)}return{p:p,n:n,i:i}}

function G(){this.p=[];this.n=[];this.c=[];this.m=[];this.i=[]}
G.prototype.add=function(g,M,col,mt){var o=this.p.length/3,k,v,cc;M=M||m4();
 for(k=0;k<g.p.length;k+=3){v=xf(M,g.p[k],g.p[k+1],g.p[k+2]);this.p.push(v[0],v[1],v[2]);var w=xn(M,g.n[k],g.n[k+1],g.n[k+2]);this.n.push(w[0],w[1],w[2]);
  cc=typeof col==='function'?col(v[0],v[1],v[2]):col;this.c.push(cc[0],cc[1],cc[2]);this.m.push(mt[0],mt[1],mt[2])}
 for(k=0;k<g.i.length;k++)this.i.push(o+g.i[k]);return this};
function edge(a,b,r,seg){var d=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],L=Math.sqrt(d[0]*d[0]+d[1]*d[1]+d[2]*d[2]);d=[d[0]/L,d[1]/L,d[2]/L];
 return{g:cyl(r,L,seg||8),M:mul(tr((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2),fromY(d))}}

/* ---------- shader ---------- */
var VS='attribute vec3 aP,aN,aC,aM;uniform mat4 uVP,uM;varying vec3 vW,vN,vC,vM;void main(){vec4 w=uM*vec4(aP,1.);vW=w.xyz;vN=mat3(uM)*aN;vC=aC;vM=aM;gl_Position=uVP*w;}';
var FS='precision mediump float;varying vec3 vW,vN,vC,vM;uniform vec3 uCam;uniform float uA;'+
'vec3 env(vec3 d){float y=d.y*.5+.5;vec3 c=mix(vec3(.035,.028,.02),vec3(.26,.2,.12),smoothstep(0.,1.,y));'+
'c+=vec3(1.,.92,.74)*pow(max(dot(d,normalize(vec3(.2,.9,.5))),0.),7.)*2.4;'+
'c+=vec3(1.,.82,.52)*pow(max(dot(d,normalize(vec3(-.9,.25,.4))),0.),12.)*1.8;'+
'c+=vec3(.55,.5,1.)*pow(max(dot(d,normalize(vec3(.9,-.1,.3))),0.),10.)*1.5;'+
'c+=vec3(1.,.95,.86)*pow(max(dot(d,normalize(vec3(0.,-.6,.8))),0.),18.)*.9;return c;}'+
'void main(){vec3 N=normalize(vN),V=normalize(uCam-vW);if(dot(N,V)<0.)N=-N;vec3 R=reflect(-V,N);float me=vM.x,sp=vM.y,em=vM.z;'+
'vec3 e=env(R);float fr=pow(1.-max(dot(N,V),0.),3.);float df=max(dot(N,normalize(vec3(.4,.8,.6))),0.)*.75+.25;'+
'vec3 col=mix(vC*df*.9,vC*e*1.15,me)+(1.-me)*e*sp*.32+e*fr*sp*.35+vC*em;'+
'col=col/(1.+col*.32);col=pow(col,vec3(.4545));gl_FragColor=vec4(col*uA,uA);}';
function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o}
var pg=gl.createProgram();gl.attachShader(pg,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pg,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pg);
if(!gl.getProgramParameter(pg,gl.LINK_STATUS)){off();return}
gl.useProgram(pg);
var L={aP:gl.getAttribLocation(pg,'aP'),aN:gl.getAttribLocation(pg,'aN'),aC:gl.getAttribLocation(pg,'aC'),aM:gl.getAttribLocation(pg,'aM'),
 uVP:gl.getUniformLocation(pg,'uVP'),uM:gl.getUniformLocation(pg,'uM'),uCam:gl.getUniformLocation(pg,'uCam'),uA:gl.getUniformLocation(pg,'uA')};
gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);

function mesh(g,dyn){var n=g.p.length/3,d=new Float32Array(n*12),k;
 for(k=0;k<n;k++){d.set([g.p[k*3],g.p[k*3+1],g.p[k*3+2],g.n[k*3],g.n[k*3+1],g.n[k*3+2],g.c[k*3],g.c[k*3+1],g.c[k*3+2],g.m[k*3],g.m[k*3+1],g.m[k*3+2]],k*12)}
 var vb=gl.createBuffer(),ib=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,d,dyn?gl.DYNAMIC_DRAW:gl.STATIC_DRAW);
 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(g.i),gl.STATIC_DRAW);return{vb:vb,ib:ib,n:g.i.length,d:d,cnt:n}}
function draw(ms,M,alpha){gl.bindBuffer(gl.ARRAY_BUFFER,ms.vb);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ms.ib);
 [['aP',0],['aN',3],['aC',6],['aM',9]].forEach(function(a){gl.enableVertexAttribArray(L[a[0]]);gl.vertexAttribPointer(L[a[0]],3,gl.FLOAT,false,48,a[1]*4)});
 gl.uniformMatrix4fv(L.uM,false,M);gl.uniform1f(L.uA,alpha==null?1:alpha);gl.drawElements(gl.TRIANGLES,ms.n,gl.UNSIGNED_SHORT,0)}

/* ---------- palette ---------- */
var GOLD=[1,.76,.34],GOLD2=[.95,.62,.2],WHITE=[.95,.95,.97],DARK=[.07,.08,.1],VIO=[.5,.4,.95],AMB=[.95,.55,.12];
var MET=[1,1,0],MAT=[.55,1,0],DIEL=[0,.9,0],GLOW=[0,.5,1.2];
function Obj(){this.parts=[]}
Obj.prototype.part=function(g,alpha,anim){var ms=mesh(g);this.parts.push({ms:ms,alpha:alpha==null?1:alpha,anim:anim});return this};
/* ---------- plan medals ---------- */
function poly(V,r){var n=V.length,d=1e9,i,j,k,F=[],g={p:[],n:[],i:[]};
 function dist(a,b){return Math.hypot(V[a][0]-V[b][0],V[a][1]-V[b][1],V[a][2]-V[b][2])}
 for(i=0;i<n;i++)for(j=i+1;j<n;j++)d=Math.min(d,dist(i,j));
 for(i=0;i<n;i++)for(j=i+1;j<n;j++)for(k=j+1;k<n;k++)if(Math.abs(dist(i,j)-d)<1e-3&&Math.abs(dist(i,k)-d)<1e-3&&Math.abs(dist(j,k)-d)<1e-3)F.push([i,j,k]);
 var R=Math.hypot(V[0][0],V[0][1],V[0][2]),s=r/R;
 F.forEach(function(f){var a=V[f[0]],b=V[f[1]],c=V[f[2]],u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],
  nn=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
  if(nn[0]*(a[0]+b[0]+c[0])+nn[1]*(a[1]+b[1]+c[1])+nn[2]*(a[2]+b[2]+c[2])<0){var t=b;b=c;c=t;nn=[-nn[0],-nn[1],-nn[2]]}
  var l=Math.hypot(nn[0],nn[1],nn[2])||1,o=g.p.length/3;
  [a,b,c].forEach(function(q){g.p.push(q[0]*s,q[1]*s,q[2]*s);g.n.push(nn[0]/l,nn[1]/l,nn[2]/l)});g.i.push(o,o+1,o+2)});
 return g}
var PHI=(1+Math.sqrt(5))/2;
var SOL={
 tetra:poly([[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]],.4),
 octa:poly([[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],.42),
 icosa:poly([[0,1,PHI],[0,1,-PHI],[0,-1,PHI],[0,-1,-PHI],[1,PHI,0],[1,-PHI,0],[-1,PHI,0],[-1,-PHI,0],[PHI,0,1],[PHI,0,-1],[-PHI,0,1],[-PHI,0,-1]],.44),
 cube:box(.46,.46,.46)};
var PLANS=[
 {rim:[.86,.89,.96],face:[.13,.14,.17],em:[.9,.92,1],solid:'tetra',pips:1,spin:[.7,.4]},
 {rim:[.96,.6,.44],face:[.15,.1,.09],em:[1,.68,.5],solid:'cube',pips:2,spin:[.6,.5]},
 {rim:GOLD,face:[.12,.1,.06],em:[1,.84,.42],solid:'octa',pips:3,spin:[.8,.3]},
 {rim:[1,.8,.42],face:[.04,.04,.075],em:[.78,.68,1],solid:'icosa',pips:4,spin:[.5,.35],max:true}];
var F0=rx(PI/2);
function medal(p){var o=new Obj('',''),g=new G(),k;
 g.add(torus(.95,.075,72,14),F0,p.rim,MET);
 g.add(lathe([[0,-.05],[.9,-.05],[.9,.05],[0,.05]],72),F0,p.face,[.55,.85,0]);
 g.add(torus(.66,.02,64,8),mul(F0,tr(0,.052,0)),p.rim,MET);g.add(torus(.66,.02,64,8),mul(F0,tr(0,-.052,0)),p.rim,MET);
 g.add(torus(.78,.01,64,8),mul(F0,tr(0,.052,0)),p.rim,MET);
 for(k=0;k<60;k++){var a=k/60*2*PI,L=k%5?.045:.09;g.add(box(.014,.012,L),mul(F0,mul(ry(a),tr(0,.056,-.85+L/2-.02))),p.rim,MET)}
 for(k=0;k<p.pips;k++){g.add(sphere(.045,12,8),mul(F0,tr((k-(p.pips-1)/2)*.15,.07,.6)),p.em,[1,1,p.max?.3:.05])}
 o.part(g);
 var e=new G();e.add(SOL[p.solid],m4(),p.em,[1,1,p.max?.22:.04]);
 var sp=p.spin;o.part(e,1,function(t){return mul(tr(0,0,.5),mul(rx(t*sp[1]+.5),ry(t*sp[0])))});
 if(p.max){var r=new G();r.add(torus(.56,.014,64,8),m4(),[.6,.5,1],GLOW);o.part(r,1,function(t){return mul(tr(0,0,.5),mul(rx(1.15),rz(t*.9)))});
  var r2=new G();r2.add(torus(.64,.01,64,8),m4(),[1,.8,.42],GLOW);o.part(r2,1,function(t){return mul(tr(0,0,.5),mul(rx(-.9),ry(.6),rz(-t*.7)))})}
 return o}
var M=PLANS.map(medal);M.forEach(function(o,k){o.s=0;o.spin=0;o.vel=0;o.tx=0;o.ty=0;o.tgx=0;o.tgy=0;o.sel=0;o.pop=0;o.cx=0;o.cy=0;o.sx=0;o.sy=0;o.sr=40;o.k=k});
var W=1,H=1,asp=1,fov=.6,dist=9,halfW=4,halfH=3,dpr=1,slots=[],S=1;
function resize(){var r=cv.getBoundingClientRect();dpr=Math.min(window.devicePixelRatio||1,2);W=Math.max(2,r.width);H=Math.max(2,r.height);cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);gl.viewport(0,0,cv.width,cv.height);
 asp=W/H;halfH=Math.tan(fov/2)*dist;halfW=halfH*asp;
 if(asp>2.3){S=Math.min(halfW/2,2*halfH)*.33;slots=[-.75,-.25,.25,.75].map(function(f){return[f*halfW,0]})}
 else{S=Math.min(halfW,halfH)*.33;slots=[[-.5*halfW,.5*halfH],[.5*halfW,.5*halfH],[-.5*halfW,-.5*halfH],[.5*halfW,-.5*halfH]]}}
addEventListener('resize',resize);
function pick(x,y){var best=-1,bd=1e9;M.forEach(function(o,k){var d=Math.hypot(x-o.sx,y-o.sy);if(d<o.sr*1.08&&d<bd){bd=d;best=k}});return best}
var drag=null,hov=-1;
function pos(e){var r=cv.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]}
cv.addEventListener('pointerdown',function(e){var q=pos(e),k=pick(q[0],q[1]);drag={id:e.pointerId,lx:e.clientX,moved:0,k:k,x:q[0],y:q[1],t:performance.now()};if(k>=0){try{cv.setPointerCapture(e.pointerId)}catch(_){}}});
cv.addEventListener('pointermove',function(e){var q=pos(e);
 if(drag&&e.pointerId===drag.id){var dx=e.clientX-drag.lx;drag.lx=e.clientX;drag.moved+=Math.abs(dx);if(drag.k>=0){var o=M[drag.k];o.spin+=dx*.014;o.vel=dx*.014*60}}
 hov=pick(q[0],q[1]);cv.style.cursor=hov>=0?(drag?'grabbing':'grab'):'default';
 M.forEach(function(o,k){if(k===hov){o.tgx=clamp((q[0]-o.sx)/o.sr,-1,1)*.5;o.tgy=clamp((q[1]-o.sy)/o.sr,-1,1)*.38}else{o.tgx=0;o.tgy=0}})});
function end(e){if(drag&&(!e||e.pointerId===drag.id)){if(drag.k>=0&&drag.moved<8){M[drag.k].pop=1;PR.setSel(drag.k,true)}drag=null}}
cv.addEventListener('pointerup',function(e){end(e);if(e.pointerType!=='mouse')M.forEach(function(o){o.tgx=0;o.tgy=0})});
cv.addEventListener('pointercancel',function(){drag=null;M.forEach(function(o){o.tgx=0;o.tgy=0})});
cv.addEventListener('pointerleave',function(){hov=-1;M.forEach(function(o){o.tgx=0;o.tgy=0})});
var vis=true,raf=0,t0=performance.now(),last=t0,VP=m4();
function frame(now){raf=0;if(!vis)return;var dt=Math.min(.05,(now-last)/1000);last=now;var time=(now-t0)/1000;
 var proj=persp(fov,asp,.1,60);VP=mul(proj,tr(0,0,-dist));
 gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(pg);gl.uniformMatrix4fv(L.uVP,false,VP);gl.uniform3f(L.uCam,0,0,dist);gl.depthMask(true);
 M.forEach(function(o,k){var ap=backOut((time-.12-k*.12)/.8),isSel=PR.sel===k?1:0;o.s+=(ap-o.s)*Math.min(1,dt*10);o.sel+=(isSel-o.sel)*Math.min(1,dt*7);o.pop*=1-Math.min(1,dt*6);
  var dragging=drag&&drag.k===k&&drag.moved>=2;
  if(!dragging){o.vel*=1-Math.min(1,dt*2.2);o.spin+=o.vel*dt;var tg=Math.round(o.spin/(2*PI))*2*PI;if(Math.abs(o.vel)<1.5)o.spin+=(tg-o.spin)*Math.min(1,dt*2.6)}
  o.tx+=(o.tgx-o.tx)*Math.min(1,dt*8);o.ty+=(o.tgy-o.ty)*Math.min(1,dt*8);
  var rock=Math.sin(time*.75+k*1.7)*.3*(1-.55*o.sel),tilt=Math.sin(time*.6+k)*.06;
  var scl=Math.max(.0001,o.s)*S*(.92+.16*o.sel+.06*o.pop),px=slots[k][0],py=slots[k][1]+Math.sin(time*.9+k*2)*.05*S,pz=o.sel*.8;
  var base=mul(tr(px,py,pz),mul(rx(o.ty-.1+tilt),mul(ry(rock+o.spin+o.tx),sc(scl))));
  var cl=[px,py,pz],cxw=VP[0]*cl[0]+VP[4]*cl[1]+VP[8]*cl[2]+VP[12],cyw=VP[1]*cl[0]+VP[5]*cl[1]+VP[9]*cl[2]+VP[13],cww=VP[3]*cl[0]+VP[7]*cl[1]+VP[11]*cl[2]+VP[15];
  o.sx=(cxw/cww*.5+.5)*W;o.sy=(1-(cyw/cww*.5+.5))*H;o.sr=1.0*scl/cww*H/(2*Math.tan(fov/2));
  if(o.s<.01)return;
  o.parts.forEach(function(pt){draw(pt.ms,pt.anim?mul(base,pt.anim(time)):base,1)})});
 raf=requestAnimationFrame(frame)}
function start(){if(!raf&&vis){last=performance.now();raf=requestAnimationFrame(frame)}}
if('IntersectionObserver' in window)new IntersectionObserver(function(en){vis=en[0].isIntersecting&&!document.hidden;if(vis)start()},{rootMargin:'80px'}).observe(cv);
document.addEventListener('visibilitychange',function(){vis=!document.hidden;if(vis)start()});
resize();start();window.PR.gl=true;

})()}catch(err){off();if(window.console)console.warn("pricing3d",err)}
})();
