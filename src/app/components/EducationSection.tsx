/**
 * EducationSection.tsx
 * Education and certifications area.
 * - Renders `education` entries and `certifications` cards.
 * - Use this component to list degrees, institutions, and certification
 *   metadata. Visuals use `motion` for small entrance transitions.
 */
import { motion } from 'motion/react';
import { GraduationCap, Award, BookOpen } from 'lucide-react';
import { education, certifications } from '../data';

// Explicit list of gradient classes used by certifications so Tailwind's
// scanner picks them up (they are referenced dynamically via data).
const certificationGradients: Record<string, string> = {
  'from-red-600 to-red-800': 'from-red-600 to-red-800',
  'from-red-500 via-green-500 via-blue-500 to-yellow-500': 'from-red-500 via-green-500 via-blue-500 to-yellow-500',
  'from-gray-800 to-black': 'from-gray-800 to-black',
  'from-gray-500 to-gray-800': 'from-gray-500 to-gray-800',
  'from-green-500 to-yellow-500': 'from-green-500 to-yellow-500',
  'from-blue-500 via-purple-500 to-blue-500': 'from-blue-500 via-purple-500 to-blue-500'
};

export function EducationSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4">Education & Certifications</h2>
          <p className="text-gray-600">Continuous learning journey</p>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-12">
          {/* Education */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3>Education</h3>
            </div>

            {education.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${edu.color} flex items-center justify-center flex-shrink-0`}>
                    <edu.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                      <div>
                        <h4 className="mb-1">{edu.degree}</h4>
                        <p className="text-gray-600">{edu.institution}</p>
                      </div>
                      <span className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm">
                        {edu.year}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{edu.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Certifications */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3>Certifications</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {certifications.map((cert, index) => {
                const gradient = certificationGradients[cert.color] ?? cert.color;
                return (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
                      <cert.icon className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="mb-2 text-base">{cert.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{cert.issuer}</p>
                    <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm inline-block">
                      {cert.year}
                    </span>
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
