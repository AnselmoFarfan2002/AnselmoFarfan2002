export default function AboutSection() {
  return (
    <div className="grid gap-16 border-t border-white/10 py-16 md:grid-cols-3">
      <section id="about" className="md:col-span-1">
        <p className="text-sm uppercase tracking-[0.25em] text-neutral-300">
          About
        </p>
        <h3 className="mt-4 text-2xl font-semibold gradient">
          Engineer with product sense
        </h3>
      </section>

      <section className="md:col-span-2">
        <p className="max-w-3xl text-base leading-8 text-neutral-400 md:text-lg">
          I enjoy working across the stack, from building polished user
          interfaces to designing APIs, data flows, and scalable backend
          services. My goal is always the same: make the product feel
          effortless for users while keeping the codebase solid for teams.
        </p>
      </section>
    </div>
  );
}
