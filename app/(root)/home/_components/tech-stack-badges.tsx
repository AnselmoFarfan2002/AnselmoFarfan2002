import { PropsWithChildren } from "react";

const FRONT_END_SKILLS = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "Material UI",
  "HTML",
  "CSS",
];

const BACK_END_SKILLS = [
  "Node.js",
  "Express.js",
  "Nitro",
  "Prisma",
  "PostgreSQL",
  "Strapi",
  "FFMPEG",
  "Resend",
  "Digital Ocean",
  "Vercel",
  "Git",
  "Github",
];

export function TechStackBadges() {
  return (
    <div className="w-full gap-4 flex flex-wrap col-span-2">
      {FRONT_END_SKILLS.concat(BACK_END_SKILLS).map((skill) => (
        <Badge key={skill}>{skill}</Badge>
      ))}
    </div>
  );
}

function Badge(props: PropsWithChildren) {
  return (
    <span className=" border border-white/10 bg-white/5 px-3 py-1 rounded-2xl text-neutral-300 text-sm">
      {props.children}
    </span>
  );
}
