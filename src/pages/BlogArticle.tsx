import Image from "../components/Image"
import { Link, useParams, useLocation } from "react-router-dom"
import { BLOG_POSTS, blogPath, readingMinutes, type BlogPost } from "../data/blog"
import { usePageMeta } from "../hooks/usePageMeta"

function Article({ post }: { post: BlogPost }) {
  usePageMeta({ title: post.seoTitle, description: post.description, path: blogPath(post), image: post.image })
  return <div className="bg-cream pb-20 pt-36 lg:pt-48">
    <div className="container">
      <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap gap-2 text-sm text-slate-600"><Link to="/">Home</Link><span aria-hidden="true">/</span><Link to="/blog">Blog</Link><span aria-hidden="true">/</span><span aria-current="page">{post.title}</span></nav>
      <article>
        <header className="max-w-4xl">
          <p className="eyebrow eyebrow-teal">{post.category}</p>
          <h1 className="section-title mt-5">{post.title}</h1>
          <p className="mt-6 text-sm leading-7 text-slate-600">By <Link to="/about" className="font-semibold text-navy underline">Sanskar Public School</Link> · <time dateTime={post.date}>{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(post.date))}</time> · {readingMinutes(post)} min read</p>
        </header>
        <figure className="mt-9"><Image src={post.image} alt={post.imageAlt} width={1536} height={1024} fetchPriority="high" className="aspect-[3/2] max-h-[560px] w-full rounded-3xl object-cover" />{post.imageCaption && <figcaption className="mt-2 text-xs text-slate-500">{post.imageCaption}</figcaption>}</figure>
        <div className="mt-12 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 max-w-3xl">
            <p className="text-lg leading-8 text-navy">{post.introduction}</p>
            {post.sections.map(section => <section key={section.id} id={section.id} className="mt-10 scroll-mt-36">
              <h2 className="blog-section-title font-semibold text-navy">{section.title}</h2>
              {section.paragraphs.map(paragraph => <p key={paragraph} className="mt-4 text-base leading-8 text-slate-600">{paragraph}</p>)}
              {section.checklist && <ul className="mt-5 list-disc space-y-3 pl-6 leading-7 text-slate-600">{section.checklist.map(item => <li key={item}>{item}</li>)}</ul>}
              {section.source && <p className="mt-3 text-sm">{section.source.href.startsWith("/") ? <Link to={section.source.href} className="text-blue underline underline-offset-4">{section.source.label}</Link> : <a href={section.source.href} target="_blank" rel="noopener noreferrer" className="text-blue underline underline-offset-4">{section.source.label}</a>}</p>}
            </section>)}
            <section className="mt-10 rounded-3xl border border-navy/10 bg-white p-7"><h2 className="font-display text-2xl font-semibold text-navy">Explore and verify</h2><ul className="mt-5 space-y-4">{post.links.map(link => <li key={link.href}>{link.href.startsWith("/") ? <Link className="font-semibold text-blue underline underline-offset-4" to={link.href}>{link.label}</Link> : <a className="font-semibold text-blue underline underline-offset-4" href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>}</li>)}</ul></section>
          </div>
          <aside className="rounded-3xl bg-white p-7 lg:sticky lg:top-36"><nav aria-label="In this article"><h2 className="font-display text-2xl font-semibold text-navy">In this guide</h2><ol className="mt-5 space-y-4">{post.sections.map(section => <li key={section.id}><a href={`#${section.id}`} className="text-sm leading-6 text-slate-600 hover:text-blue">{section.title}</a></li>)}</ol></nav><Link to="/admissions#enquiry" className="button button-primary mt-8 w-full">Ask about admission</Link></aside>
        </div>
        <section className="mt-10 max-w-3xl rounded-2xl bg-white p-6"><h2 className="blog-section-title text-navy">About the publisher</h2><p className="mt-3 leading-7 text-slate-600">Sanskar Public School publishes these articles to explain our approach, activities and admissions. Our school selections reflect our own perspective.</p><Link to="/editorial-policy" className="mt-3 inline-block text-sm font-semibold text-blue underline">Read our editorial policy</Link></section>
      </article>
      <section className="mt-16 border-t border-navy/10 pt-10"><h2 className="font-display text-3xl font-semibold text-navy">Continue reading</h2><div className="mt-6 grid gap-5 md:grid-cols-2">{BLOG_POSTS.filter(other => other.slug !== post.slug).map(other => <Link key={other.slug} to={blogPath(other)} className="rounded-2xl bg-white p-6 font-display text-2xl font-semibold text-navy hover:text-blue">{other.title}</Link>)}</div></section>
    </div>
  </div>
}

function MissingArticle() {
  const { pathname } = useLocation()
  usePageMeta({ title: "Article not found | Sanskar", description: "Explore school selection and admission guides in the Sanskar journal.", path: pathname })
  return <div className="container pb-24 pt-48"><h1 className="section-title">Article not found</h1><Link to="/blog" className="button button-primary mt-8">Browse the blog</Link></div>
}

export default function BlogArticle() {
  const { slug } = useParams()
  const post = BLOG_POSTS.find(item => item.slug === slug)
  return post ? <Article post={post} /> : <MissingArticle />
}
