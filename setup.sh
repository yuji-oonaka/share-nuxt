#!/bin/bash

# スクリプトがエラーで停止するように設定
set -e

echo "🚀 環境構築を開始します..."

# --- バックエンドの構築 ---
echo "--- 1. バックエンド (Laravel) を構築中... ---"
cd backend

echo ".envファイルを作成します..."
if [ -f .env.example ]; then
    cp .env.example .env
fi

echo "Composerパッケージをインストールします..."
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd)":/var/www/html \
    -w /var/www/html \
    laravelsail/php83-composer:latest \
    composer install --ignore-platform-reqs

echo "sailコンテナをビルドして起動します..."
./vendor/bin/sail up -d --build

echo "データベースコンテナの起動を待ちます..."
sleep 15 # 15秒待機

echo "アプリケーションキーを生成します..."
./vendor/bin/sail artisan key:generate

echo "データベースを構築し、シーディングを実行します..."
./vendor/bin/sail artisan migrate
./vendor/bin/sail artisan db:seed

echo "--- バックエンドの構築が完了しました。 ---"


# --- フロントエンドの構築 (Nuxt.js用に修正) ---
echo "--- 2. フロントエンド (Nuxt.js) を構築中... ---"
cd ../frontend

echo "npmパッケージをインストールします..."
npm install

echo ".envファイルを作成します..."
# .env.exampleが存在する場合のみコピーする
if [ -f .env.example ]; then
    cp .env.example .env # .env.local から .env に変更
fi

echo "--- フロントエンドの構築が完了しました。 ---"

echo "✅ 全ての環境構築が完了しました！"
echo "--- 次のステップ ---"
# .env.local から .env に変更
echo "1. backend/.env と frontend/.env に、Firebaseのキーなどを設定してください。"
echo "2. frontendディレクトリで 'npm run dev' を実行して、開発を開始してください。"