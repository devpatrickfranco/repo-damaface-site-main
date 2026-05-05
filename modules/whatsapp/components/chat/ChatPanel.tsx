'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  MessageSquarePlus,
  RefreshCw,
  Wifi,
  WifiOff,
  ChevronLeft,
  FlaskConical,
} from 'lucide-react';
import { useMessagesStore } from '../../store/useMessagesStore';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { NewChatInput } from './NewChatInput';
import { TestSendMessage } from '../../../app/franqueado/whatsapp/components/TestSendMessage';

/**
 * Main Chat Panel — combines all chat sub-components
 * Layout:
 *   [ConversationList | ChatWindow]  + slide-over panel for New Chat
 */
export function ChatPanel() {
  const {
    fetchMessages,
    startPolling,
    stopPolling,
    loading,
    activeContact,
    clearActiveContact,
  } = useMessagesStore();

  const [showNewChat, setShowNewChat] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const hasFetched = useRef(false);

  // Initial load + start polling
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchMessages();
    }
    startPolling();
    setIsPolling(true);

    return () => {
      stopPolling();
      setIsPolling(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close new chat panel when clicking outside on mobile
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowNewChat(false);
      }
    }
    if (showNewChat) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNewChat]);

  return (
    <div className="relative flex flex-col h-full rounded-2xl overflow-hidden border border-gray-700 shadow-xl bg-gray-900">
      {/* ─── Top bar ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 text-gray-200 shrink-0 border-b border-gray-700">
        <div className="flex items-center gap-3">
          {/* Mobile back button */}
          {activeContact && (
            <button
              onClick={clearActiveContact}
              className="sm:hidden p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="text-sm font-black tracking-tight">WhatsApp Atendimento</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isPolling ? (
                <>
                  <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse" />
                  <span className="text-[10px] font-semibold text-green-300 uppercase">Polling ativo — atualizações a cada 5s</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-red-300" />
                  <span className="text-[10px] font-semibold text-red-300 uppercase">Offline</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh */}
          <button
            onClick={() => fetchMessages()}
            disabled={loading}
            title="Recarregar todas as mensagens"
            className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* New chat */}
          <button
            id="wa-new-chat-btn"
            onClick={() => setShowNewChat(v => !v)}
            title="Nova mensagem"
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all
              ${showNewChat
                ? 'bg-gray-700 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'}
            `}
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova mensagem</span>
          </button>
        </div>
      </div>

      {/* ─── Body ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 relative">

        {/* Conversation sidebar */}
        <div
          className={`
            shrink-0 border-r border-gray-700 flex flex-col bg-gray-900 overflow-hidden transition-all duration-300
            ${activeContact ? 'hidden sm:flex sm:w-72 lg:w-80' : 'flex w-full sm:w-72 lg:w-80'}
          `}
        >
          <ConversationList />

          {/* Dev tool: test send message */}
          <details className="shrink-0 border-t border-gray-700 group">
            <summary className="flex items-center gap-2 px-4 py-2.5 cursor-pointer hover:bg-gray-800/50 transition-colors text-xs font-semibold text-gray-400 hover:text-gray-300 select-none">
              <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
              <span>Teste de Envio (Meta)</span>
              <span className="ml-auto text-[10px] text-gray-600 group-open:rotate-90 transition-transform">▶</span>
            </summary>
            <div className="px-3 pb-3">
              <TestSendMessage />
            </div>
          </details>
        </div>

        {/* Chat window */}
        <div
          className={`
            flex-1 flex flex-col min-w-0 overflow-hidden
            ${activeContact ? 'flex' : 'hidden sm:flex'}
          `}
        >
          <ChatWindow />
        </div>

        {/* New Chat slide-over panel */}
        <div
          ref={panelRef}
          className={`
            absolute top-0 right-0 bottom-0 z-30
            w-full sm:w-80 bg-gray-900 border-l border-gray-700 shadow-2xl
            transition-transform duration-300 ease-in-out
            ${showNewChat ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="h-full overflow-y-auto p-5">
            <NewChatInput onClose={() => setShowNewChat(false)} />
          </div>
        </div>

        {/* Overlay (mobile) */}
        {showNewChat && (
          <div
            className="absolute inset-0 z-20 bg-black/20 sm:hidden"
            onClick={() => setShowNewChat(false)}
          />
        )}
      </div>

      {/* ─── Status bar ───────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-between px-4 py-1.5 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
          <Wifi className="w-3 h-3 text-[#25D366]" />
          <span>Conectado via WhatsApp Business API</span>
        </div>
        <span className="text-[10px] text-gray-400 font-mono">
          {loading ? 'Atualizando...' : 'Online'}
        </span>
      </div>
    </div>
  );
}
