'use client';

import { COORDINATOR_TOPIK, PREFIX_API, SERVICE_NAME_IN_DATA, ZIGBEE_SERVICE_COORDINATOR_INFO_PATH } from '@/lib/envVar';
import { MessageService } from '@/lib/hooks/messageService.hook';
import { useEffect, useMemo, useState } from 'react';
import { ZigbeeDevice } from '../types/device';
import { ZigbeeDeviceCard } from '../components/deviceCard';

export default function Devices() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [permiteJoin, setPermiteJoin] = useState(false)
  const getInfo = (data:string) => {
    const parseData = JSON.parse(data)
    if(!parseData) return
    const data1 = parseData[ZIGBEE_SERVICE_COORDINATOR_INFO_PATH]
    if(!data1) return
    const coord = data1[COORDINATOR_TOPIK]
    if(!coord) return
    setPermiteJoin(coord.permit_join)
  }
  const {messages} = MessageService(
    {dataKey:SERVICE_NAME_IN_DATA, messageType: "message_service"},
    [{callback: getInfo, messageType: "message_service"}]
  )
  const devices = useMemo<ZigbeeDevice[]>(()=>{
    if(messages && messages[COORDINATOR_TOPIK])
    {
      const t = messages[COORDINATOR_TOPIK] as Record<string,ZigbeeDevice>
      return Object.values(t)
    }
    return []
  },[messages])

  useEffect(()=>{
    console.log(`zigbee: `, messages[COORDINATOR_TOPIK])
  },[messages])

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

  return (
    <div>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <h2>Devices</h2>
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
        </div>
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
  );
}
