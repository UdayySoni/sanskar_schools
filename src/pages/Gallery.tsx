import { useState } from "react"
import AcademicShapes from "../components/AcademicShapes"
import Icon from "../components/Icon"
import PageHero from "../components/PageHero"
import Reveal from "../components/Reveal"
import { useSiteContent } from "../context/SiteContent"
import {
  GALLERY,
  LIVE_GALLERY,
  SCHOOL_VIDEOS,
  YOUTUBE_CHANNEL,
} from "../data/site"
import { usePageMeta } from "../hooks/usePageMeta"

const categories = [
  "All",
  "Learning",
  "Early years",
  "Campus",
  "Culture",
  "Sports",
  "Values",
  "Community",
] as const
const categoryMap: Record<string, string> = {
  Science: "Learning",
  "Applied learning": "Learning",
  "Annual function": "Culture",
  "Performing arts": "Culture",
  "Junior school": "Early years",
  Sanskar: "Values",
  Sports: "Sports",
  "School community": "Community",
}

const photographs = [
  ...GALLERY.map((item) => ({
    ...item,
    group: categoryMap[item.category] ?? "Community",
  })),
  ...LIVE_GALLERY.map((item) => ({ ...item, group: item.category })),
]

export default function Gallery() {
  const { media } = useSiteContent()
  const [filter, setFilter] = useState<typeof categories[number]>("All")
  const allPhotographs = [
    ...media
      .filter((item) => item.contentType.startsWith("image/"))
      .map((item) => ({
        image: item.url,
        title: item.altText || item.fileName,
        category: item.category,
        group: item.category,
      })),
    ...photographs,
  ]
  const visible =
    filter === "All"
      ? allPhotographs
      : allPhotographs.filter((item) => item.group === filter)
  usePageMeta({
    title: "School Photo & Video Gallery | Sanskar Public School Mathura",
    description:
      "Explore official photos and videos of academics, laboratories, Li'l Winners, sports, arts, yoga, robotics and school life at Sanskar Public School Mathura.",
    keywords:
      "Sanskar Public School photos, school video gallery Mathura, school campus images Mathura, student activities Mathura, CBSE school gallery Mathura",
    path: "/gallery",
    image: "/optimized/gallery-campus-slide-3.jpg",
  })

  return (
    <div className="bg-cream">
      <PageHero
        eyebrow="Official photo & video gallery"
        title="Real moments. Shared growth."
        description="Explore the photographs and videos published by Sanskar—from laboratories and Li'l Winners to sport, culture and mindful learning."
        image="/optimized/gallery-campus-slide-7.jpg"
        imageAlt="Sanskar students performing at the annual function"
      />

      <section className="relative overflow-hidden py-20 lg:py-28">
        <AcademicShapes className="opacity-70" />
        <div className="container relative z-10">
          <Reveal className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <p className="eyebrow">Life at Sanskar</p>
              <h2 className="section-title mt-4">The school in pictures.</h2>
              <p className="section-copy mt-5 max-w-2xl">
                Official images collected from the school’s live website,
                organised so families can explore each part of the learning
                experience.
              </p>
            </div>
            <div
              className="flex max-w-2xl flex-wrap gap-2"
              role="group"
              aria-label="Filter gallery"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFilter(category)}
                  aria-pressed={filter === category}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    filter === category
                      ? "bg-navy text-white"
                      : "border border-navy/15 bg-white text-navy hover:border-navy/40"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="mt-12 grid auto-rows-[260px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item, index) => (
              <Reveal
                key={`${item.image}-${index}`}
                delay={(index % 3) * 45}
                className={`group relative overflow-hidden rounded-[1.75rem] bg-slate-200 ${
                  index % 7 === 0 ? "sm:row-span-2" : ""
                }`}
              >
                <img
                  src={item.image}
                  alt={`${item.title} at Sanskar Public School Mathura`}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  loading={index > 5 ? "lazy" : "eager"}
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-[.15em] text-gold">
                    {item.category}
                  </span>
                  <h3 className="mt-1 font-display text-2xl font-semibold">
                    {item.title}
                  </h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy-deep py-20 text-white lg:py-28">
        <AcademicShapes tone="dark" className="opacity-80" />
        <div className="container relative z-10">
          <Reveal className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <p className="eyebrow eyebrow-light">Watch Sanskar</p>
              <h2 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[1.03] sm:text-6xl">
                Stories from school life, on video.
              </h2>
            </div>
            <a
              href={YOUTUBE_CHANNEL}
              target="_blank"
              rel="noreferrer"
              className="button button-gold shrink-0"
            >
              Visit YouTube channel <Icon name="external" size={17} />
            </a>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {SCHOOL_VIDEOS.map((video, index) => (
              <Reveal
                key={video.id}
                delay={index * 80}
                className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[.06]"
              >
                <div className="aspect-video">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="flex items-center gap-4 p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-navy">
                    <Icon name="play" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.14em] text-gold">
                      Official Sanskar video
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-semibold">
                      {video.title}
                    </h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
