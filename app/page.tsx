"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { UrlBar } from "@/components/layout/UrlBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { HomeView } from "@/components/views/HomeView";
import { DownloadView } from "@/components/views/DownloadView";
import { HeaderBuilderView } from "@/components/views/HeaderBuilderView";
import { SettingsView } from "@/components/views/SettingsView";
import { useAppStore } from "@/store/useAppStore";

export default function Home() {
  const { activeBottomTab } = useAppStore();

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-base-900">
      <Header />
      <UrlBar />
      <main className="relative min-h-0 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBottomTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {activeBottomTab === "home" && <HomeView />}
            {activeBottomTab === "download" && <DownloadView />}
            {activeBottomTab === "header" && <HeaderBuilderView />}
            {activeBottomTab === "settings" && <SettingsView />}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  );
}
