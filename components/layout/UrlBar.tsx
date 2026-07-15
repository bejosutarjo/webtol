"use client";

import { Play, Square, X, RotateCw, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { useParser } from "@/hooks/useParser";
import { Select } from "@/components/ui/select";

export function UrlBar() {
  const { url, setUrl, isLoading, settings, updateSettings, setResult, setStatus } =
    useAppStore();
  const { parse, stop } = useParser();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) parse();
  };

  const handleClear = () => {
    setUrl("");
    setResult(null);
    setStatus("idle");
  };

  const handleRefresh = () => {
    if (!isLoading) parse();
  };

  return (
    <div className="glass flex shrink-0 flex-col gap-2 border-b border-base-500/30 px-4 py-2.5 sm:flex-row sm:items-center">
      <div className="flex shrink-0 items-center">
        <Select
          value={settings.method}
          onChange={(e) => updateSettings({ method: e.target.value as any })}
          className="w-[95px] font-mono text-xs font-semibold text-accent-300"
        >
          {["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Select>
      </div>

      <div className="relative flex-1">
        <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://example.com"
          className="pl-9 font-mono text-sm"
          spellCheck={false}
        />
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {!isLoading ? (
          <Button onClick={parse} size="sm" className="gap-1.5">
            <Play className="h-3.5 w-3.5" /> Parse
          </Button>
        ) : (
          <Button onClick={stop} size="sm" variant="danger" className="gap-1.5">
            <Square className="h-3.5 w-3.5" /> Stop
          </Button>
        )}
        <Button onClick={handleRefresh} size="sm" variant="secondary" title="Refresh">
          <RotateCw className="h-3.5 w-3.5" />
        </Button>
        <Button onClick={handleClear} size="sm" variant="outline" title="Clear">
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
