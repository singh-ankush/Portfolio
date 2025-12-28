/**
 * AchievementsSection.tsx
 * - Renders a grid of achievement cards using static `achievements` data.
 * - Each item contains an icon, title, description, and a short stat.
 * - Visuals use `motion` for entrance animations.
 */
import { motion } from 'motion/react';
import { achievements } from '../data';

/**
 * `achievements` - static content for each achievement card. Keeping this
 * data local makes the component simple; move to a data file if it becomes
 * shared or dynamic.
 */


/**
 * `AchievementsSection` - presentational component that maps over
 * `achievements` and renders a styled card for each.
 */
export function AchievementsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4">Achievements & Milestones</h2>
          <p className="text-gray-600">Key accomplishments throughout my career</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                    {achievement.icon ? (
                      <achievement.icon className="w-8 h-8 text-white" />
                    ) : (
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15 8l6 .5-4.5 3.5L18 20l-6-4-6 4 1.5-8.0L3 8.5 9 8 12 2z"/></svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-3xl mb-1 font-semibold text-black">
                      {achievement.stats}
                    </div>
                  </div>
                </div>
                <h4 className="mb-2">{achievement.title}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
