const files = {
  site: "content/site.json",
  services: "content/services.json",
  cases: "content/cases.json",
  coursePromo: "content/course_promo.json",
  courses: "content/courses.json",
  photos: "content/photos.json",
};

const labels = {
  site: "網站設定",
  services: "服務價格",
  cases: "案例實績",
  coursePromo: "新課程推廣",
  courses: "課程講座",
  photos: "照片輪播",
};

const siteFields = [
  ["brand", "品牌名稱", "text"],
  ["shortBrand", "短品牌名稱", "text"],
  ["subBrand", "英文副標", "text"],
  ["heroTitle", "首頁主標題", "text"],
  ["heroAccent", "首頁強調句", "text"],
  ["heroLead", "首頁說明文字", "textarea"],
  ["brandAnchorImage", "品牌母圖路徑", "image"],
  ["fengyiImage", "風羿老師形象照路徑", "image"],
  ["email", "Email", "text"],
  ["lineUrl", "LINE 官方帳號", "text"],
  ["facebookUrl", "Facebook 粉專", "text"],
  ["aiUrl", "AI 分身連結", "text"],
  ["formspreeEndpoint", "Formspree Endpoint", "text"],
  ["mainCta", "主 CTA 文字", "text"],
  ["secondaryCta", "副 CTA 文字", "text"],
  ["seoTitle", "SEO 標題", "text"],
  ["seoDescription", "SEO 描述", "textarea"],
  ["seoKeywords", "SEO 關鍵字", "textarea"],
];


const promoFields = [
  ["active", "是否上架：勾選＝上架；取消＝下架", "checkbox"],
  ["publishStart", "上架開始日（可空白，例如 2026-06-01）", "text"],
  ["publishEnd", "下架日期（可空白，例如 2026-06-30）", "text"],
  ["label", "小標籤", "text"],
  ["title", "課程主標", "text"],
  ["titleSuffix", "課程標題副段（例如：開班授課）", "text"],
  ["headline", "主打標語", "textarea"],
  ["subheadline", "副標", "text"],
  ["body", "招生文案", "textarea"],
  ["highlights", "課程亮點（一行一項）", "textarea"],
  ["limitedText", "名額提示", "text"],
  ["ctaText", "報名按鈕文字", "text"],
  ["registerUrl", "報名連結", "text"],
  ["lineCtaText", "LINE 按鈕文字", "text"],
  ["posterMain", "輪播海報 1（主圖，可直接上傳抽換）", "image"],
  ["posterSecond", "輪播海報 2（可直接上傳抽換）", "image"],
  ["posterThird", "輪播海報 3（可直接上傳抽換）", "image"],
  ["videoCover", "影片封面路徑（選填，不影響海報輪播）", "image"],
  ["videoOne", "影片一 MP4 路徑", "video"],
  ["videoOneTitle", "影片一標題", "text"],
  ["videoTwo", "影片二 MP4 路徑", "video"],
  ["videoTwoTitle", "影片二標題", "text"],
  ["notice", "底部提醒文字", "textarea"],
];

const listFields = {
  services: [
    ["title", "服務名稱", "text"],
    ["category", "分類", "text"],
    ["price", "價格", "text"],
    ["note", "備註", "textarea"],
    ["description", "服務說明", "textarea"],
  ],
  cases: [
    ["category", "案例分類", "text"],
    ["title", "案例標題", "text"],
    ["summary", "摘要", "textarea"],
    ["body", "內文", "textarea"],
    ["image", "案例照片路徑", "image"],
  ],
  courses: [
    ["title", "課程標題", "text"],
    ["audience", "適合對象", "text"],
    ["description", "課程說明", "textarea"],
    ["image", "課程照片路徑", "image"],
  ],
  photos: [
    ["title", "照片標題", "text"],
    ["caption", "照片說明", "textarea"],
    ["image", "圖片路徑", "image"],
  ],
};

const listKeys = { services: "services", cases: "cases", courses: "courses", photos: "photos" };
let state = { repo: "", branch: "main", token: "", tab: "site", data: {}, sha: {} };

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const statusEl = $("#status");
const editor = $("#editor");

