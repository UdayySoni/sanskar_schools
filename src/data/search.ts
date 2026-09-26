import site from "../../site.config.json"
import metadata from "../../seo.config.json"
import { BLOG_POSTS, blogPath, findPost } from "./blog"
import { POLICIES } from "./policies"
import { HOME_FAQS, ADMISSIONS_FAQS } from "./faqs"
import schoolProfile from "./school-profile.json"
import { SOCIAL_LINKS } from "./social"

export const PAGE_SEO: Record<string, { title: string; description: string }> = {
  ...metadata,
  ...Object.fromEntries(Object.entries(POLICIES).map(([path, policy]) => [path, { title: `${policy.title} | Sanskar Public School`, description: policy.description }])),
  ...Object.fromEntries(BLOG_POSTS.map(post => [blogPath(post), { title: post.seoTitle, description: post.description }])),
}
export const AFFILIATION_URL = schoolProfile.affiliationUrl
export const PAGE_FAQS: Record<string, string[][]> = { "/": HOME_FAQS, "/admissions": ADMISSIONS_FAQS }
export const NON_INDEXABLE = site.nonIndexableRoutes
export const LEGACY_ROUTES: Record<string, string> = {
  "/admission": "/admissions",
  "/contact-us": "/contact",
  "/index.html": "/",
}

export function structuredData(path: string, title: string, description: string, settings: Record<string, unknown> = {}) {
  const post = findPost(path)
  const base = site.url
  const schoolId = base + "/#school"
  const websiteId = base + "/#website"
  const url = base + path
  const school = {
    "@type": "School", "@id": schoolId, name: "Sanskar Public School",
    alternateName: "Sanskar Public School Mathura", url: base + "/",
    logo: base + "/optimized/logo-circle.png", image: base + "/optimized/building01.jpg",
    description: "CBSE Senior Secondary school on Maholi Road in Mathura, Uttar Pradesh.",
    telephone: [settings.primaryPhone || schoolProfile.primaryPhone, settings.secondaryPhone || schoolProfile.secondaryPhone],
    email: settings.email || schoolProfile.email,
    address: { "@type": "PostalAddress", streetAddress: settings.address || "Industrial Area, Site-A, Maholi Road", addressLocality: "Mathura", addressRegion: "Uttar Pradesh", postalCode: "281004", addressCountry: "IN" },
    sameAs: [AFFILIATION_URL, ...SOCIAL_LINKS.map(social => social.url)],
    identifier: { "@type": "PropertyValue", propertyID: "CBSE affiliation number", value: "2132432" },
  }
  const graph: Record<string, unknown>[] = [school,
    { "@type": "WebSite", "@id": websiteId, url: base + "/", name: "Sanskar Public School Mathura", publisher: { "@id": schoolId }, inLanguage: "en-IN" },
    { "@type": PAGE_FAQS[path] ? "FAQPage" : path === "/contact" ? "ContactPage" : path === "/about" ? "AboutPage" : path === "/blog" ? "CollectionPage" : "WebPage",
      "@id": url + "#webpage", url, name: title, description, inLanguage: "en-IN",
      isPartOf: { "@id": websiteId }, about: { "@id": schoolId },
      ...(PAGE_FAQS[path] ? { mainEntity: PAGE_FAQS[path].map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) } : {}),
      ...(path !== "/" ? { breadcrumb: { "@id": url + "#breadcrumb" } } : {}),
    },
  ]
  if (path !== "/") graph.push({ "@type": "BreadcrumbList", "@id": url + "#breadcrumb", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: base + "/" },
    ...(post ? [{ "@type": "ListItem", position: 2, name: "Blog", item: base + "/blog" }] : []),
    { "@type": "ListItem", position: post ? 3 : 2, name: post?.title || title.split(" | ")[0], item: url },
  ] })
  if (post) graph.push({
    "@type": "BlogPosting", "@id": url + "#article", headline: post.title, description,
    url, image: base + post.image, datePublished: post.date, dateModified: post.date,
    author: { "@type": "Organization", name: "Sanskar Public School", url: base + "/about" },
    publisher: { "@id": schoolId }, mainEntityOfPage: { "@id": url + "#webpage" },
    inLanguage: "en-IN", articleSection: post.category,
  })
  if (path === "/blog") graph.push({
    "@type": "Blog", "@id": url + "#blog", name: "The Sanskar journal", url,
    publisher: { "@id": schoolId }, blogPost: BLOG_POSTS.map(item => ({ "@type": "BlogPosting", headline: item.title, url: base + blogPath(item) })),
  })
  return { "@context": "https://schema.org", "@graph": graph }
}
