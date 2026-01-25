import { useState, useRef, useEffect } from 'react'

export default function UploadZone({ onSubmit, onReset }) {
  const [files, setFiles] = useState([])
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef(null)

  // Reset files when onReset is called (after successful submission)
  useEffect(() => {
    if (onReset) {
      setFiles([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [onReset])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    // Filter to only PDF and DOCX files
    const validFiles = droppedFiles.filter(file => {
      const ext = file.name.toLowerCase().split('.').pop()
      return ext === 'pdf' || ext === 'docx' || ext === 'doc'
    })
    setFiles(validFiles)
    // Reset the file input to allow new selections
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => {
    setDragging(false)
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || [])
    // Filter to only PDF and DOCX files
    const validFiles = selectedFiles.filter(file => {
      const ext = file.name.toLowerCase().split('.').pop()
      return ext === 'pdf' || ext === 'docx' || ext === 'doc'
    })
    setFiles(validFiles)
  }

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    // Reset input to allow reselecting
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const clearAllFiles = () => {
    setFiles([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = () => {
    if (files.length > 0) {
      onSubmit(files)
    }
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-2xl p-10 text-center mb-4 transition
          ${dragging ? 'border-indigo-400 bg-indigo-400/10' : 'border-indigo-300'}
        `}
      >
        Drag & Drop resumes here (PDF, DOCX)
        {files.length > 0 && (
          <p className="mt-4 text-sm text-gray-300">
            {files.length} file(s) selected
          </p>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.doc"
        onChange={handleFileChange}
        className="mb-4 w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="mb-4 max-h-40 overflow-y-auto bg-black/20 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-300">Selected Files:</span>
            <button
              onClick={clearAllFiles}
              className="text-xs text-red-400 hover:text-red-300 underline"
            >
              Clear All
            </button>
          </div>
          <ul className="space-y-1">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between text-sm text-gray-300 bg-black/30 rounded px-2 py-1">
                <span className="truncate flex-1 mr-2" title={file.name}>
                  {file.name}
                </span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-400 hover:text-red-300 ml-2"
                  title="Remove file"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        disabled={files.length === 0}
        onClick={handleSubmit}
        className="w-full py-3 bg-indigo-600 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
      >
        Analyze Resumes
      </button>
    </div>
  )
}
