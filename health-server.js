// health-server.js
const http = require('http');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 8000;
const SUPERGATEWAY_PORT = parseInt(PORT) + 1; // supergateway 使用下一个端口

// 1. 启动健康检查服务器（监听 $PORT）
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

// 2. 启动 supergateway（监听 $PORT + 1）
const supergateway = spawn('supergateway', [
  '--host', '0.0.0.0',
  '--stdio', 'npx -y @modelcontextprotocol/server-sequential-thinking',
  '--port', SUPERGATEWAY_PORT, // 使用不同端口
  '--healthPath', '/health',
  '--ssePath', '/sse'
], { stdio: 'inherit' });

supergateway.on('close', (code) => {
  console.log(`supergateway exited with code ${code}`);
  process.exit(code);
});
