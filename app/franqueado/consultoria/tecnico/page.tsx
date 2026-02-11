"use client"

import { useState, useEffect } from "react"
import { ConsultantVideo } from "../components/consultant-video"
import {
    SessionControls,
    type SessionPhase,
} from "../components/session-controls"
import { Headphones, Shield, Lock } from "lucide-react"

const TOTAL_SESSION_TIME = 900 // 15 minutes
const JOIN_TIMEOUT = 120 // 2 minutes to enter the room
const COOLDOWN_TIME = 7200 // 2 hours in seconds

// Replace with your actual HeyGen iframe URL
const HEYGEN_IFRAME_URL = ""

export default function ConsultantTecnicoPage() {
    const [phase, setPhase] = useState<SessionPhase>("queue")
    const [queuePosition, setQueuePosition] = useState(3)
    const [timeRemaining, setTimeRemaining] = useState(TOTAL_SESSION_TIME)
    const [joinCountdown, setJoinCountdown] = useState(JOIN_TIMEOUT)
    const [cooldownRemaining, setCooldownRemaining] = useState(0)
    const [isMicOn, setIsMicOn] = useState(true)
    const [consultantStatus, setConsultantStatus] = useState<
        "available" | "waiting" | "speaking" | "disconnected"
    >("waiting")

    // Simulate queue countdown
    useEffect(() => {
        if (phase !== "queue") return
        const interval = setInterval(() => {
            setQueuePosition((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    setPhase("called")
                    setConsultantStatus("available")
                    setJoinCountdown(JOIN_TIMEOUT)
                    return 0
                }
                return prev - 1
            })
        }, 3000)
        return () => clearInterval(interval)
    }, [phase])

    // Join countdown (2 min to enter the room)
    useEffect(() => {
        if (phase !== "called") return
        const interval = setInterval(() => {
            setJoinCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    setPhase("cooldown")
                    setConsultantStatus("disconnected")
                    setCooldownRemaining(COOLDOWN_TIME)
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
                    setPhase("cooldown")
                    setConsultantStatus("disconnected")
                    setCooldownRemaining(COOLDOWN_TIME)
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

    const handleJoin = () => {
        if (phase === "ended") {
            setPhase("queue")
            setQueuePosition(3)
            setConsultantStatus("waiting")
            setTimeRemaining(TOTAL_SESSION_TIME)
            setJoinCountdown(JOIN_TIMEOUT)
            return
        }
        setPhase("active")
        setConsultantStatus("speaking")
        setTimeRemaining(TOTAL_SESSION_TIME)
    }

    const handleEnd = () => {
        setPhase("cooldown")
        setConsultantStatus("disconnected")
        setCooldownRemaining(COOLDOWN_TIME)
    }

    const isSessionActive = phase === "active" || phase === "ending"

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
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
                                Consultoria Técnica
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
                    iframeUrl={isSessionActive ? HEYGEN_IFRAME_URL || undefined : undefined}
                    title="Consultor Técnico"
                />

                {/* Controls */}
                <SessionControls
                    phase={phase}
                    queuePosition={queuePosition}
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
