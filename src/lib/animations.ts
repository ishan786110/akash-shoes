/**
 * Animation timing scale and easing functions
 * Following the spec: xs:120ms, sm:200ms, md:350ms, lg:600ms, xl:900ms
 * Primary easing: cubic-bezier(.22,.9,.35,1)
 * Elastic easing: cubic-bezier(.18,1.2,.36,1)
 */

export const timings = {
  xs: 120,
  sm: 200,
  md: 350,
  lg: 600,
  xl: 900,
} as const;

export const easings = {
  primary: "cubic-bezier(0.22, 0.9, 0.35, 1)",
  elastic: "cubic-bezier(0.18, 1.2, 0.36, 1)",
} as const;

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

/**
 * Get animation delay for staggered animations
 */
export function getStaggerDelay(index: number, baseDelay: number = 60): string {
  return `${index * baseDelay}ms`;
}

/**
 * Create transition string with timing and easing
 */
export function createTransition(
  properties: string[] = ["all"],
  timing: keyof typeof timings = "md",
  easing: keyof typeof easings = "primary"
): string {
  return properties
    .map((prop) => `${prop} ${timings[timing]}ms ${easings[easing]}`)
    .join(", ");
}
