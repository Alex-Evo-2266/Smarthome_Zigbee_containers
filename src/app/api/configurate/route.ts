// app/modules/smarthome_zigbee_containers/configuration/route.ts
import { NextResponse } from "next/server"
import { CoordinatorConfig } from "@/lib/readConfig"

const coordinatorConfig = new CoordinatorConfig()

export async function GET() {
  try {
    const data = await coordinatorConfig.readConf()
    return NextResponse.json(data)
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as {message: string}).message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    await coordinatorConfig.saveConf(body)
    return NextResponse.json({ status: "ok" })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as {message: string}).message }, { status: 500 })
  }
}
