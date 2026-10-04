import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { BrandStar } from '../common/BrandStar';
import {
  X,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Truck,
  Check,
  Sparkles,
  Layers,
  Award,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    getWhatsAppProductUrl,
    products,
  } = useStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setSelectedImageIndex(0);
      setSelectedSize(selectedProduct.sizes[0] || 'Estándar');
      setSelectedColor(selectedProduct.colors[0]?.name || 'Estándar');
      setQuantity(1);
      setJustAdded(false);
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const handleAddToCart = () => {
    addToCart(selectedProduct, selectedSize, selectedColor, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleWhatsApp = () => {
    const url = getWhatsAppProductUrl(selectedProduct, selectedSize, selectedColor);
    window.open(url, '_blank');
  };

  // Related products from same category or brand
  const relatedProducts = products
    .filter(
      (p) =>
        p.id !== selectedProduct.id &&
        p.isActive &&
        (p.categoryId === selectedProduct.categoryId || p.brand === selectedProduct.brand)
    )
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#1C1C1E] border border-[#343438] rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#252528] text-stone-300 hover:text-white hover:bg-[#343438] border border-[#343438] transition-colors"
          title="Cerrar ficha"
          aria-label="Cerrar modal"
        >
          <X size={20} />
        </button>

        <div className="p-6 sm:p-8 max-h-[88vh] overflow-y-auto">
          {/* Main 2-column layout: Sticky Gallery Left + Contiguous Purchase Module Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            {/* Gallery Column */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main large image */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white border border-[#343438]">
                <img
                  src={
                    (selectedProduct.images &&
                      selectedProduct.images[selectedImageIndex] &&
                      selectedProduct.images[selectedImageIndex].trim()) ||
                    (selectedProduct.images &&
                      selectedProduct.images[0] &&
                      selectedProduct.images[0].trim()) ||
                    '/src/assets/images/category_ropa_trabajo_1790892078708.jpg'
                  }
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover object-center filter brightness-[0.98]"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== '/src/assets/images/category_ropa_trabajo_1790892078708.jpg') {
                      target.src = '/src/assets/images/category_ropa_trabajo_1790892078708.jpg';
                    }
                  }}
                />

                {/* Offer tag */}
                {selectedProduct.isOffer && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#6C2BD9] text-white font-condensed text-xs font-bold uppercase tracking-wider shadow-md">
                      <Sparkles size={14} className="text-white" />
                      <span>OFERTA {selectedProduct.discountPercent ? `-${selectedProduct.discountPercent}%` : ''}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery Strip if multiple images */}
              {selectedProduct.images &&
                selectedProduct.images.filter((img) => Boolean(img && img.trim())).length > 1 && (
                  <div className="flex items-center gap-3">
                    {selectedProduct.images
                      .filter((img) => Boolean(img && img.trim()))
                      .map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all bg-white ${
                            selectedImageIndex === idx
                              ? 'border-[#6C2BD9] scale-105 shadow-md'
                              : 'border-[#343438] opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${selectedProduct.name} vista ${idx + 1}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (target.src !== '/src/assets/images/category_ropa_trabajo_1790892078708.jpg') {
                                target.src = '/src/assets/images/category_ropa_trabajo_1790892078708.jpg';
                              }
                            }}
                          />
                        </button>
                      ))}
                  </div>
                )}

              {/* Trust Badges under gallery */}
              <div className="p-4 rounded-xl bg-[#252528] border border-[#343438] grid grid-cols-2 gap-3 text-xs text-[#E5E5E3] font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#6C2BD9] shrink-0" />
                  <span>Costuras de Alta Tenacidad</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-[#6C2BD9] shrink-0" />
                  <span>Certificación IRAM / Homologado</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={18} className="text-[#6C2BD9] shrink-0" />
                  <span>Envíos Rápidos al País</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers size={18} className="text-[#6C2BD9] shrink-0" />
                  <span>Factura A con CUIT</span>
                </div>
              </div>
            </div>

            {/* Purchase Module Column */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                {/* Brand & Category */}
                <div className="flex items-center gap-2 text-xs font-mono text-stone-400 mb-2">
                  <span className="text-[#6C2BD9] font-bold uppercase tracking-wider">{selectedProduct.brand}</span>
                  <span>·</span>
                  <span>{selectedProduct.categoryName}</span>
                  <span>·</span>
                  <span className="text-stone-500">Ref: {selectedProduct.id}</span>
                </div>

                {/* Title */}
                <h1 className="font-condensed text-2xl sm:text-4xl font-extrabold uppercase text-white tracking-wide leading-tight mb-4">
                  {selectedProduct.name}
                </h1>

                {/* Price block */}
                <div className="p-4 rounded-xl bg-[#252528] border border-[#343438] flex items-baseline gap-4 mb-6">
                  <span className="font-condensed text-3xl sm:text-4xl font-black text-[#6C2BD9] tabular-nums">
                    ${selectedProduct.price.toLocaleString('es-AR')}
                  </span>
                  {selectedProduct.originalPrice && (
                    <span className="text-base font-mono text-stone-400 line-through tabular-nums">
                      ${selectedProduct.originalPrice.toLocaleString('es-AR')}
                    </span>
                  )}
                  {selectedProduct.discountPercent && selectedProduct.discountPercent > 0 && (
                    <span className="px-2.5 py-1 rounded bg-[#6C2BD9]/20 border border-[#6C2BD9]/40 text-[#6C2BD9] font-mono text-xs font-bold">
                      Ahorrás {selectedProduct.discountPercent}%
                    </span>
                  )}
                </div>

                {/* Stock status */}
                <div className="flex items-center gap-2 mb-6">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      selectedProduct.inStock ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                    }`}
                  />
                  <span className="text-xs font-mono text-stone-300">
                    {selectedProduct.inStock
                      ? `Stock Disponible (${selectedProduct.stockCount} unidades en depósito)`
                      : 'Temporalmente sin stock'}
                  </span>
                </div>

                {/* Size Selector */}
                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs font-mono text-[#E5E5E3] mb-2">
                    <span className="uppercase font-semibold">Talles Disponibles:</span>
                    <span className="text-[#6C2BD9] font-bold">Seleccionado: {selectedSize}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                          selectedSize === size
                            ? 'bg-[#6C2BD9] text-white shadow-md'
                            : 'bg-[#252528] text-stone-300 hover:text-white border border-[#343438]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selector */}
                {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-xs font-mono text-[#E5E5E3] mb-2">
                      <span className="uppercase font-semibold">Color:</span>
                      <span className="text-white font-bold">{selectedColor}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {selectedProduct.colors.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setSelectedColor(c.name)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                            selectedColor === c.name
                              ? 'border-[#6C2BD9] bg-[#6C2BD9]/20 text-white font-bold ring-1 ring-[#6C2BD9]'
                              : 'border-[#343438] bg-[#252528] text-stone-400 hover:text-white'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/40"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity and Actions */}
                <div className="space-y-3 pt-4 border-t border-[#343438]">
                  <div className="flex items-center gap-3">
                    {/* Quantity Stepper */}
                    <div className="flex items-center bg-[#252528] border border-[#343438] rounded-lg">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-3 text-stone-300 hover:text-white font-mono text-lg font-bold"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 font-mono text-base font-bold text-white tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-3 text-stone-300 hover:text-white font-mono text-lg font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Cart CTA */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={!selectedProduct.inStock}
                      className={`flex-1 py-3 px-6 rounded-lg font-condensed text-lg font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                        justAdded
                          ? 'bg-emerald-600 text-white'
                          : selectedProduct.inStock
                          ? 'bg-[#6C2BD9] hover:bg-[#7C3AED] text-white'
                          : 'bg-[#252528] text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      {justAdded ? (
                        <>
                          <Check size={20} />
                          <span>¡AGREGADO!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={20} />
                          <span>AGREGAR AL CARRITO</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Direct WhatsApp Inquiry Button */}
                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#25d366]/10 hover:bg-[#25d366]/20 border border-[#25d366]/30 text-[#25d366] font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    <span>Consultar por WhatsApp con Talle {selectedSize}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Technical Specifications Tabs */}
          <div className="pt-8 border-t border-[#343438] space-y-6">
            <div>
              <h3 className="font-condensed text-xl font-bold uppercase text-white mb-2 flex items-center gap-2">
                <BrandStar size={14} color="#6C2BD9" />
                Descripción del Producto
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed max-w-4xl">
                {selectedProduct.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-4 rounded-xl bg-[#252528] border border-[#343438]">
                <h4 className="font-condensed text-base font-bold uppercase text-[#6C2BD9] mb-2">
                  Composición y Material
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed font-mono">
                  {selectedProduct.material}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#252528] border border-[#343438]">
                <h4 className="font-condensed text-base font-bold uppercase text-[#6C2BD9] mb-2">
                  Especificaciones Técnicas
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-300">
                  {selectedProduct.specifications.map((spec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#6C2BD9] font-bold">✓</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="pt-10 mt-10 border-t border-[#343438]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-condensed text-2xl font-bold uppercase text-white tracking-wide flex items-center gap-2">
                  <BrandStar size={16} color="#6C2BD9" />
                  PRODUCTOS RELACIONADOS
                </h3>
                <span className="text-xs font-mono text-stone-400">
                  Misma categoría y resistencia
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      setSelectedProduct(rel);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-3 rounded-xl bg-[#252528] hover:bg-[#343438] border border-[#343438] hover:border-[#6C2BD9] transition-all cursor-pointer flex gap-3 items-center group shadow-md"
                  >
                    <img
                      src={
                        (rel.images && rel.images[0] && rel.images[0].trim()) ||
                        '/src/assets/images/category_ropa_trabajo_1790892078708.jpg'
                      }
                      alt={rel.name}
                      className="w-16 h-16 rounded-lg object-cover bg-black/40 shrink-0"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== '/src/assets/images/category_ropa_trabajo_1790892078708.jpg') {
                          target.src = '/src/assets/images/category_ropa_trabajo_1790892078708.jpg';
                        }
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono text-[#6C2BD9] uppercase block font-semibold">
                        {rel.brand}
                      </span>
                      <h4 className="font-condensed text-sm font-bold uppercase text-white truncate group-hover:text-[#6C2BD9]">
                        {rel.name}
                      </h4>
                      <span className="text-xs font-bold font-mono text-[#6C2BD9] tabular-nums">
                        ${rel.price.toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
