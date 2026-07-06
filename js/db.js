// 数据库接口 - 全新实现
var DB = {
  types: [{id:"k",name:"考研",subs:["数学","英语一","政治","信号与系统","数字信号处理"]}],
  mems: ["口诀记忆","联想记忆","图表记忆"],
  cur: function() {
    var s = localStorage.getItem("ce");
    if (s) for (var i = 0; i < this.types.length; i++) {
      if (this.types[i].id === s) return this.types[i];
    }
    return this.types[0];
  },
  get: function() {
    try { return JSON.parse(localStorage.getItem("q") || "[]"); } catch(e) { return []; }
  },
  save: function(qs) { localStorage.setItem("q", JSON.stringify(qs)); },
  add: function(q) {
    var a = this.get();
    q.id = Date.now().toString(36) + Math.random().toString(36).slice(2,6);
    q.t = new Date().toISOString(); q.w = true;
    a.push(q); this.save(a); return q;
  },
  upd: function(id, u) {
    var a = this.get();
    for (var i = 0; i < a.length; i++) {
      if (a[i].id === id) {
        for (var k in u) a[i][k] = u[k];
        a[i].u = new Date().toISOString(); break;
      }
    }
    this.save(a);
  },
  del: function(id) {
    this.save(this.get().filter(function(q) { return q.id !== id; }));
  },
  fil: function(o) {
    o = o || {}; var a = this.get();
    if (o.s) a = a.filter(function(q) { return q.sub === o.s; });
    if (o.w) a = a.filter(function(q) { return q.w; });
    if (o.k) {
      var kw = o.k.toLowerCase();
      a = a.filter(function(q) {
        return q.qt && q.qt.toLowerCase().indexOf(kw) !== -1;
      });
    }
    return a;
  },
  sta: function() {
    var a = this.get(), w = a.filter(function(q) { return q.w; }), b = {};
    a.forEach(function(q) { b[q.sub] = (b[q.sub] || 0) + 1; });
    return { t: a.length, w: w.length,
      r: a.length ? (w.length/a.length*100).toFixed(1) : "0",
      b: b, rw: w.slice(-10).reverse() };
  },
  exp: function() {
    var d = { questions: this.get() };
    var b = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
    var u = URL.createObjectURL(b);
    var a = document.createElement("a");
    a.href = u; a.download = "backup-" + new Date().toISOString().slice(0,10) + ".json";
    a.click(); URL.revokeObjectURL(u);
  }
};
