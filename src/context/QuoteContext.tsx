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
  /** Producto agregado manualmente (no está en catálogo) */
  isCustom?: boolean;
  customDescription?: string;
  roomId?: string;
  roomLabel?: string;
}

interface AddCustomItemInput {
  name: string;
  unitPrice: number;
  description?: string;
}

interface AddProductOptions {
  channels?: number;
  colorId?: string;
  colorLabel?: string;
  image?: string;
  unitPrice: number;
  roomId?: string;
  roomLabel?: string;
}

interface QuoteContextValue {
  items: QuoteLineItem[];
  totals: ReturnType<typeof calcQuoteTotals>;
  mobileCartOpen: boolean;
  setMobileCartOpen: (open: boolean) => void;
  openMobileCart: () => void;
  addProduct: (product: Product, options: AddProductOptions) => void;
  addCustomItem: (input: AddCustomItemInput) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleInstallation: (id: string) => void;
  clearQuote: () => void;
  replaceItems: (items: QuoteLineItem[]) => void;
  applyPackageItems: (items: QuoteLineItem[]) => void;
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

  const addCustomItem = useCallback((input: AddCustomItemInput) => {
    const name = input.name.trim();
    if (!name) return;

    const unitPrice = Math.max(0, Math.floor(input.unitPrice));
    const key = `custom:${name.toLowerCase()}:${unitPrice}`;

    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.isCustom &&
          `custom:${i.name.toLowerCase()}:${i.unitPrice}` === key
      );

      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      const newItem: QuoteLineItem = {
        id: crypto.randomUUID(),
        productId: "custom",
        slug: "producto-personalizado",
        name,
        category: "custom",
        quantity: 1,
        unitPrice,
        installationPrice: null,
        includeInstallation: false,
        isCustom: true,
        customDescription: input.description?.trim() || undefined,
      };

      return [...prev, newItem];
    });
  }, []);

  const addProduct = useCallback((product: Product, options: AddProductOptions) => {
    const installationPrice = getInstallationPrice(product);
    const key = lineKey({
      productId: product.id,
      channels: options.channels,
      colorId: options.colorId,
      roomId: options.roomId,
    });

    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          lineKey({
            productId: i.productId,
            channels: i.channels,
            colorId: i.colorId,
            roomId: i.roomId,
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
        roomId: options.roomId,
        roomLabel: options.roomLabel,
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

  const replaceItems = useCallback((nextItems: QuoteLineItem[]) => {
    setItems(nextItems);
  }, []);

  const applyPackageItems = useCallback((packageItems: QuoteLineItem[]) => {
    setItems(packageItems);
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
      addCustomItem,
      removeItem,
      updateQuantity,
      toggleInstallation,
      clearQuote,
      replaceItems,
      applyPackageItems,
    }),
    [
      items,
      totals,
      mobileCartOpen,
      openMobileCart,
      addProduct,
      addCustomItem,
      removeItem,
      updateQuantity,
      toggleInstallation,
      clearQuote,
      replaceItems,
      applyPackageItems,
    ]
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used within QuoteProvider");
  return ctx;
}