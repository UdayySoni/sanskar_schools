import { test } from "node:test"
import assert from "node:assert/strict"
import { Miniflare } from "miniflare"
import { workerModules } from "./worker-modules.mjs"

const options = {
  modules: workerModules,
  compatibilityDate: "2026-05-22",
  compatibilityFlags: ["nodejs_compat"],
  r2Buckets: ["FILES"],
}
const reel = (id, timestamp) => ({ id, timestamp, media_product_type: "REELS", caption: `School reel ${id}`, permalink: `https://www.instagram.com/reel/${id}/`, thumbnail_url: `https://scontent.cdninstagram.com/${id}.jpg`, media_url: `https://scontent.cdninstagram.com/${id}.mp4` })

test("Instagram without credentials exposes a useful empty state and makes no external calls", async t => {
  const mf = new Miniflare({ ...options, outboundService: () => { assert.fail("Unconfigured feed must not contact Meta") } })
  t.after(() => mf.dispose())
  const response = await mf.dispatchFetch("https://school.test/api/instagram/reels")
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { status: "not_configured", reels: [], updatedAt: null })
})

test("Instagram sync filters and paginates reels, caches privately, refreshes tokens and handles outages", async t => {
  const seed = "test-only-instagram-token"
  let calls = 0, refreshes = 0, fail = false, wrongAccount = false, empty = false, single = false
  let expectedToken = seed
  const mf = new Miniflare({
    ...options,
    bindings: { INSTAGRAM_USER_ID: "12345", INSTAGRAM_ACCESS_TOKEN: seed },
    outboundService: async request => {
      calls++
      const url = new URL(request.url)
      assert.equal(url.hostname, "graph.instagram.com")
      if (fail) return new Response("Simulated Meta failure", { status: 503 })
      if (url.pathname === "/refresh_access_token") {
        assert.equal(url.searchParams.get("grant_type"), "ig_refresh_token")
        assert.equal(url.searchParams.get("access_token"), seed)
        refreshes++
        expectedToken = "refreshed-test-token"
        return Response.json({ access_token: expectedToken, expires_in: 5184000 })
      }
      assert.equal(request.headers.get("authorization"), `Bearer ${expectedToken}`)
      assert.equal(url.searchParams.has("access_token"), false)
      if (url.pathname.endsWith("/12345")) return Response.json({ username: wrongAccount ? "different_school" : "sanskarpublicschoolmathura" })
      assert.ok(url.pathname.endsWith("/12345/media"))
      if (empty) return Response.json({ data: [] })
      if (single) return Response.json({ data: [reel("only", "2026-09-25T10:00:00Z")] })
      if (!url.searchParams.has("after")) return Response.json({ data: [{ id: "photo", media_product_type: "FEED" }], paging: { next: "https://example.invalid/do-not-follow-raw-paging-url", cursors: { after: "page2" } } })
      assert.equal(url.searchParams.get("after"), "page2")
      return Response.json({ data: [
        reel("old", "2026-09-22T10:00:00Z"),
        reel("latest", "2026-09-25T10:00:00Z"),
        reel("second", "2026-09-24T10:00:00Z"),
        reel("latest", "2026-09-25T10:00:00Z"),
        { ...reel("bad-link", "2026-09-26T10:00:00Z"), permalink: "javascript:alert(1)" },
        { ...reel("bad-video", "2026-09-26T10:00:00Z"), media_url: "https://attacker.example/video.mp4" },
      ] })
    },
  })
  t.after(() => mf.dispose())
  const request = () => mf.dispatchFetch("https://school.test/api/instagram/reels")
  const bucket = await mf.getR2Bucket("FILES")
  const expire = async patch => {
    const { objects } = await bucket.list({ prefix: "_integrations/instagram/" })
    assert.equal(objects.length, 1)
    const state = await (await bucket.get(objects[0].key)).json()
    await bucket.put(objects[0].key, JSON.stringify({ ...state, nextAttempt: 0, ...patch }))
  }

  await t.test("returns the latest two safe, unique reels after paging past photos", async () => {
    const response = await request()
    assert.equal(response.status, 200)
    const body = await response.text()
    const feed = JSON.parse(body)
    assert.equal(feed.status, "ready")
    assert.deepEqual(feed.reels.map(item => item.id), ["latest", "second"])
    assert.equal(calls, 3)
    assert.ok(!body.includes(seed) && !body.includes("refreshedAt"))
    assert.ok(feed.updatedAt)
  })
  await t.test("serves cached reels without contacting Meta", async () => {
    const before = calls
    assert.equal((await (await request()).json()).reels.length, 2)
    assert.equal(calls, before)
  })
  await t.test("refreshes a long-lived token after seven days and persists it privately", async () => {
    await expire({ refreshedAt: Date.now() - 8 * 86400000 })
    const response = await request()
    const body = await response.text()
    assert.equal(JSON.parse(body).status, "ready")
    assert.equal(refreshes, 1)
    assert.ok(!body.includes(expectedToken))
    await expire({})
    assert.equal((await (await request()).json()).status, "ready")
    assert.equal(refreshes, 1)
  })
  await t.test("keeps recent cached reels during a Meta outage and backs off", async () => {
    fail = true
    await expire({})
    const feed = await (await request()).json()
    assert.equal(feed.status, "unavailable")
    assert.equal(feed.reels.length, 2)
    const before = calls
    await request()
    assert.equal(calls, before)
  })
  await t.test("removes old signed media URLs and never exposes private state", async () => {
    await expire({ checkedAt: Date.now() - 2 * 86400000 })
    const response = await request()
    const text = await response.text()
    assert.deepEqual(JSON.parse(text).reels, [])
    assert.ok(!text.includes(seed) && !text.includes(expectedToken))
  })
  await t.test("rejects a token for another school's account", async () => {
    fail = false; wrongAccount = true
    await expire({ reels: [] })
    const feed = await (await request()).json()
    assert.equal(feed.status, "unavailable")
    assert.deepEqual(feed.reels, [])
    wrongAccount = false
  })
  await t.test("handles accounts with zero or one reel without inventing posts", async () => {
    empty = true
    await expire({})
    let feed = await (await request()).json()
    assert.equal(feed.status, "ready")
    assert.deepEqual(feed.reels, [])
    empty = false; single = true
    await expire({})
    feed = await (await request()).json()
    assert.deepEqual(feed.reels.map(item => item.id), ["only"])
  })
})
