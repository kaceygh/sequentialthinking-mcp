// health-server.js
const http = require('http');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 8000;

// 创建一个简单的 HTTP 服务器，始终返回 200
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200);
    res.end('OK');
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Health server running on port ${PORT}`);
});

// 启动 supergateway 作为子进程
const supergateway = spawn('supergateway', [
  '--host', '0.0.0.0',
  '--stdio', 'npx -y @modelcontextprotocol/server-sequential-thinking',
  '--port', PORT,
  '--healthPath', '/health',
  '--ssePath', '/sse'
], { stdio: 'inherit' });

supergateway.on('close', (code) => {
  console.log(`supergateway exited with code ${code}`);
  process.exit(code);
});
