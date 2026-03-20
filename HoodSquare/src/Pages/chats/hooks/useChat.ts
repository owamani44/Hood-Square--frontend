import { useState, useRef, useCallback } from 'react';
import type { IMessage, StompSubscription } from '@stomp/stompjs';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { ChatMessage } from '../types/chat.types';

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
  const [status, setStatus] = useState<ConnectionStatus>('idle');

  const clientRef = useRef<Client | null>(null);
  const usernameRef = useRef<string>('');
  const subscriptionRef = useRef<StompSubscription | null>(null);

  const onMessageReceived = useCallback((payload: IMessage) => {
    const message: ChatMessage = JSON.parse(payload.body);
    setMessages((prev) => [...prev, message]);
  }, []);

  const connect = useCallback((username: string) => {
    if (!username.trim()) return;

    usernameRef.current = username.trim();
    setStatus('connecting');

    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 0,

      onConnect: () => {
        setStatus('connected');

        subscriptionRef.current = client.subscribe(
          '/topic/public',
          onMessageReceived
        );

        client.publish({
          destination: '/app/chat.addUser',
          body: JSON.stringify({ sender: usernameRef.current, type: 'JOIN' }),
        });
      },

      onStompError: () => {
        setStatus('error');
      },

      onDisconnect: () => {
        setStatus('idle');
      },
    });

    client.activate();
    clientRef.current = client;
  }, [onMessageReceived]);

  const sendMessage = useCallback((content: string) => {
    const trimmed = content.trim();
    if (!trimmed || !clientRef.current?.connected) return;

    const message: ChatMessage = {
      sender: usernameRef.current,
      content: trimmed,
      type: 'CHAT',
    };

    clientRef.current.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(message),
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
