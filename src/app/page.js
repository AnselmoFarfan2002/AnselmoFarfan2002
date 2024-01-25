import Footer from "@/components/footer";
import Cover from "@/sections/home/cover";
import Projects from "@/sections/home/projects/projects";
import Skills from "@/sections/home/skills/skills";
import RudderStackInitializer from "@/sections/rudderstack";
import Link from "next/link";

export const metadata = {
  title: "Anselmo Farfan",
};

export default function Home() {
  return (
    <>
      {/* <RudderStackInitializer /> */}
      <main>
        <Cover />
        <div className="section-divider" />
        <Projects />
        <div className="section-divider" />
        <Skills />
        <Footer />
      </main>
    </>
  );
}
