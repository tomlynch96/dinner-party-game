import { useNavigate } from 'react-router-dom'
import { useGame } from '../store'
import { useState } from 'react'

function randomCode(len=6){
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({length:len},()=>chars[Math.floor(Math.random()*chars.length)]).join('')
}

export default function Home(){
  const nav = useNavigate()
  const { name, setName } = useGame()
  return (
    <div className="grid gap-6">
      <div className="card">
        <h1 className="text-xl font-semibold mb-3">Create a Game</h1>
        <div className="grid sm:grid-cols-[1fr_auto] gap-3">
          <input className="input" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
          <button className="btn" onClick={()=>nav(`/g/${randomCode()}`)} disabled={!name.trim()}>
            Create &amp; Host
          </button>
        </div>
      </div>
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Join a Game</h2>
        <JoinForm/>
      </div>
    </div>
  )
}
function JoinForm(){
  const nav = useNavigate()
  const { name, setName } = useGame()
  const [code, setCode] = useState('')
  return (
    <div className="grid sm:grid-cols-3 gap-3">
      <input className="input" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
      <input className="input uppercase" placeholder="Game code (e.g. ABC123)" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} />
      <button className="btn" onClick={()=>nav(`/g/${code}`)} disabled={!name.trim() || code.length<4}>Join</button>
    </div>
  )
}
