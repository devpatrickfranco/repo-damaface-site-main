// hooks/useWebRTC.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocketLiveAvatar } from './useWebSocketLiveAvatar';

interface UseWebRTCConfig {
    sessionToken?: string;
    websocketUrl?: string;
    iceServers?: RTCIceServer[];
    onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
    enabled?: boolean;
}

export function useWebRTC(config: UseWebRTCConfig | null) {
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isReady, setIsReady] = useState(false);

    // WebSocket connection
    const {
        isConnected: wsConnected,
        sendOffer,
        sendIceCandidate: wsSendIceCandidate,
    } = useWebSocketLiveAvatar({
        websocketUrl: config?.websocketUrl,
        sessionToken: config?.sessionToken,
        enabled: config?.enabled && !!config?.websocketUrl && !!config?.sessionToken,
        onAnswer: async (sdp) => {
            if (!peerConnection) return;

            console.log('📞 [WebRTC] Recebendo Answer do LiveAvatar');
            try {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
                console.log('✅ [WebRTC] Remote Description configurado');
            } catch (error) {
                console.error('❌ [WebRTC] Erro ao configurar remote description:', error);
            }
        },
        onIceCandidate: async (candidate) => {
            if (!peerConnection) return;

            console.log('🧊 [WebRTC] Recebendo ICE Candidate do LiveAvatar');
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                console.log('✅ [WebRTC] ICE Candidate adicionado');
            } catch (error) {
                console.error('❌ [WebRTC] Erro ao adicionar ICE candidate:', error);
            }
        },
        onError: (error) => {
            console.error('❌ [WebSocket] Erro:', error);
        },
    });

    // Criar PeerConnection
    useEffect(() => {
        if (!config || !config.enabled) {
            if (peerConnection) {
                console.log('🔌 [WebRTC] Fechando peer connection');
                peerConnection.close();
                setPeerConnection(null);
            }
            return;
        }

        console.log('🔌 [WebRTC] Criando PeerConnection');
        const pc = new RTCPeerConnection({
            iceServers: config.iceServers || [
                { urls: 'stun:stun.l.google.com:19302' },
            ],
        });

        // Receber track remoto (vídeo do avatar)
        pc.ontrack = (event) => {
            console.log('📹 [WebRTC] Track remoto recebido:', event.track.kind);
            const stream = event.streams[0];
            setRemoteStream(stream);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        };

        // ICE Candidate local → enviar via WebSocket
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('🧊 [WebRTC] ICE Candidate local gerado');
                wsSendIceCandidate(event.candidate);
            }
        };

        // Mudanças de estado
        pc.onconnectionstatechange = () => {
            console.log('🔄 [WebRTC] Connection state:', pc.connectionState);
            setConnectionState(pc.connectionState);
            config.onConnectionStateChange?.(pc.connectionState);
        };

        pc.oniceconnectionstatechange = () => {
            console.log('🧊 [WebRTC] ICE connection state:', pc.iceConnectionState);
        };

        setPeerConnection(pc);
        setIsReady(true);

        return () => {
            console.log('🔌 [WebRTC] Limpando peer connection');
            pc.close();
        };
    }, [config?.enabled]);

    // Obter mídia local (microfone)
    const startLocalMedia = useCallback(async () => {
        console.log('🎤 [WebRTC] Obtendo mídia local...');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
                video: false,
            });

            setLocalStream(stream);

            // Adicionar tracks ao peer connection
            if (peerConnection) {
                stream.getTracks().forEach(track => {
                    console.log('🎤 [WebRTC] Adicionando track ao peer connection:', track.kind);
                    peerConnection.addTrack(track, stream);
                });
            }

            console.log('✅ [WebRTC] Mídia local obtida');
            return stream;
        } catch (error) {
            console.error('❌ [WebRTC] Erro ao obter mídia local:', error);
            throw error;
        }
    }, [peerConnection]);

    // Criar e enviar Offer
    const createAndSendOffer = useCallback(async () => {
        if (!peerConnection) {
            throw new Error('Peer connection não inicializada');
        }

        if (!wsConnected) {
            throw new Error('WebSocket não conectado');
        }

        console.log('📞 [WebRTC] Criando SDP Offer...');
        try {
            const offer = await peerConnection.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,
            });

            await peerConnection.setLocalDescription(offer);
            console.log('✅ [WebRTC] Local Description configurado');

            // Enviar offer via WebSocket
            console.log('📤 [WebRTC] Enviando Offer via WebSocket');
            sendOffer(offer);

            return offer;
        } catch (error) {
            console.error('❌ [WebRTC] Erro ao criar offer:', error);
            throw error;
        }
    }, [peerConnection, wsConnected, sendOffer]);

    // Parar mídia local
    const stopLocalMedia = useCallback(() => {
        if (localStream) {
            console.log('🎤 [WebRTC] Parando mídia local');
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
    }, [localStream]);

    return {
        peerConnection,
        connectionState,
        localStream,
        remoteStream,
        videoRef,
        wsConnected,
        isReady,
        startLocalMedia,
        stopLocalMedia,
        createAndSendOffer,
    };
}
