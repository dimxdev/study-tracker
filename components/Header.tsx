"use client";

interface HeaderProps {
  streak: number;
  quote: string;
}

export default function Header({ streak, quote }: HeaderProps) {
  return (
    <header className="flex flex-col gap-4 rounded-2xl border border-white/50 bg-linear-to-br from-turquoise/45 to-mint/25 p-6 shadow-[0_8px_30px_-10px_rgba(27,42,58,0.25)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold text-navy sm:text-3xl">
          🐢 Crawl
        </h1>
        <p className="max-w-md text-sm italic text-navy/70">“{quote}”</p>
      </div>

      <div className="flex items-center gap-2 self-start rounded-2xl border border-white/50 bg-white/45 px-4 py-2.5 shadow-sm backdrop-blur-md sm:self-auto">
        <span className="text-2xl">🔥</span>
        <div className="flex flex-col leading-tight">
          <span className="text-xl font-extrabold text-navy">{streak}</span>
          <span className="text-[11px] font-semibold text-muted">
            hari beruntun
          </span>
        </div>
      </div>
    </header>
  );
}
