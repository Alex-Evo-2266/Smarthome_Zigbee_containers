'use client';

import { PREFIX_API, ZIGBEE_SERVICE_COORDINATOR_DEVICE_PATH, ZIGBEE_SERVICE_COORDINATOR_INFO_PATH } from "@/lib/envVar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ZigbeeDeviceCard } from "../components/deviceCard";
import { MessageService } from "@/lib/hooks/messageService.hook";
import { ZigbeeDevice } from "../types/device";
import { useTopic } from "@/lib/hooks/topic.hook";

interface DevicesProps{
    message: Record<string, unknown>
}

function getData(
  message: Record<string, unknown> | null | unknown,
  key1: string,
  base: unknown = null 
): unknown {
  if (!message) return base;

  // проверяем, что message реально объект и не массив
  if (typeof message === "object" && !Array.isArray(message) && key1 in message) {
    return (message as Record<string, unknown>)[key1];
  }

  return base;
}

function getDataArray<T>(
  message: Record<string, unknown> | null | unknown,
  key1: string
): T[] {
  const data = getData(message, key1, null);
  if (data && typeof data === "object" && !Array.isArray(data)) {
    // если объект, вернуть Object.values
    return Object.values(data) as T[];
  }
  if (Array.isArray(data)) return data as T[];
  return [];
}

export const Devices: React.FC<DevicesProps> = ({message}) => {
  const {topic} = useTopic();

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

const devices = useMemo(() => {
  const pathData = getData(message, ZIGBEE_SERVICE_COORDINATOR_DEVICE_PATH, null);
  return getDataArray<ZigbeeDevice>(pathData, topic ?? "");
}, [message, topic]);

    const permiteJoin = useMemo(()=>{
      return getData(
        getData(
          getData(message, ZIGBEE_SERVICE_COORDINATOR_INFO_PATH, null),
          topic ?? "", null),
        "permit_join",false)
    },[message, topic])

    useEffect(()=>{
      console.log(devices, permiteJoin)
    },[devices, permiteJoin])

    const handleSend = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${PREFIX_API}/api/send-zigbee-command`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStatus('✅ Команда отправлена');
      } else {
        setStatus('❌ Ошибка отправки');
      }
    } catch {
      setStatus('⚠️ Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

   const handleUpdateSend = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${PREFIX_API}/api/send-zigbee-command/device`, { method: 'GET' });
      const data = await res.json();
      if (data.success) {
        setStatus('✅ Команда отправлена');
      } else {
        setStatus('❌ Ошибка отправки');
      }
    } catch {
      setStatus('⚠️ Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };
  

    if (!topic) {
    return <p>⚠️ Ошибка: не удалось загрузить topic из конфигурации</p>;
  }

    return(
        <div>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <h2>Devices</h2>
                {
                  topic ? 
                  <div style={{display: "flex", gap: "5px"}}>
                  <p>permite join: {String(permiteJoin)}</p>
                  <button
                    onClick={handleSend}
                    disabled={loading}
                    style={{
                      padding: '10px 20px',
                      borderRadius: 8,
                      height: "45px",
                      backgroundColor: loading ? '#888' : '#0070f3',
                      color: 'white',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {loading ? 'Отправка...' : 'Связать Zigbee устройство'}
                  </button>
                  <button
                    onClick={handleUpdateSend}
                    disabled={loading}
                    style={{
                      padding: '10px 20px',
                      borderRadius: 8,
                      height: "45px",
                      backgroundColor: loading ? '#888' : '#0070f3',
                      color: 'white',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {loading ? 'Отправка...' : 'Перезагрузка'}
                  </button>
                </div>: null
                }
                
              </div>
              {status && <p style={{ marginTop: 10 }}>{status}</p>}
              
              <div style={{display: "flex", flexWrap: "wrap"}}>
              {
                devices.map((item, index)=>(
                  <ZigbeeDeviceCard device={item} key={index}/>
                ))
              }
              </div>
              
        </div>
    )
}