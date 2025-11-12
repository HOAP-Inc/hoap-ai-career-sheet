/**
 * Mailgun メール送信テストスクリプト（ES Modules版）
 * 
 * 使用方法:
 * node test-mailgun.mjs
 * node test-mailgun.mjs your-email@example.com
 */

import formData from 'form-data';
import Mailgun from 'mailgun.js';

// 環境変数から取得（必須）
const apiKey = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN || 'hoap-inc.jp';

console.log('=== Mailgun メール送信テスト ===\n');
console.log('API Key:', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 10));
console.log('Domain:', domain);
console.log('');

if (!apiKey) {
  console.error('❌ MAILGUN_API_KEY が設定されていません');
  console.log('\n環境変数を設定してください:');
  console.log('  export MAILGUN_API_KEY=your-api-key');
  console.log('  export MAILGUN_DOMAIN=hoap-inc.jp');
  console.log('\nまたは実行時に指定:');
  console.log('  MAILGUN_API_KEY=your-api-key node test-mailgun.mjs');
  process.exit(1);
}

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: apiKey,
});

// テスト用の認証コード
const testCode = '123456';
const testEmail = process.argv[2] || 'info@hoap-inc.jp'; // コマンドライン引数で指定可能

const messageData = {
  from: 'noreply@hoap-inc.jp',
  to: testEmail,
  subject: '【HOAP】認証コードのお知らせ（テスト）',
  text: `※本メールは送信専用となっておりますので返信いただくことが出来ません。

【HOAP】認証コード：${testCode}

この認証コードを入力してください。

認証コードの有効期限は10分です。

※この認証コードは他人に共有しないようお願いします。

※このメールに心当たりがない場合は、他者により不正にお客様アカウントへログインが試みられている可能性がございます。

＊＊＊＊＊＊＊＊＊＊＊＊＊
株式会社HOAP
運営事務局
＊＊＊＊＊＊＊＊＊＊＊＊＊`,
};

console.log('送信先:', testEmail);
console.log('認証コード:', testCode);
console.log('送信中...\n');

mg.messages
  .create(domain, messageData)
  .then((response) => {
    console.log('✅ メール送信成功！');
    console.log('Response ID:', response.id);
    console.log('Message:', response.message);
    console.log('\nメールが届くまで数秒かかる場合があります。');
  })
  .catch((error) => {
    console.error('❌ メール送信失敗');
    console.error('\nエラー詳細:');
    console.error('Name:', error.name);
    console.error('Message:', error.message);
    
    if (error.status) {
      console.error('HTTP Status:', error.status);
    }
    
    if (error.details) {
      console.error('Details:', JSON.stringify(error.details, null, 2));
    }
    
    if (error.stack) {
      console.error('\nStack Trace:');
      console.error(error.stack);
    }
    
    console.error('\n--- トラブルシューティング ---');
    console.error('1. API Keyが正しいか確認してください');
    console.error('2. DomainがMailgunで認証されているか確認してください');
    console.error('3. Mailgun DashboardでAPI Keyの権限を確認してください');
    
    process.exit(1);
  });

