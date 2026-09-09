export default function AcademicShapes({
  tone = "light",
  className = "",
}: {
  tone?: "light" | "dark"
  className?: string
}) {
  const line = tone === "dark" ? "border-white/15" : "border-navy/10"
  const fill = tone === "dark" ? "bg-white/[.06]" : "bg-blue/[.06]"
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <span
        className={`shape-float absolute -right-12 top-12 h-40 w-40 rounded-full border-[18px] ${line}`}
      />
      <span
        className={`shape-float-delayed absolute left-[7%] top-[18%] h-16 w-16 rotate-12 rounded-2xl border ${line} ${fill}`}
      />
      <span className="shape-float absolute bottom-[10%] right-[18%] h-4 w-4 rounded-full bg-gold shadow-[0_0_0_10px_rgba(231,163,45,.12)]" />
      <svg
        viewBox="0 0 180 100"
        className="shape-float-delayed absolute bottom-4 left-[3%] w-36 opacity-55"
        fill="none"
      >
        <path
          d="M4 78c28-62 58 16 88-38s55 42 84-22"
          stroke={tone === "dark" ? "#fff" : "#155d89"}
          strokeOpacity=".25"
          strokeWidth="2"
          strokeDasharray="7 8"
        />
        <circle cx="4" cy="78" r="4" fill="#e7a32d" />
        <circle cx="176" cy="18" r="4" fill="#168779" />
      </svg>
    </div>
  )
}
