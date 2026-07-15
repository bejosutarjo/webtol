"use client";

import { useRef } from "react";
import { Plus, Trash2, Upload, Download, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/store/useAppStore";
import { downloadTextFile } from "@/lib/utils";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";

function parseNetscapeCookies(text: string) {
  return text
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#"))
    .map((line) => {
      const parts = line.split("\t");
      if (parts.length < 7) return null;
      const [domain, , path, secure, expires, name, value] = parts;
      return {
        id: uuid(),
        name,
        value,
        domain,
        path,
        secure: secure === "TRUE",
        expires,
      };
    })
    .filter(Boolean) as any[];
}

export function CookieManager() {
  const {
    cookies,
    addCookie,
    updateCookie,
    removeCookie,
    setCookies,
    settings,
    updateSettings,
  } = useAppStore();
  const netscapeInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    downloadTextFile("cookies-export.json", JSON.stringify(cookies, null, 2), "application/json");
    toast.success("Cookies berhasil diekspor.");
  };

  const handleImportJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const arr = JSON.parse(text);
      setCookies(arr.map((c: any) => ({ ...c, id: c.id || uuid() })));
      toast.success("Cookie JSON berhasil diimpor.");
    } catch {
      toast.error("File cookie JSON tidak valid.");
    } finally {
      e.target.value = "";
    }
  };

  const handleImportNetscape = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseNetscapeCookies(text);
      setCookies(parsed);
      toast.success(`${parsed.length} cookie Netscape berhasil diimpor.`);
    } catch {
      toast.error("File cookie Netscape tidak valid.");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Save className="h-3.5 w-3.5" />
          Auto Save Cookie
          <Switch
            checked={settings.autoCookie}
            onCheckedChange={(v) => updateSettings({ autoCookie: v })}
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <input ref={jsonInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportJson} />
          <input ref={netscapeInputRef} type="file" accept="text/plain,.txt" className="hidden" onChange={handleImportNetscape} />
          <Button size="xs" variant="outline" onClick={() => netscapeInputRef.current?.click()} className="gap-1">
            <Upload className="h-3 w-3" /> Netscape
          </Button>
          <Button size="xs" variant="outline" onClick={() => jsonInputRef.current?.click()} className="gap-1">
            <Upload className="h-3 w-3" /> JSON
          </Button>
          <Button size="xs" variant="outline" onClick={handleExport} className="gap-1">
            <Download className="h-3 w-3" /> Export
          </Button>
          <Button size="xs" onClick={addCookie} className="gap-1">
            <Plus className="h-3 w-3" /> Tambah
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {cookies.map((c) => (
          <div
            key={c.id}
            className="grid grid-cols-2 gap-2 rounded-lg border border-base-500/20 bg-base-800/30 p-2.5 sm:grid-cols-5"
          >
            <Input
              value={c.name}
              onChange={(e) => updateCookie(c.id, { name: e.target.value })}
              placeholder="name"
              className="text-xs"
            />
            <Input
              value={c.value}
              onChange={(e) => updateCookie(c.id, { value: e.target.value })}
              placeholder="value"
              className="text-xs sm:col-span-2"
            />
            <Input
              value={c.domain || ""}
              onChange={(e) => updateCookie(c.id, { domain: e.target.value })}
              placeholder="domain"
              className="text-xs"
            />
            <div className="flex items-center gap-1">
              <Input
                value={c.path || "/"}
                onChange={(e) => updateCookie(c.id, { path: e.target.value })}
                placeholder="/"
                className="text-xs"
              />
              <Button
                size="icon"
                variant="ghost"
                className="shrink-0 text-danger hover:bg-danger/10"
                onClick={() => removeCookie(c.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
        {cookies.length === 0 && (
          <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-base-500/30 text-xs text-slate-500">
            Belum ada cookie tersimpan.
          </div>
        )}
      </div>
    </div>
  );
}
