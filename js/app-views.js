// 应用视图 - 错题本、刷题、笔记、思维导图、设置

// ===== 3. 错题本 =====
APP.showQuestionList = function() {
  APP.setTitle('\u9519\u9898\u672C', '<button class="btn btn-primary btn-sm" onclick="APP.switchTab(\'add\')" style="padding:6px 12px;font-size:13px">+ \u65B0\u589E</button>');
  var body = document.getElementById('pageBody');

  body.innerHTML =
    '<div class="filter-bar">' +
      '<select id="listSubject" onchange="APP.renderQuestionList()">' +
        '<option value="">\u5168\u90E8\u79D1\u76EE</option>' +
        DATA.examConfig.kaoyan.subjects.map(function(s) {
          return '<option value="' + s + '">' + s + '</option>';
        }).join('') +
      '</select>' +
      '<input id="listKeyword" placeholder="\u641C\u7D22\u9898\u76EE..." oninput="APP.renderQuestionList()">' +
    '</div>' +
    '<div id="listContainer"></div>';

  APP.renderQuestionList();
};

APP.renderQuestionList = function() {
  var subject = document.getElementById('listSubject').value;
  var keyword = document.getElementById('listKeyword').value;
  var qs = DATA.filterQuestions({ subject: subject, keyword: keyword });
  var container = document.getElementById('listContainer');

  if (qs.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">\uD83D\uDCDD</div><p>\u6CA1\u6709\u627E\u5230\u9898\u76EE</p><button class="btn btn-primary btn-sm" onclick="APP.switchTab(\'add\')">\u53BB\u6DFB\u52A0\u9898\u76EE</button></div>';
    return;
  }

  container.innerHTML = qs.map(function(q) { return APP.renderCard(q); }).join('');

  container.querySelectorAll('.q-toggle-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      var card = e.target.closest('.question-card');
      card.classList.toggle('expanded');
      btn.textContent = card.classList.contains('expanded') ? '\u6536\u8D77' : '\u5C55\u5F00';
    });
  });

  container.querySelectorAll('.q-del-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      if (confirm('\u786E\u5B9A\u5220\u9664\u8FD9\u9053\u9898\u5417\uFF1F')) {
        DATA.deleteQuestion(btn.dataset.id);
        APP.renderQuestionList();
        APP.updateStatusStats();
      }
    });
  });

  container.querySelectorAll('.q-toggle-wrong').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      DATA.updateQuestion(btn.dataset.id, { isWrong: btn.dataset.wrong === 'true' ? false : true });
      APP.renderQuestionList();
      APP.updateStatusStats();
    });
  });

  APP.renderMath();
};

APP.renderCard = function(q) {
  var optHtml = '';
  if (q.options && q.options.length > 0) {
    optHtml = '<div class="q-options">' + q.options.map(function(o) {
      var isC = o.charAt(0) === q.correctAnswer;
      var isW = o.charAt(0) === q.userAnswer && q.userAnswer !== q.correctAnswer;
      return '<div class="q-option' + (isC ? ' opt-correct' : '') + (isW ? ' opt-wrong' : '') + '">' +
        APP.renderInlineFormula(o) + (isC ? ' \u2713' : '') + (isW ? ' \u2717' : '') + '</div>';
    }).join('') + '</div>';
  } else {
    optHtml = '<div class="q-answer-info"><span class="q-correct-answer">\u6B63\u786E\u7B54\u6848\uFF1A' + APP.escapeHtml(q.correctAnswer) + '</span>' +
      (q.userAnswer ? '<span class="q-user-answer answer-wrong">\u4F60\u7684\u7B54\u6848\uFF1A' + APP.escapeHtml(q.userAnswer) + '</span>' : '') + '</div>';
  }

  var detailHtml = '';
  if (q.analysis) {
    detailHtml += '<div class="q-section"><div class="q-section-title">\u89E3\u6790</div><p>' + APP.renderInlineFormula(q.analysis) + '</p></div>';
  }
  if (q.memoryTip) {
    var mtName = '';
    DATA.memoryTypes.forEach(function(m) { if (m.id === q.memoryType) mtName = m.name; });
    detailHtml += '<div class="q-section memory-box"><div class="q-section-title">\u8BB0\u5FC6\u65B9\u5F0F' + (mtName ? ' \u00B7 ' + mtName : '') + '</div><p>' + APP.renderInlineFormula(q.memoryTip) + '</p></div>';
  }
  if (q.createdAt) {
    detailHtml += '<div class="q-section" style="font-size:12px;color:var(--text-muted)">\u6DFB\u52A0\u4E8E ' + new Date(q.createdAt).toLocaleString() + '</div>';
  }

  return '<div class="question-card">' +
    '<div class="q-header">' +
      '<span class="q-badge subject">' + (q.subject||'') + '</span>' +
      (q.isWrong ? '<span class="q-badge wrong">\u9519\u9898</span>' : '<span class="q-badge correct">\u5DF2\u638C\u63E1</span>') +
      (q.source ? '<span class="q-badge year">' + APP.escapeHtml(q.source) + '</span>' : '') +
    '</div>' +
    '<div class="q-text">' + APP.renderInlineFormula(q.questionText) + '</div>' +
    optHtml +
    '<div class="q-actions" style="display:flex;gap:6px;flex-wrap:wrap">' +
      '<button class="btn btn-ghost btn-sm q-toggle-btn" style="padding:4px 10px;font-size:12px">\u5C55\u5F00</button>' +
      '<button class="btn btn-ghost btn-sm q-toggle-wrong" data-id="' + q.id + '" data-wrong="' + q.isWrong + '" style="padding:4px 10px;font-size:12px">' + (q.isWrong ? '\u6807\u8BB0\u4E3A\u5DF2\u638C\u63E1' : '\u6807\u8BB0\u4E3A\u9519\u9898') + '</button>' +
      '<button class="btn btn-ghost btn-sm btn-danger q-del-btn" data-id="' + q.id + '" style="padding:4px 10px;font-size:12px">\u5220\u9664</button>' +
    '</div>' +
    '<div class="q-details">' + detailHtml + '</div>' +
  '</div>';
};

