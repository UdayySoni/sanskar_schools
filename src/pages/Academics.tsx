import Image from "../components/Image"
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { usePageMeta } from "../hooks/usePageMeta";

const clubs = [
  { name: "AI & emerging tech", image: "/optimized/ai.jpg", copy: "Age-appropriate exposure to the ideas shaping tomorrow." },
  { name: "Robotics", image: "/optimized/robotics.jpg", copy: "Build, test and improve through hands-on problem-solving." },
  { name: "Science", image: "/optimized/science.jpg", copy: "Inquiry, observation and experiments beyond the textbook." },
  { name: "Literary", image: "/optimized/literary.jpg", copy: "Reading, writing, debate and confident communication." },
  { name: "Art & craft", image: "/optimized/art-and-craft.jpg", copy: "Creative expression using technique, imagination and reuse." },
  { name: "Music & dance", image: "/optimized/music.jpg", copy: "Rhythm, performance and collaborative expression." },
];

export default function Academics() {
  usePageMeta({
    title: "Academics at Sanskar Public School | CBSE School Mathura",
    description: "Explore CBSE academics at Sanskar Public School Mathura, including Science, Commerce and Humanities, values education, life skills, English, AI, robotics and clubs.",
    keywords: "CBSE academics Mathura, Science Commerce Humanities school Mathura, robotics school Mathura, Vedic maths school Mathura, best academics school Mathura",
    path: "/academics",
    image: "/optimized/class_01.jpg",
  });

  return (
    <div className="bg-cream">
      <PageHero eyebrow="Academics" title="Strong foundations. Wider horizons." description="A CBSE education that gives students subject depth, communication skills, values and regular opportunities to apply what they learn." image="/optimized/class_01.jpg" imageAlt="Students focused on classroom learning at Sanskar Public School" action={{ label: "Start an admission enquiry", to: "/admissions#enquiry" }} />

      <section className="py-20 lg:py-28"><div className="container grid items-start gap-12 lg:grid-cols-[.9fr_1.1fr]"><Reveal><p className="eyebrow">Our learning approach</p><h2 className="section-title mt-4">Academic rigour with a sense of purpose.</h2></Reveal><Reveal delay={80}><p className="section-copy">Sanskar’s curriculum follows CBSE expectations while making space for the habits that sustain achievement: attention, inquiry, clear communication, ethical judgement and consistent practice.</p><p className="section-copy mt-4">Classroom learning is supported by laboratories, digital resources, Vedic mathematics, spoken English, activities and teacher guidance. The goal is not only to complete a syllabus, but to help students understand, retain and use what they know.</p></Reveal></div></section>

      <section className="bg-white py-20 lg:py-28"><div className="container"><Reveal className="grid items-end gap-8 lg:grid-cols-2"><div><p className="eyebrow eyebrow-teal">A balanced rhythm</p><h2 className="section-title mt-4">Foundation and exploration belong together.</h2></div><p className="section-copy">Across the school week, academic learning is complemented by structured opportunities in life skills, values, communication, technology, creativity and sport.</p></Reveal><div className="mt-12 grid gap-5 md:grid-cols-3">{[{icon:'book' as const,title:'Core learning',copy:'Concept clarity, regular practice and appropriate assessment across CBSE subjects.'},{icon:'users' as const,title:'Foundation skills',copy:'Spoken English, values education and practical readiness for everyday life.'},{icon:'spark' as const,title:'Clubs & discovery',copy:'Creative, technical and physical interests explored with guidance and purpose.'}].map((item,index)=><Reveal key={item.title} delay={index*80} className="card interactive-card p-8"><span className="icon-box"><Icon name={item.icon}/></span><h3 className="mt-6 font-display text-2xl font-semibold text-navy">{item.title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{item.copy}</p></Reveal>)}</div></div></section>

      <section className="py-20 lg:py-28"><div className="container"><Reveal className="text-center"><p className="eyebrow">Co-curricular learning</p><h2 className="section-title mt-4">Interests become abilities through doing.</h2><p className="section-copy mx-auto mt-5 max-w-2xl">Clubs create a practical space to experiment, collaborate, perform and build confidence beyond written work.</p></Reveal><div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{clubs.map((club,index)=><Reveal key={club.name} delay={(index%3)*70} className="card interactive-card overflow-hidden"><div className="aspect-[16/10] overflow-hidden bg-slate-100"><Image src={club.image} alt={`${club.name} activity at Sanskar Public School Mathura`} className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.04]"/></div><div className="p-6"><h3 className="font-display text-2xl font-semibold text-navy">{club.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{club.copy}</p></div></Reveal>)}</div><Reveal className="mt-7 rounded-3xl border border-navy/10 bg-[#e9f4f2] p-6 text-center text-sm leading-7 text-slate-600">The wider co-curricular programme also includes social media awareness, eco learning and sports. Activities and availability may vary by grade and academic term.</Reveal></div></section>

      <section className="bg-navy-deep py-20 text-white lg:py-28"><div className="container grid items-center gap-12 lg:grid-cols-2"><Reveal><p className="eyebrow eyebrow-light">Senior Secondary</p><h2 className="mt-4 font-display text-5xl font-semibold leading-[1.04]">Three pathways for the next chapter.</h2><p className="mt-5 max-w-xl leading-8 text-white/65">At the Senior Secondary level, Sanskar Public School is affiliated for the three major streams, helping learners choose a route aligned with their aptitudes and future plans.</p><Link to="/admissions#enquiry" className="button button-gold mt-8">Discuss Grade XI admission <Icon name="arrow"/></Link></Reveal><div className="space-y-4">{[['Science','For learners drawn to scientific inquiry, mathematics, technology and related professional pathways.'],['Commerce','For learners interested in business, economics, finance, entrepreneurship and management.'],['Humanities','For learners exploring society, languages, human behaviour, culture and public life.']].map(([title,copy],index)=><Reveal key={title} delay={index*70} className="flex gap-5 rounded-3xl border border-white/10 bg-white/[.05] p-6"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold font-display text-xl font-semibold text-navy">{index+1}</span><div><h3 className="font-display text-2xl font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/55">{copy}</p></div></Reveal>)}</div></div></section>

      <section className="py-20"><Reveal className="container flex flex-col items-start gap-7 rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(8,43,79,.07)] lg:flex-row lg:items-center lg:justify-between sm:p-12"><div><p className="eyebrow">Questions about curriculum?</p><h2 className="mt-3 font-display text-4xl font-semibold text-navy">Speak with our admissions team.</h2></div><a href="tel:+917535938481" className="button button-primary shrink-0"><Icon name="phone" size={17}/>Call 75359 38481</a></Reveal></section>
    </div>
  );
}
