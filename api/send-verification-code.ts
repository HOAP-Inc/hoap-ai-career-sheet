import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendVerificationEmail } from './lib/mailgun.js';
import { saveVerificationCode } from './lib/kv.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORSヘッダーを設定
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // OPTIONSリクエストの処理
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POSTのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { email } = req.body;

    // バリデーション
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'メールアドレスが必要です',
      });
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: '正しいメールアドレスを入力してください',
      });
    }

    // 6桁の認証コード生成
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    console.log(`Generated verification code for ${email}: ${code}`);

    // Vercel KV（Redis）に保存（10分間有効）
    await saveVerificationCode(email, code);

    // Mailgunでメール送信
    await sendVerificationEmail(email, code);

    return res.status(200).json({
      success: true,
      message: '認証コードをメールで送信しました',
    });
  } catch (error) {
    console.error('Error sending verification code:', error);
    
    // エラーの詳細をログに出力
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // 環境変数の確認（値は表示しない）
    console.error('Environment check:', {
      hasMailgunApiKey: !!process.env.MAILGUN_API_KEY,
      hasMailgunDomain: !!process.env.MAILGUN_DOMAIN,
      mailgunDomain: process.env.MAILGUN_DOMAIN,
      hasKvUrl: !!process.env.KV_REST_API_URL,
      hasKvToken: !!process.env.KV_REST_API_TOKEN,
    });
    
    return res.status(500).json({
      success: false,
      error: 'メール送信に失敗しました。しばらくしてから再度お試しください。',
    });
  }
}