APP.renderInlineFormula = function(text) {
  if (!text) return '';
  var html = APP.escapeHtml(text);
  html = html.replace(/\$(.+?)\$/g, function(m, f) {
    try {
      if (typeof katex !== 'undefined') {
        return katex.renderToString(f, { throwOnError: false });
      }
    } catch(e) {}
    return '<span class="math-inline">' + APP.escapeHtml(f) + '</span>';
  });
  return html;
};

// ===== 4. 刷题模式 =====
APP.showPracticeSetup = function() {
  APP.setTitle('\u5237\u9898\u6A21\u5F0F');
  var body = document.getElementById('pageBody');

  body.innerHTML =
    '<div class="form-card">' +
      '<div class="form-group">' +
        '<label class="form-label">\u79D1\u76EE</label>' +
        '<select class="form-input form-select" id="pSubject">' +
          '<option value="">\u5168\u90E8\u79D1\u76EE</option>' +
          DATA.examConfig.kaoyan.subjects.map(function(s) {
            return '<option value="' + s + '">' + s + '</option>';
          }).join('') +
        '</select>' +
      '</div>' +
      '<div class="form-row">' +
        '<div class="form-group">' +
          '<label class="form-label">\u9898\u76EE\u8303\u56F4</label>' +
          '<select class="form-input form-select" id="pScope">' +
            '<option value="wrong">\u4EC5\u9519\u9898</option>' +
            '<option value="all">\u5168\u90E8\u9898\u76EE</option>' +
          '</select>' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">\u9898\u76EE\u6570\u91CF</label>' +
          '<select class="form-input form-select" id="pCount">' +
            '<option value="5">5 \u9898</option>' +
            '<option value="10" selected>10 \u9898</option>' +
            '<option value="20">20 \u9898</option>' +
            '<option value="0">\u4E0D\u9650</option>' +
          '</select>' +
        '</div>' +
      '</div>' +
      '<button class="btn btn-primary btn-lg mt-8" onclick="APP.startPractice()">\u5F00\u59CB\u5237\u9898</button>' +
    '</div>' +
    '<div id="practiceArea" class="hidden"></div>';
};

APP.startPractice = function() {
  var subject = document.getElementById('pSubject').value;
  var scope = document.getElementById('pScope').value;
  var count = parseInt(document.getElementById('pCount').value);

  var qs = DATA.filterQuestions({ subject: subject, wrongOnly: scope === 'wrong' });
  var total = count > 0 ? Math.min(count, qs.length) : qs.length;

  if (qs.length === 0) {
    alert('\u6CA1\u6709\u7B26\u5408\u6761\u4EF6\u7684\u9898\u76EE\uFF0C\u8BF7\u5148\u6DFB\u52A0\u9898\u76EE\u3002');
    return;
  }

  // 随机打乱
  var shuffled = qs.sort(function() { return Math.random() - 0.5; }).slice(0, total);

  APP.practiceQuestions = shuffled;
  APP.practiceIndex = 0;
  APP.practiceAnswers = {};

  document.querySelector('.practice-setup') && (document.querySelector('.practice-setup').style.display = 'none');

  var area = document.getElementById('practiceArea');
  area.classList.remove('hidden');
  area.innerHTML =
    '<div class="practice-session">' +
      '<div class="practice-progress">' +
        '<span id="pProgress">1/' + shuffled.length + '</span>' +
        '<div class="practice-bar"><div class="practice-bar-fill" id="pBarFill" style="width:' + (1/shuffled.length*100) + '%"></div></div>' +
      '</div>' +
      '<div class="practice-card" id="practiceCard"></div>' +
      '<div class="practice-nav" id="practiceNav">' +
        '<button class="btn btn-secondary" id="pPrevBtn" onclick="APP.prevQuestion()" disabled>\u4E0A\u4E00\u9898</button>' +
        '<button class="btn btn-primary" id="pNextBtn" onclick="APP.nextQuestion()">\u4E0B\u4E00\u9898</button>' +
        '<button class="btn btn-secondary" id="pFinishBtn" onclick="APP.finishPractice()" style="display:none">\u5B8C\u6210</button>' +
      '</div>' +
    '</div>';

  APP.showPracticeQuestion(0);
};

