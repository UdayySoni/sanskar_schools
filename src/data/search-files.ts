// Pure generators shared by the build and the Worker. No crawler-specific content.
type Site = { url: string; routes: string[]; nonIndexableRoutes: string[] }
type Metadata = Record<string, { title: string; description: string }>
type Profile = { name: string; description: string; affiliationNumber: string; affiliationUrl: string; primaryPhone: string; secondaryPhone: string; email: string; address: string }
type Faqs = Record<string, string[][]>

const escapeXml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;")
const line = (value: string) => value.replace(/[\r\n]+/g, " ").trim()
const label = (value: string) => line(value).replace(/[\\[\]]/g, "\\$&")
const indexableRoutes = (site: Site) => site.routes.filter(path => !site.nonIndexableRoutes.includes(path))

export function robotsText(site: Site) {
  // The wildcard permits search/retrieval crawlers while protecting application endpoints.
  return `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${site.url}/sitemap.xml\n`
}

export function sitemapXml(site: Site) {
  // Omit lastmod unless an actual page modification date is available.
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + indexableRoutes(site).map(path => `  <url><loc>${escapeXml(site.url + path)}</loc></url>`).join("\n") + "\n</urlset>\n"
}

export function llmsText(site: Site, profile: Profile, pages: Metadata, faqs: Faqs, full = false) {
  const paths = indexableRoutes(site)
  const link = (path: string) => {
    const page = pages[path]
    if (!page) throw new Error(`Missing search metadata for ${path}`)
    return `- [${label(page.title)}](${site.url}${path}): ${line(page.description)}`
  }
  const sections = [
    `# ${profile.name}, Mathura`,
    `> Official website. ${profile.description} CBSE affiliation number: ${profile.affiliationNumber}.`,
    `Official website: ${site.url}/\nAddress: ${line(profile.address)}\nSenior Wing phone: ${line(profile.primaryPhone)}\nJunior Wing phone: ${line(profile.secondaryPhone)}\nEmail: ${line(profile.email)}`,
    "Fees, age eligibility, available places, subject combinations, transport routes and coaching schedules should be confirmed with the school for the relevant class and session. School-published comparisons are editorial selections, not independent or official rankings. Generated illustrations are labelled and do not depict actual students or staff.",
    "## School and parent information\n" + paths.filter(path => !path.startsWith("/blog/") && !path.startsWith("/leadership/") && !["/privacy", "/website-terms", "/editorial-policy"].includes(path)).map(link).join("\n"),
    "## Parent guides\n" + paths.filter(path => path.startsWith("/blog/")).map(link).join("\n"),
    "## Verification and policies\n" + `- [CBSE affiliation record](${profile.affiliationUrl}): Official affiliation record for ${profile.affiliationNumber}.\n` + ["/editorial-policy", "/privacy", "/website-terms"].filter(path => paths.includes(path)).map(link).join("\n"),
    "## Optional\n" + paths.filter(path => path.startsWith("/leadership/")).map(link).join("\n") + `\n- [School facts and parent answers](${site.url}/llms-full.txt): Expanded text reference with canonical page sources.\n- [XML sitemap](${site.url}/sitemap.xml): Indexable website pages.`,
  ]
  if (full) {
    sections.push("## School and admission answers\nThese answers are also published on the linked public pages.")
    for (const [path, answers] of Object.entries(faqs)) {
      if (!paths.includes(path)) continue
      sections.push(`Source: ${site.url}${path}\n\n` + answers.map(([question, answer]) => `### ${question}\n\n${answer}`).join("\n\n"))
    }
    sections.push("## Page summaries\nSummaries below describe the linked pages; follow the sources for full content and current details.")
    for (const path of paths) sections.push(`### ${pages[path].title}\n\nSource: ${site.url}${path}\n\n${line(pages[path].description)}`)
  }
  sections.push("This optional information reference does not override robots.txt, content-use signals or access controls.")
  return sections.join("\n\n") + "\n"
}
