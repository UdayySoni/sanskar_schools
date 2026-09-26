import { z } from "zod"
import { INSTAGRAM_USERNAME, type InstagramFeed, type InstagramReel } from "../src/data/social"

const API = "https://graph.instagram.com/v25.0"
const FIFTEEN_MINUTES = 15 * 60 * 1000
const WEEK = 7 * 24 * 60 * 60 * 1000
const DAY = 24 * 60 * 60 * 1000

type FeedState = {
  token: string
  refreshedAt: number
  checkedAt: number
  nextAttempt: number
  reels: InstagramReel[]
  status: InstagramFeed["status"]
}

const mediaSchema = z.object({
  id: z.string(),
  media_product_type: z.string().optional(),
  caption: z.string().optional(),
  permalink: z.string().optional(),
  thumbnail_url: z.string().optional(),
  media_url: z.string().optional(),
  timestamp: z.string().optional(),
})
const pageSchema = z.object({
  data: z.array(mediaSchema).max(100),
  paging: z.object({ next: z.string().optional(), cursors: z.object({ after: z.string().optional() }).optional() }).optional(),
})

function safeUrl(value: string | undefined, kind: "permalink" | "media") {
  if (!value) return ""
  try {
    const url = new URL(value)
    if (url.protocol !== "https:" || url.username || url.password) return ""
    if (kind === "permalink") return ["www.instagram.com", "instagram.com"].includes(url.hostname) && /^\/(reel|reels|p)\/[\w-]+\/?$/.test(url.pathname) ? url.href : ""
    return ["cdninstagram.com", "fbcdn.net"].some(host => url.hostname === host || url.hostname.endsWith(`.${host}`)) ? url.href : ""
  } catch { return "" }
}

async function graph(path: string, token: string, fields: Record<string, string>, signal: AbortSignal) {
  const url = new URL(`${API}/${path}`)
  Object.entries(fields).forEach(([key, value]) => url.searchParams.set(key, value))
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, signal, redirect: "manual" })
  if (!response.ok) throw new Error("Instagram request failed")
  return response.json()
}

async function latestReels(userId: string, token: string, signal: AbortSignal) {
  const profile = z.object({ username: z.string() }).parse(await graph(userId, token, { fields: "username" }, signal))
  if (profile.username.toLowerCase() !== INSTAGRAM_USERNAME) throw new Error("Instagram account mismatch")
  const reels: InstagramReel[] = []
  let after = ""
  // Instagram returns media newest first. Page past photos to find two actual reels.
  for (let page = 0; page < 10; page++) {
    const payload = pageSchema.parse(await graph(`${userId}/media`, token, {
      fields: "id,caption,media_product_type,media_url,thumbnail_url,permalink,timestamp",
      limit: "100",
      ...(after ? { after } : {}),
    }, signal))
    for (const media of payload.data) {
      if (media.media_product_type !== "REELS" || reels.some(reel => reel.id === media.id)) continue
      const permalink = safeUrl(media.permalink, "permalink")
      const video = safeUrl(media.media_url, "media")
      if (!permalink || !video || !media.timestamp || !Number.isFinite(Date.parse(media.timestamp))) continue
      reels.push({ id: media.id, caption: (media.caption || "").slice(0, 2200), permalink, video, thumbnail: safeUrl(media.thumbnail_url, "media"), timestamp: media.timestamp })
    }
    if (reels.length >= 2 || !payload.paging?.next) break
    const cursor = payload.paging.cursors?.after
    if (!cursor || cursor === after) throw new Error("Instagram pagination unavailable")
    after = cursor
    if (page === 9) throw new Error("Instagram pagination limit reached")
  }
  return reels.sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)).slice(0, 2)
}

function publicFeed(state: FeedState): InstagramFeed {
  return {
    status: state.status,
    // Signed media URLs can expire; do not show indefinitely stale previews.
    reels: Date.now() - state.checkedAt < DAY ? state.reels : [],
    updatedAt: state.checkedAt ? new Date(state.checkedAt).toISOString() : null,
  }
}

export async function syncInstagram(env: Env): Promise<InstagramFeed> {
  const seed = env.INSTAGRAM_ACCESS_TOKEN
  const userId = env.INSTAGRAM_USER_ID
  if (!seed || !userId || !/^\d+$/.test(userId)) return { status: "not_configured", reels: [], updatedAt: null }
  // Rotating the secret/account automatically starts a new private cache.
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${userId}:${seed}`))
  const fingerprint = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("")
  const key = `_integrations/instagram/${fingerprint}.json`
  const saved = await env.FILES.get(key)
  const now = Date.now()
  const state: FeedState = saved ? await saved.json<FeedState>() : { token: seed, refreshedAt: now, checkedAt: 0, nextAttempt: 0, reels: [], status: "unavailable" }
  if (now < state.nextAttempt) return publicFeed(state)
  const signal = AbortSignal.timeout(8000)
  try {
    if (now - state.refreshedAt >= WEEK) {
      const url = new URL("https://graph.instagram.com/refresh_access_token")
      url.searchParams.set("grant_type", "ig_refresh_token")
      url.searchParams.set("access_token", state.token)
      const response = await fetch(url, { signal, redirect: "manual" })
      if (!response.ok) throw new Error("Instagram token refresh failed")
      const refreshed = z.object({ access_token: z.string().min(1) }).parse(await response.json())
      state.token = refreshed.access_token
      state.refreshedAt = now
    }
    state.reels = await latestReels(userId, state.token, signal)
    state.checkedAt = now
    state.nextAttempt = now + FIFTEEN_MINUTES
    state.status = "ready"
  } catch (caught) {
    // Never log Meta responses, token-bearing URLs, or the private state.
    console.warn("Instagram sync unavailable; retrying in five minutes", caught instanceof Error ? caught.name : "UnknownError")
    state.status = "unavailable"
    state.nextAttempt = now + 5 * 60 * 1000
  }
  // This object has no media database record and is never served by /api/media.
  await env.FILES.put(key, JSON.stringify(state), { httpMetadata: { contentType: "application/json" } })
  return publicFeed(state)
}

export async function instagramResponse(env: Env) {
  try {
    return Response.json(await syncInstagram(env), { headers: { "cache-control": "no-store", "x-content-type-options": "nosniff" } })
  } catch {
    return Response.json({ status: "unavailable", reels: [], updatedAt: null }, { status: 503, headers: { "cache-control": "no-store" } })
  }
}
