# 巽風官網 V8 手機版全站防截斷修補包

本次修正：
1. 全站防止手機版橫向溢出與畫面被截斷。
2. 修正掌訣班課程頁在手機 Facebook / LINE 內建瀏覽器中：
   - 海報過寬被切掉
   - 文案超出卡片邊界
   - 標題與段落被截斷
3. 全站主要分頁同步套用手機版規則：
   - 首頁
   - 關於巽風
   - 服務方案
   - 企業顧問
   - 案例實績
   - 課程講座
   - 預約表單
   - AI 初步諮詢
4. 手機版底部三顆 CTA 加大安全距離，降低被手機瀏覽器底部浮層遮住的機率。
5. 只修改 css/style.css，不影響後台 Token 與資料內容。

上傳方式：
1. 解壓縮本 ZIP。
2. 進入解壓後資料夾。
3. 看到 css 資料夾後，將 css 資料夾拖到 GitHub 倉庫根目錄上傳。
4. Commit message 填：
   Fix mobile responsive clipping
5. Commit directly to main branch。
6. 等 Cloudflare Pages 自動部署 30–90 秒。
7. 手機測試網址：
   https://xunfeng-official-cms.pages.dev/courses.html?v=8
   https://xunfeng-official-cms.pages.dev/?v=8
   https://xunfeng-official-cms.pages.dev/services.html?v=8
   https://xunfeng-official-cms.pages.dev/cases.html?v=8

驗收標準：
- 手機版掌訣班海報不可被左右切掉。
- 文案不可被卡片邊界截斷。
- 各分頁大標題不可出現單字被硬切、內容超出畫面。
- 底部 AI / LINE / 填表按鈕仍可正常點擊。
