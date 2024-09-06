# [ePunch 點點班 | 線上打卡](https://project-epunch-fodrlfxf6-angelc1997s-projects.vercel.app/)

ePunch 點點班提供手機、平板、電腦等裝置線上上下班打卡機制。

# 目錄

- [功能說明](#功能說明)
- [技術架構](#技術架構)
- [安裝使用](#安裝使用)
- [專案說明](#專案說明)

# 功能說明

- 會員系統：支援管理員以及使用者兩種角色，使用者又可新增為主管或是員工
- 打卡功能：
  - 提供當日多次以及跨日上下班打卡
  - 管理員可設置開啟或關閉定位打卡限制
- 請假功能：提供員工申請以及主管審核流程
- 排班功能：管理員可創建排班時段小卡，用於安排員工上下班時間

# 技術架構

- 前端框架：React、Next.js、TypeScript
- CSS UI：Tailwind CSS、Shadcn/ui 元件
- 後端串接：Firebase
- 資料庫：Firestore
- 部署：Vercel
- 版本控制：GitHub

# 安裝使用

1. 複製專案

```bash
git clone https://github.com/angelc1997/project-epunch.git

```

2. 安裝依賴套件

```bash
npm install
```

3. 設置環境變數

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
```

4. 啟動專案

```bash
npm run dev
```

### 啟動伺服器

使用瀏覽器開啟 [`http://localhost:3000`](http://localhost:3000)

# 專案說明

ePunch 專案使用 [Next.js](https://nextjs.org/) 框架，並透過 [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) 快速建立專案架構。

## 開發環境

- Node.js: v20.11.1
- Git: 2.43.0.windows.1

## 版本控制

專案使用 GitHub 進行版本控制，分支包含：

- main：推送正式版本
- develop：開發分支

## 部署

專案使用 Vercel 進行自動部署

1. 連接 GitHub
2. 使用 ePunch GitHub Repo
3. 設置環境變數
