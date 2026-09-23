import Icon from "../components/Icon"
import PageHero from "../components/PageHero"
import Reveal from "../components/Reveal"
import { useSiteContent } from "../context/SiteContent"
import { usePageMeta } from "../hooks/usePageMeta"

export default function Notices() {
  const { notices } = useSiteContent()
  usePageMeta({
    title: "School Notices, Circulars & Disclosures | Sanskar Mathura",
    description:
      "Access current Sanskar Public School notices, school timings, rules, admission documents, exam pattern and mandatory disclosure.",
    keywords:
      "Sanskar Public School notices, school circular Mathura, CBSE mandatory disclosure Sanskar, admission norms Mathura",
    path: "/notices",
    image: "/optimized/building01.jpg",
  })
  return (
    <div className="bg-cream">
      <PageHero
        eyebrow="Notices & downloads"
        title="Important information, in one place."
        description="Open school circulars, admission documents and disclosures published through the official school notice system."
        image="/optimized/building01.jpg"
        imageAlt="Sanskar Public School campus in Mathura"
      />
      <section className="py-20 lg:py-28">
        <div className="container">
          <Reveal className="grid gap-8 lg:grid-cols-[.65fr_1.35fr]">
            <div>
              <p className="eyebrow">Latest documents</p>
              <h2 className="section-title mt-4">
                School updates for families.
              </h2>
              <p className="section-copy mt-5">
                Documents open as PDFs in a new tab. For clarification, contact
                the school office directly.
              </p>
              <a
                href="tel:+917535938481"
                className="button button-primary mt-7"
              >
                <Icon name="phone" size={17} />
                Call the school
              </a>
            </div>
            <div className="space-y-4">
              {notices.map((notice, index) => (
                <Reveal key={notice.href} delay={(index % 3) * 55}>
                  <a
                    href={notice.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card interactive-card group flex items-center gap-4 p-5 sm:p-6"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e9f4f2] text-teal">
                      <Icon name="calendar" />
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[.14em] text-blue">
                        {notice.type} · {notice.date}
                      </span>
                      <h3 className="mt-1 font-display text-xl font-semibold text-navy sm:text-2xl">
                        {notice.title}
                      </h3>
                    </div>
                    <Icon
                      name="external"
                      className="ml-auto shrink-0 text-slate-400 transition group-hover:text-blue"
                    />
                  </a>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
