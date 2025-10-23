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
          if (data.success) {
            console.log("p0",data)
            setTopic(data.success)
            setStatus('✅');
            resData = data.success
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