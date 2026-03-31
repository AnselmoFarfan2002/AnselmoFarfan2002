import PortfolioHeader from "./_components/portfolio-header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dark-scroll from-black to-[#033e47] bg-linear-210 overflow-y-scroll scroll-smooth h-dvh w-dvw">
      <main className="min-h-screen text-neutral-100">
        <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 md:px-10 lg:px-16">
          <PortfolioHeader />
          {children}
        </section>
      </main>
    </div>
  );
}
