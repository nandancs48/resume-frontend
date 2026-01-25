import { Zap, Shield, BarChart3, Users, Brain, Layers } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-indigo-400" />,
      title: "Context-Aware AI Matching",
      description: "Our advanced NLP engine goes beyond keyword matching. It understands the semantic context of skills and experiences to find the truly best-fit candidates."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-emerald-400" />,
      title: "Instant Bulk Ranking",
      description: "Stop reviewing one by one. Upload hundreds of resumes and get an instant, ranked leaderboard based on job suitability. Save 90% of your screening time."
    },
    {
      icon: <Users className="w-8 h-8 text-purple-400" />,
      title: "Skill Gap Analysis",
      description: "Don't just see a score. Understand WHY. We highlight exactly which skills a candidate matches and which critical skills they are missing."
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-400" />,
      title: "Privacy-First Processing",
      description: "Your data never persists. We use ephemeral processing environments that wipe all uploaded files immediately after analysis. Your candidate data remains yours."
    },
    {
      icon: <Layers className="w-8 h-8 text-orange-400" />,
      title: "Format Agnostic",
      description: "PDF, DOCX, TXT? No problem. Our universal parser handles messy formatting and diverse layouts to extract clean, comparable data."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Lightning Fast Architecture",
      description: "Built for speed. Our optimized backend processes large batches in minutes, allowing you to screen an entire applicant pool before your morning coffee cools."
    }
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white pt-24 pb-12 px-6 relative overflow-hidden font-sans">
       {/* Background Effects */}
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[128px] pointer-events-none" />
       
       <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              Built for Modern Hiring through AI
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              ResumeAnalyzer.AI isn't just a parser. It's an intelligent hiring assistant that turns your resume pile into a prioritized talent pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10"
              >
                <div className="mb-6 p-4 bg-white/5 w-fit rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-white/5">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-24 p-12 rounded-3xl bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:linear-gradient(0deg,transparent,black)]" />
             <div className="relative z-10">
               <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your hiring?</h2>
               <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                 Join thousands of recruiters who are hiring faster and smarter with AI.
               </p>
               <a href="/" className="inline-block px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg shadow-white/10">
                 Start Analyzing Now
               </a>
             </div>
          </div>
       </div>
    </div>
  )
}
