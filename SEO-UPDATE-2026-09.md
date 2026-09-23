# Mathura search visibility and 2025–26 toppers

Implemented on 13 September 2026. See [the audit follow-up](SEO-AUDIT-FIXES-2026-09.md) for the later typography, blog, image and security update; the deployment details below describe the initial release.

Published to `https://sanskarschools.com` and the existing www domain. Cloudflare version: `98d69087-cba6-4f04-b9c9-1489a52a71a4`.

Validation passed: TypeScript checks, production build, 10 automated tests, deployment dry run, browser checks of all 23 public routes, 320/390px mobile layouts, topper tabs, portraits, blog navigation and JavaScript-disabled rendering. After deployment, live checks verified public routes, initial HTML, metadata, sitemap, article schema, six portraits, mobile navigation and real 404 responses.

## Search intent and pages

| Search intent | Main destination |
| --- | --- |
| CBSE school in Mathura; Sanskar Public School | `/` |
| Best school in Mathura; good schools in Mathura | `/blog/choosing-best-school-in-mathura` and the homepage parent guide |
| Top 10 schools in Mathura | `/blog/top-10-schools-in-mathura-shortlist` |
| School admission in Mathura | `/admissions` and `/blog/school-admission-mathura-parent-checklist` |
| Sanskar results and board toppers 2025–26 | `/achievements` |

The shortlist article is explicitly a school-authored comparison guide, not an independent ranking. It does not invent competitors, rankings, awards or reviews. The three articles cover different parent decisions and link to relevant school information, admissions, each other and the CBSE directory.

## Implementation

- Public routes render the actual React application on the Worker, with public content from D1. The browser hydrates the same content. Admin remains a client-rendered application.
- Completed React Suspense boundaries stay inline, including large homepage content, so a visitor with JavaScript disabled can read it. No bot detection or alternate crawler copy is used.
- One description and social title per page; route-specific canonical URLs and metadata. Blog pages have Blog/BlogPosting and breadcrumb structured data, with visible authorship and publication dates.
- Homepage, footer and navigation link to the blog. Unknown routes return HTTP 404 and remain noindex after client navigation. Existing canonical and legacy redirects remain in place.
- Build-generated public robots/sitemap files match the route registry; the Worker serves the same route set. Admin/API crawling is disallowed and utility pages are omitted from the sitemap.
- Real student portraits are delivered as WebP files with descriptive filenames, alt text, stable dimensions and lazy loading. The six files total approximately 87 KB.

## Student source mapping

Names, ranks, classes and percentages come from `2025-26 Toppers.pdf`; portraits come from the supplied ZIP and were visually matched to the PDF.

| Class | Rank | Name | Percentage | ZIP filename |
| --- | --- | --- | --- | --- |
| X | 1 | Shrestha Sharma | 95.2% | `10th/Shrestha Sharma.jpg` |
| X | 2 | Krishna Kumar | 94% | `10th/Krishan Kumar.jpg` |
| X | 3 | Piyush Kumar Pandey | 93.4% | `10th/Piyush Kumar Pandey.jpg` |
| XII | 1 | Manoj Kumar | 93.2% | `12th 2025-26/Manoj.jpg` |
| XII | 2 | Sneha Chaudhary | 91.8% | `12th 2025-26/sneha chaudhary.jpg` |
| XII | 3 | Jaidev Goyal | 90.2% | `12th 2025-26/jaidev goyal.jpg` |

The spelling Krishna follows the PDF, rather than the image filename. These entries replace the previous students on both the homepage and achievements page.

## Ongoing work requiring the school's Google account

Website changes cannot guarantee a first-place ranking. No Search Console or Google Business Profile account connection was available during this work; no submission or profile update is claimed.

1. In the verified Search Console property for `sanskarschools.com`, submit `https://sanskarschools.com/sitemap.xml`. Inspect the homepage, achievements page and three article URLs, then request indexing where appropriate.
2. Check Page Indexing and Core Web Vitals. In Performance, filter India and the target query group; compare impressions, clicks, CTR and average position across consistent periods. Record the starting values before evaluating progress.
3. Keep the verified Google Business Profile's school name, address, phone, website, category, hours and campus photos accurate. Seek honest reviews from families without incentives or selective positive-review requests. Website content alone cannot control proximity and reputation signals.
4. Continue publishing useful, school-specific updates with real evidence: dated results, actual campus activities, admissions information and answers to recurring parent questions. Update material facts when they change; do not refresh dates merely to look new.

## Maintenance

- Articles: `src/data/blog.ts`. Register each new article URL in `site.config.json`; its metadata and structured data derive from its article record. The admin SEO screen can override route titles/descriptions as before.
- Toppers: `src/data/site.ts`, with images in `public/optimized/toppers-2025-26/`.
- Run `npm run typecheck`, `npm run build`, then `npm test` before deployment. Worker tests cover initial HTML, article metadata, sitemap inclusion, portraits, real 404s and existing application functions.
- Deploy the integrated Worker build, not `dist/client` alone. Client-only static hosting will lose server rendering and response metadata.

## References consulted

- [Google Search Essentials](https://developers.google.com/search/docs/essentials)
- [Google JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google Business Profile local ranking guidance](https://support.google.com/business/answer/7091?hl=en)
- [React prerender and hydration](https://react.dev/reference/react-dom/static/prerender)
- [Cloudflare HTMLRewriter](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/)
