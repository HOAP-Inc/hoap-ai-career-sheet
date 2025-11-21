import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '../lib/mailgun';
import { saveVerificationCode } from '../lib/kv';

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
    const { email } = body;

    // バリデーション
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'メールアドレスが必要です',
        },
        { status: 400, headers }
      );
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: '正しいメールアドレスを入力してください',
        },
        { status: 400, headers }
      );
    }

    // 6桁の認証コード生成
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    console.log(`Generated verification code for ${email}: ${code}`);

    // Vercel KV（Redis）に保存（10分間有効）
    await saveVerificationCode(email, code);

    // Mailgunでメール送信
    await sendVerificationEmail(email, code);

    return NextResponse.json(
      {
        success: true,
        message: '認証コードをメールで送信しました',
      },
      { status: 200, headers }
    );
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

    return NextResponse.json(
      {
        success: false,
        error: 'メール送信に失敗しました。しばらくしてから再度お試しください。',
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

