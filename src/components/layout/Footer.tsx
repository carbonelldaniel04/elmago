import React from 'react';
import { useStore } from '../../context/StoreContext';
import { BrandStar, StarCluster } from '../common/BrandStar';
import { LogoElMago } from '../common/LogoElMago';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { ActiveView } from '../../types';

export const Footer: React.FC = () => {
  const { settings, setActiveView, setSelectedCategoryFilter, getGeneralWhatsAppUrl } = useStore();

  const handleCategoryClick = (catSlug: string) => {
    setSelectedCategoryFilter(catSlug);
    setActiveView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1C1C1E] border-t border-[#343438] text-[#E5E5E3] pt-16 pb-12 relative overflow-hidden">
      {/* Subtle star decorative watermark in footer background in brand violet */}
      <div className="absolute right-8 bottom-8 opacity-[0.03] pointer-events-none" aria-hidden="true">
        <BrandStar size={240} color="#6C2BD9" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Value trust bar above columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-[#343438]">
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#252528] border border-[#343438]">
            <div className="p-2.5 rounded-lg bg-[#1C1C1E] text-[#6C2BD9]">
              <Truck size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-white uppercase tracking-wider font-condensed">Envíos a Todo el País</p>
              <p className="text-xs text-stone-400">Expresos y correos con seguimiento</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#252528] border border-[#343438]">
            <div className="p-2.5 rounded-lg bg-[#1C1C1E] text-[#6C2BD9]">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-white uppercase tracking-wider font-condensed">Garantía de Resistencia</p>
              <p className="text-xs text-stone-400">Telas grafa 100% y normas IRAM</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#252528] border border-[#343438]">
            <div className="p-2.5 rounded-lg bg-[#1C1C1E] text-[#6C2BD9]">
              <RotateCcw size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-white uppercase tracking-wider font-condensed">Cambios Sin Complicaciones</p>
              <p className="text-xs text-stone-400">30 días para cambio de talles</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#252528] border border-[#343438]">
            <div className="p-2.5 rounded-lg bg-[#1C1C1E] text-[#6C2BD9]">
              <Building2 size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-white uppercase tracking-wider font-condensed">Facturación A y B</p>
              <p className="text-xs text-stone-400">Atención directa a empresas y CUIT</p>
            </div>
          </div>
        </div>

        {/* 4 Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          {/* Col 1: Brand & Slogan */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <LogoElMago size="md" />
            </div>

            <p className="text-sm text-stone-400 max-w-md leading-relaxed">
              Especialistas en indumentaria laboral reforzada y calzado de seguridad de alta gama.
              Proveemos a trabajadores independientes, cuadrillas de taller y grandes empresas en todo el territorio nacional.
            </p>

            <div className="p-3.5 rounded-xl bg-[#252528] border border-[#343438] max-w-md shadow-inner">
              <p className="font-tienda text-sm text-[#E5E5E3] tracking-wide">
                “Indumentaria y calzado para acompañar tu trabajo.”
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-[#25d366]/15 hover:bg-[#25d366]/25 border border-[#25d366]/30 text-[#25d366] text-xs font-semibold tracking-wide inline-flex items-center gap-2 transition-colors"
              >
                <span>Consultar por WhatsApp</span>
                <ExternalLink size={13} />
              </a>

              <button
                onClick={() => {
                  setActiveView('corporate');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-lg bg-[#252528] hover:bg-[#343438] border border-[#343438] hover:border-[#6C2BD9] text-[#E5E5E3] text-xs font-semibold tracking-wide inline-flex items-center gap-2 transition-colors"
              >
                <span>Vestimos a tu equipo</span>
              </button>
            </div>
          </div>

          {/* Col 2: Categorías Rápidas */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E5E5E3] mb-4 flex items-center gap-2">
              <BrandStar size={10} color="#6C2BD9" />
              Categorías
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <button
                  onClick={() => handleCategoryClick('ropa-trabajo')}
                  className="hover:text-[#6C2BD9] transition-colors"
                >
                  Ropa de Trabajo
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('pantalones')}
                  className="hover:text-[#6C2BD9] transition-colors"
                >
                  Pantalones Cargo & Gabardina
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('camisas')}
                  className="hover:text-[#6C2BD9] transition-colors"
                >
                  Camisas de Grafa
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('calzado-seguridad')}
                  className="hover:text-[#6C2BD9] transition-colors"
                >
                  Calzado con Puntera de Acero
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('camperas-buzos')}
                  className="hover:text-[#6C2BD9] transition-colors"
                >
                  Camperas Térmicas Trucker
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('alta-visibilidad')}
                  className="hover:text-[#6C2BD9] transition-colors"
                >
                  Alta Visibilidad Norma IRAM
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Información & Políticas */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E5E5E3] mb-4 flex items-center gap-2">
              <BrandStar size={10} color="#6C2BD9" />
              Información
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <button
                  onClick={() => {
                    setActiveView('corporate');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#6C2BD9] transition-colors"
                >
                  Vestimos a tu equipo (B2B)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('home');
                    setTimeout(() => {
                      document.getElementById('ofertas-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 150);
                  }}
                  className="hover:text-white transition-colors text-[#6C2BD9] font-medium"
                >
                  Ofertas destacadas
                </button>
              </li>
              <li>
                <span className="text-[#E5E5E3] block">Condiciones de Cambio:</span>
                <span className="text-xs text-stone-500 block">Prendas con etiqueta original y sin uso previo.</span>
              </li>
              <li>
                <span className="text-[#E5E5E3] block">Medios de Pago:</span>
                <span className="text-xs text-stone-500 block">Transferencia con 10% OFF, Tarjetas de Crédito y Débito.</span>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-stone-500 hover:text-[#6C2BD9] transition-colors text-xs"
                >
                  Acceso Administrador Tienda
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacto Directo */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E5E5E3] mb-4 flex items-center gap-2">
              <BrandStar size={10} color="#6C2BD9" />
              Contacto
            </h4>
            <div className="space-y-3 text-sm text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#6C2BD9] shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">{settings.address}, {settings.city}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-[#6C2BD9] shrink-0" />
                <a
                  href={`tel:${settings.storePhone.replace(/[^\d]/g, '')}`}
                  className="text-xs hover:text-[#6C2BD9] transition-colors"
                >
                  {settings.storePhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-[#6C2BD9] shrink-0" />
                <a
                  href={`mailto:${settings.storeEmail}`}
                  className="text-xs hover:text-[#6C2BD9] transition-colors"
                >
                  {settings.storeEmail}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock size={16} className="text-[#6C2BD9] shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">{settings.openingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal line */}
        <div className="pt-8 border-t border-[#343438] flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Tienda El Mago. Todos los derechos reservados. Indumentaria y calzado de trabajo.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-300 cursor-pointer">Políticas de Privacidad</span>
            <span className="hover:text-stone-300 cursor-pointer">Términos y Condiciones</span>
            <span className="hover:text-stone-300 cursor-pointer">Defensa del Consumidor</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
