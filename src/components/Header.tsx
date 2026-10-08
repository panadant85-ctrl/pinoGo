import React from 'react';
import { Plus, MessageSquare, Smartphone, Monitor } from 'lucide-react';

interface HeaderProps {
  onNewOrder: () => void;
  viewMode: 'responsive' | 'mobile-preview';
  onToggleViewMode: () => void;
  activeFilter: string;
  onSelectNav: (nav: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewOrder,
  viewMode,
  onToggleViewMode,
  activeFilter,
  onSelectNav,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] px-4 md:px-6 h-16 transition-colors">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#00685d] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            <span className="tracking-tight">D</span>
          </div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onSelectNav('all');
            }}
            className="text-lg font-bold tracking-tight text-[#0b1c30] whitespace-nowrap hover:text-[#00685d] transition-colors"
          >
            Direct Commerce Hub
          </a>
        </div>

        {/* Zone 2: Navigation Links (Clean text links) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectNav('all')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeFilter === 'all'
                ? 'text-[#00685d] border-[#00685d] font-semibold'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            Pedidos
          </button>
          <button
            onClick={() => onSelectNav('registrado')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeFilter === 'registrado'
                ? 'text-[#00685d] border-[#00685d] font-semibold'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            Por Triar
          </button>
          <button
            onClick={() => onSelectNav('aprobado')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeFilter === 'aprobado'
                ? 'text-[#00685d] border-[#00685d] font-semibold'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            En Despacho
          </button>
          <button
            onClick={() => onSelectNav('urgent')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeFilter === 'urgent'
                ? 'text-[#991B1B] border-[#991B1B] font-semibold'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            Urgentes ⚡
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Mobile Preview Mode Toggle (Great for testing thumb-zone ergonomics) */}
          <button
            type="button"
            onClick={onToggleViewMode}
            title={viewMode === 'mobile-preview' ? 'Ver ancho completo' : 'Simular móvil (390px)'}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors min-h-[40px]"
          >
            {viewMode === 'mobile-preview' ? (
              <>
                <Monitor className="w-4 h-4 text-slate-600" />
                <span className="whitespace-nowrap">Pantalla Completa</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 text-slate-600" />
                <span className="whitespace-nowrap">Vista Móvil</span>
              </>
            )}
          </button>

          {/* Quick WhatsApp Web shortcut */}
          <a
            href="https://web.whatsapp.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir WhatsApp Web Oficial"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#006d2f] bg-[#5dfd8a]/20 hover:bg-[#5dfd8a]/35 rounded-lg border border-[#5dfd8a]/40 transition-colors min-h-[44px]"
          >
            <MessageSquare className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
            <span className="whitespace-nowrap">WhatsApp Web</span>
          </a>

          {/* Primary CTA: + Nuevo Pedido */}
          <button
            onClick={onNewOrder}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 h-11 sm:h-12 bg-[#00685d] hover:bg-[#005047] active:scale-[0.98] text-white rounded-lg font-semibold text-sm shadow-sm transition-all whitespace-nowrap min-w-[130px]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nuevo Pedido</span>
          </button>
        </div>
      </div>
    </header>
  );
};
