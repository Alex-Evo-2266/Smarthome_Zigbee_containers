// lib/rabbitmq.ts
import { connect, ChannelModel, Channel } from 'amqplib';
import {RABITMQ_HOST, RABITMQ_PORT} from './envVar'

export async function consumeExchange(
  exchangeName: string,
  type: 'fanout' | 'direct' | 'topic',
  onMessage: (msg: string) => void,
) {
  const connection = await connect(`amqp://${RABITMQ_HOST}:${RABITMQ_PORT ?? 5672}`);
  const channel = await connection.createChannel();

  await channel.assertExchange(exchangeName, type, { durable: false });
  const q = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(q.queue, exchangeName, '');

  console.log("rabbitmq connect start")

  channel.consume(q.queue, (msg) => {
    if (msg?.content) {
      onMessage(msg.content.toString());
    }
  }, { noAck: true });
}

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

export async function getChannel() {
  if (channel) return channel;
  if (!connection) {
    connection = await connect(`amqp://${RABITMQ_HOST}:${RABITMQ_PORT ?? 5672}`);
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
