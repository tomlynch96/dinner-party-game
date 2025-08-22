// RIGHT
import type { PlayerId, RoundContext, RoundContextR1, Scores, GameConfig } from './types'

// Deterministic shuffle using a seed (so round contexts are reproducible)
function seededShuffle<T>(arr: T[], seed: string): T[] {
  const a = [...arr];
  let s = seed.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    const j = Math.floor(r * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildRound1Context(
  players: PlayerId[],
  subgroupSize: number,
  seed: string
): RoundContextR1 {
  const shuffled = seededShuffle(players, seed);
  const subgroupByPlayer: Record<PlayerId, PlayerId[]> = {};
  for (let i = 0; i < shuffled.length; i++) {
    const p = shuffled[i];
    // pick a window of players around i (excluding self), wrap-around
    const window: PlayerId[] = [];
    let j = i + 1;
    while (window.length < subgroupSize && window.length < players.length - 1) {
      window.push(shuffled[j % shuffled.length]);
      j++;
    }
    subgroupByPlayer[p] = window;
  }
  return { round: 1, subgroupByPlayer };
}

// Simple scoring helpers for rankings.
// For a ranking of length N (best → worst), assign descending scores N, N-1, ..., 1.
export function scoreRankingDescending(rank: PlayerId[]): Scores {
  const N = rank.length;
  const out: Scores = {};
  rank.forEach((pid, idx) => (out[pid] = (N - idx)));
  return out;
}

// Merge two score maps by sum.
export function sumScores(a: Scores, b: Scores): Scores {
  const out: Scores = { ...a };
  for (const [pid, pts] of Object.entries(b)) out[pid] = (out[pid] ?? 0) + pts;
  return out;
}

// Round 3 sabotage adjustment:
// saboteur gets factor×(their round-3 base points), and the same amount is subtracted from the target.
export function applySabotage(
  base: Scores,
  sabotageTargetOf: Record<PlayerId, PlayerId>,
  factor: number
): Scores {
  const out: Scores = { ...base };
  for (const [saboteur, target] of Object.entries(sabotageTargetOf)) {
    const sabPts = (base[saboteur] ?? 0) * (factor - 1); // extra over base
    if (sabPts > 0) {
      out[saboteur] = (out[saboteur] ?? 0) + sabPts;
      out[target] = (out[target] ?? 0) - sabPts;
    }
  }
  return out;
}

export const DefaultConfig: GameConfig = {
  subgroupSize: 3,
  normalPlayPoints: 1,  // we use position-based scores (N..1), this is a scalar if you later want to scale
  sabotageFactor: 2
};
