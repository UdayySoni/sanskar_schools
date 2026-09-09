import siteConfig from "../site.config.json"
import { validateUpload } from "./uploads"
import { contentSchemas } from "./content-validation"
import { z } from "zod"
import { PUBLIC_CONTENT_DEFAULTS } from "./defaults"

const LEAD_NOTIFY_TO = "sanskarschool2009@gmail.com"
const SESSION_COOKIE = "sanskar_admin"
const SESSION_TTL_SECONDS = 60 * 60 * 10
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024

const leadSchema = z.object({
  studentName: z.string().trim().min(2).max(100),
  parentName: z.string().trim().max(100).default(""),
  phone: z.string().trim().regex(/^[0-9 +()\-]{10,20}$/),
  email: z.string().trim().email().or(z.literal("")).default(""),
  grade: z.string().trim().min(1).max(40),
  wing: z.string().trim().min(1).max(80),
  city: z.string().trim().max(80).default(""),
  message: z.string().trim().max(1000).default(""),
  source: z.string().trim().max(80).default("website"),
  company: z.string().max(0).optional(),
})

const loginSchema = z.object({
  username: z.string().trim().min(2).max(80),
  password: z.string().min(8).max(200),
})

const createAdminSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9._-]+$/, "Use letters, numbers, dots, underscores or hyphens."),
  displayName: z.string().trim().min(2).max(80),
  password: z.string().min(12).max(200),
})

const updateAdminSchema = z
  .object({
    displayName: z.string().trim().min(2).max(80).optional(),
    password: z.string().min(12).max(200).optional(),
    active: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, "Choose an account change.")

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-robots-tag": "noindex, nofollow",
}

function json(data: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...jsonHeaders, ...headers },
  })
}

function error(message: string, status = 400, details?: unknown) {
  return json({ ok: false, message, details }, status)
}

function parseCookies(request: Request) {
  const result: Record<string, string> = {}
  const header = request.headers.get("cookie") ?? ""
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=")
    if (key) result[key] = rest.join("=")
  }
  return result
}

function sessionCookie(request: Request, value: string, maxAge: number) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : ""
  return `${SESSION_COOKIE}=${value}; HttpOnly${secure}; SameSite=Strict; Path=/; Max-Age=${maxAge}`
}

function encodeBase64Url(value: Uint8Array | string) {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : value
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const binary = atob(normalized + "=".repeat((4 - (normalized.length % 4)) % 4))
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))
  return encodeBase64Url(new Uint8Array(signature))
}

async function createSession(username: string, secret: string, db: D1Database) {
  const jti = crypto.randomUUID()
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  await db.prepare("INSERT INTO admin_sessions (id, username, expires_at) VALUES (?, ?, ?)").bind(jti, username.toLowerCase(), exp).run()
  const payload = encodeBase64Url(JSON.stringify({ username, exp, jti }))
  return `${payload}.${await hmac(payload, secret)}`
}

async function verifySession(request: Request, env: Env) {
  if (!env.SESSION_SECRET) return null
  const token = parseCookies(request)[SESSION_COOKIE]
  if (!token) return null
  const [payload, signature] = token.split(".")
  if (!payload || !signature || !constantTimeEqual(signature, await hmac(payload, env.SESSION_SECRET))) return null
  try {
    const data = JSON.parse(new TextDecoder().decode(decodeBase64Url(payload))) as {
      username: string
      exp: number
      jti: string
    }
    if (typeof data.username !== "string" || typeof data.jti !== "string" || !Number.isFinite(data.exp) || data.exp <= Math.floor(Date.now() / 1000)) return null
    const stored = await env.DB.prepare("SELECT id FROM admin_sessions WHERE id = ? AND username = ? AND expires_at > ?").bind(data.jti, data.username.toLowerCase(), Math.floor(Date.now() / 1000)).first()
    if (!stored) return null
    return data
  } catch {
    return null
  }
}

async function derivePassword(password: string, salt: Uint8Array, iterations: number) {
  const saltBuffer = Uint8Array.from(salt).buffer
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: saltBuffer, iterations },
    key,
    256,
  )
  return new Uint8Array(bits)
}

function constantTimeEqual(left: string, right: string) {
  const leftBytes = new TextEncoder().encode(left)
  const rightBytes = new TextEncoder().encode(right)
  if (leftBytes.length !== rightBytes.length) return false
  let difference = 0
  for (let index = 0; index < leftBytes.length; index += 1) {
    difference |= leftBytes[index] ^ rightBytes[index]
  }
  return difference === 0
}

