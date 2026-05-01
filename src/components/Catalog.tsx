"use client";

import { useState } from "react";
import Image from "next/image";
import { products, categories, type Product } from "@/data/products";
import { productIcons } from "./ProductIcons";

export default function Catalog() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const [selectedChannels, setSelectedChannels] = useState<Record<string, number>>({});
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

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
    setModalProduct(null);
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="catalogo" className="py-24 bg-[var(--bg-secondary)]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-[var(--green)] border border-[rgba(122,182,72,0.2)] bg-[rgba(122,182,72,0.06)] mb-5">
            Catalogo
          </span>
          <h2 className="font-[var(--font-display)] text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight tracking-tight">
            Productos <span className="text-gradient">domoticos</span> seleccionados
          </h2>
          <p className="text-[var(--text-secondary)] mt-4 text-base">
            Los mejores dispositivos para hacer tu hogar o negocio mas inteligente
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                activeFilter === cat.id
                  ? "bg-gradient-brand text-white border-transparent"
                  : "bg-transparent text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => {
            const displayImage = getDisplayImage(product);
            const currentPrice = getCurrentPrice(product);
            const selectedColor = getSelectedColor(product);
            const selectedCh = getSelectedChannels(product);

            return (
              <div
                key={product.id}
                onClick={() => setModalProduct(product)}
                className="relative rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden transition-all hover:border-[var(--border-hover)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] cursor-pointer"
                style={{ animation: "fadeInUp 0.4s ease-out forwards" }}
              >
                {product.badge && (
                  <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full text-[0.72rem] font-semibold bg-gradient-brand text-white z-[2] tracking-wide">
                    {product.badge}
                  </div>
                )}

                {/* Imagen */}
                <div
                  className="h-[240px] flex items-center justify-center border-b border-[var(--border)] relative overflow-hidden transition-colors duration-300"
                  style={{ backgroundColor: selectedColor === "blanco" ? "#000" : "#fff" }}
                >
                  {displayImage ? (
                    <Image
                      src={displayImage}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={product.imageFit === "cover" ? "object-cover" : "object-contain p-6"}
                    />
                  ) : (
                    <div className="w-20 h-20 opacity-70">
                      {productIcons[product.slug] || productIcons["default"]}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <span className="text-[0.72rem] font-semibold uppercase tracking-widest text-[var(--teal)]">
                    {product.category}
                  </span>
                  <h3 className="font-[var(--font-display)] text-base font-bold mt-2 mb-2">{product.name}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{product.description}</p>

                  {/* Selector de canales */}
                  {product.channelOptions && (
                    <div className="mb-4" onClick={(e) => e.stopPropagation()}>
                      <span className="text-xs text-[var(--text-muted)] font-medium block mb-2">Canales:</span>
                      <div className="flex gap-2">
                        {product.channelOptions.map((opt) => (
                          <button
                            key={opt.channels}
                            onClick={() =>
                              setSelectedChannels((prev) => ({ ...prev, [product.id]: opt.channels }))
                            }
                            className={`w-9 h-9 rounded-lg text-sm font-bold border-2 transition-all cursor-pointer ${
                              selectedCh === opt.channels
                                ? "bg-[var(--green)] border-[var(--green)] text-white shadow-[0_0_10px_rgba(122,182,72,0.4)]"
                                : "bg-transparent border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--green)] hover:text-[var(--green)]"
                            }`}
                          >
                            {opt.channels}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Selector de color */}
                  {product.colorVariants && product.colorVariants.length > 0 && (
                    <div className="flex items-center gap-3 mb-5" onClick={(e) => e.stopPropagation()}>
                      <span className="text-xs text-[var(--text-muted)] font-medium">Color:</span>
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
                                ? "border-[var(--green)] scale-110 shadow-[0_0_8px_rgba(122,182,72,0.4)]"
                                : "border-[var(--border)] hover:border-[var(--text-muted)]"
                            }`}
                            style={{ backgroundColor: variant.hex }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-[var(--text-secondary)]">
                        {product.colorVariants.find((v) => v.id === selectedColor)?.label}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="font-[var(--font-display)] text-xl font-bold text-gradient">
                      {currentPrice}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); scrollToContact(product); }}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-brand glow-green transition-all hover:-translate-y-0.5 cursor-pointer"
                    >
                      Consultar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {modalProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center pt-[72px] p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setModalProduct(null)}
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={() => setModalProduct(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all cursor-pointer"
            >
              ✕
            </button>

            {modalProduct.badge && (
              <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full text-[0.72rem] font-semibold bg-gradient-brand text-white z-10 tracking-wide">
                {modalProduct.badge}
              </div>
            )}

            {/* Imagen */}
            <div
              className="h-[280px] relative transition-colors duration-300"
              style={{ backgroundColor: getSelectedColor(modalProduct) === "blanco" ? "#000" : "#fff" }}
            >
              {getDisplayImage(modalProduct) ? (
                <Image
                  src={getDisplayImage(modalProduct)!}
                  alt={modalProduct.name}
                  fill
                  sizes="512px"
                  className={modalProduct.imageFit === "cover" ? "object-cover" : "object-contain p-8"}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-24 h-24 opacity-70">
                    {productIcons[modalProduct.slug] || productIcons["default"]}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6">
              <span className="text-[0.72rem] font-semibold uppercase tracking-widest text-[var(--teal)]">
                {modalProduct.category}
              </span>
              <h3 className="font-[var(--font-display)] text-xl font-bold mt-2 mb-2">{modalProduct.name}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">{modalProduct.description}</p>

              {/* Features */}
              {modalProduct.features && modalProduct.features.length > 0 && (
                <ul className="mb-5 space-y-2">
                  {modalProduct.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <span className="text-[var(--green)] font-bold">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              {/* Selector de canales */}
              {modalProduct.channelOptions && (
                <div className="mb-4">
                  <span className="text-xs text-[var(--text-muted)] font-medium block mb-2">Canales:</span>
                  <div className="flex gap-2">
                    {modalProduct.channelOptions.map((opt) => (
                      <button
                        key={opt.channels}
                        onClick={() => setSelectedChannels((prev) => ({ ...prev, [modalProduct.id]: opt.channels }))}
                        className={`w-9 h-9 rounded-lg text-sm font-bold border-2 transition-all cursor-pointer ${
                          getSelectedChannels(modalProduct) === opt.channels
                            ? "bg-[var(--green)] border-[var(--green)] text-white shadow-[0_0_10px_rgba(122,182,72,0.4)]"
                            : "bg-transparent border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--green)] hover:text-[var(--green)]"
                        }`}
                      >
                        {opt.channels}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selector de color */}
              {modalProduct.colorVariants && modalProduct.colorVariants.length > 0 && (
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xs text-[var(--text-muted)] font-medium">Color:</span>
                  <div className="flex items-center gap-2">
                    {modalProduct.colorVariants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedColors((prev) => ({ ...prev, [modalProduct.id]: variant.id }))}
                        title={variant.label}
                        className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                          getSelectedColor(modalProduct) === variant.id
                            ? "border-[var(--green)] scale-110 shadow-[0_0_8px_rgba(122,182,72,0.4)]"
                            : "border-[var(--border)] hover:border-[var(--text-muted)]"
                        }`}
                        style={{ backgroundColor: variant.hex }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {modalProduct.colorVariants.find((v) => v.id === getSelectedColor(modalProduct))?.label}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                <span className="font-[var(--font-display)] text-2xl font-bold text-gradient">
                  {getCurrentPrice(modalProduct)}
                </span>
                <button
                  onClick={() => scrollToContact(modalProduct)}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-brand glow-green transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  Consultar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
