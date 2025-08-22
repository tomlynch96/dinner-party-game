import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGame } from '../store'
import { useGameChannel } from '../lib/useGameChannel'
import Leaderboard from '../components/Leaderboard'

type ActionMap = Record<string, 'play' | 'sabotage'>

export default function Round(){
  const { code, n } = useParams()
  const nav = useNavigate()
  const { round, setRound, selfId, myAction, setMyAction, roster } = useGame()
  const { send } = useGameChannel(true)
  const [seconds, setSeconds] = useState(20)
  const actionsRef = useRef<ActionMap>({})

  useEffect(()=>{ if(n) setRound(parseInt(n)) },[n])
  useEffect(()=>{ const t=setInterval(()=>setSeconds(s=>Math.max(0,s-1)),1000); return ()=>clearInterval(t)},[])
  useEffect(()=>{ if(seconds===0) finishRound() },[seconds])

  const submit = (a:'play'|'sabotage') => {
    setMyAction(a)
    actionsRef.current[selfId] = a
    send({ type:'ACTION', playerId:selfId, action:a })
  }

  const computeScores = ():Record<string,number> => {
    const ids = Object.keys(roster)
    const actions = actionsRef.current
    const saboteurs = ids.filter(id=>actions[id]==='sabotage')
    const plays = ids.filter(id=>actions[id]==='play')
    const scores:Record<string,number> = {}; ids.forEach(id=>scores[id]=0)
    plays.forEach(id=>scores[id]+=10)
    const sabotageSucceeds = saboteurs.length>0 && saboteurs.length < ids.length/2
    if (sabotageSucceeds) saboteurs.forEach(id=>scores[id]+=20)
    return scores
  }

  const finishRound = () => {
    const scores = computeScores()
    send({ type:'ROUND_RESULT', scores })
    setTimeout(()=>{
      const next = (round||1)+1
      setSeconds(20); actionsRef.current={}; setMyAction(undefined)
      send({ type:'START_ROUND', round: next })
      nav(`/g/${code}/r/${next}`)
    }, 2500)
  }

  const everyone = useMemo(()=>Object.values(roster),[roster])
  const submitted = useMemo(()=>Object.keys(actionsRef.current),[roster, seconds])

  return (
    <div className="grid gap-6">
      <div className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Round {round}</h2>
          <div className="text-2xl font-mono">{seconds}s</div>
        </div>
        <p className="opacity-70 mt-2">Choose one: “Play” for +10 or “Sabotage” for +20 if it succeeds (fewer than half sabotage).</p>
        <div className="mt-4 flex gap-3">
          <button className="btn" disabled={!!myAction} onClick={()=>submit('play')}>Play (+10)</button>
          <button className="btn" disabled={!!myAction} onClick={()=>submit('sabotage')}>Sabotage (+20)</button>
          {myAction && <span className="ml-2 opacity-80">Submitted: <b>{myAction}</b></span>}
        </div>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-2">Submissions</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {everyone.map(p=>(
            <div key={p.id} className="rounded-xl bg-neutral-950 border border-neutral-800 p-3 flex items-center justify-between">
              <span className="truncate">{p.name}{p.id===selfId?' (you)':''}</span>
              <span className={`text-xs px-2 py-1 rounded ${submitted.includes(p.id)?'bg-blue-700/50':'bg-neutral-800'}`}>
                {submitted.includes(p.id)?'Submitted':'Waiting'}
              </span>
            </div>
          ))}
        </div>
      </div>
      <Leaderboard/>
    </div>
  )
}
