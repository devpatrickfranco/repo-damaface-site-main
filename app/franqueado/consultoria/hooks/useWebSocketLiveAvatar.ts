// hooks/useWebSocketLiveAvatar.ts
import { useState, useEffect, useCallback, useRef } from 'react';

interface WebSocketMessage {
    type: 'answer' | 'ice' | 'error' | 'close';
    data?: any;
    message?: string;
}

interface UseWebSocketLiveAvatarProps {
    websocketUrl?: string;
    sessionToken?: string;
    onAnswer?: (sdp: RTCSessionDescriptionInit) => void;
    onIceCandidate?: (candidate: RTCIceCandidateInit) => void;
    onError?: (error: string) => void;
    enabled?: boolean;
}

export function useWebSocketLiveAvatar({
    websocketUrl,
    sessionToken,
    onAnswer,
    onIceCandidate,
    onError,
    enabled = true,
}: UseWebSocketLiveAvatarProps) {
    const [isConnected, setIsConnected] = useState(false);
    const [connectionState, setConnectionState] = useState<'connecting' | 'open' | 'closing' | 'closed'>('closed');
    const wsRef = useRef<WebSocket | null>(null);

    // Conectar ao WebSocket
    useEffect(() => {
        if (!enabled || !websocketUrl || !sessionToken) {
            return;
        }

        console.log('🔌 [WebSocket] Conectando ao LiveAvatar...', websocketUrl);

        const url = `${websocketUrl}?session_token=${sessionToken}`;
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('✅ [WebSocket] Conectado ao LiveAvatar');
            setIsConnected(true);
            setConnectionState('open');
        };

        ws.onmessage = (event) => {
            try {
                const message: WebSocketMessage = JSON.parse(event.data);
                console.log('📨 [WebSocket] Mensagem recebida:', message.type);

                switch (message.type) {
                    case 'answer':
                        console.log('📞 [WebSocket] SDP Answer recebido');
                        onAnswer?.(message.data);
                        break;

                    case 'ice':
                        console.log('🧊 [WebSocket] ICE Candidate recebido');
                        onIceCandidate?.(message.data);
                        break;

                    case 'error':
                        console.error('❌ [WebSocket] Erro:', message.message);
                        onError?.(message.message || 'Erro desconhecido');
                        break;

                    case 'close':
                        console.log('👋 [WebSocket] Sessão encerrada pelo servidor');
                        ws.close();
                        break;
                }
            } catch (error) {
                console.error('❌ [WebSocket] Erro ao processar mensagem:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('❌ [WebSocket] Erro de conexão:', error);
            onError?.('Erro na conexão WebSocket');
        };

        ws.onclose = () => {
            console.log('🔌 [WebSocket] Desconectado');
            setIsConnected(false);
            setConnectionState('closed');
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                console.log('🔌 [WebSocket] Fechando conexão...');
                ws.close();
            }
        };
    }, [websocketUrl, sessionToken, enabled]);

    // Enviar SDP Offer
    const sendOffer = useCallback((sdp: RTCSessionDescriptionInit) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            console.error('❌ [WebSocket] Não conectado, não é possível enviar offer');
            return;
        }

        console.log('📤 [WebSocket] Enviando SDP Offer');
        wsRef.current.send(JSON.stringify({
            type: 'sdp',
            data: sdp,
        }));
    }, []);

    // Enviar ICE Candidate
    const sendIceCandidate = useCallback((candidate: RTCIceCandidate) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            console.error('❌ [WebSocket] Não conectado, não é possível enviar ICE');
            return;
        }

        console.log('📤 [WebSocket] Enviando ICE Candidate');
        wsRef.current.send(JSON.stringify({
            type: 'ice',
            data: {
                candidate: candidate.candidate,
                sdpMid: candidate.sdpMid,
                sdpMLineIndex: candidate.sdpMLineIndex,
            },
        }));
    }, []);

    return {
        isConnected,
        connectionState,
        sendOffer,
        sendIceCandidate,
    };
}
