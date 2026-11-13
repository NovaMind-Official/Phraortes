/* Phraortes hero — a dependency-free WebGL scene.
   A gold ribbon knot unties on scroll, becomes a ring, and six touchable 3D objects ride on it. */
(function(){
'use strict';
var root=document.getElementById('overview');
if(!root||!root.classList.contains('h3'))return;
var cv=root.querySelector('.h3-cv'),gl=null,fb=document.querySelector('.h3-fb');
function off(){root.classList.add('h3-off');root.id='overview-3d';if(fb){fb.id='overview';fb.classList.add('on')}}
try{gl=cv.getContext('webgl',{antialias:true,alpha:true,premultipliedAlpha:true,powerPreference:'high-performance'})}catch(e){}
if(!gl||matchMedia('(prefers-reduced-motion:reduce)').matches){off();return}

/* ---------- math ---------- */
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

/* ---------- the six objects ---------- */
function Obj(name,desc){this.name=name;this.desc=desc;this.parts=[];this.s=0;this.spin=0;this.tilt=.35;this.vel=0;this.sx=0;this.sy=0;this.sr=40}
Obj.prototype.part=function(g,alpha,anim){var ms=mesh(g);this.parts.push({ms:ms,alpha:alpha==null?1:alpha,anim:anim});return this};

function flask(){var o=new Obj('Chemistry Lab','Volcanoes, acids, metals and titrations. Add reagents and watch the reaction happen.'),g=new G(),gl2=new G();
 var out=[[0,-.82],[.5,-.82],[.68,-.76],[.74,-.7],[.3,.28],[.27,.62],[.36,.7],[.36,.78],[.27,.78]],
     liq=[[0,-.78],[.5,-.78],[.64,-.72],[.69,-.67],[.52,-.3],[0,-.3]];
 gl2.add(lathe(out,36),null,[.75,.85,.95],[0,1.2,0]);
 g.add(lathe(liq,36),null,AMB,[0,.9,.55]);
 g.add(torus(.3,.03,24,8),tr(0,.7,0),GOLD,MET);
 g.add(sphere(.07,10,8),tr(.12,-.1,.2),[1,.9,.6],GLOW);g.add(sphere(.05,10,8),tr(-.15,-.42,.18),[1,.9,.6],GLOW);
 for(var k=0;k<4;k++){var y=-.4+k*.17;g.add(box(.06,.012,.02),tr(.48-k*.06,y,.15+k*.04),WHITE,DIEL)}
 return o.part(g).part(gl2,.3)}
function geometry(){var o=new Obj('Geometry','Drag any corner. Angles, sides and the circle follow, exactly.'),g=new G(),gl2=new G(),
 V=[[0,.72,0],[-.7,-.4,.3],[.7,-.4,.3],[0,-.4,-.66]],E=[[0,1],[0,2],[0,3],[1,2],[2,3],[3,1]];
 E.forEach(function(e){var d=edge(V[e[0]],V[e[1]],.03,8);g.add(d.g,d.M,GOLD,MET)});
 V.forEach(function(v,k){g.add(sphere(.085,14,10),tr(v[0],v[1],v[2]),k?WHITE:GOLD,k?MAT:MET)});
 gl2.add({p:[].concat(V[0],V[1],V[2]),n:[0,.3,1,0,.3,1,0,.3,1],i:[0,1,2]},null,VIO,[0,1,.2]);
 gl2.add({p:[].concat(V[0],V[2],V[3]),n:[1,.5,-.2,1,.5,-.2,1,.5,-.2],i:[0,1,2]},null,[.3,.6,1],[0,1,.2]);
 g.add(torus(.18,.012,24,6),mul(tr(.7,-.4,.3),rx(PI/2)),[1,.55,.5],MET);
 return o.part(g).part(gl2,.42)}
function atom(){var o=new Obj('Atoms','Electron shells and the periodic table, turned in your hand.'),g=new G(),R=.78,rings=[];
 g.add(sphere(.2,24,16),null,GOLD,[.8,1,.5]);
 for(var j=0;j<3;j++){var M=mul(ry(j*PI/3),rx(1.05));rings.push(M);g.add(torus(R,.016,60,6),M,[.9,.9,1],MAT)}
 o.part(g);
 for(j=0;j<3;j++)(function(j){var e=new G().add(sphere(.07,12,8),null,WHITE,GLOW);
  o.part(e,1,function(t){var a=t*(1.5+j*.45)+j*2.1,p=xf(rings[j],Math.cos(a)*R,0,Math.sin(a)*R);return tr(p[0],p[1],p[2])})})(j);
 return o}
function chip(){var o=new Obj('Circuits','Build it, power it, break it, and see exactly why.'),g=new G();
 g.add(box(1,.12,1),null,DARK,[.7,1,0]);
 g.add(box(.62,.04,.62),tr(0,.08,0),[.14,.15,.19],[.9,1,0]);
 g.add(box(.3,.03,.3),tr(0,.11,0),GOLD,[1,1,.25]);
 for(var k=0;k<7;k++){var x=-.39+k*.13;[[x,0,.56],[x,0,-.56]].forEach(function(p){g.add(box(.06,.03,.14),tr(p[0],0,p[2]),GOLD,MET)});[[.56,0,x],[-.56,0,x]].forEach(function(p){g.add(box(.14,.03,.06),tr(p[0],0,p[2]),GOLD,MET)})}
 for(k=0;k<5;k++){g.add(box(.012,.006,.2+k*.02),tr(-.2+k*.1,.101,.38),GOLD2,GLOW);g.add(box(.2+k*.02,.006,.012),tr(.38,.101,-.2+k*.1),GOLD2,GLOW)}
 return o.part(g)}
function graph3(){var o=new Obj('Graphs','Any function, plotted and traceable, in two or three dimensions.'),g=new G();
 var fn=function(x,z){var r=Math.sqrt(x*x+z*z)*5.2;return .52*Math.sin(r)/(r+.5)*2.1};
 g.add(surf(34,34,1.5,fn),tr(0,.05,0),function(x,y,z){var h=clamp((y+.2)/.7,0,1);return[.42+.58*h,.34+.42*h,.95-.62*h]},[.55,.9,.25]);
 [[[-.8,-.3,-.8],[.8,-.3,-.8]],[[-.8,-.3,-.8],[-.8,-.3,.8]],[[-.8,-.3,-.8],[-.8,.5,-.8]]].forEach(function(e){var d=edge(e[0],e[1],.016,6);g.add(d.g,d.M,[.85,.85,.9],MAT)});
 return o.part(g)}
function benzene(){var o=new Obj('Molecules','Real 3D structures from a name, a formula or a photo.'),g=new G(),C=[],H=[],k;
 for(k=0;k<6;k++){var a=k/6*2*PI;C.push([Math.cos(a)*.52,0,Math.sin(a)*.52]);H.push([Math.cos(a)*.98,0,Math.sin(a)*.98])}
 for(k=0;k<6;k++){var n=(k+1)%6,d=edge(C[k],C[n],.034,8);g.add(d.g,d.M,[.75,.76,.8],MAT);d=edge(C[k],H[k],.024,8);g.add(d.g,d.M,[.75,.76,.8],MAT);
  g.add(sphere(.15,18,12),tr(C[k][0],0,C[k][2]),[.16,.17,.2],[.9,1,0]);g.add(sphere(.085,14,10),tr(H[k][0],0,H[k][2]),WHITE,MAT)}
 g.add(torus(.3,.014,40,6),null,GOLD,MET);
 return o.part(g)}
function stopwatch(){var o=new Obj('Timed Exams','A real clock, a real score, and a study plan built from what you missed.'),g=new G(),gl2=new G(),F=rx(PI/2);
 g.add(torus(.6,.05,48,10),F,GOLD,MET);
 g.add(lathe([[0,-.03],[.58,-.03],[.58,.03],[0,.03]],44),F,[.1,.11,.14],[.4,.9,0]);
 for(var k=0;k<12;k++){var a=k/12*2*PI,L=k%3?.05:.1;g.add(box(.02,.012,L),mul(F,mul(ry(a),tr(0,.04,-.5+L/2))),WHITE,MAT)}
 g.add(box(.035,.012,.3),mul(F,mul(ry(.9),tr(0,.05,-.15))),WHITE,MAT);
 g.add(cyl(.09,.14,16),mul(F,tr(0,.02,-.74)),GOLD,MET);g.add(cyl(.04,.12,12),mul(F,tr(0,.02,-.66)),GOLD2,MET);
 g.add(box(.08,.014,.14),mul(F,tr(0,.03,-.5)),[.35,.8,.55],[.8,.9,.4]);
 o.part(g);
 var h=new G().add(box(.014,.012,.46),mul(F,tr(0,.065,-.2)),[1,.4,.35],GLOW).add(sphere(.04,10,8),mul(F,tr(0,.065,0)),GOLD,MET);
 o.part(h,1,function(t){return mul(F,mul(ry(t*1.6),rx(-PI/2)))});
 return o}
function kmap(){var o=new Obj('Knowledge Maps','A whole topic as a living map. Tap any node to go deeper.'),g=new G(),
 P=[[0,0,0],[.75,.35,.1],[-.72,.4,-.1],[.2,-.78,.2],[-.3,-.62,-.35],[.62,-.4,-.4],[-.05,.82,.25]],E=[[0,1],[0,2],[0,3],[0,6],[3,4],[1,5],[2,4]];
 E.forEach(function(e){var d=edge(P[e[0]],P[e[1]],.022,8);g.add(d.g,d.M,[.75,.76,.82],MAT)});
 P.forEach(function(p,k){g.add(sphere(k?.12:.2,18,12),tr(p[0],p[1],p[2]),k?(k%3===0?VIO:WHITE):GOLD,k?MAT:MET)});
 g.add(torus(.3,.012,40,6),mul(rx(PI/2),tr(0,0,0)),GOLD2,MET);
 return o.part(g)}
function terminal(){var o=new Obj('Python Computer','A computer inside the chat. It runs code, keeps files, and fixes its own errors.'),g=new G();
 g.add(box(1.3,.9,.07),null,[.09,.1,.13],[.5,.95,0]);
 g.add(box(1.16,.76,.02),tr(0,0,.045),[.04,.045,.06],[.2,.9,0]);
 g.add(box(1.3,.08,.07),tr(0,.49,0),GOLD,MET);[-.52,-.44,-.36].forEach(function(x,k){g.add(sphere(.025,8,6),tr(x,.49,.045),k?WHITE:AMB,GLOW)});
 var rows=[[.55,.3],[.8,.24],[.35,.18],[.62,.12],[.28,0],[.7,-.1],[.2,-.22]],y;
 rows.forEach(function(r,k){g.add(box(r[0],.04,.012),tr(-.5+r[0]/2,r[1],.06),k%3?GOLD2:[.6,.85,1],GLOW)});
 g.add(box(.06,.08,.012),tr(-.46,-.4,.06),WHITE,GLOW);
 g.add(box(.4,.07,.5),tr(0,-.52,.2),[.12,.13,.16],MAT);
 return o.part(g)}
function mission(){var o=new Obj('Missions','Hand it a big goal. It plans the steps and works through them.'),g=new G();
 for(var k=0;k<4;k++){g.add(box(.46,.14+k*.2,.5),tr(-.7+k*.46,-.45+(.14+k*.2)/2-.07+0,0),k===3?GOLD:[.2+k*.1,.21+k*.1,.26+k*.08],k===3?MET:MAT)}
 g.add(box(.025,.62,.025),tr(.68,.55,0),WHITE,MAT);g.add(box(.3,.18,.012),tr(.83,.78,0),VIO,[.4,.9,.5]);g.add(sphere(.05,10,8),tr(.68,.88,0),GOLD,MET);
 return o.part(g)}
function research(){var o=new Obj('Deep Research','Dozens of sources, read and checked. Every claim shows its evidence.'),g=new G(),gl2=new G(),F=rx(PI/2);
 g.add(torus(.45,.06,48,10),F,GOLD,MET);
 var d=edge([.32,-.32,0],[.82,-.82,0],.075,12);g.add(d.g,d.M,[.18,.19,.23],MAT);g.add(torus(.08,.02,16,6),tr(.4,-.4,0),GOLD2,MET);
 for(var k=0;k<5;k++){g.add(box(.5-k*.07,.03,.012),tr(-.05+(k%2)*.03,.22-k*.12,-.04),[.85,.88,.95],MAT)}
 gl2.add(lathe([[0,-.02],[.43,-.02],[.43,.02],[0,.02]],40),F,[.7,.85,1],[.3,.8,0]);
 return o.part(g).part(gl2,.3)}
function cards(){var o=new Obj('Smart Cards','Spaced review that remembers when you will forget.'),g=new G();
 for(var k=0;k<5;k++){var c=k===4?GOLD:(k%2?[.9,.9,.95]:[.42,.4,.78]);g.add(box(1.05,.045,.72),mul(tr(0,-.34+k*.17,0),ry(-.5+k*.22)),c,k===4?MET:MAT)}
 g.add(box(.5,.01,.04),mul(tr(0,.355,.0),ry(-.5+4*.22)),[.15,.1,.02],MAT);g.add(box(.3,.01,.04),mul(tr(.1,.355,.1),ry(-.5+4*.22)),[.15,.1,.02],MAT);
 return o.part(g)}
var OBJ=[flask(),stopwatch(),geometry(),kmap(),atom(),terminal(),chip(),mission(),graph3(),research(),benzene(),cards()];var NO=OBJ.length;

/* ---------- ribbon ---------- */
var N=300,rib=(function(){var g={p:[],n:[],c:[],m:[],i:[]},k;for(k=0;k<N;k++){var t=k/(N-1),sh2=.9+.1*Math.sin(t*28);for(var s=0;s<2;s++){g.p.push(0,0,0);g.n.push(0,0,1);g.c.push(GOLD[0]*sh2,GOLD[1]*sh2,GOLD[2]*sh2);g.m.push(1,1,0)}}
 for(k=0;k<N-1;k++){var a=k*2;g.i.push(a,a+1,a+2,a+1,a+3,a+2)}return mesh(g,true)})();
var cx=new Float32Array(N),cy=new Float32Array(N),cz=new Float32Array(N);
function sm(x){return x<=0?0:x>=1?1:x*x*(3-2*x)}
function buildRibbon(time,s1,s2,Lh,R,ly){
 var i,t,a,q1,q2,kx,ky,kz,lx,lyy,lz,ra,X,Y,Z;
 for(i=0;i<N;i++){t=i/(N-1);a=.14+t*(2*PI-.28);
  kx=(Math.sin(a)+2*Math.sin(2*a))*.62;ky=(Math.cos(a)-2*Math.cos(2*a))*.62;kz=-Math.sin(3*a)*.62;
  lx=(t-.5)*2*Lh;lyy=ly+Math.sin(t*14+time*1.2)*.09;lz=Math.cos(t*9+time)*.05;
  ra=t*2*PI*.985+.5+time*.1;
  q1=sm(s1*1.75-t*.75);q2=sm(s2*1.75-(1-t)*.75);
  X=kx+(lx-kx)*q1;Y=ky+(lyy-ky)*q1;Z=kz+(lz-kz)*q1;
  cx[i]=X+(Math.cos(ra)*R-X)*q2;cy[i]=Y+(Math.sin(ra)*R-Y)*q2;cz[i]=Z+(Math.sin(ra*3)*.1-Z)*q2}
 var d=rib.d,nx=0,ny=0,nz=1,pn=[0,0,1];
 for(i=0;i<N;i++){var i0=Math.max(0,i-1),i1=Math.min(N-1,i+1),tx=cx[i1]-cx[i0],ty=cy[i1]-cy[i0],tz=cz[i1]-cz[i0],tl=Math.sqrt(tx*tx+ty*ty+tz*tz)||1;tx/=tl;ty/=tl;tz/=tl;
  var dp=pn[0]*tx+pn[1]*ty+pn[2]*tz;nx=pn[0]-tx*dp;ny=pn[1]-ty*dp;nz=pn[2]-tz*dp;var nl=Math.sqrt(nx*nx+ny*ny+nz*nz)||1;nx/=nl;ny/=nl;nz/=nl;pn=[nx,ny,nz];
  t=i/(N-1);var q2b=sm(s2*1.75-(1-t)*.75),th=t*4+time*.4;th*=1-.75*q2b;var c=Math.cos(th),s=Math.sin(th),bx=ty*nz-tz*ny,by=tz*nx-tx*nz,bz=tx*ny-ty*nx,
   wx=nx*c+bx*s,wy=ny*c+by*s,wz=nz*c+bz*s,hw=.21*(.3+.7*Math.sqrt(Math.min(1,t*9,(1-t)*9))),
   fx=ty*wz-tz*wy,fy=tz*wx-tx*wz,fz=tx*wy-ty*wx,k=i*24;
  d[k]=cx[i]+wx*hw;d[k+1]=cy[i]+wy*hw;d[k+2]=cz[i]+wz*hw;d[k+3]=fx;d[k+4]=fy;d[k+5]=fz;
  d[k+12]=cx[i]-wx*hw;d[k+13]=cy[i]-wy*hw;d[k+14]=cz[i]-wz*hw;d[k+15]=fx;d[k+16]=fy;d[k+17]=fz}
 gl.bindBuffer(gl.ARRAY_BUFFER,rib.vb);gl.bufferSubData(gl.ARRAY_BUFFER,0,d)}

/* ---------- state, layout, input ---------- */
var W=1,H=1,asp=1,fov=.62,dist=9.5,port=false,dpr=1,oy=0,ox=0,halfW=4,halfH=3;
function resize(){var r=cv.getBoundingClientRect();dpr=Math.min(window.devicePixelRatio||1,innerWidth<700?2:1.75);W=Math.max(2,r.width);H=Math.max(2,r.height);cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);gl.viewport(0,0,cv.width,cv.height);
 asp=W/H;port=asp<.9;dist=9.5/Math.min(1,asp/.78);halfH=Math.tan(fov/2)*dist;halfW=halfH*asp;ox=port?0:halfW*.27;oy=port?-halfH*.1:-halfH*.04}
var p=0,pS=0,uy=0,ux=0,drag=null,sel=-1,selT=0,lastTouch=-9,vis=true,raf=0,t0=performance.now(),last=t0,phase=-1;
var phs=root.querySelectorAll('.h3-ph'),card=root.querySelector('.h3-card'),kEl=root.querySelector('#h3k'),dEl=root.querySelector('#h3d'),dots=[].slice.call(root.querySelectorAll('.h3-dots button'));
function setSel(k,fromUser){sel=k;if(fromUser)lastTouch=performance.now()/1000;
 if(k>=0){kEl.textContent=OBJ[k].name;dEl.textContent=OBJ[k].desc}dots.forEach(function(b,i){b.setAttribute('aria-pressed',i===k)})}
dots.forEach(function(b,i){b.addEventListener('click',function(){setSel(i,true)})});
function pick(x,y){var best=-1,bd=1e9;OBJ.forEach(function(o,k){if(o.s<.5)return;var d=Math.hypot(x-o.sx,y-o.sy);if(d<Math.max(o.sr*1.25,28)&&d<bd){bd=d;best=k}});return best}
cv.addEventListener('pointerdown',function(e){var r=cv.getBoundingClientRect();drag={x:e.clientX,y:e.clientY,lx:e.clientX,ly:e.clientY,moved:0,rx:e.clientX-r.left,ry:e.clientY-r.top,id:e.pointerId};try{cv.setPointerCapture(e.pointerId)}catch(_){}});
cv.addEventListener('pointermove',function(e){if(!drag||e.pointerId!==drag.id)return;var dx=e.clientX-drag.lx,dy=e.clientY-drag.ly;drag.lx=e.clientX;drag.ly=e.clientY;drag.moved+=Math.abs(dx)+Math.abs(dy);lastTouch=performance.now()/1000;
 if(sel>=0&&p>.72){var o=OBJ[sel];o.spin+=dx*.011;o.vel=dx*.011*60;if(e.pointerType==='mouse')o.tilt=clamp(o.tilt+dy*.008,-1.2,1.2)}else{uy+=dx*.008;if(e.pointerType==='mouse')ux=clamp(ux+dy*.006,-.8,.8)}});
function up(e){if(!drag||(e&&e.pointerId!==drag.id))return;if(drag.moved<8&&p>.72){var k=pick(drag.rx,drag.ry);if(k>=0)setSel(k,true)}drag=null}
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',function(){drag=null});
addEventListener('resize',resize);

/* ---------- frame ---------- */
var VP=m4(),cam=[0,0,9.5];
function frame(now){raf=0;if(!vis)return;var dt=Math.min(.05,(now-last)/1000);last=now;var time=(now-t0)/1000;
 var r=root.getBoundingClientRect(),span=r.height-innerHeight;p=span>0?clamp(-r.top/span,0,1):0;pS+=(p-pS)*Math.min(1,dt*7);
 var s1=ss(.1,.44,pS),s2=ss(.48,.78,pS),ring=ss(.62,.8,pS);
 var ph=pS<.1?0:pS<.44?1:pS<.72?2:3;if(ph!==phase){phase=ph;[].forEach.call(phs,function(el,i){el.classList.toggle('on',i===ph)});root.classList.toggle('h3-p3',ph===3)}
 root.style.setProperty('--hp',pS.toFixed(3));
 if(ph===3){if(sel<0)setSel(0,false);if(time-lastTouch>5&&time-selT>3.6){selT=time;setSel((sel+1)%6,false)}}
 if(!drag){uy*=1-Math.min(1,dt*(sel>=0&&ph===3?5:2.2));ux*=1-Math.min(1,dt*2.5)}
 var Lh=Math.max(1.6,halfW*.88-Math.abs(ox)),R=port?halfW*.62:Math.min(halfH*.5,halfW*.4,2.6),ly=port?halfH*.1:halfH*.05;
 buildRibbon(time,s1,s2,Lh,R,ly);
 var spin=time*.36*(1-ss(.04,.42,pS)),yaw=spin+uy+Math.sin(time*.5)*.06*s2,pit=-.12*s2+ux+(1-s1)*.18;
 var Wm=mul(tr(ox,oy-(port?halfH*.3*(1-s1):0),0),mul(rx(pit),ry(yaw)));
 cam[2]=dist;var proj=persp(fov,asp,.1,60);VP=mul(proj,tr(0,0,-dist));
 gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(pg);gl.uniformMatrix4fv(L.uVP,false,VP);gl.uniform3f(L.uCam,0,0,dist);gl.depthMask(true);
 draw(rib,Wm,1);
 var glass=[];
 OBJ.forEach(function(o,k){var sa=-PI/2+k*2*PI/NO+time*.1,ap=backOut((pS-(.64+k*(.22/NO)))/.12),sel_=sel===k&&ph===3?1:0;o.s+=(ap-o.s)*Math.min(1,dt*10);
  o.sel=(o.sel||0)+(sel_-(o.sel||0))*Math.min(1,dt*7);
  o.vel*=1-Math.min(1,dt*3);if(!drag||sel!==k)o.spin+=dt*(.5+o.vel*.0);o.spin+=o.vel*dt*.0;
  var scl=Math.max(.0001,o.s)*(port?.6:.78)*(NO>8?.82:1)*(1+.2*o.sel),px=Math.cos(sa)*R,py=Math.sin(sa)*R,pz=o.sel*.9;
  var base=mul(Wm,mul(tr(px,py,pz),mul(rx(o.tilt*(1-.4*o.sel)),mul(ry(o.spin),sc(scl)))));
  var cp=xf(Wm,px,py,pz),cl=[cp[0],cp[1],cp[2],1],cxw=VP[0]*cl[0]+VP[4]*cl[1]+VP[8]*cl[2]+VP[12],cyw=VP[1]*cl[0]+VP[5]*cl[1]+VP[9]*cl[2]+VP[13],cww=VP[3]*cl[0]+VP[7]*cl[1]+VP[11]*cl[2]+VP[15];
  o.sx=(cxw/cww*.5+.5)*W;o.sy=(1-(cyw/cww*.5+.5))*H;o.sr=.9*scl/(cww)*H/(2*Math.tan(fov/2));
  if(o.s<.01)return;
  o.parts.forEach(function(pt){var M=pt.anim?mul(base,pt.anim(time)):base;if(pt.alpha<1)glass.push([pt.ms,M,pt.alpha]);else draw(pt.ms,M,1)})});
 gl.depthMask(false);glass.forEach(function(g){draw(g[0],g[1],g[2])});gl.depthMask(true);
 raf=requestAnimationFrame(frame)}
function start(){if(!raf&&vis){last=performance.now();raf=requestAnimationFrame(frame)}}
if('IntersectionObserver' in window)new IntersectionObserver(function(en){vis=en[0].isIntersecting&&!document.hidden;if(vis)start()},{rootMargin:'120px'}).observe(root);
document.addEventListener('visibilitychange',function(){vis=!document.hidden;if(vis)start()});
resize();start();
window.PHR_H3={setP:function(v){/* test hook */},obj:OBJ};
})();

