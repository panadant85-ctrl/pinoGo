/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { INITIAL_ORDERS } from './data/mockOrders';
import { Order, OrderStatus } from './types';
import { Header } from './components/Header';
import { MetricsBar } from './components/MetricsBar';
import { OrderFilters } from './components/OrderFilters';
import { OrderCard } from './components/OrderCard';
import { OrderDetail } from './components/OrderDetail';
import { StickyBottomSheet } from './components/StickyBottomSheet';
import { QuickReplyModal } from './components/QuickReplyModal';
import { NewOrderModal } from './components/NewOrderModal';
import { Filter, CheckCircle2, ShoppingBag } from 'lucide-react';

export default function App() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(INITIAL_ORDERS[0]?.id || '');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'responsive' | 'mobile-preview'>('responsive');

  // Modals and Drawers
  const [isNewOrderOpen, setIsNewOrderOpen] = useState<boolean>(false);
  const [quickReplyOrder, setQuickReplyOrder] = useState<Order | null>(null);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Status transition handler
  const handleUpdateStatus = (orderId: string, nextStatus: OrderStatus, note?: string) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updatedTimeline = [
          {
            status: nextStatus,
            timestamp: timeFormatted,
            operator: 'Operador en Turno',
            note: note || `Estado actualizado a ${nextStatus}`,
          },
          ...order.timeline,
        ];

        // Payment status updates logically
        let updatedPayment = { ...order.payment };
        if (nextStatus === 'aprobado' || nextStatus === 'comprado' || nextStatus === 'entregado') {
          updatedPayment.status = 'Verificado';
          updatedPayment.verifiedAt = timeFormatted;
        }

        return {
          ...order,
          status: nextStatus,
          payment: updatedPayment,
          timeline: updatedTimeline,
        };
      })
    );

    showToast(`Pedido actualizado a ${nextStatus.toUpperCase()}`);
  };

  // Add message to chat history
  const handleSendMessage = (orderId: string, text: string) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const newMsg = {
          id: `msg-${Date.now()}`,
          sender: 'operator' as const,
          text,
          time: timeFormatted,
          status: 'sent' as const,
        };

        return {
          ...order,
          messages: [...order.messages, newMsg],
        };
      })
    );

    showToast('Mensaje registrado en WhatsApp');
  };

  // Add internal operator note
  const handleAddInternalNote = (orderId: string, note: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          internalNotes: order.internalNotes ? `${order.internalNotes}\n• ${note}` : note,
        };
      })
    );
    showToast('Nota interna guardada');
  };

  // Rapid order intake
  const handleCreateOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrderId(newOrder.id);
    setActiveFilter('all');
    showToast(`¡Pedido ${newOrder.orderNumber} registrado!`);
  };

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0] || null;

  // Filter and search logic
  const filteredOrders = orders.filter((order) => {
    // Search query filter
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchName = order.customer.name.toLowerCase().includes(q);
      const matchPhone = order.customer.phone.includes(q);
      const matchOrderNum = order.orderNumber.toLowerCase().includes(q);
      const matchItem = order.items.some((i) => i.name.toLowerCase().includes(q));
      if (!matchName && !matchPhone && !matchOrderNum && !matchItem) {
        return false;
      }
    }

    // Status filter
    if (activeFilter === 'all') return true;
    if (activeFilter === 'urgent') return order.isUrgent && order.status === 'registrado';
    return order.status === activeFilter;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0b1c30] flex flex-col font-sans antialiased selection:bg-[#00685d]/10 selection:text-[#00685d]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#0b1c30] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Contract */}
      <Header
        onNewOrder={() => setIsNewOrderOpen(true)}
        viewMode={viewMode}
        onToggleViewMode={() =>
          setViewMode(viewMode === 'responsive' ? 'mobile-preview' : 'responsive')
        }
        activeFilter={activeFilter}
        onSelectNav={(nav) => setActiveFilter(nav)}
      />

      {/* Operational Metrics Bar */}
      <MetricsBar orders={orders} />

      {/* Filter and Search Bar */}
      <OrderFilters
        orders={orders}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Workspace Frame */}
      <main
        className={`flex-1 w-full mx-auto p-4 md:p-6 transition-all ${
          viewMode === 'mobile-preview'
            ? 'max-w-md bg-slate-100 my-4 p-3 rounded-3xl shadow-2xl border-4 border-slate-300 min-h-[780px]'
            : 'max-w-7xl'
        }`}
      >
        {/* Tablet / Desktop Split Layout */}
        <div
          className={`grid gap-5 items-start ${
            viewMode === 'mobile-preview'
              ? 'grid-cols-1'
              : 'grid-cols-1 lg:grid-cols-12'
          }`}
        >
          {/* Order Cards Feed Column */}
          <div
            className={`space-y-3.5 ${
              viewMode === 'mobile-preview' ? 'w-full' : 'lg:col-span-5'
            } pb-28 lg:pb-6`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
              <span>{filteredOrders.length} pedidos encontrados</span>
              <span>Orden cronológico</span>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-[#E2E8F0] shadow-xs">
                <Filter className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-800">
                  No hay pedidos con el filtro actual
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Intenta cambiar el estado o limpiar el buscador.
                </p>
                <button
                  onClick={() => {
                    setActiveFilter('all');
                    setSearchQuery('');
                  }}
                  className="mt-3 text-xs font-semibold text-[#00685d] hover:underline"
                >
                  Ver todos los pedidos
                </button>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isSelected={selectedOrder?.id === order.id}
                  onSelect={(ord) => {
                    setSelectedOrderId(ord.id);
                    setIsMobileDetailOpen(true);
                  }}
                  onOpenWhatsAppReply={(ord, e) => {
                    e.stopPropagation();
                    setQuickReplyOrder(ord);
                  }}
                />
              ))
            )}
          </div>

          {/* Desktop Right Panel (Sticky Detail & WhatsApp Conversation) */}
          {viewMode !== 'mobile-preview' && (
            <div className="hidden lg:block lg:col-span-7 sticky top-36 h-[calc(100vh-10.5rem)] min-h-[640px]">
              {selectedOrder ? (
                <OrderDetail
                  order={selectedOrder}
                  onClose={() => {}}
                  onUpdateStatus={handleUpdateStatus}
                  onSendMessage={handleSendMessage}
                  onAddInternalNote={handleAddInternalNote}
                />
              ) : (
                <div className="bg-white rounded-2xl border border-[#E2E8F0] h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">
                    Selecciona un pedido del panel izquierdo
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Mobile Sticky Bottom Sheet (Thumb Zone Transition Bar) */}
      {(viewMode === 'mobile-preview' || (typeof window !== 'undefined' && window.innerWidth < 1024)) && (
        <StickyBottomSheet
          order={selectedOrder}
          onUpdateStatus={handleUpdateStatus}
          onOpenWhatsAppReply={(ord) => setQuickReplyOrder(ord)}
          onCloseSheet={() => setIsMobileDetailOpen(false)}
        />
      )}

      {/* Mobile Full-Bleed Order Detail Drawer */}
      {isMobileDetailOpen && selectedOrder && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in">
          <div className="bg-white w-full h-[92vh] rounded-t-3xl overflow-hidden shadow-2xl flex flex-col">
            <OrderDetail
              order={selectedOrder}
              onClose={() => setIsMobileDetailOpen(false)}
              onUpdateStatus={handleUpdateStatus}
              onSendMessage={handleSendMessage}
              onAddInternalNote={handleAddInternalNote}
            />
          </div>
        </div>
      )}

      {/* Rapid Intake Modal (+ Nuevo Pedido) */}
      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        onCreateOrder={handleCreateOrder}
      />

      {/* Quick WhatsApp Reply Modal */}
      <QuickReplyModal
        order={quickReplyOrder}
        isOpen={!!quickReplyOrder}
        onClose={() => setQuickReplyOrder(null)}
        onSendMessage={(orderId, text) => {
          handleSendMessage(orderId, text);
        }}
      />
    </div>
  );
}
