// Crystal Quiz — LAN relay + static host.
//
// One small process runs at the event on the machine driving the TOUCH screen
// (or any always-on box on the same network). It:
//   1. Serves the built app (dist/) over HTTP.
//   2. Relays sync messages between the touch screen and the display screen
//      over a single WebSocket endpoint on the same port.
//
// The display PC just opens   http://<this-host-ip>:8787/?screen=display
// The touch PC opens          http://<this-host-ip>:8787/?screen=touch
//
// Run:  npm run kiosk   (build + start)   or   npm start (start only, after build)

import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import os from 'node:os'
import express from 'express'
import { WebSocketServer } from 'ws'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT || 8787)
const DIST = path.join(__dirname, '..', 'dist')

// ---- Retained session state --------------------------------------------------
// A display that connects (or reconnects) mid-session immediately receives the
// current state, so a refresh on the wall never leaves it blank.
const initialState = () => ({
  phase: 'idle', // 'idle' | 'quiz' | 'reveal'
  step: 0,
  total: 0,
  leaningId: null,
  crystalId: null,
  rev: 0, // monotonically increasing revision, helps clients drop stale frames
})
let sessionState = initialState()

// ---- HTTP --------------------------------------------------------------------
const app = express()

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, state: sessionState, clients: wss ? wss.clients.size : 0 })
})

// Serve the built SPA. Any unknown route falls back to index.html so the
// ?screen= query routing works on hard refresh.
app.use(
  express.static(DIST, {
    index: 'index.html',
    setHeaders: (res, filePath) => {
      if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        // Vite build assets are content-hashed — safe to cache hard.
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
      } else {
        // Images reuse filenames across edits, and index.html must stay fresh,
        // so always revalidate. On a LAN this is effectively free.
        res.setHeader('Cache-Control', 'no-cache')
      }
    },
  }),
)
app.get('*', (_req, res) => {
  res.sendFile(path.join(DIST, 'index.html'), (err) => {
    if (err) {
      res
        .status(200)
        .type('html')
        .send(
          '<h1>Crystal Quiz</h1><p>No production build found. Run <code>npm run build</code> first, ' +
            'or use <code>npm run dev</code> for development.</p>',
        )
    }
  })
})

const server = http.createServer(app)

// ---- WebSocket relay ---------------------------------------------------------
const wss = new WebSocketServer({ server, path: '/sync' })

function broadcast(obj, except) {
  const data = JSON.stringify(obj)
  for (const client of wss.clients) {
    if (client !== except && client.readyState === 1) client.send(data)
  }
}

// State-mutating events from the touch screen update the retained snapshot.
function applyEvent(evt) {
  switch (evt.type) {
    case 'start':
      sessionState = { ...initialState(), phase: 'quiz', total: evt.total ?? 0, rev: sessionState.rev + 1 }
      break
    case 'progress':
      sessionState = {
        ...sessionState,
        phase: 'quiz',
        step: evt.step ?? sessionState.step,
        total: evt.total ?? sessionState.total,
        leaningId: evt.leaningId ?? null,
        rev: sessionState.rev + 1,
      }
      break
    case 'reveal':
      sessionState = { ...sessionState, phase: 'reveal', crystalId: evt.crystalId, rev: sessionState.rev + 1 }
      break
    case 'reset':
      sessionState = { ...initialState(), rev: sessionState.rev + 1 }
      break
    default:
      break
  }
}

wss.on('connection', (ws) => {
  ws.isAlive = true
  ws.on('pong', () => {
    ws.isAlive = true
  })

  // Hand the newcomer the current world state immediately.
  ws.send(JSON.stringify({ type: 'state', state: sessionState }))

  ws.on('message', (raw) => {
    let evt
    try {
      evt = JSON.parse(raw.toString())
    } catch {
      return
    }
    if (!evt || typeof evt.type !== 'string') return

    if (evt.type === 'ping') {
      ws.send(JSON.stringify({ type: 'pong' }))
      return
    }

    applyEvent(evt)
    // Re-broadcast the authoritative state to everyone (incl. echo to sender
    // for confirmation). Clients key off state.rev to ignore stale frames.
    broadcast({ type: 'state', state: sessionState })
  })
})

// Heartbeat: drop dead sockets so a yanked HDMI/ethernet cable doesn't pile up.
const heartbeat = setInterval(() => {
  for (const ws of wss.clients) {
    if (ws.isAlive === false) {
      ws.terminate()
      continue
    }
    ws.isAlive = false
    try {
      ws.ping()
    } catch {
      /* noop */
    }
  }
}, 25000)
wss.on('close', () => clearInterval(heartbeat))

server.listen(PORT, () => {
  const nets = os.networkInterfaces()
  const ips = []
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) ips.push(net.address)
    }
  }
  console.log('\n  Crystal Quiz relay running')
  console.log(`  Local:    http://localhost:${PORT}/`)
  for (const ip of ips) {
    console.log(`  Network:  http://${ip}:${PORT}/        (open this on the other PC)`)
    console.log(`            http://${ip}:${PORT}/?screen=touch`)
    console.log(`            http://${ip}:${PORT}/?screen=display`)
  }
  console.log('')
})
