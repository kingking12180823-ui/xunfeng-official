# 巽風後台 V7 修補包：修正後台不能動

根因：
V6 的 admin/app.js 內有一個 JavaScript 語法錯誤：
uploadFile() 的 body 裡少了一個逗號，導致整支 app.js 無法執行。
所以畫面會停在「後台程式載入中」，按「連線讀取內容」完全沒反應。

本版修正：
1. 修正 admin/app.js 語法錯誤。
2. admin/index.html 改為讀取 app.js?v=7，避免瀏覽器快取舊版。
3. 成功載入後，左下狀態會顯示：
   V7 後台程式已載入。請貼上 GitHub Token 後按「連線讀取內容」。

上傳方式：
1. 解壓縮本 ZIP。
2. 進入解壓後資料夾。
3. Ctrl + A 全選。
4. 到 GitHub repository 根目錄：
   kingking12180823-ui/xunfeng-official
5. Add file → Upload files。
6. 拖入全部項目。
7. Commit message 填：
   Fix admin app syntax error
8. 選 Commit directly to main branch。
9. 按 Commit changes。
10. 等 Cloudflare Pages 部署 30–90 秒。
11. 開：
   https://xunfeng-official-cms.pages.dev/admin/?v=7
12. 按 Ctrl + F5。
13. 貼 GitHub Token。
14. 按「連線讀取內容」。

驗收：
- 上方「後台程式載入中」提示會消失。
- 左下狀態會顯示 V7 後台程式已載入。
- 按「連線讀取內容」後會開始讀取 GitHub content/*.json。
