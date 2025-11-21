'use client'

import React, { Suspense } from 'react';
import { VerifyContent } from './VerifyContent';
import '../RegistrationForm.css';

// Next.js 15: useSearchParams を使用するため、動的レンダリングを強制
export const dynamic = 'force-dynamic';

function VerifyFallback() {
  return (
    <div className="registration-container">
      <h1 className="registration-title">新規会員登録</h1>
      <div className="registration-card">
        <div className="registration-header">
          <p className="registration-subtitle">読み込み中...</p>
        </div>
        <div className="registration-form">
          <div className="form-field">
            <p>認証情報を確認しています...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Verify() {
  return (
    <Suspense fallback={<VerifyFallback />}>
      <VerifyContent />
    </Suspense>
  );
}
