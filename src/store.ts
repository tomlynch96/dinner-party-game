import { create } from 'zustand'
import { nanoid } from 'nanoid'
import type { Player } from './game/types'
import {
  type RoundContext,
  type RoundNumber,
  type Scores,
  type GameConfig
} from './game/types'
import { DefaultConfig } from './game/rules'

type State = {
  selfId: string
  name: string
  code: string
  players: Record<string, Player>
  round: 0 | RoundNumber
  ctx?: RoundContext
  config: GameConfig
  // submissions (Phase 1 local only)
  r1_submissions: Record<string, string[]> // playerId -> ranking over subgroup
  r2_submissions: Record<string, string[]> // playerId -> ranking over all
  r3_submissions: Record<string, string[]> // playerId -> ranking over all
  r3_sabotageTarget: Record<string, string> // playerId -> target playerId
  cumulative: Scores
  // mutations
  setName: (n: string) => void
  setCode: (c: string) => void
  setPlayers: (ps: Record<string, Player>) => void
  addDummyPlayer: () => void
  setRound: (r: 0 | RoundNumber) => void
  setContext: (ctx?: RoundContext) => void
  submitR1: (pid: string, ranking: string[]) => void
  submitR2: (pid: string, ranking: string[]) => void
  submitR3: (pid: string, ranking: string[], target: string) => void
  applyRoundScores: (scores: Scores) => void
  resetSubmissions: () => void
}

let dummyCount = 1

export const useGame = create<State>((set, get) => ({
  selfId: nanoid(),
  name: '',
  code: '',
  players: {},
  round: 0,
  ctx: undefined,
  config: DefaultConfig,
  r1_submissions: {},
  r2_submissions: {},
  r3_submissions: {},
  r3_sabotageTarget: {},
  cumulative: {},
  setName: (name) => set({ name }),
  setCode: (code) => set({ code }),
  setPlayers: (players) => set({ players }),
  addDummyPlayer: () => {
    const players = { ...get().players }
    const id = nanoid()
    players[id] = { id, name: `Player ${dummyCount++}`, points: 0 }
    set({ players })
  },
  setRound: (round) => set({ round }),
  setContext: (ctx) => set({ ctx }),
  submitR1: (pid, ranking) => {
    const r = { ...get().r1_submissions, [pid]: ranking }
    set({ r1_submissions: r })
  },
  submitR2: (pid, ranking) => {
    const r = { ...get().r2_submissions, [pid]: ranking }
    set({ r2_submissions: r })
  },
  submitR3: (pid, ranking, target) => {
    const r = { ...get().r3_submissions, [pid]: ranking }
    const t = { ...get().r3_sabotageTarget, [pid]: target }
    set({ r3_submissions: r, r3_sabotageTarget: t })
  },
  applyRoundScores: (scores) => {
    const cum = { ...get().cumulative }
    for (const [pid, pts] of Object.entries(scores)) {
      cum[pid] = (cum[pid] ?? 0) + pts
    }
    set({ cumulative: cum })
  },
  resetSubmissions: () => set({
    r1_submissions: {},
    r2_submissions: {},
    r3_submissions: {},
    r3_sabotageTarget: {}
  })
}))
