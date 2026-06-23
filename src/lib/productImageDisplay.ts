import type { Product } from "@/data/products";

export type ProductImageBackground = "white" | "black" | "dark";

const BACKGROUND_COLORS: Record<ProductImageBackground, string> = {
  white: "#ffffff",
  black: "#0a0a0a",
  dark: "#18181b",
};

/** Fondo de la tarjeta según el fondo de la foto del producto */
export function getProductImageBackground(
  product: Product,
  colorId?: string
): ProductImageBackground {
  if (product.imageBackground) return product.imageBackground;

  if (colorId === "blanco") return "black";
  if (colorId === "negro") return "white";

  return "dark";
}

export function getProductImageBackgroundColor(
  product: Product,
  colorId?: string
): string {
  return BACKGROUND_COLORS[getProductImageBackground(product, colorId)];
}

export function getProductImageFit(product: Product): "cover" | "contain" {
  return product.imageFit ?? "contain";
}

export function getProductImagePadding(
  product: Product,
  background: ProductImageBackground
): string {
  if (getProductImageFit(product) === "cover") return "p-0";
  if (background === "white" || background === "black") return "p-2 sm:p-3";
  return "p-4 sm:p-5";
}

export function shouldShowImageOverlay(background: ProductImageBackground): boolean {
  return background === "dark";
}

export function getProductThumbColorId(product: Product): string | undefined {
  return product.colorVariants?.[0]?.id;
}