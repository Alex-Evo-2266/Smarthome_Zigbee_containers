import { NextResponse } from 'next/server';
import { publishToQueue } from '@/lib/rabbitmq';
import { DATA_LISTEN_QUEUE } from '@/lib/envVar';
import { CoordinatorConfig } from '@/lib/readConfig';

const coordinatorConfig = new CoordinatorConfig()

export async function POST() {
  try {
    if(coordinatorConfig.coordinatorTopik)
    {
    await publishToQueue(DATA_LISTEN_QUEUE ?? "deviceServerReturnData", {
          ZigbeeService: {
            [coordinatorConfig.coordinatorTopik]:{
              command: 'link',
              status: true,
            }
          },
        });

    return NextResponse.json({ success: true });
    }
    throw new Error("Coordinator_topik is empty")
  } catch (error) {
    console.error('❌ Failed to send message:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
