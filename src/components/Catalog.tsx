"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  X,
  ShoppingBag,
  MessageCircle,
  LayoutGrid,
  Lightbulb,
  Shield,
  SlidersHorizontal,
  Radio,
  Zap,
  Check,
  type LucideIcon,
} from "lucide-react";

const categoryIcons: Record<string, LucideIcon> = {
  all: LayoutGrid,
  iluminacion: Lightbulb,
  seguridad: Shield,
  control: SlidersHorizontal,
  sensores: Radio,
  energia: Zap,
};
import { products, categories, type Product } from "@/data/products";
import {
  getProductImageBackground,
  getProductImageBackgroundColor,
  getProductImageFit,
  getProductImagePadding,
  shouldShowImageOverlay,
} from "@/lib/productImageDisplay";
import { productIcons } from "./ProductIcons";

export default function Catalog() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const [selectedChannels, setSelectedChannels] = useState<Record<string, number>>({});
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [portalReady, setPortalReady] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!modalProduct) return;

    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";

    overlayRef.current?.scrollTo({ top: 0 });

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [modalProduct]);

  useEffect(() => {
    if (!modalProduct) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeProductModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalProduct]);

  const openProductModal = (product: Product) => {
    setModalProduct(product);
  };

  const closeProductModal = () => {
    setModalProduct(null);
  };

  const filtered = activeFilter === "all" ? products : products.filter((p) => p.category === activeFilter);

  const getSelectedColor = (p: Product) =>
    selectedColors[p.id] || p.colorVariants?.[0]?.id || "";

  const getSelectedChannels = (p: Product) =>
    selectedChannels[p.id] || p.channelOptions?.[0]?.channels || 1;

  const getDisplayImage = (p: Product): string | null => {
    const colorId = getSelectedColor(p);
    const channels = getSelectedChannels(p);
    const variant = p.colorVariants?.find((v) => v.id === colorId);
    return variant?.images?.[channels] ?? variant?.image ?? p.image ?? null;
  };

  const getCurrentPrice = (p: Product) => {
    if (!p.channelOptions) return p.priceFormatted;
    const ch = getSelectedChannels(p);
    return p.channelOptions.find((o) => o.channels === ch)?.priceFormatted ?? p.priceFormatted;
  };

  const scrollToContact = (p: Product) => {
    const colorLabel = p.colorVariants?.find((v) => v.id === getSelectedColor(p))?.label;
    const channels = p.channelOptions ? getSelectedChannels(p) : null;

    let msg = `Hola, me interesa el producto: ${p.name}`;
    if (channels) msg += ` de ${channels} canal${channels > 1 ? "es" : ""}`;
    if (colorLabel) msg += ` en color ${colorLabel}`;
    msg += `. Precio: ${getCurrentPrice(p)}`;

    const servicio = document.getElementById("servicio") as HTMLSelectElement | null;
    const mensaje = document.getElementById("mensaje") as HTMLTextAreaElement | null;
    if (servicio) servicio.value = "producto";
    if (mensaje) mensaje.value = msg;
    closeProductModal();
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="catalogo" className="py-28 relative">
      <div className="absolute inset-0 bg-zinc-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(43,188,179,0.06),transparent)]" />

      <div className="relative max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="section-badge mb-5">Catalogo</span>
          <h2 className="font-[var(--font-display)] text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight tracking-tight">
            Productos <span className="text-gradient">domoticos</span> seleccionados
          </h2>
          <p className="text-zinc-400 mt-4 text-base">
            Los mejores dispositivos para hacer tu hogar o negocio mas inteligente
          </p>
        </div>

        <div className="glass rounded-2xl p-3 mb-12 max-w-3xl mx-auto">
          <div className="flex justify-center gap-2 flex-wrap">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.id];
              const isActive = activeFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-brand text-zinc-950 border-transparent shadow-[0_0_20px_rgba(43,188,179,0.25)]"
                      : "bg-transparent text-zinc-400 border-transparent hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {Icon && <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />}
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {filtered.map((product) => {
            const displayImage = getDisplayImage(product);
            const currentPrice = getCurrentPrice(product);
            const selectedColor = getSelectedColor(product);
            const selectedCh = getSelectedChannels(product);
            const imageBackground = getProductImageBackground(product, selectedColor);
            const imageBgColor = getProductImageBackgroundColor(product, selectedColor);
            const imageFit = getProductImageFit(product);
            const imagePadding = getProductImagePadding(product, imageBackground);

            return (
              <div
                key={product.id}
                onClick={() => openProductModal(product)}
                className="premium-card group cursor-pointer flex flex-col"
              >
                {product.badge && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-lg text-[0.65rem] font-bold uppercase tracking-wider bg-zinc-950/90 backdrop-blur-md text-[var(--accent-bright)] border border-[var(--accent)]/35 z-[2] shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                    {product.badge}
                  </div>
                )}

                <div
                  className={`aspect-[5/4] min-h-[220px] flex items-center justify-center relative overflow-hidden ${
                    imageBackground === "white" ? "ring-1 ring-inset ring-zinc-300/15" : ""
                  }`}
                  style={{ backgroundColor: imageBgColor }}
                >
                  {displayImage ? (
                    <>
                      <Image
                        src={displayImage}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={`transition-transform duration-500 group-hover:scale-[1.03] ${
                          imageFit === "cover" ? "object-cover" : `object-contain ${imagePadding}`
                        }`}
                      />
                      {shouldShowImageOverlay(imageBackground) && (
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      )}
                    </>
                  ) : (
                    <div className="w-20 h-20 opacity-50 text-[var(--accent)] transition-transform group-hover:scale-110">
                      {productIcons[product.slug] || productIcons["default"]}
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">
                    {product.category}
                  </span>
                  <h3 className="font-[var(--font-display)] text-base font-bold mt-2 mb-2 group-hover:text-[var(--accent-bright)] transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed mb-4 line-clamp-2 flex-1">
                    {product.description}
                  </p>

                  {product.channelOptions && (
                    <div className="mb-4" onClick={(e) => e.stopPropagation()}>
                      <span className="text-xs text-zinc-500 font-medium block mb-2">Canales:</span>
                      <div className="flex gap-2">
                        {product.channelOptions.map((opt) => (
                          <button
                            key={opt.channels}
                            onClick={() =>
                              setSelectedChannels((prev) => ({ ...prev, [product.id]: opt.channels }))
                            }
                            className={`w-9 h-9 rounded-lg text-sm font-bold border transition-all cursor-pointer ${
                              selectedCh === opt.channels
                                ? "bg-[var(--accent)] border-[var(--accent)] text-zinc-950 shadow-[0_0_16px_rgba(43,188,179,0.3)]"
                                : "bg-transparent border-white/[0.08] text-zinc-400 hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
                            }`}
                          >
                            {opt.channels}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.colorVariants && product.colorVariants.length > 0 && (
                    <div className="flex items-center gap-3 mb-5" onClick={(e) => e.stopPropagation()}>
                      <span className="text-xs text-zinc-500 font-medium">Color:</span>
                      <div className="flex items-center gap-2">
                        {product.colorVariants.map((variant) => (
                          <button
                            key={variant.id}
                            onClick={() =>
                              setSelectedColors((prev) => ({ ...prev, [product.id]: variant.id }))
                            }
                            title={variant.label}
                            className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                              selectedColor === variant.id
                                ? "border-[var(--accent)] scale-110 shadow-[0_0_10px_rgba(43,188,179,0.4)]"
                                : "border-white/[0.1] hover:border-zinc-500"
                            }`}
                            style={{ backgroundColor: variant.hex }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-zinc-400">
                        {product.colorVariants.find((v) => v.id === selectedColor)?.label}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-white/[0.06]">
                    <span className="font-[var(--font-display)] text-xl font-bold text-gradient">
                      {currentPrice}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); scrollToContact(product); }}
                      className="btn-consultar cursor-pointer opacity-90 group-hover:opacity-100"
                    >
                      <MessageCircle size={14} />
                      Consultar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {portalReady &&
        modalProduct &&
        createPortal(
          <div
            ref={overlayRef}
            className="fixed inset-0 z-[1200] overflow-y-auto overscroll-contain bg-black/80 backdrop-blur-md"
            onClick={closeProductModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="catalog-product-title"
          >
            <div className="flex min-h-full items-start justify-center p-4 sm:p-6 pt-[88px] pb-8">
              <div
                className="relative w-full max-w-lg shrink-0 glass border border-white/[0.08] rounded-[var(--radius-lg)] shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeProductModal}
                  className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-900 border border-white/[0.08] text-zinc-400 hover:text-white hover:border-[var(--accent)]/30 transition-all cursor-pointer"
                  aria-label="Cerrar detalle del producto"
                >
                  <X size={18} />
                </button>

                {modalProduct.badge && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[0.7rem] font-semibold bg-[var(--accent)] text-zinc-950 z-10 tracking-wide">
                    {modalProduct.badge}
                  </div>
                )}

                <div
                  className={`h-[200px] sm:h-[260px] relative shrink-0 ${
                    getProductImageBackground(modalProduct, getSelectedColor(modalProduct)) === "white"
                      ? "ring-1 ring-inset ring-zinc-300/15"
                      : ""
                  }`}
                  style={{
                    backgroundColor: getProductImageBackgroundColor(
                      modalProduct,
                      getSelectedColor(modalProduct)
                    ),
                  }}
                >
                  {getDisplayImage(modalProduct) ? (
                    <Image
                      src={getDisplayImage(modalProduct)!}
                      alt={modalProduct.name}
                      fill
                      sizes="512px"
                      className={
                        getProductImageFit(modalProduct) === "cover"
                          ? "object-cover"
                          : `object-contain ${getProductImagePadding(
                              modalProduct,
                              getProductImageBackground(modalProduct, getSelectedColor(modalProduct))
                            )}`
                      }
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--accent)]">
                      <div className="w-24 h-24 opacity-60">
                        {productIcons[modalProduct.slug] || productIcons["default"]}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">
                    {modalProduct.category}
                  </span>
                  <h3
                    id="catalog-product-title"
                    className="font-[var(--font-display)] text-xl font-bold mt-2 mb-2"
                  >
                    {modalProduct.name}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-5">{modalProduct.description}</p>

                  {modalProduct.features && modalProduct.features.length > 0 && (
                    <ul className="mb-5 space-y-2">
                      {modalProduct.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                          <Check size={14} className="text-[var(--accent)] flex-shrink-0" strokeWidth={2.5} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  {modalProduct.channelOptions && (
                    <div className="mb-4">
                      <span className="text-xs text-zinc-500 font-medium block mb-2">Canales:</span>
                      <div className="flex gap-2">
                        {modalProduct.channelOptions.map((opt) => (
                          <button
                            key={opt.channels}
                            onClick={() =>
                              setSelectedChannels((prev) => ({ ...prev, [modalProduct.id]: opt.channels }))
                            }
                            className={`w-9 h-9 rounded-lg text-sm font-bold border transition-all cursor-pointer ${
                              getSelectedChannels(modalProduct) === opt.channels
                                ? "bg-[var(--accent)] border-[var(--accent)] text-zinc-950"
                                : "bg-transparent border-white/[0.08] text-zinc-400 hover:border-[var(--accent)]/40"
                            }`}
                          >
                            {opt.channels}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {modalProduct.colorVariants && modalProduct.colorVariants.length > 0 && (
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-xs text-zinc-500 font-medium">Color:</span>
                      <div className="flex items-center gap-2">
                        {modalProduct.colorVariants.map((variant) => (
                          <button
                            key={variant.id}
                            onClick={() =>
                              setSelectedColors((prev) => ({ ...prev, [modalProduct.id]: variant.id }))
                            }
                            title={variant.label}
                            className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                              getSelectedColor(modalProduct) === variant.id
                                ? "border-[var(--accent)] scale-110"
                                : "border-white/[0.1]"
                            }`}
                            style={{ backgroundColor: variant.hex }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-zinc-400">
                        {modalProduct.colorVariants.find((v) => v.id === getSelectedColor(modalProduct))?.label}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                    <span className="font-[var(--font-display)] text-2xl font-bold text-gradient">
                      {getCurrentPrice(modalProduct)}
                    </span>
                    <button
                      onClick={() => scrollToContact(modalProduct)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-950 bg-gradient-brand glow-cyan transition-all hover:-translate-y-0.5 cursor-pointer"
                    >
                      <ShoppingBag size={16} />
                      Consultar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}