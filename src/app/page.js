import Cover from "@/sections/home/cover";
import Projects from "@/sections/home/projects/projects";
import Skills from "@/sections/home/skills/skills";

export const metadata = {
  title: "Anselmo Farfan",
};

export default function Home() {
  return (
    <main>
      <Cover />
      <div className="section-divider" />
      <Skills />
      <div className="section-divider" />
      <Projects />
    </main>
  );
}
