# 掌訣班核心修補包（小檔版）

這包是給目前「已上傳但前台沒出現掌訣班」的修補版。

問題判斷：
- GitHub 顯示 content/admin/assets 已更新。
- 但 css/js 沒更新，所以前台沒有渲染掌訣班。
- 影片檔大於 GitHub 網頁上傳限制，先不要上傳影片。

上傳方式：
1. 解壓縮本 ZIP。
2. 進入解壓後資料夾。
3. Ctrl + A 全選裡面的檔案與資料夾。
4. 到 GitHub repo 根目錄 → Add file → Upload files。
5. 拖入全部項目。
6. Commit message：Fix palm course promo core files
7. Commit directly to main branch。
8. 等 Cloudflare Pages 部署 30–90 秒。
9. 開：
   https://xunfeng-official-cms.pages.dev/courses.html?refresh=1

本包不含 MP4 影片，先讓前台招生區正常出現。
影片建議下一步改用 YouTube / Google Drive / Facebook 連結嵌入，不要直接塞 GitHub。
