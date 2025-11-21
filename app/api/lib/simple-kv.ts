/**
 * シンプルなインメモリKVストア
 * データベース統合までの一時的な実装
 * 注意: サーバーレス関数では各リクエストで初期化されるため、
 * 実際には10分の有効期限は機能しません。
 * 本番環境ではUpstash RedisまたはVercel KVを使用してください。
 */

// インメモリストレージ（簡易版）
const storage: Map<string, { value: string; expiresAt: number }> = new Map();

// 有効期限切れのエントリを削除
const cleanExpired = () => {
  const now = Date.now();
  for (const [key, data] of storage.entries()) {
    if (data.expiresAt < now) {
      storage.delete(key);
    }
  }
};

// 認証コードを保存（10分間有効）
export async function saveVerificationCode(email: string, code: string): Promise<void> {
  cleanExpired();
  const key = `verification:${email}`;
  const expiresAt = Date.now() + 600000; // 10分 = 600,000ms
  storage.set(key, { value: code, expiresAt });
  console.log(`[MEMORY] Verification code saved for ${email}, expires at ${new Date(expiresAt).toISOString()}`);
}

// 認証コードを取得
export async function getVerificationCode(email: string): Promise<string | null> {
  cleanExpired();
  const key = `verification:${email}`;
  const data = storage.get(key);
  
  if (!data) {
    console.log(`[MEMORY] No verification code found for ${email}`);
    return null;
  }
  
  if (data.expiresAt < Date.now()) {
    storage.delete(key);
    console.log(`[MEMORY] Verification code expired for ${email}`);
    return null;
  }
  
  console.log(`[MEMORY] Verification code retrieved for ${email}`);
  return data.value;
}

// 認証コードを削除
export async function deleteVerificationCode(email: string): Promise<void> {
  const key = `verification:${email}`;
  storage.delete(key);
  console.log(`[MEMORY] Verification code deleted for ${email}`);
}

// ユーザー登録データを一時保存（24時間有効）
export async function saveRegistrationData(
  email: string,
  data: Record<string, unknown>
): Promise<void> {
  cleanExpired();
  const key = `registration:${email}`;
  const expiresAt = Date.now() + 86400000; // 24時間
  storage.set(key, { value: JSON.stringify(data), expiresAt });
  console.log(`[MEMORY] Registration data saved for ${email}`);
}

// ユーザー登録データを取得
export async function getRegistrationData(
  email: string
): Promise<Record<string, unknown> | null> {
  cleanExpired();
  const key = `registration:${email}`;
  const data = storage.get(key);
  
  if (!data) return null;
  if (data.expiresAt < Date.now()) {
    storage.delete(key);
    return null;
  }
  
  return JSON.parse(data.value);
}

// ユーザー登録データを削除
export async function deleteRegistrationData(email: string): Promise<void> {
  const key = `registration:${email}`;
  storage.delete(key);
  console.log(`[MEMORY] Registration data deleted for ${email}`);
}

