"use client";

export type ViewKey = "home" | "categories" | "analytics" | "history";

interface NavEntry {
  key: ViewKey;
  label: string;
  emoji: string;
}

const NAV: NavEntry[] = [
  { key: "home", label: "Beranda", emoji: "🏠" },
  { key: "categories", label: "Kategori", emoji: "🏷️" },
  { key: "analytics", label: "Analitik", emoji: "📊" },
  { key: "history", label: "Riwayat", emoji: "✅" },
];

interface SideNavProps {
  active: ViewKey;
  onChange: (view: ViewKey) => void;
  historyCount: number;
}

export default function SideNav({
  active,
  onChange,
  historyCount,
}: SideNavProps) {
  return (
    <nav
      aria-label="Navigasi utama"
      className="glass fixed inset-x-0 bottom-0 z-40
                 md:inset-y-0 md:left-0 md:right-auto md:w-60"
    >
      {/* Judul app hanya tampil di sidebar desktop */}
      <div className="hidden items-center gap-2 px-5 py-6 md:flex">
        <span className="text-2xl">🐢</span>
        <span className="text-xl font-extrabold text-navy">Crawl</span>
      </div>

      <ul className="flex items-stretch justify-around md:flex-col md:gap-1 md:px-3">
        {NAV.map((entry) => {
          const isActive = entry.key === active;
          return (
            <li key={entry.key} className="flex-1 md:flex-none">
              <button
                onClick={() => onChange(entry.key)}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex w-full flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition-colors
                            md:flex-row md:gap-3 md:rounded-2xl md:px-4 md:py-3 md:text-sm
                            ${
                              isActive
                                ? "text-navy md:bg-turquoise/25"
                                : "text-muted hover:text-navy md:hover:bg-cyan-bg"
                            }`}
              >
                <span className="text-lg md:text-base">{entry.emoji}</span>
                <span>{entry.label}</span>
                {entry.key === "history" && historyCount > 0 && (
                  <span className="ml-auto hidden rounded-full bg-mint/40 px-2 py-0.5 text-[11px] font-bold text-navy md:inline">
                    {historyCount}
                  </span>
                )}
                {/* indikator aktif di mobile (garis atas) */}
                {isActive && (
                  <span className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-turquoise md:hidden" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
