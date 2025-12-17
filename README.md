# Google Calendar Free Time Finder

Googleカレンダーの予定を確認し、空いている時間を見つけるWebアプリケーションです。

## 機能

- Google OAuth 2.0でログイン（カレンダー読み取り権限のみ）
- 指定期間の予定を取得
- 空き時間を自動計算
- 勤務時間帯の指定
- 最小空き時間のフィルタリング
- タイムゾーン対応（DST対応）
- 日付ごとにグループ化された空き時間表示
- ワンクリックで空き時間をコピー

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **認証**: Google OAuth 2.0
- **API**: Google Calendar API v3
- **日時処理**: Luxon（タイムゾーン・DST対応）
- **テスト**: Jest

## 主要設計判断

### 1. FreeBusy API vs Events.list

**採用: FreeBusy API**

理由:
- **効率性**: 空き時間判定に最適化されており、必要なデータのみ取得
- **パフォーマンス**: イベントの詳細情報が不要なため通信量が少ない
- **プライバシー**: イベントのタイトルや説明を取得せず、busy/free状態のみ取得
- **複数カレンダー対応**: 1回のAPIコールで複数カレンダーを確認可能

### 2. トークン保持方式

**採用: httpOnly Cookie（開発環境向け簡易実装）**

現在の実装:
- httpOnlyフラグでXSS攻撃を防御
- Base64エンコーディング（開発用）
- セッションベースの認証

本番環境での推奨:
```typescript
// 推奨: AES-256-GCMによる暗号化
// 推奨: データベース（Redis/PostgreSQL）でセッション管理
// 推奨: CSRF保護の実装
```

理由:
- 開発の簡略化（追加インフラ不要）
- XSS攻撃からの保護
- 自動的なCookie送信

### 3. タイムゾーン処理

**採用: Luxon**

理由:
- DST（夏時間）を自動で処理
- IANAタイムゾーンデータベースを使用
- 日時の変換・フォーマットが直感的
- 不変オブジェクトで安全

### 4. 空き時間計算アルゴリズム

実装詳細:
1. busy区間をマージ（重複・隣接を統合）
2. 各日の勤務時間帯を算出
3. busy区間と勤務時間帯の積集合を計算
4. 空き区間を抽出
5. 最小空き時間でフィルタリング

## セットアップ

### 1. Google Cloud Console 設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新規プロジェクトを作成
3. 「APIとサービス」→「有効なAPIとサービス」→「APIを有効にする」
4. 「Google Calendar API」を検索して有効化
5. 「認証情報」→「認証情報を作成」→「OAuth クライアント ID」
6. 「OAuth同意画面」を設定
   - ユーザータイプ: 外部
   - アプリ名: Google Calendar Free Time Finder
   - スコープの追加:
     - `https://www.googleapis.com/auth/calendar.readonly`
     - `https://www.googleapis.com/auth/userinfo.email`
7. 「認証情報」→「認証情報を作成」→「OAuth クライアント ID」
   - アプリケーションの種類: ウェブアプリケーション
   - 承認済みのリダイレクトURI: `http://localhost:3000/api/auth/callback`
8. クライアントIDとクライアントシークレットをコピー

### 2. ローカル環境構築

```bash
# リポジトリをクローン
git clone <repository-url>
cd google-calendar-free-time

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env.local

# .env.localを編集（Google Cloud Consoleから取得した値を設定）
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback

# 開発サーバーを起動
npm run dev
```

### 3. アクセス

ブラウザで `http://localhost:3000` を開く

## 使い方

1. **ログイン**: 「Googleでサインイン」をクリック
2. **権限の承認**: カレンダー読み取り権限を許可
3. **検索条件を入力**:
   - カレンダー: 確認したいカレンダーを選択
   - 開始日・終了日: 確認したい期間
   - 勤務時間: 空き時間を探す時間帯（例: 09:00〜18:00）
   - 最小空き時間: 表示する最小の空き時間（分）
   - タイムゾーン: 日時表示のタイムゾーン
