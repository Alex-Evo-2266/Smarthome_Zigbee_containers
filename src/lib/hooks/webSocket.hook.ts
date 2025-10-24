'use client';

import {useCallback, useRef} from 'react'
import { NEXT_PUBLIC_WS_PREFIX } from '../envVar';

export type ISocketData = {
    type: string
    data: string
}

export interface MessageCallback {
  messageType: string; // Тип сообщения
  callback: (data: string) => void; // Функция callback, которая принимает любые данные
}

export const useSocket = (callbacks: MessageCallback[] = []) => {
  const socket = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<number | null>(null);

  const connectSocket = useCallback(() => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) return;

    const path = `ws://${window.location.host}/ws/${NEXT_PUBLIC_WS_PREFIX}`;
    socket.current = new WebSocket(path);

    socket.current.onopen = () => {
      console.log("✅ WS connected");
      if (reconnectTimer.current) {
        clearInterval(reconnectTimer.current);
        reconnectTimer.current = null;
      }
    };

    socket.current.onmessage = (e) => {
      try {
        const data: ISocketData = JSON.parse(e.data);
        callbacks.forEach((cb) => {
          if (cb.messageType === data.type) cb.callback(data.data);
        });
      } catch (err) {
        console.error("WS message parse error:", err);
      }
    };

    socket.current.onerror = (err) => {
      console.error("WS error", err);
      socket.current?.close();
    };

    socket.current.onclose = () => {
      console.log("❌ WS disconnected, reconnecting in 5s...");
      if (!reconnectTimer.current) {
        reconnectTimer.current = window.setInterval(() => {
          connectSocket();
        }, 5000);
      }
    };
  }, [callbacks]);

  const closeSocket = useCallback(() => {
    if (socket.current) {
      socket.current.close();
      socket.current = null;
    }
    if (reconnectTimer.current) {
      clearInterval(reconnectTimer.current);
      reconnectTimer.current = null;
    }
  }, []);

  return { connectSocket, closeSocket };
};
