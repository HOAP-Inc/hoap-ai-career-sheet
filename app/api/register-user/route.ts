import { NextRequest, NextResponse } from 'next/server';
import { saveRegistrationData } from '../lib/kv';

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
    const { email, ...userData } = body;

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

    // 必須項目チェック
    if (!userData.name) {
      return NextResponse.json(
        {
          success: false,
          error: '氏名が必要です',
        },
        { status: 400, headers }
      );
    }

    if (!userData.birthYear || !userData.birthMonth || !userData.birthDay) {
      return NextResponse.json(
        {
          success: false,
          error: '生年月日が必要です',
        },
        { status: 400, headers }
      );
    }

    if (!userData.gender) {
      return NextResponse.json(
        {
          success: false,
          error: '性別が必要です',
        },
        { status: 400, headers }
      );
    }

    if (!userData.postalCode) {
      return NextResponse.json(
        {
          success: false,
          error: '郵便番号が必要です',
        },
        { status: 400, headers }
      );
    }

    if (!userData.password) {
      return NextResponse.json(
        {
          success: false,
          error: 'パスワードが必要です',
        },
        { status: 400, headers }
      );
    }

    if (!userData.agreedToPrivacy) {
      return NextResponse.json(
        {
          success: false,
          error: 'プライバシーポリシーへの同意が必要です',
        },
        { status: 400, headers }
      );
    }

    console.log(`Registering user: ${email}`);

    // Vercel KVに登録データを保存（24時間有効）
    // 後でデータベースに統合する際にここを修正
    await saveRegistrationData(email, {
      email,
      ...userData,
      registeredAt: new Date().toISOString(),
    });

    // TODO: データベース統合時にここでユーザーテーブルへ保存
    // const userId = await db.users.create({
    //   email,
    //   name: userData.name,
    //   birth_date: `${userData.birthYear}-${userData.birthMonth}-${userData.birthDay}`,
    //   gender: userData.gender,
    //   postal_code: userData.postalCode,
    //   address: userData.location,
    //   address_detail: userData.addressDetail,
    //   phone: userData.phone,
    //   password_hash: await hashPassword(userData.password),
    // });

    console.log(`User registered successfully: ${email}`);

    return NextResponse.json(
      {
        success: true,
        message: '登録が完了しました',
        user: {
          email,
          name: userData.name,
        },
      },
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Error registering user:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'ユーザー登録に失敗しました。再度お試しください。',
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

