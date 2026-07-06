"use client";

import { useTurnstile } from "@/hooks/useTurnstile";

export function useTurnstileField() {
  return useTurnstile();
}

export default function TurnstileField({
  turnstile,
}: {
  turnstile: ReturnType<typeof useTurnstile>;
}) {
  if (!turnstile.required) return null;

  return (
    <div className="space-y-2">
      <div ref={turnstile.containerRef} className="min-h-[65px] flex justify-center" />
      {turnstile.error && (
        <p className="text-xs text-red-400 text-center">{turnstile.error}</p>
      )}
    </div>
  );
}