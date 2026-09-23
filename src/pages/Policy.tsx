import { Link, useLocation } from "react-router-dom"
import { POLICIES } from "../data/policies"
import { usePageMeta } from "../hooks/usePageMeta"

export default function Policy() {
  const { pathname } = useLocation()
  const policy = POLICIES[pathname]
  usePageMeta({ title: `${policy.title} | Sanskar Public School`, description: policy.description, path: pathname })
  return <div className="bg-cream pb-20 pt-36 lg:pt-48"><div className="container max-w-4xl">
    <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-600"><Link to="/">Home</Link><span aria-hidden="true"> / </span><span aria-current="page">{policy.title}</span></nav>
    <h1 className="section-title">{policy.title}</h1>
    <p className="mt-4 text-sm text-slate-500">Updated <time dateTime="2026-09-13">13 September 2026</time></p>
    <p className="section-copy mt-6">{policy.description}</p>
    {policy.sections.map(section => <section className="mt-8" key={section.title}><h2 className="blog-section-title text-navy">{section.title}</h2><p className="mt-3 leading-8 text-slate-600">{section.text}</p></section>)}
    <div className="mt-10 flex flex-wrap gap-5 text-sm font-semibold text-blue"><Link to="/about">About Sanskar</Link><Link to="/contact">Contact the school</Link><Link to="/blog">Read our blog</Link></div>
  </div></div>
}
