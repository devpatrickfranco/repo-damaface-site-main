import type { FunnelOption, FunnelStep } from '@/types/funnels'

export interface FunnelBlockProps {
  step: FunnelStep
  onAnswer: (option: FunnelOption | undefined, value: string) => void
}
