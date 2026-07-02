import type { Product } from "./products";

/** Tarifas de instalación por producto (COP). null = sin instalación disponible. */
const INSTALLATION_BY_SLUG: Record<string, number> = {
  "interruptor-inteligente-wifi": 15000,
  "imou-ranger": 50000,
  "camara-imou-cruiser-sc-4k": 50000,
  "camara-imou-cruiser-dual-10mp": 50000,
  "camara-imou-cruiser-triple-11mp": 50000,
  "videoportero-ezviz-hp7": 80000,
  "videoportero-ezviz-hp7-pro-4k": 80000,
};

export function getInstallationPrice(product: Product): number | null {
  return INSTALLATION_BY_SLUG[product.slug] ?? null;
}

export function hasInstallationOption(product: Product): boolean {
  return getInstallationPrice(product) !== null;
}