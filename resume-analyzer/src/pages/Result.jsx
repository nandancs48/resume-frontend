import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useRef, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { jsPDF } from 'jspdf'

import { Download, Filter, ArrowUpDown, ChevronDown, Check, X, FileText, Mail, Trophy, User } from 'lucide-react'
import CandidateCard from '../components/CandidateCard'


// ... (imports remain)

export default function Result() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const componentRef = useRef(null)

  const [minScore, setMinScore] = useState(0)
  const [sortBy, setSortBy] = useState('score_desc') // score_desc, score_asc, name_asc
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)

  if (!state || !state.result) {
    navigate('/')
    return null
  }

  const allResults = state?.result?.ranking || []
  const failedFiles = state?.result?.failed_files || []

  // Filter and Sort Logic
  const processedResults = useMemo(() => {
    let filtered = allResults.filter(r => r.match_percentage >= minScore)
    
    return filtered.sort((a, b) => {
      if (sortBy === 'score_desc') return b.match_percentage - a.match_percentage
      if (sortBy === 'score_asc') return a.match_percentage - b.match_percentage
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name)
      return 0
    })
  }, [allResults, minScore, sortBy])

  // Chart Data Preparation
  const chartData = processedResults.map(r => {
    // Truncate name if it's too long (e.g. > 15 chars)
    let displayName = r.name || 'Unknown';
    // Remove extension if looks like a filename
    displayName = displayName.replace(/\.[^/.]+$/, "");
    
    if (displayName.length > 15) {
      displayName = displayName.substring(0, 15) + '...';
    }

    return {
      name: displayName,
      full_name: r.name,
      score: r.match_percentage
    }
  })

  const avgScore = chartData.length > 0
    ? Math.round(chartData.reduce((acc, curr) => acc + curr.score, 0) / chartData.length)
    : 0

  const topMatch = processedResults.length > 0 ? processedResults[0] : null

  const handleDownloadPDF = () => {
    setIsGeneratingPdf(true)

    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth();

      // Helper to center text
      const centerText = (text, y) => {
        const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const x = (pageWidth - textWidth) / 2;
        doc.text(text, x, y);
      }

      // Title
      doc.setFontSize(22)
      doc.setTextColor(40)
      doc.text('Resume Analysis Report', 14, 20)

      // Metadata
      doc.setFontSize(10)
      doc.setTextColor(100)
      const dateStr = new Date().toLocaleString()
      doc.text(`Generated on: ${dateStr}`, 14, 30)
      doc.text(`Total Candidates: ${processedResults.length}`, 14, 36)
      doc.text(`Criteria: Min Score ${minScore}% | Sort: ${sortBy.replace('_', ' ').toUpperCase()}`, 14, 42)

      // Draw Separator Line
      doc.setDrawColor(200);
      doc.line(14, 48, pageWidth - 14, 48);

      let currentY = 58;

      // Table Header
      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      
      const colX = { rank: 14, name: 26, score: 75, email: 100, phone: 155 }; // Adjusted X positions
      
      doc.text("#", colX.rank, currentY);
      doc.text("Name", colX.name, currentY);
      doc.text("Score", colX.score, currentY);
      doc.text("Email", colX.email, currentY);
      doc.text("Phone", colX.phone, currentY);
      
      currentY += 5;
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(14, currentY, pageWidth - 14, currentY);
      currentY += 8;

      // Rows
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      processedResults.forEach((candidate, index) => {
        // Page break check
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text("#", colX.rank, currentY);
          doc.text("Candidate", colX.name, currentY);
          doc.text("Score", colX.score, currentY);
          doc.text("Email", colX.email, currentY);
          doc.text("Phone", colX.phone, currentY);
           // ... reprint headers if needed, simplified for now
           currentY += 10;
        }

        const score = candidate.match_percentage;
        let scoreColor = [0, 0, 0];
        if (score >= 70) scoreColor = [16, 185, 129]; // Green
        else if (score < 40) scoreColor = [239, 68, 68]; // Red

        doc.setFont("helvetica", "normal");
        doc.setTextColor(60);
        doc.text(`${index + 1}`, colX.rank, currentY);
        
        doc.setTextColor(0);
        doc.text(candidate.name.substring(0, 20), colX.name, currentY); // Truncate name helps layout

        doc.setTextColor(...scoreColor);
        doc.setFont("helvetica", "bold");
        doc.text(`${score}%`, colX.score, currentY);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(80);
        
        // Truncate email if too long
        let email = candidate.email || 'N/A';
        if (email.length > 25) email = email.substring(0, 25) + '...';
        doc.text(email, colX.email, currentY);
        
        // Add Phone
        let phoneNum = candidate.phone || 'N/A';
        if (phoneNum === 'Not found') phoneNum = 'N/A';
        doc.text(phoneNum, colX.phone, currentY);

        currentY += 8;
        doc.setDrawColor(240);
        doc.line(14, currentY - 4, pageWidth - 14, currentY - 4); // Light row separator
      });

      doc.save('resume-analysis-report.pdf')
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  if (allResults.length === 0) {
     return (
      <div className="min-h-screen bg-[#0A0A0B] text-white flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[128px] pointer-events-none" />
        
        <div className="max-w-md w-full text-center relative z-10">
          <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-2xl">
            <Filter className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4 tracking-tight">No Matches Found</h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            We couldn't find any suitable matches. Try adjusting your criteria.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200 shadow-lg shadow-white/5 active:scale-95"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Reset pagination when filters/sorting change
  useMemo(() => {
    setCurrentPage(1)
  }, [minScore, sortBy])

  // Pagination Logic
  const totalPages = Math.ceil(processedResults.length / itemsPerPage)
  const paginatedResults = processedResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[128px] pointer-events-none fixed" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[128px] pointer-events-none fixed" />

      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[128px] pointer-events-none fixed" />

      <div className="max-w-7xl mx-auto relative z-10" ref={componentRef}>
        {/* Error Banner for Failed Files */}


        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <button
              onClick={() => navigate('/')}
              className="group flex items-center text-gray-400 hover:text-white transition-colors mb-4"
              data-html2canvas-ignore
            >
              <ChevronDown className="w-5 h-5 mr-1 rotate-90 group-hover:-translate-x-1 transition-transform" />
              New Analysis
            </button>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
              Analysis Results
            </h1>
            <p className="text-gray-400">
              Found {processedResults.length} candidates matching your criteria
            </p>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            data-html2canvas-ignore
          >
            {isGeneratingPdf ? (
              <span className="animate-pulse">Generating...</span>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download Report
              </>
            )}
          </button>
        </div>

        {/* Stats & Tools Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Stats Cards */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <User className="w-4 h-4 text-indigo-400" />
                 </div>
                 <p className="text-sm text-gray-400">Total</p>
              </div>
              <p className="text-2xl font-bold">{processedResults.length}</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
               <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Trophy className="w-4 h-4 text-emerald-400" />
                 </div>
                 <p className="text-sm text-gray-400">Top Match</p>
              </div>
              <p className="text-2xl font-bold text-emerald-400">{topMatch?.match_percentage || 0}%</p>
            </div>

            {/* Filter Controls */}
             <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-center" data-html2canvas-ignore>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
                         <Filter className="w-3 h-3" /> Min Score: {minScore}%
                    </label>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={minScore}
                    onChange={(e) => setMinScore(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center" data-html2canvas-ignore>
                 <div className="w-full">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                         <ArrowUpDown className="w-3 h-3" /> Sort By
                    </label>
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 appearance-none cursor-pointer"
                        >
                            <option value="score_desc">Highest Score First</option>
                            <option value="score_asc">Lowest Score First</option>
                            <option value="name_asc">Name (A-Z)</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>

        {/* Charts Section */}
        {processedResults.length > 0 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 mb-8">
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-indigo-500 rounded-full" />
              Candidate Comparison
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9ca3af" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]} 
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
                    cursor={{ fill: '#ffffff05' }}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score >= 70 ? '#10b981' : entry.score >= 40 ? '#f59e0b' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {paginatedResults.map((res, index) => {
            // Absolute index for correct Trophy logic
            const absoluteIndex = (currentPage - 1) * itemsPerPage + index
            const isTop3 = absoluteIndex < 3 && sortBy ===('score_desc')
            
            return (
                <CandidateCard 
                    key={`${res.name}-${index}`}
                    res={res}
                    rank={absoluteIndex}
                    isTop3={isTop3}
                />
            )
        })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8" data-html2canvas-ignore>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Logic to show ranges like 1 2 3 4 5 or more complex. content with simple for now or a sliding window if needed.
                  // For simplicity, let's just show current window or all if small
                  let pageNum = i + 1;
                  if (totalPages > 5) {
                      if (currentPage > 3) {
                          pageNum = currentPage - 2 + i;
                      }
                      pageNum = Math.min(pageNum, totalPages);
                  }
                  
                  // Ensure we don't go out of bounds (though min logic handles right side)
                  if (pageNum > totalPages || pageNum < 1) return null;

                  return (
                    <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                        currentPage === pageNum
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                        }`}
                    >
                        {pageNum}
                    </button>
                  );
                })}
                 {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="text-gray-500">...</span>
                 )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
        )}
      </div>
    </div>
  )
}

