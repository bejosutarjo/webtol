"use client";

import { Code2, Moon, Sun, User, Wifi, WifiOff, Loader2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const statusConfig = {
  idle: { label: "Idle", variant: "neutral" as const, icon: WifiOff },
  connecting: { label: "Menghubungkan", variant: "warning" as const, icon: Loader2 },
  connected: { label: "Terhubung", variant: "success" as const, icon: Wifi },
  error: { label: "Error", variant: "danger" as const, icon: WifiOff },
};

export function Header() {
  const { status, darkMode, toggleDarkMode } = useAppStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const cfg = statusConfig[status];
  const StatusIcon = cfg.icon;

  return (
    <header className="glass-strong z-20 flex h-14 shrink-0 items-center justify-between border-b border-base-500/30 px-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 shadow-glow">
          <Code2 className="h-4.5 w-4.5 text-white" size={18} />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-sm font-bold tracking-wide text-white">
            WEB PARSER <span className="text-accent-400">TOOL</span>
          </span>
          <span className="text-[10px] font-medium tracking-wider text-slate-500">
            HTTP INSPECTOR &amp; SOURCE VIEWER
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={cfg.variant} className="hidden items-center gap-1.5 sm:flex">
          <StatusIcon
            className={cn("h-3 w-3", status === "connecting" && "animate-spin")}
          />
          {cfg.label}
        </Badge>

        <button
          onClick={toggleDarkMode}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-base-500/40 text-slate-300 transition-colors hover:bg-base-700"
          title="Toggle dark mode"
        >
          {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-base-500/40 bg-base-700/50 text-slate-300 transition-colors hover:bg-base-700"
          >
            <User className="h-4 w-4" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="glass-strong absolute right-0 top-10 w-48 rounded-lg border border-base-500/30 p-1.5 shadow-panel"
              >
                <div className="px-2 py-1.5 text-xs text-slate-400">
                  Guest Developer
                </div>
                <div className="my-1 h-px bg-base-500/30" />
                <button className="w-full rounded-md px-2 py-1.5 text-left text-xs text-slate-300 hover:bg-base-700">
                  Preferensi
                </button>
                <button className="w-full rounded-md px-2 py-1.5 text-left text-xs text-slate-300 hover:bg-base-700">
                  Tentang Aplikasi
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
