"use client";

import { useMemo } from "react";
import { MapPin, Pencil, Package } from "lucide-react";
import { useHouse } from "@/context/HouseContext";
import { useQuote } from "@/context/QuoteContext";
import { ROOM_TYPE_META } from "@/lib/houseLayout";

interface HouseZonePickerProps {
  onEditSpaces?: () => void;
}

export default function HouseZonePicker({ onEditSpaces }: HouseZonePickerProps) {
  const { rooms, selectedRoomId, selectedRoom, selectRoom } = useHouse();
  const { items } = useQuote();

  const productCountByRoom = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) {
      if (!item.roomId) continue;
      map.set(item.roomId, (map.get(item.roomId) ?? 0) + item.quantity);
    }
    return map;
  }, [items]);

  if (rooms.length === 0) return null;

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin size={14} className="text-[var(--accent)] flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-zinc-300">Zona activa</p>
            <p className="text-[11px] text-zinc-500 truncate">
              {selectedRoom
                ? selectedRoom.label
                : "Elige dónde instalarás el producto"}
            </p>
          </div>
        </div>
        {onEditSpaces && (
          <button
            type="button"
            onClick={onEditSpaces}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold border border-white/[0.08] text-zinc-400 hover:text-white hover:border-[var(--accent)]/30 transition-all cursor-pointer"
          >
            <Pencil size={11} />
            Editar espacios
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
        {rooms.map((room) => {
          const meta = ROOM_TYPE_META[room.type];
          const Icon = meta.icon;
          const isSelected = room.id === selectedRoomId;
          const count = productCountByRoom.get(room.id) ?? 0;

          return (
            <button
              key={room.id}
              type="button"
              onClick={() => selectRoom(room.id)}
              className={`flex-shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                isSelected
                  ? "bg-[var(--accent)]/15 border-[var(--accent)]/45 text-[var(--accent-bright)]"
                  : "bg-zinc-900/50 border-white/[0.08] text-zinc-400 hover:border-[var(--accent)]/25 hover:text-zinc-200"
              }`}
            >
              <Icon size={14} className={isSelected ? "text-[var(--accent)]" : "text-zinc-500"} />
              <span>{room.label}</span>
              {count > 0 && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold opacity-80">
                  <Package size={10} />
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}