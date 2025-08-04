SHARE (仮) - ソーシャルメディア風アプリケーション
短いメッセージを投稿・共有するための、シンプルなSNS風アプリケーションです。フロントエンドはNext.js、バックエンドはLaravelで構築され、認証にはFirebaseを利用しています。

目次
主要機能

技術スタック

環境構築

Firebaseのセットアップ

テストの実行

テストアカウント

ER図（参考）

主要機能
ユーザー認証: Firebase Authenticationを利用した会員登録、ログイン、ログアウト機能

投稿: テキストメッセージの投稿、表示、削除（本人のみ）

インタラクション: 各投稿への「いいね」機能（登録・解除）、コメント機能

技術スタック
カテゴリ	技術・サービス
フロントエンド	Next.js, React, TypeScript, Tailwind CSS
バックエンド	Laravel, PHP, MySQL
認証	Firebase Authentication
開発環境	Laravel Sail (Docker)
テスト	Jest, React Testing Library (フロントエンド)<br>PHPUnit (バックエンド)

Google スプレッドシートにエクスポート
環境構築
本プロジェクトはフロントエンドとバックエンドのリポジトリが分かれていることを想定しています。

1. バックエンド (Laravel) の構築
Bash

# 1. リポジトリをクローン
git clone <バックエンドのリポジトリURL>
cd <バックエンドのディレクトリ>

# 2. 環境変数の設定
cp .env.example .env

# 3. .envファイルを編集し、データベース接続情報とFirebaseの秘密鍵パスを設定
# DB_CONNECTION=mysql
# DB_HOST=mysql
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=sail
# DB_PASSWORD=password
# FIREBASE_CREDENTIALS=/var/www/html/path/to/your/firebase_credentials.json

# 4. Dockerコンテナを起動
./vendor/bin/sail up -d

# 5. 依存パッケージをインストール
./vendor/bin/sail composer install

# 6. アプリケーションキーを生成
./vendor/bin/sail artisan key:generate

# 7. データベースを構築し、テストデータを投入
./vendor/bin/sail artisan migrate:fresh --seed
バックエンドは http://localhost で起動します。

2. フロントエンド (Next.js) の構築
Bash

# 1. リポジトリをクローン
git clone <フロントエンドのリポジトリURL>
cd <フロントエンドのディレクトリ>

# 2. 依存パッケージをインストール
npm install

# 3. 環境変数の設定
cp .env.local.example .env.local

# 4. .env.localファイルを編集し、Firebase設定とバックエンドAPIのURLを設定
# NEXT_PUBLIC_FIREBASE_API_KEY="..."
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
# ... (その他のFirebase設定) ...
# NEXT_PUBLIC_API_BASE_URL="http://localhost/api"

# 5. 開発サーバーを起動
npm run dev
フロントエンドは http://localhost:3000 で起動します。

Firebaseのセットアップ
Firebaseプロジェクトの作成: Firebaseコンソールで新しいプロジェクトを作成します。

ウェブアプリの登録: プロジェクト設定からウェブアプリを登録し、表示されるfirebaseConfigオブジェクトの値をフロントエンドの.env.localにコピーします。

Authenticationの有効化: Authenticationサービスへ移動し、「メール/パスワード」によるサインインを有効にします。

サービスアカウント秘密鍵の取得: プロジェクト設定の「サービスアカウント」タブへ移動し、「新しい秘密鍵の生成」をクリックしてJSONファイルをダウンロードします。このファイルをバックエンドプロジェクト内の安全な場所に配置し、そのコンテナ内パスをバックエンドの.envファイルにあるFIREBASE_CREDENTIALSに設定します。

テストの実行
バックエンドテスト (PHPUnit)
バックエンドのAPIが正しく機能するかをテストします。

Bash

# バックエンドのディレクトリで実行
./vendor/bin/sail artisan test
フロントエンドテスト (Jest)
フロントエンドのコンポーネントが正しく表示・動作するかをテストします。

Bash

# フロントエンドのディレクトリで実行
npm test
テストアカウント
シーディングを実行すると、以下のテスト用アカウントが作成されます。

メールアドレス: test@example.com

パスワード: password

ER図（参考）
本アプリケーションの主要なデータベース構成です。

テーブル名	概要
users	ユーザー情報（FirebaseのUIDを含む）
posts	投稿内容
comments	投稿へのコメント
likes	投稿への「いいね」

Google スプレッドシートにエクスポート





