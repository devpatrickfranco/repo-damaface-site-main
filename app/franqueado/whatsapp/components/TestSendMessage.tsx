'use client';

import React, { useState } from 'react';
import { Send, Loader2, AlertCircle, CheckCircle2, FlaskConical } from 'lucide-react';
import { apiBackend } from '@/lib/api-backend';

export function TestSendMessage() {
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [to, setTo] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ status: 'success' | 'error'; message: string } | null>(null);

  const canSend = phoneNumberId.trim().length > 0 && to.trim().length > 0 && !sending;

  const handleSend = async () => {
    if (!canSend) return;
    setSending(true);
    setResult(null);

    try {
      const response = await apiBackend.post('/whatsapp/test-send-template/', {
        phone_number_id: phoneNumberId.trim(),
        to: to.trim(),
      });
      setResult({
        status: 'success',
        message: `Status: ${response.status_code} — ${JSON.stringify(response.response)}`,
      });
    } catch (err: any) {
      setResult({
        status: 'error',
        message: err.message || 'Erro ao enviar mensagem de teste',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-5 bg-gray-900 border border-gray-700 rounded-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
          <FlaskConical className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-200">Teste de Envio (Meta)</p>
          <p className="text-[11px] text-gray-400">
            Envia o template <code className="text-amber-400">hello_world</code> para aprovação da Meta
          </p>
        </div>
      </div>

      {/* phone_number_id input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
          Phone Number ID
        </label>
        <input
          type="text"
          value={phoneNumberId}
          onChange={e => { setPhoneNumberId(e.target.value); setResult(null); }}
          placeholder="123456789012345"
          className="w-full px-3.5 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 outline-none focus:ring-1 focus:ring-amber-500/50 transition-all"
        />
      </div>

      {/* Destination input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
          Destino (telefone)
        </label>
        <input
          type="tel"
          value={to}
          onChange={e => { setTo(e.target.value.replace(/\D/g, '').slice(0, 13)); setResult(null); }}
          placeholder="5511999999999"
          className="w-full px-3.5 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 outline-none focus:ring-1 focus:ring-amber-500/50 transition-all"
        />
      </div>

      {/* Result feedback */}
      {result && (
        <div
          className={`flex items-start gap-2 p-3 rounded-xl text-xs ${
            result.status === 'success'
              ? 'bg-green-900/20 border border-green-800/30 text-green-400'
              : 'bg-red-900/20 border border-red-800/30 text-red-400'
          }`}
        >
          {result.status === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <div className="font-mono whitespace-pre-wrap break-all">{result.message}</div>
        </div>
      )}

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={!canSend}
        className={`
          w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all
          ${canSend
            ? 'bg-amber-600 text-white shadow hover:bg-amber-500 active:scale-[0.98]'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
        `}
      >
        {sending
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : <Send className="w-4 h-4" />}
        {sending ? 'Enviando...' : 'Enviar Teste'}
      </button>
    </div>
  );
}
