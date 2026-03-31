import { Project, projects } from "../_utils/portfolio-data";

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group rounded-4xl border border-white/10 bg-white/3 p-6 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/5">
      <div className="flex items-start justify-between gap-4">
        <h4 className="text-xl font-medium text-white">{project.title}</h4>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-400 text-nowrap">
          Case Study
        </span>
      </div>
      <p className="mt-5 text-sm leading-7 text-neutral-400">
        {project.description}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <span
            key={item}
            className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-neutral-300"
          >
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="border-t border-white/10 py-16">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-neutral-300">
            Selected Work
          </p>
          <h3 className="mt-3 text-3xl font-semibold gradient md:text-4xl">
            Projects
          </h3>
        </div>
        <p className="max-w-xl text-sm leading-7 text-neutral-400">
          A few examples of product, platform, and tooling work across frontend
          and backend systems.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}
