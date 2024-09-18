 <img src="https://github.com/user-attachments/assets/eca797b0-1580-4109-9936-68a8b9329213" width="100" />

# [ePunch 點點班 | 線上打卡](https://project-epunch.vercel.app/)

ePunch點點班提供手機、平板、電腦
等裝置線上上下班打卡機制。

# 目錄

- [產品展示](#產品展示)
- [功能說明](#功能說明)
- [技術架構](#技術架構)
- [安裝使用](#安裝使用)
- [專案說明](#專案說明)


# 產品展示

ePunch導入響應式網頁設計(Responsive Web Design)，能夠在不同裝置上呈現最佳化的介面大小和布局
![ePunch-rwd](https://github.com/user-attachments/assets/5f4bd3eb-3aaa-4ddf-94d3-9a5a8b0aea68)

### 管理員功能

管理員介面提供簡易的操作說明，包含如何新增員工、開啟定位等相關功能設定
![image](https://github.com/user-attachments/assets/73be31a8-e5a1-480b-9763-25fc4874e49c)

管理員可進入「員工」介面新增、編輯、刪除員工
![image](https://github.com/user-attachments/assets/c111d53c-b4c8-4b16-a002-960815cfac73)

ePunch同時提供一週排班功能，對每位員工上班時間進行安排、提醒
![image](https://github.com/user-attachments/assets/2c478e7b-4cfc-441c-a900-bee16c78c63f)


### 員工功能

員工上下班打卡功能，可接受當日多次打卡以及跨日打卡紀錄
![image](https://github.com/user-attachments/assets/3cceaeb5-7ac5-4b8c-ad89-d9510fc82c32)

員工每日上下班時間打卡紀錄，僅接受紀錄，不接受編輯修改
![image](https://github.com/user-attachments/assets/aa976828-3d69-4416-8878-1651fa1661d5)

員工一週上下班時間以及休假日
![image](https://github.com/user-attachments/assets/c1ed8baa-aabb-4dda-88e0-929647594d4e)

員工個人請假申請及記錄，可透過審核狀態確認假單的進度
![image](https://github.com/user-attachments/assets/e8818b5f-757c-4817-923a-0b49f60b5c79)

員工請假功能表單，提供事假、病假、特休、公出、補打卡五種類型請假項目
![image](https://github.com/user-attachments/assets/a6270c14-ad3b-4d6f-b520-e0dd0b1b4775)

假單審核僅主管級員工可使用，透過接受以及拒絕按鈕快速審核員工假單
![image](https://github.com/user-attachments/assets/a8996254-cc52-437b-926d-65975bc18429)


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

