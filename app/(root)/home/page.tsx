import AboutSection from "./_components/about-section";
import ContactSection from "./_components/contact-section";
import HeroSection from "./_components/hero-section";
import PortfolioHeader from "./_components/portfolio-header";
import ProjectsSection from "./_components/projects-section";
import SkillsSection from "./_components/skills-section";

export default function PortfolioClean() {
  return (
    <main className="min-h-screen text-neutral-100">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-6 py-8 md:px-10 lg:px-16">
        <PortfolioHeader />
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </section>
    </main>
  );
}
