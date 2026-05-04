import { z } from 'zod';

// ─────────────────────────────────────────────
// Template Status & Category
// ─────────────────────────────────────────────

export const TemplateStatusSchema = z.enum([
  'APPROVED',
  'PENDING',
  'REJECTED',
  'PAUSED',
  'DISABLED',
]);

export const TemplateCategorySchema = z.enum([
  'MARKETING',
  'UTILITY',
  'AUTHENTICATION',
]);

export const TemplateLanguageSchema = z.string(); // e.g. "pt_BR", "en_US"

// ─────────────────────────────────────────────
// Template Components
// ─────────────────────────────────────────────

export const ComponentTypeSchema = z.enum([
  'HEADER',
  'BODY',
  'FOOTER',
  'BUTTONS',
]);

export const ButtonTypeSchema = z.enum([
  'QUICK_REPLY',
  'URL',
  'PHONE_NUMBER',
]);

export const TemplateButtonSchema = z.object({
  type: ButtonTypeSchema,
  text: z.string(),
  url: z.string().optional(),
  phone_number: z.string().optional(),
});

export const TemplateComponentSchema = z.object({
  type: ComponentTypeSchema,
  text: z.string().optional(),
  format: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT', 'LOCATION']).optional(),
  buttons: z.array(TemplateButtonSchema).optional(),
  example: z.object({
    header_text: z.array(z.string()).optional(),
    body_text: z.array(z.array(z.string())).optional(),
    header_url: z.array(z.string()).optional(),
  }).optional(),
});

// ─────────────────────────────────────────────
// Template
// ─────────────────────────────────────────────

export const WhatsAppTemplateSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  name: z.string(),
  language: z.string(),
  category: TemplateCategorySchema,
  status: TemplateStatusSchema,
  status_display: z.string().optional(),
  is_active: z.boolean().optional(),
  components: z.array(TemplateComponentSchema).default([]),
  version: z.number().optional().default(1),
  parent_template: z.union([z.string(), z.number()]).transform(String).nullable().optional(),
  franchise: z.union([z.string(), z.number()]).transform(String).nullable().optional(),
  franchise_name: z.string().nullable().optional(),
  meta_template_id: z.string().nullable().optional(),
  rejection_reason: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  synced_at: z.string().nullable().optional(),
});

export const WhatsAppTemplatesListSchema = z.array(WhatsAppTemplateSchema);

// ─────────────────────────────────────────────
// Payloads
// ─────────────────────────────────────────────

export const CreateTemplatePayloadSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').regex(/^[a-z0-9_]+$/, 'Apenas letras minúsculas, números e underscores'),
  language: z.string().min(1, 'Idioma é obrigatório'),
  category: TemplateCategorySchema,
  components: z.array(TemplateComponentSchema).min(1, 'Adicione pelo menos um componente'),
  franchise: z.string().optional(),
});

export const TemplatesQueryParamsSchema = z.object({
  franchise_id: z.string().optional(),
  status: TemplateStatusSchema.optional(),
  search: z.string().optional(),
  page: z.number().optional(),
});

export const SyncResponseSchema = z.object({
  synced: z.number().optional(),
  created: z.number().optional(),
  updated: z.number().optional(),
  message: z.string().optional(),
  success: z.boolean().optional(),
});
