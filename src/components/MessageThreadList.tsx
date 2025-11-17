import React from 'react';
import type { MessageThread } from '../types';
import './MessageThreadList.css';

interface MessageThreadListProps {
  threads: MessageThread[];
  onSelectThread: (threadId: string) => void;
  onClose: () => void;
}

export const MessageThreadList: React.FC<MessageThreadListProps> = ({
  threads,
  onSelectThread,
  onClose,
}) => {
  // 新着順にソート（updatedAtの降順）
  const sortedThreads = [...threads].sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      // 1時間以内：◯分前
      return `${minutes}分前`;
    } else if (hours < 24) {
      // 1時間以上24時間以内：◯時間前
      return `${hours}時間前`;
    } else {
      // それ以外：◯日前
      return `${days}日前`;
    }
  };

  return (
    <>
      <div className="message-overlay" onClick={onClose} />
      <div className="message-thread-list-panel">
        <div className="message-thread-list-header">
          <h2 className="message-thread-list-title">メッセージ</h2>
          <button className="message-thread-list-close" onClick={onClose} aria-label="閉じる">
            ×
          </button>
        </div>

        <div className="message-thread-list-content">
          {sortedThreads.length === 0 ? (
            <div className="message-thread-list-empty">
              <p>メッセージがありません</p>
            </div>
          ) : (
            sortedThreads.map((thread) => (
              <button
                key={thread.id}
                className="message-thread-item"
                onClick={() => onSelectThread(thread.id)}
              >
                <div className="message-thread-avatar-wrapper">
                  <div className="message-thread-avatar">
                    {thread.partnerIconUrl ? (
                      <img src={thread.partnerIconUrl} alt={thread.partnerName} />
                    ) : (
                      <div className="message-thread-avatar-placeholder">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  {thread.unreadCount > 0 && (
                    <div className="message-thread-unread-badge">{thread.unreadCount}</div>
                  )}
                </div>

                <div className="message-thread-info">
                  <div className="message-thread-top">
                    <div className="message-thread-names">
                      <span className="message-thread-company">{thread.partnerCompanyName}</span>
                      <span className="message-thread-name">{thread.partnerName}</span>
                    </div>
                    <span className="message-thread-time">
                      {formatTimestamp(thread.latestMessageTimestamp)}
                    </span>
                  </div>
                  <div className="message-thread-preview">{thread.latestMessageContent}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
};

