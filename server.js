const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

http.createServer((request, response) => {
  const urlPath = decodeURIComponent(request.url.split('?')[0]);
  const safePath = path.normalize(urlPath === '/' ? '/src/index.html' : urlPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(root, safePath);

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }
    response.writeHead(200, { 'Content-Type': types[path.extname(filePath)] || 'application/octet-stream' });
    response.end(content);
  });
}).listen(4173, '127.0.0.1', () => {
  console.log('PixelPaw preview: http://127.0.0.1:4173');
});
