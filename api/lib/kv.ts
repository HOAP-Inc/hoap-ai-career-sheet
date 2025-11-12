import { Redis } from '@upstash/redis';

// Upstash Redis クライアントを初期化
const redis = Redis.fromEnv();

// 認証コードを保存（10分間有効）
export async function saveVerificationCode(email: string, code: string): Promise<void> {
  const key = `verification:${email}`;
  await redis.set(key, code, { ex: 600 }); // 600秒 = 10分
  console.log(`Verification code saved for ${email}`);
}

// 認証コードを取得
export async function getVerificationCode(email: string): Promise<string | null> {
  const key = `verification:${email}`;
  const code = await redis.get<string>(key);
  return code;
}

// 認証コードを削除
export async function deleteVerificationCode(email: string): Promise<void> {
  const key = `verification:${email}`;
  await redis.del(key);
  console.log(`Verification code deleted for ${email}`);
}

// ユーザー登録データを一時保存（24時間有効）
export async function saveRegistrationData(
  email: string,
  data: Record<string, unknown>
): Promise<void> {
  const key = `registration:${email}`;
  await redis.set(key, JSON.stringify(data), { ex: 86400 }); // 86400秒 = 24時間
  console.log(`Registration data saved for ${email}`);
}

// ユーザー登録データを取得
export async function getRegistrationData(
  email: string
): Promise<Record<string, unknown> | null> {
  const key = `registration:${email}`;
  const data = await redis.get<string>(key);
  return data ? JSON.parse(data) : null;
}

// ユーザー登録データを削除
export async function deleteRegistrationData(email: string): Promise<void> {
  const key = `registration:${email}`;
  await redis.del(key);
  console.log(`Registration data deleted for ${email}`);
}

