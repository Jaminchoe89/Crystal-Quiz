import { motion } from 'motion/react'
import type { Crystal } from '../../types'

const ease = [0.22, 1, 0.36, 1] as const

interface Props {
  crystal: Crystal
  onRestart: () => void
}

export function ResultScreen({ crystal, onRestart }: Props) {
  return (
    <motion.div
      className="tw-phase tw-result"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.6, ease }}
    >
      <motion.span
        className="tw-result-kicker"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
      >
        Your crystal is
      </motion.span>

      <motion.h2
        className="tw-result-name"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.7, ease }}
      >
        {crystal.name}
      </motion.h2>

      <motion.span
        className="tw-result-arch"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {crystal.archetype}
      </motion.span>

      <motion.p
        className="tw-result-tag"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {crystal.tagline}
      </motion.p>

      <motion.div
        className="tw-traits"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.62, duration: 0.6 }}
      >
        {crystal.traits.map((t) => (
          <span key={t} className="tw-trait">
            {t}
          </span>
        ))}
      </motion.div>

      <motion.p
        className="tw-glance"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.6, 1] }}
        transition={{ delay: 0.8, duration: 2.4, repeat: Infinity, repeatType: 'reverse' }}
      >
        ✦ Look up — your crystal is on the wall ✦
      </motion.p>

      <motion.button
        type="button"
        className="tw-restart"
        onClick={onRestart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        whileTap={{ scale: 0.96 }}
      >
        Start again
      </motion.button>
    </motion.div>
  )
}
