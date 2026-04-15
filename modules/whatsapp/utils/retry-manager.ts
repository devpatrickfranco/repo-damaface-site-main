import { ErrorInfo, RetryConfig } from '../types';

/**
 * Executes a function with exponential backoff + jitter retry strategy
 * Fixed Jitter: Now applies variation over the calculated delay.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = { maxAttempts: 3, delayMs: 1000, factors: 2, jitter: true },
  shouldRetry: (error: ErrorInfo) => boolean = (err) => err.retryable
): Promise<T> {
  let attempt = 0;
  
  while (attempt < config.maxAttempts) {
    try {
      return await fn();
    } catch (error: any) {
      attempt++;
      
      const { mapError } = await import('./error-mapper');
      const errorInfo = mapError(error);

      // Strict exit condition
      if (attempt >= config.maxAttempts || !shouldRetry(errorInfo)) {
        throw error;
      }

      // Exponential base delay
      const baseDelay = config.delayMs * Math.pow(config.factors || 2, attempt - 1);
      let delay = baseDelay;
      
      // Elite Jitter: randomized variation (+/- 20%) over the base delay
      if (config.jitter) {
        const jitterFactor = 0.2; 
        const variation = baseDelay * jitterFactor;
        const min = baseDelay - variation;
        const max = baseDelay + variation;
        delay = Math.floor(Math.random() * (max - min) + min);
      }

      console.warn(`[WhatsApp:Retry] Tentativa ${attempt}/${config.maxAttempts} falhou. Base: ${baseDelay}ms -> Real: ${delay}ms`, { type: errorInfo.type });
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Maximum retry attempts reached');
}
