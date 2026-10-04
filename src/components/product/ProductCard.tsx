import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { BrandStar } from '../common/BrandStar';
import { ShoppingBag, MessageCircle, Check, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  variant?: 'standard' | 'offer';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'standard',
}) => {
  const { addToCart, getWhatsAppProductUrl, setSelectedProduct } = useStore();

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'Único');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || 'Estándar');
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, selectedColor, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getWhatsAppProductUrl(product, selectedSize, selectedColor);
    window.open(url, '_blank');
  };

  const isOfferCard = variant === 'offer' || product.isOffer;

    const validImg =
      product.images && product.images[0] && product.images[0].trim() !== ''
        ? product.images[0]
        : '/src/assets/images/category_ropa_trabajo_1790892078708.jpg';

    return (
      <div
        onClick={() => setSelectedProduct(product)}
        className={`group relative rounded-xl overflow-hidden bg-white border transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 shadow-sm hover:shadow-md ${
          isOfferCard
            ? 'border-[#6C2BD9]/40 hover:border-[#6C2BD9] ring-1 ring-[#6C2BD9]/20'
            : 'border-[#E5E5E3] hover:border-[#6C2BD9]'
        }`}
      >
        {/* Top Media Area with product image */}
        <div className="relative aspect-[4/3] bg-[#F5F5F4] overflow-hidden">
          <img
            src={validImg}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-[0.98]"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== '/src/assets/images/category_ropa_trabajo_1790892078708.jpg') {
                target.src = '/src/assets/images/category_ropa_trabajo_1790892078708.jpg';
              }
            }}
          />

        {/* Badges container */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isOffer && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#6C2BD9] text-white font-condensed text-xs font-bold uppercase tracking-wider shadow-sm">
              <BrandStar size={10} color="#FFFFFF" />
              <span>OFERTA {product.discountPercent ? `-${product.discountPercent}%` : ''}</span>
            </span>
          )}
          {product.isFeatured && !product.isOffer && (
            <span className="px-2.5 py-0.5 rounded bg-[#1C1C1E]/80 border border-[#343438] text-white text-[10px] font-mono uppercase tracking-wider font-semibold">
              Destacado
            </span>
          )}
        </div>

        {/* Stock status indicator pill */}
        <div className="absolute top-3 right-3 z-10">
          {product.inStock ? (
            <span className="px-2 py-0.5 rounded bg-emerald-900/80 border border-emerald-500/40 text-emerald-100 text-[10px] font-mono tracking-wider font-semibold">
              Stock ({product.stockCount})
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-rose-900/80 border border-rose-500/40 text-rose-100 text-[10px] font-mono tracking-wider font-semibold">
              Sin Stock
            </span>
          )}
        </div>

        {/* Quick View Floating Hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[1px]">
          <span className="px-3.5 py-2 rounded-lg bg-[#1C1C1E]/90 text-white border border-[#343438] text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 shadow-md">
            <Eye size={14} className="text-[#6C2BD9]" />
            Ver Ficha Completa
          </span>
        </div>
      </div>

      {/* Content & Selectors Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white text-[#1C1C1E]">
        <div>
          {/* Brand & Category line */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5 font-mono">
            <span className="text-[#6C2BD9] font-bold uppercase tracking-wider">{product.brand}</span>
            <span className="text-stone-500">{product.categoryName}</span>
          </div>

          {/* Product Name in Graphite text */}
          <h3 className="font-condensed text-lg sm:text-xl font-bold uppercase text-[#1C1C1E] tracking-wide group-hover:text-[#6C2BD9] transition-colors leading-snug line-clamp-2 mb-3">
            {product.name}
          </h3>

          {/* Price Module in Brand Violet */}
          <div className="flex items-baseline gap-2.5 mb-4">
            <span className="font-condensed text-2xl sm:text-3xl font-extrabold text-[#6C2BD9] tracking-tight tabular-nums">
              ${product.price.toLocaleString('es-AR')}
            </span>
            {product.originalPrice && (
              <span className="text-sm font-mono text-[#8E8E93] line-through tabular-nums">
                ${product.originalPrice.toLocaleString('es-AR')}
              </span>
            )}
            {product.discountPercent && product.discountPercent > 0 && (
              <span className="text-xs font-mono font-bold text-[#6C2BD9] bg-[#6C2BD9]/10 px-2 py-0.5 rounded">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Size Selector */}
          <div className="mb-3.5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 mb-1.5">
              <span>Talle:</span>
              <span className="text-[#1C1C1E] font-bold">{selectedSize}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pr-1">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`px-2 py-1 rounded text-xs font-mono font-semibold transition-all ${
                    selectedSize === size
                      ? 'bg-[#6C2BD9] text-white shadow-sm font-bold'
                      : 'bg-[#F5F5F4] text-[#1C1C1E] hover:text-[#6C2BD9] border border-[#E5E5E3]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 mb-1.5">
                <span>Color:</span>
                <span className="text-[#1C1C1E] text-xs font-medium">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center ${
                      selectedColor === c.name
                        ? 'border-[#6C2BD9] scale-110 ring-2 ring-[#6C2BD9]/40'
                        : 'border-[#D4D4D2] opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {selectedColor === c.name && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons: Add to cart & WhatsApp */}
        <div className="space-y-2 pt-3 border-t border-[#E5E5E3]">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full py-2.5 px-4 rounded-lg font-condensed text-base font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : product.inStock
                ? 'bg-[#6C2BD9] hover:bg-[#7C3AED] text-white'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            {justAdded ? (
              <>
                <Check size={18} />
                <span>¡AGREGADO AL CARRITO!</span>
              </>
            ) : (
              <>
                <ShoppingBag size={18} />
                <span>AGREGAR AL CARRITO</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleWhatsApp}
            className="w-full py-2 px-3 rounded-lg bg-white hover:bg-[#F5F5F4] text-[#1C1C1E] border border-[#E5E5E3] hover:border-[#25d366] text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-1.5"
          >
            <MessageCircle size={15} className="text-[#25d366]" />
            <span>Consultar por WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