async function hashPassword(password: string, secret: string) {
  const salt = encodeBase64Url(crypto.getRandomValues(new Uint8Array(16)))
  const hash = await hmac(`${salt}:${password}`, secret)
  return `hmac-sha256$${salt}$${hash}`
}

async function verifyPassword(password: string, encoded: string, secret: string) {
  const [algorithm, iterationText, saltText, expectedText] = encoded.split("$")
  if (algorithm === "hmac-sha256" && iterationText && saltText && !expectedText) {
    const actual = await hmac(`${iterationText}:${password}`, secret)
    return constantTimeEqual(actual, saltText)
  }
  if (algorithm !== "pbkdf2" || !iterationText || !saltText || !expectedText) return false
  const iterations = Number(iterationText)
  if (!Number.isFinite(iterations) || iterations < 100000) return false
  const actual = await derivePassword(password, decodeBase64Url(saltText), iterations)
  const expected = decodeBase64Url(expectedText)
  if (actual.length !== expected.length) return false
  let difference = 0
  for (let index = 0; index < actual.length; index += 1) difference |= actual[index] ^ expected[index]
  return difference === 0
}

async function requestIpHash(request: Request) {
  const value =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "local"
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))
  return encodeBase64Url(new Uint8Array(digest))
}

function mutationOriginIsValid(request: Request) {
  const origin = request.headers.get("origin")
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return true
  if (!origin) return request.headers.get("sec-fetch-site") !== "cross-site"
  return origin === new URL(request.url).origin
}

async function getContent(db: D1Database) {
  const rows = await db.prepare("SELECT key, value, updated_at AS updatedAt FROM content").all<{
    key: string
    value: string
    updatedAt: number
  }>()
  const content: Record<string, unknown> = { ...PUBLIC_CONTENT_DEFAULTS }
  for (const row of rows.results) {
    try {
      if (!Object.hasOwn(PUBLIC_CONTENT_DEFAULTS, row.key)) continue
      const value = JSON.parse(row.value)
      const parsed = contentSchemas[row.key]?.safeParse(value)
      if (!parsed?.success) continue
      content[row.key] = ["settings", "sportsArena", "seo"].includes(row.key)
        ? { ...(content[row.key] as object), ...(parsed.data as object) }
        : parsed.data
    } catch {
      // Preserve defaults when a legacy row is malformed.
    }
  }
  return content
}

async function audit(db: D1Database, action: string, details = "") {
  await db
    .prepare("INSERT INTO audit_log (id, action, details, created_at) VALUES (?, ?, ?, ?)")
    .bind(crypto.randomUUID(), action, details.slice(0, 1000), Date.now())
    .run()
    .catch(() => console.error("Audit record could not be written", action))
}

async function revokeSessions(db: D1Database, username: string) {
  await db.prepare("DELETE FROM admin_sessions WHERE username = ?").bind(username.toLowerCase()).run()
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    }
    return entities[character]
  })
}

async function servePage(request: Request, env: Env) {
  const url = new URL(request.url)
  const pathname = url.pathname.replace(/\/+$/, "") || "/"
  const canonicalHost = new URL(siteConfig.url).hostname
  if (siteConfig.alternateHosts.includes(url.hostname) || (url.hostname === canonicalHost && url.protocol !== "https:")) {
    return Response.redirect(siteConfig.url + url.pathname + url.search, 308)
  }
  if (pathname === "/robots.txt") return new Response(
    "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: " + siteConfig.url + "/sitemap.xml\n",
    { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } },
  )
  if (pathname === "/sitemap.xml") return new Response(
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      siteConfig.routes.filter(path => path !== "/virtual-tour").map(path => "<url><loc>" + escapeHtml(siteConfig.url + path) + "</loc></url>").join("") + "</urlset>",
    { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" } },
  )
  if (!["GET", "HEAD"].includes(request.method)) return new Response("Method not allowed", { status: 405, headers: { allow: "GET, HEAD" } })
  const admin = pathname === "/admin" || pathname.startsWith("/admin/")
  const known = siteConfig.routes.includes(pathname) || admin
  // Always fetch the shell for application routes; nested routes need no copied index files.
  let response = await env.ASSETS.fetch(new Request(known ? new URL("/", url) : url, request))
  if (!known && !response.headers.get("content-type")?.includes("text/html")) return response
  if (!response.headers.get("content-type")?.includes("text/html")) return response
  const headers = new Headers(response.headers)
  headers.delete("content-length")
  headers.delete("etag")
  headers.set("cache-control", "no-store")
  headers.set("x-content-type-options", "nosniff")
  headers.set("referrer-policy", "strict-origin-when-cross-origin")
  if (admin || !known) headers.set("x-robots-tag", "noindex, nofollow")
  const result = new Response(response.body, { status: known ? response.status : 404, headers })
  const canonical = siteConfig.url + pathname
  let rewriter = new HTMLRewriter()
    .on('link[rel="canonical"]', { element(el) { el.setAttribute("href", canonical) } })
    .on('meta[property="og:url"]', { element(el) { el.setAttribute("content", canonical) } })
    .on('meta[name="robots"]', { element(el) { if (admin || !known) el.setAttribute("content", "noindex, nofollow") } })
  if (admin) return rewriter.transform(result)
  const content = await getContent(env.DB)
  const seo = content.seo as Record<string, { title?: string; description?: string }>
  const pageSeo = known ? seo[pathname] : { title: "Page not found | Sanskar Public School", description: "The requested page could not be found." }
  if (pageSeo?.title) {
    rewriter = rewriter.on("title", { element(el) { el.setInnerContent(pageSeo.title!) } })
      .on('meta[property="og:title"], meta[name="twitter:title"]', { element(el) { el.setAttribute("content", pageSeo.title!) } })
  }
  if (pageSeo?.description) rewriter = rewriter
    .on('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]', { element(el) { el.setAttribute("content", pageSeo.description!) } })
  return rewriter.transform(result)
}

