import { useCallback, useEffect, useMemo, useState } from "react"
import Icon from "../components/Icon"
import {
  DEFAULT_HAPPENINGS,
  DEFAULT_PROGRAMMES,
  DEFAULT_SETTINGS,
  DEFAULT_SPORTS_ARENA,
  DEFAULT_TESTIMONIALS,
  type BoardItem,
  type EditableNotice,
  type EditableTestimonial,
  type MediaItem,
  type SiteSettings,
  type SportsArenaContent,
} from "../context/SiteContent"

type Lead = {
  id: string
  studentName: string
  parentName: string
  phone: string
  email: string
  grade: string
  wing: string
  city: string
  message: string
  source: string
  status: string
  emailStatus: string
  createdAt: number
}

type AdminUser = {
  id: string
  username: string
  displayName: string
  role: "owner" | "admin"
  active: boolean | number
  managed: boolean
  createdAt: number
  updatedAt: number
  lastLoginAt: number | null
}

type DashboardData = {
  stats: { leads: number, newLeads: number, media: number }
  leads: Lead[]
  media: MediaItem[]
  content: {
    settings: SiteSettings
    notices: EditableNotice[]
    programmes: BoardItem[]
    happenings: BoardItem[]
    testimonials: EditableTestimonial[]
    sportsArena: SportsArenaContent
    seo: Record<string, { title: string, description: string }>
  }
  email: { destination: string, provider: string }
  session: { username: string, canManageAdmins: boolean }
  admins: AdminUser[]
}

const tabs = [
  ["overview", "Overview", "target"],
  ["leads", "Enquiries", "users"],
  ["content", "Site content", "book"],
  ["boards", "Home boards", "target"],
  ["testimonials", "Testimonials", "quote"],
  ["sports", "Sports Arena", "sport"],
  ["notices", "Notices", "calendar"],
  ["media", "Media", "camera"],
  ["seo", "SEO", "spark"],
  ["admins", "Admin access", "users"],
  ["security", "Security", "shield"],
] as const

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options?.body instanceof FormData
        ? {}
        : { "content-type": "application/json" }),
      ...options?.headers,
    },
  })
  const payload = (await response.json().catch(() => null)) as T & {
    message?: string
  } | null
  if (!response.ok)
    throw new Error(payload?.message || "The request could not be completed.")
  return payload as T
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      })
      onSuccess()
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "Sign-in failed.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-deep px-5 py-16 text-white">
      <div className="motion-grid absolute inset-0 opacity-30" />
      <div className="absolute -left-24 top-12 h-80 w-80 rounded-full bg-teal/20 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.06] shadow-[0_30px_100px_rgba(0,0,0,.3)] backdrop-blur-xl lg:grid-cols-[1.05fr_.95fr]">
        <section className="hidden flex-col justify-between border-r border-white/10 p-12 lg:flex">
          <img
            src="/logo.png"
            alt="Sanskar Public School"
            className="h-16 w-fit rounded-xl bg-white px-3 py-2"
          />
          <div>
            <p className="eyebrow eyebrow-light">Website command centre</p>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-tight">
              Simple control.
              <br />
              <span className="text-gold">Powerful results.</span>
            </h1>
            <p className="mt-5 max-w-md leading-8 text-white/60">
              Manage admission enquiries, homepage content, notices, gallery
              uploads and search visibility from one secure workspace.
            </p>
          </div>
          <p className="text-xs text-white/35">
            Sanskar Public School · Mathura
          </p>
        </section>
        <section className="bg-white p-7 text-navy sm:p-12">
          <div className="lg:hidden">
            <img
              src="/logo.png"
              alt="Sanskar Public School"
              className="h-14 w-auto"
            />
          </div>
          <p className="eyebrow mt-10 lg:mt-0">Administrator access</p>
          <h2 className="mt-3 font-display text-4xl font-semibold">
            Welcome back.
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            Sign in with the private credentials issued to the school
            administrator.
          </p>
          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block text-sm font-semibold">
              Login ID
              <input
                autoComplete="username"
                required
                className="field mt-2"
                value={credentials.username}
                onChange={(event) =>
                  setCredentials({
                    ...credentials,
                    username: event.target.value,
                  })
                }
              />
            </label>
            <label className="block text-sm font-semibold">
              Password
              <input
                type="password"
                autoComplete="current-password"
                required
                className="field mt-2"
                value={credentials.password}
                onChange={(event) =>
                  setCredentials({
                    ...credentials,
                    password: event.target.value,
                  })
                }
              />
            </label>
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="button button-primary w-full disabled:cursor-wait disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Sign in securely"}
              <Icon name="arrow" size={17} />
            </button>
          </form>
          <p className="mt-7 flex items-center gap-2 text-xs leading-5 text-slate-400">
            <Icon name="shield" size={16} />
            Protected by encrypted credentials, secure cookies and login
            throttling.
          </p>
        </section>
      </div>
    </main>
  )
}

