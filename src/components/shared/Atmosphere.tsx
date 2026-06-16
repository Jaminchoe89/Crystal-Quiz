/** Shared animated backdrop. Reads --accent* vars from the nearest themed ancestor. */
export function Atmosphere() {
  return (
    <>
      <div className="atmosphere" />
      <div className="grain" />
    </>
  )
}

export function ConnDot({ connected }: { connected: boolean }) {
  return <div className={`conn ${connected ? 'is-on' : ''}`} aria-hidden />
}