APP.showPracticeQuestion = function(idx) {
  var q = APP.practiceQuestions[idx];
  if (!q) return;
  var card = document.getElementById('practiceCard');
  var sel = APP.practiceAnswers[q.id] || '';

  var optHtml = '';
  if (q.options && q.options.length > 0) {
    optHtml = q.options.map(function(o) {
      var letter = o.charAt(0);
      var cls = '';
      if (sel === letter) cls = ' selected';
      return '<div class="practice-option' + cls + '" onclick="APP.selectPracticeAnswer(\'' + q.id + '\', \'' + letter + '\')">' + APP.renderInlineFormula(o) + '</div>';
    }).join('');
  } else {
    optHtml = '<div class="form-group"><label class="form-label">\u4F60\u7684\u7B54\u6848</label><input class="form-input" id="pFreeAnswer" value="' + sel + '" placeholder="\u8F93\u5165\u7B54\u6848..." onchange="APP.practiceAnswers[\'' + q.id + '\']=this.value"></div>';
  }

  var html = '<div class="q-header">' +
    '<span class="q-badge subject">' + (q.subject||'') + '</span>' +
    '<span class="q-badge" style="background:var(--border-light)">\u7B2C ' + (idx+1) + ' \u9898</span>' +
  '</div>';
  html += '<div class="q-text">' + APP.renderInlineFormula(q.questionText) + '</div>';
  html += '<div class="practice-options">' + optHtml + '</div>';

  if (sel) {
    var isC = sel === q.correctAnswer;
    html += '<div class="practice-feedback">' +
      '<div class="practice-result ' + (isC ? 'result-right' : 'result-wrong') + '">' + (isC ? '\u2705 \u56DE\u7B54\u6B63\u786E\uFF01' : '\u274C \u56DE\u7B54\u9519\u8BEF') + '</div>' +
      '<div style="font-size:13px;margin-bottom:4px">\u4F60\u7684\u7B54\u6848\uFF1A' + sel + ' | \u6B63\u786E\u7B54\u6848\uFF1A' + q.correctAnswer + '</div>';
    if (q.analysis) {
      html += '<div style="font-size:13px;margin-top:8px"><strong>\u89E3\u6790\uFF1A</strong>' + APP.renderInlineFormula(q.analysis) + '</div>';
    }
    if (q.memoryTip) {
      html += '<div class="memory-box" style="margin-top:6px">' + APP.renderInlineFormula(q.memoryTip) + '</div>';
    }
    if (!isC) {
      html += '<button class="btn btn-sm btn-danger mt-8" onclick="APP.markWrongDuringPractice(\'' + q.id + '\')" style="margin-top:8px">\u6807\u8BB0\u4E3A\u9519\u9898</button>';
    }
    html += '</div>';
  } else {
    html += '<button class="btn btn-primary btn-lg mt-8" onclick="APP.submitPracticeAnswer(\'' + q.id + '\')" style="margin-top:12px">\u63D0\u4EA4\u7B54\u6848</button>';
  }

  card.innerHTML = html;

  // 更新进度
  document.getElementById('pProgress').textContent = (idx+1) + '/' + APP.practiceQuestions.length;
  document.getElementById('pBarFill').style.width = ((idx+1)/APP.practiceQuestions.length*100) + '%';

  // 按钮
  document.getElementById('pPrevBtn').disabled = idx === 0;
  document.getElementById('pNextBtn').style.display = idx < APP.practiceQuestions.length-1 ? 'inline-block' : 'none';
  document.getElementById('pFinishBtn').style.display = idx === APP.practiceQuestions.length-1 ? 'inline-block' : 'none';
};

APP.selectPracticeAnswer = function(id, letter) {
  APP.practiceAnswers[id] = letter;
  APP.showPracticeQuestion(APP.practiceIndex);
};

APP.submitPracticeAnswer = function(id) {
  if (!APP.practiceAnswers[id]) {
    alert('\u8BF7\u5148\u9009\u62E9\u7B54\u6848');
    return;
  }
  APP.showPracticeQuestion(APP.practiceIndex);
};

APP.markWrongDuringPractice = function(id) {
  DATA.updateQuestion(id, { isWrong: true });
  alert('\u5DF2\u6807\u8BB0\u4E3A\u9519\u9898\uFF01');
};