4. **検索**: 「空き時間を検索」をクリック
5. **結果確認**: 日付ごとにグループ化された空き時間を確認
6. **コピー**: 「コピー」ボタンで空き時間をクリップボードにコピー

## テスト

```bash
# ユニットテストを実行
npm test

# ウォッチモードでテスト
npm run test:watch
```

テスト内容:
- 空き時間計算ロジック
  - busy区間がない場合
  - busy区間が勤務時間内に存在する場合
  - busy区間が重複する場合
  - 最小空き時間のフィルタリング
  - 勤務時間外のbusy区間の処理
  - 複数日の処理
  - 全busy時の処理
  - 連続busy区間の処理

## プロジェクト構造

```
.
├── app/
│   ├── api/
│   │   ├── auth/           # 認証エンドポイント
│   │   │   ├── login/      # OAuth開始
│   │   │   ├── callback/   # OAuthコールバック
│   │   │   ├── logout/     # ログアウト
│   │   │   └── session/    # セッション確認
│   │   ├── calendars/      # カレンダーリスト取得
│   │   └── free-time/      # 空き時間計算
│   ├── login/              # ログインページ
│   ├── app/                # メインアプリページ
│   ├── layout.tsx          # ルートレイアウト
│   └── globals.css         # グローバルスタイル
├── lib/
│   ├── google-auth.ts      # Google OAuth実装
│   ├── calendar-client.ts  # Calendar API クライアント
│   ├── free-time-calculator.ts  # 空き時間計算ロジック
│   ├── session.ts          # セッション管理
│   └── __tests__/          # ユニットテスト
├── types/
│   └── calendar.ts         # 型定義
└── package.json
```

## 環境変数

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `GOOGLE_CLIENT_ID` | OAuth 2.0 クライアントID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 クライアントシークレット | `xxx` |
| `GOOGLE_REDIRECT_URI` | OAuth 2.0 リダイレクトURI | `http://localhost:3000/api/auth/callback` |
| `NEXT_PUBLIC_BASE_URL` | アプリケーションのベースURL（オプション） | `http://localhost:3000` |

## 権限（Scope）

このアプリケーションは以下の最小権限のみを要求します:

- `https://www.googleapis.com/auth/calendar.readonly`: カレンダーの読み取り
- `https://www.googleapis.com/auth/userinfo.email`: ユーザーのメールアドレス取得

**重要**: 書き込み権限は一切要求しません。

## セキュリティ考慮事項

### 現在の実装（開発環境向け）
- httpOnly Cookieでトークン保存
- Base64エンコーディング（暗号化ではない）
- HTTPS推奨（本番環境）

### 本番環境への移行時の推奨事項
1. **トークン暗号化**: AES-256-GCMでトークンを暗号化
2. **セッションストア**: Redis/PostgreSQLでセッション管理
3. **CSRF保護**: CSRFトークンの実装
4. **Cookie設定**:
   ```typescript
   secure: true,  // HTTPS のみ
   sameSite: 'strict',  // CSRF 保護
   ```
5. **レート制限**: APIエンドポイントにレート制限を設定
6. **監査ログ**: 認証・認可イベントのログ記録

## トラブルシューティング

### ログインできない

- Google Cloud Consoleで正しいリダイレクトURIが設定されているか確認
- `.env.local`のクライアントIDとシークレットが正しいか確認
- OAuth同意画面が正しく設定されているか確認

### 空き時間が表示されない

- 指定した期間に実際に予定があるか確認
- 勤務時間帯が適切に設定されているか確認
- 最小空き時間が大きすぎないか確認

### タイムゾーンがおかしい

- ブラウザのタイムゾーン設定を確認
- 検索条件のタイムゾーン選択を確認

## ライセンス

MIT

## 貢献

Issue・PRを歓迎します。

## 作者

Google Calendar Free Time Finder Development Team
