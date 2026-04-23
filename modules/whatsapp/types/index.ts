import { z } from 'zod';
import { 
  RegistrationStatusSchema, 
  WabaConnectionSchema, 
  MessagePayloadSchema, 
  ExchangeCodeResponseSchema,
  WhatsAppMessageSchema,
  MessageDirectionSchema,
} from '../schemas';

/**
 * Types inferred from Schemas
 */
export type RegistrationStatus = z.infer<typeof RegistrationStatusSchema>;
export type WabaConnection = z.infer<typeof WabaConnectionSchema>;
export type MessagePayload = z.infer<typeof MessagePayloadSchema>;
export type ExchangeCodeResponse = z.infer<typeof ExchangeCodeResponseSchema>;
export type WhatsAppMessage = z.infer<typeof WhatsAppMessageSchema>;
export type MessageDirection = z.infer<typeof MessageDirectionSchema>;

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

/**
 * A conversation is a group of messages with the same contact
 */
export interface Conversation {
  contact: string; // phone number
  displayName: string;
  lastMessage: WhatsAppMessage | null;
  messages: WhatsAppMessage[];
  unreadCount: number;
  updatedAt: string;
}

/**
 * Query params for fetching messages
 */
export interface MessagesQueryParams {
  since?: string;
  direction?: MessageDirection;
  contact?: string;
}
