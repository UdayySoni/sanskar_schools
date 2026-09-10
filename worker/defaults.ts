import pageSeo from "../seo.config.json"
export const DEFAULT_SETTINGS = {
  announcement: "Admissions open · Academic Session 2026–27",
  tagline: "Indian Soch, International Approach",
  themeLine: "Mathura's 1st school with Modern Vedic Curriculum",
  heroOptionalLine: "",
  heroTitle: "A leading CBSE school in Mathura.",
  heroAccent: "Rooted in Indian values.",
  heroCopy:
    "A modern gurukul serving Mathura and Vrindavan, where strong CBSE academics, Indian values, creative expression and physical confidence shape the whole child.",
  heroImage: "/optimized/building01.jpg",
  primaryPhone: "75359 38481",
  secondaryPhone: "90125 39208",
  email: "sanskarschool2009@gmail.com",
  address: "Industrial Area, Site-A, Maholi Road, Mathura, Uttar Pradesh 281004",
}

export const DEFAULT_NOTICES = [
  {
    id: "mandatory-disclosure-2025",
    date: "12 Mar 2025",
    title: "Mandatory Disclosure",
    href: "/documents/1769165076_d94655f98a2cec90c941.pdf",
    type: "Disclosure",
  },
  {
    id: "school-timing-2025",
    date: "21 Apr 2025",
    title: "School Timing",
    href: "/documents/1745217612_36ee5cfd7e7d709ddacf.pdf",
    type: "Circular",
  },
  {
    id: "school-rules-2025",
    date: "21 Apr 2025",
    title: "School Rules",
    href: "/documents/1745216580_5939accf3c598ef36729.pdf",
    type: "Circular",
  },
  {
    id: "admission-process-2025",
    date: "01 Feb 2025",
    title: "Admission Process",
    href: "/documents/1738386636_5c0e745eb12ad7c98bfc.pdf",
    type: "Admissions",
  },
  {
    id: "admission-norms-2025",
    date: "01 Feb 2025",
    title: "Admission Norms",
    href: "/documents/1738386617_073722ceed54f5f1fd93.pdf",
    type: "Admissions",
  },
  {
    id: "exam-pattern-2025",
    date: "01 Feb 2025",
    title: "Exam Pattern",
    href: "/documents/1738386581_8e00539aed684a15da3d.pdf",
    type: "Academics",
  },
]

export const DEFAULT_PROGRAMMES = [
  {
    id: "admissions-2026",
    title: "Admissions counselling 2026–27",
    date: "Open now",
    label: "Admissions",
    summary:
      "Meet the admissions team, understand the learning journey and plan a guided campus visit.",
    image: "/optimized/building01.jpg",
    href: "/admissions#enquiry",
  },
  {
    id: "talent-academy-batches",
    title: "Talent Academy skill batches",
    date: "New batches this term",
    label: "Sports coaching",
    summary:
      "Progressive coaching opportunities in badminton, basketball, swimming, skating and taekwondo.",
    image: "/optimized/talent-academy-training.jpg",
    href: "/talent-academy",
  },
  {
    id: "campus-visit",
    title: "Parent campus experience",
    date: "By appointment",
    label: "School community",
    summary:
      "See classrooms, laboratories, creative spaces and the values-led learning environment in action.",
    image: "/optimized/gallery-campus-slide-3.jpg",
    href: "/contact",
  },
]

export const DEFAULT_HAPPENINGS = [
  {
    id: "vedic-maths",
    title: "Vedic mathematics in practice",
    date: "Happening this week",
    label: "Modern Vedic curriculum",
    summary:
      "Learners are strengthening number sense, speed and confidence through guided Vedic mathematics activities.",
    image: "/optimized/live-vedic-maths.jpg",
    href: "/academics",
  },
  {
    id: "robotics-projects",
    title: "Robotics and AI projects",
    date: "Across the labs",
    label: "Future-ready learning",
    summary:
      "Student teams are moving from ideas to working models through coding, robotics and hands-on collaboration.",
    image: "/optimized/live-robotics.jpg",
    href: "/gallery",
  },
  {
    id: "sports-practice",
    title: "Inter-house sports practice",
    date: "On campus now",
    label: "Physical confidence",
    summary:
      "Regular practice is building movement skills, teamwork and the confidence to compete with character.",
    image: "/optimized/live-outdoor-sports.jpg",
    href: "/sports-arena",
  },
]

export const DEFAULT_TESTIMONIALS = [
  {
    id: "shiv-shankar",
    name: "Shiv Shankar",
    quote:
      "The school works on every aspect of my child—academics, Vedic maths, activities and, most importantly, Sanskar. The transformation is wonderful to see.",
    image: "https://sanskarschools.com/images/testimonial/t1.png",
  },
  {
    id: "mandita-rana",
    name: "Mandita Rana",
    quote:
      "My child has made significant progress at Sanskar. The teaching approach feels thoughtful, structured and genuinely supportive.",
    image: "https://sanskarschools.com/images/testimonial/t4.png",
  },
  {
    id: "rakesh",
    name: "Rakesh",
    quote:
      "The well-rounded curriculum, dedicated faculty and innovative approach create a stimulating environment that prepares students for success.",
    image: "https://sanskarschools.com/images/testimonial/t5.png",
  },
  {
    id: "antriksh-singh",
    name: "Antriksh Singh",
    quote:
      "The school encourages children to think creatively and gives them many opportunities to excel in their areas of interest.",
    image: "https://sanskarschools.com/images/testimonial/t11.png",
  },
]

export const DEFAULT_SPORTS_ARENA = {
  eyebrow: "Book, play and move",
  title: "Sanskar Sports Arena",
  introduction:
    "A multi-sport destination in Mathura for casual play, active families and school-day physical development—with courts, grounds, skating and swimming in one connected environment.",
  image: "/optimized/sports_arena.jpg",
  bookingUrl: "https://kourts.in",
  bookingLabel: "Book on Kourts",
  highlights: [
    "Indoor badminton courts",
    "Basketball and pickleball",
    "Table tennis and chess",
    "Box cricket and outdoor play",
    "Skating practice space",
    "Swimming pool access",
  ],
}

export const DEFAULT_SEO = pageSeo

export const PUBLIC_CONTENT_DEFAULTS = {
  settings: DEFAULT_SETTINGS,
  notices: DEFAULT_NOTICES,
  programmes: DEFAULT_PROGRAMMES,
  happenings: DEFAULT_HAPPENINGS,
  testimonials: DEFAULT_TESTIMONIALS,
  sportsArena: DEFAULT_SPORTS_ARENA,
  seo: DEFAULT_SEO,
}
