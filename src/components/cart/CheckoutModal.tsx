import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BrandStar } from '../common/BrandStar';
import { X, CheckCircle2, MessageCircle } from 'lucide-react';
import { Order, OrderItem } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, cartSubtotal, cartTotal, settings, createOrder, getWhatsAppCartUrl } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [cuit, setCuit] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('Buenos Aires');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('Transferencia bancaria');

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderItems: OrderItem[] = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      brand: item.product.brand,
      size: item.size,
      color: item.color,
      price: item.product.price,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity,
      image: item.product.images[0],
    }));

    const shippingCost = cartTotal - cartSubtotal;

    const newOrder = createOrder({
      customerName,
      customerEmail,
      customerPhone,
      customerCompany: customerCompany || undefined,
      cuit: cuit || undefined,
      items: orderItems,
      subtotal: cartSubtotal,
      shippingCost,
      total: cartTotal,
      status: 'Pendiente',
      paymentMethod,
      shippingAddress,
      city,
      province,
      notes,
    });

    setConfirmedOrder(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#1C1C1E] border border-[#343438] rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#141416] border-b border-[#343438] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrandStar size={16} color="#6C2BD9" />
            <h3 className="font-condensed text-xl font-bold uppercase text-white">
              {confirmedOrder ? 'Pedido Confirmado' : 'Finalizar Compra'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-stone-400 hover:text-white"
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {confirmedOrder ? (
            <div className="py-8 text-center space-y-5">
              <CheckCircle2 size={54} className="mx-auto text-emerald-400" />
              <div>
                <h4 className="font-condensed text-3xl font-extrabold uppercase text-white">
                  ¡Gracias por tu compra!
                </h4>
                <p className="text-sm font-mono text-[#6C2BD9] mt-1 font-bold">
                  Número de Pedido: {confirmedOrder.orderNumber}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#252528] border border-[#343438] max-w-md mx-auto text-left text-xs space-y-2 text-[#E5E5E3]">
                <div className="flex justify-between">
                  <span>Cliente:</span>
                  <span className="text-white font-semibold">{confirmedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total a Pagar:</span>
                  <span className="text-[#6C2BD9] font-mono font-bold">${confirmedOrder.total.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Medio de Pago:</span>
                  <span className="text-white">{confirmedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Destino:</span>
                  <span className="text-white">{confirmedOrder.shippingAddress}, {confirmedOrder.city}</span>
                </div>
              </div>

              <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
                Recibimos tu solicitud. Podés avisarnos por WhatsApp para agilizar el despacho inmediato de tu pedido:
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={getWhatsAppCartUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg bg-[#25d366] hover:bg-[#20b858] text-black font-condensed text-base font-bold uppercase tracking-wider inline-flex items-center gap-2"
                >
                  <MessageCircle size={18} />
                  <span>Avisar Pedido por WhatsApp</span>
                </a>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-lg bg-[#252528] hover:bg-[#343438] text-white font-condensed text-base uppercase font-bold tracking-wider border border-[#343438]"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[#E5E5E3] uppercase mb-1">
                    Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Juan Pérez"
                    className="w-full px-3 py-2 rounded-lg bg-[#252528] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#E5E5E3] uppercase mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+54 9 11 ..."
                    className="w-full px-3 py-2 rounded-lg bg-[#252528] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#E5E5E3] uppercase mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="juan@correo.com"
                    className="w-full px-3 py-2 rounded-lg bg-[#252528] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#E5E5E3] uppercase mb-1">
                    Empresa (Opcional)
                  </label>
                  <input
                    type="text"
                    value={customerCompany}
                    onChange={(e) => setCustomerCompany(e.target.value)}
                    placeholder="Nombre de la empresa"
                    className="w-full px-3 py-2 rounded-lg bg-[#252528] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-mono text-[#E5E5E3] uppercase mb-1">
                    Dirección de Entrega *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Calle, número, piso/depto o faena"
                    className="w-full px-3 py-2 rounded-lg bg-[#252528] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#E5E5E3] uppercase mb-1">
                    Ciudad / Localidad *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Localidad"
                    className="w-full px-3 py-2 rounded-lg bg-[#252528] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[#E5E5E3] uppercase mb-1">
                  Medio de Pago
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      'Transferencia bancaria',
                      'Tarjeta de crédito / débito',
                      'Efectivo contra entrega',
                      'Cuenta Corriente Empresa',
                    ] as const
                  ).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-2.5 rounded-lg border text-left font-medium transition-colors ${
                        paymentMethod === method
                          ? 'border-[#6C2BD9] bg-[#6C2BD9]/20 text-white font-bold'
                          : 'border-[#343438] bg-[#252528] text-stone-300 hover:border-[#6C2BD9]'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono text-[#E5E5E3] uppercase mb-1">
                  Observaciones / Instrucciones de Envío
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Horarios de recepción, notas para el transporte..."
                  className="w-full px-3 py-2 rounded-lg bg-[#252528] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                />
              </div>

              {/* Order total summary */}
              <div className="p-3.5 rounded-xl bg-[#252528] border border-[#343438] space-y-1.5 font-mono">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal prendas:</span>
                  <span>${cartSubtotal.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Envío:</span>
                  <span>{cartTotal > cartSubtotal ? `$${(cartTotal - cartSubtotal).toLocaleString('es-AR')}` : 'Gratis'}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-1 border-t border-[#343438]">
                  <span>TOTAL FINAL:</span>
                  <span className="text-[#6C2BD9] font-bold">${cartTotal.toLocaleString('es-AR')}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-lg bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-condensed text-lg font-bold uppercase tracking-wider transition-colors shadow-lg"
              >
                CONFIRMAR Y GENERAR PEDIDO
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
