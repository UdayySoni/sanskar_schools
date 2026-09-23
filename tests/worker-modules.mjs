import { readdirSync } from "node:fs"

// Match the ES modules emitted by the Cloudflare Vite build, including lazy routes.
export const workerModules = ["index.js", ...readdirSync("dist/server/assets").filter(file => file.endsWith(".js")).map(file => "assets/" + file)]
  .map(file => ({ type: "ESModule", path: "dist/server/" + file }))
