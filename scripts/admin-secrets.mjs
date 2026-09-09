import { randomBytes, createHmac } from "node:crypto"
import { mkdirSync, writeFileSync } from "node:fs"
import { createInterface } from "node:readline/promises"

if (!process.stdin.isTTY) throw new Error("Run in an interactive terminal to enter credentials securely.")
const readline = createInterface({ input: process.stdin, output: process.stdout })
const username = (await readline.question("Admin username: ")).trim()
readline.close()
if (!/^[a-zA-Z0-9._-]{3,50}$/.test(username)) throw new Error("Use 3–50 letters, numbers, dots, underscores or hyphens.")

function hiddenInput(prompt) {
  process.stdout.write(prompt)
  process.stdin.setRawMode(true)
  process.stdin.resume()
  return new Promise((resolve, reject) => {
    let value = ""
    const cleanup = () => { process.stdin.setRawMode(false); process.stdin.pause(); process.stdin.off("data", onData); process.stdout.write("\n") }
    const onData = buffer => {
      for (const character of buffer.toString("utf8")) {
        if (character === "\u0003") { cleanup(); reject(new Error("Cancelled")); return }
        if (character === "\r" || character === "\n") { cleanup(); resolve(value); return }
        if (character === "\u007f" || character === "\b") value = value.slice(0, -1)
        else if (character >= " ") value += character
      }
    }
    process.stdin.on("data", onData)
  })
}
const password = await hiddenInput("New password (hidden, 12–200 characters): ")
if (password.length < 12 || password.length > 200) throw new Error("Password must have 12–200 characters.")
if (password !== await hiddenInput("Confirm password (hidden): ")) throw new Error("Passwords did not match.")
const secret = randomBytes(32).toString("base64url")
const salt = randomBytes(16).toString("base64url")
const hash = createHmac("sha256", secret).update(`${salt}:${password}`).digest("base64url")
mkdirSync(".tools", { recursive: true })
writeFileSync(".tools/admin-secrets.json", JSON.stringify({ ADMIN_USERNAME: username, ADMIN_PASSWORD_HASH: `hmac-sha256$${salt}$${hash}`, SESSION_SECRET: secret }, null, 2), { flag: "wx", mode: 0o600 })
console.log("Saved credentials to ignored .tools/admin-secrets.json. Values were not printed. Use only for a new installation; changing SESSION_SECRET invalidates existing HMAC passwords.")
