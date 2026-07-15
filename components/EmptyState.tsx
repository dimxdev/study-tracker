interface EmptyStateProps {
  filtered?: boolean;
}

/** Empty state friendly untuk dua kondisi: belum ada item, atau filter tak menemukan hasil. */
export default function EmptyState({ filtered = false }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/60 bg-white/25 backdrop-blur-md px-6 py-16 text-center animate-fade-in">
      <div className="text-6xl">{filtered ? "🔍" : "🐢"}</div>
      <h3 className="mt-4 text-lg font-bold text-navy">
        {filtered ? "Nggak ada yang cocok" : "Belum ada yang di-track nih"}
      </h3>
      <p className="mt-1 max-w-xs text-sm text-muted">
        {filtered
          ? "Coba ubah kata kunci atau reset filter-nya, ya."
          : "Yuk mulai belajar sesuatu! Tambahkan item pertamamu dan pelan-pelan maju. 🚀"}
      </p>
    </div>
  );
}
