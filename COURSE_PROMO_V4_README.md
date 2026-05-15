# 掌訣班 V4 強制清除前台排開海報版

用途：
目前前台仍看到下方三張排開海報，表示 V2 的 courses/css/js 有殘留。
本版會強制做到：
1. 前台只保留上方主輪播。
2. 下方三張排開海報一律隱藏／移除。
3. 後台仍保留「輪播海報 1、2、3」抽換功能。
4. 輪播維持 5 秒切換。

上傳方式：
1. 解壓縮本 ZIP。
2. 進入解壓後資料夾。
3. Ctrl + A 全選裡面的檔案與資料夾。
4. 到 GitHub repo 根目錄 → Add file → Upload files。
5. 拖入全部項目。
6. Commit message：
   Force hide course promo gallery
7. Commit directly to main branch。
8. 等 Cloudflare Pages 部署 30–90 秒。
9. 用這個網址測：
   https://xunfeng-official-cms.pages.dev/courses.html?v=4

如果還看到三張排開圖：
- 表示 GitHub 沒有成功覆蓋 courses.html 或 css/style.css。
- 到 GitHub 根目錄打開 courses.html，搜尋 force-hide-course-promo-gallery。
- 搜得到才代表這包有真正上傳成功。
