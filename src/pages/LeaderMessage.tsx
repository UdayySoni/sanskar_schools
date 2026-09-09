import { Link, useParams } from "react-router-dom"
import Icon from "../components/Icon"
import { usePageMeta } from "../hooks/usePageMeta"
import { LEADERSHIP, leaderExcerpt, leaderSlug } from "./Home"

export default function LeaderMessage() {
  const { leaderId } = useParams<{ leaderId: string }>()
  const leader =
    LEADERSHIP.find((item) => leaderSlug(item.name) === leaderId) ??
    LEADERSHIP[0]

  usePageMeta({
    title: `${leader.role}’s Message – ${leader.name} | Sanskar Public School`,
    description: leaderExcerpt(leader.message, 160),
    path: `/leadership/${leaderSlug(leader.name)}`,
    image: leader.photo,
  })

  return (
    <div className="bg-cream pt-[76px] lg:pt-[108px]">
      <section className="bg-navy-deep py-16 text-white lg:py-20">
        <div className="container">
          <nav className="mb-6 flex items-center gap-2 text-xs text-white/50">
            <Link to="/">Home</Link>
            <Icon name="chevron" size={14} />
            <Link to="/#leadership">Leadership</Link>
          </nav>
          <p className="eyebrow eyebrow-light">Leadership message</p>
          <h1 className="mt-4 font-display text-5xl font-semibold sm:text-6xl">
            {leader.role}’s Message
          </h1>
        </div>
      </section>
      <section className="py-20 lg:py-28">
        <div className="container grid items-start gap-12 lg:grid-cols-[.72fr_1.28fr]">
          <div className="sticky top-28 overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_65px_rgba(8,43,79,.1)]">
            <img
              src={leader.photo}
              alt={`${leader.name}, ${leader.role} of Sanskar Public School`}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full object-cover object-top"
            />
            <div className="p-6">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-teal">
                {leader.role}
              </p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-navy">
                {leader.name}
              </h2>
            </div>
          </div>
          <article>
            <div className="mb-7 font-display text-7xl leading-none text-gold">
              “
            </div>
            <p className="whitespace-pre-line text-lg leading-9 text-slate-600">
              {leader.message}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/#leadership" className="button button-primary">
                All leadership messages
              </Link>
              <Link to="/admissions#enquiry" className="button button-outline">
                Book a visit <Icon name="arrow" size={17} />
              </Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
