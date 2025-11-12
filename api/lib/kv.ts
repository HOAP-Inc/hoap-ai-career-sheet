import { Redis } from '@upstash/redis';

// Upstash Redis クライアントを初期化
// VercelのUpstash統合では、KV_REST_API_URLとKV_REST_API_TOKENが使用される
const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
  console.warn('Redis environment variables are not set. KV operations will fail.');
  console.warn('Required: KV_REST_API_URL and KV_REST_API_TOKEN');
}

const redis = redisUrl && redisToken
  ? new Redis({
      url: redisUrl,
      token: redisToken,
    })
  : null;

// 認証コードを保存（10分間有効）
export async function saveVerificationCode(email: string, code: string): Promise<void> {
  if (!redis) {
    throw new Error('Redis is not configured. Please set KV_REST_API_URL and KV_REST_API_TOKEN environment variables.');
  }
  const key = `verification:${email}`;
  await redis.set(key, code, { ex: 600 }); // 600秒 = 10分
  console.log(`Verification code saved for ${email}`);
}

// 認証コードを取得
export async function getVerificationCode(email: string): Promise<string | null> {
  if (!redis) {
    throw new Error('Redis is not configured. Please set KV_REST_API_URL and KV_REST_API_TOKEN environment variables.');
  }
  const key = `verification:${email}`;
  const code = await redis.get<string>(key);
  return code;
}

// 認証コードを削除
export async function deleteVerificationCode(email: string): Promise<void> {
  if (!redis) {
    throw new Error('Redis is not configured. Please set KV_REST_API_URL and KV_REST_API_TOKEN environment variables.');
  }
  const key = `verification:${email}`;
  await redis.del(key);
  console.log(`Verification code deleted for ${email}`);
}

// ユーザー登録データを一時保存（24時間有効）
export async function saveRegistrationData(
  email: string,
  data: Record<string, unknown>
): Promise<void> {
  if (!redis) {
    throw new Error('Redis is not configured. Please set KV_REST_API_URL and KV_REST_API_TOKEN environment variables.');
  }
  const key = `registration:${email}`;
  await redis.set(key, JSON.stringify(data), { ex: 86400 }); // 86400秒 = 24時間
  console.log(`Registration data saved for ${email}`);
}

// ユーザー登録データを取得
export async function getRegistrationData(
  email: string
): Promise<Record<string, unknown> | null> {
  if (!redis) {
    throw new Error('Redis is not configured. Please set KV_REST_API_URL and KV_REST_API_TOKEN environment variables.');
  }
  const key = `registration:${email}`;
  const data = await redis.get<string>(key);
  return data ? JSON.parse(data) : null;
}

// ユーザー登録データを削除
export async function deleteRegistrationData(email: string): Promise<void> {
  if (!redis) {
    throw new Error('Redis is not configured. Please set KV_REST_API_URL and KV_REST_API_TOKEN environment variables.');
  }
  const key = `registration:${email}`;
  await redis.del(key);
  console.log(`Registration data deleted for ${email}`);
}

