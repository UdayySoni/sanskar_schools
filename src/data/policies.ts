export const POLICIES: Record<string, { title: string; description: string; sections: { title: string; text: string }[] }> = {
  "/privacy": {
    title: "Website privacy notice",
    description: "How the Sanskar Public School website handles admission enquiries, administrator sign-in and links to external services.",
    sections: [
      { title: "Information you send us", text: "The admission enquiry form asks for a student's name, the grade and wing of interest, a contact phone number and any other details you choose to provide, such as a parent's name, email, city or message. A parent or guardian should send an enquiry on behalf of a child. Please avoid including sensitive documents or unnecessary personal information in the message box." },
      { title: "How an enquiry is handled", text: "Enquiries are stored in the website's database so authorised school staff can review them and follow up. The website can also send an email notification to the school's enquiry address. It uses Cloudflare for hosting and storage, and Resend or FormSubmit for enquiry email delivery, depending on the configured service." },
      { title: "Sign-in, cookies and technical information", text: "Administrator sign-in uses a session cookie to keep staff signed in. Hosting and delivery services may process technical information such as IP addresses, request details and security logs. The public website does not require a parent account to submit an enquiry." },
      { title: "External services", text: "Links to WhatsApp, payment portals, sports bookings, maps and video services take you to, or load content from, other providers. Those providers handle information under their own policies. Online fee payments are completed in the linked payment portal; the enquiry form does not ask for card details." },
      { title: "Questions or requests about your information", text: "Contact the school at sanskarschool2009@gmail.com or 75359 38481 to ask about an enquiry, request a correction or discuss removal of information. The office can explain what records are held and how your request can be handled. This notice describes this website; ask the office about records used in the wider admission and school process." },
    ],
  },
  "/website-terms": {
    title: "Website terms",
    description: "Information about using Sanskar Public School's website, admission enquiries, school content and external portals.",
    sections: [
      { title: "School information", text: "This website introduces Sanskar Public School, its activities and admission process. Details can change. Confirm current class availability, subjects, fees, transport and admission requirements with the school office before making a decision." },
      { title: "Admission enquiries", text: "Sending an online enquiry allows the team to contact you. It does not reserve a place or confirm admission. Please provide accurate contact details and follow the next steps explained by the office." },
      { title: "Payments and bookings", text: "Fee payments and sports bookings use the linked external portals. Check the provider, amount, applicable terms and confirmation details before completing a transaction. Contact the school if you are unsure which link to use." },
      { title: "Use of content", text: "The website includes school information, photographs, student achievements and school-authored articles. Please contact the school before reusing student photographs or representing content as an official school communication. Editorial school selections express Sanskar's own perspective." },
      { title: "Responsible use and contact", text: "Use forms and contact details for genuine enquiries. Do not attempt to access staff accounts or interfere with the website. For a correction, broken link or question about these terms, email sanskarschool2009@gmail.com." },
    ],
  },
  "/editorial-policy": {
    title: "About our blog and editorial policy",
    description: "How the Sanskar Public School blog presents school information, sources, editorial selections and AI-generated illustrations.",
    sections: [
      { title: "Who publishes the blog", text: "The Sanskar journal is published by Sanskar Public School, Mathura. It explains our education approach, campus life and admission process for families. It represents the school, rather than an independent school review service. You can learn about the institution and its leadership on our About page." },
      { title: "School information and sources", text: "Articles use information supplied by the school and its published website material. Board topper names and percentages follow the supplied result sheet for the stated session. References to other schools link to their own websites or the Mathura district directory. Contact the relevant school to confirm details that can change." },
      { title: "Our school selections", text: "Our top 10 and top 3 selections place Sanskar first because they express our own preference for the education we offer. They are not official league tables or the findings of an independent assessment. Numbered positions should be read as our editorial choices." },
      { title: "Writing and images", text: "AI tools assist with drafting and illustrations. Images labelled AI-generated illustrate a topic and do not document real students, staff or campus events. Actual school photographs are used elsewhere on the website. Publication dates and source links help readers understand the context of each article." },
      { title: "Corrections and questions", text: "Please send corrections or questions to sanskarschool2009@gmail.com, including the page address and the detail you would like us to check. For current admission information, contact the office directly." },
    ],
  },
}
