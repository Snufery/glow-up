"use client";

import { useState } from "react";
import { products, categories } from "@/data/products";
import { productIcons } from "./ProductIcons";

export default function Catalog() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = activeFilter === "all" ? products : products.filter((p) => p.category === activeFilter);

  const scrollToContact = (productName: string) => {
    const servicio = document.getElementById("servicio") as HTMLSelectElement | null;
    const mensaje = document.getElementById("mensaje") as HTMLTextAreaElement | null;
    if (servicio) servicio.value = "producto";
    if (mensaje) mensaje.value = `Me interesa el producto: ${productName}`;
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
          {filtered.map((product) => (
            <div
              key={product.id}
              className="relative rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden transition-all hover:border-[var(--border-hover)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]"
              style={{ animation: "fadeInUp 0.4s ease-out forwards" }}
            >
              {product.badge && (
                <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full text-[0.72rem] font-semibold bg-gradient-brand text-white z-[2] tracking-wide">
                  {product.badge}
                </div>
              )}

              <div className="h-[200px] flex items-center justify-center bg-[rgba(122,182,72,0.03)] border-b border-[var(--border)]">
                <div className="w-20 h-20 opacity-70">
                  {productIcons[product.slug] || productIcons["default"]}
                </div>
              </div>

              <div className="p-6">
                <span className="text-[0.72rem] font-semibold uppercase tracking-widest text-[var(--teal)]">
                  {product.category}
                </span>
                <h3 className="font-[var(--font-display)] text-base font-bold mt-2 mb-2">{product.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">{product.description}</p>

                <div className="flex items-center justify-between">
                  <span className="font-[var(--font-display)] text-xl font-bold text-gradient">
                    {product.priceFormatted}
                  </span>
                  <button
                    onClick={() => scrollToContact(product.name)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-brand glow-green transition-all hover:-translate-y-0.5 cursor-pointer"
                  >
                    Consultar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
