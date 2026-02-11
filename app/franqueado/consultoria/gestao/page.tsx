"use client"

import { useState, useEffect } from "react"
import { ConsultantVideo } from "../components/consultant-video"
import {
    SessionControls,
    type SessionPhase,
} from "../components/session-controls"
import { useConsultationQueue } from "../hooks/useConsultationQueue"
import { useConsultationSession } from "../hooks/useConsultationSession"
import { useWebRTC } from "../hooks/useWebRTC"
import { Headphones, Shield, Lock } from "lucide-react"

const AGENT_TYPE = "gestao"
const TOTAL_SESSION_TIME = 900 // 15 minutes
const JOIN_TIMEOUT = 120 // 2 minutes to enter the room
const COOLDOWN_TIME = 7200 // 2 hours in seconds

export default function ConsultantPage() {
    const [phase, setPhase] = useState<SessionPhase>("queue")
    const [timeRemaining, setTimeRemaining] = useState(TOTAL_SESSION_TIME)
    const [joinCountdown, setJoinCountdown] = useState(JOIN_TIMEOUT)
    const [cooldownRemaining, setCooldownRemaining] = useState(0)
    const [isMicOn, setIsMicOn] = useState(true)
    const [consultantStatus, setConsultantStatus] = useState<
        "available" | "waiting" | "speaking" | "disconnected"
    >("waiting")

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
        connectSession,
        sendIceCandidate,
        terminateSession,
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
                        setConsultantStatus("speaking")
                        setTimeRemaining(TOTAL_SESSION_TIME)
                    } else if (state === "failed" || state === "disconnected") {
                        console.error("Conexão WebRTC perdida")
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
            // 1. Inicializar sessão
            const sessionData = await initializeSession()

            // 2. Obter mídia local
            await startLocalMedia()

            // 3. Criar SDP answer se o backend enviar oferta
            if (sessionData.heygen_data.sdp) {
                const answer = await createAnswer(sessionData.heygen_data.sdp)

                // 4. Enviar SDP ao backend
                await connectSession(answer)
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
                <ConsultantVideo
                    status={consultantStatus}
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
