import { motion } from 'motion/react'
import { FloatingGems, type GemSpot } from '../shared/FloatingGems'
import { Logo } from '../shared/Logo'

const ease = [0.22, 1, 0.36, 1] as const

// Gems placed around the 16:9 perimeter so they frame, not cover, the heading.
const START_SPOTS: GemSpot[] = [
  { top: '6%', left: '7%', w: 8, dur: 7.5, delay: 0 },
  { top: '15%', left: '23%', w: 6, dur: 9, delay: 0.6 },
  { top: '8%', left: '78%', w: 7, dur: 8.2, delay: 1.2 },
  { top: '25%', left: '90%', w: 6, dur: 10, delay: 0.3 },
  { top: '66%', left: '6%', w: 7, dur: 8.8, delay: 1.6 },
  { top: '80%', left: '22%', w: 6, dur: 9.4, delay: 0.9 },
  { top: '70%', left: '83%', w: 8, dur: 7.8, delay: 0.2 },
  { top: '84%', left: '67%', w: 6, dur: 10.5, delay: 1.4 },
]

export function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      className="tw-phase tw-start"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <div className="tw-start-gems">
        <FloatingGems spots={START_SPOTS} idPrefix="start" />
      </div>

      <div className="tw-start-content">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          <Logo className="tw-brand" />
        </motion.div>

        <motion.h1
          className="tw-find"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease }}
        >
          Find your
          <br />
          crystal
        </motion.h1>

        <motion.button
          type="button"
          className="tw-cta"
          onClick={onStart}
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.42, duration: 0.6, ease }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          Begin
        </motion.button>
      </div>
    </motion.div>
  )
}
