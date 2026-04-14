'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

interface ModalProps {
  title: string;
  content: string;
  anchor?: string; // e.g. "privacypolicy" → URL becomes #privacypolicy
}

export default function Modal({ title, content, anchor }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Open modal if the URL hash matches on mount
  useEffect(() => {
    if (anchor && window.location.hash === `#${anchor}`) {
      setIsOpen(true);
    }
  }, [anchor]);

  const open = () => {
    if (anchor) {
      window.history.pushState(null, '', `#${anchor}`);
    }
    setIsOpen(true);
  };

  const close = () => {
    if (anchor && window.location.hash === `#${anchor}`) {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={open}
        className="inline-flex items-center space-x-2 text-pink-500 hover:text-pink-300 font-medium"
      >
        <Sparkles className="w-4 h-4" />
        <span className="hover:underline">{title}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative bg-gray-900/95 border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            
            {/* Header - altura fixa */}
            <div className="relative bg-gradient-to-r from-pink-500/20 to-purple-500/20 p-6 border-b border-gray-700/50 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-pink-500" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    {title}
                  </h2>
                </div>
                <button
                  onClick={close}
                  className="w-10 h-10 bg-gray-800/50 hover:bg-red-500/20 rounded-full flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content - área flexível com scroll */}
            <div className="flex-1 p-6 overflow-y-auto min-h-0">
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-gray-200 leading-relaxed"
                  style={{ 
                    color: '#FFF',
                    lineHeight: '1.7'
                  }}
                >
                  {content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-white">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer - altura fixa, sempre visível */}
            <div className="p-6 bg-gray-800/30 border-t border-gray-700/50 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  DamaFace - Harmonização Facial e Coporal
                </div>
                <button
                  onClick={close}
                  className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold px-6 py-2 rounded-full text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}