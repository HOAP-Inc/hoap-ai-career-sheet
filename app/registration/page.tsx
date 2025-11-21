'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendVerificationEmail } from '@/utils/api';
import '@/pages/registration/RegistrationForm.css';

export default function EmailRegister() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
      console.log('🚀 EmailRegister: Starting email send for:', email);
      
      // API呼び出し（開発環境ではモックレスポンスを返す）
      await sendVerificationEmail(email);
      
      console.log('✅ EmailRegister: Email sent successfully');
      
      // emailをlocalStorageに保存（認証コード認証時に使用）
      localStorage.setItem('registration_email', email);

      // 成功時は認証コード入力ページへダイレクト遷移
      router.push('/registration/verify');
    } catch (err) {
      console.error('❌ EmailRegister: Error occurred:', err);
      const errorMessage = err instanceof Error
        ? err.message
        : 'メール送信に失敗しました。しばらくしてから再度お試しください。';
      console.error('❌ EmailRegister: Error message:', errorMessage);
      setError(errorMessage);
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
}

