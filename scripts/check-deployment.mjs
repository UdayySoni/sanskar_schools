import { readFileSync, existsSync } from "node:fs"

const config = JSON.parse(readFileSync("wrangler.jsonc", "utf8"))
if (config.d1_databases.some(db => db.database_id === "00000000-0000-4000-8000-000000000000")) {
  throw new Error("Set the verified Cloudflare D1 database ID in wrangler.jsonc before deployment. See DEPLOYMENT.md.")
}
if (!existsSync("dist/server/wrangler.json")) throw new Error("Run npm run build before deployment.")
const built = JSON.parse(readFileSync("dist/server/wrangler.json", "utf8"))
if (built.d1_databases[0].database_id !== config.d1_databases[0].database_id || built.name !== config.name) {
  throw new Error("The deployment configuration changed. Run npm run build again.")
}
if (existsSync("dist/server/.dev.vars")) throw new Error("Build output contains local secrets. Run npm run build again.")
console.log("Deployment configuration checked. Ensure remote migrations and runtime secrets are configured.")
