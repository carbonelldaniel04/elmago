import React from 'react';
import { useStore } from '../../context/StoreContext';
import { BrandStar, StarCluster } from '../common/BrandStar';
import { Building2, MessageCircle, FileText, CheckCircle2, ShieldCheck, Users, Truck } from 'lucide-react';

export const CorporateSection: React.FC = () => {
  const { setIsB2BModalOpen, getGeneralWhatsAppUrl } = useStore();

  const handleWhatsApp = () => {
    const url = getGeneralWhatsAppUrl(
      'Hola Tienda El Mago, me comunico de parte de una empresa para consultar precios mayoristas en indumentaria y calzado de trabajo.'
    );
    window.open(url, '_blank');
  };

  return (
    <section className="py-20 lg:py-28 bg-[#1C1C1E] relative overflow-hidden border-t border-[#343438]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Messaging & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#252528] border border-[#343438] text-xs font-mono uppercase tracking-widest text-[#6C2BD9]">
              <BrandStar size={12} color="#6C2BD9" />
              <span>División Corporativa & Venta Mayorista</span>
            </div>

            <h1 className="font-condensed text-4xl sm:text-6xl font-black uppercase text-white tracking-tight leading-none">
              VESTIMOS A TU EQUIPO
            </h1>

            <p className="text-lg sm:text-xl text-[#E5E5E3] leading-relaxed max-w-xl">
              Equipá a tu empresa con indumentaria de trabajo, calzado y prendas laborales. Calidad probada para resistir las condiciones más exigentes.
            </p>

            {/* B2B Benefits List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 pb-2">
              <div className="flex items-center gap-2.5 text-sm text-[#E5E5E3]">
                <CheckCircle2 size={18} className="text-[#6C2BD9] shrink-0" />
                <span>Factura A con CUIT inmediato</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-[#E5E5E3]">
                <CheckCircle2 size={18} className="text-[#6C2BD9] shrink-0" />
                <span>Bordado y estampado con tu logo</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-[#E5E5E3]">
                <CheckCircle2 size={18} className="text-[#6C2BD9] shrink-0" />
                <span>Descuentos escalonados por volumen</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-[#E5E5E3]">
                <CheckCircle2 size={18} className="text-[#6C2BD9] shrink-0" />
                <span>Envíos directos a faena o depósito</span>
              </div>
            </div>

            {/* Requested Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => setIsB2BModalOpen(true)}
                className="px-7 py-3.5 rounded-lg bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-condensed text-lg uppercase font-bold tracking-wider transition-all duration-200 flex items-center gap-2 shadow-md"
              >
                <FileText size={18} />
                <span>CONSULTAR POR EMPRESA</span>
              </button>

              <button
                onClick={handleWhatsApp}
                className="px-7 py-3.5 rounded-lg bg-transparent hover:bg-[#252528] text-white border border-[#343438] hover:border-[#25d366] font-condensed text-lg uppercase font-bold tracking-wider transition-colors flex items-center gap-2"
              >
                <MessageCircle size={18} className="text-[#25d366]" />
                <span>CONTACTAR POR WHATSAPP</span>
              </button>
            </div>
          </div>

          {/* Right Column: Corporate Highlights Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-[#252528] border border-[#343438] p-6 sm:p-8 shadow-xl relative">
              <div className="flex items-center justify-between pb-6 border-b border-[#343438] mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#1C1C1E] text-[#6C2BD9]">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-condensed text-xl font-bold uppercase text-white">
                      Planes para Empresas
                    </h3>
                    <p className="text-xs text-stone-400">Atención personalizada y cuenta corriente</p>
                  </div>
                </div>
                <BrandStar size={16} color="#6C2BD9" />
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#1C1C1E] border border-[#343438]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white uppercase font-condensed">
                      1. Relevamiento y Curaduría de Talles
                    </span>
                    <span className="text-[10px] font-mono text-[#6C2BD9] font-bold">Paso 01</span>
                  </div>
                  <p className="text-xs text-[#E5E5E3] leading-relaxed">
                    Te asistimos en la planilla de talles de tus colaboradores (desde talle 38 hasta 60 en pantalones y S a XXXL en camperas).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#1C1C1E] border border-[#343438]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white uppercase font-condensed">
                      2. Muestras Físicas y Presupuesto
                    </span>
                    <span className="text-[10px] font-mono text-[#6C2BD9] font-bold">Paso 02</span>
                  </div>
                  <p className="text-xs text-[#E5E5E3] leading-relaxed">
                    Presupuestos con vigencia formal y posibilidad de envío de muestras para verificación de gramajes y confort.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#1C1C1E] border border-[#343438]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white uppercase font-condensed">
                      3. Empaque Individual por Operario
                    </span>
                    <span className="text-[10px] font-mono text-[#6C2BD9] font-bold">Paso 03</span>
                  </div>
                  <p className="text-xs text-[#E5E5E3] leading-relaxed">
                    Entregamos los kits rotulados con el nombre de cada trabajador para facilitar la distribución en tu planta.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