function StatCard({
  label,
  value,
  icon,
  detail,
}: {
  label: string
  value: number
  icon: "users" | "camera" | "calendar"
  detail: string
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(8,43,79,.05)]">
      <div className="flex items-start justify-between">
        <span className="text-xs font-bold uppercase tracking-[.13em] text-slate-400">
          {label}
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e9f4f2] text-teal">
          <Icon name={icon} size={19} />
        </span>
      </div>
      <strong className="mt-5 block font-display text-5xl font-semibold text-navy">
        {value}
      </strong>
      <p className="mt-2 text-xs text-slate-400">{detail}</p>
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const tones: Record<string, string> = {
    new: "bg-blue-50 text-blue-700",
    contacted: "bg-amber-50 text-amber-700",
    "visit-booked": "bg-violet-50 text-violet-700",
    admitted: "bg-emerald-50 text-emerald-700",
    closed: "bg-slate-100 text-slate-600",
  }
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${tones[status] || tones.closed}`}
    >
      {status.replace("-", " ")}
    </span>
  )
}

export default function Admin() {
  const [session, setSession] =
    useState<"loading" | "signed-out" | "signed-in">("loading")
  const [data, setData] = useState<DashboardData | null>(null)
  const [activeTab, setActiveTab] = useState<typeof tabs[number][0]>("overview")
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [notices, setNotices] = useState<EditableNotice[]>([])
  const [programmes, setProgrammes] = useState<BoardItem[]>(DEFAULT_PROGRAMMES)
  const [happenings, setHappenings] = useState<BoardItem[]>(DEFAULT_HAPPENINGS)
  const [testimonials, setTestimonials] =
    useState<EditableTestimonial[]>(DEFAULT_TESTIMONIALS)
  const [sportsArena, setSportsArena] =
    useState<SportsArenaContent>(DEFAULT_SPORTS_ARENA)
  const [seo, setSeo] = useState<Record<string, {
    title: string
    description: string
  }>>({})
  const [feedback, setFeedback] = useState("")
  const [busy, setBusy] = useState(false)

  const refresh = useCallback(async () => {
    const payload = await api<{ ok: true } & DashboardData>(
      "/api/admin/dashboard",
    )
    setData(payload)
    setSettings({ ...DEFAULT_SETTINGS, ...(payload.content.settings || {}) })
    setNotices(payload.content.notices || [])
    setProgrammes(payload.content.programmes || DEFAULT_PROGRAMMES)
    setHappenings(payload.content.happenings || DEFAULT_HAPPENINGS)
    setTestimonials(payload.content.testimonials || DEFAULT_TESTIMONIALS)
    setSportsArena({
      ...DEFAULT_SPORTS_ARENA,
      ...(payload.content.sportsArena || {}),
    })
    setSeo(payload.content.seo || {})
  }, [])

  useEffect(() => {
    document.title = "Admin Dashboard | Sanskar Public School"
    let robots = document.head.querySelector<HTMLMetaElement>(
      'meta[name="robots"]',
    )
    if (!robots) {
      robots = document.createElement("meta")
      robots.name = "robots"
      document.head.appendChild(robots)
    }
    robots.content = "noindex, nofollow"
    api("/api/auth/session")
      .then(() => {
        setSession("signed-in")
        return refresh()
      })
      .catch(() => setSession("signed-out"))
  }, [refresh])

  const saveContent = async (
    key: "settings" | "notices" | "programmes" | "happenings" | "testimonials" | "sportsArena" | "seo",
    value: unknown,
  ) => {
    setBusy(true)
    setFeedback("")
    try {
      await api(`/api/admin/content/${key}`, {
        method: "PUT",
        body: JSON.stringify(value),
      })
      setFeedback("Saved and published successfully.")
      await refresh()
    } catch (caughtError) {
      setFeedback(
        caughtError instanceof Error ? caughtError.message : "Save failed.",
      )
    } finally {
      setBusy(false)
    }
  }

  const updateLead = async (id: string, status: string) => {
    setFeedback("")
    try {
      await api(`/api/admin/leads/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })
      setFeedback("Enquiry status updated.")
      await refresh()
    } catch (caughtError) {
      setFeedback(
        caughtError instanceof Error
          ? caughtError.message
          : "Status update failed.",
      )
    }
  }

  const logout = async () => {
    try {
      await api("/api/auth/logout", { method: "POST" })
    } finally {
      setSession("signed-out")
      setData(null)
    }
  }

  if (session === "loading")
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-sm font-semibold text-navy">
        Opening the admin workspace…
      </div>
    )
  if (session === "signed-out")
    return (
      <AdminLogin
        onSuccess={() => {
          setSession("signed-in")
          refresh()
        }}
      />
    )

  return (
    <main className="min-h-screen bg-[#f4f7f8] text-navy">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-navy-deep p-5 text-white lg:flex">
        <a href="/" className="rounded-2xl bg-white p-3">
          <img
            src="/logo.png"
            alt="Sanskar Public School"
            className="h-12 w-auto"
          />
        </a>
        <nav className="mt-8 space-y-1" aria-label="Admin sections">
          {tabs.map(([id, label, icon]) => (
            <button
              type="button"
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                activeTab === id
                  ? "bg-white text-navy"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon name={icon} size={18} />
              {label}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-2">
          <a
            href="/"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white/60 hover:bg-white/10 hover:text-white"
          >
            <Icon name="external" size={17} />
            View website
          </a>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white/60 hover:bg-white/10 hover:text-white"
          >
            <Icon name="x" size={17} />
            Sign out
          </button>
        </div>
      </aside>
      <div className="lg:ml-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur lg:px-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.15em] text-teal">
                Sanskar website admin
              </p>
              <h1 className="font-display text-2xl font-semibold capitalize">
                {tabs.find(([id]) => id === activeTab)?.[1]}
              </h1>
            </div>
            <div className="flex items-center gap-2 lg:hidden">
              <select
                aria-label="Admin section"
                value={activeTab}
                onChange={(event) =>
                  setActiveTab(event.target.value as typeof activeTab)
                }
                className="field !h-11 !py-0"
              >
                {tabs.map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={logout}
                aria-label="Sign out"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-white"
              >
                <Icon name="x" size={18} />
              </button>
            </div>
            <div className="hidden items-center gap-3 lg:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-slate-500">
                Website connected
              </span>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-7xl p-5 lg:p-10">
          {feedback && (
            <div role="status" className="mb-6 flex items-center justify-between rounded-2xl border border-teal/20 bg-[#e9f4f2] px-5 py-4 text-sm font-semibold text-teal">
              <span>{feedback}</span>
              <button type="button" onClick={() => setFeedback("")} aria-label="Dismiss">
                <Icon name="x" size={17} />
              </button>
            </div>
          )}

          {activeTab === "overview" && (
            <section>
              <div className="grid gap-5 md:grid-cols-3">
                <StatCard
                  label="Total enquiries"
                  value={data?.stats.leads || 0}
                  icon="users"
                  detail={`${data?.stats.newLeads || 0} awaiting follow-up`}
                />
                <StatCard
                  label="New enquiries"
                  value={data?.stats.newLeads || 0}
                  icon="calendar"
                  detail="Captured through the website"
                />
                <StatCard
                  label="Media library"
                  value={data?.stats.media || 0}
                  icon="camera"
                  detail="Uploaded images and documents"
                />
              </div>
              <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-2xl font-semibold">
                      Latest enquiries
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab("leads")}
                      className="text-xs font-bold text-blue"
                    >
                      View all
                    </button>
                  </div>
                  <div className="mt-5 divide-y divide-slate-100">
                    {data?.leads.slice(0, 6).map((lead) => (
                      <div
                        key={lead.id}
                        className="flex items-center gap-3 py-4"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e9f4f2] font-display text-lg text-teal">
                          {lead.studentName[0]}
                        </span>
                        <div className="min-w-0">
                          <strong className="block truncate text-sm">
                            {lead.studentName}
                          </strong>
                          <span className="text-xs text-slate-400">
                            {lead.grade} · {lead.phone}
                          </span>
                        </div>
                        <div className="ml-auto">
                          <StatusPill status={lead.status} />
                        </div>
                      </div>
                    ))}
                    {!data?.leads.length && (
                      <p className="py-10 text-center text-sm text-slate-400">
                        New enquiries will appear here.
                      </p>
                    )}
                  </div>
                </div>
                <div className="rounded-3xl bg-navy p-7 text-white">
                  <p className="eyebrow eyebrow-light">Lead notifications</p>
                  <h2 className="mt-4 font-display text-3xl font-semibold">
                    Email delivery is active.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-white/60">
                    New form submissions are stored here and sent to:
                  </p>
                  <p className="mt-3 break-all text-sm font-bold text-gold">
                    {data?.email.destination}
                  </p>
                  <div className="mt-6 rounded-2xl bg-white/10 p-4 text-xs text-white/55">
                    Delivery provider: {data?.email.provider}
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "leads" && (
            <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display text-3xl font-semibold">
                    Admission enquiries
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Follow up, track progress and export records.
                  </p>
                </div>
                <a
                  href="/api/admin/leads.csv"
                  className="button button-outline !min-h-11"
                >
                  Export CSV <Icon name="external" size={15} />
                </a>
              </div>
              <div className="mt-7 overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] uppercase tracking-[.13em] text-slate-400">
                      <th className="pb-3 pr-4">Student</th>
                      <th className="pb-3 pr-4">Contact</th>
                      <th className="pb-3 pr-4">Grade / wing</th>
                      <th className="pb-3 pr-4">Received</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.leads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-b border-slate-100 align-top"
                      >
                        <td className="py-5 pr-4">
                          <strong>{lead.studentName}</strong>
                          <span className="mt-1 block text-xs text-slate-400">
                            Parent: {lead.parentName || "—"}
                            {lead.city ? ` · ${lead.city}` : ""}
                          </span>
                          {lead.message && (
                            <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500">
                              {lead.message}
                            </p>
                          )}
                        </td>
                        <td className="py-5 pr-4">
                          <a
                            className="font-semibold text-blue"
                            href={`tel:${lead.phone}`}
                          >
                            {lead.phone}
                          </a>
                          {lead.email && (
                            <a
                              className="mt-1 block text-xs text-slate-400"
                              href={`mailto:${lead.email}`}
                            >
                              {lead.email}
                            </a>
                          )}
                          <span className="mt-2 block text-[10px] uppercase text-slate-400">
                            Email: {lead.emailStatus}
                          </span>
                        </td>
                        <td className="py-5 pr-4">
                          {lead.grade}
                          <span className="mt-1 block text-xs text-slate-400">
                            {lead.wing}
                          </span>
                        </td>
                        <td className="py-5 pr-4 text-xs text-slate-500">
                          {new Date(lead.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="py-5">
                          <select
                            value={lead.status}
                            onChange={(event) =>
                              updateLead(lead.id, event.target.value)
                            }
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="visit-booked">Visit booked</option>
                            <option value="admitted">Admitted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!data?.leads.length && (
                  <p className="py-16 text-center text-sm text-slate-400">
                    No enquiries yet.
                  </p>
                )}
              </div>
            </section>
          )}

          {activeTab === "content" && (
            <section className="grid gap-7 xl:grid-cols-[1fr_.45fr]">
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  saveContent("settings", settings)
                }}
                className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"
              >
                <h2 className="font-display text-3xl font-semibold">
                  Branding, homepage & contact details
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Control the school tagline, theme line, hero, phone numbers
                  and public contact details.
                </p>
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  {([
                    ["announcement", "Admission announcement"],
                    ["tagline", "School tagline"],
                    ["themeLine", "School theme line"],
                    ["heroOptionalLine", "Optional hero line"],
                    ["heroTitle", "Hero headline"],
                    ["heroAccent", "Highlighted headline"],
                    ["heroImage", "Hero image URL"],
                    ["primaryPhone", "Primary phone"],
                    ["secondaryPhone", "Second phone"],
                    ["email", "School email"],
                    ["address", "School address"],
                  ] as const).map(([key, label]) => (
                    <label
                      key={key}
                      className={`text-sm font-semibold ${
                        key === "address" || key === "heroImage"
                          ? "sm:col-span-2"
                          : ""
                      }`}
                    >
                      {label}
                      <input
                        className="field mt-2"
                        value={settings[key]}
                        onChange={(event) =>
                          setSettings({
                            ...settings,
                            [key]: event.target.value,
                          })
                        }
                      />
                    </label>
                  ))}
                  <label className="text-sm font-semibold sm:col-span-2">
                    Hero introduction
                    <textarea
                      rows={4}
                      className="field mt-2 !h-auto resize-y"
                      value={settings.heroCopy}
                      onChange={(event) =>
                        setSettings({
                          ...settings,
                          heroCopy: event.target.value,
                        })
                      }
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="button button-primary mt-7 disabled:opacity-60"
                >
                  Save & publish <Icon name="check" size={17} />
                </button>
              </form>
              <aside className="rounded-3xl bg-[#e9f4f2] p-7">
                <span className="icon-box">
                  <Icon name="spark" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold">
                  Editing guidance
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  <li>
                    Upload pictures in Media, then copy their URL into any image
                    field.
                  </li>
                  <li>Keep the current academic session consistent.</li>
                  <li>Do not remove the CBSE affiliation number.</li>
                  <li>Changes publish immediately after saving.</li>
                </ul>
              </aside>
            </section>
          )}

          {activeTab === "boards" && (
            <BoardsEditor
              programmes={programmes}
              setProgrammes={setProgrammes}
              happenings={happenings}
              setHappenings={setHappenings}
              busy={busy}
              setFeedback={setFeedback}
              onSaveProgrammes={() => saveContent("programmes", programmes)}
              onSaveHappenings={() => saveContent("happenings", happenings)}
            />
          )}
          {activeTab === "testimonials" && (
            <TestimonialsEditor
              testimonials={testimonials}
              setTestimonials={setTestimonials}
              busy={busy}
              onSave={() => saveContent("testimonials", testimonials)}
            />
          )}
          {activeTab === "sports" && (
            <SportsArenaEditor
              value={sportsArena}
              setValue={setSportsArena}
              busy={busy}
              onSave={() => saveContent("sportsArena", sportsArena)}
            />
          )}
          {activeTab === "notices" && (
            <NoticesEditor
              notices={notices}
              setNotices={setNotices}
              busy={busy}
              onSave={() => saveContent("notices", notices)}
            />
          )}
          {activeTab === "media" && (
            <MediaManager
              data={data}
              refresh={refresh}
              setFeedback={setFeedback}
            />
          )}
          {activeTab === "seo" && (
            <SeoEditor
              seo={seo}
              setSeo={setSeo}
              busy={busy}
              onSave={() => saveContent("seo", seo)}
            />
          )}
          {activeTab === "admins" && (
            <AdminAccounts
              data={data}
              refresh={refresh}
              setFeedback={setFeedback}
            />
          )}
          {activeTab === "security" && (
            <SecurityPanel
              onSignedOut={() => {
                setSession("signed-out")
                setData(null)
              }}
              setFeedback={setFeedback}
            />
          )}
        </div>
      </div>
    </main>
  )
}

function InlineImageUpload({
  value,
  altText,
  category,
  onChange,
  setFeedback,
}: {
  value: string
  altText: string
  category: string
  onChange: (value: string) => void
  setFeedback: (value: string) => void
}) {
  const [uploading, setUploading] = useState(false)

  const upload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const body = new FormData()
    body.append("file", file)
    body.append("altText", altText)
    body.append("category", category)
    setUploading(true)
    setFeedback("")
    try {
      const result = await api<{ media: MediaItem }>("/api/admin/media", {
        method: "POST",
        body,
      })
      onChange(result.media.url)
      setFeedback("Image uploaded and attached. Save this board to publish it.")
    } catch (caughtError) {
      setFeedback(
        caughtError instanceof Error
          ? caughtError.message
          : "Image upload failed.",
      )
    } finally {
      setUploading(false)
      event.target.value = ""
    }
  }

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 lg:col-span-3">
      <div className="grid gap-4 sm:grid-cols-[120px_1fr] sm:items-center">
        {value ? (
          <img
            src={value}
            alt=""
            className="aspect-[4/3] w-full rounded-xl bg-white object-cover"
          />
        ) : (
          <span className="flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-white text-slate-300">
            <Icon name="camera" size={28} />
          </span>
        )}
        <div>
          <label className="block text-xs font-semibold text-slate-500">
            Image URL
            <input
              className="field mt-1.5"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="Upload below or paste an image URL"
            />
          </label>
          <label className="button button-outline mt-3 !min-h-10 cursor-pointer !px-4 !py-2">
            <Icon name="camera" size={16} />
            {uploading ? "Uploading…" : "Upload image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={uploading}
              onChange={upload}
              className="sr-only"
            />
          </label>
          <p className="mt-2 text-[11px] text-slate-400">
            JPG, PNG or WebP up to 8 MB.
          </p>
        </div>
      </div>
    </div>
  )
}

