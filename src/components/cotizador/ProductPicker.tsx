"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, X, Check } from "lucide-react";
import { products, categories, type Product } from "@/data/products";
import { hasInstallationOption } from "@/data/installation";
import { useQuote } from "@/context/QuoteContext";
import { formatCOP } from "@/lib/quote";

export default function ProductPicker() {
  const { addProduct } = useQuote();
  const [filter, setFilter] = useState("all");
  const [configProduct, setConfigProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedChannels, setSelectedChannels] = useState(1);
  const [addedFlash, setAddedFlash] = useState<string | null>(null);

  const filtered =
    filter === "all" ? products : products.filter((p) => p.category === filter);

  const openConfig = (product: Product) => {
    setConfigProduct(product);
    setSelectedColor(product.colorVariants?.[0]?.id ?? "");
    setSelectedChannels(product.channelOptions?.[0]?.channels ?? 1);
  };

  const getUnitPrice = (p: Product) => {
    if (p.channelOptions) {
      return p.channelOptions.find((o) => o.channels === selectedChannels)?.price ?? p.price;
    }
    return p.price;
  };

  const getDisplayImage = (p: Product): string | undefined => {
    if (!p.colorVariants?.length) return p.image;
    const variant = p.colorVariants.find((v) => v.id === selectedColor);
    return variant?.images?.[selectedChannels] ?? variant?.image ?? p.image;
  };

  const resolveOptions = (product: Product, fromModal: boolean) => {
    const channels = product.channelOptions
      ? fromModal
        ? selectedChannels
        : product.channelOptions[0].channels
      : undefined;

    const colorId = product.colorVariants?.length
      ? fromModal
        ? selectedColor
        : product.colorVariants[0].id
      : undefined;

    const colorVariant = product.colorVariants?.find((v) => v.id === colorId);
    const unitPrice = product.channelOptions
      ? product.channelOptions.find((o) => o.channels === channels)?.price ?? product.price
      : product.price;

    const image =
      colorVariant?.images?.[channels ?? 1] ??
      colorVariant?.image ??
      product.image;

    return { channels, colorId, colorLabel: colorVariant?.label, unitPrice, image };
  };

  const handleAdd = (product: Product, fromModal = false) => {
    if ((product.channelOptions || product.colorVariants) && !fromModal) {
      openConfig(product);
      return;
    }

    const opts = resolveOptions(product, fromModal);

    addProduct(product, {
      unitPrice: opts.unitPrice,
      channels: opts.channels,
      colorId: opts.colorId,
      colorLabel: opts.colorLabel,
      image: opts.image,
    });

    setAddedFlash(product.id);
    setTimeout(() => setAddedFlash(null), 1200);
    setConfigProduct(null);
  };

  const confirmAddFromModal = () => {
    if (!configProduct) return;
    handleAdd(configProduct, true);
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="font-[var(--font-display)] text-lg font-bold mb-1">Catalogo de productos</h3>
        <p className="text-sm text-zinc-500">Haz clic en + para agregar a tu cotizacion</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              filter === cat.id
                ? "bg-gradient-brand text-zinc-950 border-transparent"
                : "bg-transparent text-zinc-400 border-white/[0.08] hover:border-[var(--accent)]/30 hover:text-white"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((product) => {
          const installAvailable = hasInstallationOption(product);
          const isFlashing = addedFlash === product.id;
          const thumbSrc =
            product.image ??
            product.colorVariants?.[0]?.images?.[1] ??
            product.colorVariants?.[0]?.image;

          return (
            <div
              key={product.id}
              className={`premium-card flex flex-col overflow-hidden transition-all ${
                isFlashing ? "ring-2 ring-[var(--accent)]/40" : ""
              }`}
            >
              <div className="relative h-32 w-full bg-zinc-900/80 border-b border-white/[0.04] flex items-center justify-center">
                {thumbSrc ? (
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <Image
                      src={thumbSrc}
                      alt={product.name}
                      width={120}
                      height={120}
                      className="max-h-[88px] w-auto h-auto object-contain"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-[var(--accent)]/40 font-medium">IoT</span>
                )}
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h4 className="text-sm font-semibold leading-snug line-clamp-2 text-left">
                  {product.name}
                </h4>

                <p className="text-base font-bold font-[var(--font-display)] text-gradient mt-2 text-left">
                  {formatCOP(product.price)}
                </p>

                {installAvailable && (
                  <span className="inline-flex self-start mt-2 text-[10px] font-medium text-[var(--accent)]/80 bg-[var(--accent)]/8 px-2 py-0.5 rounded-md border border-[var(--accent)]/15">
                    Instalacion disponible
                  </span>
                )}

                <div className="mt-auto pt-4 flex justify-end">
                  <button
                    onClick={() =>
                      product.channelOptions || product.colorVariants
                        ? openConfig(product)
                        : handleAdd(product)
                    }
                    className="w-10 h-10 rounded-xl bg-gradient-brand text-zinc-950 flex items-center justify-center transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] cursor-pointer"
                    aria-label={`Agregar ${product.name}`}
                  >
                    {isFlashing ? <Check size={16} /> : <Plus size={16} />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {configProduct && (
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setConfigProduct(null)}
        >
          <div
            className="relative w-full max-w-md glass border border-white/[0.08] rounded-[var(--radius-lg)] shadow-[0_24px_80px_rgba(0,0,0,0.6)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setConfigProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-white/[0.08] text-zinc-400 hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>

            <h3 className="font-[var(--font-display)] text-lg font-bold mb-1 pr-8">{configProduct.name}</h3>
            <p className="text-sm text-zinc-500 mb-5">Configura las opciones antes de agregar</p>

            {configProduct.channelOptions && (
              <div className="mb-4">
                <span className="text-xs text-zinc-500 font-medium block mb-2">Canales</span>
                <div className="flex gap-2">
                  {configProduct.channelOptions.map((opt) => (
                    <button
                      key={opt.channels}
                      onClick={() => setSelectedChannels(opt.channels)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                        selectedChannels === opt.channels
                          ? "bg-[var(--accent)] border-[var(--accent)] text-zinc-950"
                          : "border-white/[0.08] text-zinc-400 hover:border-[var(--accent)]/40"
                      }`}
                    >
                      {opt.channels}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {configProduct.colorVariants && configProduct.colorVariants.length > 0 && (
              <div className="mb-5">
                <span className="text-xs text-zinc-500 font-medium block mb-2">Color</span>
                <div className="flex items-center gap-2">
                  {configProduct.colorVariants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedColor(v.id)}
                      title={v.label}
                      className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                        selectedColor === v.id
                          ? "border-[var(--accent)] scale-110"
                          : "border-white/[0.1]"
                      }`}
                      style={{ backgroundColor: v.hex }}
                    />
                  ))}
                  <span className="text-xs text-zinc-400 ml-1">
                    {configProduct.colorVariants.find((v) => v.id === selectedColor)?.label}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <span className="text-xl font-bold font-[var(--font-display)] text-gradient">
                {formatCOP(getUnitPrice(configProduct))}
              </span>
              <button
                onClick={confirmAddFromModal}
                className="btn-primary cursor-pointer"
              >
                <Plus size={16} />
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}