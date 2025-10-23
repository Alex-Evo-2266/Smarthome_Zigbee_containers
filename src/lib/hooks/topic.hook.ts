import { useEffect, useState } from "react";
import { PREFIX_API } from "../envVar";


export const useTopic = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    const [topic, setTopic] = useState<string | null>(null);

    const loadTopick = async () => {
        setLoading(true);
        setStatus(null);
        let resData = null
    
        try {
          const res = await fetch(`${PREFIX_API}/api/coordinator/topic`, { method: 'GET' });
          const data = await res.json();
          console.log(data)
          if (data.topik) {
            setTopic(data.topik)
            setStatus('✅');
            resData = data.topik
          } else {
            setStatus('❌ Ошибка отправки');
          }
        } catch {
          setStatus('⚠️ Ошибка соединения');
        } finally {
          setLoading(false);
        }
        return resData
      };

    useEffect(()=>{
      loadTopick()
    },[])

    return{
        loadTopick,
        loading,
        status,
        topic
    }
}