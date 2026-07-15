"use client";

import { useMemo, useState } from "react";
import type { Status, TrackItem } from "@/types";
import ItemCard from "@/components/ItemCard";

interface HistoryViewProps {
  items: TrackItem[];
  onStatusChange: (id: string, status: Status) => void;
  onEdit: (item: TrackItem) => void;
  onDelete: (item: TrackItem) => void;
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function HistoryView({
  items,
  onStatusChange,
  onEdit,
  onDelete,
}: HistoryViewProps) {
  const [search, setSearch] = useState("");

  const doneItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items
      .filter((it) => it.status === "done")
      .filter((it) =>
        q ? `${it.title} ${it.description ?? ""}`.toLowerCase().includes(q) : true
      )
      .sort(
        (a, b) =>
          new Date(b.completedAt ?? b.createdAt).getTime() -
          new Date(a.completedAt ?? a.createdAt).getTime()
      );
  }, [items, search]);

  const totalDone = items.filter((it) => it.status === "done").length;

  if (totalDone === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/60 bg-white/25 backdrop-blur-md px-6 py-16 text-center">
        <div className="text-6xl">🏁</div>
        <h3 className="mt-4 text-lg font-bold text-navy">Belum ada yang selesai</h3>
        <p className="mt-1 max-w-xs text-sm text-muted">
          Item yang kamu tandai <span className="font-semibold">Done</span> bakal
          muncul di sini. Semangat, pelan-pelan pasti sampai! 🐢
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 rounded-2xl glass p-4">
        <p className="text-sm text-muted">
          🎉 Kamu sudah menyelesaikan{" "}
          <span className="font-bold text-navy">{totalDone}</span> item. Klik
          status di kartu untuk mengubahnya lagi kalau mau dipelajari ulang.
        </p>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari di riwayat…"
            className="w-full rounded-xl border border-white/50 bg-white/35 py-2.5 pl-9 pr-3 text-sm text-navy placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-turquoise focus:bg-white/70 transition"
          />
        </div>
      </div>

      {doneItems.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">
          Nggak ada riwayat yang cocok dengan pencarian.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {doneItems.map((item) => (
            <div key={item.id} className="flex flex-col gap-1">
              <ItemCard
                item={item}
                onStatusChange={onStatusChange}
                onEdit={onEdit}
                onDelete={onDelete}
              />
              {item.completedAt && (
                <span className="px-1 text-[11px] font-medium text-muted">
                  Selesai {formatDate(item.completedAt)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
