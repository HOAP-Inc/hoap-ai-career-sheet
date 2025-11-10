import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendVerificationEmail } from '../../utils/api';
import './RegistrationForm.css';

export const EmailRegister: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('メールアドレスを入力してください');
      return;
    }

    if (!validateEmail(email)) {
      setError('正しいメールアドレスを入力してください');
      return;
    }

    setIsLoading(true);

    try {
      // API呼び出し（開発環境ではモックレスポンスを返す）
      await sendVerificationEmail(email);
      
      // emailをlocalStorageに保存（認証コード認証時に使用）
      localStorage.setItem('registration_email', email);

      // 成功時はEmailSentページへ遷移（emailをstateで渡す）
      navigate('/registration/email-sent', { state: { email } });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'メール送信に失敗しました。しばらくしてから再度お試しください。',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <h1 className="registration-title">新規会員登録</h1>
      <div className="registration-card">
        <div className="registration-header">
          <p className="registration-subtitle">メールアドレスを入力してください</p>
        </div>
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-field">
            <input
              type="email"
              placeholder="example@co.jp"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className={`form-input single-input ${error ? 'error' : ''}`}
              autoFocus
              disabled={isLoading}
            />
            {error && <div className="error-message">{error}</div>}
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className="btn-next"
              disabled={!email.trim() || isLoading}
            >
              {isLoading ? '送信中...' : '認証コードを送信'}
            </button>
            <div className="login-link">
              <a href="/login" className="login-link-text">
                会員の方はこちら
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