async function sendLeadEmail(env: Env, lead: z.infer<typeof leadSchema>, id: string, siteOrigin: string) {
  const destination = env.LEAD_NOTIFY_TO || LEAD_NOTIFY_TO
  const subject = `New admission enquiry: ${lead.studentName} - ${lead.grade}`
  const text = [
    "New website admission enquiry",
    "",
    `Student: ${lead.studentName}`,
    `Parent: ${lead.parentName || "Not provided"}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email || "Not provided"}`,
    `Grade: ${lead.grade}`,
    `Wing: ${lead.wing}`,
    `City: ${lead.city || "Not provided"}`,
    `Message: ${lead.message || "Not provided"}`,
    `Lead ID: ${id}`,
  ].join("\n")

  if (env.RESEND_API_KEY) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
        "user-agent": "SanskarPublicSchool/1.0",
        "idempotency-key": id,
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM || "Sanskar Website <onboarding@resend.dev>",
        to: [destination],
        reply_to: lead.email || undefined,
        subject,
        text,
      }),
    })
    if (!response.ok) throw new Error(`Email provider returned ${response.status}`)
    return "sent"
  }

  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(destination)}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      origin: siteOrigin,
      referer: `${siteOrigin}/admissions`,
    },
    body: JSON.stringify({
      _subject: subject,
      _template: "table",
      Student: lead.studentName,
      Parent: lead.parentName || "Not provided",
      Phone: lead.phone,
      Email: lead.email || "Not provided",
      Grade: lead.grade,
      Wing: lead.wing,
      City: lead.city || "Not provided",
      Message: lead.message || "Not provided",
      "Lead ID": id,
    }),
  })
  if (!response.ok) throw new Error(`Email fallback returned ${response.status}`)
  const payload = (await response.json().catch(() => null)) as { success?: boolean } | null
  return payload?.success ? "sent" : "activation-pending"
}

async function handleLead(request: Request, env: Env, context: ExecutionContext) {
  const parsed = leadSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return error("Please check the enquiry details and try again.", 422)
  if (parsed.data.company) return json({ ok: true, message: "Thank you. We will contact you shortly." })

  const ipHash = await requestIpHash(request)
  const recent = await env.DB
    .prepare("SELECT COUNT(*) AS count FROM leads WHERE ip_hash = ? AND created_at > ?")
    .bind(ipHash, Date.now() - 10 * 60 * 1000)
    .first<{ count: number }>()
  if ((recent?.count ?? 0) >= 5) return error("Too many enquiries. Please call the school office.", 429)

  const id = crypto.randomUUID()
  const now = Date.now()
  await env.DB
    .prepare(`INSERT INTO leads (
      id, student_name, parent_name, phone, email, grade, wing, city, message,
      source, status, email_status, ip_hash, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', 'pending', ?, ?, ?)`) 
    .bind(
      id,
      parsed.data.studentName,
      parsed.data.parentName,
      parsed.data.phone,
      parsed.data.email,
      parsed.data.grade,
      parsed.data.wing,
      parsed.data.city,
      parsed.data.message,
      parsed.data.source,
      ipHash,
      now,
      now,
    )
    .run()

  context.waitUntil(
    sendLeadEmail(env, parsed.data, id, new URL(request.url).origin)
      .then((status) =>
        env.DB.prepare("UPDATE leads SET email_status = ?, updated_at = ? WHERE id = ?")
          .bind(status, Date.now(), id)
          .run(),
      )
      .catch((notificationError) =>
        env.DB.prepare("UPDATE leads SET email_status = 'failed', updated_at = ? WHERE id = ?")
          .bind(Date.now(), id)
          .run()
          .then(() => console.error("Lead email failed", notificationError)),
      ),
  )

  return json(
    {
      ok: true,
      id,
      message: "Thank you. The admissions team has received your enquiry.",
    },
    201,
  )
}

