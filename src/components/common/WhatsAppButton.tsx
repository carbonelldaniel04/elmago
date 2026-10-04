import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageCircle, X, ExternalLink, Building2, ShoppingBag } from 'lucide-react';
import { BrandStar } from './BrandStar';

export const WhatsAppButton: React.FC = () => {
  const { settings, getGeneralWhatsAppUrl, setIsB2BModalOpen, setIsCartOpen, cartCount } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Quick Action Bubble Popup */}
      {isOpen && (
        <div className="mb-3 w-72 bg-[#1C1C1E] border border-[#343438] rounded-2xl shadow-2xl p-4 text-xs space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-[#343438]">
            <div className="flex items-center gap-2 text-white font-bold font-condensed text-sm uppercase">
              <BrandStar size={12} color="#6C2BD9" />
              <span>Tienda El Mago Online</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white p-0.5"
            >
              <X size={14} />
            </button>
          </div>

          <p className="text-[#E5E5E3] text-[11px] leading-relaxed">
            Hola 👋 ¿Cómo podemos ayudarte hoy con tu ropa o calzado de trabajo?
          </p>

          <div className="space-y-1.5">
            <a
              href={getGeneralWhatsAppUrl('Hola Tienda El Mago, quisiera hacer una consulta sobre indumentaria de trabajo.')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-2.5 rounded-lg bg-[#25d366]/15 hover:bg-[#25d366]/25 border border-[#25d366]/30 text-[#25d366] font-semibold flex items-center justify-between transition-colors"
            >
              <span>Consultar Asesor Comercial</span>
              <ExternalLink size={13} />
            </a>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setIsB2BModalOpen(true);
              }}
              className="w-full p-2 rounded-lg bg-[#252528] hover:bg-[#343438] border border-[#343438] text-[#E5E5E3] hover:text-white text-left flex items-center gap-2 transition-colors"
            >
              <Building2 size={14} className="text-[#6C2BD9]" />
              <span>Cotización Mayorista / Empresas</span>
            </button>

            {cartCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full p-2 rounded-lg bg-[#252528] hover:bg-[#343438] border border-[#343438] text-[#E5E5E3] hover:text-white text-left flex items-center gap-2 transition-colors"
              >
                <ShoppingBag size={14} className="text-[#6C2BD9]" />
                <span>Consultar por mi Carrito ({cartCount})</span>
              </button>
            )}
          </div>

          <div className="pt-1 text-[10px] font-mono text-stone-400 text-center">
            Respondemos en el acto · Número: {settings.whatsappPhone}
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25d366] hover:bg-[#22bf5b] text-black shadow-2xl hover:shadow-[#25d366]/30 hover:scale-105 transition-all duration-200 focus:outline-none"
        title="Contactar por WhatsApp"
        aria-label="Abrir WhatsApp"
      >
        <MessageCircle size={28} className="text-black" />
        <span className="absolute -top-1 -left-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
        </span>
      </button>
    </div>
  );
};