function BoardsEditor({
  programmes,
  setProgrammes,
  happenings,
  setHappenings,
  busy,
  setFeedback,
  onSaveProgrammes,
  onSaveHappenings,
}: {
  programmes: BoardItem[]
  setProgrammes: React.Dispatch<React.SetStateAction<BoardItem[]>>
  happenings: BoardItem[]
  setHappenings: React.Dispatch<React.SetStateAction<BoardItem[]>>
  busy: boolean
  setFeedback: (value: string) => void
  onSaveProgrammes: () => void
  onSaveHappenings: () => void
}) {
  const editor = (
    title: string,
    description: string,
    items: BoardItem[],
    setItems: React.Dispatch<React.SetStateAction<BoardItem[]>>,
    onSave: () => void,
  ) => {
    const add = () =>
      setItems([
        ...items,
        {
          id: crypto.randomUUID(),
          title: "New item",
          date: "Add timing",
          label: "Update",
          summary: "Add a short description.",
          image: "/optimized/building01.jpg",
          href: "/",
        },
      ])
    const update = (index: number, key: keyof BoardItem, value: string) =>
      setItems(
        items.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [key]: value } : item,
        ),
      )

    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
          <button type="button" onClick={add} className="button button-outline !min-h-11">
            Add item
          </button>
        </div>
        <div className="mt-7 space-y-5">
          {items.map((item, index) => (
            <article
              key={item.id || index}
              className="rounded-2xl border border-slate-200 p-5"
            >
              <div className="grid gap-4 lg:grid-cols-3">
                {([
                  ["title", "Title"],
                  ["date", "Date / timing"],
                  ["label", "Category label"],
                  ["href", "Destination link"],
                ] as const).map(([key, label]) => (
                  <label
                    key={key}
                    className="text-xs font-semibold text-slate-500"
                  >
                    {label}
                    <input
                      className="field mt-1.5"
                      value={item[key] || ""}
                      onChange={(event) =>
                        update(index, key, event.target.value)
                      }
                    />
                  </label>
                ))}
                <InlineImageUpload
                  value={item.image || ""}
                  altText={item.title}
                  category="Homepage notice boards"
                  onChange={(value) => update(index, "image", value)}
                  setFeedback={setFeedback}
                />
                <label className="text-xs font-semibold text-slate-500 lg:col-span-3">
                  Short description
                  <textarea
                    rows={3}
                    className="field mt-1.5 !h-auto resize-y"
                    value={item.summary}
                    onChange={(event) =>
                      update(index, "summary", event.target.value)
                    }
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={() =>
                  setItems(items.filter((_, itemIndex) => itemIndex !== index))
                }
                className="mt-4 text-xs font-bold text-red-500"
              >
                Remove item
              </button>
            </article>
          ))}
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={onSave}
          className="button button-primary mt-7 disabled:opacity-60"
        >
          Save & publish {title.toLowerCase()} <Icon name="check" size={17} />
        </button>
      </section>
    )
  }

  return (
    <div className="space-y-7">
      {editor(
        "Upcoming programmes",
        "Manage the upcoming-programme notice board on the homepage.",
        programmes,
        setProgrammes,
        onSaveProgrammes,
      )}
      {editor(
        "What's going on",
        "Manage the live activity notice board on the homepage.",
        happenings,
        setHappenings,
        onSaveHappenings,
      )}
    </div>
  )
}