APP.nextQuestion = function() {
  if (APP.practiceIndex < APP.practiceQuestions.length-1) {
    APP.practiceIndex++;
    APP.showPracticeQuestion(APP.practiceIndex);
  }
};

APP.prevQuestion = function() {
  if (APP.practiceIndex > 0) {
    APP.practiceIndex--;
    APP.showPracticeQuestion(APP.practiceIndex);
  }
};

APP.finishPractice = function() {
  var total = APP.practiceQuestions.length;
  var answered = Object.keys(APP.practiceAnswers).length;
  var correct = 0;
  APP.practiceQuestions.forEach(function(q) {
    if (APP.practiceAnswers[q.id] === q.correctAnswer) correct++;
  });

  alert('\u5237\u9898\u5B8C\u6210\uFF01\n\n\u603B\u9898\u6570\uFF1A' + total + '\n\u5DF2\u4F5C\u7B54\uFF1A' + answered + '\n\u6B63\u786E\uFF1A' + correct + '\n\u9519\u8BEF\uFF1A' + (total-correct) + '\n\u6B63\u786E\u7387\uFF1A' + (total>0?(correct/total*100).toFixed(1):0) + '%');

  APP.navigate('practice', false);
  APP.showPracticeSetup();
  APP.updateStatusStats();
};

// ===== 5. 更多菜单 =====
APP.showMoreMenu = function() {
  APP.setTitle('\u66F4\u591A');
  var body = document.getElementById('pageBody');
  body.innerHTML =
    '<div class="form-card">' +
      '<button class="quick-action-btn w-full" onclick="APP.navigate(\'sub-notes\',true)" style="margin-bottom:10px">' +
        '<span class="qa-icon">\uD83D\uDCCB</span>\u7B14\u8BB0\u751F\u6210' +
      '</button>' +
      '<button class="quick-action-btn w-full" onclick="APP.navigate(\'sub-mindmap\',true)" style="margin-bottom:10px">' +
        '<span class="qa-icon">\uD83E\uDDE0</span>\u601D\u7EF4\u5BFC\u56FE' +
      '</button>' +
      '<button class="quick-action-btn w-full" onclick="APP.navigate(\'sub-settings\',true)" style="margin-bottom:10px">' +
        '<span class="qa-icon">\u2699\uFE0F</span>\u8BBE\u7F6E \u00B7 \u6570\u636E\u7BA1\u7406' +
      '</button>' +
      '<button class="quick-action-btn w-full" onclick="APP.navigate(\'sub-about\',true)">' +
        '<span class="qa-icon">\u2139\uFE0F</span>\u5173\u4E8E' +
      '</button>' +
    '</div>';
};

// ===== 6. 笔记生成 =====
APP.showNotes = function() {
  APP.setTitle('\u7B14\u8BB0\u751F\u6210', '<button class="btn btn-primary btn-sm" onclick="APP.generateNotes()" style="padding:6px 12px;font-size:13px">\uD83D\uDD04 \u751F\u6210</button>');
  var body = document.getElementById('pageBody');
  body.innerHTML =
    '<div class="note-controls">' +
      '<select id="noteSubject">' +
        '<option value="">\u5168\u90E8\u79D1\u76EE</option>' +
        DATA.examConfig.kaoyan.subjects.map(function(s) {
          return '<option value="' + s + '">' + s + '</option>';
        }).join('') +
      '</select>' +
      '<select id="noteScope">' +
        '<option value="all">\u5168\u90E8\u9898\u76EE</option>' +
        '<option value="wrong">\u4EC5\u9519\u9898</option>' +
      '</select>' +
    '</div>' +
    '<div class="form-card" style="margin-bottom:10px">' +
      '<label class="checkbox-label" style="display:inline-flex;align-items:center;gap:6px;margin-right:12px;font-size:13px"><input type="checkbox" id="noteAnalysis" checked> \u89E3\u6790</label>' +
      '<label class="checkbox-label" style="display:inline-flex;align-items:center;gap:6px;margin-right:12px;font-size:13px"><input type="checkbox" id="noteMemory" checked> \u8BB0\u5FC6\u65B9\u5F0F</label>' +
      '<label class="checkbox-label" style="display:inline-flex;align-items:center;gap:6px;font-size:13px"><input type="checkbox" id="noteGroup" checked> \u6309\u79D1\u76EE\u5206\u7EC4</label>' +
    '</div>' +
    '<div id="noteContent"><div class="empty-state"><p>\u70B9\u51FB\u4E0A\u65B9\u201C\u751F\u6210\u201D\u6309\u94AE\u6784\u5EFA\u590D\u4E60\u7B14\u8BB0</p></div></div>';
};

