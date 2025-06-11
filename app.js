const WebSocket = require('ws');

// پورت Railway رو از ENV می‌گیره، یا به صورت لوکال 3000
const PORT = process.env.PORT || 8080;
const TARGET = 'ws://88.99.250.174:8080'; // ← آدرس WebSocket مقصد خودت

const server = new WebSocket.Server({ port: PORT });

console.log(`WebSocket proxy server running on port ${PORT}`);

server.on('connection', client => {
  console.log('Client connected.');

  const target = new WebSocket(TARGET);

  target.on('open', () => {
    // Relay: client → target
    client.on('message', msg => {
      if (target.readyState === WebSocket.OPEN) {
        target.send(msg);
      }
    });

    // Relay: target → client
    target.on('message', msg => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  });

  client.on('close', () => {
    console.log('Client disconnected.');
    target.close();
  });

  target.on('close', () => {
    console.log('Target server closed.');
    client.close();
  });
});
