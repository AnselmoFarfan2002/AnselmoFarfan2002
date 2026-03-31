import { navLinks } from "../home/_utils/portfolio-data";

export default function PortfolioHeader() {
  return (
    <header className="flex items-center justify-between border-b border-white/10 pb-5">
      <div className="flex gap-4 items-center">
        <div className="h-12 w-12 overflow-clip rounded-full">
          <img
            className="w-full h-full object-cover"
            src={"https://avatars.githubusercontent.com/u/116023956"}
            height={50}
          ></img>
        </div>
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-300">
            Portfolio
          </p>
          <h1 className="text-lg font-medium text-neutral-100">
            Anselmo Farfan
          </h1>
        </div>
      </div>
      <nav className="hidden gap-8 text-sm text-neutral-400 md:flex">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="transition hover:text-white"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
