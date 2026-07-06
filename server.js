/**
 * 哈工大考研助手 - 本地服务器
 * 支持局域网访问 + 简易数据同步
 * 
 * 使用方法：
 *   1. 安装 Node.js（https://nodejs.org）
 *   2. 打开终端 cd 到此目录
 *   3. npm install
 *   4. node server.js
 *   5. 浏览器打开 http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, 'data', 'sync-data.json');

// MIME 类型映射
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// 简易请求体解析
function parseBody(req) {
  return new Promise(function(resolve, reject) {
    var chunks = [];
    req.on('data', function(c) { chunks.push(c); });
    req.on('end', function() {
      try {
        var body = Buffer.concat(chunks).toString();
        resolve(body ? JSON.parse(body) : {});
      } catch(e) {
        reject(new Error('JSON 解析失败'));
      }
    });
    req.on('error', reject);
  });
}

// 静态文件服务
function serveFile(res, filePath) {
  var ext = path.extname(filePath).toLowerCase();
  var contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, function(err, data) {
    if (err) {
      // 找不到文件 -> 返回 index.html（SPA 路由兼容）
      fs.readFile(path.join(ROOT, 'load.html'), function(err2, indexData) {
        if (err2) {
          res.writeHead(500);
          res.end('500 Internal Server Error');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(indexData);
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

// 创建服务器
var server = http.createServer(function(req, res) {
  var url = req.url.split('?')[0];

  // CORS 头（允许跨设备访问）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ===== API 路由 =====
  if (url === '/api/sync' && req.method === 'POST') {
    // 保存同步数据
    parseBody(req).then(function(body) {
      fs.writeFile(DATA_FILE, JSON.stringify(body, null, 2), function(err) {
        if (err) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: '保存失败' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, savedAt: new Date().toISOString() }));
      });
    }).catch(function() {
      res.writeHead(400);
      res.end(JSON.stringify({ error: '无效的 JSON' }));
    });
    return;
  }

  if (url === '/api/sync' && req.method === 'GET') {
    // 读取同步数据
    fs.readFile(DATA_FILE, function(err, data) {
      if (err) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ questions: [] }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
    return;
  }

  if (url === '/api/backup' && req.method === 'GET') {
    // 下载完整备份
    var backup = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      target: '哈尔滨工业大学',
      examType: 'kaoyan',
      server: true
    };
    fs.readFile(DATA_FILE, function(err, data) {
      if (!err && data.length > 0) {
        try {
          backup.questions = JSON.parse(data).questions || [];
        } catch(e) {
          backup.questions = [];
        }
      } else {
        backup.questions = [];
      }
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="hit-exam-backup-' + new Date().toISOString().slice(0,10) + '.json"'
      });
      res.end(JSON.stringify(backup, null, 2));
    });
    return;
  }

  // ===== 静态文件 =====
  var filePath = url === '/' ? path.join(ROOT, 'load.html') : path.join(ROOT, url);
  serveFile(res, filePath);
});

// 启动
server.listen(PORT, '0.0.0.0', function() {
  var os = require('os');
  var interfaces = os.networkInterfaces();
  var addresses = [];

  for (var name in interfaces) {
    if (!interfaces.hasOwnProperty(name)) continue;
    for (var i = 0; i < interfaces[name].length; i++) {
      var addr = interfaces[name][i];
      if (addr.family === 'IPv4' && !addr.internal) {
        addresses.push(addr.address);
      }
    }
  }

  console.log('');
  console.log('========================================');
  console.log('  哈工大考研助手 已启动');
  console.log('========================================');
  console.log('  本机访问: http://localhost:' + PORT);
  console.log('  局域网访问:');
  if (addresses.length > 0) {
    addresses.forEach(function(ip) {
      console.log('    http://' + ip + ':' + PORT);
    });
  } else {
    console.log('    (未检测到局域网 IP，请使用本机访问)');
  }
  console.log('========================================');
  console.log('  按 Ctrl+C 停止服务器');
  console.log('');
});
*** End of File
