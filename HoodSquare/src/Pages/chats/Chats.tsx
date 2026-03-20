import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import Navbar from '../../Components/sidebar/Navbar';
import { useChat } from './hooks/useChat';
import type { ChatMessage } from './types/chat.types';
import './chats.css';

// ─── Avatar helpers ──────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  '#2196F3', '#32c787', '#00BCD4', '#ff5652',
  '#ffc107', '#ff85af', '#FF9800', '#39bbb0',
];

const getAvatarColor = (sender: string): string => {
  let hash = 0;
  for (let i = 0; i < sender.length; i++) {
    hash = 31 * hash + sender.charCodeAt(i);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

// ─── Sub-components ──────────────────────────────────────────────────────────

interface MessageItemProps {
  message: ChatMessage;
}

const MessageItem = ({ message }: MessageItemProps) => {
  if (message.type === 'JOIN' || message.type === 'LEAVE') {
    return (
      <li className="event-message">
        {message.sender} {message.type === 'JOIN' ? 'joined' : 'left'}!
      </li>
    );
  }

  return (
    <li className="chat-message">
      <i style={{ backgroundColor: getAvatarColor(message.sender) }}>
        {message.sender[0].toUpperCase()}
      </i>
      <span>{message.sender}</span>
      <p>{message.content}</p>
    </li>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const Chats = () => {
  const [nameInput, setNameInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [joined, setJoined] = useState(false);

  const { messages, status, connect, sendMessage, disconnect } = useChat();

  const messageAreaRef = useRef<HTMLUListElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    const el = messageAreaRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Cleanup WebSocket on unmount
  useEffect(() => () => disconnect(), [disconnect]);

  const handleJoin = (e: ChangeEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    connect(nameInput.trim());
    setJoined(true);
  };

  const handleSend = (e: ChangeEvent) => {
    e.preventDefault();
    sendMessage(messageInput);
    setMessageInput('');
  };

  return (
    <div className="chats">
      <Navbar />

      {/* ── Join Screen ── */}
      {!joined && (
        <div id="username-page">
          <div className="username-page-container">
            <h1 className="title">Enter a username to join the ChatRoom</h1>
            <form onSubmit={handleJoin}>
              <div className="form-group">
                <input
                  type="text"
                  id="name"
                  placeholder="Username"
                  autoComplete="off"
                  className="form-control"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </div>
              <div className="form-group">
                <button type="submit" className="accent username-submit">
                  Join ChatRoom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Chat Screen ── */}
      {joined && (
        <div id="chat-page">
          <div className="chat-container">
            <div className="chat-header">
              <h2>Chats by HoodSquare</h2>
            </div>

            {status === 'connecting' && (
              <div className="connecting">Connecting…</div>
            )}
            {status === 'error' && (
              <div className="connecting error">
                Could not connect to the server. Please refresh and try again.
              </div>
            )}

            <ul id="messageArea" ref={messageAreaRef}>
              {messages.map((msg, idx) => (
                <MessageItem key={idx} message={msg} />
              ))}
            </ul>

            <form onSubmit={handleSend}>
              <div className="form-group">
                <div className="input-group clearfix">
                  <input
                    type="text"
                    id="message"
                    placeholder="Type a message…"
                    autoComplete="off"
                    className="form-control"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    disabled={status !== 'connected'}
                  />
                  <button
                    type="submit"
                    className="primary"
                    disabled={status !== 'connected'}
                  >
                    Send
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chats;