function setStatus(msg){ statusEl.textContent = msg; }
function repoParts(){
  const repo = $("#repo").value.trim();
  const [owner, name] = repo.split("/");
  if(!owner || !name) throw new Error("Repo 格式要像：kingking12180823-ui/xunfeng-official");
  return { owner, name };
}
function utf8ToB64(str){ return btoa(unescape(encodeURIComponent(str))); }
function b64ToUtf8(b64){ return decodeURIComponent(escape(atob(b64.replace(/\n/g,'')))); }
function authHeaders(){
  const token = $("#token").value.trim();
  if(!token) throw new Error("請先貼上 GitHub Token");
  return {
    "Authorization": `Bearer ${token}`,
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
}
async function ghGet(path){
  const {owner, name} = repoParts();
  const branch = $("#branch").value.trim() || "main";
  const res = await fetch(`https://api.github.com/repos/${owner}/${name}/contents/${path}?ref=${encodeURIComponent(branch)}`, { headers: authHeaders() });
  if(!res.ok) throw new Error(`讀取失敗 ${path}: ${res.status} ${await res.text()}`);
  return res.json();
}
async function ghPut(path, dataObj, message){
  const {owner, name} = repoParts();
  const branch = $("#branch").value.trim() || "main";
  const body = {
    message,
    content: utf8ToB64(JSON.stringify(dataObj, null, 2)),
    branch,
    sha: state.sha[path]
  };
  const res = await fetch(`https://api.github.com/repos/${owner}/${name}/contents/${path}`, {
    method: "PUT",
    headers: {...authHeaders(), "Content-Type": "application/json"},
    body: JSON.stringify(body)
  });
  if(!res.ok) throw new Error(`發布失敗 ${path}: ${res.status} ${await res.text()}`);
  const json = await res.json();
  state.sha[path] = json.content.sha;
  return json;
}
async function uploadFile(file){
  const {owner, name} = repoParts();
  const branch = $("#branch").value.trim() || "main";
  const cleanName = file.name.replace(/[^\w.\-]+/g, "-");
  const path = `assets/uploads/${Date.now()}-${cleanName}`;
  const b64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const body = {
    message: `Upload media ${cleanName}`
    content: b64,
    branch
  };
  const res = await fetch(`https://api.github.com/repos/${owner}/${name}/contents/${path}`, {
    method: "PUT",
    headers: {...authHeaders(), "Content-Type": "application/json"},
    body: JSON.stringify(body)
  });
  if(!res.ok) throw new Error(`媒體上傳失敗: ${res.status} ${await res.text()}`);
  await res.json();
  return path;
}

function field(name, label, type, value="", cls=""){
  const id = `${state.tab}-${name}-${Math.random().toString(36).slice(2)}`;

  if(type === "checkbox"){
    const checked = value === true || String(value).toLowerCase() === "true" ? "checked" : "";
    return `<label class="field checkbox-field ${cls}"><span>${label}</span><input id="${id}" type="checkbox" data-name="${name}" ${checked} /><p class="small">勾選代表前台上架；取消勾選代表前台隱藏。</p></label>`;
  }

  const input = type === "textarea"
    ? `<textarea id="${id}" data-name="${name}">${escapeHtml(value)}</textarea>`
    : `<input id="${id}" data-name="${name}" value="${escapeAttr(value)}" />`;

  const isImage = type === "image";
  const isVideo = type === "video";
  const img = isImage && value ? `<img class="preview-img" src="../${escapeAttr(value)}" onerror="this.style.display='none'">` : "";
  const video = isVideo && value ? `<video class="preview-video" controls src="../${escapeAttr(value)}"></video>` : "";
  const upload = (isImage || isVideo)
    ? `<input type="file" data-upload-for="${id}" accept="${isVideo ? "video/*" : "image/*"}"><p class="small">可貼檔案路徑，或選擇檔案後發布時自動上傳。</p>`
    : "";
  return `<label class="field ${cls}"><span>${label}</span>${input}${upload}${img}${video}</label>`;
}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function escapeAttr(s){return escapeHtml(s).replace(/"/g, "&quot;");}

function render(){
  $("#pageTitle").textContent = labels[state.tab];
  $$(".tabs button").forEach(b => b.classList.toggle("active", b.dataset.tab === state.tab));
  if(!state.data[state.tab]){
    editor.innerHTML = `<div class="empty"><h3>尚未讀取資料</h3><p>請先連線 GitHub。</p></div>`;
    return;
  }
  if(state.tab === "site") renderSite();
  else if(state.tab === "coursePromo") renderPromo();
  else renderList(state.tab);
}
function renderSite(){
  const data = state.data.site;
  editor.innerHTML = `
    <div class="notice">這裡改首頁、聯絡資料、AI、LINE、Formspree 與 SEO。改完按右上「發布本頁」。</div>
    <div class="grid">${siteFields.map(([k,l,t]) => field(k,l,t,data[k]||"", t==="textarea" ? "wide" : "")).join("")}</div>
  `;
}

function renderPromo(){
  const data = state.data.coursePromo || {};
  editor.innerHTML = `
    <div class="notice">這裡管理「課程講座頁」最上方的新課程主推區。輪播海報 1、2、3 都可在這裡上傳抽換；前台只會顯示一個主輪播，不會把海報排開展示。勾選「是否上架」才會在前台曝光；取消勾選即下架。改完按右上「發布本頁」。</div>
    <div class="grid">${promoFields.map(([k,l,t]) => field(k,l,t,data[k] ?? "", t==="textarea" ? "wide" : "")).join("")}</div>
  `;
}

function renderList(tab){
  const key = listKeys[tab];
  const arr = state.data[tab][key] || [];
  const fields = listFields[tab];
  editor.innerHTML = `
    <div class="notice">可新增、刪除、修改與換圖。改完按右上「發布本頁」。</div>
    <div id="listWrap">
      ${arr.map((item, i) => renderItem(tab, item, i, fields)).join("")}
    </div>
    <div class="addbar">
      <button id="addItemBtn">新增一筆</button>
    </div>
  `;
  $("#addItemBtn").onclick = () => {
    const obj = {};
    fields.forEach(([k]) => obj[k] = "");
    arr.push(obj);
    render();
  };
  $$(".deleteItem").forEach(btn => btn.onclick = () => {
    const i = Number(btn.dataset.index);
    if(confirm("確定刪除這一筆？")){
      arr.splice(i,1);
      render();
    }
  });
}
function renderItem(tab, item, i, fields){
  return `
    <div class="item" data-index="${i}">
      <div class="item-head">
        <h3>${escapeHtml(item.title || item.category || "未命名")} #${i+1}</h3>
        <button class="danger deleteItem" data-index="${i}">刪除</button>
      </div>
      <div class="grid">
        ${fields.map(([k,l,t]) => field(k,l,t,item[k]||"", t==="textarea" ? "wide" : "")).join("")}
      </div>
    </div>
  `;
}

function collect(){
  if(state.tab === "site" || state.tab === "coursePromo"){
    const obj = {...state.data[state.tab]};
    $$("[data-name]").forEach(el => {
      obj[el.dataset.name] = el.type === "checkbox" ? el.checked : el.value;
    });
    return obj;
  }
  const key = listKeys[state.tab];
  const obj = {...state.data[state.tab]};
  const fields = listFields[state.tab].map(f => f[0]);
  obj[key] = $$(".item").map(itemEl => {
    const item = {};
    fields.forEach(k => {
      const el = $(`[data-name="${k}"]`, itemEl);
      item[k] = el ? (el.type === "checkbox" ? el.checked : el.value) : "";
    });
    return item;
  });
  return obj;
}

async function applyUploads(dataObj){
  const uploadInputs = $$("input[type=file][data-upload-for]");
  for(const fileEl of uploadInputs){
    if(!fileEl.files || !fileEl.files[0]) continue;
    const targetId = fileEl.dataset.uploadFor;
    const input = document.getElementById(targetId);
    setStatus(`正在上傳圖片：${fileEl.files[0].name}`);
    const path = await uploadFile(fileEl.files[0]);
    input.value = path;
  }
  return collect();
}

async function loadAll(){
  try{
    setStatus("讀取 GitHub content/*.json 中…");
    state.repo = $("#repo").value.trim();
    state.branch = $("#branch").value.trim() || "main";
    state.token = $("#token").value.trim();
    sessionStorage.setItem("xunfeng_repo", state.repo);
    sessionStorage.setItem("xunfeng_branch", state.branch);
    sessionStorage.setItem("xunfeng_token", state.token);

    for(const [tab, path] of Object.entries(files)){
      const res = await ghGet(path);
      state.sha[path] = res.sha;
      state.data[tab] = JSON.parse(b64ToUtf8(res.content));
    }
    setStatus("已連線並讀取完成。可開始編輯。");
    render();
  }catch(err){
    console.error(err);
    setStatus(err.message);
    alert(err.message);
  }
}
async function saveCurrent(){
  try{
    if(!state.data[state.tab]) throw new Error("尚未讀取資料");
    let dataObj = collect();
    dataObj = await applyUploads(dataObj);
    const path = files[state.tab];
    state.data[state.tab] = dataObj;
    setStatus("正在發布到 GitHub…");
    await ghPut(path, dataObj, `CMS update ${path}`);
    setStatus("發布完成。Cloudflare Pages 會自動重新部署，約 30–90 秒後生效。");
    alert("發布完成。Cloudflare 會自動更新網站。");
    render();
  }catch(err){
    console.error(err);
    setStatus(err.message);
    alert(err.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  $("#repo").value = sessionStorage.getItem("xunfeng_repo") || $("#repo").value;
  $("#branch").value = sessionStorage.getItem("xunfeng_branch") || $("#branch").value;
  $("#token").value = sessionStorage.getItem("xunfeng_token") || "";

  $("#connectBtn").onclick = loadAll;
  $("#reloadBtn").onclick = loadAll;
  $("#saveBtn").onclick = saveCurrent;
  $("#forgetBtn").onclick = () => {
    sessionStorage.removeItem("xunfeng_token");
    $("#token").value = "";
    setStatus("已清除本機 Token。");
  };
  $$(".tabs button").forEach(btn => btn.onclick = () => {
    state.tab = btn.dataset.tab;
    render();
  });
});
