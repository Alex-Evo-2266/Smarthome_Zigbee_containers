'use client';

import {useCallback, useRef} from 'react'
import { CONTAINER_NAME } from '../envVar';

export type ISocketData = {
    type: string
    data: string
}

export interface MessageCallback {
  messageType: string; // Тип сообщения
  callback: (data: string) => void; // Функция callback, которая принимает любые данные
}

export const useSocket = (callbacks: MessageCallback[] = []) =>{
  const socket = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<number | undefined>(undefined);

  const connectSocket = useCallback(()=>{
    if (socket.current && socket.current.readyState === WebSocket.OPEN) return; // уже подключен
    try{

      const path = `ws://${window.location.host}/ws/${CONTAINER_NAME}`
      socket.current = new WebSocket(path)

      socket.current.onmessage = (e) => {
        const data: ISocketData = JSON.parse(e.data);
        callbacks.forEach((cb) => {
          if (cb.messageType === data.type) cb.callback(data.data);
        });
      };

      socket.current.onerror = (err) => {
        console.error("WS error", err);
        socket.current?.close();
      };

      socket.current.onclose = () => {
        console.log("❌ WS disconnected, reconnecting...");
        if (!reconnectTimer.current) {
          reconnectTimer.current = window.setInterval(() => {
            connectSocket();
          }, 5000);
        }
      }

    }catch(e){
      console.error(e)
      setTimeout(connectSocket,500)
    }
  },[])

  const closeSocket = useCallback(()=>{
    if(socket.current)
      socket.current.close()
  },[])

  // const listenSocket = useCallback(()=>{
  //   connectSocket()
  //   if(!socket.current) 
  //     return;
  //   socket.current.onopen = ()=>
  //   {
  //     console.log("socket connect socket");
  //     window.clearInterval(timerId.current);
  //     if(!socket.current) return;
  //     socket.current.onmessage = function(e) {
  //       console.log(`socket ${e.data}`)
  //       const data: ISocketData = JSON.parse(e.data);
  //       console.log(`socket ${data}`)
  //       console.log(`socket ${data.data}`)
  //       for(const collback of callbacks){
  //         if(collback.messageType === data.type)
  //         {
  //           collback.callback(data.data)
  //         }
  //       }
  //     }
  //     socket.current.onerror = closeSocket
  //     socket.current.onclose = () => {
  //       console.log("socket desconnect");
  //       timerId.current = window.setInterval(() => {
  //         listenSocket();
  //       }, 10000);
  //     };
  //   }
  // },[closeSocket, connectSocket, callbacks])

  return{
    connectSocket,
    closeSocket
  }
  
}
