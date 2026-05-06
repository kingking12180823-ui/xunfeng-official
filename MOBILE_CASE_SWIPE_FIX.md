# 手機版案例實績滑動修正

本補丁只更新：

- css/style.css
- js/cms-render.js

修正內容：

- 案例卡片改為真正橫向 flex 輪播
- 手機支援左右滑動
- 啟用 scroll-snap
- 加入 Facebook 內建瀏覽器的 pointer drag fallback
- 不覆蓋 content/ 後台資料

部署方式：

1. 解壓縮本 ZIP。
2. 到 GitHub repository：kingking12180823-ui/xunfeng-official。
3. Add file → Upload files。
4. 上傳解壓後的 css/、js/ 與本說明檔。
5. Commit changes。
6. 等 Cloudflare Pages 自動部署。
7. 手機打開 cases.html，左右滑動案例卡片。
