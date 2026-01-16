import { useEffect, useState } from 'react';

/**
 * Hook para gerenciar Session ID temporário
 * - Gera um ID único baseado em timestamp + random
 * - Persiste no sessionStorage durante navegação
 * - Reseta automaticamente ao recarregar a página
 */
export const useSessionId = () => {
    const [sessionId, setSessionId] = useState<string>('');

    useEffect(() => {
        // Gera um novo session ID único
        const generateSessionId = () => {
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(2, 9);
            return `${timestamp}-${randomStr}`;
        };

        // Verifica se já existe um sessionId no sessionStorage
        const existingSessionId = sessionStorage.getItem('ai_chat_session_id');

        if (existingSessionId) {
            // Usa o ID existente (durante navegação na mesma aba)
            setSessionId(existingSessionId);
        } else {
            // Gera um novo ID (primeira vez ou após reload)
            const newSessionId = generateSessionId();
            sessionStorage.setItem('ai_chat_session_id', newSessionId);
            setSessionId(newSessionId);
        }
    }, []);

    // Função para resetar manualmente a sessão
    const resetSession = () => {
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 9);
        const newSessionId = `${timestamp}-${randomStr}`;

        sessionStorage.setItem('ai_chat_session_id', newSessionId);
        setSessionId(newSessionId);

        return newSessionId;
    };

    return { sessionId, resetSession };
};
