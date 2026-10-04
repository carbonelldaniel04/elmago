import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BrandStar } from '../common/BrandStar';
import { LogoElMago } from '../common/LogoElMago';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';
import { ActiveView } from '../../types';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cartCount,
    setIsCartOpen,
    setIsSearchOpen,
    setSelectedCategoryFilter,
    selectedCategoryFilter,
    settings,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const isIndumentariaActive =
    activeView === 'catalog' && selectedCategoryFilter !== 'calzado-seguridad';
  const isCalzadoActive =
    activeView === 'catalog' && selectedCategoryFilter === 'calzado-seguridad';

  const handleNavClick = (view: ActiveView, categoryFilter?: string | null) => {
    setActiveView(view);
    if (categoryFilter !== undefined) {
      setSelectedCategoryFilter(categoryFilter);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Slim Top Announcement Bar with Graphite Background */}
      {!bannerDismissed && settings.announcementActive && (
        <div className="bg-[#141416] border-b border-[#343438] text-xs text-[#E5E5E3] px-4 py-2 flex items-center justify-between text-center relative z-50">
          <div className="mx-auto flex items-center gap-2 font-medium tracking-wide">
            <BrandStar size={11} color="#6C2BD9" />
            <span>{settings.announcementBanner}</span>
            <BrandStar size={11} color="#6C2BD9" />
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            className="text-stone-400 hover:text-white p-1 transition-colors"
            title="Cerrar aviso"
            aria-label="Cerrar aviso"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Sticky Header in Graphite #1C1C1E */}
      <header className="sticky top-0 z-40 bg-[#1C1C1E]/95 backdrop-blur-md border-b border-[#343438] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Zone 1: Authentic Tienda El Mago Logo Lockup */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home', null)}
              className="flex items-center text-left focus:outline-none"
            >
              <LogoElMago size="md" />
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold tracking-wider uppercase">
            <button
              onClick={() => handleNavClick('home', null)}
              className={`transition-colors py-1 relative ${
                activeView === 'home'
                  ? 'text-white'
                  : 'text-[#E5E5E3] hover:text-[#6C2BD9]'
              }`}
            >
              Inicio
              {activeView === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6C2BD9]" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('catalog', 'ropa-trabajo')}
              className={`transition-colors py-1 relative ${
                isIndumentariaActive
                  ? 'text-white'
                  : 'text-[#E5E5E3] hover:text-[#6C2BD9]'
              }`}
            >
              Indumentaria
              {isIndumentariaActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6C2BD9]" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('catalog', 'calzado-seguridad')}
              className={`transition-colors py-1 relative ${
                isCalzadoActive
                  ? 'text-white'
                  : 'text-[#E5E5E3] hover:text-[#6C2BD9]'
              }`}
            >
              Calzado
              {isCalzadoActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6C2BD9]" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('corporate')}
              className={`transition-colors py-1 relative ${
                activeView === 'corporate'
                  ? 'text-white'
                  : 'text-[#E5E5E3] hover:text-[#6C2BD9]'
              }`}
            >
              Vestimos a tu equipo
              {activeView === 'corporate' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6C2BD9]" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`transition-colors py-1 relative ${
                activeView === 'contact'
                  ? 'text-white'
                  : 'text-[#E5E5E3] hover:text-[#6C2BD9]'
              }`}
            >
              Contacto
              {activeView === 'contact' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6C2BD9]" />
              )}
            </button>
          </nav>

          {/* Zone 3: Interactive Affordances & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-lg text-[#E5E5E3] hover:text-[#6C2BD9] hover:bg-[#252528] transition-colors"
              title="Buscar indumentaria y calzado"
              aria-label="Buscar productos"
            >
              <Search size={20} />
            </button>

            {/* Admin Access Portal Button */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeView === 'admin'
                  ? 'bg-[#6C2BD9] text-white font-bold shadow-md'
                  : 'bg-[#252528] text-[#E5E5E3] hover:text-white hover:bg-[#343438] border border-[#343438]'
              }`}
              title="Panel de Administración"
            >
              <ShieldAlert size={15} className={activeView === 'admin' ? 'text-white' : 'text-[#6C2BD9]'} />
              <span className="hidden md:inline">Admin</span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-lg bg-[#252528] border border-[#343438] text-white hover:border-[#6C2BD9] transition-colors flex items-center justify-center shadow-sm"
              title="Ver carrito de compras"
              aria-label="Abrir carrito"
            >
              <ShoppingBag size={20} className="text-[#6C2BD9]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-[#6C2BD9] text-white font-mono text-[11px] font-bold rounded-full flex items-center justify-center shadow-lg border border-[#1C1C1E]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg text-[#E5E5E3] hover:text-white hover:bg-[#252528] transition-colors"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#1C1C1E] border-b border-[#343438] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#343438]">
              <button
                onClick={() => handleNavClick('home', null)}
                className={`text-left px-3 py-2.5 rounded text-sm font-semibold transition-colors ${
                  activeView === 'home'
                    ? 'bg-[#6C2BD9] text-white'
                    : 'bg-[#252528] text-[#E5E5E3] hover:text-[#6C2BD9]'
                }`}
              >
                Inicio
              </button>
              <button
                onClick={() => handleNavClick('catalog', 'ropa-trabajo')}
                className={`text-left px-3 py-2.5 rounded text-sm font-semibold transition-colors ${
                  isIndumentariaActive
                    ? 'bg-[#6C2BD9] text-white'
                    : 'bg-[#252528] text-[#E5E5E3] hover:text-[#6C2BD9]'
                }`}
              >
                Indumentaria
              </button>
              <button
                onClick={() => handleNavClick('catalog', 'calzado-seguridad')}
                className={`text-left px-3 py-2.5 rounded text-sm font-semibold transition-colors ${
                  isCalzadoActive
                    ? 'bg-[#6C2BD9] text-white'
                    : 'bg-[#252528] text-[#E5E5E3] hover:text-[#6C2BD9]'
                }`}
              >
                Calzado
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className={`text-left px-3 py-2.5 rounded text-sm font-semibold transition-colors ${
                  activeView === 'contact'
                    ? 'bg-[#6C2BD9] text-white'
                    : 'bg-[#252528] text-[#E5E5E3] hover:text-[#6C2BD9]'
                }`}
              >
                Contacto
              </button>
              <button
                onClick={() => handleNavClick('corporate')}
                className={`col-span-2 text-left px-3 py-2.5 rounded text-sm font-semibold transition-colors flex items-center justify-between ${
                  activeView === 'corporate'
                    ? 'bg-[#6C2BD9] text-white'
                    : 'bg-[#252528] text-[#E5E5E3] hover:text-[#6C2BD9]'
                }`}
              >
                <span>Vestimos a tu equipo</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C1C1E] text-[#6C2BD9] border border-[#343438]">
                  Corporativo & B2B
                </span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full text-center text-xs font-semibold uppercase tracking-wider text-white bg-[#6C2BD9] hover:bg-[#7C3AED] px-4 py-2.5 rounded-lg shadow transition-colors flex items-center justify-center gap-2"
              >
                <ShieldAlert size={15} />
                <span>Panel de Administración</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
