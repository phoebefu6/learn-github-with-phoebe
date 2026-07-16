/* mindmap.js - reusable radial knowledge-map layer for the learn-X-with-phoebe courses.
   Reads window.MINDMAP_DATA and renders a clickable SVG spider map into #mindmap:
   center = course · ring 1 = sessions (clickable) · ring 2 = key concepts (clickable).
   Self-contained, no dependencies. Bump ?v= on change (Pages caches hard).

   Data shape:
   window.MINDMAP_DATA = {
     title: "Tech Project PMO",        // center label (wraps on \n)
     centerColor: "#0B2A45",
     sessions: [
       { label:"Frame & charter", href:"courses/01-...html", color:"#34D399",
         concepts:[ {label:"Interim vs final", href:"courses/01-...html"}, ... ] },
       ...
     ]
   };
*/
(function () {
  var host = document.getElementById("mindmap");
  var data = window.MINDMAP_DATA;
  if (!host || !data || !data.sessions || !data.sessions.length) return;

  var SVGNS = "http://www.w3.org/2000/svg";
  var n = data.sessions.length;
  // n-adaptive geometry: rings and canvas grow with session count so the same
  // renderer fits courses from 6 to 14+ sessions (keeps session nodes from crowding).
  // Each session sprouts its concepts as a RADIAL BRANCH stepping straight outward along
  // its own spoke (tiny zigzag), so concepts never drift into a neighbouring session's
  // sector - the failure mode of an angular fan on dense (8+ session) maps.
  var maxC = data.sessions.reduce(function (m, s) { return Math.max(m, (s.concepts || []).length); }, 0);
  var STEP = 150;                             // radial gap between chained concepts (must exceed node width so horizontal branches do not self-overlap)
  var R1 = Math.max(170, Math.round(26 * n)); // session ring
  var R2 = R1 + 150;                          // first concept ring
  var maxR = R2 + Math.max(0, maxC - 1) * STEP;
  var W = 2 * (maxR + 150), H = 2 * (maxR + 70), cx = W / 2, cy = H / 2;
  var angleStep = 360 / n;                    // degrees between sessions

  function el(name, attrs, text) {
    var e = document.createElementNS(SVGNS, name);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    return e;
  }
  // rounded-rect node, optionally wrapped in a link; returns the outer node
  function node(opts) {
    var group = el("g", { "class": "mm-node" });
    var rw = opts.w, rh = opts.h;
    var rect = el("rect", {
      x: opts.x - rw / 2, y: opts.y - rh / 2, width: rw, height: rh,
      rx: opts.rx || 10, fill: opts.fill, stroke: opts.stroke || "none",
      "stroke-width": opts.strokeW || 0
    });
    group.appendChild(rect);
    var lines = String(opts.label).split("\n");
    var lh = opts.fs + 3;
    var startY = opts.y - ((lines.length - 1) * lh) / 2 + opts.fs / 3;
    lines.forEach(function (ln, i) {
      group.appendChild(el("text", {
        x: opts.x, y: startY + i * lh, "text-anchor": "middle",
        "font-family": "Inter, sans-serif", "font-weight": opts.fw || 700,
        "font-size": opts.fs, fill: opts.color
      }, ln));
    });
    if (opts.href) {
      var a = el("a", { href: opts.href });
      a.setAttribute("class", "mm-link");
      a.appendChild(group);
      return a;
    }
    return group;
  }

  var svg = el("svg", {
    viewBox: "0 0 " + W + " " + H, xmlns: SVGNS, role: "img",
    "class": "mm-svg", "aria-label": "Course knowledge map: " + data.title
  });

  var edgeLayer = el("g", { "class": "mm-edges" });
  var nodeLayer = el("g", { "class": "mm-nodes" });
  svg.appendChild(edgeLayer);
  svg.appendChild(nodeLayer);

  var sessionGroups = []; // {sessionEl, conceptEls[], edgeEls[]}

  data.sessions.forEach(function (s, i) {
    var ang = (-90 + i * (360 / n)) * Math.PI / 180;
    var sx = cx + R1 * Math.cos(ang);
    var sy = cy + R1 * Math.sin(ang);
    var edges = [];

    // spoke: center -> session
    var spoke = el("line", {
      x1: cx, y1: cy, x2: sx, y2: sy,
      stroke: "#AEBAC6", "stroke-width": 2, "class": "mm-edge"
    });
    edgeLayer.appendChild(spoke);
    edges.push(spoke);

    var cs = s.concepts || [];
    var conceptEls = [];
    var px = sx, py = sy;                         // chain starts at the session node
    // narrow zigzag keeps the branch lively but inside a tight cone around the spoke
    var JIT = Math.min(5, angleStep * 0.12);
    cs.forEach(function (c, j) {
      var off = (j % 2 === 0 ? -JIT : JIT);
      var ca = (-90 + i * (360 / n) + off) * Math.PI / 180;
      var rr = R2 + j * STEP;
      var ccx = cx + rr * Math.cos(ca);
      var ccy = cy + rr * Math.sin(ca);
      var twig = el("line", {
        x1: px, y1: py, x2: ccx, y2: ccy,          // chain from the previous node, not all from the session
        stroke: "#CDD6DF", "stroke-width": 1.5, "class": "mm-edge"
      });
      edgeLayer.appendChild(twig);
      edges.push(twig);
      var cnode = node({
        x: ccx, y: ccy, w: 128, h: 34, rx: 8,
        fill: "#EAF2F8", color: "#16202B", fs: 11.5, fw: 600,
        stroke: s.color, strokeW: 1.5, label: c.label, href: c.href
      });
      nodeLayer.appendChild(cnode);
      conceptEls.push(cnode);
      px = ccx; py = ccy;
    });

    var snode = node({
      x: sx, y: sy, w: 132, h: 46, rx: 12,
      fill: s.color, color: "#16202B", fs: 13, fw: 800,
      label: (i + 1) + " · " + s.label, href: s.href
    });
    nodeLayer.appendChild(snode);
    sessionGroups.push({ session: snode, concepts: conceptEls, edges: edges });
  });

  // center node last (on top)
  var center = node({
    x: cx, y: cy, w: 176, h: 74, rx: 18,
    fill: data.centerColor || "#0B2A45", color: "#FFFFFF", fs: 16, fw: 800,
    label: data.title
  });
  nodeLayer.appendChild(center);

  host.appendChild(svg);

  // hover: spotlight one session branch, dim the rest
  function setFocus(idx) {
    sessionGroups.forEach(function (g, i) {
      var dim = (idx != null && i !== idx);
      g.session.style.opacity = dim ? 0.28 : 1;
      g.concepts.forEach(function (c) { c.style.opacity = dim ? 0.28 : 1; });
      g.edges.forEach(function (e) { e.style.opacity = dim ? 0.18 : 1; });
    });
  }
  sessionGroups.forEach(function (g, i) {
    [g.session].concat(g.concepts).forEach(function (nodeEl) {
      nodeEl.addEventListener("mouseenter", function () { setFocus(i); });
      nodeEl.addEventListener("mouseleave", function () { setFocus(null); });
    });
  });
})();
