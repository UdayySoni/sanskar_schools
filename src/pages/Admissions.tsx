import { useState } from "react"
import { Link } from "react-router-dom"
import Icon from "../components/Icon"
import PageHero from "../components/PageHero"
import Reveal from "../components/Reveal"
import { usePageMeta } from "../hooks/usePageMeta"

const steps = [
  ["Enquire & register", "Share the learner’s details online, by phone or at the school office."],
  ["Meet & interact", "The school meets the child and parents to understand readiness, strengths and fit."],
  ["Age-appropriate assessment", "Nursery–Grade II uses interaction; higher classes may include English, Mathematics and General Awareness."],
  ["Complete admission", "After confirmation, submit the required documents and complete school formalities."],
]

const faqs = [
  ["What are the school fees for admission in Mathura?", "Please request the current fee structure from the admissions office for your child’s grade and academic session. Ask which tuition, admission, transport and activity charges apply. The online fee-payment portal is for payments; it does not replace an admission fee quotation."],
  ["How do I enquire about nursery admission in Mathura?", "Select Nursery and Sanskar Li’l Winners in the enquiry form, or call the Junior Wing on 90125 39208. The team will confirm age eligibility, available places, required documents and an appropriate time to visit."],
  ["Can I enquire about Class 11 admission?", "Yes. Select Grade 11 in the form and mention your preferred stream. The admissions team can explain current subject combinations, seat availability and eligibility based on the student’s previous results."],
  ["Which board is Sanskar Public School affiliated with?", "Sanskar Public School is affiliated with the Central Board of Secondary Education (CBSE), New Delhi. The affiliation number is 2132432, and the school is Senior Secondary level."],
  ["Which Senior Secondary streams are available?", "The school is affiliated for Science, Commerce and Humanities at the Senior Secondary level."],
  ["Does the school serve families from Vrindavan?", "Yes. The campus on Maholi Road is accessible to families across Mathura and the wider Mathura–Vrindavan area. Contact the admissions team to plan a visit and discuss transport for your locality."],
  ["Can we visit before applying?", "Yes. Families are encouraged to book a campus visit, meet the admissions team and explore the learning and sports facilities."],
  ["Are Talent Academy programmes included in school admission?", "Talent Academy uses separate monthly coaching batches and registration. Current details are available through its dedicated portal."],
]

type FormState = {
  studentName: string
  parentName: string
  phone: string
  email: string
  grade: string
  wing: string
  city: string
  message: string
  company: string
}

const emptyForm: FormState = {
  studentName: "",
  parentName: "",
  phone: "",
  email: "",
  grade: "",
  wing: "",
  city: "Mathura",
  message: "",
  company: "",
}

