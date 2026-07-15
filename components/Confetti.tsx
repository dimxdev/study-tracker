"use client";

import { useEffect, useState } from "react";

const COLORS = ["#64DFDF", "#FF9F80", "#FFD972", "#8FE3B8", "#1B2A3A"];

interface Piece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rounded: boolean;
}

/**
 * Confetti burst singkat. Parent memicu dengan mengganti `fireKey`
 * (mis. `key={fireKey}`), sehingga komponen remount & animasi jalan sekali.
 */
export default function Confetti() {
  const [done, setDone] = useState(false);

  // Confetti murni efek visual client-side: randomness memang disengaja
  // (bukan nilai render deterministik), digenerate sekali via lazy initializer.
  const [pieces] = useState<Piece[]>(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.25,
      duration: 0.9 + Math.random() * 0.8,
      color: COLORS[i % COLORS.length],
      size: 6 + Math.random() * 8,
      rounded: Math.random() > 0.5,
    }))
  );

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 2000);
    return () => clearTimeout(t);
  }, []);

  if (done) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-60 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            top: "-16px",
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            borderRadius: p.rounded ? "9999px" : "2px",
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}
