/**
 * API呼び出し用のユーティリティ
 * Next.js の /api/ ルートを使用（相対パス）
 */

/**
 * 認証メール送信API
 */
export const sendVerificationEmail = async (email: string): Promise<void> => {
  const response = await fetch('/api/send-verification-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'メール送信に失敗しました');
  }
};

/**
 * 認証メール再送信API
 */
export const resendVerificationEmail = async (email: string): Promise<void> => {
  const response = await fetch('/api/send-verification-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || '再送信に失敗しました');
  }
};

/**
 * トークン認証API
 */
export const verifyToken = async (token: string): Promise<{ email: string }> => {
  const response = await fetch('/api/auth/verify-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || '認証に失敗しました');
  }

  return response.json();
};

/**
 * 認証コード認証API
 */
export const verifyCode = async (code: string): Promise<{ email: string }> => {
  // EmailRegisterで入力されたemailをlocalStorageから取得
  const email = localStorage.getItem('registration_email');

  if (!email) {
    throw new Error('メールアドレスが見つかりません');
  }

  const response = await fetch('/api/verify-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, code: code.trim() }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || '認証コードが正しくありません');
  }

  return response.json();
};

/**
 * ユーザー登録API
 */
export const registerUser = async (data: {
  email: string;
  name: string;
  phone: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  gender: string;
  postalCode: string;
  location: string;
  addressDetail?: string;
  password: string;
  agreedToPrivacy: boolean;
}): Promise<void> => {
  const response = await fetch('/api/register-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || '登録に失敗しました');
  }
};
