// 应用核心 - 初始化、导航、路由

var APP = {
  currentTab: 'dashboard',
  currentPage: 'dashboard',
  pageHistory: [],

  // ===== 初始化 =====
  init: function() {
    APP.renderLayout();
    APP.bindNav();
    APP.navigate('dashboard');
  },

  // ===== 渲染整体布局 =====
  renderLayout: function() {
    var app = document.getElementById('app');
    app.innerHTML =
      '<div class="status-bar">' +
        '<span class="school-badge">\u54c8\u5c14\u6ee8\u5de5\u4e1a\u5927\u5b66 \u8003\u7814\u52a9\u624b</span>' +
        '<span class="status-stats" id="statusStats"></span>' +
      '</div>' +
      '<div class="page-header" id="pageHeader">' +
        '<button class="back-btn" id="backBtn" onclick="APP.goBack()">\u2190</button>' +
        '<h1 class="page-title" id="pageTitle">\u9996\u9875</h1>' +
        '<div class="header-actions" id="headerActions"></div>' +
      '</div>' +
      '<div class="page-body" id="pageBody"></div>' +
      '<nav class="bottom-nav" id="bottomNav">' +
        '<button class="nav-item active" data-tab="dashboard"><span class="nav-icon">\uD83C\uDFE0</span>\u9996\u9875</button>' +
        '<button class="nav-item" data-tab="add"><span class="nav-icon">\u2795</span>\u6DFB\u52A0</button>' +
        '<button class="nav-item" data-tab="list"><span class="nav-icon">\uD83D\uDCDD</span>\u9519\u9898\u672C</button>' +
        '<button class="nav-item" data-tab="practice"><span class="nav-icon">\uD83C\uDFAF</span>\u5237\u9898</button>' +
        '<button class="nav-item" data-tab="more"><span class="nav-icon">\uD83D\uDCCB</span>\u66F4\u591A</button>' +
      '</nav>';
    APP.updateStatusStats();
  },

  // ===== 底部导航 =====
  bindNav: function() {
    document.getElementById('bottomNav').addEventListener('click', function(e) {
      var btn = e.target.closest('.nav-item');
      if (btn && btn.dataset.tab) {
        APP.switchTab(btn.dataset.tab);
      }
    });
  },

  switchTab: function(tab) {
    APP.currentTab = tab;
    document.querySelectorAll('.nav-item').forEach(function(el) {
      el.classList.toggle('active', el.dataset.tab === tab);
    });
    APP.navigate(tab);
  },

  // ===== 页面路由 =====
  navigate: function(page, pushHistory) {
    if (pushHistory !== false) {
      APP.pageHistory.push(APP.currentPage);
    }
    APP.currentPage = page;
    APP.updateStatusStats();

    // 显示/隐藏返回按钮
    var header = document.getElementById('pageHeader');
    header.classList.toggle('show-back', page.indexOf('sub-') === 0);

    switch (page) {
      case 'dashboard': APP.showDashboard(); break;
      case 'add': APP.showAddQuestion(); break;
      case 'list': APP.showQuestionList(); break;
      case 'practice': APP.showPracticeSetup(); break;
      case 'more': APP.showMoreMenu(); break;
      case 'sub-notes': APP.showNotes(); break;
      case 'sub-mindmap': APP.showMindMap(); break;
      case 'sub-settings': APP.showSettings(); break;
      case 'sub-exam-pool': APP.showExamPool(); break;
      case 'sub-about': APP.showAbout(); break;
      default: APP.showDashboard();
    }
  },

  goBack: function() {
    var prev = APP.pageHistory.pop();
    if (prev) APP.navigate(prev, false);
    else APP.navigate('dashboard', false);
  },

  // ===== 页面工具 =====
  setTitle: function(title, actionsHtml) {
    document.getElementById('pageTitle').textContent = title;
    document.getElementById('headerActions').innerHTML = actionsHtml || '';
  },

  updateStatusStats: function() {
    var stats = DATA.getStats();
    document.getElementById('statusStats').textContent = '\u603B' + stats.total + '\u9898 \u00B7 \u9519' + stats.wrong + '\u9898';
  },

  escapeHtml: function(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // ===== 1. 首页 =====
  showDashboard: function() {
    APP.setTitle('\u9996\u9875');
    var stats = DATA.getStats();
    var body = document.getElementById('pageBody');

    var subDistHtml = '';
    var subKeys = Object.keys(stats.bySubject);
    if (subKeys.length > 0) {
      var maxVal = Math.max.apply(null, subKeys.map(function(k) { return stats.bySubject[k]; }));
      subDistHtml = subKeys.map(function(sub) {
        var pct = (stats.bySubject[sub] / maxVal * 100);
        return '<div class="dist-row" style="display:flex;align-items:center;gap:8px;padding:4px 0">' +
          '<span style="width:80px;font-size:12px;color:var(--text-secondary);flex-shrink:0">' + sub + '</span>' +
          '<div style="flex:1;height:16px;background:var(--border-light);border-radius:8px;overflow:hidden">' +
            '<div style="height:100%;width:' + pct + '%;background:var(--primary);border-radius:8px"></div>' +
          '</div>' +
          '<span style="font-size:12px;font-weight:600;width:30px;text-align:right">' + stats.bySubject[sub] + '</span>' +
        '</div>';
      }).join('');
    } else {
      subDistHtml = '<p style="text-align:center;color:var(--text-muted);font-size:13px;padding:12px">\u8FD8\u6CA1\u6709\u9898\u76EE\u6570\u636E</p>';
    }

    var recentHtml = '';
    if (stats.recentWrong.length > 0) {
      recentHtml = stats.recentWrong.map(function(q) {
        return '<div style="padding:10px 0;border-bottom:1px solid var(--border-light)">' +
          '<div style="font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:2px">' + APP.escapeHtml(q.questionText) + '</div>' +
          '<div style="font-size:12px;color:var(--text-muted)">[' + (q.subject||'') + '] ' + new Date(q.createdAt).toLocaleDateString() + '</div>' +
        '</div>';
      }).join('');
    } else {
      recentHtml = '<p style="text-align:center;color:var(--text-muted);font-size:13px;padding:20px">\u8FD8\u6CA1\u6709\u9519\u9898\u8BB0\u5F55</p>';
    }

    body.innerHTML =
      '<div class="welcome-card">' +
        '<h2>\u5411\u7740 <span class="hit-name">\u54c8\u5C14\u6EE8\u5DE5\u4E1A\u5927\u5B66</span> \u51B2\u523A\uFF01</h2>' +
        '<p>\u4E13\u6CE8\u8003\u7814\u5907\u8003 \u00B7 \u4E3B\u8981\u79D1\u76EE\uFF1A\u6570\u5B66\u3001\u4FE1\u53F7\u4E0E\u7CFB\u7EDF\u3001\u6570\u5B57\u4FE1\u53F7\u5904\u7406</p>' +
      '</div>' +
      '<div class="dashboard-grid">' +
        '<div class="stat-card stat-total"><div class="stat-value">' + stats.total + '</div><div class="stat-label">\u603B\u9898\u91CF</div></div>' +
        '<div class="stat-card stat-wrong"><div class="stat-value">' + stats.wrong + '</div><div class="stat-label">\u9519\u9898\u6570</div></div>' +
        '<div class="stat-card stat-rate"><div class="stat-value">' + stats.wrongRate + '%</div><div class="stat-label">\u9519\u9898\u7387</div></div>' +
        '<div class="stat-card stat-target"><div class="stat-value">\u54C8\u5DE5\u5927</div><div class="stat-label">\u76EE\u6807\u9662\u6821</div></div>' +
      '</div>' +
      '<div class="quick-actions">' +
        '<button class="quick-action-btn" onclick="APP.switchTab(\'add\')"><span class="qa-icon">\uD83D\uDCF7</span>\u62CD\u7167\u5F55\u5165</button>' +
        '<button class="quick-action-btn" onclick="APP.switchTab(\'add\')"><span class="qa-icon">\u270F\uFE0F</span>\u624B\u52A8\u5F55\u5165</button>' +
        '<button class="quick-action-btn" onclick="APP.switchTab(\'list\')"><span class="qa-icon">\uD83D\uDCD6</span>\u7FFB\u770B\u9519\u9898</button>' +
        '<button class="quick-action-btn" onclick="APP.switchTab(\'practice\')"><span class="qa-icon">\uD83C\uDFAF</span>\u5F00\u59CB\u5237\u9898</button>' +
      '</div>' +
      '<div class="form-card">' +
        '<h3 style="font-size:15px;font-weight:600;margin-bottom:10px">\u5404\u79D1\u76EE\u9898\u91CF\u5206\u5E03</h3>' +
        subDistHtml +
      '</div>' +
      '<div class="form-card">' +
        '<h3 style="font-size:15px;font-weight:600;margin-bottom:10px">\u6700\u8FD1\u9519\u9898</h3>' +
        recentHtml +
      '</div>';

    APP.renderMath();
  },

  // ===== 2. 添加题目 =====
  showAddQuestion: function() {
    APP.setTitle('\u6DFB\u52A0\u9898\u76EE');
    var body = document.getElementById('pageBody');

    body.innerHTML =
      '<div class="form-card">' +
        // OCR 图片上传区域
        '<div class="ocr-upload-area" id="ocrUploadArea" onclick="APP.triggerUpload()">' +
          '<div class="upload-icon">\uD83D\uDCF7</div>' +
          '<div class="upload-text">\u70B9\u51FB\u4E0A\u4F20\u622A\u56FE / \u56FE\u7247</div>' +
          '<div class="upload-hint">\u652F\u6301 JPG \u3001 PNG \u3001 WEBP\uFF0C\u7CFB\u7EDF\u5C06\u81EA\u52A8\u8BC6\u522B\u6587\u5B57</div>' +
          '<input type="file" id="ocrFileInput" accept="image/*" style="display:none" onchange="APP.handleFileSelect(event)">' +
        '</div>' +
        '<div id="ocrPreviewArea" class="hidden">' +
          '<div class="ocr-preview"><img id="ocrPreviewImg"></div>' +
          '<div class="ocr-loading hidden" id="ocrLoading"><div class="spinner"></div><span>\u6B63\u5728\u8BC6\u522B\u4E2D\uFF0C\u8BF7\u7A0D\u5019...</span></div>' +
          '<div class="ocr-result hidden" id="ocrResult">' +
            '<div class="ocr-label">\u8BC6\u522B\u7ED3\u679C\uFF1A</div>' +
            '<div class="ocr-text" id="ocrResultText"></div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // 手动输入表单
      '<div class="form-card">' +
        '<form id="addForm" onsubmit="return APP.handleAdd(event)">' +
          // 科目选择
          '<div class="form-group">' +
            '<label class="form-label">\u79D1\u76EE</label>' +
            '<select class="form-input form-select" id="aqSubject">' +
              DATA.examConfig.kaoyan.subjects.map(function(s) {
                return '<option value="' + s + '">' + s + '</option>';
              }).join('') +
            '</select>' +
          '</div>' +
          // 题目内容（支持 LaTeX 公式）
          '<div class="form-group">' +
            '<label class="form-label">\u9898\u76EE\u5185\u5BB9 <span style="font-weight:400;color:var(--text-muted)">\u652F\u6301 LaTeX \u516C\u5F0F\uFF0C\u7528 $...$ \u5305\u56F4</span></label>' +
            '<textarea class="form-input form-textarea" id="aqText" rows="3" placeholder="\u8BF7\u8F93\u5165\u9898\u76EE\u5185\u5BB9\uFF0C\u516C\u5F0F\u7528 $...$ \u5305\u56F4\uFF0C\u5982: $\\int_{0}^{1} x^2 dx$"></textarea>' +
            '<div class="formula-preview" id="formulaPreview">\u516C\u5F0F\u9884\u89C8\u533A\u57DF</div>' +
          '</div>' +
          // 选项
          '<div class="form-group">' +
            '<label class="form-label">\u9009\u9879 <span style="font-weight:400;color:var(--text-muted)">\u6BCF\u884C\u4E00\u4E2A\uFF0C\u5982 A. xxx</span></label>' +
            '<textarea class="form-input form-textarea" id="aqOptions" rows="4" placeholder="A. \u9009\u9879\u4E00"></textarea>' +
          '</div>' +
          // 答案
          '<div class="form-row">' +
            '<div class="form-group">' +
              '<label class="form-label">\u6B63\u786E\u7B54\u6848</label>' +
              '<input class="form-input" id="aqCorrect" placeholder="\u5982 A">' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-label">\u4F60\u7684\u9009\u62E9</label>' +
              '<input class="form-input" id="aqUserAnswer" placeholder="\u4F60\u9009\u7684\u4EC0\u4E48">' +
            '</div>' +
          '</div>' +
          // 解析（支持公式）
          '<div class="form-group">' +
            '<label class="form-label">\u89E3\u6790 / \u77E5\u8BC6\u70B9\u5206\u6790</label>' +
            '<textarea class="form-input form-textarea" id="aqAnalysis" rows="3" placeholder="\u5199\u4E0B\u89E3\u6790\uFF0C\u652F\u6301 LaTeX \u516C\u5F0F"></textarea>' +
          '</div>' +
          // 记忆方式
          '<div class="form-row">' +
            '<div class="form-group">' +
              '<label class="form-label">\u8BB0\u5FC6\u65B9\u5F0F</label>' +
              '<select class="form-input form-select" id="aqMemoryType">' +
                '<option value="">\u65E0</option>' +
                DATA.memoryTypes.map(function(m) {
                  return '<option value="' + m.id + '">' + m.name + '</option>';
                }).join('') +
              '</select>' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-label">\u6765\u6E90 /\u5E74\u4EFD</label>' +
              '<input class="form-input" id="aqSource" placeholder="\u5982 2024 \u8003\u7814\u771F\u9898">' +
            '</div>' +
          '</div>' +
          // 记忆口诀
          '<div class="form-group">' +
            '<label class="form-label">\u8BB0\u5FC6\u53E3\u8BC0 / \u8054\u60F3</label>' +
            '<textarea class="form-input form-textarea" id="aqMemoryTip" rows="2" placeholder="\u5199\u4E0B\u65B9\u4FBF\u8BB0\u5FC6\u7684\u53E3\u8BC0\u3001\u8054\u60F3\u6216\u6545\u4E8B..."></textarea>' +
          '</div>' +
          // 提交
          '<div class="form-actions">' +
            '<button type="submit" class="btn btn-primary btn-lg">\u4FDD\u5B58\u9898\u76EE</button>' +
          '</div>' +
        '</form>' +
      '</div>';

    // 公式实时预览
    document.getElementById('aqText').addEventListener('input', function() {
      APP.previewFormula('aqText', 'formulaPreview');
    });
  },

  // ===== 处理 OCR 上传 =====
  triggerUpload: function() {
    document.getElementById('ocrFileInput').click();
  },

  handleFileSelect: function(event) {
    var file = event.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function(e) {
      var imgData = e.target.result;
      document.getElementById('ocrPreviewImg').src = imgData;
      document.getElementById('ocrPreviewArea').classList.remove('hidden');
      APP.runOCRTesseract(imgData);
    };
    reader.readAsDataURL(file);
  },

  runOCRTesseract: function(imageData) {
    var loadingEl = document.getElementById('ocrLoading');
    var resultEl = document.getElementById('ocrResult');
    var resultText = document.getElementById('ocrResultText');

    loadingEl.classList.remove('hidden');
    resultEl.classList.add('hidden');

    // 尝试加载 Tesseract
    var doOCR = function() {
      try {
        Tesseract.recognize(imageData, 'chi_sim+eng', {
          logger: function(m) {
            if (m.status === 'recognizing text') {
              loadingEl.querySelector('span').textContent = '\u6B63\u5728\u8BC6\u522B... ' + Math.round(m.progress * 100) + '%';
            }
          }
        }).then(function(result) {
          var text = result.data.text;
          loadingEl.classList.add('hidden');
          resultEl.classList.remove('hidden');
          resultText.textContent = text;

          // 自动填入题目内容
          var aqText = document.getElementById('aqText');
          if (aqText && !aqText.value) {
            aqText.value = text;
            APP.previewFormula('aqText', 'formulaPreview');
          }
        }).catch(function(err) {
          loadingEl.classList.add('hidden');
          resultEl.classList.remove('hidden');
          resultText.textContent = '\u8BC6\u522B\u5931\u8D25\uFF1A' + err.message + '\n\n\u8BF7\u624B\u52A8\u8F93\u5165\u9898\u76EE\u5185\u5BB9\u3002';
        });
      } catch(e) {
        loadingEl.classList.add('hidden');
        resultEl.classList.remove('hidden');
        resultText.textContent = '\u8BC6\u522B\u5F15\u64CE\u672A\u52A0\u8F7D\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u8FDE\u63A5\u3002';
      }
    };

    // 等待 Tesseract 加载
    if (typeof Tesseract !== 'undefined') {
      doOCR();
    } else {
      loadingEl.querySelector('span').textContent = '\u6B63\u5728\u52A0\u8F7D\u8BC6\u522B\u5F15\u64CE...';
      var checkInterval = setInterval(function() {
        if (typeof Tesseract !== 'undefined') {
          clearInterval(checkInterval);
          doOCR();
        }
      }, 500);
      setTimeout(function() {
        clearInterval(checkInterval);
        if (typeof Tesseract === 'undefined') {
          loadingEl.classList.add('hidden');
          resultEl.classList.remove('hidden');
          resultText.textContent = '\u8BC6\u522B\u5F15\u64CE\u52A0\u8F7D\u8D85\u65F6\uFF0C\u8BF7\u5237\u65B0\u9875\u9762\u91CD\u8BD5\u3002';
        }
      }, 30000);
    }
  },

  // ===== 公式实时预览 =====
  previewFormula: function(inputId, previewId) {
    var text = document.getElementById(inputId).value;
    var preview = document.getElementById(previewId);
    if (!preview) return;

    // 提取 $...$ 之间的内容并渲染
    var rendered = text.replace(/\$(.+?)\$/g, function(match, formula) {
      try {
        return katex.renderToString(formula, { throwOnError: false, displayMode: false });
      } catch(e) {
        return '<span style="color:var(--danger)">' + match + '</span>';
      }
    });
    preview.innerHTML = rendered || '\u516C\u5F0F\u9884\u89C8\u533A\u57DF\uFF08\u8F93\u5165 $...$ \u5373\u53EF\u9884\u89C8\uFF09';
  },

  // ===== 渲染所有公式 =====
  renderMath: function() {
    if (typeof katex !== 'undefined' && katex.render) {
      document.querySelectorAll('.math-inline').forEach(function(el) {
        try {
          katex.render(el.textContent, el, { throwOnError: false });
        } catch(e) {}
      });
    }
  },

  // ===== 提交添加题目 =====
  handleAdd: function(event) {
    event.preventDefault();
    var q = {
      subject: document.getElementById('aqSubject').value,
      questionText: document.getElementById('aqText').value.trim(),
      options: document.getElementById('aqOptions').value.trim().split('\n').filter(function(s){return s.trim();}),
      correctAnswer: document.getElementById('aqCorrect').value.trim(),
      userAnswer: document.getElementById('aqUserAnswer').value.trim(),
      isWrong: true,
      analysis: document.getElementById('aqAnalysis').value.trim(),
      memoryType: document.getElementById('aqMemoryType').value,
      memoryTip: document.getElementById('aqMemoryTip').value.trim(),
      source: document.getElementById('aqSource').value.trim()
    };

    if (!q.questionText) {
      alert('\u8BF7\u586B\u5199\u9898\u76EE\u5185\u5BB9');
      return false;
    }

    DATA.addQuestion(q);
    document.getElementById('addForm').reset();
    document.getElementById('ocrPreviewArea').classList.add('hidden');
    document.getElementById('ocrResult').classList.add('hidden');
    alert('\u9898\u76EE\u5DF2\u4FDD\u5B58\uFF01');
    APP.switchTab('list');
    return false;
  }
};