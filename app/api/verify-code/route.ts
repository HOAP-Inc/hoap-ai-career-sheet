import { NextRequest, NextResponse } from 'next/server';
import { getVerificationCode, deleteVerificationCode } from '../lib/kv';

export async function POST(request: NextRequest) {
  // CORSヘッダーを設定
  const headers = new Headers();
  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  try {
    const body = await request.json();
    const { email, code } = body;

    console.log('📥 Verify code request:', { email, code, hasEmail: !!email, hasCode: !!code });

    // バリデーション
    if (!email || typeof email !== 'string') {
      console.error('❌ Email validation failed:', email);
      return NextResponse.json(
        {
          success: false,
          error: 'メールアドレスが必要です',
        },
        { status: 400, headers }
      );
    }

    if (!code || typeof code !== 'string') {
      console.error('❌ Code validation failed:', code);
      return NextResponse.json(
        {
          success: false,
          error: '認証コードが必要です',
        },
        { status: 400, headers }
      );
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
      return NextResponse.json(
        {
          success: false,
          error: '認証コードの有効期限が切れています。再度送信してください。',
        },
        { status: 400, headers }
      );
    }

    // 認証コードを比較
    if (savedCode !== normalizedInputCode) {
      console.error('❌ Code mismatch:', { savedCode, inputCode: normalizedInputCode });
      return NextResponse.json(
        {
          success: false,
          error: '認証コードが正しくありません',
        },
        { status: 400, headers }
      );
    }

    // 認証成功：認証コードを削除
    await deleteVerificationCode(email);

    console.log(`Verification successful for ${email}`);

    return NextResponse.json(
      {
        success: true,
        message: '認証が完了しました',
        email,
      },
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Error verifying code:', error);

    return NextResponse.json(
      {
        success: false,
        error: '認証処理に失敗しました。再度お試しください。',
      },
      { status: 500, headers }
    );
  }
}

export async function OPTIONS() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  return new NextResponse(null, { status: 200, headers });
}

