// 考研学习助手 - 核心逻辑
var APP = {
  p: "dash", q: [], i: 0, ans: {},
  e: function(t) { if (!t) return ""; var d = document.createElement("div"); d.textContent = t; return d.innerHTML; },
  init: function() {
    var a = document.getElementById("app");
    a.innerHTML =
      '<div class="hdr"><h1>\u8003\u7814\u5b66\u4e60\u52a9\u624b</h1><span style="font-size:12px;opacity:.85" id="st">0\u9898</span></div>' +
      '<div class="nav" id="nv">' +
        '<button class="act" data-p="dash">\u9996\u9875</button>' +
        '<button data-p="add">\u6dfb\u52a0</button>' +
        '<button data-p="list">\u9519\u9898\u672c</button>' +
        '<button data-p="prac">\u5237\u9898</button>' +
      '</div>' +
      '<div class="pg act" id="dash"></div>' +
      '<div class="pg" id="add"></div>' +
      '<div class="pg" id="list"></div>' +
      '<div class="pg" id="prac"></div>';
    document.getElementById("nv").onclick = function(e) {
      var b = e.target.closest("button");
      if (b && b.dataset.p) {
        APP.p = b.dataset.p;
        document.querySelectorAll(".nav button").forEach(function(x) { x.classList.toggle("act", x === b); });
        document.querySelectorAll(".pg").forEach(function(x) { x.classList.toggle("act", x.id === APP.p); });
        APP.route();
    }};
    APP.upd(); APP.route();
  },
  upd: function() { var s = DB.sta(); document.getElementById("st").textContent = "\u603B" + s.t + "\u9898\u00b7\u9519" + s.w + "\u9898"; },
  route: function() {
    var m = { dash: APP.showDash, add: APP.showAdd, list: APP.showList, prac: APP.showPrac };
    if (m[APP.p]) m[APP.p]();
  },
  showDash: function() {
    var s = DB.sta(), keys = Object.keys(s.b), sub = "";
    if (keys.length) {
      var mx = Math.max.apply(null, keys.map(function(k) { return s.b[k]; }));
      sub = keys.map(function(k) {
        return '<div class="sub"><span style="width:80px;color:#6b7280;font-size:12px">' + k +
          '</span><div class="b"><div style="width:' + (s.b[k] / mx * 100) + '%"></div></div>' +
          '<span style="font-weight:600;font-size:12px;width:30px;text-align:right">' + s.b[k] + '</span></div>';
      }).join("");
    } else { sub = '<p class="empty">\u8fd8\u6ca1\u6709\u9898\u76ee</p>'; }
    var rw = s.t > 0 ? '<div class="card"><h3 style="font-size:14px;font-weight:600;margin-bottom:8px">\u6700\u8fd1\u9519\u9898</h3>' +
      s.rw.map(function(q) { return '<div class="qi"><div style="font-size:14px">' + APP.e(q.qt) + '</div>' +
        '<div style="font-size:12px;color:#9ca3af;margin-top:2px">' + q.sub + '</div></div>'; }).join("") + '</div>' : '';
    document.getElementById("dash").innerHTML =
      '<div class="stat"><div><div class="v">' + s.t + '</div><div class="l">\u603b\u9898\u91cf</div></div>' +
      '<div><div class="v" style="color:#dc2626">' + s.w + '</div><div class="l">\u9519\u9898\u6570</div></div>' +
      '<div><div class="v" style="color:#d97706">' + s.r + '%</div><div class="l">\u9519\u9898\u7387</div></div>' +
      '<div><div class="v" style="font-size:17px;color:#059669">' + DB.cur().name + '</div><div class="l">\u5907\u8003</div></div></div>' +
      '<div class="row"><button class="btn fw" onclick="document.querySelector(\'.nav button:nth-child(2)\').click()">\u2795 \u6dfb\u52a0\u9898\u76ee</button>' +
      '<button class="btn btn2 fw" onclick="document.querySelector(\'.nav button:nth-child(3)\').click()">\u9519\u9898\u672c</button></div>' +
      '<div class="card"><h3 style="font-size:14px;font-weight:600;margin-bottom:8px">\u5404\u79d1\u76ee\u5206\u5e03</h3>' + sub + '</div>' + rw;
  },
  showAdd: function() {
    document.getElementById("add").innerHTML =
      '<div class="card" style="text-align:center;cursor:pointer;padding:24px" onclick="EXT.triggerUpload()"><div style="font-size:40px;margin-bottom:8px">📷</div><div style="font-size:14px;color:#6b7280">点击上传截图/图片</div><input type="file" accept="image/*" style="display:none" id="ocrInput" onchange="EXT.handleFile(event)"></div><div id="ocrPreviewArea" style="display:none" class="card"><img id="ocrPreview" style="width:100%;max-height:250px;object-fit:contain;border-radius:6px"><div id="ocrStatus" style="font-size:13px;color:#6b7280;margin-top:6px">等待识别</div><div id="ocrResult" style="display:none;margin-top:6px"><div style="font-size:12px;color:#9ca3af">识别结果：</div><div id="ocrText" style="font-size:14px;background:#f8fafc;padding:8px;border-radius:4px;margin-top:4px"></div></div></div><div class="card"><form id="af" onsubmit="return APP.handleAdd(event)">' +
      '<div class="mb"><label class="lb">\u79d1\u76ee</label><select id="sub">' +
      DB.cur().subs.map(function(s) { return '<option value="' + s + '">' + s + '</option>'; }).join("") + '</select></div>' +
      '<div class="mb"><label class="lb">\u9898\u76ee</label><textarea id="qt" rows="3" placeholder="\u8f93\u5165\u9898\u76ee\u5185\u5bb9..."></textarea></div>' +
      '<div class="mb"><label class="lb">\u9009\u9879</label><textarea id="op" rows="4" placeholder="A. \u9009\u9879\u4e00"></textarea></div>' +
      '<div class="row"><div class="mb"><label class="lb">\u6b63\u786e\u7b54\u6848</label><input id="ca" placeholder="\u5982 A"></div>' +
      '<div class="mb"><label class="lb">\u4f60\u7684\u7b54\u6848</label><input id="ua" placeholder="\u4f60\u9009\u7684"></div></div>' +
      '<div class="mb"><label class="lb">\u89e3\u6790</label><textarea id="an" rows="2" placeholder="\u89e3\u6790..."></textarea></div>' +
      '<button class="btn fw" type="submit">\u4fdd\u5b58\u9898\u76ee</button></form></div>';
  },
  handleAdd: function(e) {
    e.preventDefault();
    var q = { sub: document.getElementById("sub").value, qt: document.getElementById("qt").value.trim(),
      op: document.getElementById("op").value.trim().split("\n").filter(function(s) { return s.trim(); }),
      ca: document.getElementById("ca").value.trim(), ua: document.getElementById("ua").value.trim(),
      an: document.getElementById("an").value.trim() };
    if (!q.qt) { alert("\u8bf7\u586b\u5199\u9898\u76ee"); return false; }
    DB.add(q); document.getElementById("af").reset(); APP.upd();
    alert("\u5df2\u4fdd\u5b58\uff01"); document.querySelector(".nav button").click(); return false;
  },
  showList: function() {
    document.getElementById("list").innerHTML =
      '<div class="card" style="padding:10px">' +
      '<select id="ls" style="width:100%;padding:8px;border:1px solid #e2e8f0;border-radius:6px;margin-bottom:8px" onchange="APP.renderList()">' +
      '<option value="">\u5168\u90e8\u79d1\u76ee</option>' +
      DB.cur().subs.map(function(s) { return '<option value="' + s + '">' + s + '</option>'; }).join("") + '</select>' +
      '<input id="lk" style="width:100%;padding:8px;border:1px solid #e2e8f0;border-radius:6px" placeholder="\u641c\u7d22..." oninput="APP.renderList()">' +
      '</div><div id="ql"></div>';
    APP.renderList();
  },
  renderList: function() {
    var s = document.getElementById("ls").value, k = document.getElementById("lk").value,
      qs = DB.fil({ s: s, w: true, k: k }), el = document.getElementById("ql");
    if (!qs.length) { el.innerHTML = '<p class="empty">\u6ca1\u6709\u627e\u5230\u9519\u9898</p>'; return; }
    el.innerHTML = qs.map(function(q) {
      return '<div class="card">' +
        '<div style="display:flex;gap:4px;margin-bottom:6px;flex-wrap:wrap">' +
        '<span class="tag tag1">' + (q.sub || "") + '</span><span class="tag tag2">\u9519\u9898</span></div>' +
        '<div style="font-size:15px;margin-bottom:8px;line-height:1.6">' + APP.e(q.qt) + '</div>' +
        (q.op && q.op.length ? '<div class="op ' + (q.op[0].charAt(0) === q.ca ? 'c' : '') + '">' + APP.e(q.op.join(", ")) + '</div>' : '') +
        '<div style="font-size:13px;margin-top:6px">\u7b54\u6848\uff1a<strong>' + APP.e(q.ca) + '</strong>' +
        (q.ua ? ' \u4f60\u9009\uff1a' + APP.e(q.ua) : '') + '</div>' +
        (q.an ? '<div style="font-size:13px;color:#6b7280;margin-top:4px">' + APP.e(q.an) + '</div>' : '') +
        '<div style="display:flex;gap:6px;margin-top:8px">' +
        '<button class="btn btn2" style="padding:6px 12px;font-size:12px;min-height:32px" onclick="DB.upd(\'' + q.id + '\',{w:false});APP.renderList();APP.upd()">\u6807\u8bb0\u5df2\u638c\u63e1</button>' +
        '<button class="btn btn3" style="padding:6px 12px;font-size:12px;min-height:32px" onclick="DB.del(\'' + q.id + '\');APP.renderList();APP.upd()">\u5220\u9664</button></div></div>';
    }).join("");
  },
  showPrac: function() {
    document.getElementById("prac").innerHTML =
      '<div class="card">' +
      '<div class="mb"><label class="lb">\u79d1\u76ee</label><select id="ps"><option value="">\u5168\u90e8</option>' +
      DB.cur().subs.map(function(s) { return '<option value="' + s + '">' + s + '</option>'; }).join("") + '</select></div>' +
      '<div class="row"><div class="mb"><label class="lb">\u8303\u56f4</label><select id="psc"><option value="w" selected>\u4ec5\u9519\u9898</option><option value="a">\u5168\u90e8</option></select></div>' +
      '<div class="mb"><label class="lb">\u6570\u91cf</label><select id="pc"><option value="5">5\u9898</option><option value="10" selected>10\u9898</option><option value="0">\u4e0d\u9650</option></select></div></div>' +
      '<button class="btn fw" onclick="APP.startPrac()">\u5f00\u59cb\u5237\u9898</button></div><div id="pa"></div>';
  },
  startPrac: function() {
    var s = document.getElementById("ps").value, c = document.getElementById("psc").value,
      n = parseInt(document.getElementById("pc").value), qs = DB.fil({ s: s, w: c === "w" });
    if (!qs.length) { alert("\u6ca1\u6709\u7b26\u5408\u6761\u4ef6\u7684\u9898\u76ee"); return; }
    qs = qs.sort(function() { return Math.random() - 0.5; });
    if (n > 0) qs = qs.slice(0, Math.min(n, qs.length));
    APP.q = qs; APP.i = 0; APP.ans = {};
    document.querySelector("#prac .card").style.display = "none";
    APP.showQ(0);
  },
  showQ: function(i) {
    var q = APP.q[i]; if (!q) return;
    var sel = APP.ans[q.id] || "", html =
      '<div class="pr"><span>' + (i + 1) + '/' + APP.q.length + '</span><div class="bar"><div style="width:' + ((i + 1) / APP.q.length * 100) + '%"></div></div></div>' +
      '<div class="card"><div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px"><span class="tag tag1">' + (q.sub || "") + '</span></div>' +
      '<div style="font-size:15px;margin-bottom:10px;line-height:1.6">' + APP.e(q.qt) + '</div>';
    if (q.op && q.op.length) {
      html += q.op.map(function(o) {
        return '<div class="op' + (sel === o.charAt(0) ? " sel" : "") + '" onclick="APP.sel(\'' + q.id + '\',\'' + o.charAt(0) + '\')">' + APP.e(o) + '</div>';
      }).join("");
    }
    if (sel) {
      var ok = sel === q.ca;
      html += '<div class="fb"><div class="' + (ok ? "ok" : "no") + '">' + (ok ? "\u2705 \u6b63\u786e" : "\u274c \u9519\u8bef") + '</div>' +
        '<div style="font-size:13px">\u4f60\u7684\u7b54\u6848\uff1a' + APP.e(sel) + ' | \u6b63\u786e\u7b54\u6848\uff1a' + APP.e(q.ca) + '</div>' +
        (q.an ? '<div style="font-size:13px;margin-top:6px">' + APP.e(q.an) + '</div>' : '') + '</div>';
    }
    html += '</div><div class="nas">' +
      (i > 0 ? '<button class="btn btn2" onclick="APP.prev()">\u4e0a\u4e00\u9898</button>' : '') +
      (i < APP.q.length - 1 ? '<button class="btn" onclick="APP.next()">\u4e0b\u4e00\u9898</button>' : '') +
      (i === APP.q.length - 1 ? '<button class="btn btn2" onclick="APP.finish()">\u5b8c\u6210</button>' : '') + '</div>';
    document.getElementById("pa").innerHTML = html;
  },
  sel: function(id, l) { APP.ans[id] = l; APP.showQ(APP.i); },
  next: function() { APP.i++; APP.showQ(APP.i); },
  prev: function() { APP.i--; APP.showQ(APP.i); },
  finish: function() {
    var c = 0; APP.q.forEach(function(q) { if (APP.ans[q.id] === q.ca) c++; });
    alert("\u5b8c\u6210\uff01\u6b63\u786e " + c + "/" + APP.q.length + "\u9898\uff0c\u6b63\u786e\u7387 " + (APP.q.length ? (c / APP.q.length * 100).toFixed(1) : "0") + "%");
    APP.showPrac(); document.querySelector("#prac .card").style.display = "block";
  }
};
document.addEventListener("DOMContentLoaded", function() { APP.init(); });
