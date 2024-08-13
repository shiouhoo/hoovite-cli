import http from 'http';
import fs from 'fs';

export function createServer({
  port = 3000,
  task = {}
}) {
  const server = http.createServer((req, res) => {
    // 跨域设置
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // 判断请求的路径, /add?as=12
    const path = req.url === '/' ? 'index.html' : req.url.match(/\/([^?]+)/)[1];

    // 根据请求的路径返回不同的 Content-Type
    let contentType = 'text/plain';
    if (path.endsWith('.html')) {
      contentType = 'text/html';
    } else if (path.endsWith('.js')) {
      contentType = 'text/javascript';
    } else if (path.endsWith('.css')) {
      contentType = 'text/css';
    } else {
      contentType = 'application/json';
    }

    res.writeHead(200, { 'Content-Type': contentType });

    // 判断文件是否存在
    if (!fs.existsSync(`ui/${path}`)) {
      if (task[path]) {
        res.end(JSON.stringify(task[path]()));
      } else {
        res.writeHead(404);
        res.end('404 Not Found');
        return res;
      }
    } else {
      res.end(fs.readFileSync(`ui/${path}`));
    }
    return res;
  });

  // 服务器监听的端口和主机
  const HOST = '127.0.0.1';

  // 启动服务器
  server.listen(port, HOST, () => {
    console.log(`Server is running at http://${HOST}:${port}/`);
  });
  return server;
}