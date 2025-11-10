# GitHubへのプッシュ手順

## 1. Gitリポジトリの初期化とコミット

以下のコマンドを実行してください：

```bash
# Gitリポジトリを初期化
git init

# すべてのファイルをステージング
git add .

# 初回コミット
git commit -m "Initial commit: キャリアシートアプリケーション"

# ブランチ名をmainに変更（GitHubのデフォルトに合わせる）
git branch -M main
```

## 2. GitHubでリポジトリを作成

1. GitHubにログイン: https://github.com
2. 右上の「+」ボタン → 「New repository」をクリック
3. リポジトリ名を入力（例: `ai-agent` または `career-sheet-app`）
4. **「Initialize this repository with a README」のチェックを外す**（既にファイルがあるため）
5. 「Create repository」をクリック

## 3. GitHubにプッシュ

GitHubでリポジトリを作成した後、表示されるコマンドを実行：

```bash
# リモートリポジトリを追加（YOUR_USERNAMEとYOUR_REPO_NAMEを置き換える）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# コードをプッシュ
git push -u origin main
```

## 注意事項

- `.gitignore`に`node_modules`と`dist`が含まれているので、これらはプッシュされません
- 初回プッシュ時はGitHubの認証情報の入力が求められる場合があります
- 個人情報やAPIキーが含まれていないか確認してください

