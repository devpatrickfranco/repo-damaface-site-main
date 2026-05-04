'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Send, Loader2, MessageSquareOff, MoreVertical, RefreshCw, FileText, UserPlus, Bot } from 'lucide-react';
import { useMessagesStore } from '../../store/useMessagesStore';
import { WhatsAppMessage } from '../../types';

function formatTime(isoDate: string) {
  return new Date(isoDate).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function MessageBubble({ msg }: { msg: WhatsAppMessage }) {
  const isOut = msg.direction === 'OUT';

  const statusIcon = () => {
    if (msg.id.startsWith('optimistic')) return '🕐';
    if (msg.status === 'read') return '✓✓';
    if (msg.status === 'delivered') return '✓✓';
    if (msg.status === 'sent') return '✓';
    if (msg.status === 'failed') return '✗';
    return '';
  };

  return (
    <div className={`flex ${isOut ? 'justify-end' : 'justify-start'} mb-1`}>
      <div
        className={`
          max-w-[75%] px-3.5 py-2 rounded-2xl shadow-sm relative
          ${isOut
            ? 'bg-[#005c4b] text-gray-100 rounded-br-sm'
            : 'bg-gray-800 text-gray-200 rounded-bl-sm border border-gray-700/50'}
        `}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {msg.content ?? <span className="italic text-gray-400">[mídia]</span>}
        </p>
        <div className={`flex items-center gap-1 mt-1 ${isOut ? 'justify-end' : 'justify-start'}`}>
          <span className="text-[10px] text-gray-400">{formatTime(msg.created_at)}</span>
          {isOut && (
            <span className={`text-[10px] ${msg.status === 'read' ? 'text-blue-400' : 'text-gray-400'}`}>
              {statusIcon()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function DateDivider({ date }: { date: string }) {
  const label = (() => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Hoje';
    if (d.toDateString() === yesterday.toDateString()) return 'Ontem';
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  })();

  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-gray-700/50" />
      <span className="text-[11px] font-semibold text-gray-400 bg-gray-800 px-3 py-0.5 rounded-full border border-gray-700">
        {label}
      </span>
      <div className="flex-1 h-px bg-gray-700/50" />
    </div>
  );
}

export function ChatWindow() {
  const { conversations, activeContact, sending, sendMessage, fetchMessages } = useMessagesStore();
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const conv = activeContact ? conversations[activeContact] : null;
  const messages = conv?.messages ?? [];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async () => {
    if (!text.trim() || !activeContact || sending) return;
    const content = text.trim();
    setText('');
    textareaRef.current?.focus();
    await sendMessage(activeContact, content);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Group messages by date for dividers
  const groupedMessages = (() => {
    const groups: { date: string; messages: WhatsAppMessage[] }[] = [];
    let currentDate = '';

    for (const msg of messages) {
      const msgDate = new Date(msg.created_at).toDateString();
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({ date: msg.created_at, messages: [msg] });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    }
    return groups;
  })();

  if (!activeContact) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#0B141A] border-l border-gray-800 gap-8">
        <div className="text-center space-y-2">
          <p className="text-2xl font-light text-gray-200">WhatsApp para Negócios</p>
          <p className="text-sm text-gray-400">Selecione uma conversa ou inicie uma nova com as ferramentas abaixo.</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => document.getElementById('wa-new-chat-btn')?.click()}
            className="flex flex-col items-center gap-3 p-6 bg-gray-800 rounded-2xl hover:bg-gray-700 transition-colors w-32 border border-gray-700"
          >
            <div className="w-12 h-12 rounded-full bg-[#128C7E]/20 text-[#25D366] flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-gray-300 text-center leading-tight">Iniciar com<br/>Template</span>
          </button>

          <button className="flex flex-col items-center gap-3 p-6 bg-gray-800 rounded-2xl hover:bg-gray-700 transition-colors w-32 border border-gray-700">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <UserPlus className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-gray-300 text-center leading-tight">Adicionar<br/>Contato</span>
          </button>

          <button className="flex flex-col items-center gap-3 p-6 bg-gray-800 rounded-2xl hover:bg-gray-700 transition-colors w-32 border border-gray-700">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-gray-300 text-center leading-tight">Perguntar à<br/>Meta AI</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center text-sm font-bold shrink-0">
          {conv?.displayName.replace(/[^0-9]/g, '').slice(-2) ?? '??'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-200 truncate">{conv?.displayName ?? activeContact}</p>
          <p className="text-xs text-gray-400">{activeContact}</p>
        </div>
        <button
          onClick={() => fetchMessages({ contact: activeContact })}
          title="Recarregar mensagens"
          className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-400"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-400">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ccircle cx='30' cy='30' r='1' fill='%23ffffff08'/%3E%3C/svg%3E")`,
          backgroundColor: '#0B141A',
        }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-800/80 flex items-center justify-center shadow">
              <MessageSquareOff className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-400 font-medium">Sem mensagens ainda</p>
            <p className="text-xs text-gray-500">Comece a conversa abaixo</p>
          </div>
        ) : (
          groupedMessages.map((group, gi) => (
            <div key={gi}>
              <DateDivider date={group.date} />
              {group.messages.map(msg => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-end gap-2 px-3 py-3 bg-gray-800 border-t border-gray-700">
        <div className="flex-1 bg-gray-900 rounded-2xl border border-gray-700 shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-[#25D366]/50 transition-all">
          <textarea
            ref={textareaRef}
            id="wa-chat-message-input"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite uma mensagem..."
            rows={1}
            style={{ resize: 'none', maxHeight: '120px', overflowY: 'auto' }}
            className="w-full px-4 py-2.5 text-sm bg-transparent border-0 outline-none focus:ring-0 text-gray-200 placeholder-gray-500"
          />
        </div>
        <button
          id="wa-chat-send-btn"
          onClick={handleSend}
          disabled={!text.trim() || sending}
          className={`
            shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all
            ${!text.trim() || sending
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-[#00a884] text-white shadow-lg hover:bg-[#008f6f] active:scale-95'}
          `}
        >
          {sending
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
