import type { CSSProperties } from 'react'
import type { CrystalColors, CrystalId } from '../types'
import { CRYSTALS } from '../data/crystals'

/** CSS custom properties that theme a subtree (and the shared Atmosphere). */
export function accentVars(colors: CrystalColors): CSSProperties {
  return {
    ['--accent' as string]: colors.base,
    ['--accent-soft' as string]: colors.light,
    ['--accent-deep' as string]: colors.deep,
  }
}

export function accentVarsFor(id: CrystalId | null): CSSProperties {
  if (!id) return {}
  return accentVars(CRYSTALS[id].colors)
}
