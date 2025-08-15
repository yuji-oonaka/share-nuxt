# SHARE (仮) - ソーシャルメディア風アプリケーション

短いメッセージを投稿・共有するための、シンプルなSNS風アプリケーションです。フロントエンドはNext.js、バックエンドはLaravelで構築され、認証にはFirebaseを利用しています。

## 目次

1.  [主要機能](#主要機能)
2.  [技術スタック](#技術スタック)
3.  [環境構築](#環境構築)
4.  [Firebaseのセットアップ](#firebaseのセットアップ)
5.  [テストの実行](#テストの実行)
6.  [テストアカウント](#テストアカウント)
7.  [ER図（参考）](#er図参考)

---

## 主要機能

- **ユーザー認証**: Firebase Authenticationを利用した会員登録、ログイン、ログアウト機能
- **投稿**: テキストメッセージの投稿、表示、削除（本人のみ）
- **インタラクション**: 各投稿への「いいね」機能（登録・解除）、コメント機能

[▲ 目次に戻る](#目次)

---

## 技術スタック

| カテゴリ | 技術・サービス |
| :--- | :--- |
| **フロントエンド** | Next.js, React, TypeScript, Tailwind CSS |
| **バックエンド** | Laravel, PHP, MySQL |
| **認証** | Firebase Authentication |
| **開発環境** | Laravel Sail (Docker) |
| **テスト** | Jest, React Testing Library (フロントエンド)<br>PHPUnit (バックエンド) |

[▲ 目次に戻る](#目次)

---

## 環境構築

### 前提条件

環境構築を始める前に、お使いのPCに以下のソフトウェアがインストールされていることを確認してください。

- Git
- Docker Desktop
- Node.js (v18以上)

> **Windowsユーザーの方へ**
> `setup.sh`スクリプトを実行するには、Git BashやWSL (Windows Subsystem for Linux) のようなUnix系のターミナル環境が必要です。

### 実行手順

1.  **リポジトリのクローン**

    ```bash
    git clone git@github.com:yuji-oonaka/my-sns-app.git
    cd my-sns-app
    ```

2.  **セットアップスクリプトの実行**
    以下のコマンドで、バックエンドとフロントエンドの環境構築を一括で実行します。

    ```bash
    # スクリプトに実行権限を付与
    chmod +x setup.sh

    # スクリプトを実行
    ./setup.sh
    ```

3.  **環境変数の編集**
    スクリプトによって`backend/.env`と`frontend/.env.local`が作成されます。これらのファイルを開き、**Firebaseの各種キー**など、あなたの環境に合わせた設定値を追記・編集してください。（詳細は次の「Firebaseのセットアップ」を参照）

4.  **開発サーバーの起動**
    環境構築が完了したら、`frontend`ディレクトリに移動して開発サーバーを起動します。

    ```bash
    cd frontend
    npm run dev
    ```

> フロントエンドは `http://localhost:3000` で、バックエンドは `http://localhost` で起動しています。

[▲ 目次に戻る](#目次)

---

## Firebaseのセットアップ

1.  **Firebaseプロジェクトの作成**: [Firebaseコンソール](https://console.firebase.google.com/)にアクセスし、新しいプロジェクトを作成します。
2.  **ウェブアプリの登録**: プロジェクト設定からウェブアプリを登録し、表示される`firebaseConfig`オブジェクトの値を`frontend/.env.local`にコピーします。（キーの先頭は`NEXT_PUBLIC_`にしてください）
3.  **Authenticationの有効化**: Authenticationサービスへ移動し、「メール/パスワード」によるサインインを有効にします。
4.  **サービスアカウント秘密鍵の取得**: 
    - プロジェクト設定の「サービスアカウント」タブへ移動し、「新しい秘密鍵の生成」をクリックしてJSONファイルをダウンロードします。
    - ダウンロードしたファイルを**`firebase_credentials.json`**にリネームします。
    - リネームしたファイルを**`backend/storage/app/`**ディレクトリの中に配置します。
    - `backend/.env`ファイルの`FIREBASE_CREDENTIALS`の値が`storage/app/firebase_credentials.json`になっていることを確認します。

[▲ 目次に戻る](#目次)

-----

## テストの実行

### バックエンドテスト (PHPUnit)

`backend`ディレクトリ内で以下のコマンドを実行します。

```bash
sail artisan test
```

### フロントエンドテスト (Jest)

`frontend`ディレクトリ内で以下のコマンドを実行します。

```bash
npm test
```

[▲ 目次に戻る](#目次)

-----

## テストアカウント

シーディングを実行すると、以下のテスト用アカウントが作成されます。

  - **メールアドレス**: `test@example.com`
  - **パスワード**: `password`

[▲ 目次に戻る](#目次)

-----

## ER図（参考）

本アプリケーションの主要なデータベース構成です。
| テーブル名 | 概要                                |
| :--------- | :---------------------------------- |
| `users`    | ユーザー情報（FirebaseのUIDを含む） |
| `posts`    | 投稿内容                            |
| `comments` | 投稿へのコメント                    |
| `likes`    | 投稿への「いいね」                  |

[▲ 目次に戻る](#目次)
