export type Project = {
  title: string;
  description: string;
  stack: string[];
  url?: string;
};

export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export const projects: Project[] = [
  {
    title: "Mini-Projects",
    description:
      "A set of mini projects to practice various specific frontend use cases. Like Infinity Scroll, Drag and Drop, and more.",
    stack: ["React", "TypeScript"],
    url: "/projects/challenges",
  },
  // {
  //   title: "E-commerce Dashboard",
  //   description:
  //     "Designed and developed an analytics dashboard with real-time sales metrics, role-based access, and order monitoring.",
  //   stack: ["Next.js", "Prisma", "Tailwind", "Redis"],
  // },
  // {
  //   title: "Media Processing Tool",
  //   description:
  //     "Created a browser-based tool for video editing workflows with overlays, background removal, and export controls.",
  //   stack: ["React", "WebGL", "FFmpeg", "TypeScript"],
  // },
];

export const skills = [
  "Frontend Architecture",
  "Backend Systems",
  "API Design",
  // "Database Modeling",
  // "Cloud Deployments",
  "Performance Optimization",
];

export const stats = [
  {
    value: `${new Date().getFullYear() - 2024}+`,
    label: "Years of experience",
  },
  // { value: "20+", label: "Projects launched" },
];
