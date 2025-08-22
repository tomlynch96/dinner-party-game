import { useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGame } from '../store'
import { useGameChannel } from '../lib/useGameChannel'

export default function Lobby(){
  const { code } = useParams()
  const nav = useNavigate()
  const { selfId, name, setName, setGameCode, roster } = useGame()
  const { send } = useGameChannel(true)

  useEffect(()=> {
    if(!code) return
    if(!name.trim()) setName(prompt('Enter your name') || `Player-${selfId.slice(0,4)}`)
    setGameCode(code)
  },[code])

  const players = useMemo(()=>Object.values(roster).sort((a,b)=>a.name.localeCompare(b.name)),[roster])

  return (
    <div className="grid gap-6">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-70">Game code</div>
            <div className="text-2xl font-mono tracking-widest">{code}</div>
          </div>
          <button className="btn" onClick={()=>navigator.clipboard.writeText(window.location.href)}>Copy Link</button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Players</h2>
        <ul className="grid sm:grid-cols-2 gap-2">
          {players.map(p=>(
            <li key={p.id} className="flex items-center justify-between rounded-xl bg-neutral-950 border border-neutral-800 p-3">
              <span className="truncate">{p.name}{p.id===selfId?' (you)':''}</span>
              <span className={`text-xs px-2 py-1 rounded ${p.ready?'bg-green-700/50':'bg-neutral-800'}`}>
                {p.ready?'Ready':'Not ready'}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-3">
          <button className="btn" onClick={()=>send({ type:'READY', playerId:selfId, ready:true })}>I’m Ready</button>
          <button className="btn" onClick={()=>send({ type:'READY', playerId:selfId, ready:false })}>Not Ready</button>
          <div className="grow" />
          <button className="btn" onClick={()=>{ const round=1; send({type:'START_ROUND', round}); nav(`/g/${code}/r/${round}`) }}>
            Start Round
          </button>
        </div>
      </div>
    </div>
  )
}
