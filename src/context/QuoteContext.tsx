"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";
import { getInstallationPrice } from "@/data/installation";
import { calcQuoteTotals, lineKey } from "@/lib/quote";

export interface QuoteLineItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  channels?: number;
  colorId?: string;
  colorLabel?: string;
  image?: string;
  installationPrice: number | null;
  includeInstallation: boolean;
}

interface AddProductOptions {
  channels?: number;
  colorId?: string;
  colorLabel?: string;
  image?: string;
  unitPrice: number;
}

interface QuoteContextValue {
  items: QuoteLineItem[];
  totals: ReturnType<typeof calcQuoteTotals>;
  mobileCartOpen: boolean;
  setMobileCartOpen: (open: boolean) => void;
  openMobileCart: () => void;
  addProduct: (product: Product, options: AddProductOptions) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleInstallation: (id: string) => void;
  clearQuote: () => void;
}

const QuoteContext = createContext<QuoteContextValue | null>(null);
const STORAGE_KEY = "glowup-quote-v1";

function loadStoredItems(): QuoteLineItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as QuoteLineItem[]) : [];
  } catch {
    return [];
  }
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteLineItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  const openMobileCart = useCallback(() => setMobileCartOpen(true), []);

  useEffect(() => {
    setItems(loadStoredItems());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addProduct = useCallback((product: Product, options: AddProductOptions) => {
    const installationPrice = getInstallationPrice(product);
    const key = lineKey({
      productId: product.id,
      channels: options.channels,
      colorId: options.colorId,
    });

    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          lineKey({
            productId: i.productId,
            channels: i.channels,
            colorId: i.colorId,
          }) === key
      );

      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      const newItem: QuoteLineItem = {
        id: crypto.randomUUID(),
        productId: product.id,
        slug: product.slug,
        name: product.name,
        category: product.category,
        quantity: 1,
        unitPrice: options.unitPrice,
        channels: options.channels,
        colorId: options.colorId,
        colorLabel: options.colorLabel,
        image: options.image,
        installationPrice,
        includeInstallation: false,
      };

      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }, []);

  const toggleInstallation = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id || i.installationPrice === null) return i;
        return { ...i, includeInstallation: !i.includeInstallation };
      })
    );
  }, []);

  const clearQuote = useCallback(() => {
    setItems([]);
  }, []);

  const totals = useMemo(() => calcQuoteTotals(items), [items]);

  const value = useMemo(
    () => ({
      items,
      totals,
      mobileCartOpen,
      setMobileCartOpen,
      openMobileCart,
      addProduct,
      removeItem,
      updateQuantity,
      toggleInstallation,
      clearQuote,
    }),
    [
      items,
      totals,
      mobileCartOpen,
      openMobileCart,
      addProduct,
      removeItem,
      updateQuantity,
      toggleInstallation,
      clearQuote,
    ]
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used within QuoteProvider");
  return ctx;
}