都道府県別の総人口推移グラフを表示するアプリケーション
デプロイ先: https://prefectures-population-delta.vercel.app/

## 技術スタック

- Node v22
- React v19
- Next.js v15.1.6 App Router
- Styling: TailwindCSS 4.0
- Linter/formatter: ESLint/ Prettier
- テスト：Vitest(単体)/Playwrigth（e2e）

## Getting Started

1. まず、Nodeのv22をインストールしてください（参考: https://nodejs.org/en/download）。

2. バージョン 1.2 以上の bun をインストールしてください：

```bash
# Linux/macOSでインストール
curl -fsSL https://bun.sh/install | bash

# Windowsでインストール
powershell -c "irm bun.sh/install.ps1 | iex"

# すでに bun をインストールしている場合はアップグレード
bun upgrade
```

3. .env.exampleを参考にし、.envファイルを作成してください。API_KEYとAPI_URLをhttps://yumemi-frontend-engineer-codecheck-api.vercel.app/api-docの値に設定してくだい。

## 開発サーバーを起動する

```bash
bun dev
```

## テストを実行する

```bash
bun run test
```
