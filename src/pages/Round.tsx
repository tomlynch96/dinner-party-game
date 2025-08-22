import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGame } from '../store'
import RankList from '../components/RankList'
import { scoreRankingDescending, sumScores, applySabotage } from '../game/rules'
import type { PlayerId, RoundNumber, Scores } from '../game/types'

export default function Round() {
  const { code, n } = useParams()
  const nav = useNavigate()
  const round = (parseInt(n || '0', 10) as RoundNumber)
  const {
    players, selfId, ctx, submitR1, submitR2, submitR3,
    r1_submissions, r2_submissions, r3_submissions, r3_sabotageTarget,
    applyRoundScores, cumulative, config
  } = useGame()

  const ids = useMemo(() => Object.keys(players), [players])
  const names = useMemo(() => {
    const m: Record<string, string> = {}
    ids.forEach(id => m[id] = players[id].name)
    return m
  }, [ids, players])

  const [localRanking, setLocalRanking] = useState<string[]>([])
  const [localTarget, setLocalTarget] = useState<string>('')

  const submit = () => {
    if (round === 1) {
      if (!localRanking.length) { alert('Rank your subgroup first'); return; }
      submitR1(selfId, localRanking)
    }
    if (round === 2) {
      if (localRanking.length !== ids.length) { alert('Rank the whole group'); return; }
      submitR2(selfId, localRanking)
    }
    if (round === 3) {
      if (localRanking.length !== ids.length) { alert('Rank the whole group'); return; }
      if (!localTarget) { alert('Pick a sabotage target'); return; }
      if (localTarget === selfId) { alert('You cannot sabotage yourself'); return; }
      submitR3(selfId, localRanking, localTarget)
    }
    alert('Submitted!')
  }

  const finishRound = () => {
    // Local-only scoring for Phase 1 (hostless demo)
    let scores: Scores = {}
    if (round === 1) {
      // For demo: each player's submitted ranking of their subgroup contributes N..1 to those ranked.
      for (const [pid, ranking] of Object.entries(r1_submissions)) {
        scores = sumScores(scores, scoreRankingDescending(ranking))
      }
    }
    if (round === 2) {
      for (const [, ranking] of Object.entries(r2_submissions)) {
        scores = sumScores(scores, scoreRankingDescending(ranking))
      }
    }
    if (round === 3) {
      let base: Scores = {}
      for (const [, ranking] of Object.entries(r3_submissions)) {
        base = sumScores(base, scoreRankingDescending(ranking))
      }
      scores = applySabotage(base, r3_sabotageTarget, config.sabotageFactor)
    }

    applyRoundScores(scores)
    nav(`/g/${code}/results/${round}`)
  }

  // Determine what to rank this round
  let toRank: PlayerId[] = []
  let helpText = ''
  if (round === 1 && ctx && ctx.round === 1) {
    toRank = ctx.subgroupByPlayer[selfId] ?? []
    helpText = 'Rank your assigned subgroup (best → worst).'
  } else if (round === 2) {
    toRank = ids
    helpText = 'Rank the whole group (best → worst).'
  } else if (round === 3) {
    toRank = ids
    helpText = 'Rank the whole group and pick a sabotage target.'
  }

  return (
    <div className="grid gap-6">
      <div className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Round {round}</h2>
          <div className="text-sm opacity-70">{round === 1 ? 'Subgroup ranking' : round === 2 ? 'Full-group ranking' : 'Full-group + sabotage'}</div>
        </div>
        <p className="opacity-80 mt-2">{helpText}</p>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">Your ranking</h3>
        {toRank.length === 0 ? (
          <p className="opacity-70">No subgroup assigned yet. Go back and start Round {round} from the Lobby.</p>
        ) : (
          <>
            <RankList ids={toRank} names={names} onChange={setLocalRanking} />
            {round === 3 && (
              <div className="mt-4">
                <label className="block mb-2 opacity-80">Sabotage target</label>
                <select className="input" value={localTarget} onChange={e => setLocalTarget(e.target.value)}>
                  <option value="">Select a player</option>
                  {ids.filter(id => id !== selfId).map(id => (
                    <option key={id} value={id}>{names[id]}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="mt-4 flex gap-3">
              <button className="btn" onClick={submit}>Submit</button>
              <button className="btn" onClick={finishRound}>End Round (demo)</button>
              <button className="btn" onClick={() => nav(`/g/${code}`)}>Back to Lobby</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

