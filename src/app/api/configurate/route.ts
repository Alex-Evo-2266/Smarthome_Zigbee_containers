// app/modules/smarthome_zigbee_containers/configuration/route.ts
import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import yaml from "js-yaml"

const CONFIG_PATH = "/app/zigbee2mqttConf/configuration.yaml"

export async function GET() {
  try {
    const file = await fs.readFile(CONFIG_PATH, "utf8")
    const data = yaml.load(file)
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const yamlString = yaml.dump(body)
    await fs.writeFile(CONFIG_PATH, yamlString, "utf8")
    return NextResponse.json({ status: "ok" })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
