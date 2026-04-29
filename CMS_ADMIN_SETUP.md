已改用 ADMIN_LITE_TOKEN_SETUP.md 的 GitHub Token 直改版，不再使用 Decap / Netlify OAuth。\n\n# 巽風官網後台版使用說明

## 這一版增加了什麼

已新增：

- /admin 後台
- admin/config.yml
- content/site.json
- content/services.json
- content/cases.json
- content/courses.json
- content/photos.json
- js/cms-render.js

未來可在後台修改：

- 首頁主標
- 聯絡資訊
- AI 分身連結
- LINE / Facebook
- Formspree endpoint
- 服務價格
- 案例內容
- 課程講座
- 服務照片輪播
- SEO 文字

## 重要提醒

/admin 要真正登入，需要 GitHub Repository。

請建立 GitHub repo，例如：

xunfeng-official

然後打開：

admin/config.yml

把：

repo: YOUR_GITHUB_USERNAME/xunfeng-official

改成你的 GitHub 帳號與 repo 名稱，例如：

repo: kingking12180823/xunfeng-official

## 新部署流程

1. 建 GitHub repo
2. 上傳這包網站
3. Cloudflare Pages 改成連 GitHub
4. 修改 admin/config.yml 的 repo
5. 重新部署
6. 打開 https://你的網域/admin
7. 登入 GitHub
8. 直接在後台改內容
9. 按 Publish
10. Cloudflare 自動更新網站

## Formspree

目前表單已接：

https://formspree.io/f/mkokdvwk

若日後更換 Formspree endpoint，可從後台「網站基本設定」修改。
