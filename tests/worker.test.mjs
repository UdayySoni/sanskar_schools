import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync, readdirSync } from "node:fs"
import { randomBytes, createHmac } from "node:crypto"
import { Miniflare } from "miniflare"

test("production Worker: routes, authentication, content, D1, R2 and failed email", async t => {
  const secret = randomBytes(32).toString("hex")
  const password = randomBytes(20).toString("hex")
  const salt = randomBytes(16).toString("base64url")
  const hash = `hmac-sha256$${salt}$${createHmac("sha256", secret).update(`${salt}:${password}`).digest("base64url")}`
  const mf = new Miniflare({
    modules: true,
    scriptPath: "dist/server/index.js",
    compatibilityDate: "2026-05-22",
    compatibilityFlags: ["nodejs_compat"],
    d1Databases: ["DB"],
    r2Buckets: ["FILES"],
    assets: { directory: "dist/client", binding: "ASSETS", routerConfig: { has_user_worker: true, invoke_user_worker_ahead_of_assets: true }, assetConfig: { not_found_handling: "single-page-application", html_handling: "auto-trailing-slash" } },
    bindings: { ADMIN_USERNAME: "test-owner", ADMIN_PASSWORD_HASH: hash, SESSION_SECRET: secret, RESEND_API_KEY: "test-only", EMAIL_FROM: "test@example.invalid", LEAD_NOTIFY_TO: "test@example.invalid" },
    // No external notifications or network access from these tests.
    outboundService: () => new Response("Simulated email outage", { status: 503 }),
  })
  t.after(() => mf.dispose())
  const db = await mf.getD1Database("DB")
  for (const file of readdirSync("drizzle").filter(file => file.endsWith(".sql")).sort()) {
    const statements = readFileSync(`drizzle/${file}`, "utf8").replace(/--[^\n]*/g, "").split(";").map(sql => sql.trim()).filter(Boolean)
    await db.batch(statements.map(sql => db.prepare(sql)))
  }
  let cookie = ""
  const request = (path, options = {}) => mf.dispatchFetch(`https://school.test${path}`, {
    ...options,
    headers: { origin: "https://school.test", ...(cookie ? { cookie } : {}), ...options.headers },
  })
  const json = (path, method, value, headers) => request(path, { method, headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(value) })
  const login = async (username = "test-owner", pass = password) => {
    const response = await json("/api/auth/login", "POST", { username, password: pass })
    assert.equal(response.status, 200, await response.clone().text())
    const setCookie = response.headers.get("set-cookie")
    assert.match(setCookie, /HttpOnly/); assert.match(setCookie, /Secure/); assert.match(setCookie, /SameSite=Strict/)
    cookie = setCookie.split(";")[0]
    return cookie
  }
  await t.test("direct routes, canonical metadata, robots and real 404", async () => {
    for (const path of ["/", "/about", "/contact", "/sports-arena", "/admin", "/admin/login"]) {
      const response = await request(path)
      assert.equal(response.status, 200, `${path}: ${await response.clone().text()}`)
      assert.match(await response.text(), /id="root"/)
      if (path.startsWith("/admin")) assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow")
    }
    const about = await (await request("/about")).text()
    assert.match(about, /href="https:\/\/sanskarschools.com\/about"/)
    assert.equal((await request("/missing-page")).status, 404)
    assert.equal((await request("/api/unknown")).status, 404)
    assert.match(await (await request("/robots.txt")).text(), /Disallow: \/admin/)
    assert.match(await (await request("/sitemap.xml")).text(), /sports-arena/)
    const redirect = await mf.dispatchFetch("https://www.sanskarschools.com/about?x=1", { redirect: "manual" })
    assert.equal(redirect.status, 308)
    assert.equal(redirect.headers.get("location"), "https://sanskarschools.com/about?x=1")
  })
  await t.test("unauthenticated access, CSRF, login, session and replay after logout", async () => {
    assert.equal((await request("/api/admin/dashboard")).status, 401)
    assert.equal((await json("/api/auth/login", "POST", { username: "test-owner", password: "incorrect-password" })).status, 401)
    assert.equal((await json("/api/auth/login", "POST", { username: "test-owner", password }, { origin: "https://evil.test" })).status, 403)
    const oldCookie = await login()
    assert.equal((await request("/api/auth/session")).status, 200)
    assert.equal((await json("/api/auth/logout", "POST", {})).status, 200)
    assert.equal((await request("/api/admin/dashboard", { headers: { cookie: oldCookie } })).status, 401)
    await login()
  })
  await t.test("content and notices immediately available, unsafe content rejected", async () => {
    assert.equal((await json("/api/admin/content/settings", "PUT", { announcement: "Test announcement" })).status, 200)
    const publicContent = await request("/api/content")
    assert.equal(publicContent.headers.get("cache-control"), "no-store")
    assert.equal((await publicContent.json()).content.settings.announcement, "Test announcement")
    assert.equal((await json("/api/admin/content/notices", "PUT", [{ date: "Today", title: "Test notice", href: "/documents/test.pdf", type: "Circular" }])).status, 200)
    assert.equal((await (await request("/api/content")).json()).content.notices[0].title, "Test notice")
    assert.equal((await json("/api/admin/content/notices", "PUT", [{ date: "Today", title: "Unsafe", href: "javascript:alert(1)", type: "Circular" }])).status, 422)
    assert.equal((await json("/api/admin/content/notices", "PUT", {})).status, 422)
    const title = 'A <title> & "quotes"'
    await json("/api/admin/content/seo", "PUT", { "/about": { title, description: "Updated description" } })
    const html = await (await request("/about")).text()
    assert.match(html, /A &lt;title&gt;/)
    assert.match(html, /Updated description/)
  })
  const upload = async (name, type, bytes) => {
    const form = new FormData()
    form.set("file", new File([bytes], name, { type }))
    form.set("altText", "Test file")
    const encoded = new Request("https://school.test/api/admin/media", { method: "POST", body: form })
    return request("/api/admin/media", { method: "POST", body: await encoded.arrayBuffer(), headers: { "content-type": encoded.headers.get("content-type") } })
  }
  await t.test("image/PDF uploads, signatures, extensions, size, R2 retrieval and deletion", async () => {
    assert.equal((await upload("attack.svg", "image/svg+xml", "<svg/>")).status, 415)
    assert.equal((await upload("fake.png", "image/png", "<html>bad</html>")).status, 415)
    assert.equal((await upload("photo.html", "image/png", new Uint8Array([137,80,78,71,13,10,26,10]))).status, 415)
    assert.equal((await upload("big.png", "image/png", new Uint8Array(8 * 1024 * 1024 + 1))).status, 413)
    for (const [name, type, bytes] of [
      ["../../photo.png", "image/png", Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jkAAAAABJRU5ErkJggg==", "base64")],
      ["notice.pdf", "application/pdf", Buffer.from("%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\n%%EOF")],
    ]) {
      const response = await upload(name, type, bytes)
      assert.equal(response.status, 201, await response.clone().text())
      const media = (await response.json()).media
      const file = await request(media.url)
      assert.equal(file.status, 200); assert.equal(file.headers.get("content-type"), type)
      assert.deepEqual(Buffer.from(await file.arrayBuffer()), bytes)
      assert.equal((await request(media.url, { headers: { "if-none-match": file.headers.get("etag") } })).status, 304)
      assert.equal((await request(media.url, { method: "HEAD" })).status, 200)
      const row = await db.prepare("SELECT object_key FROM media WHERE id = ?").bind(media.id).first()
      assert.ok(!row.object_key.includes(".."))
      await json("/api/admin/content/notices", "PUT", [{ date: "Today", title: "Attached file", href: media.url, type: "Circular" }])
      assert.equal((await request(`/api/admin/media/${media.id}`, { method: "DELETE" })).status, 409)
      await json("/api/admin/content/notices", "PUT", [])
      assert.equal((await request(`/api/admin/media/${media.id}`, { method: "DELETE" })).status, 200)
      assert.equal((await request(media.url)).status, 404)
      assert.equal(await (await mf.getR2Bucket("FILES")).get(row.object_key), null)
    }
    await db.prepare("CREATE TRIGGER reject_media BEFORE INSERT ON media BEGIN SELECT RAISE(FAIL, 'Simulated database failure'); END").run()
    assert.equal((await upload("rollback.pdf", "application/pdf", Buffer.from("%PDF-1.4\n%%EOF"))).status, 500)
    assert.equal((await (await mf.getR2Bucket("FILES")).list()).objects.length, 0)
    await db.prepare("DROP TRIGGER reject_media").run()
  })
  await t.test("enquiry survives failed email and is visible in dashboard and CSV", async () => {
    const lead = { studentName: "=1+1", parentName: "Test Parent", phone: "9999999999", grade: "Grade 1", wing: "School", email: "", source: "automated-test" }
    const response = await json("/api/leads", "POST", lead)
    assert.equal(response.status, 201, await response.clone().text())
    const { id } = await response.json()
    for (let attempt = 0; attempt < 30; attempt++) {
      const saved = await db.prepare("SELECT email_status FROM leads WHERE id = ?").bind(id).first()
      if (saved.email_status === "failed") break
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    assert.equal((await db.prepare("SELECT email_status FROM leads WHERE id = ?").bind(id).first()).email_status, "failed")
    const dashboard = await (await request("/api/admin/dashboard")).json()
    assert.ok(dashboard.leads.some(lead => lead.id === id))
    assert.equal((await json(`/api/admin/leads/${id}`, "PATCH", { status: "contacted" })).status, 200)
    assert.match(await (await request("/api/admin/leads.csv")).text(), /'=1\+1/)
  })
  await t.test("account disable and password changes revoke existing sessions", async () => {
    const ownerCookie = cookie
    const pass = randomBytes(20).toString("hex")
    const response = await json("/api/admin/users", "POST", { username: "test-staff", displayName: "Test Staff", password: pass })
    assert.equal(response.status, 201)
    const { admin } = await response.json()
    const staffCookie = await login("test-staff", pass)
    assert.equal((await json("/api/admin/users", "POST", { username: "forbidden", displayName: "Forbidden", password: pass })).status, 403)
    cookie = ownerCookie
    assert.equal((await json(`/api/admin/users/${admin.id}`, "PATCH", { active: false })).status, 200)
    assert.equal((await request("/api/admin/dashboard", { headers: { cookie: staffCookie } })).status, 401)
    assert.equal((await json("/api/admin/change-password", "POST", { currentPassword: password, newPassword: randomBytes(20).toString("hex") })).status, 200)
    assert.equal((await request("/api/admin/dashboard")).status, 401)
  })
  await t.test("login rate limit", async () => {
    cookie = ""
    for (let attempt = 0; attempt < 7; attempt++) await json("/api/auth/login", "POST", { username: "test-owner", password: "wrong-password" }, { "cf-connecting-ip": "192.0.2.22" })
    assert.equal((await json("/api/auth/login", "POST", { username: "test-owner", password: "wrong-password" }, { "cf-connecting-ip": "192.0.2.22" })).status, 429)
  })
})
