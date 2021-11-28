# 台灣巴士懶人包

## 作品說明

第三屆 The F2E 前端 & UI 修煉精神時光屋 團體組作品。
提供即時地圖瀏覽、快速查詢當前地點或指定地點之公車與客運動資訊。

## 系統說明

專案運行: `yarn; yarn build; yarn serve` \
開發模式: `yarn; yarn dev` \
Node.js版本: 16.12 \
備註: `.env` 的 `VITE_APP_GOOGLE_MAP_API_KEY` 為網域專屬憑證，開發或測試需替換個人的 Google Map 憑證 \

## 資料夾說明

- src:
  - api: 查詢API / 定義類別
  - assets: 資源檔
  - components: 共用組件
  - plugins: 自定義插件
  - router: 路由設定
  - store: 共用狀態設定
  - style: 共用Sass
  - view: 頁面組件

## 使用技術

- Vite
- Vue3
- Sass/SCSS
- Axios

## 第三方服務

- Google Map API
- 國土測繪圖資網路地圖服務 開放 API

## 程式簡述

由於三週的內容都放在此專案中，許多格式與架構是沿用的。

主要核心內容可分為三個部分

- API與資料整合：沿用客制axios共通的寫法，於自訂類別中歸納。(`src/api`,`src/store`)
- 頁面與組件顯示：Vue組件架構，部分使用Vue3新語法。(`src/components`, `src/views`)
- 設計架構同步：字級, 顏色, 間距與設計同步。(`src/style`)

## 團隊介紹

組名：十字元
組員：

- [JayWu / 前端工程師](https://2021.thef2e.com/users/6296427084285739988)
- [Yang_ / 前端工程師](https://2021.thef2e.com/users/6296427084285739989)
- [paul / UI設計師](https://2021.thef2e.com/users/6296432819610583224)
- [UUna / 其他](https://2021.thef2e.com/users/6296432819610584003)
