import { motion } from 'motion/react'
import type { AnswerOption, Question } from '../../types'
import { OptionTile } from './OptionTile'
import { ProgressDots } from './ProgressDots'
import { Logo } from '../shared/Logo'

const ease = [0.22, 1, 0.36, 1] as const

interface Props {
  question: Question
  index: number
  total: number
  locked: boolean
  onPick: (option: AnswerOption) => void
}

export function QuestionScreen({ question, index, total, locked, onPick }: Props) {
  return (
    <motion.div
      className="tw-phase tw-question"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.28, ease } }}
      transition={{ duration: 0.5, ease }}
    >
      <div className="tw-qhead">
        <Logo className="brand-mark" />
        <ProgressDots total={total} current={index} />
      </div>

      <div className="tw-grid">
        {question.options.map((option, i) => (
          <OptionTile key={option.id} option={option} index={i} disabled={locked} onPick={onPick} />
        ))}
      </div>
    </motion.div>
  )
}
