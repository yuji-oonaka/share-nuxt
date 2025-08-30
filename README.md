***

# SHARE (Nuxt.js版) - ソーシャルメディア風アプリケーション

短いメッセージを投稿・共有できる、シンプルなSNS風アプリケーションです。  
**学習目的**として、フロントエンド（Nuxt.js）とバックエンド（Laravel API）の統合開発を行い、  
ユーザー認証には Firebase Authentication を採用しています。

***

## 目次

1. [主要機能](#主要機能)  
2. [技術スタック](#技術スタック)  
3. [ディレクトリ構成](#ディレクトリ構成)  
4. [環境構築](#環境構築)  
5. [サーバー起動コマンド](#サーバー起動コマンド)  
6. [テストの実行](#テストの実行)  
7. [ER図（参考）](#er図参考)  

***

## 主要機能

- **ユーザー認証**: Firebase Authenticationを利用した会員登録、ログイン、ログアウト機能  
- **投稿**: テキストメッセージの投稿、一覧表示、削除（本人のみ）  
- **インタラクション**: 各投稿への「いいね」登録・解除、コメント投稿・一覧表示  

[▲ 目次に戻る](#目次)

***

## 技術スタック

| カテゴリ     | 技術・サービス |
|:------------|:---------------|
| **フロントエンド** | Nuxt.js, Vue.js, TypeScript, Tailwind CSS |
| **状態管理** | Pinia |
| **フォーム** | VeeValidate |
| **バックエンド** | Laravel, PHP, MySQL |
| **認証** | Firebase Authentication |
| **開発環境** | Laravel Sail (Docker) |
| **テスト** | Vitest, Vue Test Utils（フロントエンド）<br>PHPUnit（バックエンド） |

[▲ 目次に戻る](#目次)

***

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

***

## 環境構築

### 前提条件

- Git
- Docker Desktop
- Node.js (v18以上推奨)
- Firebaseアカウント

### 実行手順

#### ステップ1：Firebaseの準備

1. **Firebaseプロジェクトの作成**: [Firebaseコンソール](https://console.firebase.google.com/)で新規プロジェクトを作成  
2. **Authenticationの有効化**: 「メール／パスワード」認証を有効化  
3. **Webアプリの登録とAPIキーの取得**: プロジェクト設定からWebアプリを登録し、`firebaseConfig`の値を取得  
4. **サービスアカウント秘密鍵の取得**: 「サービスアカウント」から新しい秘密鍵を生成し、JSONファイルをダウンロード  

***

#### ステップ2：リポジトリのクローンと移動

```bash
git clone git@github.com:yuji-oonaka/share-nuxt.git
cd share-nuxt
```

***

#### ステップ3：セットアップスクリプトの実行

```bash
chmod +x setup.sh
./setup.sh
```

***

#### ステップ4：環境変数の設定

- **バックエンド (`backend/.env`)**  
環境変数（`COMPOSE_PROJECT_NAME`, `APP_NAME`, `FIREBASE_PROJECT_ID`など）を設定  
サービスアカウントの秘密鍵は `firebase_credentials.json` にリネームし、`backend/storage/app/` に配置  

- **フロントエンド (`frontend/.env`)**  
Firebase Webアプリ用のAPIキー（`NUXT_PUBLIC_...`）を設定  

***

#### ステップ5：開発の開始

バックエンドサーバーは `setup.sh` 実行時に起動済みです。  

```bash
cd frontend
npm run dev
```

ブラウザで [http://localhost:3000/register](http://localhost:3000/register) を開き、アカウントを新規登録してください。  
これで初回の環境構築は完了です。 🎉

[▲ 目次に戻る](#目次)

***

## サーバー起動コマンド

2回目以降の開発再開時は以下を実行してください。

- **バックエンドサーバー**
```bash
cd backend
sail up -d
```

- **フロントエンドサーバー**
```bash
cd frontend
npm run dev
```

[▲ 目次に戻る](#目次)

***

## テストの実行

### バックエンドテスト (PHPUnit)

```bash
cd backend
sail artisan test
```

### フロントエンドテスト (Vitest)

```bash
cd frontend
npm test
```

- **コンポーネントテスト**: propsの描画やユーザー操作によるイベント発火を検証  
- **ストアテスト**: API通信をモック化し、アクションが正しくStateを更新するか検証  

[▲ 目次に戻る](#目次)

## ER図

<img width="661" height="571" alt="share drawio" src="https://github.com/user-attachments/assets/1ff205f0-5729-4193-98f6-c1db04039c28" />


| テーブル名 | 概要 |
|:-----------|:-----|
| **users**  | ユーザー情報（FirebaseのUIDを含む） |
| **posts**  | 投稿内容 |
| **comments** | 投稿へのコメント |
| **likes**    | 投稿への「いいね」 |

[▲ 目次に戻る](#目次)

***
