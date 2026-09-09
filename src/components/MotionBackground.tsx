// Reusable, clean motion-graphic layer for hero / blank spaces.
// Renders a softly shifting gradient, drifting orbs, rising twinkling
// particles and a gentle light sweep. Purely decorative (aria-hidden).

import type { CSSProperties } from "react"

const ORBS = [
  {
    size: 320,
    top: "-8%",
    left: "-6%",
    color: "rgba(20,107,100,0.5)",
    anim: "sp-float-a 13s ease-in-out infinite",
    blur: "70px",
  },
  {
    size: 260,
    top: "14%",
    right: "-6%",
    color: "rgba(245,158,11,0.4)",
    anim: "sp-float-b 16s ease-in-out infinite",
    blur: "60px",
  },
  {
    size: 300,
    bottom: "-12%",
    left: "26%",
    color: "rgba(255,107,84,0.32)",
    anim: "sp-float-c 19s ease-in-out infinite",
    blur: "80px",
  },
  {
    size: 220,
    top: "26%",
    left: "34%",
    color: "rgba(255,255,255,0.35)",
    anim: "sp-float-b 21s ease-in-out infinite",
    blur: "50px",
  },
  {
    size: 180,
    bottom: "6%",
    right: "14%",
    color: "rgba(20,107,100,0.4)",
    anim: "sp-float-a 15s ease-in-out infinite",
    blur: "45px",
  },
]

const PARTICLES = [
  { left: "8%", size: 4, delay: "0s", dur: "16s", dx: "-30px", p: 0.8 },
  { left: "20%", size: 3, delay: "2s", dur: "19s", dx: "20px", p: 0.6 },
  { left: "32%", size: 5, delay: "5s", dur: "22s", dx: "-16px", p: 0.9 },
  { left: "45%", size: 3, delay: "1s", dur: "17s", dx: "26px", p: 0.7 },
  { left: "58%", size: 4, delay: "7s", dur: "21s", dx: "-22px", p: 0.8 },
  { left: "70%", size: 3, delay: "3s", dur: "18s", dx: "18px", p: 0.6 },
  { left: "82%", size: 5, delay: "6s", dur: "23s", dx: "-14px", p: 0.9 },
  { left: "92%", size: 4, delay: "4s", dur: "20s", dx: "24px", p: 0.7 },
]

const SPARKS = [
  { top: "18%", left: "10%", size: 3, delay: "0s", dur: "3.4s" },
  { top: "30%", left: "24%", size: 2, delay: "0.8s", dur: "4.1s" },
  { top: "14%", left: "46%", size: 3, delay: "1.6s", dur: "3.7s" },
  { top: "38%", left: "60%", size: 2, delay: "0.4s", dur: "4.4s" },
  { top: "22%", left: "78%", size: 3, delay: "2.2s", dur: "3.9s" },
  { top: "48%", left: "88%", size: 2, delay: "1.1s", dur: "4.6s" },
  { top: "55%", left: "12%", size: 2, delay: "2.6s", dur: "4.0s" },
  { top: "12%", left: "66%", size: 3, delay: "3.0s", dur: "3.5s" },
]

export default function MotionBackground({
  blend = "normal",
  opacity = 1,
}: {
  blend?: CSSProperties["mixBlendMode"]
  opacity?: number
}) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ opacity, mixBlendMode: blend }}
    >
      {/* Slowly shifting base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 60% at 15% 20%, rgba(20,107,100,0.55) 0%, transparent 70%)," +
            "radial-gradient(45% 55% at 85% 25%, rgba(232,163,61,0.45) 0%, transparent 70%)," +
            "radial-gradient(60% 60% at 50% 100%, rgba(255,107,84,0.35) 0%, transparent 70%)",
          backgroundSize: "200% 200%",
          animation: "sp-hue 22s ease-in-out infinite",
        }}
      />

      {/* Drifting orbs */}
      {ORBS.map((o, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: o.size,
            height: o.size,
            top: o.top,
            left: o.left,
            right: o.right,
            bottom: o.bottom,
            background: o.color,
            filter: `blur(${o.blur})`,
            animation: o.anim,
            willChange: "transform",
          }}
        />
      ))}

      {/* Rising particles */}
      {PARTICLES.map((f, i) => (
        <span
          key={i}
          className="absolute bottom-[-6%] rounded-full"
          style={
            {
              left: f.left,
              width: f.size,
              height: f.size,
              background: "rgba(255,255,255,0.95)",
              boxShadow: "0 0 8px rgba(255,255,255,0.9)",
              animation: `sp-rise ${f.dur} linear ${f.delay} infinite`,
              "--sp-dx": f.dx,
              "--sp-p": f.p,
            } as CSSProperties
          }
        />
      ))}

      {/* Twinkling sparks */}
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            background: "rgba(255,255,255,0.9)",
            boxShadow: "0 0 10px rgba(255,255,255,0.8)",
            animation: `sp-twinkle ${s.dur} ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}

      {/* Gentle diagonal light sweep */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          background:
            "linear-gradient(115deg, transparent 0%, transparent 42%, rgba(255,255,255,0.16) 50%, transparent 58%, transparent 100%)",
          animation: "sp-shimmer 11s linear infinite",
        }}
      />
    </div>
  )
}
