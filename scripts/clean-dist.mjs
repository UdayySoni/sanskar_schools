import { rmSync } from "node:fs"
import { basename, resolve, sep } from "node:path"

const projectRoot = resolve(process.cwd())
const outputDirectory = resolve(projectRoot, "dist")

if (basename(outputDirectory) !== "dist" || !outputDirectory.startsWith(`${projectRoot}${sep}`)) {
  throw new Error(`Refusing to clean unexpected build path: ${outputDirectory}`)
}

rmSync(outputDirectory, { recursive: true, force: true })
