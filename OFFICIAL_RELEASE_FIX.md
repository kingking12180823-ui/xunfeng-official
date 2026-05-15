# 巽風官網正式上線修補包

本補丁目的：
1. 移除前台「管理版」字樣。
2. 移除預約頁可見的 Formspree 工程字樣。
3. 先將 AI 分身入口導向站內 ai.html，避免客戶直接點到失效 GPT 連結而看到 404。
4. 新增 ai.html，讓客戶可先走 LINE 或表單預約。
5. 修改 js/cms-render.js：若 content/site.json 仍是舊 GPT 連結，系統會自動導到 ai.html；未來後台換成新的可公開 GPT 連結後，會自動改用新連結。
6. 更新 sitemap.xml。

上傳方式：
- 解壓縮本 ZIP。
- 到 GitHub repository：kingking12180823-ui/xunfeng-official。
- Add file → Upload files。
- 將解壓後所有檔案拖上去。
- Commit message：Official frontend release fix
- Commit directly to main branch。
- 等 Cloudflare Pages 自動部署 30–90 秒。
- 前台 Ctrl+F5 強制刷新。

注意：
本補丁不包含 content/ 資料夾，不會覆蓋你後台目前的服務價格、案例、課程與照片資料。
