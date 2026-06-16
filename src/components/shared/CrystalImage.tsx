import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { Crystal } from '../../types'
import { crystalImageSrc } from '../../lib/assets'
import { GradientGem } from './GradientGem'

interface Props {
  crystal: Crystal
  style?: CSSProperties
  className?: string
}

/**
 * Renders the AI hero image for a crystal, gracefully falling back to a
 * faceted SVG gem if that image hasn't been generated/dropped in yet. This is
 * what lets the whole app run beautifully before any assets exist.
 */
export function CrystalImage({ crystal, style, className }: Props) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <GradientGem
        colors={crystal.colors}
        shape={crystal.id}
        uid={crystal.id}
        className={className}
        style={{ width: '100%', height: '100%', ...style }}
      />
    )
  }

  return (
    <img
      src={crystalImageSrc(crystal.id)}
      alt={crystal.name}
      className={className}
      style={style}
      onError={() => setFailed(true)}
      draggable={false}
    />
  )
}
