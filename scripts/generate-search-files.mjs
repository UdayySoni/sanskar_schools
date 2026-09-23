import { readFileSync, writeFileSync } from "node:fs"

const site = JSON.parse(readFileSync(new URL("../site.config.json", import.meta.url), "utf8"))
const routes = site.routes.filter(path => !site.nonIndexableRoutes.includes(path))
const escape = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;")
writeFileSync(new URL("../public/sitemap.xml", import.meta.url), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + routes.map(path => `  <url><loc>${escape(site.url + path)}</loc></url>`).join("\n") + "\n</urlset>\n")
writeFileSync(new URL("../public/robots.txt", import.meta.url), `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${site.url}/sitemap.xml\n`)
