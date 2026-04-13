"use client";

import { useState } from "react";
import { contactInfo } from "@/data/contact";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const nombre = data.get("nombre") as string;
    const email = data.get("email") as string;
    const telefono = data.get("telefono") as string;
    const servicio = data.get("servicio") as string;
    const mensaje = data.get("mensaje") as string;

    const whatsappMsg = encodeURIComponent(
      `Hola Glow Up! Soy ${nombre}.\nEmail: ${email}\n${telefono ? "Tel: " + telefono + "\n" : ""}Servicio: ${servicio}\n\n${mensaje}`
    );

    window.open(`https://wa.me/${contactInfo.whatsappNumber}?text=${whatsappMsg}`, "_blank");

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      form.reset();
    }, 3000);
  };

  return (
    <section id="contacto" className="py-24 bg-[var(--bg-secondary)]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-[var(--green)] border border-[rgba(122,182,72,0.2)] bg-[rgba(122,182,72,0.06)] mb-5">
            Contacto
          </span>
          <h2 className="font-[var(--font-display)] text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight tracking-tight">
            Hagamos tu espacio <span className="text-gradient">inteligente</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-16 items-start">
          {/* Contact info */}
          <div>
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                ),
                label: "Telefono",
                value: contactInfo.phone,
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                ),
                label: "Email",
                value: contactInfo.email,
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                ),
                label: "Ubicacion",
                value: contactInfo.location,
              },
            ].map((item) => (
              <div key={item.label} className="flex gap-4 items-start mb-7">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[rgba(122,182,72,0.08)] border border-[rgba(122,182,72,0.15)] flex items-center justify-center text-[var(--green)]">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">{item.label}</h4>
                  <p className="text-sm text-[var(--text-secondary)]">{item.value}</p>
                </div>
              </div>
            ))}

            {/* Social links */}
            <div className="flex gap-3 mt-4">
              {["Instagram", "Facebook", "WhatsApp"].map((name) => (
                <a
                  key={name}
                  href={name === "WhatsApp" ? contactInfo.socialLinks.whatsapp : "#"}
                  target={name === "WhatsApp" ? "_blank" : undefined}
                  className="w-11 h-11 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] transition-all hover:text-[var(--green)] hover:border-[var(--green)] hover:bg-[rgba(122,182,72,0.08)] hover:-translate-y-0.5"
                  aria-label={name}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    {name === "Instagram" && (
                      <>
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </>
                    )}
                    {name === "Facebook" && <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />}
                    {name === "WhatsApp" && (
                      <path
                        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"
                        fill="currentColor"
                        stroke="none"
                      />
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input name="nombre" type="text" placeholder="Tu nombre" required className="form-input" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="email" type="email" placeholder="Email" required className="form-input" />
              <input name="telefono" type="tel" placeholder="Telefono" className="form-input" />
            </div>
            <select name="servicio" id="servicio" required className="form-input appearance-none cursor-pointer" defaultValue="">
              <option value="" disabled>Selecciona un servicio</option>
              <option value="domotica">Domotica Residencial</option>
              <option value="electrica">Instalacion Electrica</option>
              <option value="seguridad">Seguridad Inteligente</option>
              <option value="comercial">Automatizacion Comercial</option>
              <option value="producto">Compra de Producto</option>
              <option value="otro">Otro</option>
            </select>
            <textarea
              name="mensaje"
              id="mensaje"
              rows={4}
              placeholder="Cuentanos sobre tu proyecto..."
              required
              className="form-input resize-y min-h-[120px]"
            />
            <button
              type="submit"
              className={`w-full py-3.5 rounded-[var(--radius-md)] font-semibold text-sm text-white transition-all cursor-pointer ${
                submitted ? "bg-[var(--teal)]" : "bg-gradient-brand glow-green glow-green-hover hover:-translate-y-0.5"
              }`}
            >
              {submitted ? "Mensaje preparado!" : "Enviar Mensaje"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
