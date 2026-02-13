import { useState, useEffect, useCallback, useRef } from 'react';
import { apiBackend } from '@/lib/api-backend';
import { Room, createLocalAudioTrack, LocalAudioTrack, RoomEvent } from 'livekit-client';
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
    const [isMicOn, setIsMicOn] = useState(false);
    const [agentStatus, setAgentStatus] = useState<'waiting' | 'listening' | 'speaking'>('waiting');
    const audioTrackRef = useRef<LocalAudioTrack | null>(null);
    const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Listen for room events
    useEffect(() => {
        if (!room) return;

        const handleDataReceived = (payload: Uint8Array, participant: any, kind: any, topic?: string) => {
            if (topic !== 'agent-response') return;

            try {
                const decoder = new TextDecoder();
                const data = JSON.parse(decoder.decode(payload));
                console.log('📥 [useConsultationSession] Evento recebido:', data.event_type);

                switch (data.event_type) {
                    case 'user.speak_started':
                        setAgentStatus('listening');
                        break;
                    case 'user.speak_ended':
                        setAgentStatus('waiting');
                        break;
                    case 'avatar.speak_started':
                        setAgentStatus('speaking');
                        break;
                    case 'avatar.speak_ended':
                        setAgentStatus('waiting');
                        break;
                }
            } catch (error) {
                console.error('❌ [useConsultationSession] Erro ao processar evento:', error);
            }
        };

        room.on(RoomEvent.DataReceived, handleDataReceived);

        return () => {
            room.off(RoomEvent.DataReceived, handleDataReceived);
        };
    }, [room]);

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

    // Comandos do Avatar via Data Channel
    const sendAvatarCommand = useCallback(async (eventType: string, data?: any) => {
        if (!room) {
            console.warn('⚠️ [useConsultationSession] Room não definida. Não foi possível enviar comando.');
            return;
        }

        try {
            const encoder = new TextEncoder();
            const payload = { event_type: eventType, ...data };
            const encodedData = encoder.encode(JSON.stringify(payload));

            await room.localParticipant.publishData(encodedData, {
                topic: 'agent-control',
                reliable: true,
            });
            console.log(`📤 [useConsultationSession] Comando enviado: ${eventType}`, payload);
        } catch (error) {
            console.error(`❌ [useConsultationSession] Erro ao enviar comando ${eventType}:`, error);
        }
    }, [room]);

    const startListening = useCallback(() => sendAvatarCommand('avatar.start_listening'), [sendAvatarCommand]);
    const stopListening = useCallback(() => sendAvatarCommand('avatar.stop_listening'), [sendAvatarCommand]);
    const interrupt = useCallback(() => sendAvatarCommand('avatar.interrupt'), [sendAvatarCommand]);

    // Iniciar Voice Chat (Publicar Microfone)
    const startVoiceChat = useCallback(async (existingTrack?: LocalAudioTrack) => {
        if (!room) return;

        try {
            console.log('🎤 [useConsultationSession] Iniciando Voice Chat...');
            let track = existingTrack;

            if (!track) {
                track = await createLocalAudioTrack({
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                });
            }

            // Publicar o track
            await room.localParticipant.publishTrack(track);
            audioTrackRef.current = track;
            setIsMicOn(true);
            console.log('✅ [useConsultationSession] Microfone publicado. Ativando escuta do avatar...');

            // IMPORTANTE: Enviar comando APÓS publicar o track e com um pequeno delay 
            // para garantir que o agente perceba o stream de áudio
            setTimeout(() => {
                sendAvatarCommand('avatar.start_listening');
            }, 800);

        } catch (error) {
            console.error('❌ [useConsultationSession] Erro ao iniciar Voice Chat:', error);
            onError?.('Erro ao acessar microfone');
        }
    }, [room, sendAvatarCommand, onError]);

    // Parar Voice Chat (Despublicar Microfone)
    const stopVoiceChat = useCallback(async () => {
        if (!room || !audioTrackRef.current) return;

        try {
            console.log('🎤 [useConsultationSession] Parando Voice Chat...');
            await room.localParticipant.unpublishTrack(audioTrackRef.current);
            audioTrackRef.current.stop();
            audioTrackRef.current = null;
            setIsMicOn(false);

            // Também avisar o avatar para parar de ouvir se o mic for desligado?
            // De acordo com o SDK, start_listening põe em modo conversacional.
        } catch (error) {
            console.error('❌ [useConsultationSession] Erro ao parar Voice Chat:', error);
        }
    }, [room]);

    // Alternar Mudo (Mute/Unmute sem despublicar se preferir, ou apenas usar start/stop)
    const toggleMic = useCallback(async () => {
        if (isMicOn) {
            await stopVoiceChat();
        } else {
            await startVoiceChat();
        }
    }, [isMicOn, startVoiceChat, stopVoiceChat]);

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

    return {
        session,
        isInitializing,
        isTerminating,
        room,
        isMicOn,
        agentStatus,
        setRoom,
        initializeSession,
        terminateSession,
        startVoiceChat,
        stopVoiceChat,
        toggleMic,
        startListening,
        stopListening,
        interrupt,
    };
}
