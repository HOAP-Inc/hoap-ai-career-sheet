import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistrationForm.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('メールアドレスを入力してください');
      return;
    }

    if (!password) {
      setError('パスワードを入力してください');
      return;
    }

    setIsLoading(true);

    try {
      // API呼び出し（開発環境ではモックレスポンスを返す）
      const isDevelopment = import.meta.env.DEV;
      
      if (isDevelopment) {
        // 開発環境では任意のメール/パスワードでログイン可能
        console.log('🔐 [MOCK] ログイン:', email);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // 登録時に保存したデータをlocalStorageから取得
        const registrationData = localStorage.getItem('registration_data');
        if (registrationData) {
          const data = JSON.parse(registrationData);
          // ログイン成功時はプロフィールに遷移（データをstateで渡す）
          navigate('/careersheet', { state: { profileData: data } });
        } else {
          // 登録データがない場合はエラー
          throw new Error('ログインに失敗しました');
        }
      } else {
        // 本番環境では実際のAPIを呼び出す
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'ログインに失敗しました');
        }

        const data = await response.json();
        // ログイン成功時はプロフィールに遷移
        navigate('/careersheet', { state: { profileData: data.profile } });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'ログインに失敗しました。メールアドレスとパスワードを確認してください。',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <h1 className="registration-title">ログイン</h1>
      <div className="registration-card">
        <div className="registration-header">
          <p className="registration-subtitle">メールアドレスとパスワードを入力してください</p>
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
          </div>
          <div className="form-field">
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className={`form-input single-input ${error ? 'error' : ''}`}
              disabled={isLoading}
            />
            {error && <div className="error-message">{error}</div>}
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className="btn-next"
              disabled={!email.trim() || !password || isLoading}
            >
              {isLoading ? 'ログイン中...' : 'ログインする'}
            </button>
            <div className="login-link">
              <a href="/registration" className="login-link-text">
                新規会員登録はこちら
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};


