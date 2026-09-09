# Production audit — September 2026

## Original application

The project already used React 19/Vite 8, a Cloudflare Worker API, D1 content/enquiry/admin tables and R2 uploads. Public routes are lazy loaded except the homepage. The existing admin supports content, notices, boards, testimonials, Sports Arena, SEO, media, enquiries, CSV export, password changes and multiple accounts. Contact directs enquiries to the admission form. Fees, Talent Academy and arena bookings use existing external services. No redesign was performed.

The audit covered frontend routes/forms/content providers and page metadata, Worker routes and authentication, schema/migrations, media handling, Vite output, static assets/headers, environment variable usage, Git metadata/ignore rules and deployment scripts.

## Corrections

- Clean npm installation with a committed npm lockfile; removed the conflicting stale pnpm lockfile and aligned Figma install/run wrappers with npm.
- Added explicit local/remote D1 migration commands. Removed request-time schema creation and its cross-request database promise. Additive migrations can adopt previously bootstrapped tables; no production data was deleted.
- Added persisted, revocable sessions; timing-safe cookie signature comparison; logout/password changes/account disable/deletion invalidate sessions. Existing salted HMAC and PBKDF2 password formats, cookies, expiry, owner permissions and rate limits remain compatible.
- Upload allowlist, MIME/extension/signature checks, actual streamed request limits and safe bounded names; no SVG. Empty/oversized/invalid files are rejected. Upload rollback removes R2 objects when D1 insertion fails. Published media references block deletion. Media retrieval supports ETags and HEAD.
- Fixed the media form's use of `event.currentTarget` after awaiting the request, which prevented reliable form reset/library refresh.
- Added content shape and URL validation, preventing malformed content and unsafe links from being published. Escaped spreadsheet formula prefixes in enquiry CSV exports.
- Removed stale public content caching and the lifetime browser request cache. Public content refetches on tab focus. HTML metadata uses streaming HTMLRewriter with escaping. Saved content needs no deployment.
- Centralized canonical origin in `site.config.json`, fixed the conflicting Figma OpenGraph origin, provided dynamic robots/sitemap and real HTTP 404 responses, and preserved direct admin/public route refreshes. Removed unnecessary copies of the homepage into route folders.
- Preserved immutable caching for hashed assets; shortened unversioned image caching and revalidated media. Kept existing image quality and route splitting. Disabled the Sites integration outside its Figma environment.
- Preserved six original PDFs locally under `public/documents` to avoid relying on the temporary host. Kept the existing 8 MiB admin upload limit.
- Added generated binding types, a hidden-input credential generator, a deployment configuration guard and detailed deployment instructions. Existing private local credentials were preserved.
- Ignored secret variants, backup/key files, temporary files and tooling. Removed old HTML captures/check logs from Git tracking, preserving local copies. Restored normal text diffs while retaining ordinary Git asset blobs rather than Git LFS dependencies.

## Verification

- Clean dependency installation, TypeScript checks, production build and Wrangler deployment dry run passed.
- Eight automated test results passed against the actual built Worker and isolated local D1/R2. Covered public/admin route refresh, canonical redirects/SEO, 404s, login/logout/session replay, owner permissions, account disable/password revocation, rate limiting, content/notice publication, unsafe uploads, PNG/PDF retrieval/deletion, media references, upload rollback, and enquiry persistence during a simulated email outage.
- Chromium browser checks passed: public routes, mobile homepage, administrator login/logout, image upload and library refresh, admission form submission and its D1 record. No page errors were observed. These used isolated local storage, not production.
- Runtime dependency audit reported zero known vulnerabilities at audit time. This is not a guarantee against undiscovered vulnerabilities.
- Secret scan found no local credential values in tracked source or generated build output; no `.env`/`.dev.vars` files were tracked in the inspected history. Real secrets were not printed.
- No lint script exists. The existing formatter is available.

## External setup still required

- Cloudflare CLI was unauthenticated. No live Worker was deployed, no remote D1/R2 resources were created or migrated, and no production secrets or DNS were changed. The placeholder D1 ID is deliberately preserved until a real resource can be verified. `npm run deploy` refuses that placeholder.
- Owner-login runtime values: `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`. Optional Resend configuration: `RESEND_API_KEY`, `EMAIL_FROM`, `LEAD_NOTIFY_TO`. Local values do not imply production values exist.
- Canonical domain from code: `sanskarschools.com`. Domain ownership/DNS, HTTPS, apex/`www` routing and live tests remain unverified until Cloudflare login.
- Workers Builds cannot be considered enabled until the Cloudflare Git connection is saved and a push produces a successful build/deployment. Exact branch/build/deploy settings are in DEPLOYMENT.md.
- Four old testimonial image URLs currently serve the application HTML rather than image data. Original URLs and testimony content remain intact; the school must provide original photos or replace them through Admin → Testimonials. The intentional virtual-tour coming-soon page remains unchanged.
- Actual Resend/FormSubmit delivery and production administrator credentials were not tested. Local tests deliberately block external notifications and use disposable credentials.
