import React from 'react';
import { Search, X, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderFiltersProps {
  orders: Order[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  orders,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}) => {
  const counts: Record<string, number> = {
    all: orders.length,
    registrado: orders.filter((o) => o.status === 'registrado').length,
    aprobado: orders.filter((o) => o.status === 'aprobado').length,
    comprado: orders.filter((o) => o.status === 'comprado').length,
    cancelado: orders.filter((o) => o.status === 'cancelado').length,
    urgent: orders.filter((o) => o.isUrgent && o.status === 'registrado').length,
  };

  const filterTabs: { id: string; label: string; count: number; badgeColor?: string }[] = [
    { id: 'all', label: 'Todos', count: counts.all },
    { id: 'registrado', label: 'Registrados', count: counts.registrado, badgeColor: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]' },
    { id: 'aprobado', label: 'Aprobados', count: counts.aprobado, badgeColor: 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]' },
    { id: 'comprado', label: 'Comprados', count: counts.comprado, badgeColor: 'bg-[#E0E7FF] text-[#3730A3] border-[#C7D2FE]' },
    { id: 'cancelado', label: 'Cancelados', count: counts.cancelado, badgeColor: 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]' },
  ];

  return (
    <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] px-4 md:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Search input with 48px height touch-optimized & 16px font to prevent iOS zoom */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por cliente, teléfono o #pedido..."
            className="w-full h-11 pl-10 pr-10 rounded-lg border border-slate-300 bg-slate-50/60 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00685d] focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Scrollable Single-Tap Filter Chips (Thumb-Zone Friendly) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onFilterChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border min-h-[40px] active:scale-[0.98] ${
                  isActive
                    ? 'bg-[#00685d] text-white border-[#00685d] shadow-xs'
                    : 'bg-slate-100/80 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : tab.badgeColor
                      ? `${tab.badgeColor} border`
                      : 'bg-white text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}

          {/* Urgent Filter Button */}
          {counts.urgent > 0 && (
            <button
              onClick={() => onFilterChange(activeFilter === 'urgent' ? 'all' : 'urgent')}
              className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border min-h-[40px] ${
                activeFilter === 'urgent'
                  ? 'bg-rose-700 text-white border-rose-700'
                  : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Urgentes ({counts.urgent})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
