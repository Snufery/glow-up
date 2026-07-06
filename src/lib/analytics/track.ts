"use client";

import type { SiteEventMetadata, SiteEventType } from "./types";

const SESSION_KEY = "gu_analytics_session";
const QUEUE_KEY = "gu_analytics_queue";

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function getDevice(): string {
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function flushQueue(): void {
  const raw = sessionStorage.getItem(QUEUE_KEY);
  if (!raw) return;

  try {
    const queue = JSON.parse(raw) as unknown[];
    if (!Array.isArray(queue) || queue.length === 0) return;
    sessionStorage.removeItem(QUEUE_KEY);

    for (const item of queue) {
      void fetch("/api/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
        keepalive: true,
      });
    }
  } catch {
    sessionStorage.removeItem(QUEUE_KEY);
  }
}

function enqueue(payload: Record<string, unknown>): void {
  try {
    const raw = sessionStorage.getItem(QUEUE_KEY);
    const queue = raw ? (JSON.parse(raw) as unknown[]) : [];
    queue.push(payload);
    if (queue.length > 20) queue.shift();
    sessionStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // ignore storage errors
  }
}

export function trackEvent(
  eventType: SiteEventType,
  metadata?: SiteEventMetadata
): void {
  if (typeof window === "undefined") return;

  const payload = {
    eventType,
    path: window.location.pathname + window.location.search,
    metadata: metadata ?? {},
    sessionId: getSessionId(),
    device: getDevice(),
    referrer: document.referrer || undefined,
  };

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    const sent = navigator.sendBeacon("/api/analytics/event", blob);
    if (sent) return;
  }

  void fetch("/api/analytics/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => enqueue(payload));
}

export function initAnalytics(): void {
  if (typeof window === "undefined") return;
  flushQueue();
}