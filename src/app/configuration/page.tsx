// app/modules/smarthome_zigbee_containers/configuration/page.tsx
"use client"

import { useEffect, useState } from "react"
import YAML from "js-yaml"
import { PREFIX_API } from "@/lib/envVar"

export default function ConfigurationPage() {
  const [yamlText, setYamlText] = useState("")
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("")

  useEffect(() => {
    fetch(`${PREFIX_API}/api/configuration`)
      .then(res => res.json())
      .then(data => {
        setYamlText(YAML.dump(data))
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    try {
      const parsed = YAML.load(yamlText)
      const res = await fetch(`${PREFIX_API}/api/configuration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      })
      if (res.ok) setStatus("Сохранено!")
      else setStatus("Ошибка сохранения")
    } catch (e) {
      console.error(e)
      setStatus("Ошибка: неверный YAML")
    }
  }

  if (loading) return <div>Загрузка...</div>

  return (
    <div style={{ padding: 20 }}>
      <h1>Zigbee2MQTT Configuration</h1>
      <textarea
        style={{ width: "100%", height: 600, fontFamily: "monospace" }}
        value={yamlText}
        onChange={e => setYamlText(e.target.value)}
      />
      <div style={{ marginTop: 10 }}>
        <button onClick={handleSave}>Сохранить</button>
        <span style={{ marginLeft: 10 }}>{status}</span>
      </div>
    </div>
  )
}
