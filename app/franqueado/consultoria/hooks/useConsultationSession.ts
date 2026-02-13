import { useState, useEffect, useCallback, useRef } from 'react';
import { apiBackend } from '@/lib/api-backend';
import { Room } from 'livekit-client';
import type { SessionResponse } from '../types/consultation';

const HEARTBEAT_INTERVAL = 10000; // 10 segundos

interface UseConsultationSessionOptions {
    agentType: string;
    onSessionEnd?: () => void;
    onError?: (error: string) => void;
}

export function useConsultationSession({
    agentType,
    onSessionEnd,
    onError,
}: UseConsultationSessionOptions) {
    const [session, setSession] = useState<SessionResponse | null>(null);
    const [isInitializing, setIsInitializing] = useState(false);
    const [isTerminating, setIsTerminating] = useState(false);
    const [room, setRoom] = useState<Room | null>(null);
    const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Heartbeat automático
    useEffect(() => {
        if (!session) {
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
                heartbeatIntervalRef.current = null;
            }
            return;
        }

        const sendHeartbeat = async () => {
            try {
                await apiBackend.post('/consultoria/session/heartbeat/', {
                    session_id: session.heygen_data.session_id,
                });
            } catch (error: any) {
                console.error('Erro no heartbeat:', error);

                // Se sessão não existe mais, limpa estado
                if (error.message?.includes('404')) {
                    setSession(null);
                    onSessionEnd?.();
                }
            }
        };

        // Primeiro heartbeat imediato
        sendHeartbeat();

        // Heartbeat a cada 10 segundos
        heartbeatIntervalRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

        return () => {
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
                heartbeatIntervalRef.current = null;
            }
        };
    }, [session, onSessionEnd]);

    // Inicializar sessão
    const initializeSession = useCallback(async (options?: {
        avatar_id?: string;
        voice_id?: string;
    }) => {
        setIsInitializing(true);
        try {
            const response = await apiBackend.post<SessionResponse>(
                '/consultoria/session/initialize/',
                {
                    agent_type: agentType,
                    ...options,
                }
            );

            setSession(response);
            return response;
        } catch (error: any) {
            const errorMessage = error.message || 'Erro ao inicializar sessão';
            onError?.(errorMessage);
            throw error;
        } finally {
            setIsInitializing(false);
        }
    }, [agentType, onError]);

    // Conectar sessão (enviar SDP)
    const connectSession = useCallback(async (sdp: RTCSessionDescriptionInit) => {
        if (!session) {
            throw new Error('Sessão não inicializada');
        }

        try {
            const response = await apiBackend.post('/consultoria/session/connect/', {
                session_id: session.heygen_data.session_id,
                sdp,
            });

            return response;
        } catch (error: any) {
            const errorMessage = error.message || 'Erro ao conectar sessão';
            onError?.(errorMessage);
            throw error;
        }
    }, [session, onError]);

    // Enviar ICE candidate
    const sendIceCandidate = useCallback(async (candidate: RTCIceCandidate) => {
        if (!session) {
            throw new Error('Sessão não inicializada');
        }

        try {
            await apiBackend.post('/consultoria/session/ice/', {
                session_id: session.heygen_data.session_id,
                candidate: {
                    candidate: candidate.candidate,
                    sdpMid: candidate.sdpMid,
                    sdpMLineIndex: candidate.sdpMLineIndex,
                },
            });
        } catch (error: any) {
            console.error('Erro ao enviar ICE candidate:', error);
            // Não propaga erro de ICE candidate para não interromper a sessão
        }
    }, [session]);

    // Terminar sessão
    const terminateSession = useCallback(async () => {
        if (!session) return;

        setIsTerminating(true);
        try {
            await apiBackend.post('/consultoria/session/terminate/', {
                session_id: session.heygen_data.session_id,
            });

            setSession(null);
            onSessionEnd?.();
        } catch (error: any) {
            const errorMessage = error.message || 'Erro ao terminar sessão';
            onError?.(errorMessage);
            throw error;
        } finally {
            setIsTerminating(false);
        }
    }, [session, onSessionEnd, onError]);

    // Comandos do Avatar via Data Channel
    const sendAvatarCommand = useCallback(async (eventType: string) => {
        if (!room) {
            console.warn('⚠️ [useConsultationSession] Room não definida. Não foi possível enviar comando.');
            return;
        }

        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(JSON.stringify({ event_type: eventType }));
            await room.localParticipant.publishData(data, {
                topic: 'agent-control',
            });
            console.log(`📤 [useConsultationSession] Comando enviado: ${eventType}`);
        } catch (error) {
            console.error(`❌ [useConsultationSession] Erro ao enviar comando ${eventType}:`, error);
        }
    }, [room]);

    const startListening = useCallback(() => sendAvatarCommand('avatar.start_listening'), [sendAvatarCommand]);
    const stopListening = useCallback(() => sendAvatarCommand('avatar.stop_listening'), [sendAvatarCommand]);
    const interrupt = useCallback(() => sendAvatarCommand('avatar.interrupt'), [sendAvatarCommand]);

    return {
        session,
        isInitializing,
        isTerminating,
        room,
        setRoom,
        initializeSession,
        connectSession,
        sendIceCandidate,
        terminateSession,
        startListening,
        stopListening,
        interrupt,
    };
}
