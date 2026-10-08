import React from 'react';
import { OrderStatus } from '../types';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export const STATUS_CONFIG: Record<OrderStatus, {
  label: string;
  bg: string;
  border: string;
  text: string;
  dot: string;
}> = {
  registrado: {
    label: 'REGISTRADO',
    bg: 'bg-[#FEF3C7]',
    border: 'border-[#FDE68A]',
    text: 'text-[#92400E]',
    dot: 'bg-[#D97706]',
  },
  aprobado: {
    label: 'APROBADO',
    bg: 'bg-[#DCFCE7]',
    border: 'border-[#BBF7D0]',
    text: 'text-[#166534]',
    dot: 'bg-[#16A34A]',
  },
  comprado: {
    label: 'COMPRADO',
    bg: 'bg-[#E0E7FF]',
    border: 'border-[#C7D2FE]',
    text: 'text-[#3730A3]',
    dot: 'bg-[#4F46E5]',
  },
  cancelado: {
    label: 'CANCELADO',
    bg: 'bg-[#FEE2E2]',
    border: 'border-[#FECACA]',
    text: 'text-[#991B1B]',
    dot: 'bg-[#DC2626]',
  },
  entregado: {
    label: 'ENTREGADO',
    bg: 'bg-[#F1F5F9]',
    border: 'border-[#CBD5E1]',
    text: 'text-[#334155]',
    dot: 'bg-[#64748B]',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.registrado;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold uppercase tracking-[0.04em] whitespace-nowrap shadow-xs ${config.bg} ${config.border} ${config.text} ${
        size === 'sm' ? 'px-3 py-1 text-[10px] leading-3.5' : 'px-3.5 py-1.5 text-xs leading-4'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};
