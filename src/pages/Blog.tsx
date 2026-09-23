import Image from "../components/Image"
import { Link } from "react-router-dom"
import { BLOG_POSTS, blogPath, readingMinutes } from "../data/blog"
import { usePageMeta } from "../hooks/usePageMeta"
import Icon from "../components/Icon"

export default function Blog() {
  usePageMeta({ title: "Mathura School Guides & Admissions Blog | Sanskar", description: "Helpful guides for parents comparing schools in Mathura: choosing a school, making a shortlist and preparing for admission.", path: "/blog" })
  return <div className="bg-cream pb-20 pt-36 lg:pt-48">
    <div className="container">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-600"><Link to="/" className="hover:text-blue">Home</Link><span aria-hidden="true" className="mx-3">/</span><span aria-current="page">Blog</span></nav>
      <p className="eyebrow eyebrow-teal">The Sanskar journal</p>
      <h1 className="section-title mt-4 max-w-3xl">Learning & school guides for Mathura families</h1>
      <p className="section-copy mt-6 max-w-2xl">Practical ideas for learning at home, questions to ask on a campus visit and admission guidance. Explore what the best school in Mathura means for your child, or start with our top 10 schools in Mathura guide.</p>
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {BLOG_POSTS.map(post => <article key={post.slug} className="card flex flex-col overflow-hidden bg-white">
          <Link to={blogPath(post)} tabIndex={-1} aria-hidden="true"><Image src={post.image} alt="" width={720} height={480} loading="lazy" decoding="async" className="aspect-[3/2] w-full object-cover" /></Link>
          <div className="flex flex-1 flex-col p-7">
            <p className="text-xs font-bold uppercase tracking-widest text-teal">{post.category} · {readingMinutes(post)} min read</p>
            <h2 className="blog-card-title mt-4 font-semibold text-navy"><Link to={blogPath(post)} className="hover:text-blue">{post.title}</Link></h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{post.description}</p>
            <Link to={blogPath(post)} className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-blue" aria-label={`Read: ${post.title}`}>Read the guide <Icon name="arrow" size={17} /></Link>
          </div>
        </article>)}
      </div>
      <div className="mt-14 flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-navy p-8 text-white sm:p-10"><div><h2 className="font-display text-3xl font-semibold">See the school behind the stories.</h2><p className="mt-3 text-white/75">Bring your questions to our Maholi Road campus in Mathura.</p></div><Link to="/contact" className="button button-gold">Plan a visit <Icon name="arrow" /></Link></div>
    </div>
  </div>
}
