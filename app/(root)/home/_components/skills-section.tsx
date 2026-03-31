import classNames from "classnames";
import { skills } from "../_utils/portfolio-data";
import { TechStackBadges } from "./tech-stack-badges";

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="grid gap-10 border-t border-white/10 py-16 md:grid-cols-2"
    >
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-400">
          Core Strengths
        </p>
        <h3 className="mt-3 text-3xl font-semibold md:text-4xl gradient">
          Technical Skills
        </h3>
      </div>

      <TechStackBadges />
    </section>
  );
}
