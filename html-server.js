const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8080;

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  // 只提供standalone.html文件
  fs.readFile(path.join(__dirname, 'standalone.html'), (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end('Internal Server Error');
      return;
    }
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 200;
    res.end(data);
  });
});

// 启动服务器
server.listen(port, () => {
  console.log(`HTML服务器运行在 http://localhost:${port}`);
});
