import { z } from 'zod';
import {
  WhatsAppTemplateSchema,
  TemplateStatusSchema,
  TemplateCategorySchema,
  TemplateComponentSchema,
  TemplateButtonSchema,
  CreateTemplatePayloadSchema,
  TemplatesQueryParamsSchema,
  SyncResponseSchema,
} from '../schemas/templates';

export type WhatsAppTemplate = z.infer<typeof WhatsAppTemplateSchema>;
export type TemplateStatus = z.infer<typeof TemplateStatusSchema>;
export type TemplateCategory = z.infer<typeof TemplateCategorySchema>;
export type TemplateComponent = z.infer<typeof TemplateComponentSchema>;
export type TemplateButton = z.infer<typeof TemplateButtonSchema>;
export type CreateTemplatePayload = z.infer<typeof CreateTemplatePayloadSchema>;
export type TemplatesQueryParams = z.infer<typeof TemplatesQueryParamsSchema>;
export type SyncResponse = z.infer<typeof SyncResponseSchema>;

export type ComponentType = 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
export type ButtonType = 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
