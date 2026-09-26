export default function SocialIcon({ name, size = 20 }: { name: "instagram" | "youtube" | "linkedin"; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === "instagram" && <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none" /></>}
    {name === "youtube" && <><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none" /></>}
    {name === "linkedin" && <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7.5 10v7M11 17v-7m0 3a3 3 0 0 1 6 0v4" /><circle cx="7.5" cy="7" r=".8" fill="currentColor" stroke="none" /></>}
  </svg>
}
