// Standalone balance check for the quiz scoring.
//
// It mirrors the score vectors in src/data/questions.ts and the tie-break order
// in src/lib/scoring.ts, then simulates EVERY possible answer path (4^6 = 4096)
// and reports how often each crystal is the outcome. Run: npm run validate
//
// Keep the two arrays below in sync with the TS source if you edit questions.

const IDS = [
  'citrine',
  'rose-quartz',
  'amethyst',
  'clear-quartz',
  'aventurine',
  'aquamarine',
  'strawberry-quartz',
  'obsidian',
]

// Mirror of src/data/questions.ts option ids (used for the tie-break hash)
const OPTION_IDS = [
  ['dunes', 'forest', 'sea', 'field'],
  ['dawn', 'blush', 'blue', 'storm'],
  ['wood', 'petals', 'stone', 'velvet'],
  ['friends', 'garden', 'studio', 'water'],
  ['sunbeam', 'ripple', 'campfire', 'dawnglow'],
  ['peony', 'sprig', 'daisy', 'iris'],
]

// Mirror of src/lib/scoring.ts hashSeed (djb2)
function hashSeed(parts) {
  let h = 5381
  for (const s of parts) {
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0
  }
  return h
}

// Mirror of src/data/questions.ts option score vectors
const QUESTIONS = [
  [
    { citrine: 2, 'strawberry-quartz': 1 },
    { aventurine: 2, 'clear-quartz': 1 },
    { aquamarine: 2, 'rose-quartz': 1 },
    { amethyst: 2, obsidian: 1 },
  ],
  [
    { 'strawberry-quartz': 2, citrine: 1 },
    { 'rose-quartz': 2, amethyst: 1 },
    { 'clear-quartz': 2, aquamarine: 1 },
    { obsidian: 2, aventurine: 1 },
  ],
  [
    { citrine: 2, aventurine: 1 },
    { 'rose-quartz': 2, 'strawberry-quartz': 1 },
    { obsidian: 2, 'clear-quartz': 1 },
    { amethyst: 2, aquamarine: 1 },
  ],
  [
    { 'strawberry-quartz': 2, 'rose-quartz': 1 },
    { aventurine: 2, citrine: 1 },
    { 'clear-quartz': 2, obsidian: 1 },
    { aquamarine: 2, amethyst: 1 },
  ],
  [
    { citrine: 2, 'strawberry-quartz': 1 },
    { aquamarine: 2, 'clear-quartz': 1 },
    { obsidian: 2, amethyst: 1 },
    { 'rose-quartz': 2, aventurine: 1 },
  ],
  [
    { 'strawberry-quartz': 2, citrine: 1 },
    { aventurine: 2, aquamarine: 1 },
    { 'clear-quartz': 2, 'rose-quartz': 1 },
    { amethyst: 2, obsidian: 1 },
  ],
]

function resolve(choiceIdxs) {
  const scores = Object.fromEntries(IDS.map((id) => [id, 0]))
  choiceIdxs.forEach((optIdx, qIdx) => {
    const vec = QUESTIONS[qIdx][optIdx]
    for (const [id, pts] of Object.entries(vec)) scores[id] += pts
  })
  const max = Math.max(...IDS.map((id) => scores[id]))
  const tied = IDS.filter((id) => scores[id] === max) // canonical order
  if (tied.length === 1) return tied[0]
  const seed = hashSeed(choiceIdxs.map((optIdx, qIdx) => OPTION_IDS[qIdx][optIdx]))
  return tied[seed % tied.length]
}

const counts = Object.fromEntries(IDS.map((id) => [id, 0]))
const n = QUESTIONS.length
const total = Math.pow(4, n)
for (let i = 0; i < total; i++) {
  const idxs = []
  let x = i
  for (let q = 0; q < n; q++) {
    idxs.push(x % 4)
    x = Math.floor(x / 4)
  }
  counts[resolve(idxs)]++
}

console.log(`\nOutcome distribution across all ${total} answer paths:\n`)
const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
for (const [id, c] of sorted) {
  const pct = ((c / total) * 100).toFixed(1)
  const bar = '#'.repeat(Math.round((c / total) * 120))
  console.log(`  ${id.padEnd(18)} ${String(c).padStart(4)}  ${pct.padStart(5)}%  ${bar}`)
}

const unreachable = IDS.filter((id) => counts[id] === 0)
const pcts = IDS.map((id) => (counts[id] / total) * 100)
const spread = Math.max(...pcts) - Math.min(...pcts)
console.log('')
console.log(`  even share would be ${(100 / IDS.length).toFixed(1)}% each`)
console.log(`  spread (max - min): ${spread.toFixed(1)} percentage points`)
if (unreachable.length) {
  console.error(`  ✗ UNREACHABLE: ${unreachable.join(', ')}`)
  process.exit(1)
}
console.log('  ✓ all eight crystals are reachable\n')
