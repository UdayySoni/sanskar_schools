# Mathura school search research — September 10, 2026

This is a qualitative search audit, not a measured Google rank or search-volume report. Results vary by location and search engine. Number-one placement cannot be guaranteed.

## Queries and page focus

| Search intent | Primary page | Improvements |
| --- | --- | --- |
| CBSE school Mathura; best school in Mathura; schools in Mathura | `/` | Local school identity, parent comparison guide, affiliation evidence and relevant internal links |
| School admission Mathura; CBSE admission 2026–27; school fees Mathura | `/admissions` | Local heading, admission process, documents, fee enquiry guidance and grade-specific FAQs |
| Preschool Mathura; nursery admission Mathura | `/little-winners`, `/admissions` | Clear nursery/preschool metadata and a direct enquiry route |
| CBSE Class 11 Mathura; Science, Commerce, Humanities | `/academics`, `/admissions` | Distinct curriculum metadata and an eligibility/availability enquiry answer |
| Schools near Vrindavan; Mathura–Vrindavan school admission | `/`, `/contact`, `/admissions` | Honest description of the Maholi Road, Mathura campus; families should confirm travel and transport with the school |
| Sanskar Public School contact; Maholi Road school | `/contact` | Canonical contact URL, school identity graph and permanent redirect from indexed `/contact-us` |

Search results for best CBSE schools in Mathura included school directories and admissions comparisons. Fee and admission searches surfaced official fee schedules and admission documents. The implementation answers those parent questions without inventing fees, rankings, transport coverage or a Vrindavan branch.

The school's own indexed legacy URLs included `/admission` and `/contact-us`. Both now permanently redirect to their matching current page, preserving query parameters. Unknown URLs remain genuine 404s instead of being redirected indiscriminately to the homepage.

## Evidence and implementation

- [Official CBSE SARAS record](https://saras.cbse.gov.in/SARAS/AffiliatedList/AfflicationDetails/2132432) verifies affiliation 2132432, Senior Secondary status and the Mathura address. The previous structured-data founding year (2009) disagreed with this record (2011), so the uncertain founding year was removed from markup. School history elsewhere was not rewritten.
- [Indexed legacy admission page](https://www.sanskarschools.com/admission) and [contact page](https://www.sanskarschools.com/contact-us) informed the redirect map.
- [Google redirect guidance](https://developers.google.com/search/docs/crawling-indexing/301-redirects) informed permanent server redirects and canonical consolidation.
- [Google JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) informed consistent server/client metadata. Page titles, descriptions, School/WebSite/WebPage and breadcrumb data are served in initial HTML. Main page content remains React-rendered; this change does not claim full server-side rendering.
- [Google breadcrumb guidance](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) informed breadcrumb markup and visible navigation on page heroes.
- Existing FAQ markup remains aligned with visible FAQ answers. [Google restricts FAQ rich results](https://developers.google.com/search/blog/2023/08/howto-faq-changes) primarily to authoritative government/health sites; no school FAQ rich-result promise is made.

Shared defaults in `seo.config.json` cover every public route. Existing dashboard SEO overrides still take precedence. Database content and admin credentials are not changed. Payment and unfinished virtual-tour pages are excluded from the sitemap and marked noindex. Scroll effects no longer hide text at opacity zero while waiting for a visitor to scroll.

## Follow-up requiring the school's Google account or verified school information

1. In Google Search Console, verify the domain, submit `https://sanskarschools.com/sitemap.xml`, and inspect the homepage, admissions, academics and preschool URLs. Check the rendered pages and selected canonicals. Access is not connected in this workspace; submission has not been claimed.
2. Keep the verified Google Business Profile's real school name, address, phone, website, hours and campus photographs complete and consistent. Ask families for honest reviews without rewards or filtering. [Google's local-ranking guidance](https://support.google.com/business/answer/7091?hl=en) explains relevance, distance and prominence.
3. Supply an approved current fee schedule, confirmed transport areas, admission age criteria and dated board results. Publish those facts rather than estimates. Replace the four missing legacy testimonial photos with school-approved originals.
4. Compare Search Console impressions, clicks, queries and enquiry outcomes over successive 28-day periods. Check indexing first; do not interpret one search result or one day as a stable ranking.

No paid links, invented reviews, keyword doorway pages, hidden keyword blocks or fabricated ranking claims were added.
