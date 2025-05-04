"use client";

import Link, { useLinkStatus } from "next/link";

export const NavLink = ({
  href,
  content,
}: {
  href: string;
  content: React.ReactNode;
}) => {
  return <Link href={href}>{content}</Link>;
};

function LinkStatus() {
  const { pending } = useLinkStatus();
}
