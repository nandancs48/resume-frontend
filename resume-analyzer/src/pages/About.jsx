export default function About() {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-white pt-24 pb-12 px-6 relative overflow-hidden font-sans">
        
        <div className="max-w-4xl mx-auto relative z-10">
           <div className="text-center mb-16">
             <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
             <div className="w-24 h-1 bg-indigo-500 mx-auto rounded-full"></div>
           </div>
 
           <div className="space-y-12 text-lg text-gray-300 leading-relaxed">
              <section>
                 <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                 <p>
                   At ResumeAnalyzer.AI, our mission is to democratize effective hiring. We believe that every company, regardless of size, deserves access to enterprise-grade AI tools to find the best talent. We strive to remove bias, improve efficiency, and help recruiters focus on what really matters: connecting with people.
                 </p>
              </section>
 
              <section>
                 <h2 className="text-2xl font-bold text-white mb-4">The Technology</h2>
                 <p>
                   Built on the intersection of modern web technologies and advanced Natural Language Processing (NLP), our platform utilizes a custom-tuned pipeline to analyze text. Unlike simple keyword counters, our system understands the relationships between skills, roles, and industries to provide a holistic view of a candidate's potential.
                 </p>
              </section>
 
              <section>
                 <h2 className="text-2xl font-bold text-white mb-4">Privacy Commitment</h2>
                 <p>
                   In an age of data permanence, we choose to be ephemeral. We understand the sensitive nature of resumes. That's why we've architected our system to process data in volatile memory and temporary storage that is immediately purged after analysis. We don't build profiles, we don't sell data, and we don't keep what isn't ours.
                 </p>
              </section>
 
              <section className="bg-white/5 p-8 rounded-2xl border border-white/10 mt-12">
                 <h2 className="text-2xl font-bold text-white mb-4">Get in Touch</h2>
                 <p className="mb-6">
                    Have questions, suggestions, or just want to say hi? We'd love to hear from you.
                 </p>
                 <a href="mailto:contact@resumeanalyzer.ai" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                    contact@resumeanalyzer.ai
                 </a>
              </section>
           </div>
        </div>
      </div>
    )
  }
