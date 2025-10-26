// lib/rabbitmq.ts
import amqp from 'amqplib';
import {RABITMQ_HOST, RABITMQ_PORT} from './envVar'

export async function consumeExchange(
  exchangeName: string,
  type: 'fanout' | 'direct' | 'topic',
  onMessage: (msg: string) => void,
  retryDelay = 5000 // задержка перед повторным подключением (мс)
) {
  let connection: amqp.ChannelModel | null = null;
  let channel: amqp.Channel | null = null;

  async function connect() {
    try {
      console.log(`[RabbitMQ] Connecting to ${RABITMQ_HOST}...`);
      connection = await amqp.connect(`amqp://${RABITMQ_HOST}`);
      channel = await connection.createChannel();

      await channel.assertExchange(exchangeName, type, { durable: false });
      const q = await channel.assertQueue('', { exclusive: true });
      await channel.bindQueue(q.queue, exchangeName, '');

      console.log(`[RabbitMQ] Connected and consuming from "${exchangeName}"`);

      channel.consume(
        q.queue,
        (msg) => {
          if (msg?.content) onMessage(msg.content.toString());
        },
        { noAck: true }
      );

      // 👉 Подписываемся на события закрытия и ошибок
      connection.on('error', (err) => {
        console.error('[RabbitMQ] Connection error:', err.message);
      });

      connection.on('close', () => {
        console.warn('[RabbitMQ] Connection closed. Reconnecting...');
        reconnect();
      });

    } catch (err) {
      console.error('[RabbitMQ] Connection failed:', (err as Error).message);
      reconnect();
    }
  }

  function reconnect() {
    setTimeout(() => {
      connect();
    }, retryDelay);
  }

  // запускаем первую попытку подключения
  await connect();
}

let connection: amqp.ChannelModel | null = null;
let channel: amqp.Channel | null = null;

export async function getChannel() {
  if (channel) return channel;
  if (!connection) {
    connection = await amqp.connect(`amqp://${RABITMQ_HOST}:${RABITMQ_PORT ?? 5672}`);
    connection.on('close', () => {
      console.warn('⚠️ RabbitMQ connection closed');
      connection = null;
      channel = null;
    });
    connection.on('error', (err) => {
      console.error('❌ RabbitMQ error:', err);
      connection = null;
      channel = null;
    });
  }
  channel = await connection.createChannel();
  return channel;
}

export async function publishToQueue(queueName: string, message: unknown) {
  const ch = await getChannel();
  await ch.assertQueue(queueName, { durable: false });
  ch.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  console.log(`📤 Sent message to ${queueName}:`, message);
}
