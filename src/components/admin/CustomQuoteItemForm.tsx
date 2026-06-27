"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useQuote } from "@/context/QuoteContext";

export default function CustomQuoteItemForm() {
  const { addCustomItem } = useQuote();
  const [name, setName] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const parsedPrice = Number(unitPrice.replace(/\D/g, ""));
    if (!name.trim() || !parsedPrice || parsedPrice <= 0) return;

    addCustomItem({
      name: name.trim(),
      unitPrice: parsedPrice,
      description: description.trim() || undefined,
    });

    setName("");
    setUnitPrice("");
    setDescription("");
  };

  return (
    <section className="glass rounded-2xl p-5 border border-white/[0.06] space-y-3">
      <h2 className="text-sm font-bold">Producto fuera de catálogo</h2>
      <p className="text-xs text-zinc-500">
        Agrega equipos que no están en el catálogo. La IA buscará especificaciones
        confirmadas en internet al generar la cotización inteligente.
      </p>

      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs text-zinc-500 mb-1.5">Nombre del producto</label>
          <input
            className="form-input text-sm"
            placeholder="Ej. Videoportero EZVIZ HP7 Pro 4K"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5">Precio unitario (COP)</label>
          <input
            className="form-input text-sm"
            placeholder="1650000"
            inputMode="numeric"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs text-zinc-500 mb-1.5">
            Descripción conocida (opcional)
          </label>
          <textarea
            className="form-input text-sm min-h-[64px] resize-y"
            placeholder="Notas técnicas que ya tengas confirmadas"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-[var(--accent)]/25 bg-[var(--accent)]/10 text-[var(--accent-bright)] hover:bg-[var(--accent)]/18 transition-all"
          >
            <Plus size={14} />
            Agregar a la cotización
          </button>
        </div>
      </form>
    </section>
  );
}