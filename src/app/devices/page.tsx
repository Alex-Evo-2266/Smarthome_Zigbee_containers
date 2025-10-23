import { promises as fs } from "fs";
import yaml from "js-yaml";
import { Devices } from './Devices';

const CONFIG_PATH = "/app/zigbee2mqttConf/configuration.yaml";

async function getTopicFromConfig(): Promise<string | null> {
  try {
    const file = await fs.readFile(CONFIG_PATH, "utf8");
    const data = yaml.load(file) as object;
    if ("mqtt" in data && typeof data.mqtt === 'object' && data.mqtt && "base_topic" in data.mqtt && data?.mqtt?.base_topic && typeof data.mqtt.base_topic === "string") {
      return data.mqtt.base_topic;
    }
    return null;
  } catch (err) {
    console.error("Failed to read Zigbee config:", err);
    return null;
  }
}


export default async function Page() {
  
  const topic = await getTopicFromConfig();

  if (!topic) {
    return <p>⚠️ Ошибка: не удалось загрузить topic из конфигурации</p>;
  }

  return (
    <Devices topic={topic}/>
  );
}
