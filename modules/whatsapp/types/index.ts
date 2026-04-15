import { z } from 'zod';
import { 
  RegistrationStatusSchema, 
  WabaConnectionSchema, 
  MessagePayloadSchema, 
  ExchangeCodeResponseSchema 
} from '../schemas';

/**
 * Types inferred from Schemas
 */
export type RegistrationStatus = z.infer<typeof RegistrationStatusSchema>;
export type WabaConnection = z.infer<typeof WabaConnectionSchema>;
export type MessagePayload = z.infer<typeof MessagePayloadSchema>;
export type ExchangeCodeResponse = z.infer<typeof ExchangeCodeResponseSchema>;

/**
 * State Machine Definition
 */
export type WhatsAppState = {
  status: RegistrationStatus;
  connection: WabaConnection | null;
  loading: boolean;
  isSyncing: boolean; // Source of Truth synchronization
  error: ErrorInfo | null;
  isOperationPending: boolean; // Concurrency control
};

/**
 * Error Normalized Type
 */
export type ErrorType = 
  | 'rate_limit' 
  | 'business_rule' 
  | 'infra' 
  | 'unknown' 
  | 'auth' 
  | 'client_blocked'; // AdBlock/Popup

export type ErrorInfo = {
  type: ErrorType;
  message: string;
  actionable: boolean;
  retryable: boolean; // Enterprise Grade refinement
  raw?: any;
};

/**
 * Retry Configuration
 */
export interface RetryConfig {
  maxAttempts: number;
  delayMs: number;
  factors?: number;
  jitter?: boolean; // Randomized delay
}
