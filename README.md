# Sanskar Public School

React + Vite frontend with an integrated Cloudflare Worker, D1 database and R2 media storage. The existing school pages, styling and admin dashboard are preserved.

```sh
npm ci
npm run dev
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for credentials, migrations, Cloudflare deployment, GitHub automatic builds and the custom domain. See [PRODUCTION-AUDIT.md](PRODUCTION-AUDIT.md) for verification results and outstanding account setup.

Never commit local secrets, `.dev.vars`, `.env`, `.tools`, `.wrangler`, dependencies or build output.

See [INSTAGRAM-SETUP.md](INSTAGRAM-SETUP.md) to connect the school's Instagram account and activate the automatically refreshed two-reel homepage feed.
