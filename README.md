# 地域コミュニティイベント管理アプリ

## セットアップ手順

### 準備・前提条件

#### 動作環境
- Node.js v18 以上 
- npm または yarn 
- Firebase プロジェクト（無料プラン可） 
- 任意のブラウザ（Google Chrome 推奨）

#### 必要なアカウント・権限
- **Firebase アカウント** 
  - Firebase Authentication（Email/Password 認証）を有効化 
  - Firestore Database を作成（テストモードまたは適切なルール設定） 
- **Zapier アカウント（任意）** 
  - 「その他・ヘルプ」カテゴリの「ご質問」板への投稿を通知するために使用 

### 起動手順

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
2. 依存関係のインストール
   ```
   npm install
   ```
3. Firebase設定ファイルの追加
   ```
   import { initializeApp } from "firebase/app";
   import { getFirestore } from "firebase/firestore";
   import { getAuth } from "firebase/auth";
   
   const firebaseConfig = {
     apiKey: "xxxx",
     authDomain: "xxxx.firebaseapp.com",
     projectId: "xxxx",
     storageBucket: "xxxx.appspot.com",
     messagingSenderId: "xxxx",
     appId: "xxxx"
   };
   
   const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   export const auth = getAuth(app);
   ```
4. ローカル開発サーバの起動
   ```
   npm start
   ```

## 使用技術・ライブラリ

| カテゴリ      | 使用技術                                |
| --------- | ----------------------------------- |
| フロントエンド   | React + Vite                        |
| スタイリング    | Tailwind CSS                        |
| 認証・データベース | Firebase Authentication / Firestore |
| 状態管理      | React Context API                   |
| 通知連携      | Zapier（Firebase → Gmailなど）          |
| デプロイ（任意）  | Firebase Hosting / Vercel           |


## 実装機能の説明

### ユーザー認証

- Firebase Authentication による Email/Password ログイン／サインアップ
- ログアウト機能あり

### 掲示板構造

- カテゴリ（例：「一般」「技術」「イベント」「その他・ヘルプ」）
- 各カテゴリ内にユーザー作成可能な板（Board）
- 各板内に投稿（Message）を保存

### 投稿機能

- 投稿本文・投稿者名・投稿日時を Firestore に保存
- URL 自動リンク化
- 投稿削除（投稿者本人のみ可）

### 検索・フィルタ機能

- クライアントサイドでのキーワード検索
- 投稿者名・本文・日付範囲によるフィルタ

### 管理者通知（Zapier連携）

- 「その他・ヘルプ」カテゴリの「ご質問」板に投稿があるとメール通知
- Zapier によるポーリング方式（5〜15分間隔）
- 通知の ON/OFF を Zapier 側の変数で制御可能


## 動作確認方法

1. ローカルでサーバを起動後、トップページで新規登録／ログインを実施。
2. 板一覧から任意のカテゴリに新しい板を作成。
3. 板に入り、メッセージを投稿。
4. 投稿の自動リンク化・削除・検索動作を確認。
5. （管理者のみ）Zapier 経由でのメール通知を確認。
