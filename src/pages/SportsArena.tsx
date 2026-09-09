import { Link } from "react-router-dom"
import Icon from "../components/Icon"
import PageHero from "../components/PageHero"
import Reveal from "../components/Reveal"
import { useSiteContent } from "../context/SiteContent"
import { usePageMeta } from "../hooks/usePageMeta"

const experiences = [
  {
    title: "Indoor court sports",
    copy: "Purpose-built space for badminton, basketball, pickleball and table tennis—protected from the weather and ready for regular play.",
    image: "/optimized/sports_arena.jpg",
  },
  {
    title: "Swimming",
    copy: "A dedicated pool environment for water confidence, recreation and progressive skill development.",
    image: "/optimized/pool.jpg",
  },
  {
    title: "Skating",
    copy: "Open practice space for balance, movement, agility and confident skating progression.",
    image: "/optimized/skating.jpg",
  },
  {
    title: "Outdoor play",
    copy: "Grounds and play areas that support box cricket, team games, fitness and active family time.",
    image: "/optimized/live-outdoor-sports.jpg",
  },
]

export default function SportsArena() {
  const { sportsArena } = useSiteContent()

  usePageMeta({
    title: "Sports Arena in Mathura | Sanskar Public School",
    description:
      "Explore and book Sanskar Sports Arena in Mathura for badminton, basketball, pickleball, table tennis, box cricket, skating, chess and swimming.",
    keywords:
      "sports arena Mathura, badminton court Mathura, swimming pool Mathura, pickleball Mathura, skating Mathura, sports booking Mathura",
    path: "/sports-arena",
    image: sportsArena.image,
  })

  return (
    <div className="bg-cream">
      <PageHero
        eyebrow={sportsArena.eyebrow}
        title={sportsArena.title}
        description={sportsArena.introduction}
        image={sportsArena.image}
        imageAlt="Indoor courts at Sanskar Sports Arena in Mathura"
        action={{
          label: sportsArena.bookingLabel,
          to: sportsArena.bookingUrl,
          external: true,
        }}
      />

      <section className="py-20 lg:py-28">
        <div className="container grid items-start gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <Reveal>
            <p className="eyebrow eyebrow-teal">One arena, many ways to move</p>
            <h2 className="section-title mt-4">
              Play casually. Practise regularly. Grow confidently.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="section-copy">
              Sanskar Sports Arena brings popular indoor and outdoor activities
              together on the school campus. Families can use it for active
              recreation and casual bookings, while students benefit from a
              physical environment that makes movement part of everyday life.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {sportsArena.highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-navy/10 bg-white px-4 py-2 text-xs font-semibold text-navy"
                >
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="container">
          <Reveal className="text-center">
            <p className="eyebrow">Inside the arena</p>
            <h2 className="section-title mt-4">Choose how you want to move.</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {experiences.map((experience, index) => (
              <Reveal
                key={experience.title}
                delay={(index % 2) * 70}
                className="card interactive-card group overflow-hidden"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={experience.image}
                    alt={`${experience.title} at Sanskar Sports Arena`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-7">
                  <h3 className="font-display text-3xl font-semibold text-navy">
                    {experience.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {experience.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-deep py-20 text-white lg:py-24">
        <div className="container grid gap-6 md:grid-cols-2">
          <Reveal className="rounded-[2rem] border border-white/10 bg-white/[.05] p-8 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-gold">
              Sports Arena
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold">
              Casual book & play
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/60">
              Choose the available court or activity, check the current slot
              and book recreational access through the arena booking partner.
            </p>
            <a
              href={sportsArena.bookingUrl}
              target="_blank"
              rel="noreferrer"
              className="button button-gold mt-7"
            >
              {sportsArena.bookingLabel} <Icon name="external" size={17} />
            </a>
          </Reveal>
          <Reveal
            delay={80}
            className="rounded-[2rem] border border-white/10 bg-white/[.05] p-8 sm:p-10"
          >
            <p className="text-xs font-bold uppercase tracking-[.14em] text-gold">
              Talent Academy
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold">
              Structured monthly coaching
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/60">
              Learners seeking progressive instruction can join recurring
              coach-led batches through Sanskar Talent Academy.
            </p>
            <Link to="/talent-academy" className="button border border-white/20 mt-7 text-white">
              Explore coaching <Icon name="arrow" size={17} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#e9f4f2] py-16 text-center">
        <Reveal className="container">
          <p className="eyebrow eyebrow-teal">Ready to play?</p>
          <h2 className="mt-4 font-display text-4xl font-semibold text-navy sm:text-5xl">
            Book your arena session.
          </h2>
          <a
            href={sportsArena.bookingUrl}
            target="_blank"
            rel="noreferrer"
            className="button button-primary mt-7"
          >
            {sportsArena.bookingLabel} <Icon name="external" size={17} />
          </a>
        </Reveal>
      </section>
    </div>
  )
}
