import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { resendVerificationEmail } from '../../utils/api';
import './RegistrationForm.css';

export const EmailSent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');

  useEffect(() => {
    // location.stateからemailを取得
    const stateEmail = (location.state as { email?: string })?.email;
    if (stateEmail) {
      setEmail(stateEmail);
    } else {
      // stateがない場合は前のページに戻る
      navigate('/registration');
    }
  }, [location, navigate]);

  const handleResend = async () => {
    if (!email) return;

    setIsResending(true);
    setResendError('');
    setResendSuccess(false);

    try {
      // API呼び出し（開発環境ではモックレスポンスを返す）
      await resendVerificationEmail(email);

      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err) {
      setResendError(
        err instanceof Error
          ? err.message
          : '再送信に失敗しました。しばらくしてから再度お試しください。',
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="registration-container">
      <h1 className="registration-title">新規会員登録</h1>
      <div className="registration-card">
        <div className="registration-header">
          <p className="registration-subtitle">認証メールを送信しました</p>
        </div>
        <div className="registration-form">
          <div className="form-field">
            <div className="email-sent-message">
              <p>
                <strong>{email}</strong>
                に認証メールを送信しました。
              </p>
              <p>メール内の認証コードを確認して、次のステップに進んでください。</p>
              <p className="email-sent-note">
                メールが届かない場合は、迷惑メールフォルダもご確認ください。
              </p>
            </div>
          </div>
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/registration/verify')}
              className="btn-next"
            >
              認証コードを入力する
            </button>
            <button
              type="button"
              onClick={handleResend}
              className="btn-next"
              disabled={isResending}
              style={{
                marginTop: '12px',
                background: '#6b7280',
              }}
            >
              {isResending ? '再送信中...' : '認証メールを再送信'}
            </button>
            {resendSuccess && (
              <div className="success-message">認証メールを再送信しました</div>
            )}
            {resendError && <div className="error-message">{resendError}</div>}
            <div className="login-link">
              <a href="/login" className="login-link-text">
                会員の方はこちら
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

