import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageThreadList } from './MessageThreadList';
import { MessageThread } from './MessageThread';
import { mockThreads, mockMessages } from '../data/mockMessages';
import './Header.css';

interface HeaderProps {
  name?: string;
  memberId?: string;
  photo?: string;
  onEditCareerSheet?: () => void;
}

const renderGradientStops = () => (
  <>
    <stop offset="0%" stopColor="#f09433" />
    <stop offset="25%" stopColor="#e6683c" />
    <stop offset="50%" stopColor="#dc2743" />
    <stop offset="75%" stopColor="#cc2366" />
    <stop offset="100%" stopColor="#bc1888" />
  </>
);

export const Header: React.FC<HeaderProps> = ({
  name,
  memberId,
  photo,
  onEditCareerSheet,
}) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMessageListOpen, setIsMessageListOpen] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [threads, setThreads] = useState(mockThreads);

  // 未読メッセージ総数を計算
  const totalUnreadCount = threads.reduce((sum, thread) => sum + thread.unreadCount, 0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsMessageListOpen(false);
        setSelectedThreadId(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // メッセージが開いている時に背景のスクロールをロック
  useEffect(() => {
    const isMessageOpen = isMessageListOpen || selectedThreadId !== null;
    if (isMessageOpen) {
      // スクロール位置を保存
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // スクロール位置を復元
        const savedScrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        if (savedScrollY) {
          const scrollValue = parseInt(savedScrollY.replace('px', '').replace('-', ''), 10);
          window.scrollTo(0, scrollValue);
        }
      };
    }
  }, [isMessageListOpen, selectedThreadId]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleSelectThread = (threadId: string) => {
    // スレッドを開いた時に未読数を0にする
    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === threadId ? { ...thread, unreadCount: 0 } : thread
      )
    );
    setSelectedThreadId(threadId);
    setIsMessageListOpen(false);
  };

  const handleBackToList = () => {
    setSelectedThreadId(null);
    setIsMessageListOpen(true);
  };

  const handleCloseMessages = () => {
    setIsMessageListOpen(false);
    setSelectedThreadId(null);
  };

  const handleEditClick = () => {
    if (onEditCareerSheet) {
      onEditCareerSheet();
    }
    closeMenu();
  };

  const menuItems = [
    {
      key: 'account',
      label: 'アカウント設定',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="headerMenuAccount" x1="0%" y1="0%" x2="100%" y2="100%">
              {renderGradientStops()}
            </linearGradient>
          </defs>
          <path
            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
            stroke="url(#headerMenuAccount)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.4 15C19.7825 14.2316 19.9898 13.3854 20 12.525C20.0102 11.6645 19.8237 10.8143 19.455 10.04L21 7L18 5.5L16.79 6.71C15.8691 6.25536 14.8646 5.99356 13.84 5.94C12.8154 5.88644 11.7898 6.04199 10.82 6.4L9.5 4H6.5L5.05 7.08C4.26843 7.44754 3.55865 7.9605 2.95 8.59L4.06 11.15C3.69664 12.1931 3.59085 13.3133 3.75 14.41C3.90915 15.5067 4.32935 16.5511 4.975 17.45L4 20L7 21.5L8.21 20.29C9.1309 20.7446 10.1354 21.0064 11.16 21.06C12.1846 21.1136 13.2102 20.958 14.18 20.6L15.5 23H18.5L19.95 19.92C20.7316 19.5525 21.4414 19.0395 22.05 18.41L20.94 15.85C21.3034 14.8069 21.4092 13.6867 21.25 12.59C21.0908 11.4933 20.6706 10.4489 20.025 9.55L21 7L18 5.5"
            stroke="url(#headerMenuAccount)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: 'logout',
      label: 'ログアウト',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="headerMenuLogout" x1="0%" y1="0%" x2="100%" y2="100%">
              {renderGradientStops()}
            </linearGradient>
          </defs>
          <path
            d="M9 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3H9"
            stroke="url(#headerMenuLogout)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 17L21 12L16 7"
            stroke="url(#headerMenuLogout)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 12H9"
            stroke="url(#headerMenuLogout)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: 'withdraw',
      label: '退会する',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="headerMenuExit" x1="0%" y1="0%" x2="100%" y2="100%">
              {renderGradientStops()}
            </linearGradient>
          </defs>
          <path
            d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
            stroke="url(#headerMenuExit)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 9L9 15"
            stroke="url(#headerMenuExit)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 9L15 15"
            stroke="url(#headerMenuExit)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  const handleMenuAction = (key: string) => {
    console.log(`Header menu action: ${key}`);
    closeMenu();
    if (key === 'account') {
      navigate('/account/settings');
    }
  };

  return (
    <>
      <header className="global-header">
        <div className="header-container">
          <div className="header-left" />
          <div className="header-right">
            {/* スマホ用の左2つのアイコン（プレースホルダー） */}
            <button className="header-icon-button header-icon-mobile-only" title="" aria-hidden="true" />
            <button className="header-icon-button header-icon-mobile-only" title="" aria-hidden="true" />
            {/* 既存の3つのアイコン */}
            <button
              className="header-icon-button header-icon-with-badge"
              title="メール"
              onClick={() => setIsMessageListOpen(true)}
            >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="headerMailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    {renderGradientStops()}
                </linearGradient>
              </defs>
              <path
                d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z"
                stroke="url(#headerMailGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {totalUnreadCount > 0 && (
              <div className="header-icon-badge">{totalUnreadCount}</div>
            )}
          </button>
          <button className="header-icon-button" title="通知">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="headerBellGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f09433" />
                  <stop offset="25%" stopColor="#e6683c" />
                  <stop offset="50%" stopColor="#dc2743" />
                  <stop offset="75%" stopColor="#cc2366" />
                  <stop offset="100%" stopColor="#bc1888" />
                </linearGradient>
              </defs>
              <path
                d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                stroke="url(#headerBellGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
            <button
              className="header-icon-button header-profile-button"
              title="プロフィール"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
            >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="headerProfileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f09433" />
                  <stop offset="25%" stopColor="#e6683c" />
                  <stop offset="50%" stopColor="#dc2743" />
                  <stop offset="75%" stopColor="#cc2366" />
                  <stop offset="100%" stopColor="#bc1888" />
                </linearGradient>
              </defs>
              <path
                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                stroke="url(#headerProfileGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <>
          <div className="header-menu-overlay" onClick={closeMenu} />
          <div className="header-menu-panel" role="dialog" aria-label="アカウントメニュー">
            <button className="header-menu-close" onClick={closeMenu} aria-label="メニューを閉じる">
              ×
            </button>
            <div className="header-menu-profile">
              <div className="header-menu-photo">
                {photo ? (
                  <img src={photo} alt="プロフィール写真" />
                ) : (
                  <div className="header-menu-photo-placeholder">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5 20C5 17.2386 7.23858 15 10 15H14C16.7614 15 19 17.2386 19 20"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="header-menu-info">
                <div className="header-menu-name">{name || '未登録'}</div>
                <div className="header-menu-id">ID：{memberId || '未登録'}</div>
              </div>
            </div>

            <button className="header-menu-edit-button" onClick={handleEditClick}>
              キャリアシートを編集
            </button>

            <div className="header-menu-actions">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  className="header-menu-action"
                  type="button"
                  onClick={() => handleMenuAction(item.key)}
                >
                  <span className="header-menu-action-icon">{item.icon}</span>
                  <span className="header-menu-action-label">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* メッセージスレッド一覧 */}
      {isMessageListOpen && (
        <MessageThreadList
          threads={threads}
          onSelectThread={handleSelectThread}
          onClose={handleCloseMessages}
        />
      )}

      {/* メッセージ詳細 */}
      {selectedThreadId && (
        <MessageThread
          threadId={selectedThreadId}
          messages={mockMessages[selectedThreadId] || []}
          thread={threads.find((t) => t.id === selectedThreadId)}
          onBack={handleBackToList}
          onClose={handleCloseMessages}
        />
      )}
    </>
  );
};

