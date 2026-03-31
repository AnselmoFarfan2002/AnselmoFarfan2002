import classNames from "classnames";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="mb-10 rounded-[2.5rem] border border-white/10 bg-white/5 px-6 py-10 md:px-10 md:py-14"
    >
      <p className="text-sm uppercase tracking-[0.25em] text-neutral-300">
        Contact
      </p>
      <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-3xl font-semibold gradient md:text-4xl">
            Open to building ambitious products.
          </h3>
          <p className="mt-4 max-w-2xl text-base leading-8 text-neutral-400">
            Available for full-time roles, freelance collaborations, and
            product-focused engineering opportunities.
          </p>
        </div>
        <a
          href="mailto:anselmofarfan2002@gmail.com"
          className={classNames(
            "inline-flex rounded-2xl px-6 py-3 text-sm text-neutral-950 transition hover:-translate-y-0.5",
            "bg-linear-90 from-sky-500 to-sky-700 text-white text-shadow-xl uppercase font-bold",
          )}
        >
          Get in touch
        </a>
      </div>
    </section>
  );
}
