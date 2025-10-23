import { NextResponse } from 'next/server';
import { publishToQueue } from '@/lib/rabbitmq';
import { DATA_LISTEN_QUEUE } from '@/lib/envVar';

export async function GET() {
  try {
    await publishToQueue(DATA_LISTEN_QUEUE ?? "deviceServerReturnData", {
      ZigbeeService: {
        zigbee2mqtt:{
          command: 'reloadDevice',
          status: true,
        }
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Failed to send message:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
