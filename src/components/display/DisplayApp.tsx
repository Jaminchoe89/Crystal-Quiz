import { AnimatePresence } from 'motion/react'
import { Atmosphere } from '../shared/Atmosphere'
import { AttractMode } from './AttractMode'
import { ProgressAmbient } from './ProgressAmbient'
import { RevealScreen } from './RevealScreen'
import { accentVarsFor } from '../../lib/theme'
import { useSync } from '../../lib/sync'
import type { CrystalId } from '../../types'

export function DisplayApp() {
  const { state } = useSync()
  const phase = state?.phase ?? 'idle'
  const accentId: CrystalId | null =
    phase === 'reveal' ? state?.crystalId ?? null : phase === 'quiz' ? state?.leaningId ?? null : null

  return (
    <div className="screen kiosk dp" style={accentVarsFor(accentId)}>
      <Atmosphere />
      <AnimatePresence mode="wait">
        {phase === 'idle' && <AttractMode key="attract" />}
        {phase === 'quiz' && (
          <ProgressAmbient key="quiz" step={state?.step ?? 0} total={state?.total || 6} />
        )}
        {phase === 'reveal' && state?.crystalId && (
          <RevealScreen key={`reveal-${state.crystalId}-${state.rev}`} crystalId={state.crystalId} />
        )}
      </AnimatePresence>
    </div>
  )
}