APP.generateNotes = function() {
  var subject = document.getElementById('noteSubject').value;
  var scope = document.getElementById('noteScope').value;
  var incAnalysis = document.getElementById('noteAnalysis').checked;
  var incMemory = document.getElementById('noteMemory').checked;
  var groupBySubj = document.getElementById('noteGroup').checked;

  var qs = DATA.filterQuestions({ subject: subject, wrongOnly: scope === 'wrong' });
  if (qs.length === 0) {
    document.getElementById('noteContent').innerHTML = '<div class="empty-state"><p>\u6CA1\u6709\u7B26\u5408\u6761\u4EF6\u7684\u9898\u76EE</p></div>';
    return;
  }

  var html = '<div class="generated-note">';
  html += '<div class="note-title">\u590D\u4E60\u7B14\u8BB0</div>';
  html += '<div class="note-date">' + new Date().toLocaleString() + ' \u00B7 \u5171 ' + qs.length + ' \u9898 \u00B7 \u76EE\u6807\uFF1A\u54C8\u5C14\u6EE8\u5DE5\u4E1A\u5927\u5B66</div>';

  if (groupBySubj) {
    var groups = {};
    qs.forEach(function(q) {
      var k = q.subject || '\u672A\u5206\u7C7B';
      if (!groups[k]) groups[k] = [];
      groups[k].push(q);
    });
    for (var sub in groups) {
      if (!groups.hasOwnProperty(sub)) continue;
      html += '<div class="note-group">';
      html += '<div class="note-group-title">' + sub + '\uFF08' + groups[sub].length + '\u9898\uFF09</div>';
      groups[sub].forEach(function(q, i) {
        html += APP.renderNoteItem(q, i+1, incAnalysis, incMemory);
      });
      html += '</div>';
    }
  } else {
    qs.forEach(function(q, i) {
      html += APP.renderNoteItem(q, i+1, incAnalysis, incMemory);
    });
  }

  html += '</div>';
  html += '<div class="form-actions mt-12"><button class="btn btn-primary" onclick="window.print()">\uD83D\uDDB6 \u6253\u5370 / \u5BFC\u51FA</button></div>';

  document.getElementById('noteContent').innerHTML = html;
};

APP.renderNoteItem = function(q, idx, incAnalysis, incMemory) {
  var html = '<div class="note-item">';
  html += '<div style="font-size:12px;color:var(--text-muted);margin-bottom:4px">#' + idx + ' [' + (q.subject||'') + ']</div>';
  html += '<div class="note-question">' + APP.renderInlineFormula(q.questionText) + '</div>';
  html += '<div class="note-answer">\u7B54\u6848\uFF1A' + APP.escapeHtml(q.correctAnswer) + (q.userAnswer ? ' \uFF08\u4F60\u9009\uFF1A' + APP.escapeHtml(q.userAnswer) + '\uFF09' : '') + '</div>';
  if (incAnalysis && q.analysis) html += '<div class="note-analysis"><strong>\u89E3\u6790\uFF1A</strong>' + APP.renderInlineFormula(q.analysis) + '</div>';
  if (incMemory && q.memoryTip) html += '<div class="note-memory"><strong>\u8BB0\u5FC6\u65B9\u5F0F\uFF1A</strong>' + APP.renderInlineFormula(q.memoryTip) + '</div>';
  html += '</div>';
  return html;
};

// ===== 7. 思维导图 =====
APP.showMindMap = function() {
  APP.setTitle('\u601D\u7EF4\u5BFC\u56FE');
  var body = document.getElementById('pageBody');
  body.innerHTML =
    '<div class="mindmap-toolbar">' +
      '<select id="mmSubject" class="form-input form-select" style="flex:1;min-width:100px" onchange="APP.renderMindMap()">' +
        '<option value="">\u5168\u90E8\u79D1\u76EE</option>' +
        DATA.examConfig.kaoyan.subjects.map(function(s) {
          return '<option value="' + s + '">' + s + '</option>';
        }).join('') +
      '</select>' +
      '<button class="btn btn-secondary btn-sm" onclick="APP.renderMindMap()">\u7ECF\u5178\u6A21\u5F0F</button>' +
      '<button class="btn btn-secondary btn-sm" onclick="APP.renderMindMapTree()">\u6811\u5F62\u6A21\u5F0F</button>' +
    '</div>' +
    '<div class="mindmap-container" id="mindmapContainer">' +
      '<div class="empty-state"><p>\u9009\u62E9\u79D1\u76EE\u540E\u70B9\u51FB\u6A21\u5F0F\u6309\u94AE\u751F\u6210\u601D\u7EF4\u5BFC\u56FE</p></div>' +
    '</div>';
};

