# SHARE (仮) - ソーシャルメディア風アプリケーション

短いメッセージを投稿・共有するための、シンプルなSNS風アプリケーションです。フロントエンドはNext.js、バックエンドはLaravelで構築され、認証にはFirebaseを利用しています。

## 目次

1.  [主要機能](https://www.google.com/search?q=%23%E4%B8%BB%E8%A6%81%E6%A9%9F%E8%83%BD)
2.  [技術スタック](https://www.google.com/search?q=%23%E6%8A%80%E8%A1%93%E3%82%B9%E3%82%BF%E3%83%83%E3%82%AF)
3.  [環境構築](https://www.google.com/search?q=%23%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89)
      - [バックエンド (Laravel)](https://www.google.com/search?q=%231-%E3%83%90%E3%83%83%E3%82%AF%E3%82%A8%E3%83%B3%E3%83%89-laravel-%E3%81%AE%E6%A7%8B%E7%AF%89)
      - [フロントエンド (Next.js)](https://www.google.com/search?q=%232-%E3%83%95%E3%83%AD%E3%83%B3%E3%83%88%E3%82%A8%E3%83%B3%E3%83%89-nextjs-%E3%81%AE%E6%A7%8B%E7%AF%89)
4.  [Firebaseのセットアップ](https://www.google.com/search?q=%23firebase%E3%81%AE%E3%82%BB%E3%83%83%E3%83%88%E3%82%A2%E3%83%83%E3%83%97)
5.  [テストの実行](https://www.google.com/search?q=%23%E3%83%86%E3%82%B9%E3%83%88%E3%81%AE%E5%AE%9F%E8%A1%8C)
      - [バックエンドテスト (PHPUnit)](https://www.google.com/search?q=%23%E3%83%90%E3%83%83%E3%82%AF%E3%82%A8%E3%83%B3%E3%83%89%E3%83%86%E3%82%B9%E3%83%88-phpunit)
      - [フロントエンドテスト (Jest)](https://www.google.com/search?q=%23%E3%83%95%E3%83%AD%E3%83%B3%E3%83%88%E3%82%A8%E3%83%B3%E3%83%89%E3%83%86%E3%82%B9%E3%83%88-jest)
6.  [テストアカウント](https://www.google.com/search?q=%23%E3%83%86%E3%82%B9%E3%83%88%E3%82%A2%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88)
7.  [ER図（参考）](https://www.google.com/search?q=%23er%E5%9B%B3%E5%8F%82%E8%80%83)

-----

## 主要機能

  - **ユーザー認証**: Firebase Authenticationを利用した会員登録、ログイン、ログアウト機能
  - **投稿**: テキストメッセージの投稿、表示、削除（本人のみ）
  - **インタラクション**: 各投稿への「いいね」機能（登録・解除）、コメント機能

[▲ 目次に戻る](https://www.google.com/search?q=%23%E7%9B%AE%E6%AC%A1)

-----

## 技術スタック

| カテゴリ         | 技術・サービス                               |
| :--------------- | :------------------------------------------- |
| **フロントエンド** | Next.js, React, TypeScript, Tailwind CSS     |
| **バックエンド** | Laravel, PHP, MySQL                        |
| **認証** | Firebase Authentication                      |
| **開発環境** | Laravel Sail (Docker)                        |
| **テスト** | Jest, React Testing Library (フロントエンド)\<br\>PHPUnit (バックエンド) |

[▲ 目次に戻る](https://www.google.com/search?q=%23%E7%9B%AE%E6%AC%A1)

-----

## 環境構築

本プロジェクトはフロントエンドとバックエンドのリポジトリが分かれていることを想定しています。

### 1\. バックエンド (Laravel) の構築

1.  リポジトリをクローン
    ```bash
    git clone <バックエンドのリポジトリURL>
    cd <バックエンドのディレクトリ>
    ```
2.  環境変数の設定
    ```bash
    cp .env.example .env
    ```
3.  `.env`ファイルを編集し、データベース接続情報とFirebaseの秘密鍵パスを設定
    ```env
    DB_CONNECTION=mysql
    DB_HOST=mysql
    DB_PORT=3306
    DB_DATABASE=laravel
    DB_USERNAME=sail
    DB_PASSWORD=password
    FIREBASE_CREDENTIALS=/var/www/html/path/to/your/firebase_credentials.json
    ```
4.  Dockerコンテナを起動
    ```bash
    ./vendor/bin/sail up -d
    ```
5.  依存パッケージをインストール
    ```bash
    ./vendor/bin/sail composer install
    ```
6.  アプリケーションキーを生成
    ```bash
    ./vendor/bin/sail artisan key:generate
    ```
7.  データベースを構築し、テストデータを投入
    ```bash
    ./vendor/bin/sail artisan migrate:fresh --seed
    ```

> バックエンドは `http://localhost` で起動します。

### 2\. フロントエンド (Next.js) の構築

1.  リポジトリをクローン
    ```bash
    git clone <フロントエンドのリポジトリURL>
    cd <フロントエンドのディレクトリ>
    ```
2.  依存パッケージをインストール
    ```bash
    npm install
    ```
3.  環境変数の設定
    ```bash
    cp .env.local.example .env.local
    ```
4.  `.env.local`ファイルを編集し、Firebase設定とバックエンドAPIのURLを設定
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY="..."
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
    # ... (その他のFirebase設定) ...
    NEXT_PUBLIC_API_BASE_URL="http://localhost/api"
    ```
5.  開発サーバーを起動
    ```bash
    npm run dev
    ```

> フロントエンドは `http://localhost:3000` で起動します。

[▲ 目次に戻る](https://www.google.com/search?q=%23%E7%9B%AE%E6%AC%A1)

-----

## Firebaseのセットアップ

1.  **Firebaseプロジェクトの作成**
      - [Firebaseコンソール](https://console.firebase.google.com/)にアクセスし、新しいプロジェクトを作成します。
2.  **ウェブアプリの登録**
      - プロジェクト設定からウェブアプリを登録し、表示される`firebaseConfig`オブジェクトの値をフロントエンドの`.env.local`にコピーします。
3.  **Authenticationの有効化**
      - Authenticationサービスへ移動し、「メール/パスワード」によるサインインを有効にします。
4.  **サービスアカウント秘密鍵の取得**
      - プロジェクト設定の「サービスアカウント」タブへ移動し、「新しい秘密鍵の生成」をクリックしてJSONファイルをダウンロードします。このファイルをバックエンドプロジェクト内の安全な場所に配置し、その**コンテナ内パス**をバックエンドの`.env`ファイルにある`FIREBASE_CREDENTIALS`に設定します。

[▲ 目次に戻る](https://www.google.com/search?q=%23%E7%9B%AE%E6%AC%A1)

-----

## テストの実行

### バックエンドテスト (PHPUnit)

バックエンドのAPIが正しく機能するかをテストします。

```bash
# バックエンドのディレクトリで実行
./vendor/bin/sail artisan test
```

### フロントエンドテスト (Jest)

フロントエンドのコンポーネントが正しく表示・動作するかをテストします。

```bash
# フロントエンドのディレクトリで実行
npm test
```

[▲ 目次に戻る](https://www.google.com/search?q=%23%E7%9B%AE%E6%AC%A1)

-----

## テストアカウント

シーディングを実行すると、以下のテスト用アカウントが作成されます。

  - **メールアドレス**: `test@example.com`
  - **パスワード**: `password`

[▲ 目次に戻る](https://www.google.com/search?q=%23%E7%9B%AE%E6%AC%A1)

-----

## ER図（参考）

本アプリケーションの主要なデータベース構成です。
| テーブル名 | 概要                                |
| :--------- | :---------------------------------- |
| `users`    | ユーザー情報（FirebaseのUIDを含む） |
| `posts`    | 投稿内容                            |
| `comments` | 投稿へのコメント                    |
| `likes`    | 投稿への「いいね」                  |

[▲ 目次に戻る](https://www.google.com/search?q=%23%E7%9B%AE%E6%AC%A1)
