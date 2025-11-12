import type { VercelRequest, VercelResponse } from '@vercel/node';
import { saveRegistrationData } from './lib/kv.js';

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
    const { email, ...userData } = req.body;

    // バリデーション
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'メールアドレスが必要です',
      });
    }

    // 必須項目チェック
    if (!userData.name) {
      return res.status(400).json({
        success: false,
        error: '氏名が必要です',
      });
    }

    if (!userData.birthYear || !userData.birthMonth || !userData.birthDay) {
      return res.status(400).json({
        success: false,
        error: '生年月日が必要です',
      });
    }

    if (!userData.gender) {
      return res.status(400).json({
        success: false,
        error: '性別が必要です',
      });
    }

    if (!userData.postalCode) {
      return res.status(400).json({
        success: false,
        error: '郵便番号が必要です',
      });
    }

    if (!userData.password) {
      return res.status(400).json({
        success: false,
        error: 'パスワードが必要です',
      });
    }

    if (!userData.agreedToPrivacy) {
      return res.status(400).json({
        success: false,
        error: 'プライバシーポリシーへの同意が必要です',
      });
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

    return res.status(200).json({
      success: true,
      message: '登録が完了しました',
      user: {
        email,
        name: userData.name,
      },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    
    return res.status(500).json({
      success: false,
      error: 'ユーザー登録に失敗しました。再度お試しください。',
    });
  }
}

