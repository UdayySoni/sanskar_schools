# Sanskar Public School deployment

This is an integrated React/Vite + Cloudflare Worker application. Keep bindings `DB` (D1), `FILES` (R2), and `ASSETS`. Content changes are stored in D1/R2 and are available on the next request without rebuilding. Open pages refresh content when their tab regains focus. Code changes deploy from GitHub `main` using Workers Builds.

## Local development and checks

Use Node.js 22.12 or newer (this workspace uses 22.23.2) and npm. Reopen VS Code/your terminal if Node was just installed. `package-lock.json` is the authoritative lockfile.

```sh
npm ci
npm run dev
```

`predev` applies migrations to local D1 only. Vite serves http://localhost:8443. Copy `.dev.vars.example` to `.dev.vars` and fill values privately if no local configuration exists. Preserve an existing `.dev.vars`; never commit it. Local D1/R2 live under ignored `.wrangler/state`, independently of production. Local data is not automatically copied to production.

```sh
npm run typecheck
npm run build
npm test
npx wrangler deploy --dry-run
```

Tests run the built Worker with isolated temporary D1/R2 and random test credentials. External email requests are replaced with a simulated failure. Run the build before tests after source edits. No lint script is configured. `npm run format` is the existing formatter.

Vite emits `dist/client` and `dist/server`; its generated deployment pointer lets `npx wrangler deploy` use the integrated build. The build sanitizer removes copied `.dev.vars` from the output. Never upload `dist` to GitHub. Do not deploy only `dist/client` as a static website.

## Cloudflare authentication and resources

```sh
npx wrangler login
npx wrangler whoami
npx wrangler d1 list
npx wrangler r2 bucket list
```

The source originally used Worker name `server`, D1 name `site-creator-d1` and bucket `site-creator-r2`. Confirm ownership and intended use of any existing resources before reusing them. Do not replace an unrelated existing Worker named `server`. If that name is occupied, choose a school-specific Worker name in `wrangler.jsonc` and rebuild; the generated server output folder can change with the Worker name, so update the sanitizer/check script paths as well.

Only if the intended resources do not exist:

```sh
npx wrangler d1 create site-creator-d1
npx wrangler r2 bucket create site-creator-r2
```

Replace `00000000-0000-4000-8000-000000000000` in `wrangler.jsonc` with the verified returned D1 ID. Database IDs are public configuration, not credentials. Never invent the ID. Keep R2 private: the Worker serves uploads through `/api/media/:id`; a public bucket domain is unnecessary.

## Migrations and existing data

```sh
npx wrangler d1 migrations list site-creator-d1 --remote
npx wrangler d1 migrations apply site-creator-d1 --remote
```

Migrations are in `drizzle/`. The first two use `IF NOT EXISTS` because the old Worker created those tables on requests. They can adopt an existing compatible database without deleting rows. The third adds revocable sessions. Inspect existing table structure before adopting an older production database; `IF NOT EXISTS` does not repair incompatible columns. Back up existing production data before migration:

```sh
npx wrangler d1 export site-creator-d1 --remote --output backups/before-migration.sql
```

Create the ignored `backups` directory first. All three current migrations are additive. Do not drop/recreate a production database. Future schema changes belong in `db/schema.ts`; `npm run db:generate` creates migrations. Review their SQL before applying remotely. Runtime requests do not modify schema.

## Runtime configuration and secrets

| Name | Classification | Purpose |
| --- | --- | --- |
| `ADMIN_USERNAME` | Public configuration, stored as a secret here | Primary owner login; backend fallback is `admin` |
| `ADMIN_PASSWORD_HASH` | Secret | Initial primary administrator password hash |
| `SESSION_SECRET` | Secret | HMAC password pepper and cookie signing; at least 32 random characters |
| `RESEND_API_KEY` | Secret, optional | Resend notifications |
| `EMAIL_FROM` | Public configuration, optional | Resend verified sender identity |
| `LEAD_NOTIFY_TO` | Public configuration, optional | Notification destination; defaults to the existing school email |

`site.config.json` is public and owns the HTTPS canonical origin and alternate hostname. `.dev.vars.example` contains names with empty values only. No frontend `VITE_*` secrets are required.

Set production runtime secrets interactively, without putting values in shell commands:

```sh
npx wrangler secret put ADMIN_USERNAME
npx wrangler secret put ADMIN_PASSWORD_HASH
npx wrangler secret put SESSION_SECRET
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put EMAIL_FROM
npx wrangler secret put LEAD_NOTIFY_TO
```

The first three are needed for owner login. The last three configure Resend; email failure never prevents an enquiry being saved. Without Resend, the existing FormSubmit fallback remains and may require recipient activation. Use a verified Resend sender rather than relying on its onboarding sender in production.

Existing local hashes and secrets must stay private. The backend supports its existing salted `hmac-sha256` format and legacy PBKDF2 hashes. For a **new installation only**, generate a matching credential set with:

```sh
node scripts/admin-secrets.mjs
npx wrangler secret bulk .tools/admin-secrets.json
```

The interactive script hides the password, writes only to ignored `.tools/admin-secrets.json`, refuses to overwrite an existing output, and prints no secret values. Keep that file private. Do not generate a new `SESSION_SECRET` for an existing installation: existing HMAC account hashes depend on it. Primary password changes made in the dashboard are stored in D1 and override the initial environment hash. Logout, password change, account disable and account deletion revoke the affected server-side sessions.

