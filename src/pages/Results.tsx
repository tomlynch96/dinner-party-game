import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGame } from '../store'
import type { RoundNumber } from '../game/types'

export default function Results() {
  const { code, n } = useParams()
  const nav = useNavigate()
  const round = (parseInt(n || '0', 10) as RoundNumber)
  const { players, cumulative } = useGame()

  const rows = useMemo(() => {
    return Object.values(players)
      .map(p => ({ id: p.id, name: p.name, points: cumulative[p.id] ?? 0 }))
      .sort((a, b) => b.points - a.points)
  }, [players, cumulative])

  const roundLabel =
    round === 1 ? 'Round 1 — Subgroup ranking'
    : round === 2 ? 'Round 2 — Full group ranking'
    : 'Round 3 — Full group + sabotage'

  const nextHref =
    round === 1 ? `/g/${code}/r/2`
    : round === 2 ? `/g/${code}/r/3`
    : `/g/${code}` // after round 3, go back to lobby

  const nextText =
    round === 3 ? 'Back to Lobby' : `Start Round ${round + 1}`

  return (
    <div className="grid gap-6">
      <div className="card">
        <h2 className="text-lg font-semibold">Results</h2>
        <p className="opacity-80 mt-1">{roundLabel}</p>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-2">Scoreboard</h3>
        <div className="overflow-hidden rounded-xl border border-neutral-800">
          <table className="w-full text-left">
            <thead className="bg-neutral-900/60">
              <tr>
                <th className="px-3 py-2">Player</th>
                <th className="px-3 py-2">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-t border-neutral-800/70">
                  <td className="px-3 py-2">{r.name}</td>
                  <td className="px-3 py-2 font-mono">{r.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex gap-3">
          <button className="btn" onClick={() => nav(`/g/${code}`)}>Lobby</button>
          <button className="btn" onClick={() => nav(nextHref)}>{nextText}</button>
        </div>
      </div>
    </div>
  )
}
