---

# SHARE (Nuxt.js版) - ソーシャルメディア風アプリケーション

<img width="1904" height="908" alt="スクリーンショット 2025-09-16 111357" src="https://github.com/user-attachments/assets/6d845f75-4c85-4c22-b442-e3ec8ca78bab" />

<img width="1910" height="911" alt="スクリーンショット 2025-09-16 111442" src="https://github.com/user-attachments/assets/97b0fa4a-043d-4332-bf7c-57935cff1e3d" />

短いメッセージを投稿・共有できる、シンプルなSNS風アプリケーションです。
**学習目的**として、フロントエンド（Nuxt.js）とバックエンド（Laravel API）の統合開発を行い、
ユーザー認証には Firebase Authentication を採用しています。

---

## 目次

1. [主要機能](#主要機能)
2. [技術スタック](#技術スタック)
3. [ディレクトリ構成](#ディレクトリ構成)
4. [環境構築](#環境構築)
5. [サーバー起動コマンド](#サーバー起動コマンド)
6. [テストの実行](#テストの実行)
7. [ER図](#er図)

---

## 主要機能

* **ユーザー認証**: Firebase Authenticationを利用した会員登録、ログイン、ログアウト機能
* **投稿**: テキストメッセージの投稿、一覧表示、削除（本人のみ）
* **インタラクション**: 各投稿への「いいね」登録・解除、コメント投稿・一覧表示

[▲ 目次に戻る](#目次)

---

## 技術スタック

| カテゴリ        | 技術・サービス                                            |
| :---------- | :------------------------------------------------- |
| **フロントエンド** | Nuxt.js, Vue.js, TypeScript, Tailwind CSS          |
| **状態管理**    | Pinia                                              |
| **フォーム**    | VeeValidate                                        |
| **バックエンド**  | Laravel, PHP, MySQL                                |
| **認証**      | Firebase Authentication                            |
| **開発環境**    | Laravel Sail (Docker)                              |
| **テスト**     | Vitest, Vue Test Utils（フロントエンド）<br>PHPUnit（バックエンド） |

[▲ 目次に戻る](#目次)

---

## ディレクトリ構成

本プロジェクトは `frontend` と `backend` を一つのリポジトリで管理するモノレポ構成です。

```
share-nuxt/
├── backend/              # Laravel (バックエンド)
│   ├── .env.example      # バックエンド設定のテンプレート
│   └── docker-compose.yml
│
├── frontend/             # Nuxt.js (フロントエンド)
│   ├── app/              # Nuxt3の主要なコード
│   ├── public/           # 画像などの静的ファイル
│   └── .env.example      # フロントエンド設定のテンプレート
│
├── README.md
└── setup.sh              # 自動環境構築スクリプト
```

[▲ 目次に戻る](#目次)

---

## 環境構築

### 前提条件

このプロジェクトを動かすには、お使いのコンピュータに以下のソフトウェアがインストールされている必要があります。

* **Git**: ソースコードをクローンするために必要です。
* **Docker Desktop**: `Laravel Sail`を動かすための必須ツールです。
* **Node.js と npm**: フロントエンドの開発環境を整えるために必要です。

### 動作環境

| 項目                          | バージョン / 補足                                        |
| :-------------------------- | :------------------------------------------------ |
| **Node.js / npm**           | Node.js v22.18.0 / npm v10.9.3                    |
| **Docker / Docker Compose** | Docker v28.3.3 / Docker Compose v2.39.2-desktop.1 |
| **PHP (Laravel Sail)**      | PHP 8.3 コンテナ内                                     |
| **MySQL (Sailコンテナ)**        | MySQL 8.0                                         |
| **アクセスURL**              | [http://localhost:3000](http://localhost:3000)   |
| **Firebaseアカウント**           | Webアプリ用 API キーを使用                                 |


> 上記環境で `setup.sh` を実行し、フロントエンド・バックエンドともに動作確認済みです。

### 実行手順

#### ステップ1：Firebaseの準備

1. **Firebaseプロジェクトの作成**: [Firebaseコンソール](https://console.firebase.google.com/)で新規プロジェクトを作成
2. **Authenticationの有効化**: 「メール／パスワード」認証を有効化
3. **Webアプリの登録とAPIキーの取得**: プロジェクト設定からWebアプリを登録し、`firebaseConfig`の値を取得
4. **サービスアカウント秘密鍵の取得**: 「サービスアカウント」から新しい秘密鍵を生成し、JSONファイルをダウンロード

---

#### ステップ2：リポジトリのクローンと移動

```bash
git clone git@github.com:yuji-oonaka/share-nuxt.git
cd share-nuxt
```

---

#### ステップ3：セットアップスクリプトの実行

```bash
chmod +x setup.sh
./setup.sh
```

#### `setup.sh` が行う処理

* **バックエンド（Laravel）**

  * `.env.example` をコピーして `.env` を作成
  * Composer パッケージのインストール
  * Sail コンテナのビルド＆起動
  * アプリケーションキーの生成
  * DBマイグレーション実行 & シーディング

* **フロントエンド（Nuxt.js）**

  * npm パッケージのインストール
  * `.env.example` をコピーして `.env` を作成

---

#### ステップ4：環境変数の設定

* **バックエンド (`backend/.env`)**

   `.env` を編集してください。  

  必須:
  - `FIREBASE_PROJECT_ID` = Firebase プロジェクトのID  
  - Firebase コンソールから取得したサービスアカウント秘密鍵を  
    `firebase_credentials.json` にリネームし、`backend/storage/app/` に配置  
    （`.env` の `FIREBASE_CREDENTIALS=storage/app/firebase_credentials.json` と一致させる）

  任意（必要に応じて変更）:
  - `COMPOSE_PROJECT_NAME` = Docker Compose プロジェクト名（デフォルト: share-nuxt）  
  - `APP_NAME` = アプリ名（ログや通知で利用）  
  - その他の DB・Redis・メール設定は `.env.example` のままでローカル動作可  

---

* **フロントエンド (`frontend/.env`)**

  `.env` を編集してください。  

  必須（Firebase Web アプリの設定値を入力）:
  - `NUXT_PUBLIC_FIREBASE_API_KEY`  
  - `NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN`  
  - `NUXT_PUBLIC_FIREBASE_PROJECT_ID`  
  - `NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET`  
  - `NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`  
  - `NUXT_PUBLIC_FIREBASE_APP_ID`  

  必須（バックエンドAPIとの接続用）:
  - `NUXT_PUBLIC_API_BASE_URL="http://localhost/api"`

- Firebase の値は Firebase コンソールの「プロジェクト設定 > 全般 > Firebase SDK snippet (構成)」からコピーできます。

#### ステップ5：開発の開始

バックエンドサーバーは `setup.sh` 実行時に起動済みです。

```bash
cd frontend
npm run dev
```

ブラウザで [http://localhost:3000/register](http://localhost:3000/register) を開き、アカウントを新規登録してください。
これで初回の環境構築は完了です。

[▲ 目次に戻る](#目次)

---

## サーバー起動コマンド

2回目以降の開発再開時は以下を実行してください。

* **バックエンドサーバー**

```bash
cd backend
./vendor/bin/sail up -d
```

* **フロントエンドサーバー**

```bash
cd frontend
npm run dev
```

[▲ 目次に戻る](#目次)

---

## テストの実行

### バックエンドテスト (PHPUnit)

```bash
cd backend
./vendor/bin/sail artisan test
```

### フロントエンドテスト (Vitest)

```bash
cd frontend
npm test
```

* **コンポーネントテスト**: propsの描画やユーザー操作によるイベント発火を検証
* **ストアテスト**: API通信をモック化し、アクションが正しくStateを更新するか検証

[▲ 目次に戻る](#目次)

---

## ER図

<img width="661" height="571" alt="share drawio" src="https://github.com/user-attachments/assets/1ff205f0-5729-4193-98f6-c1db04039c28" />

| テーブル名        | 概要                      |
| :----------- | :---------------------- |
| **users**    | ユーザー情報（FirebaseのUIDを含む） |
| **posts**    | 投稿内容                    |
| **comments** | 投稿へのコメント                |
| **likes**    | 投稿への「いいね」               |

### テーブル間の関係

* users 1 --- n posts
* posts 1 --- n comments
* users n --- n posts （likes中間テーブル）

[▲ 目次に戻る](#目次)

---
