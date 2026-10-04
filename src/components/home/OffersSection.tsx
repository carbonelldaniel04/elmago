import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';
import { BrandStar } from '../common/BrandStar';
import { Sparkles, Tag, ArrowRight } from 'lucide-react';

export const OffersSection: React.FC = () => {
  const { products, offers, setActiveView, setSelectedCategoryFilter } = useStore();

  if (!offers.isActive) return null;

  // Filter all products on offer
  const offerProducts = products.filter((p) => p.isOffer && p.isActive);

  if (offerProducts.length === 0) return null;

  return (
    <section id="ofertas-section" className="py-20 bg-[#1C1C1E] relative overflow-hidden border-y border-[#343438]">
      {/* Decorative stars and industrial lighting accents in brand violet */}
      <div className="absolute top-12 left-10 opacity-20 pointer-events-none">
        <BrandStar size={28} color="#6C2BD9" />
      </div>
      <div className="absolute bottom-12 right-12 opacity-25 pointer-events-none">
        <BrandStar size={36} color="#6C2BD9" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Banner callout in dark graphite #252528 */}
        <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-[#252528] border border-[#343438] shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C2BD9] text-white font-condensed text-xs font-bold tracking-widest uppercase">
                <Sparkles size={14} className="text-white" />
                <span>{offers.discountBadge}</span>
              </div>
              <h2 className="font-condensed text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                {offers.title}
              </h2>
              <p className="text-sm sm:text-base text-[#E5E5E3] max-w-2xl leading-relaxed">
                {offers.subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="px-4 py-2 rounded-lg bg-[#1C1C1E] border border-[#343438] text-xs font-mono text-[#E5E5E3]">
                <span>Vigencia:</span> <span className="text-white font-bold">{offers.validUntil}</span>
              </div>
              <button
                onClick={() => {
                  setSelectedCategoryFilter(null);
                  setActiveView('catalog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-lg bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-condensed text-base font-bold uppercase tracking-wider transition-colors flex items-center gap-2 whitespace-nowrap shadow-md"
              >
                <span>VER CATÁLOGO COMPLETO</span>
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* Offer Products Grid with distinctive styling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offerProducts.map((product) => (
            <ProductCard key={product.id} product={product} variant="offer" />
          ))}
        </div>
      </div>
    </section>
  );
};
