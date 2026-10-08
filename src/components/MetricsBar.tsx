import React from 'react';
import { Order } from '../types';
import { Clock, TrendingUp, Inbox, CheckCircle2 } from 'lucide-react';

interface MetricsBarProps {
  orders: Order[];
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ orders }) => {
  const activeOrders = orders.filter((o) => o.status !== 'cancelado' && o.status !== 'entregado');
  const pendingTriage = orders.filter((o) => o.status === 'registrado');
  const approved = orders.filter((o) => o.status === 'aprobado' || o.status === 'comprado');
  const urgentCount = orders.filter((o) => o.isUrgent && o.status === 'registrado').length;

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelado')
    .reduce((sum, o) => sum + o.total, 0);

  const averageTicket = orders.length > 0
    ? (totalRevenue / Math.max(1, orders.filter((o) => o.status !== 'cancelado').length))
    : 0;

  return (
    <section className="bg-white border-b border-[#e2e8f0] px-4 md:px-6 py-3.5">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        {/* Metric 1: Total Facturado */}
        <div className="p-3 rounded-xl bg-[#f8f9ff] border border-[#e2e8f0]/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Facturación Hoy</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#00685d]" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-[#0b1c30] tabular-nums tracking-tight">
            €{totalRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Ticket prom. <span className="font-semibold text-slate-700 tabular-nums">€{averageTicket.toFixed(2)}</span>
          </div>
        </div>

        {/* Metric 2: Por Triar (Registrados) */}
        <div className="p-3 rounded-xl bg-[#FEF3C7]/40 border border-[#FDE68A] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-[#92400E] uppercase tracking-wider mb-1">
            <span>Por Triar (WhatsApp)</span>
            <Inbox className="w-3.5 h-3.5 text-[#D97706]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl md:text-2xl font-bold text-[#92400E] tabular-nums tracking-tight">
              {pendingTriage.length}
            </span>
            <span className="text-xs text-[#92400E]/80 font-medium">pedidos</span>
          </div>
          <div className="text-[11px] text-[#92400E] mt-0.5">
            {urgentCount > 0 ? (
              <span className="font-bold flex items-center gap-1 text-rose-700">
                ⚡ {urgentCount} requieren atención inmediata
              </span>
            ) : (
              <span>Sin retrasos de SLA</span>
            )}
          </div>
        </div>

        {/* Metric 3: En Proceso (Aprobado + Comprado) */}
        <div className="p-3 rounded-xl bg-[#DCFCE7]/40 border border-[#BBF7D0] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-[#166534] uppercase tracking-wider mb-1">
            <span>En Despacho / Cocina</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl md:text-2xl font-bold text-[#166534] tabular-nums tracking-tight">
              {approved.length}
            </span>
            <span className="text-xs text-[#166534]/80 font-medium">preparando</span>
          </div>
          <div className="text-[11px] text-[#166534] mt-0.5">
            Pagos validados al 100%
          </div>
        </div>

        {/* Metric 4: Tasa de Respuesta */}
        <div className="p-3 rounded-xl bg-[#f8f9ff] border border-[#e2e8f0]/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Tiempo de Respuesta</span>
            <Clock className="w-3.5 h-3.5 text-[#0058be]" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-[#0b1c30] tabular-nums tracking-tight">
            ~2.4 min
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
            ✓ 94% SLA cumplimiento
          </div>
        </div>
      </div>
    </section>
  );
};
