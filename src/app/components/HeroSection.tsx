/**
 * HeroSection.tsx
 * Landing/hero section displayed on the homepage.
 * - Presents a brief introduction (name, title) and contact links.
 * - Uses `motion` for entrance animations and micro-interactions.
 * - Keep visual/animation logic here; any data should come from props
 *   or a shared data file if it becomes dynamic.
 */
import { Mail, Linkedin, Github, MapPin, AlertCircleIcon, Newspaper, Twitter, Link as LinkIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { hero } from '../data';
import { useEffect, useState } from 'react';

const getInitials = (name?: string) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Random tech images floating in the background (uses hero.techImages) */}
      <RandomTechBackground images={hero.techImages} />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="mb-6 inline-block"
          >
            {hero.image ? (
              <img
                src={hero.image}
                alt={hero.name}
                loading="lazy"
                className="w-32 h-32 rounded-full object-cover mx-auto shadow-2xl"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto shadow-2xl">
                <span className="text-2xl font-semibold text-white">{getInitials(hero.name)}</span>
              </div>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-4"
          >
            {hero.name}
          </motion.h1>

          {/* Rotating headline: shows hero.title first, then cycles through hero.highlights */}
          <div className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto h-10">
            <AnimatePresence mode="wait">
              <RotatingHeadline keyPrefix="hero-" hero={hero} />
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            <a
              href={`mailto:${hero.email}`}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <Mail className="w-5 h-5 text-blue-600" />
              <span>{hero.email}</span>
            </a>

            {Object.entries(hero.links || {}).map(([key, url]) => {
              const k = String(key).toLowerCase();
              const Icon = k === 'linkedin' ? Linkedin : k === 'github' ? Github : k === 'medium' ? Newspaper : k === 'twitter' ? Twitter : LinkIcon;
              const label = k === 'linkedin' ? 'LinkedIn' : k === 'github' ? 'GitHub' : k === 'medium' ? 'Medium' : k === 'twitter' ? 'Twitter' : key;
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Icon className="w-5 h-5 text-gray-800" />
                  <span>{label}</span>
                </a>
              );
            })}

            <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg">
              <MapPin className="w-5 h-5 text-red-600" />
              <span>{hero.location}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <a
              href="#skills"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <span>Scroll to explore</span>
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                ↓
              </motion.span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function RotatingHeadline({ hero, keyPrefix }: { hero: any; keyPrefix?: string }) {
  const items = [hero.title, ...(hero.highlights || [])];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 3000);
    return () => clearInterval(t);
  }, [items.length]);

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={`${keyPrefix ?? ''}${index}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.6 }}
        className={`whitespace-pre-wrap ${items[index] === hero.title ? 'font-medium text-gray-900' : 'text-gray-600'}`}
      >
        {items[index]}
      </motion.p>
    </AnimatePresence>
  );
}

function RandomTechBackground({ images }: { images?: string[] }) {
  const [items, setItems] = useState<Array<any>>([]);

  // spawn new items periodically
  useEffect(() => {
    if (!images || images.length === 0) return;
    let mounted = true;
    const max = 10;

    const spawn = () => {
      if (!mounted) return;
      setItems((s) => {
        if (s.length >= max) return s;
        const img = images[Math.floor(Math.random() * images.length)];
        const id = Date.now() + Math.random();
        const left = Math.random() * 90 + 5; // keep within bounds
        const top = Math.random() * 70 + 5;
        const size = 20 + Math.random() * 56;
        const duration = 2500 + Math.random() * 3500;
        return [...s, { id, img, left, top, size, duration }];
      });
    };

    const interval = setInterval(spawn, 700);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [images]);

  // remove items after their duration
  useEffect(() => {
    const timers: number[] = [];
    items.forEach((it) => {
      const t = window.setTimeout(() => {
        setItems((s) => s.filter((x) => x.id !== it.id));
      }, it.duration);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [items]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {items.map((it) => (
        <TechItem key={it.id} it={it} />
      ))}
    </div>
  );
}

function TechItem({ it }: { it: any }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    const hide = window.setTimeout(() => setVisible(false), Math.max(600, it.duration - 500));
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hide);
    };
  }, [it.duration]);

  return (
    <img
      src={it.img}
      alt=""
      className="absolute rounded-md shadow-sm"
      style={{
        left: `${it.left}%`,
        top: `${it.top}%`,
        width: it.size,
        height: it.size,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(-6px) scale(1.0)' : 'translateY(6px) scale(0.8)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))',
      }}
    />
  );
}