async function getPasswordHash(env: Env) {
  const row = await env.DB
    .prepare("SELECT value FROM admin_config WHERE key = 'password_hash'")
    .first<{ value: string }>()
  return row?.value || env.ADMIN_PASSWORD_HASH || ""
}

function primaryAdminUsername(env: Env) {
  return env.ADMIN_USERNAME || "admin"
}

function isPrimaryAdmin(username: string, env: Env) {
  return username.toLowerCase() === primaryAdminUsername(env).toLowerCase()
}

async function adminSessionIsActive(username: string, env: Env) {
  if (isPrimaryAdmin(username, env)) return true
  const row = await env.DB
    .prepare("SELECT active FROM admin_users WHERE lower(username) = lower(?)")
    .bind(username)
    .first<{ active: number }>()
  return row?.active === 1
}

async function handleLogin(request: Request, env: Env) {
  if (!env.SESSION_SECRET) return error("Admin security is not configured yet.", 503)
  const parsed = loginSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return error("Enter a valid username and password.", 422)
  const ipHash = await requestIpHash(request)
  const recent = await env.DB
    .prepare(
      "SELECT COUNT(*) AS count FROM login_attempts WHERE ip_hash = ? AND successful = 0 AND created_at > ?",
    )
    .bind(ipHash, Date.now() - 15 * 60 * 1000)
    .first<{ count: number }>()
  if ((recent?.count ?? 0) >= 7) return error("Too many attempts. Try again in 15 minutes.", 429)
  await env.DB.batch([
    env.DB.prepare("DELETE FROM login_attempts WHERE created_at < ?").bind(Date.now() - 24 * 60 * 60 * 1000),
    env.DB.prepare("DELETE FROM admin_sessions WHERE expires_at <= ?").bind(Math.floor(Date.now() / 1000)),
  ])

  const storedAdmin = await env.DB
    .prepare(`SELECT id, username, password_hash AS passwordHash
      FROM admin_users WHERE lower(username) = lower(?) AND active = 1`)
    .bind(parsed.data.username)
    .first<{ id: string; username: string; passwordHash: string }>()
  const primaryUsername = primaryAdminUsername(env)
  const primaryPasswordHash = isPrimaryAdmin(parsed.data.username, env)
    ? await getPasswordHash(env)
    : ""
  const storedValid =
    Boolean(storedAdmin?.passwordHash) &&
    (await verifyPassword(
      parsed.data.password,
      storedAdmin?.passwordHash || "",
      env.SESSION_SECRET,
    ))
  const primaryValid =
    Boolean(primaryPasswordHash) &&
    (await verifyPassword(parsed.data.password, primaryPasswordHash, env.SESSION_SECRET))
  const valid = storedValid || primaryValid
  const username = storedValid ? storedAdmin?.username || parsed.data.username : primaryUsername
  await env.DB
    .prepare("INSERT INTO login_attempts (id, ip_hash, successful, created_at) VALUES (?, ?, ?, ?)")
    .bind(crypto.randomUUID(), ipHash, valid ? 1 : 0, Date.now())
    .run()
  if (!valid) return error("Incorrect username or password.", 401)

  if (storedValid && storedAdmin) {
    await env.DB
      .prepare("UPDATE admin_users SET last_login_at = ?, updated_at = ? WHERE id = ?")
      .bind(Date.now(), Date.now(), storedAdmin.id)
      .run()
  }
  const token = await createSession(username, env.SESSION_SECRET, env.DB)
  await audit(env.DB, "admin.login", username)
  return json(
    { ok: true, username },
    200,
    {
      "set-cookie": sessionCookie(request, token, SESSION_TTL_SECONDS),
    },
  )
}

