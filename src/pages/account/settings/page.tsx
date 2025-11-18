import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../../components/Header';
import { ToggleSwitch } from '../../../components/ToggleSwitch';
import './page.css';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => (
  <>
    <div className="account-settings-modal-overlay" onClick={onClose} />
    <div className="account-settings-modal" role="dialog" aria-modal="true">
      <div className="account-settings-modal-header">
        <h3>{title}</h3>
        <button className="account-settings-modal-close" onClick={onClose} aria-label="閉じる">
          ×
        </button>
      </div>
      <div className="account-settings-modal-body">{children}</div>
    </div>
  </>
);

export const AccountSettings: React.FC = () => {
  const navigate = useNavigate();
  const [emailAddress, setEmailAddress] = useState('hope@example.com');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [rejectOffers, setRejectOffers] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isEmailModalOpen, setEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState(emailAddress);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (isEmailModalOpen) {
      setEmailInput(emailAddress);
    }
  }, [isEmailModalOpen, emailAddress]);

  useEffect(() => {
    if (isPasswordModalOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [isPasswordModalOpen]);

  const handleEmailSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = emailInput.trim();
    if (!trimmed) return;
    setEmailAddress(trimmed);
    setEmailModalOpen(false);
  };

  const handlePasswordSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) {
      return;
    }
    console.log('Password updated');
    setPasswordModalOpen(false);
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
        <button
          className="account-settings-close"
          onClick={() => navigate('/careersheet')}
          aria-label="設定を閉じる"
        >
          ×
        </button>
        <h1 className="account-settings-title">アカウント設定</h1>

        {/* ログイン情報 */}
        <div className="account-settings-card">
          <h2 className="account-settings-card-title">ログイン情報</h2>
          <div className="account-settings-section">
            <div className="account-settings-row">
              <div className="account-settings-row-content">
                <span className="account-settings-label">メールアドレス</span>
                <span className="account-settings-value">{emailAddress}</span>
              </div>
              <button
                className="account-settings-button"
                onClick={() => setEmailModalOpen(true)}
              >
                変更する
              </button>
            </div>
            <div className="account-settings-divider" />
            <div className="account-settings-row">
              <div className="account-settings-row-content">
                <span className="account-settings-label">パスワード</span>
                <span className="account-settings-value">••••••••</span>
              </div>
              <button
                className="account-settings-button"
                onClick={() => setPasswordModalOpen(true)}
              >
                変更する
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

        {isEmailModalOpen && (
          <Modal title="メールアドレスを変更" onClose={() => setEmailModalOpen(false)}>
            <form className="account-settings-form" onSubmit={handleEmailSubmit}>
              <label className="account-settings-form-label" htmlFor="email-input">
                新しいメールアドレス
              </label>
              <input
                id="email-input"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="account-settings-input"
                required
              />
              <button type="submit" className="account-settings-submit-button">
                変更する
              </button>
            </form>
          </Modal>
        )}

        {isPasswordModalOpen && (
          <Modal title="パスワードを変更" onClose={() => setPasswordModalOpen(false)}>
            <form className="account-settings-form" onSubmit={handlePasswordSubmit}>
              <label className="account-settings-form-label" htmlFor="current-password">
                現在のパスワード
              </label>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="account-settings-input"
                required
              />

              <label className="account-settings-form-label" htmlFor="new-password">
                新しいパスワード
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="account-settings-input"
                required
              />

              <label className="account-settings-form-label" htmlFor="confirm-password">
                新しいパスワード（確認用）
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="account-settings-input"
                required
              />

              <button type="submit" className="account-settings-submit-button">
                変更する
              </button>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};