## Manual production deployment

After verifying the account, resource ownership, D1 migrations, R2 bucket and runtime secrets:

```sh
npm run typecheck
npm run build
npm test
npx wrangler deploy --dry-run
npm run deploy
```

`npm run deploy` checks the placeholder ID and stale build configuration, then runs `wrangler deploy`. The equivalent direct CLI deployment is `npx wrangler deploy` after those checks. Use the exact deployed URL returned by Wrangler; none is assumed in this document.

Verify homepage, `/about`, `/contact`, `/admin/login`, login/dashboard/logout, unauthorized `/api/admin/dashboard`, uploads and retrieval of an image/PDF, deletion, a temporary notice, an enquiry visible in the dashboard, and a missing page returning 404. Delete test content after verifying it. Confirm fresh content on another browser tab without a code deployment.

## GitHub and automatic deployments

Approved source repository: https://github.com/UdayySoni/sanskar_schools (public). The old singular `sanskar_school` remote was inaccessible. Do not push credentials. Temporary captures, dependencies, local secrets, storage state and build output are ignored. Assets are ordinary Git blobs, not Git LFS pointers, so Cloudflare gets a complete checkout.

For future local Git access, authenticate GitHub through Git Credential Manager or `gh auth login` if GitHub CLI is installed. Then:

```sh
git switch main
git add .
git diff --cached
git commit -m "Update school website"
git push origin main
```

To connect Workers Builds after the first stable Worker deployment:

1. Cloudflare dashboard → Workers & Pages → select the verified Worker → Settings → Builds → connect Git repository (Git integration).
2. Authorize the Cloudflare GitHub app for `UdayySoni/sanskar_schools` and select that repository.
3. Production branch: `main`; root directory: repository root.
4. Build command: `npm ci && npm run typecheck && npm run build && npm test`.
5. Deploy command: `npm run db:migrate:remote && npm run deploy`.
6. Use Node.js 22.23.2 or later (`NODE_VERSION=22.23.2` in build variables if needed).
7. Ensure the build API token can edit D1 as well as Workers and R2, since the deploy command applies migrations. Cloudflare's automatically created token may need D1 permission added. Keep application credentials in **Worker runtime Variables & Secrets**, not frontend/build variables.
8. Disable non-production branch deployments until separate preview D1/R2 bindings are configured; previews must not mutate production data.
9. Save the connection and push a small code change to `main`; verify the build log and deployed commit.

Cloudflare reference: [Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/). Dashboard labels can differ slightly; the Worker Settings build configuration is the source of truth. This is Workers Builds, not Pages.

## Custom domain and SEO

The existing intended canonical domain is `https://sanskarschools.com`; `www.sanskarschools.com` redirects permanently to it for application routes. `site.config.json` controls canonical tags, dynamic robots/sitemap and frontend metadata. Static document metadata is filled from this config at build time. The old Figma OpenGraph domain mismatch has been corrected.

After verifying domain ownership and a stable deployment: Worker → Settings → Domains & Routes → Add → Custom Domain. Add the apex and `www` hostname to this same Worker. Cloudflare provisions the certificate/DNS for domains on its managed zone. Review existing DNS because this will switch traffic from the old website. At the zone level, enable Always Use HTTPS and a redirect rule for `www.sanskarschools.com` → `https://sanskarschools.com`, preserving path and query; this also covers static asset requests that bypass Worker code. The Worker redirects application routes only for the configured canonical/alternate hosts, so the workers.dev testing URL remains usable and does not loop.

If Cloudflare is not authoritative, add the domain as a zone first and use **only the two nameservers Cloudflare actually assigns** at the registrar. No nameservers are invented here. Do not change school email/MX records. Confirm apex/`www`, HTTP/HTTPS, canonical tags, robots/sitemap and absence of redirect loops after DNS propagation.

## Free-tier operation and maintenance

Use Workers Free, D1 and R2 Standard within their included allowances; no paid Workers plan or image transformation service is required by this code. R2 may require billing activation even when usage remains in its free allowance. Review actual usage and billing rather than assuming unlimited free hosting: [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/), [R2 pricing](https://developers.cloudflare.com/r2/pricing/).

Hashed JS/CSS are immutable cached, unversioned images revalidate after one hour, and dynamic content/SEO bypass stale caches. R2 media use ETags and revalidation so deleted files do not remain in a year-long browser cache. Below-fold images and route code splitting are preserved. Uploads allow JPEG, PNG, WebP, GIF and PDF only, validate extension/signature/MIME and actual request size, and retain the 8 MiB limit. Existing static PDFs may be larger; new admin uploads keep the 8 MiB limit.

Failed D1 upload inserts remove the new R2 object. Media used by published content cannot be deleted until references are removed. D1 and R2 do not share a transaction: if deletion partially fails, retry the same deletion; R2 deletion is idempotent. Database backups contain personal data and must remain private. Monitor enquiries/email status, failed requests, storage usage and dependency updates.

Four legacy testimonial photo URLs currently return HTML instead of images from the old host. Their references/content are preserved; obtain those original photos from the school and upload replacements in Admin → Testimonials before switching the domain. Six existing notice PDFs are preserved under `public/documents`. The existing virtual-tour page intentionally remains a coming-soon page.
