import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync, readdirSync } from "node:fs"
import { randomBytes, createHmac } from "node:crypto"
import { Miniflare } from "miniflare"
import { workerModules } from "./worker-modules.mjs"

test("production Worker: routes, authentication, content, D1, R2 and failed email", async t => {
  const secret = randomBytes(32).toString("hex")
  const password = randomBytes(20).toString("hex")
  const salt = randomBytes(16).toString("base64url")
  const hash = `hmac-sha256$${salt}$${createHmac("sha256", secret).update(`${salt}:${password}`).digest("base64url")}`
  const mf = new Miniflare({
    modules: workerModules,
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
  await t.test("search metadata, legacy redirects and structured data", async () => {
    const config = JSON.parse(readFileSync("seo.config.json", "utf8"))
    const titles = new Set()
    for (const [path, expected] of Object.entries(config)) {
      const response = await request(path)
      assert.equal(response.status, 200)
      const html = await response.text()
      const title = html.match(/<title>(.*?)<\/title>/s)?.[1]
      assert.ok(title && !titles.has(title), "unique title for " + path)
      titles.add(title)
      assert.ok(html.includes(expected.description.replaceAll("&", "&amp;")), path)
      if (["/virtual-tour", "/pay-fee"].includes(path)) {
        assert.match(response.headers.get("x-robots-tag"), /noindex/)
        continue
      }
      const raw = html.match(/<script id="site-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]
      const graph = JSON.parse(raw)["@graph"]
      assert.ok(graph.some(node => node["@type"] === "School" && node.identifier.value === "2132432"))
      assert.ok(graph.some(node => node.url === "https://sanskarschools.com" + path && node.name === expected.title))
      if (path !== "/") assert.ok(graph.some(node => node["@type"] === "BreadcrumbList"))
      assert.ok(!raw.includes('"foundingDate"'))
    }
    for (const [old, target] of [["/admission", "/admissions"], ["/contact-us", "/contact"], ["/about/", "/about"], ["/index.html", "/"]]) {
      const response = await request(old + "?source=search", {redirect:"manual"})
      assert.equal(response.status, 308)
      assert.equal(response.headers.get("location"), "https://sanskarschools.com" + target + "?source=search")
    }
    const sitemap = await (await request("/sitemap.xml")).text()
    assert.ok(!sitemap.includes("/pay-fee") && !sitemap.includes("/virtual-tour"))
  })
  await t.test("public content and blog articles are readable without JavaScript", async () => {
    const routes = JSON.parse(readFileSync("site.config.json", "utf8")).routes
    const sitemap = await (await request("/sitemap.xml")).text()
    for (const path of routes) {
      const response = await request(path)
      assert.equal(response.status, 200, path)
      const html = await response.text()
      assert.equal((html.match(/<h1[ >]/g) || []).length, 1, "one rendered h1: " + path)
      assert.equal((html.match(/name="description"/g) || []).length, 1, "one description: " + path)
      assert.equal((html.match(/property="og:title"/g) || []).length, 1, "one social title: " + path)
      assert.match(html, /href="\/blog"/, "crawlable blog navigation")
      assert.ok(!/<div hidden(?:="")? id="S:/.test(html), "no script-dependent hidden suspense content: " + path)
      if (path.startsWith("/blog/")) {
        assert.ok(sitemap.includes(path), "article in sitemap")
        assert.match(html, /<article>/)
        assert.match(html, /<h2/)
        assert.match(html, /"@type":"BlogPosting"/)
        assert.match(html, /property="og:type" content="article"/)
        assert.match(html, /"position":3/)
        assert.ok(!html.includes('rel="preload" href="/optimized/building01.jpg"'), "no irrelevant homepage preload")
      }
    }
    const achievements = await (await request("/achievements")).text()
    for (const [name, score] of [["Shrestha Sharma", "95.2%"], ["Krishna Kumar", "94%"], ["Piyush Kumar Pandey", "93.4%"], ["Manoj Kumar", "93.2%"], ["Sneha Chaudhary", "91.8%"], ["Jaidev Goyal", "90.2%"]]) {
      assert.ok(achievements.includes(name) && achievements.includes(score), name)
    }
    const portraits = [...achievements.matchAll(/<img[^>]+src="([^"]*toppers-2025-26[^"]*)"/g)]
    assert.equal(portraits.length, 6)
    for (const [, path] of portraits) {
      const response = await request(path)
      assert.equal(response.status, 200)
      assert.match(response.headers.get("content-type"), /image\/webp/)
    }
    assert.ok(!achievements.includes("Mayank Agrawal") && !achievements.includes("96.8%"))
    assert.ok(!/Rank\s*(?:<!--.*?-->)?\s*[123]/.test(achievements), "no topper rank labels")
    const missing = await request("/blog/nonexistent-guide")
    assert.equal(missing.status, 404)
    assert.match(missing.headers.get("x-robots-tag"), /noindex/)
  })
  await t.test("audit fixes: secure pages, responsive images and transparent editorial content", async () => {
    const response = await request("/")
    assert.match(response.headers.get("strict-transport-security"), /max-age=31536000/)
    const home = await response.text()
    for (const tag of home.match(/<img\b[^>]*>/g) || []) {
      assert.match(tag, /width="\d+"/)
      assert.match(tag, /height="\d+"/)
    }
    assert.match(home, /srcSet=/i)
    assert.match(home, /"@type":"PostalAddress"/)
    for (const path of ["/privacy", "/website-terms", "/editorial-policy"]) {
      assert.ok(home.includes(`href="${path}"`))
      assert.equal((await request(path)).status, 200)
    }
    const article = await (await request("/blog/top-10-schools-in-mathura-shortlist")).text()
    assert.match(article, /Top 3 schools in Mathura/)
    assert.match(article, /1\. Sanskar Public School/)
    assert.match(article, /10\. Jawahar Navodaya Vidyalaya/)
    assert.match(article, /AI-generated illustration/)
    assert.match(article, /mathura.nic.in/)
    assert.equal((await request("/llms.txt")).status, 200)
  })
  await t.test("AI discovery files and FAQ markup match public content without JavaScript", async () => {
    const site = JSON.parse(readFileSync("site.config.json", "utf8"))
    for (const path of ["/robots.txt", "/sitemap.xml", "/llms.txt", "/llms-full.txt"]) {
      const response = await request(path)
      assert.equal(response.status, 200)
      assert.match(response.headers.get("content-type"), path.endsWith(".xml") ? /application\/xml/ : /text\/plain/)
      const body = await response.text()
      assert.equal(body, readFileSync("public" + path, "utf8"), "build and Worker agree: " + path)
      const head = await request(path, { method: "HEAD" })
      assert.equal(head.status, 200)
      assert.equal(await head.text(), "")
      assert.equal((await request(path, { method: "POST" })).status, 405)
      if (path.startsWith("/llms")) {
        assert.ok(!body.includes("<html") && !body.includes("/api/"))
        for (const route of site.routes.filter(route => !site.nonIndexableRoutes.includes(route))) assert.ok(body.includes(site.url + route), route)
        for (const route of site.nonIndexableRoutes) assert.ok(!body.includes(site.url + route), route)
      }
    }
    const reference = await (await request("/llms-full.txt")).text()
    for (const path of ["/", "/admissions"]) {
      const html = await (await request(path)).text()
      const graph = JSON.parse(html.match(/<script id="site-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"]
      const faq = graph.filter(node => node["@type"] === "FAQPage")
      assert.equal(faq.length, 1)
      assert.equal(faq[0]["@id"], site.url + path + "#webpage")
      const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "").replace(/<[^>]*>/g, "").replaceAll("&amp;", "&").replaceAll("&#x27;", "'").replaceAll("&quot;", '"')
      for (const question of faq[0].mainEntity) {
        assert.ok(visible.includes(question.name), question.name)
        assert.ok(visible.includes(question.acceptedAnswer.text), question.name)
        assert.ok(reference.includes(question.acceptedAnswer.text), question.name)
      }
      for (const agent of ["Googlebot", "bingbot", "OAI-SearchBot", "PerplexityBot"]) {
        const response = await request(path, { headers: { "user-agent": agent } })
        assert.equal(response.status, 200)
        assert.equal(await response.text(), html, "same public content for " + agent)
      }
    }
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
    for (const path of ["/llms.txt", "/llms-full.txt"]) {
      const text = await (await request(path)).text()
      assert.match(text, /Updated description/)
    }
    assert.equal((await json("/api/admin/content/settings", "PUT", { primaryPhone: "98765 43210", email: "office@example.invalid" })).status, 200)
    for (const path of ["/llms.txt", "/llms-full.txt"]) {
      const text = await (await request(path)).text()
      assert.match(text, /98765 43210/)
      assert.match(text, /office@example.invalid/)
      assert.ok(!text.includes("sanskarschool2009@gmail.com"))
    }
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
