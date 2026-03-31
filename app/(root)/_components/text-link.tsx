import classNames from "classnames";
import Link from "next/link";
import { HTMLAttributes } from "react";

export default function TextLink({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <Link
      {...props}
      className={classNames(
        "text-neutral-200 font-bold uppercase border-b border-white text-sm block w-fit",
        className,
      )}
    >
      {children}
    </Link>
  );
}
