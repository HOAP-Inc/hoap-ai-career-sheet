import React, { useState, useRef, useEffect } from 'react';
import type { Message, MessageThread as MessageThreadType } from '../types';
import { CURRENT_USER_ID } from '../data/mockMessages';
import './MessageThread.css';

interface MessageThreadProps {
  threadId: string;
  messages: Message[];
  thread?: MessageThreadType;
  onBack: () => void;
  onClose: () => void;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  threadId,
  messages,
  thread,
  onBack,
  onClose,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // 新しいメッセージが追加されたら自動スクロール
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // textareaの高さを自動調整
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // TODO: APIに送信
    console.log('Send message:', { threadId, content: inputValue });
    
    setInputValue('');
    // textareaの高さをリセット
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // スマホ版ではEnterで送信、PC版ではEnterで改行（デフォルト動作）
    if (e.key === 'Enter' && window.innerWidth <= 768 && !e.shiftKey) {
      // スマホ版ではEnterで送信
      e.preventDefault();
      if (inputValue.trim()) {
        handleSend(e as any);
      }
    }
    // PC版ではEnterで改行（デフォルト動作をそのまま使用）
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDateHeader = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return '今日';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨日';
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  };

  // メッセージを日付でグループ化
  const groupedMessages = messages.reduce((groups, message) => {
    const dateKey = message.sentAt.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  return (
    <>
      <div className="message-overlay" onClick={onClose} />
      <div className="message-thread-panel">
        <div className="message-thread-header">
          <button className="message-thread-back" onClick={onBack} aria-label="戻る">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 12H5M12 19L5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="message-thread-header-info">
            <div className="message-thread-header-company">{thread?.partnerCompanyName}</div>
            <div className="message-thread-header-name">{thread?.partnerName}</div>
          </div>
          <button className="message-thread-close" onClick={onClose} aria-label="閉じる">
            ×
          </button>
        </div>

        <div className="message-thread-content">
          {Object.entries(groupedMessages).map(([dateKey, dateMessages]) => (
            <div key={dateKey}>
              <div className="message-date-header">
                {formatDateHeader(new Date(dateKey))}
              </div>
              {dateMessages.map((message) => {
                const isOwnMessage = message.senderId === CURRENT_USER_ID;
                return (
                  <div
                    key={message.id}
                    className={`message-bubble-wrapper ${isOwnMessage ? 'own' : 'partner'}`}
                  >
                    <div className="message-bubble">
                      <div className="message-bubble-content">{message.content}</div>
                      <div className="message-bubble-time">
                        {formatTime(message.sentAt)}
                        {isOwnMessage && message.readAt && (
                          <span className="message-read-status"> 既読</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="message-thread-input-area" onSubmit={handleSend}>
          <textarea
            ref={textareaRef}
            className="message-thread-input"
            placeholder="メッセージを入力..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            type="submit"
            className="message-thread-send"
            disabled={!inputValue.trim()}
            aria-label="送信"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <defs>
                <linearGradient id="sendGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f09433" />
                  <stop offset="25%" stopColor="#e6683c" />
                  <stop offset="50%" stopColor="#dc2743" />
                  <stop offset="75%" stopColor="#cc2366" />
                  <stop offset="100%" stopColor="#bc1888" />
                </linearGradient>
              </defs>
              <path
                d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                stroke="url(#sendGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
};

