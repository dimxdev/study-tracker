"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface SelectOption {
  value: string;
  label: string;
  emoji?: string;
}

interface SelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  fullWidth?: boolean;
  className?: string;
}

interface MenuPos {
  left: number;
  top: number;
  width: number;
  openUp: boolean;
  maxHeight: number;
}

export default function Select({
  value,
  options,
  onChange,
  placeholder = "Pilih…",
  ariaLabel,
  fullWidth = true,
  className = "",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<MenuPos | null>(null);
  const [highlight, setHighlight] = useState(0);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  const selected = options.find((o) => o.value === value);

  const computePos = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const desired = Math.min(280, options.length * 40 + 8);
    const openUp = spaceBelow < desired && spaceAbove > spaceBelow;
    setPos({
      left: rect.left,
      top: openUp ? rect.top : rect.bottom,
      width: rect.width,
      openUp,
      maxHeight: Math.max(120, (openUp ? spaceAbove : spaceBelow) - 12),
    });
  }, [options.length]);

  const openMenu = useCallback(() => {
    computePos();
    const idx = options.findIndex((o) => o.value === value);
    setHighlight(idx < 0 ? 0 : idx);
    setOpen(true);
  }, [computePos, options, value]);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const onDocDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        !triggerRef.current?.contains(t) &&
        !menuRef.current?.contains(t)
      ) {
        close();
      }
    };
    const onScrollOrResize = () => close();

    document.addEventListener("mousedown", onDocDown);
    window.addEventListener("resize", onScrollOrResize);
    // capture: tangkap scroll dari container mana pun (mis. isi modal)
    window.addEventListener("scroll", onScrollOrResize, true);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [open, close]);

  function choose(v: string) {
    onChange(v);
    close();
    triggerRef.current?.focus();
  }

  function onTriggerKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(options.length - 1, h + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(0, h - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const opt = options[highlight];
      if (opt) choose(opt.value);
    }
  }

  return (
    <div className={fullWidth ? "w-full" : "inline-block"}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onTriggerKeyDown}
        className={`flex items-center justify-between gap-2 rounded-xl border border-white/50 bg-white/35 px-3.5 py-2.5 text-sm font-medium text-navy backdrop-blur-md transition hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-turquoise ${
          fullWidth ? "w-full" : ""
        } ${className}`}
      >
        <span className={selected ? "truncate" : "truncate text-muted"}>
          {selected
            ? `${selected.emoji ? selected.emoji + " " : ""}${selected.label}`
            : placeholder}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className={`shrink-0 text-muted transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open &&
        pos &&
        typeof document !== "undefined" &&
        createPortal(
          <ul
            ref={menuRef}
            id={listboxId}
            role="listbox"
            className="glass fixed z-70 overflow-y-auto rounded-xl p-1 shadow-2xl animate-fade-in"
            style={{
              left: pos.left,
              width: pos.width,
              maxHeight: pos.maxHeight,
              ...(pos.openUp
                ? { top: pos.top, transform: "translateY(-100%)", marginTop: -6 }
                : { top: pos.top, marginTop: 6 }),
            }}
          >
            {options.map((opt, i) => {
              const isSel = opt.value === value;
              const isHi = i === highlight;
              return (
                <li key={opt.value} role="option" aria-selected={isSel}>
                  <button
                    type="button"
                    onClick={() => choose(opt.value)}
                    onMouseEnter={() => setHighlight(i)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-navy transition-colors ${
                      isHi ? "bg-white/70" : ""
                    } ${isSel ? "font-semibold" : "font-medium"}`}
                  >
                    {opt.emoji && <span>{opt.emoji}</span>}
                    <span className="flex-1 truncate">{opt.label}</span>
                    {isSel && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="shrink-0 text-turquoise"
                      >
                        <path
                          d="M5 12l5 5L20 7"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>,
          document.body
        )}
    </div>
  );
}
