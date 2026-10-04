import React from 'react';
import { LogoStarsCluster, BrandStar } from './BrandStar';
import logoLight from '../../assets/images/logo_tienda_el_mago_light.png';

interface LogoElMagoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withSubtitle?: boolean;
  variant?: 'image' | 'hybrid';
}

export const LogoElMago: React.FC<LogoElMagoProps> = ({
  size = 'md',
  className = '',
  withSubtitle = true,
  variant = 'image',
}) => {
  // Height map based on size
  const heightClasses = {
    sm: 'h-9',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-20',
  }[size];

  const subtitleClasses = {
    sm: 'text-[7.5px] tracking-[0.2em] -mt-0.5',
    md: 'text-[9px] tracking-[0.24em] -mt-1',
    lg: 'text-[11px] tracking-[0.28em] -mt-1',
    xl: 'text-[13px] tracking-[0.3em] -mt-1',
  }[size];

  return (
    <div className={`inline-flex flex-col items-start select-none group ${className}`}>
      <div className="flex items-center gap-2">
        {/* Authentic Official Tienda El Mago Logo Image with precise typography */}
        <div className="relative">
          <img
            src={logoLight}
            alt="Tienda El Mago - Indumentaria y Calzado de Trabajo"
            className={`${heightClasses} w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03] filter drop-shadow-[0_2px_12px_rgba(139,92,246,0.45)]`}
          />
          {/* Subtle violet ambient backlight glow */}
          <div className="absolute inset-0 bg-[#8b5cf6]/15 rounded-full blur-md -z-10 group-hover:bg-[#8b5cf6]/30 transition-all pointer-events-none" />
        </div>
      </div>

      {withSubtitle && (
        <div className="flex items-center gap-1.5 self-center pl-1">
          <BrandStar size={9} color="#fbbf24" />
          <span
            className={`font-mono text-[#c4b5fd] uppercase font-bold text-center drop-shadow-[0_1px_4px_rgba(124,58,237,0.4)] ${subtitleClasses}`}
          >
            Indumentaria & Calzado Laboral
          </span>
          <BrandStar size={9} color="#fbbf24" />
        </div>
      )}
    </div>
  );
};

