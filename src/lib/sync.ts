import { useEffect, useRef, useState } from 'react'
import type { ClientEvent, ServerEvent, SessionState } from '../types'

const DEFAULT_PORT = 8787
const DEV_VITE_PORT = 5173

function wsUrl(): string {
  const params = new URLSearchParams(window.location.search)
  // Allow ?ws=host:port or ?ws=port overrides for unusual network setups.
  const override = params.get('ws')
  const proto = window.location.protocol === 'https:' ? 'wss' : 'ws'
  if (override) {
    if (override.includes(':')) return `${proto}://${override}/sync`
    return `${proto}://${window.location.hostname}:${override}/sync`
  }
  // Dev: Vite serves the page on :5173, but the relay/WS lives on :8787.
  if (window.location.port === String(DEV_VITE_PORT)) {
    return `${proto}://${window.location.hostname}:${DEFAULT_PORT}/sync`
  }
  // Production: the relay serves this page, so the WS shares the page's origin.
  // window.location.host keeps an explicit port when present — works locally on
  // :8787, across a LAN, and behind a TLS proxy like Railway (host on :443).
  return `${proto}://${window.location.host}/sync`
}

export interface SyncClient {
  send: (evt: ClientEvent) => void
  subscribeState: (cb: (state: SessionState) => void) => () => void
  subscribeStatus: (cb: (connected: boolean) => void) => () => void
  close: () => void
}

export function createSyncClient(): SyncClient {
  let ws: WebSocket | null = null
  let closedByUser = false
  let reconnectDelay = 500
  let pingTimer: ReturnType<typeof setInterval> | null = null

  const stateSubs = new Set<(s: SessionState) => void>()
  const statusSubs = new Set<(c: boolean) => void>()
  let lastState: SessionState | null = null

  const emitStatus = (c: boolean) => statusSubs.forEach((cb) => cb(c))

  function connect() {
    try {
      ws = new WebSocket(wsUrl())
    } catch {
      scheduleReconnect()
      return
    }

    ws.onopen = () => {
      reconnectDelay = 500
      emitStatus(true)
      // Keep the connection warm so NAT/proxies don't drop it.
      pingTimer = setInterval(() => {
        if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'ping' }))
      }, 20000)
    }

    ws.onmessage = (ev) => {
      let msg: ServerEvent
      try {
        msg = JSON.parse(ev.data)
      } catch {
        return
      }
      if (msg.type === 'state') {
        // Drop stale frames (out-of-order delivery after a reconnect).
        if (lastState && msg.state.rev < lastState.rev) return
        lastState = msg.state
        stateSubs.forEach((cb) => cb(msg.state))
      }
    }

    ws.onclose = () => {
      if (pingTimer) clearInterval(pingTimer)
      emitStatus(false)
      if (!closedByUser) scheduleReconnect()
    }

    ws.onerror = () => {
      ws?.close()
    }
  }

  function scheduleReconnect() {
    reconnectDelay = Math.min(reconnectDelay * 1.6, 5000)
    setTimeout(() => {
      if (!closedByUser) connect()
    }, reconnectDelay)
  }

  connect()

  return {
    send(evt) {
      if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(evt))
    },
    subscribeState(cb) {
      stateSubs.add(cb)
      if (lastState) cb(lastState)
      return () => stateSubs.delete(cb)
    },
    subscribeStatus(cb) {
      statusSubs.add(cb)
      cb(ws?.readyState === WebSocket.OPEN)
      return () => statusSubs.delete(cb)
    },
    close() {
      closedByUser = true
      if (pingTimer) clearInterval(pingTimer)
      ws?.close()
    },
  }
}

/**
 * React hook owning a single relay connection for the lifetime of the screen.
 * `state` mirrors the authoritative session snapshot from the relay.
 */
export function useSync() {
  const clientRef = useRef<SyncClient | null>(null)
  const [state, setState] = useState<SessionState | null>(null)
  const [connected, setConnected] = useState(false)

  if (clientRef.current === null) {
    clientRef.current = createSyncClient()
  }

  useEffect(() => {
    const client = clientRef.current!
    const offState = client.subscribeState(setState)
    const offStatus = client.subscribeStatus(setConnected)
    return () => {
      offState()
      offStatus()
      client.close()
      clientRef.current = null
    }
  }, [])

  return {
    state,
    connected,
    send: (evt: ClientEvent) => clientRef.current?.send(evt),
  }
}
