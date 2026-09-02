import type { ComponentType } from 'react'
import type { FunnelBlockType } from '@/types/funnels'
import type { FunnelBlockProps } from './types'
import { ChoiceBlock } from './ChoiceBlock'
import { ImageChoiceBlock } from './ImageChoiceBlock'
import { BeforeAfterBlock } from './BeforeAfterBlock'
import { UnitChoiceBlock } from './UnitChoiceBlock'
import { TextInputBlock } from './TextInputBlock'
import { PhoneBlock } from './PhoneBlock'
import { VideoBlock } from './VideoBlock'
import { TestimonialBlock } from './TestimonialBlock'
import { CTABlock } from './CTABlock'
import { ResultBlock } from './ResultBlock'

export const FUNNEL_BLOCK_REGISTRY: Record<FunnelBlockType, ComponentType<FunnelBlockProps>> = {
  choice: ChoiceBlock,
  image_choice: ImageChoiceBlock,
  before_after: BeforeAfterBlock,
  unit_choice: UnitChoiceBlock,
  text_input: TextInputBlock,
  phone: PhoneBlock,
  video: VideoBlock,
  testimonial: TestimonialBlock,
  cta: CTABlock,
  result: ResultBlock,
}

export type { FunnelBlockProps } from './types'
