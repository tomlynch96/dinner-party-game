export type PlayerId = string;

export type Player = {
  id: PlayerId;
  name: string;
  points: number;
};

export type RoundNumber = 1 | 2 | 3;

export type RoundContextR1 = {
  round: 1;
  subgroupByPlayer: Record<PlayerId, PlayerId[]>; // each player’s subgroup to rank
};

export type RoundContextR2 = { round: 2 };
export type RoundContextR3 = { round: 3 };

export type RoundContext = RoundContextR1 | RoundContextR2 | RoundContextR3;

export type Ranking = PlayerId[]; // sorted best → worst

export type Submissions = {
  r1?: Record<PlayerId, Ranking>;
  r2?: Record<PlayerId, Ranking>;
  r3?: { rankings: Record<PlayerId, Ranking>; sabotageTarget: Record<PlayerId, PlayerId> };
};

export type Scores = Record<PlayerId, number>;

export type GameConfig = {
  subgroupSize: number;      // Round 1 subgroup size (e.g., 3 or 4)
  normalPlayPoints: number;  // base points per position in ranking calculations
  sabotageFactor: number;    // Round 3 double points factor (e.g., 2)
};
