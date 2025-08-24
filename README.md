-----

# SHARE (Nuxt.js版) - ソーシャルメディア風アプリケーション

短いメッセージを投稿・共有するための、シンプルなSNS風アプリケーションです。
フロントエンドは**Nuxt.js (Vue.js)**、バックエンドは**Laravel**で構築され、認証には**Firebase**を利用しています。

-----

## 目次

1.  [主要機能](https://www.google.com/search?q=%23%E4%B8%BB%E8%A6%81%E6%A9%9F%E8%83%BD)
2.  [技術スタック](https://www.google.com/search?q=%23%E6%8A%80%E8%A1%93%E3%82%B9%E3%82%BF%E3%83%83%E3%82%AF)
3.  [ディレクトリ構成](https://www.google.com/search?q=%23%E3%83%87%E3%82%A3%E3%83%AC%E3%82%AF%E3%83%88%E3%83%AA%E6%A7%8B%E6%88%90)
4.  [環境構築](https://www.google.com/search?q=%23%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89)
5.  [毎日の開発フロー](https://www.google.com/search?q=%23%E6%AF%8E%E6%97%A5%E3%81%AE%E9%96%8B%E7%99%BA%E3%83%95%E3%83%AD%E3%83%BC)
6.  [テストの実行](https://www.google.com/search?q=%23%E3%83%86%E3%82%B9%E3%83%88%E3%81%AE%E5%AE%9F%E8%A1%8C)
7.  [ER図（参考）](https://www.google.com/search?q=%23er%E5%9B%B3%E5%8F%82%E8%80%83)

-----

## 主要機能

  - **ユーザー認証**
    Firebase Authenticationを利用した会員登録、ログイン、ログアウト機能

  - **投稿**
    テキストメッセージの投稿・表示・削除（本人のみ）

  - **インタラクション**
    各投稿への「いいね」機能（登録・解除）、コメント機能

[▲ 目次に戻る](https://www.google.com/search?q=%23%E7%9B%AE%E6%AC%A1)

-----

## 技術スタック

| カテゴリ | 技術・サービス |
| :--- | :--- |
| **フロントエンド** | **Nuxt.js (v4), Vue.js (v3), TypeScript, Tailwind CSS** |
| **状態管理** | **Pinia** |
| **フォーム** | **VeeValidate** |
| **バックエンド** | Laravel, PHP, MySQL |
| **認証** | Firebase Authentication |
| **開発環境** | Laravel Sail (Docker) |
| **テスト** | **Vitest, Vue Test Utils**（フロントエンド）, PHPUnit（バックエンド） |

[▲ 目次に戻る](https://www.google.com/search?q=%23%E7%9B%AE%E6%AC%A1)

-----

## ディレクトリ構成

本プロジェクトは`frontend`と`backend`を一つのリポジトリで管理するモノレポ構成です。

```
share-nuxt/
├── backend/            # Laravel (バックエンド)
├── frontend/           # Nuxt.js (フロントエンド)
│   ├── app/
│   ├── public/
│   ├── .env.example    # フロントエンド設定のテンプレート
│   ├── vitest.config.ts  # Vitest設定ファイル
│   └── vitest.setup.ts   # Vitestグローバルセットアップ
│
├── .gitignore
├── README.md
└── setup.sh            # 自動環境構築スクリプト
```

[▲ 目次に戻る](https://www.google.com/search?q=%23%E7%9B%AE%E6%AC%A1)

-----

## 環境構築

### 前提条件

  - Git
  - Docker Desktop
  - Node.js (v18以上)
  - Firebaseアカウント

### 実行手順

#### ステップ1：Firebaseの準備

1.  **Firebaseプロジェクトの作成**
    [Firebaseコンソール](https://console.firebase.google.com/)にアクセスして新規プロジェクトを作成します。

2.  **Authenticationの有効化**
    プロジェクトのAuthenticationサービスから「メール／パスワード」サインインを有効化します。

3.  **ウェブアプリの登録とAPIキーの取得**
    プロジェクト設定からウェブアプリを登録し、表示される`firebaseConfig`オブジェクト（`apiKey`など）の値をメモしておきます。

4.  **サービスアカウント秘密鍵の取得**
    プロジェクト設定 \> サービスアカウント \> 「新しい秘密鍵の生成」よりJSONファイルをダウンロードします。

-----

#### ステップ2：リポジトリのクローン

```bash
git clone git@github.com:yuji-oonaka/share-nuxt.git
cd share-nuxt
```

-----

#### ステップ3：環境変数の設定

1.  **バックエンド**
    `backend/.env.example`を`backend/.env`にコピーします。`.env`ファイルを開き、FirebaseのプロジェクトIDなどを設定してください。

2.  **フロントエンド**
    `frontend/.env.example`を`frontend/.env`にコピーします。`.env`ファイルを開き、ステップ1でメモしたWebアプリのAPIキー等を設定します。

3.  **サービスアカウント秘密鍵の配置**
    ステップ1でダウンロードした秘密鍵（JSONファイル）を`firebase_credentials.json`にリネームし、`backend/storage/app/`ディレクトリに配置します。

**frontend/.env（例）**

```env
# Nuxtがブラウザ側に公開する環境変数には接頭辞 NUXT_PUBLIC_ が必要
NUXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NUXT_PUBLIC_FIREBASE_API_KEY=あなたのFirebase APIキー
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=あなたのAuthドメイン
NUXT_PUBLIC_FIREBASE_PROJECT_ID=あなたのプロジェクトID
...
```

-----

#### ステップ4：セットアップスクリプトの実行

Docker環境の構築と必要なパッケージのインストールを自動化します。

```bash
chmod +x setup.sh
./setup.sh
```

-----

#### ステップ5：開発サーバーの起動とアカウント作成

スクリプト完了後、各サーバーを起動します。

1.  **バックエンドサーバーを起動**
    ```bash
    # backendディレクトリで実行
    ./vendor/bin/sail up -d
    ```
2.  **フロントエンド開発サーバーを起動**
    ```bash
    # frontendディレクトリで実行
    npm run dev
    ```
3.  **テストアカウント作成**
    ブラウザで`http://localhost:3000/register`にアクセスし、テスト用アカウントを新規登録してください。

これで環境構築は完了です！

[▲ 目次に戻る](https://www.google.com/search?q=%23%E7%9B%AE%E6%AC%A1)

-----

## 毎日の開発フロー

開発を再開する際の手順です。

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

[▲ 目次に戻る](https://www.google.com/search?q=%23%E7%9B%AE%E6%AC%A1)

-----

## テストの実行

### バックエンドテスト（PHPUnit）

```bash
cd backend
./vendor/bin/sail artisan test
```

### フロントエンドテスト（Vitest）

```bash
cd frontend
npm test
```

#### フロントエンドのテストについて

本プロジェクトのフロントエンドテストは、Nuxtの\*\*自動インポート（Auto-imports）\*\*機能を考慮した設定になっています。

  - **`vitest.config.ts`**: Vitestの基本設定ファイルです。`vite-tsconfig-paths`プラグインを使い、`~`のようなパスエイリアスを解決しています。
  - **`vitest.setup.ts`**: すべてのテストが実行される**前**に読み込まれるグローバルセットアップファイルです。ここには、テスト環境に存在しないNuxtのグローバル関数（`defineNuxtRouteMiddleware`など）やグローバル変数（`process.client`）のモックを定義しています。

この設定により、コンポーネントやストア、コンポーザブルをNuxtの実行環境から切り離し、\*\*単体（ユニット）\*\*としてテストすることが可能になっています。

[▲ 目次に戻る](https://www.google.com/search?q=%23%E7%9B%AE%E6%AC%A1)

-----

## ER図（参考）

| テーブル名 | 概要 |
| :--- | :--- |
| users | ユーザー情報（FirebaseのUIDを含む） |
| posts | 投稿内容 |
| comments | 投稿へのコメント |
| likes | 投稿への「いいね」 |

[▲ 目次に戻る](https://www.google.com/search?q=%23%E7%9B%AE%E6%AC%A1)
