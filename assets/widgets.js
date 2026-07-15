/* learn-github-with-phoebe - interactive widgets (no code, browser-only)
   Usage: <div class="widget" data-widget="TYPE" data-config='{...json...}'></div>
   Types: sorter · mdpreview · checklist · meanmedian · kpitree · funnel · rfm · forecast · threshold · kmeans · clv
   Palette: primary #14699C · deep #0C3B5C · mid #2E9BD6 · soft #A5D8F3 · tint #E3F2FC
            ink #16232E · muted #5E6E7A · flagship amber #BE123C */

(function () {
  "use strict";

  /* ---------- helpers ---------- */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function money(n) {
    var neg = n < 0 ? "-" : "";
    n = Math.abs(Math.round(n));
    return neg + "$" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  function num(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  function pct(n, dp) {
    return (Math.round(n * Math.pow(10, dp === undefined ? 1 : dp)) / Math.pow(10, dp === undefined ? 1 : dp)) + "%";
  }
  function cfg(node) {
    try { return JSON.parse(node.getAttribute("data-config") || "{}"); }
    catch (e) { return {}; }
  }
  function svgEl(name, attrs) {
    var e = document.createElementNS("http://www.w3.org/2000/svg", name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  var C = { deep: "#0C3B5C", prim: "#14699C", mid: "#2E9BD6", soft: "#A5D8F3",
            tint: "#E3F2FC", ink: "#16232E", muted: "#5E6E7A", flag: "#BE123C",
            good: "#1E7A46", bad: "#B42318" };

  /* ---------- 1 · sorter : classify statements into categories ---------- */
  function wSorter(root, c) {
    var cats = c.categories || ["Data", "Information", "Insight", "Action"];
    var items = c.items || [];
    var solved = 0;
    root.appendChild(el("p", "wg-title", c.title || "★ Your turn - place each one"));
    if (c.intro) root.appendChild(el("p", "wg-note", c.intro));
    var score = el("p", "wg-score", "0 of " + items.length + " placed");
    items.forEach(function (it) {
      var row = el("div", "wg-sort-row");
      row.appendChild(el("p", "wg-sort-text", it.t));
      var btns = el("div", "wg-btnrow");
      cats.forEach(function (cat, ci) {
        var b = el("button", "wg-btn", cat);
        b.type = "button";
        b.addEventListener("click", function () {
          if (row.classList.contains("done")) return;
          if (ci === it.c) {
            row.classList.add("done");
            b.classList.add("right");
            var why = el("p", "wg-why", "✓ " + cat + (it.why ? " - " + it.why : ""));
            row.appendChild(why);
            solved++;
            score.textContent = solved + " of " + items.length + " placed" + (solved === items.length ? " 🎉 all sorted" : "");
          } else {
            b.classList.add("wrong");
            setTimeout(function () { b.classList.remove("wrong"); }, 500);
          }
        });
        btns.appendChild(b);
      });
      row.appendChild(btns);
      root.appendChild(row);
    });
    root.appendChild(score);
  }

  /* ---------- 2 · meanmedian : outlier playground ---------- */
  function wMeanMedian(root, c) {
    var base = c.values || [62, 74, 81, 88, 95, 102, 110, 118, 126, 140];
    var add = c.add || { label: "Add the whale client", value: 1800 };
    var unit = c.unit || "$";
    var on = false;
    root.appendChild(el("p", "wg-title", c.title || "★ Why the average lies - add one whale"));
    var out = el("div", "wg-outrow");
    var oMean = el("div", "wg-out", "");
    var oMed = el("div", "wg-out", "");
    out.appendChild(oMean); out.appendChild(oMed);
    var svgWrap = el("div", "wg-svgwrap");
    var btn = el("button", "wg-btn big", add.label + " (" + unit + num(add.value) + ")");
    btn.type = "button";
    var note = el("p", "wg-note", "");
    function stats(v) {
      var s = v.slice().sort(function (a, b) { return a - b; });
      var mean = s.reduce(function (a, b) { return a + b; }, 0) / s.length;
      var med = s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
      return { mean: mean, med: med, sorted: s };
    }
    function draw() {
      var v = on ? base.concat([add.value]) : base.slice();
      var st = stats(v);
      var W = 760, H = 130, pad = 30;
      var max = Math.max.apply(null, v) * 1.06;
      function x(val) { return pad + (val / max) * (W - 2 * pad); }
      svgWrap.innerHTML = "";
      var svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "dot strip with mean and median markers" });
      svg.appendChild(svgEl("line", { x1: pad, y1: 78, x2: W - pad, y2: 78, stroke: "#C3CFD8", "stroke-width": 2 }));
      v.forEach(function (val) {
        svg.appendChild(svgEl("circle", { cx: x(val), cy: 78, r: 7, fill: val === add.value && on ? C.bad : C.mid, opacity: .85 }));
      });
      [[st.med, C.flag, "median " + unit + num(st.med), 26], [st.mean, C.prim, "mean " + unit + num(st.mean), 50]].forEach(function (m) {
        svg.appendChild(svgEl("line", { x1: x(m[0]), y1: m[3] + 8, x2: x(m[0]), y2: 90, stroke: m[1], "stroke-width": 3 }));
        var t = svgEl("text", { x: Math.min(x(m[0]) + 8, W - 150), y: m[3], fill: m[1], "font-size": "14", "font-weight": "700", "font-family": "Inter, sans-serif" });
        t.textContent = m[2];
        svg.appendChild(t);
      });
      svgWrap.appendChild(svg);
      oMean.innerHTML = "<b>Mean</b><span>" + unit + num(st.mean) + "</span>";
      oMed.innerHTML = "<b>Median</b><span>" + unit + num(st.med) + "</span>";
      note.textContent = on
        ? "One client moved the mean " + pct((st.mean / stats(base).mean - 1) * 100, 0) + " - the median barely blinked. When a report says \"average\", ask which one."
        : "Ten ordinary orders: mean and median agree. Now add one whale.";
    }
    btn.addEventListener("click", function () {
      on = !on;
      btn.textContent = on ? "Remove the whale" : add.label + " (" + unit + num(add.value) + ")";
      draw();
    });
    root.appendChild(out); root.appendChild(svgWrap); root.appendChild(btn); root.appendChild(note);
    draw();
  }

  /* ---------- 3 · kpitree : income = revenue - cost, live tree ---------- */
  function wKpiTree(root, c) {
    var b = c.baseline || { nw: 400, ret: 700, res: 100, chn: 200, basket: 3, item: 25, cost: 52000 };
    var v = JSON.parse(JSON.stringify(b));
    root.appendChild(el("p", "wg-title", c.title || "★ Drive the KPI tree - which lever moves income most?"));
    var grid = el("div", "wg-grid");
    var fields = [
      ["nw", "New buyers"], ["ret", "Returning"], ["res", "Resurrected"], ["chn", "Churned (-)"],
      ["basket", "Basket size (items)"], ["item", "Avg item value $"], ["cost", "Total cost $"]
    ];
    var inputs = {};
    fields.forEach(function (f) {
      var box = el("label", "wg-field");
      box.appendChild(el("span", "", f[1]));
      var inp = el("input", "wg-input");
      inp.type = "number"; inp.min = "0"; inp.step = f[0] === "item" ? "1" : (f[0] === "cost" ? "1000" : "10");
      inp.value = v[f[0]];
      inp.addEventListener("input", function () { v[f[0]] = parseFloat(inp.value) || 0; calc(); });
      inputs[f[0]] = inp;
      box.appendChild(inp);
      grid.appendChild(box);
    });
    var out = el("div", "wg-outrow");
    var oBuy = el("div", "wg-out"), oRev = el("div", "wg-out"), oInc = el("div", "wg-out big");
    out.appendChild(oBuy); out.appendChild(oRev); out.appendChild(oInc);
    var note = el("p", "wg-note", "");
    var reset = el("button", "wg-btn", "Reset to baseline");
    reset.type = "button";
    reset.addEventListener("click", function () {
      v = JSON.parse(JSON.stringify(b));
      fields.forEach(function (f) { inputs[f[0]].value = v[f[0]]; });
      calc();
    });
    function compute(s) {
      var buyers = s.nw + s.ret + s.res - s.chn;
      var revenue = buyers * s.basket * s.item;
      return { buyers: buyers, revenue: revenue, income: revenue - s.cost };
    }
    function delta(now, was) {
      if (was === 0) return "";
      var d = (now / was - 1) * 100;
      if (Math.abs(d) < 0.05) return "<em class='flat'>= baseline</em>";
      return "<em class='" + (d > 0 ? "up" : "down") + "'>" + (d > 0 ? "▲ +" : "▼ ") + pct(d) + "</em>";
    }
    function calc() {
      var now = compute(v), was = compute(b);
      oBuy.innerHTML = "<b>Buyers</b><span>" + num(now.buyers) + "</span>" + delta(now.buyers, was.buyers);
      oRev.innerHTML = "<b>Revenue</b><span>" + money(now.revenue) + "</span>" + delta(now.revenue, was.revenue);
      oInc.innerHTML = "<b>Income</b><span>" + money(now.income) + "</span>" + delta(now.income, was.income);
      oInc.classList.toggle("neg", now.income < 0);
      note.innerHTML = "buyers = new + returning + resurrected - churned &nbsp;·&nbsp; revenue = buyers × basket size × item value &nbsp;·&nbsp; income = revenue - cost";
    }
    root.appendChild(grid); root.appendChild(out); root.appendChild(note); root.appendChild(reset);
    calc();
  }

  /* ---------- 4 · funnel : conversion simulator ---------- */
  function wFunnel(root, c) {
    var visitors = c.visitors || 100000;
    var aov = c.aov || 80;
    var stages = c.stages || [
      { name: "Visit" }, { name: "Product view", cv: 45 }, { name: "Add to cart", cv: 30 },
      { name: "Checkout", cv: 40 }, { name: "Purchase", cv: 65 }
    ];
    var v = stages.map(function (s) { return s.cv || 0; });
    root.appendChild(el("p", "wg-title", c.title || "★ Funnel simulator - find the leak worth fixing"));
    var ctl = el("div", "wg-grid");
    var vis = el("label", "wg-field");
    vis.appendChild(el("span", "", "Visitors / month"));
    var visIn = el("input", "wg-input"); visIn.type = "number"; visIn.value = visitors; visIn.step = "5000"; visIn.min = "0";
    vis.appendChild(visIn); ctl.appendChild(vis);
    var inputs = [];
    stages.forEach(function (s, i) {
      if (i === 0) return;
      var f = el("label", "wg-field");
      f.appendChild(el("span", "", "→ " + s.name + " %"));
      var inp = el("input", "wg-input"); inp.type = "number"; inp.value = v[i]; inp.min = "0"; inp.max = "100"; inp.step = "1";
      inp.addEventListener("input", function () { v[i] = Math.min(100, parseFloat(inp.value) || 0); draw(); });
      inputs.push(inp); f.appendChild(inp); ctl.appendChild(f);
    });
    visIn.addEventListener("input", function () { visitors = parseFloat(visIn.value) || 0; draw(); });
    var bars = el("div", "wg-funnel");
    var out = el("div", "wg-outrow");
    var oBuy = el("div", "wg-out"), oCv = el("div", "wg-out"), oRev = el("div", "wg-out big");
    out.appendChild(oBuy); out.appendChild(oCv); out.appendChild(oRev);
    var note = el("p", "wg-note", "");
    function counts() {
      var n = [visitors];
      for (var i = 1; i < stages.length; i++) n.push(n[i - 1] * v[i] / 100);
      return n;
    }
    function draw() {
      var n = counts();
      var weakest = 1;
      for (var i = 1; i < stages.length; i++) if (v[i] < v[weakest]) weakest = i;
      bars.innerHTML = "";
      n.forEach(function (count, i) {
        var row = el("div", "wg-frow" + (i === weakest ? " leak" : ""));
        var w = n[0] ? Math.max(4, count / n[0] * 100) : 4;
        row.appendChild(el("span", "wg-fname", stages[i].name));
        var bar = el("div", "wg-fbar");
        var fill = el("div", "wg-ffill");
        fill.style.width = w + "%";
        bar.appendChild(fill);
        row.appendChild(bar);
        row.appendChild(el("span", "wg-fnum", num(count) + (i === 0 ? "" : " · " + pct(v[i], 0)) + (i === weakest ? " ⚠ biggest leak" : "")));
        bars.appendChild(row);
      });
      var buyers = n[n.length - 1];
      var overall = n[0] ? buyers / n[0] * 100 : 0;
      oBuy.innerHTML = "<b>Buyers</b><span>" + num(buyers) + "</span>";
      oCv.innerHTML = "<b>Overall conversion</b><span>" + pct(overall, 2) + "</span>";
      oRev.innerHTML = "<b>Revenue</b><span>" + money(buyers * aov) + "</span>";
      var lift = v.slice(); lift[weakest] = Math.min(100, lift[weakest] + 5);
      var m = [visitors];
      for (var j = 1; j < stages.length; j++) m.push(m[j - 1] * lift[j] / 100);
      note.innerHTML = "What-if: <strong>+5 points</strong> on \"" + stages[weakest].name + "\" (the weakest step) = <strong>" +
        money((m[m.length - 1] - buyers) * aov) + "/month</strong> extra revenue at AOV " + money(aov) + ". Fix the leak, not the billboard.";
    }
    root.appendChild(ctl); root.appendChild(bars); root.appendChild(out); root.appendChild(note);
    draw();
  }

  /* ---------- 5 · rfm : score a customer, get the segment + play ---------- */
  function wRfm(root, c) {
    root.appendChild(el("p", "wg-title", c.title || "★ Score a customer - R, F, M each 1 (worst) to 5 (best)"));
    var defs = [
      ["R", "Recency - how recently they bought", 4],
      ["F", "Frequency - how often they buy", 4],
      ["M", "Monetary - how much they spend", 3]
    ];
    var val = {};
    var row = el("div", "wg-grid");
    defs.forEach(function (d) {
      var f = el("label", "wg-field");
      f.appendChild(el("span", "", d[0] + " · " + d[1]));
      var sel = el("select", "wg-input");
      for (var i = 1; i <= 5; i++) {
        var o = el("option", "", String(i)); o.value = i;
        if (i === d[2]) o.selected = true;
        sel.appendChild(o);
      }
      val[d[0]] = d[2];
      sel.addEventListener("change", function () { val[d[0]] = parseInt(sel.value, 10); judge(); });
      f.appendChild(sel); row.appendChild(f);
    });
    var out = el("div", "wg-rfmcard");
    function judge() {
      var R = val.R, F = val.F, M = val.M, seg, act, tone;
      if (R >= 4 && F >= 4) { seg = "Champions"; act = "Reward them: early access, VIP tier, referral ask. Never discount - they already love you."; tone = "good"; }
      else if (R >= 4 && F === 3) { seg = "Potential loyalists"; act = "One nudge from loyal: membership offer, bundle their next basket."; tone = "good"; }
      else if (R >= 4) { seg = "New / promising"; act = "Onboard hard: welcome flow, second-purchase incentive inside 30 days."; tone = "mid"; }
      else if (R === 3 && F >= 3) { seg = "Need attention"; act = "Warming down: limited-time offer, remind them what they liked."; tone = "mid"; }
      else if (R <= 2 && F >= 4) { seg = "At risk - was loyal"; act = "Highest-priority win-back: personal outreach, ask why, fix it. These were your best customers."; tone = "bad"; }
      else if (R === 3) { seg = "About to sleep"; act = "Light-touch reactivation: bestseller email, small coupon."; tone = "mid"; }
      else { seg = "Hibernating / lost"; act = "Cheap automation only: one reactivation series, then stop paying to reach them."; tone = "bad"; }
      var value = M >= 4 ? "High spender - human touch and margin investment justified." :
                  M <= 2 ? "Low spender - keep every action automated and cheap." :
                  "Mid spender - standard playbook.";
      out.className = "wg-rfmcard " + tone;
      out.innerHTML = "<b>R" + R + " F" + F + " M" + M + " → " + seg + "</b><p>" + act + "</p><p class='wg-note'>" + value + "</p>";
    }
    root.appendChild(row); root.appendChild(out);
    judge();
  }

  /* ---------- 6 · forecast : fit trend + seasonality, beat the gut ---------- */
  function wForecast(root, c) {
    var months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
    var shape = [-0.15, -0.15, -0.05, 0, 0.02, 0.05, 0.03, 0, 0.05, 0.10, 0.25, 0.40];
    var noise = [0.02, -0.01, 0.03, -0.02, 0.01, -0.03, 0.02, 0.01, -0.02, 0.03, -0.01, 0.02];
    var base = 100;
    var actual = shape.map(function (s, i) {
      return base * Math.pow(1.02, i) * (1 + s) * (1 + noise[i]);
    });
    var trend = 0, amp = 0;
    root.appendChild(el("p", "wg-title", c.title || "★ Fit the forecast - tune trend and seasonality until MAPE beats the gut"));
    var ctl = el("div", "wg-grid");
    function slider(label, min, max, step, init, onchange) {
      var f = el("label", "wg-field wide");
      var cap = el("span", "", label);
      f.appendChild(cap);
      var inp = el("input", "wg-slider");
      inp.type = "range"; inp.min = min; inp.max = max; inp.step = step; inp.value = init;
      inp.addEventListener("input", function () { onchange(parseFloat(inp.value), cap, label); draw(); });
      f.appendChild(inp);
      return f;
    }
    ctl.appendChild(slider("Growth trend: 0% / month", 0, 5, 0.25, 0, function (x, cap) {
      trend = x; cap.textContent = "Growth trend: " + x + "% / month";
    }));
    ctl.appendChild(slider("Seasonality strength: 0%", 0, 150, 5, 0, function (x, cap) {
      amp = x / 100; cap.textContent = "Seasonality strength: " + x + "% (holiday peak, winter dip)";
    }));
    var svgWrap = el("div", "wg-svgwrap");
    var verdict = el("p", "wg-note", "");
    function forecastLine() {
      return shape.map(function (s, i) {
        return base * Math.pow(1 + trend / 100, i) * (1 + amp * s);
      });
    }
    function draw() {
      var f = forecastLine();
      var mape = 0;
      for (var i = 0; i < 12; i++) mape += Math.abs((f[i] - actual[i]) / actual[i]);
      mape = mape / 12 * 100;
      var W = 760, H = 240, padL = 44, padB = 28, padT = 16;
      var all = actual.concat(f);
      var max = Math.max.apply(null, all) * 1.08, min = Math.min.apply(null, all) * 0.9;
      function X(i) { return padL + i * (W - padL - 16) / 11; }
      function Y(v) { return padT + (1 - (v - min) / (max - min)) * (H - padT - padB); }
      svgWrap.innerHTML = "";
      var svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "actual sales versus your forecast line" });
      months.forEach(function (m, i) {
        var t = svgEl("text", { x: X(i), y: H - 8, fill: C.muted, "font-size": "12", "text-anchor": "middle", "font-family": "Inter, sans-serif" });
        t.textContent = m; svg.appendChild(t);
      });
      function path(vals, color, width, dash) {
        var d = vals.map(function (v, i) { return (i ? "L" : "M") + X(i) + " " + Y(v); }).join(" ");
        var p = svgEl("path", { d: d, fill: "none", stroke: color, "stroke-width": width });
        if (dash) p.setAttribute("stroke-dasharray", dash);
        svg.appendChild(p);
      }
      path(actual, C.ink, 2.5);
      actual.forEach(function (v, i) { svg.appendChild(svgEl("circle", { cx: X(i), cy: Y(v), r: 4, fill: C.ink })); });
      path(f, C.prim, 3, "");
      var lg1 = svgEl("text", { x: padL, y: 14, fill: C.ink, "font-size": "12.5", "font-weight": "700", "font-family": "Inter, sans-serif" });
      lg1.textContent = "● actual";
      var lg2 = svgEl("text", { x: padL + 70, y: 14, fill: C.prim, "font-size": "12.5", "font-weight": "700", "font-family": "Inter, sans-serif" });
      lg2.textContent = "━ your forecast";
      svg.appendChild(lg1); svg.appendChild(lg2);
      svgWrap.appendChild(svg);
      var msg;
      if (mape < 4) msg = "🎉 MAPE " + pct(mape) + " - better than most demand planners. Trend + seasonality explain almost everything here.";
      else if (mape < 8) msg = "MAPE " + pct(mape) + " - you beat the gut forecast (typical gut call runs 15-25% off). Push both sliders a little more.";
      else if (mape < 20) msg = "MAPE " + pct(mape) + " - getting closer. The December spike is seasonality, the drift upward is trend.";
      else msg = "MAPE " + pct(mape) + " - a flat line ignores both patterns. Add trend first, then seasonality.";
      verdict.innerHTML = "<strong>" + msg + "</strong> MAPE = mean absolute % error, the forecast metric your planners quote.";
    }
    root.appendChild(ctl); root.appendChild(svgWrap); root.appendChild(verdict);
    draw();
  }

  /* ---------- 7 · threshold : churn call-list slider ---------- */
  function wThreshold(root, c) {
    var churners = [92, 88, 81, 77, 70, 62, 55, 38];
    var stayers = [68, 58, 52, 45, 41, 35, 30, 27, 22, 18, 12, 8];
    var thr = 60;
    root.appendChild(el("p", "wg-title", c.title || "★ The model scored 20 customers - you choose who gets the save-call"));
    var f = el("label", "wg-field wide");
    var cap = el("span", "", "Call everyone scoring above: 60");
    f.appendChild(cap);
    var inp = el("input", "wg-slider");
    inp.type = "range"; inp.min = 0; inp.max = 100; inp.step = 1; inp.value = thr;
    inp.addEventListener("input", function () { thr = parseInt(inp.value, 10); cap.textContent = "Call everyone scoring above: " + thr; draw(); });
    f.appendChild(inp);
    var svgWrap = el("div", "wg-svgwrap");
    var out = el("div", "wg-outrow");
    var oP = el("div", "wg-out"), oR = el("div", "wg-out"), oL = el("div", "wg-out");
    out.appendChild(oP); out.appendChild(oR); out.appendChild(oL);
    var note = el("p", "wg-note", "");
    function draw() {
      var tp = churners.filter(function (s) { return s >= thr; }).length;
      var fn = churners.length - tp;
      var fp = stayers.filter(function (s) { return s >= thr; }).length;
      var precision = (tp + fp) ? tp / (tp + fp) * 100 : 0;
      var recall = tp / churners.length * 100;
      var W = 760, H = 120, pad = 24;
      function X(s) { return pad + s / 100 * (W - 2 * pad); }
      svgWrap.innerHTML = "";
      var svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "customer churn scores with call threshold" });
      svg.appendChild(svgEl("rect", { x: X(thr), y: 20, width: W - pad - X(thr), height: 70, fill: C.tint, rx: 8 }));
      svg.appendChild(svgEl("line", { x1: pad, y1: 74, x2: W - pad, y2: 74, stroke: "#C3CFD8", "stroke-width": 2 }));
      stayers.forEach(function (s) { svg.appendChild(svgEl("circle", { cx: X(s), cy: 74, r: 7, fill: C.muted, opacity: .7 })); });
      churners.forEach(function (s) { svg.appendChild(svgEl("circle", { cx: X(s), cy: 46, r: 7, fill: C.bad })); });
      svg.appendChild(svgEl("line", { x1: X(thr), y1: 14, x2: X(thr), y2: 96, stroke: C.prim, "stroke-width": 3 }));
      var lbl = svgEl("text", { x: Math.min(X(thr) + 6, W - 130), y: 110, fill: C.prim, "font-size": "12.5", "font-weight": "700", "font-family": "Inter, sans-serif" });
      lbl.textContent = "call list: " + (tp + fp) + " customers";
      svg.appendChild(lbl);
      var k1 = svgEl("text", { x: pad, y: 32, fill: C.bad, "font-size": "12", "font-weight": "600", "font-family": "Inter, sans-serif" });
      k1.textContent = "● will churn (8)";
      var k2 = svgEl("text", { x: pad + 120, y: 32, fill: C.muted, "font-size": "12", "font-weight": "600", "font-family": "Inter, sans-serif" });
      k2.textContent = "● will stay (12)";
      svg.appendChild(k1); svg.appendChild(k2);
      svgWrap.appendChild(svg);
      oP.innerHTML = "<b>Precision</b><span>" + pct(precision, 0) + "</span><em>of calls, real churners</em>";
      oR.innerHTML = "<b>Recall</b><span>" + pct(recall, 0) + "</span><em>of churners, caught</em>";
      oL.innerHTML = "<b>Missed</b><span>" + fn + "</span><em>churners walk away</em>";
      note.innerHTML = thr > 75
        ? "High bar: cheap call list, high precision - but <strong>" + fn + " churners leave uncalled</strong>. Fine when calls are expensive."
        : thr < 40
        ? "Low bar: you catch " + pct(recall, 0) + " of churners but " + fp + " loyal customers get needless save-offers. Fine when a call costs $2, painful when it costs a 20% discount."
        : "Balanced zone. There is no \"right\" threshold - only the one matching the cost of a call vs the cost of a lost customer. That decision belongs to YOU, not the model.";
    }
    root.appendChild(f); root.appendChild(svgWrap); root.appendChild(out); root.appendChild(note);
    draw();
  }

  /* ---------- 8 · kmeans : segment 60 customers, step by step ---------- */
  function wKmeans(root, c) {
    var seed = 42;
    function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
    var blobs = [[2.2, 32], [8.5, 48], [5.2, 118]];
    var pts = [];
    blobs.forEach(function (b) {
      for (var i = 0; i < 20; i++) {
        pts.push({ x: Math.max(0.3, b[0] + (rnd() - 0.5) * 4.4), y: Math.max(8, b[1] + (rnd() - 0.5) * 34), k: -1 });
      }
    });
    var initC = [[3, 90], [6, 60], [9, 95]];
    var cents, phase, iter, moved;
    var colors = [C.prim, C.flag, C.good];
    root.appendChild(el("p", "wg-title", c.title || "★ k-means, by hand - 60 customers, 3 segments, you run the algorithm"));
    var svgWrap = el("div", "wg-svgwrap");
    var btns = el("div", "wg-btnrow");
    var bA = el("button", "wg-btn big", "Step 1 · Assign each customer to nearest ✕");
    var bM = el("button", "wg-btn big", "Step 2 · Move each ✕ to its group's center");
    var bR = el("button", "wg-btn", "Reset");
    bA.type = bM.type = bR.type = "button";
    var note = el("p", "wg-note", "");
    function reset() {
      cents = initC.map(function (c2) { return c2.slice(); });
      pts.forEach(function (p) { p.k = -1; });
      phase = "assign"; iter = 0; moved = 99;
      draw(); say();
    }
    function assign() {
      pts.forEach(function (p) {
        var best = 0, bd = 1e9;
        cents.forEach(function (c2, i) {
          var dx = (p.x - c2[0]) / 10, dy = (p.y - c2[1]) / 130;
          var d = dx * dx + dy * dy;
          if (d < bd) { bd = d; best = i; }
        });
        p.k = best;
      });
      phase = "move"; draw(); say();
    }
    function move() {
      moved = 0;
      cents.forEach(function (c2, i) {
        var mine = pts.filter(function (p) { return p.k === i; });
        if (!mine.length) return;
        var nx = mine.reduce(function (a, p) { return a + p.x; }, 0) / mine.length;
        var ny = mine.reduce(function (a, p) { return a + p.y; }, 0) / mine.length;
        moved += Math.abs(nx - c2[0]) + Math.abs(ny - c2[1]);
        c2[0] = nx; c2[1] = ny;
      });
      iter++; phase = "assign"; draw(); say();
    }
    function say() {
      bA.disabled = phase !== "assign";
      bM.disabled = phase !== "move";
      if (iter > 0 && moved < 0.8 && phase === "assign") {
        note.innerHTML = "<strong>Converged after " + iter + " rounds 🎉</strong> - the ✕ marks stopped moving. Three segments emerged: low-engagement bargain shoppers, frequent mid-basket regulars, and big-basket occasional buyers. The algorithm never knew the labels - it only measured distance. Naming and acting on segments stays a human job.";
      } else if (phase === "assign" && iter === 0) {
        note.textContent = "Three ✕ marks dropped at random guesses. Click Step 1: every customer joins its nearest ✕.";
      } else if (phase === "move") {
        note.textContent = "Groups formed. Click Step 2: each ✕ walks to the center of its own group - watch the borders shift.";
      } else {
        note.textContent = "Round " + iter + " done. Keep alternating: assign, move, assign, move - until the ✕ marks stand still.";
      }
    }
    function draw() {
      var W = 760, H = 300, padL = 52, padB = 34, padT = 14, padR = 14;
      function X(x) { return padL + x / 11 * (W - padL - padR); }
      function Y(y) { return padT + (1 - y / 145) * (H - padT - padB); }
      svgWrap.innerHTML = "";
      var svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "customer scatter plot with k-means centroids" });
      var ax = svgEl("text", { x: W / 2, y: H - 6, fill: C.muted, "font-size": "12.5", "text-anchor": "middle", "font-family": "Inter, sans-serif" });
      ax.textContent = "Orders per year →";
      var ay = svgEl("text", { x: 14, y: H / 2, fill: C.muted, "font-size": "12.5", "font-family": "Inter, sans-serif", transform: "rotate(-90 14 " + (H / 2) + ")", "text-anchor": "middle" });
      ay.textContent = "Avg basket $ →";
      svg.appendChild(ax); svg.appendChild(ay);
      pts.forEach(function (p) {
        svg.appendChild(svgEl("circle", { cx: X(p.x), cy: Y(p.y), r: 6, fill: p.k < 0 ? "#C3CFD8" : colors[p.k], opacity: .85 }));
      });
      cents.forEach(function (c2, i) {
        var g = svgEl("g", { transform: "translate(" + X(c2[0]) + "," + Y(c2[1]) + ")" });
        g.appendChild(svgEl("line", { x1: -9, y1: -9, x2: 9, y2: 9, stroke: colors[i], "stroke-width": 5 }));
        g.appendChild(svgEl("line", { x1: -9, y1: 9, x2: 9, y2: -9, stroke: colors[i], "stroke-width": 5 }));
        g.appendChild(svgEl("circle", { r: 13, fill: "none", stroke: "#FFFFFF", "stroke-width": 2 }));
        svg.appendChild(g);
      });
      svgWrap.appendChild(svg);
    }
    bA.addEventListener("click", assign);
    bM.addEventListener("click", move);
    bR.addEventListener("click", reset);
    btns.appendChild(bA); btns.appendChild(bM); btns.appendChild(bR);
    root.appendChild(svgWrap); root.appendChild(btns); root.appendChild(note);
    reset();
  }

  /* ---------- 9 · clv : lifetime value vs CAC ---------- */
  function wClv(root, c) {
    var v = { aov: 80, freq: 4, margin: 30, years: 3, cac: 95 };
    root.appendChild(el("p", "wg-title", c.title || "★ Is this customer worth acquiring? CLV vs CAC"));
    var grid = el("div", "wg-grid");
    [["aov", "Avg order value $", 5], ["freq", "Orders / year", 1], ["margin", "Gross margin %", 5],
     ["years", "Expected years", 1], ["cac", "Acquisition cost $", 5]].forEach(function (f) {
      var box = el("label", "wg-field");
      box.appendChild(el("span", "", f[1]));
      var inp = el("input", "wg-input");
      inp.type = "number"; inp.min = "0"; inp.step = f[2]; inp.value = v[f[0]];
      inp.addEventListener("input", function () { v[f[0]] = parseFloat(inp.value) || 0; calc(); });
      box.appendChild(inp); grid.appendChild(box);
    });
    var out = el("div", "wg-outrow");
    var oClv = el("div", "wg-out big"), oRatio = el("div", "wg-out");
    out.appendChild(oClv); out.appendChild(oRatio);
    var card = el("div", "wg-rfmcard");
    function calc() {
      var clv = v.aov * v.freq * (v.margin / 100) * v.years;
      var ratio = v.cac ? clv / v.cac : 0;
      oClv.innerHTML = "<b>CLV (margin)</b><span>" + money(clv) + "</span><em>AOV × freq × margin × years</em>";
      oRatio.innerHTML = "<b>CLV : CAC</b><span>" + (Math.round(ratio * 10) / 10) + "x</span>";
      if (ratio >= 3) { card.className = "wg-rfmcard good"; card.innerHTML = "<b>Healthy (3x+ rule)</b><p>Every " + money(v.cac) + " of acquisition returns " + money(clv) + " of margin. Scale the channel - and check payback period next.</p>"; }
      else if (ratio >= 1) { card.className = "wg-rfmcard mid"; card.innerHTML = "<b>Thin (" + (Math.round(ratio * 10) / 10) + "x, below the 3x rule)</b><p>You make money eventually, but one bad quarter eats it. Before spending more on ads: raise retention (years), basket (AOV), or margin.</p>"; }
      else { card.className = "wg-rfmcard bad"; card.innerHTML = "<b>Underwater (" + (Math.round(ratio * 10) / 10) + "x)</b><p>Every new customer destroys value. Stop scaling acquisition - fix the economics first. This is the slide that ends board meetings.</p>"; }
    }
    root.appendChild(grid); root.appendChild(out); root.appendChild(card);
    calc();
  }


  /* ---------- 10 · mdpreview : live markdown playground ---------- */
  function wMdPreview(root, c) {
    root.appendChild(el("p", "wg-title", c.title || "★ Markdown playground - type left, see it render right"));
    if (c.intro) root.appendChild(el("p", "wg-note", c.intro));
    var wrap = el("div", "wg-mdwrap");
    var ta = el("textarea", "wg-mdinput");
    ta.spellcheck = false;
    ta.value = c.initial || "# My handbook\n\nHi, I am **Phoebe** and this is *markdown*.\n\n## What I cover\n- One list item\n- Another with a [link](https://github.com)\n- Some `inline code`\n\n> Tip: edit anything on the left.\n\n| Day | Focus |\n| --- | --- |\n| Mon | Planning |\n| Tue | Reviews |";
    var pv = el("div", "wg-mdpreview");
    wrap.appendChild(ta); wrap.appendChild(pv);
    function esc(t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
    function inline(t) {
      return t
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>")
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (m, txt, url) {
          return /^https?:/.test(url) ? '<a href="' + url + '" target="_blank" rel="noopener">' + txt + "</a>" : txt;
        });
    }
    function render() {
      var lines = esc(ta.value).split("\n");
      var html = [], list = false, table = false;
      lines.forEach(function (ln) {
        var t = ln.trim();
        if (t.indexOf("|") === 0) {
          if (/^\|?[\s\-|:]+\|?$/.test(t)) return;
          var cells = t.replace(/^\||\|$/g, "").split("|").map(function (x) { return inline(x.trim()); });
          if (!table) { html.push("<table>"); table = true; html.push("<tr><th>" + cells.join("</th><th>") + "</th></tr>"); }
          else html.push("<tr><td>" + cells.join("</td><td>") + "</td></tr>");
          return;
        } else if (table) { html.push("</table>"); table = false; }
        if (t.indexOf("- ") === 0) {
          if (!list) { html.push("<ul>"); list = true; }
          html.push("<li>" + inline(t.slice(2)) + "</li>"); return;
        } else if (list) { html.push("</ul>"); list = false; }
        if (t.indexOf("### ") === 0) html.push("<h4>" + inline(t.slice(4)) + "</h4>");
        else if (t.indexOf("## ") === 0) html.push("<h3>" + inline(t.slice(3)) + "</h3>");
        else if (t.indexOf("# ") === 0) html.push("<h2>" + inline(t.slice(2)) + "</h2>");
        else if (t.indexOf("&gt; ") === 0) html.push("<blockquote>" + inline(t.slice(5)) + "</blockquote>");
        else if (t === "") html.push("");
        else html.push("<p>" + inline(t) + "</p>");
      });
      if (list) html.push("</ul>");
      if (table) html.push("</table>");
      pv.innerHTML = html.join("\n");
    }
    ta.addEventListener("input", render);
    root.appendChild(wrap);
    root.appendChild(el("p", "wg-note", c.note || "This tiny dialect (headings, bold, lists, links, code, quotes, tables) covers ~95% of everything written on GitHub."));
    render();
  }

  /* ---------- 11 · checklist : configurable scorecard with verdicts ---------- */
  function wChecklist(root, c) {
    var items = c.items || [];
    var verdicts = c.verdicts || [
      { min: 80, label: "Healthy", tone: "good", note: "" },
      { min: 45, label: "Usable, with caveats", tone: "mid", note: "" },
      { min: 0, label: "Walk away", tone: "bad", note: "" }
    ];
    var total = items.reduce(function (a, it) { return a + (it.pts || 1); }, 0);
    var state = items.map(function () { return false; });
    root.appendChild(el("p", "wg-title", c.title || "★ Score it"));
    if (c.intro) root.appendChild(el("p", "wg-note", c.intro));
    var out = el("div", "wg-rfmcard");
    items.forEach(function (it, i) {
      var row = el("div", "wg-sort-row");
      var btn = el("button", "wg-btn", "☐ " + it.t + (it.pts > 1 ? "  (+" + it.pts + ")" : ""));
      btn.type = "button";
      btn.style.textAlign = "left";
      btn.addEventListener("click", function () {
        state[i] = !state[i];
        btn.classList.toggle("right", state[i]);
        btn.textContent = (state[i] ? "☑ " : "☐ ") + it.t + (it.pts > 1 ? "  (+" + it.pts + ")" : "");
        judge();
      });
      row.appendChild(btn);
      if (it.why) row.appendChild(el("p", "wg-note", it.why));
      root.appendChild(row);
    });
    function judge() {
      var score = items.reduce(function (a, it, i) { return a + (state[i] ? (it.pts || 1) : 0); }, 0);
      var p = Math.round(score / total * 100);
      var v = verdicts[verdicts.length - 1];
      for (var i = 0; i < verdicts.length; i++) { if (p >= verdicts[i].min) { v = verdicts[i]; break; } }
      out.className = "wg-rfmcard " + v.tone;
      out.innerHTML = "<b>" + p + "% · " + v.label + "</b>" + (v.note ? "<p>" + v.note + "</p>" : "");
    }
    root.appendChild(out);
    judge();
  }

  /* ---------- boot ---------- */
  var registry = { sorter: wSorter, mdpreview: wMdPreview, checklist: wChecklist, meanmedian: wMeanMedian, kpitree: wKpiTree, funnel: wFunnel,
                   rfm: wRfm, forecast: wForecast, threshold: wThreshold, kmeans: wKmeans, clv: wClv };
  function boot() {
    var nodes = document.querySelectorAll(".widget[data-widget]");
    Array.prototype.forEach.call(nodes, function (node) {
      var fn = registry[node.getAttribute("data-widget")];
      if (fn) fn(node, cfg(node));
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
