"use client"

import { useEffect } from "react"
import { trackEvent } from "@/lib/analytics"

export function PageViewTracker({ event, payload }: { event: string; payload?: Record<string, unknown> }) {
  useEffect(() => {
    trackEvent(event, payload)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event])

  return null
}
