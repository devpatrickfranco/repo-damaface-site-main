// hooks/useConsultationQueue.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { apiBackend } from '@/lib/api-backend';
import type { QueueStatusResponse } from '../types/consultation';

const POLL_INTERVAL = 3000; // 3 segundos

interface UseConsultationQueueOptions {
    agentType: string;
    onReserved?: () => void;
    onError?: (error: string) => void;
}

export function useConsultationQueue({
    agentType,
    onReserved,
    onError,
}: UseConsultationQueueOptions) {
    const [queueStatus, setQueueStatus] = useState<QueueStatusResponse | null>(null);
    const [isPolling, setIsPolling] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Função para verificar status na fila
    const checkQueueStatus = useCallback(async () => {
        try {
            const response = await apiBackend.get<QueueStatusResponse>(
                '/consultoria/queue/status/'
            );

            setQueueStatus(response);

            // Se foi reservado, para o polling e notifica
            if (response.status === 'reserved') {
                setIsPolling(false);
                onReserved?.();
            }
        } catch (error: any) {
            if (error.message?.includes('404')) {
                // Não está na fila
                setQueueStatus({ status: 'not_queued', position: 0 });
                setIsPolling(false);
            } else {
                console.error('Erro ao verificar status da fila:', error);
                onError?.(error.message || 'Erro ao verificar status da fila');
            }
        }
    }, [onReserved, onError]);

    // Polling automático
    useEffect(() => {
        if (!isPolling) {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
            }
            return;
        }

        // Primeira verificação imediata
        checkQueueStatus();

        // Polling a cada 3 segundos
        pollIntervalRef.current = setInterval(checkQueueStatus, POLL_INTERVAL);

        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
            }
        };
    }, [isPolling, checkQueueStatus]);

    // Entrar na fila
    const joinQueue = useCallback(async () => {
        setIsJoining(true);
        try {
            const response = await apiBackend.post('/consultoria/queue/join/', {
                agent_type: agentType,
            });

            setQueueStatus(response);
            setIsPolling(true);
            return response;
        } catch (error: any) {
            const errorMessage = error.message || 'Erro ao entrar na fila';
            onError?.(errorMessage);
            throw error;
        } finally {
            setIsJoining(false);
        }
    }, [agentType, onError]);

    // Sair da fila
    const leaveQueue = useCallback(async () => {
        setIsLeaving(true);
        try {
            await apiBackend.post('/consultoria/queue/leave/');
            setQueueStatus({ status: 'not_queued', position: 0 });
            setIsPolling(false);
        } catch (error: any) {
            const errorMessage = error.message || 'Erro ao sair da fila';
            onError?.(errorMessage);
            throw error;
        } finally {
            setIsLeaving(false);
        }
    }, [onError]);

    return {
        queueStatus,
        isPolling,
        isJoining,
        isLeaving,
        joinQueue,
        leaveQueue,
        checkQueueStatus,
    };
}
