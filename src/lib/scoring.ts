import type { AnswerOption, CrystalId } from '../types'
import { CRYSTAL_IDS } from '../data/crystals'

export type Scores = Record<CrystalId, number>

export function emptyScores(): Scores {
  return CRYSTAL_IDS.reduce((acc, id) => {
    acc[id] = 0
    return acc
  }, {} as Scores)
}

/**
 * Live-hint fallback order. Only used for the "leaning" crystal shown on the
 * display mid-quiz, where the exact pick on a tie does not matter.
 */
export const LEANING_ORDER: CrystalId[] = [
  'obsidian',
  'strawberry-quartz',
  'clear-quartz',
  'aventurine',
  'aquamarine',
  'amethyst',
  'rose-quartz',
  'citrine',
]

export function tally(answers: AnswerOption[]): Scores {
  const scores = emptyScores()
  for (const answer of answers) {
    for (const [id, pts] of Object.entries(answer.scores)) {
      scores[id as CrystalId] += pts ?? 0
    }
  }
  return scores
}

/**
 * The current front-runner, for the live "leaning" hint sent to the display.
 * Returns null when nothing has been scored yet. Ties fall back to a fixed
 * order — this is only a hint, so the bias is harmless here.
 */
export function leader(scores: Scores): CrystalId | null {
  const total = CRYSTAL_IDS.reduce((sum, id) => sum + scores[id], 0)
  if (total === 0) return null

  let best: CrystalId = LEANING_ORDER[0]
  let bestVal = -Infinity
  for (const id of LEANING_ORDER) {
    if (scores[id] > bestVal) {
      bestVal = scores[id]
      best = id
    }
  }
  return best
}

/** Stable string hash (djb2) used to scatter ties evenly across answer paths. */
export function hashSeed(parts: string[]): number {
  let h = 5381
  for (const s of parts) {
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0
  }
  return h
}

/**
 * Final outcome for a completed set of answers. When several crystals tie for
 * the top score, the winner is chosen by hashing the chosen answer ids rather
 * than always favouring one crystal — this keeps the eight outcomes close to
 * evenly distributed (verified by scripts/validate-scoring.mjs).
 */
export function resolve(answers: AnswerOption[]): CrystalId {
  const scores = tally(answers)
  const max = Math.max(...CRYSTAL_IDS.map((id) => scores[id]))
  const tied = CRYSTAL_IDS.filter((id) => scores[id] === max) // canonical order
  if (tied.length === 1) return tied[0]
  const seed = hashSeed(answers.map((a) => a.id))
  return tied[seed % tied.length]
}
