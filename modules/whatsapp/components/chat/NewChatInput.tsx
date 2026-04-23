'use client';

import React, { useState } from 'react';
import { Phone, Send, Loader2, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useMessagesStore } from '../../store/useMessagesStore';

function formatPhoneInput(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  // Format as +55 (DD) 9XXXX-XXXX or similar
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `+${digits.slice(0, 2)} ${digits.slice(2)}`;
  if (digits.length <= 9) return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4)}`;
  return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 9)}-${digits.slice(9, 13)}`;
}

function validateBrazilianPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  // Brazilian number: 55 + DD (2) + 9 digit number (9) = 13 digits
  return digits.length >= 10 && digits.length <= 13;
}

interface NewChatInputProps {
  onClose?: () => void;
}

export function NewChatInput({ onClose }: NewChatInputProps) {
  const { sending, error, sendMessage, clearError } = useMessagesStore();
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const phoneValid = validateBrazilianPhone(phone);
  const canSend = phoneValid && message.trim().length > 0 && !sending;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 13);
    setPhone(raw);
    setSent(false);
    clearError();
  };

  const handleSend = async () => {
    if (!canSend) return;
    setSent(false);
    await sendMessage(phone, message.trim());
    setSent(true);
    setMessage('');
    setTimeout(() => setSent(false), 3000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#25D366]/15 flex items-center justify-center">
            <Phone className="w-4 h-4 text-[#25D366]" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Nova Mensagem</p>
            <p className="text-[11px] text-gray-400">Enviar para qualquer número</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Phone input */}
      <div className="space-y-1.5">
        <label htmlFor="wa-new-chat-phone" className="text-xs font-bold text-gray-600 uppercase tracking-wide">
          Número do WhatsApp
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="text-sm">🇧🇷</span>
            <span className="text-gray-300 text-sm">|</span>
          </div>
          <input
            id="wa-new-chat-phone"
            type="tel"
            value={formatPhoneInput(phone)}
            onChange={handlePhoneChange}
            placeholder="+55 11 99999-9999"
            className={`
              w-full pl-12 pr-10 py-2.5 text-sm rounded-xl border transition-all outline-none
              ${phoneValid
                ? 'border-[#25D366]/50 bg-[#25D366]/5 focus:ring-2 focus:ring-[#25D366]/30'
                : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-gray-300/50'}
            `}
          />
          {phone.length > 0 && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {phoneValid
                ? <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                : <AlertCircle className="w-4 h-4 text-gray-300" />}
            </div>
          )}
        </div>
        {!phoneValid && phone.length > 4 && (
          <p className="text-[10px] text-amber-600 font-medium">
            Inclua o DDI (55) + DDD + número (ex: 5511999999999)
          </p>
        )}
      </div>

      {/* Message input */}
      <div className="space-y-1.5">
        <label htmlFor="wa-new-chat-message" className="text-xs font-bold text-gray-600 uppercase tracking-wide">
          Mensagem
        </label>
        <div className="relative bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#25D366]/30 transition-all">
          <textarea
            id="wa-new-chat-message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem... (Enter para enviar)"
            rows={3}
            style={{ resize: 'none' }}
            disabled={!phoneValid}
            className="w-full px-3.5 py-2.5 text-sm bg-transparent border-0 outline-none focus:ring-0 disabled:opacity-40 disabled:cursor-not-allowed"
          />
          <div className="flex items-center justify-between px-3 pb-2">
            <span className="text-[10px] text-gray-400">
              {message.length > 0 ? `${message.length} caracteres` : 'Shift+Enter para nova linha'}
            </span>
            <span className="text-[10px] font-bold text-gray-300 uppercase">Texto</span>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl animate-in slide-in-from-top-1">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <p className="text-xs text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Success feedback */}
      {sent && (
        <div className="flex items-center gap-2 p-3 bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl animate-in slide-in-from-top-1">
          <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
          <p className="text-xs text-[#128C7E] font-medium">Mensagem enviada! (processando em background)</p>
        </div>
      )}

      {/* Send button */}
      <button
        id="wa-new-chat-send-btn"
        onClick={handleSend}
        disabled={!canSend}
        className={`
          w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all
          ${canSend
            ? 'bg-[#25D366] text-white shadow-lg shadow-green-100 hover:bg-[#128C7E] active:scale-[0.98]'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
        `}
      >
        {sending
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : <Send className="w-4 h-4" />}
        {sending ? 'Enviando...' : 'Enviar Mensagem'}
      </button>
    </div>
  );
}
