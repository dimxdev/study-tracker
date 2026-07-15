"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Pembungkus card untuk animasi layout yang smooth:
 * - `layout` → card meluncur halus ke posisi baru saat urutan berubah
 *   (mis. setelah status diubah jadi In Progress lalu naik ke atas).
 * - enter/exit → muncul & menghilang dengan fade + scale (mis. saat pindah
 *   dari Beranda ke Riwayat).
 */
export default function AnimatedItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        type: "spring",
        stiffness: 480,
        damping: 40,
        mass: 0.8,
        opacity: { duration: 0.2 },
      }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}
