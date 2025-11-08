'use client';

import { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

export default function DamaAiPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detecta mudanças no estado de fullscreen (quando o usuário pressiona ESC, por exemplo)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        // Entra em fullscreen
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        // Sai do fullscreen
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Erro ao alternar fullscreen:', error);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col bg-black ${isFullscreen ? 'h-screen' : 'h-[calc(100vh-4rem)]'}`}
    >
      {/* Header do Chat com botão de Fullscreen */}
      <div className="bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h1 className="text-white font-semibold text-lg">Dama.ai Chat</h1>
          <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
            Online
          </span>
        </div>
        
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-all duration-200 group"
          aria-label={isFullscreen ? 'Sair do fullscreen' : 'Entrar em fullscreen'}
          title={isFullscreen ? 'Sair do fullscreen (ESC)' : 'Tela cheia'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          ) : (
            <Maximize2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>

      {/* Iframe do Chatwoot */}
      <div className="flex-1 relative overflow-hidden">
        <iframe
          src="https://chat.damaface.com.br/app/"
          title="Dama.ai Chat"
          className="w-full h-full border-none"
          allow="microphone; camera; clipboard-write; fullscreen"
        />
      </div>
    </div>
  );
}