import { motion } from 'motion/react'
import { FloatingGems, type GemSpot } from '../shared/FloatingGems'

// Drift positions tuned for the tall 1:3 wall.
const SPOTS: GemSpot[] = [
  { top: '4%', left: '20%', w: 20, dur: 7.5, delay: 0 },
  { top: '13%', left: '62%', w: 15, dur: 9, delay: 0.6 },
  { top: '26%', left: '30%', w: 18, dur: 8.2, delay: 1.2 },
  { top: '38%', left: '68%', w: 14, dur: 10, delay: 0.3 },
  { top: '50%', left: '24%', w: 17, dur: 8.8, delay: 1.6 },
  { top: '62%', left: '60%', w: 16, dur: 9.4, delay: 0.9 },
  { top: '74%', left: '34%', w: 19, dur: 7.8, delay: 0.2 },
  { top: '86%', left: '64%', w: 13, dur: 10.5, delay: 1.4 },
]

const ease = [0.22, 1, 0.36, 1] as const

export function AttractMode() {
  return (
    <motion.div
      className="dp-inner dp-attract"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      transition={{ duration: 0.8 }}
    >
      <div className="dp-attract-top">
        <motion.span
          className="dp-kicker"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease }}
        >
          Eight crystals · one is yours
        </motion.span>
      </div>

      <div className="dp-orbit">
        <FloatingGems spots={SPOTS} idPrefix="attract" />
      </div>

      <motion.span
        className="dp-attract-cta"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        ✦ Take the quiz to reveal yours ✦
      </motion.span>
    </motion.div>
  )
}
