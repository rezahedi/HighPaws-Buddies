export default function Loading({className}: {className?: string}) {
  return (
    <div className={className}>
      <svg viewBox="0 0 32 32" aria-hidden="true" fill="currentColor" className="animate-spin">
        <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="4" strokeOpacity={.2}></circle>
        <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="4" strokeDasharray={80} strokeDashoffset={60}></circle>
      </svg>
    </div>
  )
}
