import { Github, Twitter, Linkedin, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 backdrop-blur-xl bg-black/20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4">ResumeAnalyzer.AI</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Empowering recruiters with next-generation AI tools. 
              Upload, analyze, and rank talent in seconds, not hours.
              Privacy-focused and secure by design.
            </p>
          </div>

          <div>
            {/* <h4 className="font-semibold text-white mb-4 uppercase text-xs tracking-wider">Product</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
              <li><Link to="/features" className="hover:text-indigo-400 transition-colors">Features</Link></li>
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
            </ul> */}
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 uppercase text-xs tracking-wider">Connect With Us :</h4>
            <div className="flex gap-4">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 ResumeAnalyzer.AI — All rights reserved</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> by HireSense Team
          </p>
        </div>
      </div>
    </footer>
  )
}
