// lib/ws-server.ts
// import { WebSocketServer } from 'ws';
// import { Server } from 'http';
// import { consumeExchange } from './rabbitmq';
// import {EXCHANGE_SERVICE_DATA, SERVICE_NAME_IN_DATA} from './envVar'

// let started = false;

// export function startWebSocketServer(server: Server) {
//   if (started) return;

//   const wss = new WebSocketServer({ server, path: "/ws/zigbee_test" });

//   wss.on('connection', (ws) => {
//     console.log('🔌 Client connected');
//   });

//   console.log("data")

//   consumeExchange(EXCHANGE_SERVICE_DATA ?? 'exchangeServiceData', 'fanout', (msg) => {
//     console.log(`data services: ${msg}`)
//     const message = JSON.stringify({type: "message_service", data: msg})
//     wss.clients.forEach((client) => {
//       if (client.readyState === 1) {
//         client.send(message);
//       }
//     });
//   });

//   started = true;
//   console.log('✅ WebSocket server started');
// }

import { WebSocketServer } from 'ws';
import { Server } from 'http';
import { consumeExchange } from './rabbitmq';
import { EXCHANGE_SERVICE_DATA, PREFIX_API } from './envVar';

let wss: WebSocketServer | null = null;

export function startWebSocketServer(server: Server) {
  if (wss) {
    console.log('⚠️ WebSocketServer уже существует, повторно не создаём');
    return wss;
  }

  console.log('🟢 Инициализация нового WebSocket сервера...');
  wss = new WebSocketServer({ server, path: `/ws/${PREFIX_API}` });

  wss.on('connection', (ws, req) => {
    console.log(`🔌 Новый клиент подключён [${new Date().toISOString()}]`);
    console.log(`   URL: ${req.url}`);
    console.log(`   Активных клиентов: ${wss?.clients.size}`);

    ws.on('close', () => {
      console.log(`❌ Клиент отключён. Осталось: ${wss?.clients.size}`);
    });
  });

  wss.on('error', (err) => {
    console.error('💥 Ошибка WS сервера:', err);
  });

  consumeExchange(EXCHANGE_SERVICE_DATA ?? 'exchangeServiceData', 'fanout', (msg) => {
    console.log(`📨 Сообщение из RabbitMQ: ${msg.substring(0, 100)}...`);
    const message = JSON.stringify({ type: "message_service", data: msg });

    const active = Array.from(wss?.clients || []).filter(c => c.readyState === 1);
    console.log(`📤 Отправляем ${active.length} клиентам`);

    for (const client of active) {
      client.send(message);
    }
  });

  console.log('✅ WebSocket сервер успешно запущен');
  return wss;
}