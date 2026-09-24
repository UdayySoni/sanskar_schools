import { useLanguage } from "../context/Language"

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="relative shrink-0">
      <div
        className="flex rounded-full border border-navy/15 bg-slate-100 p-1 text-xs font-bold shadow-sm"
        role="group"
        aria-label="Choose website language"
      >
        <button
          type="button"
          onClick={() => setLanguage("en")}
          aria-pressed={language === "en"}
          className={`rounded-full px-2.5 py-1.5 transition sm:px-3 ${
            language === "en"
              ? "bg-navy text-white shadow"
              : "text-slate-500 hover:text-navy"
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLanguage("hi")}
          aria-pressed={language === "hi"}
          className={`rounded-full px-2.5 py-1.5 transition sm:px-3 ${
            language === "hi"
              ? "bg-navy text-white shadow"
              : "text-slate-500 hover:text-navy"
          }`}
        >
          हिन्दी
        </button>
      </div>
    </div>
  )
}
