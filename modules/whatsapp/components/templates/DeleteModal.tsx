'use client';

import { useState } from 'react';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  templateName: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({ isOpen, templateName, isLoading, onConfirm, onCancel }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-red-600 to-rose-500" />

        <div className="p-6 space-y-5">
          {/* Icon + title */}
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/20 flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Deletar Template</h3>
              <p className="text-sm text-gray-400 mt-1">
                Tem certeza que deseja deletar o template{' '}
                <span className="text-white font-semibold font-mono">"{templateName}"</span>?
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <p className="text-xs text-red-300 leading-relaxed">
              ⚠️ Esta ação é <strong>irreversível</strong>. O template também será removido da Meta
              (WhatsApp Business). Campanhas que dependem deste template podem ser afetadas.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              {isLoading ? 'Deletando...' : 'Sim, deletar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
