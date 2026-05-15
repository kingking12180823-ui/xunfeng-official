# 掌中訣課程推廣修補包

本修補包會新增：

1. 課程講座頁最上方的「掌中訣」獨立招生主推區。
2. 三張課程宣傳海報。
3. 兩支課程宣傳影片。
4. 報名按鈕： https://psee.io/9255j4
5. 後台新增「新課程推廣」分頁。
6. 後台可控制上架／下架：
   - 勾選「是否上架」＝前台顯示。
   - 取消勾選＝前台隱藏。
   - 可選填上架開始日、下架日期。
7. 不會覆蓋既有 content/courses.json 課程清單。

上傳方式：

1. 解壓縮本 ZIP。
2. 到 GitHub repository：kingking12180823-ui/xunfeng-official。
3. Add file → Upload files。
4. 把解壓後所有檔案拖上去。
5. Commit message 填：
   Add palm reading course promo
6. 選 Commit directly to main branch。
7. 按 Commit changes。
8. 等 Cloudflare Pages 自動部署 30–90 秒。
9. 打開：
   https://xunfeng-official-cms.pages.dev/courses.html

後台操作：

1. 打開：
   https://xunfeng-official-cms.pages.dev/admin/
2. 貼 GitHub Token 並連線。
3. 左側點「新課程推廣」。
4. 勾選／取消「是否上架」。
5. 修改文案、海報、影片、報名連結。
6. 按右上「發布本頁」。

注意：
影片檔較大，上傳 GitHub 時要等檔案全部跑完再 Commit。
