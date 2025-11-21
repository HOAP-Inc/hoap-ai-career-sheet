import formData from 'form-data';
import Mailgun from 'mailgun.js';

// Mailgun v9+ の正しいインポート方法
const mailgun = new (Mailgun as any)(formData);

// Mailgunクライアントを初期化
let apiKey = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN || 'hoap-inc.jp';

if (!apiKey) {
  console.warn('MAILGUN_API_KEY is not set. Email sending will fail.');
} else {
  // MailgunのAPIキーが 'key-' で始まらない場合は追加
  // ただし、既に 'key-' で始まる場合はそのまま使用
  if (!apiKey.startsWith('key-')) {
    // 提供されたキーが既に正しい形式の可能性もあるので、そのまま使用
    // Mailgunの新しいAPIキー形式では 'key-' プレフィックスが不要な場合もある
    console.log('API key format check: key does not start with "key-"');
  }
}

export const mg = mailgun.client({
  username: 'api',
  key: apiKey || '',
});

// 認証コードメールを送信
export async function sendVerificationEmail(email: string, code: string) {
  const messageData = {
    from: 'noreply@hoap-inc.jp',
    to: email,
    subject: '【HOAP】認証コードのお知らせ',
    text: `※本メールは送信専用となっておりますので返信いただくことが出来ません。

【HOAP】認証コード：${code}

この認証コードを入力してください。

認証コードの有効期限は10分です。

※この認証コードは他人に共有しないようお願いします。

※このメールに心当たりがない場合は、他者により不正にお客様アカウントへログインが試みられている可能性がございます。

＊＊＊＊＊＊＊＊＊＊＊＊＊
株式会社HOAP
運営事務局
＊＊＊＊＊＊＊＊＊＊＊＊＊`,
  };

  try {
    if (!apiKey) {
      throw new Error('MAILGUN_API_KEY is not configured');
    }

    console.log('Attempting to send email:', {
      domain,
      from: messageData.from,
      to: messageData.to,
      apiKeyPrefix: apiKey.substring(0, 10) + '...',
    });

    const response = await mg.messages.create(domain, messageData);
    console.log('Email sent successfully:', {
      id: response.id,
      message: response.message,
    });
    return response;
  } catch (error: unknown) {
    console.error('Failed to send email:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    if (error && typeof error === 'object' && 'status' in error) {
      console.error('HTTP status:', error.status);
    }
    if (error && typeof error === 'object' && 'details' in error) {
      console.error('Error details:', error.details);
    }
    throw error;
  }
}

