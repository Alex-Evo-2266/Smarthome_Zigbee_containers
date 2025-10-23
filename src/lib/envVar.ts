export const PORT = process.env.PORT ?? 3000
export const CONTAINER_NAME = process.env.CONTAINER_NAME ?? "localhost"

export const RABITMQ_HOST = process.env.RABITMQ_HOST
export const RABITMQ_PORT = process.env.RABITMQ_PORT
export const EXCHANGE_SERVICE_DATA = process.env.EXCHANGE_SERVICE_DATA
export const DATA_LISTEN_QUEUE = process.env.DATA_LISTEN_QUEUE

export const MQTT_SERVICE_PATH = "MqttService"
export const ZIGBEE_SERVICE_PATH = "ZigbeeService"
export const ZIGBEE_SERVICE_COORDINATOR_INFO_PATH = "ZigbeeServiceDataInfo"
export const ZIGBEE_SERVICE_COORDINATOR_DEVICE_PATH = "ZigbeeServiceDataDevice"
export const MQTT_MESSAGES = "MQTT_messages"
export const SERVICE_NAME_IN_DATA = ZIGBEE_SERVICE_COORDINATOR_DEVICE_PATH
export const COORDINATOR_TOPIK = "zigbee2mqtt"

export const ZIGBEE_DEVICE_CLASS = "ZigbeeDevice"
export const SERVICE_DATA_POLL = "poll-service-data"
export const PREFIX_API = "/modules/smarthome_zigbee_containers"