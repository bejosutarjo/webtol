"use client";

import { motion } from "framer-motion";
import {
  FileCode, Braces, FileText, ListTree, Cookie, Image as ImageIcon,
  Palette, FileJson2, Layers, Archive,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";
import {
  downloadHtml, downloadJson, downloadTxt, downloadHeaders, downloadCookies,
  downloadImages, downloadCss, downloadJs, downloadAllAssets, downloadHar,
} from "@/lib/downloadUtils";

const items = [
  { key: "html", label: "Download HTML", desc: "Source code HTML mentah", icon: FileCode, action: downloadHtml },
  { key: "json", label: "Download JSON", desc: "Seluruh hasil parsing dalam JSON", icon: Braces, action: downloadJson },
  { key: "txt", label: "Download TXT", desc: "Source code sebagai plain text", icon: FileText, action: downloadTxt },
  { key: "headers", label: "Download Headers", desc: "Request & response headers", icon: ListTree, action: downloadHeaders },
  { key: "cookies", label: "Download Cookies", desc: "Semua cookies dari response", icon: Cookie, action: downloadCookies },
  { key: "images", label: "Download Images URL", desc: "Daftar URL gambar", icon: ImageIcon, action: downloadImages },
  { key: "css", label: "Download CSS URL", desc: "Daftar URL stylesheet", icon: Palette, action: downloadCss },
  { key: "js", label: "Download JavaScript URL", desc: "Daftar URL script", icon: FileJson2, action: downloadJs },
  { key: "assets", label: "Download Semua Asset", desc: "Gabungan images, css, js", icon: Layers, action: downloadAllAssets },
  { key: "har", label: "Download HAR", desc: "HTTP Archive format", icon: Archive, action: downloadHar },
];

export function DownloadView() {
  const { result } = useAppStore();

  const handle = (action: (r: any) => void, label: string) => {
    if (!result) {
      toast.error("Jalankan parse terlebih dahulu sebelum download.");
      return;
    }
    action(result);
    toast.success(`${label} berhasil diunduh.`);
  };

  return (
    <div className="scroll-thin h-full overflow-auto p-4">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white">Download Center</h2>
        <p className="text-xs text-slate-500">
          Ekspor hasil parsing ke berbagai format file.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
            >
              <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500/10 text-accent-400">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-100">{item.label}</div>
                    <div className="mt-0.5 text-xs text-slate-500">{item.desc}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-full"
                    onClick={() => handle(item.action, item.label)}
                  >
                    Unduh
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
