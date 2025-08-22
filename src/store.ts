import { create } from 'zustand'
import { nanoid } from 'nanoid'

export type Player = { id: string; name: string; ready: boolean; points: number }

type GameState = {
  selfId: string; name: string; gameCode: string; round: number;
  roster: Record<string, Player>; myAction?: 'play'|'sabotage';
  setName: (n: string)=>void; setGameCode:(c:string)=>void; setRound:(r:number)=>void;
  setRoster:(r:Record<string, Player>)=>void; setMyAction:(a?:'play'|'sabotage')=>void;
  addPoints:(id:string,pts:number)=>void; resetActions:()=>void
}

export const useGame = create<GameState>((set, get) => ({
  selfId: nanoid(), name: '', gameCode: '', round: 0, roster: {},
  setName: (name)=>set({name}),
  setGameCode: (gameCode)=>set({gameCode}),
  setRound: (round)=>set({round}),
  setRoster: (roster)=>set({roster}),
  setMyAction: (myAction)=>set({myAction}),
  addPoints: (id, pts) => {
    const roster = { ...get().roster }
    if (!roster[id]) return
    roster[id] = { ...roster[id], points: roster[id].points + pts }
    set({ roster })
  },
  resetActions: ()=>set({ myAction: undefined })
}))
