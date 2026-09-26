# Instagram reels

The homepage displays up to two newest reels from **@sanskarpublicschoolmathura**. The footer and fallback link already point to that profile. A profile URL alone cannot authorize Meta's media API; complete the one-time connection below to activate the live feed.

## Connect the school's account

1. Use the school's Instagram **Business or Creator** account. In Meta for Developers, create/configure an app with **Instagram API with Instagram Login**. Use the `instagram_business_basic` permission for reading this account's media. Authorize the school account through the app's Instagram setup. Development access requires the account to have the appropriate app/tester role and accepted invitation; accounts outside those roles require Meta's applicable review/live-access setup.
2. Obtain the Instagram user ID and a **long-lived Instagram user access token** for this account. Follow [Meta's Instagram Login setup](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/business-login/). This integration uses `graph.instagram.com`, not Facebook Login/Page tokens. Do not use a short-lived token or the retired Instagram Basic Display API.
3. Add `INSTAGRAM_USER_ID` and `INSTAGRAM_ACCESS_TOKEN` in the existing Cloudflare Worker `server` under **Settings → Variables and Secrets**, with the token stored as a secret. Alternatively, use the interactive commands below from an authenticated terminal. Never paste tokens in chat, source code, frontend `VITE_*` variables or Git.

   ```sh
   npx wrangler secret put INSTAGRAM_USER_ID
   npx wrangler secret put INSTAGRAM_ACCESS_TOKEN
   ```

4. Deploy this change, then visit `/api/instagram/reels`. Success returns `status: "ready"` and at most two reels. Check that the homepage previews play and their Instagram links open the right posts. This live account check is required; automated tests simulate Meta responses.

## Automatic updates

- A Cloudflare cron runs every 15 minutes. A page request also updates an expired cache, and an open page refreshes every 15 minutes or when its tab becomes visible.
- The server verifies the connected username, filters `media_product_type: REELS`, skips photo posts, follows pagination (up to 1,000 recent media items), and returns the newest two by publication time. Only published media visible to the authorized API account can appear.
- Long-lived tokens refresh automatically after seven days. Refreshed credentials and the feed cache are kept in a private R2 object without a public media record. Keep this bucket private. No token reaches the browser. Revoked access, a password/security change or an expired token may require the account owner to reconnect; replace the secret with a new long-lived token in that case.
- API failures retry after five minutes. Previously fetched reels can remain visible for up to 24 hours; older previews are removed because media URLs expire. The Instagram profile link remains available, and failed video playback offers a link to the original reel.
- Videos use `preload="none"`, never autoplay, and pause off screen. The feed request is deferred until the section approaches the viewport. No Instagram embed script is loaded.
- Replacing the user ID or token starts a fresh cache. Old private cache objects can be removed from `_integrations/instagram/` after credential rotation.

For local development, set the two values privately in `.dev.vars`; `.dev.vars.example` only documents their names. Missing credentials intentionally show the Instagram link instead of sample or fabricated reels.
