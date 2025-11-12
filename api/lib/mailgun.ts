import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);

// Mailgunクライアントを初期化
const apiKey = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN || 'hoap-inc.jp';

if (!apiKey) {
  console.warn('MAILGUN_API_KEY is not set. Email sending will fail.');
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

    const response = await mg.messages.create(domain, messageData);
    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Failed to send email:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    throw error;
  }
}

