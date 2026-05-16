/**
 * 巽風 AI 會員系統 Worker
 * 必要 Bindings:
 * - DB: Cloudflare D1 database
 * - OPENAI_API_KEY: Worker Secret
 * - JWT_SECRET: Worker Secret
 * - ADMIN_KEY: Worker Secret
 * 可選 Vars:
 * - OPENAI_MODEL: gpt-4.1-mini 或你帳號可用模型
 * - ALLOWED_ORIGIN: https://xunfeng-official-cms.pages.dev
 */

const JSON_HEADERS = {"Content-Type":"application/json; charset=utf-8"};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(env, origin);

    if (request.method === "OPTIONS") {
      return new Response(null, {headers: cors});
    }

    try {
      if (url.pathname === "/api/health") return json({ok:true, service:"xunfeng-ai-member"}, cors);

      if (url.pathname === "/api/register" && request.method === "POST") return register(request, env, cors);
      if (url.pathname === "/api/login" && request.method === "POST") return login(request, env, cors);
      if (url.pathname === "/api/me" && request.method === "GET") return me(request, env, cors);
      if (url.pathname === "/api/redeem" && request.method === "POST") return redeem(request, env, cors);
      if (url.pathname === "/api/chat" && request.method === "POST") return chat(request, env, cors);

      if (url.pathname === "/api/admin/create-code" && request.method === "POST") return adminCreateCode(request, env, cors);
      if (url.pathname === "/api/admin/members" && request.method === "GET") return adminMembers(request, env, cors);

      return json({error:"找不到 API 路徑"}, cors, 404);
    } catch (err) {
      return json({error: err.message || "系統錯誤"}, cors, err.status || 500);
    }
  }
};

