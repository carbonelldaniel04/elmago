import React, { useEffect, useState, useMemo } from 'react';
import { BrandStar } from './BrandStar';
import { useStore } from '../../context/StoreContext';
import logoOriginal from '../../assets/images/logo_tienda_el_mago.png';

interface IntroAnimationProps {
  onFinish?: () => void;
}

interface StarPosition {
  id: number;
  size: number;
  color: string;
  // Posición inicial (fuera de pantalla, px respecto al centro)
  startX: number;
  startY: number;
  // Posición de paso para curva elegante (px)
  midX: number;
  midY: number;
  // Posición final alrededor del logo (px respecto al centro, sin tapar el logo)
  finalX: number;
  finalY: number;
  rotate: number;
  delayMs: number;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onFinish }) => {
  const { showIntroAnimation, setShowIntroAnimation } = useStore();
  const [starsMoved, setStarsMoved] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // 10 estrellas independientes alrededor del logo
  // Composición solicitada:
  //         ★                 ★
  //               [ LOGO ]
  //         ★                         ★
  //              ★       ★
  const stars: StarPosition[] = useMemo(
    () => [
      // 1. Arriba Izquierda (entra desde arriba a la izquierda)
      {
        id: 1,
        size: 28,
        color: '#F4C400',
        startX: -380,
        startY: -280,
        midX: -200,
        midY: -180,
        finalX: -140,
        finalY: -130,
        rotate: 12,
        delayMs: 0,
      },
      // 2. Arriba Derecha (entra desde arriba a la derecha)
      {
        id: 2,
        size: 30,
        color: '#F4C400',
        startX: 380,
        startY: -280,
        midX: 200,
        midY: -180,
        finalX: 140,
        finalY: -130,
        rotate: -10,
        delayMs: 40,
      },
      // 3. Lateral Izquierdo Superior
      {
        id: 3,
        size: 24,
        color: '#F4C400',
        startX: -440,
        startY: -60,
        midX: -280,
        midY: -40,
        finalX: -210,
        finalY: -20,
        rotate: -8,
        delayMs: 60,
      },
      // 4. Lateral Izquierdo Inferior (acento violeta #6C2BD9)
      {
        id: 4,
        size: 18,
        color: '#6C2BD9',
        startX: -360,
        startY: 180,
        midX: -240,
        midY: 100,
        finalX: -180,
        finalY: 70,
        rotate: 16,
        delayMs: 100,
      },
      // 5. Lateral Derecho Superior
      {
        id: 5,
        size: 26,
        color: '#F4C400',
        startX: 440,
        startY: -60,
        midX: 280,
        midY: -40,
        finalX: 210,
        finalY: -20,
        rotate: 8,
        delayMs: 50,
      },
      // 6. Lateral Derecho Inferior (acento violeta #6C2BD9)
      {
        id: 6,
        size: 18,
        color: '#6C2BD9',
        startX: 360,
        startY: 180,
        midX: 240,
        midY: 100,
        finalX: 180,
        finalY: 70,
        rotate: -14,
        delayMs: 110,
      },
      // 7. Abajo Izquierda
      {
        id: 7,
        size: 22,
        color: '#F4C400',
        startX: -220,
        startY: 320,
        midX: -140,
        midY: 200,
        finalX: -90,
        finalY: 125,
        rotate: -6,
        delayMs: 80,
      },
      // 8. Abajo Centro-Izquierda
      {
        id: 8,
        size: 24,
        color: '#F4C400',
        startX: -40,
        startY: 340,
        midX: -30,
        midY: 210,
        finalX: -25,
        finalY: 135,
        rotate: 10,
        delayMs: 90,
      },
      // 9. Abajo Centro-Derecha
      {
        id: 9,
        size: 24,
        color: '#F4C400',
        startX: 60,
        startY: 340,
        midX: 45,
        midY: 210,
        finalX: 40,
        finalY: 135,
        rotate: -12,
        delayMs: 90,
      },
      // 10. Abajo Derecha (acento violeta #6C2BD9)
      {
        id: 10,
        size: 18,
        color: '#6C2BD9',
        startX: 220,
        startY: 320,
        midX: 140,
        midY: 200,
        finalX: 95,
        finalY: 125,
        rotate: 15,
        delayMs: 120,
      },
    ],
    []
  );

  useEffect(() => {
    if (!showIntroAnimation) return;

    setStarsMoved(false);
    setIsExiting(false);

    // 0 – 0,2s: El logo ya está 100% visible en el centro.
    // 0,2s: Las estrellas inician su desplazamiento suave hacia sus posiciones.
    const moveTimer = setTimeout(() => {
      setStarsMoved(true);
    }, 200);

    // 1,5s: Fin de la pausa de contemplación, inicio de fade-out del contenedor completo.
    const exitTimer = setTimeout(() => {
      handleExit();
    }, 1500);

    return () => {
      clearTimeout(moveTimer);
      clearTimeout(exitTimer);
    };
  }, [showIntroAnimation]);

  const handleExit = () => {
    if (isExiting) return;
    setIsExiting(true);

    // 1,5 – 1,8s (300ms fade-out del contenedor completo): Ocultar y desmontar splash
    setTimeout(() => {
      setShowIntroAnimation(false);
      setIsExiting(false);
      onFinish?.();
    }, 300);
  };

  if (!showIntroAnimation) return null;

  return (
    <div
      onClick={handleExit}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#1C1C1E] select-none cursor-pointer overflow-hidden transition-opacity duration-300 ease-out ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Bienvenido a Tienda El Mago"
    >
      {/* Contenedor central */}
      <div className="relative flex items-center justify-center">
        {/*
          LOGO ORIGINAL DE TIENDA EL MAGO
          - Utilizado directamente como imagen normal (<img />)
          - Archivo original existente en el proyecto
          - Opacity: 1 desde el primer instante
          - Sin transformaciones, sin filtros, sin máscaras, sin animaciones sobre el logo
          - 100% estático, nítido y legible
        */}
        <img
          src={logoOriginal}
          alt="Tienda El Mago"
          className="w-[280px] sm:w-[420px] md:w-[480px] h-auto object-contain select-none pointer-events-none relative z-10"
          style={{
            opacity: 1,
            filter: 'none',
            transform: 'none',
          }}
        />

        {/*
          ESTRELLAS ANIMADAS ALREDEDOR DEL LOGO
          - Elementos independientes que se desplazan desde los laterales
          - Se acomodan en el perímetro sin tapar el logo
        */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
          {stars.map((star) => {
            const currentX = starsMoved ? star.finalX : star.startX;
            const currentY = starsMoved ? star.finalY : star.startY;
            const starOpacity = starsMoved ? 1 : 0;
            const starScale = starsMoved ? 1 : 0.4;

            return (
              <div
                key={star.id}
                className="absolute transition-all duration-700 ease-out pointer-events-none"
                style={{
                  transform: `translate3d(${currentX}px, ${currentY}px, 0) scale(${starScale}) rotate(${
                    starsMoved ? star.rotate : 0
                  }deg)`,
                  opacity: starOpacity,
                  transitionDelay: `${star.delayMs}ms`,
                  transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)',
                  filter:
                    star.color === '#F4C400'
                      ? 'drop-shadow(0 2px 6px rgba(244,196,0,0.5))'
                      : 'drop-shadow(0 2px 6px rgba(108,43,217,0.5))',
                }}
              >
                <BrandStar size={star.size} color={star.color} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
