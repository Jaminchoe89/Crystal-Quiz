import type { Question } from '../types'

/**
 * Six picture-led questions. Words are kept to a short prompt + a one- or
 * two-word caption per image; the choice is meant to be made on feel.
 *
 * Scoring is deliberately balanced: every crystal is the PRIMARY (+2) answer
 * exactly three times and a SECONDARY (+1) answer exactly three times across
 * the quiz, so all eight outcomes are equally reachable. This is verified by
 * scripts/validate-scoring.mjs (simulates all 4^6 = 4096 answer paths).
 */
export const QUESTIONS: Question[] = [
  {
    id: 'place',
    prompt: 'Where would you rather wake up?',
    options: [
      { id: 'dunes', label: 'Golden dunes', image: 'q1-dunes', scores: { citrine: 2, 'strawberry-quartz': 1 } },
      { id: 'forest', label: 'Misty forest', image: 'q1-forest', scores: { aventurine: 2, 'clear-quartz': 1 } },
      { id: 'sea', label: 'Quiet sea', image: 'q1-sea', scores: { aquamarine: 2, 'rose-quartz': 1 } },
      { id: 'field', label: 'Twilight field', image: 'q1-field', scores: { amethyst: 2, obsidian: 1 } },
    ],
  },
  {
    id: 'sky',
    prompt: 'Pick a sky.',
    options: [
      { id: 'dawn', label: 'Coral dawn', image: 'q2-dawn', scores: { 'strawberry-quartz': 2, citrine: 1 } },
      { id: 'blush', label: 'Blush clouds', image: 'q2-blush', scores: { 'rose-quartz': 2, amethyst: 1 } },
      { id: 'blue', label: 'Clear blue', image: 'q2-blue', scores: { 'clear-quartz': 2, aquamarine: 1 } },
      { id: 'storm', label: 'Deep night', image: 'q2-storm', scores: { obsidian: 2, aventurine: 1 } },
    ],
  },
  {
    id: 'material',
    prompt: 'Choose something to hold.',
    options: [
      { id: 'wood', label: 'Warm wood', image: 'q3-wood', scores: { citrine: 2, aventurine: 1 } },
      { id: 'petals', label: 'Petals & silk', image: 'q3-petals', scores: { 'rose-quartz': 2, 'strawberry-quartz': 1 } },
      { id: 'stone', label: 'Smooth stone', image: 'q3-stone', scores: { obsidian: 2, 'clear-quartz': 1 } },
      { id: 'velvet', label: 'Soft velvet', image: 'q3-velvet', scores: { amethyst: 2, aquamarine: 1 } },
    ],
  },
  {
    id: 'afternoon',
    prompt: 'An afternoon feels best...',
    options: [
      { id: 'friends', label: 'Meal with friends', image: 'q4-friends', scores: { 'strawberry-quartz': 2, 'rose-quartz': 1 } },
      { id: 'garden', label: 'Morning in the garden', image: 'q4-garden', scores: { aventurine: 2, citrine: 1 } },
      { id: 'studio', label: 'A clear schedule', image: 'q4-studio', scores: { 'clear-quartz': 2, obsidian: 1 } },
      { id: 'water', label: 'By the water', image: 'q4-water', scores: { aquamarine: 2, amethyst: 1 } },
    ],
  },
  {
    id: 'light',
    prompt: 'Pick a light.',
    options: [
      { id: 'sunbeam', label: 'Golden Hour', image: 'q5-sunbeam', scores: { citrine: 2, 'strawberry-quartz': 1 } },
      { id: 'ripple', label: 'Water reflections', image: 'q5-ripple', scores: { aquamarine: 2, 'clear-quartz': 1 } },
      { id: 'campfire', label: 'Campfire', image: 'q5-campfire', scores: { obsidian: 2, amethyst: 1 } },
      { id: 'dawnglow', label: 'Sunrise', image: 'q5-dawnglow', scores: { 'rose-quartz': 2, aventurine: 1 } },
    ],
  },
  {
    id: 'flower',
    prompt: 'Pick a flower.',
    options: [
      { id: 'peony', label: 'Peony', image: 'q6-peony', scores: { 'strawberry-quartz': 2, citrine: 1 } },
      { id: 'sprig', label: 'Chrysanthemum', image: 'q6-bloom', scores: { aventurine: 2, aquamarine: 1 } },
      { id: 'daisy', label: 'Daisy', image: 'q6-daisy', scores: { 'clear-quartz': 2, 'rose-quartz': 1 } },
      { id: 'iris', label: 'Iris', image: 'q6-iris', scores: { amethyst: 2, obsidian: 1 } },
    ],
  },
]

export const TOTAL_QUESTIONS = QUESTIONS.length
