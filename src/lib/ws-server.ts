import { WebSocketServer } from 'ws';
import { Server } from 'http';
import { consumeExchange } from './rabbitmq';
import { CONTAINER_NAME, EXCHANGE_SERVICE_DATA } from './envVar';

let wss: WebSocketServer | null = null;

export function startWebSocketServer(server: Server) {
  if (wss) {
    console.log('⚠️ WebSocketServer уже существует, повторно не создаём');
    return wss;
  }

  console.log('🟢 Инициализация нового WebSocket сервера...');
  wss = new WebSocketServer({ server, path: `/ws/${CONTAINER_NAME}` });

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