async function handleAdminDashboard(env: Env, sessionUsername: string) {
  const [leadTotal, leadNew, mediaTotal, recentLeads, mediaRows, content, adminRows] = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) AS count FROM leads").first<{ count: number }>(),
    env.DB.prepare("SELECT COUNT(*) AS count FROM leads WHERE status = 'new'").first<{ count: number }>(),
    env.DB.prepare("SELECT COUNT(*) AS count FROM media").first<{ count: number }>(),
    env.DB.prepare(`SELECT id, student_name AS studentName, parent_name AS parentName,
      phone, email, grade, wing, city, message, source, status,
      email_status AS emailStatus, created_at AS createdAt
      FROM leads ORDER BY created_at DESC LIMIT 100`).all(),
    env.DB.prepare(`SELECT id, file_name AS fileName, content_type AS contentType,
      size, alt_text AS altText, category, created_at AS createdAt
      FROM media ORDER BY created_at DESC LIMIT 100`).all(),
    getContent(env.DB),
    env.DB.prepare(`SELECT id, username, display_name AS displayName, role, active,
      created_at AS createdAt, updated_at AS updatedAt, last_login_at AS lastLoginAt
      FROM admin_users ORDER BY created_at DESC`).all(),
  ])
  return json({
    ok: true,
    stats: {
      leads: leadTotal?.count ?? 0,
      newLeads: leadNew?.count ?? 0,
      media: mediaTotal?.count ?? 0,
    },
    leads: recentLeads.results,
    media: mediaRows.results.map((item) => ({ ...item, url: `/api/media/${item.id}` })),
    content,
    email: {
      destination: env.LEAD_NOTIFY_TO || LEAD_NOTIFY_TO,
      provider: env.RESEND_API_KEY ? "Resend" : "FormSubmit",
    },
    session: {
      username: sessionUsername,
      canManageAdmins: isPrimaryAdmin(sessionUsername, env),
    },
    admins: [
      {
        id: "primary",
        username: primaryAdminUsername(env),
        displayName: "Primary administrator",
        role: "owner",
        active: true,
        managed: false,
        createdAt: 0,
        updatedAt: 0,
        lastLoginAt: null,
      },
      ...adminRows.results.map((item) => ({ ...item, managed: true })),
    ],
  })
}

async function handleAdminCreate(request: Request, env: Env, sessionUsername: string) {
  if (!isPrimaryAdmin(sessionUsername, env)) {
    return error("Only the primary administrator can add login accounts.", 403)
  }
  if (!env.SESSION_SECRET) return error("Admin security is not configured yet.", 503)
  const parsed = createAdminSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return error(
      parsed.error.issues[0]?.message || "Enter a valid name, login ID and secure password.",
      422,
    )
  }
  const username = parsed.data.username.toLowerCase()
  if (isPrimaryAdmin(username, env)) return error("That login ID is already in use.", 409)
  const [existing, countRow] = await Promise.all([
    env.DB
      .prepare("SELECT id FROM admin_users WHERE lower(username) = lower(?)")
      .bind(username)
      .first<{ id: string }>(),
    env.DB.prepare("SELECT COUNT(*) AS count FROM admin_users").first<{ count: number }>(),
  ])
  if (existing) return error("That login ID is already in use.", 409)
  if ((countRow?.count ?? 0) >= 20) return error("The 20-account limit has been reached.", 409)
  const id = crypto.randomUUID()
  const now = Date.now()
  const passwordHash = await hashPassword(parsed.data.password, env.SESSION_SECRET)
  await env.DB
    .prepare(`INSERT INTO admin_users
      (id, username, display_name, password_hash, role, active, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'admin', 1, ?, ?)`)
    .bind(id, username, parsed.data.displayName, passwordHash, now, now)
    .run()
  await audit(env.DB, "admin.user.created", username)
  return json(
    {
      ok: true,
      admin: {
        id,
        username,
        displayName: parsed.data.displayName,
        role: "admin",
        active: true,
        managed: true,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: null,
      },
      message: `Login for ${parsed.data.displayName} was created.`,
    },
    201,
  )
}

async function handleAdminUpdate(
  request: Request,
  env: Env,
  sessionUsername: string,
  id: string,
) {
  if (!isPrimaryAdmin(sessionUsername, env)) {
    return error("Only the primary administrator can change login accounts.", 403)
  }
  if (!env.SESSION_SECRET) return error("Admin security is not configured yet.", 503)
  const parsed = updateAdminSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return error(parsed.error.issues[0]?.message || "Choose a valid account change.", 422)
  }
  const account = await env.DB
    .prepare("SELECT username FROM admin_users WHERE id = ?")
    .bind(id)
    .first<{ username: string }>()
  if (!account) return error("Administrator account not found.", 404)
  const now = Date.now()
  if (parsed.data.displayName !== undefined) {
    await env.DB
      .prepare("UPDATE admin_users SET display_name = ?, updated_at = ? WHERE id = ?")
      .bind(parsed.data.displayName, now, id)
      .run()
  }
  if (parsed.data.active !== undefined) {
    await env.DB
      .prepare("UPDATE admin_users SET active = ?, updated_at = ? WHERE id = ?")
      .bind(parsed.data.active ? 1 : 0, now, id)
      .run()
  }
  if (parsed.data.password !== undefined) {
    const passwordHash = await hashPassword(parsed.data.password, env.SESSION_SECRET)
    await env.DB
      .prepare("UPDATE admin_users SET password_hash = ?, updated_at = ? WHERE id = ?")
      .bind(passwordHash, now, id)
      .run()
  }
  if (parsed.data.password !== undefined || parsed.data.active !== undefined) await revokeSessions(env.DB, account.username)
  await audit(env.DB, "admin.user.updated", account.username)
  return json({ ok: true, message: `Login for ${account.username} was updated.` })
}

