# { Rilume } Dashboard

{ Rilume} の管理用ダッシュボードです

## 主な機能

- **ログイン認証**  
  管理者のみがダッシュボードにアクセス可能  
   未ログイン時はログインページを表示

- **サーバー管理**  
  参加サーバーの一覧表示・詳細情報・管理操作(退出・設定変更等)

- **各種管理ページ**
  - サーバー一覧
  - ブラックリスト管理
  - サーバー情報表示
  - ランダム選曲管理
  - サーバー設定

## 技術スタック

- Next.js 15
- React 19
- TypeScript
- ESLint
- CSS Modules

## ディレクトリ構成

```
app/
	api/              ... APIルート
	dashboard/        ... ダッシュボード各ページ
	page.tsx          ... ログイン
components/         ... UIコンポーネント
css/                ... スタイル（CSS Modules）
public/             ... 画像
```

## 開発・起動方法

```bash
npm install
npm run dev
```

http://localhost:3000 でアクセスできます。
