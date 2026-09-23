import type { CSSProperties } from "react"

// One CSS layer keeps the ambient background without dozens of decorative nodes.
export default function MotionBackground({ blend = "normal", opacity = 1 }: { blend?: CSSProperties["mixBlendMode"]; opacity?: number }) {
  return <div aria-hidden="true" className="ambient-background pointer-events-none absolute inset-0" style={{ opacity, mixBlendMode: blend }} />
}
