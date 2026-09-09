import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

export type SiteLanguage = "en" | "hi"

const hindi: Record<string, string> = {
  About: "हमारे बारे में",
  Academics: "शिक्षा",
  "Little Winner": "लिटिल विनर",
  Campus: "परिसर",
  "Talent Academy": "टैलेंट अकादमी",
  "Sports Arena": "स्पोर्ट्स एरीना",
  Admissions: "प्रवेश",
  Achievements: "उपलब्धियाँ",
  Gallery: "गैलरी",
  Contact: "संपर्क",
  Login: "लॉगिन",
  "Pay online fee": "ऑनलाइन फीस जमा करें",
  "Book a visit": "परिसर भ्रमण बुक करें",
  "Book Talent Academy coaching": "टैलेंट अकादमी कोचिंग बुक करें",
  "Indian Soch, International Approach": "भारतीय सोच, अंतरराष्ट्रीय दृष्टिकोण",
  "Mathura's 1st school with Modern Vedic Curriculum":
    "आधुनिक वैदिक पाठ्यक्रम वाला मथुरा का पहला स्कूल",
  "A leading CBSE school in Mathura.": "मथुरा का एक अग्रणी सीबीएसई विद्यालय।",
  "Rooted in Indian values.": "भारतीय मूल्यों से जुड़ा।",
  "A modern gurukul serving Mathura and Vrindavan, where strong CBSE academics, Indian values, creative expression and physical confidence shape the whole child.":
    "मथुरा और वृंदावन के लिए एक आधुनिक गुरुकुल, जहाँ उत्कृष्ट सीबीएसई शिक्षा, भारतीय मूल्य, रचनात्मक अभिव्यक्ति और शारीरिक आत्मविश्वास बच्चे का सर्वांगीण विकास करते हैं।",
  "Admissions 2026–27": "प्रवेश 2026–27",
  "Explore learning": "शिक्षा देखें",
  "Admission enquiry": "प्रवेश पूछताछ",
  "Book a campus visit": "परिसर भ्रमण बुक करें",
  "Senior or junior wing": "सीनियर या जूनियर विंग",
  "Join Talent Academy": "टैलेंट अकादमी से जुड़ें",
  "View coaching batches": "कोचिंग बैच देखें",
  "Explore Sports Arena": "स्पोर्ट्स एरीना देखें",
  "Courts, pool & play": "कोर्ट, पूल और खेल",
  "School ideology": "विद्यालय की विचारधारा",
  "Why families choose Sanskar among schools in Mathura.":
    "मथुरा के विद्यालयों में परिवार संस्कार को क्यों चुनते हैं।",
  "Understand our philosophy": "हमारी विचारधारा समझें",
  "Upcoming programmes": "आगामी कार्यक्रम",
  "Plan ahead for the moments that bring our community together.":
    "हमारे समुदाय को साथ लाने वाले अवसरों के लिए पहले से तैयारी करें।",
  "What's going on": "अभी क्या चल रहा है",
  "A live view of learning, practice and activity across campus.":
    "परिसर में चल रही पढ़ाई, अभ्यास और गतिविधियों की झलक।",
  "Parent voices": "अभिभावकों की आवाज़",
  "What families notice.": "परिवार क्या अनुभव करते हैं।",
  "Real confidence is built through a partnership between school and home.":
    "सच्चा आत्मविश्वास विद्यालय और घर की साझेदारी से बनता है।",
  "Sanskar parent testimonial": "संस्कार अभिभावक अनुभव",
  "Everything under one gate": "एक ही परिसर में सब कुछ",
  "Education is larger than a classroom.": "शिक्षा कक्षा से कहीं अधिक है।",
  "From first discoveries to future decisions.":
    "पहली खोज से भविष्य के निर्णयों तक।",
  "A school is best understood in motion.":
    "विद्यालय को उसकी सक्रियता में सबसे अच्छी तरह समझा जा सकता है।",
  "A CBSE school for every stage of the journey.":
    "सीखने की यात्रा के हर चरण के लिए एक सीबीएसई विद्यालय।",
  "Come for the campus. Stay for the learning culture.":
    "परिसर देखने आएँ, सीखने की संस्कृति से जुड़ें।",
  "Discover more": "और जानें",
  "Life at Sanskar": "संस्कार में जीवन",
  "Open gallery": "गैलरी खोलें",
  "Ready to play?": "खेलने के लिए तैयार हैं?",
  "Book your arena session.": "अपना एरीना सत्र बुक करें।",
  "Book on Kourts": "Kourts पर बुक करें",
  "Explore coaching": "कोचिंग देखें",
  "Arena bookings": "एरीना बुकिंग",
  "Book, play and move": "बुक करें, खेलें और सक्रिय रहें",
  "Sanskar Sports Arena": "संस्कार स्पोर्ट्स एरीना",
  "One arena, many ways to move": "एक एरीना, सक्रिय रहने के अनेक तरीके",
  "Play casually. Practise regularly. Grow confidently.":
    "मन से खेलें। नियमित अभ्यास करें। आत्मविश्वास से आगे बढ़ें।",
  "Inside the arena": "एरीना के भीतर",
  "Choose how you want to move.": "अपनी पसंद की गतिविधि चुनें।",
  "Casual book & play": "आसान बुकिंग और खेल",
  "Structured monthly coaching": "सुव्यवस्थित मासिक कोचिंग",
  "Visit Sanskar": "संस्कार आएँ",
  Explore: "देखें",
  "For families": "परिवारों के लिए",
  "Notices & downloads": "सूचनाएँ और डाउनलोड",
  "Contact & directions": "संपर्क और दिशा",
  "Call the school": "विद्यालय को कॉल करें",
  "Senior Secondary": "सीनियर सेकेंडरी",
  "Return home": "मुखपृष्ठ पर लौटें",
  "Page not found": "पृष्ठ नहीं मिला",
  WhatsApp: "व्हाट्सऐप",
}

type LanguageContextValue = {
  language: SiteLanguage
  setLanguage: (language: SiteLanguage) => void
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  setLanguage: () => undefined,
})

function translatedValue(value: string) {
  const trimmed = value.trim()
  const translation = hindi[trimmed]
  if (!translation) return value
  const leading = value.match(/^\s*/)?.[0] ?? ""
  const trailing = value.match(/\s*$/)?.[0] ?? ""
  return `${leading}${translation}${trailing}`
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SiteLanguage>("en")
  const originals = useRef(new WeakMap<Text, string>())

  useEffect(() => {
    const applyText = (node: Text) => {
      const current = node.nodeValue ?? ""
      let source = originals.current.get(node)
      if (
        source === undefined ||
        (current !== source && current !== translatedValue(source))
      ) {
        source = current
        originals.current.set(node, current)
      }
      const next = language === "hi" ? translatedValue(source) : source
      if (current !== next) node.nodeValue = next
    }

    const translateTree = (root: Node) => {
      if (root.nodeType === Node.TEXT_NODE) {
        applyText(root as Text)
        return
      }
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      let node = walker.nextNode()
      while (node) {
        applyText(node as Text)
        node = walker.nextNode()
      }
    }

    document.documentElement.lang = language === "hi" ? "hi-IN" : "en-IN"
    translateTree(document.body)

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") translateTree(mutation.target)
        for (const node of mutation.addedNodes) translateTree(node)
      }
    })
    observer.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true,
    })
    return () => observer.disconnect()
  }, [language])

  const setLanguage = (next: SiteLanguage) => {
    setLanguageState(next)
  }

  const value = useMemo(() => ({ language, setLanguage }), [language])
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
