/**
 * FooterSection.tsx
 * Site footer component.
 * - Renders contact info, quick links, and social icons.
 * - Keeps a small `socialLinks` array for icon/link metadata.
 * - Uses `motion` for subtle entrance/hover animations.
 */
import { motion } from 'motion/react';
import { Heart, Github, Linkedin, Mail, Twitter, Phone, MapPin, Link as LinkIcon } from 'lucide-react';
import { hero, navItems, contact } from '../data';

export function FooterSection() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [] as { icon: any; href: string; label: string }[];

  // Add any social links from hero.links dynamically
  Object.entries(hero.links || {}).forEach(([key, url]) => {
    const k = String(key).toLowerCase();
    const icon = k === 'linkedin' ? Linkedin : k === 'github' ? Github : k === 'twitter' ? Twitter : LinkIcon;
    const label = k === 'linkedin' ? 'LinkedIn' : k === 'github' ? 'GitHub' : k === 'twitter' ? 'Twitter' : key;
    if (url) socialLinks.push({ icon, href: url as string, label });
  });

  // Add contact links if provided
  if (contact?.email) socialLinks.push({ icon: Mail, href: `mailto:${contact.email}`, label: 'Email' });
  if (contact?.phone) socialLinks.push({ icon: Phone, href: `tel:${contact.phone}`, label: 'Phone' });

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
              <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                {hero?.name ?? 'Your Name'}
              </h3>
              <p className="text-gray-400 text-sm">
                {hero?.title ?? 'Full Stack Developer passionate about creating beautiful, functional web experiences.'}
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {(navItems || []).map((item: any) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-white mb-4">Get in Touch</h4>
              <p className="text-gray-400 text-sm mb-4">
                Feel free to reach out for collaborations or just a friendly hello.
              </p>
              {contact?.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                >
                  {contact.email}
                </a>
              )}
            </motion.div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-8" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-400 text-sm flex items-center gap-2"
            >
              Made with <Heart className="w-4 h-4 text-red-500" /> by {hero?.name ?? 'You'} © {currentYear}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4"
            >
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 rounded-full flex items-center justify-center transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