async function handleAdminDelete(env: Env, sessionUsername: string, id: string) {
  if (!isPrimaryAdmin(sessionUsername, env)) {
    return error("Only the primary administrator can remove login accounts.", 403)
  }
  const account = await env.DB
    .prepare("SELECT username FROM admin_users WHERE id = ?")
    .bind(id)
    .first<{ username: string }>()
  if (!account) return error("Administrator account not found.", 404)
  await revokeSessions(env.DB, account.username)
  await env.DB.prepare("DELETE FROM admin_users WHERE id = ?").bind(id).run()
  await audit(env.DB, "admin.user.deleted", account.username)
  return json({ ok: true, message: `Login for ${account.username} was removed.` })
}

async function handleContentUpdate(request: Request, env: Env, key: string) {
  if (
    ![
      "settings",
      "notices",
      "programmes",
      "happenings",
      "testimonials",
      "sportsArena",
      "seo",
    ].includes(key)
  )
    return error("Unsupported content section.", 404)
  const body = await request.json().catch(() => null)
  if (body === null || typeof body !== "object") return error("Invalid content.", 422)
  const schema = contentSchemas[key]
  const parsed = schema?.safeParse(body)
  if (!parsed?.success) return error("Invalid content fields or unsafe URL.", 422)
  const serialized = JSON.stringify(parsed.data)
  if (serialized.length > 200000) return error("Content is too large.", 413)
  await env.DB
    .prepare(`INSERT INTO content (key, value, updated_at) VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`)
    .bind(key, serialized, Date.now())
    .run()
  await audit(env.DB, `content.update.${key}`)
  return json({ ok: true, key, value: parsed.data })
}

async function handleLeadStatus(request: Request, env: Env, id: string) {
  const body = (await request.json().catch(() => null)) as { status?: string } | null
  const allowed = ["new", "contacted", "visit-booked", "admitted", "closed"]
  if (!body?.status || !allowed.includes(body.status)) return error("Invalid lead status.", 422)
  const result = await env.DB
    .prepare("UPDATE leads SET status = ?, updated_at = ? WHERE id = ?")
    .bind(body.status, Date.now(), id)
    .run()
  if (!result.meta.changes) return error("Lead not found.", 404)
  await audit(env.DB, "lead.status", `${id}:${body.status}`)
  return json({ ok: true, id, status: body.status })
}

function csvEscape(value: unknown) {
  const text = String(value ?? "")
  const safe = /^[=+@\-\t\r\n]/.test(text) ? `'${text}` : text
  return `"${safe.replace(/"/g, '""')}"`
}

async function handleLeadCsv(env: Env) {
  const rows = await env.DB.prepare(`SELECT student_name AS studentName, parent_name AS parentName,
    phone, email, grade, wing, city, message, source, status,
    email_status AS emailStatus, created_at AS createdAt
    FROM leads ORDER BY created_at DESC`).all<Record<string, unknown>>()
  const columns = [
    "studentName",
    "parentName",
    "phone",
    "email",
    "grade",
    "wing",
    "city",
    "message",
    "source",
    "status",
    "emailStatus",
    "createdAt",
  ]
  const csv = [
    columns.join(","),
    ...rows.results.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
  ].join("\r\n")
  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="sanskar-enquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
      "cache-control": "no-store",
    },
  })
}

