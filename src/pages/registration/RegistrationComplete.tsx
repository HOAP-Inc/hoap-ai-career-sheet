import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { ProfileData } from '../../types';
import './RegistrationForm.css';

export const RegistrationComplete: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const state = location.state as { email?: string } | null;
    if (state?.email) {
      setEmail(state.email);
    } else {
      // stateがない場合は登録ページへリダイレクト
      navigate('/registration', { replace: true });
    }
  }, [location, navigate]);

  const handleGoToProfile = () => {
    // localStorageから登録データを取得
    const registrationData = localStorage.getItem('registration_data');
    if (registrationData) {
      try {
        const profileData: ProfileData = JSON.parse(registrationData);
        // キャリアシートへ直接遷移（登録データをstateで渡す）
        navigate('/careersheet', { state: { profileData } });
      } catch (error) {
        console.error('Failed to parse registration data:', error);
        // データの取得に失敗した場合はログイン画面へ
        navigate('/login');
      }
    } else {
      // 登録データがない場合はログイン画面へ
      navigate('/login');
    }
  };

  return (
    <div className="registration-container">
      <h1 className="registration-title">新規会員登録</h1>
      <div className="registration-card">
        <div className="registration-header">
          <p className="registration-subtitle">登録が完了しました</p>
        </div>
        <div className="registration-form">
          <div className="form-field">
            <div className="complete-message">
              <div className="complete-icon">✓</div>
              <p>
                <strong>{email}</strong>
                で登録が完了しました。
              </p>
              <p>ご登録ありがとうございます。</p>
            </div>
          </div>
          <div className="form-actions">
            <button
              type="button"
              onClick={handleGoToProfile}
              className="btn-next"
            >
              プロフィールを確認する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

