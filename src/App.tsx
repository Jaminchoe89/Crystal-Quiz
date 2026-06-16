import { Launcher } from './components/Launcher'
import { TouchApp } from './components/touch/TouchApp'
import { DisplayApp } from './components/display/DisplayApp'
import type { Role } from './types'

function readRole(): Role | null {
  const screen = new URLSearchParams(window.location.search).get('screen')
  if (screen === 'touch' || screen === 'display') return screen
  return null
}

export function App() {
  const role = readRole()
  if (role === 'touch') return <TouchApp />
  if (role === 'display') return <DisplayApp />
  return <Launcher />
}
