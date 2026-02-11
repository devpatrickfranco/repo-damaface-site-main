// hooks/useWebRTC.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import type { WebRTCConfig } from '../types/consultation';

export function useWebRTC(config: WebRTCConfig | null) {
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    // Criar peer connection
    useEffect(() => {
        if (!config) {
            // Limpar conexão existente
            if (peerConnection) {
                peerConnection.close();
                setPeerConnection(null);
            }
            return;
        }

        const pc = new RTCPeerConnection({
            iceServers: config.iceServers || [
                { urls: 'stun:stun.l.google.com:19302' },
            ],
        });

        // Event listeners
        pc.ontrack = (event) => {
            console.log('Recebido track remoto:', event.track.kind);
            const stream = event.streams[0];
            setRemoteStream(stream);

            // Anexar ao elemento de vídeo
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            config.onTrack?.(event);
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('Novo ICE candidate:', event.candidate);
                config.onIceCandidate?.(event.candidate);
            }
        };

        pc.onconnectionstatechange = () => {
            console.log('Connection state:', pc.connectionState);
            setConnectionState(pc.connectionState);
            config.onConnectionStateChange?.(pc.connectionState);
        };

        setPeerConnection(pc);

        return () => {
            pc.close();
        };
    }, [config]);

    // Obter mídia local (microfone)
    const startLocalMedia = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false,
            });

            setLocalStream(stream);

            // Adicionar tracks ao peer connection
            if (peerConnection) {
                stream.getTracks().forEach(track => {
                    peerConnection.addTrack(track, stream);
                });
            }

            return stream;
        } catch (error) {
            console.error('Erro ao obter mídia local:', error);
            throw error;
        }
    }, [peerConnection]);

    // Parar mídia local
    const stopLocalMedia = useCallback(() => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
    }, [localStream]);

    // Criar oferta
    const createOffer = useCallback(async () => {
        if (!peerConnection) {
            throw new Error('Peer connection não inicializada');
        }

        try {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            return offer;
        } catch (error) {
            console.error('Erro ao criar oferta:', error);
            throw error;
        }
    }, [peerConnection]);

    // Criar resposta
    const createAnswer = useCallback(async (offer: RTCSessionDescriptionInit) => {
        if (!peerConnection) {
            throw new Error('Peer connection não inicializada');
        }

        try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            return answer;
        } catch (error) {
            console.error('Erro ao criar resposta:', error);
            throw error;
        }
    }, [peerConnection]);

    // Adicionar ICE candidate remoto
    const addIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
        if (!peerConnection) {
            throw new Error('Peer connection não inicializada');
        }

        try {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
            console.error('Erro ao adicionar ICE candidate:', error);
            throw error;
        }
    }, [peerConnection]);

    return {
        peerConnection,
        connectionState,
        localStream,
        remoteStream,
        videoRef,
        startLocalMedia,
        stopLocalMedia,
        createOffer,
        createAnswer,
        addIceCandidate,
    };
}
