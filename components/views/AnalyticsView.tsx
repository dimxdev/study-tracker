"use client";

import { useMemo } from "react";
import type { TrackItem } from "@/types";
import StatsSummary from "@/components/StatsSummary";
import CategoryChart from "@/components/CategoryChart";

interface AnalyticsViewProps {
  items: TrackItem[];
}

const MONTHS_ID = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

/** Ringkasan jumlah item selesai per bulan (6 bulan terakhir). */
function completedPerMonth(items: TrackItem[]) {
  const now = new Date();
  const buckets: { label: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ label: MONTHS_ID[d.getMonth()], count: 0 });
  }
  const startKey = new Date(now.getFullYear(), now.getMonth() - 5, 1).getTime();
  for (const it of items) {
    if (it.status !== "done" || !it.completedAt) continue;
    const c = new Date(it.completedAt);
    const cMonthStart = new Date(c.getFullYear(), c.getMonth(), 1).getTime();
    if (cMonthStart < startKey) continue;
    const idx =
      (c.getFullYear() - now.getFullYear()) * 12 +
      (c.getMonth() - now.getMonth()) +
      5;
    if (idx >= 0 && idx < 6) buckets[idx].count += 1;
  }
  return buckets;
}

export default function AnalyticsView({ items }: AnalyticsViewProps) {
  const total = items.length;
  const done = items.filter((i) => i.status === "done").length;
  const active = total - done;
  const completion = total === 0 ? 0 : Math.round((done / total) * 100);

  const monthly = useMemo(() => completedPerMonth(items), [items]);
  const maxMonthly = monthly.reduce((m, b) => Math.max(m, b.count), 0);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/60 bg-white/25 backdrop-blur-md px-6 py-16 text-center">
        <div className="text-6xl">📊</div>
        <h3 className="mt-4 text-lg font-bold text-navy">Belum ada data</h3>
        <p className="mt-1 max-w-xs text-sm text-muted">
          Tambahkan item dulu, nanti statistik dan progresmu muncul di sini.
        </p>
      </div>
    );
  }

  const tiles = [
    { label: "Total", value: total, emoji: "📦" },
    { label: "Aktif", value: active, emoji: "⚡" },
    { label: "Selesai", value: done, emoji: "✅" },
    { label: "Completion", value: `${completion}%`, emoji: "🎯" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((t) => (
          <div
            key={t.label}
            className="flex flex-col gap-1 rounded-2xl glass p-4"
          >
            <span className="text-lg">{t.emoji}</span>
            <span className="text-2xl font-extrabold text-navy">{t.value}</span>
            <span className="text-xs font-semibold text-muted">{t.label}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <StatsSummary items={items} />
        <CategoryChart items={items} />
      </div>

      {/* Selesai per bulan */}
      <section className="flex flex-col gap-3 rounded-2xl glass p-5">
        <h2 className="text-sm font-bold text-navy">📅 Selesai per Bulan</h2>
        <div className="flex items-end justify-between gap-2 pt-2">
          {monthly.map((b, i) => {
            const h = maxMonthly === 0 ? 0 : (b.count / maxMonthly) * 100;
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-xs font-bold text-navy">{b.count}</span>
                <div className="flex h-24 w-full items-end">
                  <div
                    className="w-full rounded-t-lg bg-linear-to-t from-turquoise to-mint transition-[height] duration-700 ease-out"
                    style={{ height: `${Math.max(h, b.count > 0 ? 8 : 2)}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-muted">
                  {b.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
