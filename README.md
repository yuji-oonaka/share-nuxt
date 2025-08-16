# SHARE (仮) - ソーシャルメディア風アプリケーション

短いメッセージを投稿・共有するための、シンプルなSNS風アプリケーションです。  
フロントエンドは**Next.js**、バックエンドは**Laravel**で構築され、認証には**Firebase**を利用しています。

***

## 目次

1. [主要機能](#主要機能)
2. [技術スタック](#技術スタック)
3. [環境構築](#環境構築)
4. [テストの実行](#テストの実行)
5. [ER図（参考）](#er図参考)

***

## 主要機能

- **ユーザー認証**  
  Firebase Authenticationを利用した会員登録、ログイン、ログアウト機能

- **投稿**  
  テキストメッセージの投稿・表示・削除（本人のみ）

- **インタラクション**  
  各投稿への「いいね」機能（登録・解除）、コメント機能

[▲ 目次に戻る](#目次)

***

## 技術スタック

| カテゴリ        | 技術・サービス                                        |
|:---------------|:------------------------------------------------------|
| **フロントエンド** | Next.js, React, TypeScript, Tailwind CSS           |
| **バックエンド**   | Laravel, PHP, MySQL                                 |
| **認証**         | Firebase Authentication                              |
| **開発環境**     | Laravel Sail (Docker)                                |
| **テスト**       | Jest, React Testing Library（フロントエンド）PHPUnit（バックエンド） |

[▲ 目次に戻る](#目次)

***

## 環境構築

### 前提条件

- Git
- Docker Desktop
- Node.js (v18以上)
- Firebaseアカウント

### 実行手順

環境構築は、以下の流れで進めます。

#### ステップ1：Firebaseの準備

1. **Firebaseプロジェクトの作成**  
   [Firebaseコンソール](https://console.firebase.google.com/)にアクセスして新規プロジェクトを作成する

2. **Authenticationの有効化**  
   プロジェクトのAuthenticationサービスから「メール／パスワード」サインインを有効化

3. **ウェブアプリの登録とAPIキーの取得**  
   プロジェクト設定からウェブアプリ登録  
   `firebaseConfig` オブジェクト（`apiKey`など）を取得しメモしておく

4. **サービスアカウント秘密鍵の取得**  
   プロジェクト設定 > サービスアカウント > 「新しい秘密鍵の生成」よりJSONファイルをダウンロード

***

#### ステップ2：リポジトリのクローンと移動

```bash
git clone git@github.com:yuji-oonaka/my-sns-app.git
cd my-sns-app
```

***

#### ステップ3：セットアップスクリプトの実行

Docker環境の構築と必要なパッケージのインストールを自動化します。  
このスクリプトで `backend/.env` と `frontend/.env.local` の雛形ファイルも自動作成されます。

```bash
chmod +x setup.sh
./setup.sh
```

***

#### ステップ4：環境変数の設定

1. `backend/.env` と `frontend/.env.local` を開き、ステップ1で取得したFirebaseキー等を設定

2. サービスアカウントの秘密鍵（JSONファイル）を `firebase_credentials.json` にリネームし、  
   `backend/storage/app/` フォルダに配置

**backend/.env（例）**

```env
FIREBASE_PROJECT_ID=あなたのFirebaseプロジェクトID
FIREBASE_STORAGE_BUCKET=あなたのストレージバケット名
FIREBASE_API_KEY=あなたのAPIキー
...
```

**frontend/.env.local（例）**

```env
NEXT_PUBLIC_FIREBASE_API_KEY=あなたのFirebase APIキー
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=あなたのAuthドメイン
NEXT_PUBLIC_FIREBASE_PROJECT_ID=あなたのプロジェクトID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=あなたのストレージバケット名
...
```

---

### ステップ5：最初のテストアカウント作成

セットアップスクリプトが完了し、全てのサーバーが起動しています。

ブラウザで`http://localhost:3000/register`にアクセスし、**あなた自身のテスト用アカウントを新規登録してください**。

これで、初回の環境構築は全て完了です！

[▲ 目次に戻る](#目次)

---

## 毎日の開発フロー

PCをシャットダウンしたり、時間を置いて開発を再開したりする場合の手順です。

1.  **バックエンドサーバーを起動します。**
    ```bash
    cd backend
    ./vendor/bin/sail up -d
    ```

2.  **フロントエンド開発サーバーを起動します。**
    ```bash
    cd ../frontend
    npm run dev
    ```

[▲ 目次に戻る](#目次)

---

## テストの実行

### バックエンドテスト（PHPUnit）

```bash
cd backend
./vendor/bin/sail artisan test
```

### フロントエンドテスト（Jest）

```bash
cd frontend
npm test
```

[▲ 目次に戻る](#目次)

***

## ER図（参考）

本アプリケーションの主要データベース構成

| テーブル名 | 概要                                 |
|:-----------|:-------------------------------------|
| users      | ユーザー情報（FirebaseのUIDを含む）  |
| posts      | 投稿内容                             |
| comments   | 投稿へのコメント                     |
| likes      | 投稿への「いいね」                   |

[▲ 目次に戻る](#目次)

---
