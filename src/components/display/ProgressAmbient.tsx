import { motion } from 'motion/react'

interface Props {
  step: number // answers given so far (0..total)
  total: number
}

export function ProgressAmbient({ step, total }: Props) {
  const fraction = Math.max(0, Math.min(1, step / total))

  return (
    <motion.div
      className="dp-inner dp-progress"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      transition={{ duration: 0.7 }}
    >
      <motion.span
        className="dp-progress-label"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Your crystal is forming
      </motion.span>

      {/* breathing orb that intensifies as answers accumulate */}
      <motion.div
        style={{
          width: '46%',
          aspectRatio: '1 / 1',
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 50% 45%, color-mix(in oklab, var(--accent-soft) 85%, white) 0%, var(--accent) 38%, color-mix(in oklab, var(--accent-deep) 80%, transparent) 70%, transparent 75%)',
          filter: 'blur(2px)',
        }}
        animate={{
          scale: [0.92 + fraction * 0.25, 1.02 + fraction * 0.25, 0.92 + fraction * 0.25],
          opacity: 0.55 + fraction * 0.4,
        }}
        transition={{ scale: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 1 } }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3vh', width: '100%' }}>
        <div className="dp-progress-bar">
          <motion.div
            className="dp-progress-fill"
            animate={{ width: `${fraction * 100}%` }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div style={{ display: 'flex', gap: '1.2rem' }}>
          {Array.from({ length: total }).map((_, i) => (
            <motion.span
              key={i}
              style={{
                width: 'clamp(10px, 2vw, 18px)',
                height: 'clamp(10px, 2vw, 18px)',
                borderRadius: '999px',
                background: i < step ? 'var(--accent-soft)' : 'rgba(255,255,255,0.14)',
              }}
              animate={i === step ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
