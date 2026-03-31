export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dark-scroll from-black to-[#033e47] bg-linear-210 overflow-y-scroll scroll-smooth h-dvh w-dvw">
      {children}
    </div>
  );
}
