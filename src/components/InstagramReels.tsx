import { useEffect, useState } from "react"
import { INSTAGRAM_URL, INSTAGRAM_USERNAME, type InstagramFeed, type InstagramReel } from "../data/social"
import useInView from "../hooks/useInView"
import Icon from "./Icon"
import SocialIcon from "./SocialIcon"

function ReelCard({ reel }: { reel: InstagramReel }) {
  const { ref, inView } = useInView<HTMLVideoElement>()
  const [failed, setFailed] = useState(false)
  useEffect(() => { if (!inView) ref.current?.pause() }, [inView, ref])
  return <article className="min-w-0 overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm">
    {failed ? <a href={reel.permalink} target="_blank" rel="noopener noreferrer" className="flex h-64 items-center justify-center gap-2 bg-navy text-sm text-white sm:h-72"><Icon name="play" /> Watch on Instagram</a> :
      <video ref={ref} className="h-64 w-full bg-navy-deep object-contain sm:h-72" controls playsInline preload="none" poster={reel.thumbnail || undefined} src={reel.video} onError={() => setFailed(true)} aria-label={reel.caption || "Sanskar school reel"} />}
    <a href={reel.permalink} target="_blank" rel="noopener noreferrer" className="flex min-h-16 items-center gap-3 px-4 py-3 text-navy transition-colors hover:text-teal">
      <span className="min-w-0 flex-1"><span className="line-clamp-1 text-xs font-semibold">{reel.caption || "A moment at Sanskar"}</span><time dateTime={reel.timestamp} className="mt-1 block text-[11px] text-slate-500">{new Date(reel.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })}</time></span>
      <Icon name="external" size={15} className="shrink-0" />
    </a>
  </article>
}

export default function InstagramReels() {
  const { ref, inView } = useInView<HTMLElement>("350px", true)
  const [feed, setFeed] = useState<InstagramFeed | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!inView) return
    let disposed = false
    let pending = false
    const controller = new AbortController()
    const refresh = async () => {
      if (document.hidden || pending) return
      pending = true
      try {
        const response = await fetch("/api/instagram/reels", { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(12000)]) })
        if (!response.ok) throw new Error("Feed unavailable")
        const next: InstagramFeed = await response.json()
        if (!Array.isArray(next.reels)) throw new Error("Invalid feed")
        if (!disposed) setFeed(next)
      } catch {
        if (!disposed) setFeed({ status: "unavailable", reels: [], updatedAt: null })
      } finally {
        pending = false
        if (!disposed) setLoading(false)
      }
    }
    void refresh()
    const interval = window.setInterval(() => { void refresh() }, 15 * 60 * 1000)
    const onVisible = () => { if (!document.hidden) void refresh() }
    document.addEventListener("visibilitychange", onVisible)
    return () => { disposed = true; controller.abort(); window.clearInterval(interval); document.removeEventListener("visibilitychange", onVisible) }
  }, [inView])

  return <section id="instagram" ref={ref} aria-labelledby="instagram-title" className="border-b border-navy/5 bg-cream py-10 lg:py-12">
    <div className="container grid items-center gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
      <div>
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-teal"><SocialIcon name="instagram" size={18} /> Beyond the classroom</span>
        <h2 id="instagram-title" className="mt-3 text-navy">Little moments. Big memories.</h2>
        <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-slate-600">A glimpse of learning, laughter and everyday life at Sanskar.</p>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-navy transition-colors hover:text-teal">@{INSTAGRAM_USERNAME} <Icon name="external" size={16} /></a>
      </div>
      <div aria-busy={loading}>
        {loading ? <div className="grid grid-cols-2 gap-3" role="status"><span className="sr-only">Loading school reels</span>{[0, 1].map(item => <div key={item} className="h-80 animate-pulse rounded-2xl bg-navy/5" />)}</div> : feed?.reels.length ?
          <div className="grid grid-cols-2 gap-3 sm:gap-4">{feed.reels.slice(0, 2).map(reel => <ReelCard key={reel.id} reel={reel} />)}</div> :
          <a href={`${INSTAGRAM_URL}reels/`} target="_blank" rel="noopener noreferrer" className="group flex min-h-40 items-center gap-5 rounded-2xl border border-navy/10 bg-white p-6 transition-colors hover:border-teal/40">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#e9f4f2] text-teal"><SocialIcon name="instagram" size={28} /></span>
            <span><span className="block text-base font-semibold text-navy">Catch up with Sanskar</span><span className="mt-2 block text-sm leading-relaxed text-slate-600">Watch our latest reels on Instagram.</span><span className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-teal">Explore our reels <Icon name="arrow" size={16} /></span></span>
          </a>}
      </div>
    </div>
  </section>
}
