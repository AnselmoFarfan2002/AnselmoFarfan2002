import Link from "next/link";
import TextLink from "../../_components/text-link";

const CHALLENGES = [
  {
    title: "Infinity Scroll",
    description:
      "A simple infinite scroll implementation using IntersectionObserver.",
    url: "infinity-scroll",
  },
];

export default function Page() {
  return (
    <div className="space-y-8 h-full py-8">
      <h2 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight gradient md:text-7xl gradient">
        Challenges
      </h2>
      <div className="grid md:grid-cols-2">
        {CHALLENGES.map((challenge, i) => (
          <div
            key={challenge.url}
            className="rounded-2xl border p-12 border-white/10 bg-white/5 space-y-4"
          >
            <h3 className="text-xl font-semibold gradient md:text-2xl">
              #{i + 1} {challenge.title}
            </h3>
            <p className="text-base leading-8 text-neutral-400">
              {challenge.description}
            </p>
            <TextLink href={`/projects/challenges/${challenge.url}`}>
              Take a look
            </TextLink>
          </div>
        ))}
      </div>
    </div>
  );
}
