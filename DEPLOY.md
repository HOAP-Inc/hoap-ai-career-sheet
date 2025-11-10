# Web表示方法

このアプリをWeb上で表示するには、以下の方法があります。

## 方法1: Viteのプレビューサーバー（ローカル確認）

ビルドしたファイルをローカルで確認する場合：

```bash
npm run preview
```

ブラウザで `http://localhost:4173` にアクセスします。

## 方法2: Netlifyにデプロイ（推奨・無料）

1. **Netlifyアカウントを作成**
   - https://www.netlify.com にアクセス
   - GitHubアカウントでサインアップ（推奨）

2. **デプロイ方法A: ドラッグ&ドロップ**
   - `dist` フォルダをブラウザで開く
   - `dist` フォルダ全体を Netlify のデプロイ画面にドラッグ&ドロップ
   - 自動的にデプロイが完了し、URLが発行されます

3. **デプロイ方法B: GitHub連携**
   - このプロジェクトをGitHubにプッシュ
   - Netlifyで「New site from Git」を選択
   - GitHubリポジトリを選択
   - ビルド設定：
     - Build command: `npm run build`
     - Publish directory: `dist`
   - デプロイボタンをクリック

## 方法3: Vercelにデプロイ（無料）

1. **Vercelアカウントを作成**
   - https://vercel.com にアクセス
   - GitHubアカウントでサインアップ

2. **デプロイ**
   - 「New Project」をクリック
   - GitHubリポジトリを選択
   - フレームワークプリセット: **Vite** を選択
   - 自動的にビルド設定が検出されます
   - 「Deploy」をクリック

## 方法4: GitHub Pagesにデプロイ（無料）

1. **vite.config.tsを更新**
   - `base: '/your-repo-name/'` を設定する必要があります

2. **GitHub Actionsで自動デプロイ**
   - `.github/workflows/deploy.yml` を作成して自動デプロイを設定

## 方法5: 任意のWebサーバーでホスティング

`dist` フォルダの内容を任意のWebサーバーにアップロードします。

- Apache
- Nginx
- その他の静的ホスティングサービス

## 開発サーバー

開発中は以下のコマンドでローカル開発サーバーを起動できます：

```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスします。

