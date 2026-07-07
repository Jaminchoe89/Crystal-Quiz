import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { Atmosphere, ConnDot } from '../shared/Atmosphere'
import { StartScreen } from './StartScreen'
import { PrefaceScreen } from './PrefaceScreen'
import { QuestionScreen } from './QuestionScreen'
import { ResultScreen } from './ResultScreen'
import { QUESTIONS, TOTAL_QUESTIONS } from '../../data/questions'
import { CRYSTALS } from '../../data/crystals'
import { leader, resolve, tally } from '../../lib/scoring'
import { accentVarsFor } from '../../lib/theme'
import { useSync } from '../../lib/sync'
import type { AnswerOption, CrystalId } from '../../types'

type Phase = 'start' | 'preface' | 'question' | 'result'

// Auto-return to the start screen after inactivity, so the kiosk resets itself
// when someone walks away mid-quiz or lingers on their result.
const IDLE_RESULT_MS = 30000
const IDLE_QUESTION_MS = 75000

export function TouchApp() {
  const { connected, send } = useSync()
  const [phase, setPhase] = useState<Phase>('start')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerOption[]>([])
  const [result, setResult] = useState<CrystalId | null>(null)
  const lockRef = useRef(false)

  const leaningId = useMemo<CrystalId | null>(
    () => result ?? leader(tally(answers)),
    [result, answers],
  )

  const reset = useCallback(() => {
    lockRef.current = false
    setPhase('start')
    setIndex(0)
    setAnswers([])
    setResult(null)
    send({ type: 'reset' })
  }, [send])

  // Title "Begin" opens the instruction preface; the wall stays in attract
  // until the guest actually starts answering.
  const openPreface = useCallback(() => setPhase('preface'), [])

  const start = useCallback(() => {
    setAnswers([])
    setIndex(0)
    setResult(null)
    setPhase('question')
    send({ type: 'start', total: TOTAL_QUESTIONS })
  }, [send])

  const pick = useCallback(
    (option: AnswerOption) => {
      if (lockRef.current) return
      lockRef.current = true

      const nextAnswers = [...answers, option]
      setAnswers(nextAnswers)

      const isLast = index + 1 >= TOTAL_QUESTIONS
      if (isLast) {
        const crystalId = resolve(nextAnswers)
        setResult(crystalId)
        setPhase('result')
        send({ type: 'reveal', crystalId })
        // allow the next interaction after the result settles
        window.setTimeout(() => (lockRef.current = false), 700)
      } else {
        const nextIndex = index + 1
        send({
          type: 'progress',
          step: nextIndex,
          total: TOTAL_QUESTIONS,
          leaningId: leader(tally(nextAnswers)),
        })
        setIndex(nextIndex)
        window.setTimeout(() => (lockRef.current = false), 450)
      }
    },
    [answers, index, send],
  )

  // Make sure a freshly-loaded / reconnected touch screen puts the wall at idle.
  useEffect(() => {
    if (connected && phase === 'start') send({ type: 'reset' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected])

  // Inactivity reset.
  useEffect(() => {
    if (phase === 'start') return
    const ms = phase === 'result' ? IDLE_RESULT_MS : IDLE_QUESTION_MS
    const t = window.setTimeout(reset, ms)
    return () => window.clearTimeout(t)
  }, [phase, index, reset])

  const crystal = result ? CRYSTALS[result] : null

  return (
    <div className="screen kiosk" style={accentVarsFor(leaningId)}>
      <Atmosphere />
      <ConnDot connected={connected} />
      <div className="tw">
        <div className="tw-stage" style={{ position: 'relative' }}>
          <AnimatePresence mode="wait">
            {phase === 'start' && <StartScreen key="start" onStart={openPreface} />}
            {phase === 'preface' && <PrefaceScreen key="preface" onBegin={start} />}
            {phase === 'question' && (
              <QuestionScreen
                key={QUESTIONS[index].id}
                question={QUESTIONS[index]}
                index={index}
                total={TOTAL_QUESTIONS}
                locked={false}
                onPick={pick}
              />
            )}
            {phase === 'result' && crystal && (
              <ResultScreen key="result" crystal={crystal} onRestart={reset} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
