import Image from "../components/Image"
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { usePageMeta } from "../hooks/usePageMeta";

const values = [
  { icon: "heart" as const, title: "Character", copy: "Knowledge becomes meaningful when it is guided by empathy, integrity and respect." },
  { icon: "brain" as const, title: "Curiosity", copy: "Students learn to ask, investigate, connect ideas and think beyond the expected answer." },
  { icon: "target" as const, title: "Excellence", copy: "High expectations are paired with patient guidance, practice and honest feedback." },
  { icon: "users" as const, title: "Belonging", copy: "Every learner deserves to be known, included and encouraged to contribute." },
];

export default function About() {
  usePageMeta({
    title: "About Sanskar Public School Mathura | Vision & Values",
    description: "Learn about Sanskar Public School Mathura, its modern-gurukul philosophy, CBSE Senior Secondary education, 10-acre campus, vision, mission and values.",
    keywords: "about Sanskar Public School Mathura, school vision Mathura, CBSE school Maholi Road, holistic school Mathura",
    path: "/about",
    image: "/optimized/building01.jpg",
  });

  return (
    <div className="bg-cream">
      <PageHero eyebrow="About Sanskar" title="A modern school with a deeply human purpose." description="Since the Sanskar journey began in 2009, one belief has guided us: education should prepare children for the world without disconnecting them from values, identity and community." image="/optimized/building01.jpg" imageAlt="Front view of Sanskar Public School in Mathura" action={{ label: "Plan a visit", to: "/admissions#enquiry" }} />

      <section className="py-20 lg:py-28"><div className="container grid items-center gap-14 lg:grid-cols-2"><Reveal><p className="eyebrow">Our story</p><h2 className="section-title mt-4">From a seed in 2009 to a complete learning ecosystem.</h2><p className="section-copy mt-6">Sanskar began with an early-years vision and grew into a CBSE-affiliated Senior Secondary School serving families across Mathura. The school now supports learners through foundational education, senior-school pathways, co-curricular clubs, sports infrastructure and focused talent coaching.</p><p className="section-copy mt-4">The growth matters, but the purpose has remained constant: to create confident, capable young people who carry knowledge with humility and ambition with responsibility.</p></Reveal><Reveal delay={100} className="relative"><div className="image-zoom overflow-hidden rounded-[2rem]"><Image src="/optimized/class_01.jpg" alt="Students studying at Sanskar Public School Mathura" className="h-[560px] w-full object-cover"/></div><div className="absolute -bottom-7 -left-3 max-w-[260px] rounded-3xl bg-gold p-6 text-navy shadow-2xl sm:-left-7"><strong className="font-display text-4xl">10 acres</strong><p className="mt-1 text-sm font-semibold leading-6">A learning campus in the heart of Mathura.</p></div></Reveal></div></section>

      <section className="bg-white py-20 lg:py-28"><div className="container"><Reveal className="grid gap-8 lg:grid-cols-2"><div className="rounded-[2rem] bg-navy p-8 text-white sm:p-12"><span className="icon-box !bg-white/10 !text-gold"><Icon name="compass"/></span><p className="mt-7 text-xs font-bold uppercase tracking-[.15em] text-gold">Our vision</p><h2 className="mt-3 font-display text-4xl font-semibold">Lifelong learners, rooted and ready.</h2><p className="mt-5 leading-8 text-white/65">To nurture a community in which every child reaches their potential, develops a love of learning and grows with respect for self, others and the values that hold society together.</p></div><div className="rounded-[2rem] bg-[#e9f4f2] p-8 sm:p-12"><span className="icon-box !bg-white"><Icon name="target"/></span><p className="mt-7 text-xs font-bold uppercase tracking-[.15em] text-teal">Our mission</p><h2 className="mt-3 font-display text-4xl font-semibold text-navy">Best practice with personal attention.</h2><p className="mt-5 leading-8 text-slate-600">To combine a streamlined CBSE curriculum with open-minded teaching, co-curricular opportunity and close school-family partnership so students can pursue fulfilling futures with confidence.</p></div></Reveal></div></section>

      <section className="py-20 lg:py-28"><div className="container"><Reveal className="text-center"><p className="eyebrow">What we stand for</p><h2 className="section-title mt-4">Values that show up every day.</h2></Reveal><div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{values.map((value,index)=><Reveal key={value.title} delay={index*70} className="card interactive-card p-7"><span className="icon-box"><Icon name={value.icon}/></span><h3 className="mt-6 font-display text-2xl font-semibold text-navy">{value.title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{value.copy}</p></Reveal>)}</div></div></section>

      <section className="overflow-hidden bg-navy-deep text-white"><div className="container grid lg:grid-cols-2"><Reveal className="py-20 pr-0 lg:py-28 lg:pr-16"><p className="eyebrow eyebrow-light">The modern gurukul</p><h2 className="mt-4 font-display text-5xl font-semibold leading-[1.05]">Indian Soch,<br/>International Approach.</h2><p className="mt-6 max-w-xl leading-8 text-white/65">The phrase is more than a tagline. It expresses a balance: students should have the courage, fluency and skills to participate in a global future while remaining grounded in ethics, family and Indian cultural understanding.</p><div className="mt-8 grid grid-cols-3 gap-3">{[['2132432','CBSE affiliation'],['3','Senior streams'],['2009','Journey began']].map(([v,l])=><div key={l} className="rounded-2xl border border-white/10 bg-white/[.05] p-4"><strong className="block font-display text-2xl text-gold">{v}</strong><span className="mt-1 block text-[11px] text-white/50">{l}</span></div>)}</div></Reveal><Reveal delay={100} className="min-h-[520px]"><Image src="/optimized/art-and-craft.jpg" alt="Art and craft activity at Sanskar Public School" className="h-full w-full object-cover"/></Reveal></div></section>

      <section className="py-20 lg:py-24"><Reveal className="container flex flex-col items-start justify-between gap-7 rounded-[2rem] bg-white p-8 shadow-[0_20px_70px_rgba(8,43,79,.08)] sm:p-12 lg:flex-row lg:items-center"><div><p className="eyebrow">See it for yourself</p><h2 className="mt-3 font-display text-4xl font-semibold text-navy">Meet the people and experience the campus.</h2></div><Link to="/admissions#enquiry" className="button button-primary shrink-0">Book a campus visit <Icon name="arrow"/></Link></Reveal></section>
    </div>
  );
}
