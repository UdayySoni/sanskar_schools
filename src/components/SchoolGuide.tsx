import { Link } from "react-router-dom"
import { AFFILIATION_URL } from "../data/search"

export default function SchoolGuide() {
  return (
    <section className="bg-white py-20 lg:py-24" aria-labelledby="school-guide-title">
      <div className="container">
        <p className="eyebrow eyebrow-teal">A guide for parents</p>
        <h2 id="school-guide-title" className="section-title mt-4 max-w-3xl">Choosing the best CBSE school in Mathura for your child.</h2>
        <p className="section-copy mt-5 max-w-3xl">The right school should suit your child’s stage of learning and your family’s daily routine. When comparing schools in Mathura, look beyond a ranking: verify affiliation, explore the classrooms, ask about fees and discuss how teachers support each learner.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-navy/10 p-7">
            <h3 className="font-display text-2xl font-semibold text-navy">Verify the board and learning pathway</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">Sanskar Public School is listed by CBSE as a Senior Secondary school in Mathura, with affiliation number 2132432. Explore the curriculum and discuss Science, Commerce and Humanities options with the school.</p>
            <a href={AFFILIATION_URL} target="_blank" rel="noreferrer" className="mt-5 inline-block font-semibold text-blue underline">Verify Sanskar’s CBSE affiliation</a>
            <Link to="/academics" className="mt-3 block font-semibold text-blue underline">Explore CBSE academics</Link>
          </article>
          <article className="rounded-3xl border border-navy/10 p-7">
            <h3 className="font-display text-2xl font-semibold text-navy">Ask about admission and the full cost</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">Ask for the current fee structure for your child’s grade, including any separate transport or activity charges. Confirm seat availability, age requirements and documents with the admissions office before making a decision.</p>
            <Link to="/admissions" className="mt-5 inline-block font-semibold text-blue underline">School admission process and fee enquiries</Link>
            <Link to="/little-winners" className="mt-3 block font-semibold text-blue underline">Preschool and nursery in Mathura</Link>
          </article>
          <article className="rounded-3xl border border-navy/10 p-7">
            <h3 className="font-display text-2xl font-semibold text-navy">Visit the campus and plan the journey</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">Our campus is on Maholi Road in Mathura. Families travelling from Vrindavan or nearby localities can arrange a visit, see the laboratories and sports spaces, and ask the office about transport availability for their exact location.</p>
            <Link to="/contact" className="mt-5 inline-block font-semibold text-blue underline">Directions to the Maholi Road campus</Link>
            <Link to="/infrastructure" className="mt-3 block font-semibold text-blue underline">See the school’s facilities</Link>
          </article>
        </div>
      </div>
    </section>
  )
}
