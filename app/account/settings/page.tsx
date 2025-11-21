'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/src/components/Header';
import { ToggleSwitch } from '@/src/components/ToggleSwitch';
import '@/src/pages/account/settings/page.css';

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

export default function AccountSettings() {
  const router = useRouter();
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
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteCheckbox1, setDeleteCheckbox1] = useState(false);
  const [deleteCheckbox2, setDeleteCheckbox2] = useState(false);
  const [deleteCheckbox3, setDeleteCheckbox3] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteReasonDetail, setDeleteReasonDetail] = useState('');

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

  useEffect(() => {
    if (isDeleteModalOpen) {
      setDeleteCheckbox1(false);
      setDeleteCheckbox2(false);
      setDeleteCheckbox3(false);
      setDeleteReason('');
      setDeleteReasonDetail('');
    }
  }, [isDeleteModalOpen]);

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

  const isDeleteButtonEnabled =
    deleteCheckbox1 && deleteCheckbox2 && deleteCheckbox3 && deleteReason !== '';

  const handleDeleteAccount = () => {
    if (!isDeleteButtonEnabled) return;
    console.log('Delete account:', { reason: deleteReason, detail: deleteReasonDetail });
    // TODO: API呼び出し
    setDeleteModalOpen(false);
    // 削除後はログアウトまたはトップページへ遷移
    router.push('/login');
  };

  return (
    <div className="account-settings-page">
      <Header
        name="ほーぷちゃん"
        memberId="123456789"
        photo={undefined}
        onEditCareerSheet={() => router.push('/careersheet')}
      />
      <div className="account-settings-container">
        <button
          className="account-settings-close"
          onClick={() => router.push('/careersheet')}
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

        {/* アカウントの削除 */}
        <div className="account-settings-card">
          <h2 className="account-settings-card-title">アカウントの削除</h2>
          <div className="account-settings-section">
            <div className="account-settings-row">
              <div className="account-settings-row-content">
                <span className="account-settings-label">
                  アカウントを削除すると、すべてのデータが永久に削除されます
                </span>
              </div>
              <button
                className="account-settings-button"
                onClick={() => setDeleteModalOpen(true)}
              >
                削除
              </button>
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

        {isDeleteModalOpen && (
          <Modal title="アカウントの削除" onClose={() => setDeleteModalOpen(false)}>
            <div className="account-settings-delete-modal">
              <h4 className="account-settings-delete-section-title">削除前にご確認下さい</h4>
              <div className="account-settings-delete-checkboxes">
                <label className="account-settings-delete-checkbox">
                  <input
                    type="checkbox"
                    checked={deleteCheckbox1}
                    onChange={(e) => setDeleteCheckbox1(e.target.checked)}
                  />
                  <span>アカウント削除後は復元できません。</span>
                </label>
                <label className="account-settings-delete-checkbox">
                  <input
                    type="checkbox"
                    checked={deleteCheckbox2}
                    onChange={(e) => setDeleteCheckbox2(e.target.checked)}
                  />
                  <span>キャリアシートも削除されます。</span>
                </label>
                <label className="account-settings-delete-checkbox">
                  <input
                    type="checkbox"
                    checked={deleteCheckbox3}
                    onChange={(e) => setDeleteCheckbox3(e.target.checked)}
                  />
                  <span>企業からあなたにオファーが送れなくなります。</span>
                </label>
              </div>

              <h4 className="account-settings-delete-section-title">アカウント削除の理由</h4>
              <select
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="account-settings-input"
              >
                <option value="">理由を選択</option>
                <option value="job-search-ended">転職活動が終了した</option>
                <option value="no-attractive-offers">魅力的なオファーがなかった</option>
                <option value="privacy-concerns">プライバシーに不安があった</option>
                <option value="other">その他</option>
              </select>

              <textarea
                value={deleteReasonDetail}
                onChange={(e) => setDeleteReasonDetail(e.target.value)}
                className="account-settings-textarea"
                placeholder="詳しい理由を記入（任意）"
                rows={4}
              />

              <button
                type="button"
                className={`account-settings-delete-submit-button ${
                  isDeleteButtonEnabled ? 'enabled' : 'disabled'
                }`}
                onClick={handleDeleteAccount}
                disabled={!isDeleteButtonEnabled}
              >
                アカウントを完全に削除
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

