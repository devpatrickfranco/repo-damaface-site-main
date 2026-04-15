import React from 'react';

export function WhatsAppSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Banner Skeleton */}
      <div className="h-24 bg-gray-200 rounded-2xl w-full" />
      
      {/* Stats Skeleton */}
      <div className="grid grid-cols-3 gap-4">
        <div className="h-32 bg-gray-200 rounded-2xl" />
        <div className="h-32 bg-gray-200 rounded-2xl" />
        <div className="h-32 bg-gray-200 rounded-2xl" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 gap-4">
        <div className="h-20 bg-gray-200 rounded-2xl" />
        <div className="h-20 bg-gray-200 rounded-2xl" />
        <div className="h-20 bg-gray-200 rounded-2xl" />
        <div className="h-20 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  );
}

export function ConnectionBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string, color: string }> = {
    active: { label: 'Ativo', color: 'bg-green-100 text-green-700' },
    pending: { label: 'Pendente', color: 'bg-amber-100 text-amber-700' },
    connecting: { label: 'Conectando', color: 'bg-blue-100 text-blue-700' },
    suspended: { label: 'Suspenso', color: 'bg-red-100 text-red-700' },
    failed: { label: 'Falhou', color: 'bg-red-100 text-red-700' },
    disconnected: { label: 'Desconectado', color: 'bg-gray-100 text-gray-700' },
  };

  const config = configs[status] || configs.disconnected;

  return (
    <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${config.color}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'animate-pulse bg-green-500' : 'bg-current'}`} />
      <span>{config.label}</span>
    </span>
  );
}
