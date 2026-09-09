import { useEffect, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { useSiteContent } from "../context/SiteContent"
import { STA_PORTAL } from "../data/site"
import Icon from "./Icon"
import LanguageSwitcher from "./LanguageSwitcher"

const links = [
  { label: "About", to: "/about" },
  { label: "Academics", to: "/academics" },
  { label: "Little Winner", to: "/little-winners" },
  { label: "Campus", to: "/infrastructure" },
  { label: "Talent Academy", to: "/talent-academy" },
  { label: "Sports Arena", to: "/sports-arena" },
  { label: "Admissions", to: "/admissions" },
]

const moreLinks = [
  { label: "Achievements", to: "/achievements" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
  { label: "Pay online fee", to: "/pay-fee" },
  { label: "Login", to: "/admin" },
]

export default function Nav() {
  const { settings } = useSiteContent()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const itemClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-2.5 py-2 text-[11px] font-semibold transition-colors ${
      isActive
        ? "bg-navy text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-navy"
    }`
  const mobileClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold ${
      isActive ? "bg-navy text-white" : "text-slate-700 hover:bg-slate-50"
    }`

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-white/95 shadow-[0_8px_40px_rgba(8,43,79,.1)] backdrop-blur-xl"
          : "bg-white/90 backdrop-blur-md"
      }`}
    >
      <div className="hidden h-8 bg-navy-deep text-white lg:block">
        <div className="container flex h-full items-center justify-between text-[11px] font-semibold">
          <span className="tracking-wide text-white/70">
            {settings.announcement}
          </span>
          <div className="flex items-center gap-5">
            <Link to="/admin" className="hover:text-gold">
              Login
            </Link>
            <Link to="/pay-fee" className="hover:text-gold">
              Pay online fee
            </Link>
            <a
              href={STA_PORTAL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-gold"
            >
              Book Talent Academy coaching
            </a>
          </div>
        </div>
      </div>
      <div className="container flex h-[76px] items-center justify-between gap-2 sm:gap-4">
        <Link
          to="/"
          className="shrink-0"
          aria-label="Sanskar Public School home"
        >
          <img
            src="/logo.png"
            alt="Sanskar Public School"
            className="h-10 w-auto max-w-[145px] object-contain sm:h-[52px] sm:max-w-[230px]"
          />
        </Link>
        <nav
          className="hidden items-center gap-0.5 xl:flex"
          aria-label="Primary navigation"
        >
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={itemClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <LanguageSwitcher />
        <div className="hidden items-center gap-3 xl:flex">
          <div className="flex items-start gap-1.5 text-[11px] font-semibold leading-4 text-navy">
            <Icon name="phone" size={15} className="mt-0.5" />
            <span className="flex flex-col">
              <a href="tel:+917535938481" className="hover:text-blue">
                {settings.primaryPhone}
              </a>
              <a href="tel:+919012539208" className="hover:text-blue">
                {settings.secondaryPhone}
              </a>
            </span>
          </div>
          <Link
            to="/admissions#enquiry"
            className="button button-gold !min-h-11 !px-4"
          >
            Book a visit
          </Link>
        </div>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white xl:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <Icon name={open ? "x" : "menu"} size={22} />
        </button>
      </div>
      <div
        className={`overflow-y-auto border-t border-slate-100 bg-white transition-all duration-300 xl:hidden ${
          open ? "max-h-[calc(100vh-76px)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav
          className="container flex flex-col gap-1 py-5"
          aria-label="Mobile navigation"
        >
          {[...links, ...moreLinks].map((link) => (
            <NavLink key={link.to} to={link.to} className={mobileClass}>
              {link.label}
              <Icon name="chevron" size={17} />
            </NavLink>
          ))}
          <div className="mt-3 rounded-2xl bg-slate-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-400">
              Call the school
            </p>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-navy">
              <a href="tel:+917535938481">{settings.primaryPhone}</a>
              <a href="tel:+919012539208">{settings.secondaryPhone}</a>
            </div>
          </div>
          <Link to="/admissions#enquiry" className="button button-gold mt-2">
            Book a visit
          </Link>
        </nav>
      </div>
    </header>
  )
}
