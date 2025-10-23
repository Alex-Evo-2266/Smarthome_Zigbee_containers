import { useCallback, useEffect, useState } from "react";
import { PREFIX_API } from "../envVar";


export const useTopic = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    const [topic, setTopic] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setStatus(null);
        
        try {
              const res = await fetch(`${PREFIX_API}/api/coordinator/topic`, { method: 'GET' });
              const data = await res.json();
              if (data.topic) {
                setTopic(data.topic)
                setStatus('✅');
              } else {
                setStatus('❌ Ошибка отправки');
              }
            } catch {
              setStatus('⚠️ Ошибка соединения');
            } finally {
              setLoading(false);
            }
    },[])

    useEffect(()=>{
        load()
    },[load])

    return{
        loading,
        topic,
        status,
        load
    }
}