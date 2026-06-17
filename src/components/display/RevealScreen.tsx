import { motion } from 'motion/react'
import type { CrystalId } from '../../types'
import { CRYSTALS } from '../../data/crystals'
import { CrystalImage } from '../shared/CrystalImage'
import { Logo } from '../shared/Logo'

const ease = [0.22, 1, 0.36, 1] as const

// Deterministic-ish sparkle field around the hero.
const SPARKS = Array.from({ length: 14 }).map((_, i) => ({
  left: `${(i * 53) % 100}%`,
  delay: (i % 7) * 0.4,
  dur: 3 + (i % 5) * 0.6,
  size: 4 + (i % 4) * 3,
  drift: 30 + (i % 6) * 12,
}))

export function RevealScreen({ crystalId }: { crystalId: CrystalId }) {
  const crystal = CRYSTALS[crystalId]

  return (
    <motion.div
      className="dp-inner dp-reveal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      transition={{ duration: 0.5 }}
    >
      {/* one-shot light bloom */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(60% 40% at 50% 38%, color-mix(in oklab, var(--accent-soft) 70%, white), transparent 70%)',
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 0.9, 0], scale: [0.6, 1.4, 1.8] }}
        transition={{ duration: 1.6, ease, times: [0, 0.25, 1] }}
      />

      <motion.span
        className="dp-reveal-kicker"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease }}
      >
        Your crystal is
      </motion.span>

      <div className="dp-hero">
        {/* glow halo */}
        <motion.div
          style={{
            position: 'absolute',
            inset: '-6%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, color-mix(in oklab, var(--accent) 55%, transparent), transparent 65%)',
            filter: 'blur(18px)',
          }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: [0.5, 0.85, 0.5], scale: 1 }}
          transition={{
            opacity: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: 1.1, ease, delay: 0.2 },
          }}
        />

        {/* sparkles */}
        {SPARKS.map((s, i) => (
          <motion.span
            key={i}
            style={{
              position: 'absolute',
              left: s.left,
              bottom: '8%',
              width: s.size,
              height: s.size,
              borderRadius: '999px',
              background: 'var(--accent-soft)',
              boxShadow: '0 0 12px var(--accent-soft)',
            }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], y: [-10, -s.drift * 4] }}
            transition={{ duration: s.dur, repeat: Infinity, ease: 'easeOut', delay: 0.8 + s.delay }}
          />
        ))}

        <motion.div
          style={{ position: 'absolute', inset: 0 }}
          initial={{ opacity: 0, scale: 0.5, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: [0, -14, 0] }}
          transition={{
            opacity: { delay: 0.5, duration: 0.8, ease },
            scale: { delay: 0.5, duration: 1, ease: [0.16, 1.2, 0.3, 1] },
            y: { delay: 1.4, duration: 7, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <CrystalImage crystal={crystal} className="dp-hero-img" />
        </motion.div>
      </div>

      <motion.h1
        className="dp-reveal-name"
        initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 0.85, duration: 0.9, ease }}
      >
        {crystal.name}
      </motion.h1>

      <motion.span
        className="dp-reveal-arch"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, duration: 0.7, ease }}
      >
        {crystal.archetype}
      </motion.span>

      <motion.p
        className="dp-reveal-tag"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.7, ease }}
      >
        {crystal.tagline}
      </motion.p>

      <motion.div
        className="dp-reveal-traits"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.38, duration: 0.7, ease }}
      >
        {crystal.traits.map((t) => (
          <span key={t} className="dp-reveal-trait">
            {t}
          </span>
        ))}
      </motion.div>

      <motion.div
        style={{ marginTop: '2vh' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.55, duration: 0.8, ease }}
      >
        <Logo className="dp-brand-foot" />
      </motion.div>
    </motion.div>
  )
}
