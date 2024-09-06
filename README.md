# [ePunch 點點班 | 線上打卡](https://project-epunch-fodrlfxf6-angelc1997s-projects.vercel.app/)

ePunch 點點班提供手機、平板、電腦等裝置線上上下班打卡機制。

# 目錄

- [功能說明](#功能說明)
- [技術架構](#技術架構)
- [專案說明](#專案說明)

# 功能說明

-

# 技術架構

- 前端框架：React、Next.js、TypeScript、Tailwind
- 後端串接：Firebase
- 資料庫：Firestore
- 部署：Vercel
- 版本控制：GitHub
- 其他：Shadcn/ui 元件

# 專案說明

該專案使用 [Next.js](https://nextjs.org/) 框架，並透過 [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) 快速建立專案架構。

## 專案建置

### 快速開始

需要使用 [Node.js](https://nodejs.org/en) 執行腳本命令，並使用 `npm` 下載及管理所需套件。

同時註記開發時所使用的版本號

➡️ Node.js：v20.11.1

```bash
node -v
```

➡️ git：2.43.0.windows.1

```bash
git -v

```

### 建立專案架構

➡️ 建立 next 專案

```bash
npx create-next-app@latest
```

### GitHub 版本控制

➡️ 連接 Gihub 進行版本控制，同時創建 develop 分支進行開發

以 main 來取代原本的 master

```bash
git branch -M main
```

連接遠端 Github

```bash
git remote add origin https://github.com/angelc1997/project-epunch.git
```

推送至正式版本

```bash
git push -u origin main
```

以 develop 分支進行程式碼開發與更新

```bash
git branch develop
```

### 啟動伺服器

使用瀏覽器開啟 [`http://localhost:3000`](http://localhost:3000)

```bash
npm run dev
```

### 環境變數設定

➡️ 使用 `.env.local` 設置 Firebase

- API_KEY
- AUTH_DOMAIN

### 安裝其他項目

➡️ firebase

```bash
npm i firebase

```

### 使用 Vercel 自動部署

- 連接 GitHub 帳戶
- 選擇部署 Repo 以及使用框架
- 添加環境變數
