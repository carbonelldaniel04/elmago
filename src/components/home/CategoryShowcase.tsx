import React from 'react';
import { useStore } from '../../context/StoreContext';
import { BrandStar } from '../common/BrandStar';
import { ArrowUpRight } from 'lucide-react';

export const CategoryShowcase: React.FC = () => {
  const { categories, setSelectedCategoryFilter, setActiveView } = useStore();

  const handleCategorySelect = (slug: string) => {
    setSelectedCategoryFilter(slug);
    setActiveView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-[#1C1C1E] relative overflow-hidden border-b border-[#343438]">
      {/* Decorative stars and industrial lighting accents in brand violet */}
      <div className="absolute top-10 right-10 opacity-20 pointer-events-none">
        <BrandStar size={36} color="#6C2BD9" />
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
              <span>Líneas de Especialización</span>
              <span className="text-stone-400">·</span>
              <span className="font-mago text-[#6C2BD9] normal-case text-sm">El Mago</span>
            </div>
            <h2 className="font-condensed text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight">
              CATEGORÍAS DE TRABAJO
            </h2>
          </div>
          <p className="text-sm text-[#E5E5E3] max-w-md mt-2 md:mt-0 leading-relaxed">
            Prendas y calzados seleccionados bajo estándares rigurosos de durabilidad y seguridad en planta.
          </p>
        </div>

        {/* 8 Categories Grid with White Box Cards against Dark Graphite Background */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategorySelect(category.slug)}
              className="group relative rounded-xl overflow-hidden bg-white border border-[#E5E5E3] hover:border-[#6C2BD9] cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Media Area */}
              <div className="relative aspect-[4/3] bg-[#F5F5F4] overflow-hidden">
                <img
                  src={category.image || '/src/assets/images/category_ropa_trabajo_1790892078708.jpg'}
                  alt={category.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-[0.98]"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== '/src/assets/images/category_ropa_trabajo_1790892078708.jpg') {
                      target.src = '/src/assets/images/category_ropa_trabajo_1790892078708.jpg';
                    }
                  }}
                />

                {/* Subtle corner badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#1C1C1E]/85 border border-[#343438] text-white text-[10px] font-mono uppercase tracking-wider font-semibold">
                    <BrandStar size={9} color="#6C2BD9" />
                    <span>Línea Oficial</span>
                  </span>
                </div>
              </div>

              {/* White Card Body with Dark Graphite Typography */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white text-[#1C1C1E]">
                <div>
                  <span className="text-[11px] font-mono text-[#6C2BD9] font-bold uppercase tracking-wider block mb-1">
                    Catálogo Laboral
                  </span>
                  <h3 className="font-condensed text-xl sm:text-2xl font-bold uppercase text-[#1C1C1E] tracking-wide group-hover:text-[#6C2BD9] transition-colors leading-tight mb-2">
                    {category.name}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 mb-4 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-condensed text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>VER PRODUCTOS</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
