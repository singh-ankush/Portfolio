/**
 * InterestsSection.tsx
 * Displays hobbies and personal interests in a responsive grid.
 * - `interests` stores icon + title + description metadata for each card.
 * - Cards animate on entrance and slightly scale on hover.
 */
import { motion } from 'motion/react';
import { Coffee, Camera, Music, Plane, Book, Dumbbell, Palette, Gamepad2 } from 'lucide-react';

const interests = [
  {
    id: 1,
    icon: Coffee,
    title: 'Coffee Enthusiast',
    description: 'Exploring different brewing methods and coffee cultures',
    color: 'from-amber-400 to-orange-500'
  },
  {
    id: 2,
    icon: Camera,
    title: 'Photography',
    description: 'Capturing moments through landscape and street photography',
    color: 'from-blue-400 to-indigo-500'
  },
  {
    id: 3,
    icon: Music,
    title: 'Music Production',
    description: 'Creating electronic music in my spare time',
    color: 'from-purple-400 to-pink-500'
  },
  {
    id: 4,
    icon: Plane,
    title: 'Travel',
    description: 'Visited 25+ countries and counting',
    color: 'from-cyan-400 to-blue-500'
  },
  {
    id: 5,
    icon: Book,
    title: 'Reading',
    description: 'Tech books, sci-fi novels, and philosophy',
    color: 'from-green-400 to-emerald-500'
  },
  {
    id: 6,
    icon: Dumbbell,
    title: 'Fitness',
    description: 'Regular gym sessions and outdoor activities',
    color: 'from-red-400 to-rose-500'
  },
  {
    id: 7,
    icon: Palette,
    title: 'Digital Art',
    description: 'Creating illustrations and UI experiments',
    color: 'from-pink-400 to-purple-500'
  },
  {
    id: 8,
    icon: Gamepad2,
    title: 'Gaming',
    description: 'Strategy games and indie titles',
    color: 'from-violet-400 to-indigo-500'
  }
];

export function InterestsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4">Beyond the Code</h2>
          <p className="text-gray-600">Hobbies and interests that inspire creativity</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {interests.map((interest, index) => (
            <motion.div
              key={interest.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group"
            >
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 h-full flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${interest.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <interest.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="mb-2 text-sm md:text-base">{interest.title}</h4>
                <p className="text-xs md:text-sm text-gray-600">{interest.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
