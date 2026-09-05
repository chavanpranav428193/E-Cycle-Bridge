import { useState, useEffect } from 'react';

/**
 * Smoothly animates a number upward from 0 or previous value to target value
 */
export function useAnimatedCounter(
  target: number,
  durationMs: number = 900,
  decimals: number = 0
): number {
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCurrent(target);
      return;
    }

    let start = 0;
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const val = start + (target - start) * easeOut;

      setCurrent(Number(val.toFixed(decimals)));

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };

    const animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, [target, durationMs, decimals]);

  return current;
}
