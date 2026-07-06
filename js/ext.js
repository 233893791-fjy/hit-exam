// 扩展功能：OCR 识别、公式渲染
var EXT = {
  triggerUpload: function() {
    document.getElementById("ocrInput").click();
  },
  handleFile: function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      document.getElementById("ocrPreview").src = ev.target.result;
      document.getElementById("ocrPreviewArea").style.display = "block";
      EXT.processOCR(ev.target.result);
    };
    reader.readAsDataURL(file);
  },
  processOCR: function(dataUrl) {
    if (typeof Tesseract === "undefined") {
      document.getElementById("ocrStatus").textContent = "识别引擎未加载，检查网络";
      return;
    }
    document.getElementById("ocrStatus").textContent = "正在识别...";
    Tesseract.recognize(dataUrl, "chi_sim+eng", {
      logger: function(m) {
        if (m.status === "recognizing text") {
          document.getElementById("ocrStatus").textContent = "识别中 " + Math.round(m.progress * 100) + "%";
        }
      }
    }).then(function(result) {
      var text = result.data.text;
      document.getElementById("ocrStatus").textContent = "识别完成";
      document.getElementById("ocrText").textContent = text;
      document.getElementById("ocrResult").style.display = "block";
      var qt = document.getElementById("qt");
      if (qt && !qt.value) qt.value = text;
    }).catch(function(err) {
      document.getElementById("ocrStatus").textContent = "识别失败：" + err.message;
    });
  },
  renderFormula: function(str) {
    if (typeof katex === "undefined") return str;
    return str.replace(/\$(.+?)\$/g, function(m, f) {
      try { return katex.renderToString(f, { throwOnError: false }); } catch(e) { return m; }
    });
  }
};
