import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { BrandStar } from './BrandStar';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, setSelectedProduct, setActiveView, setSearchQuery } = useStore();
  const [term, setTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setTerm('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filtered = term.trim()
    ? products.filter(
        (p) =>
          p.isActive &&
          (p.name.toLowerCase().includes(term.toLowerCase()) ||
            p.brand.toLowerCase().includes(term.toLowerCase()) ||
            p.categoryName.toLowerCase().includes(term.toLowerCase()) ||
            p.material.toLowerCase().includes(term.toLowerCase()))
      )
    : [];

  const handleSelectProduct = (prod: (typeof products)[0]) => {
    setSelectedProduct(prod);
    setIsSearchOpen(false);
  };

  const handleViewAllResults = () => {
    setSearchQuery(term);
    setActiveView('catalog');
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#1C1C1E] border border-[#343438] rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Bar Input */}
        <div className="p-4 bg-[#141416] border-b border-[#343438] flex items-center gap-3">
          <Search size={22} className="text-[#6C2BD9] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar por prenda, botín, grafa, marca (Ombú, Pampero, El Mago)..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && term.trim()) {
                handleViewAllResults();
              }
            }}
            className="w-full bg-transparent text-white placeholder-stone-400 text-base focus:outline-none"
          />
          {term && (
            <button
              onClick={() => setTerm('')}
              className="text-stone-400 hover:text-white p-1"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2.5 py-1 rounded bg-[#252528] text-[#E5E5E3] hover:text-white text-xs font-mono border border-[#343438]"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {term.trim() === '' ? (
            <div className="py-8 text-center space-y-3">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#252528] text-[#6C2BD9] border border-[#343438]">
                <BrandStar size={24} color="#6C2BD9" />
              </div>
              <p className="text-sm text-[#E5E5E3] font-medium">
                Buscá entre más de 80 artículos laborales especializados
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <span className="text-xs text-stone-400">Sugerencias:</span>
                {['Botín Ombú', 'Pantalón Cargo', 'Grafa 70', 'Campera Térmica', 'Alta Visibilidad'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setTerm(tag)}
                      className="px-2.5 py-1 rounded bg-[#252528] hover:bg-[#343438] text-xs text-[#E5E5E3] transition-colors border border-[#343438]"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-stone-400 space-y-2">
              <p className="text-sm">No encontramos productos que coincidan con “{term}”.</p>
              <p className="text-xs text-stone-500">Intentá con términos más generales como "pantalón", "botín", "camisa" o consultanos por WhatsApp.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-stone-400 px-2 pb-2">
                <span>{filtered.length} productos encontrados</span>
                <button
                  onClick={handleViewAllResults}
                  className="text-[#6C2BD9] hover:underline font-medium inline-flex items-center gap-1"
                >
                  <span>Ver todos en el catálogo</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              {filtered.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => handleSelectProduct(prod)}
                  className="flex items-center gap-4 p-3 rounded-xl bg-[#252528] hover:bg-[#343438] border border-transparent hover:border-[#6C2BD9] transition-colors cursor-pointer group"
                >
                  <img
                    src={
                      (prod.images && prod.images[0] && prod.images[0].trim()) ||
                      '/src/assets/images/category_ropa_trabajo_1790892078708.jpg'
                    }
                    alt={prod.name}
                    className="w-16 h-16 rounded-lg object-cover bg-black/40 shrink-0"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== '/src/assets/images/category_ropa_trabajo_1790892078708.jpg') {
                        target.src = '/src/assets/images/category_ropa_trabajo_1790892078708.jpg';
                      }
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-stone-400">
                      <span className="text-[#6C2BD9] font-bold">{prod.brand}</span>
                      <span>·</span>
                      <span>{prod.categoryName}</span>
                      {prod.isOffer && (
                        <span className="text-[#6C2BD9] font-bold flex items-center gap-1">
                          <Sparkles size={10} className="text-[#6C2BD9]" /> OFERTA
                        </span>
                      )}
                    </div>
                    <h4 className="font-condensed text-base font-bold uppercase text-white truncate group-hover:text-[#6C2BD9] transition-colors">
                      {prod.name}
                    </h4>
                    <p className="text-xs text-[#E5E5E3] truncate">{prod.material}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-condensed text-lg font-bold text-[#6C2BD9] tabular-nums block">
                      ${prod.price.toLocaleString('es-AR')}
                    </span>
                    {prod.originalPrice && (
                      <span className="text-xs font-mono text-stone-400 line-through tabular-nums block">
                        ${prod.originalPrice.toLocaleString('es-AR')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
