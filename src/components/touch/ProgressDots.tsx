interface Props {
  total: number
  current: number // zero-based index of the active question
}

export function ProgressDots({ total, current }: Props) {
  return (
    <div className="tw-progress" aria-label={`Question ${current + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`tw-dot ${i < current ? 'is-done' : ''} ${i === current ? 'is-current' : ''}`}
        />
      ))}
    </div>
  )
}
