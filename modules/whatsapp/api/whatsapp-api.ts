import { apiBackend } from '@/lib/api-backend';
import {
  WabaStatusResponseSchema,
  ExchangeCodeResponseSchema,
  WabaConnectionSchema
} from '../schemas';
import { WabaConnection, MessagePayload, ExchangeCodeResponse } from '../types';
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

  async exchangeEmbeddedToken(code: string, cid?: string): Promise<ExchangeCodeResponse> {
    try {
      const options = cid ? { headers: { 'X-Correlation-ID': cid } } : {};
      const data = await apiBackend.post('/whatsapp/embedded-signup/exchange/', { code }, options);
      const result = ExchangeCodeResponseSchema.safeParse(data);

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
   * Sends a message (text or template)
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
