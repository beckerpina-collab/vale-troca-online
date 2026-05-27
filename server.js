import http from "node:http";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import {
  mkdir,
  readFile,
  rename,
  stat,
  writeFile,
} from "node:fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "database.json");
const SESSION_COOKIE = "vt_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const BODY_LIMIT = 1024 * 1024;

const defaultCompany = {
  nome: "Vale Troca",
  cnpj: "",
  endereco: "",
  cep: "",
  telefone: "",
  email: "",
  instagram: "",
  diasValidade: 15,
  mensagem:
    "Apresente este vale na proxima compra dentro do prazo. Obrigado pela preferencia!",
};

const sessions = new Map();
let db = null;

await bootstrap();

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith("/api/")) {
      await handleApi(req, res);
      return;
    }
    await serveStatic(req, res);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: "Erro interno do servidor." });
  }
});

server.listen(PORT, () => {
  console.log(`Vale Troca online rodando em http://localhost:${PORT}`);
  if (!process.env.ADMIN_USER || !process.env.ADMIN_PASSWORD) {
    console.log(
      "Login inicial: admin / admin123. Configure ADMIN_USER e ADMIN_PASSWORD antes de publicar online.",
    );
  }
});

async function bootstrap() {
  await mkdir(DATA_DIR, { recursive: true });
  db = await readDb();

  if (!Array.isArray(db.users) || db.users.length === 0) {
    const username = process.env.ADMIN_USER || "admin";
    const password = process.env.ADMIN_PASSWORD || "admin123";
    db.users = [
      {
        id: crypto.randomUUID(),
        username,
        displayName: process.env.ADMIN_NAME || "Administrador",
        role: "admin",
        ...hashPassword(password),
        createdAt: new Date().toISOString(),
      },
    ];
    await saveDb();
  }
}

async function readDb() {
  try {
    const content = await readFile(DB_PATH, "utf8");
    const parsed = JSON.parse(content);
    return normalizeDb(parsed);
  } catch {
    return normalizeDb({});
  }
}

function normalizeDb(value) {
  return {
    company: { ...defaultCompany, ...(value.company || {}) },
    sellers: Array.isArray(value.sellers) ? value.sellers : ["Atendimento"],
    vouchers: Array.isArray(value.vouchers) ? value.vouchers : [],
    users: Array.isArray(value.users) ? value.users : [],
  };
}

async function saveDb() {
  await mkdir(DATA_DIR, { recursive: true });
  const tmpPath = `${DB_PATH}.tmp`;
  await writeFile(tmpPath, JSON.stringify(db, null, 2), "utf8");
  await rename(tmpPath, DB_PATH);
}

