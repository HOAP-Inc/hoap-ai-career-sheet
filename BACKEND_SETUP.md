# バックエンドAPI セットアップガイド

## 概要

このプロジェクトは、Vercel Serverless Functionsを使用してバックエンドAPIを実装しています。

- **認証コード送信**: `/api/send-verification-code`
- **認証コード確認**: `/api/verify-code`
- **ユーザー登録**: `/api/register-user`

## 技術スタック

- **バックエンド**: Vercel Serverless Functions（Node.js/TypeScript）
- **メール送信**: Mailgun
- **一時データ保存**: Vercel KV（Redis）

---

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Vercel KV のセットアップ

1. [Vercel Dashboard](https://vercel.com/dashboard)にログイン
2. プロジェクトを選択
3. **Storage** → **Create Database** → **KV**を選択
4. データベース名を入力（例: `hoap-kv`）
5. **Create**をクリック
6. 自動的に環境変数が設定されます

### 3. Mailgun の設定

#### Mailgun APIキーの取得

1. [Mailgun](https://www.mailgun.com/)にログイン
2. **Settings** → **API Keys**
3. **Private API key**をコピー

#### Vercelに環境変数を設定

1. [Vercel Dashboard](https://vercel.com/dashboard)でプロジェクトを選択
2. **Settings** → **Environment Variables**
3. 以下の環境変数を追加：

```
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=hoap-inc.jp
```

**重要**: すべての環境（Production, Preview, Development）にチェックを入れる

### 4. デプロイ

```bash
git add .
git commit -m "Add backend API endpoints"
git push origin main
```

Vercelが自動的にデプロイします。

---

## ローカル開発

### ローカルでVercel KVを使う

1. Vercel CLIをインストール:
```bash
npm install -g vercel
```

2. Vercelにログイン:
```bash
vercel login
```

3. プロジェクトをリンク:
```bash
vercel link
```

4. 環境変数をダウンロード:
```bash
vercel env pull .env.local
```

5. 開発サーバーを起動:
```bash
npm run dev
```

### モックモードで開発

環境変数を設定せずに開発する場合（モックAPI使用）:

```bash
# .env.local を作成
VITE_USE_MOCK_API=true
```

```bash
npm run dev
```

---

## API仕様

### 1. 認証コード送信

**エンドポイント**: `POST /api/send-verification-code`

**リクエスト**:
```json
{
  "email": "user@example.com"
}
```

**レスポンス**:
```json
{
  "success": true,
  "message": "認証コードをメールで送信しました"
}
```

### 2. 認証コード確認

**エンドポイント**: `POST /api/verify-code`

**リクエスト**:
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**レスポンス**:
```json
{
  "success": true,
  "message": "認証が完了しました",
  "email": "user@example.com"
}
```

### 3. ユーザー登録

**エンドポイント**: `POST /api/register-user`

**リクエスト**:
```json
{
  "email": "user@example.com",
  "name": "山田太郎",
  "phone": "09012345678",
  "birthYear": 1990,
  "birthMonth": 1,
  "birthDay": 1,
  "gender": "男",
  "postalCode": "1234567",
  "location": "東京都渋谷区...",
  "addressDetail": "○○ビル3F",
  "password": "password123",
  "agreedToPrivacy": true
}
```

**レスポンス**:
```json
{
  "success": true,
  "message": "登録が完了しました",
  "user": {
    "email": "user@example.com",
    "name": "山田太郎"
  }
}
```

---

## データベース統合（将来の実装）

現在はVercel KV（Redis）に一時保存していますが、将来的にはデータベースに統合します。

### 必要な変更箇所

1. **`api/register-user.ts`**:
   - TODO コメント参照
   - データベース接続を追加
   - usersテーブルへのINSERT処理

2. **データベーススキーマ（例）**:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL,
  gender VARCHAR(10) NOT NULL,
  postal_code VARCHAR(7) NOT NULL,
  address VARCHAR(500) NOT NULL,
  address_detail VARCHAR(500),
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

---

## トラブルシューティング

### メールが送信されない

1. Mailgun APIキーが正しいか確認
2. ドメインが認証済みか確認
3. Vercelのログを確認: `vercel logs`

### 認証コードが保存されない

1. Vercel KVが正しくセットアップされているか確認
2. 環境変数が設定されているか確認
3. Vercel KVのダッシュボードでデータを確認

### CORSエラー

各APIエンドポイントにCORSヘッダーが設定されているため、通常は発生しません。
もし発生した場合は、`vercel.json`の設定を確認してください。

---

## 次のステップ

1. ✅ バックエンドAPI実装（完了）
2. ⏳ データベース統合（将来）
3. ⏳ 他社システムとの連携（将来）
4. ⏳ JWT認証の実装（将来）
5. ⏳ パスワードハッシュ化（将来）

---

## サポート

質問や問題がある場合は、GitHub Issuesで報告してください。

