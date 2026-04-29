import { apiBackend } from '@/lib/api-backend';
import {
  WhatsAppTemplateSchema,
  WhatsAppTemplatesListSchema,
  SyncResponseSchema,
} from '../schemas/templates';
import type {
  WhatsAppTemplate,
  CreateTemplatePayload,
  TemplatesQueryParams,
  SyncResponse,
} from '../types/templates';

function mapError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error(String(error));
}

export const templatesApi = {
  /**
   * GET /whatsapp/templates/ – list all templates with optional filters
   */
  async getTemplates(params?: TemplatesQueryParams): Promise<WhatsAppTemplate[]> {
    try {
      const qp = new URLSearchParams();
      if (params?.franchise_id) qp.set('franchise_id', params.franchise_id);
      if (params?.status) qp.set('status', params.status);
      if (params?.search) qp.set('search', params.search);
      if (params?.page) qp.set('page', String(params.page));

      const query = qp.toString() ? `?${qp.toString()}` : '';
      const data = await apiBackend.get(`/whatsapp/templates/${query}`);

      // Handle paginated or plain array
      const list = Array.isArray(data) ? data : data?.results ?? [];
      const result = WhatsAppTemplatesListSchema.safeParse(list);

      if (!result.success) {
        console.error('[Templates API] Schema validation failed', result.error);
        return [];
      }
      return result.data;
    } catch (error) {
      throw mapError(error);
    }
  },

  /**
   * GET /whatsapp/templates/:id/ – get single template
   */
  async getTemplate(id: string): Promise<WhatsAppTemplate> {
    try {
      const data = await apiBackend.get(`/whatsapp/templates/${id}/`);
      const result = WhatsAppTemplateSchema.safeParse(data);
      if (!result.success) throw new Error('Formato de template inválido');
      return result.data;
    } catch (error) {
      throw mapError(error);
    }
  },

  /**
   * POST /whatsapp/templates/ – create new template
   */
  async createTemplate(payload: CreateTemplatePayload): Promise<WhatsAppTemplate> {
    try {
      const data = await apiBackend.post('/whatsapp/templates/', payload);
      const result = WhatsAppTemplateSchema.safeParse(data);
      if (!result.success) throw new Error('Resposta inválida ao criar template');
      return result.data;
    } catch (error) {
      throw mapError(error);
    }
  },

  /**
   * POST /whatsapp/templates/:id/version/ – create new version (edit)
   */
  async createVersion(id: string, payload: CreateTemplatePayload): Promise<WhatsAppTemplate> {
    try {
      const data = await apiBackend.post(`/whatsapp/templates/${id}/version/`, payload);
      const result = WhatsAppTemplateSchema.safeParse(data);
      if (!result.success) throw new Error('Resposta inválida ao versionar template');
      return result.data;
    } catch (error) {
      throw mapError(error);
    }
  },

  /**
   * DELETE /whatsapp/templates/:id/ – delete template
   */
  async deleteTemplate(id: string): Promise<void> {
    try {
      await apiBackend.delete(`/whatsapp/templates/${id}/`);
    } catch (error) {
      throw mapError(error);
    }
  },

  /**
   * POST /whatsapp/templates/sync/ – sync all templates with Meta
   */
  async syncTemplates(): Promise<SyncResponse> {
    try {
      const data = await apiBackend.post('/whatsapp/templates/sync/');
      const result = SyncResponseSchema.safeParse(data);
      if (!result.success) return { success: true };
      return result.data;
    } catch (error) {
      throw mapError(error);
    }
  },

  /**
   * GET /whatsapp/templates/:id/history/ – get version history
   */
  async getTemplateHistory(id: string): Promise<WhatsAppTemplate[]> {
    try {
      const data = await apiBackend.get(`/whatsapp/templates/${id}/history/`);
      const list = Array.isArray(data) ? data : data?.results ?? [];
      const result = WhatsAppTemplatesListSchema.safeParse(list);
      if (!result.success) return [];
      return result.data;
    } catch (error) {
      console.warn('[Templates API] Could not fetch history', error);
      return [];
    }
  },
};
