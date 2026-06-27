import { products, type Product } from "@/data/products";
import { getInstallationPrice } from "@/data/installation";
import type { QuoteLineItem } from "@/context/QuoteContext";
import type { PackageItemSpec } from "@/data/quotePackages";

function findProduct(productId: string): Product | undefined {
  return products.find((p) => p.id === productId);
}

function buildLineItem(
  product: Product,
  spec: PackageItemSpec
): QuoteLineItem {
  const channels =
    spec.channels ??
    product.channelOptions?.[0]?.channels ??
    undefined;

  const colorId =
    spec.colorId ?? product.colorVariants?.[0]?.id ?? undefined;

  const colorVariant = product.colorVariants?.find((v) => v.id === colorId);

  const unitPrice = product.channelOptions
    ? product.channelOptions.find((o) => o.channels === channels)?.price ??
      product.price
    : product.price;

  const image =
    colorVariant?.images?.[channels ?? 1] ??
    colorVariant?.image ??
    product.image;

  return {
    id: crypto.randomUUID(),
    productId: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    quantity: spec.quantity,
    unitPrice,
    channels,
    colorId,
    colorLabel: colorVariant?.label,
    image,
    installationPrice: getInstallationPrice(product),
    includeInstallation: false,
  };
}

export function buildItemsFromPackageSpecs(
  specs: PackageItemSpec[]
): QuoteLineItem[] {
  const items: QuoteLineItem[] = [];

  for (const spec of specs) {
    const product = findProduct(spec.productId);
    if (!product) continue;
    items.push(buildLineItem(product, spec));
  }

  return items;
}