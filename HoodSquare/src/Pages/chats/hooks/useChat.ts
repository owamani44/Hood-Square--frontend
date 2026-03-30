import { useState, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import type { IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { ChatMessage } from '../types/chat.types';


const getToken = () => localStorage.getItem('token');

const WS_URL = import.meta.env.VITE_WS_URL ?? 'http://localhost:8080/ws';

type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error';

interface UseChatReturn {
  messages: ChatMessage[];
  status: ConnectionStatus;
  connect: (username: string) => void;
  sendMessage: (content: string) => void;
  disconnect: () => void;
}

export const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus]     = useState<ConnectionStatus>('idle');

  const clientRef       = useRef<Client | null>(null);
  const usernameRef     = useRef<string>('');
  const subscriptionRef = useRef<StompSubscription | null>(null);

  const onMessageReceived = useCallback((payload: IMessage) => {
    const message: ChatMessage = JSON.parse(payload.body);
    setMessages((prev) => [...prev, message]);
  }, []);

  const connect = useCallback((username: string) => {
    if (!username.trim()) return;

    usernameRef.current = username.trim();
    setStatus('connecting');

    const token = getToken();

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 0,

      
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      onConnect: () => {
        setStatus('connected');

        subscriptionRef.current = client.subscribe(
          '/topic/public',
          onMessageReceived
        );

        client.publish({
          destination: '/app/chat.addUser',
          body: JSON.stringify({ sender: usernameRef.current, type: 'JOIN' }),
          headers: { Authorization: `Bearer ${token}` },
        });
      },

      onStompError: () => setStatus('error'),
      onDisconnect:  () => setStatus('idle'),
    });

    client.activate();
    clientRef.current = client;
  }, [onMessageReceived]);

  const sendMessage = useCallback((content: string) => {
    const trimmed = content.trim();
    if (!trimmed || !clientRef.current?.connected) return;

    clientRef.current.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({
        sender: usernameRef.current,
        content: trimmed,
        type: 'CHAT',
      }),
      headers: { Authorization: `Bearer ${getToken() ?? ''}` },
    });
  }, []);

  const disconnect = useCallback(() => {
    subscriptionRef.current?.unsubscribe();
    clientRef.current?.deactivate();
    clientRef.current = null;
    setMessages([]);
    setStatus('idle');
  }, []);

  return { messages, status, connect, sendMessage, disconnect };
};
