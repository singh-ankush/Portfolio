/**
 * ScrollProgress.tsx
 * Top-of-page progress indicator based on scroll position.
 * - Uses `useScroll` to read `scrollYProgress` and `useSpring` for
 *   a smooth animated width/scale transition.
 */
import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 origin-left z-[60]"
      style={{ scaleX }}
    />
  );
}