function TestimonialsEditor({
  testimonials,
  setTestimonials,
  busy,
  onSave,
}: {
  testimonials: EditableTestimonial[]
  setTestimonials: React.Dispatch<React.SetStateAction<EditableTestimonial[]>>
  busy: boolean
  onSave: () => void
}) {
  const add = () =>
    setTestimonials([
      ...testimonials,
      { id: crypto.randomUUID(), name: "Parent name", quote: "", image: "" },
    ])
  const update = (
    index: number,
    key: keyof EditableTestimonial,
    value: string,
  ) =>
    setTestimonials(
      testimonials.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    )

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold">
            Parent testimonials
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Edit names, quotes and parent picture URLs shown on the homepage.
          </p>
        </div>
        <button type="button" onClick={add} className="button button-outline !min-h-11">
          Add testimonial
        </button>
      </div>
      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        {testimonials.map((item, index) => (
          <article
            key={item.id || index}
            className="rounded-2xl border border-slate-200 p-5"
          >
            <div className="flex items-center gap-4">
              {item.image ? (
                <img
                  src={item.image}
                  alt=""
                  className="h-16 w-16 rounded-full bg-slate-100 object-cover"
                />
              ) : (
                <span className="h-16 w-16 rounded-full bg-slate-100" />
              )}
              <label className="flex-1 text-xs font-semibold text-slate-500">
                Parent name
                <input
                  className="field mt-1.5"
                  value={item.name}
                  onChange={(event) =>
                    update(index, "name", event.target.value)
                  }
                />
              </label>
            </div>
            <label className="mt-4 block text-xs font-semibold text-slate-500">
              Picture URL
              <input
                className="field mt-1.5"
                value={item.image}
                onChange={(event) => update(index, "image", event.target.value)}
              />
            </label>
            <label className="mt-4 block text-xs font-semibold text-slate-500">
              Testimonial
              <textarea
                rows={5}
                className="field mt-1.5 !h-auto resize-y"
                value={item.quote}
                onChange={(event) => update(index, "quote", event.target.value)}
              />
            </label>
            <button
              type="button"
              onClick={() =>
                setTestimonials(
                  testimonials.filter((_, itemIndex) => itemIndex !== index),
                )
              }
              className="mt-4 text-xs font-bold text-red-500"
            >
              Remove testimonial
            </button>
          </article>
        ))}
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={onSave}
        className="button button-primary mt-7 disabled:opacity-60"
      >
        Save & publish testimonials <Icon name="check" size={17} />
      </button>
    </section>
  )
}

