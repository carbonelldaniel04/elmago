import React, { useEffect, useState } from 'react';
import { BrandStar } from './BrandStar';
import { useStore } from '../../context/StoreContext';
import logoLight from '../../assets/images/logo_tienda_el_mago_light.png';

interface IntroAnimationProps {
  onFinish?: () => void;
}

const SPLASH_DURATION = 1600;
const EXIT_DURATION = 420;

const stars = [
  { x: '-46vw', y: '-18vh', endX: '-150px', endY: '-86px', size: 20, delay: 120, color: '#F4C400' },
  { x: '-54vw', y: '22vh', endX: '-176px', endY: '58px', size: 28, delay: 180, color: '#F4C400' },
  { x: '-20vw', y: '-58vh', endX: '-94px', endY: '-124px', size: 14, delay: 250, color: '#F4C400' },
  { x: '-12vw', y: '58vh', endX: '-74px', endY: '118px', size: 18, delay: 310, color: '#6C2BD9' },
  { x: '48vw', y: '-26vh', endX: '146px', endY: '-92px', size: 24, delay: 140, color: '#F4C400' },
  { x: '56vw', y: '18vh', endX: '174px', endY: '54px', size: 30, delay: 220, color: '#F4C400' },
  { x: '18vw', y: '-60vh', endX: '86px', endY: '-126px', size: 16, delay: 290, color: '#6C2BD9' },
  { x: '14vw', y: '56vh', endX: '76px', endY: '116px', size: 20, delay: 350, color: '#F4C400' },
  { x: '-62vw', y: '0', endX: '-188px', endY: '-8px', size: 12, delay: 390, color: '#6C2BD9' },
  { x: '64vw', y: '2vh', endX: '190px', endY: '0', size: 14, delay: 420, color: '#F4C400' },
  { x: '-30vw', y: '42vh', endX: '-120px', endY: '88px', size: 12, delay: 440, color: '#F4C400' },
  { x: '31vw', y: '40vh', endX: '120px', endY: '84px', size: 12, delay: 460, color: '#6C2BD9' },
];

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onFinish }) => {
  const { showIntroAnimation, setShowIntroAnimation } = useStore();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!showIntroAnimation) return;

    setIsExiting(false);
    const exitTimer = window.setTimeout(() => setIsExiting(true), SPLASH_DURATION);
    const removeTimer = window.setTimeout(() => {
      setShowIntroAnimation(false);
      onFinish?.();
    }, SPLASH_DURATION + EXIT_DURATION);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
    };
  }, [showIntroAnimation, setShowIntroAnimation, onFinish]);

  const skipIntro = () => {
    if (isExiting) return;
    setIsExiting(true);
    window.setTimeout(() => {
      setShowIntroAnimation(false);
      onFinish?.();
    }, EXIT_DURATION);
  };

  if (!showIntroAnimation) return null;

  return (
    <>
      <style>{`
        .intro-star {
          opacity: 0;
          transform: translate(-50%, -50%) scale(.35) rotate(-18deg);
          animation: intro-star-flight 980ms cubic-bezier(.2,.72,.2,1) var(--star-delay) forwards;
          filter: drop-shadow(0 0 8px rgba(244,196,0,.5));
        }
        .intro-logo-shell {
          opacity: 0;
          transform: scale(.85);
          animation: intro-logo-arrival 520ms cubic-bezier(.16,1,.3,1) 650ms forwards;
          filter: drop-shadow(0 12px 34px rgba(108,43,217,.28));
        }
        @keyframes intro-star-flight {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(.35) rotate(-18deg); }
          18% { opacity: 1; }
          72% { opacity: 1; }
          100% { opacity: .95; transform: translate(calc(-50% + var(--star-end-x)), calc(-50% + var(--star-end-y))) scale(1) rotate(12deg); }
        }
        @keyframes intro-logo-arrival {
          0% { opacity: 0; transform: scale(.85); }
          100% { opacity: 1; transform: scale(1); }
        }
        @media (max-width: 640px) {
          .intro-star { transform: translate(-50%, -50%) scale(.25) rotate(-18deg); }
          .intro-star:nth-child(n+9) { display: none; }
          .intro-logo-shell { animation-delay: 560ms; }
        }
        @media (prefers-reduced-motion: reduce) {
          .intro-star, .intro-logo-shell { animation-duration: 1ms; animation-delay: 0ms; }
        }
      `}</style>
      <div
      role="dialog"
      aria-label="Animación de bienvenida Tienda El Mago"
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden select-none bg-[#1C1C1E] transition-opacity ease-out ${isExiting ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
      style={{ transitionDuration: `${EXIT_DURATION}ms` }}
      onClick={skipIntro}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(108,43,217,0.12),transparent_42%)]" aria-hidden="true" />

      <div className="absolute inset-0" aria-hidden="true">
        {stars.map((star, index) => (
          <span
            key={index}
            className="intro-star absolute left-1/2 top-1/2"
            style={{
              width: star.size,
              height: star.size,
              marginLeft: star.x,
              marginTop: star.y,
              ['--star-end-x' as string]: star.endX,
              ['--star-end-y' as string]: star.endY,
              ['--star-delay' as string]: `${star.delay}ms`,
            }}
          >
            <BrandStar size={star.size} color={star.color} />
          </span>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        <div className="intro-logo-shell">
          <img
            src={logoLight}
            alt="Tienda El Mago"
            className="h-auto w-[min(72vw,390px)] object-contain"
          />
        </div>
      </div>

      <button
        type="button"
        className="absolute bottom-6 z-20 rounded-full border border-white/10 bg-black/10 px-4 py-2 text-[10px] font-medium tracking-[0.16em] text-white/45 transition-colors hover:text-white/80"
        onClick={(event) => {
          event.stopPropagation();
          skipIntro();
        }}
      >
        Omitir introducción
      </button>
    </div>
    </>
  );
};

export default IntroAnimation;
