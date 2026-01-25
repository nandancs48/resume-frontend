export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Outer spinning ring */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
        {/* Inner static or pulsating dot (optional aesthetic) */}
        <div className="absolute top-0 left-0 w-16 h-16 flex items-center justify-center">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
        </div>
      </div>
      
      <div className="mt-6 text-xl font-semibold text-white animate-pulse">
        Analyzing resumes with AI...
      </div>
      <p className="mt-2 text-sm text-gray-400 max-w-xs text-center">
        This may take a moment. Larger batches take a bit longer.
      </p>
    </div>
  )
}