# AI search readiness — 25 September 2026

The website already serves public pages as HTML, with canonical URLs, School and article structured data, internal links, a sitemap, and real 404 responses. This update improves the consistency and maintenance of those foundations and the optional AI reference files. It does not promise an AI Overview, ranking, citation or indexing date.

## Changes

- `/llms.txt` now lists all indexable public pages, school contact details, the official CBSE affiliation source, parent guides and editorial policies.
- `/llms-full.txt` provides school facts, the existing parent FAQ answers and page summaries with canonical sources. It is a reference, not a complete export of every page.
- Both files are generated during builds. The production Worker uses current validated public settings and page metadata, so admin contact and SEO edits appear without a rebuild (a cached copy may remain for up to five minutes).
- School contact defaults and FAQ answers have shared sources. Home and admission FAQ structured data is now present in the initial server response and uses the same answers as the visible pages. The client retains the same graph after navigation. This is not a claim of FAQ rich-result eligibility or a special AI ranking signal.
- Robots and sitemap output share generators between the build and Worker. Public crawl access remains allowed; admin and API paths remain excluded. Payment and unfinished tour pages remain outside the sitemap. No artificial last-modified dates are added.
- The HTML head links to both text references. No hidden keywords, crawler-only copy, fabricated reviews or independent ranking claims were added.

## Validation

`npm run typecheck`, `npm run build` and `npm test` pass. The production Worker suite covers the following alongside existing application checks:

- Plain-text responses, HEAD requests, method restrictions, canonical page coverage and parity between generated files and Worker responses.
- FAQ answers matching visible HTML and the expanded reference without running JavaScript.
- Identical page HTML for ordinary requests and requests using Googlebot, Bingbot, OAI-SearchBot and PerplexityBot user-agent strings. This tests application behavior, not proof of acceptance by those services or every CDN rule.
- Contact and SEO admin edits appearing in both reference files.

The live `/robots.txt` returned HTTP 200 on 25 September 2026 with wildcard crawl access, admin/API exclusions and the correct sitemap. This check is separate from deploying the new build.

## Account-level follow-up after deployment

1. In the school's verified Google Search Console property, submit `https://sanskarschools.com/sitemap.xml`. Inspect the homepage, admissions, academics and useful parent guides; check the live rendered HTML and request indexing for priority updated pages.
2. In Bing Webmaster Tools, submit the same sitemap and check crawl/indexing issues. Use available AI performance reporting to monitor citations.
3. Keep the school's Google Business Profile website, address, phone, hours and school category accurate using the school's account. Confirm facts before changing them.
4. If webmaster tools report blocked requests, inspect Cloudflare security events for the affected verified crawler. These code changes do not modify account-wide bot policies.
5. Maintain current admissions information, disclosure documents and useful original parent guides. Update shared FAQs when the public answers change. Monitor indexing and relevant search traffic rather than assuming that a text reference file causes inclusion.

These account submissions and profile changes have not been performed; they require access to the school's verified accounts. A Git push alone is not proof that the production Worker has deployed.

## Sources

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features): normal search eligibility and snippet availability apply; no special AI text file or schema is required, and inclusion is not guaranteed.
- [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a): crawlability, canonical URLs, useful content and discovery support search and AI grounding.
- [The llms.txt proposal](https://llmstxt.org/): an optional reference format, separate from robots.txt and sitemaps.
