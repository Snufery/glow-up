import Image from "next/image";
import type { Product } from "@/data/products";
import {
  getProductImageBackground,
  getProductImageBackgroundColor,
  getProductImageFit,
  getProductImagePadding,
  shouldShowImageOverlay,
} from "@/lib/productImageDisplay";

interface ProductImageFrameProps {
  product: Product;
  src?: string;
  alt: string;
  colorId?: string;
  className?: string;
  sizes?: string;
}

export default function ProductImageFrame({
  product,
  src,
  alt,
  colorId,
  className = "aspect-[5/4] min-h-[200px]",
  sizes = "(max-width: 640px) 100vw, 280px",
}: ProductImageFrameProps) {
  const imageBackground = getProductImageBackground(product, colorId);
  const imageBgColor = getProductImageBackgroundColor(product, colorId);
  const imageFit = getProductImageFit(product);
  const imagePadding = getProductImagePadding(product, imageBackground);

  return (
    <div
      className={`relative w-full overflow-hidden border-b border-white/[0.04] flex items-center justify-center ${
        imageBackground === "white" ? "ring-1 ring-inset ring-zinc-300/15" : ""
      } ${className}`}
      style={{ backgroundColor: imageBgColor }}
    >
      {src ? (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className={
              imageFit === "cover"
                ? "object-cover"
                : `object-contain ${imagePadding}`
            }
          />
          {shouldShowImageOverlay(imageBackground) && (
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 to-transparent pointer-events-none" />
          )}
        </>
      ) : (
        <span className="text-xs text-[var(--accent)]/40 font-medium">IoT</span>
      )}
    </div>
  );
}