import React from 'react';
import { Order } from '../types';
import { StatusBadge } from './StatusBadge';
import { MessageCircle, Clock, MapPin, AlertCircle, ShoppingBag } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  isSelected: boolean;
  onSelect: (order: Order) => void;
  onOpenWhatsAppReply: (order: Order, e: React.MouseEvent) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  isSelected,
  onSelect,
  onOpenWhatsAppReply,
}) => {
  const totalItemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const primaryItem = order.items[0];
  const lastCustomerMessage = [...order.messages].reverse().find((m) => m.sender === 'customer');

  return (
    <article
      onClick={() => onSelect(order)}
      className={`group relative rounded-2xl bg-white p-4 transition-all duration-200 cursor-pointer border text-left ${
        isSelected
          ? 'border-[#00685d] ring-2 ring-[#00685d]/20 shadow-md bg-white'
          : 'border-[#E2E8F0] hover:border-slate-300 hover:shadow-sm shadow-xs'
      }`}
    >
      {/* Top Row: Customer Name, Elapsed Time & Status Badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Customer Avatar Initials */}
          <div
            className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-xs ${
              order.customer.avatarColor || 'bg-slate-700'
            }`}
          >
            {order.customer.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#0b1c30] truncate group-hover:text-[#00685d] transition-colors">
                {order.customer.name}
              </h3>
              {order.customer.tier === 'VIP' && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 shrink-0">
                  VIP
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className="tabular-nums font-mono text-slate-600 font-semibold">{order.orderNumber}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1 text-slate-500">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{order.elapsedTime}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="shrink-0">
          <StatusBadge status={order.status} size="sm" />
        </div>
      </div>

      {/* Middle Row: Items preview & latest chat snippet */}
      <div className="my-3 pt-2 border-t border-slate-100 flex items-center gap-3">
        {/* Thumbnail of primary item */}
        {primaryItem?.image && (
          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
            <img
              src={primaryItem.image}
              alt={primaryItem.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                // styled fallback container
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-slate-800 truncate">
            {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
          </p>
          {lastCustomerMessage && (
            <p className="text-xs text-slate-500 truncate italic mt-0.5 flex items-center gap-1">
              <span className="text-[#25D366] font-bold">WA:</span>
              <span className="truncate">"{lastCustomerMessage.text}"</span>
            </p>
          )}
        </div>
      </div>

      {/* Bottom Row: Monetary value, address tag and Floating 1-tap WhatsApp Action Button */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-[#0b1c30] tabular-nums tracking-tight">
            €{order.total.toFixed(2)}
          </span>
          <span className="text-[11px] text-slate-500">
            ({totalItemCount} {totalItemCount === 1 ? 'artículo' : 'artículos'})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Urgent indicator if applicable */}
          {order.isUrgent && order.status === 'registrado' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded-full border border-rose-200">
              <AlertCircle className="w-3 h-3 text-rose-600" />
              <span>SLA</span>
            </span>
          )}

          {/* Direct 1-tap Quick Action: Floating WhatsApp reply icon button */}
          <button
            type="button"
            onClick={(e) => onOpenWhatsAppReply(order, e)}
            title={`Responder por WhatsApp a ${order.customer.name}`}
            aria-label={`Responder por WhatsApp a ${order.customer.name}`}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-sm hover:shadow active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#25D366]/40"
          >
            <MessageCircle className="w-5 h-5 fill-white stroke-none" />
          </button>
        </div>
      </div>
    </article>
  );
};
