interface Env extends Pick<CloudflareBindings, "DB" | "FILES" | "ASSETS"> {
  ADMIN_USERNAME?: string
  ADMIN_PASSWORD_HASH?: string
  SESSION_SECRET?: string
  RESEND_API_KEY?: string
  EMAIL_FROM?: string
  LEAD_NOTIFY_TO?: string
  INSTAGRAM_USER_ID?: string
  INSTAGRAM_ACCESS_TOKEN?: string
}
