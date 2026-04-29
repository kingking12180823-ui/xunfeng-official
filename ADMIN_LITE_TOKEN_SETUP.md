# 巽風官網後台 Lite：GitHub Token 直改版

這一版不用 Decap / Netlify OAuth，因此不會再跳出 api.netlify.com Not Found。

## 後台入口

https://你的網域/admin/

## 使用前要做一次：建立 GitHub Fine-grained Token

1. 到 GitHub 右上角頭像
2. Settings
3. Developer settings
4. Personal access tokens
5. Fine-grained tokens
6. Generate new token

建議設定：

- Token name：xunfeng-admin
- Expiration：建議 90 days 或 1 year
- Repository access：Only select repositories
- 選：xunfeng-official

Repository permissions：

- Contents：Read and write
- Metadata：Read-only（通常預設）

產生 token 後，複製起來。GitHub 只會顯示一次。

## 後台使用方式

1. 打開 /admin/
2. Repo 保持：kingking12180823-ui/xunfeng-official
3. Branch 保持：main
4. 貼上 GitHub Token
5. 按「連線讀取內容」
6. 修改內容
7. 按「發布本頁」
8. Cloudflare Pages 會自動部署

## 安全提醒

Token 不會寫入網站檔案，只存在目前瀏覽器 sessionStorage。
但這仍然是管理權限，請不要把 token 傳給別人。
若外洩，請回 GitHub 刪除該 token 並重建。

## 可編輯內容

- 網站設定：content/site.json
- 服務價格：content/services.json
- 案例實績：content/cases.json
- 課程講座：content/courses.json
- 照片輪播：content/photos.json
