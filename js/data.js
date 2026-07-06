// 数据层 - 专注考研（哈工大方向）

const DATA = {
  // === 考试与科目定义 ===
  currentExam: 'kaoyan',

  examConfig: {
    kaoyan: {
      name: '考研',
      target: '哈尔滨工业大学',
      subjects: ['数学', '英语一', '政治', '信号与系统', '数字信号处理']
    }
  },

  // === 记忆方式 ===
  memoryTypes: [
    { id: 'mnemonic', name: '\u53e3\u8bc0\u8bb0\u5fc6' },
    { id: 'association', name: '\u8054\u60f3\u8bb0\u5fc6' },
    { id: 'chart', name: '\u56fe\u8868\u8bb0\u5fc6' },
    { id: 'story', name: '\u6545\u4e8b\u8bb0\u5fc6' },
    { id: 'mindmap', name: '\u601d\u7ef4\u5bfc\u56fe' }
  ],

  // === localStorage 操作 ===
  getQuestions() {
    try { return JSON.parse(localStorage.getItem('hit_questions') || '[]'); }
    catch { return []; }
  },

  saveQuestions(qs) {
    localStorage.setItem('hit_questions', JSON.stringify(qs));
  },

  addQuestion(q) {
    var qs = this.getQuestions();
    q.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    q.examType = 'kaoyan';
    q.createdAt = new Date().toISOString();
    q.updatedAt = q.createdAt;
    q.isWrong = q.isWrong !== undefined ? q.isWrong : true;
    qs.push(q);
    this.saveQuestions(qs);
    this.syncToCloud();
    return q;
  },

  updateQuestion(id, updates) {
    var qs = this.getQuestions();
    var idx = qs.findIndex(function(q) { return q.id === id; });
    if (idx === -1) return null;
    qs[idx] = Object.assign({}, qs[idx], updates, { updatedAt: new Date().toISOString() });
    this.saveQuestions(qs);
    this.syncToCloud();
    return qs[idx];
  },

  deleteQuestion(id) {
    var qs = this.getQuestions();
    qs = qs.filter(function(q) { return q.id !== id; });
    this.saveQuestions(qs);
    this.syncToCloud();
  },

  filterQuestions(opts) {
    opts = opts || {};
    var qs = this.getQuestions();
    if (opts.subject) qs = qs.filter(function(q) { return q.subject === opts.subject; });
    if (opts.wrongOnly) qs = qs.filter(function(q) { return q.isWrong; });
    if (opts.keyword) {
      var kw = opts.keyword.toLowerCase();
      qs = qs.filter(function(q) {
        return (q.questionText && q.questionText.toLowerCase().indexOf(kw) !== -1) ||
               (q.analysis && q.analysis.toLowerCase().indexOf(kw) !== -1);
      });
    }
    return qs;
  },

  getStats() {
    var qs = this.getQuestions();
    var wrong = qs.filter(function(q) { return q.isWrong; });
    var bySubject = {};
    qs.forEach(function(q) {
      bySubject[q.subject] = (bySubject[q.subject] || 0) + 1;
    });
    var recentWrong = wrong.slice(-10).reverse();
    return {
      total: qs.length,
      wrong: wrong.length,
      wrongRate: qs.length > 0 ? (wrong.length / qs.length * 100).toFixed(1) : 0,
      bySubject: bySubject,
      recentWrong: recentWrong
    };
  },

  // === 跨设备同步（JSON 导出/导入） ===
  exportData() {
    var data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      target: '哈尔滨工业大学',
      examType: 'kaoyan',
      questions: this.getQuestions()
    };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'hit-exam-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
  },

  importData(file) {
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function(e) {
        try {
          var data = JSON.parse(e.target.result);
          if (!data.questions || !Array.isArray(data.questions)) {
            reject(new Error('\u65e0\u6548\u7684\u5907\u4efd\u6587\u4ef6'));
            return;
          }
          // 合并（覆盖同名ID，追加新题）
          var existing = DATA.getQuestions();
          var idMap = {};
          existing.forEach(function(q) { idMap[q.id] = true; });
          data.questions.forEach(function(q) {
            if (idMap[q.id]) {
              var idx = existing.findIndex(function(e) { return e.id === q.id; });
              if (idx !== -1) existing[idx] = q;
            } else {
              existing.push(q);
            }
          });
          DATA.saveQuestions(existing);
          resolve(existing.length);
        } catch (err) {
          reject(new Error('\u89e3\u6790\u5931\u8d25\uff1a' + err.message));
        }
      };
      reader.readAsText(file);
    });
  },

  // === 占位：云端同步接口 ===
  syncToCloud() {
    // 预留：后续接入 Firebase / WebDAV 同步
  }
};