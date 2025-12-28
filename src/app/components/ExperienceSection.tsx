// ...existing code...
import { useState } from 'react';
import { motion } from 'motion/react';
import { Briefcase, Calendar } from 'lucide-react';
import { experiences } from '../data';

/**
 * ExperienceSection
 * - Renders timeline entries as clickable 3D flipping cards.
 * - Front: role/company/period/short description.
 * - Back: scrollable "Key Achievements" area (handles long content).
 */
export function ExperienceSection() {
  // Track which experience card is flipped (selected)
  const [flippedId, setFlippedId] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4">Work Experience</h2>
          <p className="text-gray-600">My professional journey</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Decorative timeline line (desktop) */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 hidden md:block" />

            <div className="space-y-12">
              {experiences.map((exp, index) => {
                const isFlipped = flippedId === exp.id;

                return (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="relative"
                  >
                    <div className="flex gap-8 items-start">
                      {/* Timeline dot (desktop) */}
                      <div className="hidden md:flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 + 0.3 }}
                          className={`w-16 h-16 rounded-full bg-gradient-to-br from-${exp.color}-400 to-${exp.color}-600 flex items-center justify-center shadow-lg z-10`}
                        >
                          <Briefcase className="w-8 h-8 text-white" />
                        </motion.div>
                      </div>

                      {/* Flippable card wrapper - fixed height so front/back match */}
                      <div className="flex-1">
                        <div
                          style={{ perspective: 1000 }}
                          className="min-w-0" /* allow flex children to shrink */
                        >
                          <motion.div
                            onClick={() => setFlippedId(isFlipped ? null : exp.id)}
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                            style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
                            className="relative cursor-pointer"
                          >
                            {/* Front face */}
                            <div
                              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
                              style={{
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden',
                                position: 'relative'
                              }}
                            >
                              <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                                <div>
                                  <h3 className="mb-1">{exp.role}</h3>
                                  <p className="text-gray-600">{exp.company}</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm">
                                  <Calendar className="w-4 h-4" />
                                  {exp.period}
                                </div>
                              </div>

                              <p className="text-gray-600 mb-4 line-clamp-3">{exp.description}</p>

                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full bg-${exp.color}-500`} />
                                <p className="text-sm text-gray-600">Tap card to view achievements</p>
                              </div>
                            </div>

                            {/* Back face */}
                            <div
                              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg absolute inset-0"
                              style={{
                                transform: 'rotateY(180deg)',
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                              }}
                            >
                              <div className="mb-3 flex items-start justify-between gap-2">
                                <div>
                                  {/* <h3 className="mb-1">{exp.role} — Achievements</h3> */}
                                  <h4 className="mb-1 text-gray-500">{exp.company} - {exp.role}</h4>
                                </div>
                                <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                                  <Calendar className="w-4 h-4 inline-block mr-1" />
                                  {exp.period}
                                </div>
                              </div>

                              {/* Scrollable achievements area to handle long content */}
                              <div className="flex-1 overflow-y-auto min-h-0 pr-2 text-sm text-gray-700" style={{ WebkitOverflowScrolling: 'touch' }}>
                                <p className="text-sm font-medium text-gray-600 mb-2">Key Achievements:</p>
                                <ul className="space-y-2">
                                  {exp.achievements.map((a, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                      <span className={`mt-1 w-2 h-2 rounded-full bg-${exp.color}-500 flex-shrink-0`} />
                                      <span className="text-sm text-gray-700 break-words whitespace-pre-wrap">{a}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="text-xs text-gray-500 mt-4">Tap card to flip back</div>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}