#!/usr/bin/env node

const http = require('http');
const path = require('path');
const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');

function parsePort() {
  const idx = process.argv.findIndex(a => a === '--port' || a === '-p');
  if (idx !== -1 && process.argv[idx + 1]) {
    const p = parseInt(process.argv[idx + 1], 10);
    if (!isNaN(p)) return p;
  }
  if (process.argv[2] && !process.argv[2].startsWith('-')) {
    const p = parseInt(process.argv[2], 10);
    if (!isNaN(p)) return p;
  }
  return 3057;
}

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Usage: farhaven [--port <port>]');
  process.exit(0);
}

const port = parsePort();
const serve = serveStatic(path.resolve(__dirname, '..'));
const server = http.createServer((req, res) => {
  serve(req, res, finalhandler(req, res));
});

server.listen(port, () => {
  console.log(`Serving HTTP on port ${port} (static content)...`);
});
