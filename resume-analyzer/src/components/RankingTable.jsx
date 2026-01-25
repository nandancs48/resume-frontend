export default function RankingTable({ data }) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="text-left">
          <th className="p-2">Resume</th>
          <th className="p-2">Score</th>
        </tr>
      </thead>
      <tbody>
        {data.map((r, i) => (
          <tr key={i} className="border-t border-white/10">
            <td className="p-2">{r.name}</td>
            <td className="p-2">
              <div className="w-full bg-black/30 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${r.score}%` }}
                />
              </div>
              <span className="text-sm">{r.score}%</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}