import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import {
  X,
  Phone,
  MapPin,
  Clock,
  Send,
  Copy,
  Check,
  FileText,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  CreditCard,
  Truck,
  Plus
} from 'lucide-react';

interface OrderDetailProps {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  onSendMessage: (orderId: string, text: string) => void;
  onAddInternalNote: (orderId: string, note: string) => void;
}

export const OrderDetail: React.FC<OrderDetailProps> = ({
  order,
  onClose,
  onUpdateStatus,
  onSendMessage,
  onAddInternalNote,
}) => {
  const [replyText, setReplyText] = useState('');
  const [internalNoteInput, setInternalNoteInput] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const quickTemplates = [
    `¡Hola ${order.customer.name.split(' ')[0]}! Confirmamos la recepción de tu pedido ${order.orderNumber}. El total es de €${order.total.toFixed(2)}.`,
    `¡Pago recibido y verificado con éxito! Tu pedido ${order.orderNumber} pasa al área de preparación. ☕`,
    `¡Tu pedido ${order.orderNumber} va en camino! El repartidor llegará en aproximadamente 25 minutos. 🛵`,
    `Hola ${order.customer.name.split(' ')[0]}, ¿nos podrías reenviar una captura nítida del comprobante de transferencia por favor? 🙏`,
  ];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSendReply = (textToSend?: string) => {
    const finalMsg = textToSend || replyText;
    if (!finalMsg.trim()) return;

    onSendMessage(order.id, finalMsg);
    setReplyText('');

    // Open WhatsApp link cleanly in new tab if user wants real outreach
    const cleanPhone = order.customer.phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(finalMsg);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!internalNoteInput.trim()) return;
    onAddInternalNote(order.id, internalNoteInput);
    setInternalNoteInput('');
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col h-full overflow-hidden text-left">
      {/* Top Bar with Order ID & Status */}
      <div className="px-5 py-4 border-b border-[#E2E8F0] bg-slate-50/70 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-base font-bold text-slate-900">{order.orderNumber}</span>
          <StatusBadge status={order.status} size="md" />
          {order.isUrgent && order.status === 'registrado' && (
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>Prioridad Alta</span>
            </span>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          aria-label="Cerrar detalle"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Customer Profile Card */}
        <div className="rounded-xl p-4 bg-[#f8f9ff] border border-[#e2e8f0]/80">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-xs ${
                  order.customer.avatarColor || 'bg-slate-700'
                }`}
              >
                {order.customer.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#0b1c30]">{order.customer.name}</h2>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    {order.customer.tier}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <a
                    href={`tel:${order.customer.phone}`}
                    className="text-xs text-slate-600 hover:text-[#00685d] flex items-center gap-1 font-medium font-mono"
                  >
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{order.customer.phone}</span>
                  </a>
                  <button
                    onClick={() => handleCopy(order.customer.phone, 'phone')}
                    className="text-[11px] text-slate-400 hover:text-slate-600 p-0.5"
                    title="Copiar teléfono"
                  >
                    {copiedText === 'phone' ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout button */}
            <a
              href={`https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
            >
              <MessageCircle className="w-4 h-4 fill-white stroke-none" />
              <span>Abrir Chat</span>
            </a>
          </div>

          {/* Delivery Address */}
          <div className="mt-3 pt-3 border-t border-slate-200/70 text-xs text-slate-600 flex items-start justify-between gap-2">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">{order.customer.address}, {order.customer.city}</p>
                {order.customer.notes && (
                  <p className="text-slate-500 italic mt-0.5 font-sans">
                    Nota entrega: "{order.customer.notes}"
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => handleCopy(`${order.customer.address}, ${order.customer.city}`, 'address')}
              className="text-[11px] font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 shrink-0"
            >
              {copiedText === 'address' ? (
                <span className="text-emerald-600 flex items-center gap-1 font-bold">
                  <Check className="w-3 h-3" /> Copiado
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Copy className="w-3 h-3" /> Copiar
                </span>
              )}
            </button>
          </div>
        </div>

        {/* WhatsApp Real-time Chat Timeline */}
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50">
          <div className="bg-[#00685d] text-white px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 fill-white stroke-none" />
              <span className="text-xs font-bold tracking-wide">Historial de Conversación WhatsApp</span>
            </div>
            <span className="text-[11px] text-white/80 tabular-nums">
              {order.messages.length} mensajes
            </span>
          </div>

          {/* Message Bubbles Area */}
          <div className="p-3.5 max-h-64 overflow-y-auto space-y-2.5 bg-[#ECE5DD]/30">
            {order.messages.map((msg) => {
              const isOperator = msg.sender === 'operator';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isOperator ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-xs shadow-xs relative ${
                      isOperator
                        ? 'bg-[#DCF8C6] text-slate-900 rounded-tr-xs'
                        : 'bg-white text-slate-900 border border-slate-100 rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    <div
                      className={`text-[9px] mt-1 flex items-center gap-1 ${
                        isOperator ? 'justify-end text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.time}</span>
                      {isOperator && <span className="text-[#00685d] font-bold">✓✓</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Reply Template Chips */}
          <div className="p-2.5 bg-slate-100/90 border-t border-slate-200">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Plantillas Rápidas (1-tap):
            </p>
            <div className="flex flex-wrap gap-1.5">
              {quickTemplates.map((tpl, idx) => (
                <button
                  key={idx}
                  onClick={() => setReplyText(tpl)}
                  className="text-[11px] text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg px-2.5 py-1 text-left truncate max-w-full transition-colors active:scale-95"
                >
                  {tpl.slice(0, 36)}...
                </button>
              ))}
            </div>
          </div>

          {/* Message Input & Send via WhatsApp */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendReply();
              }}
              placeholder="Escribir respuesta para WhatsApp..."
              className="flex-1 h-11 px-3.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00685d]"
            />
            <button
              onClick={() => handleSendReply()}
              disabled={!replyText.trim()}
              className="h-11 px-4 bg-[#25D366] hover:bg-[#1EBE5D] disabled:opacity-50 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Enviar</span>
            </button>
          </div>
        </div>

        {/* Order Items List */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Artículos del Pedido</span>
            <span className="text-slate-400 font-mono text-[11px]">
              {order.items.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          </h3>

          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden bg-white">
            {order.items.map((item) => (
              <div key={item.id} className="p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">SKU: {item.sku}</p>
                    {item.notes && (
                      <p className="text-[11px] text-amber-800 font-medium bg-amber-50 rounded px-1.5 py-0.5 inline-block mt-0.5">
                        Nota: {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-slate-900 tabular-nums">
                    €{(item.price * item.quantity).toFixed(2)}
                  </div>
                  <div className="text-[11px] text-slate-500 tabular-nums">
                    {item.quantity} x €{item.price.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown & Payment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Payment Card */}
          <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/50">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#00685d]" />
                <span>Método de Pago</span>
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  order.payment.status === 'Verificado'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {order.payment.status}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-900">{order.payment.method}</p>
            <p className="text-xs text-slate-500 font-mono mt-0.5">Ref: {order.payment.referenceCode}</p>
            {order.payment.verifiedAt && (
              <p className="text-[11px] text-emerald-700 mt-1">✓ Verificado a las {order.payment.verifiedAt}</p>
            )}
          </div>

          {/* Totals Summary */}
          <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/50 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal productos</span>
              <span className="tabular-nums font-semibold">€{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Coste de entrega ({order.deliveryType})</span>
              <span className="tabular-nums font-semibold">
                {order.deliveryFee === 0 ? 'Gratis' : `€${order.deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-[#0b1c30]">
              <span>Total a Cobrar</span>
              <span className="tabular-nums text-base text-[#00685d]">€{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Operational Timeline & Audit Trail */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Historial de Estados y Auditoría
          </h3>
          <div className="border border-slate-200 rounded-xl p-3.5 space-y-3 bg-white">
            {order.timeline.map((event, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs">
                <div className="w-2 h-2 rounded-full bg-[#00685d] mt-1 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 capitalize">
                      {event.status} · <span className="font-normal text-slate-500">{event.operator}</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{event.timestamp}</span>
                  </div>
                  {event.note && <p className="text-slate-600 text-[11px] mt-0.5">{event.note}</p>}
                </div>
              </div>
            ))}

            {/* Internal Note Addition */}
            <form onSubmit={handleAddNote} className="pt-2 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={internalNoteInput}
                onChange={(e) => setInternalNoteInput(e.target.value)}
                placeholder="Añadir nota interna de equipo..."
                className="flex-1 h-9 px-3 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#00685d]"
              />
              <button
                type="submit"
                disabled={!internalNoteInput.trim()}
                className="h-9 px-3 bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nota</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
