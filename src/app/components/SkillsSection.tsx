// React hooks used inside this component.
// - `useState` manages which skill card is flipped/selected.
// - `useRef` references the horizontal scroll container for arrow visibility logic.
// - `useEffect` wires up the scroll listener and runs initial checks.
import { useState, useRef, useEffect } from "react";

// `motion` is used for entrance animations and the 3D flip animation.
import { motion } from "motion/react";
import { skills } from '../data';

// Icon buttons for scrolling left / right inside the skills row.
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * `skills` - static array describing each skill card.
 * Each entry contains metadata used by the front (icon, color, level)
 * and the back (description). This lives outside the component so it
 * isn't recreated on each render.
 */


/**
 * `SkillsSection` - renders a horizontal, scrollable row of skill cards.
 * Behavior summary:
 * - Cards are shown in a horizontal scroll container with left/right arrows.
 * - Clicking a card triggers a 3D Y-axis flip revealing the back face.
 * - The back face contains a longer description placed in a scrollable
 *   area so large text stays inside the card.
 */
export function SkillsSection() {
  // `selectedSkill` stores the id of the currently flipped card (or null).
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);

  // Ref to the scroll container so we can read scrollLeft/scrollWidth/clientWidth
  // and control arrow visibility and programmatic scrolling.
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Visibility state for the left/right navigation arrows.
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  /**
   * `checkScroll` - reads the scroll container's position and sets
   * `showLeftArrow` / `showRightArrow` accordingly. Called initially
   * and on the container's `scroll` event.
   */
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      // show left arrow when not at the very left
      setShowLeftArrow(scrollLeft > 0);
      // show right arrow when not at the very right (small buffer)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  /**
   * Attach scroll listener on mount and perform an initial visibility check.
   * Listener is cleaned up on unmount.
   */
  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, []);

  /**
   * `scroll` - programmatically scroll the container left or right by
   * a fixed `scrollAmount`. This powers the left/right arrow buttons.
   */
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="skills" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4">Skills & Expertise</h2>
          <p className="text-gray-600">Click a card to flip and see details</p>
        </motion.div>

        {/* Wrapper for the scrollable row and arrow controls */}
        <div className="relative">
          {/* Left arrow button — appears when there is hidden content to the left */}
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Right arrow button — appears when there is hidden content to the right */}
          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Horizontal scroll container for skill cards. Each item is a
              snap-center to keep focus when scrolling. We keep `ref`
              to this element for arrow visibility and programmatic scroll. */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {skills.map((skill, index) => {
              // `isFlipped` determines which face is visible via Y-rotation.
              const isFlipped = selectedSkill === skill.id;
              return (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="snap-center"
                >
                  {/*
                    Card perspective wrapper: keeps consistent 3D flipping.
                    The fixed width/height ensures front and back faces match.
                  */}
                  <div
                    style={{ perspective: 1000 }}
                    className="min-w-[280px] w-[280px] h-[280px]"
                  >
                    <motion.div
                      // toggle flipped state when clicking the card
                      onClick={() =>
                        setSelectedSkill(isFlipped ? null : skill.id)
                      }
                      // animate Y rotation to show the back face
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 30 }}
                      style={{
                        transformStyle: "preserve-3d",
                        willChange: "transform",
                      }}
                      className="relative bg-transparent cursor-pointer h-full"
                    >
                      {/* FRONT FACE: summary info + progress bar. */}
                      <div
                        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all h-full flex flex-col"
                        style={{
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                          position: "relative",
                        }}
                      >
                        <div
                          className={`w-16 h-16 rounded-xl bg-gradient-to-br ${skill.color} flex items-center justify-center mb-4 text-3xl flex-shrink-0`}
                        >
                          {typeof skill.icon === 'string' && (skill.icon.startsWith('http') || /\.(svg|png|jpe?g)$/.test(skill.icon)) ? (
                            <img src={skill.icon} alt={`${skill.name} icon`} className="w-10 h-10 object-contain" />
                          ) : (
                            <span className="text-3xl">{skill.icon}</span>
                          )}
                        </div>

                        <h3 className="mb-2 break-words">{skill.name}</h3>

                        <div className="mb-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600">
                              Proficiency
                            </span>
                            <span className="text-sm">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: index * 0.08 }}
                              className={`h-2 rounded-full bg-gradient-to-r ${skill.color}`}
                            />
                          </div>
                        </div>

                        {/*
                          Front description area: constrained to the card. Long
                          text will scroll inside this area instead of overflowing.
                        */}
                        {/* <div className="text-sm text-gray-700 mt-2 flex-1 overflow-auto min-h-0 break-words">
                          <p className="mb-2 whitespace-pre-wrap">{skill.description}</p>
                        </div> */}

                        <p className="text-sm text-blue-600 mt-2">
                          {isFlipped ? "Tap to flip back" : "Tap to flip"}
                        </p>
                      </div>

                      {/* BACK FACE: detailed description placed inside a scrollable area
                          to ensure large content stays within the card's bounds. */}
                      <div
                        className="bg-white rounded-2xl p-6 shadow-lg absolute inset-0 h-full flex flex-col"
                        style={{
                          transform: "rotateY(180deg)",
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                        }}
                      >
                        {/* Header area (fixed) */}
                        <div className="mb-3">
                          <h3 className="mb-1 break-words">{skill.name} — Details</h3>
                          <div className="text-sm text-gray-600">
                            Proficiency: {skill.level}%
                          </div>
                        </div>

                        {/*
                          Scrollable content on the back to accommodate long
                          descriptions without overflow. `flex-1` + `min-h-0`
                          combination enables correct overflow behavior inside
                          a flex column.
                        */}
                        <div
                          className="flex-1 overflow-y-auto min-h-0 text-sm text-gray-700 pr-1"
                          style={{ WebkitOverflowScrolling: "touch" }}
                        >
                          <p className="whitespace-pre-wrap break-words">
                            {skill.description}
                          </p>

                          <div className="mt-3 text-sm text-gray-600">
                            {/* Additional details can be added here; they will scroll. */}
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 mt-4">
                          Tap to flip back
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
