# Cloudflare Pages + Formspree 上線操作手冊

## 這一版已完成什麼

此版本已改成 Cloudflare Pages 靜態網站可用的結構：

- 表單不再使用 mailto
- 表單改成 Formspree 標準 POST
- JS 不再攔截 submit
- 保留「複製內容給 LINE」
- 新增 thanks.html
- 新增 _headers、_redirects、robots.txt、sitemap.xml、404.html
- 適合直接上傳到 Cloudflare Pages

---

## Formspree endpoint 已設定完成

請到 Formspree 建立表單後，取得 endpoint，例如：

```text
https://formspree.io/f/abcxyz12
```

然後打開：

```text
booking.html
```

找到：

```html
action="https://formspree.io/f/mkokdvwk"
```

改成你的 endpoint：

```html
action="https://formspree.io/f/abcxyz12"
```

只要改這一行。

---

## Formspree 建立方式

1. 到 https://formspree.io/
2. 註冊 / 登入
3. 建立 New Form
4. 表單名稱可填：xunfeng-booking
5. 收件 Email 設為：kingking0909@yahoo.com.tw
6. 複製 Form Endpoint
7. 貼到 booking.html 的 action

---

## Formspree 表單內容

目前 booking.html 已包含：

- 服務類型
- 姓名 / 單位
- 手機 / LINE
- Email
- 地點 / 區域
- 坪數 / 規模
- 預算級距
- 需求急迫性
- 希望安排時間
- 需求說明
- _gotcha 防垃圾欄位
- _subject 郵件主旨

---

## thanks.html 怎麼用

Formspree 預設會跳到 Formspree 自己的 Thank You 頁。

如果你要送出後跳回自己的感謝頁，請到 Formspree 後台的表單設定裡，把 Redirect 設為：

```text
https://你的正式網域/thanks.html
```

如果你的 Formspree 方案沒有自訂 Redirect，表單仍然可以正常收單，只是送出後會看到 Formspree 預設感謝頁。

---

## Cloudflare Pages 上傳方式

1. 登入 Cloudflare
2. 進入 Workers & Pages
3. 選 Pages
4. Create application
5. 選 Direct Upload
6. 上傳本資料夾內容，或上傳 ZIP 解壓後的資料夾
7. 部署完成後，Cloudflare 會給你一個 pages.dev 臨時網址

---

## 正式網域

上線後可到 Pages 專案裡設定 Custom domain，例如：

```text
xunfeng.com.tw
www.xunfeng.com.tw
```

---

## 已串接資料

- AI 分身：https://chatgpt.com/g/g-683d6cacf5648191ade78d93c3aec7ac-feng-yi-lao-shi-xun-feng-xue-shu-kan-yu
- 官方 LINE：https://lin.ee/W88wwDB
- Facebook 粉專：https://www.facebook.com/share/1CCqvG15fD/
- Email：kingking0909@yahoo.com.tw

---

## 測試流程

1. 打開 /booking.html
2. 填測試資料
3. 按送出
4. 到 Formspree 後台看 Submissions
5. 到 kingking0909@yahoo.com.tw 收信確認
6. 測試「複製內容給 LINE」是否可用

---

## 注意

不要再用 Netlify Agent 修改這包網站。現在這包是 Cloudflare Pages + Formspree 版。
