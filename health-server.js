// health-server.js
const http = require('http');
const { spawn } = require('child_process');

const HEALTH_PORT = 80; // dcdeploy 默认探测 80 端口
const SUPERGATEWAY_PORT = 8000; // supergateway 使用 8000 端口

// 1. 启动健康检查服务器（监听 80 端口）
const server = http.createServer((req, res) => {
  // 所有路径（包括 / 和 /health）都返回 200 OK
  res.writeHead(200);
  res.end('OK');
});

server.listen(HEALTH_PORT, '0.0.0.0', () => {
  console.log(`Health server running on port ${HEALTH_PORT}`);
});

// 2. 启动 supergateway（监听 8000 端口）
const supergateway = spawn('supergateway', [
  '--host', '0.0.0.0',
  '--stdio', 'npx -y @modelcontextprotocol/server-sequential-thinking',
  '--port', SUPERGATEWAY_PORT,
  '--healthPath', '/health',
  '--ssePath', '/sse'
], { stdio: 'inherit' });

supergateway.on('close', (code) => {
  console.log(`supergateway exited with code ${code}`);
  process.exit(code);
});
