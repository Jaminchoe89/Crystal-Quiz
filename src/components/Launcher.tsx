import { motion } from 'motion/react'
import { Atmosphere } from './shared/Atmosphere'

const ease = [0.22, 1, 0.36, 1] as const

export function Launcher() {
  const host = `${window.location.protocol}//${window.location.host}`

  return (
    <div className="screen">
      <Atmosphere />
      <div className="lc">
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
          Crystal Quiz
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.7 }}
        >
          Open each screen on its own machine. They sync automatically over the network through this
          relay — no further setup.
        </motion.p>

        <motion.div
          className="lc-grid"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.7, ease }}
        >
          <a className="lc-card" href="?screen=touch">
            <span className="k">16:9 touch screen</span>
            <span className="t">Open the quiz →</span>
            <span className="d">The interactive kiosk guests tap through. Run this on the touch display.</span>
          </a>
          <a className="lc-card" href="?screen=display">
            <span className="k">1 × 3 m wall</span>
            <span className="t">Open the display →</span>
            <span className="d">The tall reveal wall. Run this fullscreen on the portrait screen.</span>
          </a>
        </motion.div>

        <motion.p
          className="lc-host"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          On the other machine, browse to <code>{host}</code> and pick a screen — or go straight to{' '}
          <code>{host}/?screen=display</code>.
        </motion.p>
      </div>
    </div>
  )
}
