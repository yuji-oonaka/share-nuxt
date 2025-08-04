
SHARE (仮) - ソシャルメディア風アプリケーション

短いメッセージを投稿・共有するための、シンプルなSNS風アプリケーションです。フロントエンドはNext.js、バックエンドはLaravelで構築され、認証にはFirebaseを利用しています。

目次

[主要機能](https://www.google.com/search?q=%23%E4%B8%BB%E8%A6%81%E6%A9%9F%E8%83%BD)
[技術スタック](https://www.google.com/search?q=%23%E6%8A%80%E8%A1%93%E3%82%B9%E3%82%BF%E3%83%83%E3%82%AF)
[環境構築](https://www.google.com/search?q=%23%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89)
[Firebaseのセットアップ](https://www.google.com/search?q=%23firebase%E3%81%AE%E3%82%BB%E3%83%83%E3%83%88%E3%82%A2%E3%83%83%E3%83%97)
[テストの実行](https://www.google.com/search?q=%23%E3%83%86%E3%82%B9%E3%83%88%E3%81%AE%E5%AE%9F%E8%A1%8C)
[テストアカウント](https://www.google.com/search?q=%23%E3%83%86%E3%82%B9%E3%83%88%E3%82%A2%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88)
[ER図（参考）](https://www.google.com/search?q=%23er%E5%9B%B3%E5%8F%82%E8%80%83)

主要機能

ユーザー認証: Firebase Authenticationを利用した会員登録、ログイン、ログアウト機能
投稿: テキストメッセージの投稿、表示、削除（本人のみ）
インタラクション: 各投稿への「いいね」機能（登録・解除）、コメント機能

技術スタック

カテゴリ
技術・サービス
フロントエンド
Next.js, React, TypeScript, Tailwind CSS
バックエンド
Laravel, PHP, MySQL
認証
Firebase Authentication
開発環境
Laravel Sail (Docker)
テスト
Jest, React Testing Library (フロントエンド)<br>PHPUnit (バックエンド)
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

Firebaseプロジェクトの作成:[Firebaseコンソール](https://console.firebase.google.com/)で新しいプロジェクトを作成します。
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

本アプリケーションの主要なデータベース構成です。 | テーブル名 | 概要 | | :--- | :--- | | users | ユーザー情報（FirebaseのUIDを含む） | | posts | 投稿内容 | | comments | 投稿へのコメント | | likes | 投稿への「いいね」 |
最初のタイトルから目次主要機能などもすべて貼り付けられるように
一貫していただけますか

例としてはこのような感じです

# coachtech-frima-app

coachtechフリマ  
アイテムの出品と購入を行うためのフリマアプリ

## 目次

1. [主要機能](#%E4%B8%BB%E8%A6%81%E6%A9%9F%E8%83%BD)
2. [環境構築](#%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89)
   - [Dockerビルド](#docker%E3%83%93%E3%83%AB%E3%83%89)
   - [Laravel環境構築](#laravel%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89)
   - [mailhogを利用した会員登録](#mailhog%E3%82%92%E5%88%A9%E7%94%A8%E3%81%97%E3%81%9F%E4%BC%9A%E5%93%A1%E7%99%BB%E9%8C%B2%E3%81%AB%E9%96%A2%E3%81%97%E3%81%A6)
   - [Stripe決済テスト](#stripe%E6%B1%BA%E6%B8%88%E3%83%86%E3%82%B9%E3%83%88%E3%81%AB%E9%96%A2%E3%81%97%E3%81%A6)
   - [コンビニ支払いテスト](#%E3%82%B3%E3%83%B3%E3%83%93%E3%83%8B%E6%94%AF%E6%89%95%E3%81%84%E3%83%86%E3%82%B9%E3%83%88%E3%81%AB%E9%96%A2%E3%81%97%E3%81%A6)
   - [PHPunitテスト](#phpunit%E3%83%86%E3%82%B9%E3%83%88%E3%81%AB%E9%96%A2%E3%81%97%E3%81%A6)
3. [テストアカウント](#%E3%83%86%E3%82%B9%E3%83%88%E3%82%A2%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88)
4. [開発環境](#%E9%96%8B%E7%99%BA%E7%92%B0%E5%A2%83)
5. [技術スタック](#%E6%8A%80%E8%A1%93%E3%82%B9%E3%82%BF%E3%83%83%E3%82%AF)
6. [ER図](#er%E5%9B%B3)

## 主要機能

- ユーザー登録（MailHogによるメール確認機能付き)・認証
- 商品の閲覧・検索・出品・購入
- Stripe決済（カード・コンビニ）

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

## 環境構築

### Dockerビルド

1. `git clone git@github.com:yuji-oonaka/coachtech-frima-app.git`
2. `docker-compose up -d --build`

### Laravel環境構築

1. `docker-compose exec php bash`
2. `composer install`
3. `cp .env.example .env`
4. `php artisan key:generate`
5. `php artisan migrate`
6. `php artisan db:seed`
7. `php artisan storage:link`

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

## mailhogを利用した会員登録に関して

1. 会員登録画面にて登録後、ブラウザにて http://localhost:8025 にアクセス
2. 送信されたメールをリアルタイムで確認
3. 登録したメールアドレスを選択後、メールアドレスの確認を押すと会員登録が完了しプロフィール設定画面に遷移する

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

## Stripe決済テストに関して

#### Stripeアカウントの準備

1. https://stripe.com/jp
2. Stripe開発者ダッシュボードでアカウント作成 テストモードを有効化（テスト環境の表示を確認）
3. 設定の決済手段にてコンビニ決済を有効化

#### テストキーの取得

ダッシュボード左メニュー → [Developers(開発者)] → [API keys] 「Standard keys(標準キー)」から以下を取得：

- 公開可能キー（Publishable key）
- シークレットキー（Secret key）


#### 環境変数の設定

.envに追加

STRIPE_KEY=pk_test_51XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX  
STRIPE_SECRET=sk_test_51XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

#### 購入画面にて支払い方法選択

1. カード支払いを選択し購入するを押す
2. stripe決済画面に遷移した後
   - メールアドレス `任意のメールアドレス`
   - カード番号 `4242 4242 4242 4242`
   - 有効期限 `12/34`
   - CVC `123`
   - 名前  `任意の名前`
3. 入力画面に記入後支払うを押すと購入が完了となる

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

## コンビニ支払いテストに関して

コンビニ決済にてStripe webhookを使用します

### Webhook設定

- `docker-compose exec php bash`
- `stripe login`
- 表示されたURLにアクセスしアクセスを許可するを押す
- `stripe listen --forward-to http://host.docker.internal/stripe/webhook`

生成されたシグネチャシークレットを.envに追加  
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXX

コンビニ支払いを選択し購入するを押す

stripe決済画面に遷移したあと

- メールアドレス `succeed_immediately@test.com`
- 名前 `任意の名前`
- 支払いを押す
> [!NOTE]
> メールアドレス：succeed_immediately@test.com

このメールアドレスを使用することで、テスト環境でコンビニ支払いのフローを正しくシミュレートできます。このアドレスは、Stripeのテスト環境で即時に成功する支払いをトリガーします。

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

## PHPunitテストに関して

- docker-compose exec php bash

1. `cp .env.testing.example .env.testing`
2. `php artisan key:generate --env=testing`
3. `php artisan migrate --env=testing`
4. `php artisan db:seed --env=testing`
5. `php artisan test --testsuite=Feature`

- 個別テストの場合は
- `php artisan test tests/Feature/〇〇Test.php`

> [!NOTE]
> .env.testingにもStripeのAPIキーを設定してください

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

## [テストアカウント](pplx://action/followup)

- name: User1
- email: User1@example.com
- password: password

または会員登録にて任意のユーザーを登録

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

## [開発環境](pplx://action/followup)

- 商品一覧画面:http://localhost
- 会員登録画面:http://localhost/register
- phpMyAdmin:http://localhost:8080
- phpMyAdmin_testing:http://localhost:8081

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

## [技術スタック](pplx://action/followup)

| 技術 | バージョン |
| :-- | :-- |
| PHP | 8.3.17 |
| Laravel | 11.53.1 |
| MySQL | 8.0.26 |
| nginx | 1.21.1 |
| Stripe | 16.4.0 |
| MailHog | 最新版 |

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

## ER図

![coachtech-frima-app drawio](https://github.com/user-attachments/assets/086152e8-ecf6-4e06-8306-1555ccbe8126)

[目次に戻る](#%E7%9B%AE%E6%AC%A1)
思考プロセスを表示
はい、承知いたしました。 ご提示いただいた例のように、詳細な目次やセクションごとの「目次に戻る」リンクなどを含んだ、より丁寧で一貫性のあるREADMEを作成します。
以下の---で囲まれた部分を、そのままコピーしてREADME.mdファイルに貼り付けてください。

SHARE (仮) - ソーシャルメディア風アプリケーション

短いメッセージを投稿・共有するための、シンプルなSNS風アプリケーションです。フロントエンドはNext.js、バックエンドはLaravelで構築され、認証にはFirebaseを利用しています。

目次

[主要機能](https://www.google.com/search?q=%23%E4%B8%BB%E8%A6%81%E6%A9%9F%E8%83%BD)
[技術スタック](https://www.google.com/search?q=%23%E6%8A%80%E8%A1%93%E3%82%B9%E3%82%BF%E3%83%83%E3%82%AF)
[環境構築](https://www.google.com/search?q=%23%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89)
[バックエンド (Laravel)](https://www.google.com/search?q=%231-%E3%83%90%E3%83%83%E3%82%AF%E3%82%A8%E3%83%B3%E3%83%89-laravel-%E3%81%AE%E6%A7%8B%E7%AF%89)
[フロントエンド (Next.js)](https://www.google.com/search?q=%232-%E3%83%95%E3%83%AD%E3%83%B3%E3%83%88%E3%82%A8%E3%83%B3%E3%83%89-nextjs-%E3%81%AE%E6%A7%8B%E7%AF%89)
[Firebaseのセットアップ](https://www.google.com/search?q=%23firebase%E3%81%AE%E3%82%BB%E3%83%83%E3%83%88%E3%82%A2%E3%83%83%E3%83%97)
[テストの実行](https://www.google.com/search?q=%23%E3%83%86%E3%82%B9%E3%83%88%E3%81%AE%E5%AE%9F%E8%A1%8C)
[バックエンドテスト (PHPUnit)](https://www.google.com/search?q=%23%E3%83%90%E3%83%83%E3%82%AF%E3%82%A8%E3%83%B3%E3%83%89%E3%83%86%E3%82%B9%E3%83%88-phpunit)
[フロントエンドテスト (Jest)](https://www.google.com/search?q=%23%E3%83%95%E3%83%AD%E3%83%B3%E3%83%88%E3%82%A8%E3%83%B3%E3%83%89%E3%83%86%E3%82%B9%E3%83%88-jest)
[テストアカウント](https://www.google.com/search?q=%23%E3%83%86%E3%82%B9%E3%83%88%E3%82%A2%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88)
[ER図（参考）](https://www.google.com/search?q=%23er%E5%9B%B3%E5%8F%82%E8%80%83)

主要機能

ユーザー認証: Firebase Authenticationを利用した会員登録、ログイン、ログアウト機能
投稿: テキストメッセージの投稿、表示、削除（本人のみ）
インタラクション: 各投稿への「いいね」機能（登録・解除）、コメント機能
[▲ 目次に戻る](https://www.google.com/search?q=%23%E7%9B%AE%E6%AC%A1)

技術スタック

カテゴリ
技術・サービス
フロントエンド
Next.js, React, TypeScript, Tailwind CSS
バックエンド
Laravel, PHP, MySQL
認証
Firebase Authentication
開発環境
Laravel Sail (Docker)
テスト
Jest, React Testing Library (フロントエンド)<br>PHPUnit (バックエンド)
Google スプレッドシートにエクスポート
[▲ 目次に戻る](https://www.google.com/search?q=%23%E7%9B%AE%E6%AC%A1)

環境構築

本プロジェクトはフロントエンドとバックエンドのリポジトリが分かれていることを想定しています。

1. バックエンド (Laravel) の構築

リポジトリをクローン
Bash
git clone <バックエンドのリポジトリURL>
cd <バックエンドのディレクトリ>

環境変数の設定
Bash
cp .env.example .env

.envファイルを編集し、データベース接続情報とFirebaseの秘密鍵パスを設定
コード スニペット
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=sail
DB_PASSWORD=password
FIREBASE_CREDENTIALS=/var/www/html/path/to/your/firebase_credentials.json

Dockerコンテナを起動
Bash
./vendor/bin/sail up -d

依存パッケージをインストール
Bash
./vendor/bin/sail composer install

アプリケーションキーを生成
Bash
./vendor/bin/sail artisan key:generate

データベースを構築し、テストデータを投入
Bash
./vendor/bin/sail artisan migrate:fresh --seed

バックエンドは http://localhost で起動します。

2. フロントエンド (Next.js) の構築

リポジトリをクローン
Bash
git clone <フロントエンドのリポジトリURL>
cd <フロントエンドのディレクトリ>

依存パッケージをインストール
Bash
npm install

環境変数の設定
Bash
cp .env.local.example .env.local

.env.localファイルを編集し、Firebase設定とバックエンドAPIのURLを設定
コード スニペット
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."

# ... (その他のFirebase設定) ...

NEXT_PUBLIC_API_BASE_URL="http://localhost/api"

開発サーバーを起動
Bash
npm run dev

フロントエンドは http://localhost:3000 で起動します。
[▲ 目次に戻る](https://www.google.com/search?q=%23%E7%9B%AE%E6%AC%A1)

Firebaseのセットアップ

Firebaseプロジェクトの作成
[Firebaseコンソール](https://console.firebase.google.com/)にアクセスし、新しいプロジェクトを作成します。
ウェブアプリの登録
プロジェクト設定からウェブアプリを登録し、表示されるfirebaseConfigオブジェクトの値をフロントエンドの.env.localにコピーします。
Authenticationの有効化
Authenticationサービスへ移動し、「メール/パスワード」によるサインインを有効にします。
サービスアカウント秘密鍵の取得
プロジェクト設定の「サービスアカウント」タブへ移動し、「新しい秘密鍵の生成」をクリックしてJSONファイルをダウンロードします。このファイルをバックエンドプロジェクト内の安全な場所に配置し、そのコンテナ内パスをバックエンドの.envファイルにあるFIREBASE_CREDENTIALSに設定します。
[▲ 目次に戻る](https://www.google.com/search?q=%23%E7%9B%AE%E6%AC%A1)

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

[▲ 目次に戻る](https://www.google.com/search?q=%23%E7%9B%AE%E6%AC%A1)

テストアカウント

シーディングを実行すると、以下のテスト用アカウントが作成されます。
メールアドレス: test@example.com
パスワード: password
[▲ 目次に戻る](https://www.google.com/search?q=%23%E7%9B%AE%E6%AC%A1)

ER図（参考）

本アプリケーションの主要なデータベース構成です。 | テーブル名 | 概要 | | :--------- | :---------------------------------- | | users | ユーザー情報（FirebaseのUIDを含む） | | posts | 投稿内容 | | comments | 投稿へのコメント | | likes | 投稿への「いいね」 |
[▲ 目次に戻る](https://www.google.com/search?q=%23%E7%9B%AE%E6%AC%A1)

以上のものを
以下のように一括コピペできるようにタグ付けし見やすいよう修正していただけますか

# Rese

飲食店予約・口コミ・店舗管理システム

---

## 目次

1. [主要機能](#%E4%B8%BB%E8%A6%81%E6%A9%9F%E8%83%BD)
2. [環境構築](#%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89)
    - [Dockerビルド](#docker%E3%83%93%E3%83%AB%E3%83%89)
    - [Laravel環境構築](#laravel%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89)
    - [メール認証（Mailtrap）](#%E3%83%A1%E3%83%BC%E3%83%AB%E8%AA%8D%E8%A8%BCmailtrap)
3. [テストアカウント](#%E3%83%86%E3%82%B9%E3%83%88%E3%82%A2%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88)
4. [開発環境](#%E9%96%8B%E7%99%BA%E7%92%B0%E5%A2%83)
5. [技術スタック](#%E6%8A%80%E8%A1%93%E3%82%B9%E3%82%BF%E3%83%83%E3%82%AF)
6. [テーブル設計](#%E3%83%86%E3%83%BC%E3%83%96%E3%83%AB%E8%A8%AD%E8%A8%88)
7. [ER図](#er%E5%9B%B3)
8. [口コミ機能](#%E5%8F%A3%E3%82%B3%E3%83%9F%E6%A9%9F%E8%83%BD)
9. [検索・ソート機能](#%E6%A4%9C%E7%B4%A2%E3%82%BD%E3%83%BC%E3%83%88%E6%A9%9F%E8%83%BD)
10. [CSVインポート機能](#csv%E3%82%A4%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%88%E6%A9%9F%E8%83%BD)

---

## 主要機能

- ユーザー登録（Mailtrapによるメール認証）
- 飲食店の検索（地域/ジャンル/店名）・ソート（ランダム/評価順）
- 飲食店の閲覧・予約・お気に入り登録
- 飲食店への口コミ投稿・編集・削除
- 店舗代表者による店舗管理
- 管理者による店舗・口コミ・ユーザー管理
- QRコードによる予約確認表示
- 管理者によるCSVインポートによる店舗一括登録

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

---

## 環境構築

### Dockerビルド

1. `git clone git@github.com:yuji-oonaka/Rese.git`
2. Docker Desktopを起動
3. `docker-compose up -d --build`

### Laravel環境構築

1. `docker-compose exec php bash`
2. `composer install`
3. `cp .env.example .env`
4. `php artisan key:generate`
5. `php artisan migrate`
6. `php artisan db:seed`
7. `php artisan storage:link`

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

---

## メール認証（Mailtrap）

1. [Mailtrap](https://mailtrap.io/)でアカウントを作成しログイン
2. Inboxを作成し、「Integrations」から「Laravel」を選択しSMTP情報を取得
3. `.env`ファイルの`MAIL_MAILER`から`MAIL_ENCRYPTION`までをMailtrapの値に設定
`MAIL_FROM_ADDRESS`は任意のメールアドレスを指定
4. 会員登録後、MailtrapのInboxで認証メールを確認し、メール内リンクから認証を完了

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

---

## テストアカウント

- 一般ユーザー
    - name: 111
    - email: 111@sample.com
    - password: sample111
※または会員登録で任意のユーザーを作成
- 管理者
    - name: admin
    - email: admin@example.com
    - password: password
- 店舗代表者
    - name: 代表者1
    - email: rep1@example.com
    - password: password

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

---

## 開発環境

- アプリケーション: http://localhost
- 会員登録画面: http://localhost/register
- phpMyAdmin: http://localhost:8080

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

---

## 技術スタック

| 技術 | バージョン |
| :-- | :-- |
| PHP | 8.3.7 |
| Laravel | 11.33.2 |
| MySQL | 8.0.26 |
| nginx | - |
| Mailtrap | 最新版 |

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

---

---

## テーブル設計

![スクリーンショット 2025-04-25 121505](https://github.com/user-attachments/assets/b87aca5a-4857-4599-9502-33474ff83beb)

![スクリーンショット 2025-04-25 121514](https://github.com/user-attachments/assets/a7294336-6df4-41c1-bcc7-41bad4175a82)

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

---

## ER図

![attendace drawio (4)](https://github.com/user-attachments/assets/7d74d648-1613-4874-ace9-f49c016ed47a)

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

---

## 口コミ機能

- 口コミは「店舗来店予定日時終了後」から投稿可能です。
- 一般ユーザーは1店舗につき1件のみ口コミ投稿可能
    - 自身の口コミのみ編集・削除可能
- 管理者ユーザーは全ての口コミを削除可能（追加・編集不可）
- 店舗代表者は口コミの追加・編集・削除は不可

|  | 新規口コミ追加 | 口コミ編集 | 口コミ削除 |
| :-- | :--: | :--: | :--: |
| 一般ユーザー | ○（1店舗1件） | ○（自身のみ） | ○（自身のみ） |
| 店舗代表者 | × | × | × |
| 管理者ユーザー | × | × | ○（全件） |

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

---

---

## 検索・ソート機能

### 検索条件

- **地域**：東京都/大阪府/福岡県から選択
- **ジャンル**：寿司/焼肉/イタリアン/居酒屋/ラーメンから選択
- **店名**：部分一致検索（キーワード入力）


### ソートオプション

1. **ランダム表示**
    - 選択する度に店舗の並び順が不規則に変化
2. **評価高い順**
    - 評価平均が高い順に表示（未評価店舗は最後尾）
3. **評価低い順**
    - 評価平均が低い順に表示（未評価店舗は最後尾）

### 評価表示

- 各店舗に評価平均を星評価で表示（例：★4.2）
- 評価数と平均値はページアクセス時にリアルタイム更新
- 新規評価後、リロードなしで即時反映

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

---

## CSVインポート機能

管理者ユーザーは、CSVファイルをインポートすることで新規店舗情報を一括追加できます。
店舗作成ページにてファイルを選択し、内容を確認後インポートできます。
テスト用のCSVファイル（店舗作成用.csv）はプロジェクトディレクトリ直下に作成しています。

### CSVファイルの記述方法

CSVファイルは以下のフォーマットで作成してください（**すべての項目が必須**）。


| 店舗名 | 地域 | ジャンル | 店舗概要 | 画像URL |
| :-- | :-- | :-- | :-- | :-- |
| 寿司太郎 | 東京都 | 寿司 | 新鮮なネタの寿司店です | sushitaro.jpg |
| 焼肉花子 | 大阪府 | 焼肉 | 厳選和牛の焼肉店 | hanako.png |

- 店舗名：50文字以内
- 地域：「東京都」「大阪府」「福岡県」のいずれか
- ジャンル：「寿司」「焼肉」「イタリアン」「居酒屋」「ラーメン」のいずれか
- 店舗概要：400文字以内
- 画像URL：jpg、jpeg、pngのみ対応（非対応拡張子はエラー）

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

承知しました。
以下の形式で「SHARE (仮) - ソーシャルメディア風アプリケーション」のREADMEサンプルを、見やすく・コピペで使いやすいようまとめ直します。
**例示されたレイアウト／目次方式を忠実に再現し、Markdownとして一括コピペ可能**です。
ご利用環境にあわせてURLなどご調整ください。

# SHARE (仮)

ソーシャルメディア風アプリケーション

短いメッセージを投稿・共有できるシンプルなSNS風アプリです。
フロントエンド：Next.js、バックエンド：Laravel、認証：Firebase を採用。

## 目次

1. [主要機能](#%E4%B8%BB%E8%A6%81%E6%A9%9F%E8%83%BD)
2. [環境構築](#%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89)
    - [バックエンド (Laravel)](#%E3%83%90%E3%83%83%E3%82%AF%E3%82%A8%E3%83%B3%E3%83%89-laravel)
    - [フロントエンド (Nextjs)](#%E3%83%95%E3%83%AD%E3%83%B3%E3%83%88%E3%82%A8%E3%83%B3%E3%83%89-nextjs)
    - [Firebaseのセットアップ](#firebase%E3%81%AE%E3%82%BB%E3%83%83%E3%83%88%E3%82%A2%E3%83%83%E3%83%97)
3. [テストの実行](#%E3%83%86%E3%82%B9%E3%83%88%E3%81%AE%E5%AE%9F%E8%A1%8C)
    - [バックエンドテスト (PHPUnit)](#%E3%83%90%E3%83%83%E3%82%AF%E3%82%A8%E3%83%B3%E3%83%89%E3%83%86%E3%82%B9%E3%83%88-phpunit)
    - [フロントエンドテスト (Jest)](#%E3%83%95%E3%83%AD%E3%83%B3%E3%83%88%E3%82%A8%E3%83%B3%E3%83%89%E3%83%86%E3%82%B9%E3%83%88-jest)
4. [テストアカウント](#%E3%83%86%E3%82%B9%E3%83%88%E3%82%A2%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88)
5. [開発環境](#%E9%96%8B%E7%99%BA%E7%92%B0%E5%A2%83)
6. [技術スタック](#%E6%8A%80%E8%A1%93%E3%82%B9%E3%82%BF%E3%83%83%E3%82%AF)
7. [ER図](#er%E5%9B%B3)

## 主要機能

- **ユーザー認証**
Firebase Authentication による新規登録／ログイン／ログアウト
- **投稿**
テキストメッセージの投稿・一覧表示・削除（本人のみ）
- **インタラクション**
投稿への「いいね」（登録／解除）、コメント

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

## 環境構築

### バックエンド (Laravel)

```sh
# 1. リポジトリをクローン
git clone <バックエンドのリポジトリURL>
cd <バックエンドのディレクトリ>

# 2. 環境変数ファイルを作成
cp .env.example .env

# 3. .env を編集（DB, Firebase等）
# DB_CONNECTION=mysql
# DB_HOST=mysql
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=sail
# DB_PASSWORD=password
# FIREBASE_CREDENTIALS=/var/www/html/path/to/firebase_credentials.json

# 4. Dockerコンテナ起動
./vendor/bin/sail up -d

# 5. 依存パッケージインストール
./vendor/bin/sail composer install

# 6. アプリケーションキー生成
./vendor/bin/sail artisan key:generate

# 7. DB初期化・テストデータ投入
./vendor/bin/sail artisan migrate:fresh --seed
```

- バックエンドは http://localhost で動作

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

### フロントエンド (Nextjs)

```sh
# 1. リポジトリをクローン
git clone <フロントエンドのリポジトリURL>
cd <フロントエンドのディレクトリ>

# 2. 依存パッケージインストール
npm install

# 3. 環境変数ファイル作成
cp .env.local.example .env.local

# 4. .env.local編集（Firebase, APIエンドポイント等）
# NEXT_PUBLIC_FIREBASE_API_KEY="..."
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
# ...（その他Firebase設定）...
# NEXT_PUBLIC_API_BASE_URL="http://localhost/api"

# 5. 開発サーバー起動
npm run dev
```

- フロントエンドは http://localhost:3000 で動作

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

### Firebaseのセットアップ

1. **Firebaseプロジェクトを作成**
[Firebaseコンソール](https://console.firebase.google.com/)で新規プロジェクト作成
2. **ウェブアプリ登録**
設定画面よりWebアプリ追加 → firebaseConfigを.env.localへ貼付
3. **Authentication有効化**
「メール／パスワード」方式を有効化
4. **サービスアカウント秘密鍵取得**
プロジェクト設定＞「サービスアカウント」→「新しい秘密鍵の生成」でJSON取得
バックエンド内の安全な場所へ配置し、.env の `FIREBASE_CREDENTIALS` へパスを設定

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

## テストの実行

### バックエンドテスト (PHPUnit)

```sh
# バックエンドのディレクトリにて
./vendor/bin/sail artisan test
```

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

### フロントエンドテスト (Jest)

```sh
# フロントエンドのディレクトリにて
npm test
```

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

## テストアカウント

Seeder実行時に作成されるテスト用ログイン情報です。

- email: `test@example.com`
- password: `password`

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

## 開発環境

- バックエンド: http://localhost
- フロントエンド: http://localhost:3000
- DB管理: （必要があればphpMyAdmin などご記載ください）

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

## 技術スタック

| カテゴリ | 技術・サービス |
| :-- | :-- |
| フロント | Next.js, React, TypeScript, Tailwind CSS |
| バックエンド | Laravel, PHP, MySQL |
| 認証 | Firebase Authentication |
| 開発環境 | Laravel Sail (Docker) |
| テスト | Jest, React Testing Library, PHPUnit |

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

## ER図

本アプリケーション主なテーブル構成


| テーブル名 | 概要 |
| :-- | :-- |
| users | ユーザー情報(Firebase UID含) |
| posts | 投稿内容 |
| comments | 投稿へのコメント |
| likes | 投稿への「いいね」 |

[目次に戻る](#%E7%9B%AE%E6%AC%A1)

**ご質問や加筆希望はいつでもお知らせください。**

<div style="text-align: center">⁂</div>

[^1]: https://www.google.com/search?q=%23主要機能

