'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical, Type, Image, AlignLeft, FootprintsIcon, MousePointerClick, Link2, Phone } from 'lucide-react';
import clsx from 'clsx';
import type { TemplateComponent, ComponentType, ButtonType } from '../../types/templates';

interface ComponentEditorProps {
  components: TemplateComponent[];
  onChange: (components: TemplateComponent[]) => void;
}

const COMPONENT_ICONS: Record<ComponentType, React.ElementType> = {
  HEADER: Image,
  BODY: AlignLeft,
  FOOTER: Type,
  BUTTONS: MousePointerClick,
};

const COMPONENT_LABELS: Record<ComponentType, string> = {
  HEADER: 'Cabeçalho (Header)',
  BODY: 'Corpo (Body)',
  FOOTER: 'Rodapé (Footer)',
  BUTTONS: 'Botões',
};

const BUTTON_ICONS: Record<ButtonType, React.ElementType> = {
  QUICK_REPLY: MousePointerClick,
  URL: Link2,
  PHONE_NUMBER: Phone,
};

const BUTTON_LABELS: Record<ButtonType, string> = {
  QUICK_REPLY: 'Resposta Rápida',
  URL: 'Link (URL)',
  PHONE_NUMBER: 'Telefone',
};

function parseVariables(text: string): React.ReactElement {
  const parts = text.split(/({{[\d]+}})/g);
  return (
    <>
      {parts.map((part, i) =>
        /^{{\d+}}$/.test(part) ? (
          <mark key={i} className="bg-pink-500/20 text-pink-300 rounded px-0.5 not-italic font-mono text-xs">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function ComponentCard({
  component,
  index,
  onChange,
  onRemove,
}: {
  component: TemplateComponent;
  index: number;
  onChange: (updated: TemplateComponent) => void;
  onRemove: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const Icon = COMPONENT_ICONS[component.type];

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-800 border-b border-gray-700">
        <GripVertical className="w-4 h-4 text-gray-600" />
        <div className="p-1.5 rounded-lg bg-pink-600/20">
          <Icon className="w-3.5 h-3.5 text-pink-400" />
        </div>
        <span className="text-sm font-semibold text-white flex-1">
          {COMPONENT_LABELS[component.type]}
        </span>
        <button
          type="button"
          onClick={() => setCollapsed(p => !p)}
          className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
        >
          {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 text-gray-600 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      {!collapsed && (
        <div className="p-4 space-y-4">
          {/* HEADER format selector */}
          {component.type === 'HEADER' && (
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                Formato
              </label>
              <div className="flex gap-2 flex-wrap">
                {(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT'] as const).map(fmt => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => onChange({ ...component, format: fmt })}
                    className={clsx(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border',
                      component.format === fmt
                        ? 'bg-pink-600 border-pink-500 text-white'
                        : 'border-gray-600 text-gray-400 hover:border-gray-500'
                    )}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Text area for HEADER(TEXT), BODY, FOOTER */}
          {(component.type === 'BODY' ||
            component.type === 'FOOTER' ||
            (component.type === 'HEADER' && (component.format === 'TEXT' || !component.format))) && (
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                Texto{' '}
                {component.type === 'BODY' && (
                  <span className="text-gray-600 normal-case font-normal">
                    — Use {'{{1}}'}, {'{{2}}'} para variáveis
                  </span>
                )}
              </label>
              <textarea
                value={component.text ?? ''}
                onChange={e => onChange({ ...component, text: e.target.value })}
                placeholder={
                  component.type === 'BODY'
                    ? 'Olá {{1}}, seu pedido {{2}} está a caminho!'
                    : component.type === 'FOOTER'
                    ? 'Equipe Damaface'
                    : 'Promoção de Verão'
                }
                rows={component.type === 'BODY' ? 4 : 2}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-600 resize-none font-mono"
              />
              {/* Variable Preview */}
              {component.text && /\{\{\d+\}\}/.test(component.text) && (
                <div className="mt-2 p-3 rounded-lg bg-gray-900/80 border border-gray-700 text-sm text-gray-300 leading-relaxed">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider block mb-1">Preview</span>
                  {parseVariables(component.text)}
                </div>
              )}
            </div>
          )}

          {/* BUTTONS editor */}
          {component.type === 'BUTTONS' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Botões
              </label>
              {(component.buttons ?? []).map((btn, bi) => {
                const BtnIcon = BUTTON_ICONS[btn.type as ButtonType] ?? MousePointerClick;
                return (
                  <div key={bi} className="border border-gray-700 rounded-lg p-3 space-y-3 bg-gray-900/40">
                    <div className="flex items-center gap-2">
                      <BtnIcon className="w-4 h-4 text-pink-400" />
                      <select
                        value={btn.type}
                        onChange={e => {
                          const buttons = [...(component.buttons ?? [])];
                          buttons[bi] = { ...btn, type: e.target.value as ButtonType };
                          onChange({ ...component, buttons });
                        }}
                        className="text-xs bg-gray-800 border border-gray-600 text-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                      >
                        {Object.entries(BUTTON_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          const buttons = (component.buttons ?? []).filter((_, i) => i !== bi);
                          onChange({ ...component, buttons });
                        }}
                        className="ml-auto text-gray-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      value={btn.text}
                      onChange={e => {
                        const buttons = [...(component.buttons ?? [])];
                        buttons[bi] = { ...btn, text: e.target.value };
                        onChange({ ...component, buttons });
                      }}
                      placeholder="Texto do botão"
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                    />
                    {btn.type === 'URL' && (
                      <input
                        value={btn.url ?? ''}
                        onChange={e => {
                          const buttons = [...(component.buttons ?? [])];
                          buttons[bi] = { ...btn, url: e.target.value };
                          onChange({ ...component, buttons });
                        }}
                        placeholder="https://example.com"
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                      />
                    )}
                    {btn.type === 'PHONE_NUMBER' && (
                      <input
                        value={btn.phone_number ?? ''}
                        onChange={e => {
                          const buttons = [...(component.buttons ?? [])];
                          buttons[bi] = { ...btn, phone_number: e.target.value };
                          onChange({ ...component, buttons });
                        }}
                        placeholder="+5511999999999"
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                      />
                    )}
                  </div>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  const buttons = [
                    ...(component.buttons ?? []),
                    { type: 'QUICK_REPLY' as ButtonType, text: '' },
                  ];
                  onChange({ ...component, buttons });
                }}
                className="flex items-center gap-2 text-xs text-pink-400 hover:text-pink-300 font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar botão
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const ADDABLE_TYPES: ComponentType[] = ['HEADER', 'BODY', 'FOOTER', 'BUTTONS'];

export function ComponentEditor({ components, onChange }: ComponentEditorProps) {
  const addComponent = (type: ComponentType) => {
    const newComp: TemplateComponent = {
      type,
      ...(type === 'HEADER' ? { format: 'TEXT', text: '' } : {}),
      ...(type === 'BODY' ? { text: '' } : {}),
      ...(type === 'FOOTER' ? { text: '' } : {}),
      ...(type === 'BUTTONS' ? { buttons: [] } : {}),
    };
    onChange([...components, newComp]);
  };

  const updateComponent = (index: number, updated: TemplateComponent) => {
    const next = components.map((c, i) => (i === index ? updated : c));
    onChange(next);
  };

  const removeComponent = (index: number) => {
    onChange(components.filter((_, i) => i !== index));
  };

  const existingTypes = new Set(components.map(c => c.type));

  return (
    <div className="space-y-4">
      {/* Existing components */}
      {components.map((comp, idx) => (
        <ComponentCard
          key={idx}
          component={comp}
          index={idx}
          onChange={updated => updateComponent(idx, updated)}
          onRemove={() => removeComponent(idx)}
        />
      ))}

      {/* Add buttons */}
      <div className="flex flex-wrap gap-2 pt-2">
        {ADDABLE_TYPES.filter(t => !existingTypes.has(t)).map(type => {
          const Icon = COMPONENT_ICONS[type];
          return (
            <button
              key={type}
              type="button"
              onClick={() => addComponent(type)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-600 text-gray-400 hover:border-pink-500 hover:text-pink-400 text-xs font-semibold transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <Icon className="w-3.5 h-3.5" />
              {COMPONENT_LABELS[type]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
