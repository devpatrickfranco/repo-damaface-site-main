export function Spinner({ className = 'h-12 w-12' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-full border-2 border-brand-pink/20" />
      <div className="absolute inset-0 animate-spin rounded-full border-2 border-brand-pink border-t-transparent" />
    </div>
  )
}