APP.renderMindMap = function() {
  var subject = document.getElementById('mmSubject').value;
  var qs = DATA.filterQuestions({ subject: subject });
  var container = document.getElementById('mindmapContainer');

  if (qs.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>\u8FD9\u4E2A\u79D1\u76EE\u8FD8\u6CA1\u6709\u9898\u76EE</p></div>';
    return;
  }

  // 用 SVG 绘制思维导图
  var svgW = 600;
  var nodeH = 28;
  var padding = 20;
  var cardW = 200;

  var nodes = qs.slice(0, 12).map(function(q, i) {
    var text = q.questionText.replace(/\$(.+?)\$/g, '[$1]');
    if (text.length > 20) text = text.slice(0, 18) + '...';
    return { id: q.id, text: text, subject: q.subject, wrong: q.isWrong };
  });

  // 按科目分组
  var groups = {};
  nodes.forEach(function(n) {
    var k = n.subject || '\u672A\u5206\u7C7B';
    if (!groups[k]) groups[k] = [];
    groups[k].push(n);
  });

  var subjList = Object.keys(groups);
  var totalN = nodes.length;
  var totalH = totalN * (nodeH + 8) + subjList.length * 30 + 40;
  var svgH = Math.max(300, totalH);

  var svg = '<svg width="100%" viewBox="0 0 ' + svgW + ' ' + svgH + '" style="min-height:' + svgH + 'px" xmlns="http://www.w3.org/2000/svg">';
  svg += '<rect width="' + svgW + '" height="' + svgH + '" fill="white" rx="8"/>';

  // 根节点
  svg += '<rect x="10" y="10" width="120" height="30" rx="6" fill="#1d4ed8"/>';
  svg += '<text x="70" y="30" text-anchor="middle" fill="white" font-size="14" font-weight="bold">\u8003\u7814\u77E5\u8BC6\u70B9</text>';

  // 连接线
  var yPos = 50;
  subjList.forEach(function(sub) {
    var subNodes = groups[sub];
    var subH = subNodes.length * (nodeH + 8) + 20;
    var midY = yPos + subH / 2;
    svg += '<line x1="130" y1="25" x2="130" y2="' + midY + '" stroke="#dbeafe" stroke-width="2"/>';
    svg += '<line x1="130" y1="' + midY + '" x2="180" y2="' + midY + '" stroke="#dbeafe" stroke-width="2"/>';

    // 科目标题
    svg += '<rect x="180" y="' + yPos + '" width="100" height="20" rx="4" fill="#eef2ff"/>';
    svg += '<text x="230" y="' + (yPos+14) + '" text-anchor="middle" fill="#1d4ed8" font-size="11" font-weight="bold">' + sub + '</text>';
    yPos += 24;

    subNodes.forEach(function(n) {
      var color = n.wrong ? '#fee2e2' : '#d1fae5';
      var textColor = n.wrong ? '#991b1b' : '#065f46';
      var borderColor = n.wrong ? '#fca5a5' : '#6ee7b7';
      svg += '<rect x="180" y="' + yPos + '" width="' + cardW + '" height="' + nodeH + '" rx="4" fill="' + color + '" stroke="' + borderColor + '" stroke-width="1"/>';
      svg += '<text x="190" y="' + (yPos+18) + '" fill="' + textColor + '" font-size="11">' + APP.escapeHtml(n.text) + '</text>';
      yPos += (nodeH + 8);
    });

    yPos += 10;
  });

  svg += '</svg>';
  container.innerHTML = svg;
};

APP.renderMindMapTree = function() {
  // 树形思维导图（垂直布局）
  var subject = document.getElementById('mmSubject').value;
  var qs = DATA.filterQuestions({ subject: subject });
  var container = document.getElementById('mindmapContainer');

  if (qs.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>\u8FD9\u4E2A\u79D1\u76EE\u8FD8\u6CA1\u6709\u9898\u76EE</p></div>';
    return;
  }

  var items = qs.slice(0, 15);
  var html = '<div style="padding:10px">';
  html += '<div style="text-align:center;padding:10px;background:var(--primary);color:white;border-radius:8px;margin-bottom:16px;font-weight:600">\u8003\u7814\u77E5\u8BC6\u6811 - ' + (subject || '\u5168\u90E8\u79D1\u76EE') + '</div>';

  // 按科目分组
  var groups = {};
  items.forEach(function(q) {
    var k = q.subject || '\u672A\u5206\u7C7B';
    if (!groups[k]) groups[k] = [];
    groups[k].push(q);
  });

  for (var sub in groups) {
    if (!groups.hasOwnProperty(sub)) continue;
    html += '<div style="margin-bottom:12px">';
    html += '<div style="padding:8px 12px;background:var(--primary-lighter);color:var(--primary);border-radius:6px;font-weight:600;font-size:14px;margin-bottom:6px">' + sub + '</div>';
    html += '<div style="padding-left:20px;border-left:3px solid var(--primary-lighter);margin-left:8px">';
    groups[sub].forEach(function(q) {
      var text = q.questionText.replace(/\$(.+?)\$/g, '[$1]');
      if (text.length > 30) text = text.slice(0, 28) + '...';
      html += '<div style="padding:6px 10px;margin:4px 0;background:' + (q.isWrong ? 'var(--danger-light)' : 'var(--success-light)') + ';border-radius:4px;font-size:13px">' +
        '<span style="font-weight:500">' + APP.escapeHtml(text) + '</span></div>';
    });
    html += '</div></div>';
  }

  html += '</div>';
  container.innerHTML = html;
};

