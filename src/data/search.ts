import site from "../../site.config.json"
import metadata from "../../seo.config.json"

export const PAGE_SEO: Record<string, { title: string; description: string }> = metadata
export const AFFILIATION_URL = "https://saras.cbse.gov.in/SARAS/AffiliatedList/AfflicationDetails/2132432"
export const NON_INDEXABLE = ["/virtual-tour", "/pay-fee"]
export const LEGACY_ROUTES: Record<string, string> = {
  "/admission": "/admissions",
  "/contact-us": "/contact",
  "/index.html": "/",
}

export function structuredData(path: string, title: string, description: string, settings: Record<string, unknown> = {}) {
  const base = site.url
  const schoolId = base + "/#school"
  const websiteId = base + "/#website"
  const url = base + path
  const school = {
    "@type": "School", "@id": schoolId, name: "Sanskar Public School",
    alternateName: "Sanskar Public School Mathura", url: base + "/",
    logo: base + "/optimized/logo-circle.png", image: base + "/optimized/building01.jpg",
    description: "CBSE Senior Secondary school on Maholi Road in Mathura, Uttar Pradesh.",
    telephone: [settings.primaryPhone || "75359 38481", settings.secondaryPhone || "90125 39208"],
    email: settings.email || "sanskarschool2009@gmail.com",
    address: settings.address || "Industrial Area, Site-A, Maholi Road, Mathura, Uttar Pradesh 281004",
    sameAs: [AFFILIATION_URL, "https://www.linkedin.com/company/sanskar-school-mathura", "https://www.youtube.com/@sanskarpublicschoolmathura4604"],
    identifier: { "@type": "PropertyValue", propertyID: "CBSE affiliation number", value: "2132432" },
  }
  const graph: Record<string, unknown>[] = [school,
    { "@type": "WebSite", "@id": websiteId, url: base + "/", name: "Sanskar Public School Mathura", publisher: { "@id": schoolId }, inLanguage: "en-IN" },
    { "@type": path === "/contact" ? "ContactPage" : path === "/about" ? "AboutPage" : "WebPage",
      "@id": url + "#webpage", url, name: title, description, inLanguage: "en-IN",
      isPartOf: { "@id": websiteId }, about: { "@id": schoolId },
      ...(path !== "/" ? { breadcrumb: { "@id": url + "#breadcrumb" } } : {}),
    },
  ]
  if (path !== "/") graph.push({ "@type": "BreadcrumbList", "@id": url + "#breadcrumb", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: base + "/" },
    { "@type": "ListItem", position: 2, name: title.split(" | ")[0], item: url },
  ] })
  return { "@context": "https://schema.org", "@graph": graph }
}
