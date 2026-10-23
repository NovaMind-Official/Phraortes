(function(){
  if(!document.body.classList.contains("lux"))return;
  var sel=".s3c,.fc,.pc,.card,.core,.cc,.try,.ft-x .try,.cores article";
  function mark(){document.querySelectorAll(sel).forEach(function(e){e.classList.add("lx-spot")})}
  mark();
  document.addEventListener("pointermove",function(ev){
    var t=ev.target&&ev.target.closest&&ev.target.closest(".lx-spot");if(!t)return;
    var r=t.getBoundingClientRect();t.style.setProperty("--mx",(ev.clientX-r.left)+"px");t.style.setProperty("--my",(ev.clientY-r.top)+"px");
  },{passive:true});
})();
