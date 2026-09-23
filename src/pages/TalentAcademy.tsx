import Image from "../components/Image"
import Icon from "../components/Icon"
import PageHero from "../components/PageHero"
import Reveal from "../components/Reveal"
import { usePageMeta } from "../hooks/usePageMeta"

const portal = "https://sanskartalentacademy.zite.so/"

const programmes = [
  {
    name: "Badminton",
    focus: "Footwork, racket control, movement patterns and match confidence.",
    image: "/optimized/talent-academy-training.jpg",
  },
  {
    name: "Basketball",
    focus: "Ball handling, passing, shooting, movement and team awareness.",
    image: "/optimized/sports_arena.jpg",
  },
  {
    name: "Taekwondo",
    focus: "Technique, balance, fitness, discipline and self-confidence.",
    image: "/optimized/sports_arena.jpg",
  },
  {
    name: "Swimming",
    focus:
      "Water confidence, stroke development, breathing and safe progression.",
    image: "/optimized/pool.jpg",
  },
  {
    name: "Skating",
    focus: "Balance, control, agility and progressive skating technique.",
    image: "/optimized/skating.jpg",
  },
]

const faq = [
  [
    "Is Talent Academy only for Sanskar students?",
    "The academy is designed for Sanskar learners and the wider Mathura community. Confirm current eligibility for a programme on the registration portal.",
  ],
  [
    "Where can I see current timings and fees?",
    "Batch timings, availability and current registration details are maintained on the academy registration portal.",
  ],
  [
    "Can a beginner join?",
    "Programmes are built around progressive learning. Use the registration portal or contact the school to confirm the most suitable current batch.",
  ],
]

export default function TalentAcademy() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  }

  usePageMeta({
    title: "Sanskar Talent Academy Mathura | Sports Coaching",
    description:
      "Structured monthly coaching in badminton, basketball, taekwondo, swimming and skating at Sanskar Talent Academy in Mathura. Explore programmes and register online.",
    keywords:
      "sports academy Mathura, badminton coaching Mathura, swimming classes Mathura, basketball coaching Mathura, skating classes Mathura, taekwondo classes Mathura, Sanskar Talent Academy",
    path: "/talent-academy",
    image: "/optimized/talent-academy-training.jpg",
    schema: faqSchema,
  })

  return (
    <div className="bg-cream">
      <PageHero
        eyebrow="Structured monthly coaching"
        title="Sanskar Talent Academy"
        description="Professional guidance, purposeful practice and progressive skill-building in five sports—open to students and the wider Mathura community."
        image="/optimized/talent-academy-training.jpg"
        imageAlt="Representative professional badminton coaching session for young Indian athletes"
        action={{
          label: "View batches & register",
          to: portal,
          external: true,
        }}
      />
      <div className="bg-[#e9f4f2] py-3 text-center text-xs text-slate-500">
        Hero photograph is representative editorial imagery.
      </div>

      <section className="py-20 lg:py-28">
        <div className="container grid items-start gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <Reveal>
            <p className="eyebrow eyebrow-teal">What the academy is</p>
            <h2 className="section-title mt-4">
              More than play. A pathway to progress.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="section-copy">
              Sanskar Talent Academy is the coached-development arm of the
              Sanskar ecosystem. It brings young learners into regular monthly
              batches where professional guidance, repetition and
              age-appropriate progression help natural interest become reliable
              skill.
            </p>
            <p className="section-copy mt-4">
              The academy makes use of Sanskar’s on-campus sports environment
              and serves both school students and families from the wider
              community. Current batches, timings and registration are handled
              through the dedicated portal.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="container">
          <Reveal className="text-center">
            <p className="eyebrow">Coaching programmes</p>
            <h2 className="section-title mt-4">
              Choose the skill you want to build.
            </h2>
            <p className="section-copy mx-auto mt-5 max-w-2xl">
              Each programme focuses on sound fundamentals, regular practice and
              confidence appropriate to the learner’s current level.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {programmes.map((programme, index) => (
              <Reveal
                key={programme.name}
                delay={(index % 3) * 70}
                className={`card interactive-card overflow-hidden ${
                  index === 0 ? "lg:col-span-2" : ""
                }`}
              >
                <div
                  className={`overflow-hidden bg-slate-100 ${
                    index === 0 ? "aspect-[16/7]" : "aspect-[16/10]"
                  }`}
                >
                  <Image
                    src={programme.image}
                    alt={`${programme.name} facilities and coaching at Sanskar in Mathura`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[.14em] text-teal">
                        Monthly batches
                      </p>
                      <h3 className="mt-2 font-display text-3xl font-semibold text-navy">
                        {programme.name}
                      </h3>
                    </div>
                    <span className="icon-box">
                      <Icon name="sport" />
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {programme.focus}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-deep py-20 text-white lg:py-28">
        <div className="container">
          <Reveal className="text-center">
            <p className="eyebrow eyebrow-light">How it works</p>
            <h2 className="mx-auto mt-4 max-w-3xl font-display text-5xl font-semibold leading-[1.04]">
              From interest to a consistent practice habit.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "Choose a programme",
                c: "Select the sport that matches the learner’s interest and development goal.",
              },
              {
                n: "02",
                t: "Find a current batch",
                c: "Review live batch availability, timing and registration details on the academy portal.",
              },
              {
                n: "03",
                t: "Train progressively",
                c: "Attend recurring sessions, practise fundamentals and build confidence with coaching.",
              },
            ].map((step, index) => (
              <Reveal
                key={step.n}
                delay={index * 90}
                className="rounded-3xl border border-white/10 bg-white/[.05] p-7"
              >
                <span className="font-display text-4xl text-gold">
                  {step.n}
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold">
                  {step.t}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/55">{step.c}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <a
              href={portal}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-gold"
            >
              Open registration portal <Icon name="external" size={17} />
            </a>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#e9f4f2] py-20 lg:py-24">
        <div className="container max-w-4xl">
          <Reveal className="text-center">
            <p className="eyebrow eyebrow-teal">Common questions</p>
            <h2 className="section-title mt-4">Talent Academy FAQ</h2>
          </Reveal>
          <div className="mt-10 space-y-3">
            {faq.map(([question, answer]) => (
              <Reveal key={question}>
                <details className="group rounded-2xl bg-white px-6 py-5 shadow-[0_8px_30px_rgba(8,43,79,.04)]">
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-16 text-white">
        <Reveal className="container flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="eyebrow eyebrow-light">Ready to begin?</p>
            <h2 className="mt-3 font-display text-4xl font-semibold">
              Find the right sport and current batch.
            </h2>
          </div>
          <a
            href={portal}
            target="_blank"
            rel="noopener noreferrer"
            className="button button-gold shrink-0"
          >
            View batches & register <Icon name="external" size={17} />
          </a>
        </Reveal>
      </section>
    </div>
  )
}
