# 巽風官網｜前台正式對客版修正

本版已完成：

- 前台導覽列移除「後台」
- Footer 移除「網站後台」
- 首頁移除「可從 /admin 修改」等工程字樣
- 服務頁移除 content/services.json、後台修改等工程字樣
- 預約頁移除 Formspree 後台、endpoint 等工程字樣
- 案例頁、課程頁移除 CMS / JSON / 後台提示
- /admin 仍保留後台功能，但不再從前台公開導覽
- robots.txt 已禁止搜尋引擎索引 /admin/
- admin/index.html 加上 noindex,nofollow

部署方式：
把本資料夾內容上傳覆蓋 GitHub repository：kingking12180823-ui/xunfeng-official
Cloudflare Pages 會自動重新部署。
