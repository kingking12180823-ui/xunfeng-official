-- 巽風 AI 會員系統 D1 Schema

CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  plan TEXT DEFAULT 'free',
  status TEXT DEFAULT 'pending',
  credits_remaining INTEGER DEFAULT 0,
  expires_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS activation_codes (
  code TEXT PRIMARY KEY,
  plan TEXT NOT NULL,
  days INTEGER NOT NULL DEFAULT 30,
  credits INTEGER NOT NULL DEFAULT 100,
  note TEXT,
  used_by TEXT,
  used_at TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS usage_logs (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  type TEXT NOT NULL,
  prompt TEXT,
  reply TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_usage_member ON usage_logs(member_id);
CREATE INDEX IF NOT EXISTS idx_activation_used_by ON activation_codes(used_by);
