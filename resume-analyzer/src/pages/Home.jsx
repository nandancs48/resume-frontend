import { useState, useEffect } from 'react'
import UploadZone from '../components/UploadZone'
import Loader from '../components/Loader'
import { useNavigate } from 'react-router-dom'
import { ScanSearch, ListOrdered, Clock } from 'lucide-react'

export default function Home() {
  const [jobDesc, setJobDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [backendStatus, setBackendStatus] = useState(null)
  const [resetUpload, setResetUpload] = useState(0)
  const navigate = useNavigate()

  // Check backend connection on component mount
  useEffect(() => {
    checkBackendConnection()
  }, [])

  const checkBackendConnection = async () => {
    setBackendStatus(null) // Show loading state
    try {
      // Use the same proxy pattern as the main API call
      const healthURL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL + "/api/health"
  : "http://localhost:5000/api/health"

      
      console.log('Checking backend connection at:', healthURL)
      
      // Create abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      const response = await fetch(healthURL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        try {
          const data = await response.json()
          console.log('Backend connected:', data)
          setBackendStatus('connected')
        } catch (e) {
          console.error('Failed to parse health check response:', e)
          setBackendStatus('error')
        }
      } else {
        console.error('Health check failed with status:', response.status)
        setBackendStatus('error')
      }
    } catch (error) {
      console.error('Backend connection error:', error)
      if (error.name === 'AbortError') {
        console.error('Backend connection timeout - server may not be running on port 5000')
      }
      setBackendStatus('error')
    }
  }

  const handleSubmit = async (files) => {
    if (!jobDesc.trim()) {
      alert('Please enter a job description')
      return
    }

    if (files.length === 0) {
      alert('Please upload at least one resume file')
      return
    }

    // Check if backend is connected
    if (backendStatus !== 'connected') {
      alert('Backend server is not connected. Please start the ML backend server to analyze resumes.')
      return
    }

    setLoading(true)

    try {
      // Create FormData to send files and text
      const formData = new FormData()
      
      // Add job description as text
      formData.append('job_description_text', jobDesc)
      
      // Add resume files
      files.forEach((file) => {
        formData.append('resumes', file)
      })

      // API endpoint - uses proxy in development or env variable
      const API_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL + "/api/analyze"
  : "http://localhost:5000/api/analyze"

      console.log('Sending request to:', API_URL)
      console.log('Number of files:', files.length)
      
      // Create abort controller for timeout (15 minutes for large file processing)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 900000) // 15 minutes timeout
      
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)

      console.log('Response status:', response.status)
      
      if (response.status === 413) {
        throw new Error('Total file size is too large. The limit is 1GB.')
      }

      // Get response text first to check if it's valid JSON
      const responseText = await response.text()
      console.log('Response text:', responseText.substring(0, 200))
      
      // Check if response is empty
      if (!responseText || responseText.trim() === '') {
        console.error('Empty response received. Status:', response.status)
        throw new Error('Empty response from server. Check backend terminal for errors.')
      }
      
      // Check content type
      const contentType = response.headers.get('content-type')
      if (contentType && !contentType.includes('application/json')) {
        console.error('Non-JSON response received:', responseText.substring(0, 500))
        throw new Error(`Server returned non-JSON response. Status: ${response.status}`)
      }

      if (!response.ok) {
        // Try to parse as JSON for error message
        let errorMessage = 'Failed to analyze resumes'
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch (e) {
          errorMessage = responseText || response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      // Parse JSON response
      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error('Failed to parse JSON:', e)
        console.error('Response was:', responseText)
        throw new Error('Invalid JSON response from server. Please check backend logs.')
      }
      
      if (data.success && data.ranking) {
        const result = {
          jobDescription: jobDesc,
          ranking: data.ranking,
          failed_files: data.failed_files || []
        }
        // Reset file upload after successful submission
        setResetUpload(prev => prev + 1)
        navigate('/result', { state: { result } })
      } else {
        throw new Error(data.error || 'Invalid response from server')
      }
    } catch (error) {
      console.error('Error analyzing resumes:', error)
      let errorMessage = 'Failed to analyze resumes. Please check if the backend server is running and try again.'
      
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. The files may be too large or too many. Please try with fewer files or smaller files.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      alert(`Error: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-black text-white overflow-hidden">

  
      <div className="absolute -left-40 top-32 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -right-40 bottom-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>

      <section className="relative z-10 px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-14">
          AI Resume Analyzer
        </h1>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl">
            {/* Backend Status Indicator */}
            {backendStatus === 'error' && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-300 text-sm font-semibold">
                  ⚠️ Backend server not connected
                </p>
                <p className="text-red-200 text-xs mt-1">
                  {/* Please start the ML backend server: */}
                  Please wait for a minute and refresh the page.
                </p>
                {/* <ol className="text-red-200 text-xs mt-2 ml-4 list-decimal space-y-1">
                  <li>Open a terminal/command prompt</li>
                  <li>Navigate to: <code className="bg-black/30 px-1 rounded">ML_model/Dummy/backend</code></li>
                  <li>Run: <code className="bg-black/30 px-1 rounded">python app.py</code></li>
                  <li>Wait for: <code className="bg-black/30 px-1 rounded">Running on http://0.0.0.0:5000</code></li>
                </ol> */}
                <button
                  onClick={checkBackendConnection}
                  className="mt-3 px-3 py-1 text-xs bg-red-600/50 hover:bg-red-600/70 rounded text-red-100"
                >
                  Check connection again
                </button>
              </div>
            )}
            {backendStatus === 'connected' && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                <p className="text-green-300 text-sm font-semibold">
                  ✓ Connected to ML backend - Ready to analyze
                </p>
              </div>
            )}
            {backendStatus === null && (
              <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                <p className="text-blue-300 text-sm">
                  🔄 Checking backend connection...
                </p>
              </div>
            )}

            <label className="block mb-4 text-lg">
              Job Description
            </label>

            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste job description here..."
              className="w-full h-40 p-4 rounded-xl bg-black/40 text-white mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            {loading ? (
              <Loader />
            ) : (
              <UploadZone onSubmit={handleSubmit} onReset={resetUpload} />
            )}
          </div>

          {/* RIGHT: Desktop Content */}
          <div className="hidden md:block">
            <h2 className="text-3xl font-semibold mb-6">
              Hire Smarter with AI
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Upload resumes and instantly get AI-powered job matching,
              ranking, and insights based on your job description.
              Designed for recruiters and HR teams to save time and
              improve hiring accuracy.
            </p>
          </div>

        </div>
      </section>

      {/* ===== SCROLL SECTION ===== */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-200 via-white to-indigo-200 bg-clip-text text-transparent">
            Why ResumeAnalyzer.AI?
          </h2>
          <div className="w-24 h-1.5 bg-indigo-500 mx-auto rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform duration-300 border border-indigo-500/20">
                <ScanSearch className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-indigo-200 transition-colors">AI Matching Engine</h3>
              <p className="text-gray-400 leading-relaxed">
                Our advanced semantic analysis goes beyond simple keywords. It understands context, skills, and experience to match resumes with job descriptions with human-like precision.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
             <div className="relative z-10">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform duration-300 border border-emerald-500/20">
                <ListOrdered className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-emerald-200 transition-colors">Instant Bulk Ranking</h3>
              <p className="text-gray-400 leading-relaxed">
                Upload hundreds of resumes at once. Our system processes them in parallel and provides an instant, intelligent leaderboard categorized by match score.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform duration-300 border border-purple-500/20">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-200 transition-colors">Save 90% Screening Time</h3>
              <p className="text-gray-400 leading-relaxed">
                Automate the tedious initial screening process. Focus your valuable time on interviewing the best candidates rather than reading through unqualified piles.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}

