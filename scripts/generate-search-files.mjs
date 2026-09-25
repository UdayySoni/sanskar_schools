import { readFileSync, writeFileSync } from "node:fs"
import { robotsText, sitemapXml, llmsText } from "../src/data/search-files.ts"
import { HOME_FAQS, ADMISSIONS_FAQS } from "../src/data/faqs.ts"
import { BLOG_POSTS, blogPath } from "../src/data/blog.ts"
import { POLICIES } from "../src/data/policies.ts"

const site = JSON.parse(readFileSync(new URL("../site.config.json", import.meta.url), "utf8"))
const profile = JSON.parse(readFileSync(new URL("../src/data/school-profile.json", import.meta.url), "utf8"))
const pages = {
  ...JSON.parse(readFileSync(new URL("../seo.config.json", import.meta.url), "utf8")),
  ...Object.fromEntries(Object.entries(POLICIES).map(([path, policy]) => [path, { title: `${policy.title} | Sanskar Public School`, description: policy.description }])),
  ...Object.fromEntries(BLOG_POSTS.map(post => [blogPath(post), { title: post.seoTitle, description: post.description }])),
}
const faqs = { "/": HOME_FAQS, "/admissions": ADMISSIONS_FAQS }
for (const [file, text] of Object.entries({
  "robots.txt": robotsText(site),
  "sitemap.xml": sitemapXml(site),
  "llms.txt": llmsText(site, profile, pages, faqs),
  "llms-full.txt": llmsText(site, profile, pages, faqs, true),
})) writeFileSync(new URL(`../public/${file}`, import.meta.url), text)
