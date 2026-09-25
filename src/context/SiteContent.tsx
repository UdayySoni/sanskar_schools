import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { NOTICES } from "../data/site"
import schoolProfile from "../data/school-profile.json"

export type EditableNotice = {
  id?: string
  date: string
  title: string
  href: string
  type: string
}

export type BoardItem = {
  id?: string
  title: string
  date: string
  label: string
  summary: string
  image: string
  href: string
}

export type EditableTestimonial = {
  id?: string
  name: string
  quote: string
  image: string
}

export type SportsArenaContent = {
  eyebrow: string
  title: string
  introduction: string
  image: string
  bookingUrl: string
  bookingLabel: string
  highlights: string[]
}

export type SiteSettings = {
  announcement: string
  tagline: string
  themeLine: string
  heroOptionalLine: string
  heroTitle: string
  heroAccent: string
  heroCopy: string
  heroImage: string
  primaryPhone: string
  secondaryPhone: string
  email: string
  address: string
}

export type MediaItem = {
  id: string
  fileName: string
  contentType: string
  size: number
  altText: string
  category: string
  createdAt: number
  url: string
}

export type SiteContentValue = {
  settings: SiteSettings
  notices: EditableNotice[]
  programmes: BoardItem[]
  happenings: BoardItem[]
  testimonials: EditableTestimonial[]
  sportsArena: SportsArenaContent
  media: MediaItem[]
}

export const DEFAULT_SETTINGS: SiteSettings = {
  announcement: "Admissions open · Academic Session 2026–27",
  tagline: "Indian Soch, International Approach",
  themeLine: "Mathura's 1st school with Modern Vedic Curriculum",
  heroOptionalLine: "",
  heroTitle: "A leading CBSE school in Mathura.",
  heroAccent: "Rooted in Indian values.",
  heroCopy:
    "CBSE academics, Indian values, arts and sport for children from Mathura and Vrindavan. A place to learn, ask questions and grow with confidence.",
  heroImage: "/optimized/building01.jpg",
  primaryPhone: schoolProfile.primaryPhone,
  secondaryPhone: schoolProfile.secondaryPhone,
  email: schoolProfile.email,
  address: schoolProfile.address,
}

export const DEFAULT_PROGRAMMES: BoardItem[] = [
  {
    id: "admissions-2026",
    title: "Admissions counselling 2026–27",
    date: "Open now",
    label: "Admissions",
    summary:
      "Meet the admissions team, understand the learning journey and plan a guided campus visit.",
    image: "/optimized/building01.jpg",
    href: "/admissions#enquiry",
  },
  {
    id: "talent-academy-batches",
    title: "Talent Academy skill batches",
    date: "New batches this term",
    label: "Sports coaching",
    summary:
      "Progressive coaching opportunities in badminton, basketball, swimming, skating and taekwondo.",
    image: "/optimized/talent-academy-training.jpg",
    href: "/talent-academy",
  },
  {
    id: "campus-visit",
    title: "Parent campus experience",
    date: "By appointment",
    label: "School community",
    summary:
      "See classrooms, laboratories, creative spaces and the values-led learning environment in action.",
    image: "/optimized/gallery-campus-slide-3.jpg",
    href: "/contact",
  },
]

export const DEFAULT_HAPPENINGS: BoardItem[] = [
  {
    id: "vedic-maths",
    title: "Vedic mathematics in practice",
    date: "Happening this week",
    label: "Modern Vedic curriculum",
    summary:
      "Learners are strengthening number sense, speed and confidence through guided Vedic mathematics activities.",
    image: "/optimized/live-vedic-maths.jpg",
    href: "/academics",
  },
  {
    id: "robotics-projects",
    title: "Robotics and AI projects",
    date: "Across the labs",
    label: "Future-ready learning",
    summary:
      "Student teams are moving from ideas to working models through coding, robotics and hands-on collaboration.",
    image: "/optimized/live-robotics.jpg",
    href: "/gallery",
  },
  {
    id: "sports-practice",
    title: "Inter-house sports practice",
    date: "On campus now",
    label: "Physical confidence",
    summary:
      "Regular practice is building movement skills, teamwork and the confidence to compete with character.",
    image: "/optimized/live-outdoor-sports.jpg",
    href: "/sports-arena",
  },
]

