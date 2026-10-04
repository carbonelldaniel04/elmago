import React from 'react';
import { useStore } from '../../context/StoreContext';
import { BrandStar, LogoStarsCluster } from '../common/BrandStar';
import { ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveView, setSelectedCategoryFilter, settings } = useStore();

  const handleVerProductos = () => {
    setSelectedCategoryFilter(null);
    setActiveView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVerOfertas = () => {
    const el = document.getElementById('ofertas-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const heroImage =
    settings.heroImageUrl && settings.heroImageUrl.trim() !== ''
      ? settings.heroImageUrl.trim()
      : 'https://i.postimg.cc/PqfxYzjX/ROPAOMBU.jpg';
  const heroPosition = settings.heroImagePosition || '50% 50%';
  const heroTitle = settings.heroTitle || 'INDUMENTARIA QUE ACOMPAÑA TU TRABAJO';
  const heroSubtitle = settings.heroSubtitle || 'Ropa y calzado de trabajo pensados para acompañarte todos los días. Resistencia comprobada, triple costura y confort para profesionales y empresas.';

  return (
    <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-[#1C1C1E]">
      {/* Background Imagery with Industrial Workwear Photography - Made visibly clearer */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Trabajadores industriales con indumentaria y calzado de seguridad de Tienda El Mago"
          className="w-full h-full object-cover filter brightness-[0.90] contrast-[1.04] transition-all duration-700"
          style={{ objectPosition: heroPosition }}
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== '/src/assets/images/hero_ropa_ombu.jpg') {
              target.src = '/src/assets/images/hero_ropa_ombu.jpg';
            }
          }}
        />

        {/* Clean, balanced graphite gradient scrim so image is bright while text is 100% readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1E]/90 via-[#1C1C1E]/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E] via-transparent to-black/30" />
      </div>

      {/* Discrete El Mago stars in corners in brand violet */}
      <div className="absolute top-8 left-8 z-10 pointer-events-none opacity-50 hidden sm:block">
        <BrandStar size={22} color="#6C2BD9" />
      </div>
      <div className="absolute top-12 left-16 z-10 pointer-events-none opacity-30 hidden sm:block">
        <BrandStar size={11} color="#6C2BD9" />
      </div>
      <div className="absolute top-8 right-10 z-10 pointer-events-none opacity-60 hidden sm:block">
        <LogoStarsCluster scale={1.1} />
      </div>
      <div className="absolute bottom-10 right-14 z-10 pointer-events-none opacity-40 hidden sm:block">
        <BrandStar size={18} color="#6C2BD9" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="max-w-3xl">
          {/* Subtle brand tag with graphite border & star element */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#252528]/85 border border-[#343438] backdrop-blur-sm mb-6 text-xs uppercase tracking-widest text-[#E5E5E3] font-semibold shadow-md">
            <span className="font-mago text-[#6C2BD9] text-sm tracking-normal normal-case">El Mago</span>
            <span className="text-stone-400">·</span>
            <span>Indumentaria & Calzado Laboral</span>
            <BrandStar size={12} color="#6C2BD9" />
          </div>

          {/* Suggested Hero Title with clean white typography */}
          <h1 className="font-condensed text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white leading-[1.05] mb-6 drop-shadow-md">
            {heroTitle.includes('ACOMPAÑA TU TRABAJO') ? (
              <>
                {heroTitle.replace('ACOMPAÑA TU TRABAJO', '')}
                <span className="text-[#6C2BD9] underline decoration-[#6C2BD9]/40 underline-offset-8">
                  ACOMPAÑA TU TRABAJO
                </span>
              </>
            ) : (
              heroTitle
            )}
          </h1>

          {/* Suggested Subtitle */}
          <p className="text-base sm:text-xl text-[#E5E5E3] mb-8 font-normal leading-relaxed max-w-2xl">
            {heroSubtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <button
              onClick={handleVerProductos}
              className="px-7 py-3.5 rounded-lg bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-condensed text-lg uppercase tracking-wider font-extrabold transition-all duration-200 shadow-lg flex items-center gap-2 group whitespace-nowrap"
            >
              <span>VER PRODUCTOS</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleVerOfertas}
              className="px-7 py-3.5 rounded-lg bg-transparent hover:bg-[#252528] text-white border border-[#343438] hover:border-[#6C2BD9] font-condensed text-lg uppercase tracking-wider font-bold transition-all duration-200 flex items-center gap-2 group whitespace-nowrap"
            >
              <Sparkles size={18} className="text-[#6C2BD9]" />
              <span>VER OFERTAS</span>
            </button>
          </div>

          {/* Quick trust metrics with violet touch */}
          <div className="pt-6 border-t border-[#343438] grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-[#E5E5E3] font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#6C2BD9] shrink-0" />
              <span>Grafa 70 & Cuero Flor</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#6C2BD9] shrink-0" />
              <span>Punteras IRAM 3610</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <CheckCircle2 size={16} className="text-[#6C2BD9] shrink-0" />
              <span>Venta Mayorista y Menor</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

