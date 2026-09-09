import { lazy, Suspense, useEffect } from "react"
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom"
import Footer from "./components/Footer"
import Icon from "./components/Icon"
import Nav from "./components/Nav"
import { LanguageProvider } from "./context/Language"
import { SiteContentProvider } from "./context/SiteContent"
import { WHATSAPP_URL } from "./data/site"
import Home from "./pages/Home"

const About = lazy(() => import("./pages/About"))
const Academics = lazy(() => import("./pages/Academics"))
const Achievements = lazy(() => import("./pages/Achievements"))
const Admissions = lazy(() => import("./pages/Admissions"))
const Admin = lazy(() => import("./pages/Admin"))
const ComingSoon = lazy(() => import("./pages/ComingSoon"))
const Contact = lazy(() => import("./pages/Contact"))
const Gallery = lazy(() => import("./pages/Gallery"))
const Infrastructure = lazy(() => import("./pages/Infrastructure"))
const LeaderMessage = lazy(() => import("./pages/LeaderMessage"))
const LittleWinners = lazy(() => import("./pages/LittleWinners"))
const Notices = lazy(() => import("./pages/Notices"))
const PayFee = lazy(() => import("./pages/PayFee"))
const SportsArena = lazy(() => import("./pages/SportsArena"))
const TalentAcademy = lazy(() => import("./pages/TalentAcademy"))

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash)
      window.setTimeout(
        () =>
          document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" }),
        80,
      )
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Sanskar Public School on WhatsApp at 75359 38481"
      className="fixed bottom-5 right-5 z-40 flex h-14 items-center justify-center rounded-full bg-[#1f9d61] px-4 text-white shadow-[0_12px_35px_rgba(31,157,97,.35)] transition-transform hover:-translate-y-1 sm:bottom-7 sm:right-7"
    >
      <svg
        width="27"
        height="27"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26C2.17 6.44 6.6 2.01 12.05 2.01A9.9 9.9 0 0 1 22 11.9c0 5.45-4.44 9.89-9.95 9.89M20.46 3.49A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9a11.82 11.82 0 0 0-3.48-8.41Z" />
      </svg>
      <span className="ml-2 hidden text-sm font-bold sm:inline">WhatsApp</span>
    </a>
  )
}

function NotFound() {
  return (
    <section className="flex min-h-[75vh] items-center bg-cream pt-32">
      <div className="container text-center">
        <p className="eyebrow">Page not found</p>
        <h1 className="section-title mt-4">Let's get you back to Sanskar.</h1>
        <p className="section-copy mx-auto mt-5 max-w-xl">
          The page you requested may have moved. Explore the school from our
          homepage.
        </p>
        <Link to="/" className="button button-primary mt-8">
          Return home <Icon name="arrow" />
        </Link>
      </div>
    </section>
  )
}

function AppRoutes() {
  const { pathname } = useLocation()

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </Suspense>
    )
  }

  return (
    <SiteContentProvider>
      <LanguageProvider>
        <ScrollToTop />
        <Nav />
        <main>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/academics" element={<Academics />} />
              <Route path="/little-winners" element={<LittleWinners />} />
              <Route path="/infrastructure" element={<Infrastructure />} />
              <Route path="/talent-academy" element={<TalentAcademy />} />
              <Route path="/sports-arena" element={<SportsArena />} />
              <Route path="/admissions" element={<Admissions />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pay-fee" element={<PayFee />} />
              <Route path="/leadership/:leaderId" element={<LeaderMessage />} />
              <Route
                path="/virtual-tour"
                element={
                  <ComingSoon
                    title="Virtual Tour"
                    subtitle="An immersive campus walkthrough is being prepared. Until then, book a personal visit and experience Sanskar in person."
                    path="/virtual-tour"
                  />
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <WhatsAppButton />
      </LanguageProvider>
    </SiteContentProvider>
  )
}

function PageLoader() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-cream pt-28">
      <span className="flex items-center gap-3 text-sm font-semibold text-navy">
        <span className="h-3 w-3 animate-pulse rounded-full bg-gold" />
        Loading Sanskar…
      </span>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
