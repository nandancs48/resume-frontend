import { useState } from 'react'
import { Mail, FileText, Check, X, ChevronDown, ChevronUp, Phone, User } from 'lucide-react'

export default function CandidateCard({ res, rank, isTop3 }) {
  const [showContact, setShowContact] = useState(false)

  return (
    <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/[0.07] transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl font-bold group-hover:text-indigo-400 transition-colors">
              {res.name}
            </h2>
            {isTop3 && (
              <span className={`p-1 rounded-full ${rank === 0 ? 'bg-yellow-500/20 text-yellow-300' : rank === 1 ? 'bg-gray-400/20 text-gray-300' : 'bg-orange-500/20 text-orange-300'}`}>
                <User className="w-3 h-3" />
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4 text-sm text-gray-400">
            {/* Experience */}
            <div className="flex items-center gap-2 overflow-hidden px-2 py-1 bg-blue-500/10 rounded-md border border-blue-500/10">
              <span className="w-4 h-4 flex items-center justify-center bg-blue-500/20 rounded text-blue-400 font-bold text-[10px] shrink-0">E</span>
              <span className="truncate text-blue-200/80">{res.experience}</span>
            </div>

            {/* Education */}
            <div className="flex items-center gap-2 overflow-hidden px-2 py-1 bg-purple-500/10 rounded-md border border-purple-500/10">
              <span className="w-4 h-4 flex items-center justify-center bg-purple-500/20 rounded text-purple-400 font-bold text-[10px] shrink-0">D</span>
              <span className="truncate text-purple-200/80">{res.education}</span>
            </div>
          </div>
        </div>

        <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border-2 ${res.match_percentage >= 70 ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
            res.match_percentage >= 40 ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' :
              'border-rose-500/30 bg-rose-500/10 text-rose-400'
          }`}>
          <span className="text-lg font-bold">{res.match_percentage}%</span>
          <span className="text-[10px] uppercase font-bold tracking-wide">Match</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Check className="w-3 h-3 text-emerald-500" />
            Matched Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {res.matched_skills?.length > 0 ? res.matched_skills.map((skill, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-emerald-500/5 text-emerald-300/80 rounded-md text-xs border border-emerald-500/10"
              >
                {skill}
              </span>
            )) : (
              <span className="text-gray-600 text-xs italic">None</span>
            )}
          </div>
        </div>

        {res.unmatched_skills?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <X className="w-3 h-3 text-rose-500" />
              Missing Skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {res.unmatched_skills.slice(0, 5).map((skill, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-rose-500/5 text-rose-300/60 rounded-md text-xs border border-rose-500/10"
                >
                  {skill}
                </span>
              ))}
              {res.unmatched_skills.length > 5 && (
                <span className="px-2 py-1 text-gray-500 text-xs">+{res.unmatched_skills.length - 5} more</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              if (res.filename) {
                window.open(`http://localhost:5000/resumes/${res.filename}`, '_blank')
              } else {
                alert("Resume file not found")
              }
            }}
            className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors border border-white/5 text-gray-300">
            <FileText className="w-4 h-4" />
            View Resume
          </button>

          <button
            onClick={() => setShowContact(!showContact)}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all border ${showContact
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30'
                : 'bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border-indigo-500/20'
              }`}>
            <User className="w-4 h-4" />
            View Contact
            {showContact ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Expandable Contact Section */}
        {showContact && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {res.email && res.email !== 'Not found' && (
              <a
                href={`mailto:${res.email}`}
                className="flex items-center justify-center gap-2 py-2.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 rounded-xl text-xs font-medium transition-colors border border-indigo-500/20 truncate px-2"
                title={res.email}
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{res.email}</span>
              </a>
            )}

            {res.phone && res.phone !== 'Not found' && (
              <a
                href={`tel:${res.phone}`}
                className="flex items-center justify-center gap-2 py-2.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-300 rounded-xl text-xs font-medium transition-colors border border-emerald-500/20 truncate px-2"
                title={res.phone}
              >
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{res.phone}</span>
              </a>
            )}

            {(!res.email || res.email === 'Not found') && (!res.phone || res.phone === 'Not found') && (
              <div className="col-span-2 text-center py-2 text-xs text-gray-500">
                No contact information extracted
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
