"use client"

import { useTracks, VideoTrack, AudioTrack } from "@livekit/components-react"
import { Track } from "livekit-client"
import { Mic, MicOff, Activity, ShieldCheck } from "lucide-react"

interface HeyGenAvatarProps {
    status: "available" | "waiting" | "speaking" | "disconnected"
    onToggleMic: () => void
    isMicOn: boolean
}

export function HeyGenAvatar({ status, onToggleMic, isMicOn }: HeyGenAvatarProps) {
    const tracks = useTracks([
        Track.Source.Camera,
        Track.Source.Microphone,
    ]).filter(t => t.participant.identity === 'heygen')

    const videoTrack = tracks.find(t => t.source === Track.Source.Camera)
    const audioTrack = tracks.find(t => t.source === Track.Source.Microphone)

    const isVideoTrackReference = (track: any): track is { participant: any; source: any; publication: any } => {
        return track && 'publication' in track;
    }

    // Define heygenTrack to fix the "missing 'heygenTrack' reference" issue
    const heygenTrack = videoTrack || audioTrack;

    return (
        <div className="relative flex-1 rounded-2xl overflow-hidden border border-gray-700/50 bg-gray-900/80 min-h-[400px] lg:min-h-[520px] shadow-2xl group transition-all duration-500">
            {/* Main Video & Audio Content */}
            {videoTrack && isVideoTrackReference(videoTrack) ? (
                <div className="absolute inset-0 w-full h-full">
                    <VideoTrack
                        trackRef={videoTrack}
                        className="w-full h-full object-cover scale-105"
                    />

                    {audioTrack && isVideoTrackReference(audioTrack) && <AudioTrack trackRef={audioTrack} />}

                    {/* Glassmorphism Overlay for status - Vignette effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
                </div>
            ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0b]">
                    {/* Pulsing Loading UI */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-brand-pink/20 blur-3xl rounded-full scale-150 animate-pulse" />
                        <div className="relative flex flex-col items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-gray-900 border border-brand-pink/30 flex items-center justify-center shadow-2xl relative overflow-hidden">
                                <Activity className="w-10 h-10 text-brand-pink animate-pulse" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-brand-pink/10 to-transparent" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-sm font-bold text-gray-200 tracking-wider">ESTABELECENDO CONEXÃO</p>
                                <p className="text-[11px] text-gray-500 font-medium">O avatar estará pronto em instantes...</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Status Badges */}
            <div className="absolute top-6 left-6 z-20 flex flex-col gap-3">
                <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-2xl px-4 py-2.5 rounded-2xl border border-white/10 shadow-2xl transition-all hover:bg-black/60 group/badge">
                    <div className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-pink opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-pink"></span>
                    </div>
                    <span className="text-[11px] font-black text-white tracking-[0.2em] uppercase">IA AO VIVO</span>
                </div>

                {heygenTrack && (
                    <div className="flex items-center gap-2 bg-emerald-500/10 backdrop-blur-xl px-3.5 py-1.5 rounded-xl border border-emerald-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                        <span className="text-[10px] font-bold text-emerald-400/90 uppercase tracking-wider">Streaming Estável</span>
                    </div>
                )}
            </div>

            {/* Audio/Video Quality Indicator */}
            <div className="absolute top-6 right-6 z-20">
                <div className="flex items-center gap-3 bg-black/40 backdrop-blur-2xl px-4 py-2.5 rounded-2xl border border-white/10 shadow-2xl">
                    <div className="flex items-end gap-1 h-3.5">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="w-1 bg-brand-pink rounded-full transition-all duration-300"
                                style={{
                                    height: videoTrack ? `${40 + Math.random() * 60}%` : '20%',
                                    opacity: 0.6 + (i * 0.1),
                                    animation: videoTrack ? `audioBars 0.8s ease-in-out infinite alternate ${i * 0.1}s` : 'none'
                                }}
                            />
                        ))}
                    </div>
                    <div className="h-4 w-[1px] bg-white/10 mx-1" />
                    <span className="text-[10px] font-black text-white/80 tracking-widest leading-none">4K HDR</span>
                </div>
            </div>

            {/* Mic Controls - Premium Floating Button */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
                <button
                    onClick={onToggleMic}
                    className={`
                        group/btn relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 transform active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.5)]
                        ${isMicOn
                            ? "bg-white/5 backdrop-blur-3xl border border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                            : "bg-red-500 border border-red-400 text-white hover:bg-red-600 shadow-red-500/30"}
                    `}
                >
                    <div className={`absolute inset-0 rounded-full transition-all duration-500 ${isMicOn ? "bg-gradient-to-tr from-white/5 to-transparent" : "bg-gradient-to-tr from-black/20 to-transparent"}`} />

                    {isMicOn ? (
                        <Mic className="w-7 h-7 relative z-10 transition-transform group-hover/btn:scale-110" />
                    ) : (
                        <MicOff className="w-7 h-7 relative z-10 transition-transform group-hover/btn:scale-110" />
                    )}

                    {/* Ring animation for active mic */}
                    {isMicOn && (
                        <div className="absolute -inset-2 rounded-full border border-white/5 animate-[pulse_3s_infinite]" />
                    )}
                </button>

                <p className={`text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${isMicOn ? "text-white/40" : "text-red-400"}`}>
                    {isMicOn ? "Microfone Ativo" : "Microfone Mutado"}
                </p>
            </div>

            {/* Bottom Info Bar */}
            <div className="absolute bottom-6 inset-x-8 flex items-center justify-between pointer-events-none opacity-60">
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
                    <ShieldCheck className="w-3.5 h-3.5 text-white/40" />
                    <span className="text-[9px] text-white/40 font-black tracking-[0.2em] uppercase">Conexão Segura E2EE</span>
                </div>

                <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
                    <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-pink/40" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes audioBars {
                    0% { height: 30%; }
                    100% { height: 100%; }
                }
            `}</style>
        </div>
    )
}
