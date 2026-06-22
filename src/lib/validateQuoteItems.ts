import type { QuoteLineItem } from "@/context/QuoteContext";
import { products } from "@/data/products";
import { getInstallationPrice } from "@/data/installation";
import {
  buildCustomerInfo,
  validateQuoteCustomer,
  type QuoteCustomerInfo,
} from "@/lib/quoteCustomer";

export const MAX_QUOTE_ITEMS = 30;
export const MAX_QUOTE_BODY_BYTES = 300_000;

function resolveUnitPrice(
  product: (typeof products)[number],
  channels?: number,
): number | null {
  if (product.channelOptions?.length) {
    const option = product.channelOptions.find((o) => o.channels === channels);
    return option?.price ?? null;
  }
  return product.price;
}

export function sanitizeQuoteItems(raw: QuoteLineItem[]): QuoteLineItem[] | null {
  if (!Array.isArray(raw) || !raw.length || raw.length > MAX_QUOTE_ITEMS) return null;

  const sanitized: QuoteLineItem[] = [];

  for (const item of raw) {
    if (!item?.productId || typeof item.quantity !== "number") return null;

    const product = products.find((p) => p.id === item.productId);
    if (!product) return null;

    const quantity = Math.min(99, Math.max(1, Math.floor(item.quantity)));
    const channels = product.channelOptions ? item.channels : undefined;
    const unitPrice = resolveUnitPrice(product, channels);
    if (unitPrice === null) return null;

    if (product.colorVariants?.length) {
      const validColor = product.colorVariants.some((c) => c.id === item.colorId);
      if (!validColor) return null;
    }

    const colorLabel = product.colorVariants?.find((c) => c.id === item.colorId)?.label;
    const installationPrice = getInstallationPrice(product);

    sanitized.push({
      id: String(item.id || crypto.randomUUID()),
      productId: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      quantity,
      unitPrice,
      channels,
      colorId: item.colorId,
      colorLabel,
      image: item.image?.startsWith("/") ? item.image : product.image,
      installationPrice,
      includeInstallation: Boolean(
        item.includeInstallation && installationPrice !== null
      ),
    });
  }

  return sanitized;
}

export function parseQuoteCustomer(raw: QuoteCustomerInfo): QuoteCustomerInfo | null {
  const validation = validateQuoteCustomer(raw.name, raw.phone);
  if (!validation.valid) return null;
  return buildCustomerInfo(raw);
}