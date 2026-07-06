// 数据层 - 考研学习助手
var DATA = {
  examTypes: [{id:"kaoyan",name:"考研",subjects:["数学","英语一","政治","信号与系统","数字信号处理"]}],
  memoryTypes: [{id:"mnemonic",name:"口诀记忆"},{id:"association",name:"联想记忆"}],
  getCurrentExamType: function() {
    var s = localStorage.getItem("hit_ce");
    for (var i = 0; i < this.examTypes.length; i++) {
      if (this.examTypes[i].id === s) return this.examTypes[i];
    }
    return this.examTypes[0];
  },
  getQuestions: function() {
    try { return JSON.parse(localStorage.getItem("hit_q") || "[]"); } catch(e) { return []; }
  },
  saveQuestions: function(qs) { localStorage.setItem("hit_q", JSON.stringify(qs)); },
  addQuestion: function(q) {
    var qs = this.getQuestions();
    q.id = Date.now().toString(36) + Math.random().toString(36).slice(2,6);
    q.createdAt = new Date().toISOString();
    q.isWrong = true;
    qs.push(q);
    this.saveQuestions(qs);
    return q;
  },
  updateQuestion: function(id, updates) {
    var qs = this.getQuestions();
    for (var i = 0; i < qs.length; i++) {
      if (qs[i].id === id) {
        for (var k in updates) qs[i][k] = updates[k];
        qs[i].updatedAt = new Date().toISOString();
        break;
      }
    }
    this.saveQuestions(qs);
  },
  deleteQuestion: function(id) {
    this.saveQuestions(this.getQuestions().filter(function(q) { return q.id !== id; }));
  },
  filterQuestions: function(o) {
    o = o || {};
    var qs = this.getQuestions();
    if (o.subject) qs = qs.filter(function(q) { return q.subject === o.subject; });
    if (o.wrongOnly) qs = qs.filter(function(q) { return q.isWrong; });
    if (o.keyword) {
      var kw = o.keyword.toLowerCase();
      qs = qs.filter(function(q) { return q.questionText && q.questionText.toLowerCase().indexOf(kw) !== -1; });
    }
    return qs;
  },
  getStats: function() {
    var qs = this.getQuestions();
    var wr = qs.filter(function(q) { return q.isWrong; });
    var bs = {};
    qs.forEach(function(q) { bs[q.subject] = (bs[q.subject] || 0) + 1; });
    return { total: qs.length, wrong: wr.length, wrongRate: qs.length ? (wr.length / qs.length * 100).toFixed(1) : "0", bySubject: bs, recentWrong: wr.slice(-10).reverse() };
  },
  exportData: function() {
    var d = { version: "1.0", questions: this.getQuestions() };
    var b = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
    var u = URL.createObjectURL(b);
    var a = document.createElement("a");
    a.href = u; a.download = "backup-" + new Date().toISOString().slice(0,10) + ".json";
    a.click();
    URL.revokeObjectURL(u);
  }
};