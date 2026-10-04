import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BrandStar } from '../common/BrandStar';
import { CheckoutModal } from './CheckoutModal';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  ArrowRight,
  Truck,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    cartTotal,
    settings,
    getWhatsAppCartUrl,
  } = useStore();

  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleCheckoutClick = () => {
    setCheckoutOpen(true);
  };

  const handleWhatsAppConsult = () => {
    const url = getWhatsAppCartUrl();
    window.open(url, '_blank');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-[#1C1C1E] border-l border-[#343438] shadow-2xl flex flex-col justify-between">
            {/* Drawer Header */}
            <div className="p-5 bg-[#141416] border-b border-[#343438] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={20} className="text-[#6C2BD9]" />
                <h3 className="font-condensed text-xl font-bold uppercase text-white tracking-wide">
                  Tu Carrito de Compra
                </h3>
                <span className="text-xs font-mono text-[#E5E5E3] bg-[#252528] px-2 py-0.5 rounded border border-[#343438]">
                  {cart.length} {cart.length === 1 ? 'artículo' : 'artículos'}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#252528] transition-colors"
                title="Cerrar carrito"
                aria-label="Cerrar carrito"
              >
                <X size={20} />
              </button>
            </div>

            {/* Free Shipping Progress Meter with Violet/Graphite Theme */}
            <div className="p-4 bg-[#252528] border-b border-[#343438] text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[#E5E5E3] font-medium flex items-center gap-1.5">
                  <Truck size={14} className="text-[#6C2BD9]" />
                  {remainingForFreeShipping === 0 ? (
                    <span className="text-emerald-400 font-bold">¡Envío bonificado gratis!</span>
                  ) : (
                    <span>
                      Faltan <strong className="text-white">${remainingForFreeShipping.toLocaleString('es-AR')}</strong> para envío gratis
                    </span>
                  )}
                </span>
                <span className="font-mono text-[10px] text-[#6C2BD9] font-bold">{freeShippingProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#1C1C1E] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#6C2BD9] transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="p-4 rounded-full bg-[#252528] text-[#6C2BD9] border border-[#343438]">
                    <ShoppingBag size={36} />
                  </div>
                  <h4 className="font-condensed text-xl font-bold uppercase text-white">
                    El carrito está vacío
                  </h4>
                  <p className="text-xs text-stone-400 max-w-xs leading-relaxed">
                    Añadí indumentaria y calzado de trabajo resistente para comenzar tu pedido.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-5 py-2.5 rounded-lg bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-condensed text-sm font-bold uppercase tracking-wider shadow-md transition-colors"
                  >
                    EXPLORAR PRODUCTOS
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-[#252528] border border-[#343438] flex gap-3.5 items-center relative group"
                  >
                    {/* Item Thumbnail */}
                    <img
                      src={
                        (item.product.images &&
                          item.product.images[0] &&
                          item.product.images[0].trim()) ||
                        '/src/assets/images/category_ropa_trabajo_1790892078708.jpg'
                      }
                      alt={item.product.name}
                      className="w-18 h-18 rounded-lg object-cover bg-black/40 shrink-0"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== '/src/assets/images/category_ropa_trabajo_1790892078708.jpg') {
                          target.src = '/src/assets/images/category_ropa_trabajo_1790892078708.jpg';
                        }
                      }}
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <span className="text-[10px] font-mono text-[#6C2BD9] uppercase block font-bold">
                        {item.product.brand}
                      </span>
                      <h4 className="font-condensed text-sm font-bold uppercase text-white truncate leading-snug">
                        {item.product.name}
                      </h4>

                      {/* Variant metadata */}
                      <div className="flex items-center gap-2 text-[11px] font-mono text-[#E5E5E3]">
                        <span>Talle: <strong className="text-white">{item.size}</strong></span>
                        <span>·</span>
                        <span>Color: <strong className="text-white">{item.color}</strong></span>
                      </div>

                      {/* Price & Stepper */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="font-condensed text-base font-extrabold text-[#6C2BD9] tabular-nums">
                          ${(item.product.price * item.quantity).toLocaleString('es-AR')}
                        </span>

                        <div className="flex items-center bg-[#1C1C1E] border border-[#343438] rounded">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-stone-400 hover:text-white font-mono"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 font-mono text-xs font-bold text-white tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-stone-400 hover:text-white font-mono"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-500 hover:text-rose-400 p-1 transition-colors self-start"
                      title="Eliminar artículo"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer with Totals & CTAs */}
            {cart.length > 0 && (
              <div className="p-5 bg-[#141416] border-t border-[#343438] space-y-3.5">
                {/* Breakdown */}
                <div className="space-y-1.5 font-mono text-xs text-[#E5E5E3]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-white">${cartSubtotal.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío estimado:</span>
                    <span className="text-white">
                      {cartTotal === cartSubtotal ? 'Bonificado' : `$${settings.standardShippingCost.toLocaleString('es-AR')}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-[#343438]">
                    <span className="font-condensed uppercase tracking-wider text-sm">TOTAL:</span>
                    <span className="text-[#6C2BD9] font-condensed text-xl font-black">
                      ${cartTotal.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>

                {/* Primary CTA: Finalizar Compra */}
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3 px-4 rounded-lg bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-condensed text-base font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>FINALIZAR COMPRA</span>
                  <ArrowRight size={17} />
                </button>

                {/* Secondary Alternative: Consultar Pedido por WhatsApp */}
                <button
                  onClick={handleWhatsAppConsult}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#25d366]/15 hover:bg-[#25d366]/25 border border-[#25d366]/30 text-[#25d366] font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  <span>CONSULTAR PEDIDO POR WHATSAPP</span>
                </button>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                  <span>Facturación A y B disponible</span>
                  <button
                    onClick={clearCart}
                    className="hover:text-rose-400 transition-colors"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Checkout Modal */}
      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  );
};
