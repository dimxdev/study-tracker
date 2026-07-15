"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-turquoise text-navy hover:brightness-105 shadow-sm hover:shadow-md",
  secondary:
    "bg-white/45 text-navy border border-white/50 backdrop-blur-md hover:bg-white/65 shadow-sm",
  ghost: "bg-transparent text-navy hover:bg-cyan-bg",
  danger: "bg-coral/20 text-navy border border-coral hover:bg-coral/30",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-turquoise focus-visible:ring-offset-2 focus-visible:ring-offset-background ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
