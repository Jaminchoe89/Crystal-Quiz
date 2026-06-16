import { useState } from 'react'
import { motion } from 'motion/react'
import type { AnswerOption } from '../../types'
import { CRYSTALS } from '../../data/crystals'
import { optionImageSrc, primaryCrystalOf } from '../../lib/assets'

interface Props {
  option: AnswerOption
  index: number
  disabled: boolean
  onPick: (option: AnswerOption) => void
}

function OptionArt({ option }: { option: AnswerOption }) {
  const [failed, setFailed] = useState(false)
  const colors = CRYSTALS[primaryCrystalOf(option)].colors

  if (failed) {
    return (
      <div
        className="tw-tile-fallback"
        style={{
          background: `radial-gradient(120% 90% at 30% 20%, ${colors.light}, transparent 55%),
                       radial-gradient(120% 120% at 80% 100%, ${colors.deep}, transparent 60%),
                       linear-gradient(160deg, ${colors.base}, ${colors.deep})`,
        }}
      />
    )
  }
  return (
    <img
      className="tw-tile-img"
      src={optionImageSrc(option.image)}
      alt={option.label}
      onError={() => setFailed(true)}
      draggable={false}
    />
  )
}

export function OptionTile({ option, index, disabled, onPick }: Props) {
  return (
    <motion.button
      type="button"
      className="tw-tile"
      disabled={disabled}
      onClick={() => onPick(option)}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      transition={{ delay: 0.06 * index, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.97 }}
    >
      <OptionArt option={option} />
      <div className="tw-tile-scrim" />
      <span className="tw-tile-label">{option.label}</span>
      <motion.span
        className="tw-tile-ring"
        initial={false}
        whileHover={{ boxShadow: 'inset 0 0 0 3px var(--accent)' }}
        whileTap={{ boxShadow: 'inset 0 0 0 5px var(--accent-soft)' }}
      />
    </motion.button>
  )
}
