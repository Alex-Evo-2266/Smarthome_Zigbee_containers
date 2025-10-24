'use client';

import { Devices } from './Devices';
import { useTopic } from "@/lib/hooks/topic.hook";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSocket, MessageCallback } from '@/lib/hooks/webSocket.hook';


export default function Page() {

  const [message, setMessage] = useState<Record<string, unknown>>({})

    const setMqttMessage = useCallback((data: string) => {
        const parseData = JSON.parse(data)
        setMessage(parseData)
    },[])

  const colbacks = useMemo(()=>[
          {messageType: "message_service", callback: setMqttMessage},
  ],[setMqttMessage])

  const {connectSocket, closeSocket} = useSocket(colbacks)


  

  useEffect(() => {
          console.log(message)
      }, [message]);

      useEffect(() => {
  console.log("🟢 Page mounted");
  return () => {
    console.log("🔴 Page unmounted");
  };
}, []);


  useEffect(() => {
          console.log('MessageService connected')
          connectSocket();
          return () => closeSocket(); // закрывать при размонтировании
      }, [connectSocket, closeSocket]);



  return (
    <Devices message={message}/>
  );
}
