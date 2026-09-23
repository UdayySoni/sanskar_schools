import Image from "../components/Image"
import { Link } from "react-router-dom"
import Icon from "../components/Icon"
import PageHero from "../components/PageHero"
import Reveal from "../components/Reveal"
import { usePageMeta } from "../hooks/usePageMeta"

const experiences = [
  [
    "Montessori-inspired learning",
    "Hands-on materials, purposeful play and age-appropriate routines help young learners understand by doing.",
  ],
  [
    "Thematic classrooms",
    "Stories, art, music and movement connect each theme across language, numeracy and the world around us.",
  ],
  [
    "Confidence and expression",
    "Show-and-tell, storytelling, stage time and group conversation help children speak without hesitation.",
  ],
  [
    "Movement and discovery",
    "Indoor and outdoor activity, skating, splash-pool experiences and guided play build coordination and joy.",
  ],
  [
    "Care for nature",
    "Simple plant-care responsibilities invite children to observe, nurture and become responsible for their environment.",
  ],
  [
    "Multiple intelligences",
    "A varied school day gives every child more than one way to participate, practise and demonstrate understanding.",
  ],
]

export default function LittleWinners() {
  usePageMeta({
    title: "Best Preschool in Mathura | Sanskar Li'l Winners",
    description:
      "Explore Sanskar Li'l Winners in Mathura: a Montessori-inspired early-years programme with thematic classrooms, storytelling, music, movement and confident expression.",
    keywords:
      "best preschool in Mathura, nursery school Mathura, Montessori school Mathura, Sanskar Li'l Winners, pre primary school Mathura",
    path: "/little-winners",
    image: "/optimized/little-winners-learning.jpg",
  })

  return (
    <div className="bg-cream">
      <PageHero
        eyebrow="Sanskar Li'l Winners"
        title="Small steps. Bright beginnings."
        description="A warm, active early-years environment where curiosity, confidence and good habits grow together."
        image="/optimized/little-winners-learning.jpg"
        imageAlt="Representative joyful early-years learning at Sanskar Li'l Winners"
        action={{ label: "Enquire for admission", to: "/admissions#enquiry" }}
      />

      <section className="py-20 lg:py-28">
        <div className="container grid items-center gap-14 lg:grid-cols-[.9fr_1.1fr]">
          <Reveal>
            <p className="eyebrow">The first school experience</p>
            <h2 className="section-title mt-4">
              Learning should feel like discovery.
            </h2>
            <p className="section-copy mt-6">
              Li'l Winners combines Montessori-inspired methods with thematic
              learning and the school’s values-led approach. The programme is
              designed for joyful participation—not early academic pressure.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/admissions" className="button button-primary">
                Admission process <Icon name="arrow" />
              </Link>
              <Link to="/contact" className="button button-outline">
                Plan a visit
              </Link>
            </div>
          </Reveal>
          <Reveal delay={90} className="grid grid-cols-2 gap-4">
            <Image
              src="/optimized/gallery-campus-slide-4.jpg"
              alt="Young Sanskar learner practising mindfulness"
              loading="lazy"
              decoding="async"
              className="h-[420px] w-full rounded-[2rem] object-cover"
            />
            <Image
              src="/optimized/gallery-campus-slide-8.jpg"
              alt="Young Sanskar students performing at a school event"
              loading="lazy"
              decoding="async"
              className="mt-16 h-[420px] w-full rounded-[2rem] object-cover"
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="container">
          <Reveal className="text-center">
            <p className="eyebrow eyebrow-teal">How children learn</p>
            <h2 className="section-title mx-auto mt-4 max-w-4xl">
              A day rich in language, movement, imagination and care.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {experiences.map(([title, copy], index) => (
              <Reveal
                key={title}
                delay={(index % 3) * 65}
                className="card interactive-card p-7"
              >
                <span className="icon-box">
                  <Icon name={index % 2 ? "spark" : "heart"} />
                </span>
                <h3 className="mt-6 font-display text-2xl font-semibold text-navy">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <Reveal className="container overflow-hidden rounded-[2rem] bg-navy-deep p-8 text-white sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="eyebrow eyebrow-light">Meet the school</p>
              <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
                Let your child experience the environment.
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-white/65">
                Speak with the admissions team or visit the junior wing before
                applying.
              </p>
            </div>
            <Link to="/admissions#enquiry" className="button button-gold">
              Book a school visit <Icon name="arrow" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
