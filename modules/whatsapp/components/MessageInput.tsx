import React, { useState } from 'react';
import { Send, Layout, Loader2, AlertCircle } from 'lucide-react';
import { useWhatsAppStore } from '../store/useWhatsAppStore';

export function MessageInput() {
  const { status, loading, sendMessage, isOperationPending, setOperationPending } = useWhatsAppStore();
  const [text, setText] = useState('');
  
  // Mock window check - in a real scenario, this would come from the connection state or a separate API check
  const isWindowOpen = true; 

  const handleSend = async () => {
    if (!text.trim() || isOperationPending) return;

    try {
      await sendMessage({
        to: 'selected_contact_id', // This would come from another store/context
        type: 'text',
        content: text
      });
      setText('');
    } catch (err) {
      // Error is handled by the store
    }
  };

  const isDisabled = status !== 'active' || loading || isOperationPending;

  return (
    <div className="space-y-3">
      {!isWindowOpen && (
        <div className="flex items-center space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <p className="text-xs font-medium text-amber-800">
            Janela de 24h fechada. Você precisa enviar um <strong>Template</strong> para reativar.
          </p>
        </div>
      )}

      <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-pink-500/20 transition-all p-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isDisabled ? "Conexão inativa..." : "Digite sua mensagem..."}
          disabled={isDisabled || !isWindowOpen}
          rows={3}
          className="w-full bg-transparent border-none focus:ring-0 resize-none text-sm px-3 py-2 disabled:opacity-50"
        />
        
        <div className="flex items-center justify-between border-t border-gray-100 pt-2 px-1">
          <div className="flex items-center space-x-1">
            <button 
              className="p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all flex items-center space-x-2"
              title="Templates"
            >
              <Layout className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase">Templates</span>
            </button>
          </div>

          <button
            onClick={handleSend}
            disabled={isDisabled || (!text.trim() && isWindowOpen)}
            className={`
              flex items-center space-x-2 px-5 py-2 rounded-xl font-bold text-sm transition-all
              ${isDisabled || !text.trim() 
                ? 'bg-gray-100 text-gray-400' 
                : 'bg-green-500 text-white shadow-lg shadow-green-100 hover:bg-green-600 active:scale-95'}
            `}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Enviar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
