import { supabase } from './supabaseClient'
import { useEffect, useRef } from 'react'
import { useGame } from '../store'

type EventPayload =
  | { type:'JOIN'; player:{ id:string; name:string } }
  | { type:'READY'; playerId:string; ready:boolean }
  | { type:'START_ROUND'; round:number }
  | { type:'ACTION'; playerId:string; action:'play'|'sabotage' }
  | { type:'ROUND_RESULT'; scores:Record<string,number> }

export function useGameChannel(enabled:boolean){
  const { gameCode, selfId, name, roster, setRoster } = useGame()
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(()=> {
    if(!enabled || !gameCode) return
    const ch = supabase.channel(`game:${gameCode}`, { config:{ presence:{ key:selfId }}})
    channelRef.current = ch

    ch.on('presence', {event:'sync'}, () => {
      const presence = ch.presenceState() as Record<string, Array<{name:string}>>
      const merged: Record<string, any> = { ...roster }
      Object.entries(presence).forEach(([pid, arr])=>{
        const nm = arr[0]?.name ?? 'Player'
        merged[pid] = merged[pid] ?? { id: pid, name: nm, ready: false, points: 0 }
      })
      Object.keys(merged).forEach(pid => { if(!presence[pid]) delete merged[pid] })
      setRoster(merged)
    })

    ch.on('broadcast', {event:'game-event'}, ({payload})=>{
      const p = payload as EventPayload
      const s = useGame.getState()
      if (p.type==='JOIN'){
        const r = { ...s.roster }
        r[p.player.id] = r[p.player.id] ?? { id:p.player.id, name:p.player.name, ready:false, points:0 }
        s.setRoster(r)
      }
      if (p.type==='READY'){
        const r = { ...s.roster }
        if (r[p.playerId]) r[p.playerId] = { ...r[p.playerId], ready:p.ready }
        s.setRoster(r)
      }
      if (p.type==='START_ROUND'){ s.setRound(p.round); s.resetActions() }
      if (p.type==='ROUND_RESULT'){ Object.entries(p.scores).forEach(([pid,pts])=> s.addPoints(pid, pts)) }
    })

    ch.subscribe(async status=>{
      if(status==='SUBSCRIBED'){
        await ch.track({ name })
        await ch.send({ type:'broadcast', event:'game-event',
          payload:{ type:'JOIN', player:{ id:selfId, name } }
        })
      }
    })

    return ()=>{ ch.unsubscribe() }
  },[enabled, gameCode, selfId, name])

  const send = async (payload:EventPayload) => {
    if(!channelRef.current) return
    await channelRef.current.send({ type:'broadcast', event:'game-event', payload })
  }
  return { send }
}
