/* Stage: scroll-driven horizontal story. One code-built phone, five live screens, glass layers that fan out as you move. */
(function () {
  var root = document.getElementById("stage"); if (!root || root.dataset.ready) return; root.dataset.ready = 1;
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var P = {
    web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    page: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>',
    code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
    pen: '<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>',
    ok: '<path d="M5 12l5 5 9-10"/>', up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'
  };
  var I = function (k) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + P[k] + "</svg>"; };
  var bar = function (t) { return '<div class="stg-bar"><span class="stg-kn"></span>' + t + "</div>"; };

  var SC = [
    { ey: "01 · Think", h: "Watch it <em>work.</em>", p: "Every step, searching, reading, running, shown as it happens, then folded into one calm line.", ly: ["CHAT", "MEMORY", "SOURCES"] },
    { ey: "02 · Agent", h: "Say a word. <em>It gets done.</em>", p: "Timers that ring, plans that save, routines that run. By voice or with one line.", ly: ["AGENT", "ROUTINES", "ALARMS"] },
    { ey: "03 · Minds", h: "An assistant with <em>a job.</em>", p: "Name it, give it a purpose, share it as one link. Ready-made Minds are waiting.", ly: ["MINDS", "SHARE", "STARTERS"] },
    { ey: "04 · Rooms", h: "Bring the AI <em>into the chat.</em>", p: "Private group rooms, end-to-end encrypted. Call the AI for everyone with @ai.", ly: ["ROOMS", "ENCRYPTED", "@AI"] },
    { ey: "05 · Code", h: "Code that <em>looks like code.</em>", p: "Syntax colours, line numbers, run it, download it, open it full-screen.", ly: ["CODE", "RUN", "FILES"] }
  ];
  var N = SC.length;

  var screens = [
    /* 1 chat + steps */
    bar("Phraortes") +
    '<div class="stg-bub u rv2" style="--d:.05s">Compare Go and Python for a high-traffic API</div>' +
    '<div class="stg-card rv2" style="--d:.2s"><div class="stg-ch"><span class="stg-or">' + I("spark") + '</span><div class="stg-ct"><span class="t1">Working on it</span><small class="t2">Step 1 of 4</small></div></div><div class="stg-pb"><i></i></div><div class="stg-rows">' +
    [["web", "Searched the web", "2.1s"], ["page", "Read 2 pages", "3.4s"], ["code", "Ran a quick benchmark", "6.0s"], ["pen", "Wrote the comparison", "2.5s"]].map(function (r) { return '<div class="stg-r"><span class="ic">' + I(r[0]) + "</span>" + r[1] + "<em>" + r[2] + "</em></div>"; }).join("") + "</div></div>" +
    '<div class="stg-pill"><span class="stg-or">' + I("ok") + '</span><b>Worked for 14s</b>&nbsp;· 4 steps</div>' +
    '<div class="stg-bub a rv2" style="--d:.35s"><span class="ans"></span></div>' +
    '<div class="stg-in">Ask anything<b>' + I("up") + "</b></div>",
    /* 2 agent */
    bar("Agent") +
    '<div class="stg-bub u rv2" style="--d:.05s"><span class="cmd"></span></div>' +
    '<div class="stg-wave rv2" style="--d:.15s">' + new Array(21).join("<i></i>") + "</div>" +
    '<div class="stg-ok rv2" style="--d:1.6s"><span class="ic">' + I("ok") + '</span><div><b>Timer set</b><small>Focus · 25 minutes</small></div><span class="stg-ring"></span></div>' +
    '<div class="stg-ok rv2" style="--d:2.1s"><span class="ic">' + I("ok") + '</span><div><b>Plan saved</b><small>Projects · Study routine</small></div></div>' +
    '<div class="stg-ok rv2" style="--d:2.6s"><span class="ic">' + I("ok") + '</span><div><b>Alarm 07:00</b><small>Tomorrow · rings</small></div></div>' +
    '<div class="stg-in">Say “Hey Phraortes”<b>' + I("spark") + "</b></div>",
    /* 3 minds */
    bar("Minds") + '<div class="stg-seg rv2" style="--d:.05s"><span class="on">Discover</span><span>Mine</span></div>' +
    [["🎯", "Konkur Coach", "Plans, drills and weak spots", "rgba(232,196,104,.18)"], ["🧪", "Code Reviewer", "Finds bugs, explains why", "rgba(122,76,255,.2)"], ["🎙️", "Interview Coach", "Practice, then honest feedback", "rgba(60,190,160,.18)"], ["✍️", "Essay Editor", "Tightens without changing you", "rgba(255,120,170,.18)"]].map(function (m, i) {
      return '<div class="stg-mind rv2" style="--d:' + (0.15 + i * 0.12) + 's"><span class="av" style="background:' + m[3] + '">' + m[0] + "</span><div><b>" + m[1] + "</b><small>" + m[2] + "</small></div><u>Use</u></div>";
    }).join("") + '<div class="stg-toast rv2" style="--d:1.5s">' + I("link") + "<div><b>Link copied</b><br><span style=\"color:#8f866f\">Share this Mind anywhere</span></div></div>",
    /* 4 rooms */
    '<div class="stg-rh">' + bar("Physics crew") + '<small style="margin-left:auto">' + I("lock") + "3 · encrypted</small></div>" +
    '<div class="stg-m rv2" style="--d:.1s"><span class="p" style="background:#e8c468">N</span><div class="t"><i>Nika</i>Exam in 9 days. What first?</div></div>' +
    '<div class="stg-m rv2" style="--d:.5s"><span class="p" style="background:#8fc7ff">A</span><div class="t"><i>Arman</i>Waves and optics, I mix them up</div></div>' +
    '<div class="stg-m me rv2" style="--d:.9s"><div class="t"><i>Sara</i><span style="color:var(--sg)">@ai</span> build us a 9-day plan</div></div>' +
    '<div class="stg-ai rv2" style="--d:1.5s"><b>' + I("spark").replace("<svg", '<svg width="12" height="12" style="stroke:#e8c468;fill:none;stroke-width:2"') + 'PHRAORTES</b>Days 1–3 Waves · 4–5 Optics · 6–7 Electricity · Day 8 full past paper · Day 9 fix mistakes only.</div>' +
    '<div class="stg-m rv2" style="--d:2.2s"><span class="p" style="background:#e8c468">N</span><div class="t"><i>Nika</i>Deal. Past paper on day 8</div></div>' +
    '<div class="stg-in">Message the room<b>' + I("up") + "</b></div>",
    /* 5 code */
    bar("Phraortes") + '<div class="stg-tab rv2" style="--d:.05s"><span>debounce.js</span><u>Run</u></div>' +
    '<div class="stg-code rv2" style="--d:.15s">' + [
      '<span class="c">// wait until typing stops</span>',
      '<span class="k">function</span> <span class="f">debounce</span><span class="p">(fn, ms) {</span>',
      '  <span class="k">let</span> <span class="p">t;</span>',
      '  <span class="k">return</span> <span class="p">(...a) =&gt; {</span>',
      '    <span class="f">clearTimeout</span><span class="p">(t);</span>',
      '    <span class="p">t = </span><span class="f">setTimeout</span><span class="p">(() =&gt;</span>',
      '      <span class="p">fn(...a), ms);</span>',
      '  <span class="p">};</span>',
      '<span class="p">}</span>'].map(function (l, i) { return '<div data-n="' + (i + 1) + '"><span>' + l + "</span></div>"; }).join("") + "</div>" +
    '<div class="stg-tb rv2" style="--d:.7s"><div><span>Delay</span><span>Feels</span><span>Best for</span></div><div><span>150 ms</span><span>instant</span><span>autocomplete</span></div><div><span>300 ms</span><span>smooth</span><span>live search</span></div></div>' +
    '<div class="stg-in">Open full-screen<b>' + I("up") + "</b></div>"
  ];

  root.innerHTML = '<div class="stg-st"><div class="stg-aur"><i></i><i></i></div><div class="stg-txt">' +
    SC.map(function (s) { return '<div class="stg-sc"><p class="ey">' + s.ey + "</p><h2>" + s.h + "</h2><p>" + s.p + "</p></div>"; }).join("") +
    '</div><div class="stg-dev"><div class="stg-tilt">' +
    '<div class="stg-ly" data-l=""></div><div class="stg-ly" data-l=""></div><div class="stg-ly" data-l=""></div>' +
    '<div class="stg-ph"><div class="stg-sl">' + screens.map(function (h) { return '<div class="stg-s">' + h + "</div>"; }).join("") + '</div></div></div></div>' +
    '<div class="stg-dots" role="tablist" aria-label="Scenes">' + SC.map(function (s, i) { return '<button type="button" role="tab" aria-label="' + s.ey + '"></button>'; }).join("") + "</div></div>";

  var st = root.querySelector(".stg-st"), txt = [].slice.call(root.querySelectorAll(".stg-sc")), scr = [].slice.call(root.querySelectorAll(".stg-s")),
    tilt = root.querySelector(".stg-tilt"), lys = [].slice.call(root.querySelectorAll(".stg-ly")), dots = [].slice.call(root.querySelectorAll(".stg-dots button")),
    aur = root.querySelectorAll(".stg-aur i");

  /* ---------- scripted scenes ---------- */
  var timers = [];
  function T(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clearT() { timers.forEach(clearTimeout); timers = []; }
  function type(el, str, speed, done) {
    var i = 0; el.classList.add("stg-ty"); el.textContent = "";
    (function step() { if (i <= str.length) { el.textContent = str.slice(0, i++); T(step, speed); } else { el.classList.remove("stg-ty"); done && done(); } })();
  }
  var script = {
    0: function (s) {
      var rows = [].slice.call(s.querySelectorAll(".stg-r")), pb = s.querySelector(".stg-pb i"), t1 = s.querySelector(".t1"), t2 = s.querySelector(".t2"),
        pill = s.querySelector(".stg-pill"), ans = s.querySelector(".ans"), card = s.querySelector(".stg-card");
      rows.forEach(function (r) { r.className = "stg-r"; }); pb.style.width = "0"; pill.classList.remove("on"); ans.textContent = ""; t1.textContent = "Working on it"; t2.textContent = "Step 1 of 4"; card.style.display = "";
      var at = 700;
      rows.forEach(function (r, i) {
        T(function () { r.classList.add("run"); t2.textContent = "Step " + (i + 1) + " of 4"; pb.style.width = (i * 25 + 12) + "%"; }, at);
        T(function () { r.classList.remove("run"); r.classList.add("done"); pb.style.width = ((i + 1) * 25) + "%"; }, at + 750);
        at += 800;
      });
      T(function () { t1.textContent = "Done"; t2.textContent = "All steps finished"; }, at);
      T(function () { card.style.display = "none"; pill.classList.add("on"); type(ans, "Go is the stronger default for a high-traffic API: lower memory per request, native concurrency and one static binary. Python stays great for glue and data work.", 22); }, at + 600);
    },
    1: function (s) { var c = s.querySelector(".cmd"); c.textContent = ""; T(function () { type(c, "Hey Phraortes, start my study routine", 34); }, 300); },
    2: function () { }, 3: function () { }, 4: function () { }
  };
  var activeIdx = -1;
  function activate(i) {
    if (i === activeIdx) return;
    if (activeIdx >= 0) scr[activeIdx].classList.remove("on");
    clearT(); activeIdx = i;
    root.dataset.h = i; dots.forEach(function (d, k) { d.classList.toggle("on", k === i); d.setAttribute("aria-selected", k === i); });
    lys.forEach(function (l, k) { l.setAttribute("data-l", SC[i].ly[k] || ""); });
    scr[i].classList.add("on"); script[i] && script[i](scr[i]);
  }

  /* ---------- scroll mapping + smooth motion ---------- */
  var cur = 0, vel = 0, tgt = 0, raf = 0, visible = false;
  function target() {
    if (RM) return tgt;
    var r = root.getBoundingClientRect(), h = r.height - innerHeight;
    var p = h > 0 ? Math.min(1, Math.max(0, -r.top / h)) : 0;
    var f = p * (N - 1); if (f >= N - 1) return N - 1;
    var b = Math.floor(f), x = f - b;
    var e = x < .2 ? 0 : x > .8 ? 1 : (x - .2) / .6; e = e * e * (3 - 2 * e);
    return b + e;
  }
  function draw() {
    var t = RM ? tgt : target(), d = t - cur;
    cur += d * (RM ? 1 : .14); if (Math.abs(t - cur) < .0008) cur = t;
    vel += ((Math.max(-1, Math.min(1, d * 2.2))) - vel) * .18;
    var near = Math.round(cur); activate(near);
    txt.forEach(function (el, i) {
      var o = i - cur, a = Math.abs(o);
      el.style.transform = "translate3d(" + (o * 100) + "%,0,0)"; el.style.opacity = Math.max(0, 1 - a * 1.15);
    });
    scr.forEach(function (el, i) {
      var o = i - cur, a = Math.abs(o);
      el.style.transform = "translate3d(" + (o * 100) + "%,0,0) scale(" + (1 - Math.min(a, 1) * .06) + ")"; el.style.opacity = Math.max(0, 1 - a * .55);
      el.style.visibility = a > 1.6 ? "hidden" : "visible";
    });
    var sp = Math.min(1, Math.abs(vel) * 1.25), dir = vel < 0 ? -1 : 1;
    if (!RM) {
      tilt.style.transform = "rotateX(" + (5 - sp * 3) + "deg) rotateY(" + (-7 - vel * 20) + "deg) rotateZ(" + (vel * -2) + "deg)";
      lys.forEach(function (l, k) {
        var q = k + 1;
        l.style.transform = "translate3d(" + (dir * q * 44 * sp + q * 20) + "px," + (-q * 16) + "px," + (-q * 38) + "px) rotateZ(" + (dir * q * 4 * sp) + "deg) scale(" + (1 - q * .02) + ")";
        l.style.opacity = .95 - q * .18 + sp * .1;
      });
      aur[0].style.transform = "translate3d(" + (-cur * 5) + "vmin,0,0)"; aur[1].style.transform = "translate3d(" + (cur * 4) + "vmin,0,0)";
    }
    if (visible && (Math.abs(t - cur) > .0008 || Math.abs(vel) > .004)) raf = requestAnimationFrame(draw); else raf = 0;
  }
  function kick() { if (!raf) raf = requestAnimationFrame(draw); }
  new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) kick(); }, { rootMargin: "20% 0px" }).observe(root);
  addEventListener("scroll", function () { if (visible) kick(); }, { passive: true });
  addEventListener("resize", function () { kick(); });
  dots.forEach(function (d, i) {
    d.addEventListener("click", function () {
      if (RM) { tgt = i; kick(); return; }
      var r = root.getBoundingClientRect(), top = scrollY + r.top, h = r.height - innerHeight;
      scrollTo({ top: top + h * (i / (N - 1)) + (i === 0 ? 2 : i === N - 1 ? -2 : 0), behavior: "smooth" });
    });
  });
  draw();
})();
