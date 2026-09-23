import { readdirSync, mkdirSync, writeFileSync } from "node:fs"
import { basename, extname, join } from "node:path"
import sharp from "sharp"

// Source images remain intact; variants are reproducible with npm run images:optimize.
const sourceRoot = "public/optimized"
const destination = join(sourceRoot, "responsive")
mkdirSync(destination, { recursive: true })
const paths = readdirSync(sourceRoot, { recursive: true }).filter(file =>
  /\.(jpg|jpeg|png|webp)$/i.test(file) && !String(file).startsWith("responsive"),
)
paths.push("../logo.png")
const manifest = {}
for (const file of paths) {
  const source = join(sourceRoot, file)
  const metadata = await sharp(source).metadata()
  const width = metadata.width, height = metadata.height
  if (!width || !height) continue
  const url = file === "../logo.png" ? "/logo.png" : "/optimized/" + file.replaceAll("\\", "/")
  // Small portraits already use efficient WebP and need no additional variants.
  if (width <= 400 && extname(file) === ".webp") {
    manifest[url] = { src: url, width, height, srcSet: `${url} ${width}w` }
    continue
  }
  const name = file.replaceAll("\\", "-").replaceAll("/", "-").replaceAll("..", "root").replace(/\.[^.]+$/, "")
  const sizes = [...new Set([480, 960, 1440, Math.min(width, 1920)].filter(size => size <= width))].sort((a, b) => a - b)
  if (!sizes.length) sizes.push(width)
  const variants = []
  for (const size of sizes) {
    const outputName = `${name}-${size}.webp`
    await sharp(source).rotate().resize({ width: size, withoutEnlargement: true }).webp({ quality: 82 }).toFile(join(destination, outputName))
    variants.push({ url: "/optimized/responsive/" + outputName, width: size })
  }
  const defaultVariant = variants.find(item => item.width >= 960) || variants.at(-1)
  manifest[url] = { src: defaultVariant.url, width, height, srcSet: variants.map(item => `${item.url} ${item.width}w`).join(", ") }
}
writeFileSync("src/data/image-manifest.json", JSON.stringify(manifest, null, 2) + "\n")
console.log(`Prepared dimensions and responsive WebP variants for ${Object.keys(manifest).length} images.`)
