import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../../components/Header';
import { ToggleSwitch } from '../../../components/ToggleSwitch';
import './page.css';

export const AccountSettings: React.FC = () => {
  const navigate = useNavigate();
  const [email] = useState('hope@example.com');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [rejectOffers, setRejectOffers] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const handleEmailChange = () => {
    // TODO: メールアドレス変更の実装
    console.log('Change email');
  };

  const handlePasswordChange = () => {
    // TODO: パスワード変更の実装
    console.log('Change password');
  };

  const handleDeleteAccount = () => {
    // TODO: 退会処理の実装
    if (window.confirm('本当に退会しますか？この操作は取り消せません。')) {
      console.log('Delete account');
    }
  };

  return (
    <div className="account-settings-page">
      <Header
        name="ほーぷちゃん"
        memberId="123456789"
        photo={undefined}
        onEditCareerSheet={() => navigate('/careersheet')}
      />
      <div className="account-settings-container">
        <h1 className="account-settings-title">アカウント設定</h1>

        {/* ログイン情報 */}
        <div className="account-settings-card">
          <h2 className="account-settings-card-title">ログイン情報</h2>
          <div className="account-settings-section">
            <div className="account-settings-row">
              <div className="account-settings-row-content">
                <span className="account-settings-label">メールアドレス</span>
                <span className="account-settings-value">{email}</span>
              </div>
              <button className="account-settings-button" onClick={handleEmailChange}>
                変更する
              </button>
            </div>
            <div className="account-settings-divider" />
            <div className="account-settings-row">
              <div className="account-settings-row-content">
                <span className="account-settings-label">パスワード</span>
                <span className="account-settings-value">••••••••</span>
              </div>
              <button className="account-settings-button" onClick={handlePasswordChange}>
                パスワードを変更する
              </button>
            </div>
          </div>
        </div>

        {/* 通知設定 */}
        <div className="account-settings-card">
          <h2 className="account-settings-card-title">通知設定</h2>
          <div className="account-settings-section">
            <div className="account-settings-row">
              <div className="account-settings-row-content">
                <span className="account-settings-label">メール通知</span>
                <span className="account-settings-hint">
                  求人からのオファー通知を受信しません
                </span>
              </div>
              <ToggleSwitch
                checked={emailNotifications}
                onChange={setEmailNotifications}
              />
            </div>
          </div>
        </div>

        {/* 公開設定 */}
        <div className="account-settings-card">
          <h2 className="account-settings-card-title">公開設定</h2>
          <div className="account-settings-section">
            <div className="account-settings-row">
              <div className="account-settings-row-content">
                <span className="account-settings-label">オファーを受け取らない</span>
                <span className="account-settings-hint">
                  求人からのオファー通知を受信しません
                </span>
              </div>
              <ToggleSwitch
                checked={rejectOffers}
                onChange={setRejectOffers}
              />
            </div>
            <div className="account-settings-divider" />
            <div className="account-settings-row">
              <div className="account-settings-row-content">
                <span className="account-settings-label">非公開にする</span>
                <span className="account-settings-hint">
                  プロフィールが企業に表示されなくなります
                </span>
              </div>
              <ToggleSwitch
                checked={isPrivate}
                onChange={setIsPrivate}
              />
            </div>
          </div>
        </div>

        {/* 退会 */}
        <div className="account-settings-footer">
          <button className="account-settings-delete-link" onClick={handleDeleteAccount}>
            退会する
          </button>
        </div>
      </div>
    </div>
  );
};

