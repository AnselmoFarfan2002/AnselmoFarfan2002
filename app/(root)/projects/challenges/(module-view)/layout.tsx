import TextLink from "@/app/(root)/_components/text-link";
import { PropsWithChildren } from "react";

export default function Layout(props: PropsWithChildren) {
  return (
    <div className="space-y-4 py-8">
      <TextLink href="/projects/challenges">Go back</TextLink>
      {props.children}
    </div>
  );
}
