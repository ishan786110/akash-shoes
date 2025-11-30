import { useEffect, useState } from "react";

interface ParallaxOptions {
  speed?: number;
  disabled?: boolean;
}

export function useParallax({ speed = 0.5, disabled = false }: ParallaxOptions = {}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (disabled) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Check if mobile
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const handleScroll = () => {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        setOffset({ x: 0, y: scrollY * speed });
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed, disabled]);

  return offset;
}

export function useMouseParallax({ speed = 0.02, disabled = false }: ParallaxOptions = {}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (disabled) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Check if mobile
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        const x = (e.clientX - window.innerWidth / 2) * speed;
        const y = (e.clientY - window.innerHeight / 2) * speed;
        setOffset({ x, y });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [speed, disabled]);

  return offset;
}
