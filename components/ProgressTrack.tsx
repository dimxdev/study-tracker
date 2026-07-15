"use client";

interface ProgressTrackProps {
  percent: number; // 0..100
}

/**
 * Progress bar dengan maskot kura-kura yang merangkak maju sesuai % item Done.
 * Motto: "I may be slow, but I never stop crawling forward 🐢"
 */
export default function ProgressTrack({ percent }: ProgressTrackProps) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm font-semibold text-navy">
        <span>Progress keseluruhan</span>
        <span>{Math.round(clamped)}%</span>
      </div>

      <div className="relative h-4 w-full rounded-full bg-cyan-bg">
        {/* isi bar dengan animasi mengisi */}
        <div
          className="h-full rounded-full bg-linear-to-r from-turquoise to-mint transition-[width] duration-700 ease-out"
          style={{ width: `${clamped}%` }}
        />
        {/* kura-kura duduk di ujung progress */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-xl transition-[left] duration-700 ease-out"
          style={{ left: `${clamped}%` }}
          aria-hidden
        >
          🐢
        </div>
      </div>

      <p className="text-xs italic text-muted">
        I may be slow, but I never stop crawling forward.
      </p>
    </div>
  );
}
