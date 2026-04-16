import { z } from 'zod';

/**
 * Registration Status possible values
 */
export const RegistrationStatusSchema = z.enum([
  'pending',
  'connecting',
  'active',
  'failed',
  'disconnected',
  'suspended',
]);

/**
 * Schema for /whatsapp/status/ endpoint
 */
export const WabaConnectionSchema = z.object({
  id: z.string().uuid().optional(),
  phone_number: z.string().nullable().optional(),
  display_name: z.string().nullable().optional(),
  waba_id: z.string().nullable().optional(),
  registration_status: RegistrationStatusSchema,
  connected: z.boolean().optional().default(false),
  activated_at: z.string().nullable().optional(),
  suspension_reason: z.string().nullable().optional(),
});

export const WabaStatusResponseSchema = z.array(WabaConnectionSchema).or(WabaConnectionSchema);

/**
 * Schema for message sending payload
 */
export const MessagePayloadSchema = z.object({
  to: z.string(),
  type: z.enum(['text', 'template', 'media']),
  content: z.string().optional(),
  template_name: z.string().optional(),
  language_code: z.string().optional(),
  media_url: z.string().optional(),
});

/**
 * Schema for exchange code response
 */
export const ExchangeCodeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  connection: WabaConnectionSchema.optional(),
});