async function handleApi(req, res) {
  const { pathname } = new URL(req.url, "http://localhost");

  if (req.method === "GET" && pathname === "/api/health") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === "GET" && pathname === "/api/me") {
    const user = getSessionUser(req);
    sendJson(res, 200, user ? { authenticated: true, user: publicUser(user) } : { authenticated: false });
    return;
  }

  if (req.method === "POST" && pathname === "/api/login") {
    const body = await readJsonBody(req);
    const username = String(body.username || "").trim();
    const password = String(body.password || "");
    const user = db.users.find((item) => item.username === username);

    if (!user || !verifyPassword(password, user)) {
      sendJson(res, 401, { error: "Usuario ou senha invalidos." });
      return;
    }

    const token = crypto.randomBytes(32).toString("base64url");
    sessions.set(token, {
      userId: user.id,
      expiresAt: Date.now() + SESSION_TTL_MS,
    });

    setCookie(res, SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: Math.floor(SESSION_TTL_MS / 1000),
      path: "/",
    });
    sendJson(res, 200, { user: publicUser(user), state: publicState(user) });
    return;
  }

  if (req.method === "POST" && pathname === "/api/logout") {
    const token = parseCookies(req.headers.cookie || "")[SESSION_COOKIE];
    if (token) sessions.delete(token);
    setCookie(res, SESSION_COOKIE, "", {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
    });
    sendJson(res, 200, { ok: true });
    return;
  }

  const user = getSessionUser(req);
  if (!user) {
    sendJson(res, 401, { error: "Login necessario." });
    return;
  }

  if (req.method === "GET" && pathname === "/api/state") {
    sendJson(res, 200, publicState(user));
    return;
  }

  if (req.method === "GET" && pathname === "/api/users") {
    if (!isAdmin(user, res)) return;
    sendJson(res, 200, { users: publicUsers() });
    return;
  }

  if (req.method === "POST" && pathname === "/api/users") {
    if (!isAdmin(user, res)) return;
    const body = await readJsonBody(req);
    const newUser = sanitizeUserInput(body, true);
    if (newUser.error) {
      sendJson(res, 400, { error: newUser.error });
      return;
    }
    if (db.users.some((item) => item.username.toLowerCase() === newUser.username.toLowerCase())) {
      sendJson(res, 409, { error: "Esse usuario ja existe." });
      return;
    }

    db.users.push({
      id: crypto.randomUUID(),
      username: newUser.username,
      displayName: newUser.displayName,
      role: newUser.role,
      ...hashPassword(newUser.password),
      createdAt: new Date().toISOString(),
    });
    await saveDb();
    sendJson(res, 201, { users: publicUsers() });
    return;
  }

  const userMatch = pathname.match(/^\/api\/users\/([a-zA-Z0-9-]+)$/);
  if (userMatch) {
    if (!isAdmin(user, res)) return;
    const target = db.users.find((item) => item.id === userMatch[1]);
    if (!target) {
      sendJson(res, 404, { error: "Usuario nao encontrado." });
      return;
    }

    if (req.method === "PATCH") {
      const body = await readJsonBody(req);
      const input = sanitizeUserInput(body, false);
      if (input.error) {
        sendJson(res, 400, { error: input.error });
        return;
      }
      const changingUsername = input.username && input.username !== target.username;
      if (
        changingUsername &&
        db.users.some((item) => item.id !== target.id && item.username.toLowerCase() === input.username.toLowerCase())
      ) {
        sendJson(res, 409, { error: "Esse usuario ja existe." });
        return;
      }
      if (input.role && target.role === "admin" && input.role !== "admin" && adminCount() <= 1) {
        sendJson(res, 400, { error: "Mantenha pelo menos um administrador." });
        return;
      }

      target.username = input.username || target.username;
      target.displayName = input.displayName || target.displayName;
      target.role = input.role || target.role;
      if (input.password) {
        Object.assign(target, hashPassword(input.password));
      }
      target.updatedAt = new Date().toISOString();
      await saveDb();
      sendJson(res, 200, { users: publicUsers() });
      return;
    }

    if (req.method === "DELETE") {
      if (target.id === user.id) {
        sendJson(res, 400, { error: "Voce nao pode remover seu proprio usuario logado." });
        return;
      }
      if (target.role === "admin" && adminCount() <= 1) {
        sendJson(res, 400, { error: "Mantenha pelo menos um administrador." });
        return;
      }
      db.users = db.users.filter((item) => item.id !== target.id);
      await saveDb();
      sendJson(res, 200, { users: publicUsers() });
      return;
    }
  }

  if (!isAdmin(user, res) && ["/api/company", "/api/sellers"].some((prefix) => pathname.startsWith(prefix))) {
    return;
  }

  if (req.method === "PUT" && pathname === "/api/company") {
    const body = await readJsonBody(req);
    db.company = sanitizeCompany(body);
    await saveDb();
    sendJson(res, 200, publicState(user));
    return;
  }

  if (req.method === "POST" && pathname === "/api/sellers") {
    const body = await readJsonBody(req);
    const seller = String(body.name || "").trim();
    if (!seller) {
      sendJson(res, 400, { error: "Informe o nome da vendedora." });
      return;
    }
    if (db.sellers.some((item) => item.toLowerCase() === seller.toLowerCase())) {
      sendJson(res, 409, { error: "Essa vendedora ja esta cadastrada." });
      return;
    }
    db.sellers.push(seller);
    db.sellers.sort((a, b) => a.localeCompare(b, "pt-BR"));
    await saveDb();
    sendJson(res, 201, publicState(user));
    return;
  }

  const sellerMatch = pathname.match(/^\/api\/sellers\/(.+)$/);
  if (req.method === "DELETE" && sellerMatch) {
    const seller = decodeURIComponent(sellerMatch[1]);
    db.sellers = db.sellers.filter((item) => item !== seller);
    await saveDb();
    sendJson(res, 200, publicState(user));
    return;
  }

  if (req.method === "POST" && pathname === "/api/vouchers") {
    const body = await readJsonBody(req);
    const voucher = sanitizeVoucher(body);
    if (!voucher.nfc || !voucher.diaCompra || !voucher.validade || !voucher.vendedora) {
      sendJson(res, 400, { error: "Preencha os campos obrigatorios." });
      return;
    }
    voucher.id = crypto.randomUUID();
    voucher.numero = generateNumber();
    voucher.status = "ativo";
    voucher.createdAt = new Date().toISOString();
    voucher.createdBy = user.id;
    db.vouchers.push(voucher);
    await saveDb();
    sendJson(res, 201, { voucher, state: publicState(user) });
    return;
  }

  const voucherMatch = pathname.match(/^\/api\/vouchers\/([a-zA-Z0-9-]+)$/);
  if (voucherMatch) {
    const voucher = db.vouchers.find((item) => item.id === voucherMatch[1]);
    if (!voucher) {
      sendJson(res, 404, { error: "Vale nao encontrado." });
      return;
    }

    if (req.method === "PATCH") {
      const body = await readJsonBody(req);
      const status = String(body.status || "");
      if (!["ativo", "utilizado", "cancelado"].includes(status)) {
        sendJson(res, 400, { error: "Status invalido." });
        return;
      }
      voucher.status = status;
      voucher.updatedAt = new Date().toISOString();
      voucher.updatedBy = user.id;
      await saveDb();
      sendJson(res, 200, publicState(user));
      return;
    }

    if (req.method === "DELETE") {
      if (user.role !== "admin") {
        sendJson(res, 403, { error: "Somente administradores podem excluir vales." });
        return;
      }
      db.vouchers = db.vouchers.filter((item) => item.id !== voucher.id);
      await saveDb();
      sendJson(res, 200, publicState(user));
      return;
    }
  }

  sendJson(res, 404, { error: "Rota nao encontrada." });
}

