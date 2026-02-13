"use client"

import { useState, useEffect } from "react"
import { ConsultantVideo } from "../components/consultant-video"
import {
    SessionControls,
    type SessionPhase,
} from "../components/session-controls"
import { useConsultationQueue } from "../hooks/useConsultationQueue"
import { useConsultationSession } from "../hooks/useConsultationSession"
import { Headphones, Shield, Lock } from "lucide-react"
import { useMemo } from "react"
import { Room, createLocalAudioTrack, LocalAudioTrack } from "livekit-client"
import { LiveKitRoom } from "@livekit/components-react"
import { HeyGenAvatar } from "../components/HeyGenAvatar"
import "@livekit/components-styles"

const AGENT_TYPE = "gestao"
const TOTAL_SESSION_TIME = 900 // 15 minutes
const JOIN_TIMEOUT = 120 // 2 minutes to enter the room
const COOLDOWN_TIME = 7200 // 2 hours in seconds

export default function ConsultantPage() {
    const [phase, setPhase] = useState<SessionPhase>("queue")
    const [timeRemaining, setTimeRemaining] = useState(TOTAL_SESSION_TIME)
    const [joinCountdown, setJoinCountdown] = useState(JOIN_TIMEOUT)
    const [cooldownRemaining, setCooldownRemaining] = useState(0)
    const [consultantStatus, setConsultantStatus] = useState<
        "available" | "waiting" | "speaking" | "disconnected"
    >("waiting")

    // Instância fixa do LiveKit Room
    const room = useMemo(() => new Room({
        adaptiveStream: true,
        dynacast: true,
    }), [])

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
            setConsultantStatus("available")
            setJoinCountdown(JOIN_TIMEOUT)
        },
        onError: (error) => {
            console.error("Erro na fila:", error)
        },
    })

    // Hook de sessão
    const {
        session,
        isInitializing,
        initializeSession,
        terminateSession,
        setRoom,
        startVoiceChat,
        toggleMic,
        startListening,
        agentStatus,
        isMicOn: isSessionMicOn,
    } = useConsultationSession({
        agentType: AGENT_TYPE,
        onSessionEnd: () => {
            setPhase("cooldown")
            setConsultantStatus("disconnected")
            setCooldownRemaining(COOLDOWN_TIME)
        },
        onError: (error) => {
            console.error("Erro na sessão:", error)
        },
    })

    // Vincular room ao hook de sessão
    useEffect(() => {
        setRoom(room)
    }, [room, setRoom])

    // Entrar na fila automaticamente
    useEffect(() => {
        if (!queueStatus || queueStatus.status === "not_queued") {
            joinQueue()
        }
    }, [])

    // Join countdown (2 min to enter the room)
    useEffect(() => {
        if (phase !== "called") return
        const interval = setInterval(() => {
            setJoinCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    // Volta para a fila em vez de cooldown
                    leaveQueue().then(() => {
                        joinQueue()
                        setPhase("queue")
                        setConsultantStatus("waiting")
                    })
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [phase])

    // Session timer
    useEffect(() => {
        if (phase !== "active" && phase !== "ending") return
        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    handleEnd()
                    return 0
                }
                if (prev <= 120 && phase !== "ending") {
                    setPhase("ending")
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [phase])

    // Cooldown timer (2 hours)
    useEffect(() => {
        if (phase !== "cooldown") return
        const interval = setInterval(() => {
            setCooldownRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    setPhase("ended")
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [phase])

    // Handler: Entrar na sessão
    const handleJoin = async () => {
        if (phase === "ended") {
            setPhase("queue")
            setConsultantStatus("waiting")
            setTimeRemaining(TOTAL_SESSION_TIME)
            setJoinCountdown(JOIN_TIMEOUT)
            joinQueue()
            return
        }

        try {
            // 1. Solicitar permissão de áudio agora (preservar gesto do usuário)
            let audioTrack: LocalAudioTrack | undefined;
            try {
                audioTrack = await createLocalAudioTrack({
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                });
            } catch (err) {
                console.warn("⚠️ Permissão de microfone negada ou erro:", err);
            }

            // 2. Inicializar sessão no backend
            const sessionData = await initializeSession()

            // 3. Verificar dados recebidos
            if (!sessionData.heygen_data.livekit_token) {
                audioTrack?.stop();
                throw new Error("Backend não retornou livekit_token")
            }

            // 4. Atualizar estado para conectar ao LiveKit
            setPhase("active")
            setConsultantStatus("speaking")
            setTimeRemaining(TOTAL_SESSION_TIME)

            // 5. Iniciar voice chat com o track já criado
            if (audioTrack) {
                startVoiceChat(audioTrack);
            }

        } catch (error: any) {
            console.error("Erro ao entrar na sessão:", error)
            // Em caso de erro, volta para a fila
            setPhase("queue")
            setConsultantStatus("waiting")
        }
    }

    // Handler: Encerrar sessão
    const handleEnd = async () => {
        try {
            await terminateSession()
        } catch (error: any) {
            console.error("Erro ao encerrar sessão:", error)
        }
    }

    const isSessionActive = phase === "active" || phase === "ending"

    return (
        <div className="flex flex-col min-h-[calc(100vh-8rem)] gap-4">
            {/* Header */}
            <header className="shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-brand-pink flex items-center justify-center shadow-lg shadow-brand-pink/20">
                            <Headphones className="w-4.5 h-4.5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-gray-100 tracking-tight">
                                DamaFace
                            </h1>
                            <p className="text-[11px] text-gray-400">
                                Consultoria de Gestão
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {isSessionActive && (
                            <div className="hidden sm:flex items-center gap-1.5 text-emerald-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs font-medium">Conectado</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5 text-gray-500">
                            <Lock className="w-3.5 h-3.5" />
                            <span className="text-xs hidden sm:inline">Sessao criptografada</span>
                            <Shield className="w-3.5 h-3.5 sm:hidden" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 flex flex-col gap-4 min-h-0">
                {/* Video area */}
                {isSessionActive && session?.heygen_data.livekit_token ? (
                    <div className="relative flex-1 rounded-2xl overflow-hidden border border-gray-700/50 bg-gray-800/50 min-h-[360px] lg:min-h-[480px]">
                        <LiveKitRoom
                            room={room}
                            token={session.heygen_data.livekit_token}
                            serverUrl={session.heygen_data.livekit_url || "wss://heygen-feapbkvq.livekit.cloud"}
                            style={{ height: '100%' }}
                            onConnected={() => {
                                console.log("🎤 [Session] Conectado! Aguardando voz...");
                            }}
                            onDisconnected={handleEnd}
                        >
                            <HeyGenAvatar
                                status={agentStatus === 'speaking' ? 'speaking' : agentStatus === 'listening' ? 'available' : 'waiting'}
                                isMicOn={isSessionMicOn}
                                onToggleMic={toggleMic}
                            />
                        </LiveKitRoom>
                    </div>
                ) : (
                    <ConsultantVideo
                        status={consultantStatus}
                        onToggleMic={toggleMic}
                        isMicOn={isSessionMicOn}
                        isSessionActive={false}
                        title="Consultor Gestão"
                    />
                )}

                {/* Controls */}
                <SessionControls
                    phase={phase}
                    queuePosition={queueStatus?.position || 0}
                    totalInQueue={5}
                    timeRemainingSeconds={timeRemaining}
                    totalTimeSeconds={TOTAL_SESSION_TIME}
                    joinCountdown={joinCountdown}
                    joinTotalSeconds={JOIN_TIMEOUT}
                    cooldownRemaining={cooldownRemaining}
                    cooldownTotal={COOLDOWN_TIME}
                    onJoin={handleJoin}
                    onEnd={handleEnd}
                />
            </main>

            {/* Footer */}
            <footer className="shrink-0 py-2 border-t border-gray-800">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">
                        DamaFace Consultoria Virtual
                    </span>
                    <span className="text-[11px] text-gray-500">
                        Atendimento seguro e profissional
                    </span>
                </div>
            </footer>
        </div>
    )
}
