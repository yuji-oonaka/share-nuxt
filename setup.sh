#!/bin/bash

# スクリプトがエラーで停止するように設定
set -e

echo "🚀 環境構築を開始します..."

# --- バックエンドの構築 ---
echo "--- 1. バックエンド (Laravel) を構築中... ---"
cd backend

echo "sailコンテナを起動します..."
./vendor/bin/sail up -d

echo ".envファイルをコピーします..."
cp .env.example .env

echo "Composerパッケージをインストールします..."
./vendor/bin/sail composer install

echo "アプリケーションキーを生成します..."
./vendor/bin/sail artisan key:generate

echo "データベースを構築し、シーディングを実行します..."
./vendor/bin/sail artisan migrate:fresh --seed

echo "--- バックエンドの構築が完了しました。 ---"


# --- フロントエンドの構築 ---
echo "--- 2. フロントエンド (Next.js) を構築中... ---"
cd ../frontend

echo "npmパッケージをインストールします..."
npm install

echo ".env.localファイルをコピーします..."
cp .env.local.example .env.local

echo "--- フロントエンドの構築が完了しました。 ---"

echo "✅ 全ての環境構築が完了しました！"
echo "フロントエンドを起動するには、frontendディレクトリで 'npm run dev' を実行してください。"