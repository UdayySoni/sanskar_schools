export type BlogPost = {
  slug: string
  title: string
  seoTitle: string
  description: string
  category: string
  image: string
  imageAlt: string
  imageCaption?: string
  date: string
  introduction: string
  sections: { id: string; title: string; paragraphs: string[]; checklist?: string[]; source?: { label: string; href: string } }[]
  links: { label: string; href: string }[]
}

const districtSource = { label: "Mathura district school directory", href: "https://mathura.nic.in/public-utility-category/schools/" }
const imageCaption = "AI-generated illustration of school life."

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "reading-habits-primary-children-mathura",
    title: "Building a reading habit: a guide for Mathura parents",
    seoTitle: "Reading Habits for Children in Mathura | Sanskar School",
    description: "Help your primary-school child enjoy reading with a simple weekly routine, Hindi and English story ideas, and questions to ask schools in Mathura.",
    category: "Learning at home",
    image: "/optimized/blog/sanskar-library.webp",
    imageAlt: "Illustration of children sharing books with a teacher in a library",
    imageCaption,
    date: "2026-09-23",
    introduction: "A reading habit can begin with one story and a few unhurried minutes together. For families in Mathura balancing school, travel and homework, the aim is a routine that fits real life. Try these activities with primary-school children, adjusting the book and pace to their interests. These are suggestions for home learning, not a test or a promise of a particular result.",
    sections: [
      { id: "start-small", title: "1. Make a small space for stories", paragraphs: ["Choose a comfortable place and a time your family can usually keep, perhaps after an evening snack. Start with ten minutes if that feels manageable. Let your child pick between two books, and keep a familiar favourite nearby. You do not need a large book collection to begin.", "Read aloud together. If a page feels difficult, take turns or let your child describe the pictures while you read the words. Stop at a natural point while there is still interest; finishing a book is less important than enjoying the time together."] },
      { id: "home-languages", title: "2. Use Hindi and English without making it a translation test", paragraphs: ["Invite your child to talk about a story in the language they feel comfortable using. A conversation in Hindi or the language spoken at home can be followed by a few words from an English story. Ask what happened and why a character made a choice, rather than requiring a translation of every sentence.", "For example, read a story about a market, then ask your child to describe a familiar Mathura shopping trip. Write down three things you saw and let them draw one. Keep the conversation playful, and use the teacher's guidance when choosing books for their current reading level."] },
      { id: "everyday-reading", title: "3. Notice reading in everyday Mathura life", paragraphs: ["On a familiar route, look at shop signs or a list of items you need to buy. At home, read a short recipe together or label a drawing of your neighbourhood. A child who enjoys local stories could ask a grandparent to tell one, then illustrate the beginning, middle and end.", "Let your child's interests guide the activity. A sports fan could read a short match report; a child who enjoys plants could keep a notebook with drawings and labels. The connection to everyday life gives you something specific to discuss after reading."] },
      { id: "weekly-routine", title: "4. Try a flexible five-day reading routine", paragraphs: ["Use this as a starting point and repeat a favourite activity whenever your child asks. If a busy day interrupts the routine, simply return to it the next day."], checklist: ["Monday: choose a story and talk about its cover.", "Tuesday: read a few pages together and predict what happens next.", "Wednesday: draw a favourite scene and add a sentence or label.", "Thursday: retell the story to someone at home.", "Friday: revisit a favourite page and choose the next book."] },
      { id: "teacher-conversation", title: "5. Share observations with the teacher", paragraphs: ["Notice which books your child chooses, what they can retell and where they ask for help. Bring one or two examples to a teacher conversation. Ask for a suitable next book or a classroom activity you can practise together at home.", "Avoid comparing reading speed with siblings or classmates. If a task repeatedly causes frustration, make it shorter and ask the teacher what support would help. A specific observation is more useful than labelling a child a good or weak reader."] },
      { id: "school-visit", title: "What to ask when choosing a school in Mathura", paragraphs: ["When deciding what the best school in Mathura means for your child, look at everyday learning as well as examination results. Ask how often children use the library, whether they can borrow books, how teachers choose reading material and how parents hear about progress.", "If you are using our top 10 schools in Mathura guide, take the same questions to each campus. At Sanskar Public School on Maholi Road, arrange a visit to discuss your child's class and explore the learning spaces. Ask the team about current library access and classroom routines for that grade."], checklist: ["Can we see age-appropriate reading material?", "How do teachers support children at different reading levels?", "What can families do at home without adding excessive homework?", "How will we discuss progress with the class teacher?"] },
    ],
    links: [{ label: "Explore learning at Sanskar", href: "/academics" }, { label: "Compare school options in Mathura", href: "/blog/top-10-schools-in-mathura-shortlist" }, { label: "Plan a Maholi Road campus visit", href: "/contact" }],
  },
  {
    slug: "choosing-best-school-in-mathura",
    title: "Choosing the best school in Mathura for your child",
    seoTitle: "Best School in Mathura? Discover Sanskar Public School",
    description: "Comparing good schools in Mathura? Discover Sanskar Public School: CBSE academics, Indian values, Vedic maths, sports and learning through Class XII.",
    category: "Life at Sanskar",
    image: "/optimized/blog/sanskar-classroom.webp",
    imageAlt: "Illustration of a teacher helping students with a robotics project",
    imageCaption,
    date: "2026-09-13",
    introduction: "At Sanskar Public School, we want children to grow in knowledge, confidence and character. Our approach brings CBSE academics together with Indian values, practical learning and opportunities in sport and the arts. For families looking for the best school in Mathura for their child, here is what makes Sanskar worth a visit.",
    sections: [
      { id: "compare-schools", title: "A practical checklist for comparing schools", paragraphs: ["Start with your child's needs: the class they will enter, subjects they enjoy, areas where they need support and a daily journey your family can manage. Ask each school the same questions and record the answers after a campus visit. A best-school claim alone cannot tell you whether a school is the right fit."], checklist: ["Verify the board and current affiliation using the official record.", "Request the full fee structure, including transport and optional activities.", "Ask how teachers identify learning gaps and communicate progress.", "Visit classrooms, the library and activity spaces used by your child's grade.", "Confirm transport availability for your exact address in Mathura or Vrindavan.", "Discuss admission eligibility, required documents and available places."] },
      { id: "best-school-of-mathura", title: "Looking for the best school of Mathura?", paragraphs: ["We believe a strong education helps a child understand a subject, ask questions and treat others with care. At Sanskar, our focus is on these everyday habits. We invite you to see how our values, academics and activities fit your child's needs."] },
      { id: "learning-at-sanskar", title: "CBSE learning with a clear path ahead", paragraphs: ["Sanskar Public School is a CBSE Senior Secondary school on Maholi Road, Mathura, with affiliation number 2132432. Families can explore a connected learning journey through the school years and discuss Science, Commerce and Humanities options for senior secondary study.", "Our academics page introduces the subjects and learning opportunities available at Sanskar. During a visit, speak to the team about your child's current class, interests and the areas where they need support. We want the conversation to begin with your child."] },
      { id: "indian-values", title: "Indian values in everyday learning", paragraphs: ["Our philosophy is simple: Indian Soch, International Approach. We bring contemporary education together with Sanskar classes, Vedic mathematics, yoga and opportunities for creative expression. Learning should help children make thoughtful choices as well as prepare for examinations.", "When parents compare good schools in Mathura, school culture matters. At Sanskar, values are part of how we describe education: respect, responsibility and the confidence to participate. Explore our school philosophy to understand this approach in more detail."] },
      { id: "practical-learning", title: "Space to explore and ask questions", paragraphs: ["Laboratories, a library and creative spaces give learning a practical side. Our academic programme also introduces opportunities in AI and robotics. These experiences connect classroom ideas with activities that encourage children to investigate and create.", "Visit the campus to see the learning spaces and ask how your child's grade uses them. Our gallery also shares school photographs and videos so you can get a closer look at life at Sanskar."] },
      { id: "sports-and-creativity", title: "Sport and creativity alongside academics", paragraphs: ["Sanskar's facilities include indoor and outdoor sports spaces, a swimming pool and courts. The Talent Academy offers coaching opportunities, while the Sports Arena provides a place for play and practice.", "Ask the team which activities are included in your child's school timetable and which are optional programmes. We encourage families to consider the interests that will help their child enjoy school and participate with confidence."] },
      { id: "board-results", title: "Celebrating our 2025–26 board toppers", paragraphs: ["Our Class X achievers include Shrestha Sharma with 95.2%, Krishna Kumar with 94% and Piyush Kumar Pandey with 93.4%. In Class XII, we celebrate Manoj Kumar with 93.2%, Sneha Chaudhary with 91.8% and Jaidev Goyal with 90.2%.", "Their photographs and percentages appear on our achievements page. We celebrate their effort alongside the many ways students contribute to school life through learning, creativity and participation."] },
      { id: "visit-sanskar", title: "Come and meet us", paragraphs: ["The best way to understand Sanskar is to visit. Our campus is at Industrial Area, Site-A, Maholi Road, Mathura. Bring your questions about academics, admission, fees and the daily school routine.", "Families travelling from Vrindavan or nearby localities can ask about transport for their exact address. Send an admission enquiry and our team can help you plan the next step."] },
    ],
    links: [{ label: "Explore Sanskar academics", href: "/academics" }, { label: "See our campus", href: "/infrastructure" }, { label: "Meet our 2025–26 toppers", href: "/achievements" }, { label: "Book a school visit", href: "/contact" }, { label: "Sanskar's official CBSE affiliation record", href: "https://saras.cbse.gov.in/SARAS/AffiliatedList/AfflicationDetails/2132432" }],
  },
  {
    slug: "top-10-schools-in-mathura-shortlist",
    title: "Top 10 schools in Mathura: Sanskar is our No. 1 choice",
    seoTitle: "Top 10 Schools in Mathura: Sanskar Is Our No. 1 Choice",
    description: "Explore our top 10 schools in Mathura and a quick top 3 shortlist, with Sanskar Public School as our No. 1 editorial choice.",
    category: "Our school picks",
    image: "/optimized/blog/sanskar-library.webp",
    imageAlt: "Illustration of students reading with a teacher in a school library",
    imageCaption,
    date: "2026-09-13",
    introduction: "Sanskar Public School is our No. 1 choice for families seeking CBSE learning with Indian values, sport and creative opportunities. This is our school's own editorial selection of ten schools in Mathura and the surrounding district, not an independent or official ranking. Our first choice reflects the educational approach we believe in; the other entries offer local options for families to explore.",
    sections: [
      { id: "top-3-schools-in-mathura", title: "Top 3 schools in Mathura: our quick shortlist", paragraphs: ["Our first three editorial picks are Sanskar Public School, Rajiv International School and Delhi Public School at Refinery Nagar. Sanskar takes our top spot for the mix of CBSE academics, Indian values, practical learning and sports that we offer. Read about these three and seven more local options below."] },
      { id: "sanskar-public-school", title: "1. Sanskar Public School — our first choice", paragraphs: ["Our Maholi Road campus brings together CBSE academics, Indian values and opportunities beyond the classroom. With a learning journey through Senior Secondary, Sanskar gives families a school community where academic progress, creativity and character can grow together.", "What makes Sanskar our first choice? Our Modern Vedic approach, Vedic mathematics, spoken English, yoga, practical learning and sports reflect our belief in education for the whole child. Families can explore laboratories, creative spaces and sports facilities, as well as the early-years learning offered by Sanskar Li'l Winners.", "Our published 2025–26 board achievers include Shrestha Sharma at 95.2% in Class X and Manoj Kumar at 93.2% in Class XII. See all six toppers on the achievements page, explore our academics and meet the team to discuss your child's next step."], source: { label: "Explore Sanskar Public School", href: "/about" } },
      { id: "rajiv-international", title: "2. Rajiv International School", paragraphs: ["Rajiv International School is on the Mathura–Delhi Road near Chhatikara. Its official website presents CBSE education with kindergarten, junior and senior wings. Families considering this location can contact the school about current admission details."], source: { label: "Rajiv International School website", href: "https://www.risindia.org/" } },
      { id: "delhi-public-school", title: "3. Delhi Public School, Refinery Nagar", paragraphs: ["The Mathura district directory lists Delhi Public School at Refinery Nagar. Check the campus and its current admission process directly when considering the daily journey from your home."], source: districtSource },
      { id: "st-dominics", title: "4. St. Dominic's Senior Secondary School", paragraphs: ["St. Dominic's Senior Secondary School is at Basantar Marg, Mathura Cantt. Its official disclosure lists CBSE affiliation number 2130215. Contact this campus for current class availability and admission information."], source: { label: "St. Dominic's official disclosure", href: "https://stdominicsschool.org/Madatory_Public_Disclosure" } },
      { id: "sacred-heart", title: "5. Sacred Heart Convent Higher Secondary School", paragraphs: ["Sacred Heart Convent Higher Secondary School is in the Moti Kunj area of Mathura. Its website includes kindergarten admission information and Class XI ISC options. Confirm the relevant board and entry requirements for your child's class."], source: { label: "Sacred Heart school website", href: "https://sacredheartmathura.com/" } },
      { id: "ramanlal-shorawala", title: "6. Ramanlal Shorawala Public School", paragraphs: ["The district directory lists Ramanlal Shorawala Public School on Maholi Road, Mathura. Confirm the exact campus when arranging a visit."], source: districtSource },
      { id: "gyandeep", title: "7. Gyandeep Siksha Bharti Senior Secondary School", paragraphs: ["Gyandeep Siksha Bharti is listed in the district directory on Gowardhan Road, Mathura. Ask the school about the classes and subjects available."], source: districtSource },
      { id: "kanha-makhan", title: "8. Kanha Makhan Public School", paragraphs: ["The district directory places Kanha Makhan Public School at Saraswati Kund, Mathura. Check the location and current admission information with the school."], source: districtSource },
      { id: "chandanvan", title: "9. Chandanvan Public School", paragraphs: ["Chandanvan Public School is listed at Chandanvan Colony, NH2, opposite the old RTO office in Mathura. Contact the school for current details."], source: districtSource },
      { id: "jawahar-navodaya", title: "10. Jawahar Navodaya Vidyalaya, Paigaon", paragraphs: ["The district directory lists Jawahar Navodaya Vidyalaya at Paigaon in Mathura district. This is outside the city; check its own eligibility and selection process directly."], source: districtSource },
      { id: "why-visit-sanskar", title: "Start your school visits with Sanskar", paragraphs: ["If you are searching for the best school in Mathura for your family, we invite you to experience Sanskar in person. See the campus, understand our approach and ask about the class and session you need. Our team can explain the available options and help you plan an admission enquiry.", "School details were checked against the linked school websites and district directory in September 2026. Contact each school for current fees, transport, subjects and places before deciding."] },
    ],
    links: [{ label: "Why choose Sanskar?", href: "/blog/choosing-best-school-in-mathura" }, { label: "Explore our facilities", href: "/infrastructure" }, { label: "View Sanskar's board toppers", href: "/achievements" }, { label: "Enquire about admission at Sanskar", href: "/admissions" }],
  },
  {
    slug: "school-admission-mathura-parent-checklist",
    title: "Admission at Sanskar Public School: a simple guide",
    seoTitle: "Sanskar Public School Admission in Mathura | A Simple Guide",
    description: "Plan admission at Sanskar Public School, Mathura. Explore classes, visit our Maholi Road campus and ask our team about documents, fees and transport.",
    category: "Sanskar admissions",
    image: "/optimized/blog/sanskar-admissions.webp",
    imageAlt: "Illustration of a family meeting a school admissions teacher",
    imageCaption,
    date: "2026-09-13",
    introduction: "We look forward to welcoming families to Sanskar Public School in Mathura. Whether your child is starting school, moving to a new class or choosing senior secondary subjects, our admissions team can help you understand the next steps. Here is how to begin.",
    sections: [
      { id: "send-enquiry", title: "1. Tell us about your child", paragraphs: ["Use our online admission enquiry form to share your child's name, the grade you are considering, your preferred wing and your contact details. Include any questions that would help us prepare for your conversation.", "You can also contact the Senior Wing on 75359 38481 or Sanskar Li'l Winners on 90125 39208. Ask about availability for the session and class you need. An enquiry lets us guide you through the process; admission is subject to the school's confirmation."] },
      { id: "campus-visit", title: "2. Visit our Maholi Road campus", paragraphs: ["A campus visit gives you a closer look at Sanskar's learning spaces and school environment. Discuss your child's interests, ask about the academic programme and find out how activities fit into school life.", "Our address is Industrial Area, Site-A, Maholi Road, Mathura, Uttar Pradesh 281004. Arrange a visit with the office and plan the route from your home. If you need transport, share your exact address so the team can confirm availability."] },
      { id: "choose-learning-stage", title: "3. Explore the right learning stage", paragraphs: ["For early-years admission, explore Sanskar Li'l Winners and ask the team about age eligibility, the daily routine and how children settle into school. Share any practical needs or questions you have before your visit.", "For older students, discuss the class and subjects you need. Our senior secondary pathway includes Science, Commerce and Humanities options; the team can confirm the combinations and requirements for your intended session."] },
      { id: "documents-fees", title: "4. Confirm documents and fees", paragraphs: ["Ask the admissions office for the current document checklist for your child's class. Confirm which records are required, when they should be provided and whether originals need to be shown.", "Request a written fee structure and discuss any separate charges for transport or optional programmes. Our team can explain the next interaction and the formalities that apply once admission is confirmed."], checklist: ["Confirm the class and session", "Discuss eligibility and available places", "Collect the current document checklist", "Review the fee structure", "Check transport for your address", "Note the next step and contact person"] },
      { id: "stay-connected", title: "5. Stay in touch with Sanskar", paragraphs: ["Keep your phone number and email details accurate so the office can contact you. You can use our contact page for directions and our notices page for school information and documents.", "We encourage you to explore our academics, campus gallery and published 2025–26 board toppers before your visit. Bring your questions: we want you to understand what learning at Sanskar can look like for your child."] },
    ],
    links: [{ label: "Send your admission enquiry", href: "/admissions#enquiry" }, { label: "Explore Sanskar Li'l Winners", href: "/little-winners" }, { label: "Read school notices", href: "/notices" }, { label: "Contact Sanskar and get directions", href: "/contact" }],
  },
]

export const blogPath = (post: BlogPost) => `/blog/${post.slug}`
export const findPost = (path: string) => BLOG_POSTS.find(post => blogPath(post) === path)
export const readingMinutes = (post: BlogPost) => Math.max(1, Math.ceil([post.introduction, ...post.sections.flatMap(section => [...section.paragraphs, ...(section.checklist || [])])].join(" ").split(/\s+/).length / 200))
