import { ErrorInfo, ErrorType } from '../types';

/**
 * Error patterns to detect and classify failures
 */
const ERROR_PATTERNS: Record<string, ErrorType> = {
  '429': 'rate_limit',
  'too many requests': 'rate_limit',
  'window is closed': 'business_rule',
  '24h_window_closed': 'business_rule',
  'template': 'business_rule',
  'invalid token': 'auth',
  'unauthorized': 'auth',
  'timeout': 'infra',
  'refused': 'infra',
  'network': 'infra',
  'adblock': 'client_blocked',
  'popup': 'client_blocked',
};

/**
 * Normalizes backend/external errors into a structured ErrorInfo object
 */
export function mapError(error: any): ErrorInfo {
  const message = typeof error === 'string' 
    ? error 
    : error?.message || error?.detail || 'Erro desconhecido';
  
  const normalizedMessage = message.toLowerCase();
  let type: ErrorType = 'unknown';

  // Check pattern matching
  for (const [pattern, errorType] of Object.entries(ERROR_PATTERNS)) {
    if (normalizedMessage.includes(pattern)) {
      type = errorType;
      break;
    }
  }

  // Handle specific status codes if available
  if (error?.status === 429) type = 'rate_limit';
  if (error?.status >= 500) type = 'infra';
  if (error?.status === 401 || error?.status === 403) type = 'auth';

  const retryable = type === 'infra' || type === 'rate_limit';

  return {
    type,
    message: formatUserFriendlyMessage(type, message),
    actionable: type !== 'infra',
    retryable,
    raw: error,
  };
}

/**
 * Transforms technical messages into human-friendly ones
 */
function formatUserFriendlyMessage(type: ErrorType, rawMessage: string): string {
  switch (type) {
    case 'rate_limit':
      return 'O sistema está sobrecarregado. Por favor, aguarde alguns instantes e tente novamente.';
    case 'business_rule':
      if (rawMessage.includes('window')) {
        return 'A janela de 24h para mensagens livres fechou. Utilize um template para reiniciar a conversa.';
      }
      return 'Regra de negócio: ' + rawMessage;
    case 'infra':
      return 'O serviço do WhatsApp está instável no momento. Nossa equipe já foi notificada.';
    case 'auth':
      return 'Sua sessão expirou. Por favor, faça login novamente.';
    case 'client_blocked':
      if (rawMessage.includes('adblock')) {
        return 'O script da Meta foi bloqueado por um AdBlock. Desative-o para conectar o WhatsApp.';
      }
      return 'O popup de conexão foi bloqueado pelo seu navegador. Por favor, asceda permissão.';
    default:
      return 'Erro inesperado: ' + rawMessage;
  }
}
