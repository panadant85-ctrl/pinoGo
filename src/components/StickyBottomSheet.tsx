import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { Check, ArrowRight, MessageCircle, Ban, RefreshCw, ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react';

interface StickyBottomSheetProps {
  order: Order | null;
  onUpdateStatus: (orderId: string, nextStatus: OrderStatus, note?: string) => void;
  onOpenWhatsAppReply: (order: Order) => void;
  onCloseSheet: () => void;
}

export const StickyBottomSheet: React.FC<StickyBottomSheetProps> = ({
  order,
  onUpdateStatus,
  onOpenWhatsAppReply,
  onCloseSheet,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [customNote, setCustomNote] = useState('');

  if (!order) return null;

  const handleAdvanceStatus = () => {
    if (order.status === 'registrado') {
      onUpdateStatus(order.id, 'aprobado', customNote || 'Aprobado con 1-tap en panel inferior');
    } else if (order.status === 'aprobado') {
      onUpdateStatus(order.id, 'comprado', customNote || 'Pasado a preparación y compra de insumos');
    } else if (order.status === 'comprado') {
      onUpdateStatus(order.id, 'entregado', customNote || 'Entregado con éxito al cliente');
    }
    setCustomNote('');
  };

  const handleCancel = () => {
    onUpdateStatus(order.id, 'cancelado', 'Cancelado desde barra operativa');
  };

  const handleReopen = () => {
    onUpdateStatus(order.id, 'registrado', 'Reabierto a estado Registrado');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-[#CBD5E1] shadow-[0_-8px_20px_-6px_rgba(15,23,42,0.15)] rounded-t-2xl transition-all">
      <div className="max-w-3xl mx-auto px-4 pt-2 pb-4">
        {/* Pill Grabber Handle */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex flex-col items-center justify-center py-1 group focus:outline-none"
          aria-label={isExpanded ? 'Contraer controles' : 'Expandir controles'}
        >
          <div className="w-12 h-1.5 bg-slate-300 group-hover:bg-slate-400 rounded-full transition-colors" />
        </button>

        {/* Selected Order Summary Row */}
        <div className="flex items-center justify-between gap-3 py-1.5">
          <div className="min-w-0 flex items-center gap-2.5">
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-800">{order.orderNumber}</span>
                <span className="text-xs font-bold text-slate-900 truncate max-w-[160px] sm:max-w-xs">
                  {order.customer.name}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span className="font-bold text-[#0b1c30] tabular-nums">€{order.total.toFixed(2)}</span>
                <span>·</span>
                <span>{order.payment.method}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={order.status} size="sm" />
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              aria-label="Toggle drawer expansion"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expanded Details: Timeline progress and optional custom note */}
        {isExpanded && (
          <div className="my-3 pt-3 border-t border-slate-100 text-left space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Transición Rápida de Estado</span>
              <span className="text-slate-500 font-mono text-[11px]">{order.elapsedTime}</span>
            </div>

            {/* Quick Status Bar */}
            <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold uppercase tracking-wider py-1">
              <div
                className={`py-1 rounded border ${
                  order.status === 'registrado'
                    ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A] font-extrabold'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                1. Registrado
              </div>
              <div
                className={`py-1 rounded border ${
                  order.status === 'aprobado'
                    ? 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0] font-extrabold'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                2. Aprobado
              </div>
              <div
                className={`py-1 rounded border ${
                  order.status === 'comprado'
                    ? 'bg-[#E0E7FF] text-[#3730A3] border-[#C7D2FE] font-extrabold'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                3. Comprado
              </div>
              <div
                className={`py-1 rounded border ${
                  order.status === 'entregado'
                    ? 'bg-slate-200 text-slate-800 border-slate-300 font-extrabold'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                4. Entregado
              </div>
            </div>

            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Nota para el cambio de estado (ej: Verificado en app bancaria)..."
              className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#00685d]"
            />
          </div>
        )}

        {/* Thumb-Zone Operational Action Buttons (Touch optimized h-12 = 48px) */}
        <div className="flex items-center gap-2 mt-2">
          {order.status === 'registrado' && (
            <>
              {/* Primary: Deep emerald (Aprobar) */}
              <button
                type="button"
                onClick={handleAdvanceStatus}
                className="flex-1 h-12 bg-[#00685d] hover:bg-[#005047] active:scale-[0.98] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Check className="w-5 h-5 stroke-[2.5]" />
                <span>Aprobar Pedido</span>
              </button>

              {/* Secondary: WhatsApp vivid green */}
              <button
                type="button"
                onClick={() => onOpenWhatsAppReply(order)}
                className="h-12 px-4 bg-[#25D366] hover:bg-[#1EBE5D] active:scale-[0.98] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                title="Responder en WhatsApp"
              >
                <MessageCircle className="w-5 h-5 fill-white stroke-none" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>

              {/* Ghost: Cancel */}
              <button
                type="button"
                onClick={handleCancel}
                className="h-12 px-3 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors"
                title="Cancelar pedido"
              >
                <Ban className="w-4 h-4" />
              </button>
            </>
          )}

          {order.status === 'aprobado' && (
            <>
              {/* Primary: Avanzar a Comprado / En Preparación */}
              <button
                type="button"
                onClick={handleAdvanceStatus}
                className="flex-1 h-12 bg-[#3730A3] hover:bg-[#2e2888] active:scale-[0.98] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                <span>Marcar Comprado / Cocina</span>
              </button>

              {/* Secondary: WhatsApp vivid green */}
              <button
                type="button"
                onClick={() => onOpenWhatsAppReply(order)}
                className="h-12 px-4 bg-[#25D366] hover:bg-[#1EBE5D] active:scale-[0.98] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white stroke-none" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="h-12 px-3 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors"
              >
                <Ban className="w-4 h-4" />
              </button>
            </>
          )}

          {order.status === 'comprado' && (
            <>
              {/* Primary: Marcar Entregado */}
              <button
                type="button"
                onClick={handleAdvanceStatus}
                className="flex-1 h-12 bg-[#00685d] hover:bg-[#005047] active:scale-[0.98] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                <span>Marcar Entregado</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenWhatsAppReply(order)}
                className="h-12 px-4 bg-[#25D366] hover:bg-[#1EBE5D] active:scale-[0.98] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white stroke-none" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
            </>
          )}

          {order.status === 'cancelado' && (
            <div className="flex-1 flex items-center justify-between gap-3">
              <span className="text-xs text-rose-800 font-medium">Pedido cancelado</span>
              <button
                type="button"
                onClick={handleReopen}
                className="h-12 px-4 bg-slate-800 hover:bg-slate-900 active:scale-[0.98] text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reactivar Pedido</span>
              </button>
            </div>
          )}

          {order.status === 'entregado' && (
            <div className="flex-1 flex items-center justify-between gap-3">
              <span className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Pedido completado con éxito</span>
              </span>
              <button
                type="button"
                onClick={() => onOpenWhatsAppReply(order)}
                className="h-12 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                <span>Enviar Encuesta de Satisfacción</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
