import React, { useState } from 'react';
import { CATALOG_PRODUCTS } from '../data/mockOrders';
import { Order, OrderItem } from '../types';
import { X, Plus, Minus, ShoppingBag, Check } from 'lucide-react';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateOrder: (newOrder: Order) => void;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  onCreateOrder,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+34 ');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryType, setDeliveryType] = useState<'Envío Express' | 'Envío Estándar' | 'Retiro en Tienda'>('Envío Express');
  const [paymentMethod, setPaymentMethod] = useState<'Bizum / Móvil' | 'Transferencia SPEI' | 'Efectivo contra entrega' | 'Enlace de Pago'>('Bizum / Móvil');
  const [notes, setNotes] = useState('');

  // Selected quantities for catalog items
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'prod-1': 1,
    'prod-2': 1,
  });

  if (!isOpen) return null;

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const selectedItems: OrderItem[] = CATALOG_PRODUCTS.filter(
    (p) => (quantities[p.id] || 0) > 0
  ).map((p) => ({
    id: `item-${Date.now()}-${p.id}`,
    name: p.name,
    sku: p.sku,
    quantity: quantities[p.id],
    price: p.price,
    image: p.image,
  }));

  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryType === 'Envío Express' ? 2.50 : 0.00;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || selectedItems.length === 0) return;

    const newId = `ord-${Date.now().toString().slice(-4)}`;
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newOrder: Order = {
      id: newId,
      orderNumber: `#WH-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: now.toISOString(),
      elapsedTime: 'ahora mismo',
      isUrgent: true,
      deliveryType,
      customer: {
        id: `cust-${Date.now()}`,
        name: customerName,
        phone: customerPhone,
        address: customerAddress || 'Centro Ciudad',
        city: 'Madrid',
        tier: 'Nuevo',
        avatarColor: 'bg-emerald-600',
        notes: notes || undefined,
      },
      items: selectedItems,
      status: 'registrado',
      payment: {
        method: paymentMethod,
        status: 'Pendiente',
        referenceCode: `PEND-${Math.floor(100000 + Math.random() * 900000)}`,
      },
      subtotal,
      deliveryFee,
      total,
      internalNotes: notes ? `Ingresado desde WhatsApp: ${notes}` : 'Pedido registrado manualmente.',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'customer',
          text: notes || `Hola! Quisiera ordenar estos artículos con entrega ${deliveryType}.`,
          time: timeString,
          status: 'read',
        },
      ],
      timeline: [
        {
          status: 'registrado',
          timestamp: timeString,
          operator: 'Operador en Turno',
          note: 'Ingreso rápido de pedido por WhatsApp.',
        },
      ],
    };

    onCreateOrder(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col text-left">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0b1c30]">Registrar Pedido de WhatsApp</h2>
            <p className="text-xs text-slate-500">Triage rápido de conversación directa</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
              Nombre del Cliente *
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ej: Laura Gómez"
              className="w-full h-12 px-3.5 rounded-lg border border-[#CBD5E1] text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00685d]"
            />
          </div>

          {/* Customer Phone */}
          <div>
            <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
              Teléfono WhatsApp (formato +34...) *
            </label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+34 600 000 000"
              className="w-full h-12 px-3.5 rounded-lg border border-[#CBD5E1] text-base text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#00685d]"
            />
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
              Dirección de Entrega
            </label>
            <input
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="Ej: Calle Gran Vía 28, 4º Ext"
              className="w-full h-12 px-3.5 rounded-lg border border-[#CBD5E1] text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00685d]"
            />
          </div>

          {/* Catalog Steppers */}
          <div>
            <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-2">
              Seleccionar Artículos del Catálogo *
            </label>
            <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
              {CATALOG_PRODUCTS.map((prod) => {
                const count = quantities[prod.id] || 0;
                return (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-md object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{prod.name}</p>
                        <p className="text-[11px] text-slate-500 tabular-nums">€{prod.price.toFixed(2)} c/u</p>
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateQuantity(prod.id, -1)}
                        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold tabular-nums">{count}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(prod.id, 1)}
                        className="w-8 h-8 rounded-lg bg-[#00685d] text-white flex items-center justify-center hover:bg-[#005047] active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery & Payment Methods in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                Tipo de Envío
              </label>
              <select
                value={deliveryType}
                onChange={(e) => setDeliveryType(e.target.value as any)}
                className="w-full h-12 px-3 rounded-lg border border-[#CBD5E1] text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#00685d]"
              >
                <option value="Envío Express">Envío Express (+€2.50)</option>
                <option value="Envío Estándar">Envío Estándar (€0.00)</option>
                <option value="Retiro en Tienda">Retiro en Tienda (€0.00)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                Método de Pago
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full h-12 px-3 rounded-lg border border-[#CBD5E1] text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#00685d]"
              >
                <option value="Bizum / Móvil">Bizum / Móvil</option>
                <option value="Transferencia SPEI">Transferencia Bancaria</option>
                <option value="Efectivo contra entrega">Efectivo contra entrega</option>
                <option value="Enlace de Pago">Enlace de Pago (Stripe)</option>
              </select>
            </div>
          </div>

          {/* Initial Customer Message Snippet */}
          <div>
            <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
              Mensaje del cliente en WhatsApp / Notas
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Copiar el texto exacto que envió el cliente..."
              className="w-full p-3 rounded-lg border border-[#CBD5E1] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00685d]"
            />
          </div>

          {/* Live Order Summary Footer */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-600 font-semibold">Total a cobrar:</span>
            <span className="text-lg font-bold text-[#00685d] tabular-nums">€{total.toFixed(2)}</span>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={selectedItems.length === 0}
              className="w-full h-12 bg-[#00685d] hover:bg-[#005047] disabled:opacity-50 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>Crear Pedido & Registrar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
