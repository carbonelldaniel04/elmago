import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';
import { BrandStar } from '../common/BrandStar';
import { ArrowRight } from 'lucide-react';

export const FeaturedProducts: React.FC = () => {
  const { products, setActiveView, setSelectedCategoryFilter } = useStore();

  const featured = products.filter((p) => p.isFeatured && p.isActive).slice(0, 4);

  const handleViewAll = () => {
    setSelectedCategoryFilter(null);
    setActiveView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-[#1C1C1E] relative overflow-hidden border-b border-[#343438]">
      {/* Decorative stars in brand violet like the offers section */}
      <div className="absolute top-10 right-10 opacity-20 pointer-events-none">
        <BrandStar size={32} color="#6C2BD9" />
      </div>
      <div className="absolute bottom-8 left-8 opacity-20 pointer-events-none">
        <BrandStar size={24} color="#6C2BD9" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-[#343438]">
          <div>
            <div className="flex items-center gap-2 mb-2 text-[#6C2BD9] text-xs font-bold uppercase tracking-widest">
              <BrandStar size={13} color="#6C2BD9" />
              <span>Selección de Máxima Resistencia</span>
              <span className="text-stone-400">·</span>
              <span className="font-mago text-[#6C2BD9] normal-case text-sm">El Mago</span>
            </div>
            <h2 className="font-condensed text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight">
              PRODUCTOS DESTACADOS
            </h2>
          </div>

          <button
            onClick={handleViewAll}
            className="mt-4 md:mt-0 px-5 py-2.5 rounded-lg bg-[#252528] hover:bg-[#6C2BD9] text-white text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2 self-start md:self-auto border border-[#343438] hover:border-[#6C2BD9] shadow-sm"
          >
            <span>VER CATÁLOGO COMPLETO</span>
            <ArrowRight size={15} className="text-[#6C2BD9]" />
          </button>
        </div>

        {/* Product Grid - with white product cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
