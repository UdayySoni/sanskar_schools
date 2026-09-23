import Icon from "../components/Icon"
import PageHero from "../components/PageHero"
import Reveal from "../components/Reveal"
import { PAYMENT_LINKS, SCHOOL_PHONE_DISPLAY } from "../data/site"
import { usePageMeta } from "../hooks/usePageMeta"

export default function PayFee() {
  usePageMeta({
    title: "Pay School Fees Online | Sanskar Public School Mathura",
    description:
      "Choose the official online fee-payment portal for Sanskar Public School Senior Wing or Sanskar Li'l Winners junior wing in Mathura.",
    keywords:
      "Sanskar Public School fee payment, pay school fees online Mathura, Sanskar Li'l Winners fees",
    path: "/pay-fee",
    image: "/optimized/building01.jpg",
  })
  return (
    <div className="bg-cream">
      <PageHero
        eyebrow="Parent services"
        title="Pay school fees online."
        description="Choose the correct wing below to continue to the school’s secure external payment portal."
        image="/optimized/gallery-campus-slide-2.jpg"
        imageAlt="Sanskar school community at a formal school event"
      />
      <section className="py-20 lg:py-28">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Select your wing</p>
            <h2 className="section-title mt-4">
              Two official payment portals.
            </h2>
            <p className="section-copy mt-5">
              Please confirm the student name, admission details and amount
              before submitting payment. The payment websites open in a new tab.
            </p>
          </Reveal>
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
            <Reveal className="card interactive-card p-8">
              <span className="icon-box">
                <Icon name="graduation" />
              </span>
              <p className="mt-6 text-xs font-bold uppercase tracking-[.14em] text-blue">
                Primary to Senior Secondary
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-navy">
                Sanskar Public School
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Use this portal for students enrolled in the Senior Wing.
              </p>
              <a
                href={PAYMENT_LINKS.senior}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-primary mt-7"
              >
                Pay Senior Wing fee <Icon name="external" size={17} />
              </a>
            </Reveal>
            <Reveal delay={80} className="card interactive-card p-8">
              <span className="icon-box">
                <Icon name="spark" />
              </span>
              <p className="mt-6 text-xs font-bold uppercase tracking-[.14em] text-teal">
                Early years
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-navy">
                Sanskar Li'l Winners
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Use this portal for students enrolled in the junior wing.
              </p>
              <a
                href={PAYMENT_LINKS.junior}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-primary mt-7"
              >
                Pay Li'l Winners fee <Icon name="external" size={17} />
              </a>
            </Reveal>
          </div>
          <Reveal className="mx-auto mt-8 max-w-4xl rounded-2xl border border-gold/30 bg-gold/10 p-5 text-sm leading-7 text-navy">
            <strong>Payment help:</strong> If you are unsure which portal to use
            or a transaction does not complete, call the school office at{" "}
            <a href="tel:+917535938481" className="font-bold underline">
              {SCHOOL_PHONE_DISPLAY}
            </a>
            . Avoid sharing OTPs or card details with anyone.
          </Reveal>
        </div>
      </section>
    </div>
  )
}
