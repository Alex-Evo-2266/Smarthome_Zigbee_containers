import { promises as fs } from "fs"
import yaml from "js-yaml"

const CONFIG_PATH = "/app/zigbee2mqttConf/configuration.yaml"

export class CoordinatorConfig{
    coordinatorTopik: string | null

    constructor(){
        this.coordinatorTopik = null

        this.readConf().then(res=>{
            if(typeof(res) === 'object' && res && "mqtt" in res){
                if(typeof(res.mqtt) === 'object' && res.mqtt && "base_topic" in res.mqtt && typeof(res.mqtt.base_topic) === "string"){
                this.coordinatorTopik = res.mqtt.base_topic
                }
            }
            return null
        })
    }

    async readConf(): Promise<unknown> {
        const file = await fs.readFile(CONFIG_PATH, "utf8")
        const data = yaml.load(file)
        return data
    }

    async saveConf(data: object): Promise<void> {
        const yamlString = yaml.dump(data)
        await fs.writeFile(CONFIG_PATH, yamlString, "utf8")
    }

}

