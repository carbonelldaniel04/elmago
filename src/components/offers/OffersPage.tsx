import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';
import { BrandStar } from '../common/BrandStar';
import { Sparkles, Clock, ShieldCheck } from 'lucide-react';

export const OffersPage: React.FC = () => {
  const { products, offers, setActiveView, setSelectedCategoryFilter } = useStore();

  const offerProducts = products.filter((p) => p.isOffer && p.isActive);

  return (
    <div className="bg-[#1C1C1E] min-h-screen py-12 border-b border-[#343438]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Banner for Offers in Graphite & Brand Violet */}
        <div className="p-8 sm:p-12 rounded-2xl bg-[#252528] border border-[#343438] shadow-xl relative overflow-hidden mb-12">
          {/* Subtle decorative stars */}
          <div className="absolute top-4 right-6 opacity-20 pointer-events-none hidden sm:block">
            <BrandStar size={80} color="#6C2BD9" />
          </div>
          <div className="absolute bottom-4 left-1/3 opacity-10 pointer-events-none hidden sm:block">
            <BrandStar size={36} color="#6C2BD9" />
          </div>

          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6C2BD9] text-white font-condensed text-xs font-bold uppercase tracking-wider shadow-md">
              <Sparkles size={14} className="text-white" />
              <span>{offers.discountBadge}</span>
            </div>

            <h1 className="font-condensed text-4xl sm:text-6xl font-black uppercase text-white tracking-tight leading-none">
              {offers.title}
            </h1>

            <p className="text-base sm:text-lg text-[#E5E5E3] leading-relaxed">
              {offers.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-[#E5E5E3]">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C1C1E] border border-[#343438]">
                <Clock size={14} className="text-[#6C2BD9]" />
                <span>Válido hasta: {offers.validUntil}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C1C1E] border border-[#343438]">
                <ShieldCheck size={14} className="text-[#6C2BD9]" />
                <span>Garantía Oficial de Fábrica</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section title & count */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#343438]">
          <div className="flex items-center gap-2">
            <BrandStar size={16} color="#6C2BD9" />
            <h2 className="font-condensed text-2xl sm:text-3xl font-bold uppercase text-white tracking-wide">
              Prendas y Calzado en Promoción
            </h2>
          </div>
          <span className="text-xs font-mono text-[#E5E5E3]">
            {offerProducts.length} oportunidades activas
          </span>
        </div>

        {/* Offer products grid */}
        {offerProducts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#252528] border border-[#343438] space-y-3">
            <p className="text-white font-condensed text-xl uppercase">No hay ofertas activas en este momento</p>
            <p className="text-xs text-[#E5E5E3]">Consultá nuestro catálogo regular con los mejores precios directos.</p>
            <button
              onClick={() => {
                setSelectedCategoryFilter(null);
                setActiveView('catalog');
              }}
              className="px-5 py-2.5 rounded-lg bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-condensed font-bold text-sm uppercase shadow-md"
            >
              Ver Catálogo Completo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {offerProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} variant="offer" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
