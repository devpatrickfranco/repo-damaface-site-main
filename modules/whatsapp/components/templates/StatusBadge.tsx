'use client';

import clsx from 'clsx';
import { CheckCircle2, Clock, XCircle, PauseCircle, MinusCircle } from 'lucide-react';
import type { TemplateStatus } from '../../types/templates';

interface StatusBadgeProps {
  status: TemplateStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<TemplateStatus, {
  label: string;
  className: string;
  icon: React.ElementType;
}> = {
  APPROVED: {
    label: 'Aprovado',
    className: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    icon: CheckCircle2,
  },
  PENDING: {
    label: 'Pendente',
    className: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    icon: Clock,
  },
  REJECTED: {
    label: 'Rejeitado',
    className: 'bg-red-500/15 text-red-400 border border-red-500/30',
    icon: XCircle,
  },
  PAUSED: {
    label: 'Pausado',
    className: 'bg-gray-500/15 text-gray-400 border border-gray-500/30',
    icon: PauseCircle,
  },
  DISABLED: {
    label: 'Desativado',
    className: 'bg-gray-500/10 text-gray-500 border border-gray-700',
    icon: MinusCircle,
  },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  const Icon = config.icon;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-[9px]' : 'px-3 py-1 text-[10px]',
        config.className
      )}
    >
      <Icon className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      {config.label}
    </span>
  );
}
