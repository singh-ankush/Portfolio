/**
 * ScrollToTop.tsx
 * Floating "scroll to top" button.
 * - Listens for window scroll and toggles visibility after a threshold.
 * - Smooth-scrolls the window to the top when clicked.
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center z-40 hover:shadow-2xl transition-shadow border border-gray-200"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6 text-gray-700" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