// ===== 8. 设置 =====
APP.showSettings = function() {
  APP.setTitle('\u8BBE\u7F6E');
  var body = document.getElementById('pageBody');
  var stats = DATA.getStats();

  body.innerHTML =
    '<div class="settings-card">' +
      '<div class="settings-item"><span class="settings-label">\u76EE\u6807\u9662\u6821</span><span class="settings-value">\u54C8\u5C14\u6EE8\u5DE5\u4E1A\u5927\u5B66</span></div>' +
      '<div class="settings-item"><span class="settings-label">\u5907\u8003\u7C7B\u578B</span><span class="settings-value">\u5168\u56FD\u7814\u7A76\u751F\u5165\u5B66\u7EDF\u4E00\u8003\u8BD5</span></div>' +
      '<div class="settings-item"><span class="settings-label">\u5F53\u524D\u603B\u9898\u91CF</span><span class="settings-value">' + stats.total + ' \u9898</span></div>' +
    '</div>' +

    '<div class="settings-card">' +
      '<div class="settings-item">' +
        '<span class="settings-label">\u6570\u636E\u5BFC\u51FA</span>' +
        '<button class="btn btn-sm btn-secondary" onclick="DATA.exportData()">\u5BFC\u51FA JSON</button>' +
      '</div>' +
      '<div class="settings-item">' +
        '<span class="settings-label">\u6570\u636E\u5BFC\u5165</span>' +
        '<label class="btn btn-sm btn-secondary" style="cursor:pointer">\u5BFC\u5165 JSON<input type="file" accept=".json" style="display:none" onchange="APP.handleImport(event)"></label>' +
      '</div>' +
    '</div>' +

    '<div class="settings-card">' +
      '<h3 style="font-size:14px;font-weight:600;margin-bottom:8px">\u8B66\u544A\u533A</h3>' +
      '<button class="btn btn-danger btn-block" onclick="APP.clearAllData()">\u6E05\u9664\u6240\u6709\u6570\u636E</button>' +
      '<p style="font-size:12px;color:var(--text-muted);margin-top:4px">\xE6\x93\x8D\xE4\xBD\x9C\xE4\xB8\x8D\xE5\x8F\xAF\xE6\x92\xA4\xE9\x94\x80\xEF\xBC\x8C\xE8\xAF\xB7\xE5\x85\x88\xE5\xAF\xBC\xE5\x87\xBA\xE5\xA4\x87\xE4\xBB\xBD"</p>' +
    '</div>' +

    '<div class="settings-card">' +
      '<h3 style="font-size:14px;font-weight:600;margin-bottom:8px">\u5173\u4E8E</h3>' +
      '<p style="font-size:13px;color:var(--text-secondary);line-height:1.7">' +
        '\u54C8\u5DE5\u5927\u8003\u7814\u52A9\u624B v1.0<br>' +
        '\u7279\u522B\u652F\u6301\u79D1\u76EE\uFF1A\u6570\u5B66\u3001\u4FE1\u53F7\u4E0E\u7CFB\u7EDF\u3001\u6570\u5B57\u4FE1\u53F7\u5904\u7406<br>' +
        '\u652F\u6301\u516C\u5F0F\u6E32\u67D3\uFF08KaTeX\uFF09\u548C\u56FE\u7247\u8BC6\u522B\uFF08Tesseract.js\uFF09' +
      '</p>' +
    '</div>';
};

APP.handleImport = function(event) {
  var file = event.target.files[0];
  if (!file) return;
  DATA.importData(file).then(function(count) {
    alert('\u6210\u529F\u5BFC\u5165\uFF01\u5F53\u524D\u5171 ' + count + ' \u9898');
    APP.updateStatusStats();
  }).catch(function(err) {
    alert('\u5BFC\u5165\u5931\u8D25\uFF1A' + err.message);
  });
};

APP.clearAllData = function() {
  if (confirm('\u786E\u5B9A\u8981\u6E05\u9664\u6240\u6709\u6570\u636E\u5417\uFF1F\u8FD9\u4E2A\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\uFF01')) {
    if (confirm('\u518D\u786E\u8BA4\u4E00\u6B21\uFF1A\u6E05\u9664\u540E\u6240\u6709\u9898\u76EE\u5C06\u4E22\u5931\u3002')) {
      DATA.saveQuestions([]);
      APP.updateStatusStats();
      APP.switchTab('dashboard');
    }
  }
};

APP.showExamPool = function() {
  APP.setTitle('历年真题');
  var body = document.getElementById('pageBody');
  body.innerHTML = '<div class=\"filter-bar\">' +
    '<select id=\"epSubject\" class=\"form-input form-select\" style=\"flex:1\" onchange=\"APP.renderExamPool()\">' +
    "<option value=''>全部科目</option>" +
    getExamSubjects('kaoyan').map(function(s){return '<option value=\"'+s+'\">'+s+'</option>';}).join('') +
    '</select>' +
    '<select id=\"epYear\" class=\"form-input form-select\" style=\"flex:1\" onchange=\"APP.renderExamPool()\">' +
    '<option value=\"\">全部年份</option></select>' +
    '<button class=\"btn btn-primary btn-sm\" onclick=\"APP.renderExamPool()\">查询</button>' +
  '</div><div id=\"examPoolList\"></div>';
  APP.renderExamPool();
};