function SportsArenaEditor({
  value,
  setValue,
  busy,
  onSave,
}: {
  value: SportsArenaContent
  setValue: React.Dispatch<React.SetStateAction<SportsArenaContent>>
  busy: boolean
  onSave: () => void
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8">
      <h2 className="font-display text-3xl font-semibold">Sports Arena page</h2>
      <p className="mt-1 text-sm text-slate-500">
        Control the main Sports Arena message, image, booking link and facility
        highlights.
      </p>
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        {([
          ["eyebrow", "Hero eyebrow"],
          ["title", "Page title"],
          ["image", "Hero image URL"],
          ["bookingUrl", "Booking URL"],
          ["bookingLabel", "Booking button label"],
        ] as const).map(([key, label]) => (
          <label
            key={key}
            className={`text-sm font-semibold ${
              key === "image" ? "sm:col-span-2" : ""
            }`}
          >
            {label}
            <input
              className="field mt-2"
              value={value[key]}
              onChange={(event) =>
                setValue({ ...value, [key]: event.target.value })
              }
            />
          </label>
        ))}
        <label className="text-sm font-semibold sm:col-span-2">
          Introduction
          <textarea
            rows={4}
            className="field mt-2 !h-auto resize-y"
            value={value.introduction}
            onChange={(event) =>
              setValue({ ...value, introduction: event.target.value })
            }
          />
        </label>
        <label className="text-sm font-semibold sm:col-span-2">
          Facility highlights (one per line)
          <textarea
            rows={7}
            className="field mt-2 !h-auto resize-y"
            value={value.highlights.join("\n")}
            onChange={(event) =>
              setValue({
                ...value,
                highlights: event.target.value
                  .split("\n")
                  .map((item) => item.trim())
                  .filter(Boolean),
              })
            }
          />
        </label>
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={onSave}
        className="button button-primary mt-7 disabled:opacity-60"
      >
        Save & publish Sports Arena <Icon name="check" size={17} />
      </button>
    </section>
  )
}

