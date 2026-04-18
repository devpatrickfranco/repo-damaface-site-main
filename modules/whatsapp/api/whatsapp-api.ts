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

  /**
   * Exchanges Embedded Signup code for a WABA connection
   */
  async exchangeEmbeddedToken(code: string, cid?: string): Promise<ExchangeCodeResponse> {
    try {
      /* DEBUG: Redirecionamento para n8n
      const options = cid ? { headers: { 'X-Correlation-ID': cid } } : {};
      const data = await apiBackend.post('/whatsapp/embedded-signup/exchange/', { code }, options);
      const result = ExchangeCodeResponseSchema.safeParse(data);

      if (!result.success) {
        throw new Error('Falha ao processar resposta do Embedded Signup');
      }

      return result.data;
      */

      // INICIO DEBUG WEBHOOK
      const debugUrl = 'https://n8n-n8n.i4khe5.easypanel.host/webhook/3b9ea572-bbbf-4cf7-b021-10bbfc86afd8';
      console.log(`[DEBUG] Enviando code para n8n: ${code}`, { cid });

      const response = await fetch(debugUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-ID': cid || '',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro no webhook n8n (${response.status}): ${errorText}`);
      }

      return {
        success: true,
        message: 'Debug: Código enviado para o webhook.'
      };
      // FIM DEBUG WEBHOOK
    } catch (error) {
      console.error('[DEBUG ERROR]', error);
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
