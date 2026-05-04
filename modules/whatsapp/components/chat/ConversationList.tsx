'use client';

import React, { useState } from 'react';
import { Search, MessageCircle, Clock, Archive } from 'lucide-react';
import { useMessagesStore } from '../../store/useMessagesStore';
import { Conversation } from '../../types';

function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Agora';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function ConversationItem({
  conv,
  isActive,
  onClick,
}: {
  conv: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  const preview = conv.lastMessage?.content ?? '(sem mensagem)';
  const isInbound = conv.lastMessage?.direction === 'IN';

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-150 group border-b border-gray-700/60
        ${isActive
          ? 'bg-gray-800 border-l-4 border-l-[#25D366]'
          : 'hover:bg-gray-800/50 border-l-4 border-l-transparent'}
      `}
    >
      {/* Avatar */}
      <div className={`
        relative shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold
        ${isActive ? 'bg-[#25D366] text-white' : 'bg-gray-700 text-gray-300 group-hover:bg-gray-600'}
        transition-colors
      `}>
        {conv.displayName.replace(/[^0-9]/g, '').slice(-2) || '??'}
        {/* Online indicator */}
        {isActive && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] rounded-full border-2 border-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-sm font-semibold truncate ${isActive ? 'text-[#128C7E]' : 'text-gray-200'}`}>
            {conv.displayName}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] text-gray-400 font-medium">
              {formatRelativeTime(conv.updatedAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-xs text-gray-500 truncate">
            {!isInbound && <span className="text-[#25D366] font-medium">Você: </span>}
            {preview}
          </p>
          {conv.unreadCount > 0 && (
            <span className="shrink-0 min-w-[18px] h-[18px] rounded-full bg-[#25D366] text-white text-[10px] font-bold flex items-center justify-center px-1">
              {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export function ConversationList() {
  const { conversations, activeContact, setActiveContact, loading } = useMessagesStore();
  const [search, setSearch] = useState('');

  const sorted = Object.values(conversations).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const filtered = search.trim()
    ? sorted.filter(c =>
        c.contact.includes(search.replace(/\D/g, '')) ||
        c.displayName.toLowerCase().includes(search.toLowerCase())
      )
    : sorted;

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-gray-700 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="wa-conversation-search"
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Pesquisar ou começar uma nova conversa"
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-800 text-gray-200 placeholder-gray-500 rounded-xl border-0 focus:ring-2 focus:ring-[#25D366]/30 focus:bg-gray-900 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-2 px-1">
          <button className="px-3 py-1 rounded-full bg-[#128C7E]/20 text-[#25D366] text-xs font-semibold">Tudo</button>
          <button className="px-3 py-1 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 text-xs font-medium transition-colors">Não lidas 118</button>
          <button className="px-3 py-1 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 text-xs font-medium transition-colors">Favoritas</button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors border-b border-gray-700/60">
          <div className="flex items-center gap-5">
            <Archive className="w-5 h-5 text-gray-400" />
            <span className="text-[15px] font-medium text-gray-200">Arquivadas</span>
          </div>
          <span className="text-xs text-[#25D366] font-medium">1</span>
        </button>
        {loading && filtered.length === 0 ? (
          <div className="space-y-1 p-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                <div className="w-11 h-11 rounded-full bg-gray-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-800 rounded w-2/3" />
                  <div className="h-2 bg-gray-700 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center px-6">
            <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center mb-3">
              <MessageCircle className="w-7 h-7 text-gray-500" />
            </div>
            <p className="text-sm font-semibold text-gray-400">Sem conversas</p>
            <p className="text-xs text-gray-500 mt-1">
              {search ? 'Nenhum resultado para sua busca.' : 'Envie a primeira mensagem para começar.'}
            </p>
          </div>
        ) : (
          filtered.map(conv => (
            <ConversationItem
              key={conv.contact}
              conv={conv}
              isActive={activeContact === conv.contact}
              onClick={() => setActiveContact(conv.contact)}
            />
          ))
        )}
      </div>
    </div>
  );
}