function NoticesEditor({
  notices,
  setNotices,
  busy,
  onSave,
}: {
  notices: EditableNotice[]
  setNotices: React.Dispatch<React.SetStateAction<EditableNotice[]>>
  busy: boolean
  onSave: () => void
}) {
  const addNotice = () =>
    setNotices([
      {
        id: crypto.randomUUID(),
        title: "New notice",
        date: new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        type: "Circular",
        href: "",
      },
      ...notices,
    ])
  const update = (index: number, key: keyof EditableNotice, value: string) =>
    setNotices(
      notices.map((notice, itemIndex) =>
        itemIndex === index ? { ...notice, [key]: value } : notice,
      ),
    )
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold">
            Notices & downloads
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Add circulars, disclosures and admission documents.
          </p>
        </div>
        <button type="button" onClick={addNotice} className="button button-outline !min-h-11">
          Add notice
        </button>
      </div>
      <div className="mt-7 space-y-4">
        {notices.map((notice, index) => (
          <div
            key={notice.id || index}
            className="grid gap-4 rounded-2xl border border-slate-200 p-5 lg:grid-cols-[1fr_.55fr_.4fr_1.3fr_auto]"
          >
            <label className="text-xs font-semibold text-slate-500">
              Title
              <input
                className="field mt-1.5"
                value={notice.title}
                onChange={(event) => update(index, "title", event.target.value)}
              />
            </label>
            <label className="text-xs font-semibold text-slate-500">
              Date
              <input
                className="field mt-1.5"
                value={notice.date}
                onChange={(event) => update(index, "date", event.target.value)}
              />
            </label>
            <label className="text-xs font-semibold text-slate-500">
              Type
              <select
                className="field mt-1.5"
                value={notice.type}
                onChange={(event) => update(index, "type", event.target.value)}
              >
                <option>Circular</option>
                <option>Admissions</option>
                <option>Disclosure</option>
                <option>Academics</option>
                <option>Event</option>
              </select>
            </label>
            <label className="text-xs font-semibold text-slate-500">
              Document URL
              <input
                type="url"
                className="field mt-1.5"
                value={notice.href}
                onChange={(event) => update(index, "href", event.target.value)}
                placeholder="https://…"
              />
            </label>
            <button
              type="button"
              onClick={() =>
                setNotices(
                  notices.filter((_, itemIndex) => itemIndex !== index),
                )
              }
              aria-label={`Remove ${notice.title}`}
              className="mt-5 flex h-11 w-11 items-center justify-center rounded-xl text-red-500 hover:bg-red-50"
            >
              <Icon name="x" size={18} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={onSave}
        className="button button-primary mt-7 disabled:opacity-60"
      >
        Save & publish notices <Icon name="check" size={17} />
      </button>
    </section>
  )
}

function MediaManager({
  data,
  refresh,
  setFeedback,
}: {
  data: DashboardData | null
  refresh: () => Promise<void>
  setFeedback: (value: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ altText: "", category: "Campus" })
  const upload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formElement = event.currentTarget
    const input = formElement.elements.namedItem(
      "file",
    ) as HTMLInputElement
    if (!input.files?.[0]) return
    const body = new FormData()
    body.append("file", input.files[0])
    body.append("altText", form.altText)
    body.append("category", form.category)
    setUploading(true)
    try {
      await api("/api/admin/media", { method: "POST", body })
      setFeedback("Media uploaded successfully.")
      setForm({ altText: "", category: "Campus" })
      formElement.reset()
      await refresh()
    } catch (caughtError) {
      setFeedback(
        caughtError instanceof Error ? caughtError.message : "Upload failed.",
      )
    } finally {
      setUploading(false)
    }
  }
  const remove = async (item: MediaItem) => {
    if (!window.confirm(`Delete ${item.fileName}?`)) return
    setFeedback("")
    try {
      await api(`/api/admin/media/${item.id}`, { method: "DELETE" })
      setFeedback("Media deleted.")
      await refresh()
    } catch (caughtError) {
      setFeedback(caughtError instanceof Error ? caughtError.message : "Media deletion failed.")
    }
  }
  return (
    <section className="grid gap-7 xl:grid-cols-[.72fr_1.28fr]">
      <form
        onSubmit={upload}
        className="h-fit rounded-3xl bg-navy p-7 text-white"
      >
        <p className="eyebrow eyebrow-light">Upload centre</p>
        <h2 className="mt-4 font-display text-3xl font-semibold">Add media</h2>
        <p className="mt-3 text-sm leading-7 text-white/55">
          Upload an image or PDF up to 8 MB. Files are stored securely and
          delivered through the site.
        </p>
        <label className="mt-6 block text-xs font-semibold text-white/70">
          Choose file
          <input
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
            required
            className="mt-2 block w-full rounded-xl border border-dashed border-white/25 bg-white/10 p-4 text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-gold file:px-3 file:py-2 file:font-bold file:text-navy"
          />
        </label>
        <label className="mt-4 block text-xs font-semibold text-white/70">
          Image description
          <input
            className="field mt-2 !border-white/15 !bg-white/10 !text-white placeholder:!text-white/30"
            value={form.altText}
            onChange={(event) =>
              setForm({ ...form, altText: event.target.value })
            }
            placeholder="Describe the image for accessibility"
          />
        </label>
        <label className="mt-4 block text-xs font-semibold text-white/70">
          Category
          <select
            className="field mt-2 !border-white/15 !bg-navy !text-white"
            value={form.category}
            onChange={(event) =>
              setForm({ ...form, category: event.target.value })
            }
          >
            <option>Campus</option>
            <option>Learning</option>
            <option>Early years</option>
            <option>Culture</option>
            <option>Sports</option>
            <option>Values</option>
            <option>Community</option>
            <option>Documents</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={uploading}
          className="button button-gold mt-6 w-full disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "Upload media"}
          <Icon name="arrow" size={17} />
        </button>
      </form>
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="font-display text-3xl font-semibold">Media library</h2>
        <p className="mt-1 text-sm text-slate-500">
          Copy a file URL and paste it into any image or document field.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data?.media.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-slate-200"
            >
              {item.contentType.startsWith("image/") ? (
                <img
                  src={item.url}
                  alt={item.altText || item.fileName}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center bg-slate-100 text-slate-400">
                  <Icon name="book" size={36} />
                </div>
              )}
              <div className="p-4">
                <strong className="block truncate text-sm">
                  {item.fileName}
                </strong>
                <span className="mt-1 block text-[10px] uppercase tracking-wide text-slate-400">
                  {item.category} · {(item.size / 1024).toFixed(0)} KB
                </span>
                <div className="mt-3 flex gap-3">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-blue"
                  >
                    Open
                  </a>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(item.url)
                        setFeedback("Media URL copied.")
                      } catch {
                        setFeedback("Copy was blocked. Open the file and copy its address.")
                      }
                    }}
                    className="text-xs font-bold text-teal"
                  >
                    Copy URL
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    className="ml-auto text-xs font-bold text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
          {!data?.media.length && (
            <p className="col-span-full py-16 text-center text-sm text-slate-400">
              Uploaded media will appear here.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

function SeoEditor({
  seo,
  setSeo,
  busy,
  onSave,
}: {
  seo: Record<string, { title: string, description: string }>
  setSeo: React.Dispatch<React.SetStateAction<Record<string, {
    title: string
    description: string
  }>>>
  busy: boolean
  onSave: () => void
}) {
  const routes = useMemo(
    () => [
      { path: "/", label: "Homepage" },
      { path: "/admissions", label: "Admissions" },
      { path: "/academics", label: "Academics" },
      { path: "/little-winners", label: "Little Winner" },
      { path: "/infrastructure", label: "Campus" },
      { path: "/talent-academy", label: "Talent Academy" },
      { path: "/sports-arena", label: "Sports Arena" },
      { path: "/contact", label: "Contact" },
    ],
    [],
  )
  const update = (path: string, key: "title" | "description", value: string) =>
    setSeo({
      ...seo,
      [path]: {
        title: seo[path]?.title || "",
        description: seo[path]?.description || "",
        [key]: value,
      },
    })
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_.5fr]">
        <div>
          <p className="eyebrow">Search visibility</p>
          <h2 className="mt-4 font-display text-3xl font-semibold">
            SEO titles & descriptions
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            Edit how core pages are described to search engines. Keep titles
            under 60 characters and descriptions close to 155.
          </p>
        </div>
        <div className="rounded-2xl bg-[#e9f4f2] p-5 text-sm leading-6 text-slate-600">
          <strong className="text-navy">Primary keyword focus</strong>
          <br />
          Best CBSE school in Mathura, school admission in Mathura, schools
          serving Mathura and Vrindavan.
        </div>
      </div>
      <div className="mt-8 space-y-5">
        {routes.map((route) => (
          <div
            key={route.path}
            className="rounded-2xl border border-slate-200 p-5"
          >
            <div className="flex items-center justify-between">
              <strong>{route.label}</strong>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500">
                {route.path}
              </span>
            </div>
            <label className="mt-4 block text-xs font-semibold text-slate-500">
              Page title{" "}
              <span className="float-right">
                {(seo[route.path]?.title || "").length}/60
              </span>
              <input
                className="field mt-2"
                maxLength={70}
                value={seo[route.path]?.title || ""}
                onChange={(event) =>
                  update(route.path, "title", event.target.value)
                }
              />
            </label>
            <label className="mt-4 block text-xs font-semibold text-slate-500">
              Meta description{" "}
              <span className="float-right">
                {(seo[route.path]?.description || "").length}/160
              </span>
              <textarea
                rows={3}
                className="field mt-2 !h-auto resize-y"
                maxLength={180}
                value={seo[route.path]?.description || ""}
                onChange={(event) =>
                  update(route.path, "description", event.target.value)
                }
              />
            </label>
          </div>
        ))}
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={onSave}
        className="button button-primary mt-7 disabled:opacity-60"
      >
        Save SEO settings <Icon name="check" size={17} />
      </button>
    </section>
  )
}