function corsHeaders(env, origin){
  const allow = env.ALLOWED_ORIGIN || "*";
  const allowedOrigin = allow === "*" ? "*" : (origin === allow ? origin : allow);
  return {
    ...JSON_HEADERS,
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Key",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };
}

function json(data, headers={}, status=200){
  return new Response(JSON.stringify(data), {status, headers});
}

async function body(request){
  return await request.json().catch(() => ({}));
}

function nowISO(){ return new Date().toISOString(); }
function addDaysISO(days){
  const d = new Date();
  d.setDate(d.getDate() + Number(days || 30));
  return d.toISOString().slice(0,10);
}
function publicMember(m){
  return {
    id:m.id, name:m.name, email:m.email, phone:m.phone,
    plan:m.plan, status:m.status,
    credits_remaining:m.credits_remaining,
    expires_at:m.expires_at, created_at:m.created_at
  };
}
function requireAdmin(request, env){
  const key = request.headers.get("X-Admin-Key") || "";
  if(!env.ADMIN_KEY || key !== env.ADMIN_KEY){
    const e = new Error("管理者金鑰錯誤");
    e.status = 401;
    throw e;
  }
}

async function register(request, env, cors){
  const b = await body(request);
  if(!b.email || !b.password) return json({error:"Email 與密碼必填"}, cors, 400);
  const email = String(b.email).trim().toLowerCase();
  const exists = await env.DB.prepare("SELECT id FROM members WHERE email=?").bind(email).first();
  if(exists) return json({error:"此 Email 已註冊，請直接登入"}, cors, 409);

  const salt = randomId(16);
  const password_hash = await hashPassword(b.password, salt);
  const id = crypto.randomUUID();
  await env.DB.prepare(`INSERT INTO members
    (id,name,email,phone,password_hash,salt,plan,status,credits_remaining,expires_at,created_at,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`)
    .bind(id, b.name || "", email, b.phone || "", password_hash, salt, "free", "pending", 0, null, nowISO(), nowISO()).run();

  const token = await signToken({sub:id,email}, env);
  return json({ok:true, token}, cors);
}

async function login(request, env, cors){
  const b = await body(request);
  const email = String(b.email || "").trim().toLowerCase();
  const m = await env.DB.prepare("SELECT * FROM members WHERE email=?").bind(email).first();
  if(!m) return json({error:"帳號或密碼錯誤"}, cors, 401);
  const hash = await hashPassword(b.password || "", m.salt);
  if(hash !== m.password_hash) return json({error:"帳號或密碼錯誤"}, cors, 401);
  const token = await signToken({sub:m.id,email:m.email}, env);
  return json({ok:true, token, member: publicMember(m)}, cors);
}

async function getMemberFromAuth(request, env){
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if(!token) {
    const e = new Error("尚未登入");
    e.status = 401;
    throw e;
  }
  const payload = await verifyToken(token, env);
  const m = await env.DB.prepare("SELECT * FROM members WHERE id=?").bind(payload.sub).first();
  if(!m){
    const e = new Error("會員不存在");
    e.status = 401;
    throw e;
  }
  return m;
}

async function me(request, env, cors){
  const m = await getMemberFromAuth(request, env);
  return json({ok:true, member: publicMember(m)}, cors);
}

async function redeem(request, env, cors){
  const m = await getMemberFromAuth(request, env);
  const b = await body(request);
  const code = String(b.code || "").trim().toUpperCase();
  if(!code) return json({error:"請輸入啟用碼"}, cors, 400);

  const c = await env.DB.prepare("SELECT * FROM activation_codes WHERE code=?").bind(code).first();
  if(!c || c.used_by) return json({error:"啟用碼不存在或已被使用"}, cors, 400);

  const expires = addDaysISO(c.days);
  await env.DB.batch([
    env.DB.prepare(`UPDATE members SET plan=?, status='active', credits_remaining=?, expires_at=?, updated_at=? WHERE id=?`)
      .bind(c.plan, c.credits, expires, nowISO(), m.id),
    env.DB.prepare("UPDATE activation_codes SET used_by=?, used_at=? WHERE code=?")
      .bind(m.id, nowISO(), code)
  ]);

  const updated = await env.DB.prepare("SELECT * FROM members WHERE id=?").bind(m.id).first();
  return json({ok:true, plan:updated.plan, credits_remaining:updated.credits_remaining, expires_at:updated.expires_at, member:publicMember(updated)}, cors);
}

async function chat(request, env, cors){
  const m = await getMemberFromAuth(request, env);
  const today = new Date().toISOString().slice(0,10);
  if(m.status !== "active") return json({error:"會員尚未啟用"}, cors, 403);
  if(m.expires_at && m.expires_at < today) return json({error:"會員已到期，請重新開通"}, cors, 403);
  if(Number(m.credits_remaining || 0) <= 0) return json({error:"問答次數已用完，請續費"}, cors, 403);

  const b = await body(request);
  const message = String(b.message || "").trim();
  if(!message) return json({error:"請輸入問題"}, cors, 400);

  const system = `你是「風羿老師／巽風堪輿 AI 會員版」。
定位：融合乾坤國寶、龍門八局、形家風水、命理、場域管理與現代決策語言的 AI 初步諮詢助手。
語氣：繁體中文、專業、直接、可落地，不講空話。
規則：
1. 風水坐向與羅盤判斷以磁北為基準。
2. 龍門八局用語需準確，包含先天位、後天位、賓位、客位、案劫位、輔卦位、三劫位等，不使用不屬於本體系的錯誤術語。
3. 若使用者問阿卡西視覺戰略圖，不得宣稱真實讀取阿卡西紀錄，需要求完整資料後再做象徵式生命／品牌戰略解讀。
4. 醫療、法律、投資問題只能作風險提醒與一般資訊，不得取代專業人士。
5. 所有風水、頻率、能量相關建議最後需提醒：正式判斷仍需由風羿老師本人親至現場評估。
6. 回答要有結論、判斷依據、可執行建議。`;

  const input = `會員方案：${m.plan}
會員問題：
${message}`;

  const ai = await callOpenAI(env, system, input);

  await env.DB.batch([
    env.DB.prepare("INSERT INTO usage_logs (id, member_id, type, prompt, reply, created_at) VALUES (?,?,?,?,?,?)")
      .bind(crypto.randomUUID(), m.id, "chat", message.slice(0,4000), ai.slice(0,8000), nowISO()),
    env.DB.prepare("UPDATE members SET credits_remaining=credits_remaining-1, updated_at=? WHERE id=?")
      .bind(nowISO(), m.id)
  ]);

  const updated = await env.DB.prepare("SELECT * FROM members WHERE id=?").bind(m.id).first();
  return json({ok:true, reply:ai, member:publicMember(updated)}, cors);
}

async function adminCreateCode(request, env, cors){
  requireAdmin(request, env);
  const b = await body(request);
  const code = "XF-" + randomReadable(4) + "-" + randomReadable(4);
  const plan = b.plan || "basic";
  const days = Number(b.days || 30);
  const credits = Number(b.credits || 100);
  await env.DB.prepare("INSERT INTO activation_codes (code,plan,days,credits,note,created_at) VALUES (?,?,?,?,?,?)")
    .bind(code, plan, days, credits, b.note || "", nowISO()).run();
  return json({ok:true, code, plan, days, credits}, cors);
}

async function adminMembers(request, env, cors){
  requireAdmin(request, env);
  const rs = await env.DB.prepare("SELECT id,name,email,phone,plan,status,credits_remaining,expires_at,created_at FROM members ORDER BY created_at DESC LIMIT 200").all();
  return json({ok:true, members:rs.results || []}, cors);
}

async function callOpenAI(env, instructions, input){
  if(!env.OPENAI_API_KEY) throw new Error("尚未設定 OPENAI_API_KEY");
  const model = env.OPENAI_MODEL || "gpt-4.1-mini";
  const res = await fetch("https://api.openai.com/v1/responses", {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer " + env.OPENAI_API_KEY
    },
    body: JSON.stringify({
      model,
      instructions,
      input,
      max_output_tokens: 1100,
      temperature: 0.4
    })
  });
  const data = await res.json().catch(() => ({}));
  if(!res.ok) throw new Error(data.error?.message || "OpenAI API 呼叫失敗");
  const text = data.output_text || extractOutputText(data);
  return text || "目前沒有取得有效回覆，請稍後再試。";
}

