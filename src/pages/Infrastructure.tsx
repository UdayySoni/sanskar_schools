import { Link } from "react-router-dom"
import Icon from "../components/Icon"
import PageHero from "../components/PageHero"
import Reveal from "../components/Reveal"
import { usePageMeta } from "../hooks/usePageMeta"

const facilities = [
  [
    "Science laboratories",
    "Physics, Chemistry and Biology spaces support practical observation and experimentation.",
  ],
  [
    "Computer & language learning",
    "Technology-enabled practice helps students build digital and communication fluency.",
  ],
  [
    "Library & resource centre",
    "More than 10,000 books, periodicals and learning resources support independent reading.",
  ],
  [
    "Creative studios",
    "Dedicated settings for art, craft, music and dance give expression a proper place in the school day.",
  ],
  [
    "AV & activity rooms",
    "Flexible rooms support storytelling, presentations, indoor activities and collaborative learning.",
  ],
  [
    "Safe school transport",
    "Designated routes and GPS-enabled buses help families stay connected to the daily journey.",
  ],
]

export default function Infrastructure() {
  usePageMeta({
    title: "School Campus & Learning Facilities in Mathura | Sanskar",
    description:
      "Explore Sanskar Public School’s 10-acre Mathura campus, science laboratories, library, creative studios, technology spaces and student facilities.",
    keywords:
      "school campus Mathura, school science labs Mathura, school library Mathura, Sanskar Public School infrastructure",
    path: "/infrastructure",
    image: "/optimized/building01.jpg",
  })

  return (
    <div className="bg-cream">
      <PageHero
        eyebrow="Campus & infrastructure"
        title="Space to think, make and grow."
        description="A 10-acre campus in Mathura with academic laboratories, creative studios, learning technology, a rich library and flexible activity spaces."
        image="/optimized/building01.jpg"
        imageAlt="Sanskar Public School campus building in Mathura"
        action={{ label: "Book a campus visit", to: "/admissions#enquiry" }}
      />

      <section className="py-20 lg:py-28">
        <div className="container">
          <Reveal className="grid items-end gap-8 lg:grid-cols-[1fr_.8fr]">
            <div>
              <p className="eyebrow">Purpose-built learning</p>
              <h2 className="section-title mt-4">
                Facilities matter when they are part of everyday learning.
              </h2>
            </div>
            <p className="section-copy">
              Sanskar’s campus gives ideas room to become experiments,
              performances and projects. Every space is designed to strengthen
              the daily learning experience.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {facilities.map(([title, copy], index) => (
              <Reveal
                key={title}
                delay={(index % 3) * 70}
                className="card interactive-card p-7"
              >
                <span className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-navy font-display text-lg font-semibold text-white">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-2xl font-semibold text-navy">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="container">
          <Reveal className="text-center">
            <p className="eyebrow eyebrow-teal">A closer look</p>
            <h2 className="section-title mt-4">The learning campus in pictures.</h2>
          </Reveal>
          <div className="mt-12 grid auto-rows-[230px] grid-cols-2 gap-4 lg:auto-rows-[300px] lg:grid-cols-4">
            <Reveal className="image-zoom col-span-2 row-span-2 overflow-hidden rounded-[1.75rem]">
              <img
                src="/optimized/building01.jpg"
                alt="Sanskar Public School building in Mathura"
                className="h-full w-full object-cover"
              />
            </Reveal>
            <Reveal
              delay={60}
              className="image-zoom overflow-hidden rounded-[1.75rem]"
            >
              <img
                src="/optimized/science.jpg"
                alt="Science laboratory activity at Sanskar"
                className="h-full w-full object-cover"
              />
            </Reveal>
            <Reveal
              delay={100}
              className="image-zoom overflow-hidden rounded-[1.75rem]"
            >
              <img
                src="/optimized/music.jpg"
                alt="Music learning at Sanskar Public School"
                className="h-full w-full object-cover"
              />
            </Reveal>
            <Reveal
              delay={140}
              className="image-zoom col-span-2 overflow-hidden rounded-[1.75rem]"
            >
              <img
                src="/optimized/ai.jpg"
                alt="Technology-enabled learning at Sanskar Public School"
                className="h-full w-full object-cover"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-20">
        <Reveal className="container rounded-[2rem] bg-[#e9f4f2] p-8 text-center sm:p-12">
          <Icon name="location" className="mx-auto text-teal" size={30} />
          <h2 className="mt-5 font-display text-4xl font-semibold text-navy">
            Visit the campus on Maholi Road.
          </h2>
          <p className="section-copy mx-auto mt-4 max-w-2xl">
            Industrial Area, Site-A, Maholi Road, Mathura, Uttar Pradesh 281004.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/admissions#enquiry" className="button button-primary">
              Plan your visit <Icon name="arrow" />
            </Link>
            <Link to="/sports-arena" className="button button-outline">
              Explore Sports Arena
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
