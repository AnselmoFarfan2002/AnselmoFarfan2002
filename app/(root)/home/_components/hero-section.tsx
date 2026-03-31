import classNames from "classnames";
import { stats } from "../_utils/portfolio-data";

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-4xl border border-white/10 bg-white/3 p-6">
      <p className="text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-neutral-400">{label}</p>
    </div>
  );
}

export default function HeroSection() {
  return (
    <div className="grid items-end gap-12 py-16 md:grid-cols-[1.35fr_0.85fr] md:py-24">
      <div>
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-neutral-300">
          Fullstack Engineer
        </p>
        <h2 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-white md:text-7xl gradient">
          Building simple, fast, and reliable products.
        </h2>
        <p className="mt-8 max-w-2xl text-base leading-8 text-neutral-400 md:text-lg">
          I design and ship scalable web applications across frontend and
          backend, with a strong focus on product thinking, clean interfaces,
          and maintainable systems.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#projects"
            className={classNames(
              "rounded-2xl px-6 py-3 text-sm uppercase transition hover:-translate-y-0.5",
              "bg-linear-90 from-sky-500 to-sky-700 text-white text-shadow-md font-bold",
            )}
          >
            Projects
          </a>
          <a
            href="#contact"
            className="rounded-2xl border border-white/15 px-6 py-3 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/5"
          >
            Let&apos;s Talk
          </a>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="rounded-4xl border border-white/10 bg-white/3 p-6 backdrop-blur">
          <p className="text-sm text-neutral-400">Currently focused on</p>
          <p className="mt-3 text-2xl font-medium text-white">
            Product-driven engineering
          </p>
          <p className="mt-4 text-sm leading-7 text-neutral-400">
            Turning complex workflows into intuitive tools through modern
            frontend systems and dependable backend architecture.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </div>
  );
}
