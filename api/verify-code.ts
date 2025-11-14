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

    console.log('📥 Verify code request:', { email, code, hasEmail: !!email, hasCode: !!code });

    // バリデーション
    if (!email || typeof email !== 'string') {
      console.error('❌ Email validation failed:', email);
      return res.status(400).json({
        success: false,
        error: 'メールアドレスが必要です',
      });
    }

    if (!code || typeof code !== 'string') {
      console.error('❌ Code validation failed:', code);
      return res.status(400).json({
        success: false,
        error: '認証コードが必要です',
      });
    }

    // Vercel KVから認証コードを取得
    console.log('🔍 Fetching saved code for:', email);
    const savedCode = await getVerificationCode(email);
    const normalizedInputCode = typeof code === 'string' ? code.trim() : '';
    console.log('📝 Saved code:', {
      savedCode,
      savedCodeType: typeof savedCode,
      inputCode: normalizedInputCode,
      inputCodeType: typeof normalizedInputCode,
      match: savedCode === normalizedInputCode,
    });

    if (!savedCode) {
      console.error('❌ No saved code found for:', email);
      return res.status(400).json({
        success: false,
        error: '認証コードの有効期限が切れています。再度送信してください。',
      });
    }

    // 認証コードを比較
    if (savedCode !== normalizedInputCode) {
      console.error('❌ Code mismatch:', { savedCode, inputCode: normalizedInputCode });
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

