import React, { useState } from 'react';
import { Order } from '../types';
import { X, Send, Copy, Check, MessageCircle, ExternalLink } from 'lucide-react';

interface QuickReplyModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (orderId: string, text: string) => void;
}

export const QuickReplyModal: React.FC<QuickReplyModalProps> = ({
  order,
  isOpen,
  onClose,
  onSendMessage,
}) => {
  if (!isOpen || !order) return null;

  const [message, setMessage] = useState(
    `¡Hola ${order.customer.name.split(' ')[0]}! Te escribo de Direct Commerce Hub respecto a tu pedido ${order.orderNumber}.`
  );
  const [copied, setCopied] = useState(false);

  const templates = [
    {
      title: 'Confirmar & Solicitar Pago',
      text: `¡Hola ${order.customer.name.split(' ')[0]}! Confirmamos tu pedido ${order.orderNumber} por un total de €${order.total.toFixed(2)}. Puedes transferir por Bizum al número del comercio indicando tu nombre. ¡Quedamos atentos a tu comprobante!`,
    },
    {
      title: 'Aprobado & En Cocina',
      text: `¡Hola ${order.customer.name.split(' ')[0]}! Tu pago para el pedido ${order.orderNumber} ha sido verificado con éxito. Ya estamos preparando tus artículos frescos. ☕✨`,
    },
    {
      title: 'En Camino / Despachado',
      text: `¡Hola ${order.customer.name.split(' ')[0]}! Tu pedido ${order.orderNumber} acaba de salir con nuestro repartidor hacia ${order.customer.address}. Tiempo estimado: 20-30 min. 🛵`,
    },
    {
      title: 'Solicitar Comprobante Legible',
      text: `Hola ${order.customer.name.split(' ')[0]}, disculpa la molestia, ¿podrías reenviarnos una foto clara del comprobante bancario para poder aprobar el pedido ${order.orderNumber}? ¡Gracias!`,
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendAndOpen = () => {
    if (!message.trim()) return;
    onSendMessage(order.id, message);

    const cleanPhone = order.customer.phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-[#00685d] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center">
              <MessageCircle className="w-4 h-4 fill-white stroke-none" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Respuesta Rápida WhatsApp</h3>
              <p className="text-xs text-white/80">
                {order.customer.name} · <span className="font-mono">{order.customer.phone}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Order reference banner */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-mono font-bold text-slate-800">{order.orderNumber}</span>
              <span className="text-slate-500 ml-2">Total: €{order.total.toFixed(2)}</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-600 capitalize">
              Estado: {order.status}
            </span>
          </div>

          {/* Quick templates chips */}
          <div>
            <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
              Seleccionar Plantilla
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {templates.map((tpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setMessage(tpl.text)}
                  className="p-2.5 rounded-lg border border-slate-200 text-left hover:border-[#00685d] hover:bg-[#00685d]/5 transition-colors group"
                >
                  <p className="text-xs font-bold text-slate-800 group-hover:text-[#00685d]">
                    {tpl.title}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{tpl.text}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
              Mensaje Personalizado
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 rounded-lg border border-[#CBD5E1] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00685d]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleCopy}
              className="w-full sm:w-auto px-4 h-12 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-95 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copiar Texto</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSendAndOpen}
              disabled={!message.trim()}
              className="w-full sm:flex-1 h-12 bg-[#25D366] hover:bg-[#1EBE5D] disabled:opacity-50 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Enviar y Abrir en WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
