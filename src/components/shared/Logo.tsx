import logoUrl from '../../assets/ihh-logo.svg'

/** The client's IHH brand mark (white, for dark backgrounds). Size via CSS class. */
export function Logo({ className }: { className?: string }) {
  return <img src={logoUrl} alt="IHH" className={className} draggable={false} />
}
