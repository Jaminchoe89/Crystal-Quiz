export type CrystalId =
  | 'citrine'
  | 'rose-quartz'
  | 'amethyst'
  | 'clear-quartz'
  | 'aventurine'
  | 'aquamarine'
  | 'strawberry-quartz'
  | 'obsidian'

export type Role = 'touch' | 'display'

export interface CrystalColors {
  /** Core gem color */
  base: string
  /** Lighter highlight (top sheen) */
  light: string
  /** Deeper shadow tone */
  deep: string
  /** Ambient glow / accent used on dark backgrounds */
  glow: string
}

export interface Crystal {
  id: CrystalId
  name: string
  /** One- or two-word personality archetype, e.g. "The Optimist" */
  archetype: string
  /** Short personality line — aesthetic/character, never a health claim */
  tagline: string
  /** Three short trait words */
  traits: [string, string, string]
  colors: CrystalColors
}

/** A single tappable answer within a question. */
export interface AnswerOption {
  id: string
  /** Very short caption shown under the picture */
  label: string
  /** Filename (without extension) used to look up the AI image in /public */
  image: string
  /** Crystal points this answer contributes */
  scores: Partial<Record<CrystalId, number>>
}

export interface Question {
  id: string
  /** Short prompt — picture-led, minimal words */
  prompt: string
  options: AnswerOption[]
}

/** Authoritative session snapshot, owned by the relay and mirrored to clients. */
export interface SessionState {
  phase: 'idle' | 'quiz' | 'reveal'
  step: number
  total: number
  leaningId: CrystalId | null
  crystalId: CrystalId | null
  rev: number
}

/** Messages a client may send to the relay. */
export type ClientEvent =
  | { type: 'start'; total: number }
  | { type: 'progress'; step: number; total: number; leaningId: CrystalId | null }
  | { type: 'reveal'; crystalId: CrystalId }
  | { type: 'reset' }
  | { type: 'ping' }

/** Messages the relay sends back. */
export type ServerEvent = { type: 'state'; state: SessionState } | { type: 'pong' }
