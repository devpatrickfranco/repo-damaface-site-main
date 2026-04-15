/**
 * Structured Telemetry and Logging Utility with Correlation ID support
 */
export const logger = {
  /**
   * Generates a unique ID for a session or specific flow (COEX)
   */
  generateCorrelationId: () => {
    return `wa-${Math.random().toString(36).substring(2, 11)}-${Date.now()}`;
  },

  info: (feature: string, message: string, data?: any, correlationId?: string) => {
    console.log(`[WhatsApp:${feature}:INFO]${correlationId ? ` [CID:${correlationId}]` : ''} ${message}`, data || '');
  },
  
  warn: (feature: string, message: string, data?: any, correlationId?: string) => {
    console.warn(`[WhatsApp:${feature}:WARN]${correlationId ? ` [CID:${correlationId}]` : ''} ${message}`, data || '');
  },
  
  error: (feature: string, message: string, data?: any, correlationId?: string) => {
    console.error(`[WhatsApp:${feature}:ERROR]${correlationId ? ` [CID:${correlationId}]` : ''} ${message}`, {
      timestamp: new Date().toISOString(),
      correlationId,
      ...data
    });
  },

  trackEvent: (eventName: string, properties?: any, correlationId?: string) => {
    console.log(`[WhatsApp:TELEMETRY]${correlationId ? ` [CID:${correlationId}]` : ''} Event: ${eventName}`, properties || '');
  }
};
