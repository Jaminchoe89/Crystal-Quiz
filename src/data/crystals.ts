import type { Crystal, CrystalId } from '../types'

/**
 * The eight outcomes. Descriptions are deliberately framed as an aesthetic /
 * personality match — colour and character — with NO health or healing claims,
 * which keeps the experience appropriate for a medical event.
 */
export const CRYSTALS: Record<CrystalId, Crystal> = {
  citrine: {
    id: 'citrine',
    name: 'Citrine',
    archetype: 'The Optimist',
    tagline: 'Bright, warm, and quick to light up a room.',
    traits: ['Sunny', 'Energetic', 'Generous'],
    colors: { base: '#F4A93C', light: '#FFE39A', deep: '#B96E12', glow: '#FFC861' },
  },
  'rose-quartz': {
    id: 'rose-quartz',
    name: 'Rose Quartz',
    archetype: 'The Nurturer',
    tagline: 'Gentle, warm-hearted, and quietly caring.',
    traits: ['Kind', 'Calm', 'Warm'],
    colors: { base: '#F2A0BE', light: '#FDDCE8', deep: '#CF6A92', glow: '#FBB6D0' },
  },
  amethyst: {
    id: 'amethyst',
    name: 'Amethyst',
    archetype: 'The Dreamer',
    tagline: 'Imaginative, reflective, drawn to the bigger picture.',
    traits: ['Intuitive', 'Thoughtful', 'Creative'],
    colors: { base: '#9A6AD4', light: '#D8C2F2', deep: '#5C3AA0', glow: '#B98CF0' },
  },
  'clear-quartz': {
    id: 'clear-quartz',
    name: 'Clear Quartz',
    archetype: 'The Clarifier',
    tagline: 'Clear-headed, focused, and refreshingly direct.',
    traits: ['Precise', 'Honest', 'Balanced'],
    colors: { base: '#CBD8E2', light: '#FFFFFF', deep: '#90A6B6', glow: '#E6F1F8' },
  },
  aventurine: {
    id: 'aventurine',
    name: 'Aventurine',
    archetype: 'The Grounded',
    tagline: 'Steady, patient, and always quietly growing.',
    traits: ['Steady', 'Patient', 'Hopeful'],
    colors: { base: '#5FB587', light: '#BCE7CE', deep: '#2D8159', glow: '#86D8AA' },
  },
  aquamarine: {
    id: 'aquamarine',
    name: 'Aquamarine',
    archetype: 'The Serene',
    tagline: 'Calm, adaptable, and cool under pressure.',
    traits: ['Calm', 'Fluid', 'Open'],
    colors: { base: '#5FC8D6', light: '#BEEEF3', deep: '#2A93AB', glow: '#88E0EA' },
  },
  'strawberry-quartz': {
    id: 'strawberry-quartz',
    name: 'Strawberry Quartz',
    archetype: 'The Joybringer',
    tagline: 'Playful, expressive, and full of warmth.',
    traits: ['Playful', 'Vivid', 'Spirited'],
    colors: { base: '#F1748A', light: '#FFC2CC', deep: '#D03E5B', glow: '#FF99AC' },
  },
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian',
    archetype: 'The Anchor',
    tagline: 'Strong, grounded, and unshakably yourself.',
    traits: ['Strong', 'Decisive', 'Loyal'],
    colors: { base: '#3A3A47', light: '#7C7C8C', deep: '#101015', glow: '#8E7BB8' },
  },
}

export const CRYSTAL_IDS = Object.keys(CRYSTALS) as CrystalId[]

export const getCrystal = (id: CrystalId): Crystal => CRYSTALS[id]
