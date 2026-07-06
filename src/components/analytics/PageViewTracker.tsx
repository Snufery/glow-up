"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initAnalytics, trackEvent } from "@/lib/analytics/track";

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const query = searchParams.toString();
    const fullPath = query ? `${pathname}?${query}` : pathname;

    if (lastPath.current === fullPath) return;
    lastPath.current = fullPath;

    if (pathname.startsWith("/admin")) return;

    trackEvent("page_view", { path: fullPath });
  }, [pathname, searchParams]);

  return null;
}