APP.renderExamPool = function() {
  var sub = document.getElementById('epSubject').value;
  var yr = document.getElementById('epYear').value;
  var qs = sub ? getExamQuestions('kaoyan', sub) : [];
  if (!sub) {
    var all = [];
    getExamSubjects('kaoyan').forEach(function(s){all=all.concat(getExamQuestions('kaoyan',s));});
    qs = all;
  }
  if (yr) qs = qs.filter(function(q){return q.year==yr;});
  var container = document.getElementById('examPoolList');
  if (qs.length==0) {
    container.innerHTML = '<div class=\"empty-state\"><p>暂无真题数据</p></div>'; return;
  }
  qs.sort(function(a,b){return b.year-a.year;});
  container.innerHTML = qs.map(function(q){
    var opts = q.o ? q.o.map(function(o){return '<div class=\"q-option'+'">'+APP.renderInlineFormula(o)+'</div>';}).join('') : '';
    return '<div class=\"question-card\">' +
      '<div class=\"q-header\"><span class=\"q-badge year-badge\">'+q.year+'</span><span class=\"q-badge exam-badge\">'+sub+'</span></div>' +
      '<div class=\"q-text\">'+APP.renderInlineFormula(q.q)+'</div>' +
      '<div class=\"q-options\">'+opts+'</div>' +
      '<div class=\"q-answer-info\"><span class=\"q-correct-answer\">答案：'+q.a+'</span></div>' +
      (q.an ? '<button class=\"btn btn-ghost btn-sm q-expand-btn\" onclick=\"this.parentNode.classList.toggle('expanded');this.textContent=this.parentNode.classList.contains('expanded')?'收起':'展开'\">展开解析</button><div class=\"q-details\">'+APP.renderInlineFormula(q.an)+(q.mem?'<div class=\"memory-box mt-8\">'+q.mem+'</div>':'')+'</div>' : '') +
    '</div>';
  }).join('');
};

APP.showAbout = function() {
  APP.setTitle('\u5173\u4E8E');
  var body = document.getElementById('pageBody');
  body.innerHTML =
    '<div class="settings-card" style="text-align:center;padding:32px">' +
      '<div style="font-size:48px;margin-bottom:12px">\uD83D\uDCDA</div>' +
      '<h2 style="font-size:20px;font-weight:700;color:var(--primary);margin-bottom:4px">\u54C8\u5DE5\u5927\u8003\u7814\u52A9\u624B</h2>' +
      '<p style="font-size:13px;color:var(--text-muted);margin-bottom:16px">v1.0 \u00B7 \u4E13\u6CE8\u54C8\u5C14\u6EE8\u5DE5\u4E1A\u5927\u5B66\u8003\u7814\u5907\u8003</p>' +
      '<div style="text-align:left;font-size:13px;color:var(--text-secondary);line-height:2">' +
        '<p>\u2705 \u952E\u76D8\u8F93\u5165 / \u56FE\u7247\u8BC6\u522B\u5F55\u5165\u9898\u76EE</p>' +
        '<p>\u2705 \u652F\u6301 LaTeX \u516C\u5F0F\u6E32\u67D3\uFF08KaTeX\uFF09</p>' +
        '<p>\u2705 \u601D\u7EF4\u5BFC\u56FE\u53EF\u89C6\u5316\u77E5\u8BC6\u70B9</p>' +
        '<p>\u2705 \u5237\u9898\u6A21\u5F0F + \u9519\u9898\u8FFD\u8E2A</p>' +
        '<p>\u2705 \u590D\u4E60\u7B14\u8BB0\u81EA\u52A8\u751F\u6210 + \u6253\u5370</p>' +
        '<p>\u2705 JSON \u5BFC\u51FA/\u5BFC\u5165\uFF0C\u8DE8\u8BBE\u5907\u540C\u6B65</p>' +
        '<p>\u2705 \u79FB\u52A8\u7AEF\u4F18\u5148\uFF0C\u89E6\u63A7\u53CB\u597D</p>' +
      '</div>' +
      '<p style="font-size:12px;color:var(--text-muted);margin-top:16px">\u6570\u636E\u5B58\u50A8\u5728\u672C\u5730\u6D4F\u89C8\u5668\u4E2D\uFF0C\u5BFC\u51FA JSON \u53EF\u8DE8\u8BBE\u5907\u540C\u6B65</p>' +
    '</div>';
};

// 应用启动
document.addEventListener('DOMContentLoaded', function() { APP.init(); });