import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';
import { BrandStar } from '../common/BrandStar';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export const CatalogView: React.FC = () => {
  const {
    products,
    categories,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
  } = useStore();

  // Local filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'recent' | 'sales'>('recent');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract unique brands, sizes, colors for filter options
  const allBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    products.forEach((p) => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return Array.from(brandsSet);
  }, [products]);

  const allSizes = useMemo(() => {
    const sizesSet = new Set<string>();
    products.forEach((p) => {
      p.sizes.forEach((s) => sizesSet.add(s));
    });
    return Array.from(sizesSet);
  }, [products]);

  const allColors = useMemo(() => {
    const colorsMap = new Map<string, string>();
    products.forEach((p) => {
      p.colors.forEach((c) => {
        colorsMap.set(c.name, c.hex);
      });
    });
    return Array.from(colorsMap.keys());
  }, [products]);

  // Comprehensive Filtering
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Must be active
      if (!product.isActive) return false;

      // Category filter
      if (selectedCategoryFilter && product.categoryId !== selectedCategoryFilter) {
        return false;
      }

      // Keyword search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesDesc) return false;
      }

      // Brand filter
      if (selectedBrand !== 'all' && product.brand !== selectedBrand) {
        return false;
      }

      // Size filter
      if (selectedSize !== 'all' && !product.sizes.includes(selectedSize)) {
        return false;
      }

      // Color filter
      if (selectedColor !== 'all' && !product.colors.some((c) => c.name === selectedColor)) {
        return false;
      }

      // Offers only
      if (onlyOffers && !product.isOffer) {
        return false;
      }

      // In stock only
      if (onlyInStock && !product.inStock) {
        return false;
      }

      // Max price filter
      if (product.price > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'sales') return b.salesCount - a.salesCount;
      return 0; // 'recent' as defined in initial list
    });
  }, [
    products,
    selectedCategoryFilter,
    searchQuery,
    selectedBrand,
    selectedSize,
    selectedColor,
    onlyOffers,
    onlyInStock,
    maxPrice,
    sortBy,
  ]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategoryFilter(null);
    setSelectedBrand('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setOnlyOffers(false);
    setOnlyInStock(false);
    setMaxPrice(100000);
    setSortBy('recent');
  };

  const activeCategory = categories.find((c) => c.slug === selectedCategoryFilter);

  return (
    <div className="bg-[#1C1C1E] min-h-screen py-10 border-b border-[#343438] text-[#E5E5E3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title & Subtitle */}
        <div className="mb-8 pb-4 border-b border-[#343438] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-xs font-mono uppercase tracking-widest text-[#6C2BD9]">
              <BrandStar size={12} color="#6C2BD9" />
              <span>Catálogo Técnico de Indumentaria & Calzado</span>
            </div>
            <h1 className="font-condensed text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
              {activeCategory ? activeCategory.name : 'TODOS LOS PRODUCTOS'}
            </h1>
            {activeCategory && (
              <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl">
                {activeCategory.description}
              </p>
            )}
          </div>

          {/* Quick Stats & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-stone-400">
              Mostrando <strong className="text-white">{filteredProducts.length}</strong> artículos
            </span>

            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-3 py-2 rounded-lg bg-[#252528] border border-[#343438] text-xs font-bold text-white flex items-center gap-1.5 shadow-sm"
            >
              <SlidersHorizontal size={14} className="text-[#6C2BD9]" />
              <span>Filtros</span>
            </button>
          </div>
        </div>

        {/* Category Pill bar (interactive segmented controls) with violet accents */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <button
            onClick={() => setSelectedCategoryFilter(null)}
            className={`px-4 py-2 rounded-lg text-xs font-condensed uppercase tracking-wider font-bold whitespace-nowrap transition-colors border ${
              selectedCategoryFilter === null
                ? 'bg-[#6C2BD9] hover:bg-[#7C3AED] text-white border-[#6C2BD9] shadow-md'
                : 'bg-[#252528] text-[#E5E5E3] hover:text-white hover:border-[#6C2BD9] border-[#343438]'
            }`}
          >
            Todas las Categorías
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.slug)}
              className={`px-4 py-2 rounded-lg text-xs font-condensed uppercase tracking-wider font-bold whitespace-nowrap transition-colors border ${
                selectedCategoryFilter === cat.slug
                  ? 'bg-[#6C2BD9] hover:bg-[#7C3AED] text-white border-[#6C2BD9] shadow-md'
                  : 'bg-[#252528] text-[#E5E5E3] hover:text-white hover:border-[#6C2BD9] border-[#343438]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* 2-Column Layout: Sidebar Filters Left + Product Grid Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Filters */}
          <aside
            className={`lg:col-span-3 space-y-6 ${
              mobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="p-5 rounded-2xl bg-[#252528] border border-[#343438] shadow-xl space-y-6">
              {/* Header with clear filters */}
              <div className="flex items-center justify-between pb-3 border-b border-[#343438]">
                <span className="font-condensed text-base font-bold uppercase text-white flex items-center gap-2">
                  <Filter size={16} className="text-[#6C2BD9]" />
                  Filtros de Búsqueda
                </span>
                <button
                  onClick={resetAllFilters}
                  className="text-[11px] font-mono text-[#6C2BD9] hover:text-[#7C3AED] flex items-center gap-1 transition-colors"
                  title="Restablecer filtros"
                >
                  <RotateCcw size={12} />
                  <span>Limpiar</span>
                </button>
              </div>

              {/* Keyword Search Input */}
              <div>
                <label className="block text-[11px] font-mono text-[#E5E5E3] uppercase mb-1.5 font-semibold">
                  Búsqueda por texto
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ej. Grafa, botín..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#1C1C1E] border border-[#343438] text-xs text-white placeholder-stone-500 focus:border-[#6C2BD9] focus:outline-none"
                  />
                  <Search size={14} className="absolute left-2.5 top-2.5 text-[#6C2BD9]" />
                </div>
              </div>

              {/* Sorting Order */}
              <div>
                <label className="block text-[11px] font-mono text-[#E5E5E3] uppercase mb-1.5 font-semibold">
                  Ordenar por
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1C1C1E] border border-[#343438] text-xs text-white focus:border-[#6C2BD9] focus:outline-none"
                >
                  <option value="recent">Más recientes</option>
                  <option value="price-asc">Precio menor a mayor</option>
                  <option value="price-desc">Precio mayor a menor</option>
                  <option value="sales">Más vendidos</option>
                </select>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-[11px] font-mono text-[#E5E5E3] uppercase mb-1.5 font-semibold">
                  Marca
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1C1C1E] border border-[#343438] text-xs text-white focus:border-[#6C2BD9] focus:outline-none"
                >
                  <option value="all">Todas las marcas</option>
                  {allBrands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Size Filter */}
              <div>
                <label className="block text-[11px] font-mono text-[#E5E5E3] uppercase mb-1.5 font-semibold">
                  Talle disponible
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1C1C1E] border border-[#343438] text-xs text-white focus:border-[#6C2BD9] focus:outline-none"
                >
                  <option value="all">Todos los talles</option>
                  {allSizes.map((sz) => (
                    <option key={sz} value={sz}>
                      Talle {sz}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Filter */}
              <div>
                <label className="block text-[11px] font-mono text-[#E5E5E3] uppercase mb-1.5 font-semibold">
                  Color
                </label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1C1C1E] border border-[#343438] text-xs text-white focus:border-[#6C2BD9] focus:outline-none"
                >
                  <option value="all">Todos los colores</option>
                  {allColors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Slider */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#E5E5E3] mb-1.5 font-semibold">
                  <span>Precio máximo:</span>
                  <span className="text-[#6C2BD9] font-bold">${maxPrice.toLocaleString('es-AR')}</span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={100000}
                  step={5000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#6C2BD9]"
                />
              </div>

              {/* Toggles: Ofertas & Stock */}
              <div className="space-y-2.5 pt-2 border-t border-[#343438]">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#E5E5E3]">
                  <input
                    type="checkbox"
                    checked={onlyOffers}
                    onChange={(e) => setOnlyOffers(e.target.checked)}
                    className="w-4 h-4 rounded text-[#6C2BD9] focus:ring-0 bg-[#1C1C1E] border-[#343438]"
                  />
                  <span className="flex items-center gap-1">
                    <Sparkles size={12} className="text-[#6C2BD9]" />
                    <span>Solo productos en oferta</span>
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#E5E5E3]">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="w-4 h-4 rounded text-[#6C2BD9] focus:ring-0 bg-[#1C1C1E] border-[#343438]"
                  />
                  <span>Solo con stock disponible</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#252528] border border-[#343438] shadow-xl space-y-4">
                <BrandStar size={32} color="#6C2BD9" className="mx-auto opacity-80" />
                <h3 className="font-condensed text-2xl font-bold uppercase text-white">
                  No hay productos para los filtros seleccionados
                </h3>
                <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
                  Probá modificando el rango de precio, el talle o la categoría elegida.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-5 py-2.5 rounded-lg bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-condensed text-sm font-bold uppercase tracking-wider shadow-md"
                >
                  Restablecer todos los filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
