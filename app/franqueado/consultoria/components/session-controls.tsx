"use client"

import React from "react"
import { useState, useEffect } from "react"
import {
    Clock,
    Users,
    LogIn,
    PhoneOff,
    AlertTriangle,
    CheckCircle2,
    Timer,
    RotateCcw,
    Lock,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

export type SessionPhase =
    | "queue"
    | "called"
    | "active"
    | "ending"
    | "ended"
    | "cooldown"

interface SessionControlsProps {
    phase: SessionPhase
    queuePosition?: number
    totalInQueue?: number
    timeRemainingSeconds?: number
    totalTimeSeconds?: number
    joinCountdown?: number
    joinTotalSeconds?: number
    cooldownRemaining?: number
    cooldownTotal?: number
    onJoin: () => void
    onEnd: () => void
}

const phaseConfig: Record<
    SessionPhase,
    { title: string; description: string; icon: React.ReactNode; accent: string }
> = {
    queue: {
        title: "Aguardando na fila",
        description: "Voce sera notificado quando for sua vez.",
        icon: <Users className="w-5 h-5" />,
        accent: "text-amber-400",
    },
    called: {
        title: "E a sua vez!",
        description: "Entre na sala antes que o tempo expire.",
        icon: <CheckCircle2 className="w-5 h-5" />,
        accent: "text-brand-pink",
    },
    active: {
        title: "Sessao em andamento",
        description: "Voce esta em atendimento com o consultor.",
        icon: <Clock className="w-5 h-5" />,
        accent: "text-emerald-400",
    },
    ending: {
        title: "Sessao quase terminando",
        description: "Restam menos de 2 minutos para o fim.",
        icon: <AlertTriangle className="w-5 h-5" />,
        accent: "text-amber-400",
    },
    ended: {
        title: "Sessao encerrada",
        description: "Obrigado por utilizar nosso atendimento.",
        icon: <CheckCircle2 className="w-5 h-5" />,
        accent: "text-neutral-400",
    },
    cooldown: {
        title: "Aguarde para nova sessao",
        description: "Voce podera iniciar um novo atendimento em breve.",
        icon: <Timer className="w-5 h-5" />,
        accent: "text-brand-pink",
    },
}

export function SessionControls({
    phase,
    queuePosition = 0,
    totalInQueue = 0,
    timeRemainingSeconds = 0,
    totalTimeSeconds = 900,
    joinCountdown = 0,
    joinTotalSeconds = 120,
    cooldownRemaining = 0,
    cooldownTotal = 7200,
    onJoin,
    onEnd,
}: SessionControlsProps) {
    const config = phaseConfig[phase]
    const [dots, setDots] = useState("")

    useEffect(() => {
        if (phase !== "queue") return
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
        }, 600)
        return () => clearInterval(interval)
    }, [phase])

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    }

    const progressPercent =
        totalTimeSeconds > 0
            ? ((totalTimeSeconds - timeRemainingSeconds) / totalTimeSeconds) * 100
            : 0

    const joinProgressPercent =
        joinTotalSeconds > 0 ? (joinCountdown / joinTotalSeconds) * 100 : 0

    const cooldownProgressPercent =
        cooldownTotal > 0
            ? ((cooldownTotal - cooldownRemaining) / cooldownTotal) * 100
            : 0

    const formatTimeLong = (seconds: number) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        if (h > 0) {
            return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
        }
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    }

    return (
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden shrink-0">
            {/* Phase indicator bar */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                    <div className={`${config.accent}`}>{config.icon}</div>
                    <div>
                        <h3 className={`text-sm font-semibold ${config.accent}`}>
                            {config.title}
                            {phase === "queue" && dots}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {config.description}
                        </p>
                    </div>
                </div>

                {/* Timer display for active/ending */}
                {(phase === "active" || phase === "ending") && (
                    <div className="flex items-center gap-2">
                        <Clock
                            className={`w-4 h-4 ${phase === "ending" ? "text-amber-400" : "text-gray-400"}`}
                        />
                        <span
                            className={`text-lg font-mono font-bold tabular-nums ${phase === "ending" ? "text-amber-400" : "text-white"
                                }`}
                        >
                            {formatTime(timeRemainingSeconds)}
                        </span>
                    </div>
                )}
            </div>

            {/* Content area */}
            <div className="px-5 py-4">
                {/* Queue */}
                {phase === "queue" && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-1.5">
                                {Array.from({ length: Math.min(totalInQueue, 4) }).map(
                                    (_, i) => (
                                        <div
                                            key={i}
                                            className={`w-6 h-6 rounded-full border-2 border-neutral-950 flex items-center justify-center text-[9px] font-bold ${i === 0
                                                ? "bg-brand-pink text-white z-10"
                                                : "bg-neutral-800 text-neutral-500"
                                                }`}
                                        >
                                            {i + 1}
                                        </div>
                                    ),
                                )}
                            </div>
                            <span className="text-sm text-neutral-400 ml-2">
                                Sua posicao
                            </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-white tabular-nums">
                                {queuePosition}
                            </span>
                            <span className="text-sm text-neutral-600">
                                {"de "}
                                {totalInQueue}
                            </span>
                        </div>
                    </div>
                )}

                {/* Called - 2 min to enter */}
                {phase === "called" && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <LogIn className="w-5 h-5 text-brand-pink" />
                                </div>
                                <span className="text-sm text-neutral-300">
                                    Clique em{" "}
                                    <strong className="text-brand-pink">Entrar</strong> para
                                    iniciar
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Timer
                                    className={`w-4 h-4 ${joinCountdown <= 30 ? "text-red-400" : "text-brand-pink"}`}
                                />
                                <span
                                    className={`text-sm font-mono font-bold tabular-nums ${joinCountdown <= 30 ? "text-red-400" : "text-brand-pink"
                                        }`}
                                >
                                    {formatTime(joinCountdown)}
                                </span>
                            </div>
                        </div>
                        <Progress
                            value={100 - joinProgressPercent}
                            className="h-1.5 bg-neutral-800 [&>div]:bg-brand-pink"
                        />
                        {joinCountdown <= 30 && (
                            <p className="text-xs text-red-400/80 text-center">
                                Tempo quase esgotado! Entre agora ou perca sua vez.
                            </p>
                        )}
                    </div>
                )}

                {/* Active / Ending - progress */}
                {(phase === "active" || phase === "ending") && (
                    <div className="flex flex-col gap-2">
                        <Progress
                            value={progressPercent}
                            className={`h-1.5 bg-neutral-800 ${phase === "ending"
                                ? "[&>div]:bg-amber-400"
                                : "[&>div]:bg-brand-pink"
                                }`}
                        />
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-neutral-600">Inicio</span>
                            <span className="text-xs text-neutral-600">
                                {formatTime(totalTimeSeconds)}
                            </span>
                        </div>
                    </div>
                )}

                {/* Ended */}
                {phase === "ended" && (
                    <div className="text-center py-1">
                        <p className="text-sm text-neutral-500">
                            Voce pode fechar esta pagina ou iniciar um novo atendimento.
                        </p>
                    </div>
                )}

                {/* Cooldown */}
                {phase === "cooldown" && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-400">
                                Proximo atendimento disponivel em
                            </span>
                            <span className="text-lg font-mono font-bold tabular-nums text-brand-pink">
                                {formatTimeLong(cooldownRemaining)}
                            </span>
                        </div>
                        <Progress
                            value={cooldownProgressPercent}
                            className="h-1.5 bg-neutral-800 [&>div]:bg-brand-pink"
                        />
                        <p className="text-xs text-neutral-600 text-center">
                            Para garantir a qualidade do atendimento, existe um intervalo de 2
                            horas entre sessoes.
                        </p>
                    </div>
                )}
            </div>

            {/* Action buttons */}
            <div className="px-5 py-3 border-t border-gray-700/50">
                {phase === "queue" && (
                    <button
                        type="button"
                        onClick={onEnd}
                        className="w-full flex items-center justify-center gap-2 bg-gray-900 border border-gray-700 text-gray-400 text-sm font-medium py-3 rounded-xl hover:bg-gray-800 hover:text-gray-300 transition-colors"
                    >
                        Sair da fila
                    </button>
                )}

                {phase === "called" && (
                    <button
                        type="button"
                        onClick={onJoin}
                        className="w-full relative flex items-center justify-center gap-2 bg-brand-pink text-white font-semibold text-sm py-3.5 rounded-xl hover:bg-brand-pink/90 transition-all overflow-hidden group"
                    >
                        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <LogIn className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">Entrar na conversa</span>
                    </button>
                )}

                {(phase === "active" || phase === "ending") && (
                    <button
                        type="button"
                        onClick={onEnd}
                        className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium py-3 rounded-xl hover:bg-red-500/20 transition-colors"
                    >
                        <PhoneOff className="w-4 h-4" />
                        Encerrar sessao
                    </button>
                )}

                {phase === "ended" && (
                    <button
                        type="button"
                        onClick={onJoin}
                        className="w-full flex items-center justify-center gap-2 bg-brand-pink text-white font-semibold text-sm py-3 rounded-xl hover:bg-brand-pink/90 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Novo atendimento
                    </button>
                )}

                {phase === "cooldown" && (
                    <button
                        type="button"
                        disabled
                        className="w-full flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-700 text-neutral-600 text-sm font-medium py-3 rounded-xl cursor-not-allowed"
                    >
                        <Lock className="w-4 h-4" />
                        Aguarde o intervalo
                    </button>
                )}
            </div>
        </div>
    )
}
