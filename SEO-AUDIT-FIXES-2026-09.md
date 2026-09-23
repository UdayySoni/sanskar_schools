# SEO audit follow-up — 13 September 2026

The supplied SEO-AUDIT-sanskarschools.com.pdf was treated as diagnostic evidence, not as instructions. This follow-up supersedes the earlier blog descriptions in SEO-UPDATE-2026-09.md.

Published to sanskarschools.com and www.sanskarschools.com. Cloudflare version: `0e44cb15-6d27-4749-b224-75df54278369`. TypeScript, production build and all 11 automated tests passed. Live checks passed for all 26 public routes, metadata, sitemap, article schema, six portraits, mobile blog navigation and 404 handling. Live responses confirm HSTS, Brotli and HTTP/3; the homepage includes responsive images, privacy links and the simplified copy.

## Changes

- Added HSTS on HTTPS page responses and static assets (one year; no subdomain or preload commitment).
- Added responsive WebP variants, intrinsic image dimensions and srcset. The main hero loads eagerly with high fetch priority; below-fold images load lazily. Removed broken legacy testimonial portraits in favour of initials.
- Hosted DM Sans locally with font-display: swap and a preload. Simplified heading typography, reduced heading sizes throughout public pages, and shortened homepage headings and copy.
- Reduced decorative HTML and removed duplicated homepage gallery items. Text-to-HTML percentage is a diagnostic heuristic, not a Google ranking requirement; no filler text was added to chase it.
- Added privacy, website terms and editorial policy pages, footer links, a semantic contact address and explicit noopener on external new-tab links. Blog articles show publisher, date, source links and AI-image captions.
- Retained valid School/BlogPosting/breadcrumb structured data and improved the school address to PostalAddress. A JSON-LD @graph wrapper does not itself need an @type.
- Added public llms.txt as an optional content directory. It does not override robots policies or guarantee search visibility.
- Removed student rank labels while preserving the six supplied names, percentages and real portraits.

## Content and keyword coverage

The three rewritten articles centre on Sanskar's academics, values, activities, results and admission process. Relevant phrases appear naturally in titles, headings, descriptions and internal links: best school in Mathura, best school of Mathura, good schools in Mathura, top 10 schools in Mathura and top 3 schools in Mathura.

The top-10 article now lists ten real schools and puts Sanskar first, with a top-three summary. It explicitly identifies this as Sanskar's editorial preference, not an independent league table. Other school entries link to official school websites or the Mathura district directory. The list includes nearby district schools and says so. No fabricated review scores, awards or independent rankings were added.

Three realistic generated illustrations support the articles; real student achievement portraits remain separate. See BLOG-IMAGE-PROMPTS.md for assets and generation briefs.

## Audit findings that did not require the suggested change

- Brotli compression and HTTP/3 were already present in live responses (`content-encoding: br`, `alt-svc: h3`).
- Existing CSP frame-ancestors protects against unwanted framing while allowing the Figma preview. A conflicting X-Frame-Options policy would break that intended embedding.
- Official social links were already in the footer. They were retained.
- Cloudflare's managed robots section blocks certain AI training crawlers, not ordinary Google Search crawling. Those blocks were preserved; permitting model training is not a prerequisite for Google rankings.
- A homepage does not need to pretend to be an authored news article. Article dates and publisher details belong on the blog and are now explicit there.

## Validation and maintenance

TypeScript, production build and Worker regression checks cover public HTML, metadata, image dimensions, HTTPS headers, policy routes, student records, forms, authentication and storage. Browser checks cover public routes, hydration, blog navigation, mobile layout and reading without JavaScript. These are functional checks; no new Lighthouse score or Google search position is claimed.

Run `npm run images:optimize` after replacing local source images, then typecheck, build and test. Generated image variants and their manifest are included project assets. Publish the integrated Worker build to retain server-rendered content.

Google rankings cannot be guaranteed. Search Console and Google Business Profile require the school's account access; sitemap submission, indexing requests and profile edits have not been performed. Follow the account-level steps in SEO-UPDATE-2026-09.md.

References: [Google helpful content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [Mathura district schools](https://mathura.nic.in/public-utility-category/schools/), [Cloudflare managed robots](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/).
