// 数据层 - 考研学习助手

const DATA = {
  currentExam: "kaoyan",

  examTypes: [
    {id:"kaoyan",name:"考研",subjects:["数学","英语一","政治","信号与系统","数字信号处理"]}
  ],

  examConfig: {
    kaoyan: {
      name: "考研",
      subjects: ["数学","英语一","政治","信号与系统","数字信号处理"]
    }
  },

  memoryTypes: [
    {id:"mnemonic",name:"口诀记忆"},
    {id:"association",name:"联想记忆"}
  ],

  getCurrentExamType: function() {
    var stored = localStorage.getItem("hit_currentExam");
    if (stored) {
      var found = null;
      for (var i = 0; i < this.examTypes.length; i++) {
        if (this.examTypes[i].id === stored) { found = this.examTypes[i]; break; }
      }
      if (found) return found;
    }
    return this.examTypes[0];
  },

  getQuestions: function() {
    try { return JSON.parse(localStorage.getItem("hit_questions") || "[]"); }
    catch(e) { return []; }
  },

  saveQuestions: function(qs) {
    localStorage.setItem("hit_questions", JSON.stringify(qs));
  },

  addQuestion: function(q) {
    var qs = this.getQuestions();
    q.id = Date.now().toString(36) + Math.random().toString(36).slice(2,6);
    q.examType = "kaoyan";
    q.createdAt = new Date().toISOString();
    q.isWrong = q.isWrong !== undefined ? q.isWrong : true;
    qs.push(q);
    this.saveQuestions(qs);
    return q;
  },

  filterQuestions: function(opts) {
    opts = opts || {};
    var qs = this.getQuestions();
    if (opts.subject) qs = qs.filter(function(q) { return q.subject === opts.subject; });
    if (opts.wrongOnly) qs = qs.filter(function(q) { return q.isWrong; });
    if (opts.keyword) {
      var kw = opts.keyword.toLowerCase();
      qs = qs.filter(function(q) {
        return (q.questionText && q.questionText.toLowerCase().indexOf(kw) !== -1);
      });
    }
    return qs;
  },

  getStats: function() {
    var qs = this.getQuestions();
    var wrong = qs.filter(function(q) { return q.isWrong; });
    var bySubject = {};
    qs.forEach(function(q) { bySubject[q.subject] = (bySubject[q.subject] || 0) + 1; });
    var recentWrong = wrong.slice(-10).reverse();
    return { total: qs.length, wrong: wrong.length,
      wrongRate: qs.length > 0 ? (wrong.length/qs.length*100).toFixed(1) : "0",
      bySubject: bySubject, recentWrong: recentWrong };
  },

  removeQuestion: function(id) {
    var qs = this.getQuestions().filter(function(q) { return q.id !== id; });
    this.saveQuestions(qs);
  },

  exportData: function() {
    var data = {version:"1.0",exportDate:new Date().toISOString(),questions:this.getQuestions()};
    var blob = new Blob([JSON.stringify(data,null,2)], {type:"application/json"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = "backup-"+new Date().toISOString().slice(0,10)+".json";
    a.click(); URL.revokeObjectURL(url);
  }
};