async function handleMediaUpload(request: Request, env: Env) {
  const form = await request.formData().catch(() => null)
  if (!form) return error("Send a valid multipart upload.", 400)
  const file = form.get("file")
  if (!(file instanceof File)) return error("Choose a file to upload.", 422)
  if (!file.size || file.size > MAX_UPLOAD_BYTES) return error("Choose a non-empty file up to 8 MB.", 413)
  const validation = await validateUpload(file)
  if (validation) return error(validation, 415)
  const id = crypto.randomUUID()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/\.{2,}/g, "-").replace(/^[.-]+|[.-]+$/g, "").slice(-120) || "upload"
  const objectKey = `media/${id}-${safeName}`
  await env.FILES.put(objectKey, file.stream(), {
    httpMetadata: { contentType: file.type, cacheControl: "public, max-age=0, must-revalidate" },
  })
  const now = Date.now()
  const altText = String(form.get("altText") ?? "").trim().slice(0, 180)
  const category = String(form.get("category") ?? "Campus").trim().slice(0, 50) || "Campus"
  try {
  await env.DB
    .prepare(`INSERT INTO media
      (id, object_key, file_name, content_type, size, alt_text, category, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`) 
    .bind(id, objectKey, safeName, file.type, file.size, altText, category, now)
    .run()
  } catch (failure) {
    await env.FILES.delete(objectKey)
    throw failure
  }
  await audit(env.DB, "media.upload", safeName)
  return json(
    { ok: true, media: { id, fileName: safeName, contentType: file.type, size: file.size, altText, category, createdAt: now, url: `/api/media/${id}` } },
    201,
  )
}

async function handleMediaFile(request: Request, env: Env, id: string) {
  const row = await env.DB
    .prepare("SELECT object_key AS objectKey, content_type AS contentType FROM media WHERE id = ?")
    .bind(id)
    .first<{ objectKey: string; contentType: string }>()
  if (!row) return new Response("Not found", { status: 404 })
  const object = await env.FILES.get(row.objectKey)
  if (!object) return new Response("Not found", { status: 404 })
  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set("content-type", row.contentType)
  headers.set("cache-control", "public, max-age=0, must-revalidate")
  headers.set("etag", object.httpEtag)
  headers.set("x-content-type-options", "nosniff")
  headers.set("content-security-policy", "sandbox; default-src 'none'")
  if (request.headers.get("if-none-match") === object.httpEtag) return new Response(null, { status: 304, headers })
  headers.set("content-length", String(object.size))
  return new Response(request.method === "HEAD" ? null : object.body, { headers })
}

async function handleMediaDelete(env: Env, id: string) {
  const row = await env.DB
    .prepare("SELECT object_key AS objectKey, file_name AS fileName FROM media WHERE id = ?")
    .bind(id)
    .first<{ objectKey: string; fileName: string }>()
  if (!row) return error("Media file not found.", 404)
  const references = await env.DB.prepare("SELECT value FROM content").all<{ value: string }>()
  if (references.results.some(item => item.value.includes(`/api/media/${id}`))) {
    return error("This file is used in published content. Remove its links and save the content before deleting it.", 409)
  }
  await env.FILES.delete(row.objectKey)
  await env.DB.prepare("DELETE FROM media WHERE id = ?").bind(id).run()
  await audit(env.DB, "media.delete", row.fileName)
  return json({ ok: true, id })
}

async function handleChangePassword(request: Request, env: Env, sessionUsername: string) {
  if (!env.SESSION_SECRET) return error("Admin security is not configured yet.", 503)
  const schema = z.object({ currentPassword: z.string().min(8), newPassword: z.string().min(12).max(200) })
  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return error("Use a new password with at least 12 characters.", 422)
  const storedAdmin = await env.DB
    .prepare("SELECT id, password_hash AS passwordHash FROM admin_users WHERE lower(username) = lower(?)")
    .bind(sessionUsername)
    .first<{ id: string; passwordHash: string }>()
  const currentHash = storedAdmin?.passwordHash || (isPrimaryAdmin(sessionUsername, env) ? await getPasswordHash(env) : "")
  if (!currentHash || !(await verifyPassword(parsed.data.currentPassword, currentHash, env.SESSION_SECRET))) {
    return error("Current password is incorrect.", 401)
  }
  const nextHash = await hashPassword(parsed.data.newPassword, env.SESSION_SECRET)
  if (storedAdmin) {
    await env.DB
      .prepare("UPDATE admin_users SET password_hash = ?, updated_at = ? WHERE id = ?")
      .bind(nextHash, Date.now(), storedAdmin.id)
      .run()
  } else {
    await env.DB
      .prepare(`INSERT INTO admin_config (key, value, updated_at) VALUES ('password_hash', ?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`)
      .bind(nextHash, Date.now())
      .run()
  }
  await revokeSessions(env.DB, sessionUsername)
  await audit(env.DB, "admin.password.changed", sessionUsername)
  return json({ ok: true, message: "Password updated. Sign in again with the new password." }, 200, {
    "set-cookie": sessionCookie(request, "", 0),
  })
}

