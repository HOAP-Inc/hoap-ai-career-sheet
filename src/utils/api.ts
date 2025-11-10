/**
 * API呼び出し用のユーティリティ
 * 開発環境ではモックレスポンスを返します
 */

const isDevelopment = import.meta.env.DEV;
const MOCK_DELAY = 1000; // モック時の遅延時間（ms）

// モック用の遅延関数
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 認証メール送信API
 */
export const sendVerificationEmail = async (email: string): Promise<void> => {
  if (isDevelopment) {
    // 開発環境ではモックレスポンスを返す
    console.log('📧 [MOCK] 認証メール送信:', email);
    await delay(MOCK_DELAY);
    // エラーをシミュレートする場合はコメントアウトを外す
    // throw new Error('メール送信に失敗しました（モックエラー）');
    return;
  }

  // 本番環境では実際のAPIを呼び出す
  const response = await fetch('/api/auth/send-verification-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'メール送信に失敗しました');
  }
};

/**
 * 認証メール再送信API
 */
export const resendVerificationEmail = async (email: string): Promise<void> => {
  if (isDevelopment) {
    console.log('📧 [MOCK] 認証メール再送信:', email);
    await delay(MOCK_DELAY);
    return;
  }

  const response = await fetch('/api/auth/resend-verification-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || '再送信に失敗しました');
  }
};

/**
 * トークン認証API
 */
export const verifyToken = async (token: string): Promise<{ email: string }> => {
  if (isDevelopment) {
    console.log('🔐 [MOCK] トークン認証:', token);
    await delay(MOCK_DELAY);
    // モック用のemailを返す（実際のトークンから取得できないため）
    return { email: 'test@example.com' };
  }

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
  if (isDevelopment) {
    console.log('🔐 [MOCK] 認証コード認証:', code);
    await delay(MOCK_DELAY);
    
    // テスト用の認証コード（開発環境では任意の6桁でOK）
    if (code === '123456') {
      // エラーをシミュレートする場合はコメントアウトを外す
      // throw new Error('認証コードが正しくありません（モックエラー）');
    }
    
    // EmailRegisterで入力されたemailをlocalStorageから取得
    const email = localStorage.getItem('registration_email') || 'test@example.com';
    return { email };
  }

  const response = await fetch('/api/auth/verify-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code: code.trim() }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || '認証コードが正しくありません');
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
  age: number;
  postalCode: string;
  location: string;
  password: string;
}): Promise<void> => {
  if (isDevelopment) {
    console.log('✅ [MOCK] ユーザー登録:', data);
    await delay(MOCK_DELAY);
    // エラーをシミュレートする場合はコメントアウトを外す
    // throw new Error('登録に失敗しました（モックエラー）');
    return;
  }

  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || '登録に失敗しました');
  }
};


