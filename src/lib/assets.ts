import type { AnswerOption, CrystalId } from '../types'
import { CRYSTAL_IDS } from '../data/crystals'

const BASE = import.meta.env.BASE_URL

/** AI hero image for a crystal, dropped at public/images/crystals/<id>.png */
export const crystalImageSrc = (id: CrystalId): string => `${BASE}images/crystals/${id}.png`

/** AI scene image for an answer, dropped at public/images/options/<name>.png */
export const optionImageSrc = (name: string): string => `${BASE}images/options/${name}.png`

/** The crystal an answer leans toward most — used to theme its fallback art. */
export function primaryCrystalOf(option: AnswerOption): CrystalId {
  let best: CrystalId = CRYSTAL_IDS[0]
  let bestVal = -Infinity
  for (const id of CRYSTAL_IDS) {
    const v = option.scores[id] ?? 0
    if (v > bestVal) {
      bestVal = v
      best = id
    }
  }
  return best
}
