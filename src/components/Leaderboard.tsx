import { useMemo } from 'react'
import { useGame } from '../store'

export default function Leaderboard(){
  const { roster } = useGame()
  const rows = useMemo(()=>Object.values(roster).sort((a,b)=>b.points-a.points),[roster])
  return (
    <div className="card">
      <h3 className="font-semibold mb-2">Leaderboard</h3>
      <div className="overflow-hidden rounded-xl border border-neutral-800">
        <table className="w-full text-left">
          <thead className="bg-neutral-900/60">
            <tr><th className="px-3 py-2">Player</th><th className="px-3 py-2">Points</th></tr>
          </thead>
          <tbody>
            {rows.map(p=>(
              <tr key={p.id} className="border-t border-neutral-800/70">
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2 font-mono">{p.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
