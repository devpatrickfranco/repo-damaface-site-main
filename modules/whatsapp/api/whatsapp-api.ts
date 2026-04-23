import { apiBackend } from '@/lib/api-backend';
import {
  WabaStatusResponseSchema,
  ExchangeCodeResponseSchema,
  WabaConnectionSchema,
  WhatsAppMessagesResponseSchema,
  WhatsAppMessageSchema,
} from '../schemas';
import { WabaConnection, MessagePayload, ExchangeCodeResponse, WhatsAppMessage, MessagesQueryParams } from '../types';
import { mapError } from '../utils/error-mapper';

/**
 * WhatsApp API Client using apiBackend with Traceability (CID) support
 */
export const whatsappApi = {
  /**
   * Fetches the current WhatsApp connection status
   */
  async getStatus(cid?: string): Promise<WabaConnection> {
    try {
      const options = cid ? { headers: { 'X-Correlation-ID': cid } } : {};
      const data = await apiBackend.get('/whatsapp/connections/', options);
      const result = WabaStatusResponseSchema.safeParse(data);

      if (!result.success) {
        console.error('[WhatsApp API] Schema validation failed for getStatus', result.error);
        throw new Error('Formato de resposta inválido do servidor');
      }

      if (Array.isArray(result.data)) {
        return result.data.find(c => c.registration_status === 'active') || result.data[0] || { registration_status: 'disconnected' };
      }

      return result.data;
    } catch (error) {
      throw mapError(error);
    }
  },

  async exchangeEmbeddedToken(
    data: { code: string; waba_id?: string; phone_number_id?: string }, 
    cid?: string
  ): Promise<ExchangeCodeResponse> {
    try {
      const options = cid ? { headers: { 'X-Correlation-ID': cid } } : {};
      const response = await apiBackend.post('/whatsapp/embedded-signup/exchange/', data, options);
      const result = ExchangeCodeResponseSchema.safeParse(response);

      if (!result.success) {
        throw new Error('Falha ao processar resposta do Embedded Signup');
      }

      return result.data;
    } catch (error) {
      console.error('[WhatsApp API] Error in exchangeEmbeddedToken', error);
      throw mapError(error);
    }
  },

  /**
   * Fetches messages list with optional filters
   * GET /whatsapp/messages/?since=…&direction=…&contact=…
   */
  async getMessages(params?: MessagesQueryParams, cid?: string): Promise<WhatsAppMessage[]> {
    try {
      const qp = new URLSearchParams();
      if (params?.since) qp.set('since', params.since);
      if (params?.direction) qp.set('direction', params.direction);
      if (params?.contact) qp.set('contact', params.contact);

      const query = qp.toString() ? `?${qp.toString()}` : '';
      const options = cid ? { headers: { 'X-Correlation-ID': cid } } : {};
      const data = await apiBackend.get(`/whatsapp/messages/${query}`, options);
      const result = WhatsAppMessagesResponseSchema.safeParse(data);

      if (!result.success) {
        console.error('[WhatsApp API] Schema validation failed for getMessages', result.error);
        return [];
      }

      return result.data;
    } catch (error) {
      throw mapError(error);
    }
  },

  /**
   * Fetches a single message by ID
   * GET /whatsapp/messages/{id}/
   */
  async getMessage(id: string, cid?: string): Promise<WhatsAppMessage> {
    try {
      const options = cid ? { headers: { 'X-Correlation-ID': cid } } : {};
      const data = await apiBackend.get(`/whatsapp/messages/${id}/`, options);
      const result = WhatsAppMessageSchema.safeParse(data);

      if (!result.success) {
        throw new Error('Formato de mensagem inválido');
      }

      return result.data;
    } catch (error) {
      throw mapError(error);
    }
  },

  /**
   * Sends a message (text or template)
   * POST /whatsapp/messages/send/
   */
  async sendMessage(payload: MessagePayload, cid?: string): Promise<any> {
    try {
      const options = cid ? { headers: { 'X-Correlation-ID': cid } } : {};
      return await apiBackend.post('/whatsapp/messages/send/', payload, options);
    } catch (error) {
      throw mapError(error);
    }
  }
};
