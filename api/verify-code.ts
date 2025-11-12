import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getVerificationCode, deleteVerificationCode } from './lib/kv.js';

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
    const { email, code } = req.body;

    // バリデーション
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'メールアドレスが必要です',
      });
    }

    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        success: false,
        error: '認証コードが必要です',
      });
    }

    // Vercel KVから認証コードを取得
    const savedCode = await getVerificationCode(email);

    if (!savedCode) {
      return res.status(400).json({
        success: false,
        error: '認証コードの有効期限が切れています。再度送信してください。',
      });
    }

    // 認証コードを比較
    if (savedCode !== code) {
      return res.status(400).json({
        success: false,
        error: '認証コードが正しくありません',
      });
    }

    // 認証成功：認証コードを削除
    await deleteVerificationCode(email);

    console.log(`Verification successful for ${email}`);

    return res.status(200).json({
      success: true,
      message: '認証が完了しました',
      email,
    });
  } catch (error) {
    console.error('Error verifying code:', error);
    
    return res.status(500).json({
      success: false,
      error: '認証処理に失敗しました。再度お試しください。',
    });
  }
}

