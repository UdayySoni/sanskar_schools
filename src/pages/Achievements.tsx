import { Link } from "react-router-dom"
import Icon from "../components/Icon"
import PageHero from "../components/PageHero"
import Reveal from "../components/Reveal"
import { TOPPERS } from "../data/site"
import { usePageMeta } from "../hooks/usePageMeta"

function ResultList({ grade }: { grade: keyof typeof TOPPERS }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between bg-navy px-6 py-5 text-white">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-gold">
            Board achievers
          </p>
          <h2 className="mt-1 font-display text-3xl font-semibold">
            Class {grade}
          </h2>
        </div>
        <Icon name="award" size={34} className="text-gold" />
      </div>
      <ol className="divide-y divide-slate-100">
        {TOPPERS[grade].map((student, index) => (
          <li
            key={student.name}
            className="flex items-center gap-4 bg-white px-6 py-5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9f4f2] font-display text-lg font-semibold text-teal">
              {index + 1}
            </span>
            <span className="font-semibold text-navy">{student.name}</span>
            <strong className="ml-auto text-lg text-blue">
              {student.score}
            </strong>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function Achievements() {
  usePageMeta({
    title: "School Results & Student Achievements | Sanskar Mathura",
    description:
      "Celebrate Sanskar Public School Mathura's Class X and XII board achievers and a school culture that values sustained effort, confidence and participation.",
    keywords:
      "CBSE school results Mathura, top school results Mathura, Sanskar Public School toppers, best CBSE school Mathura",
    path: "/achievements",
    image: "/optimized/gallery-campus-slide-2.jpg",
  })
  return (
    <div className="bg-cream">
      <PageHero
        eyebrow="Results & recognition"
        title="Effort worth celebrating."
        description="Board results are one measure of growth. We celebrate the discipline, confidence and support behind every achievement."
        image="/optimized/gallery-campus-slide-2.jpg"
        imageAlt="Sanskar school community celebrating achievement"
        action={{ label: "Explore academics", to: "/academics" }}
      />
      <section className="py-20 lg:py-28">
        <div className="container">
          <Reveal className="grid items-end gap-8 lg:grid-cols-[1fr_.8fr]">
            <div>
              <p className="eyebrow">Published school results</p>
              <h2 className="section-title mt-4">
                Our Class X and XII achievers.
              </h2>
            </div>
            <p className="section-copy">
              These names and scores are reproduced from the school’s published
              results. Academic success at Sanskar is supported by regular
              practice, teacher guidance and a balanced school life.
            </p>
          </Reveal>
          <div className="mt-12 grid items-start gap-7 lg:grid-cols-2">
            <Reveal>
              <ResultList grade="XII" />
            </Reveal>
            <Reveal delay={80}>
              <ResultList grade="X" />
            </Reveal>
          </div>
        </div>
      </section>
      <section className="bg-white py-20">
        <Reveal className="container grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow eyebrow-teal">Beyond marks</p>
            <h2 className="mt-4 font-display text-4xl font-semibold text-navy sm:text-5xl">
              Confidence grows on stage, in sport and through service too.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/gallery" className="button button-primary">
              See school life <Icon name="camera" />
            </Link>
            <Link to="/admissions" className="button button-outline">
              Admissions
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
