# 巽風 AI 分身會員制收費 MVP V1

## 這包是什麼

這是「巽風 AI 會員系統」第一階段正式架構，不是單純丟 ChatGPT 分身連結。

架構：

```text
巽風官網
↓
會員註冊 / 登入
↓
付款後取得啟用碼
↓
輸入啟用碼開通方案
↓
使用風羿老師 AI 會員版
↓
每問一次扣一次額度
```

第一階段先採「人工收款 + 啟用碼開通」，可以最快營運。
第二階段再串綠界、藍新或 LINE Pay 自動開通。

---

## 一、前台檔案

請把以下檔案上傳到 GitHub 倉庫根目錄：

```text
member-pricing.html
login.html
member.html
member-ai.html
member-admin.html
css/member.css
js/member-config.js
js/member-auth.js
js/member-ai.js
js/member-admin.js
```

上傳後，前台網址會是：

```text
會員方案：
https://xunfeng-official-cms.pages.dev/member-pricing.html

會員登入：
https://xunfeng-official-cms.pages.dev/login.html

會員中心：
https://xunfeng-official-cms.pages.dev/member.html

AI 會員版：
https://xunfeng-official-cms.pages.dev/member-ai.html

會員管理：
https://xunfeng-official-cms.pages.dev/member-admin.html
```

---

## 二、後端 Worker

Worker 檔案：

```text
workers/xunfeng-ai-member-worker.js
```

D1 資料庫 schema：

```text
migrations/0001_xunfeng_ai_membership.sql
```

Wrangler 範例：

```text
wrangler.toml.example
```

---

## 三、Cloudflare 必要設定

### 1. 建立 D1 資料庫

資料庫名稱建議：

```text
xunfeng_ai_member
```

建立後，把 `migrations/0001_xunfeng_ai_membership.sql` 內容貼到 D1 Console 執行。

### 2. 建立 Worker

Worker 名稱建議：

```text
xunfeng-ai-member
```

把 `workers/xunfeng-ai-member-worker.js` 貼進 Worker。

### 3. 綁定 D1

Worker 需要 D1 binding：

```text
Binding name：DB
Database：xunfeng_ai_member
```

### 4. 設定 Secrets

Worker 需要三個 Secret：

```text
OPENAI_API_KEY
JWT_SECRET
ADMIN_KEY
```

建議：

```text
OPENAI_API_KEY：你的 OpenAI API Key
JWT_SECRET：自己設定一串很長的亂碼
ADMIN_KEY：自己設定一串管理後台用密碼
```

### 5. 設定 Variables

```text
ALLOWED_ORIGIN=https://xunfeng-official-cms.pages.dev
OPENAI_MODEL=gpt-4.1-mini
```

---

## 四、更新前台 API 網址

打開：

```text
js/member-config.js
```

把：

```text
https://YOUR-WORKER-URL.workers.dev
```

換成你的 Worker 正式網址，例如：

```text
https://xunfeng-ai-member.kingking12180823.workers.dev
```

然後重新上傳 `js/member-config.js`。

---

## 五、營運流程

### 會員付款

客戶透過 LINE、匯款、LINE Pay 或綠界付款連結付款。

### 產生啟用碼

你進入：

```text
https://xunfeng-official-cms.pages.dev/member-admin.html
```

輸入 `ADMIN_KEY`，設定：

```text
方案
有效天數
問答次數
備註
```

按「產生啟用碼」。

### 客戶啟用

客戶到：

```text
https://xunfeng-official-cms.pages.dev/member.html
```

輸入啟用碼，即可開通會員。

### 客戶使用 AI

客戶到：

```text
https://xunfeng-official-cms.pages.dev/member-ai.html
```

每問一次扣一次額度。

---

## 六、方案建議

```text
免費體驗：每日 3 問，導流用
月費會員：NT$888 / 月，100 問
進階會員：NT$3,600 / 月，500 問
VIP 顧問會員：NT$9,800 起 / 月，AI + 風羿老師本人檢視
```

---

## 七、安全提醒

1. OpenAI API Key 不可放前台，只能放 Worker Secret。
2. ADMIN_KEY 不可公開。
3. member-admin.html 不要放在前台選單。
4. 若曾截圖露出 Token 或 Key，請重建。
5. 風水與命理正式個案仍需由風羿老師本人確認。

---

## 八、下一階段

穩定後再開發：

```text
綠界 / 藍新金流自動開通
LINE Login
付款發票紀錄
會員訂閱到期通知
不同 AI 模組：八字、風水、掌訣、企業顧問
```
