import { prerender } from "react-dom/static.browser"
import { StaticRouter } from "react-router-dom"
import { AppRoutes } from "./App"
import type { SiteContentValue } from "./context/SiteContent"

// Render the same public application for every visitor; no user-agent branching.
export default async function renderPage(path: string, content: Partial<SiteContentValue>) {
  // Wait for lazy routes before emitting HTML, so content is visible without scripts.
  const { prelude } = await prerender(<StaticRouter location={path}><AppRoutes initialContent={content} /></StaticRouter>, {
    // Keep completed Suspense content inline, including pages larger than React's
    // default 12.8 KB boundary threshold. Hidden streamed segments need JavaScript.
    progressiveChunkSize: Number.MAX_SAFE_INTEGER,
  })
  return prelude
}
