'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyToken, verifyCode, resendVerificationEmail } from '@/utils/api';
import '../RegistrationForm.css';

export default function Verify() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendFeedback, setResendFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    // URLパラメータからtokenを取得
    // Next.js 15では searchParams が null の可能性があるため、オプショナルチェーンを使用
    const tokenParam = searchParams?.get('token') ?? null;
    if (tokenParam) {
      setToken(tokenParam);
      // tokenがある場合は自動認証を試みる
      handleVerifyToken(tokenParam);
    }
  }, [searchParams, handleVerifyToken]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('registration_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleVerifyToken = useCallback(
    async (tokenToVerify: string) => {
      setIsVerifying(true);
      setError('');

      try {
        // API呼び出し（開発環境ではモックレスポンスを返す）
        const data = await verifyToken(tokenToVerify);
        setIsVerified(true);
        // 認証成功時はProfileRegisterへ遷移
        localStorage.setItem('registration_verified', 'true');
        localStorage.setItem('registration_token', tokenToVerify);
        if (data.email) {
          localStorage.setItem('registration_email', data.email);
        }
        router.push('/registration/profile');
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : '認証に失敗しました。認証コードを確認してください。',
        );
      } finally {
        setIsVerifying(false);
      }
    },
    [router],
  );

  const handleResend = async () => {
    if (!email || isResending) return;
    setIsResending(true);
    setResendFeedback(null);

    try {
      await resendVerificationEmail(email);
      setResendFeedback({ type: 'success', message: '認証メールを再送信しました' });
      setTimeout(() => setResendFeedback(null), 3000);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : '再送信に失敗しました。しばらくしてから再度お試しください。';
      setResendFeedback({ type: 'error', message });
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('認証コードを入力してください');
      return;
    }

    setIsVerifying(true);

    try {
      // API呼び出し（開発環境ではモックレスポンスを返す）
      const data = await verifyCode(code);
      setIsVerified(true);
      // 認証成功時はProfileRegisterへ遷移
      localStorage.setItem('registration_verified', 'true');
      if (data.email) {
        localStorage.setItem('registration_email', data.email);
      }
      router.push('/registration/profile');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : '認証コードが正しくありません。再度お試しください。',
      );
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerified) {
    return (
      <div className="registration-container">
        <div className="registration-card">
          <div className="registration-header">
            <p className="registration-subtitle">認証が完了しました</p>
          </div>
          <div className="registration-form">
            <p>プロフィール登録に進みます...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-container">
      <h1 className="registration-title">新規会員登録</h1>
      <div className="registration-card">
        <div className="registration-header">
          <p className="registration-subtitle">認証コードを入力してください</p>
        </div>
        {email && (
          <div className="registration-info">
            <p>
              <strong>{email}</strong>
              に送信された認証コードを入力してください。
            </p>
          </div>
        )}
        {token ? (
          <div className="registration-form">
            <div className="form-field">
              {isVerifying ? (
                <p>認証中...</p>
              ) : error ? (
                <div>
                  <div className="error-message">{error}</div>
                  <button
                    type="button"
                    onClick={() => router.push('/registration')}
                    className="btn-next"
                  >
                    メールアドレスを再入力
                  </button>
                </div>
              ) : (
                <p>認証トークンを確認中...</p>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleVerifyCode} className="registration-form">
            <div className="form-field">
              <input
                type="text"
                placeholder="認証コード（6桁）"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6));
                  setError('');
                }}
                className={`form-input single-input ${error ? 'error' : ''}`}
                maxLength={6}
                autoFocus
                disabled={isVerifying}
              />
              {error && <div className="error-message">{error}</div>}
            </div>
            <button
              type="submit"
              className="btn-next"
              disabled={!code.trim() || code.length !== 6 || isVerifying}
            >
              {isVerifying ? '認証中...' : '認証する'}
            </button>
            <button
              type="button"
              className="btn-next"
              onClick={handleResend}
              disabled={isResending}
              style={{ marginTop: '12px', background: '#6b7280' }}
            >
              {isResending ? '再送信中...' : '認証メールを再送信'}
            </button>
            {resendFeedback && (
              <div
                className={
                  resendFeedback.type === 'success' ? 'success-message' : 'error-message'
                }
              >
                {resendFeedback.message}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

