// app/modules/smarthome_zigbee_containers/configuration/page.tsx
"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import YAML from "js-yaml"

// Monaco Editor подгружаем динамически, чтобы избежать SSR ошибок
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

export default function ConfigurationPage() {
  const [yamlText, setYamlText] = useState("")
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("")

  useEffect(() => {
    fetch("/app/modules/smarthome_zigbee_containers/configurate")
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
      const res = await fetch("/app/modules/smarthome_zigbee_containers/configurate", {
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
      <div style={{ height: "70vh", border: "1px solid #ddd", marginBottom: 10 }}>
        <MonacoEditor
          height="100%"
          defaultLanguage="yaml"
          value={yamlText}
          onChange={(value) => setYamlText(value ?? "")}
          theme="vs-dark"
          options={{
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
          }}
        />
      </div>
      <button onClick={handleSave}>Сохранить</button>
      <span style={{ marginLeft: 10 }}>{status}</span>
    </div>
  )
}
