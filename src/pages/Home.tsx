import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import AcademicShapes from "../components/AcademicShapes"
import Icon from "../components/Icon"
import MotionBackground from "../components/MotionBackground"
import Reveal from "../components/Reveal"
import { useSiteContent } from "../context/SiteContent"
import {
  GALLERY,
  PAYMENT_LINKS,
  STA_PORTAL,
  TOPPERS,
} from "../data/site"
import { usePageMeta } from "../hooks/usePageMeta"
import SchoolGuide from "../components/SchoolGuide"

export const LEADERSHIP = [
  {
    role: "Chairman",
    name: "R.P. Singhal",
    photo: "/optimized/rpsinghalsir.jpg",
    message:
      "Dear Parents,\n\nEducation is one of life’s few treasures that can never be taken away. Marks matter, but they are not the full measure of a child. Practical knowledge, depth of learning, responsibility and the courage to pursue meaningful dreams are what shape a successful life.\n\nAt Sanskar, our purpose is to help every learner become capable, grounded and, above all, a good human being. We encourage students to use every opportunity well, remain honest to their priorities and meet life with curiosity and confidence.\n\nGod bless you all.",
  },
  {
    role: "Founder Director",
    name: "Rama Singhal",
    photo: "/optimized/ramasinghalmam.jpg",
    message:
      "Dear Parents,\n\nAs the world moves faster, values remain essential. At Sanskar, modern methods and experienced teachers work alongside the timeless qualities of respect, compassion and responsibility. That balance is at the heart of our name and our work.\n\nEvery child is unique. When parents and teachers understand a child together, we can build on individual strengths and help that learner discover a confident path. Thank you to every family that has placed its trust in Sanskar; we remain committed to nurturing the next generation with care and purpose.\n\nGod bless you all.",
  },
  {
    role: "Managing Director",
    name: "Akash Singhal",
    photo: "/optimized/akashsinghalsir.jpg",
    message:
      "Dear Parents,\n\nSanskar draws inspiration from the idea that our actions shape who we become. We aim to make learning come alive every day through thoughtful pedagogy, real opportunity and an environment that encourages students to turn the ordinary into the extraordinary.\n\nOur vision is a modern gurukul: a school that prepares young people for a changing world while keeping them connected to character, community and Indian roots. Together, we seek to transform each person into a well-rounded personality and a proactive global citizen.\n\nGod bless you.",
  },
  {
    role: "Director",
    name: "Rishabh Singhal",
    photo: "/optimized/rishabhsinghalsir.jpg",
    message:
      "Dear Parents,\n\nTrue education is a harmony of knowledge, character and the confidence to act. Our responsibility is to create an environment where every child feels seen, challenged and supported.\n\nAt Sanskar, classrooms, clubs, sports and value education are connected parts of one journey. We want students to ask better questions, work well with others and carry both competence and compassion into the world beyond school.\n\nWarm regards.",
  },
  {
    role: "Director",
    name: "Akansha Singhal",
    photo: "/optimized/director-mam.jpg",
    message:
      "Dear Parents,\n\nI believe every child carries a unique spark waiting to be discovered. At Sanskar Public School, our aim is to nurture that spark by creating an environment where children are encouraged to dream boldly, explore fearlessly and grow with confidence.\n\nEducation, to me, is not only about preparing children for a successful future, but about helping them become thoughtful, capable and compassionate individuals. We strive to make every learning experience meaningful, inspiring our students to discover their strengths and use them to make a positive difference in the world.\n\nTogether, let us inspire young minds to dream, discover and achieve.",
  },
]

export const leaderSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
export const leaderExcerpt = (message: string, length = 130) => {
  const clean = message
    .replace(/Dear Parents,?\s*/i, "")
    .replace(/\s+/g, " ")
    .trim()
  return clean.length > length ? `${clean.slice(0, length).trim()}…` : clean
}

const HERO_SLIDES = [
  {
    image: "/optimized/building01.jpg",
    label: "Our Mathura campus",
    position: "center 58%",
  },
  {
    image: "/optimized/gallery-campus-slide-3.jpg",
    label: "Learning through experiment",
    position: "center",
  },
  {
    image: "/optimized/gallery-campus-slide-6.jpg",
    label: "Teacher-guided practical work",
    position: "center",
  },
  {
    image: "/optimized/gallery-campus-slide-7.jpg",
    label: "Confidence through performance",
    position: "center",
  },
  {
    image: "/optimized/sports_arena.jpg",
    label: "Sport within the school day",
    position: "center",
  },
]

