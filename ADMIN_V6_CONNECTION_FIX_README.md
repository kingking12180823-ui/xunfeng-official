# 巽風後台 V6 連線修補包

判斷：
GitHub 顯示新 Token「全新未使用」，代表後台沒有真正送出 GitHub API 請求。
本包修正：
1. admin/index.html 改成 app.js?v=6，破除瀏覽器舊快取。
2. admin/app.js 增加明確連線狀態。
3. 按「連線讀取內容」後，狀態列會顯示：
   - 已按下連線
   - Repo 與 Token 格式通過
   - 正在讀取 GitHub content/*.json
4. 401 / 403 / 404 會顯示白話錯誤原因。
5. 強化按鈕事件綁定，避免按鈕沒反應。

上傳方式：
1. 解壓縮本 ZIP。
2. 進入解壓後資料夾。
3. Ctrl + A 全選 admin 資料夾與 README。
4. 到 GitHub repo 根目錄 → Add file → Upload files。
5. 拖入全部項目。
6. Commit message 填：
   Fix admin GitHub connection
7. Commit directly to main branch。
8. 等 Cloudflare Pages 自動部署 30–90 秒。
9. 用這個網址進後台：
   https://xunfeng-official-cms.pages.dev/admin/?v=6
10. 先按 Ctrl + F5，再貼新的 Token，按「連線讀取內容」。

安全提醒：
你剛剛截圖中露出部分 Token。測試完成後，建議刪除 xunfeng-admin-v3，再重新產生正式營運用 Token。
