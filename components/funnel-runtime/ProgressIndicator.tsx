'use client'

interface ProgressIndicatorProps {
  current: number
  total: number
}

export function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0

  return (
    <div className="w-full">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-brand-pink transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="sr-only">
        Etapa {current} de {total}
      </span>
    </div>
  )
}