export default function Admissions() {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [feedback, setFeedback] = useState("")
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  }

  usePageMeta({
    title: "School Admission in Mathura 2026–27 | Sanskar Public School",
    description: "Apply for nursery to Class 12 admission at Sanskar Public School Mathura. Check the CBSE admission process, documents, streams and book a campus visit.",
    keywords: "school admission in Mathura, CBSE school admission Mathura 2026-27, nursery admission Mathura, Class 11 admission Mathura, school admission Vrindavan",
    path: "/admissions",
    image: "/optimized/building01.jpg",
    schema: faqSchema,
  })

  const update = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value }))

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setState("sending")
    setFeedback("")
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, source: "admissions-page" }),
      })
      const payload = (await response.json().catch(() => null)) as { message?: string } | null
      if (!response.ok) throw new Error(payload?.message || "We could not submit the enquiry.")
      setState("success")
      setFeedback(payload?.message || "Thank you. The admissions team has received your enquiry.")
      setForm(emptyForm)
    } catch (error) {
      setState("error")
      setFeedback(error instanceof Error ? error.message : "Please try again or call the school office.")
    }
  }

  return (
    <div className="bg-cream">
      <PageHero
        eyebrow="Admissions open · 2026–27"
        title="School admission in Mathura, made personal."
        description="Explore admission at Sanskar Public School and Sanskar Li’l Winners for 2026–27. Ask about your child’s grade, fees, CBSE streams and a visit to our Maholi Road campus."
        image="/optimized/building01.jpg"
        imageAlt="Sanskar Public School campus in Mathura"
        action={{ label: "Go to enquiry form", to: "/admissions#enquiry" }}
      />

      <section id="enquiry" className="scroll-mt-24 py-20 lg:py-28">
        <div className="container grid gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <Reveal>
            <p className="eyebrow">Quick admission enquiry</p>
            <h2 className="section-title mt-4">Let’s plan the right first conversation.</h2>
            <p className="section-copy mt-5 max-w-xl">Complete the form once. Your enquiry is securely recorded for follow-up and emailed to the Sanskar admissions team.</p>
            <form onSubmit={submit} className="mt-8 grid gap-5 rounded-[2rem] bg-white p-6 shadow-[0_20px_65px_rgba(8,43,79,.08)] sm:grid-cols-2 sm:p-8">
              <label className="text-sm font-semibold text-navy">Student’s name<input className="field mt-2" required value={form.studentName} onChange={(event) => update("studentName", event.target.value)} placeholder="Full name" autoComplete="name" /></label>
              <label className="text-sm font-semibold text-navy">Parent’s name<input className="field mt-2" value={form.parentName} onChange={(event) => update("parentName", event.target.value)} placeholder="Parent or guardian" /></label>
              <label className="text-sm font-semibold text-navy">Parent’s phone<input className="field mt-2" required inputMode="tel" pattern="[0-9 +()\-]{10,20}" value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="10-digit mobile number" autoComplete="tel" /></label>
              <label className="text-sm font-semibold text-navy">Email address <span className="font-normal text-slate-400">(optional)</span><input type="email" className="field mt-2" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
              <label className="text-sm font-semibold text-navy">Grade applying for<select className="field mt-2" required value={form.grade} onChange={(event) => update("grade", event.target.value)}><option value="">Choose grade</option><option>Playgroup</option><option>Nursery</option><option>LKG</option><option>UKG</option>{Array.from({ length: 12 }, (_, index) => <option key={index + 1}>Grade {index + 1}</option>)}</select></label>
              <label className="text-sm font-semibold text-navy">Preferred wing<select className="field mt-2" required value={form.wing} onChange={(event) => update("wing", event.target.value)}><option value="">Choose wing</option><option>Sanskar Li’l Winners</option><option>Sanskar Public School</option><option>Need guidance</option></select></label>
              <label className="text-sm font-semibold text-navy sm:col-span-2">City or locality<input className="field mt-2" value={form.city} onChange={(event) => update("city", event.target.value)} placeholder="Mathura, Vrindavan or nearby locality" autoComplete="address-level2" /></label>
              <label className="text-sm font-semibold text-navy sm:col-span-2">How can we help? <span className="font-normal text-slate-400">(optional)</span><textarea className="field mt-2 !h-auto resize-y" rows={3} value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="Ask about a campus visit, admission, transport, fees or your child’s grade." /></label>
              <label className="sr-only" aria-hidden="true">Company<input tabIndex={-1} autoComplete="off" value={form.company} onChange={(event) => update("company", event.target.value)} /></label>
              {feedback && <div role="status" className={`sm:col-span-2 rounded-2xl px-5 py-4 text-sm font-semibold ${state === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{feedback}</div>}
              <p className="text-sm leading-6 text-slate-600 sm:col-span-2">By submitting, you agree that Sanskar Public School may contact you about this admission enquiry. <Link to="/privacy" className="text-blue underline">Read our privacy notice.</Link></p>
              <button type="submit" disabled={state === "sending"} className="button button-primary sm:col-span-2 disabled:cursor-wait disabled:opacity-60">{state === "sending" ? "Sending enquiry…" : "Send admission enquiry"}<Icon name={state === "success" ? "check" : "arrow"} size={18} /></button>
            </form>
          </Reveal>
          <Reveal delay={100} className="space-y-5">
            <div className="rounded-[2rem] bg-navy p-8 text-white"><p className="text-xs font-bold uppercase tracking-[.14em] text-gold">Senior Wing</p><h3 className="mt-2 font-display text-3xl font-semibold">Sanskar Public School</h3><p className="mt-3 text-sm leading-7 text-white/60">CBSE Senior Secondary · Science, Commerce & Humanities</p><a href="tel:+917535938481" className="mt-6 flex items-center gap-3 font-semibold"><Icon name="phone" className="text-gold" />75359 38481</a><a href="tel:+919897363809" className="mt-3 flex items-center gap-3 font-semibold"><Icon name="phone" className="text-gold" />98973 63809</a></div>
            <div className="rounded-[2rem] bg-[#e9f4f2] p-8"><p className="text-xs font-bold uppercase tracking-[.14em] text-teal">Junior Wing</p><h3 className="mt-2 font-display text-3xl font-semibold text-navy">Sanskar Li’l Winners</h3><p className="mt-3 text-sm leading-7 text-slate-600">Early-years learning with a Montessori-inspired, activity-rich approach.</p><a href="tel:+919012539208" className="mt-6 flex items-center gap-3 font-semibold text-navy"><Icon name="phone" className="text-teal" />90125 39208</a></div>
            <div className="rounded-3xl border border-navy/10 p-6"><p className="flex gap-3 text-sm leading-7 text-slate-600"><Icon name="location" className="mt-1 shrink-0 text-blue" />Industrial Area, Site-A, Maholi Road, Mathura, Uttar Pradesh 281004</p><a href="mailto:sanskarschool2009@gmail.com" className="mt-4 flex gap-3 text-sm font-semibold text-navy"><Icon name="mail" className="text-blue" />sanskarschool2009@gmail.com</a></div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28"><div className="container"><Reveal className="text-center"><p className="eyebrow">Admission process</p><h2 className="section-title mt-4">Clear steps, thoughtful interaction.</h2></Reveal><div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{steps.map(([title, copy], index) => <Reveal key={title} delay={index * 70} className="relative rounded-3xl border border-navy/10 p-7"><span className="font-display text-4xl text-gold">0{index + 1}</span><h3 className="mt-5 font-display text-2xl font-semibold text-navy">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{copy}</p></Reveal>)}</div></div></section>
      <section className="py-20 lg:py-28"><div className="container grid gap-12 lg:grid-cols-2"><Reveal><p className="eyebrow eyebrow-teal">Documents checklist</p><h2 className="section-title mt-4">Prepare these for admission.</h2><p className="section-copy mt-5">The admissions office will confirm the exact current requirement for your child’s grade.</p></Reveal><Reveal delay={80} className="card p-7 sm:p-9"><ul className="grid gap-4 sm:grid-cols-2">{["Five passport-size photographs of the child", "Government-approved ID of both parents", "Two passport-size photographs of each parent", "Child’s date-of-birth certificate", "Vaccination record or medical certificate", "Transfer Certificate for Class I and above", "Previous school progress report"].map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e9f4f2] text-teal"><Icon name="check" size={13} /></span>{item}</li>)}</ul></Reveal></div></section>
      <section className="bg-[#e9f4f2] py-20 lg:py-24"><div className="container max-w-4xl"><Reveal className="text-center"><p className="eyebrow eyebrow-teal">Admissions FAQ</p><h2 className="section-title mt-4">Helpful answers for Mathura–Vrindavan families.</h2></Reveal><div className="mt-10 space-y-3">{faqs.map(([question, answer]) => <details key={question} className="group rounded-2xl bg-white px-6 py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy">{question}<span className="text-2xl font-normal text-teal transition-transform group-open:rotate-45">+</span></summary><p className="mt-4 pr-8 text-sm leading-7 text-slate-600">{answer}</p></details>)}</div></div></section>
    </div>
  )
}
