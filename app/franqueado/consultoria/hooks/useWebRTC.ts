// hooks/useWebRTC.ts
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseWebRTCConfig {
    sessionToken?: string;
    iceServers?: RTCIceServer[];
    onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
    sendOffer?: (offer: RTCSessionDescriptionInit) => Promise<RTCSessionDescriptionInit>;
    sendIceCandidate?: (candidate: RTCIceCandidate) => Promise<void>;
    enabled?: boolean;
}

export function useWebRTC(config: UseWebRTCConfig | null) {
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isReady, setIsReady] = useState(false);

    // Criar PeerConnection
    useEffect(() => {
        if (!config || !config.enabled) {
            if (peerConnection) {
                console.log('🔌 [WebRTC] Fechando peer connection');
                peerConnection.close();
                setPeerConnection(null);
                setLocalStream(null);
                setRemoteStream(null);
                setIsReady(false);
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

        // ICE Candidate local → enviar via callback
        pc.onicecandidate = (event) => {
            if (event.candidate && config.sendIceCandidate) {
                console.log('🧊 [WebRTC] ICE Candidate local gerado');
                config.sendIceCandidate(event.candidate).catch(err =>
                    console.error('❌ [WebRTC] Erro ao enviar ICE candidate:', err)
                );
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
    }, [config?.enabled, config?.sessionToken]); // Recria se sessionToken mudar

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

        if (!config?.sendOffer) {
            throw new Error('Callback sendOffer não configurado');
        }

        console.log('📞 [WebRTC] Criando SDP Offer...');
        try {
            const offer = await peerConnection.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,
            });

            await peerConnection.setLocalDescription(offer);
            console.log('✅ [WebRTC] Local Description configurado');

            // Enviar offer via callback e aguardar answer
            console.log('📤 [WebRTC] Enviando Offer via REST...');
            const answer = await config.sendOffer(offer);

            console.log('📥 [WebRTC] Resposta (Answer) recebida');
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            console.log('✅ [WebRTC] Remote Description configurado');

            return offer;
        } catch (error) {
            console.error('❌ [WebRTC] Erro ao negocia WebRTC:', error);
            throw error;
        }
    }, [peerConnection, config?.sendOffer]);

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
        isReady,
        startLocalMedia,
        stopLocalMedia,
        createAndSendOffer,
    };
}
