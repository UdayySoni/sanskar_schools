export const INSTAGRAM_USERNAME = "sanskarpublicschoolmathura"
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_USERNAME}/`
export const SOCIAL_LINKS = [
  { name: "YouTube", icon: "youtube", url: "https://www.youtube.com/@sanskarpublicschoolmathura4604" },
  { name: "Instagram", icon: "instagram", url: INSTAGRAM_URL },
  { name: "LinkedIn", icon: "linkedin", url: "https://www.linkedin.com/company/sanskar-school-mathura" },
] as const

export type InstagramReel = {
  id: string
  caption: string
  permalink: string
  thumbnail: string
  video: string
  timestamp: string
}
export type InstagramFeed = {
  status: "ready" | "unavailable" | "not_configured"
  reels: InstagramReel[]
  updatedAt: string | null
}
