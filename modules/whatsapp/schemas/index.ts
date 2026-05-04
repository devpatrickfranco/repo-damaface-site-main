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
  components: z.array(z.any()).optional(),
});

/**
 * Schema for exchange code response
 */
export const ExchangeCodeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  connection: WabaConnectionSchema.optional(),
});

// ─────────────────────────────────────────────
// WhatsApp Messages
// ─────────────────────────────────────────────

export const MessageDirectionSchema = z.enum(['IN', 'OUT']);

export const MessageStatusSchema = z.enum([
  'sent',
  'delivered',
  'read',
  'failed',
  'pending',
  'received',
]).catch('pending');

/**
 * Schema for a single WhatsApp message returned by GET /whatsapp/messages/
 */
export const WhatsAppMessageSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  to: z.string().optional().catch(undefined),
  from: z.string().optional().catch(undefined),
  contact: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  type: z.enum(['text', 'template', 'media']).catch('text'),
  direction: MessageDirectionSchema,
  status: MessageStatusSchema,
  created_at: z.string(),
  wamid: z.string().nullable().optional(),
});

export const WhatsAppMessagesResponseSchema = z.array(WhatsAppMessageSchema);

/**
 * Query params for GET /whatsapp/messages/
 */
export const MessagesQueryParamsSchema = z.object({
  since: z.string().optional(),
  direction: MessageDirectionSchema.optional(),
  contact: z.string().optional(),
});
