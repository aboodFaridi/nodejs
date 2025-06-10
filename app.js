const WebSocket = require('ws');

// سرور WebSocket برای کلاینت‌هایی که به هاست وصل می‌شن
const server = new WebSocket.Server({ port: process.env.PORT || 3000 });

server.on('connection', clientSocket => {
    console.log('Client connected.');

    // اتصال به سرور واقعی WebSocket/VPN شما
    const remoteSocket = new WebSocket('wss://88.99.250.174:8080');

    // Relay: کلاینت → سرور اصلی
    clientSocket.on('message', msg => {
        if (remoteSocket.readyState === WebSocket.OPEN) {
            remoteSocket.send(msg);
        }
    });

    // Relay: سرور اصلی → کلاینت
    remoteSocket.on('message', msg => {
        if (clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(msg);
        }
    });

    // مدیریت اتصال
    clientSocket.on('close', () => remoteSocket.close());
    remoteSocket.on('close', () => clientSocket.close());
});
