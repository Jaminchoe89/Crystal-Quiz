// Downloads generated images into public/images using a job-id -> path map.
// Resolves each job's URL from a saved show_generations JSON dump (arg 1),
// falling back to any *.txt dump passed. Usage: node scripts/fetch-images.mjs <dump.json>
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

const MAP = {
  // crystals
  '471c74f1-4848-43a1-b72c-1cefdc9d541f': 'public/images/crystals/citrine.png',
  '71ec5afc-ddce-4507-80d1-17b972764a05': 'public/images/crystals/rose-quartz.png',
  '73b1e800-ede9-45f8-9eb2-4c8c43f0d0a0': 'public/images/crystals/amethyst.png',
  'a9efac5b-fbdd-41d3-a826-f03e8ebf0832': 'public/images/crystals/clear-quartz.png',
  '7e28a31c-d055-40b6-9e27-a6fd8ef54a1c': 'public/images/crystals/aventurine.png',
  'bbb1a5f7-0be3-4e6e-9620-672853d79a31': 'public/images/crystals/aquamarine.png',
  'f1d43fcb-611c-4964-a154-a01067dcb48c': 'public/images/crystals/strawberry-quartz.png',
  '8ed69ac5-004d-4a92-a89b-66d832ddf26a': 'public/images/crystals/obsidian.png',
  // options
  '331a9d81-ee8f-43b7-852b-254d3cd81280': 'public/images/options/q1-dunes.png',
  'fc507dfa-35c0-4300-8af0-024665159fe8': 'public/images/options/q1-forest.png',
  'be53d4b7-741b-418f-8fc2-6c8ae0638f18': 'public/images/options/q1-sea.png',
  '064b1e5b-b26c-465f-8dd8-8c3eb3c38867': 'public/images/options/q1-field.png',
  '3b97cbb1-09cb-4438-b1e3-09b0c59d349b': 'public/images/options/q2-dawn.png',
  'af810eab-d92e-42e8-bb07-177a46803fb9': 'public/images/options/q2-blush.png',
  'dfa97ecc-1ba2-4929-a604-ee2276ad432b': 'public/images/options/q2-blue.png',
  'a2b72e64-3ecd-4d91-93cc-20b4434072a3': 'public/images/options/q2-storm.png',
  '487eae97-67ae-4562-be48-2f90990d6e8e': 'public/images/options/q3-amber.png',
  '2b35ac78-4e6f-4757-9e23-dab1117a1475': 'public/images/options/q3-petals.png',
  'd46814d4-d791-42c7-a048-35b55332a5bf': 'public/images/options/q3-glass.png',
  '8a73b9e0-4be2-4c3c-946c-48a254c1fe2c': 'public/images/options/q3-geode.png',
  '95227c48-04d4-4dcb-ac00-a8c91b15cecf': 'public/images/options/q4-friends.png',
  '839ffe76-112d-4361-8876-8904a5e864d7': 'public/images/options/q4-garden.png',
  '37c4188e-4cef-4404-a0ba-459116dce6e6': 'public/images/options/q4-studio.png',
  'b812d181-bba3-4af4-be6c-6f0aac2d03cb': 'public/images/options/q4-water.png',
  '0ad1bd9d-424a-4d05-9e4e-2373498367c0': 'public/images/options/q5-sunbeam.png',
  '2b34135b-8fad-4010-949c-988afe2a59db': 'public/images/options/q5-ripple.png',
  '75111773-c74d-4cdd-8611-15520f54f277': 'public/images/options/q5-candle.png',
  '8bb7e534-70aa-454d-9068-8f09b8a4503f': 'public/images/options/q5-dawnglow.png',
  '5900697b-f6a4-43ed-bec5-7ce3466fee57': 'public/images/options/q6-sparkle.png',
  'cd338a7a-40f0-40cb-9b2e-dd9238100c61': 'public/images/options/q6-spiral.png',
  '025a4836-957c-4cbf-89e0-375eac56184f': 'public/images/options/q6-prism.png',
  'ca873421-10c0-4180-bfdc-5620c9d5f9e9': 'public/images/options/q6-nebula.png',
}

// extra direct URL overrides (id -> url), merged on top of the dump
const DIRECT = {
  '471c74f1-4848-43a1-b72c-1cefdc9d541f':
    'https://d8j0ntlcm91z4.cloudfront.net/user_3DF1Ljo4GCpQGc784lu53jrCIFy/hf_20260616_020117_471c74f1-4848-43a1-b72c-1cefdc9d541f.png',
}

const dumpPath = process.argv[2]
const urls = { ...DIRECT }
if (dumpPath && fs.existsSync(dumpPath)) {
  const data = JSON.parse(fs.readFileSync(dumpPath, 'utf8'))
  const items = data.items || data.generations || []
  for (const it of items) {
    const u = it?.results?.rawUrl || it?.results?.raw_url
    if (it?.id && u) urls[it.id] = u
  }
}

const entries = Object.entries(MAP)
let ok = 0
const missing = []

for (const [id, rel] of entries) {
  const url = urls[id]
  if (!url) {
    missing.push(rel + '  (no url yet — job pending?)')
    continue
  }
  const dest = path.join(ROOT, rel)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    fs.writeFileSync(dest, buf)
    ok++
    console.log(`  ✓ ${rel}  (${(buf.length / 1024).toFixed(0)} kB)`)
  } catch (e) {
    missing.push(`${rel}  (download failed: ${e.message})`)
  }
}

console.log(`\nDownloaded ${ok}/${entries.length}.`)
if (missing.length) {
  console.log('Missing:')
  for (const m of missing) console.log('  · ' + m)
  process.exit(2)
}
