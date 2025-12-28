import raw from './portfolio.json';
import * as Icons from 'lucide-react';

type IconType = any;

const iconMap: Record<string, IconType> = {
  Trophy: Icons.Trophy,
  Star: Icons.Star,
  TrendingUp: Icons.TrendingUp,
  Users: Icons.Users,
  Code: Icons.Code,
  Award: Icons.Award,
  GraduationCap: Icons.GraduationCap,
  BookOpen: Icons.BookOpen
};

export const hero = raw.hero;
export const navItems = raw.navItems;

export const achievements = (raw.achievements || []).map((a: any) => ({
  ...a,
  icon: iconMap[a.icon] || Icons.Trophy
}));

export const projects = raw.projects || [];

export const skills = raw.skills || [];

export const experiences = raw.experiences || [];

export const education = (raw.education || []).map((e: any) => ({
  ...e,
  icon: iconMap[e.icon] || Icons.GraduationCap
}));

export const certifications = (raw.certifications || []).map((c: any) => ({
  ...c,
  icon: iconMap[c.icon] || Icons.Award
}));

export const testimonials = raw.testimonials || [];

export const blogPosts = raw.blogPosts || [];

export const contact = raw.contact || {};

export default raw;
