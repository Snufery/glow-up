"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface RouteTransitionProps {
  children: ReactNode;
}

function getTransitionClass(pathname: string): string {
  if (pathname.startsWith("/admin")) return "route-enter-admin";
  return "route-enter";
}

export default function RouteTransition({ children }: RouteTransitionProps) {
  const pathname = usePathname();

  return (
    <div key={pathname} className={getTransitionClass(pathname)}>
      {children}
    </div>
  );
}