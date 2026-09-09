import { Link } from "react-router-dom"
import Icon from "../components/Icon"
import { usePageMeta } from "../hooks/usePageMeta"

export default function ComingSoon({
  title,
  subtitle,
  path = "/",
}: {
  title: string
  subtitle: string
  path?: string
}) {
  usePageMeta({ title, description: subtitle, path })
  return (
    <section className="flex min-h-[75vh] items-center bg-navy-deep pt-[76px] text-white lg:pt-[108px]">
      <div className="container py-24 text-center">
        <p className="eyebrow eyebrow-light">Coming soon</p>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-5xl font-semibold sm:text-7xl">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/60">
          {subtitle}
        </p>
        <Link to="/" className="button button-gold mt-9">
          Back to home <Icon name="arrow" />
        </Link>
      </div>
    </section>
  )
}
