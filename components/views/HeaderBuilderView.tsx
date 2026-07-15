"use client";

import { useRef } from "react";
import { Plus, Trash2, Upload, Download, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/store/useAppStore";
import { HEADER_PRESETS, type PresetName } from "@/lib/headerPresets";
import { downloadTextFile } from "@/lib/utils";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import { motion } from "framer-motion";

const presetNames: PresetName[] = [
  "Chrome Windows",
  "Chrome Android",
  "Firefox",
  "Safari",
  "Edge",
  "Postman",
  "Curl",
];

export function HeaderBuilderView() {
  const { headers, addHeader, updateHeader, removeHeader, setHeaders, applyPreset } =
    useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const obj: Record<string, string> = {};
    headers.forEach((h) => {
      if (h.key) obj[h.key] = h.value;
    });
    downloadTextFile("headers-export.json", JSON.stringify(obj, null, 2), "application/json");
    toast.success("Header berhasil diekspor ke JSON.");
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const obj = JSON.parse(text) as Record<string, string>;
      setHeaders(
        Object.entries(obj).map(([key, value]) => ({ id: uuid(), key, value, enabled: true }))
      );
      toast.success("Header berhasil diimpor.");
    } catch {
      toast.error("File JSON tidak valid.");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="scroll-thin h-full overflow-auto p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-white">Header Builder</h2>
          <p className="text-xs text-slate-500">
            Susun request headers lengkap sebelum melakukan parsing.
          </p>
        </div>
        <div className="flex gap-1.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImportFile}
          />
          <Button size="sm" variant="outline" onClick={handleImportClick} className="gap-1.5">
            <Upload className="h-3.5 w-3.5" /> Import
          </Button>
          <Button size="sm" variant="outline" onClick={handleExport} className="gap-1.5">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
          <Button size="sm" onClick={addHeader} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Tambah
          </Button>
        </div>
      </div>

      <div className="mb-4 rounded-lg border border-base-500/20 bg-base-800/30 p-3">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <Wand2 className="h-3.5 w-3.5 text-accent-400" /> Preset Header
        </div>
        <div className="flex flex-wrap gap-1.5">
          {presetNames.map((name) => (
            <Button
              key={name}
              size="xs"
              variant="secondary"
              onClick={() => {
                applyPreset(HEADER_PRESETS[name]);
                toast.success(`Preset "${name}" diterapkan.`);
              }}
            >
              {name}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {headers.map((h, i) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15, delay: i * 0.02 }}
            className="flex items-center gap-2 rounded-lg border border-base-500/20 bg-base-800/30 p-2"
          >
            <Switch
              checked={h.enabled}
              onCheckedChange={(v) => updateHeader(h.id, { enabled: v })}
            />
            <Input
              value={h.key}
              onChange={(e) => updateHeader(h.id, { key: e.target.value })}
              placeholder="Header-Name"
              className="w-1/3 font-mono text-xs"
              list="header-name-suggestions"
            />
            <Input
              value={h.value}
              onChange={(e) => updateHeader(h.id, { value: e.target.value })}
              placeholder="value"
              className="flex-1 font-mono text-xs"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={() => removeHeader(h.id)}
              className="shrink-0 text-danger hover:bg-danger/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </motion.div>
        ))}
        {headers.length === 0 && (
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-base-500/30 text-xs text-slate-500">
            Belum ada header. Klik "Tambah" atau pilih preset di atas.
          </div>
        )}
      </div>

      <datalist id="header-name-suggestions">
        {[
          "User-Agent", "Accept", "Accept-Language", "Accept-Encoding", "Referer", "Origin",
          "Host", "Authorization", "Cookie", "X-Requested-With", "Cache-Control", "Connection",
          "Upgrade-Insecure-Requests", "DNT", "Sec-Fetch-Site", "Sec-Fetch-Mode", "Sec-Fetch-Dest",
          "Sec-Ch-Ua", "Sec-Ch-Ua-Mobile", "Sec-Ch-Ua-Platform",
        ].map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
    </div>
  );
}
