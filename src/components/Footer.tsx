import Image from "./Image"
import { Link } from "react-router-dom"
import { useSiteContent } from "../context/SiteContent"
import { STA_PORTAL } from "../data/site"
import Icon from "./Icon"

const quickLinks = [
  ["About Sanskar", "/about"],
  ["Academics", "/academics"],
  ["Little Winner", "/little-winners"],
  ["Infrastructure", "/infrastructure"],
  ["Talent Academy", "/talent-academy"],
  ["Sports Arena", "/sports-arena"],
  ["Achievements", "/achievements"],
  ["Blog & parent guides", "/blog"],
  ["Gallery", "/gallery"],
  ["Admissions", "/admissions"],
]

export default function Footer() {
  const { settings } = useSiteContent()
  return (
    <footer className="bg-navy-deep text-white">
      <div className="container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.15fr_.7fr_.7fr_1.15fr] lg:gap-12">
        <div>
          <Image
            src="/logo.png"
            alt="Sanskar Public School"
            loading="lazy"
            decoding="async"
            className="h-16 w-auto rounded-lg bg-white px-3 py-2"
          />
          <p className="mt-6 max-w-md font-display text-2xl leading-8 text-gold">
            {settings.tagline}
          </p>
          <p className="mt-3 max-w-md text-sm leading-7 text-white/65">
            {settings.themeLine}. A CBSE-affiliated Senior Secondary School
            where strong academics, creativity, values and physical confidence
            grow together.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-white/80">
            <span className="rounded-full border border-white/15 px-3 py-1.5">
              CBSE Affiliation 2132432
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1.5">
              Senior Secondary
            </span>
          </div>
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold">Explore</h2>
          <ul className="mt-5 space-y-3 text-sm text-white/65">
            {quickLinks.map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="transition-colors hover:text-gold">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold">For families</h2>
          <ul className="mt-5 space-y-3 text-sm text-white/65">
            <li>
              <Link to="/notices" className="hover:text-gold">
                Notices & downloads
              </Link>
            </li>
            <li>
              <Link to="/pay-fee" className="hover:text-gold">
                Pay online fee
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-gold">
                Contact & directions
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-gold">
                Login
              </Link>
            </li>
            <li>
              <a
                href={STA_PORTAL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold"
              >
                Book Talent Academy coaching
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold">Visit Sanskar</h2>
          <ul className="mt-5 space-y-4 text-sm leading-6 text-white/70">
            <li className="flex gap-3">
              <Icon
                name="location"
                className="mt-0.5 shrink-0 text-gold"
                size={19}
              />
              <address className="not-italic">{settings.address}</address>
            </li>
            <li className="flex gap-3">
              <Icon
                name="phone"
                className="mt-0.5 shrink-0 text-gold"
                size={18}
              />
              <span>
                <a className="hover:text-white" href="tel:+917535938481">
                  {settings.primaryPhone}
                </a>
                <br />
                <a className="hover:text-white" href="tel:+919012539208">
                  {settings.secondaryPhone}
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <Icon
                name="mail"
                className="mt-0.5 shrink-0 text-gold"
                size={18}
              />
              <a
                className="hover:text-white"
                href={`mailto:${settings.email}`}
              >
                {settings.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container flex flex-wrap gap-x-6 gap-y-3 pb-8 text-sm text-white/80">
        <Link to="/privacy" className="hover:text-gold">Privacy notice</Link>
        <Link to="/website-terms" className="hover:text-gold">Website terms</Link>
        <Link to="/editorial-policy" className="hover:text-gold">Editorial policy</Link>
        <a href="https://www.youtube.com/@sanskarpublicschoolmathura4604" target="_blank" rel="noopener noreferrer" className="hover:text-gold">Sanskar on YouTube</a>
        <a href="https://www.linkedin.com/company/sanskar-school-mathura" target="_blank" rel="noopener noreferrer" className="hover:text-gold">Sanskar on LinkedIn</a>
      </div>
      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-3 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Sanskar Public School, Mathura. All
            rights reserved.
          </p>
          <p>{settings.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
