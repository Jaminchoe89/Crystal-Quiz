import { motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Short instruction shown between the title screen and the first question.
 * Because the quiz is fully picture-led (no question text), this one upfront
 * cue tells guests how to answer: just follow their eye.
 */
export function PrefaceScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <motion.div
      className="tw-phase tw-preface"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <motion.span
        className="tw-kicker"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease }}
      >
        Before we begin
      </motion.span>

      <motion.h2
        className="tw-preface-head"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7, ease }}
      >
        Choose the images
        <br />
        you&rsquo;re drawn to
      </motion.h2>

      <motion.p
        className="tw-sub"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.7, ease }}
      >
        There are no right answers. Go with your first instinct and pick whatever
        appeals to you most.
      </motion.p>

      <motion.button
        type="button"
        className="tw-cta"
        onClick={onBegin}
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.48, duration: 0.6, ease }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        Start
      </motion.button>
    </motion.div>
  )
}
