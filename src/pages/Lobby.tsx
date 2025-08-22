import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGame } from '../store'
import type { Player } from '../game/types'
import { buildRound1Context } from '../game/rules'

export default function Lobby() {
  const { code } = useParams()
  const nav = useNavigate()
  const { name, selfId, setName, setCode, players, addDummyPlayer, setPlayers, setRound, setContext, config } = useGame()

  // Ensure host (you) appears in list
  const ensureSelf = () => {
    const p: Record<string, Player> = { ...players }
    if (!p[selfId]) p[selfId] = { id: selfId, name: name || `You`, points: 0 }
    setPlayers(p)
  }

  const playerList = useMemo(() => Object.values(players), [players])

  return (
    <div className="grid gap-6">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-70">Game code</div>
            <div className="text-2xl font-mono tracking-widest">{code}</div>
          </div>
          <div className="flex gap-2">
            <button className="btn" onClick={() => navigator.clipboard.writeText(window.location.href)}>Copy Link</button>
            <button className="btn" onClick={() => { if (!name) setName(prompt('Your name') || 'Host'); ensureSelf(); }}>Set/Ensure Host</button>
            <button className="btn" onClick={() => { addDummyPlayer(); }}>+ Dummy Player</button>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Players ({playerList.length})</h2>
        <ul className="grid sm:grid-cols-2 gap-2">
          {playerList.map(p => (
            <li key={p.id} className="flex items-center justify-between rounded-xl bg-neutral-950 border border-neutral-800 p-3">
              <span className="truncate">{p.name}{p.id===selfId?' (you)':''}</span>
              <span className="text-xs px-2 py-1 rounded bg-neutral-800">ready</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">Start Rounds</h3>
        <div className="flex flex-wrap gap-3">
          <button
            className="btn"
            onClick={() => {
              if (!code) return
              setCode(code)
              // build Round 1 context (subgroups)
              const ids = Object.keys(players)
              if (ids.length < 2) { alert('Add at least 2 players (use + Dummy Player)'); return; }
              const ctx = buildRound1Context(ids, config.subgroupSize, `${code}-r1`)
              setContext(ctx)
              setRound(1)
              nav(`/g/${code}/r/1`)
            }}>
            Start Round 1
          </button>

          <button
            className="btn"
            onClick={() => {
              if (!code) return
              setCode(code)
              setContext({ round: 2 })
              setRound(2)
              nav(`/g/${code}/r/2`)
            }}>
            Start Round 2
          </button>

          <button
            className="btn"
            onClick={() => {
              if (!code) return
              setCode(code)
              setContext({ round: 3 })
              setRound(3)
              nav(`/g/${code}/r/3`)
            }}>
            Start Round 3
          </button>
        </div>
      </div>
    </div>
  )
}