function publicState(user) {
  const state = {
    company: db.company,
    sellers: db.sellers,
    vouchers: db.vouchers,
  };
  if (user?.role === "admin") {
    state.users = publicUsers();
  }
  return state;
}

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function publicUsers() {
  return db.users.map(publicUser).sort((a, b) => a.username.localeCompare(b.username, "pt-BR"));
}

function isAdmin(user, res) {
  if (user.role === "admin") return true;
  sendJson(res, 403, { error: "Acesso restrito ao administrador." });
  return false;
}

function adminCount() {
  return db.users.filter((item) => item.role === "admin").length;
}

function sanitizeCompany(body) {
  return {
    nome: clean(body.nome, 120) || defaultCompany.nome,
    cnpj: clean(body.cnpj, 40),
    endereco: clean(body.endereco, 220),
    cep: clean(body.cep, 20),
    telefone: clean(body.telefone, 40),
    email: clean(body.email, 120),
    instagram: clean(body.instagram, 80),
    diasValidade: clamp(Number(body.diasValidade || 15), 1, 365),
    mensagem: clean(body.mensagem, 400) || defaultCompany.mensagem,
  };
}

function sanitizeVoucher(body) {
  return {
    nfc: clean(body.nfc, 80),
    diaCompra: clean(body.diaCompra, 10),
    validade: clean(body.validade, 10),
    vendedora: clean(body.vendedora, 80),
    observacao: clean(body.observacao, 250),
  };
}

function sanitizeUserInput(body, requirePassword) {
  const username = clean(body.username, 40);
  const displayName = clean(body.displayName, 80) || username;
  const role = ["admin", "operador"].includes(body.role)
    ? body.role
    : requirePassword
      ? "operador"
      : "";
  const password = String(body.password || "");

  if (!/^[a-zA-Z0-9._-]{3,40}$/.test(username)) {
    return { error: "Use um usuario com 3 a 40 caracteres, sem espacos." };
  }
  if ((requirePassword || password) && password.length < 6) {
    return { error: "A senha precisa ter pelo menos 6 caracteres." };
  }
  return { username, displayName, role, password };
}

function clean(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function generateNumber() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const sequence = String(db.vouchers.length + 1).padStart(4, "0");
  return `VT${yy}${mm}${dd}-${sequence}`;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto
    .pbkdf2Sync(password, salt, 120000, 64, "sha512")
    .toString("hex");
  return { salt, passwordHash: hash };
}

function verifyPassword(password, user) {
  const attempt = hashPassword(password, user.salt).passwordHash;
  const attemptBuffer = Buffer.from(attempt, "hex");
  const storedBuffer = Buffer.from(user.passwordHash, "hex");
  return (
    attemptBuffer.length === storedBuffer.length &&
    crypto.timingSafeEqual(attemptBuffer, storedBuffer)
  );
}

function getSessionUser(req) {
  const token = parseCookies(req.headers.cookie || "")[SESSION_COOKIE];
  if (!token) return null;
  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  session.expiresAt = Date.now() + SESSION_TTL_MS;
  return db.users.find((user) => user.id === session.userId) || null;
}

function parseCookies(header) {
  return header.split(";").reduce((acc, chunk) => {
    const [key, ...rest] = chunk.trim().split("=");
    if (!key) return acc;
    acc[key] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
}

function setCookie(res, name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (options.secure) parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}

async function readJsonBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > BODY_LIMIT) throw new Error("Body muito grande.");
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

async function serveStatic(req, res) {
  const { pathname } = new URL(req.url, "http://localhost");
  const fileName = pathname === "/" ? "index.html" : decodeURIComponent(pathname.slice(1));
  const filePath = path.resolve(__dirname, fileName);

  if (!filePath.startsWith(__dirname) || fileName.includes("server.js") || fileName.startsWith("data")) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  try {
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error("Not a file");
    const content = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": mimeType(filePath),
      "Cache-Control": "no-cache",
    });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}

function mimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return (
    {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".md": "text/plain; charset=utf-8",
    }[ext] || "application/octet-stream"
  );
}

function clamp(value, min, max) {
  return Math.min(Math.max(Number(value) || min, min), max);
}
