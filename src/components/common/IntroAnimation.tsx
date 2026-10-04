import React, { useEffect, useState } from 'react';
import { BrandStar } from './BrandStar';
import { useStore } from '../../context/StoreContext';
import logoLight from '../../assets/images/logo_tienda_el_mago_light.png';

interface IntroAnimationProps {
  onFinish?: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onFinish }) => {
  const { showIntroAnimation, setShowIntroAnimation } = useStore();
  const [isExiting, setIsExiting] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (!showIntroAnimation) return;

    setIsExiting(false);
    setHasEntered(false);

    // Phase 1: Trigger entry animation on next frame
    const enterTimer = setTimeout(() => {
      setHasEntered(true);
    }, 60);

    // Phase 2: Start smooth fade-out exit after 2.5 seconds
    const exitTimer = setTimeout(() => {
      handleExit();
    }, 2500);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, [showIntroAnimation]);

  const handleExit = () => {
    if (isExiting) return;
    setIsExiting(true);
    // Remove from DOM after exit transition finishes
    setTimeout(() => {
      setShowIntroAnimation(false);
      setIsExiting(false);
      onFinish?.();
    }, 650);
  };

  if (!showIntroAnimation) return null;

  return (
    <div
      onClick={handleExit}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#0e0b17] select-none cursor-pointer overflow-hidden transition-all duration-700 ease-out ${
        isExiting
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
      aria-label="Animación de bienvenida Tienda El Mago"
    >
      {/* Background Ambient Spotlights & Radial Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Central Violet Pulse Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[520px] md:w-[680px] h-[340px] sm:h-[520px] md:h-[680px] rounded-full bg-[#6C2BD9]/25 blur-[90px] animate-pulse-aura" />

        {/* Secondary Warm Golden Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[320px] md:w-[420px] h-[220px] sm:h-[320px] md:h-[420px] rounded-full bg-[#f59e0b]/15 blur-[70px] animate-pulse-aura" style={{ animationDelay: '1s' }} />

        {/* Subtle decorative grid overlay */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Main Container: Stars on Left + Big Logo in Center + Stars on Right */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 w-full flex items-center justify-center">
        {/* Left Side: Dynamic Star Constellation */}
        <div
          className={`flex flex-col items-center justify-center gap-3 sm:gap-5 pr-2 sm:pr-8 md:pr-12 transition-all duration-700 ease-out ${
            hasEntered
              ? 'opacity-100 translate-x-0 scale-100'
              : 'opacity-0 -translate-x-10 scale-75'
          }`}
        >
          {/* Top Left Star - Warm Gold */}
          <div className="animate-float-gentle drop-shadow-[0_0_16px_rgba(251,191,36,0.6)]">
            <BrandStar size={36} color="#fbbf24" className="sm:w-12 sm:h-12" />
          </div>

          {/* Center Left Star - Big Brand Violet */}
          <div className="animate-twinkle-violet drop-shadow-[0_0_24px_rgba(108,43,217,0.8)] -translate-x-2 sm:-translate-x-4">
            <BrandStar size={46} color="#8b5cf6" className="sm:w-14 sm:h-14 md:w-16 md:h-16" />
          </div>

          {/* Accent Micro Star - Amber */}
          <div className="animate-twinkle drop-shadow-[0_0_12px_rgba(245,158,11,0.7)] translate-x-3 sm:translate-x-4">
            <BrandStar size={24} color="#f59e0b" className="sm:w-7 sm:h-7" />
          </div>

          {/* Bottom Left Star - Lilac */}
          <div className="animate-float-reverse drop-shadow-[0_0_14px_rgba(192,132,252,0.7)] -translate-x-1">
            <BrandStar size={28} color="#c084fc" className="sm:w-9 sm:h-9" />
          </div>
        </div>

        {/* Center: Large Official Logo & Brand Subtitle */}
        <div
          className={`flex flex-col items-center text-center transition-all duration-800 cubic-bezier(0.16,1,0.3,1) ${
            hasEntered
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-75 translate-y-6'
          }`}
        >
          {/* Glowing Backlight Plate */}
          <div className="relative group">
            {/* Logo Image */}
            <img
              src={logoLight}
              alt="Tienda El Mago"
              className="h-20 sm:h-28 md:h-36 lg:h-44 w-auto object-contain filter drop-shadow-[0_10px_35px_rgba(108,43,217,0.55)] transition-transform duration-500 hover:scale-[1.02]"
            />

            {/* Ambient Star Sparkle on top corner of the logo */}
            <div className="absolute -top-3 -right-2 sm:-top-5 sm:-right-4 animate-twinkle">
              <BrandStar size={22} color="#fbbf24" className="sm:w-7 sm:h-7" />
            </div>
          </div>

          {/* Subtitle with Golden Stars */}
          <div
            className={`mt-4 sm:mt-6 flex items-center justify-center gap-2 sm:gap-3 transition-all duration-700 delay-200 ${
              hasEntered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            <BrandStar size={12} color="#fbbf24" className="sm:w-3.5 sm:h-3.5 animate-twinkle" />
            <span className="font-mono text-xs sm:text-sm md:text-base uppercase tracking-[0.28em] sm:tracking-[0.35em] text-[#E5E5E3] font-bold drop-shadow-[0_2px_8px_rgba(108,43,217,0.5)]">
              Indumentaria & Calzado Laboral
            </span>
            <BrandStar size={12} color="#fbbf24" className="sm:w-3.5 sm:h-3.5 animate-twinkle" />
          </div>

          {/* Loading Accent Progress Line */}
          <div className="mt-5 sm:mt-6 w-36 sm:w-48 h-1 rounded-full bg-[#1C1C1E] border border-[#343438] overflow-hidden relative">
            <div
              className={`h-full bg-gradient-to-r from-[#6C2BD9] via-[#fbbf24] to-[#7C3AED] rounded-full transition-all duration-1000 ease-out ${
                hasEntered ? 'w-full' : 'w-0'
              }`}
            />
          </div>
        </div>

        {/* Right Side: Dynamic Star Constellation */}
        <div
          className={`flex flex-col items-center justify-center gap-3 sm:gap-5 pl-2 sm:pl-8 md:pl-12 transition-all duration-700 ease-out ${
            hasEntered
              ? 'opacity-100 translate-x-0 scale-100'
              : 'opacity-0 translate-x-10 scale-75'
          }`}
        >
          {/* Top Right Star - Big Golden Star */}
          <div className="animate-float-reverse drop-shadow-[0_0_20px_rgba(251,191,36,0.7)] translate-x-2 sm:translate-x-4">
            <BrandStar size={44} color="#fbbf24" className="sm:w-14 sm:h-14 md:w-16 md:h-16" />
          </div>

          {/* Center Right Star - Amber Sparkle */}
          <div className="animate-twinkle drop-shadow-[0_0_16px_rgba(245,158,11,0.75)]">
            <BrandStar size={30} color="#f59e0b" className="sm:w-9 sm:h-9" />
          </div>

          {/* Accent Micro Star - Violet */}
          <div className="animate-twinkle-violet drop-shadow-[0_0_18px_rgba(108,43,217,0.85)] -translate-x-2 sm:-translate-x-3">
            <BrandStar size={38} color="#8b5cf6" className="sm:w-11 sm:h-11" />
          </div>

          {/* Bottom Right Star - Gold Accent */}
          <div className="animate-float-gentle drop-shadow-[0_0_12px_rgba(251,191,36,0.6)] translate-x-1">
            <BrandStar size={24} color="#fbbf24" className="sm:w-7 sm:h-7" />
          </div>
        </div>
      </div>

      {/* Discreet Skip Button / Hint at Bottom */}
      <div className="absolute bottom-6 sm:bottom-8 z-20 flex items-center justify-center">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleExit();
          }}
          className="px-4 py-1.5 rounded-full bg-[#1C1C1E]/80 hover:bg-[#252528] border border-[#343438] text-[11px] font-mono text-stone-400 hover:text-white transition-all duration-200 flex items-center gap-1.5 backdrop-blur-sm cursor-pointer"
        >
          <span>Toca en cualquier parte para ingresar</span>
          <span className="text-[#6C2BD9]">→</span>
        </button>
      </div>
    </div>
  );
};
