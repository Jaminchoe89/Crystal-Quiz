import { WebSocket } from 'ws'

const URL = 'ws://localhost:8787/sync'
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const open = (ws) => new Promise((res, rej) => { ws.once('open', res); ws.once('error', rej) })

let pass = 0
let fail = 0
const check = (name, cond) => { (cond ? pass++ : fail++); console.log(`  ${cond ? '✓' : '✗'} ${name}`) }

// HTTP health
const health = await (await fetch('http://localhost:8787/api/health')).json()
check('HTTP /api/health ok', health.ok === true)

// Display client (B) records every state it sees.
const display = new WebSocket(URL)
const seen = []
display.on('message', (d) => { const m = JSON.parse(d); if (m.type === 'state') seen.push(m.state) })
await open(display)
await wait(100)
check('display gets initial state', seen.length >= 1 && seen.at(-1).phase === 'idle')

// Touch client (A) drives the session.
const touch = new WebSocket(URL)
await open(touch)
touch.send(JSON.stringify({ type: 'start', total: 6 }))
await wait(60)
touch.send(JSON.stringify({ type: 'progress', step: 3, total: 6, leaningId: 'citrine' }))
await wait(60)
check('display sees quiz progress', seen.at(-1).phase === 'quiz' && seen.at(-1).step === 3 && seen.at(-1).leaningId === 'citrine')

touch.send(JSON.stringify({ type: 'reveal', crystalId: 'obsidian' }))
await wait(60)
check('display sees reveal', seen.at(-1).phase === 'reveal' && seen.at(-1).crystalId === 'obsidian')

// Late-joining client (C) must receive the retained reveal state immediately.
const late = new WebSocket(URL)
let lateState = null
late.on('message', (d) => { const m = JSON.parse(d); if (m.type === 'state' && !lateState) lateState = m.state })
await open(late)
await wait(120)
check('late joiner gets retained state', lateState && lateState.phase === 'reveal' && lateState.crystalId === 'obsidian')

// Reset returns to idle.
touch.send(JSON.stringify({ type: 'reset' }))
await wait(60)
check('reset returns to idle', seen.at(-1).phase === 'idle')

// rev increases monotonically.
const revs = seen.map((s) => s.rev)
check('rev monotonic', revs.every((v, i) => i === 0 || v >= revs[i - 1]))

for (const ws of [display, touch, late]) ws.close()
console.log(`\n${fail === 0 ? 'ALL PASS' : 'FAILURES'}: ${pass} passed, ${fail} failed`)
process.exit(fail === 0 ? 0 : 1)