function AdminAccounts({
  data,
  refresh,
  setFeedback,
}: {
  data: DashboardData | null
  refresh: () => Promise<void>
  setFeedback: (value: string) => void
}) {
  const [form, setForm] = useState({
    displayName: "",
    username: "",
    password: "",
  })
  const [passwords, setPasswords] = useState<Record<string, string>>({})
  const [working, setWorking] = useState("")
  const canManage = Boolean(data?.session.canManageAdmins)

  const create = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setWorking("create")
    setFeedback("")
    try {
      const result = await api<{ message: string }>("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(form),
      })
      setForm({ displayName: "", username: "", password: "" })
      setFeedback(result.message)
      await refresh()
    } catch (caughtError) {
      setFeedback(
        caughtError instanceof Error
          ? caughtError.message
          : "Login creation failed.",
      )
    } finally {
      setWorking("")
    }
  }

  const update = async (
    account: AdminUser,
    changes: { active?: boolean, password?: string },
  ) => {
    setWorking(account.id)
    setFeedback("")
    try {
      const result = await api<{ message: string }>(
        `/api/admin/users/${account.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(changes),
        },
      )
      setPasswords({ ...passwords, [account.id]: "" })
      setFeedback(result.message)
      await refresh()
    } catch (caughtError) {
      setFeedback(
        caughtError instanceof Error
          ? caughtError.message
          : "Account update failed.",
      )
    } finally {
      setWorking("")
    }
  }

  const remove = async (account: AdminUser) => {
    if (
      !window.confirm(
        `Remove the login for ${account.displayName}? This cannot be undone.`,
      )
    )
      return
    setWorking(account.id)
    setFeedback("")
    try {
      const result = await api<{ message: string }>(
        `/api/admin/users/${account.id}`,
        {
          method: "DELETE",
        },
      )
      setFeedback(result.message)
      await refresh()
    } catch (caughtError) {
      setFeedback(
        caughtError instanceof Error
          ? caughtError.message
          : "Account removal failed.",
      )
    } finally {
      setWorking("")
    }
  }

  return (
    <section className="grid gap-7 xl:grid-cols-[.72fr_1.28fr]">
      <form
        onSubmit={create}
        className="h-fit rounded-3xl bg-navy p-7 text-white"
      >
        <p className="eyebrow eyebrow-light">Secure access</p>
        <h2 className="mt-4 font-display text-3xl font-semibold">
          Add an administrator
        </h2>
        <p className="mt-3 text-sm leading-7 text-white/55">
          Create a separate login for each authorised staff member. Every
          additional login has full website editing access.
        </p>
        {!canManage && (
          <p className="mt-6 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-white/70">
            Only the primary administrator can create, disable or remove login
            accounts.
          </p>
        )}
        <fieldset
          disabled={!canManage || working === "create"}
          className="mt-6 space-y-4 disabled:opacity-50"
        >
          <label className="block text-xs font-semibold text-white/70">
            Administrator name
            <input
              required
              className="field mt-2 !border-white/15 !bg-white/10 !text-white placeholder:!text-white/30"
              value={form.displayName}
              onChange={(event) =>
                setForm({ ...form, displayName: event.target.value })
              }
              placeholder="e.g. Admissions Office"
            />
          </label>
          <label className="block text-xs font-semibold text-white/70">
            Login ID
            <input
              required
              minLength={3}
              pattern="[A-Za-z0-9._-]+"
              autoComplete="off"
              className="field mt-2 !border-white/15 !bg-white/10 !text-white placeholder:!text-white/30"
              value={form.username}
              onChange={(event) =>
                setForm({ ...form, username: event.target.value })
              }
              placeholder="e.g. admissions.admin"
            />
          </label>
          <label className="block text-xs font-semibold text-white/70">
            Temporary password
            <input
              required
              minLength={12}
              type="password"
              autoComplete="new-password"
              className="field mt-2 !border-white/15 !bg-white/10 !text-white placeholder:!text-white/30"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              placeholder="At least 12 characters"
            />
          </label>
          <button
            type="submit"
            className="button button-gold w-full disabled:cursor-wait"
          >
            {working === "create" ? "Creating login…" : "Create login"}
            <Icon name="users" size={17} />
          </button>
        </fieldset>
      </form>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold">
              Administrator logins
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Signed in as <strong>{data?.session.username}</strong>
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {data?.admins.length || 0} accounts
          </span>
        </div>
        <div className="mt-7 space-y-4">
          {data?.admins.map((account) => {
            const active = Boolean(account.active)
            const password = passwords[account.id] || ""
            return (
              <article
                key={account.id}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <div className="flex flex-wrap items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e9f4f2] font-display text-lg font-semibold text-teal">
                    {(account.displayName || account.username)
                      .slice(0, 1)
                      .toUpperCase()}
                  </span>
                  <div>
                    <strong className="block">{account.displayName}</strong>
                    <span className="text-xs text-slate-400">
                      {account.username}
                    </span>
                  </div>
                  <span
                    className={`ml-auto rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                      active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {account.role === "owner"
                      ? "Primary"
                      : active
                        ? "Active"
                        : "Disabled"}
                  </span>
                </div>
                <p className="mt-4 text-xs text-slate-400">
                  {account.role === "owner"
                    ? "Permanent primary login"
                    : account.lastLoginAt
                      ? `Last login ${new Date(account.lastLoginAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}`
                      : "This account has not signed in yet."}
                </p>
                {account.managed && canManage && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        type="password"
                        minLength={12}
                        autoComplete="new-password"
                        className="field !h-10 flex-1 !py-2 text-sm"
                        value={password}
                        onChange={(event) =>
                          setPasswords({
                            ...passwords,
                            [account.id]: event.target.value,
                          })
                        }
                        placeholder="New password (12+ characters)"
                      />
                      <button
                        type="button"
                        disabled={
                          working === account.id || password.length < 12
                        }
                        onClick={() => update(account, { password })}
                        className="button button-outline !min-h-10 !px-4 !py-2 disabled:opacity-40"
                      >
                        Reset password
                      </button>
                    </div>
                    <div className="mt-3 flex gap-4">
                      <button
                        type="button"
                        disabled={working === account.id}
                        onClick={() => update(account, { active: !active })}
                        className="text-xs font-bold text-blue disabled:opacity-40"
                      >
                        {active ? "Disable login" : "Enable login"}
                      </button>
                      <button
                        type="button"
                        disabled={working === account.id}
                        onClick={() => remove(account)}
                        className="text-xs font-bold text-red-500 disabled:opacity-40"
                      >
                        Remove login
                      </button>
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function SecurityPanel({
  onSignedOut,
  setFeedback,
}: {
  onSignedOut: () => void
  setFeedback: (value: string) => void
}) {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) {
      setFeedback("New passwords do not match.")
      return
    }
    try {
      const result = await api<{ message: string }>(
        "/api/admin/change-password",
        {
          method: "POST",
          body: JSON.stringify({
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword,
          }),
        },
      )
      setFeedback(result.message)
      onSignedOut()
    } catch (caughtError) {
      setFeedback(
        caughtError instanceof Error
          ? caughtError.message
          : "Password update failed.",
      )
    }
  }
  return (
    <section className="grid gap-7 lg:grid-cols-[1fr_.55fr]">
      <form
        onSubmit={submit}
        className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"
      >
        <p className="eyebrow">Administrator security</p>
        <h2 className="mt-4 font-display text-3xl font-semibold">
          Change password
        </h2>
        <div className="mt-7 space-y-5">
          <label className="block text-sm font-semibold">
            Current password
            <input
              required
              type="password"
              autoComplete="current-password"
              className="field mt-2"
              value={passwords.currentPassword}
              onChange={(event) =>
                setPasswords({
                  ...passwords,
                  currentPassword: event.target.value,
                })
              }
            />
          </label>
          <label className="block text-sm font-semibold">
            New password
            <input
              required
              minLength={12}
              type="password"
              autoComplete="new-password"
              className="field mt-2"
              value={passwords.newPassword}
              onChange={(event) =>
                setPasswords({ ...passwords, newPassword: event.target.value })
              }
            />
          </label>
          <label className="block text-sm font-semibold">
            Confirm new password
            <input
              required
              minLength={12}
              type="password"
              autoComplete="new-password"
              className="field mt-2"
              value={passwords.confirmPassword}
              onChange={(event) =>
                setPasswords({
                  ...passwords,
                  confirmPassword: event.target.value,
                })
              }
            />
          </label>
        </div>
        <button type="submit" className="button button-primary mt-7">
          Update password <Icon name="shield" size={17} />
        </button>
      </form>
      <aside className="rounded-3xl bg-navy p-7 text-white">
        <Icon name="shield" className="text-gold" size={34} />
        <h3 className="mt-5 font-display text-2xl font-semibold">
          Security safeguards
        </h3>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-white/60">
          <li>Encrypted password hashing</li>
          <li>HTTP-only secure sessions</li>
          <li>Login attempt throttling</li>
          <li>Same-origin write protection</li>
          <li>Private admin audit trail</li>
        </ul>
      </aside>
    </section>
  )
}
