"use client";

import { Home, Download, FileText, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useAppStore, type BottomTab } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const items: { id: BottomTab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "download", label: "Download", icon: Download },
  { id: "header", label: "Header", icon: FileText },
  { id: "settings", label: "Pengaturan", icon: Settings },
];

export function BottomNav() {
  const { activeBottomTab, setActiveBottomTab } = useAppStore();

  return (
    <nav className="glass-strong z-20 flex h-16 shrink-0 items-center justify-around border-t border-base-500/30 px-2 sm:h-14">
      {items.map((item) => {
        const active = activeBottomTab === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setActiveBottomTab(item.id)}
            className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 sm:flex-row sm:gap-2"
          >
            {active && (
              <motion.div
                layoutId="bottom-nav-active"
                className="absolute inset-x-2 inset-y-1 rounded-lg bg-accent-600/15 sm:inset-x-4"
                transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
              />
            )}
            <Icon
              className={cn(
                "relative z-10 h-5 w-5 transition-colors sm:h-4 sm:w-4",
                active ? "text-accent-400" : "text-slate-500"
              )}
            />
            <span
              className={cn(
                "relative z-10 text-[10px] font-medium transition-colors sm:text-xs",
                active ? "text-accent-300" : "text-slate-500"
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
