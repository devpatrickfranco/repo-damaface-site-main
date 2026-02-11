"use client"

import { Mic, MicOff, Video } from "lucide-react"
import { RefObject } from "react"

type ConsultantStatus = "available" | "waiting" | "speaking" | "disconnected"

interface ConsultantVideoProps {
    status: ConsultantStatus
    onToggleMic: () => void
    isMicOn: boolean
    isSessionActive: boolean
    iframeUrl?: string
    videoRef?: RefObject<HTMLVideoElement | null>
    title?: string
}

const statusConfig: Record<
    ConsultantStatus,
    { label: string; dotColor: string; bgGlow: string }
> = {
    available: {
        label: "Disponivel",
        dotColor: "bg-emerald-400",
        bgGlow: "shadow-emerald-500/20",
    },
    waiting: {
        label: "Aguardando",
        dotColor: "bg-amber-400",
        bgGlow: "shadow-amber-500/20",
    },
    speaking: {
        label: "Em atendimento",
        dotColor: "bg-brand-pink",
        bgGlow: "shadow-brand-pink/20",
    },
    disconnected: {
        label: "Desconectado",
        dotColor: "bg-neutral-500",
        bgGlow: "",
    },
}

export function ConsultantVideo({
    status,
    onToggleMic,
    isMicOn,
    isSessionActive,
    iframeUrl,
    videoRef,
    title = "Consultor Virtual",
}: ConsultantVideoProps) {
    const config = statusConfig[status]

    return (
        <div className="relative flex-1 rounded-2xl overflow-hidden border border-gray-700/50 bg-gray-800/50 min-h-[360px] lg:min-h-[480px]">
            {/* Main content */}
            {isSessionActive && iframeUrl ? (
                <iframe
                    src={iframeUrl}
                    title="Consultor virtual DamaFace"
                    className="w-full h-full border-0 absolute inset-0"
                    allow="microphone; camera; autoplay; encrypted-media"
                    allowFullScreen
                />
            ) : isSessionActive && videoRef ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full border-0 absolute inset-0 object-cover"
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
                    {/* Decorative rings */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-48 h-48 rounded-full border border-gray-700/40 animate-pulse-ring" />
                        <div className="absolute w-64 h-64 rounded-full border border-gray-700/20 animate-pulse-ring [animation-delay:0.5s]" />
                        <div className="absolute w-80 h-80 rounded-full border border-gray-700/10 animate-pulse-ring [animation-delay:1s]" />
                    </div>

                    {/* Center avatar */}
                    <div className="relative z-10 flex flex-col items-center gap-5">
                        <div
                            className={`w-24 h-24 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center shadow-2xl ${config.bgGlow}`}
                        >
                            <Video className="w-10 h-10 text-gray-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-neutral-300">
                                {title}
                            </p>
                            <p className="text-xs text-neutral-600 mt-1">
                                {status === "waiting"
                                    ? "Aguarde sua vez na fila"
                                    : status === "available"
                                        ? "Pronto para atender"
                                        : "Ate a proxima sessao"}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Status badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md px-3 py-2 rounded-full border border-neutral-700/50">
                <span
                    className={`w-2 h-2 rounded-full ${config.dotColor} ${status !== "disconnected" ? "animate-pulse" : ""
                        }`}
                />
                <span className="text-xs font-medium text-neutral-300">
                    {config.label}
                </span>
            </div>

            {/* Audio indicator when active */}
            {isSessionActive && (
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-neutral-900/90 backdrop-blur-md px-3 py-2 rounded-full border border-neutral-700/50">
                    <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="w-0.5 bg-brand-pink rounded-full animate-pulse"
                                style={{
                                    height: `${8 + Math.random() * 8}px`,
                                    animationDelay: `${i * 0.15}s`,
                                    animationDuration: "0.8s",
                                }}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-neutral-400 ml-1">AO VIVO</span>
                </div>
            )}

            {/* Mic control */}
            {isSessionActive && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                    <button
                        type="button"
                        onClick={onToggleMic}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${isMicOn
                            ? "bg-neutral-800/90 backdrop-blur-md text-white hover:bg-neutral-700 border border-neutral-600/50"
                            : "bg-red-500 text-white hover:bg-red-600 border border-red-400/50"
                            }`}
                        aria-label={isMicOn ? "Desativar microfone" : "Ativar microfone"}
                    >
                        {isMicOn ? (
                            <Mic className="w-5 h-5" />
                        ) : (
                            <MicOff className="w-5 h-5" />
                        )}
                    </button>
                </div>
            )}
        </div>
    )
}
