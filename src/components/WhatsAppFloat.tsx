"use client";

import { contactInfo } from "@/data/contact";
import { trackEvent } from "@/lib/analytics/track";

export default function WhatsAppFloat() {
  return (
    <div className="group fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[999] flex flex-col items-end gap-2.5">
      <div className="hidden sm:flex flex-col items-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-zinc-900/95 border border-white/[0.08] backdrop-blur-md shadow-lg">
          Escribenos por WhatsApp
        </span>
        <span className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-zinc-400 bg-zinc-950/90 border border-white/[0.06] backdrop-blur-sm">
          {contactInfo.phone}
        </span>
      </div>

      <a
        href={contactInfo.socialLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("whatsapp_click", { source: "float" })}
        className="group relative flex items-center justify-center w-[3.75rem] h-[3.75rem] rounded-2xl bg-[#25D366] text-white shadow-[0_4px_28px_rgba(37,211,102,0.45)] transition-all hover:scale-105 hover:shadow-[0_8px_36px_rgba(37,211,102,0.55)] animate-[whatsappBounce_3s_ease-in-out_infinite]"
        aria-label={`Contactar por WhatsApp al ${contactInfo.phone}`}
      >
        <span className="absolute inset-0 rounded-2xl bg-[#25D366] animate-[whatsappPulse_2s_ease-out_infinite]" />
        <span className="absolute -inset-1 rounded-[1.1rem] border border-[#25D366]/30 opacity-0 group-hover:opacity-100 transition-opacity" />
        <svg viewBox="0 0 24 24" fill="currentColor" className="relative w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}