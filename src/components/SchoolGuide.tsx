import { Link } from "react-router-dom"
import { AFFILIATION_URL } from "../data/search"

export default function SchoolGuide() {
  return <section className="bg-white py-16 lg:py-20" aria-labelledby="school-guide-title"><div className="container">
    <p className="eyebrow eyebrow-teal">Get to know Sanskar</p>
    <h2 id="school-guide-title" className="section-title mt-4 max-w-3xl">Looking for the best school in Mathura?</h2>
    <p className="section-copy mt-5 max-w-3xl">At Sanskar Public School, we bring CBSE academics and Indian values together. Children can explore science, arts and sport while building confidence and good habits. Visit our Maholi Road campus to see what we offer and talk about your child's needs.</p>
    <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-blue">
      <Link to="/blog/choosing-best-school-in-mathura" className="underline underline-offset-4">Why choose Sanskar?</Link>
      <Link to="/blog/top-10-schools-in-mathura-shortlist" className="underline underline-offset-4">Our top 10 schools in Mathura</Link>
      <Link to="/blog/top-10-schools-in-mathura-shortlist#top-3-schools-in-mathura" className="underline underline-offset-4">Our top 3 schools in Mathura</Link>
      <Link to="/blog/reading-habits-primary-children-mathura" className="underline underline-offset-4">Build a reading habit at home</Link>
    </div>
    <div className="mt-10 grid gap-6 md:grid-cols-3">
      <article className="rounded-3xl border border-navy/10 p-7"><h3 className="text-navy">CBSE academics</h3><p className="mt-4 text-sm leading-7 text-slate-600">Our Senior Secondary affiliation number is 2132432. Explore the subjects and speak to us about Science, Commerce and Humanities. We can help you understand the options for your child's next class.</p><a href={AFFILIATION_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block font-semibold text-blue underline">Verify Sanskar's CBSE affiliation</a></article>
      <article className="rounded-3xl border border-navy/10 p-7"><h3 className="text-navy">Admission made simple</h3><p className="mt-4 text-sm leading-7 text-slate-600">Tell us the class and session you need. Our team can explain available places, documents and fees. For younger children, ask about Sanskar Li'l Winners and the early-years routine.</p><Link to="/admissions" className="mt-5 inline-block font-semibold text-blue underline">Ask about admission</Link></article>
      <article className="rounded-3xl border border-navy/10 p-7"><h3 className="text-navy">Come and visit</h3><p className="mt-4 text-sm leading-7 text-slate-600">See our classrooms, labs and sports spaces in person. Families from Mathura, Vrindavan and nearby areas can arrange a visit and ask about transport from their exact address.</p><Link to="/contact" className="mt-5 inline-block font-semibold text-blue underline">Get directions and contact us</Link></article>
    </div>
  </div></section>
}
