# 巽風官網 V5 全站標題排版修補包

本次修正重點：
1. 全站大標題改為「人工控制分行」，不再讓瀏覽器自動把中文字切成奇怪斷點。
2. 移除用逗點、句號作為分行尾巴的寫法。
3. 每個標題改成一列完整語意，或二至三列完整語意。
4. 統一首頁、關於巽風、服務方案、企業顧問、案例實績、課程講座、預約表單、AI 初步諮詢、隱私權、感謝頁、404 頁。
5. CSS 加入全站標題規則：
   - word-break: keep-all
   - line-break: strict
   - title-line 不任意破行
6. 保留掌中訣課程主輪播與後台輪播海報 1、2、3 抽換功能。
7. 保留 V4 的強制移除前台排開海報功能。

上傳方式：
1. 解壓縮本 ZIP。
2. 進入解壓後資料夾。
3. Ctrl + A 全選所有檔案與資料夾。
4. 到 GitHub repository 根目錄 → Add file → Upload files。
5. 拖入全部項目。
6. Commit message 填：
   Fix global heading typography
7. Commit directly to main branch。
8. 等 Cloudflare Pages 自動部署 30–90 秒。
9. 用以下網址測試：
   https://xunfeng-official-cms.pages.dev/?v=5
   https://xunfeng-official-cms.pages.dev/services.html?v=5
   https://xunfeng-official-cms.pages.dev/cases.html?v=5
   https://xunfeng-official-cms.pages.dev/courses.html?v=5

驗收標準：
- 不應再看到「精準規 / 劃」這種切法。
- 不應再看到「建立信 / 任」這種切法。
- 不應再看到標題每行尾巴卡逗號或句號。
- 每一行都應是完整語意片段。
