'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ProfileData } from '@/src/types';
import '@/src/pages/registration/RegistrationForm.css';

export default function RegistrationComplete() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('registration_email');
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      // emailがない場合は登録ページへリダイレクト
      router.replace('/registration');
    }
  }, [router]);

  const handleGoToProfile = () => {
    // localStorageから登録データを取得
    const registrationData = localStorage.getItem('registration_data');
    if (registrationData) {
      try {
        const profileData: ProfileData = JSON.parse(registrationData);
        // キャリアシートへ直接遷移
        router.push('/careersheet');
      } catch (error) {
        console.error('Failed to parse registration data:', error);
        // データの取得に失敗した場合はログイン画面へ
        router.push('/login');
      }
    } else {
      // 登録データがない場合はログイン画面へ
      router.push('/login');
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
}

