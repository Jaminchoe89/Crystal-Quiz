import { motion } from 'motion/react'
import { CRYSTALS, CRYSTAL_IDS } from '../../data/crystals'
import { GradientGem } from './GradientGem'

export interface GemSpot {
  top: string
  left: string
  /** width as a % of the container */
  w: number
  dur: number
  delay: number
}

const ease = [0.22, 1, 0.36, 1] as const

/**
 * The eight crystal gems, each with its own silhouette, drifting gently at the
 * given spots. Shared by the display attract wall and the touch start screen.
 * The parent must be positioned (relative/absolute).
 */
export function FloatingGems({ spots, idPrefix }: { spots: GemSpot[]; idPrefix: string }) {
  return (
    <>
      {CRYSTAL_IDS.map((id, i) => {
        const s = spots[i % spots.length]
        const crystal = CRYSTALS[id]
        return (
          <motion.div
            key={id}
            style={{ position: 'absolute', top: s.top, left: s.left, width: `${s.w}%` }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0.5, 0.9, 0.5], y: [0, -14, 0], scale: 1, rotate: [-3, 3, -3] }}
            transition={{
              opacity: { duration: s.dur, repeat: Infinity, ease: 'easeInOut', delay: s.delay },
              y: { duration: s.dur, repeat: Infinity, ease: 'easeInOut', delay: s.delay },
              rotate: { duration: s.dur * 1.4, repeat: Infinity, ease: 'easeInOut', delay: s.delay },
              scale: { duration: 1, delay: 0.4 + i * 0.06, ease },
            }}
          >
            <GradientGem colors={crystal.colors} shape={id} uid={`${idPrefix}-${id}`} style={{ width: '100%' }} />
          </motion.div>
        )
      })}
    </>
  )
}
