import { existsSync, rmSync } from "node:fs"
import { basename, resolve, sep } from "node:path"

const projectRoot = resolve(process.cwd())
const serverDirectory = resolve(projectRoot, "dist", "server")
const localSecretsFile = resolve(serverDirectory, ".dev.vars")

if (basename(serverDirectory) !== "server" || !serverDirectory.startsWith(`${projectRoot}${sep}dist${sep}`)) {
  throw new Error(`Refusing to sanitize unexpected build path: ${serverDirectory}`)
}

if (existsSync(localSecretsFile)) rmSync(localSecretsFile, { force: true })
