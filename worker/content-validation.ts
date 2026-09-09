import { z } from "zod"

const text = z.string().max(10000)
const url = z.string().max(2048).refine(value => {
  if (!value) return true
  if (/[\u0000-\u0020\\]/.test(value)) return false
  if (value.startsWith("/") && !value.startsWith("//")) return true
  if (value.startsWith("#")) return true
  try { return ["https:", "mailto:", "tel:"].includes(new URL(value).protocol) } catch { return false }
}, "Use a relative URL or an HTTPS, email or phone link.")
const id = z.string().max(100).optional()
const board = z.object({ id, title: text, date: text, label: text, summary: text, image: url, href: url })
export const contentSchemas: Record<string, z.ZodType> = {
  settings: z.object({ announcement: text, tagline: text, themeLine: text, heroOptionalLine: text,
    heroTitle: text, heroAccent: text, heroCopy: text, heroImage: url, primaryPhone: text,
    secondaryPhone: text, email: text, address: text }).partial(),
  notices: z.array(z.object({ id, date: text, title: text, href: url, type: text })).max(500),
  programmes: z.array(board).max(100),
  happenings: z.array(board).max(100),
  testimonials: z.array(z.object({ id, name: text, quote: text, image: url })).max(100),
  sportsArena: z.object({ eyebrow: text, title: text, introduction: text, image: url,
    bookingUrl: url, bookingLabel: text, highlights: z.array(text).max(100) }).partial(),
  seo: z.record(z.string().regex(/^\/(?:[a-zA-Z0-9/_-]*)$/), z.object({ title: z.string().max(200), description: z.string().max(1000) })),
}