/* v23 — Coach & Mission interactions */
(function(){try{
  var q=function(s){return document.querySelector(s)};
  var ask=q("#cx-ask");if(ask){var fb=ask.querySelector(".cx-fb"),os=ask.querySelectorAll(".cx-o"),done=false;os.forEach(function(b){b.addEventListener("click",function(){if(done)return;done=true;var ok=b.getAttribute("data-r")==="1";os.forEach(function(x){if(x.getAttribute("data-r")==="1")x.classList.add("ok")});if(!ok)b.classList.add("no");fb.textContent=ok?"Right. The weight is balanced by the normal force.":"Not quite. The table pushes back, so the forces cancel."})})}
  var rm=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  function start(c){c.classList.add("cx-in");
    if(c.id==="cx-exam"){var rg=q("#cx-rg");if(rg)rg.style.strokeDashoffset=String(214*(1-.82));var t=q("#cx-t"),s=720;if(!rm)setInterval(function(){s--;if(s<0)s=720;t.textContent=Math.floor(s/60)+":"+("0"+s%60).slice(-2)},1000)}
    if(c.id==="cx-mi"){var li=c.querySelectorAll("#cx-st li"),m=q("#cx-mt"),i=0;(function step(){if(i>=li.length){setTimeout(function(){li.forEach(function(x){x.classList.remove("x")});m.style.width="0";i=0;setTimeout(step,900)},2200);return}li[i].classList.add("x");i++;m.style.width=(i/li.length*100)+"%";setTimeout(step,rm?0:1100)})()}}
  var cs=document.querySelectorAll(".cx-c");if(!("IntersectionObserver" in window)){cs.forEach(start);return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){start(e.target);io.unobserve(e.target)}})},{threshold:.35});cs.forEach(function(c){io.observe(c)});
}catch(e){}})();
