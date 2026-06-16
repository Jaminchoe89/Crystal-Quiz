import type { CSSProperties } from 'react'
import type { CrystalColors, CrystalId } from '../../types'

type GKey = 'top' | 'lit' | 'mid' | 'shade'

// Each crystal gets its own faceted silhouette (viewBox 120 x 210, centred on x=60).
// Polygon shapes for the angular crystals; path shapes for the rounded ones.
const POLY: Partial<Record<CrystalId, [string, GKey][]>> = {
  // tall single point
  citrine: [
    ['60,6 20,58 60,72', 'top'],
    ['60,6 100,58 60,72', 'mid'],
    ['20,58 60,72 60,172 20,172', 'lit'],
    ['100,58 60,72 60,172 100,172', 'shade'],
    ['20,172 60,172 60,204', 'mid'],
    ['100,172 60,172 60,204', 'shade'],
  ],
  // long narrow hexagonal prism
  'clear-quartz': [
    ['60,4 30,42 60,56', 'top'],
    ['60,4 90,42 60,56', 'mid'],
    ['30,42 60,56 60,184 30,184', 'lit'],
    ['90,42 60,56 60,184 90,184', 'shade'],
    ['30,184 60,184 60,206', 'mid'],
    ['90,184 60,184 60,206', 'shade'],
  ],
  // emerald / step cut
  aquamarine: [
    ['44,22 76,22 96,46 24,46', 'top'],
    ['24,46 60,46 60,164 24,164', 'lit'],
    ['96,46 60,46 60,164 96,164', 'shade'],
    ['24,164 96,164 76,188 44,188', 'mid'],
  ],
  // sharp angular shard
  obsidian: [
    ['60,6 30,86 60,98', 'lit'],
    ['60,6 90,86 60,98', 'shade'],
    ['30,86 60,98 60,204', 'mid'],
    ['90,86 60,98 60,204', 'shade'],
  ],
  // simple three-point cluster on a base
  amethyst: [
    ['34,150 60,150 60,190 38,190', 'lit'],
    ['60,150 86,150 82,190 60,190', 'shade'],
    ['30,150 50,150 41,96', 'lit'],
    ['46,150 60,150 60,40', 'top'],
    ['60,150 74,150 60,40', 'shade'],
    ['70,150 90,150 80,106', 'mid'],
  ],
}

const PATHS: Partial<Record<CrystalId, [string, GKey][]>> = {
  // soft rounded chunk
  'rose-quartz': [
    ['M60,16 C 34,18 22,54 22,96 C 22,150 42,196 60,196 Z', 'lit'],
    ['M60,16 C 86,18 98,54 98,96 C 98,150 78,196 60,196 Z', 'shade'],
  ],
  // smooth horizontal pebble
  aventurine: [
    ['M60,50 C 26,50 10,78 10,108 C 10,140 28,166 60,166 Z', 'lit'],
    ['M60,50 C 94,50 110,78 110,108 C 110,140 92,166 60,166 Z', 'shade'],
  ],
  // faceted teardrop
  'strawberry-quartz': [
    ['M60,14 C 40,14 26,42 22,84 C 18,126 40,184 60,198 Z', 'lit'],
    ['M60,14 C 80,14 94,42 98,84 C 102,126 80,184 60,198 Z', 'shade'],
  ],
}

// crystals that read better with a central facet ridge
const RIDGE: Partial<Record<CrystalId, [number, number]>> = {
  citrine: [10, 202],
  'clear-quartz': [8, 204],
  obsidian: [10, 202],
}

// specular highlight placement — kept on the body of each silhouette
const SPEC_DEFAULT = { cx: 44, cy: 64, rx: 7, ry: 16, rot: -18 }
const SPEC: Partial<Record<CrystalId, typeof SPEC_DEFAULT>> = {
  amethyst: { cx: 54, cy: 112, rx: 6, ry: 13, rot: -10 },
  aventurine: { cx: 40, cy: 86, rx: 8, ry: 12, rot: -20 },
}

interface Props {
  colors: CrystalColors
  /** which crystal's silhouette to draw */
  shape?: CrystalId
  /** unique-ish suffix so gradient ids don't collide between gems */
  uid: string
  style?: CSSProperties
  className?: string
}

export function GradientGem({ colors, shape = 'citrine', uid, style, className }: Props) {
  const id = (k: string) => `${k}-${uid}`
  const g: Record<GKey, string> = {
    top: `url(#${id('top')})`,
    lit: `url(#${id('lit')})`,
    mid: `url(#${id('mid')})`,
    shade: `url(#${id('shade')})`,
  }
  const polys = POLY[shape]
  const paths = PATHS[shape]
  const ridge = RIDGE[shape]
  const spec = SPEC[shape] ?? SPEC_DEFAULT

  return (
    <svg viewBox="0 0 120 210" className={className} style={style} role="img" aria-hidden>
      <defs>
        <linearGradient id={id('top')} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor={colors.light} />
          <stop offset="100%" stopColor={colors.base} />
        </linearGradient>
        <linearGradient id={id('lit')} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0%" stopColor={colors.light} />
          <stop offset="100%" stopColor={colors.base} />
        </linearGradient>
        <linearGradient id={id('mid')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.base} />
          <stop offset="100%" stopColor={colors.deep} />
        </linearGradient>
        <linearGradient id={id('shade')} x1="1" y1="0" x2="0" y2="0.7">
          <stop offset="0%" stopColor={colors.deep} />
          <stop offset="100%" stopColor={colors.base} />
        </linearGradient>
        <radialGradient id={id('glow')} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0%" stopColor={colors.glow} stopOpacity="0.55" />
          <stop offset="100%" stopColor={colors.glow} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ambient glow */}
      <ellipse cx="60" cy="105" rx="58" ry="98" fill={`url(#${id('glow')})`} />

      {polys?.map(([pts, key], i) => <polygon key={`p${i}`} points={pts} fill={g[key]} />)}
      {paths?.map(([d, key], i) => <path key={`a${i}`} d={d} fill={g[key]} />)}

      {ridge && (
        <line x1="60" y1={ridge[0]} x2="60" y2={ridge[1]} stroke={colors.light} strokeOpacity="0.32" strokeWidth="1.2" />
      )}

      {/* specular highlight */}
      <ellipse
        cx={spec.cx}
        cy={spec.cy}
        rx={spec.rx}
        ry={spec.ry}
        fill={colors.light}
        opacity="0.4"
        transform={`rotate(${spec.rot} ${spec.cx} ${spec.cy})`}
      />
    </svg>
  )
}