async function route(request: Request, env: Env, context: ExecutionContext) {
  const url = new URL(request.url)
  const path = url.pathname.replace(/\/+$/, "") || "/"
  if (!path.startsWith("/api/")) return servePage(request, env)
  if (!mutationOriginIsValid(request)) return error("Invalid request origin.", 403)
  // Bound actual streamed bytes before JSON or multipart parsing; Content-Length alone is untrusted.
  if (request.body && !["GET", "HEAD"].includes(request.method)) {
    const limit = path === "/api/admin/media" ? MAX_UPLOAD_BYTES + 64 * 1024 : 256 * 1024
    if (Number(request.headers.get("content-length")) > limit) return error("Request is too large.", 413)
    const reader = request.body.getReader()
    const chunks: Uint8Array[] = []
    let size = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > limit) { await reader.cancel(); return error("Request is too large.", 413) }
      chunks.push(value)
    }
    const body = new Uint8Array(size)
    let offset = 0
    for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength }
    request = new Request(request, { body })
  }

  if (path === "/api/health" && request.method === "GET") {
    await env.DB.prepare("SELECT key FROM content LIMIT 1").all()
    return json({ ok: true })
  }
  if (path === "/api/content" && request.method === "GET") {
    return json({ ok: true, content: await getContent(env.DB) }, 200, {
      "cache-control": "no-store",
    })
  }
  if (path === "/api/media" && request.method === "GET") {
    const rows = await env.DB.prepare(`SELECT id, file_name AS fileName, content_type AS contentType,
      size, alt_text AS altText, category, created_at AS createdAt
      FROM media ORDER BY created_at DESC LIMIT 100`).all()
    return json({ ok: true, media: rows.results.map((item) => ({ ...item, url: `/api/media/${item.id}` })) }, 200, {
      "cache-control": "no-store",
    })
  }
  if (path.startsWith("/api/media/") && ["GET", "HEAD"].includes(request.method)) {
    return handleMediaFile(request, env, path.split("/").pop() || "")
  }
  if (path === "/api/leads" && request.method === "POST") return handleLead(request, env, context)
  if (path === "/api/auth/login" && request.method === "POST") return handleLogin(request, env)
  if (path === "/api/auth/session" && request.method === "GET") {
    const session = await verifySession(request, env)
    return session && (await adminSessionIsActive(session.username, env))
      ? json({ ok: true, username: session.username })
      : error("Not signed in.", 401)
  }
  if (path === "/api/auth/logout" && request.method === "POST") {
    const session = await verifySession(request, env)
    if (session) await env.DB.prepare("DELETE FROM admin_sessions WHERE id = ?").bind(session.jti).run()
    return json({ ok: true }, 200, {
      "set-cookie": sessionCookie(request, "", 0),
    })
  }

  if (!path.startsWith("/api/admin/")) return error("API route not found.", 404)
  const session = await verifySession(request, env)
  if (!session || !(await adminSessionIsActive(session.username, env))) {
    return error("Admin sign-in required.", 401)
  }

  if (path === "/api/admin/dashboard" && request.method === "GET") {
    return handleAdminDashboard(env, session.username)
  }
  if (path === "/api/admin/users" && request.method === "POST") {
    return handleAdminCreate(request, env, session.username)
  }
  if (path.startsWith("/api/admin/users/") && request.method === "PATCH") {
    return handleAdminUpdate(request, env, session.username, path.split("/").pop() || "")
  }
  if (path.startsWith("/api/admin/users/") && request.method === "DELETE") {
    return handleAdminDelete(env, session.username, path.split("/").pop() || "")
  }
  if (path === "/api/admin/leads.csv" && request.method === "GET") return handleLeadCsv(env)
  if (path.startsWith("/api/admin/leads/") && request.method === "PATCH") {
    return handleLeadStatus(request, env, path.split("/").pop() || "")
  }
  if (path.startsWith("/api/admin/content/") && request.method === "PUT") {
    return handleContentUpdate(request, env, path.split("/").pop() || "")
  }
  if (path === "/api/admin/media" && request.method === "POST") return handleMediaUpload(request, env)
  if (path.startsWith("/api/admin/media/") && request.method === "DELETE") {
    return handleMediaDelete(env, path.split("/").pop() || "")
  }
  if (path === "/api/admin/change-password" && request.method === "POST") {
    return handleChangePassword(request, env, session.username)
  }
  return error("API route not found.", 404)
}

export default {
  fetch(request, env, context) {
    return route(request, env, context).catch((caughtError) => {
      console.error("Unhandled API error", caughtError instanceof Error ? caughtError.name : "UnknownError")
      return error("Something went wrong. Please try again.", 500)
    })
  },
} satisfies ExportedHandler<Env>
