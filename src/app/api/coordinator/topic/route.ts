// app/modules/smarthome_zigbee_containers/configuration/route.ts
import { NextResponse } from "next/server"
import { coordinatorConfig } from "@/lib/readConfig"

export async function GET() {
  try {
    return NextResponse.json({topic: coordinatorConfig.coordinatorTopik})
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as {message: string}).message }, { status: 500 })
  }
}