const LOCAL_FAQS = [
  [
    "Is Sanskar Public School CBSE affiliated?",
    "Yes. Sanskar Public School is a CBSE-affiliated Senior Secondary school in Mathura. The affiliation number is 2132432.",
  ],
  [
    "Which classes and streams are available?",
    "The learning journey begins with Sanskar Li’l Winners and continues through Class XII, with Science, Commerce and Humanities at Senior Secondary level.",
  ],
  [
    "Where is the school located?",
    "The campus is in Industrial Area, Site-A, Maholi Road, Mathura, with convenient road access for families across Mathura and the wider Vrindavan area.",
  ],
  [
    "How can parents start an admission enquiry?",
    "Complete the secure online form, call the school or book a campus visit. The admissions team will explain availability, documents and the next interaction.",
  ],
]

function HeroCarousel() {
  const { settings } = useSiteContent()
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (paused) return
    timer.current = setInterval(
      () => setCurrent((value) => (value + 1) % HERO_SLIDES.length),
      5200,
    )
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [paused])

  const go = (index: number) =>
    setCurrent((index + HERO_SLIDES.length) % HERO_SLIDES.length)

  return (
    <section
      className="relative min-h-[780px] overflow-hidden bg-navy-deep pt-[108px] lg:min-h-[860px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {HERO_SLIDES.map((slide, index) => (
        <img
          key={slide.image}
          src={index === 0 ? settings.heroImage : slide.image}
          alt={slide.label}
          fetchPriority={index === 0 ? "high" : "auto"}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1400ms]"
          style={{
            opacity: current === index ? 1 : 0,
            transform: current === index ? "scale(1.02)" : "scale(1.08)",
            objectPosition: slide.position,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,31,56,.97)_0%,rgba(5,31,56,.82)_47%,rgba(5,31,56,.2)_82%),linear-gradient(0deg,rgba(5,31,56,.78),transparent_62%)]" />
      <div className="motion-grid absolute inset-0 opacity-45" />
      <MotionBackground blend="screen" opacity={0.2} />
      <div className="orbit-ring absolute -right-32 top-32 hidden h-[470px] w-[470px] rounded-full lg:block" />
      <div
        className="orbit-ring absolute -right-8 top-56 hidden h-[240px] w-[240px] rounded-full lg:block"
        style={{ animationDirection: "reverse", animationDuration: "24s" }}
      />

      <div className="container relative z-10 flex min-h-[672px] items-end pb-28 pt-16 lg:min-h-[752px] lg:items-center lg:pb-28">
        <div className="max-w-3xl">
          <p className="eyebrow eyebrow-light">{settings.themeLine}</p>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-[.96] tracking-[-.045em] text-white sm:text-6xl lg:text-[5.25rem]">
            {settings.heroTitle}
            <br />
            <span className="text-gold">{settings.heroAccent}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75 sm:text-xl">
            {settings.heroCopy}
          </p>
          <p className="mt-4 text-sm font-bold uppercase tracking-[.15em] text-gold">
            {settings.tagline}
          </p>
          {settings.heroOptionalLine && (
            <p className="mt-3 text-xs font-semibold uppercase tracking-[.12em] text-white/50">
              {settings.heroOptionalLine}
            </p>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/admissions#enquiry" className="button button-gold">
              Admissions 2026–27 <Icon name="arrow" size={18} />
            </Link>
            <Link
              to="/academics"
              className="button border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              Explore learning <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-4 text-xs font-semibold uppercase tracking-[.14em] text-white/55">
            <span className="text-gold">0{current + 1}</span>
            <span className="h-px w-14 bg-white/25" />
            <span>{HERO_SLIDES[current].label}</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 sm:bottom-8">
        <button
          type="button"
          onClick={() => go(current - 1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-navy/45 text-white backdrop-blur transition hover:bg-white hover:text-navy"
          aria-label="Previous gallery image"
        >
          <Icon name="chevron" className="rotate-180" />
        </button>
        <div className="flex gap-2">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              onClick={() => go(index)}
              aria-label={`Show ${slide.label}`}
              className={`h-1.5 rounded-full transition-all ${
                index === current
                  ? "w-8 bg-gold"
                  : "w-2 bg-white/40 hover:bg-white"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(current + 1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-navy/45 text-white backdrop-blur transition hover:bg-white hover:text-navy"
          aria-label="Next gallery image"
        >
          <Icon name="chevron" />
        </button>
      </div>
    </section>
  )
}

function QuickActions() {
  const actions = [
    {
      label: "Admission enquiry",
      copy: "Book a campus visit",
      to: "/admissions#enquiry",
      icon: "graduation" as const,
    },
    {
      label: "Pay online fee",
      copy: "Senior or junior wing",
      to: "/pay-fee",
      icon: "wallet" as const,
    },
    {
      label: "Join Talent Academy",
      copy: "View coaching batches",
      to: STA_PORTAL,
      icon: "sport" as const,
      external: true,
    },
    {
      label: "Explore Sports Arena",
      copy: "Courts, pool & play",
      to: "/sports-arena",
      icon: "calendar" as const,
    },
  ]
  return (
    <section className="relative z-20 -mt-1 bg-white shadow-[0_16px_60px_rgba(8,43,79,.1)]">
      <div className="container grid sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action, index) => {
          const content = (
            <>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e9f4f2] text-teal transition group-hover:bg-navy group-hover:text-white">
                <Icon name={action.icon} />
              </span>
              <span>
                <strong className="block text-sm text-navy">
                  {action.label}
                </strong>
                <small className="mt-1 block text-xs text-slate-500">
                  {action.copy}
                </small>
              </span>
              <Icon
                name={action.external ? "external" : "arrow"}
                size={16}
                className="ml-auto text-slate-300 transition group-hover:translate-x-1 group-hover:text-gold"
              />
            </>
          )
          return action.external ? (
            <a
              key={action.label}
              href={action.to}
              target="_blank"
              rel="noreferrer"
              className={`group flex items-center gap-3 px-5 py-6 ${
                index < 3 ? "lg:border-r lg:border-slate-100" : ""
              }`}
            >
              {content}
            </a>
          ) : (
            <Link
              key={action.label}
              to={action.to}
              className={`group flex items-center gap-3 px-5 py-6 ${
                index < 3 ? "lg:border-r lg:border-slate-100" : ""
              }`}
            >
              {content}
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function AchievementSpotlight() {
  const [category, setCategory] = useState<keyof typeof TOPPERS>("XII")
  return (
    <section className="overflow-hidden bg-navy-deep py-20 text-white lg:py-28">
      <div className="container grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
        <Reveal>
          <p className="eyebrow eyebrow-light">Stars of Sanskar</p>
          <h2 className="mt-4 font-display text-5xl font-semibold leading-[1.02] sm:text-6xl">
            Effort deserves its moment.
          </h2>
          <p className="mt-5 max-w-xl leading-8 text-white/62">
            We celebrate learners who set a high academic standard—and the
            teachers, families and daily habits that make every achievement
            possible.
          </p>
          <div className="mt-8 inline-flex rounded-full border border-white/10 bg-white/[.05] p-1">
            {(["XII", "X"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full px-5 py-2.5 text-xs font-bold transition ${
                  category === item
                    ? "bg-gold text-navy"
                    : "text-white/55 hover:text-white"
                }`}
              >
                Class {item}
              </button>
            ))}
          </div>
        </Reveal>
        <Reveal delay={90} className="relative">
          <div className="absolute -inset-10 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative grid gap-3 sm:grid-cols-2">
            {TOPPERS[category].map((student, index) => (
              <div
                key={student.name}
                className={`flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.06] p-4 backdrop-blur ${
                  index === 0 ? "sm:col-span-2 !bg-gold !text-navy" : ""
                }`}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-lg font-semibold ${
                    index === 0 ? "bg-navy text-white" : "bg-white/10 text-gold"
                  }`}
                >
                  {index + 1}
                </span>
                <div>
                  <strong className="font-display text-xl">
                    {student.name}
                  </strong>
                  <span
                    className={`block text-xs ${
                      index === 0 ? "text-navy/60" : "text-white/45"
                    }`}
                  >
                    Class {category}
                  </span>
                </div>
                <strong className="ml-auto font-display text-2xl">
                  {student.score}
                </strong>
              </div>
            ))}
          </div>
          <Link
            to="/achievements"
            className="relative mt-6 inline-flex items-center gap-2 text-sm font-bold text-gold"
          >
            View achievements <Icon name="arrow" size={17} />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

function LeadershipSpotlight() {
  const [active, setActive] = useState(0)
  const leader = LEADERSHIP[active]
  return (
    <section id="leadership" className="bg-white py-20 lg:py-28">
      <div className="container">
        <Reveal className="grid items-end gap-8 lg:grid-cols-[1fr_.8fr]">
          <div>
            <p className="eyebrow">Leadership</p>
            <h2 className="section-title mt-4">
              Five voices. One shared purpose.
            </h2>
          </div>
          <p className="section-copy">
            The school’s direction is shaped by a management team committed to
            academic quality, cultural grounding and each child’s individual
            potential.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
          <Reveal className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {LEADERSHIP.map((item, index) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setActive(index)}
                className={`flex items-center gap-4 rounded-2xl border p-3 text-left transition ${
                  active === index
                    ? "border-gold bg-[#fff9ea] shadow-[0_12px_35px_rgba(231,163,45,.12)]"
                    : "border-slate-100 bg-white hover:border-slate-200"
                }`}
              >
                <img
                  src={item.photo}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-14 w-14 rounded-xl object-cover object-top"
                />
                <span>
                  <strong className="block font-display text-xl text-navy">
                    {item.name}
                  </strong>
                  <small className="text-xs font-bold uppercase tracking-[.12em] text-teal">
                    {item.role}
                  </small>
                </span>
                <Icon
                  name="chevron"
                  className="ml-auto text-slate-300"
                  size={17}
                />
              </button>
            ))}
          </Reveal>
          <Reveal
            delay={80}
            className="relative min-h-[520px] overflow-hidden rounded-[2rem] bg-navy"
          >
            <img
              key={leader.photo}
              src={leader.photo}
              alt={`${leader.name}, ${leader.role}`}
              loading="lazy"
              decoding="async"
              className="absolute inset-y-0 left-0 h-full w-full object-cover object-top opacity-40 sm:w-[48%] sm:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/65 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-navy/85 sm:to-navy" />
            <div className="relative ml-auto flex min-h-[520px] w-full flex-col justify-center p-8 text-white sm:w-[58%] sm:p-10">
              <Icon name="quote" className="text-gold" size={36} />
              <p className="mt-6 font-display text-2xl leading-9">
                “{leaderExcerpt(leader.message, 220)}”
              </p>
              <div className="mt-7">
                <strong className="block font-display text-2xl">
                  {leader.name}
                </strong>
                <span className="text-xs font-bold uppercase tracking-[.14em] text-gold">
                  {leader.role}
                </span>
              </div>
              <Link
                to={`/leadership/${leaderSlug(leader.name)}`}
                className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-white"
              >
                Read full message <Icon name="arrow" size={17} />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function CampusMarquee() {
  const items = [...GALLERY, ...GALLERY]
  return (
    <section className="overflow-hidden bg-[#e9f4f2] py-20 lg:py-24">
      <Reveal className="container flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow eyebrow-teal">Life at Sanskar</p>
          <h2 className="section-title mt-4">
            A school is best understood in motion.
          </h2>
        </div>
        <Link
          to="/gallery"
          className="button button-outline hidden sm:inline-flex"
        >
          Open gallery <Icon name="camera" size={18} />
        </Link>
      </Reveal>
      <div className="gallery-marquee mt-12 flex gap-4 px-2">
        {items.map((item, index) => (
          <Link
            to="/gallery"
            key={`${item.image}-${index}`}
            className="group relative h-[270px] w-[390px] shrink-0 overflow-hidden rounded-[1.75rem]"
          >
            <img
              src={item.image}
              alt={index < GALLERY.length ? item.title : ""}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 text-white">
              <span className="text-[10px] font-bold uppercase tracking-[.15em] text-gold">
                {item.category}
              </span>
              <h3 className="mt-1 font-display text-2xl font-semibold">
                {item.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
      <div className="container mt-7 sm:hidden">
        <Link to="/gallery" className="button button-outline">
          Open gallery <Icon name="camera" size={18} />
        </Link>
      </div>
    </section>
  )
}

function HomeBoards() {
  const { programmes, happenings } = useSiteContent()

  const board = (
    title: string,
    copy: string,
    items: typeof programmes,
    tone: "gold" | "teal",
  ) => (
    <div
      className={`overflow-hidden rounded-[2rem] border ${
        tone === "gold"
          ? "border-gold/20 bg-white"
          : "border-teal/20 bg-[#e9f4f2]"
      }`}
    >
      <div className="border-b border-navy/10 p-7 sm:p-8">
        <p className={`eyebrow ${tone === "teal" ? "eyebrow-teal" : ""}`}>
          Notice board
        </p>
        <h2 className="mt-4 font-display text-4xl font-semibold text-navy">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">{copy}</p>
      </div>
      <div className="divide-y divide-navy/10">
        {items.map((item) => {
          const isExternal = /^https?:\/\//.test(item.href)
          const content = (
            <>
              <img
                src={item.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-20 w-20 shrink-0 rounded-2xl object-cover sm:h-24 sm:w-24"
              />
              <span className="min-w-0">
                <span
                  className={`text-[10px] font-bold uppercase tracking-[.14em] ${
                    tone === "gold" ? "text-blue" : "text-teal"
                  }`}
                >
                  {item.label} · {item.date}
                </span>
                <strong className="mt-1 block font-display text-xl text-navy sm:text-2xl">
                  {item.title}
                </strong>
                <span className="mt-1 hidden text-xs leading-5 text-slate-500 sm:block">
                  {item.summary}
                </span>
              </span>
              <Icon name="arrow" className="ml-auto shrink-0 text-slate-300" />
            </>
          )
          const className =
            "group flex items-center gap-4 p-5 transition hover:bg-white/70 sm:p-6"
          return isExternal ? (
            <a
              key={item.id || item.title}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className={className}
            >
              {content}
            </a>
          ) : (
            <Link
              key={item.id || item.title}
              to={item.href || "/"}
              className={className}
            >
              {content}
            </Link>
          )
        })}
      </div>
    </div>
  )

  return (
    <section className="bg-navy-deep py-20 lg:py-28">
      <div className="container grid gap-7 lg:grid-cols-2">
        <Reveal>
          {board(
            "Upcoming programmes",
            "Plan ahead for the moments that bring our community together.",
            programmes,
            "gold",
          )}
        </Reveal>
        <Reveal delay={80}>
          {board(
            "What's going on",
            "A live view of learning, practice and activity across campus.",
            happenings,
            "teal",
          )}
        </Reveal>
      </div>
    </section>
  )
}

function TestimonialCarousel() {
  const { testimonials } = useSiteContent()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (current >= testimonials.length) setCurrent(0)
  }, [current, testimonials.length])

  if (!testimonials.length) return null

  const testimonial = testimonials[Math.min(current, testimonials.length - 1)]
  return (
    <section className="bg-[#e9f4f2] py-20 lg:py-24">
      <div className="container grid items-center gap-10 lg:grid-cols-[.75fr_1.25fr]">
        <Reveal>
          <p className="eyebrow eyebrow-teal">Parent voices</p>
          <h2 className="section-title mt-4">What families notice.</h2>
          <p className="section-copy mt-5">
            Real confidence is built through a partnership between school and
            home.
          </p>
          <div className="mt-7 flex gap-2">
            <button
              onClick={() =>
                setCurrent(
                  (current - 1 + testimonials.length) % testimonials.length,
                )
              }
              className="flex h-11 w-11 items-center justify-center rounded-full border border-navy/15 text-navy"
              aria-label="Previous testimonial"
            >
              <Icon name="chevron" className="rotate-180" />
            </button>
            <button
              onClick={() => setCurrent((current + 1) % testimonials.length)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white"
              aria-label="Next testimonial"
            >
              <Icon name="chevron" />
            </button>
          </div>
        </Reveal>
        <Reveal
          delay={90}
          className="rounded-[2rem] bg-white p-8 shadow-[0_24px_70px_rgba(8,43,79,.08)] sm:p-12"
        >
          <div className="flex items-start justify-between gap-6">
            <Icon name="quote" className="text-gold" size={40} />
            <img
              src={testimonial.image}
              alt={`${testimonial.name}, Sanskar parent`}
              loading="lazy"
              decoding="async"
              className="h-24 w-24 rounded-full border-4 border-[#e9f4f2] bg-slate-100 object-cover shadow-lg sm:h-28 sm:w-28"
            />
          </div>
          <blockquote className="mt-6 font-display text-3xl leading-[1.35] text-navy sm:text-4xl">
            “{testimonial.quote}”
          </blockquote>
          <div className="mt-8 flex items-center gap-4">
            <div>
              <strong className="block text-sm text-navy">
                {testimonial.name}
              </strong>
              <span className="text-xs text-slate-400">
                Sanskar parent testimonial
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default function Home() {
  usePageMeta({
    title: "Best CBSE School in Mathura & Vrindavan | Sanskar Public School",
    description:
      "Explore Sanskar Public School, a CBSE Senior Secondary school in Mathura serving Mathura–Vrindavan with strong academics, Indian values, sports, labs and admissions for 2026–27.",
    keywords:
      "best school in Mathura, best CBSE school in Mathura, top schools in Mathura, CBSE school in Mathura, best school in Vrindavan, CBSE school in Vrindavan, school admission Mathura",
    path: "/",
    image: "/optimized/gallery-campus-slide-3.jpg",
    schema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: LOCAL_FAQS.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  })

  return (
    <div className="bg-cream">
      <HeroCarousel />
      <QuickActions />
      <SchoolGuide />

      <section className="relative overflow-hidden py-20 lg:py-28">
        <AcademicShapes className="opacity-75" />
        <div className="container relative z-10 grid items-center gap-14 lg:grid-cols-[.92fr_1.08fr]">
          <Reveal>
            <p className="eyebrow">School ideology</p>
            <h2 className="section-title mt-4">
              Why families choose Sanskar among schools in Mathura.
            </h2>
            <blockquote className="mt-6 border-l-2 border-gold pl-6 font-display text-2xl italic leading-9 text-navy">
              “Knowledge without ethics cannot turn a person into a
              personality.”
            </blockquote>
            <p className="section-copy mt-6">
              Sanskar’s “Indian Soch, International Approach” brings
              contemporary academics together with Sanskar classes, spoken
              English, Vedic mathematics, yoga, meditation, creative arts and
              sport.
            </p>
            <Link to="/about" className="button button-primary mt-8">
              Understand our philosophy <Icon name="arrow" />
            </Link>
          </Reveal>
          <Reveal
            delay={90}
            className="relative min-h-[560px] overflow-hidden rounded-[2rem]"
          >
            <img
              src="/optimized/future-ready-learning.jpg"
              alt="Representative collaborative robotics and coding session"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/15 bg-navy/60 p-5 text-white backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-gold">
                Future-ready, values-led
              </p>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Representative editorial imagery · Real Sanskar learning appears
                throughout the gallery.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <AchievementSpotlight />

      <section className="bg-white py-20 lg:py-28">
        <div className="container">
          <Reveal className="text-center">
            <p className="eyebrow">One connected learning journey</p>
            <h2 className="section-title mx-auto mt-4 max-w-4xl">
              From first discoveries to future decisions.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Reveal className="group relative min-h-[510px] overflow-hidden rounded-[2rem]">
              <img
                src="/optimized/little-winners-learning.jpg"
                alt="Representative early-years learning environment"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-10">
                <span className="text-xs font-bold uppercase tracking-[.15em] text-gold">
                  Early years
                </span>
                <h3 className="mt-2 font-display text-4xl font-semibold">
                  Sanskar Li’l Winners
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-7 text-white/70">
                  Montessori-inspired, thematic and play-rich learning with
                  storytelling, music, movement and confident expression.
                </p>
                <Link
                  to="/little-winners"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-gold"
                >
                  Explore Li’l Winners <Icon name="arrow" size={17} />
                </Link>
              </div>
            </Reveal>
            <Reveal
              delay={90}
              className="group relative min-h-[510px] overflow-hidden rounded-[2rem]"
            >
              <img
                src="/optimized/gallery-campus-slide-3.jpg"
                alt="Sanskar students conducting a science experiment"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-10">
                <span className="text-xs font-bold uppercase tracking-[.15em] text-gold">
                  Primary to Senior Secondary
                </span>
                <h3 className="mt-2 font-display text-4xl font-semibold">
                  Sanskar Public School
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-7 text-white/70">
                  CBSE academics, laboratories, clubs and Science, Commerce and
                  Humanities pathways for confident next steps.
                </p>
                <Link
                  to="/academics"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-gold"
                >
                  Explore academics <Icon name="arrow" size={17} />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container">
          <Reveal className="grid items-end gap-8 lg:grid-cols-[1fr_.78fr]">
            <div>
              <p className="eyebrow eyebrow-teal">Everything under one gate</p>
              <h2 className="section-title mt-4">
                Education is larger than a classroom.
              </h2>
            </div>
            <p className="section-copy">
              Sanskar connects academics, culture, physical development and
              parent services within one school ecosystem.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                t: "Academics & clubs",
                c: "AI, robotics, science, literary, arts and foundation learning.",
                to: "/academics",
                img: "/optimized/gallery-campus-slide-6.jpg",
              },
              {
                t: "Sports Arena",
                c: "Indoor arena, grounds, courts, skating and swimming.",
                to: "/sports-arena",
                img: "/optimized/sports_arena.jpg",
              },
              {
                t: "Talent Academy",
                c: "Monthly coaching in five focused sports programmes.",
                to: "/talent-academy",
                img: "/optimized/talent-academy-training.jpg",
              },
              {
                t: "Admissions",
                c: "A clear process for both school learning journeys.",
                to: "/admissions",
                img: "/optimized/building01.jpg",
              },
            ].map((card, index) => (
              <Reveal key={card.t} delay={index * 70}>
                <Link
                  to={card.to}
                  className="card interactive-card group block h-full overflow-hidden"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={card.img}
                      alt={card.t}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-2xl font-semibold text-navy">
                      {card.t}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {card.c}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-blue">
                      Discover more <Icon name="arrow" size={15} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CampusMarquee />
      <LeadershipSpotlight />

      <HomeBoards />

      <TestimonialCarousel />

      <section className="bg-white py-20 lg:py-28">
        <div className="container grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <Reveal>
            <p className="eyebrow eyebrow-teal">Schools in Mathura–Vrindavan</p>
            <h2 className="section-title mt-4">
              A CBSE school for every stage of the journey.
            </h2>
            <p className="section-copy mt-5">
              Families comparing CBSE schools in Mathura and Vrindavan can
              explore early-years learning, primary and secondary academics,
              Senior Secondary streams, laboratories, sports and values-led
              development at one Maholi Road campus.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/admissions" className="button button-primary">
                Check admissions <Icon name="arrow" size={17} />
              </Link>
              <Link to="/contact" className="button button-outline">
                Plan your route
              </Link>
            </div>
          </Reveal>
          <Reveal delay={80} className="space-y-3">
            {LOCAL_FAQS.map(([question, answer]) => (
              <details
                key={question}
                className="group rounded-2xl border border-slate-200 bg-cream px-6 py-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy">
                  {question}
                  <span className="text-2xl font-normal text-teal transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 pr-8 text-sm leading-7 text-slate-600">
                  {answer}
                </p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy py-16 text-white lg:py-20">
        <MotionBackground blend="screen" opacity={0.35} />
        <Reveal className="container relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="eyebrow eyebrow-light">Admissions in Mathura</p>
            <h2 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Come for the campus. Stay for the learning culture.
            </h2>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link to="/admissions#enquiry" className="button button-gold">
              Book a campus visit <Icon name="arrow" />
            </Link>
            <a
              href={PAYMENT_LINKS.senior}
              target="_blank"
              rel="noreferrer"
              className="button border border-white/25 text-white"
            >
              <Icon name="wallet" size={17} />
              Pay online fee
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
