import Icon from "../components/Icon"
import PageHero from "../components/PageHero"
import Reveal from "../components/Reveal"
import { SCHOOL_PHONE, SCHOOL_PHONE_DISPLAY, WHATSAPP_URL } from "../data/site"
import { usePageMeta } from "../hooks/usePageMeta"

const MAP =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3539.594400823623!2d77.66288451469654!3d27.481883941971656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3973714fe2def7c9%3A0xb0330e2ce53ebb27!2sSanskar%20Public%20School!5e0!3m2!1sen!2sin!4v1576524663349!5m2!1sen!2sin"

export default function Contact() {
  usePageMeta({
    title: "Contact Sanskar Public School Mathura",
    description:
      "Contact or visit Sanskar Public School at Industrial Area, Site-A, Maholi Road, Mathura. Call the Senior Wing, Li'l Winners or message the admissions team.",
    keywords:
      "Sanskar Public School contact number, school Maholi Road Mathura, CBSE school address Mathura, school admission enquiry Mathura",
    path: "/contact",
    image: "/optimized/building01.jpg",
  })
  return (
    <div className="bg-cream">
      <PageHero
        eyebrow="Contact & visit"
        title="Come and experience Sanskar."
        description="Meet the team, see the campus and discuss the right learning journey for your child."
        image="/optimized/building01.jpg"
        imageAlt="Sanskar Public School campus on Maholi Road, Mathura"
        action={{ label: "Admission enquiry", to: "/admissions#enquiry" }}
      />
      <section className="py-20 lg:py-28">
        <div className="container grid gap-6 md:grid-cols-3">
          {[
            {
              icon: "location" as const,
              title: "Visit",
              body: "Industrial Area, Site-A, Maholi Road, Mathura, Uttar Pradesh 281004",
              href: "https://www.google.com/maps/search/?api=1&query=Sanskar+Public+School+Maholi+Road+Mathura",
              label: "Open directions",
            },
            {
              icon: "phone" as const,
              title: "Call",
              body: `Senior Wing: ${SCHOOL_PHONE_DISPLAY}\nOffice: +91 98973 63809`,
              href: `tel:${SCHOOL_PHONE}`,
              label: "Call Senior Wing",
            },
            {
              icon: "mail" as const,
              title: "Write",
              body: "sanskarschool2009@gmail.com\nWhatsApp admissions support",
              href: WHATSAPP_URL,
              label: "Message on WhatsApp",
            },
          ].map((item, index) => (
            <Reveal
              key={item.title}
              delay={index * 65}
              className="card interactive-card p-7"
            >
              <span className="icon-box">
                <Icon name={item.icon} />
              </span>
              <h2 className="mt-6 font-display text-3xl font-semibold text-navy">
                {item.title}
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                {item.body}
              </p>
              <a
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue"
              >
                {item.label}
                <Icon name="arrow" size={16} />
              </a>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="bg-white py-20">
        <div className="container grid gap-8 lg:grid-cols-[1.25fr_.75fr]">
          <Reveal className="overflow-hidden rounded-[2rem] border border-slate-200">
            <iframe
              src={MAP}
              title="Map to Sanskar Public School Mathura"
              className="h-[500px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
          <Reveal delay={80} className="flex flex-col justify-center">
            <p className="eyebrow eyebrow-teal">Useful numbers</p>
            <h2 className="mt-4 font-display text-4xl font-semibold text-navy">
              We’re here to help.
            </h2>
            <div className="mt-7 space-y-4 text-sm leading-7 text-slate-600">
              <p>
                <strong className="text-navy">Senior Wing</strong>
                <br />
                <a href="tel:+917535938481">75359 38481</a> ·{" "}
                <a href="tel:+919897363809">98973 63809</a>
              </p>
              <p>
                <strong className="text-navy">Li'l Winners</strong>
                <br />
                <a href="tel:+919012539208">90125 39208</a>
              </p>
              <p>
                <strong className="text-navy">Email</strong>
                <br />
                <a href="mailto:sanskarschool2009@gmail.com">
                  sanskarschool2009@gmail.com
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
