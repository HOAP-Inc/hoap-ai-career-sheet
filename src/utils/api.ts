/**
 * API呼び出し用のユーティリティ
 * USE_MOCK_API=true の場合はモックレスポンスを返します
 */

// モックモードの切り替え（環境変数で制御、デフォルトはfalse = 実際のAPI使用）
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';
const MOCK_DELAY = 1000; // モック時の遅延時間（ms）

// APIのベースURL（本番とローカルで自動切り替え）
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// モック用の遅延関数
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 認証メール送信API
 */
export const sendVerificationEmail = async (email: string): Promise<void> => {
  if (USE_MOCK_API) {
    // モック環境ではモックレスポンスを返す
    console.log('📧 [MOCK] 認証メール送信:', email);
    await delay(MOCK_DELAY);
    return;
  }

  // 実際のAPIを呼び出す
  const response = await fetch(`${API_BASE_URL}/api/send-verification-code`, {
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
  if (USE_MOCK_API) {
    console.log('📧 [MOCK] 認証メール再送信:', email);
    await delay(MOCK_DELAY);
    return;
  }

  const response = await fetch(`${API_BASE_URL}/api/send-verification-code`, {
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
  if (USE_MOCK_API) {
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
  if (USE_MOCK_API) {
    console.log('🔐 [MOCK] 認証コード認証:', code);
    await delay(MOCK_DELAY);
    
    // EmailRegisterで入力されたemailをlocalStorageから取得
    const email = localStorage.getItem('registration_email') || 'test@example.com';
    return { email };
  }

  // EmailRegisterで入力されたemailをlocalStorageから取得
  const email = localStorage.getItem('registration_email');
  
  if (!email) {
    throw new Error('メールアドレスが見つかりません');
  }

  const response = await fetch(`${API_BASE_URL}/api/verify-code`, {
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
  if (USE_MOCK_API) {
    console.log('✅ [MOCK] ユーザー登録:', data);
    await delay(MOCK_DELAY);
    return;
  }

  const response = await fetch(`${API_BASE_URL}/api/register-user`, {
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