function extractOutputText(data){
  try{
    return (data.output || [])
      .flatMap(o => o.content || [])
      .filter(c => c.type === "output_text" || c.text)
      .map(c => c.text)
      .join("\n");
  }catch(e){ return ""; }
}

function randomId(len=16){
  const a = new Uint8Array(len);
  crypto.getRandomValues(a);
  return Array.from(a).map(x => x.toString(16).padStart(2,"0")).join("");
}
function randomReadable(len=4){
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const a = new Uint8Array(len);
  crypto.getRandomValues(a);
  return Array.from(a).map(x => chars[x % chars.length]).join("");
}
function b64url(buf){
  let str = typeof buf === "string" ? btoa(buf) : btoa(String.fromCharCode(...new Uint8Array(buf)));
  return str.replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function fromB64url(str){
  str = str.replace(/-/g,"+").replace(/_/g,"/");
  while(str.length % 4) str += "=";
  return atob(str);
}
async function hmac(data, secret){
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), {name:"HMAC", hash:"SHA-256"}, false, ["sign"]);
  return await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
}
async function signToken(payload, env){
  const p = Object.assign({}, payload, {exp: Math.floor(Date.now()/1000) + 60*60*24*14});
  const head = b64url(JSON.stringify({alg:"HS256",typ:"JWT"}));
  const body = b64url(JSON.stringify(p));
  const sig = b64url(await hmac(head + "." + body, env.JWT_SECRET));
  return head + "." + body + "." + sig;
}
async function verifyToken(token, env){
  const parts = token.split(".");
  if(parts.length !== 3) throw Object.assign(new Error("Token 格式錯誤"), {status:401});
  const sig = b64url(await hmac(parts[0] + "." + parts[1], env.JWT_SECRET));
  if(sig !== parts[2]) throw Object.assign(new Error("Token 驗證失敗"), {status:401});
  const payload = JSON.parse(fromB64url(parts[1]));
  if(payload.exp < Math.floor(Date.now()/1000)) throw Object.assign(new Error("登入已過期，請重新登入"), {status:401});
  return payload;
}
async function hashPassword(password, salt){
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({name:"PBKDF2", salt:enc.encode(salt), iterations:100000, hash:"SHA-256"}, key, 256);
  return b64url(bits);
}
