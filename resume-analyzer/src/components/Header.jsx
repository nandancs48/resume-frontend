import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-white hover:text-indigo-200 transition-colors">
          ResumeAnalyzer<span className="text-indigo-400">.AI</span>
        </Link>
        <nav className="space-x-6 text-gray-300 hidden md:block">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/features" className="hover:text-white transition-colors">Features</Link>
          <Link to="/about" className="hover:text-white transition-colors">About</Link>
        </nav>
      </div>
    </header>
  )
}
