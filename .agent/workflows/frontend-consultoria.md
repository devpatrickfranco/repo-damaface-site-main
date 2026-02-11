---
description: Frontend implementation guide for Live Avatar Consultation System
---

# Frontend Implementation Guide
## Live Avatar Consultation System with HeyGen

Este documento fornece um guia completo de como implementar o frontend para o sistema de consultoria com avatares ao vivo usando HeyGen.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura de Arquivos](#estrutura-de-arquivos)
3. [Tipos TypeScript](#tipos-typescript)
4. [Hooks Customizados](#hooks-customizados)
5. [Componentes](#componentes)
6. [Integração WebRTC](#integração-webrtc)
7. [Tratamento de Erros](#tratamento-de-erros)
8. [Exemplo Completo](#exemplo-completo)

---

## 🎯 Visão Geral

O sistema de consultoria permite que usuários interajam com avatares virtuais em tempo real através de:

- **Sistema de Fila**: Gerenciamento de posição na fila de espera
- **Sessões WebRTC**: Comunicação em tempo real com avatares HeyGen
- **Heartbeat**: Manutenção automática da sessão ativa
- **Estados de Sessão**: Controle completo do ciclo de vida da consulta

### Fluxo do Usuário

```
Entrar na Fila → Aguardar Vez → Inicializar Sessão → Conectar WebRTC → Consulta Ativa → Encerrar
```

---

## 📁 Estrutura de Arquivos

```
app/franqueado/consultoria/
├── components/
│   ├── consultant-video.tsx      # Componente de vídeo do avatar
│   ├── session-controls.tsx      # Controles de sessão
│   └── webrtc-manager.tsx        # (NOVO) Gerenciador WebRTC
├── hooks/
│   ├── useConsultationQueue.ts   # (NOVO) Hook para fila
│   ├── useConsultationSession.ts # (NOVO) Hook para sessão
│   └── useWebRTC.ts              # (NOVO) Hook para WebRTC
├── types/
│   └── consultation.ts           # (NOVO) Tipos TypeScript
├── gestao/
│   └── page.tsx                  # Página de consultoria de gestão
├── comercial/
│   └── page.tsx                  # Página de consultoria comercial
└── tecnico/
    └── page.tsx                  # Página de consultoria técnica
```

---

## 🔷 Tipos TypeScript

Crie o arquivo `types/consultation.ts`:

```typescript
// types/consultation.ts

export type QueueStatus = 'not_queued' | 'queued' | 'reserved';
export type SessionStatus = 'active' | 'disconnected' | 'ended' | 'cooldown';
export type SessionPhase = 'queue' | 'called' | 'active' | 'ending' | 'ended' | 'cooldown';

export interface QueueResponse {
  id: string;
  user: number;
  agent_type: string;
  status: QueueStatus;
  joined_at: string;
  position: number;
  estimated_wait_time: number;
}

export interface QueueStatusResponse {
  status: QueueStatus;
  position: number;
  estimated_wait_time?: number;
  agent_type?: string;
}

export interface SessionResponse {
  session: {
    id: string;
    user: number;
    agent_type: string;
    status: SessionStatus;
    heygen_session_id: string;
    started_at: string;
    last_heartbeat: string;
  };
  heygen_data: {
    session_id: string;
    session_token: string;
    ice_servers?: RTCIceServer[];
    sdp?: RTCSessionDescriptionInit;
    [key: string]: any;
  };
}

export interface WebRTCConfig {
  sessionId: string;
  sessionToken: string;
  iceServers?: RTCIceServer[];
  onTrack?: (event: RTCTrackEvent) => void;
  onIceCandidate?: (candidate: RTCIceCandidate) => void;
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
}
```

---

## 🪝 Hooks Customizados

### 1. Hook para Gerenciar Fila

Crie o arquivo `hooks/useConsultationQueue.ts`:

```typescript
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
        '/api/consultoria/queue/status/'
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
      const response = await apiBackend.post('/api/consultoria/queue/join/', {
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
      await apiBackend.post('/api/consultoria/queue/leave/');
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
```

### 2. Hook para Gerenciar Sessão

Crie o arquivo `hooks/useConsultationSession.ts`:

```typescript
// hooks/useConsultationSession.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { apiBackend } from '@/lib/api-backend';
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
        await apiBackend.post('/api/consultoria/session/heartbeat/', {
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
        '/api/consultoria/session/initialize/',
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
      const response = await apiBackend.post('/api/consultoria/session/connect/', {
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
      await apiBackend.post('/api/consultoria/session/ice/', {
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
      await apiBackend.post('/api/consultoria/session/terminate/', {
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
    initializeSession,
    connectSession,
    sendIceCandidate,
    terminateSession,
  };
}
```

### 3. Hook para WebRTC

Crie o arquivo `hooks/useWebRTC.ts`:

```typescript
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
```

---

## 🎨 Componentes

Os componentes já existentes (`consultant-video.tsx` e `session-controls.tsx`) podem ser mantidos. Eles já fornecem a UI necessária.

---

## 🔌 Integração WebRTC

### Fluxo de Conexão WebRTC

1. **Inicializar sessão** → Backend retorna `session_token` e `session_id`
2. **Criar peer connection** → Usar `session_token` para autenticação
3. **Obter mídia local** → Solicitar permissão de microfone
4. **Criar SDP answer** → Responder à oferta do HeyGen
5. **Enviar SDP ao backend** → Backend conecta com HeyGen
6. **Trocar ICE candidates** → Estabelecer conexão P2P
7. **Sessão ativa** → Manter heartbeat

---

## ⚠️ Tratamento de Erros

### Erros Comuns

| Código | Erro | Ação |
|--------|------|------|
| 400 | Parâmetros inválidos | Verificar dados enviados |
| 403 | Sem reserva / Não autorizado | Voltar para fila |
| 404 | Sessão não encontrada | Reinicializar sessão |
| 500 | Erro interno | Tentar novamente |

### Exemplo de Tratamento

```typescript
try {
  await initializeSession();
} catch (error: any) {
  if (error.message?.includes('403')) {
    // Sem reserva - voltar para fila
    toast.error('Você precisa estar na fila primeiro');
    router.push('/consultoria');
  } else if (error.message?.includes('500')) {
    // Erro do servidor - tentar novamente
    toast.error('Erro ao criar sessão. Tente novamente.');
  } else {
    toast.error(error.message || 'Erro desconhecido');
  }
}
```

---

## 📦 Exemplo Completo

### Página de Consultoria Integrada

```typescript
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ConsultantVideo } from "../components/consultant-video"
import { SessionControls, type SessionPhase } from "../components/session-controls"
import { useConsultationQueue } from "../hooks/useConsultationQueue"
import { useConsultationSession } from "../hooks/useConsultationSession"
import { useWebRTC } from "../hooks/useWebRTC"
import { toast } from "sonner"

const AGENT_TYPE = "gestao" // ou "comercial", "tecnico"

export default function ConsultoriaPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<SessionPhase>("queue")
  const [isMicOn, setIsMicOn] = useState(true)

  // Hook de fila
  const {
    queueStatus,
    isJoining,
    joinQueue,
    leaveQueue,
  } = useConsultationQueue({
    agentType: AGENT_TYPE,
    onReserved: () => {
      setPhase("called")
      toast.success("É sua vez! Entre na sala agora.")
    },
    onError: (error) => {
      toast.error(error)
    },
  })

  // Hook de sessão
  const {
    session,
    isInitializing,
    initializeSession,
    connectSession,
    sendIceCandidate,
    terminateSession,
  } = useConsultationSession({
    agentType: AGENT_TYPE,
    onSessionEnd: () => {
      setPhase("ended")
      toast.info("Sessão encerrada")
    },
    onError: (error) => {
      toast.error(error)
    },
  })

  // Hook WebRTC
  const {
    connectionState,
    videoRef,
    startLocalMedia,
    createAnswer,
  } = useWebRTC(
    session
      ? {
          sessionId: session.heygen_data.session_id,
          sessionToken: session.heygen_data.session_token,
          iceServers: session.heygen_data.ice_servers,
          onIceCandidate: (candidate) => {
            sendIceCandidate(candidate)
          },
          onConnectionStateChange: (state) => {
            if (state === "connected") {
              setPhase("active")
              toast.success("Conectado ao consultor!")
            } else if (state === "failed" || state === "disconnected") {
              toast.error("Conexão perdida")
            }
          },
        }
      : null
  )

  // Entrar na fila automaticamente
  useEffect(() => {
    if (!queueStatus || queueStatus.status === "not_queued") {
      joinQueue()
    }
  }, [])

  // Handler: Entrar na sessão
  const handleJoin = async () => {
    try {
      // 1. Inicializar sessão
      const sessionData = await initializeSession()
      
      // 2. Obter mídia local
      await startLocalMedia()
      
      // 3. Criar SDP answer
      if (sessionData.heygen_data.sdp) {
        const answer = await createAnswer(sessionData.heygen_data.sdp)
        
        // 4. Enviar SDP ao backend
        await connectSession(answer)
      }
    } catch (error: any) {
      console.error("Erro ao entrar na sessão:", error)
      toast.error(error.message || "Erro ao entrar na sessão")
    }
  }

  // Handler: Encerrar sessão
  const handleEnd = async () => {
    try {
      await terminateSession()
      setPhase("ended")
    } catch (error: any) {
      console.error("Erro ao encerrar sessão:", error)
    }
  }

  const isSessionActive = phase === "active" || phase === "ending"

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] gap-4">
      {/* Header */}
      <header className="shrink-0">
        <h1 className="text-2xl font-bold">Consultoria de Gestão</h1>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col gap-4 min-h-0">
        {/* Video */}
        <ConsultantVideo
          status={isSessionActive ? "speaking" : "waiting"}
          onToggleMic={() => setIsMicOn(!isMicOn)}
          isMicOn={isMicOn}
          isSessionActive={isSessionActive}
          videoRef={videoRef}
          title="Consultor de Gestão"
        />

        {/* Controls */}
        <SessionControls
          phase={phase}
          queuePosition={queueStatus?.position || 0}
          totalInQueue={5}
          onJoin={handleJoin}
          onEnd={handleEnd}
        />
      </main>
    </div>
  )
}
```

---

## 🔐 Autenticação

O sistema já usa cookies de sessão Django. Certifique-se de que:

1. O usuário está autenticado (cookie `sessionid`)
2. O CSRF token está sendo enviado (`X-CSRFToken` header)
3. As credenciais estão incluídas (`credentials: "include"`)

Isso já está implementado em `lib/api-backend.ts`.

---

## 📝 Checklist de Implementação

- [ ] Criar tipos TypeScript (`types/consultation.ts`)
- [ ] Implementar hook de fila (`hooks/useConsultationQueue.ts`)
- [ ] Implementar hook de sessão (`hooks/useConsultationSession.ts`)
- [ ] Implementar hook WebRTC (`hooks/useWebRTC.ts`)
- [ ] Atualizar componente de vídeo para aceitar `videoRef`
- [ ] Integrar hooks na página de consultoria
- [ ] Testar fluxo completo: fila → sessão → WebRTC → encerramento
- [ ] Adicionar tratamento de erros e toasts
- [ ] Implementar lógica de cooldown
- [ ] Testar em diferentes navegadores

---

## 🐛 Debugging

### Logs Úteis

```typescript
// No hook de sessão
console.log('Session initialized:', session)
console.log('Heartbeat sent:', new Date().toISOString())

// No hook WebRTC
console.log('Connection state:', connectionState)
console.log('ICE candidate:', candidate)
console.log('Remote stream:', remoteStream)
```

### Ferramentas

- **Chrome DevTools** → `chrome://webrtc-internals/`
- **Firefox** → `about:webrtc`
- **Network tab** → Verificar chamadas API

---

## 📚 Recursos Adicionais

- [HeyGen API Documentation](https://docs.heygen.com/)
- [WebRTC API MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [React Hooks Best Practices](https://react.dev/reference/react)

---

## ✅ Conclusão

Este guia fornece todos os componentes necessários para implementar o frontend do sistema de consultoria. Siga a ordem:

1. Criar tipos
2. Implementar hooks
3. Integrar na página
4. Testar e debugar

Para dúvidas, consulte a documentação do backend em `.agent/workflows/api-consultoria.md`.
