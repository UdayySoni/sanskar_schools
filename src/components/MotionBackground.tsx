import type { CSSProperties } from "react"
import useInView from "../hooks/useInView"

// One CSS layer keeps the ambient background without dozens of decorative nodes.
export default function MotionBackground({ blend = "normal", opacity = 1 }: { blend?: CSSProperties["mixBlendMode"]; opacity?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return <div ref={ref} aria-hidden="true" className="ambient-background pointer-events-none absolute inset-0" style={{ opacity, mixBlendMode: blend, animationPlayState: inView ? "running" : "paused" }} />
}
