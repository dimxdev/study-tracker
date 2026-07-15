"use client";

import type { TrackItem } from "@/types";

interface CategoryChartProps {
  items: TrackItem[];
}

const BAR_COLORS = ["#64DFDF", "#FF9F80", "#FFD972", "#8FE3B8", "#1B2A3A"];

/** Bar chart sederhana: jumlah item per kategori (tanpa library eksternal). */
export default function CategoryChart({ items }: CategoryChartProps) {
  const byCategory = new Map<string, number>();
  for (const it of items) {
    byCategory.set(it.category, (byCategory.get(it.category) ?? 0) + 1);
  }
  const rows = [...byCategory.entries()].sort((a, b) => b[1] - a[1]);
  const max = rows.reduce((m, [, n]) => Math.max(m, n), 0);

  if (rows.length === 0) return null;

  return (
    <section className="flex flex-col gap-3 rounded-2xl glass p-5">
      <h2 className="text-sm font-bold text-navy">📊 Item per Kategori</h2>
      <div className="flex flex-col gap-2.5">
        {rows.map(([cat, n], i) => (
          <div key={cat} className="flex items-center gap-3">
            <span className="w-28 shrink-0 truncate text-xs font-semibold text-navy">
              {cat}
            </span>
            <div className="h-5 flex-1 overflow-hidden rounded-full bg-cyan-bg/60">
              <div
                className="flex h-full items-center justify-end rounded-full px-2 text-[10px] font-bold text-navy transition-[width] duration-700 ease-out"
                style={{
                  width: `${max === 0 ? 0 : (n / max) * 100}%`,
                  minWidth: "1.5rem",
                  background: BAR_COLORS[i % BAR_COLORS.length],
                }}
              >
                {n}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
