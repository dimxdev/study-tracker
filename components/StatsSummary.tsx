"use client";

import type { TrackItem } from "@/types";
import { STATUS_META } from "@/lib/constants";
import ProgressTrack from "./ProgressTrack";

interface StatsSummaryProps {
  items: TrackItem[];
}

export default function StatsSummary({ items }: StatsSummaryProps) {
  const total = items.length;
  const counts = {
    "to-learn": items.filter((i) => i.status === "to-learn").length,
    "in-progress": items.filter((i) => i.status === "in-progress").length,
    done: items.filter((i) => i.status === "done").length,
  };
  const percent = total === 0 ? 0 : (counts.done / total) * 100;

  return (
    <section className="flex flex-col gap-4 rounded-2xl glass p-5">
      <div className="grid grid-cols-3 gap-3">
        {(["to-learn", "in-progress", "done"] as const).map((s) => (
          <div
            key={s}
            className="flex flex-col items-center gap-1 rounded-xl bg-cyan-bg/50 py-3"
          >
            <span className="text-2xl font-extrabold text-navy">
              {counts[s]}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-muted">
              {STATUS_META[s].emoji} {STATUS_META[s].label}
            </span>
          </div>
        ))}
      </div>

      <ProgressTrack percent={percent} />
    </section>
  );
}
