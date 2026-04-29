'use client';

import { MousePointerClick, Image, FileText, Video } from 'lucide-react';
import clsx from 'clsx';
import type { TemplateComponent } from '../../types/templates';

interface TemplatePreviewProps {
  components: TemplateComponent[];
  className?: string;
}

function renderVariable(text: string, vars?: Record<string, string>): string {
  return text.replace(/\{\{(\d+)\}\}/g, (_, n) =>
    vars?.[n] ?? `[var ${n}]`
  );
}

export function TemplatePreview({ components, className }: TemplatePreviewProps) {
  if (!components.length) {
    return (
      <div className={clsx('flex items-center justify-center h-full text-gray-600 text-sm', className)}>
        Adicione componentes para ver o preview
      </div>
    );
  }

  const header = components.find(c => c.type === 'HEADER');
  const body = components.find(c => c.type === 'BODY');
  const footer = components.find(c => c.type === 'FOOTER');
  const buttons = components.find(c => c.type === 'BUTTONS');

  return (
    <div className={clsx('space-y-1', className)}>
      {/* Phone frame */}
      <div className="relative max-w-[280px] mx-auto">
        {/* WhatsApp bubble */}
        <div className="bg-[#1f2937] rounded-2xl rounded-tl-sm shadow-xl overflow-hidden">
          {/* Header */}
          {header && (
            <div className="border-b border-white/5">
              {header.format === 'IMAGE' ? (
                <div className="h-32 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <Image className="w-8 h-8 text-gray-600" />
                  <span className="text-xs text-gray-500 ml-2">Imagem</span>
                </div>
              ) : header.format === 'VIDEO' ? (
                <div className="h-32 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <Video className="w-8 h-8 text-gray-600" />
                  <span className="text-xs text-gray-500 ml-2">Vídeo</span>
                </div>
              ) : header.format === 'DOCUMENT' ? (
                <div className="h-20 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center gap-2">
                  <FileText className="w-6 h-6 text-gray-500" />
                  <span className="text-xs text-gray-500">Documento</span>
                </div>
              ) : header.text ? (
                <div className="px-4 pt-3 pb-2">
                  <p className="text-sm font-bold text-white leading-snug">
                    {renderVariable(header.text)}
                  </p>
                </div>
              ) : null}
            </div>
          )}

          {/* Body */}
          {body && (
            <div className="px-4 py-3">
              <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                {body.text
                  ? body.text.replace(/\{\{(\d+)\}\}/g, (_, n) => (
                      `[var ${n}]`
                    ))
                  : <span className="text-gray-600 italic">Corpo da mensagem...</span>}
              </p>
            </div>
          )}

          {/* Footer */}
          {footer && footer.text && (
            <div className="px-4 pb-3">
              <p className="text-xs text-gray-500">{footer.text}</p>
            </div>
          )}

          {/* Timestamp */}
          <div className="flex justify-end px-3 pb-2">
            <span className="text-[10px] text-gray-600">14:32 ✓✓</span>
          </div>
        </div>

        {/* Buttons */}
        {buttons && buttons.buttons && buttons.buttons.length > 0 && (
          <div className="mt-1.5 space-y-1 max-w-[280px]">
            {buttons.buttons.map((btn, i) => (
              <div
                key={i}
                className="bg-[#1f2937] rounded-xl rounded-tl-sm flex items-center justify-center gap-2 py-2.5 px-4 shadow"
              >
                <MousePointerClick className="w-3.5 h-3.5 text-[#25d366]" />
                <span className="text-sm text-[#25d366] font-medium">
                  {btn.text || 'Botão'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Variable legend */}
      {components.some(c => c.text && /\{\{\d+\}\}/.test(c.text)) && (
        <p className="text-center text-[10px] text-gray-600 pt-2">
          Os campos entre {'{{}}' } serão substituídos dinamicamente
        </p>
      )}
    </div>
  );
}
