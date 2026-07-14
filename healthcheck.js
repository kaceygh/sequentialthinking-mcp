// healthcheck.js
const http = require('http');

const PORT = process.env.PORT || 8000;
const MAX_RETRIES = 10;
const RETRY_INTERVAL = 3000;

function checkHealth() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${PORT}/health`, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(2000, () => { req.destroy(); resolve(false); });
  });
}

async function main() {
  for (let i = 0; i < MAX_RETRIES; i++) {
    const healthy = await checkHealth();
    if (healthy) {
      console.log('Health check passed');
      process.exit(0);
    }
    console.log(`Health check attempt ${i + 1} failed, retrying...`);
    await new Promise(r => setTimeout(r, RETRY_INTERVAL));
  }
  console.error('Health check failed after max retries');
  process.exit(1);
}

main();
