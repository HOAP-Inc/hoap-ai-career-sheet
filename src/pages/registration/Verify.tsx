import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyToken, verifyCode } from '../../utils/api';
import './RegistrationForm.css';

export const Verify: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // URLパラメータからtokenを取得
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      // tokenがある場合は自動認証を試みる
      handleVerifyToken(tokenParam);
    }
  }, [searchParams]);

  const handleVerifyToken = async (tokenToVerify: string) => {
    setIsVerifying(true);
    setError('');

    try {
      // API呼び出し（開発環境ではモックレスポンスを返す）
      const data = await verifyToken(tokenToVerify);
      setIsVerified(true);
      // 認証成功時はProfileRegisterへ遷移（認証情報をstateで渡す）
      navigate('/registration/profile', {
        state: { verified: true, email: data.email, token: tokenToVerify },
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : '認証に失敗しました。認証コードを確認してください。',
      );
    } finally {
      setIsVerifying(false);
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
      // 開発環境では任意の6桁のコードで認証可能（例: 123456）
      const data = await verifyCode(code);
      setIsVerified(true);
      // 認証成功時はProfileRegisterへ遷移
      navigate('/registration/profile', {
        state: { verified: true, email: data.email },
      });
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
                    onClick={() => navigate('/registration')}
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
          </form>
        )}
      </div>
    </div>
  );
};