export const DEFAULT_TESTIMONIALS: EditableTestimonial[] = [
  {
    id: "shiv-shankar",
    name: "Shiv Shankar",
    quote:
      "The school works on every aspect of my child—academics, Vedic maths, activities and, most importantly, Sanskar. The transformation is wonderful to see.",
    image: "https://sanskarschools.com/images/testimonial/t1.png",
  },
  {
    id: "mandita-rana",
    name: "Mandita Rana",
    quote:
      "My child has made significant progress at Sanskar. The teaching approach feels thoughtful, structured and genuinely supportive.",
    image: "https://sanskarschools.com/images/testimonial/t4.png",
  },
  {
    id: "rakesh",
    name: "Rakesh",
    quote:
      "The well-rounded curriculum, dedicated faculty and innovative approach create a stimulating environment that prepares students for success.",
    image: "https://sanskarschools.com/images/testimonial/t5.png",
  },
  {
    id: "antriksh-singh",
    name: "Antriksh Singh",
    quote:
      "The school encourages children to think creatively and gives them many opportunities to excel in their areas of interest.",
    image: "https://sanskarschools.com/images/testimonial/t11.png",
  },
]

export const DEFAULT_SPORTS_ARENA: SportsArenaContent = {
  eyebrow: "Book, play and move",
  title: "Sanskar Sports Arena",
  introduction:
    "A multi-sport destination in Mathura for casual play, active families and school-day physical development—with courts, grounds, skating and swimming in one connected environment.",
  image: "/optimized/sports_arena.jpg",
  bookingUrl: "https://kourts.in",
  bookingLabel: "Book on Kourts",
  highlights: [
    "Indoor badminton courts",
    "Basketball and pickleball",
    "Table tennis and chess",
    "Box cricket and outdoor play",
    "Skating practice space",
    "Swimming pool access",
  ],
}

const fallback: SiteContentValue = {
  settings: DEFAULT_SETTINGS,
  notices: NOTICES,
  programmes: DEFAULT_PROGRAMMES,
  happenings: DEFAULT_HAPPENINGS,
  testimonials: DEFAULT_TESTIMONIALS,
  sportsArena: DEFAULT_SPORTS_ARENA,
  media: [],
}

const SiteContentContext = createContext<SiteContentValue>(fallback)

let publicContentRequest: Promise<Partial<SiteContentValue>> | null = null

async function loadPublicContent() {
  if (!publicContentRequest) {
    publicContentRequest = Promise.all([
      fetch("/api/content").then((response) =>
        response.ok ? response.json() as Promise<{ content: Partial<SiteContentValue> }> : null,
      ),
      fetch("/api/media").then((response) =>
        response.ok ? response.json() as Promise<{ media: MediaItem[] }> : null,
      ),
    ])
      .then(([contentResponse, mediaResponse]) => ({
        settings: contentResponse?.content?.settings,
        notices: contentResponse?.content?.notices,
        programmes: contentResponse?.content?.programmes,
        happenings: contentResponse?.content?.happenings,
        testimonials: contentResponse?.content?.testimonials,
        sportsArena: contentResponse?.content?.sportsArena,
        media: mediaResponse?.media,
      }))
      .catch(() => ({}))
      .finally(() => { publicContentRequest = null })
  }
  return publicContentRequest
}

export function SiteContentProvider({ children, initialContent }: { children: React.ReactNode; initialContent?: Partial<SiteContentValue> }) {
  const [content, setContent] = useState<SiteContentValue>(() => ({ ...fallback, ...initialContent, settings: { ...DEFAULT_SETTINGS, ...initialContent?.settings }, sportsArena: { ...DEFAULT_SPORTS_ARENA, ...initialContent?.sportsArena } }))

  useEffect(() => {
    let active = true
    const refresh = () => loadPublicContent().then((remote) => {
      if (!active) return
      setContent({
        settings: { ...DEFAULT_SETTINGS, ...(remote.settings ?? {}) },
        notices: Array.isArray(remote.notices) ? remote.notices : NOTICES,
        programmes: Array.isArray(remote.programmes)
          ? remote.programmes
          : DEFAULT_PROGRAMMES,
        happenings: Array.isArray(remote.happenings)
          ? remote.happenings
          : DEFAULT_HAPPENINGS,
        testimonials: Array.isArray(remote.testimonials)
          ? remote.testimonials
          : DEFAULT_TESTIMONIALS,
        sportsArena: {
          ...DEFAULT_SPORTS_ARENA,
          ...(remote.sportsArena ?? {}),
        },
        media: Array.isArray(remote.media) ? remote.media : [],
      })
    })
    void refresh()
    const onFocus = () => { void refresh() }
    window.addEventListener("focus", onFocus)
    return () => {
      window.removeEventListener("focus", onFocus)
      active = false
    }
  }, [])

  const value = useMemo(() => content, [content])
  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  )
}

export function useSiteContent() {
  return useContext(SiteContentContext)
}
