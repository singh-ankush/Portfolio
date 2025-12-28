import { HeroSection } from './components/HeroSection';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ProjectsSection } from './components/ProjectsSection';
import { EducationSection } from './components/EducationSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { AchievementsSection } from './components/AchievementsSection';
import { BlogSection } from './components/BlogSection';
import { InterestsSection } from './components/InterestsSection';
import { ContactSection } from './components/ContactSection';
import { Navigation } from './components/Navigation';
import { FooterSection } from './components/FooterSection';
import { ScrollToTop } from './components/ScrollToTop';
import { ScrollProgress } from './components/ScrollProgress';
import { ChatWidget } from './components/ChatWidget';

/**
 * App.tsx
 * Root application component.
 * - Renders the page layout and top-level sections.
 * - Responsible for mounting global providers and layout wrappers.
 * - Keep this file focused on composition; individual sections
 *   (Hero, Skills, Projects, etc.) contain their own logic.
 */
export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <ScrollProgress />
      <Navigation />
      
      <div id="home">
        <HeroSection />
      </div>
      
      <SkillsSection />
      
      <div id="experience">
        <ExperienceSection />
      </div>
      
      <div id="projects">
        <ProjectsSection />
      </div>
      
      <AchievementsSection />
      
      <EducationSection />
      
      <TestimonialsSection />
      
      <div id="blog">
        <BlogSection />
      </div>
      
      <InterestsSection />
      
      <ContactSection />
      
      <FooterSection />
      
      <ScrollToTop />
      
      <ChatWidget />
    </div>
  );
}